/**
 * Middlewares - Módulo Principal
 * 
 * Este módulo centraliza todos os middlewares organizados por categoria:
 * - auth: Autenticação e verificação de tokens
 * - access: Controle de acesso e permissões
 * - validation: Validação de dados de entrada
 */
// @ts-nocheck


const auth = require('./auth');
const access = require('./access');
const validation = require('./validation');

module.exports = {
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
}; 