const QRCode = require('qrcode');

/**
 * Serviço para operações relacionadas à fila de clientes
 * 
 * Este serviço contém toda a lógica de negócio relacionada à fila,
 * separando as operações de banco de dados das rotas.
 */
class FilaService {
  constructor(supabase, fastify = null) {
    this.supabase = supabase;
    this.fastify = fastify;
  }

  /**
   * Gerar token único para cliente
   */
  gerarTokenUnico() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  /**
   * Gerar token JWT para cliente (4 horas)
   */
  gerarTokenJWTCliente(clienteData) {
    if (!this.fastify) {
      throw new Error('Fastify instance não fornecida para gerar JWT');
    }
    
    return this.fastify.generateClienteToken({
      id: clienteData.id,
      token: clienteData.token,
      barbearia_id: clienteData.barbearia_id,
      tipo: 'cliente'
    });
  }

  /**
   * Adicionar cliente à fila
   * @param {Object} clienteData - Dados do cliente
   * @param {string} clienteData.nome - Nome do cliente
   * @param {string} clienteData.telefone - Telefone do cliente
   * @param {number} clienteData.barbearia_id - ID da barbearia
   * @param {string} clienteData.barbeiro_id - ID do barbeiro (opcional)
   * @returns {Promise<Object>} Cliente criado com QR codes
   */
  async adicionarClienteNaFila(clienteData) {
    const { nome, telefone, barbearia_id, barbeiro_id } = clienteData;

    // Verificar se a barbearia existe e está ativa
    const { data: barbearia, error: barbeariaError } = await this.supabase
      .from('barbearias')
      .select('id, nome, ativo')
      .eq('id', barbearia_id)
      .eq('ativo', true)
      .single();
      
    if (barbeariaError || !barbearia) {
      throw new Error('Barbearia não encontrada ou inativa');
    }
    
    // Se barbeiro_id foi especificado, verificar se o barbeiro está ativo na barbearia
    if (barbeiro_id) {
      const { data: barbeiroAtivo, error: barbeiroError } = await this.supabase
        .from('barbeiros_barbearias')
        .select('id, ativo')
        .eq('user_id', barbeiro_id)
        .eq('barbearia_id', barbearia_id)
        .eq('ativo', true)
        .single();
        
      if (barbeiroError || !barbeiroAtivo) {
        throw new Error('Barbeiro especificado não está ativo nesta barbearia');
      }
    }
    
    // Verificar se o cliente já existe (nome + telefone + barbearia)
    const { data: clienteExistente, error: clienteError } = await this.supabase
      .from('clientes')
      .select('id, nome, telefone, status, posicao, token')
      .eq('nome', nome)
      .eq('telefone', telefone)
      .eq('barbearia_id', barbearia_id)
      .single();
      
    let cliente;
    let isUpdate = false;
    
    if (clienteExistente) {
      // Cliente já existe, vamos atualizar para entrar na fila novamente
      console.log('🔄 [FILA] Cliente já existe, atualizando para entrar na fila...');
      
      // Gerar novo token
      const novoToken = this.gerarTokenUnico();
      
      // Calcular nova posição
      const novaPosicao = await this.calcularProximaPosicao(barbearia_id);
      
      // Atualizar cliente existente (mesmo se já estiver na fila)
      const { data: clienteAtualizado, error: updateError } = await this.supabase
        .from('clientes')
        .update({
          token: novoToken,
          barbeiro_id,
          status: 'aguardando',
          posicao: novaPosicao,
          updated_at: new Date().toISOString()
        })
        .eq('id', clienteExistente.id)
        .select()
        .single();
        
      if (updateError) {
        console.error('Erro ao atualizar cliente:', updateError);
        throw new Error('Erro interno do servidor');
      }
      
      cliente = clienteAtualizado;
      isUpdate = true;
      
    } else {
      // Gerar token único para o cliente
      const token = this.gerarTokenUnico();
      
      // Obter posição atual na fila
      const posicao = await this.calcularProximaPosicao(barbearia_id);
      
      // Inserir novo cliente na fila
      const { data: novoCliente, error: insertError } = await this.supabase
        .from('clientes')
        .insert({
          nome,
          telefone,
          token,
          barbearia_id,
          barbeiro_id,
          posicao,
          status: 'aguardando',
          created_at: new Date().toISOString()
        })
        .select()
        .single();
        
      if (insertError) {
        console.error('Erro ao inserir cliente:', insertError);
        throw new Error('Erro interno do servidor');
      }
      
      cliente = novoCliente;
    }
    
    // Gerar QR codes
    const qrCodeFila = await this.gerarQRCodeFila(cliente);
    const qrCodeStatus = await this.gerarQRCodeStatus(cliente);
    
    const resposta = {
      cliente: {
        id: cliente.id,
        nome: cliente.nome,
        telefone: cliente.telefone,
        posicao: cliente.posicao,
        status: cliente.status,
        token: cliente.token
      },
      qr_code_fila: qrCodeFila,
      qr_code_status: qrCodeStatus,
      posicao: cliente.posicao,
      is_update: isUpdate
    };
    
    return resposta;
  }

