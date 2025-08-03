// @ts-nocheck
const { supabase } = require('../../config/database');

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
      createAccessError('ACCESS_DENIED', 'Apenas administradores ou gerentes podem acessar este recurso')
    );
  }
}

/**
 * Middleware para verificar acesso de gerente a uma barbearia específica
 * @param {import('fastify').FastifyRequest & { user: User }} request
 * @param {import('fastify').FastifyReply} reply
 */
async function checkGerenteBarbeariaAccess(request, reply) {
  const { barbearia_id } = request.params;
  const userId = request.user?.id;

  if (!barbearia_id) {
    return reply.status(400).send(
      createAccessError('MISSING_PARAMETER', 'ID da barbearia é obrigatório')
    );
  }

  if (!userId) {
    return reply.status(401).send(
      createAccessError('UNAUTHORIZED', 'Usuário não autenticado')
    );
  }

  // Admin tem acesso total
  if (hasRole(request.user, 'admin')) {
    return;
  }

  // Gerente precisa ser gerente da barbearia específica
  if (hasRole(request.user, 'gerente')) {
    const isGerente = await isGerenteDaBarbearia(userId, barbearia_id);
    if (!isGerente) {
      return reply.status(403).send(
        createAccessError('ACCESS_DENIED', 'Você não é gerente desta barbearia')
      );
    }
    return;
  }

  return reply.status(403).send(
    createAccessError('ACCESS_DENIED', 'Acesso negado para este recurso')
  );
}

/**
 * Middleware para verificar acesso de barbeiro a uma barbearia específica
 * @param {import('fastify').FastifyRequest & { user: User }} request
 * @param {import('fastify').FastifyReply} reply
 */
async function checkBarbeiroBarbeariaAccess(request, reply) {
  const { barbearia_id } = request.params;
  const userId = request.user?.id;

  if (!barbearia_id) {
    return reply.status(400).send(
      createAccessError('MISSING_PARAMETER', 'ID da barbearia é obrigatório')
    );
  }

  if (!userId) {
    return reply.status(401).send(
      createAccessError('UNAUTHORIZED', 'Usuário não autenticado')
    );
  }

  // Admin tem acesso total
  if (hasRole(request.user, 'admin')) {
    return;
  }

  // Gerente tem acesso total
  if (hasRole(request.user, 'gerente')) {
    return;
  }

  // Barbeiro precisa trabalhar na barbearia
  if (hasRole(request.user, 'barbeiro')) {
    const barbeiroInfo = await isBarbeiroDaBarbearia(userId, barbearia_id);
    if (!barbeiroInfo) {
      return reply.status(403).send(
        createAccessError('ACCESS_DENIED', 'Você não trabalha nesta barbearia')
      );
    }

    if (!barbeiroInfo.ativo) {
      return reply.status(403).send(
        createAccessError('ACCESS_DENIED', 'Você não está ativo nesta barbearia')
      );
    }

    return;
  }

  return reply.status(403).send(
    createAccessError('ACCESS_DENIED', 'Acesso negado para este recurso')
  );
}

/**
 * Factory function para criar middleware que verifica roles específicos
 * @param {string|string[]} allowedRoles - Role(s) permitido(s)
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
 * Factory function para criar middleware que verifica acesso a barbearia
 * @param {string|string[]} allowedRoles - Role(s) permitido(s)
 * @returns {Function} Middleware function
 */
function requireBarbeariaAccess(allowedRoles) {
  return async function(request, reply) {
    const { barbearia_id } = request.params;
    const userId = request.user?.id;

    if (!barbearia_id) {
      return reply.status(400).send(
        createAccessError('MISSING_PARAMETER', 'ID da barbearia é obrigatório')
      );
    }

    if (!userId) {
      return reply.status(401).send(
        createAccessError('UNAUTHORIZED', 'Usuário não autenticado')
      );
    }

    // Verificar se o usuário tem um dos roles permitidos
    if (!hasRole(request.user, allowedRoles)) {
      const rolesText = Array.isArray(allowedRoles) ? allowedRoles.join(' ou ') : allowedRoles;
      return reply.status(403).send(
        createAccessError('ACCESS_DENIED', `Apenas ${rolesText} podem acessar este recurso`)
      );
    }

    // Admin tem acesso total
    if (hasRole(request.user, 'admin')) {
      return;
    }

    // Gerente precisa ser gerente da barbearia
    if (hasRole(request.user, 'gerente')) {
      const isGerente = await isGerenteDaBarbearia(userId, barbearia_id);
      if (!isGerente) {
        return reply.status(403).send(
          createAccessError('ACCESS_DENIED', 'Você não é gerente desta barbearia')
        );
      }
      return;
    }

    // Barbeiro precisa trabalhar na barbearia
    if (hasRole(request.user, 'barbeiro')) {
      const barbeiroInfo = await isBarbeiroDaBarbearia(userId, barbearia_id);
      if (!barbeiroInfo || !barbeiroInfo.ativo) {
        return reply.status(403).send(
          createAccessError('ACCESS_DENIED', 'Você não trabalha nesta barbearia ou não está ativo')
        );
      }
      return;
    }
  };
}

module.exports = {
  hasRole,
  isGerenteDaBarbearia,
  isBarbeiroDaBarbearia,
  createAccessError,
  checkBarbeiroRole,
  checkGerenteRole,
  checkAdminRole,
  checkAdminOrGerenteRole,
  checkGerenteBarbeariaAccess,
  checkBarbeiroBarbeariaAccess,
  requireRoles,
  requireBarbeariaAccess
}; 