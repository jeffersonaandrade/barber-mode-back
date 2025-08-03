/**
 * Rotas de Usuários - Arquivo Principal
 * 
 * Este arquivo registra todas as rotas relacionadas aos usuários,
 * organizadas em submódulos para facilitar manutenção e legibilidade.
 * 
 * Submódulos:
 * - barbeiros.js: Endpoints relacionados a barbeiros (listar, status)
 * - gerenciamento.js: Ativar/desativar barbeiros
 * - perfil.js: Gerenciar perfil do usuário (listar, atualizar, deletar)
 */

const barbeirosRoutes = require('./barbeiros');
const gerenciamentoRoutes = require('./gerenciamento');
const perfilRoutes = require('./perfil');

/**
 * Registra todas as rotas de usuários
 * @param {Object} fastify - Instância do Fastify
 * @param {Object} options - Opções de configuração
 */
async function usersRoutes(fastify, options) {
  // Registrar submódulos
  await fastify.register(barbeirosRoutes);
  await fastify.register(gerenciamentoRoutes);
  await fastify.register(perfilRoutes);
}

module.exports = usersRoutes; 