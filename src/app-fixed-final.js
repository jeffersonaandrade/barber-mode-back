const fastify = require('fastify')({ logger: false });
require('dotenv').config();

// Importar plugins
const jwtPlugin = require('./plugins/jwt');
const cookiePlugin = require('./plugins/cookie');
const corsPlugin = require('./plugins/cors');
const helmetPlugin = require('./plugins/helmet');
const supabasePlugin = require('./plugins/supabase');

// Importar controllers
const AuthController = require('./controllers/authController');

// Importar rotas
const authRoutes = require('./routes/auth');
const barbeariaRoutes = require('./routes/barbearias/index');
const filaRoutes = require('./routes/fila/index');
const avaliacoesRoutes = require('./routes/avaliacoes/index');
const usersRoutes = require('./routes/users/index');
const historicoRoutes = require('./routes/historico');
const relatorioRoutes = require('./routes/relatorios');

// Função para configurar o servidor
async function configureServer() {
  console.log('🚀 Iniciando servidor...');
  
  // Registrar plugins básicos
  console.log('📦 Registrando plugins...');
  await fastify.register(supabasePlugin);
  await fastify.register(cookiePlugin);
  await fastify.register(jwtPlugin);
  await fastify.register(corsPlugin);
  await fastify.register(helmetPlugin);
  console.log('✅ Plugins registrados');

  // Instanciar controllers
  const authController = new AuthController(fastify);

  // Registrar rotas
  console.log('🛣️ Registrando rotas...');
  await fastify.register(authRoutes, { prefix: '/api/auth' });
  await fastify.register(barbeariaRoutes, { prefix: '/api/barbearias' });
  await fastify.register(filaRoutes, { prefix: '/api' });
  await fastify.register(avaliacoesRoutes, { prefix: '/api/avaliacoes' });
  await fastify.register(usersRoutes, { prefix: '/api/users' });
  await fastify.register(historicoRoutes, { prefix: '/api' });
  await fastify.register(relatorioRoutes, { prefix: '/api' });
  console.log('✅ Rotas registradas');

  // Rota de health check
  fastify.get('/health', {
    schema: {
      description: 'Health check da API',
      tags: ['health'],
      response: {
        200: {
          description: 'Servidor funcionando',
          type: 'object',
          properties: {
            status: { type: 'string' },
            timestamp: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    return { status: 'OK', timestamp: new Date().toISOString() };
  });

  // Rota raiz
  fastify.get('/', {
    schema: {
      description: 'Informações da API',
      tags: ['info'],
      response: {
        200: {
          description: 'Informações da API',
          type: 'object',
          properties: {
            message: { type: 'string' },
            version: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    return { 
      message: 'Lucas Barbearia API', 
      version: process.env.APP_VERSION || '1.0.0'
    };
  });


}

// Inicializar servidor
const start = async () => {
  try {
    await configureServer();
    
    const port = process.env.PORT || 3001;
    const host = process.env.HOST || '0.0.0.0';
    
    await fastify.listen({ port, host });
    
    console.log('🚀 Servidor rodando na porta', port);
    console.log('📚 API disponível em:', `http://localhost:${port}/`);
    console.log('🔐 Login em: POST http://localhost:${port}/api/auth/login');
    console.log('📋 Fila em: POST http://localhost:${port}/api/fila/entrar');
    
  } catch (err) {
    console.error('❌ Erro ao iniciar servidor:', err);
    process.exit(1);
  }
};

start(); 