// @ts-nocheck
const fastify = require('fastify')({ logger: true });
require('dotenv').config();

// Rota de teste simples
fastify.get('/', async (request, reply) => {
  return { message: 'Servidor funcionando!' };
});

// Rota de health check
fastify.get('/health', async (request, reply) => {
  return { status: 'OK', timestamp: new Date().toISOString() };
});

// Iniciar servidor
const start = async () => {
  try {
    const port = process.env.PORT || 3000;
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 Servidor de teste rodando na porta ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start(); 