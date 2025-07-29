/**
 * Rotas de Avaliações - Arquivo Principal
 * 
 * Este arquivo registra todas as rotas relacionadas às avaliações.
 */

const avaliacoesRoutes = require('../avaliacoes');

async function avaliacaoRoutes(fastify, options) {
  // Registrar rotas de avaliações
  await fastify.register(avaliacoesRoutes);
}

module.exports = avaliacaoRoutes; 