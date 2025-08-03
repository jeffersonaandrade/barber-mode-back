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
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
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
  if (stryMutAct_9fa48("1712")) {
    {}
  } else {
    stryCov_9fa48("1712");
    // Registrar submódulos
    await fastify.register(entrarNaFila);
    await fastify.register(visualizarFila);
    await fastify.register(gerenciarFila);
    await fastify.register(verificarStatus);
  }
}
module.exports = filaRoutes;