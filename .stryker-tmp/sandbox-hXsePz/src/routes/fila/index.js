/**
 * Rotas de Fila - Arquivo Principal
 * 
 * Este arquivo registra todas as rotas relacionadas à fila de clientes,
 * organizadas em submódulos para facilitar manutenção e legibilidade.
 * 
 * Submódulos:
 * - entrar.js: Cliente entra na fila
 * - visualizar.js: Visualizar fila (privado, público, gerente)
 * - gerenciar.js: Gerenciar fila (próximo, iniciar, remover, finalizar)
 * - status.js: Verificar status do cliente
 */
// @ts-nocheck


const entrarNaFila = require('./entrar');
const visualizarFila = require('./visualizar');
const gerenciarFila = require('./gerenciar');
const verificarStatus = require('./status');

/**
 * Registra todas as rotas de fila
 * @param {Object} fastify - Instância do Fastify
 * @param {Object} options - Opções de configuração
 */
async function filaRoutes(fastify, options) {
  // Registrar submódulos
  await fastify.register(entrarNaFila);
  await fastify.register(visualizarFila);
  await fastify.register(gerenciarFila);
  await fastify.register(verificarStatus);
}

module.exports = filaRoutes; 