  /**
   * Obter fila completa da barbearia
   * @param {number} barbearia_id - ID da barbearia
   * @returns {Promise<Object>} Fila completa
   */
  async obterFilaCompleta(barbearia_id) {
    // Verificar se a barbearia existe
    const { data: barbearia, error: barbeariaError } = await this.supabase
      .from('barbearias')
      .select('id, nome, ativo')
      .eq('id', barbearia_id)
      .single();
    if (barbeariaError || !barbearia) {
      throw new Error('Barbearia não encontrada');
    }
    
    // Reordenar fila antes de obter os dados
    const reordenacaoSucesso = await this.reordenarFila(barbearia_id);
    
    // Obter clientes na fila (após reordenação)
    const { data: clientes, error: clientesError } = await this.supabase
      .from('clientes')
      .select(`
        id,
        nome,
        telefone,
        posicao,
        status,
        created_at,
        barbeiro_id,
        users(id, nome)
      `)
      .eq('barbearia_id', barbearia_id)
      .in('status', ['aguardando', 'proximo', 'atendendo', 'finalizado', 'removido'])
      .order('posicao', { ascending: true });
      
    if (clientesError) {
      throw new Error('Erro interno do servidor');
    }
    
    // Calcular estatísticas
    const estatisticas = this.calcularEstatisticas(clientes);
    
    // Obter número de barbeiros ativos
    const barbeirosAtivosCount = await this.obterBarbeirosAtivosCount(barbearia_id);
    estatisticas.barbeiros_ativos = barbeirosAtivosCount;
    
    // Filtrar clientes ativos (aguardando, próximo, atendendo) para o array principal
    const clientesAtivos = clientes.filter(cliente => 
      ['aguardando', 'proximo', 'atendendo'].includes(cliente.status)
    );
    
    return {
      barbearia: {
        id: barbearia.id,
        nome: barbearia.nome
      },
      clientes: clientesAtivos.map(cliente => ({
        id: cliente.id,
        nome: cliente.nome,
        telefone: cliente.telefone,
        posicao: cliente.posicao,
        status: cliente.status,
        created_at: cliente.created_at,
        barbeiro: cliente.users ? {
          id: cliente.users.id,
          nome: cliente.users.nome
        } : null
      })),
      estatisticas,
      reordenacao: {
        sucesso: reordenacaoSucesso,
        mensagem: reordenacaoSucesso ? 'Fila reordenada automaticamente' : 'Fila não foi reordenada'
      }
    };
  }

  /**
   * Obter estatísticas da fila (para clientes e gerentes)
   * @param {number} barbearia_id - ID da barbearia
   * @param {boolean} verificarAtivo - Se deve verificar se barbearia está ativa
   * @returns {Promise<Object>} Estatísticas da fila
   */
  async obterEstatisticasFila(barbearia_id, verificarAtivo = false) {
    // Verificar se a barbearia existe
    let query = this.supabase
      .from('barbearias')
      .select('id, nome, ativo')
      .eq('id', barbearia_id);
    
    if (verificarAtivo) {
      query = query.eq('ativo', true);
    }
    
    const { data: barbearia, error: barbeariaError } = await query.single();
    if (barbeariaError || !barbearia) {
      throw new Error(verificarAtivo ? 'Barbearia não encontrada ou inativa' : 'Barbearia não encontrada');
    }
    
    // Obter apenas estatísticas da fila (sem dados pessoais dos clientes)
    const { data: clientes, error: clientesError } = await this.supabase
      .from('clientes')
      .select('status')
      .eq('barbearia_id', barbearia_id)
      .in('status', ['aguardando', 'proximo', 'atendendo', 'finalizado', 'removido']);
      
    if (clientesError) {
      throw new Error('Erro interno do servidor');
    }
    
    // Calcular estatísticas
    const estatisticas = this.calcularEstatisticas(clientes);
    
    // Obter número de barbeiros ativos
    const barbeirosAtivosCount = await this.obterBarbeirosAtivosCount(barbearia_id);
    estatisticas.barbeiros_ativos = barbeirosAtivosCount;
    
    return {
      barbearia: {
        id: barbearia.id,
        nome: barbearia.nome
      },
      estatisticas
    };
  }

