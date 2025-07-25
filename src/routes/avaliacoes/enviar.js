const AvaliacaoService = require('../../services/avaliacaoService');

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
 *       404:
 *         description: Cliente não encontrado
 */
async function enviarAvaliacao(fastify, options) {
  // Instanciar serviço de avaliações
  const avaliacaoService = new AvaliacaoService(fastify.supabase);

  // Enviar avaliação (PÚBLICO)
  fastify.post('/', async (request, reply) => {
    try {
      const avaliacaoData = request.body;
      const avaliacao = await avaliacaoService.enviarAvaliacao(avaliacaoData);

      return reply.status(201).send({
        success: true,
        message: 'Avaliação enviada com sucesso',
        data: avaliacao
      });
    } catch (error) {
      if (error.message.includes('não encontrado')) {
        return reply.status(404).send({
          success: false,
          error: error.message
        });
      }
      
      return reply.status(400).send({
        success: false,
        error: error.message
      });
    }
  });
}

module.exports = enviarAvaliacao; 