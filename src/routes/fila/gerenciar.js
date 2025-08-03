const { checkBarbeiroBarbeariaAccess } = require('../../middlewares/barbeariaAccess');
const { checkBarbeiroRole, checkAdminRole, checkFilaManagementAccess } = require('../../middlewares/rolePermissions');
const FilaService = require('../../services/filaService');
const { getWhatsAppService } = require('../../services/whatsappService');

/**
 * @swagger
 * /api/fila/proximo/{barbearia_id}:
 *   post:
 *     tags: [fila]
 *     summary: Chamar próximo cliente da fila (BARBEIRO/GERENTE)
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: barbearia_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Próximo cliente chamado
 *       403:
 *         description: Acesso negado
 */
async function gerenciarFila(fastify, options) {
  // Chamar próximo cliente
  fastify.post('/fila/proximo/:barbearia_id', {
    schema: {
      description: 'Chamar próximo cliente da fila (BARBEIRO/GERENTE)',
      tags: ['fila'],
      params: {
        type: 'object',
        required: ['barbearia_id'],
        properties: { barbearia_id: { type: 'integer' } }
      },
      body: {
        type: 'object',
        properties: {
          barbeiro_id: { 
            type: 'string', 
            format: 'uuid',
            description: 'ID do barbeiro que irá atender (opcional - apenas para gerentes)'
          }
        }
      },
      response: {
        200: {
          description: 'Próximo cliente chamado',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' }
          }
        }
      }
    },
    preHandler: [fastify.authenticate, checkFilaManagementAccess]
  }, async (request, reply) => {
    try {
      const { barbearia_id } = request.params;
      const { barbeiro_id } = request.body || {};
      const userId = request.user.id;
      const userRole = request.user.role;
      
      // Verificar se a barbearia existe
      const { data: barbearia, error: barbeariaError } = await fastify.supabase
        .from('barbearias')
        .select('id, nome, ativo')
        .eq('id', barbearia_id)
        .single();
      if (barbeariaError || !barbearia) {
        return reply.status(404).send({ success: false, error: 'Barbearia não encontrada' });
      }
      
      // Buscar próximo cliente na fila
      const { data: proximoCliente, error: clienteError } = await fastify.supabase
        .from('clientes')
        .select('id, nome, telefone, posicao, status')
        .eq('barbearia_id', barbearia_id)
        .eq('status', 'aguardando')
        .order('posicao', { ascending: true })
        .limit(1)
        .single();
        
      if (clienteError || !proximoCliente) {
        return reply.status(404).send({ 
          success: false, 
          error: 'Não há clientes aguardando na fila' 
        });
      }
      
      // Atualizar status do cliente para 'próximo'
      const updateData = { 
        status: 'proximo',
        updated_at: new Date().toISOString()
      };
      
      // Lógica de atribuição do barbeiro
      if (userRole === 'barbeiro') {
        // Se for barbeiro, sempre atribuir a ele mesmo
        updateData.barbeiro_id = userId;
      } else if (userRole === 'gerente' && barbeiro_id) {
        // Se for gerente e especificou um barbeiro, verificar se o barbeiro está ativo
        const { data: barbeiroAtivo, error: barbeiroError } = await fastify.supabase
          .from('barbeiros_barbearias')
          .select('id, ativo, disponivel')
          .eq('user_id', barbeiro_id)
          .eq('barbearia_id', barbearia_id)
          .eq('ativo', true)
          .single();
          
        if (barbeiroError || !barbeiroAtivo) {
          return reply.status(400).send({ 
            success: false, 
            error: 'Barbeiro especificado não está ativo nesta barbearia' 
          });
        }
        
        updateData.barbeiro_id = barbeiro_id;
      }
      // Se for gerente e não especificou barbeiro, não atribuir (será atribuído quando o barbeiro iniciar o atendimento)
      
      const { error: updateError } = await fastify.supabase
        .from('clientes')
        .update(updateData)
        .eq('id', proximoCliente.id);
        
      if (updateError) {
        return reply.status(500).send({ 
          success: false, 
          error: 'Erro ao atualizar status do cliente' 
        });
      }
      
      // Reordenar fila após chamar próximo cliente (quem estava aguardando move para cima)
      const filaService = new FilaService(fastify.supabase);
      const reordenacaoSucesso = await filaService.reordenarFila(barbearia_id);
      
      if (!reordenacaoSucesso) {
        console.warn(`[${userRole.toUpperCase()}] Próximo cliente chamado mas falha na reordenação da fila ${barbearia_id}`);
      }
      
      // Enviar notificação WhatsApp para o cliente
      try {
        const whatsappService = getWhatsAppService();
        const notificacaoEnviada = await whatsappService.notificarVezChegou(proximoCliente, barbearia);
        
        if (notificacaoEnviada) {
          console.log(`📱 [WHATSAPP] Notificação enviada para ${proximoCliente.nome} (${proximoCliente.telefone})`);
        } else {
          console.warn(`⚠️ [WHATSAPP] Falha ao enviar notificação para ${proximoCliente.nome}`);
        }
      } catch (error) {
        console.error('❌ [WHATSAPP] Erro ao enviar notificação:', error);
      }
      
      // Buscar informações do barbeiro se foi atribuído
      let barbeiroInfo = null;
      if (updateData.barbeiro_id) {
        const { data: barbeiro } = await fastify.supabase
          .from('users')
          .select('id, nome, telefone')
          .eq('id', updateData.barbeiro_id)
          .single();
        barbeiroInfo = barbeiro;
      }
      
      return reply.status(200).send({
        success: true,
        message: 'Próximo cliente chamado com sucesso',
        data: {
          cliente: {
            id: proximoCliente.id,
            nome: proximoCliente.nome,
            telefone: proximoCliente.telefone,
            posicao: proximoCliente.posicao,
            status: 'proximo'
          },
          barbearia: {
            id: barbearia.id,
            nome: barbearia.nome
          },
          chamado_por: {
            role: userRole,
            user_id: userId
          },
          barbeiro_atribuido: barbeiroInfo ? {
            id: barbeiroInfo.id,
            nome: barbeiroInfo.nome,
            telefone: barbeiroInfo.telefone
          } : null,
          reordenacao: {
            sucesso: reordenacaoSucesso,
            mensagem: reordenacaoSucesso ? 'Fila reordenada automaticamente' : 'Fila não foi reordenada'
          }
        }
      });
    } catch (error) {
      return reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
    }
  });

  // Iniciar atendimento
  fastify.post('/fila/iniciar-atendimento/:barbearia_id/:cliente_id', {
    schema: {
      description: 'Iniciar atendimento de um cliente (BARBEIRO/GERENTE)',
      tags: ['fila'],
      params: {
        type: 'object',
        required: ['barbearia_id', 'cliente_id'],
        properties: { 
          barbearia_id: { type: 'integer' },
          cliente_id: { type: 'string', format: 'uuid' } 
        }
      },
      response: {
        200: {
          description: 'Atendimento iniciado',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' }
          }
        }
      }
    },
    preHandler: [fastify.authenticate, checkFilaManagementAccess]
  }, async (request, reply) => {
    try {
      const { barbearia_id, cliente_id } = request.params;
      const userId = request.user.id;
      const userRole = request.user.role;
      
      // Verificar se o cliente existe e está com status 'próximo'
      const { data: cliente, error: clienteError } = await fastify.supabase
        .from('clientes')
        .select('id, nome, telefone, posicao, status, barbearia_id, barbeiro_id')
        .eq('id', cliente_id)
        .eq('barbearia_id', barbearia_id)
        .eq('status', 'proximo')
        .single();
        
      if (clienteError || !cliente) {
        return reply.status(404).send({ 
          success: false, 
          error: 'Cliente não encontrado, não está nesta barbearia ou não está pronto para atendimento' 
        });
      }
      
      // Buscar informações da barbearia para notificação
      const { data: barbearia, error: barbeariaError } = await fastify.supabase
        .from('barbearias')
        .select('id, nome')
        .eq('id', barbearia_id)
        .single();
        
      if (clienteError || !cliente) {
        return reply.status(404).send({ 
          success: false, 
          error: 'Cliente não encontrado, não está nesta barbearia ou não está pronto para atendimento' 
        });
      }
      
      // Verificar se o usuário tem permissão para atender este cliente
      if (userRole === 'barbeiro') {
        // Barbeiro só pode atender se foi ele quem chamou ou se não foi atribuído a ninguém
        if (cliente.barbeiro_id && cliente.barbeiro_id !== userId) {
          return reply.status(403).send({ 
            success: false, 
            error: 'Você não tem permissão para atender este cliente' 
          });
        }
      }
      
      // Atualizar status do cliente para 'atendendo'
      const updateData = { 
        status: 'atendendo',
        updated_at: new Date().toISOString()
      };
      
      // Se for barbeiro, atribuir o barbeiro_id
      if (userRole === 'barbeiro') {
        updateData.barbeiro_id = userId;
      }
      
      const { error: updateError } = await fastify.supabase
        .from('clientes')
        .update(updateData)
        .eq('id', cliente_id);
        
      if (updateError) {
        return reply.status(500).send({ 
          success: false, 
          error: 'Erro ao atualizar status do cliente' 
        });
      }
      
      // Reordenar fila após iniciar atendimento (cliente sai da fila)
      const filaService = new FilaService(fastify.supabase);
      const reordenacaoSucesso = await filaService.reordenarFila(cliente.barbearia_id);
      
      if (!reordenacaoSucesso) {
        console.warn(`[${userRole.toUpperCase()}] Atendimento iniciado mas falha na reordenação da fila ${cliente.barbearia_id}`);
      }
      
      // Enviar notificação WhatsApp para o cliente
      try {
        const whatsappService = getWhatsAppService();
        const notificacaoEnviada = await whatsappService.notificarAtendimentoIniciado(cliente, barbearia);
        
        if (notificacaoEnviada) {
          console.log(`📱 [WHATSAPP] Notificação de atendimento iniciado enviada para ${cliente.nome}`);
        } else {
          console.warn(`⚠️ [WHATSAPP] Falha ao enviar notificação de atendimento para ${cliente.nome}`);
        }
      } catch (error) {
        console.error('❌ [WHATSAPP] Erro ao enviar notificação de atendimento:', error);
      }
      
      return reply.status(200).send({
        success: true,
        message: 'Atendimento iniciado com sucesso',
        data: {
          cliente: {
            id: cliente.id,
            nome: cliente.nome,
            telefone: cliente.telefone,
            posicao: cliente.posicao,
            status: 'atendendo'
          },
          iniciado_por: {
            role: userRole,
            user_id: userId
          },
          reordenacao: {
            sucesso: reordenacaoSucesso,
            mensagem: reordenacaoSucesso ? 'Fila reordenada automaticamente' : 'Fila não foi reordenada'
          }
        }
      });
    } catch (error) {
      return reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
    }
  });

  // Remover cliente da fila
  fastify.post('/fila/remover/:cliente_id', {
    schema: {
      description: 'Remover cliente da fila (BARBEIRO/GERENTE)',
      tags: ['fila'],
      params: {
        type: 'object',
        required: ['cliente_id'],
        properties: { cliente_id: { type: 'string', format: 'uuid' } }
      },
      response: {
        200: {
          description: 'Cliente removido da fila',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' }
          }
        }
      }
    },
    preHandler: [fastify.authenticate, checkFilaManagementAccess]
  }, async (request, reply) => {
    try {
      const { cliente_id } = request.params;
      const userId = request.user.id;
      const userRole = request.user.role;
      
      // Verificar se o cliente existe
      const { data: cliente, error: clienteError } = await fastify.supabase
        .from('clientes')
        .select('id, nome, status, barbeiro_id, barbearia_id')
        .eq('id', cliente_id)
        .in('status', ['aguardando', 'proximo', 'atendendo'])
        .single();
        
      if (clienteError || !cliente) {
        return reply.status(404).send({ 
          success: false, 
          error: 'Cliente não encontrado ou não está na fila' 
        });
      }
      
      // Verificar se o usuário tem permissão para remover este cliente
      if (userRole === 'barbeiro') {
        // Barbeiro só pode remover se foi ele quem chamou ou se não foi atribuído a ninguém
        if (cliente.barbeiro_id && cliente.barbeiro_id !== userId) {
          return reply.status(403).send({ 
            success: false, 
            error: 'Você não tem permissão para remover este cliente' 
          });
        }
      }
      
      // Atualizar status do cliente para 'removido'
      const { error: updateError } = await fastify.supabase
        .from('clientes')
        .update({ 
          status: 'removido',
          updated_at: new Date().toISOString()
        })
        .eq('id', cliente_id);
        
      if (updateError) {
        return reply.status(500).send({ 
          success: false, 
          error: 'Erro ao remover cliente da fila' 
        });
      }
      
      // Reordenar fila após remoção
      const filaService = new FilaService(fastify.supabase);
      const reordenacaoSucesso = await filaService.reordenarFila(cliente.barbearia_id);
      
      if (!reordenacaoSucesso) {
        console.warn(`[${userRole.toUpperCase()}] Cliente removido mas falha na reordenação da fila ${cliente.barbearia_id}`);
      }
      
      return reply.status(200).send({
        success: true,
        message: 'Cliente removido da fila com sucesso',
        data: {
          removido_por: {
            role: userRole,
            user_id: userId
          },
          reordenacao: {
            sucesso: reordenacaoSucesso,
            mensagem: reordenacaoSucesso ? 'Fila reordenada automaticamente' : 'Fila não foi reordenada'
          }
        }
      });
    } catch (error) {
      return reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
    }
  });

  // Remover cliente da fila (ADMIN)
  fastify.post('/fila/admin/remover/:cliente_id', {
    schema: {
      description: 'Remover cliente da fila (APENAS ADMIN)',
      tags: ['fila'],
      params: {
        type: 'object',
        required: ['cliente_id'],
        properties: { cliente_id: { type: 'string', format: 'uuid' } }
      },
      body: {
        type: 'object',
        properties: {}
      },
      response: {
        200: {
          description: 'Cliente removido da fila',
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
      const { cliente_id } = request.params;
      const adminId = request.user.id;
      
      // Verificar se o cliente existe
      const { data: cliente, error: clienteError } = await fastify.supabase
        .from('clientes')
        .select('id, nome, telefone, status, barbearia_id, barbeiro_id, created_at')
        .eq('id', cliente_id)
        .in('status', ['aguardando', 'proximo', 'atendendo'])
        .single();
        
      if (clienteError || !cliente) {
        return reply.status(404).send({ 
          success: false, 
          error: 'Cliente não encontrado ou não está na fila' 
        });
      }
      
      // Atualizar status do cliente para 'removido'
      const { error: updateError } = await fastify.supabase
        .from('clientes')
        .update({ 
          status: 'removido',
          updated_at: new Date().toISOString()
        })
        .eq('id', cliente_id);
        
      if (updateError) {
        return reply.status(500).send({ 
          success: false, 
          error: 'Erro ao remover cliente da fila' 
        });
      }
      
      // Reordenar fila após remoção
      const filaService = new FilaService(fastify.supabase);
      const reordenacaoSucesso = await filaService.reordenarFila(cliente.barbearia_id);
      
      if (!reordenacaoSucesso) {
        console.warn(`[ADMIN] Cliente removido mas falha na reordenação da fila ${cliente.barbearia_id}`);
      }
      
      // Registrar ação administrativa (para auditoria)
      console.log(`[ADMIN] Cliente ${cliente.nome} (${cliente.telefone}) removido da fila por admin ${adminId}. Reordenação: ${reordenacaoSucesso ? 'OK' : 'FALHA'}`);
      
      return reply.status(200).send({
        success: true,
        message: 'Cliente removido da fila com sucesso',
        data: {
          cliente: {
            id: cliente.id,
            nome: cliente.nome,
            telefone: cliente.telefone,
            status: 'removido',
            barbearia_id: cliente.barbearia_id,
            admin_removido_por: adminId,
            data_remocao: new Date().toISOString()
          },
          reordenacao: {
            sucesso: reordenacaoSucesso,
            mensagem: reordenacaoSucesso ? 'Fila reordenada automaticamente' : 'Fila não foi reordenada'
          }
        }
      });
    } catch (error) {
      console.error('Erro ao remover cliente (admin):', error);
      return reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
    }
  });

  // Iniciar atendimento (novo endpoint)
  fastify.put('/fila/gerenciar/iniciar/:atendimento_id', {
    schema: {
      description: 'Iniciar atendimento e começar contagem de tempo (BARBEIRO)',
      tags: ['fila'],
      params: {
        type: 'object',
        required: ['atendimento_id'],
        properties: { atendimento_id: { type: 'string', format: 'uuid' } }
      },
      body: {
        type: 'object',
        required: ['servico_id'],
        properties: {
          servico_id: { type: 'integer', description: 'ID do serviço a ser realizado' }
        }
      },
      response: {
        200: {
          description: 'Atendimento iniciado',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' }
          }
        }
      }
    },
    preHandler: [fastify.authenticate, checkBarbeiroRole]
  }, async (request, reply) => {
    try {
      const { atendimento_id } = request.params;
      const { servico_id } = request.body;
      const userId = request.user.id;

      // Verificar se o atendimento existe e pertence ao barbeiro
      const { data: atendimento, error: atendimentoError } = await fastify.supabase
        .from('historico_atendimentos')
        .select('*')
        .eq('id', atendimento_id)
        .eq('barbeiro_id', userId)
        .single();

      if (atendimentoError || !atendimento) {
        return reply.status(404).send({ 
          success: false, 
          error: 'Atendimento não encontrado ou não autorizado' 
        });
      }

      // Verificar se o atendimento pode ser iniciado
      if (atendimento.status_atendimento !== 'aguardando') {
        return reply.status(400).send({ 
          success: false, 
          error: 'Atendimento já foi iniciado ou finalizado' 
        });
      }

      // Verificar se o serviço existe
      const { data: servico, error: servicoError } = await fastify.supabase
        .from('servicos')
        .select('*')
        .eq('id', servico_id)
        .eq('barbearia_id', atendimento.barbearia_id)
        .single();

      if (servicoError || !servico) {
        return reply.status(404).send({ 
          success: false, 
          error: 'Serviço não encontrado' 
        });
      }

      // Iniciar atendimento
      const tempoInicio = new Date().toISOString();
      const { data: atendimentoAtualizado, error: updateError } = await fastify.supabase
        .from('historico_atendimentos')
        .update({
          servico_id: servico_id,
          tempo_inicio: tempoInicio,
          status_atendimento: 'em_andamento'
        })
        .eq('id', atendimento_id)
        .select()
        .single();

      if (updateError) {
        console.error('Erro ao iniciar atendimento:', updateError);
        return reply.status(500).send({ 
          success: false, 
          error: 'Erro ao iniciar atendimento' 
        });
      }

      return reply.send({
        success: true,
        message: 'Atendimento iniciado com sucesso',
        data: {
          atendimento_id: atendimento_id,
          servico_id: servico_id,
          servico_nome: servico.nome,
          tempo_inicio: tempoInicio,
          status_atendimento: 'em_andamento'
        }
      });

    } catch (error) {
      console.error('Erro ao iniciar atendimento:', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  });

  // Iniciar atendimento pelo cliente (NOVO ENDPOINT)
  fastify.put('/fila/iniciar-atendimento/:cliente_id', {
    schema: {
      description: 'Iniciar atendimento de um cliente diretamente (BARBEIRO)',
      tags: ['fila'],
      params: {
        type: 'object',
        required: ['cliente_id'],
        properties: { cliente_id: { type: 'string', format: 'uuid' } }
      },
      body: {
        type: 'object',
        required: ['servico_id'],
        properties: {
          servico_id: { type: 'integer', description: 'ID do serviço a ser realizado' },
          barbearia_id: { type: 'integer', description: 'ID da barbearia (opcional)' }
        }
      },
      response: {
        200: {
          description: 'Atendimento iniciado com sucesso',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' }
          }
        }
      }
    },
    preHandler: [fastify.authenticate, checkBarbeiroRole]
  }, async (request, reply) => {
    try {
      const { cliente_id } = request.params;
      const { servico_id, barbearia_id } = request.body;
      const userId = request.user.id;

      // Verificar se o cliente existe e está com status "proximo"
      const { data: cliente, error: clienteError } = await fastify.supabase
        .from('clientes')
        .select('*')
        .eq('id', cliente_id)
        .eq('status', 'proximo')
        .single();

      if (clienteError || !cliente) {
        return reply.status(404).send({ 
          success: false, 
          error: 'Cliente não encontrado ou não está pronto para atendimento' 
        });
      }

      // Verificar se o barbeiro tem permissão para atender esse cliente
      if (cliente.barbeiro_id && cliente.barbeiro_id !== userId) {
        return reply.status(403).send({ 
          success: false, 
          error: 'Você não tem permissão para atender este cliente' 
        });
      }

      // Verificar se o serviço existe
      const { data: servico, error: servicoError } = await fastify.supabase
        .from('servicos')
        .select('*')
        .eq('id', servico_id)
        .eq('barbearia_id', cliente.barbearia_id)
        .eq('ativo', true)
        .single();

      if (servicoError || !servico) {
        return reply.status(404).send({ 
          success: false, 
          error: 'Serviço não encontrado' 
        });
      }

      // NÃO criar registro em historico_atendimentos ainda
      // Apenas atualizar o status do cliente para "atendendo"

      // Atualizar status do cliente
      const { error: clienteUpdateError } = await fastify.supabase
        .from('clientes')
        .update({ status: 'atendendo' })
        .eq('id', cliente_id);

      if (clienteUpdateError) {
        console.error('Erro ao atualizar status do cliente:', clienteUpdateError);
      }

      console.log('Atendimento iniciado com sucesso:', {
        cliente_id: cliente_id,
        servico_id: servico_id,
        servico_nome: servico.nome
      });

      const responseData = {
        cliente_id: cliente_id,
        servico_id: servico_id,
        servico_nome: servico.nome,
        status: 'atendendo',
        barbeiro: {
          id: userId,
          nome: request.user.nome
        }
      };

      console.log('Enviando resposta:', responseData);

      return reply.send({
        success: true,
        message: 'Atendimento iniciado com sucesso',
        data: responseData
      });

    } catch (error) {
      console.error('Erro ao iniciar atendimento:', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  });

  // Finalizar atendimento
  fastify.post('/fila/finalizar/:barbearia_id', {
    schema: {
      description: 'Finalizar atendimento de um cliente (BARBEIRO/GERENTE)',
      tags: ['fila'],
      params: {
        type: 'object',
        required: ['barbearia_id'],
        properties: { barbearia_id: { type: 'integer' } }
      },
      body: {
        type: 'object',
        required: ['cliente_id', 'servico_id', 'valor_servico'],
        properties: {
          cliente_id: { type: 'string', format: 'uuid' },
          servico_id: { type: 'integer' },
          valor_servico: { type: 'number', minimum: 0 },
          forma_pagamento: { 
            type: 'string', 
            enum: ['dinheiro', 'pix', 'cartao_debito', 'cartao_credito', 'transferencia'],
            default: 'dinheiro'
          },
          observacoes: { type: 'string' }
        }
      },
      response: {
        200: {
          description: 'Atendimento finalizado',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' }
          }
        }
      }
    },
    preHandler: [fastify.authenticate, checkFilaManagementAccess]
  }, async (request, reply) => {
    try {
      const { barbearia_id } = request.params;
      const { cliente_id, servico_id, valor_servico, forma_pagamento = 'dinheiro', observacoes } = request.body;
      const userId = request.user.id;
      const userRole = request.user.role;
      
      // Verificar se o cliente existe e está sendo atendido
      const { data: cliente, error: clienteError } = await fastify.supabase
        .from('clientes')
        .select('id, nome, telefone, posicao, status, barbearia_id, barbeiro_id')
        .eq('id', cliente_id)
        .eq('barbearia_id', barbearia_id)
        .eq('status', 'atendendo')
        .single();
        
      if (clienteError || !cliente) {
        return reply.status(404).send({ 
          success: false, 
          error: 'Cliente não encontrado, não está nesta barbearia ou não está sendo atendido' 
        });
      }
      
      // Verificar se o usuário tem permissão para finalizar este atendimento
      if (userRole === 'barbeiro') {
        // Barbeiro só pode finalizar se foi ele quem está atendendo
        if (cliente.barbeiro_id !== userId) {
          return reply.status(403).send({ 
            success: false, 
            error: 'Você não tem permissão para finalizar este atendimento' 
          });
        }
      }
      
      // Atualizar status do cliente para 'finalizado'
      console.log('Tentando atualizar cliente:', cliente_id, 'para status finalizado');
      const { error: updateError } = await fastify.supabase
        .from('clientes')
        .update({ 
          status: 'finalizado',
          updated_at: new Date().toISOString()
        })
        .eq('id', cliente_id);
        
      if (updateError) {
        console.error('Erro ao atualizar cliente:', updateError);
        return reply.status(500).send({ 
          success: false, 
          error: 'Erro ao finalizar atendimento' 
        });
      }
      
      return reply.status(200).send({
        success: true,
        message: 'Atendimento finalizado com sucesso',
        data: {
          cliente: {
            id: cliente.id,
            nome: cliente.nome,
            telefone: cliente.telefone,
            posicao: cliente.posicao,
            status: 'finalizado'
          }
        }
      });
    } catch (error) {
      return reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
    }
  });

  // Finalizar atendimento pelo cliente (NOVO ENDPOINT)
  fastify.put('/fila/finalizar-atendimento/:cliente_id', {
    schema: {
      description: 'Finalizar atendimento de um cliente diretamente (BARBEIRO)',
      tags: ['fila'],
      params: {
        type: 'object',
        required: ['cliente_id'],
        properties: { cliente_id: { type: 'string', format: 'uuid' } }
      },
      body: {
        type: 'object',
        required: ['valor_servico'],
        properties: {
          valor_servico: { type: 'number', minimum: 0, description: 'Valor cobrado pelo serviço' },
          forma_pagamento: { 
            type: 'string', 
            enum: ['dinheiro', 'pix', 'cartao_debito', 'cartao_credito', 'transferencia'],
            default: 'dinheiro',
            description: 'Forma de pagamento'
          },
          observacoes: { type: 'string', description: 'Observações sobre o atendimento' }
        }
      },
      response: {
        200: {
          description: 'Atendimento finalizado com sucesso',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' }
          }
        }
      }
    },
    preHandler: [fastify.authenticate, checkBarbeiroRole]
  }, async (request, reply) => {
    try {
      const { cliente_id } = request.params;
      const { valor_servico, forma_pagamento = 'dinheiro', observacoes } = request.body;
      const userId = request.user.id;

      // Verificar se o cliente existe e está com status "atendendo"
      const { data: cliente, error: clienteError } = await fastify.supabase
        .from('clientes')
        .select('*')
        .eq('id', cliente_id)
        .eq('status', 'atendendo')
        .single();

              if (clienteError || !cliente) {
          return reply.status(404).send({ 
            success: false, 
            error: 'Cliente não encontrado ou não está sendo atendido' 
          });
        }

      // Verificar se o barbeiro tem permissão para finalizar esse cliente
      if (cliente.barbeiro_id && cliente.barbeiro_id !== userId) {
        return reply.status(403).send({ 
          success: false, 
          error: 'Você não tem permissão para finalizar este atendimento' 
        });
      }

      // NÃO buscar em historico_atendimentos - cliente ainda está sendo atendido
      // Apenas finalizar o atendimento criando o registro no histórico

      // Calcular tempo real do atendimento (estimado)
      const tempoFim = new Date().toISOString();
      const tempoReal = 30; // Tempo estimado em minutos (pode ser ajustado)

      // Criar registro no histórico (cliente finalizado)
      const { data: historicoCriado, error: createError } = await fastify.supabase
        .from('historico_atendimentos')
        .insert({
          cliente_id: cliente_id,
          barbearia_id: cliente.barbearia_id,
          barbeiro_id: userId,
          servico_id: 1, // Serviço padrão (pode ser ajustado)
          servico: 'Serviço Padrão',
          duracao: tempoReal,
          data_inicio: cliente.created_at || new Date().toISOString(),
          data_fim: tempoFim,
          tempo_inicio: cliente.created_at || new Date().toISOString(),
          tempo_fim: tempoFim,
          tempo_real: tempoReal,
          status_atendimento: 'finalizado',
          valor_servico: valor_servico,
          forma_pagamento: forma_pagamento,
          status_pagamento: 'pago',
          observacoes: observacoes
        })
        .select()
        .single();

      if (createError) {
        console.error('Erro ao criar histórico:', createError);
        return reply.status(500).send({ 
          success: false, 
          error: 'Erro ao finalizar atendimento' 
        });
      }

      // Atualizar status do cliente para "finalizado"
      const { error: clienteUpdateError } = await fastify.supabase
        .from('clientes')
        .update({ status: 'finalizado' })
        .eq('id', cliente_id);

      if (clienteUpdateError) {
        console.error('Erro ao atualizar status do cliente:', clienteUpdateError);
      }

      return reply.send({
        success: true,
        message: 'Atendimento finalizado com sucesso',
        data: {
          historico_id: historicoCriado.id,
          cliente_id: cliente_id,
          servico_id: historicoCriado.servico_id,
          valor_servico: valor_servico,
          forma_pagamento: forma_pagamento,
          tempo_real: tempoReal,
          tempo_fim: tempoFim,
          status_atendimento: 'finalizado',
          barbeiro: {
            id: userId,
            nome: request.user.nome
          }
        }
      });

    } catch (error) {
      console.error('Erro ao finalizar atendimento:', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  });

  // Forçar reordenação da fila (ADMIN/BARBEIRO/GERENTE)
  fastify.post('/fila/reordenar/:barbearia_id', {
    schema: {
      description: 'Forçar reordenação da fila (ADMIN/BARBEIRO/GERENTE)',
      tags: ['fila'],
      params: {
        type: 'object',
        required: ['barbearia_id'],
        properties: { barbearia_id: { type: 'string' } }
      },
      response: {
        200: {
          description: 'Fila reordenada com sucesso',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' }
          }
        }
      }
    },
    preHandler: [fastify.authenticate, checkFilaManagementAccess]
  }, async (request, reply) => {
    try {
      const { barbearia_id } = request.params;
      
      // Verificar se a barbearia existe
      const { data: barbearia, error: barbeariaError } = await fastify.supabase
        .from('barbearias')
        .select('id, nome')
        .eq('id', barbearia_id)
        .single();
        
      if (barbeariaError || !barbearia) {
        return reply.status(404).send({ 
          success: false, 
          error: 'Barbearia não encontrada' 
        });
      }
      
      // Reordenar fila
      const filaService = new FilaService(fastify.supabase);
      const reordenacaoSucesso = await filaService.reordenarFila(barbearia_id);
      
      if (!reordenacaoSucesso) {
        return reply.status(500).send({ 
          success: false, 
          error: 'Erro ao reordenar fila' 
        });
      }
      
      // Obter fila atualizada
      const { data: clientesAtualizados, error: clientesError } = await fastify.supabase
        .from('clientes')
        .select(`
          id,
          nome,
          telefone,
          posicao,
          status,
          created_at,
          barbeiro:users(id, nome)
        `)
        .eq('barbearia_id', barbearia_id)
        .in('status', ['aguardando', 'proximo', 'atendendo'])
        .order('posicao', { ascending: true });
        
      if (clientesError) {
        return reply.status(500).send({ 
          success: false, 
          error: 'Erro ao buscar fila atualizada' 
        });
      }
      
      return reply.status(200).send({
        success: true,
        message: 'Fila reordenada com sucesso',
        data: {
          barbearia: {
            id: barbearia.id,
            nome: barbearia.nome
          },
          clientes: clientesAtualizados,
          total_clientes: clientesAtualizados.length,
          reordenacao: {
            sucesso: true,
            mensagem: 'Fila reordenada automaticamente'
          }
        }
      });
    } catch (error) {
      console.error('Erro ao reordenar fila:', error);
      return reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
    }
  });

  // Listar barbeiros ativos da barbearia (para gerentes escolherem)
  fastify.get('/fila/barbeiros/:barbearia_id', {
    schema: {
      description: 'Listar barbeiros ativos da barbearia (GERENTE/ADMIN)',
      tags: ['fila'],
      params: {
        type: 'object',
        required: ['barbearia_id'],
        properties: { barbearia_id: { type: 'integer' } }
      },
      response: {
        200: {
          description: 'Lista de barbeiros ativos',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                barbeiros: { type: 'array' },
                total: { type: 'integer' }
              }
            }
          }
        }
      }
    },
    preHandler: [fastify.authenticate, checkFilaManagementAccess]
  }, async (request, reply) => {
    try {
      const { barbearia_id } = request.params;
      const userRole = request.user.role;
      
      // Verificar se a barbearia existe
      const { data: barbearia, error: barbeariaError } = await fastify.supabase
        .from('barbearias')
        .select('id, nome, ativo')
        .eq('id', barbearia_id)
        .single();
        
      if (barbeariaError || !barbearia) {
        return reply.status(404).send({ success: false, error: 'Barbearia não encontrada' });
      }
      
      // Buscar barbeiros ativos na barbearia
      const { data: barbeirosBarbearia, error: barbeirosError } = await fastify.supabase
        .from('barbeiros_barbearias')
        .select(`
          id,
          ativo,
          disponivel,
          especialidade,
          dias_trabalho,
          horario_inicio,
          horario_fim,
          users!inner(
            id,
            nome,
            telefone,
            email
          )
        `)
        .eq('barbearia_id', barbearia_id)
        .eq('ativo', true)
        .order('users(nome)');
        
      if (barbeirosError) {
        return reply.status(500).send({ success: false, error: 'Erro ao buscar barbeiros' });
      }
      
      // Formatar dados dos barbeiros
      const barbeiros = barbeirosBarbearia.map(bb => ({
        id: bb.users.id,
        nome: bb.users.nome,
        telefone: bb.users.telefone,
        email: bb.users.email,
        especialidade: bb.especialidade,
        disponivel: bb.disponivel,
        dias_trabalho: bb.dias_trabalho,
        horario_inicio: bb.horario_inicio,
        horario_fim: bb.horario_fim
      }));
      
      return reply.status(200).send({
        success: true,
        data: {
          barbearia: {
            id: barbearia.id,
            nome: barbearia.nome
          },
          barbeiros,
          total: barbeiros.length
        }
      });
    } catch (error) {
      return reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
    }
  });

  // Limpar histórico em andamento (ADMIN)
  fastify.post('/fila/admin/limpar-historico', {
    schema: {
      description: 'Limpar registros em andamento do histórico (APENAS ADMIN)',
      tags: ['fila'],
      body: {
        type: 'object',
        properties: {
          barbearia_id: { type: 'integer', description: 'ID da barbearia (opcional)' }
        }
      },
      response: {
        200: {
          description: 'Histórico limpo com sucesso',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' }
          }
        }
      }
    },
    preHandler: [fastify.authenticate]
  }, async (request, reply) => {
    try {
      const { barbearia_id } = request.body;
      const userId = request.user.id;
      
      console.log(`🧹 [ADMIN] Iniciando limpeza do histórico por usuário ${userId}`);
      
      // Buscar registros em andamento
      let query = fastify.supabase
        .from('historico_atendimentos')
        .select('*')
        .eq('status_atendimento', 'em_andamento');
      
      if (barbearia_id) {
        query = query.eq('barbearia_id', barbearia_id);
      }
      
      const { data: registrosEmAndamento, error: fetchError } = await query;
      
      if (fetchError) {
        console.error('❌ Erro ao buscar registros:', fetchError);
        return reply.status(500).send({
          success: false,
          error: 'Erro ao buscar registros em andamento'
        });
      }
      
      console.log(`📊 [ADMIN] Encontrados ${registrosEmAndamento.length} registros em andamento`);
      
      if (registrosEmAndamento.length === 0) {
        return reply.status(200).send({
          success: true,
          message: 'Nenhum registro em andamento encontrado',
          data: {
            registros_processados: 0,
            user_id: userId
          }
        });
      }
      
      // Finalizar cada registro
      let sucessos = 0;
      let erros = 0;
      
      for (const registro of registrosEmAndamento) {
        try {
          const { error: updateError } = await fastify.supabase
            .from('historico_atendimentos')
            .update({
              status_atendimento: 'finalizado',
              data_fim: new Date().toISOString(),
              tempo_fim: new Date().toISOString(),
              tempo_real: 30, // Tempo estimado
              valor_servico: registro.valor_servico || 50,
              status_pagamento: 'pago',
              observacoes: 'Finalizado via limpeza administrativa'
            })
            .eq('id', registro.id);
          
          if (updateError) {
            console.error(`❌ Erro ao finalizar ${registro.id}:`, updateError);
            erros++;
          } else {
            console.log(`✅ Registro ${registro.id} finalizado`);
            sucessos++;
          }
        } catch (error) {
          console.error(`❌ Erro ao processar ${registro.id}:`, error);
          erros++;
        }
      }
      
      console.log(`🎉 [ADMIN] Limpeza concluída: ${sucessos} sucessos, ${erros} erros`);
      
      return reply.status(200).send({
        success: true,
        message: 'Limpeza do histórico concluída',
        data: {
          registros_processados: registrosEmAndamento.length,
          sucessos,
          erros,
          user_id: userId,
          barbearia_id: barbearia_id || 'todas'
        }
      });
      
    } catch (error) {
      console.error('❌ Erro geral na limpeza:', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  });
}

module.exports = gerenciarFila; 