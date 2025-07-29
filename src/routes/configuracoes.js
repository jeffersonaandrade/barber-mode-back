const { checkAdminRole, checkAdminOrGerenteRole } = require('../middlewares/rolePermissions');

/**
 * @swagger
 * /api/configuracoes/servicos:
 *   get:
 *     tags: [configuracoes]
 *     summary: Listar serviços da barbearia (PRIVADO)
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: query
 *         name: barbearia_id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de serviços
 *       403:
 *         description: Acesso negado
 */
async function configuracoesRoutes(fastify, options) {
  // Listar serviços da barbearia (PRIVADO)
  fastify.get('/configuracoes/servicos', {
    preHandler: [fastify.authenticate, checkAdminOrGerenteRole]
  }, async (request, reply) => {
    try {
      const { barbearia_id } = request.query;
      const userId = request.user.id;
      const userRole = request.user.role;
      
      // Verificar permissões
      if (userRole === 'gerente') {
        // Gerente só pode ver serviços da sua barbearia
        const { data: gerenteBarbearia } = await fastify.supabase
          .from('barbearias')
          .select('id')
          .eq('gerente_id', userId)
          .single();
          
        if (!gerenteBarbearia || (barbearia_id && parseInt(barbearia_id) !== gerenteBarbearia.id)) {
          return reply.status(403).send({
            success: false,
            error: 'Você só pode ver serviços da sua barbearia'
          });
        }
        
        // Forçar barbearia_id para gerente
        if (!barbearia_id) {
          barbearia_id = gerenteBarbearia.id;
        }
      }
      
      // Construir query
      let query = fastify.supabase
        .from('servicos')
        .select('*')
        .order('nome', { ascending: true });
      
      // Filtrar por barbearia se especificada
      if (barbearia_id) {
        query = query.eq('barbearia_id', barbearia_id);
      }
      
      const { data: servicos, error: servicosError } = await query;
      
      if (servicosError) {
        return reply.status(500).send({
          success: false,
          error: 'Erro interno do servidor'
        });
      }
      
      return reply.status(200).send({
        success: true,
        data: {
          servicos: servicos || []
        }
      });
    } catch (error) {
      console.error('Erro ao listar serviços:', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  });

  /**
   * @swagger
   * /api/configuracoes/servicos:
   *   post:
   *     tags: [configuracoes]
   *     summary: Criar novo serviço (PRIVADO)
   *     security:
   *       - Bearer: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [nome, preco, duracao, barbearia_id]
   *             properties:
   *               nome: { type: string }
   *               preco: { type: number }
   *               duracao: { type: integer }
   *               descricao: { type: string }
   *               barbearia_id: { type: integer }
   *     responses:
   *       201:
   *         description: Serviço criado com sucesso
   *       403:
   *         description: Acesso negado
   */
  fastify.post('/configuracoes/servicos', {
    preHandler: [fastify.authenticate, checkAdminOrGerenteRole]
  }, async (request, reply) => {
    try {
      const { nome, preco, duracao, descricao, barbearia_id } = request.body;
      const userId = request.user.id;
      const userRole = request.user.role;
      
      // Validações básicas
      if (!nome || !preco || !duracao || !barbearia_id) {
        return reply.status(400).send({
          success: false,
          error: 'Nome, preço, duração e barbearia_id são obrigatórios'
        });
      }
      
      if (preco <= 0) {
        return reply.status(400).send({
          success: false,
          error: 'Preço deve ser maior que zero'
        });
      }
      
      if (duracao <= 0) {
        return reply.status(400).send({
          success: false,
          error: 'Duração deve ser maior que zero'
        });
      }
      
      // Verificar permissões
      if (userRole === 'gerente') {
        // Gerente só pode criar serviços na sua barbearia
        const { data: gerenteBarbearia } = await fastify.supabase
          .from('barbearias')
          .select('id')
          .eq('gerente_id', userId)
          .single();
          
        if (!gerenteBarbearia || gerenteBarbearia.id !== barbearia_id) {
          return reply.status(403).send({
            success: false,
            error: 'Você só pode criar serviços na sua barbearia'
          });
        }
      }
      
      // Verificar se a barbearia existe
      const { data: barbearia, error: barbeariaError } = await fastify.supabase
        .from('barbearias')
        .select('id, nome, ativo')
        .eq('id', barbearia_id)
        .eq('ativo', true)
        .single();
        
      if (barbeariaError || !barbearia) {
        return reply.status(404).send({
          success: false,
          error: 'Barbearia não encontrada ou inativa'
        });
      }
      
      // Verificar se já existe um serviço com o mesmo nome na barbearia
      const { data: servicoExistente, error: servicoError } = await fastify.supabase
        .from('servicos')
        .select('id')
        .eq('nome', nome)
        .eq('barbearia_id', barbearia_id)
        .single();
        
      if (servicoExistente) {
        return reply.status(400).send({
          success: false,
          error: 'Já existe um serviço com este nome nesta barbearia'
        });
      }
      
      // Criar serviço
      const { data: novoServico, error: insertError } = await fastify.supabase
        .from('servicos')
        .insert({
          nome,
          preco,
          duracao,
          descricao: descricao || null,
          barbearia_id,
          ativo: true
        })
        .select()
        .single();
        
      if (insertError) {
        return reply.status(500).send({
          success: false,
          error: 'Erro interno do servidor'
        });
      }
      
      return reply.status(201).send({
        success: true,
        message: 'Serviço criado com sucesso',
        data: {
          servico: novoServico
        }
      });
    } catch (error) {
      console.error('Erro ao criar serviço:', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  });

  /**
   * @swagger
   * /api/configuracoes/servicos/{id}:
   *   put:
   *     tags: [configuracoes]
   *     summary: Atualizar serviço (PRIVADO)
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
   *               preco: { type: number }
   *               duracao: { type: integer }
   *               descricao: { type: string }
   *               ativo: { type: boolean }
   *     responses:
   *       200:
   *         description: Serviço atualizado com sucesso
   *       403:
   *         description: Acesso negado
   */
  fastify.put('/configuracoes/servicos/:id', {
    preHandler: [fastify.authenticate, checkAdminOrGerenteRole]
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      const { nome, preco, duracao, descricao, ativo } = request.body;
      const userId = request.user.id;
      const userRole = request.user.role;
      
      // Buscar serviço
      const { data: servico, error: servicoError } = await fastify.supabase
        .from('servicos')
        .select('*')
        .eq('id', id)
        .single();
        
      if (servicoError || !servico) {
        return reply.status(404).send({
          success: false,
          error: 'Serviço não encontrado'
        });
      }
      
      // Verificar permissões
      if (userRole === 'gerente') {
        // Gerente só pode editar serviços da sua barbearia
        const { data: gerenteBarbearia } = await fastify.supabase
          .from('barbearias')
          .select('id')
          .eq('gerente_id', userId)
          .single();
          
        if (!gerenteBarbearia || gerenteBarbearia.id !== servico.barbearia_id) {
          return reply.status(403).send({
            success: false,
            error: 'Você só pode editar serviços da sua barbearia'
          });
        }
      }
      
      // Preparar dados para atualização
      const updateData = {};
      if (nome !== undefined) updateData.nome = nome;
      if (preco !== undefined) updateData.preco = preco;
      if (duracao !== undefined) updateData.duracao = duracao;
      if (descricao !== undefined) updateData.descricao = descricao;
      if (ativo !== undefined) updateData.ativo = ativo;
      
      // Validações
      if (preco !== undefined && preco <= 0) {
        return reply.status(400).send({
          success: false,
          error: 'Preço deve ser maior que zero'
        });
      }
      
      if (duracao !== undefined && duracao <= 0) {
        return reply.status(400).send({
          success: false,
          error: 'Duração deve ser maior que zero'
        });
      }
      
      // Verificar se o novo nome já existe (se estiver sendo alterado)
      if (nome && nome !== servico.nome) {
        const { data: servicoExistente } = await fastify.supabase
          .from('servicos')
          .select('id')
          .eq('nome', nome)
          .eq('barbearia_id', servico.barbearia_id)
          .neq('id', id)
          .single();
          
        if (servicoExistente) {
          return reply.status(400).send({
            success: false,
            error: 'Já existe um serviço com este nome nesta barbearia'
          });
        }
      }
      
      // Atualizar serviço
      const { data: servicoAtualizado, error: updateError } = await fastify.supabase
        .from('servicos')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
        
      if (updateError) {
        return reply.status(500).send({
          success: false,
          error: 'Erro interno do servidor'
        });
      }
      
      return reply.status(200).send({
        success: true,
        message: 'Serviço atualizado com sucesso',
        data: {
          servico: servicoAtualizado
        }
      });
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  });

  /**
   * @swagger
   * /api/configuracoes/servicos/{id}:
   *   delete:
   *     tags: [configuracoes]
   *     summary: Deletar serviço (PRIVADO)
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
   *         description: Serviço deletado com sucesso
   *       403:
   *         description: Acesso negado
   */
  fastify.delete('/configuracoes/servicos/:id', {
    preHandler: [fastify.authenticate, checkAdminOrGerenteRole]
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      const userId = request.user.id;
      const userRole = request.user.role;
      
      // Buscar serviço
      const { data: servico, error: servicoError } = await fastify.supabase
        .from('servicos')
        .select('*')
        .eq('id', id)
        .single();
        
      if (servicoError || !servico) {
        return reply.status(404).send({
          success: false,
          error: 'Serviço não encontrado'
        });
      }
      
      // Verificar permissões
      if (userRole === 'gerente') {
        // Gerente só pode deletar serviços da sua barbearia
        const { data: gerenteBarbearia } = await fastify.supabase
          .from('barbearias')
          .select('id')
          .eq('gerente_id', userId)
          .single();
          
        if (!gerenteBarbearia || gerenteBarbearia.id !== servico.barbearia_id) {
          return reply.status(403).send({
            success: false,
            error: 'Você só pode deletar serviços da sua barbearia'
          });
        }
      }
      
      // Verificar se o serviço está sendo usado
      const { data: agendamentos, error: agendamentosError } = await fastify.supabase
        .from('agendamentos')
        .select('id')
        .eq('servico_id', id)
        .limit(1);
        
      if (agendamentos && agendamentos.length > 0) {
        return reply.status(400).send({
          success: false,
          error: 'Não é possível deletar um serviço que possui agendamentos'
        });
      }
      
      // Deletar serviço
      const { error: deleteError } = await fastify.supabase
        .from('servicos')
        .delete()
        .eq('id', id);
        
      if (deleteError) {
        return reply.status(500).send({
          success: false,
          error: 'Erro interno do servidor'
        });
      }
      
      return reply.status(200).send({
        success: true,
        message: 'Serviço deletado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar serviço:', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  });

  /**
   * @swagger
   * /api/configuracoes/barbearia:
   *   get:
   *     tags: [configuracoes]
   *     summary: Obter configurações da barbearia (PRIVADO)
   *     security:
   *       - Bearer: []
   *     responses:
   *       200:
   *         description: Configurações da barbearia
   *       403:
   *         description: Acesso negado
   */
  fastify.get('/configuracoes/barbearia', {
    preHandler: [fastify.authenticate, checkAdminOrGerenteRole]
  }, async (request, reply) => {
    try {
      const userId = request.user.id;
      const userRole = request.user.role;
      
      let barbearia_id = null;
      
      if (userRole === 'gerente') {
        // Gerente vê configurações da sua barbearia
        const { data: gerenteBarbearia } = await fastify.supabase
          .from('barbearias')
          .select('id')
          .eq('gerente_id', userId)
          .single();
        barbearia_id = gerenteBarbearia?.id;
      } else if (userRole === 'admin') {
        // Admin pode especificar barbearia_id ou usar default
        barbearia_id = request.query.barbearia_id || 1;
      }
      
      if (!barbearia_id) {
        return reply.status(403).send({
          success: false,
          error: 'Você não tem acesso a nenhuma barbearia'
        });
      }
      
      // Buscar dados da barbearia
      const { data: barbearia, error: barbeariaError } = await fastify.supabase
        .from('barbearias')
        .select('*')
        .eq('id', barbearia_id)
        .single();
        
      if (barbeariaError || !barbearia) {
        return reply.status(404).send({
          success: false,
          error: 'Barbearia não encontrada'
        });
      }
      
      return reply.status(200).send({
        success: true,
        data: {
          barbearia: barbearia
        }
      });
    } catch (error) {
      console.error('Erro ao obter configurações da barbearia:', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  });

  /**
   * @swagger
   * /api/configuracoes/barbearia:
   *   put:
   *     tags: [configuracoes]
   *     summary: Atualizar configurações da barbearia (PRIVADO)
   *     security:
   *       - Bearer: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               nome: { type: string }
   *               endereco: { type: string }
   *               telefone: { type: string }
   *               horario_funcionamento: { type: string }
   *               ativo: { type: boolean }
   *     responses:
   *       200:
   *         description: Configurações atualizadas com sucesso
   *       403:
   *         description: Acesso negado
   */
  fastify.put('/configuracoes/barbearia', {
    preHandler: [fastify.authenticate, checkAdminOrGerenteRole]
  }, async (request, reply) => {
    try {
      const { nome, endereco, telefone, horario_funcionamento, ativo } = request.body;
      const userId = request.user.id;
      const userRole = request.user.role;
      
      let barbearia_id = null;
      
      if (userRole === 'gerente') {
        // Gerente só pode editar sua barbearia
        const { data: gerenteBarbearia } = await fastify.supabase
          .from('barbearias')
          .select('id')
          .eq('gerente_id', userId)
          .single();
        barbearia_id = gerenteBarbearia?.id;
      } else if (userRole === 'admin') {
        // Admin pode especificar barbearia_id
        barbearia_id = request.body.barbearia_id || 1;
      }
      
      if (!barbearia_id) {
        return reply.status(403).send({
          success: false,
          error: 'Você não tem acesso a nenhuma barbearia'
        });
      }
      
      // Verificar se a barbearia existe
      const { data: barbearia, error: barbeariaError } = await fastify.supabase
        .from('barbearias')
        .select('*')
        .eq('id', barbearia_id)
        .single();
        
      if (barbeariaError || !barbearia) {
        return reply.status(404).send({
          success: false,
          error: 'Barbearia não encontrada'
        });
      }
      
      // Preparar dados para atualização
      const updateData = {};
      if (nome !== undefined) updateData.nome = nome;
      if (endereco !== undefined) updateData.endereco = endereco;
      if (telefone !== undefined) updateData.telefone = telefone;
      if (horario_funcionamento !== undefined) updateData.horario_funcionamento = horario_funcionamento;
      if (ativo !== undefined) updateData.ativo = ativo;
      
      // Atualizar barbearia
      const { data: barbeariaAtualizada, error: updateError } = await fastify.supabase
        .from('barbearias')
        .update(updateData)
        .eq('id', barbearia_id)
        .select()
        .single();
        
      if (updateError) {
        return reply.status(500).send({
          success: false,
          error: 'Erro interno do servidor'
        });
      }
      
      return reply.status(200).send({
        success: true,
        message: 'Configurações atualizadas com sucesso',
        data: {
          barbearia: barbeariaAtualizada
        }
      });
    } catch (error) {
      console.error('Erro ao atualizar configurações da barbearia:', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  });
}

module.exports = configuracoesRoutes; 