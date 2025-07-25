// @ts-nocheck
const BarbeariaService = require('../../services/barbeariaService');
const { barbeariaSchema, barbeariaUpdateSchema } = require('../../schemas/barbearia');
const { checkAdminRole } = require('../../middlewares/access');

/**
 * @swagger
 * /api/barbearias:
 *   post:
 *     tags: [barbearias]
 *     summary: Criar barbearia (apenas admin)
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Barbearia'
 *     responses:
 *       201:
 *         description: Barbearia criada
 *       400:
 *         description: Dados inválidos
 *       403:
 *         description: Acesso negado
 */
async function gerenciarBarbearias(fastify, options) {
  // Instanciar serviço de barbearias
  const barbeariaService = new BarbeariaService(fastify.supabase);

  // Criar barbearia (ADMIN)
  fastify.post('/', {
    preValidation: [fastify.authenticate, checkAdminRole],
    schema: barbeariaSchema
  }, async (request, reply) => {
    try {
      const barbeariaData = request.body;
      const barbearia = await barbeariaService.criarBarbearia(barbeariaData);

      return reply.status(201).send({
        success: true,
        message: 'Barbearia criada com sucesso',
        data: barbearia
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
   *   put:
   *     tags: [barbearias]
   *     summary: Atualizar barbearia (apenas admin)
   *     security:
   *       - Bearer: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/BarbeariaUpdate'
   *     responses:
   *       200:
   *         description: Barbearia atualizada
   *       400:
   *         description: Dados inválidos
   *       403:
   *         description: Acesso negado
   */
  // Atualizar barbearia (ADMIN)
  fastify.put('/:id', {
    preValidation: [fastify.authenticate, checkAdminRole],
    schema: barbeariaUpdateSchema
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      const updateData = request.body;
      const barbearia = await barbeariaService.atualizarBarbearia(id, updateData);

      return reply.send({
        success: true,
        message: 'Barbearia atualizada com sucesso',
        data: barbearia
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
   *   delete:
   *     tags: [barbearias]
   *     summary: Remover barbearia (apenas admin)
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
   *         description: Barbearia removida
   *       403:
   *         description: Acesso negado
   */
  // Remover barbearia (ADMIN)
  fastify.delete('/:id', {
    preValidation: [fastify.authenticate, checkAdminRole]
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      await barbeariaService.removerBarbearia(id);

      return reply.send({
        success: true,
        message: 'Barbearia removida com sucesso'
      });
    } catch (error) {
      return reply.status(400).send({
        success: false,
        error: error.message
      });
    }
  });
}

module.exports = gerenciarBarbearias; 