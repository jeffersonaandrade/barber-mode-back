const fp = require('fastify-plugin');

async function swaggerPlugin(fastify, options) {
  await fastify.register(require('@fastify/swagger'), {
    swagger: {
      info: {
        title: 'Lucas Barbearia API',
        description: 'API para gerenciamento de filas de barbearias',
        version: '1.0.0'
      },
      host: 'localhost:3000',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        { name: 'auth', description: 'Autenticação' },
        { name: 'users', description: 'Usuários' },
        { name: 'barbearias', description: 'Barbearias' },
        { name: 'fila', description: 'Sistema de Fila' },
        { name: 'avaliacoes', description: 'Avaliações' },
        { name: 'historico', description: 'Histórico' }
      ],
      securityDefinitions: {
        Bearer: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header'
        }
      }
    }
  });

  await fastify.register(require('@fastify/swagger-ui'), {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next();
      },
      preHandler: function (request, reply, next) {
        next();
      }
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => {
      return swaggerObject;
    },
    transformSpecificationClone: true
  });
}

module.exports = fp(swaggerPlugin); 