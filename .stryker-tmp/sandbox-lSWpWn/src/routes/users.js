// @ts-nocheck
const { supabase } = require('../config/database');
const { checkAdminRole, checkAdminOrGerenteRole, checkBarbeiroRole } = require('../middlewares/rolePermissions');

async function userRoutes(fastify, options) {
  /**
   * @swagger
   * /api/users:
   *   get:
   *     tags: [users]
   *     summary: Listar usuários (apenas admin)
   *     security:
   *       - Bearer: []
   *     responses:
   *       200:
   *         description: Lista de usuários
   *       403:
   *         description: Acesso negado
   */
  fastify.get('/', {
    preValidation: [fastify.authenticate, checkAdminRole]
  }, async (request, reply) => {
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('id, email, nome, telefone, role, active, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error('Erro ao buscar usuários');
      }

      return reply.send({
        success: true,
        data: users
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
  fastify.get('/barbeiros', async (request, reply) => {
    try {
      const { barbearia_id, status = 'ativo', public: isPublic = false } = request.query;

      // Se é público, não requer autenticação
      if (!isPublic) {
        // Verificar autenticação para dados privados
        try {
          await request.jwtVerify();
        } catch (err) {
          return reply.status(401).send({
            success: false,
            error: 'Token inválido ou expirado'
          });
        }
      }

      // Construir query base
      let query = supabase
        .from('barbeiros_barbearias')
        .select(`
          user_id,
          especialidade,
          dias_trabalho,
          horario_inicio,
          horario_fim,
          ativo,
          disponivel,
          users(id, nome, email, telefone)
        `);

      // Aplicar filtros
      if (barbearia_id) {
        query = query.eq('barbearia_id', barbearia_id);
      }

      if (status === 'ativo') {
        query = query.eq('ativo', true);
      } else if (status === 'inativo') {
        query = query.eq('ativo', false);
      } else if (status === 'disponivel') {
        query = query.eq('disponivel', true);
      }

      const { data: barbeiros, error } = await query;

      if (error) {
        return reply.status(500).send({
          success: false,
          error: 'Erro ao buscar barbeiros'
        });
      }

      // Formatar dados baseado no tipo de acesso
      const barbeirosFormatados = barbeiros?.map(bb => {
        if (isPublic) {
          // Dados limitados para clientes
          return {
            id: bb.user_id,
            nome: bb.users?.nome || 'Barbeiro',
            especialidade: bb.especialidade || 'Corte geral',
            dias_trabalho: bb.dias_trabalho || [],
            horario_inicio: bb.horario_inicio,
            horario_fim: bb.horario_fim
          };
        } else {
          // Dados completos para funcionários
          return {
            id: bb.user_id,
            nome: bb.users?.nome || 'Barbeiro',
            email: bb.users?.email,
            telefone: bb.users?.telefone,
            especialidade: bb.especialidade,
            dias_trabalho: bb.dias_trabalho || [],
            horario_inicio: bb.horario_inicio,
            horario_fim: bb.horario_fim,
            ativo: bb.ativo,
            disponivel: bb.disponivel
          };
        }
      }) || [];

      // Estrutura de resposta padronizada
      const response = {
        success: true,
        data: {
          barbeiros: barbeirosFormatados,
          total: barbeirosFormatados.length,
          filtros: {
            barbearia_id,
            status,
            public: isPublic
          }
        }
      };

      // Adicionar dados da barbearia se especificada
      if (barbearia_id) {
        const { data: barbearia } = await supabase
          .from('barbearias')
          .select('id, nome')
          .eq('id', barbearia_id)
          .single();

        if (barbearia) {
          response.data.barbearia = barbearia;
        }
      }

      return reply.send(response);

    } catch (error) {
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
   *     summary: Obter status do barbeiro autenticado nas barbearias
   *     security:
   *       - Bearer: []
   *     responses:
   *       200:
   *         description: Status do barbeiro nas barbearias
   *       403:
   *         description: Acesso negado
   */
  fastify.get('/barbeiros/meu-status', {
    preValidation: [fastify.authenticate, checkBarbeiroRole]
  }, async (request, reply) => {
    try {
      const userId = request.user.id;

      // Verificar se o usuário é um barbeiro
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id, email, nome, telefone, role, active')
        .eq('id', userId)
        .eq('role', 'barbeiro')
        .single();

      if (userError || !user) {
        return reply.status(403).send({
          success: false,
          error: 'Acesso negado. Apenas barbeiros podem acessar este endpoint.'
        });
      }

      // Buscar status nas barbearias
      const { data: statusBarbearias, error: statusError } = await supabase
        .from('barbeiros_barbearias')
        .select(`
          barbearia_id,
          ativo,
          disponivel,
          especialidade,
          dias_trabalho,
          horario_inicio,
          horario_fim,
          barbearias!inner(nome, endereco, ativo)
        `)
        .eq('user_id', userId);

      if (statusError) {
        throw new Error('Erro ao buscar status nas barbearias');
      }

      return reply.send({
        success: true,
        data: {
          ...user,
          barbearias: statusBarbearias || []
        }
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
   * /api/users/barbeiros/ativar:
   *   post:
   *     tags: [users]
   *     summary: Ativar barbeiro em uma barbearia específica
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
   *               barbearia_id:
   *                 type: integer
   *                 description: ID da barbearia onde o barbeiro será ativado
   *               especialidade:
   *                 type: string
   *               dias_trabalho:
   *                 type: array
   *                 items:
   *                   type: string
   *               horario_inicio:
   *                 type: string
   *                 format: time
   *               horario_fim:
   *                 type: string
   *                 format: time
   *     responses:
   *       200:
   *         description: Barbeiro ativado com sucesso
   *       400:
   *         description: Barbeiro já está ativo em outra barbearia
   *       403:
   *         description: Acesso negado
   */
  fastify.post('/barbeiros/ativar', {
    preValidation: [fastify.authenticate, checkBarbeiroRole]
  }, async (request, reply) => {
    try {
      const userId = request.user.id;
      const { barbearia_id, especialidade, dias_trabalho, horario_inicio, horario_fim } = request.body;

      // Verificar se o usuário é um barbeiro
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id, nome, role')
        .eq('id', userId)
        .eq('role', 'barbeiro')
        .single();

      if (userError || !user) {
        return reply.status(403).send({
          success: false,
          error: 'Acesso negado. Apenas barbeiros podem acessar este endpoint.'
        });
      }

      // Verificar se o barbeiro já está ativo em outra barbearia
      const { data: barbeiroAtivo, error: ativoError } = await supabase
        .from('barbeiros_barbearias')
        .select(`
          barbearia_id,
          ativo,
          barbearias!inner(nome)
        `)
        .eq('user_id', userId)
        .eq('ativo', true)
        .neq('barbearia_id', barbearia_id)
        .single();

      if (ativoError && ativoError.code !== 'PGRST116') {
        throw new Error('Erro ao verificar status do barbeiro');
      }

      if (barbeiroAtivo) {
        return reply.status(400).send({
          success: false,
          error: `Você já está ativo na barbearia '${barbeiroAtivo.barbearias.nome}'. Desative-se primeiro para ativar em outra barbearia.`,
          code: 'BARBEIRO_JA_ATIVO',
          barbearia_atual: barbeiroAtivo.barbearias.nome
        });
      }

      // Verificar se a barbearia existe
      const { data: barbearia, error: barbeariaError } = await supabase
        .from('barbearias')
        .select('id, nome')
        .eq('id', barbearia_id)
        .eq('ativo', true)
        .single();

      if (barbeariaError) {
        console.error('Erro ao buscar barbearia:', barbeariaError);
        return reply.status(400).send({
          success: false,
          error: `Erro ao buscar barbearia: ${barbeariaError.message}`
        });
      }

      if (!barbearia) {
        return reply.status(400).send({
          success: false,
          error: `Barbearia com ID ${barbearia_id} não encontrada ou inativa`
        });
      }

      // Desativar barbeiro em todas as outras barbearias
      const { error: desativacaoError } = await supabase
        .from('barbeiros_barbearias')
        .update({ ativo: false })
        .eq('user_id', userId);

      if (desativacaoError) {
        console.error('Erro ao desativar barbeiro:', desativacaoError);
        return reply.status(400).send({
          success: false,
          error: `Erro ao desativar barbeiro: ${desativacaoError.message}`
        });
      }

      // Verificar se já existe registro para este barbeiro e barbearia
      const { data: registroExistente, error: checkError } = await supabase
        .from('barbeiros_barbearias')
        .select('id')
        .eq('user_id', userId)
        .eq('barbearia_id', barbearia_id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Erro ao verificar registro existente:', checkError);
        return reply.status(400).send({
          success: false,
          error: `Erro ao verificar registro existente: ${checkError.message}`
        });
      }

      let resultado;
      let ativacaoError;

      if (registroExistente) {
        // Atualizar registro existente
        const { data: updateResult, error: updateError } = await supabase
          .from('barbeiros_barbearias')
          .update({
            especialidade: especialidade || null,
            dias_trabalho: dias_trabalho || [],
            horario_inicio: horario_inicio || '08:00',
            horario_fim: horario_fim || '18:00',
            ativo: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', registroExistente.id)
          .select(`
            *,
            barbearias!inner(nome, endereco)
          `)
          .single();

        resultado = updateResult;
        ativacaoError = updateError;
      } else {
        // Criar novo registro
        const { data: insertResult, error: insertError } = await supabase
          .from('barbeiros_barbearias')
          .insert({
            user_id: userId,
            barbearia_id: barbearia_id,
            especialidade: especialidade || null,
            dias_trabalho: dias_trabalho || [],
            horario_inicio: horario_inicio || '08:00',
            horario_fim: horario_fim || '18:00',
            ativo: true
          })
          .select(`
            *,
            barbearias!inner(nome, endereco)
          `)
          .single();

        resultado = insertResult;
        ativacaoError = insertError;
      }

      if (ativacaoError) {
        console.error('Erro ao ativar barbeiro:', ativacaoError);
        return reply.status(400).send({
          success: false,
          error: `Erro ao ativar barbeiro na barbearia: ${ativacaoError.message}`
        });
      }

      return reply.send({
        success: true,
        message: `Você foi ativado com sucesso na barbearia ${barbearia.nome}`,
        data: resultado
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
   * /api/users/barbeiros/desativar:
   *   post:
   *     tags: [users]
   *     summary: Desativar barbeiro de uma barbearia específica
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
   *               barbearia_id:
   *                 type: integer
   *                 description: ID da barbearia onde o barbeiro será desativado
   *     responses:
   *       200:
   *         description: Barbeiro desativado com sucesso
   *       400:
   *         description: Dados inválidos
   *       403:
   *         description: Acesso negado
   */
  fastify.post('/barbeiros/desativar', {
    preValidation: [fastify.authenticate, checkBarbeiroRole]
  }, async (request, reply) => {
    try {
      const userId = request.user.id;
      const { barbearia_id } = request.body;

      // Verificar se o usuário é um barbeiro
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id, nome, role')
        .eq('id', userId)
        .eq('role', 'barbeiro')
        .single();

      if (userError || !user) {
        return reply.status(403).send({
          success: false,
          error: 'Acesso negado. Apenas barbeiros podem acessar este endpoint.'
        });
      }

      // Verificar se o barbeiro está ativo na barbearia
      const { data: statusAtual, error: statusError } = await supabase
        .from('barbeiros_barbearias')
        .select('ativo, barbearias!inner(nome)')
        .eq('user_id', userId)
        .eq('barbearia_id', barbearia_id)
        .single();

      if (statusError || !statusAtual) {
        return reply.status(400).send({
          success: false,
          error: 'Você não está ativo nesta barbearia'
        });
      }

      if (!statusAtual.ativo) {
        return reply.status(400).send({
          success: false,
          error: 'Você não está ativo nesta barbearia'
        });
      }

      // Desativar barbeiro na barbearia especificada
      const { data: resultado, error: desativacaoError } = await supabase
        .from('barbeiros_barbearias')
        .update({ 
          ativo: false,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('barbearia_id', barbearia_id)
        .select(`
          *,
          barbearias!inner(nome)
        `)
        .single();

      if (desativacaoError) {
        throw new Error('Erro ao desativar barbeiro na barbearia');
      }

      return reply.send({
        success: true,
        message: `Você foi desativado com sucesso da barbearia ${resultado.barbearias.nome}`,
        data: resultado
      });
    } catch (error) {
      return reply.status(400).send({
        success: false,
        error: error.message
      });
    }
  });

  // Endpoint unificado substitui os endpoints separados
  // Use: GET /api/users/barbeiros?barbearia_id=:id&status=ativo

  // Endpoint unificado substitui os endpoints separados
  // Use: GET /api/users/barbeiros?barbearia_id=:id&status=ativo&public=true

  // Endpoint de debug removido para produção

  // Endpoint unificado substitui os endpoints separados
  // Use: GET /api/users/barbeiros?status=disponivel

  /**
   * @swagger
   * /api/users/{id}:
   *   put:
   *     tags: [users]
   *     summary: Atualizar usuário (apenas admin)
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
   *               nome:
   *                 type: string
   *               telefone:
   *                 type: string
   *               role:
   *                 type: string
   *                 enum: [admin, gerente, barbeiro]
   *               active:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: Usuário atualizado
   *       400:
   *         description: Dados inválidos
   *       403:
   *         description: Acesso negado
   */
  fastify.put('/:id', {
    preValidation: [fastify.authenticate, checkAdminRole]
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      const updateData = request.body;

      const { data: user, error } = await supabase
        .from('users')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error('Erro ao atualizar usuário');
      }

      return reply.send({
        success: true,
        message: 'Usuário atualizado com sucesso',
        data: user
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
   * /api/users/{id}:
   *   delete:
   *     tags: [users]
   *     summary: Remover usuário (apenas admin)
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
   *         description: Usuário removido
   *       403:
   *         description: Acesso negado
   */
  fastify.delete('/:id', {
    preValidation: [fastify.authenticate, checkAdminRole]
  }, async (request, reply) => {
    try {
      const { id } = request.params;

      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error('Erro ao remover usuário');
      }

      return reply.send({
        success: true,
        message: 'Usuário removido com sucesso'
      });
    } catch (error) {
      return reply.status(400).send({
        success: false,
        error: error.message
      });
    }
  });
}

module.exports = userRoutes; 