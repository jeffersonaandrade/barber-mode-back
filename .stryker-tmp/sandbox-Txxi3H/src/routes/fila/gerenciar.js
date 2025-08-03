// @ts-nocheck
const { checkBarbeiroBarbeariaAccess } = require('../../middlewares/barbeariaAccess');
const { checkBarbeiroRole } = require('../../middlewares/rolePermissions');

/**
 * @swagger
 * /api/fila/proximo/{barbearia_id}:
 *   post:
 *     tags: [fila]
 *     summary: Chamar próximo cliente da fila
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
      description: 'Chamar próximo cliente da fila',
      tags: ['fila'],
      params: {
        type: 'object',
        required: ['barbearia_id'],
        properties: { barbearia_id: { type: 'integer' } }
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
    preHandler: [fastify.authenticate, checkBarbeiroRole, checkBarbeiroBarbeariaAccess]
  }, async (request, reply) => {
    try {
      const { barbearia_id } = request.params;
      const barbeiroId = request.user.id;
      
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
      const { error: updateError } = await fastify.supabase
        .from('clientes')
        .update({ 
          status: 'proximo',
          barbeiro_id: barbeiroId,
          updated_at: new Date().toISOString()
        })
        .eq('id', proximoCliente.id);
        
      if (updateError) {
        return reply.status(500).send({ 
          success: false, 
          error: 'Erro ao atualizar status do cliente' 
        });
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
          }
        }
      });
    } catch (error) {
      return reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
    }
  });

  // Iniciar atendimento
  fastify.post('/fila/iniciar-atendimento/:cliente_id', {
    schema: {
      description: 'Iniciar atendimento de um cliente',
      tags: ['fila'],
      params: {
        type: 'object',
        required: ['cliente_id'],
        properties: { cliente_id: { type: 'string', format: 'uuid' } }
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
      const { cliente_id } = request.params;
      const barbeiroId = request.user.id;
      
      // Verificar se o cliente existe e está com status 'próximo'
      const { data: cliente, error: clienteError } = await fastify.supabase
        .from('clientes')
        .select('id, nome, telefone, posicao, status, barbearia_id, barbeiro_id')
        .eq('id', cliente_id)
        .eq('status', 'proximo')
        .single();
        
      if (clienteError || !cliente) {
        return reply.status(404).send({ 
          success: false, 
          error: 'Cliente não encontrado ou não está pronto para atendimento' 
        });
      }
      
      // Verificar se o barbeiro tem permissão para atender este cliente
      if (cliente.barbeiro_id && cliente.barbeiro_id !== barbeiroId) {
        return reply.status(403).send({ 
          success: false, 
          error: 'Você não tem permissão para atender este cliente' 
        });
      }
      
      // Atualizar status do cliente para 'atendendo'
      const { error: updateError } = await fastify.supabase
        .from('clientes')
        .update({ 
          status: 'atendendo',
          barbeiro_id: barbeiroId,
          updated_at: new Date().toISOString()
        })
        .eq('id', cliente_id);
        
      if (updateError) {
        return reply.status(500).send({ 
          success: false, 
          error: 'Erro ao atualizar status do cliente' 
        });
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
      description: 'Remover cliente da fila',
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
    preHandler: [fastify.authenticate, checkBarbeiroRole]
  }, async (request, reply) => {
    try {
      const { cliente_id } = request.params;
      const barbeiroId = request.user.id;
      
      // Verificar se o cliente existe
      const { data: cliente, error: clienteError } = await fastify.supabase
        .from('clientes')
        .select('id, nome, status, barbeiro_id')
        .eq('id', cliente_id)
        .in('status', ['aguardando', 'proximo', 'atendendo'])
        .single();
        
      if (clienteError || !cliente) {
        return reply.status(404).send({ 
          success: false, 
          error: 'Cliente não encontrado ou não está na fila' 
        });
      }
      
      // Verificar se o barbeiro tem permissão para remover este cliente
      if (cliente.barbeiro_id && cliente.barbeiro_id !== barbeiroId) {
        return reply.status(403).send({ 
          success: false, 
          error: 'Você não tem permissão para remover este cliente' 
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
      
      return reply.status(200).send({
        success: true,
        message: 'Cliente removido da fila com sucesso'
      });
    } catch (error) {
      return reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
    }
  });

  // Finalizar atendimento
  fastify.post('/fila/finalizar', {
    schema: {
      description: 'Finalizar atendimento de um cliente',
      tags: ['fila'],
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
    preHandler: [fastify.authenticate, checkBarbeiroRole]
  }, async (request, reply) => {
    try {
      const { cliente_id, observacoes } = request.body;
      const barbeiroId = request.user.id;
      
      // Verificar se o cliente existe e está sendo atendido
      const { data: cliente, error: clienteError } = await fastify.supabase
        .from('clientes')
        .select('id, nome, telefone, posicao, status, barbearia_id, barbeiro_id')
        .eq('id', cliente_id)
        .eq('status', 'atendendo')
        .single();
        
      if (clienteError || !cliente) {
        return reply.status(404).send({ 
          success: false, 
          error: 'Cliente não encontrado ou não está sendo atendido' 
        });
      }
      
      // Verificar se o barbeiro tem permissão para finalizar este atendimento
      if (cliente.barbeiro_id !== barbeiroId) {
        return reply.status(403).send({ 
          success: false, 
          error: 'Você não tem permissão para finalizar este atendimento' 
        });
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
          barbeiro_id: barbeiroId,
          barbearia_id: cliente.barbearia_id,
          status: 'finalizado',
          observacoes: observacoes || null,
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
          }
        }
      });
    } catch (error) {
      return reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
    }
  });
}

module.exports = gerenciarFila; 