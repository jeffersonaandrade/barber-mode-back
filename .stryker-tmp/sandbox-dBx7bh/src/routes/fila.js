// @ts-nocheck
const QRCode = require('qrcode');
const { checkBarbeiroBarbeariaAccess } = require('../middlewares/barbeariaAccess');
const { checkBarbeiroRole, checkGerenteBarbeariaAccess, checkGerenteRole } = require('../middlewares/rolePermissions');

async function filaRoutes(fastify, options) {
  // Adicionar cliente à fila (PÚBLICO)
  fastify.post('/fila/entrar', {
    schema: {
      description: 'Adicionar cliente à fila (PÚBLICO)',
      tags: ['fila'],
      body: {
        type: 'object',
        required: ['nome', 'telefone', 'barbearia_id'],
        properties: {
          nome: { type: 'string' },
          telefone: { type: 'string' },
          barbearia_id: { type: 'integer' },
          barbeiro_id: { type: 'string', format: 'uuid' }
        }
      },
      response: {
        201: {
          description: 'Cliente adicionado com sucesso',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                cliente: { type: 'object' },
                qr_code_fila: { type: 'string' },
                qr_code_status: { type: 'string' },
                posicao: { type: 'integer' }
              }
            }
          }
        }
      }
    }
    // SEM autenticação - endpoint público
  }, async (request, reply) => {
    try {
      const { nome, telefone, barbearia_id, barbeiro_id } = request.body;
      
      // Validações básicas
      if (!nome || !telefone || !barbearia_id) {
        return reply.status(400).send({ success: false, error: 'Nome, telefone e barbearia_id são obrigatórios' });
      }
      
      // Verificar se a barbearia existe e está ativa
      const { data: barbearia, error: barbeariaError } = await fastify.supabase
        .from('barbearias')
        .select('id, nome, ativo')
        .eq('id', barbearia_id)
        .eq('ativo', true)
        .single();
        
      if (barbeariaError || !barbearia) {
        return reply.status(404).send({ success: false, error: 'Barbearia não encontrada ou inativa' });
      }
      
      // Se barbeiro_id foi especificado, verificar se o barbeiro está ativo na barbearia
      if (barbeiro_id) {
        const { data: barbeiroAtivo, error: barbeiroError } = await fastify.supabase
          .from('barbeiros_barbearias')
          .select('id, ativo')
          .eq('user_id', barbeiro_id)
          .eq('barbearia_id', barbearia_id)
          .eq('ativo', true)
          .single();
          
        if (barbeiroError || !barbeiroAtivo) {
          return reply.status(400).send({ success: false, error: 'Barbeiro especificado não está ativo nesta barbearia' });
        }
      }
      
      // Gerar token único para o cliente
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      // Obter posição atual na fila
      const { data: ultimoCliente, error: posicaoError } = await fastify.supabase
        .from('clientes')
        .select('posicao')
        .eq('barbearia_id', barbearia_id)
        .in('status', ['aguardando', 'proximo'])
        .order('posicao', { ascending: false })
        .limit(1)
        .single();
        
      const posicao = ultimoCliente ? ultimoCliente.posicao + 1 : 1;
      
      // Inserir cliente na fila
      const { data: cliente, error: insertError } = await fastify.supabase
        .from('clientes')
        .insert({
          nome,
          telefone,
          token,
          barbearia_id,
          barbeiro_id: barbeiro_id || null,
          status: 'aguardando',
          posicao
        })
        .select()
        .single();
        
      if (insertError) {
        return reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
      }
      
      // Gerar QR codes
      const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
      const qrCodeFila = await QRCode.toDataURL(`${baseUrl}/fila/${cliente.id}`);
      const qrCodeStatus = await QRCode.toDataURL(`${baseUrl}/status/${cliente.token}`);
      
      return reply.status(201).send({
        success: true,
        message: 'Cliente adicionado à fila com sucesso',
        data: { 
          cliente: {
            id: cliente.id,
            nome: cliente.nome,
            posicao: cliente.posicao,
            status: cliente.status,
            token: cliente.token
          }, 
          qr_code_fila: qrCodeFila, 
          qr_code_status: qrCodeStatus, 
          posicao 
        }
      });
    } catch (error) {
      return reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
    }
  });



  // Obter fila da barbearia (APENAS BARBEIROS)
  fastify.get('/fila/:barbearia_id', {
    schema: {
      description: 'Obter fila da barbearia (APENAS BARBEIROS)',
      tags: ['fila'],
      params: {
        type: 'object',
        required: ['barbearia_id'],
        properties: { barbearia_id: { type: 'integer' } }
      },
      response: {
        200: {
          description: 'Fila da barbearia',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                clientes: { type: 'array' },
                estatisticas: { type: 'object' }
              }
            }
          }
        }
      }
    },
    preHandler: [fastify.authenticate, checkBarbeiroBarbeariaAccess]
  }, async (request, reply) => {
    try {
      const { barbearia_id } = request.params;
      // Verificar se a barbearia existe
      const { data: barbearia, error: barbeariaError } = await fastify.supabase
        .from('barbearias')
        .select('id, nome, ativo')
        .eq('id', barbearia_id)
        .single();
      if (barbeariaError || !barbearia) {
        return reply.status(404).send({ success: false, error: 'Barbearia não encontrada' });
      }
      // Obter clientes na fila (incluindo removidos para estatísticas)
      const { data: clientes, error: clientesError } = await fastify.supabase
        .from('clientes')
        .select(`
          id,
          nome,
          telefone,
          token,
          barbearia_id,
          barbeiro_id,
          status,
          posicao,
          created_at,
          data_atendimento,
          data_finalizacao
        `)
        .eq('barbearia_id', barbearia_id)
        .in('status', ['aguardando', 'proximo', 'atendendo', 'finalizado', 'removido'])
        .order('posicao', { ascending: true });
      if (clientesError) {
        return reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
      }
      // Filtrar apenas clientes ativos para exibição
      const clientesAtivos = clientes.filter(c => !['finalizado', 'removido'].includes(c.status));
      
      // Calcular estatísticas
      const totalClientes = clientes.length;
      const aguardando = clientes.filter(c => c.status === 'aguardando').length;
      const proximo = clientes.filter(c => c.status === 'proximo').length;
      const atendendo = clientes.filter(c => c.status === 'atendendo').length;
      const finalizados = clientes.filter(c => c.status === 'finalizado').length;
      const removidos = clientes.filter(c => c.status === 'removido').length;
      
      // Obter número de barbeiros ativos
      const { data: barbeirosAtivos } = await fastify.supabase
        .from('barbeiros_barbearias')
        .select('id')
        .eq('barbearia_id', barbearia_id)
        .eq('ativo', true);
      const barbeirosAtivosCount = barbeirosAtivos ? barbeirosAtivos.length : 0;
      
      // Calcular tempo estimado (15 minutos por cliente)
      const tempoEstimado = aguardando * 15;
      
      return reply.status(200).send({
        success: true,
        data: {
          clientes: clientesAtivos,
          estatisticas: {
            total_clientes: totalClientes,
            aguardando,
            proximo,
            atendendo,
            finalizados,
            removidos,
            tempo_estimado: tempoEstimado,
            barbeiros_ativos: barbeirosAtivosCount
          }
        }
      });
    } catch (error) {
      return reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
    }
  });

  // Obter fila da barbearia (APENAS GERENTES)
  fastify.get('/fila-gerente/:barbearia_id', {
    schema: {
      description: 'Obter fila da barbearia (APENAS GERENTES)',
      tags: ['fila'],
      params: {
        type: 'object',
        required: ['barbearia_id'],
        properties: { barbearia_id: { type: 'integer' } }
      },
      response: {
        200: {
          description: 'Fila da barbearia (dados limitados para gerente)',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                estatisticas: { type: 'object' }
              }
            }
          }
        }
      }
    },
    preHandler: [fastify.authenticate, checkGerenteRole, checkGerenteBarbeariaAccess]
  }, async (request, reply) => {
    try {
      const { barbearia_id } = request.params;
      
      // Verificar se a barbearia existe
      const { data: barbearia, error: barbeariaError } = await fastify.supabase
        .from('barbearias')
        .select('id, nome, ativo')
        .eq('id', barbearia_id)
        .single();
      if (barbeariaError || !barbearia) {
        return reply.status(404).send({ success: false, error: 'Barbearia não encontrada' });
      }
      
      // Obter apenas estatísticas da fila (sem dados pessoais dos clientes)
      const { data: clientes, error: clientesError } = await fastify.supabase
        .from('clientes')
        .select('status')
        .eq('barbearia_id', barbearia_id)
        .in('status', ['aguardando', 'proximo', 'atendendo', 'finalizado', 'removido']);
        
      if (clientesError) {
        return reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
      }
      
      // Calcular estatísticas
      const totalClientes = clientes.length;
      const aguardando = clientes.filter(c => c.status === 'aguardando').length;
      const proximo = clientes.filter(c => c.status === 'proximo').length;
      const atendendo = clientes.filter(c => c.status === 'atendendo').length;
      const finalizados = clientes.filter(c => c.status === 'finalizado').length;
      const removidos = clientes.filter(c => c.status === 'removido').length;
      
      // Obter número de barbeiros ativos
      const { data: barbeirosAtivos } = await fastify.supabase
        .from('barbeiros_barbearias')
        .select('id')
        .eq('barbearia_id', barbearia_id)
        .eq('ativo', true);
      const barbeirosAtivosCount = barbeirosAtivos ? barbeirosAtivos.length : 0;
      
      // Calcular tempo estimado (15 minutos por cliente)
      const tempoEstimado = aguardando * 15;
      
      return reply.status(200).send({
        success: true,
        data: {
          barbearia: {
            id: barbearia.id,
            nome: barbearia.nome
          },
          estatisticas: {
            total_clientes: totalClientes,
            aguardando,
            proximo,
            atendendo,
            finalizados,
            removidos,
            tempo_estimado: tempoEstimado,
            barbeiros_ativos: barbeirosAtivosCount
          }
        }
      });
    } catch (error) {
      return reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
    }
  });

  // Obter fila da barbearia (PÚBLICO - para clientes)
  fastify.get('/fila-publica/:barbearia_id', {
    schema: {
      description: 'Obter fila da barbearia (PÚBLICO - para clientes)',
      tags: ['fila'],
      params: {
        type: 'object',
        required: ['barbearia_id'],
        properties: { barbearia_id: { type: 'integer' } }
      },
      response: {
        200: {
          description: 'Fila da barbearia (dados limitados)',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                barbearia: { type: 'object' },
                estatisticas: { type: 'object' }
              }
            }
          }
        }
      }
    }
    // SEM autenticação - endpoint público
  }, async (request, reply) => {
    try {
      const { barbearia_id } = request.params;
      
      // Verificar se a barbearia existe e está ativa
      const { data: barbearia, error: barbeariaError } = await fastify.supabase
        .from('barbearias')
        .select('id, nome, ativo, endereco, telefone')
        .eq('id', barbearia_id)
        .eq('ativo', true)
        .single();
        
      if (barbeariaError || !barbearia) {
        return reply.status(404).send({ success: false, error: 'Barbearia não encontrada ou inativa' });
      }
      
      // Obter apenas estatísticas da fila (sem dados pessoais dos clientes)
      const { data: clientes, error: clientesError } = await fastify.supabase
        .from('clientes')
        .select('status')
        .eq('barbearia_id', barbearia_id)
        .in('status', ['aguardando', 'proximo', 'atendendo', 'finalizado', 'removido']);
        
      if (clientesError) {
        return reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
      }
      
      // Calcular estatísticas
      const totalClientes = clientes.length;
      const aguardando = clientes.filter(c => c.status === 'aguardando').length;
      const proximo = clientes.filter(c => c.status === 'proximo').length;
      const atendendo = clientes.filter(c => c.status === 'atendendo').length;
      const finalizados = clientes.filter(c => c.status === 'finalizado').length;
      const removidos = clientes.filter(c => c.status === 'removido').length;
      
      // Obter número de barbeiros ativos
      const { data: barbeirosAtivos } = await fastify.supabase
        .from('barbeiros_barbearias')
        .select('id')
        .eq('barbearia_id', barbearia_id)
        .eq('ativo', true);
      const barbeirosAtivosCount = barbeirosAtivos ? barbeirosAtivos.length : 0;
      
      // Calcular tempo estimado (15 minutos por cliente)
      const tempoEstimado = aguardando * 15;
      
      return reply.status(200).send({
        success: true,
        data: {
          barbearia: {
            id: barbearia.id,
            nome: barbearia.nome,
            endereco: barbearia.endereco,
            telefone: barbearia.telefone
          },
          estatisticas: {
            aguardando,
            proximo,
            atendendo,
            tempo_estimado: tempoEstimado,
            barbeiros_ativos: barbeirosAtivosCount
          }
        }
      });
    } catch (error) {
      return reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
    }
  });

  // Chamar próximo cliente (APENAS BARBEIROS)
  fastify.post('/fila/proximo/:barbearia_id', {
    schema: {
      description: 'Chamar próximo cliente da fila (APENAS BARBEIROS)',
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
      const userId = request.user.id;
      
      // Verificar se o usuário é um barbeiro ativo na barbearia
      const { data: barbeiroAtivo } = await fastify.supabase
        .from('barbeiros_barbearias')
        .select('id, ativo')
        .eq('user_id', userId)
        .eq('barbearia_id', barbearia_id)
        .eq('ativo', true)
        .single();
      if (!barbeiroAtivo) {
        return reply.status(403).send({ success: false, error: 'Você não está ativo nesta barbearia' });
      }
      
      // Buscar próximo cliente na fila (clientes específicos do barbeiro ou fila geral)
      const { data: proximoCliente } = await fastify.supabase
        .from('clientes')
        .select('*')
        .eq('barbearia_id', barbearia_id)
        .eq('status', 'aguardando')
        .or(`barbeiro_id.eq.${userId},barbeiro_id.is.null`)
        .order('barbeiro_id', { ascending: false })
        .order('posicao', { ascending: true })
        .limit(1)
        .single();
      
      if (!proximoCliente) {
        return reply.status(404).send({ success: false, error: 'Não há clientes aguardando na fila' });
      }
      
      // Atualizar status do cliente para 'proximo'
      const { data: clienteAtualizado, error: updateError } = await fastify.supabase
        .from('clientes')
        .update({
          status: 'proximo',
          barbeiro_id: userId,
          data_atendimento: new Date().toISOString()
        })
        .eq('id', proximoCliente.id)
        .select()
        .single();
      
      if (updateError) {
        return reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
      }
      
      return reply.status(200).send({
        success: true,
        message: 'Próximo cliente chamado',
        data: clienteAtualizado
      });
    } catch (error) {
      return reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
    }
  });

  // Iniciar atendimento (APENAS BARBEIROS)
  fastify.post('/fila/iniciar-atendimento/:cliente_id', {
    schema: {
      description: 'Iniciar atendimento de um cliente (APENAS BARBEIROS)',
      tags: ['fila'],
      params: {
        type: 'object',
        required: ['cliente_id'],
        properties: { cliente_id: { type: 'string' } }
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
    preHandler: fastify.authenticate
  }, async (request, reply) => {
    try {
      const { cliente_id } = request.params;
      const userId = request.user.id;
      
      // Buscar cliente
      const { data: cliente } = await fastify.supabase
        .from('clientes')
        .select('*')
        .eq('id', cliente_id)
        .eq('barbeiro_id', userId)
        .eq('status', 'proximo')
        .single();
      
      if (!cliente) {
        return reply.status(404).send({ success: false, error: 'Cliente não encontrado ou não está no status correto' });
      }
      
      // Atualizar status para 'atendendo' e registrar hora de início
      const { data: clienteAtualizado, error: updateError } = await fastify.supabase
        .from('clientes')
        .update({
          status: 'atendendo',
          data_atendimento: new Date().toISOString()
        })
        .eq('id', cliente_id)
        .select()
        .single();
      
      if (updateError) {
        return reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
      }
      
      return reply.status(200).send({
        success: true,
        message: 'Atendimento iniciado com sucesso',
        data: clienteAtualizado
      });
    } catch (error) {
      return reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
    }
  });

  // Remover cliente da fila (APENAS BARBEIROS)
  fastify.post('/fila/remover/:cliente_id', {
    schema: {
      description: 'Remover cliente da fila (APENAS BARBEIROS)',
      tags: ['fila'],
      params: {
        type: 'object',
        required: ['cliente_id'],
        properties: { cliente_id: { type: 'string' } }
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
    preHandler: fastify.authenticate
  }, async (request, reply) => {
    try {
      const { cliente_id } = request.params;
      const userId = request.user.id;
      
      // Buscar cliente
      const { data: cliente } = await fastify.supabase
        .from('clientes')
        .select('*')
        .eq('id', cliente_id)
        .eq('barbeiro_id', userId)
        .eq('status', 'proximo')
        .single();
      
      if (!cliente) {
        return reply.status(404).send({ success: false, error: 'Cliente não encontrado ou não está no status correto' });
      }
      
      // Atualizar status para 'removido'
      const { data: clienteAtualizado, error: updateError } = await fastify.supabase
        .from('clientes')
        .update({
          status: 'removido',
          data_finalizacao: new Date().toISOString()
        })
        .eq('id', cliente_id)
        .select()
        .single();
      
      if (updateError) {
        return reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
      }
      
      return reply.status(200).send({
        success: true,
        message: 'Cliente removido da fila com sucesso',
        data: clienteAtualizado
      });
    } catch (error) {
      return reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
    }
  });

  // Finalizar atendimento (APENAS BARBEIROS)
  fastify.post('/fila/finalizar', {
    schema: {
      description: 'Finalizar atendimento de um cliente (APENAS BARBEIROS)',
      tags: ['fila'],
      body: {
        type: 'object',
        required: ['cliente_id', 'barbearia_id', 'servico', 'duracao'],
        properties: {
          cliente_id: { type: 'string' },
          barbearia_id: { type: 'integer' },
          servico: { type: 'string' },
          duracao: { type: 'integer' }
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
    preHandler: fastify.authenticate
  }, async (request, reply) => {
    try {
      const { cliente_id, barbearia_id, servico, duracao } = request.body;
      const userId = request.user.id;
      
      // Verificar se o usuário é barbeiro ativo na barbearia
      const { data: barbeiroAtivo } = await fastify.supabase
        .from('barbeiros_barbearias')
        .select('id, ativo')
        .eq('user_id', userId)
        .eq('barbearia_id', barbearia_id)
        .eq('ativo', true)
        .single();
      if (!barbeiroAtivo) {
        return reply.status(403).send({ success: false, error: 'Você não está ativo nesta barbearia' });
      }
      
      // Buscar cliente
      const { data: cliente } = await fastify.supabase
        .from('clientes')
        .select('*')
        .eq('id', cliente_id)
        .eq('barbearia_id', barbearia_id)
        .eq('status', 'atendendo')
        .single();
      
      if (!cliente) {
        return reply.status(404).send({ success: false, error: 'Cliente não encontrado ou não está sendo atendido' });
      }
      
      // Atualizar status do cliente para 'finalizado'
      await fastify.supabase
        .from('clientes')
        .update({ 
          status: 'finalizado', 
          data_finalizacao: new Date().toISOString() 
        })
        .eq('id', cliente_id);
      
      // Registrar no histórico de atendimentos
      await fastify.supabase
        .from('historico_atendimentos')
        .insert({
          cliente_id,
          barbearia_id,
          barbeiro_id: userId,
          servico,
          duracao,
          data_inicio: cliente.data_atendimento,
          data_fim: new Date().toISOString()
        });
      
      return reply.status(200).send({
        success: true,
        message: 'Atendimento finalizado com sucesso',
        data: { cliente_id, barbearia_id, servico, duracao }
      });
    } catch (error) {
      return reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
    }
  });

  // Status do cliente na fila
  fastify.get('/fila/status/:token', {
    schema: {
      description: 'Obter status do cliente na fila',
      tags: ['fila'],
      params: {
        type: 'object',
        required: ['token'],
        properties: { token: { type: 'string' } }
      },
      response: {
        200: {
          description: 'Status do cliente',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { token } = request.params;
      const { data: cliente } = await fastify.supabase
        .from('clientes')
        .select('*')
        .eq('token', token)
        .single();
      
      if (!cliente) {
        return reply.status(404).send({ success: false, error: 'Cliente não encontrado' });
      }
      
      return reply.status(200).send({ success: true, data: cliente });
    } catch (error) {
      return reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
    }
  });
}

module.exports = filaRoutes; 