const { supabase } = require('../config/database');
const { barbeariaSchema, barbeariaUpdateSchema } = require('../schemas/barbearia');
const { checkAdminRole } = require('../middlewares/rolePermissions');

async function barbeariaRoutes(fastify, options) {
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
  fastify.get('/', async (request, reply) => {
    try {
      const { data: barbearias, error } = await supabase
        .from('barbearias')
        .select('id, nome')
        .eq('ativo', true)
        .order('nome');

      if (error) {
        throw new Error('Erro ao buscar barbearias');
      }

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
  fastify.get('/:id', async (request, reply) => {
    try {
      const { id } = request.params;

      const { data: barbearia, error } = await supabase
        .from('barbearias')
        .select('*')
        .eq('id', id)
        .eq('ativo', true)
        .single();

      if (error || !barbearia) {
        return reply.status(404).send({
          success: false,
          error: 'Barbearia não encontrada'
        });
      }

      return reply.send({
        success: true,
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
  fastify.post('/', {
    preValidation: [fastify.authenticate, checkAdminRole],
    schema: barbeariaSchema
  }, async (request, reply) => {
    try {
      const barbeariaData = request.body;

      const { data: barbearia, error } = await supabase
        .from('barbearias')
        .insert(barbeariaData)
        .select()
        .single();

      if (error) {
        throw new Error('Erro ao criar barbearia: ' + error.message);
      }

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
  fastify.put('/:id', {
    preValidation: [fastify.authenticate, checkAdminRole],
    schema: barbeariaUpdateSchema
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      const updateData = request.body;

      const { data: barbearia, error } = await supabase
        .from('barbearias')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error('Erro ao atualizar barbearia');
      }

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
  fastify.post('/:id/fila/proximo', {
    preValidation: [fastify.authenticate]
  }, async (request, reply) => {
    try {
      const { id: barbearia_id } = request.params;
      const userId = request.user.id;

      // Verificar se o usuário é um barbeiro ativo na barbearia
      const { data: barbeiroAtivo, error: barbeiroError } = await supabase
        .from('barbeiros_barbearias')
        .select('id, ativo')
        .eq('user_id', userId)
        .eq('barbearia_id', barbearia_id)
        .eq('ativo', true)
        .single();

      if (barbeiroError || !barbeiroAtivo) {
        return reply.status(403).send({
          success: false,
          error: 'Você não está ativo nesta barbearia'
        });
      }

      // Buscar próximo cliente na fila
      // Prioridade: 1) Clientes específicos do barbeiro, 2) Fila geral
      const { data: proximoCliente, error: clienteError } = await supabase
        .from('fila')
        .select('*')
        .eq('barbearia_id', barbearia_id)
        .in('status', ['aguardando', 'proximo'])
        .or(`barbeiro_id.eq.${userId},barbeiro_id.is.null`)
        .order('barbeiro_id', { ascending: false }) // Clientes específicos primeiro
        .order('posicao', { ascending: true })
        .limit(1)
        .single();

      if (clienteError || !proximoCliente) {
        return reply.status(404).send({
          success: false,
          error: 'Não há clientes aguardando na fila'
        });
      }

      // Atualizar status do cliente para 'proximo'
      const { data: clienteAtualizado, error: updateError } = await supabase
        .from('fila')
        .update({
          status: 'proximo',
          barbeiro_id: userId,
          data_atendimento: new Date().toISOString()
        })
        .eq('id', proximoCliente.id)
        .select()
        .single();

      if (updateError) {
        console.error('Erro ao atualizar status do cliente:', updateError);
        return reply.status(500).send({
          success: false,
          error: 'Erro interno do servidor'
        });
      }

      return reply.status(200).send({
        success: true,
        message: 'Próximo cliente chamado',
        data: clienteAtualizado
      });

    } catch (error) {
      console.error('Erro ao chamar próximo cliente:', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
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
  fastify.delete('/:id', {
    preValidation: [fastify.authenticate, checkAdminRole]
  }, async (request, reply) => {
    try {
      const { id } = request.params;

      const { error } = await supabase
        .from('barbearias')
        .update({ ativo: false })
        .eq('id', id);

      if (error) {
        throw new Error('Erro ao remover barbearia');
      }

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

module.exports = barbeariaRoutes; 