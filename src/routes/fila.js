const QRCode = require('qrcode');
const { checkBarbeiroBarbeariaAccess } = require('../middlewares/barbeariaAccess');
const { checkBarbeiroRole, checkGerenteBarbeariaAccess, checkGerenteRole, checkAdminRole } = require('../middlewares/rolePermissions');

async function filaRoutes(fastify, options) {
  // Adicionar cliente à fila (PÚBLICO)
  fastify.post('/fila/entrar', {
    schema: {
      description: 'Adicionar cliente à fila (PÚBLICO)',
      tags: ['fila'],
      body: {
        type: 'object',
        required: ['nome', 'telefone', 'barbearia_id'],
        properties: {
          nome: { type: 'string' },
          telefone: { type: 'string' },
          barbearia_id: { type: 'integer' },
          barbeiro_id: { type: 'string', format: 'uuid' }
        }
      },
      response: {
        201: {
          description: 'Cliente adicionado com sucesso',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                cliente: { type: 'object' },
                qr_code_fila: { type: 'string' },
                qr_code_status: { type: 'string' },
                posicao: { type: 'integer' }
              }
            }
          }
        }
      }
    }
    // SEM autenticação - endpoint público
  }, async (request, reply) => {
    try {
      console.log('🔍 [FILA] Iniciando entrada na fila');
      const { nome, telefone, barbearia_id, barbeiro_id } = request.body;
      console.log('📋 [FILA] Dados recebidos:', { nome, telefone, barbearia_id, barbeiro_id });
      
      // Validações básicas
      if (!nome || !telefone || !barbearia_id) {
        console.log('❌ [FILA] Dados obrigatórios faltando');
        return reply.status(400).send({ success: false, error: 'Nome, telefone e barbearia_id são obrigatórios' });
      }
      
      console.log('🔍 [FILA] Verificando barbearia...');
      // Verificar se a barbearia existe e está ativa
      const { data: barbearia, error: barbeariaError } = await fastify.supabase
        .from('barbearias')
        .select('id, nome, ativo')
        .eq('id', barbearia_id)
        .eq('ativo', true)
        .single();
        
      console.log('📋 [FILA] Resultado barbearia:', { barbearia, barbeariaError });
        
      if (barbeariaError || !barbearia) {
        console.log('❌ [FILA] Barbearia não encontrada ou inativa');
        return reply.status(404).send({ success: false, error: 'Barbearia não encontrada ou inativa' });
      }
      
      // Se barbeiro_id foi especificado, verificar se o barbeiro está ativo na barbearia
      if (barbeiro_id) {
        console.log('🔍 [FILA] Verificando barbeiro...');
        const { data: barbeiroAtivo, error: barbeiroError } = await fastify.supabase
          .from('barbeiros_barbearias')
          .select('id, ativo')
          .eq('user_id', barbeiro_id)
          .eq('barbearia_id', barbearia_id)
          .eq('ativo', true)
          .single();
          
        console.log('📋 [FILA] Resultado barbeiro:', { barbeiroAtivo, barbeiroError });
          
        if (barbeiroError || !barbeiroAtivo) {
          console.log('❌ [FILA] Barbeiro não ativo');
          return reply.status(400).send({ success: false, error: 'Barbeiro especificado não está ativo nesta barbearia' });
        }
      }
      
      console.log('🔍 [FILA] Verificando se cliente já existe...');
      // Verificar se o cliente já existe (nome + telefone + barbearia)
      const { data: clienteExistente, error: clienteError } = await fastify.supabase
        .from('clientes')
        .select('id, nome, telefone, status, posicao, token')
        .eq('nome', nome)
        .eq('telefone', telefone)
        .eq('barbearia_id', barbearia_id)
        .single();
        
      console.log('📋 [FILA] Cliente existente:', { clienteExistente, clienteError });
      
      let cliente;
      let isUpdate = false;
      
      if (clienteExistente) {
        console.log('🔄 [FILA] Cliente já existe, atualizando dados...');
        
        // Cliente já existe, vamos atualizar para entrar na fila novamente
        // (mesmo se já estiver na fila, permite reentrada)
        
        // Gerar novo token
        const novoToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        
        // Calcular nova posição
        const { data: ultimoCliente, error: posicaoError } = await fastify.supabase
          .from('clientes')
          .select('posicao')
          .eq('barbearia_id', barbearia_id)
          .in('status', ['aguardando', 'proximo'])
          .order('posicao', { ascending: false })
          .limit(1)
          .single();
          
        const novaPosicao = ultimoCliente ? ultimoCliente.posicao + 1 : 1;
        
        // Atualizar cliente existente
        const { data: clienteAtualizado, error: updateError } = await fastify.supabase
          .from('clientes')
          .update({
            token: novoToken,
            barbeiro_id: barbeiro_id || null,
            status: 'aguardando',
            posicao: novaPosicao,
            updated_at: new Date().toISOString()
          })
          .eq('id', clienteExistente.id)
          .select()
          .single();
          
        console.log('📋 [FILA] Resultado atualização:', { clienteAtualizado, updateError });
        
        if (updateError) {
          console.log('❌ [FILA] Erro na atualização:', updateError);
          return reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
        }
        
        cliente = clienteAtualizado;
        isUpdate = true;
        
      } else {
        console.log('🆕 [FILA] Cliente novo, criando registro...');
        
        // Gerar token único para o cliente
        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        
        // Calcular posição
        const { data: ultimoCliente, error: posicaoError } = await fastify.supabase
          .from('clientes')
          .select('posicao')
          .eq('barbearia_id', barbearia_id)
          .in('status', ['aguardando', 'proximo'])
          .order('posicao', { ascending: false })
          .limit(1)
          .single();
          
        const posicao = ultimoCliente ? ultimoCliente.posicao + 1 : 1;
        
        // Inserir novo cliente
        const { data: novoCliente, error: insertError } = await fastify.supabase
          .from('clientes')
          .insert({
            nome,
            telefone,
            token,
            barbearia_id,
            barbeiro_id: barbeiro_id || null,
            status: 'aguardando',
            posicao
          })
          .select()
          .single();
          
        console.log('📋 [FILA] Resultado inserção:', { novoCliente, insertError });
        
        if (insertError) {
          console.log('❌ [FILA] Erro na inserção:', insertError);
          return reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
        }
        
        cliente = novoCliente;
      }

      // Gerar QR codes
      const qrCodeFila = await QRCode.toDataURL(JSON.stringify({
        token: cliente.token,
        barbearia_id: cliente.barbearia_id,
        tipo: 'fila'
      }));
      
      const qrCodeStatus = await QRCode.toDataURL(JSON.stringify({
        token: cliente.token,
        tipo: 'status'
      }));
      
      // Configurar cookies do cliente usando decorators centralizados
      fastify.setClienteCookies(reply, cliente, qrCodeFila, qrCodeStatus);
      
      const mensagem = isUpdate 
        ? 'Cliente atualizado e adicionado à fila com sucesso' 
        : 'Cliente adicionado à fila com sucesso';
      
      console.log(`✅ [FILA] ${mensagem}`);
      return reply.status(201).send({
        success: true,
        message: mensagem,
        data: { 
          cliente: {
            id: cliente.id,
            nome: cliente.nome,
            posicao: cliente.posicao,
            status: cliente.status,
            token: cliente.token
          }, 
          qr_code_fila: qrCodeFila, 
          qr_code_status: qrCodeStatus, 
          posicao: cliente.posicao,
          is_update: isUpdate
        }
      });
    } catch (error) {
      console.log('❌ [FILA] Erro geral:', error);
      return reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
    }
  });



  // Obter fila da barbearia (APENAS BARBEIROS)
  fastify.get('/fila/:barbearia_id', {
    schema: {
      description: 'Obter fila da barbearia (APENAS BARBEIROS)',
      tags: ['fila'],
      params: {
        type: 'object',
        required: ['barbearia_id'],
        properties: { barbearia_id: { type: 'integer' } }
      },
      response: {
        200: {
          description: 'Fila da barbearia',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                clientes: { type: 'array' },
                estatisticas: { type: 'object' }
              }
            }
          }
        }
      }
    },
    preHandler: [fastify.authenticate, checkBarbeiroBarbeariaAccess]
  }, async (request, reply) => {
    try {
      const { barbearia_id } = request.params;
      // Verificar se a barbearia existe
      const { data: barbearia, error: barbeariaError } = await fastify.supabase
        .from('barbearias')
        .select('id, nome, ativo')
        .eq('id', barbearia_id)
        .single();
      if (barbeariaError || !barbearia) {
        return reply.status(404).send({ success: false, error: 'Barbearia não encontrada' });
      }
      // Obter clientes na fila (incluindo removidos para estatísticas)
      const { data: clientes, error: clientesError } = await fastify.supabase
        .from('clientes')
        .select(`
          id,
          nome,
          telefone,
          token,
          barbearia_id,
          barbeiro_id,
          status,
          posicao,
          created_at,
          data_atendimento,
          data_finalizacao
        `)
        .eq('barbearia_id', barbearia_id)
        .in('status', ['aguardando', 'proximo', 'atendendo', 'finalizado', 'removido'])
        .order('posicao', { ascending: true });
      if (clientesError) {
        return reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
      }
      // Filtrar apenas clientes ativos para exibição
      const clientesAtivos = clientes.filter(c => !['finalizado', 'removido'].includes(c.status));
      
      // Calcular estatísticas
      const totalClientes = clientes.length;
      const aguardando = clientes.filter(c => c.status === 'aguardando').length;
      const proximo = clientes.filter(c => c.status === 'proximo').length;
      const atendendo = clientes.filter(c => c.status === 'atendendo').length;
      const finalizados = clientes.filter(c => c.status === 'finalizado').length;
      const removidos = clientes.filter(c => c.status === 'removido').length;
      
      // Obter número de barbeiros ativos
      const { data: barbeirosAtivos } = await fastify.supabase
        .from('barbeiros_barbearias')
        .select('id')
        .eq('barbearia_id', barbearia_id)
        .eq('ativo', true);
      const barbeirosAtivosCount = barbeirosAtivos ? barbeirosAtivos.length : 0;
      
      // Calcular tempo estimado (15 minutos por cliente)
      const tempoEstimado = aguardando * 15;
      
      return reply.status(200).send({
        success: true,
        data: {
          clientes: clientesAtivos,
          estatisticas: {
            total_clientes: totalClientes,
            aguardando,
            proximo,
            atendendo,
            finalizados,
            removidos,
            tempo_estimado: tempoEstimado,
            barbeiros_ativos: barbeirosAtivosCount
          }
        }
      });
    } catch (error) {
      return reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
    }
  });

  // Obter fila da barbearia (APENAS GERENTES)
  fastify.get('/fila-gerente/:barbearia_id', {
    schema: {
      description: 'Obter fila da barbearia (APENAS GERENTES)',
      tags: ['fila'],
      params: {
        type: 'object',
        required: ['barbearia_id'],
        properties: { barbearia_id: { type: 'integer' } }
      },
      response: {
        200: {
          description: 'Fila da barbearia (dados limitados para gerente)',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                estatisticas: { type: 'object' }
              }
            }
          }
        }
      }
    },
    preHandler: [fastify.authenticate, checkGerenteRole, checkGerenteBarbeariaAccess]
  }, async (request, reply) => {
    try {
      const { barbearia_id } = request.params;
      
      // Verificar se a barbearia existe
      const { data: barbearia, error: barbeariaError } = await fastify.supabase
        .from('barbearias')
        .select('id, nome, ativo')
        .eq('id', barbearia_id)
        .single();
      if (barbeariaError || !barbearia) {
        return reply.status(404).send({ success: false, error: 'Barbearia não encontrada' });
      }
      
      // Obter apenas estatísticas da fila (sem dados pessoais dos clientes)
      const { data: clientes, error: clientesError } = await fastify.supabase
        .from('clientes')
        .select('status')
        .eq('barbearia_id', barbearia_id)
        .in('status', ['aguardando', 'proximo', 'atendendo', 'finalizado', 'removido']);
        
      if (clientesError) {
        return reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
      }
      
      // Calcular estatísticas
      const totalClientes = clientes.length;
      const aguardando = clientes.filter(c => c.status === 'aguardando').length;
      const proximo = clientes.filter(c => c.status === 'proximo').length;
      const atendendo = clientes.filter(c => c.status === 'atendendo').length;
      const finalizados = clientes.filter(c => c.status === 'finalizado').length;
      const removidos = clientes.filter(c => c.status === 'removido').length;
      
      // Obter número de barbeiros ativos
      const { data: barbeirosAtivos } = await fastify.supabase
        .from('barbeiros_barbearias')
        .select('id')
        .eq('barbearia_id', barbearia_id)
        .eq('ativo', true);
      const barbeirosAtivosCount = barbeirosAtivos ? barbeirosAtivos.length : 0;
      
      // Calcular tempo estimado (15 minutos por cliente)
      const tempoEstimado = aguardando * 15;
      
      return reply.status(200).send({
        success: true,
        data: {
          barbearia: {
            id: barbearia.id,
            nome: barbearia.nome
          },
          estatisticas: {
            total_clientes: totalClientes,
            aguardando,
            proximo,
            atendendo,
            finalizados,
            removidos,
            tempo_estimado: tempoEstimado,
            barbeiros_ativos: barbeirosAtivosCount
          }
        }
      });
    } catch (error) {
      return reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
    }
  });













  // Status do cliente na fila via cookies (PÚBLICO)
  fastify.get('/fila/status', {
    schema: {
      description: 'Obter status do cliente na fila via cookies',
      tags: ['fila'],
      response: {
        200: {
          description: 'Status do cliente',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' }
          }
        },
        401: {
          description: 'Cliente não autenticado',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            error: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      // Obter token do cookie do cliente
      const token = fastify.getClienteToken(request);
      
      if (!token) {
        return reply.status(401).send({ 
          success: false, 
          error: 'Token de cliente não encontrado. Faça login na fila primeiro.' 
        });
      }

      const { data: cliente } = await fastify.supabase
        .from('clientes')
        .select('*')
        .eq('token', token)
        .single();
      
      if (!cliente) {
        // Limpar cookies se cliente não encontrado
        fastify.clearClienteCookies(reply);
        
        return reply.status(404).send({ 
          success: false, 
          error: 'Cliente não encontrado. Faça login na fila novamente.' 
        });
      }
      
      return reply.status(200).send({ success: true, data: cliente });
    } catch (error) {
      return reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
    }
  });

  // Sair da fila (limpa cookies)
  fastify.post('/fila/sair', {
    schema: {
      description: 'Sair da fila e limpar cookies',
      tags: ['fila'],
      response: {
        200: {
          description: 'Cliente saiu da fila',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      // Obter token do cookie do cliente
      const token = fastify.getClienteToken(request);
      
      if (token) {
        // Atualizar status do cliente para 'removido'
        await fastify.supabase
          .from('clientes')
          .update({ status: 'removido' })
          .eq('token', token);
      }

      // Limpar cookies do cliente
      fastify.clearClienteCookies(reply);
      
      return reply.status(200).send({ 
        success: true, 
        message: 'Você saiu da fila com sucesso' 
      });
    } catch (error) {
      return reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
    }
  });

  // Endpoint /api/fila/visualizar já existe em src/routes/fila/visualizar.js
  // Usando /api/fila/{barbearia_id} para visualizar fila específica

  /**
   * @swagger
   * /api/fila/estatisticas:
   *   get:
   *     tags: [fila]
   *     summary: Obter estatísticas da fila (PRIVADO)
   *     security:
   *       - Bearer: []
   *     responses:
   *       200:
   *         description: Estatísticas da fila
   *       403:
   *         description: Acesso negado
   */
  fastify.get('/fila/estatisticas', {
    preHandler: [fastify.authenticate]
  }, async (request, reply) => {
    try {
      const userId = request.user.id;
      const userRole = request.user.role;
      
      // Determinar barbearia_id baseado no role
      let barbearia_id = null;
      
      if (userRole === 'admin') {
        barbearia_id = request.query.barbearia_id || 1;
      } else if (userRole === 'gerente') {
        const { data: gerenteBarbearia } = await fastify.supabase
          .from('barbearias')
          .select('id')
          .eq('gerente_id', userId)
          .single();
        barbearia_id = gerenteBarbearia?.id;
      } else if (userRole === 'barbeiro') {
        const { data: barbeiroBarbearia } = await fastify.supabase
          .from('barbeiros_barbearias')
          .select('barbearia_id')
          .eq('user_id', userId)
          .eq('ativo', true)
          .single();
        barbearia_id = barbeiroBarbearia?.barbearia_id;
      }
      
      if (!barbearia_id) {
        return reply.status(403).send({
          success: false,
          error: 'Você não tem acesso a nenhuma barbearia'
        });
      }
      
      // Buscar estatísticas da fila
      const { data: clientes, error: clientesError } = await fastify.supabase
        .from('clientes')
        .select('status, data_entrada, data_atendimento, data_finalizacao')
        .eq('barbearia_id', barbearia_id)
        .gte('data_entrada', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()); // Últimas 24h
        
      if (clientesError) {
        return reply.status(500).send({
          success: false,
          error: 'Erro interno do servidor'
        });
      }
      
      // Calcular estatísticas
      const totalClientesFila = clientes.filter(c => ['aguardando', 'proximo', 'atendendo'].includes(c.status)).length;
      const clientesAtendidosHoje = clientes.filter(c => c.status === 'finalizado').length;
      
      // Calcular tempo médio de espera (últimas 24h)
      const clientesComTempo = clientes.filter(c => c.data_atendimento && c.data_entrada);
      const tempoMedioEspera = clientesComTempo.length > 0 
        ? Math.round(clientesComTempo.reduce((acc, c) => {
            const tempo = new Date(c.data_atendimento) - new Date(c.data_entrada);
            return acc + tempo;
          }, 0) / clientesComTempo.length / 1000 / 60) // em minutos
        : 0;
      
      // Calcular tempo médio de atendimento
      const clientesComAtendimento = clientes.filter(c => c.data_finalizacao && c.data_atendimento);
      const tempoMedioAtendimento = clientesComAtendimento.length > 0
        ? Math.round(clientesComAtendimento.reduce((acc, c) => {
            const tempo = new Date(c.data_finalizacao) - new Date(c.data_atendimento);
            return acc + tempo;
          }, 0) / clientesComAtendimento.length / 1000 / 60) // em minutos
        : 30; // Default 30 minutos
      
      // Buscar barbeiros ativos
      const { data: barbeirosAtivos, error: barbeirosError } = await fastify.supabase
        .from('barbeiros_barbearias')
        .select('id')
        .eq('barbearia_id', barbearia_id)
        .eq('ativo', true);
        
      if (barbeirosError) {
        return reply.status(500).send({
          success: false,
          error: 'Erro interno do servidor'
        });
      }
      
      const barbeirosAtivosCount = barbeirosAtivos?.length || 0;
      
      return reply.status(200).send({
        success: true,
        data: {
          barbearia_id: barbearia_id,
          total_clientes_fila: totalClientesFila,
          tempo_medio_espera: tempoMedioEspera,
          barbeiros_ativos: barbeirosAtivosCount,
          clientes_atendidos_hoje: clientesAtendidosHoje,
          tempo_medio_atendimento: tempoMedioAtendimento
        }
      });
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  });

  /**
   * @swagger
   * /api/fila/gerenciar:
   *   post:
   *     tags: [fila]
   *     summary: Gerenciar fila (PRIVADO)
   *     security:
   *       - Bearer: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [acao, cliente_id]
   *             properties:
   *               acao: { type: string, enum: [iniciar_atendimento, finalizar_atendimento, remover] }
   *               cliente_id: { type: string, format: uuid }
   *               barbeiro_id: { type: string, format: uuid }
   *     responses:
   *       200:
   *         description: Ação realizada com sucesso
   *       403:
   *         description: Acesso negado
   */
  fastify.post('/fila/gerenciar', {
    preHandler: [fastify.authenticate]
  }, async (request, reply) => {
    try {
      const { acao, cliente_id, barbeiro_id } = request.body;
      const userId = request.user.id;
      const userRole = request.user.role;
      
      if (!acao || !cliente_id) {
        return reply.status(400).send({
          success: false,
          error: 'Ação e cliente_id são obrigatórios'
        });
      }
      
      // Buscar cliente
      const { data: cliente, error: clienteError } = await fastify.supabase
        .from('clientes')
        .select('*')
        .eq('id', cliente_id)
        .single();
        
      if (clienteError || !cliente) {
        return reply.status(404).send({
          success: false,
          error: 'Cliente não encontrado'
        });
      }
      
      // Verificar permissões
      if (userRole === 'barbeiro') {
        // Barbeiro só pode gerenciar clientes da sua barbearia
        const { data: barbeiroBarbearia } = await fastify.supabase
          .from('barbeiros_barbearias')
          .select('barbearia_id')
          .eq('user_id', userId)
          .eq('ativo', true)
          .single();
          
        if (!barbeiroBarbearia || barbeiroBarbearia.barbearia_id !== cliente.barbearia_id) {
          return reply.status(403).send({
            success: false,
            error: 'Você não tem permissão para gerenciar este cliente'
          });
        }
      }
      
      // Executar ação
      let updateData = {};
      let message = '';
      
      switch (acao) {
        case 'iniciar_atendimento':
          updateData = {
            status: 'atendendo',
            data_atendimento: new Date().toISOString(),
            barbeiro_id: barbeiro_id || userId
          };
          message = 'Atendimento iniciado com sucesso';
          break;
          
        case 'finalizar_atendimento':
          updateData = {
            status: 'finalizado',
            data_finalizacao: new Date().toISOString()
          };
          message = 'Atendimento finalizado com sucesso';
          break;
          
        case 'remover':
          updateData = {
            status: 'removido'
          };
          message = 'Cliente removido da fila com sucesso';
          break;
          
        default:
          return reply.status(400).send({
            success: false,
            error: 'Ação inválida'
          });
      }
      
      // Atualizar cliente
      const { error: updateError } = await fastify.supabase
        .from('clientes')
        .update(updateData)
        .eq('id', cliente_id);
        
      if (updateError) {
        return reply.status(500).send({
          success: false,
          error: 'Erro interno do servidor'
        });
      }
      
      return reply.status(200).send({
        success: true,
        message: message
      });
    } catch (error) {
      console.error('Erro ao gerenciar fila:', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  });

  /**
   * @swagger
   * /api/barbearias/{id}/fila:
   *   get:
   *     tags: [fila]
   *     summary: Obter fila completa de uma barbearia (PRIVADO)
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
   *         description: Fila da barbearia
   *       403:
   *         description: Acesso negado
   */
  fastify.get('/barbearias/:id/fila', {
    preHandler: [fastify.authenticate]
  }, async (request, reply) => {
    try {
      const { id: barbearia_id } = request.params;
      const userId = request.user.id;
      const userRole = request.user.role;
      
      // Verificar permissões
      if (userRole === 'barbeiro') {
        const { data: barbeiroBarbearia } = await fastify.supabase
          .from('barbeiros_barbearias')
          .select('barbearia_id')
          .eq('user_id', userId)
          .eq('ativo', true)
          .single();
          
        if (!barbeiroBarbearia || barbeiroBarbearia.barbearia_id !== parseInt(barbearia_id)) {
          return reply.status(403).send({
            success: false,
            error: 'Você não tem acesso a esta barbearia'
          });
        }
      }
      
      // Buscar fila da barbearia
      const { data: clientes, error: clientesError } = await fastify.supabase
        .from('clientes')
        .select(`
          id,
          nome,
          telefone,
          posicao,
          status,
          barbeiro_id,
          data_entrada,
          users!barbeiro_id(id, nome)
        `)
        .eq('barbearia_id', barbearia_id)
        .order('posicao', { ascending: true });
        
      if (clientesError) {
        return reply.status(500).send({
          success: false,
          error: 'Erro interno do servidor'
        });
      }
      
      // Formatar dados da fila
      const fila = clientes.map(cliente => ({
        id: cliente.id,
        nome: cliente.nome,
        telefone: cliente.telefone,
        posicao: cliente.posicao,
        status: cliente.status,
        barbeiro_id: cliente.barbeiro_id,
        barbeiro_nome: cliente.users?.nome || 'Fila Geral',
        entrada_na_fila: cliente.data_entrada
      }));
      
      return reply.status(200).send({
        success: true,
        data: {
          barbearia_id: parseInt(barbearia_id),
          fila: fila
        }
      });
    } catch (error) {
      console.error('Erro ao obter fila da barbearia:', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  });

  /**
   * @swagger
   * /api/barbearias/{id}/fila/publica:
   *   get:
   *     tags: [fila]
   *     summary: Obter fila pública de uma barbearia (PÚBLICO)
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Fila pública da barbearia
   */
  fastify.get('/barbearias/:id/fila/publica', async (request, reply) => {
    try {
      const { id: barbearia_id } = request.params;
      
      // Verificar se a barbearia existe e está ativa
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
      
      // Buscar apenas estatísticas da fila (sem dados pessoais)
      const { data: clientes, error: clientesError } = await fastify.supabase
        .from('clientes')
        .select('status')
        .eq('barbearia_id', barbearia_id)
        .in('status', ['aguardando', 'proximo', 'atendendo']);
        
      if (clientesError) {
        return reply.status(500).send({
          success: false,
          error: 'Erro interno do servidor'
        });
      }
      
      // Calcular estatísticas
      const totalClientes = clientes.length;
      const aguardando = clientes.filter(c => c.status === 'aguardando').length;
      const proximo = clientes.filter(c => c.status === 'proximo').length;
      const atendendo = clientes.filter(c => c.status === 'atendendo').length;
      
      // Buscar barbeiros ativos
      const { data: barbeirosAtivos } = await fastify.supabase
        .from('barbeiros_barbearias')
        .select('id')
        .eq('barbearia_id', barbearia_id)
        .eq('ativo', true);
      
      const barbeirosAtivosCount = barbeirosAtivos?.length || 0;
      
      // Calcular tempo estimado (15 minutos por cliente)
      const tempoEstimado = aguardando * 15;
      
      return reply.status(200).send({
        success: true,
        data: {
          barbearia: {
            id: barbearia.id,
            nome: barbearia.nome
          },
          estatisticas: {
            total_clientes: totalClientes,
            aguardando: aguardando,
            proximo: proximo,
            atendendo: atendendo,
            tempo_estimado: tempoEstimado,
            barbeiros_ativos: barbeirosAtivosCount
          }
        }
      });
    } catch (error) {
      console.error('Erro ao obter fila pública:', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  });

  /**
   * @swagger
   * /api/fila/iniciar-atendimento/{clienteId}:
   *   post:
   *     tags: [fila]
   *     summary: Iniciar atendimento de um cliente (PRIVADO)
   *     security:
   *       - Bearer: []
   *     parameters:
   *       - in: path
   *         name: clienteId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: Atendimento iniciado com sucesso
   *       403:
   *         description: Acesso negado
   */
  fastify.post('/fila/iniciar-atendimento/:clienteId', {
    preHandler: [fastify.authenticate]
  }, async (request, reply) => {
    try {
      const { clienteId } = request.params;
      const userId = request.user.id;
      
      // Buscar cliente
      const { data: cliente, error: clienteError } = await fastify.supabase
        .from('clientes')
        .select('*')
        .eq('id', clienteId)
        .single();
        
      if (clienteError || !cliente) {
        return reply.status(404).send({
          success: false,
          error: 'Cliente não encontrado'
        });
      }
      
      // Verificar se o barbeiro está ativo na barbearia
      const { data: barbeiroAtivo, error: barbeiroError } = await fastify.supabase
        .from('barbeiros_barbearias')
        .select('id')
        .eq('user_id', userId)
        .eq('barbearia_id', cliente.barbearia_id)
        .eq('ativo', true)
        .single();
        
      if (barbeiroError || !barbeiroAtivo) {
        return reply.status(403).send({
          success: false,
          error: 'Você não está ativo nesta barbearia'
        });
      }
      
      // Atualizar status do cliente
      const { error: updateError } = await fastify.supabase
        .from('clientes')
        .update({
          status: 'atendendo',
          data_atendimento: new Date().toISOString(),
          barbeiro_id: userId
        })
        .eq('id', clienteId);
        
      if (updateError) {
        return reply.status(500).send({
          success: false,
          error: 'Erro interno do servidor'
        });
      }
      
      return reply.status(200).send({
        success: true,
        message: 'Atendimento iniciado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao iniciar atendimento:', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  });



  /**
   * @swagger
   * /api/fila/remover/{clienteId}:
   *   delete:
   *     tags: [fila]
   *     summary: Remover cliente da fila (PRIVADO)
   *     security:
   *       - Bearer: []
   *     parameters:
   *       - in: path
   *         name: clienteId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: Cliente removido com sucesso
   *       403:
   *         description: Acesso negado
   */
  fastify.delete('/fila/remover/:clienteId', {
    preHandler: [fastify.authenticate]
  }, async (request, reply) => {
    try {
      const { clienteId } = request.params;
      const userId = request.user.id;
      const userRole = request.user.role;
      
      // Buscar cliente
      const { data: cliente, error: clienteError } = await fastify.supabase
        .from('clientes')
        .select('*')
        .eq('id', clienteId)
        .single();
        
      if (clienteError || !cliente) {
        return reply.status(404).send({
          success: false,
          error: 'Cliente não encontrado'
        });
      }
      
      // Verificar permissões
      if (userRole === 'barbeiro') {
        // Barbeiro só pode remover clientes da sua barbearia
        const { data: barbeiroBarbearia } = await fastify.supabase
          .from('barbeiros_barbearias')
          .select('barbearia_id')
          .eq('user_id', userId)
          .eq('ativo', true)
          .single();
          
        if (!barbeiroBarbearia || barbeiroBarbearia.barbearia_id !== cliente.barbearia_id) {
          return reply.status(403).send({
            success: false,
            error: 'Você não tem permissão para remover este cliente'
          });
        }
      }
      
      // Atualizar status do cliente
      const { error: updateError } = await fastify.supabase
        .from('clientes')
        .update({
          status: 'removido'
        })
        .eq('id', clienteId);
        
      if (updateError) {
        return reply.status(500).send({
          success: false,
          error: 'Erro interno do servidor'
        });
      }
      
      return reply.status(200).send({
        success: true,
        message: 'Cliente removido da fila com sucesso'
      });
    } catch (error) {
      console.error('Erro ao remover cliente:', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  });

  /**
   * @swagger
   * /api/fila/admin/remover/{clienteId}:
   *   delete:
   *     tags: [fila]
   *     summary: Remover cliente da fila (ADMIN)
   *     security:
   *       - Bearer: []
   *     parameters:
   *       - in: path
   *         name: clienteId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: Cliente removido com sucesso
   *       403:
   *         description: Acesso negado
   */
  fastify.delete('/fila/admin/remover/:clienteId', {
    preHandler: [fastify.authenticate, checkAdminRole]
  }, async (request, reply) => {
    try {
      const { clienteId } = request.params;
      
      // Buscar cliente
      const { data: cliente, error: clienteError } = await fastify.supabase
        .from('clientes')
        .select('*')
        .eq('id', clienteId)
        .single();
        
      if (clienteError || !cliente) {
        return reply.status(404).send({
          success: false,
          error: 'Cliente não encontrado'
        });
      }
      
      // Remover cliente (apenas admin pode fazer isso)
      const { error: deleteError } = await fastify.supabase
        .from('clientes')
        .delete()
        .eq('id', clienteId);
        
      if (deleteError) {
        return reply.status(500).send({
          success: false,
          error: 'Erro interno do servidor'
        });
      }
      
      return reply.status(200).send({
        success: true,
        message: 'Cliente removido permanentemente com sucesso'
      });
    } catch (error) {
      console.error('Erro ao remover cliente (admin):', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  });

  /**
   * @swagger
   * /api/barbearias/{id}/fila/adicionar-manual:
   *   post:
   *     tags: [fila]
   *     summary: Adicionar cliente manualmente à fila (PRIVADO)
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
   *             type: object
   *             required: [nome, telefone]
   *             properties:
   *               nome: { type: string }
   *               telefone: { type: string }
   *               barbeiro_id: { type: string, format: uuid }
   *     responses:
   *       201:
   *         description: Cliente adicionado com sucesso
   *       403:
   *         description: Acesso negado
   */
  fastify.post('/barbearias/:id/fila/adicionar-manual', {
    preHandler: [fastify.authenticate]
  }, async (request, reply) => {
    try {
      const { id: barbearia_id } = request.params;
      const { nome, telefone, barbeiro_id } = request.body;
      const userId = request.user.id;
      const userRole = request.user.role;
      
      if (!nome || !telefone) {
        return reply.status(400).send({
          success: false,
          error: 'Nome e telefone são obrigatórios'
        });
      }
      
      // Verificar permissões
      if (userRole === 'barbeiro') {
        const { data: barbeiroBarbearia } = await fastify.supabase
          .from('barbeiros_barbearias')
          .select('barbearia_id')
          .eq('user_id', userId)
          .eq('ativo', true)
          .single();
          
        if (!barbeiroBarbearia || barbeiroBarbearia.barbearia_id !== parseInt(barbearia_id)) {
          return reply.status(403).send({
            success: false,
            error: 'Você não tem acesso a esta barbearia'
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
      
      // Se barbeiro_id foi especificado, verificar se está ativo
      if (barbeiro_id) {
        const { data: barbeiroAtivo, error: barbeiroError } = await fastify.supabase
          .from('barbeiros_barbearias')
          .select('id')
          .eq('user_id', barbeiro_id)
          .eq('barbearia_id', barbearia_id)
          .eq('ativo', true)
          .single();
          
        if (barbeiroError || !barbeiroAtivo) {
          return reply.status(400).send({
            success: false,
            error: 'Barbeiro especificado não está ativo nesta barbearia'
          });
        }
      }
      
      // Gerar token único
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      // Calcular posição
      const { data: ultimoCliente, error: posicaoError } = await fastify.supabase
        .from('clientes')
        .select('posicao')
        .eq('barbearia_id', barbearia_id)
        .in('status', ['aguardando', 'proximo'])
        .order('posicao', { ascending: false })
        .limit(1)
        .single();
        
      const posicao = (ultimoCliente?.posicao || 0) + 1;
      
      // Inserir cliente
      const { data: novoCliente, error: insertError } = await fastify.supabase
        .from('clientes')
        .insert({
          nome,
          telefone,
          token,
          barbearia_id: parseInt(barbearia_id),
          barbeiro_id,
          status: 'aguardando',
          posicao,
          data_entrada: new Date().toISOString()
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
        message: 'Cliente adicionado manualmente com sucesso',
        data: {
          cliente: novoCliente,
          posicao: posicao
        }
      });
    } catch (error) {
      console.error('Erro ao adicionar cliente manualmente:', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  });
}

module.exports = filaRoutes; 