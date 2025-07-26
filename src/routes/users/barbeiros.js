const { checkAdminRole, checkAdminOrGerenteRole, checkBarbeiroRole } = require('../../middlewares/rolePermissions');
const UserService = require('../../services/userService');

/**
 * @swagger
 * /api/users/barbeiros:
 *   get:
 *     tags: [users]
 *     summary: Listar barbeiros com filtros (unificado)
 *     parameters:
 *       - in: query
 *         name: barbearia_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ativo, inativo, disponivel]
 *       - in: query
 *         name: public
 *         schema:
 *           type: boolean
 *           description: Se true, retorna dados limitados para clientes
 *     responses:
 *       200:
 *         description: Lista de barbeiros
 */
async function barbeirosRoutes(fastify, options) {
  // Instanciar serviço de usuários
  const userService = new UserService(fastify.supabase);

  // Listar barbeiros com filtros (unificado)
  fastify.get('/barbeiros', async (request, reply) => {
    try {
      const { barbearia_id, status = 'ativo', public: isPublic = false } = request.query;
      
      // Se não for público, requer autenticação
      if (!isPublic) {
        await fastify.authenticate(request, reply);
        await fastify.authorize(['admin', 'gerente', 'barbeiro'])(request, reply);
      }
      
      // barbearia_id é opcional - se não fornecido, retorna barbeiros de todas as barbearias
      
      // Usar serviço para listar barbeiros
      const resultado = await userService.listarBarbeiros({
        barbearia_id,
        status,
        isPublic
      });
      
      return reply.status(200).send({
        success: true,
        data: resultado
      });
    } catch (error) {
      console.error('Erro ao listar barbeiros:', error);
      
      if (error.message.includes('Barbearia não encontrada')) {
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
   * /api/users/barbeiros/meu-status:
   *   get:
   *     tags: [users]
   *     summary: Obter status do barbeiro logado
   *     security:
   *       - Bearer: []
   *     responses:
   *       200:
   *         description: Status do barbeiro
   *       403:
   *         description: Acesso negado
   */
  fastify.get('/barbeiros/meu-status', {
    preHandler: [fastify.authenticate, checkBarbeiroRole]
  }, async (request, reply) => {
    try {
      const userId = request.user.id;
      
      // Usar serviço para obter status do barbeiro
      const resultado = await userService.obterStatusBarbeiro(userId);
      
      return reply.status(200).send({
        success: true,
        data: resultado
      });
    } catch (error) {
      console.error('Erro ao obter status do barbeiro:', error);
      
      if (error.message.includes('Barbeiro não encontrado')) {
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
   * /api/users/barbeiros/alterar-status:
   *   post:
   *     tags: [users]
   *     summary: Barbeiro altera seu próprio status (ativo/inativo)
   *     security:
   *       - Bearer: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [barbearia_id, ativo]
   *             properties:
   *               barbearia_id: { type: integer }
   *               ativo: { type: boolean }
   *     responses:
   *       200:
   *         description: Status alterado com sucesso
   *       403:
   *         description: Acesso negado
   *       404:
   *         description: Barbearia não encontrada
   */
  fastify.post('/barbeiros/alterar-status', {
    preHandler: [fastify.authenticate, checkBarbeiroRole]
  }, async (request, reply) => {
    try {
      const userId = request.user.id;
      const { barbearia_id, ativo } = request.body;
      
      if (barbearia_id === undefined || ativo === undefined) {
        return reply.status(400).send({
          success: false,
          error: 'barbearia_id e ativo são obrigatórios'
        });
      }
      
      // Usar serviço para alterar status do barbeiro
      const resultado = await userService.alterarStatusBarbeiro({
        user_id: userId,
        barbearia_id,
        ativo
      });
      
      const message = ativo ? 'Você está agora ATIVO para atendimentos' : 'Você está agora INATIVO para atendimentos';
      
      return reply.status(200).send({
        success: true,
        message,
        data: resultado
      });
    } catch (error) {
      console.error('Erro ao alterar status do barbeiro:', error);
      
      if (error.message.includes('Barbearia não encontrada')) {
        return reply.status(404).send({
          success: false,
          error: error.message
        });
      }
      
      if (error.message.includes('não está associado')) {
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
   * /api/users/barbeiros/minhas-barbearias:
   *   get:
   *     tags: [users]
   *     summary: Listar barbearias onde o barbeiro trabalha
   *     security:
   *       - Bearer: []
   *     responses:
   *       200:
   *         description: Lista de barbearias do barbeiro
   *       403:
   *         description: Acesso negado
   */
  fastify.get('/barbeiros/minhas-barbearias', {
    preHandler: [fastify.authenticate, checkBarbeiroRole]
  }, async (request, reply) => {
    try {
      const userId = request.user.id;
      
      // Usar serviço para listar barbearias do barbeiro
      const resultado = await userService.listarBarbeariasDoBarbeiro(userId);
      
      return reply.status(200).send({
        success: true,
        data: resultado
      });
    } catch (error) {
      console.error('Erro ao listar barbearias do barbeiro:', error);
      
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  });

  /**
   * @swagger
   * /api/users/barbeiros/desativar-todos:
   *   post:
   *     tags: [users]
   *     summary: Desativar todos os barbeiros de uma barbearia (ADMIN/GERENTE)
   *     security:
   *       - Bearer: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [barbearia_id]
   *             properties:
   *               barbearia_id: { type: integer }
   *     responses:
   *       200:
   *         description: Todos os barbeiros desativados com sucesso
   *       403:
   *         description: Acesso negado
   *       404:
   *         description: Barbearia não encontrada
   */
  fastify.post('/barbeiros/desativar-todos', {
    preHandler: [fastify.authenticate, checkAdminOrGerenteRole]
  }, async (request, reply) => {
    try {
      const userId = request.user.id;
      const { barbearia_id } = request.body;
      
      if (!barbearia_id) {
        return reply.status(400).send({
          success: false,
          error: 'barbearia_id é obrigatório'
        });
      }
      
      // Usar serviço para desativar todos os barbeiros
      const resultado = await userService.desativarTodosBarbeiros(barbearia_id, userId);
      
      return reply.status(200).send({
        success: true,
        message: resultado.message,
        data: resultado
      });
    } catch (error) {
      console.error('Erro ao desativar todos os barbeiros:', error);
      
      if (error.message.includes('Barbearia não encontrada')) {
        return reply.status(404).send({
          success: false,
          error: error.message
        });
      }
      
      if (error.message.includes('está inativa')) {
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

module.exports = barbeirosRoutes; 