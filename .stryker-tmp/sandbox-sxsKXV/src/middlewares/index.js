/**
 * Middlewares - Módulo Principal
 * 
 * Este módulo centraliza todos os middlewares organizados por categoria:
 * - auth: Autenticação e verificação de tokens
 * - access: Controle de acesso e permissões
 * - validation: Validação de dados de entrada
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
const auth = require('./auth');
const access = require('./access');
const validation = require('./validation');
module.exports = stryMutAct_9fa48("554") ? {} : (stryCov_9fa48("554"), {
  // Middlewares de autenticação
  authenticate: auth.authenticate,
  // Middlewares de controle de acesso
  checkAdminRole: access.checkAdminRole,
  checkGerenteRole: access.checkGerenteRole,
  checkBarbeiroRole: access.checkBarbeiroRole,
  checkAdminOrGerenteRole: access.checkAdminOrGerenteRole,
  checkBarbeariaAccess: access.checkBarbeariaAccess,
  checkBarbeariaOwnership: access.checkBarbeariaOwnership,
  checkBarbeiroBarbeariaAccess: access.checkBarbeiroBarbeariaAccess,
  // Middlewares de validação
  validateBarbeariaId: validation.validateBarbeariaId,
  validateFilaEntry: validation.validateFilaEntry,
  validateUserData: validation.validateUserData,
  validateBarbeiroAction: validation.validateBarbeiroAction,
  requireFields: validation.requireFields,
  // Exportar módulos completos
  auth,
  access,
  validation
});