  /**
   * Chamar próximo cliente da fila
   * @param {number} barbearia_id - ID da barbearia
   * @param {string} barbeiro_id - ID do barbeiro
   * @returns {Promise<Object>} Próximo cliente chamado
   */
  async chamarProximoCliente(barbearia_id, barbeiro_id) {
    // Verificar se a barbearia existe
    const { data: barbearia, error: barbeariaError } = await this.supabase
      .from('barbearias')
      .select('id, nome, ativo')
      .eq('id', barbearia_id)
      .single();
    if (barbeariaError || !barbearia) {
      throw new Error('Barbearia não encontrada');
    }
    
    // Buscar próximo cliente na fila
    const { data: proximoCliente, error: clienteError } = await this.supabase
      .from('clientes')
      .select('id, nome, telefone, posicao, status')
      .eq('barbearia_id', barbearia_id)
      .eq('status', 'aguardando')
      .order('posicao', { ascending: true })
      .limit(1)
      .single();
      
    if (clienteError || !proximoCliente) {
      throw new Error('Não há clientes aguardando na fila');
    }
    
    // Atualizar status do cliente para 'próximo'
    const { error: updateError } = await this.supabase
      .from('clientes')
      .update({ 
        status: 'proximo',
        barbeiro_id: barbeiro_id,
        updated_at: new Date().toISOString()
      })
      .eq('id', proximoCliente.id);
      
    if (updateError) {
      throw new Error('Erro ao atualizar status do cliente');
    }
    
    return {
      cliente: {
        id: proximoCliente.id,
        nome: proximoCliente.nome,
        telefone: proximoCliente.telefone,
        posicao: proximoCliente.posicao,
        status: 'proximo'
      },
      barbearia: {
        id: barbearia.id,
        nome: barbearia.nome
      }
    };
  }

  /**
   * Verificar status do cliente pelo token
   * @param {string} token - Token do cliente
   * @returns {Promise<Object>} Status do cliente
   */
  async verificarStatusCliente(token) {
    // Buscar cliente pelo token
    const { data: cliente, error: clienteError } = await this.supabase
      .from('clientes')
      .select(`
        id,
        nome,
        telefone,
        posicao,
        status,
        created_at,
        barbearia_id,
        barbearias(id, nome)
      `)
      .eq('token', token)
      .single();
      
    if (clienteError || !cliente) {
      throw new Error('Cliente não encontrado');
    }
    
    // Calcular posição atual na fila (apenas para clientes aguardando)
    let posicaoAtual = null;
    let tempoEstimado = null;
    
    if (cliente.status === 'aguardando') {
      const { data: clientesAguardando, error: posicaoError } = await this.supabase
        .from('clientes')
        .select('posicao')
        .eq('barbearia_id', cliente.barbearia_id)
        .eq('status', 'aguardando')
        .lte('posicao', cliente.posicao)
        .order('posicao', { ascending: true });
        
      if (!posicaoError && clientesAguardando) {
        posicaoAtual = clientesAguardando.length;
        tempoEstimado = posicaoAtual * 15; // 15 minutos por cliente
      }
    }
    
    const resultado = {
      cliente: {
        id: cliente.id,
        nome: cliente.nome,
        telefone: cliente.telefone,
        posicao: cliente.posicao,
        status: cliente.status,
        created_at: cliente.created_at
      },
      barbearia: cliente.barbearias ? {
        id: cliente.barbearias.id,
        nome: cliente.barbearias.nome
      } : null,
      posicao_atual: posicaoAtual,
      tempo_estimado: tempoEstimado
    };
    
    return resultado;
  }

  // Métodos auxiliares privados

