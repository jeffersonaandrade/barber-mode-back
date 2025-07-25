/**
 * Middlewares de Controle de Acesso
 * 
 * Este módulo centraliza todos os middlewares relacionados ao controle de acesso,
 * incluindo verificação de roles, acesso a barbearias e propriedade de recursos.
 */
// @ts-nocheck


const rolePermissions = require('./rolePermissions');
const barbeariaAccess = require('./barbeariaAccess');

module.exports = {
  // Middlewares de verificação de roles
  ...rolePermissions,
  
  // Middlewares de acesso a barbearias
  ...barbeariaAccess,
  
  // Re-exportar middlewares específicos para facilitar importação
  checkAdminRole: rolePermissions.checkAdminRole,
  checkGerenteRole: rolePermissions.checkGerenteRole,
  checkBarbeiroRole: rolePermissions.checkBarbeiroRole,
  checkAdminOrGerenteRole: rolePermissions.checkAdminOrGerenteRole,
  
  // Middlewares de acesso a barbearias
  checkBarbeariaAccess: barbeariaAccess.checkBarbeariaAccess,
  checkBarbeariaOwnership: barbeariaAccess.checkBarbeariaOwnership,
  checkBarbeiroBarbeariaAccess: barbeariaAccess.checkBarbeiroBarbeariaAccess
}; 