// @ts-nocheck
const { supabase } = require('../config/database');
const { checkAdminOrGerenteRole } = require('../middlewares/rolePermissions');

async function avaliacaoRoutes(fastify, options) {
  /**
   * @swagger
   * /api/avaliacoes:
   *   post:
   *     tags: [avaliacoes]
   *     summary: Enviar avaliação
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - cliente_id
   *               - barbearia_id
   *               - rating
   *             properties:
   *               cliente_id:
   *                 type: string
   *                 format: uuid
   *               barbearia_id:
   *                 type: integer
   *               barbeiro_id:
   *                 type: string
   *                 format: uuid
   *               rating:
   *                 type: integer
   *                 minimum: 1
   *                 maximum: 5
   *               categoria:
   *                 type: string
   *                 enum: [atendimento, qualidade, ambiente, tempo, preco]
   *               comentario:
   *                 type: string
   *     responses:
   *       201:
   *         description: Avaliação enviada
   *       400:
   *         description: Dados inválidos
   */
  fastify.post('/', async (request, reply) => {
    try {
      const { cliente_id, barbearia_id, barbeiro_id, rating, categoria, comentario } = request.body;

      // Verificar se o cliente existe e foi atendido
      const { data: cliente, error: clienteError } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', cliente_id)
        .eq('barbearia_id', barbearia_id)
        .eq('status', 'finalizado')
        .single();

      if (clienteError || !cliente) {
        return reply.status(404).send({
          success: false,
          error: 'Cliente não encontrado ou não foi atendido'
        });
      }

      // Verificar se já existe avaliação para este cliente
      const { data: avaliacaoExistente } = await supabase
        .from('avaliacoes')
        .select('id')
        .eq('cliente_id', cliente_id)
        .single();

      if (avaliacaoExistente) {
        return reply.status(400).send({
          success: false,
          error: 'Cliente já avaliou este atendimento'
        });
      }

      // Criar avaliação
      const { data: avaliacao, error } = await supabase
        .from('avaliacoes')
        .insert({
          cliente_id,
          barbearia_id,
          barbeiro_id,
          rating,
          categoria,
          comentario
        })
        .select()
        .single();

      if (error) {
        throw new Error('Erro ao criar avaliação: ' + error.message);
      }

      return reply.status(201).send({
        success: true,
        message: 'Avaliação enviada com sucesso',
        data: avaliacao
      });
    } catch (error) {
      return reply.status(400).send({
        success: false,
        error: error.message
      });
    }
  });

  /**
   * @swagger
   * /api/avaliacoes:
   *   get:
   *     tags: [avaliacoes]
   *     summary: Listar avaliações (com filtros)
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
   *         name: categoria
   *         schema:
   *           type: string
   *           enum: [atendimento, qualidade, ambiente, tempo, preco]
   *       - in: query
   *         name: rating_min
   *         schema:
   *           type: integer
   *           minimum: 1
   *       - in: query
   *         name: rating_max
   *         schema:
   *           type: integer
   *           maximum: 5
   *       - in: query
   *         name: data_inicio
   *         schema:
   *           type: string
   *           format: date
   *       - in: query
   *         name: data_fim
   *         schema:
   *           type: string
   *           format: date
   *     responses:
   *       200:
   *         description: Lista de avaliações
   *       403:
   *         description: Acesso negado
   */
  fastify.get('/', {
    preValidation: [fastify.authenticate, checkAdminOrGerenteRole]
  }, async (request, reply) => {
    try {
      const {
        barbearia_id,
        barbeiro_id,
        categoria,
        rating_min,
        rating_max,
        data_inicio,
        data_fim
      } = request.query;

      let query = supabase
        .from('avaliacoes')
        .select(`
          *,
          cliente:clientes(nome, telefone),
          barbearia:barbearias(nome),
          barbeiro:users(nome)
        `)
        .order('created_at', { ascending: false });

      // Aplicar filtros
      if (barbearia_id) {
        query = query.eq('barbearia_id', barbearia_id);
      }

      if (barbeiro_id) {
        query = query.eq('barbeiro_id', barbeiro_id);
      }

      if (categoria) {
        query = query.eq('categoria', categoria);
      }

      if (rating_min) {
        query = query.gte('rating', rating_min);
      }

      if (rating_max) {
        query = query.lte('rating', rating_max);
      }

      if (data_inicio) {
        query = query.gte('created_at', data_inicio);
      }

      if (data_fim) {
        query = query.lte('created_at', data_fim);
      }

      const { data: avaliacoes, error } = await query;

      if (error) {
        throw new Error('Erro ao buscar avaliações');
      }

      // Calcular estatísticas
      const totalAvaliacoes = avaliacoes.length;
      const mediaRating = totalAvaliacoes > 0 
        ? avaliacoes.reduce((sum, av) => sum + av.rating, 0) / totalAvaliacoes 
        : 0;

      const estatisticas = {
        total: totalAvaliacoes,
        media_rating: Math.round(mediaRating * 10) / 10,
        por_rating: {
          1: avaliacoes.filter(av => av.rating === 1).length,
          2: avaliacoes.filter(av => av.rating === 2).length,
          3: avaliacoes.filter(av => av.rating === 3).length,
          4: avaliacoes.filter(av => av.rating === 4).length,
          5: avaliacoes.filter(av => av.rating === 5).length
        }
      };

      return reply.send({
        success: true,
        data: {
          avaliacoes,
          estatisticas
        }
      });
    } catch (error) {
      return reply.status(400).send({
        success: false,
        error: error.message
      });
    }
  });
}

module.exports = avaliacaoRoutes; 