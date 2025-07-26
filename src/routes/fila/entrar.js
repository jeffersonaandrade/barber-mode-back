const FilaService = require('../../services/filaService');
const { validateFilaEntry } = require('../../middlewares/validation');

/**
 * @swagger
 * /api/fila/entrar:
 *   post:
 *     tags: [fila]
 *     summary: Adicionar cliente à fila (PÚBLICO)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, telefone, barbearia_id]
 *             properties:
 *               nome: { type: string }
 *               telefone: { type: string }
 *               barbearia_id: { type: integer }
 *               barbeiro_id: { type: string, format: uuid }
 *     responses:
 *       201:
 *         description: Cliente adicionado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Barbearia não encontrada
 */
async function entrarNaFila(fastify, options) {
  // Instanciar serviço de fila
  const filaService = new FilaService(fastify.supabase);

  fastify.post('/fila/entrar', {
    // preHandler: [validateFilaEntry] // REMOVIDO TEMPORARIAMENTE
  }, async (request, reply) => {
    try {
      const { nome, telefone, barbearia_id, barbeiro_id } = request.body;
      
      // Usar serviço para adicionar cliente na fila
      const resultado = await filaService.adicionarClienteNaFila({
        nome,
        telefone,
        barbearia_id,
        barbeiro_id
      });
    
      return reply.status(201).send({
        success: true,
        message: 'Cliente adicionado à fila com sucesso',
        data: resultado
      });
    } catch (error) {
      console.error('Erro em entrar na fila:', error);
      
      // Mapear erros específicos para códigos HTTP apropriados
      if (error.message.includes('Barbearia não encontrada')) {
        return reply.status(404).send({ 
          success: false, 
          error: error.message 
        });
      }
      
      if (error.message.includes('Barbeiro especificado')) {
        return reply.status(400).send({ 
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

module.exports = entrarNaFila; 