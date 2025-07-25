// @ts-nocheck
const BarbeariaService = require('../../services/barbeariaService');

/**
 * @swagger
 * /api/barbearias:
 *   get:
 *     tags: [barbearias]
 *     summary: Listar barbearias (PÚBLICO)
 *     responses:
 *       200:
 *         description: Lista de barbearias ativas
 */
async function listarBarbearias(fastify, options) {
  // Instanciar serviço de barbearias
  const barbeariaService = new BarbeariaService(fastify.supabase);

  // Listar todas as barbearias ativas (PÚBLICO)
  fastify.get('/', async (request, reply) => {
    try {
      const barbearias = await barbeariaService.listarBarbearias();

      return reply.send({
        success: true,
        data: barbearias
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
   * /api/barbearias/{id}:
   *   get:
   *     tags: [barbearias]
   *     summary: Buscar barbearia por ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Dados da barbearia
   *       404:
   *         description: Barbearia não encontrada
   */
  // Buscar barbearia por ID (PÚBLICO)
  fastify.get('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const barbearia = await barbeariaService.buscarBarbeariaPorId(id);

      return reply.send({
        success: true,
        data: barbearia
      });
    } catch (error) {
      if (error.message.includes('não encontrada')) {
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

module.exports = listarBarbearias; 