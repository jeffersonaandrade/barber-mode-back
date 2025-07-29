const { checkBarbeiroBarbeariaAccess } = require('../../middlewares/barbeariaAccess');
const { checkBarbeiroRole, checkAdminRole, checkFilaManagementAccess } = require('../../middlewares/rolePermissions');
const FilaService = require('../../services/filaService');

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
        required: ['cliente_id'],
        properties: {
          cliente_id: { type: 'string', format: 'uuid' },
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
      const { cliente_id, observacoes } = request.body;
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
      const { error: updateError } = await fastify.supabase
        .from('clientes')
        .update({ 
          status: 'finalizado',
          observacoes: observacoes || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', cliente_id);
        
      if (updateError) {
        return reply.status(500).send({ 
          success: false, 
          error: 'Erro ao finalizar atendimento' 
        });
      }
      
      // Registrar no histórico
      const { error: historicoError } = await fastify.supabase
        .from('historico_atendimentos')
        .insert({
          cliente_id: cliente_id,
          barbeiro_id: cliente.barbeiro_id || userId, // Usar o barbeiro que estava atendendo ou o usuário atual
          barbearia_id: cliente.barbearia_id,
          status: 'finalizado',
          observacoes: observacoes || null,
          finalizado_por: userRole === 'gerente' ? userId : null, // Registrar se foi finalizado por gerente
          created_at: new Date().toISOString()
        });
        
      if (historicoError) {
        console.error('Erro ao registrar histórico:', historicoError);
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
          },
          finalizado_por: {
            role: userRole,
            user_id: userId
          }
        }
      });
    } catch (error) {
      return reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
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
}

module.exports = gerenciarFila; 