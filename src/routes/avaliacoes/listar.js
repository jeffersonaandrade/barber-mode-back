const AvaliacaoService = require('../../services/avaliacaoService');
const { checkAdminOrGerenteRole } = require('../../middlewares/access');

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
async function listarAvaliacoes(fastify, options) {
  // Instanciar serviço de avaliações
  const avaliacaoService = new AvaliacaoService(fastify.supabase);

  // Listar avaliações com filtros (ADMIN/GERENTE)
  fastify.get('/', {
    preValidation: [fastify.authenticate, checkAdminOrGerenteRole]
  }, async (request, reply) => {
    try {
      const filtros = request.query;
      const resultado = await avaliacaoService.listarAvaliacoes(filtros);

      return reply.send({
        success: true,
        data: resultado
      });
    } catch (error) {
      return reply.status(400).send({
        success: false,
        error: error.message
      });
    }
  });
}

module.exports = listarAvaliacoes; 