const { getFilaService } = require('../../services/filaService');
const { getWhatsAppService } = require('../../services/whatsappService');

/**
 * @swagger
 * /api/fila/proximo/{barbearia_id}:
 *   post:
 *     tags: [fila]
 *     summary: Chamar próximo cliente da fila
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: barbearia_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da barbearia
 *     responses:
 *       200:
 *         description: Próximo cliente chamado com sucesso
 *       400:
 *         description: Erro na requisição
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
async function chamarProximo(request, reply) {
    try {
      const { barbearia_id } = request.params;
    const filaService = getFilaService();
    
    const resultado = await filaService.chamarProximo(barbearia_id);
    
    if (resultado.success) {
      // Enviar notificação WhatsApp se houver cliente
      if (resultado.data.cliente) {
        const whatsappService = getWhatsAppService();
        await whatsappService.notificarVezChegou(
          resultado.data.cliente.nome,
          resultado.data.barbeiro?.nome || 'Barbeiro',
          resultado.data.cliente.telefone
        );
      }
    }
    
    return reply.send(resultado);
    } catch (error) {
    console.error('❌ [FILA] Erro ao chamar próximo:', error);
        return reply.status(500).send({ 
          success: false, 
      error: 'Erro interno do servidor' 
    });
  }
}

/**
 * @swagger
 * /api/fila/iniciar-atendimento/{barbearia_id}/{cliente_id}:
 *   post:
 *     tags: [fila]
 *     summary: Iniciar atendimento de um cliente
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: barbearia_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da barbearia
 *       - in: path
 *         name: cliente_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do cliente
 *     responses:
 *       200:
 *         description: Atendimento iniciado com sucesso
 *       400:
 *         description: Erro na requisição
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
async function iniciarAtendimento(request, reply) {
  try {
    const { barbearia_id, cliente_id } = request.params;
    const filaService = getFilaService();
    
    const resultado = await filaService.iniciarAtendimento(barbearia_id, cliente_id);
    return reply.send(resultado);
      } catch (error) {
    console.error('❌ [FILA] Erro ao iniciar atendimento:', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
}

/**
 * @swagger
 * /api/fila/finalizar/{barbearia_id}:
 *   post:
 *     tags: [fila]
 *     summary: Finalizar atendimento atual
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: barbearia_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da barbearia
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               link_avaliacao:
 *                 type: string
 *                 description: Link para avaliação
 *     responses:
 *       200:
 *         description: Atendimento finalizado com sucesso
 *       400:
 *         description: Erro na requisição
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
async function finalizarAtendimento(request, reply) {
    try {
      const { barbearia_id } = request.params;
    const { link_avaliacao } = request.body;
    const filaService = getFilaService();
    
    const resultado = await filaService.finalizarAtendimento(barbearia_id, link_avaliacao);
    
    if (resultado.success && resultado.data.cliente) {
      // Enviar link de avaliação via WhatsApp
        const whatsappService = getWhatsAppService();
      await whatsappService.enviarAvaliacao(
        resultado.data.cliente.nome,
        link_avaliacao,
        resultado.data.cliente.telefone
      );
    }
    
    return reply.send(resultado);
    } catch (error) {
    console.error('❌ [FILA] Erro ao finalizar atendimento:', error);
        return reply.status(500).send({ 
          success: false, 
      error: 'Erro interno do servidor' 
    });
  }
}

/**
 * @swagger
 * /api/fila/finalizar-atendimento/{cliente_id}:
 *   put:
 *     tags: [fila]
 *     summary: Finalizar atendimento de cliente específico
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: cliente_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               link_avaliacao:
 *                 type: string
 *                 description: Link para avaliação
 *     responses:
 *       200:
 *         description: Atendimento finalizado com sucesso
 *       400:
 *         description: Erro na requisição
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
async function finalizarAtendimentoCliente(request, reply) {
  try {
    const { cliente_id } = request.params;
    const { link_avaliacao } = request.body;
    const filaService = getFilaService();
    
    const resultado = await filaService.finalizarAtendimentoCliente(cliente_id, link_avaliacao);
    
    if (resultado.success && resultado.data.cliente) {
      // Enviar link de avaliação via WhatsApp
      const whatsappService = getWhatsAppService();
      await whatsappService.enviarAvaliacao(
        resultado.data.cliente.nome,
        link_avaliacao,
        resultado.data.cliente.telefone
      );
    }
    
    return reply.send(resultado);
    } catch (error) {
    console.error('❌ [FILA] Erro ao finalizar atendimento do cliente:', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
}

/**
 * @swagger
 * /api/fila/remover/{barbearia_id}/{cliente_id}:
 *   delete:
 *     tags: [fila]
 *     summary: Remover cliente da fila
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: barbearia_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da barbearia
 *       - in: path
 *         name: cliente_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do cliente
 *     responses:
 *       200:
 *         description: Cliente removido com sucesso
 *       400:
 *         description: Erro na requisição
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
async function removerCliente(request, reply) {
  try {
    const { barbearia_id, cliente_id } = request.params;
    const filaService = getFilaService();
    
    const resultado = await filaService.removerCliente(barbearia_id, cliente_id);
    return reply.send(resultado);
    } catch (error) {
    console.error('❌ [FILA] Erro ao remover cliente:', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
}

module.exports = async function (fastify, opts) {
  // Middleware de autenticação para todas as rotas
  fastify.addHook('preHandler', fastify.authenticate);
  
  // Rotas de gerenciamento da fila
  fastify.post('/proximo/:barbearia_id', chamarProximo);
  fastify.post('/iniciar-atendimento/:barbearia_id/:cliente_id', iniciarAtendimento);
  fastify.post('/finalizar/:barbearia_id', finalizarAtendimento);
  fastify.put('/finalizar-atendimento/:cliente_id', finalizarAtendimentoCliente);
  fastify.delete('/remover/:barbearia_id/:cliente_id', removerCliente);
}; 