/**
 * Rotas de Barbearias - Arquivo Principal
 * 
 * Este arquivo registra todas as rotas relacionadas às barbearias,
 * organizadas em submódulos para facilitar manutenção e legibilidade.
 */

const listarBarbearias = require('./listar');
const gerenciarBarbearias = require('./gerenciar');
const filaBarbearia = require('./fila');

async function barbeariaRoutes(fastify, options) {
  // Registrar submódulos
  await fastify.register(listarBarbearias);
  await fastify.register(gerenciarBarbearias);
  await fastify.register(filaBarbearia);
}

module.exports = barbeariaRoutes; 