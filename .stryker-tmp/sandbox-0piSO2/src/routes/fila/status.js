// @ts-nocheck
const FilaService = require('../../services/filaService');

/**
 * @swagger
 * /api/fila/status/{token}:
 *   get:
 *     tags: [fila]
 *     summary: Verificar status do cliente na fila
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status do cliente
 *       404:
 *         description: Cliente não encontrado
 */
async function verificarStatus(fastify, options) {
  // Instanciar serviço de fila
  const filaService = new FilaService(fastify.supabase);

  fastify.get('/fila/status/:token', {
    schema: {
      description: 'Verificar status do cliente na fila',
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
            data: {
              type: 'object',
              properties: {
                cliente: { type: 'object' },
                barbearia: { type: 'object' },
                posicao_atual: { type: 'integer' },
                tempo_estimado: { type: 'integer' }
              }
            }
          }
        }
      }
    }
    // SEM autenticação - endpoint público para clientes
  }, async (request, reply) => {
    try {
      const { token } = request.params;
      
      // Usar serviço para verificar status do cliente
      const resultado = await filaService.verificarStatusCliente(token);
      
      return reply.status(200).send({
        success: true,
        data: resultado
      });
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      
      if (error.message.includes('Cliente não encontrado')) {
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

module.exports = verificarStatus; 