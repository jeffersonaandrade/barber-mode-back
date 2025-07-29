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
  fastify.post('/avaliacoes', {
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
  fastify.get('/avaliacoes', {
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
          rating,
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
        query = query.eq('rating', rating);
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
        barbeiro_id: avaliacao.barbeiro_id,
        barbeiro_nome: avaliacao.users?.nome || 'Não especificado',
        rating: avaliacao.rating,
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