  /**
   * Calcular próxima posição na fila
   * @param {number} barbearia_id - ID da barbearia
   * @returns {Promise<number>} Próxima posição
   */
  async calcularProximaPosicao(barbearia_id) {
    // Primeiro, reordenar a fila para garantir posições sequenciais
    await this.reordenarFila(barbearia_id);
    
    // Agora calcular a próxima posição baseada na fila reordenada
    const { data: ultimoCliente, error: posicaoError } = await this.supabase
      .from('clientes')
      .select('posicao')
      .eq('barbearia_id', barbearia_id)
      .in('status', ['aguardando', 'proximo'])
      .order('posicao', { ascending: false })
      .limit(1)
      .single();
      
    return ultimoCliente ? ultimoCliente.posicao + 1 : 1;
  }

  /**
   * Reordenar fila removendo posições de clientes removidos
   * @param {number} barbearia_id - ID da barbearia
   * @returns {Promise<boolean>} Sucesso da operação
   */
  async reordenarFila(barbearia_id) {
    try {
      // Buscar todos os clientes ativos na fila (APENAS aguardando e próximo)
      const { data: clientesAtivos, error: clientesError } = await this.supabase
        .from('clientes')
        .select('id, nome, posicao, status')
        .eq('barbearia_id', barbearia_id)
        .in('status', ['aguardando', 'proximo'])
        .order('created_at', { ascending: true }); // Ordenar por data de criação

      if (clientesError) {
        return false;
      }

      if (!clientesAtivos || clientesAtivos.length === 0) {
        return true; // Nenhum cliente para reordenar
      }

      // Reordenar posições sequencialmente começando do 1
      const updates = clientesAtivos.map((cliente, index) => ({
        id: cliente.id,
        nome: cliente.nome,
        posicao_atual: cliente.posicao,
        nova_posicao: index + 1
      }));

      // Atualizar posições em lote
      let sucessos = 0;
      let erros = 0;

      for (const update of updates) {
        const { error: updateError } = await this.supabase
          .from('clientes')
          .update({ 
            posicao: update.nova_posicao,
            updated_at: new Date().toISOString()
          })
          .eq('id', update.id);

        if (updateError) {
          erros++;
        } else {
          sucessos++;
        }
      }
      
      return erros === 0; // Retorna true apenas se não houve erros
    } catch (error) {
      return false;
    }
  }

  /**
   * Gerar QR code para fila
   * @param {Object} cliente - Dados do cliente
   * @returns {Promise<string>} QR code em base64
   */
  async gerarQRCodeFila(cliente) {
    return await QRCode.toDataURL(JSON.stringify({
      token: cliente.token,
      barbearia_id: cliente.barbearia_id,
      tipo: 'fila'
    }));
  }

  /**
   * Gerar QR code para status
   * @param {Object} cliente - Dados do cliente
   * @returns {Promise<string>} QR code em base64
   */
  async gerarQRCodeStatus(cliente) {
    return await QRCode.toDataURL(JSON.stringify({
      token: cliente.token,
      tipo: 'status'
    }));
  }

  /**
   * Calcular estatísticas da fila
   * @param {Array} clientes - Lista de clientes
   * @returns {Object} Estatísticas calculadas
   */
  calcularEstatisticas(clientes) {
    const totalClientes = clientes.length;
    const aguardando = clientes.filter(c => c.status === 'aguardando').length;
    const proximo = clientes.filter(c => c.status === 'proximo').length;
    const atendendo = clientes.filter(c => c.status === 'atendendo').length;
    const finalizados = clientes.filter(c => c.status === 'finalizado').length;
    const removidos = clientes.filter(c => c.status === 'removido').length;
    
    // Calcular tempo estimado (15 minutos por cliente AGUARDANDO apenas)
    const tempoEstimado = aguardando * 15;
    
    return {
      total_clientes: totalClientes,
      // Contagem da fila: apenas clientes aguardando
      total_na_fila: aguardando,
      aguardando,
      proximo,
      atendendo,
      finalizados,
      removidos,
      tempo_estimado: tempoEstimado
    };
  }

