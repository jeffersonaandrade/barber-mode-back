const fastify = require('fastify')({ logger: true });
require('dotenv').config();

// Importar plugins
const jwtPlugin = require('./plugins/jwt');
const corsPlugin = require('./plugins/cors');
const helmetPlugin = require('./plugins/helmet');
const swaggerPlugin = require('./plugins/swagger');
const supabasePlugin = require('./plugins/supabase');

// Importar controllers
const AuthController = require('./controllers/authController');

// Importar rotas
const barbeariaRoutes = require('./routes/barbearias/index');
const filaRoutes = require('./routes/fila/index');
const avaliacoesRoutes = require('./routes/avaliacoes/index');
const usersRoutes = require('./routes/users/index');
const historicoRoutes = require('./routes/historico');


// Função para configurar o servidor
async function configureServer() {
  // Registrar plugins básicos
  await fastify.register(supabasePlugin);
  await fastify.register(jwtPlugin);
  await fastify.register(corsPlugin);
  await fastify.register(helmetPlugin);

  // Instanciar controllers
  const authController = new AuthController(fastify);

  // Registrar rotas
  await fastify.register(barbeariaRoutes, { prefix: '/api/barbearias' });
  await fastify.register(filaRoutes, { prefix: '/api' });
  await fastify.register(avaliacoesRoutes, { prefix: '/api/avaliacoes' });
  await fastify.register(usersRoutes, { prefix: '/api/users' });
  await fastify.register(historicoRoutes, { prefix: '/api' });

  // Rotas de debug removidas para produção

// Rota de health check
fastify.get('/health', {
  schema: {
    description: 'Health check da API',
    tags: ['health'],
    response: {
      200: {
        description: 'Servidor funcionando',
        type: 'object',
        properties: {
          status: { type: 'string' },
          timestamp: { type: 'string' }
        }
      }
    }
  }
}, async (request, reply) => {
  return { status: 'OK', timestamp: new Date().toISOString() };
});

// Rota raiz
fastify.get('/', {
  schema: {
    description: 'Informações da API',
    tags: ['info'],
    response: {
      200: {
        description: 'Informações da API',
        type: 'object',
        properties: {
          message: { type: 'string' },
          version: { type: 'string' }
        }
      }
    }
  }
}, async (request, reply) => {
  return { 
    message: 'Lucas Barbearia API', 
    version: process.env.APP_VERSION || '1.0.0'
  };
});

// Rotas de autenticação
fastify.post('/api/auth/login', {
  schema: {
    description: 'Login de usuário',
    tags: ['auth'],
    body: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 6 }
      }
    },
    response: {
      200: {
        description: 'Login bem-sucedido',
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          data: {
            type: 'object',
            properties: {
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  email: { type: 'string' },
                  nome: { type: 'string' },
                  role: { type: 'string' }
                }
              },
              token: { type: 'string' }
            }
          }
        }
      },
      400: {
        description: 'Erro de validação',
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          error: { type: 'string' }
        }
      }
    }
  }
}, async (request, reply) => {
  try {
    const { email, password } = request.body;
    const result = await authController.login(email, password);
    return reply.send(result);
  } catch (error) {
    return reply.status(400).send({
      success: false,
      error: error.message
    });
  }
});

fastify.post('/api/auth/register', {
  schema: {
    description: 'Registro de novo usuário',
    tags: ['auth'],
    body: {
      type: 'object',
      required: ['email', 'password', 'nome', 'role'],
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 6 },
        nome: { type: 'string', minLength: 2 },
        telefone: { type: 'string' },
        role: { type: 'string', enum: ['admin', 'gerente', 'barbeiro'] }
      }
    },
    response: {
      200: {
        description: 'Usuário criado com sucesso',
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          data: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              email: { type: 'string' },
              nome: { type: 'string' },
              role: { type: 'string' },
              telefone: { type: 'string' },
              active: { type: 'boolean' },
              created_at: { type: 'string' },
              updated_at: { type: 'string' }
            }
          }
        }
      },
      400: {
        description: 'Erro de validação',
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          error: { type: 'string' }
        }
      }
    }
  }
}, async (request, reply) => {
  try {
    const userData = request.body;
    const result = await authController.register(userData);
    return reply.send(result);
  } catch (error) {
    return reply.status(400).send({
      success: false,
      error: error.message
    });
  }
});

fastify.get('/api/auth/me', {
  preValidation: [fastify.authenticate],
  schema: {
    description: 'Obter dados do usuário autenticado',
    tags: ['auth'],
    security: [{ Bearer: [] }],
    response: {
      200: {
        description: 'Dados do usuário',
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              email: { type: 'string' },
              nome: { type: 'string' },
              role: { type: 'string' }
            }
          }
        }
      },
      401: {
        description: 'Não autorizado',
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          error: { type: 'string' }
        }
      }
    }
  }
}, async (request, reply) => {
  try {
    const result = await authController.getMe(request.user.id);
    return reply.send(result);
  } catch (error) {
    return reply.status(401).send({
      success: false,
      error: error.message
    });
  }
});

fastify.post('/api/auth/logout', {
  preValidation: [fastify.authenticate],
  schema: {
    description: 'Logout do usuário',
    tags: ['auth'],
    security: [{ Bearer: [] }],
    response: {
      200: {
        description: 'Logout bem-sucedido',
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' }
        }
      }
    }
  }
}, async (request, reply) => {
  return reply.send({
    success: true,
    message: 'Logout realizado com sucesso'
  });
});

  // Registrar Swagger após todas as rotas
  await fastify.register(swaggerPlugin);
}

// Iniciar servidor
const start = async () => {
  try {
    await configureServer();
    
    const port = process.env.PORT || 3001;
    await fastify.listen({ port, host: '0.0.0.0' });
    
    console.log(`🚀 Servidor rodando na porta ${port}`);
    console.log(`📚 Documentação disponível em: http://localhost:${port}/documentation`);
    console.log(`🏥 Health check em: http://localhost:${port}/health`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start(); 