/**
 * Middlewares de Autenticação
 * 
 * Este módulo centraliza todos os middlewares relacionados à autenticação
 * de usuários e verificação de tokens JWT.
 */
// @ts-nocheck


const authenticate = require('./authenticate');

module.exports = {
  authenticate,
  
  // Re-exportar para facilitar importação
  authenticate: authenticate
}; 