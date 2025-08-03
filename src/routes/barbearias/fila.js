const BarbeariaService = require('../../services/barbeariaService');

/**
 * @swagger
 * /api/barbearias/{id}/fila/proximo:
 *   post:
 *     tags: [barbearias]
 *     summary: Chamar próximo cliente da fila
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Próximo cliente chamado
 *       403:
 *         description: Barbeiro não está ativo na barbearia
 *       404:
 *         description: Não há clientes na fila
 */
async function filaBarbearia(fastify, options) {
  // Instanciar serviço de barbearias
  const barbeariaService = new BarbeariaService(fastify.supabase);

  // Chamar próximo cliente da fila
  fastify.post('/:id/fila/proximo', {
    preValidation: [fastify.authenticate]
  }, async (request, reply) => {
    try {
      const { id: barbearia_id } = request.params;
      const userId = request.user.id;

      const proximoCliente = await barbeariaService.chamarProximoCliente(barbearia_id, userId);

      return reply.status(200).send({
        success: true,
        message: 'Próximo cliente chamado',
        data: proximoCliente
      });

    } catch (error) {
      console.error('Erro ao chamar próximo cliente:', error);
      
      if (error.message.includes('não está ativo')) {
        return reply.status(403).send({
          success: false,
          error: error.message
        });
      }
      
      if (error.message.includes('Não há clientes')) {
        return reply.status(404).send({
          success: false,
          error: error.message
        });
      }
      
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  });
}

module.exports = filaBarbearia; 