const fastify = require('fastify')({ logger: true });
require('dotenv').config();

// Função para configurar o servidor
async function configureServer() {
  console.log('🔧 Configurando servidor...');
  
  // Rota de health check
  fastify.get('/health', async (request, reply) => {
    return { status: 'OK', timestamp: new Date().toISOString() };
  });

  // Rota raiz
  fastify.get('/', async (request, reply) => {
    return { 
      message: 'Lucas Barbearia API', 
      version: process.env.APP_VERSION || '1.0.0'
    };
  });

  console.log('✅ Rotas básicas configuradas');
}

// Iniciar servidor
const start = async () => {
  try {
    console.log('🚀 Iniciando servidor...');
    await configureServer();
    
    const port = process.env.PORT || 3000;
    await fastify.listen({ port, host: '0.0.0.0' });
    
    console.log(`🚀 Servidor rodando na porta ${port}`);
    console.log(`🏥 Health check em: http://localhost:${port}/health`);
  } catch (err) {
    console.error('❌ Erro ao iniciar servidor:', err);
    process.exit(1);
  }
};

start(); 