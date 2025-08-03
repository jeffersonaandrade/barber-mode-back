// @ts-nocheck
const fastify = require('fastify')({ logger: true });
require('dotenv').config();

// Importar plugins básicos
const jwtPlugin = require('./plugins/jwt');
const corsPlugin = require('./plugins/cors');
const helmetPlugin = require('./plugins/helmet');

// Registrar plugins
fastify.register(jwtPlugin);
fastify.register(corsPlugin);
fastify.register(helmetPlugin);

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

// Rota de login simples
fastify.post('/api/auth/login', async (request, reply) => {
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

// Iniciar servidor
const start = async () => {
  try {
    const port = process.env.PORT || 3000;
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 Servidor rodando na porta ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start(); 