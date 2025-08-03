// @ts-nocheck
const { supabase } = require('../config/database');

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} role
 * @property {string} email
 * @property {string} nome
 */

/**
 * Helper utilitário para verificar roles
 * @param {User} user - Usuário autenticado
 * @param {string|string[]} roles - Role(s) permitido(s)
 * @returns {boolean}
 */
function hasRole(user, roles) {
  if (!user?.role) return false;
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  return allowedRoles.includes(user.role);
}

/**
 * Verifica se o usuário é gerente de uma barbearia específica
 * @param {string} userId - ID do usuário
 * @param {number} barbeariaId - ID da barbearia
 * @returns {Promise<boolean>}
 */
async function isGerenteDaBarbearia(userId, barbeariaId) {
  try {
    const { data, error } = await supabase
      .from('barbearias')
      .select('gerente_id')
      .eq('id', barbeariaId)
      .single();

    if (error || !data) return false;
    return data.gerente_id === userId;
  } catch (error) {
    console.error('Erro ao verificar se usuário é gerente da barbearia:', error);
    return false;
  }
}

/**
 * Verifica se o barbeiro trabalha em uma barbearia específica
 * @param {string} userId - ID do usuário
 * @param {number} barbeariaId - ID da barbearia
 * @returns {Promise<{ativo: boolean, disponivel: boolean}|null>}
 */
async function isBarbeiroDaBarbearia(userId, barbeariaId) {
  try {
    const { data, error } = await supabase
      .from('barbeiros_barbearias')
      .select('ativo, disponivel')
      .eq('user_id', userId)
      .eq('barbearia_id', barbeariaId)
      .single();

    if (error || !data) return null;
    return data;
  } catch (error) {
    console.error('Erro ao verificar se barbeiro trabalha na barbearia:', error);
    return null;
  }
}

/**
 * Resposta padronizada de erro de acesso
 * @param {string} errorCode - Código do erro
 * @param {string} message - Mensagem para o usuário
 * @returns {Object}
 */
function createAccessError(errorCode, message) {
  return {
    success: false,
    errorCode,
    message,
    timestamp: new Date().toISOString()
  };
}

/**
 * Middleware para verificar se o usuário é barbeiro
 * @param {import('fastify').FastifyRequest & { user: User }} request
 * @param {import('fastify').FastifyReply} reply
 */
async function checkBarbeiroRole(request, reply) {
  if (!hasRole(request.user, 'barbeiro')) {
    return reply.status(403).send(
      createAccessError('ACCESS_DENIED', 'Apenas barbeiros podem acessar este recurso')
    );
  }
}

/**
 * Middleware para verificar se o usuário é gerente
 * @param {import('fastify').FastifyRequest & { user: User }} request
 * @param {import('fastify').FastifyReply} reply
 */
async function checkGerenteRole(request, reply) {
  if (!hasRole(request.user, 'gerente')) {
    return reply.status(403).send(
      createAccessError('ACCESS_DENIED', 'Apenas gerentes podem acessar este recurso')
    );
  }
}

/**
 * Middleware para verificar se o usuário é admin
 * @param {import('fastify').FastifyRequest & { user: User }} request
 * @param {import('fastify').FastifyReply} reply
 */
async function checkAdminRole(request, reply) {
  if (!hasRole(request.user, 'admin')) {
    return reply.status(403).send(
      createAccessError('ACCESS_DENIED', 'Apenas administradores podem acessar este recurso')
    );
  }
}

/**
 * Middleware para verificar se o usuário é admin ou gerente
 * @param {import('fastify').FastifyRequest & { user: User }} request
 * @param {import('fastify').FastifyReply} reply
 */
async function checkAdminOrGerenteRole(request, reply) {
  if (!hasRole(request.user, ['admin', 'gerente'])) {
    return reply.status(403).send(
      createAccessError('ACCESS_DENIED', 'Apenas administradores e gerentes podem acessar este recurso')
    );
  }
}

/**
 * Middleware para verificar se o gerente tem acesso à barbearia específica
 * @param {import('fastify').FastifyRequest & { user: User }} request
 * @param {import('fastify').FastifyReply} reply
 */
async function checkGerenteBarbeariaAccess(request, reply) {
  const { barbearia_id } = request.params;
  const userId = request.user?.id;
  const userRole = request.user?.role;

  try {
    // Admin pode acessar qualquer barbearia
    if (userRole === 'admin') {
      return;
    }

    // Gerente só pode acessar sua própria barbearia
    if (userRole === 'gerente') {
      const isGerente = await isGerenteDaBarbearia(userId, barbearia_id);
      
      if (!isGerente) {
        return reply.status(403).send(
          createAccessError('BARBEARIA_ACCESS_DENIED', 'Você só pode gerenciar sua própria barbearia')
        );
      }
    }
  } catch (error) {
    console.error('Erro em checkGerenteBarbeariaAccess:', error);
    return reply.status(500).send(
      createAccessError('INTERNAL_ERROR', 'Erro ao verificar acesso à barbearia')
    );
  }
}

