const { checkAdminRole, checkAdminOrGerenteRole } = require('../middlewares/rolePermissions');

/**
 * @swagger
 * /api/avaliacoes:
 *   post:
 *     tags: [avaliacoes]
 *     summary: Enviar avaliação (PÚBLICO)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [cliente_nome, cliente_telefone, barbearia_id, rating]
 *             properties:
 *               cliente_nome: { type: string }
 *               cliente_telefone: { type: string }
 *               barbearia_id: { type: integer }
 *               barbeiro_id: { type: string, format: uuid }
 *               rating: { type: integer, minimum: 1, maximum: 5 }
 *               comentario: { type: string }
 *     responses:
 *       201:
 *         description: Avaliação enviada com sucesso
 *       400:
 *         description: Dados inválidos
 */
async function avaliacoesRoutes(fastify, options) {
  // Enviar avaliação (PÚBLICO)
  fastify.post('/', {
    schema: {
      description: 'Enviar avaliação (PÚBLICO)',
      tags: ['avaliacoes'],
      body: {
        type: 'object',
        required: ['cliente_nome', 'cliente_telefone', 'barbearia_id', 'rating'],
        properties: {
          cliente_nome: {
            type: 'string',
            minLength: 2,
            description: 'Nome do cliente'
          },
          cliente_telefone: {
            type: 'string',
            description: 'Telefone do cliente'
          },
          barbearia_id: {
            type: 'integer',
            description: 'ID da barbearia'
          },
          barbeiro_id: {
            type: 'string',
            format: 'uuid',
            description: 'ID do barbeiro (opcional)'
          },
          rating: {
            type: 'integer',
            minimum: 1,
            maximum: 5,
            description: 'Avaliação de 1 a 5'
          },
          comentario: {
            type: 'string',
            maxLength: 500,
            description: 'Comentário da avaliação (opcional)'
          }
        }
      },
      response: {
        201: {
          description: 'Avaliação enviada com sucesso',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                rating: { type: 'integer' },
                comentario: { type: 'string' },
                created_at: { type: 'string' }
              }
            }
          }
        }
      }
    }
    // SEM autenticação - endpoint público
  }, async (request, reply) => {
    try {
      const { cliente_nome, cliente_telefone, barbearia_id, barbeiro_id, rating, comentario } = request.body;
      
      // Validações básicas
      if (!cliente_nome || !cliente_telefone || !barbearia_id || !rating) {
        return reply.status(400).send({
          success: false,
          error: 'Nome, telefone, barbearia_id e rating são obrigatórios'
        });
      }
      
      if (rating < 1 || rating > 5) {
        return reply.status(400).send({
          success: false,
          error: 'Rating deve ser entre 1 e 5'
        });
      }
      
      // Verificar se a barbearia existe e está ativa
      const { data: barbearia, error: barbeariaError } = await fastify.supabase
        .from('barbearias')
        .select('id, nome, ativo')
        .eq('id', barbearia_id)
        .eq('ativo', true)
        .single();
        
      if (barbeariaError || !barbearia) {
        return reply.status(404).send({
          success: false,
          error: 'Barbearia não encontrada ou inativa'
        });
      }
      
      // Se barbeiro_id foi especificado, verificar se existe e está ativo
      if (barbeiro_id) {
        const { data: barbeiro, error: barbeiroError } = await fastify.supabase
          .from('barbeiros_barbearias')
          .select('id, ativo')
          .eq('user_id', barbeiro_id)
          .eq('barbearia_id', barbearia_id)
          .eq('ativo', true)
          .single();
          
        if (barbeiroError || !barbeiro) {
          return reply.status(400).send({
            success: false,
            error: 'Barbeiro especificado não está ativo nesta barbearia'
          });
        }
      }
      
      // Criar cliente temporário para a avaliação
      const { data: cliente, error: clienteError } = await fastify.supabase
        .from('clientes')
        .insert({
          nome: cliente_nome,
          telefone: cliente_telefone,
          barbearia_id: barbearia_id,
          status: 'finalizado', // Cliente já foi atendido
          data_entrada: new Date().toISOString(),
          data_finalizacao: new Date().toISOString()
        })
        .select('id')
        .single();
        
      if (clienteError) {
        return reply.status(500).send({
          success: false,
          error: 'Erro interno do servidor'
        });
      }
      
      // Inserir avaliação
      const { data: avaliacao, error: avaliacaoError } = await fastify.supabase
        .from('avaliacoes')
        .insert({
          cliente_id: cliente.id,
          barbearia_id: barbearia_id,
          barbeiro_id: barbeiro_id,
          rating: rating,
          comentario: comentario || null
        })
        .select('id, rating, comentario, created_at')
        .single();
        
      if (avaliacaoError) {
        return reply.status(500).send({
          success: false,
          error: 'Erro interno do servidor'
        });
      }
      
      return reply.status(201).send({
        success: true,
        message: 'Avaliação enviada com sucesso',
        data: {
          id: avaliacao.id,
          rating: avaliacao.rating,
          comentario: avaliacao.comentario,
          created_at: avaliacao.created_at
        }
      });
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  });

  // Enviar avaliação via token do cliente (PÚBLICO - mais seguro)
  fastify.post('/token', {
    schema: {
      description: 'Enviar avaliação usando token do cliente (PÚBLICO)',
      tags: ['avaliacoes'],
      body: {
        type: 'object',
        required: ['token', 'rating_estrutura', 'rating_barbeiro'],
        properties: {
          token: {
            type: 'string',
            description: 'Token único do cliente'
          },
          rating_estrutura: {
            type: 'integer',
            minimum: 1,
            maximum: 5,
            description: 'Avaliação da estrutura (1-5)'
          },
          rating_barbeiro: {
            type: 'integer',
            minimum: 1,
            maximum: 5,
            description: 'Avaliação do barbeiro (1-5)'
          },
          comentario: {
            type: 'string',
            maxLength: 500,
            description: 'Comentário da avaliação (opcional)'
          }
        }
      },
      response: {
        201: {
          description: 'Avaliação enviada com sucesso',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                rating: { type: 'integer' },
                comentario: { type: 'string' },
                created_at: { type: 'string' }
              }
            }
          }
        }
      }
    }
    // SEM autenticação - endpoint público
  }, async (request, reply) => {
    try {
      const { token, rating_estrutura, rating_barbeiro, comentario } = request.body;
      
      // Validações básicas
      if (!token || !rating_estrutura || !rating_barbeiro) {
        return reply.status(400).send({
          success: false,
          error: 'Token, rating_estrutura e rating_barbeiro são obrigatórios'
        });
      }
      
      if (rating_estrutura < 1 || rating_estrutura > 5) {
        return reply.status(400).send({
          success: false,
          error: 'Avaliações devem ser entre 1 e 5 estrelas'
        });
      }
      
      if (rating_barbeiro < 1 || rating_barbeiro > 5) {
        return reply.status(400).send({
          success: false,
          error: 'Avaliações devem ser entre 1 e 5 estrelas'
        });
      }
      
      // Buscar cliente pelo token
      const { data: cliente, error: clienteError } = await fastify.supabase
        .from('clientes')
        .select('id, nome, telefone, barbearia_id, barbeiro_id, status, created_at, data_finalizacao')
        .eq('token', token)
        .single();
        
      if (clienteError || !cliente) {
        return reply.status(404).send({
          success: false,
          error: 'Token inválido ou cliente não encontrado'
        });
      }
      
      // Verificar se o cliente foi finalizado (pode avaliar)
      if (cliente.status !== 'finalizado') {
        return reply.status(400).send({
          success: false,
          error: 'Cliente ainda não foi finalizado para poder avaliar'
        });
      }
      
      // Verificar prazo de validade (24h após finalização)
      const dataFinalizacao = new Date(cliente.data_finalizacao || cliente.updated_at);
      const agora = new Date();
      const diferencaHoras = (agora - dataFinalizacao) / (1000 * 60 * 60); // Diferença em horas
      
      if (diferencaHoras > 24) {
        return reply.status(400).send({
          success: false,
          error: 'Link de avaliação expirado. O prazo de 24 horas foi ultrapassado.'
        });
      }
      
      // Verificar se já existe uma avaliação para este cliente
      const { data: avaliacaoExistente, error: checkError } = await fastify.supabase
        .from('avaliacoes')
        .select('id')
        .eq('cliente_id', cliente.id)
        .single();
        
      if (avaliacaoExistente) {
        return reply.status(400).send({
          success: false,
          error: 'Cliente já enviou uma avaliação para este atendimento'
        });
      }
      
      // Inserir avaliação
      const { data: avaliacao, error: avaliacaoError } = await fastify.supabase
        .from('avaliacoes')
        .insert({
          cliente_id: cliente.id,
          barbearia_id: cliente.barbearia_id,
          barbeiro_id: cliente.barbeiro_id,
          rating_estrutura: rating_estrutura,
          rating_barbeiro: rating_barbeiro,
          comentario: comentario || null
        })
        .select('id, rating_estrutura, rating_barbeiro, comentario, created_at')
        .single();
        
      if (avaliacaoError) {
        console.error('Erro ao inserir avaliação:', avaliacaoError);
        return reply.status(500).send({
          success: false,
          error: 'Erro interno do servidor'
        });
      }
      
      console.log(`✅ [AVALIAÇÃO] Nova avaliação recebida de ${cliente.nome} - Estrutura: ${rating_estrutura}, Barbeiro: ${rating_barbeiro}`);
      
      return reply.status(201).send({
        success: true,
        message: 'Avaliação enviada com sucesso! Obrigado pelo feedback.',
        data: {
          id: avaliacao.id,
          rating_estrutura: avaliacao.rating_estrutura,
          rating_barbeiro: avaliacao.rating_barbeiro,
          comentario: avaliacao.comentario,
          created_at: avaliacao.created_at
        }
      });
      
    } catch (error) {
      console.error('❌ [AVALIAÇÃO] Erro ao processar avaliação:', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  });

  // Verificar se link de avaliação é válido (PÚBLICO)
  fastify.get('/verificar/:token', {
    schema: {
      description: 'Verificar se link de avaliação é válido (PÚBLICO)',
      tags: ['avaliacoes'],
      params: {
        type: 'object',
        required: ['token'],
        properties: {
          token: {
            type: 'string',
            description: 'Token único do cliente'
          }
        }
      },
      response: {
        200: {
          description: 'Link válido',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                valido: { type: 'boolean' },
                cliente_nome: { type: 'string' },
                tempo_restante: { type: 'number' },
                ja_avaliou: { type: 'boolean' },
                mensagem: { type: 'string' }
              }
            }
          }
        }
      }
    }
    // SEM autenticação - endpoint público
  }, async (request, reply) => {
    try {
      const { token } = request.params;
      
      // Buscar cliente pelo token
      const { data: cliente, error: clienteError } = await fastify.supabase
        .from('clientes')
        .select('id, nome, telefone, barbearia_id, barbeiro_id, status, created_at, data_finalizacao')
        .eq('token', token)
        .single();
        
      if (clienteError || !cliente) {
        return reply.status(200).send({
          success: true,
          data: {
            valido: false,
            cliente_nome: null,
            tempo_restante: 0,
            ja_avaliou: false,
            mensagem: 'Token inválido ou cliente não encontrado'
          }
        });
      }
      
      // Verificar se o cliente foi finalizado
      if (cliente.status !== 'finalizado') {
        return reply.status(200).send({
          success: true,
          data: {
            valido: false,
            cliente_nome: cliente.nome,
            tempo_restante: 0,
            ja_avaliou: false,
            mensagem: 'Cliente ainda não foi finalizado para poder avaliar'
          }
        });
      }
      
      // Verificar prazo de validade (24h após finalização)
      const dataFinalizacao = new Date(cliente.data_finalizacao || cliente.updated_at);
      const agora = new Date();
      const diferencaHoras = (agora - dataFinalizacao) / (1000 * 60 * 60);
      const tempoRestante = Math.max(0, 24 - diferencaHoras);
      
      if (diferencaHoras > 24) {
        return reply.status(200).send({
          success: true,
          data: {
            valido: false,
            cliente_nome: cliente.nome,
            tempo_restante: 0,
            ja_avaliou: false,
            mensagem: 'Link de avaliação expirado. O prazo de 24 horas foi ultrapassado.'
          }
        });
      }
      
      // Verificar se já existe uma avaliação
      const { data: avaliacaoExistente, error: checkError } = await fastify.supabase
        .from('avaliacoes')
        .select('id')
        .eq('cliente_id', cliente.id)
        .single();
        
      if (avaliacaoExistente) {
        return reply.status(200).send({
          success: true,
          data: {
            valido: false,
            cliente_nome: cliente.nome,
            tempo_restante: tempoRestante,
            ja_avaliou: true,
            mensagem: 'Cliente já enviou uma avaliação para este atendimento'
          }
        });
      }
      
      // Link válido
      return reply.status(200).send({
        success: true,
        data: {
          valido: true,
          cliente_nome: cliente.nome,
          tempo_restante: tempoRestante,
          ja_avaliou: false,
          mensagem: 'Link válido para avaliação'
        }
      });
      
    } catch (error) {
      console.error('❌ [AVALIAÇÃO] Erro ao verificar link:', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  });

  /**
   * @swagger
   * /api/avaliacoes:
   *   get:
   *     tags: [avaliacoes]
   *     summary: Listar avaliações (PRIVADO - admin/gerente)
   *     security:
   *       - Bearer: []
   *     parameters:
   *       - in: query
   *         name: barbearia_id
   *         schema:
   *           type: integer
   *       - in: query
   *         name: barbeiro_id
   *         schema:
   *           type: string
   *           format: uuid
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *       - in: query
   *         name: rating
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 5
   *     responses:
   *       200:
   *         description: Lista de avaliações
   *       403:
   *         description: Acesso negado
   */
  fastify.get('/', {
    preHandler: [fastify.authenticate, checkAdminOrGerenteRole]
  }, async (request, reply) => {
    try {
      const { barbearia_id, barbeiro_id, page = 1, limit = 10, rating } = request.query;
      const userId = request.user.id;
      const userRole = request.user.role;
      
      // Verificar permissões
      if (userRole === 'gerente') {
        // Gerente só pode ver avaliações da sua barbearia
        const { data: gerenteBarbearia } = await fastify.supabase
          .from('barbearias')
          .select('id')
          .eq('gerente_id', userId)
          .single();
          
        if (!gerenteBarbearia || (barbearia_id && parseInt(barbearia_id) !== gerenteBarbearia.id)) {
          return reply.status(403).send({
            success: false,
            error: 'Você só pode ver avaliações da sua barbearia'
          });
        }
        
        // Forçar barbearia_id para gerente
        if (!barbearia_id) {
          barbearia_id = gerenteBarbearia.id;
        }
      }
      
      // Construir query
      let query = fastify.supabase
        .from('avaliacoes')
        .select(`
          id,
          rating_estrutura,
          rating_barbeiro,
          comentario,
          created_at,
          barbearia_id,
          barbeiro_id,
          clientes!inner(nome, telefone),
          users!barbeiro_id(id, nome)
        `);
      
      // Aplicar filtros
      if (barbearia_id) {
        query = query.eq('barbearia_id', barbearia_id);
      }
      
      if (barbeiro_id) {
        query = query.eq('barbeiro_id', barbeiro_id);
      }
      
      if (rating) {
        // Filtrar por rating (pode ser estrutura ou barbeiro)
        query = query.or(`rating_estrutura.eq.${rating},rating_barbeiro.eq.${rating}`);
      }
      
      // Paginação
      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);
      
      // Ordenar por data mais recente
      query = query.order('created_at', { ascending: false });
      
      const { data: avaliacoes, error: avaliacoesError, count } = await query;
      
      if (avaliacoesError) {
        return reply.status(500).send({
          success: false,
          error: 'Erro interno do servidor'
        });
      }
      
      // Formatar dados
      const avaliacoesFormatadas = avaliacoes.map(avaliacao => ({
        id: avaliacao.id,
        cliente_nome: avaliacao.clientes.nome,
        barbearia_id: avaliacao.barbearia_id,
        rating_estrutura: avaliacao.rating_estrutura,
        rating_barbeiro: avaliacao.rating_barbeiro,
        comentario: avaliacao.comentario,
        created_at: avaliacao.created_at
      }));
      
      return reply.status(200).send({
        success: true,
        data: {
          avaliacoes: avaliacoesFormatadas,
          total: count || avaliacoes.length,
          page: parseInt(page),
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      console.error('Erro ao listar avaliações:', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  });
}

module.exports = avaliacoesRoutes; 