  /**
   * Obter número de barbeiros ativos
   * @param {number} barbearia_id - ID da barbearia
   * @returns {Promise<number>} Número de barbeiros ativos
   */
  async obterBarbeirosAtivosCount(barbearia_id) {
    const { data: barbeirosAtivos } = await this.supabase
      .from('barbeiros_barbearias')
      .select('id')
      .eq('barbearia_id', barbearia_id)
      .eq('ativo', true);
    return barbeirosAtivos ? barbeirosAtivos.length : 0;
  }

  /**
   * Obter estatísticas detalhadas da fila
   * @param {number} barbearia_id - ID da barbearia
   * @returns {Promise<Object>} Estatísticas detalhadas
   */
  async obterEstatisticasDetalhadas(barbearia_id) {
    try {
      // 1. Estatísticas da fila atual
      const { data: clientesAtuais, error: clientesError } = await this.supabase
        .from('clientes')
        .select('status, created_at, updated_at')
        .eq('barbearia_id', barbearia_id)
        .in('status', ['aguardando', 'proximo', 'atendendo', 'finalizado', 'removido']);

      if (clientesError) {
        throw new Error('Erro ao buscar clientes atuais');
      }

      const fila = {
        total: clientesAtuais.filter(c => ['aguardando', 'proximo'].includes(c.status)).length,
        aguardando: clientesAtuais.filter(c => c.status === 'aguardando').length,
        proximo: clientesAtuais.filter(c => c.status === 'proximo').length,
        atendendo: clientesAtuais.filter(c => c.status === 'atendendo').length,
        finalizado: clientesAtuais.filter(c => c.status === 'finalizado').length,
        removido: clientesAtuais.filter(c => c.status === 'removido').length
      };

      // 2. Estatísticas de barbeiros
      const { data: barbeiros, error: barbeirosError } = await this.supabase
        .from('barbeiros_barbearias')
        .select(`
          id,
          ativo,
          users(id, nome)
        `)
        .eq('barbearia_id', barbearia_id);

      if (barbeirosError) {
        throw new Error('Erro ao buscar barbeiros');
      }

      const barbeirosAtivos = barbeiros.filter(b => b.ativo);
      const barbeirosAtendendo = clientesAtuais.filter(c => c.status === 'atendendo').length;

      const barbeirosStats = {
        total: barbeirosAtivos.length,
        atendendo: barbeirosAtendendo,
        disponiveis: Math.max(0, barbeirosAtivos.length - barbeirosAtendendo),
        ocupados: barbeirosAtendendo
      };

      // 3. Tempos médios (últimas 24h) - CORRIGIDO
      const vinteQuatroHorasAtras = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      // Buscar TODOS os clientes das últimas 24h (incluindo os que ainda estão na fila)
      const { data: clientes24h, error: clientes24hError } = await this.supabase
        .from('clientes')
        .select('created_at, updated_at, status')
        .eq('barbearia_id', barbearia_id)
        .gte('created_at', vinteQuatroHorasAtras.toISOString());

      if (clientes24hError) {
        throw new Error('Erro ao buscar clientes das últimas 24h');
      }

      // console.log(`[ESTATISTICAS] Encontrados ${clientes24h?.length || 0} clientes nas últimas 24h`);

      // Calcular tempos médios CORRETOS
      const temposEspera = [];
      const temposAtendimento = [];
      
      clientes24h.forEach(cliente => {
        const created = new Date(cliente.created_at);
        const updated = new Date(cliente.updated_at);
        const agora = new Date();
        
        // Para clientes ainda na fila, usar tempo até agora
        const tempoFinal = cliente.status === 'aguardando' || cliente.status === 'proximo' || cliente.status === 'atendendo' 
          ? agora 
          : updated;
        
        // CORREÇÃO: Para clientes que reentraram na fila, usar updated_at como ponto de início
        // Se o cliente foi atualizado (reentrou na fila), usar updated_at como início do tempo
        const tempoInicio = updated > created ? updated : created;
        
        // Tempo total de espera (início real até finalização/atual)
        const tempoTotalMinutos = (tempoFinal - tempoInicio) / (1000 * 60);
        
        // console.log(`[ESTATISTICAS] Cliente ${cliente.status}: início ${tempoInicio.toISOString()}, tempo total: ${Math.round(tempoTotalMinutos)} min`);
        
        temposEspera.push(tempoTotalMinutos);
        
        // Para atendimentos finalizados, estimar tempo de atendimento
        if (cliente.status === 'finalizado') {
          // Estimativa: 30% do tempo total é atendimento
          const tempoAtendimento = tempoTotalMinutos * 0.3;
          temposAtendimento.push(tempoAtendimento);
        }
      });

      const tempoMedioEspera = temposEspera.length > 0 
        ? Math.round(temposEspera.reduce((a, b) => a + b, 0) / temposEspera.length)
        : 0;

      const tempoMedioAtendimento = temposAtendimento.length > 0
        ? Math.round(temposAtendimento.reduce((a, b) => a + b, 0) / temposAtendimento.length)
        : 30; // padrão de 30 minutos

      // console.log(`[ESTATISTICAS] Tempo médio de espera: ${tempoMedioEspera} minutos`);
      // console.log(`[ESTATISTICAS] Tempo médio de atendimento: ${tempoMedioAtendimento} minutos`);

      // Tempo estimado para o próximo cliente
      const tempoEstimadoProximo = barbeirosStats.disponiveis > 0 
        ? Math.round(tempoMedioEspera / barbeirosStats.disponiveis)
        : tempoMedioEspera;

      const tempos = {
        medioEspera: tempoMedioEspera,
        medioAtendimento: tempoMedioAtendimento,
        estimadoProximo: Math.max(1, tempoEstimadoProximo) // mínimo 1 minuto
      };

      // 4. Estatísticas das últimas 24h
      const totalAtendidos24h = clientes24h.length;
      const clientesPorHora = totalAtendidos24h / 24;
      const barbeirosAtivos24h = barbeirosAtivos.length;

      const ultimas24h = {
        totalAtendidos: totalAtendidos24h,
        tempoMedioEspera: tempoMedioEspera,
        tempoMedioAtendimento: tempoMedioAtendimento,
        clientesPorHora: Math.round(clientesPorHora * 10) / 10, // 1 casa decimal
        barbeirosAtivos: barbeirosAtivos24h
      };

      return {
        fila,
        barbeiros: barbeirosStats,
        tempos,
        ultimas24h
      };

    } catch (error) {
      console.error('Erro ao calcular estatísticas detalhadas:', error);
      throw error;
    }
  }

