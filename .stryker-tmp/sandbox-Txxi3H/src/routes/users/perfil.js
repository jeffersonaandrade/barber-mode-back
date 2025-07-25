// @ts-nocheck
const { checkAdminRole } = require('../../middlewares/rolePermissions');
const UserService = require('../../services/userService');

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [users]
 *     summary: Listar todos os usuários (ADMIN)
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Lista de usuários
 *       403:
 *         description: Acesso negado
 */
async function perfilRoutes(fastify, options) {
  // Instanciar serviço de usuários
  const userService = new UserService(fastify.supabase);

  // Listar todos os usuários (ADMIN)
  fastify.get('/', {
    preHandler: [fastify.authenticate, checkAdminRole]
  }, async (request, reply) => {
    try {
      const resultado = await userService.listarUsuarios();
      
      return reply.status(200).send({
        success: true,
        data: resultado
      });
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  });

  /**
   * @swagger
   * /api/users/{id}:
   *   put:
   *     tags: [users]
   *     summary: Atualizar usuário (ADMIN)
   *     security:
   *       - Bearer: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               nome: { type: string }
   *               email: { type: string }
   *               role: { type: string, enum: [admin, gerente, barbeiro] }
   *               ativo: { type: boolean }
   *     responses:
   *       200:
   *         description: Usuário atualizado com sucesso
   *       403:
   *         description: Acesso negado
   */
  fastify.put('/:id', {
    preHandler: [fastify.authenticate, checkAdminRole]
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      const { nome, email, role, ativo } = request.body;
      
      // Usar serviço para atualizar usuário
      const resultado = await userService.atualizarUsuario(id, { nome, email, role, ativo });
      
      return reply.status(200).send({
        success: true,
        message: 'Usuário atualizado com sucesso',
        data: {
          user: resultado
        }
      });
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      
      if (error.message.includes('Usuário não encontrado')) {
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

  /**
   * @swagger
   * /api/users/{id}:
   *   delete:
   *     tags: [users]
   *     summary: Deletar usuário (ADMIN)
   *     security:
   *       - Bearer: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: Usuário deletado com sucesso
   *       403:
   *         description: Acesso negado
   */
  fastify.delete('/:id', {
    preHandler: [fastify.authenticate, checkAdminRole]
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      const adminId = request.user.id;
      
      // Usar serviço para deletar usuário
      const resultado = await userService.deletarUsuario(id, adminId);
      
      return reply.status(200).send({
        success: true,
        message: 'Usuário deletado com sucesso',
        data: {
          user: resultado
        }
      });
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      
      if (error.message.includes('Usuário não encontrado')) {
        return reply.status(404).send({
          success: false,
          error: error.message
        });
      }
      
      if (error.message.includes('próprio usuário')) {
        return reply.status(400).send({
          success: false,
          error: error.message
        });
      }
      
      if (error.message.includes('relações ativas')) {
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

module.exports = perfilRoutes; 