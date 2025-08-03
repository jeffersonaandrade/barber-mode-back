/**
 * Middlewares de Validação de Requisições
 * 
 * Este módulo contém middlewares para validar dados de entrada
 * antes de processar as requisições.
 */

/**
 * Middleware para validar se barbearia_id está presente nos parâmetros
 * @param {Object} request - Request do Fastify
 * @param {Object} reply - Reply do Fastify
 */
function validateBarbeariaId(request, reply) {
  const { barbearia_id } = request.params;
  
  if (!barbearia_id) {
    return reply.status(400).send({
      success: false,
      error: 'Parâmetro obrigatório',
      message: 'barbearia_id é obrigatório'
    });
  }
  
  // Validar se é um número válido
  const barbeariaId = parseInt(barbearia_id);
  if (isNaN(barbeariaId) || barbeariaId <= 0) {
    return reply.status(400).send({
      success: false,
      error: 'Parâmetro inválido',
      message: 'barbearia_id deve ser um número positivo'
    });
  }
}

/**
 * Middleware para validar dados de entrada na fila
 * @param {Object} request - Request do Fastify
 * @param {Object} reply - Reply do Fastify
 */
function validateFilaEntry(request, reply) {
  const { nome, telefone, barbearia_id } = request.body;
  
  if (!nome || !telefone || !barbearia_id) {
    return reply.status(400).send({
      success: false,
      error: 'Dados obrigatórios',
      message: 'nome, telefone e barbearia_id são obrigatórios'
    });
  }
  
  // Validar nome
  if (typeof nome !== 'string' || nome.trim().length < 2) {
    return reply.status(400).send({
      success: false,
      error: 'Nome inválido',
      message: 'Nome deve ter pelo menos 2 caracteres'
    });
  }
  
  // Validar telefone (formato básico)
  const telefoneLimpo = telefone.replace(/\D/g, '');
  if (telefoneLimpo.length < 10) {
    return reply.status(400).send({
      success: false,
      error: 'Telefone inválido',
      message: 'Telefone deve ter pelo menos 10 dígitos'
    });
  }
  
  // Validar barbearia_id
  const barbeariaId = parseInt(barbearia_id);
  if (isNaN(barbeariaId) || barbeariaId <= 0) {
    return reply.status(400).send({
      success: false,
      error: 'Barbearia inválida',
      message: 'barbearia_id deve ser um número positivo'
    });
  }
}

/**
 * Middleware para validar dados de usuário
 * @param {Object} request - Request do Fastify
 * @param {Object} reply - Reply do Fastify
 */
function validateUserData(request, reply) {
  const { nome, email, role } = request.body;
  
  if (nome !== undefined) {
    if (typeof nome !== 'string' || nome.trim().length < 2) {
      return reply.status(400).send({
        success: false,
        error: 'Nome inválido',
        message: 'Nome deve ter pelo menos 2 caracteres'
      });
    }
  }
  
  if (email !== undefined) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return reply.status(400).send({
        success: false,
        error: 'Email inválido',
        message: 'Email deve ter um formato válido'
      });
    }
  }
  
  if (role !== undefined) {
    const rolesValidos = ['admin', 'gerente', 'barbeiro'];
    if (!rolesValidos.includes(role)) {
      return reply.status(400).send({
        success: false,
        error: 'Role inválido',
        message: `Role deve ser um dos seguintes: ${rolesValidos.join(', ')}`
      });
    }
  }
}

/**
 * Middleware para validar dados de ativação/desativação de barbeiro
 * @param {Object} request - Request do Fastify
 * @param {Object} reply - Reply do Fastify
 */
function validateBarbeiroAction(request, reply) {
  const { user_id, barbearia_id } = request.body;
  
  if (!user_id || !barbearia_id) {
    return reply.status(400).send({
      success: false,
      error: 'Dados obrigatórios',
      message: 'user_id e barbearia_id são obrigatórios'
    });
  }
  
  // Validar user_id (UUID)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(user_id)) {
    return reply.status(400).send({
      success: false,
      error: 'User ID inválido',
      message: 'user_id deve ser um UUID válido'
    });
  }
  
  // Validar barbearia_id
  const barbeariaId = parseInt(barbearia_id);
  if (isNaN(barbeariaId) || barbeariaId <= 0) {
    return reply.status(400).send({
      success: false,
      error: 'Barbearia inválida',
      message: 'barbearia_id deve ser um número positivo'
    });
  }
}

/**
 * Factory function para criar middleware de validação de campos obrigatórios
 * @param {string[]} requiredFields - Campos obrigatórios
 * @returns {Function} Middleware function
 */
function requireFields(requiredFields) {
  return function(request, reply) {
    const missingFields = requiredFields.filter(field => {
      const value = request.body[field];
      return value === undefined || value === null || value === '';
    });
    
    if (missingFields.length > 0) {
      return reply.status(400).send({
        success: false,
        error: 'Campos obrigatórios',
        message: `Os seguintes campos são obrigatórios: ${missingFields.join(', ')}`
      });
    }
  };
}

module.exports = {
  validateBarbeariaId,
  validateFilaEntry,
  validateUserData,
  validateBarbeiroAction,
  requireFields
}; 