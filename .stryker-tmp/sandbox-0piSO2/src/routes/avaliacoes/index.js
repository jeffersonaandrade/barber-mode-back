/**
 * Rotas de Avaliações - Arquivo Principal
 * 
 * Este arquivo registra todas as rotas relacionadas às avaliações,
 * organizadas em submódulos para facilitar manutenção e legibilidade.
 */
// @ts-nocheck


const enviarAvaliacao = require('./enviar');
const listarAvaliacoes = require('./listar');

async function avaliacaoRoutes(fastify, options) {
  // Registrar submódulos
  await fastify.register(enviarAvaliacao);
  await fastify.register(listarAvaliacoes);
}

module.exports = avaliacaoRoutes; 