/**
 * Middleware para verificar se o barbeiro trabalha na barbearia
 * @param {import('fastify').FastifyRequest & { user: User }} request
 * @param {import('fastify').FastifyReply} reply
 */
async function checkBarbeiroBarbeariaAccess(request, reply) {
  const { barbearia_id } = request.params;
  const userId = request.user?.id;
  const userRole = request.user?.role;

  try {
    // Admin pode acessar qualquer barbearia
    if (userRole === 'admin') {
      return;
    }

    // Barbeiro só pode acessar barbearias onde trabalha
    if (userRole === 'barbeiro') {
      const barbeiroInfo = await isBarbeiroDaBarbearia(userId, barbearia_id);
      
      if (!barbeiroInfo) {
        return reply.status(403).send(
          createAccessError('BARBEARIA_ACCESS_DENIED', 'Você não trabalha nesta barbearia')
        );
      }

      if (!barbeiroInfo.ativo) {
        return reply.status(403).send(
          createAccessError('BARBEIRO_INACTIVE', 'Você não está ativo nesta barbearia')
        );
      }

      // Adicionar informações do barbeiro ao request
      request.barbeiroInfo = barbeiroInfo;
    }
  } catch (error) {
    console.error('Erro em checkBarbeiroBarbeariaAccess:', error);
    return reply.status(500).send(
      createAccessError('INTERNAL_ERROR', 'Erro ao verificar acesso do barbeiro')
    );
  }
}

/**
 * Middleware genérico para verificar múltiplas roles
 * @param {string|string[]} allowedRoles - Roles permitidos
 * @returns {Function} Middleware function
 */
function requireRoles(allowedRoles) {
  return async function(request, reply) {
    if (!hasRole(request.user, allowedRoles)) {
      const rolesText = Array.isArray(allowedRoles) ? allowedRoles.join(' ou ') : allowedRoles;
      return reply.status(403).send(
        createAccessError('ACCESS_DENIED', `Apenas ${rolesText} podem acessar este recurso`)
      );
    }
  };
}

/**
 * Middleware para verificar acesso à barbearia baseado no role
 * @param {string|string[]} allowedRoles - Roles permitidos
 * @returns {Function} Middleware function
 */
function requireBarbeariaAccess(allowedRoles) {
  return async function(request, reply) {
    const { barbearia_id } = request.params;
    const userId = request.user?.id;
    const userRole = request.user?.role;

    try {
      // Admin pode acessar qualquer barbearia
      if (userRole === 'admin') {
        return;
      }

      // Verificar se o role está permitido
      if (!hasRole(request.user, allowedRoles)) {
        const rolesText = Array.isArray(allowedRoles) ? allowedRoles.join(' ou ') : allowedRoles;
        return reply.status(403).send(
          createAccessError('ACCESS_DENIED', `Apenas ${rolesText} podem acessar este recurso`)
        );
      }

      // Verificar acesso específico baseado no role
      if (userRole === 'gerente') {
        const isGerente = await isGerenteDaBarbearia(userId, barbearia_id);
        if (!isGerente) {
          return reply.status(403).send(
            createAccessError('BARBEARIA_ACCESS_DENIED', 'Você só pode acessar sua própria barbearia')
          );
        }
      } else if (userRole === 'barbeiro') {
        const barbeiroInfo = await isBarbeiroDaBarbearia(userId, barbearia_id);
        if (!barbeiroInfo || !barbeiroInfo.ativo) {
          return reply.status(403).send(
            createAccessError('BARBEARIA_ACCESS_DENIED', 'Você não trabalha nesta barbearia ou não está ativo')
          );
        }
        request.barbeiroInfo = barbeiroInfo;
      }
    } catch (error) {
      console.error('Erro em requireBarbeariaAccess:', error);
      return reply.status(500).send(
        createAccessError('INTERNAL_ERROR', 'Erro ao verificar acesso à barbearia')
      );
    }
  };
}

module.exports = {
  // Funções utilitárias
  hasRole,
  isGerenteDaBarbearia,
  isBarbeiroDaBarbearia,
  createAccessError,
  
  // Middlewares específicos
  checkBarbeiroRole,
  checkGerenteRole,
  checkAdminRole,
  checkAdminOrGerenteRole,
  checkGerenteBarbeariaAccess,
  checkBarbeiroBarbeariaAccess,
  
  // Middlewares genéricos
  requireRoles,
  requireBarbeariaAccess
}; 