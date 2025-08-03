const fp = require('fastify-plugin');
const { JWT_CONFIG } = require('../config/cookies');

async function jwtPlugin(fastify, options) {
  await fastify.register(require('@fastify/jwt'), {
    secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
    sign: {
      expiresIn: JWT_CONFIG.FUNCIONARIO.expiresIn, // 12 horas para funcionários
      algorithm: 'HS256'
    },
    verify: {
      algorithms: ['HS256']
    }
  });

  // Decorator para autenticação via cookies ou header Authorization
  fastify.decorate('authenticate', async function(request, reply) {
    try {
      let token = null;

      // Tentar obter token do header Authorization (Bearer token)
      const authHeader = request.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7); // Remove 'Bearer '
        // console.log('🔍 [AUTH] Token obtido do header Authorization');
      }

      // Se não encontrou no header, tentar obter do cookie
      if (!token) {
        token = fastify.getAuthToken(request);
        if (token) {
          // console.log('🔍 [AUTH] Token obtido do cookie');
        }
      }

      if (!token) {
        return reply.status(401).send({
          success: false,
          error: 'Token de autenticação não encontrado. Faça login novamente.'
        });
      }

      // Verificar token
      const decoded = await fastify.jwt.verify(token);
      request.user = decoded;
              // console.log('🔍 [AUTH] Token verificado com sucesso para usuário:', decoded.email);
      
    } catch (err) {
              // console.error('🔍 [AUTH] Erro na verificação do token:', err.message);
      return reply.status(401).send({
        success: false,
        error: 'Token inválido ou expirado. Faça login novamente.'
      });
    }
  });

  // Decorator para verificar roles via cookies ou header Authorization
  fastify.decorate('authorize', function(roles = []) {
    return async function(request, reply) {
      try {
        let token = null;

        // Tentar obter token do header Authorization (Bearer token)
        const authHeader = request.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
          token = authHeader.substring(7); // Remove 'Bearer '
          // console.log('🔍 [AUTH] Token obtido do header Authorization (authorize)');
        }

        // Se não encontrou no header, tentar obter do cookie
        if (!token) {
          token = fastify.getAuthToken(request);
          if (token) {
            // console.log('🔍 [AUTH] Token obtido do cookie (authorize)');
          }
        }

        if (!token) {
          return reply.status(401).send({
            success: false,
            error: 'Token de autenticação não encontrado. Faça login novamente.'
          });
        }

        // Verificar token
        const decoded = await fastify.jwt.verify(token);
        request.user = decoded;
        
        if (roles.length > 0 && !roles.includes(request.user.role)) {
          return reply.status(403).send({
            success: false,
            error: 'Acesso negado',
            message: 'Você não tem permissão para acessar este recurso'
          });
        }
      } catch (err) {
        // console.error('🔍 [AUTH] Erro na verificação do token (authorize):', err.message);
        return reply.status(401).send({
          success: false,
          error: 'Token inválido ou expirado. Faça login novamente.'
        });
      }
    };
  });

  // Decorator para verificar se usuário está autenticado via cookie
  fastify.decorate('authenticateCookie', async function(request, reply) {
    try {
      const userInfo = fastify.getUserFromCookie(request);
      if (!userInfo) {
        return reply.status(401).send({
          success: false,
          error: 'Usuário não autenticado'
        });
      }
      
      request.user = userInfo;
    } catch (err) {
      return reply.status(401).send({
        success: false,
        error: 'Erro na autenticação via cookie'
      });
    }
  });

  // Decorator para gerar token JWT para clientes (4 horas)
  fastify.decorate('generateClienteToken', function(clienteData) {
    return fastify.jwt.sign(clienteData, { expiresIn: JWT_CONFIG.CLIENTE.expiresIn });
  });

  // Decorator para verificar token de cliente
  fastify.decorate('verifyClienteToken', async function(token) {
    try {
      return await fastify.jwt.verify(token);
    } catch (err) {
      throw new Error('Token de cliente inválido ou expirado');
    }
  });
}

module.exports = fp(jwtPlugin); 