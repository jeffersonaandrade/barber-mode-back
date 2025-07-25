/**
 * Middlewares de Validação
 * 
 * Este módulo centraliza todos os middlewares relacionados à validação
 * de dados de entrada, parâmetros e requisições.
 */
// @ts-nocheck


const requestValidation = require('./requestValidation');

module.exports = {
  ...requestValidation,
  
  // Re-exportar middlewares específicos para facilitar importação
  validateBarbeariaId: requestValidation.validateBarbeariaId,
  validateFilaEntry: requestValidation.validateFilaEntry,
  validateUserData: requestValidation.validateUserData,
  validateBarbeiroAction: requestValidation.validateBarbeiroAction,
  requireFields: requestValidation.requireFields
}; 