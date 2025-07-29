const fastify = require('fastify')({ logger: true });
require('dotenv').config();

// Importar plugins
const jwtPlugin = require('./plugins/jwt');
const corsPlugin = require('./plugins/cors');
const helmetPlugin = require('./plugins/helmet');
const supabasePlugin = require('./plugins/supabase');

// Função para configurar o servidor
async function configureServer() {
  console.log('🔧 Configurando servidor...');
  
  try {
    // Registrar plugins básicos
    console.log('📦 Registrando plugins...');
    await fastify.register(supabasePlugin);
    await fastify.register(jwtPlugin);
    await fastify.register(corsPlugin);
    await fastify.register(helmetPlugin);
    console.log('✅ Plugins registrados');

    // Registrar rotas básicas
    console.log('🛣️ Registrando rotas básicas...');
    
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

    // Rota de login simples
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
        }
      }
    }, async (request, reply) => {
      try {
        const { email, password } = request.body;
        
        if (!email || !password) {
          return reply.status(400).send({
            success: false,
            error: 'Email e senha são obrigatórios'
          });
        }

        // Simular login bem-sucedido
        return reply.send({
          success: true,
          message: 'Login realizado com sucesso',
          data: {
            user: {
              id: 'test-id',
              email: email,
              nome: 'Usuário Teste',
              role: 'admin'
            },
            token: 'test-token-123'
          }
        });
      } catch (error) {
        return reply.status(400).send({
          success: false,
          error: error.message
        });
      }
    });

    // Rota de teste da fila
    fastify.post('/api/fila/entrar', {
      schema: {
        description: 'Entrar na fila',
        tags: ['fila'],
        body: {
          type: 'object',
          required: ['nome', 'telefone', 'barbearia_id'],
          properties: {
            nome: { type: 'string', minLength: 2 },
            telefone: { type: 'string' },
            barbearia_id: { type: 'integer', minimum: 1 }
          }
        }
      }
    }, async (request, reply) => {
      try {
        const { nome, telefone, barbearia_id } = request.body;
        
        // Simular entrada na fila
        const token = 'FILA_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
        
        return reply.send({
          success: true,
          message: 'Cliente adicionado à fila com sucesso',
          data: {
            cliente: {
              id: 'cliente-id',
              nome: nome,
              telefone: telefone,
              posicao: 1,
              status: 'aguardando',
              token: token
            },
            qr_code_fila: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
            qr_code_status: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
            posicao: 1
          }
        });
      } catch (error) {
        return reply.status(400).send({
          success: false,
          error: error.message
        });
      }
    });

    // Rota para ver fila
    fastify.get('/api/fila/:barbearia_id', {
      schema: {
        description: 'Ver fila da barbearia',
        tags: ['fila'],
        params: {
          type: 'object',
          required: ['barbearia_id'],
          properties: {
            barbearia_id: { type: 'integer', minimum: 1 }
          }
        }
      }
    }, async (request, reply) => {
      try {
        const { barbearia_id } = request.params;
        
        // Simular dados da fila
        return reply.send({
          success: true,
          data: {
            barbearia_id: barbearia_id,
            clientes: [
              {
                id: 'cliente-1',
                nome: 'João Silva',
                telefone: '(11) 99999-9999',
                posicao: 1,
                status: 'aguardando',
                tempo_estimado: 30
              },
              {
                id: 'cliente-2',
                nome: 'Maria Santos',
                telefone: '(11) 88888-8888',
                posicao: 2,
                status: 'aguardando',
                tempo_estimado: 60
              }
            ],
            estatisticas: {
              total_na_fila: 2,
              barbeiros_ativos: 3,
              tempo_medio_atendimento: 30
            }
          }
        });
      } catch (error) {
        return reply.status(400).send({
          success: false,
          error: error.message
        });
      }
    });

    // Rota para chamar próximo cliente
    fastify.post('/api/fila/proximo/:barbearia_id', {
      schema: {
        description: 'Chamar próximo cliente',
        tags: ['fila'],
        params: {
          type: 'object',
          required: ['barbearia_id'],
          properties: {
            barbearia_id: { type: 'integer', minimum: 1 }
          }
        }
      }
    }, async (request, reply) => {
      try {
        const { barbearia_id } = request.params;
        
        // Simular chamada do próximo cliente
        return reply.send({
          success: true,
          message: 'Próximo cliente chamado com sucesso',
          data: {
            cliente: {
              id: 'cliente-1',
              nome: 'João Silva',
              telefone: '(11) 99999-9999',
              posicao: 1,
              status: 'proximo',
              token: 'FILA_abc123_1234567890'
            }
          }
        });
      } catch (error) {
        return reply.status(400).send({
          success: false,
          error: error.message
        });
      }
    });

    console.log('✅ Rotas básicas registradas');

  } catch (error) {
    console.error('❌ Erro na configuração do servidor:', error);
    throw error;
  }
}

// Iniciar servidor
const start = async () => {
  try {
    console.log('🚀 Iniciando servidor...');
    await configureServer();
    
    const port = process.env.PORT || 3000;
    await fastify.listen({ port, host: '0.0.0.0' });
    
    console.log(`🚀 Servidor rodando na porta ${port}`);
    console.log(`🏥 Health check em: http://localhost:${port}/health`);
    console.log(`📚 API disponível em: http://localhost:${port}/`);
    console.log(`🔐 Login em: POST http://localhost:${port}/api/auth/login`);
    console.log(`📋 Fila em: POST http://localhost:${port}/api/fila/entrar`);
  } catch (err) {
    console.error('❌ Erro ao iniciar servidor:', err);
    process.exit(1);
  }
};

start(); 