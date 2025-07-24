const fp = require('fastify-plugin');

async function jwtPlugin(fastify, options) {
  await fastify.register(require('@fastify/jwt'), {
    secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
    sign: {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    }
  });

  // Decorator para autenticação
  fastify.decorate('authenticate', async function(request, reply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      return reply.status(401).send({
        success: false,
        error: 'Token inválido ou expirado'
      });
    }
  });

  // Decorator para verificar roles
  fastify.decorate('authorize', function(roles = []) {
    return async function(request, reply) {
      try {
        await request.jwtVerify();
        
        if (roles.length > 0 && !roles.includes(request.user.role)) {
          return reply.status(403).send({
            success: false,
            error: 'Acesso negado',
            message: 'Você não tem permissão para acessar este recurso'
          });
        }
      } catch (err) {
        return reply.status(401).send({
          success: false,
          error: 'Token inválido ou expirado'
        });
      }
    };
  });
}

module.exports = fp(jwtPlugin); 