const QRCode = require('qrcode');

/**
 * Serviço para operações relacionadas à fila de clientes
 * 
 * Este serviço contém toda a lógica de negócio relacionada à fila,
 * separando as operações de banco de dados das rotas.
 */
class FilaService {
  constructor(supabase) {
    this.supabase = supabase;
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
    
    // Gerar token único para o cliente
    const token = this.gerarTokenUnico();
    
    // Obter posição atual na fila
    const posicao = await this.calcularProximaPosicao(barbearia_id);
    
    // Inserir cliente na fila
    const { data: cliente, error: insertError } = await this.supabase
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
    
    // Gerar QR codes
    const qrCodeFila = await this.gerarQRCodeFila(cliente);
    const qrCodeStatus = await this.gerarQRCodeStatus(cliente);
    
    return {
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
      posicao: cliente.posicao
    };
  }

  /**
   * Obter fila completa da barbearia (para funcionários)
   * @param {number} barbearia_id - ID da barbearia
   * @returns {Promise<Object>} Fila com clientes e estatísticas
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
    
    // Obter clientes na fila
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
    
    return {
      barbearia: {
        id: barbearia.id,
        nome: barbearia.nome
      },
      clientes: clientes.map(cliente => ({
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
      estatisticas
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
    
    return {
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
  }

  // Métodos auxiliares privados

  /**
   * Gerar token único para o cliente
   * @returns {string} Token único
   */
  gerarTokenUnico() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  /**
   * Calcular próxima posição na fila
   * @param {number} barbearia_id - ID da barbearia
   * @returns {Promise<number>} Próxima posição
   */
  async calcularProximaPosicao(barbearia_id) {
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
    
    // Calcular tempo estimado (15 minutos por cliente)
    const tempoEstimado = aguardando * 15;
    
    return {
      total_clientes: totalClientes,
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
}

module.exports = FilaService; 