// @ts-nocheck
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
      
      if (!barbearia_id) {
        return reply.status(400).send({
          success: false,
          error: 'barbearia_id é obrigatório'
        });
      }
      
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
}

module.exports = barbeirosRoutes; 