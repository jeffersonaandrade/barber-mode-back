const { checkAdminOrGerenteRole } = require('../../middlewares/access');
const { validateBarbeiroAction } = require('../../middlewares/validation');
const UserService = require('../../services/userService');

/**
 * @swagger
 * /api/users/barbeiros/ativar:
 *   post:
 *     tags: [users]
 *     summary: Ativar barbeiro em uma barbearia
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [user_id, barbearia_id]
 *             properties:
 *               user_id: { type: string, format: uuid }
 *               barbearia_id: { type: integer }
 *     responses:
 *       200:
 *         description: Barbeiro ativado com sucesso
 *       403:
 *         description: Acesso negado
 */
async function gerenciamentoRoutes(fastify, options) {
  // Instanciar serviço de usuários
  const userService = new UserService(fastify.supabase);

  // Atribuir gerente a uma barbearia (ADMIN)
  fastify.post('/gerentes/atribuir', {
    preHandler: [fastify.authenticate, checkAdminOrGerenteRole]
  }, async (request, reply) => {
    try {
      const { user_id, barbearia_id } = request.body;
      
      // Verificar se o usuário é admin
      if (request.user.role !== 'admin') {
        return reply.status(403).send({
          success: false,
          error: 'Apenas administradores podem atribuir gerentes'
        });
      }
      
      // Usar serviço para atribuir gerente
      const resultado = await userService.atribuirGerente({ user_id, barbearia_id });
      
      return reply.status(200).send({
        success: true,
        message: 'Gerente atribuído com sucesso',
        data: {
          gerente: resultado.gerente,
          barbearia: resultado.barbearia
        }
      });
    } catch (error) {
      console.error('Erro ao atribuir gerente:', error);
      
      if (error.message.includes('Usuário não encontrado')) {
        return reply.status(404).send({
          success: false,
          error: error.message
        });
      }
      
      if (error.message.includes('Barbearia não encontrada')) {
        return reply.status(404).send({
          success: false,
          error: error.message
        });
      }
      
      if (error.message.includes('não é gerente')) {
        return reply.status(400).send({
          success: false,
          error: error.message
        });
      }
      
      if (error.message.includes('já é gerente')) {
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

  // Remover gerente de uma barbearia (ADMIN)
  fastify.post('/gerentes/remover', {
    preHandler: [fastify.authenticate, checkAdminOrGerenteRole]
  }, async (request, reply) => {
    try {
      const { barbearia_id } = request.body;
      
      // Verificar se o usuário é admin
      if (request.user.role !== 'admin') {
        return reply.status(403).send({
          success: false,
          error: 'Apenas administradores podem remover gerentes'
        });
      }
      
      // Usar serviço para remover gerente
      const resultado = await userService.removerGerente({ barbearia_id });
      
      return reply.status(200).send({
        success: true,
        message: 'Gerente removido com sucesso',
        data: {
          barbearia: resultado.barbearia
        }
      });
    } catch (error) {
      console.error('Erro ao remover gerente:', error);
      
      if (error.message.includes('Barbearia não encontrada')) {
        return reply.status(404).send({
          success: false,
          error: error.message
        });
      }
      
      if (error.message.includes('não tem gerente')) {
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

  // Ativar barbeiro em uma barbearia
  fastify.post('/barbeiros/ativar', {
    preHandler: [fastify.authenticate, checkAdminOrGerenteRole, validateBarbeiroAction]
  }, async (request, reply) => {
    try {
      const { user_id, barbearia_id } = request.body;
      
      // Usar serviço para ativar barbeiro
      const resultado = await userService.ativarBarbeiro({ user_id, barbearia_id });
      
      const statusCode = resultado.acao === 'reativado' ? 200 : 201;
      const message = resultado.acao === 'reativado' ? 'Barbeiro reativado com sucesso' : 'Barbeiro ativado com sucesso';
      
      return reply.status(statusCode).send({
        success: true,
        message,
        data: {
          barbeiro: resultado.barbeiro,
          barbearia: resultado.barbearia
        }
      });
    } catch (error) {
      console.error('Erro ao ativar barbeiro:', error);
      
      if (error.message.includes('Usuário não encontrado')) {
        return reply.status(404).send({
          success: false,
          error: error.message
        });
      }
      
      if (error.message.includes('Barbearia não encontrada')) {
        return reply.status(404).send({
          success: false,
          error: error.message
        });
      }
      
      if (error.message.includes('já está ativo')) {
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

  /**
   * @swagger
   * /api/users/barbeiros/desativar:
   *   post:
   *     tags: [users]
   *     summary: Desativar barbeiro em uma barbearia
   *     security:
   *       - Bearer: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [user_id, barbearia_id]
   *             properties:
   *               user_id: { type: string, format: uuid }
   *               barbearia_id: { type: integer }
   *     responses:
   *       200:
   *         description: Barbeiro desativado com sucesso
   *       403:
   *         description: Acesso negado
   */
  fastify.post('/barbeiros/desativar', {
    preHandler: [fastify.authenticate, checkAdminOrGerenteRole, validateBarbeiroAction]
  }, async (request, reply) => {
    try {
      const { user_id, barbearia_id } = request.body;
      
      // Usar serviço para desativar barbeiro
      const resultado = await userService.desativarBarbeiro({ user_id, barbearia_id });
      
      return reply.status(200).send({
        success: true,
        message: 'Barbeiro desativado com sucesso',
        data: {
          barbeiro: resultado.barbeiro,
          barbearia: resultado.barbearia
        }
      });
    } catch (error) {
      console.error('Erro ao desativar barbeiro:', error);
      
      if (error.message.includes('Relação barbeiro-barbearia não encontrada')) {
        return reply.status(404).send({
          success: false,
          error: error.message
        });
      }
      
      if (error.message.includes('já está inativo')) {
        return reply.status(400).send({
          success: false,
          error: error.message
        });
      }
      
      if (error.message.includes('atendendo um cliente')) {
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

module.exports = gerenciamentoRoutes; 