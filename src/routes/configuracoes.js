const { checkAdminOrGerenteRole, isBarbeiroDaBarbearia } = require('../middlewares/rolePermissions');

async function configuracoesRoutes(fastify, options) {

  // Listar configurações de comissões
  fastify.get('/comissoes', {
    preValidation: [fastify.authenticate, checkAdminOrGerenteRole],
    schema: {
      description: 'Listar configurações de comissionamento (ADMIN/GERENTE)',
      tags: ['configuracoes'],
      security: [{ Bearer: [] }],
      querystring: {
        type: 'object',
        properties: {
          barbearia_id: { type: 'integer' },
          barbeiro_id: { type: 'string' },
          servico_id: { type: 'integer' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { barbearia_id, barbeiro_id, servico_id } = request.query;

      let query = fastify.supabase
        .from('configuracoes_comissoes')
        .select(`
          *,
          users(id, nome, email),
          servicos(id, nome, preco),
          barbearias(id, nome)
        `)
        .eq('ativo', true);

      if (barbearia_id) {
        query = query.eq('barbearia_id', barbearia_id);
      }

      if (barbeiro_id) {
        query = query.eq('barbeiro_id', barbeiro_id);
      }

      if (servico_id) {
        query = query.eq('servico_id', servico_id);
      }

      const { data: configuracoes, error } = await query;

      if (error) {
        throw new Error('Erro ao buscar configurações: ' + error.message);
      }

      return reply.send({
        success: true,
        data: configuracoes || []
      });

    } catch (error) {
      console.error('Erro ao listar configurações:', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor: ' + error.message
      });
    }
  });

  // Criar configuração de comissão
  fastify.post('/comissoes', {
    preValidation: [fastify.authenticate, checkAdminOrGerenteRole],
    schema: {
      description: 'Criar configuração de comissionamento (ADMIN/GERENTE)',
      tags: ['configuracoes'],
      security: [{ Bearer: [] }],
      body: {
        type: 'object',
        required: ['barbearia_id', 'barbeiro_id', 'servico_id', 'tipo'],
        properties: {
          barbearia_id: { type: 'integer' },
          barbeiro_id: { type: 'string' },
          servico_id: { type: 'integer' },
          tipo: { type: 'string', enum: ['percentual', 'fixo'] },
          percentual: { type: 'number', minimum: 0, maximum: 100 },
          valor_fixo: { type: 'number', minimum: 0 }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { barbearia_id, barbeiro_id, servico_id, tipo, percentual, valor_fixo } = request.body;

      // Validar dados
      if (tipo === 'percentual' && (!percentual || percentual < 0 || percentual > 100)) {
        return reply.status(400).send({
          success: false,
          error: 'Percentual deve estar entre 0 e 100'
        });
      }

      if (tipo === 'fixo' && (!valor_fixo || valor_fixo < 0)) {
        return reply.status(400).send({
          success: false,
          error: 'Valor fixo deve ser maior que zero'
        });
      }

      // Verificar se já existe configuração
      const { data: existente, error: checkError } = await fastify.supabase
        .from('configuracoes_comissoes')
        .select('id')
        .eq('barbearia_id', barbearia_id)
        .eq('barbeiro_id', barbeiro_id)
        .eq('servico_id', servico_id)
        .eq('ativo', true)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw new Error('Erro ao verificar configuração existente: ' + checkError.message);
      }

      if (existente) {
        return reply.status(400).send({
          success: false,
          error: 'Já existe uma configuração ativa para este barbeiro e serviço'
        });
      }

      // Criar configuração
      const configData = {
        barbearia_id,
        barbeiro_id,
        servico_id,
        tipo,
        ativo: true
      };

      if (tipo === 'percentual') {
        configData.percentual = percentual;
      } else {
        configData.valor_fixo = valor_fixo;
      }

      const { data: configuracao, error } = await fastify.supabase
        .from('configuracoes_comissoes')
        .insert(configData)
        .select(`
          *,
          users(id, nome, email),
          servicos(id, nome, preco),
          barbearias(id, nome)
        `)
        .single();

      if (error) {
        throw new Error('Erro ao criar configuração: ' + error.message);
      }

      return reply.status(201).send({
        success: true,
        message: 'Configuração de comissão criada com sucesso',
        data: configuracao
      });

    } catch (error) {
      console.error('Erro ao criar configuração:', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor: ' + error.message
      });
    }
  });

  // Atualizar configuração de comissão
  fastify.put('/comissoes/:id', {
    preValidation: [fastify.authenticate, checkAdminOrGerenteRole],
    schema: {
      description: 'Atualizar configuração de comissionamento (ADMIN/GERENTE)',
      tags: ['configuracoes'],
      security: [{ Bearer: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      },
      body: {
        type: 'object',
        properties: {
          tipo: { type: 'string', enum: ['percentual', 'fixo'] },
          percentual: { type: 'number', minimum: 0, maximum: 100 },
          valor_fixo: { type: 'number', minimum: 0 },
          ativo: { type: 'boolean' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      const { tipo, percentual, valor_fixo, ativo } = request.body;

      // Verificar se a configuração existe
      const { data: existente, error: checkError } = await fastify.supabase
        .from('configuracoes_comissoes')
        .select('*')
        .eq('id', id)
        .single();

      if (checkError || !existente) {
        return reply.status(404).send({
          success: false,
          error: 'Configuração não encontrada'
        });
      }

      // Validar dados
      if (tipo === 'percentual' && (!percentual || percentual < 0 || percentual > 100)) {
        return reply.status(400).send({
          success: false,
          error: 'Percentual deve estar entre 0 e 100'
        });
      }

      if (tipo === 'fixo' && (!valor_fixo || valor_fixo < 0)) {
        return reply.status(400).send({
          success: false,
          error: 'Valor fixo deve ser maior que zero'
        });
      }

      // Preparar dados para atualização
      const updateData = {
        updated_at: new Date().toISOString()
      };

      if (tipo !== undefined) updateData.tipo = tipo;
      if (percentual !== undefined) updateData.percentual = percentual;
      if (valor_fixo !== undefined) updateData.valor_fixo = valor_fixo;
      if (ativo !== undefined) updateData.ativo = ativo;

      // Atualizar configuração
      const { data: configuracao, error } = await fastify.supabase
        .from('configuracoes_comissoes')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          users(id, nome, email),
          servicos(id, nome, preco),
          barbearias(id, nome)
        `)
        .single();

      if (error) {
        throw new Error('Erro ao atualizar configuração: ' + error.message);
      }

      return reply.send({
        success: true,
        message: 'Configuração de comissão atualizada com sucesso',
        data: configuracao
      });

    } catch (error) {
      console.error('Erro ao atualizar configuração:', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor: ' + error.message
      });
    }
  });

  // Deletar configuração de comissão
  fastify.delete('/comissoes/:id', {
    preValidation: [fastify.authenticate, checkAdminOrGerenteRole],
    schema: {
      description: 'Deletar configuração de comissionamento (ADMIN/GERENTE)',
      tags: ['configuracoes'],
      security: [{ Bearer: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params;

      // Verificar se a configuração existe
      const { data: existente, error: checkError } = await fastify.supabase
        .from('configuracoes_comissoes')
        .select('id')
        .eq('id', id)
        .single();

      if (checkError || !existente) {
        return reply.status(404).send({
          success: false,
          error: 'Configuração não encontrada'
        });
      }

      // Deletar configuração
      const { error } = await fastify.supabase
        .from('configuracoes_comissoes')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error('Erro ao deletar configuração: ' + error.message);
      }

      return reply.send({
        success: true,
        message: 'Configuração de comissão deletada com sucesso'
      });

    } catch (error) {
      console.error('Erro ao deletar configuração:', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor: ' + error.message
      });
    }
  });

  // Listar serviços da barbearia
  fastify.get('/servicos', {
    preValidation: [fastify.authenticate],
    schema: {
      description: 'Listar serviços da barbearia (ADMIN/GERENTE/BARBEIRO)',
      tags: ['configuracoes'],
      security: [{ Bearer: [] }],
      querystring: {
        type: 'object',
        properties: {
          barbearia_id: { type: 'integer' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { barbearia_id } = request.query;
      const userRole = request.user?.role;
      const userId = request.user?.id;

      if (!barbearia_id) {
        return reply.status(400).send({
          success: false,
          error: 'barbearia_id é obrigatório'
        });
      }

      // Verificar permissões
      if (userRole === 'barbeiro') {
        // Barbeiro só pode ver serviços da barbearia onde trabalha
        const barbeiroInfo = await isBarbeiroDaBarbearia(userId, barbearia_id);
        if (!barbeiroInfo || !barbeiroInfo.ativo) {
          return reply.status(403).send({
            success: false,
            error: 'Você não tem permissão para acessar os serviços desta barbearia'
          });
        }
      } else if (!['admin', 'gerente'].includes(userRole)) {
        return reply.status(403).send({
          success: false,
          error: 'Apenas administradores, gerentes e barbeiros podem acessar este recurso'
        });
      }

      const { data: servicos, error } = await fastify.supabase
        .from('servicos')
        .select('*')
        .eq('barbearia_id', barbearia_id)
        .eq('ativo', true)
        .order('nome');

      if (error) {
        throw new Error('Erro ao buscar serviços: ' + error.message);
      }

      return reply.send({
        success: true,
        data: servicos || []
      });

    } catch (error) {
      console.error('Erro ao listar serviços:', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor: ' + error.message
      });
    }
  });

  // Criar serviço
  fastify.post('/servicos', {
    preValidation: [fastify.authenticate, checkAdminOrGerenteRole],
    schema: {
      description: 'Criar serviço (ADMIN/GERENTE)',
      tags: ['configuracoes'],
      security: [{ Bearer: [] }],
      body: {
        type: 'object',
        required: ['barbearia_id', 'nome', 'preco', 'duracao_estimada'],
        properties: {
          barbearia_id: { type: 'integer' },
          nome: { type: 'string', minLength: 1 },
          descricao: { type: 'string' },
          preco: { type: 'number', minimum: 0 },
          duracao_estimada: { type: 'integer', minimum: 1 }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { barbearia_id, nome, descricao, preco, duracao_estimada } = request.body;

      // Validar dados
      if (preco < 0) {
        return reply.status(400).send({
          success: false,
          error: 'Preço deve ser maior ou igual a zero'
        });
      }

      if (duracao_estimada < 1) {
        return reply.status(400).send({
          success: false,
          error: 'Duração estimada deve ser maior que zero'
        });
      }

      // Criar serviço
      const { data: servico, error } = await fastify.supabase
        .from('servicos')
        .insert({
          barbearia_id,
          nome,
          descricao: descricao || '',
          preco,
          duracao_estimada,
          ativo: true
        })
        .select()
        .single();

      if (error) {
        throw new Error('Erro ao criar serviço: ' + error.message);
      }

      return reply.status(201).send({
        success: true,
        message: 'Serviço criado com sucesso',
        data: servico
      });

    } catch (error) {
      console.error('Erro ao criar serviço:', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor: ' + error.message
      });
    }
  });

  // Atualizar serviço
  fastify.put('/servicos/:id', {
    preValidation: [fastify.authenticate, checkAdminOrGerenteRole],
    schema: {
      description: 'Atualizar serviço (ADMIN/GERENTE)',
      tags: ['configuracoes'],
      security: [{ Bearer: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      },
      body: {
        type: 'object',
        properties: {
          nome: { type: 'string', minLength: 1 },
          descricao: { type: 'string' },
          preco: { type: 'number', minimum: 0 },
          duracao_estimada: { type: 'integer', minimum: 1 },
          ativo: { type: 'boolean' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      const { nome, descricao, preco, duracao_estimada, ativo } = request.body;

      // Verificar se o serviço existe
      const { data: existente, error: checkError } = await fastify.supabase
        .from('servicos')
        .select('*')
        .eq('id', id)
        .single();

      if (checkError || !existente) {
        return reply.status(404).send({
          success: false,
          error: 'Serviço não encontrado'
        });
      }

      // Validar dados
      if (preco !== undefined && preco < 0) {
        return reply.status(400).send({
          success: false,
          error: 'Preço deve ser maior ou igual a zero'
        });
      }

      if (duracao_estimada !== undefined && duracao_estimada < 1) {
        return reply.status(400).send({
          success: false,
          error: 'Duração estimada deve ser maior que zero'
        });
      }

      // Preparar dados para atualização
      const updateData = {
        updated_at: new Date().toISOString()
      };

      if (nome !== undefined) updateData.nome = nome;
      if (descricao !== undefined) updateData.descricao = descricao;
      if (preco !== undefined) updateData.preco = preco;
      if (duracao_estimada !== undefined) updateData.duracao_estimada = duracao_estimada;
      if (ativo !== undefined) updateData.ativo = ativo;

      // Atualizar serviço
      const { data: servico, error } = await fastify.supabase
        .from('servicos')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error('Erro ao atualizar serviço: ' + error.message);
      }

      return reply.send({
        success: true,
        message: 'Serviço atualizado com sucesso',
        data: servico
      });

    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor: ' + error.message
      });
    }
  });
}

module.exports = configuracoesRoutes; 