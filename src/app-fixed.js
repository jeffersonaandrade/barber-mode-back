const fastify = require('fastify')({ logger: true });
require('dotenv').config();

// Importar plugins
const jwtPlugin = require('./plugins/jwt');
const corsPlugin = require('./plugins/cors');
const helmetPlugin = require('./plugins/helmet');
const swaggerPlugin = require('./plugins/swagger');
const supabasePlugin = require('./plugins/supabase');

// Função para configurar o servidor
async function configureServer() {
  console.log('🔧 Configurando servidor...');
  
  try {
    // Registrar plugins básicos
    console.log('📦 Registrando plugins...');
    await fastify.register(supabasePlugin);
    await fastify.register(jwtPlugin);
    await fastify.register(corsPlugin);
    await fastify.register(helmetPlugin);
    console.log('✅ Plugins registrados');

    // Registrar rotas básicas primeiro
    console.log('🛣️ Registrando rotas básicas...');
    
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

    // Rota de login simples
    fastify.post('/api/auth/login', {
      schema: {
        description: 'Login de usuário',
        tags: ['auth'],
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 }
          }
        }
      }
    }, async (request, reply) => {
      try {
        const { email, password } = request.body;
        
        if (!email || !password) {
          return reply.status(400).send({
            success: false,
            error: 'Email e senha são obrigatórios'
          });
        }

        // Simular login bem-sucedido
        return reply.send({
          success: true,
          message: 'Login realizado com sucesso',
          data: {
            user: {
              id: 'test-id',
              email: email,
              nome: 'Usuário Teste',
              role: 'admin'
            },
            token: 'test-token-123'
          }
        });
      } catch (error) {
        return reply.status(400).send({
          success: false,
          error: error.message
        });
      }
    });

    console.log('✅ Rotas básicas registradas');

    // Tentar registrar rotas adicionais
    try {
      console.log('🛣️ Registrando rotas adicionais...');
      
      // Registrar rotas de barbearias
      const barbeariaRoutes = require('./routes/barbearias/index');
      await fastify.register(barbeariaRoutes, { prefix: '/api/barbearias' });
      console.log('✅ Rotas de barbearias registradas');
      
      // Registrar rotas de fila
      const filaRoutes = require('./routes/fila/index');
      await fastify.register(filaRoutes, { prefix: '/api' });
      console.log('✅ Rotas de fila registradas');
      
      // Registrar rotas de usuários
      const usersRoutes = require('./routes/users/index');
      await fastify.register(usersRoutes, { prefix: '/api/users' });
      console.log('✅ Rotas de usuários registradas');
      
      // Registrar rotas de avaliações
      const avaliacoesRoutes = require('./routes/avaliacoes/index');
      await fastify.register(avaliacoesRoutes, { prefix: '/api/avaliacoes' });
      console.log('✅ Rotas de avaliações registradas');
      
      // Registrar rotas de histórico
      const historicoRoutes = require('./routes/historico');
      await fastify.register(historicoRoutes, { prefix: '/api' });
      console.log('✅ Rotas de histórico registradas');
      
      // Registrar rotas de relatórios
      const relatorioRoutes = require('./routes/relatorios');
      await fastify.register(relatorioRoutes, { prefix: '/api' });
      console.log('✅ Rotas de relatórios registradas');
      
      // Registrar rotas de configurações
      const configuracoesRoutes = require('./routes/configuracoes');
      await fastify.register(configuracoesRoutes, { prefix: '/api/configuracoes' });
      console.log('✅ Rotas de configurações registradas');
      
    } catch (error) {
      console.warn('⚠️ Erro ao registrar algumas rotas:', error.message);
      console.log('ℹ️ Servidor iniciará com rotas básicas apenas');
    }

    // Registrar Swagger por último
    try {
      await fastify.register(swaggerPlugin);
      console.log('✅ Swagger registrado');
    } catch (error) {
      console.warn('⚠️ Erro ao registrar Swagger:', error.message);
    }

  } catch (error) {
    console.error('❌ Erro na configuração do servidor:', error);
    throw error;
  }
}

// Iniciar servidor
const start = async () => {
  try {
    console.log('🚀 Iniciando servidor...');
    await configureServer();
    
    const port = process.env.PORT || 3000;
    await fastify.listen({ port, host: '0.0.0.0' });
    
    console.log(`🚀 Servidor rodando na porta ${port}`);
    console.log(`📚 Documentação disponível em: http://localhost:${port}/documentation`);
    console.log(`🏥 Health check em: http://localhost:${port}/health`);
  } catch (err) {
    console.error('❌ Erro ao iniciar servidor:', err);
    process.exit(1);
  }
};

start(); 