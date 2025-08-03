const { checkAdminRole } = require('../middlewares/rolePermissions');
const { getWhatsAppService } = require('../services/whatsappService');
const { getRateLimitController } = require('../controllers/RateLimitController');

/**
 * @swagger
 * /api/whatsapp/status:
 *   get:
 *     tags: [whatsapp]
 *     summary: Verificar status do WhatsApp (ADMIN)
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Status do WhatsApp
 */
async function whatsappRoutes(fastify, options) {
  
  // Verificar status do WhatsApp
  fastify.get('/whatsapp/status', {
    schema: {
      description: 'Verificar status do WhatsApp (ADMIN)',
      tags: ['whatsapp'],
      response: {
        200: {
          description: 'Status do WhatsApp',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                isReady: { type: 'boolean' },
                isConnected: { type: 'boolean' },
                status: { type: 'string' }
              }
            }
          }
        }
      }
    },
    preHandler: [fastify.authenticate, checkAdminRole]
  }, async (request, reply) => {
    try {
      const whatsappService = getWhatsAppService();
      const status = await whatsappService.getStatus();
      
      return reply.status(200).send({
        success: true,
        data: {
          ...status,
          status: status.isReady ? 'Conectado' : 'Desconectado'
        }
      });
    } catch (error) {
      console.error('❌ [WHATSAPP] Erro ao verificar status:', error);
      return reply.status(500).send({ 
        success: false, 
        error: 'Erro ao verificar status do WhatsApp' 
      });
    }
  });

  // Testar envio de mensagem
  fastify.post('/whatsapp/test', {
    schema: {
      description: 'Testar envio de mensagem WhatsApp (ADMIN)',
      tags: ['whatsapp'],
      body: {
        type: 'object',
        required: ['telefone', 'tipo'],
        properties: {
          telefone: { 
            type: 'string',
            description: 'Telefone para teste (formato: 11999999999)'
          },
          tipo: { 
            type: 'string',
            enum: ['vez_chegou', 'atendimento_iniciado', 'atendimento_finalizado', 'posicao_fila'],
            description: 'Tipo de mensagem para testar'
          },
          dados_teste: {
            type: 'object',
            description: 'Dados para teste da mensagem'
          }
        }
      },
      response: {
        200: {
          description: 'Teste realizado',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' }
          }
        }
      }
    },
    preHandler: [fastify.authenticate, checkAdminRole]
  }, async (request, reply) => {
    try {
      const { telefone, tipo, dados_teste } = request.body;
      
      const whatsappService = getWhatsAppService();
      
      // Dados padrão para teste
      const dados = dados_teste || {
        cliente: { nome: 'Cliente Teste', telefone },
        barbearia: { nome: 'Barbearia Teste' },
        posicao: 1,
        tempoEstimado: 15
      };
      
      const resultado = await whatsappService.enviarNotificacao(telefone, tipo, dados);
      
      if (resultado) {
        return reply.status(200).send({
          success: true,
          message: 'Mensagem de teste enviada com sucesso',
          data: {
            telefone,
            tipo,
            enviado: true
          }
        });
      } else {
        return reply.status(400).send({
          success: false,
          error: 'Falha ao enviar mensagem de teste'
        });
      }
    } catch (error) {
      console.error('❌ [WHATSAPP] Erro no teste:', error);
      return reply.status(500).send({ 
        success: false, 
        error: 'Erro ao realizar teste do WhatsApp' 
      });
    }
  });

  // Reconectar WhatsApp
  fastify.post('/whatsapp/reconnect', {
    schema: {
      description: 'Reconectar WhatsApp (ADMIN)',
      tags: ['whatsapp'],
      response: {
        200: {
          description: 'Reconexão realizada',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' }
          }
        }
      }
    },
    preHandler: [fastify.authenticate, checkAdminRole]
  }, async (request, reply) => {
    try {
      const whatsappService = getWhatsAppService();
      
      // Desconectar primeiro
      await whatsappService.disconnect();
      
      // Reinicializar
      await whatsappService.init();
      
      return reply.status(200).send({
        success: true,
        message: 'WhatsApp reconectado com sucesso'
      });
    } catch (error) {
      console.error('❌ [WHATSAPP] Erro na reconexão:', error);
      return reply.status(500).send({ 
        success: false, 
        error: 'Erro ao reconectar WhatsApp' 
      });
    }
  });

  // Configurações de notificação
  fastify.get('/whatsapp/config', {
    schema: {
      description: 'Obter configurações de notificação (ADMIN)',
      tags: ['whatsapp'],
      response: {
        200: {
          description: 'Configurações de notificação',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                notificacoes_ativas: { type: 'boolean' },
                tipos_notificacao: { type: 'array' },
                horario_inicio: { type: 'string' },
                horario_fim: { type: 'string' }
              }
            }
          }
        }
      }
    },
    preHandler: [fastify.authenticate, checkAdminRole]
  }, async (request, reply) => {
    try {
      // Buscar configurações do banco de dados
      const { data: config, error } = await fastify.supabase
        .from('configuracoes_sistema')
        .select('*')
        .eq('chave', 'whatsapp_notificacoes')
        .single();
      
      const configuracoes = config?.valor || {
        notificacoes_ativas: true,
        tipos_notificacao: ['vez_chegou', 'atendimento_iniciado', 'atendimento_finalizado'],
        horario_inicio: '08:00',
        horario_fim: '20:00'
      };
      
      return reply.status(200).send({
        success: true,
        data: configuracoes
      });
    } catch (error) {
      console.error('❌ [WHATSAPP] Erro ao buscar configurações:', error);
      return reply.status(500).send({ 
        success: false, 
        error: 'Erro ao buscar configurações' 
      });
    }
  });

  // Atualizar configurações de notificação
  fastify.put('/whatsapp/config', {
    schema: {
      description: 'Atualizar configurações de notificação (ADMIN)',
      tags: ['whatsapp'],
      body: {
        type: 'object',
        properties: {
          notificacoes_ativas: { type: 'boolean' },
          tipos_notificacao: { 
            type: 'array',
            items: { 
              type: 'string',
              enum: ['vez_chegou', 'atendimento_iniciado', 'atendimento_finalizado', 'posicao_fila']
            }
          },
          horario_inicio: { type: 'string' },
          horario_fim: { type: 'string' }
        }
      },
      response: {
        200: {
          description: 'Configurações atualizadas',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' }
          }
        }
      }
    },
    preHandler: [fastify.authenticate, checkAdminRole]
  }, async (request, reply) => {
    try {
      const configuracoes = request.body;
      
      // Salvar no banco de dados
      const { error } = await fastify.supabase
        .from('configuracoes_sistema')
        .upsert({
          chave: 'whatsapp_notificacoes',
          valor: configuracoes,
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        throw error;
      }
      
      return reply.status(200).send({
        success: true,
        message: 'Configurações atualizadas com sucesso'
      });
    } catch (error) {
      console.error('❌ [WHATSAPP] Erro ao atualizar configurações:', error);
      return reply.status(500).send({ 
        success: false, 
        error: 'Erro ao atualizar configurações' 
      });
    }
  });

  // ===== ENDPOINTS DE RATE LIMITING =====

  // Verificar estatísticas de rate limiting
  fastify.get('/whatsapp/rate-limit/stats', {
    schema: {
      description: 'Verificar estatísticas de rate limiting (ADMIN)',
      tags: ['whatsapp'],
      response: {
        200: {
          description: 'Estatísticas de rate limiting',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' }
          }
        }
      }
    },
    preHandler: [fastify.authenticate, checkAdminRole]
  }, async (request, reply) => {
    try {
      const rateLimitController = getRateLimitController();
      const estatisticas = rateLimitController.getEstatisticas();
      
      return reply.status(200).send({
        success: true,
        data: estatisticas
      });
    } catch (error) {
      console.error('❌ [WHATSAPP] Erro ao buscar estatísticas:', error);
      return reply.status(500).send({ 
        success: false, 
        error: 'Erro ao buscar estatísticas' 
      });
    }
  });

  // Reativar sistema de rate limiting
  fastify.post('/whatsapp/rate-limit/reactivate', {
    schema: {
      description: 'Reativar sistema de rate limiting (ADMIN)',
      tags: ['whatsapp'],
      response: {
        200: {
          description: 'Sistema reativado',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' }
          }
        }
      }
    },
    preHandler: [fastify.authenticate, checkAdminRole]
  }, async (request, reply) => {
    try {
      const rateLimitController = getRateLimitController();
      rateLimitController.reativarSistema();
      
      return reply.status(200).send({
        success: true,
        message: 'Sistema de rate limiting reativado com sucesso'
      });
    } catch (error) {
      console.error('❌ [WHATSAPP] Erro ao reativar sistema:', error);
      return reply.status(500).send({ 
        success: false, 
        error: 'Erro ao reativar sistema' 
      });
    }
  });

  // Listar usuários bloqueados
  fastify.get('/whatsapp/rate-limit/blocked-users', {
    schema: {
      description: 'Listar usuários bloqueados (ADMIN)',
      tags: ['whatsapp'],
      response: {
        200: {
          description: 'Lista de usuários bloqueados',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'array' }
          }
        }
      }
    },
    preHandler: [fastify.authenticate, checkAdminRole]
  }, async (request, reply) => {
    try {
      const rateLimitController = getRateLimitController();
      const usuariosBloqueados = rateLimitController.getUsuariosBloqueados();
      
      return reply.status(200).send({
        success: true,
        data: usuariosBloqueados
      });
    } catch (error) {
      console.error('❌ [WHATSAPP] Erro ao listar usuários bloqueados:', error);
      return reply.status(500).send({ 
        success: false, 
        error: 'Erro ao listar usuários bloqueados' 
      });
    }
  });

  // Bloquear usuário manualmente
  fastify.post('/whatsapp/rate-limit/block-user', {
    schema: {
      description: 'Bloquear usuário manualmente (ADMIN)',
      tags: ['whatsapp'],
      body: {
        type: 'object',
        required: ['telefone'],
        properties: {
          telefone: { type: 'string', description: 'Telefone do usuário' },
          motivo: { type: 'string', description: 'Motivo do bloqueio' }
        }
      },
      response: {
        200: {
          description: 'Usuário bloqueado',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' }
          }
        }
      }
    },
    preHandler: [fastify.authenticate, checkAdminRole]
  }, async (request, reply) => {
    try {
      const { telefone, motivo = 'bloqueio_manual' } = request.body;
      const rateLimitController = getRateLimitController();
      
      await rateLimitController.bloquearUsuario(telefone, motivo);
      
      return reply.status(200).send({
        success: true,
        message: `Usuário ${telefone} bloqueado com sucesso`
      });
    } catch (error) {
      console.error('❌ [WHATSAPP] Erro ao bloquear usuário:', error);
      return reply.status(500).send({ 
        success: false, 
        error: 'Erro ao bloquear usuário' 
      });
    }
  });

  // Limpar usuários bloqueados
  fastify.post('/whatsapp/rate-limit/clear-blocked-users', {
    schema: {
      description: 'Limpar todos os usuários bloqueados (ADMIN)',
      tags: ['whatsapp'],
      response: {
        200: {
          description: 'Usuários bloqueados limpos',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' }
          }
        }
      }
    },
    preHandler: [fastify.authenticate, checkAdminRole]
  }, async (request, reply) => {
    try {
      const rateLimitController = getRateLimitController();
      rateLimitController.limparUsuariosBloqueados();
      
      return reply.status(200).send({
        success: true,
        message: 'Todos os usuários bloqueados foram removidos'
      });
    } catch (error) {
      console.error('❌ [WHATSAPP] Erro ao limpar usuários bloqueados:', error);
      return reply.status(500).send({ 
        success: false, 
        error: 'Erro ao limpar usuários bloqueados' 
      });
    }
  });
}

module.exports = whatsappRoutes; 