  /**
   * Obter fila pública com dados limitados dos clientes
   * @param {number} barbearia_id - ID da barbearia
   * @param {boolean} verificarAtivo - Se deve verificar se a barbearia está ativa
   * @returns {Promise<Object>} Fila pública com dados limitados
   */
  async obterFilaPublica(barbearia_id, verificarAtivo = false) {
    // Verificar se a barbearia existe
    let query = this.supabase
      .from('barbearias')
      .select('id, nome, ativo')
      .eq('id', barbearia_id);
    
    if (verificarAtivo) {
      query = query.eq('ativo', true);
    }
    
    const { data: barbearia, error: barbeariaError } = await query.single();
    if (barbeariaError || !barbearia) {
      throw new Error(verificarAtivo ? 'Barbearia não encontrada ou inativa' : 'Barbearia não encontrada');
    }
    
    // Obter clientes na fila com dados limitados
    const { data: clientes, error: clientesError } = await this.supabase
      .from('clientes')
      .select('nome, status, posicao, created_at')
      .eq('barbearia_id', barbearia_id)
      .in('status', ['aguardando', 'proximo', 'atendendo'])
      .order('posicao', { ascending: true });
      
    if (clientesError) {
      throw new Error('Erro interno do servidor');
    }
    
    // Processar dados dos clientes (limitados para privacidade)
    const clientesPublicos = clientes.map(cliente => {
      // Pegar apenas o primeiro nome
      const primeiroNome = cliente.nome.split(' ')[0];
      
      return {
        nome: primeiroNome,
        status: cliente.status,
        posicao: cliente.posicao,
        tempo_na_fila: Math.round((new Date() - new Date(cliente.created_at)) / (1000 * 60)) // minutos
      };
    });
    
    // Calcular estatísticas
    const estatisticas = this.calcularEstatisticas(clientes);
    
    // Obter número de barbeiros ativos
    const barbeirosAtivosCount = await this.obterBarbeirosAtivosCount(barbearia_id);
    estatisticas.barbeiros_ativos = barbeirosAtivosCount;
    
    return {
      barbearia: {
        id: barbearia.id,
        nome: barbearia.nome
      },
      clientes: clientesPublicos,
      estatisticas
    };
  }
}

module.exports = FilaService; 