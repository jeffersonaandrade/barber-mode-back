/**
 * BarbeariaService - Serviço para gerenciar lógica de negócio das barbearias
 * 
 * Este serviço centraliza todas as operações relacionadas às barbearias,
 * incluindo CRUD, validações e regras de negócio.
 */

class BarbeariaService {
  constructor(supabase) {
    this.supabase = supabase;
  }

  /**
   * Listar todas as barbearias ativas
   * @returns {Promise<Array>} Lista de barbearias
   */
  async listarBarbearias() {
    try {
      const { data: barbearias, error } = await this.supabase
        .from('barbearias')
        .select('*')
        .eq('ativo', true)
        .order('nome');

      if (error) {
        throw new Error('Erro ao buscar barbearias');
      }

      return barbearias;
    } catch (error) {
      throw new Error(`Erro ao listar barbearias: ${error.message}`);
    }
  }

  /**
   * Buscar barbearia por ID
   * @param {number} id - ID da barbearia
   * @returns {Promise<Object>} Dados da barbearia
   */
  async buscarBarbeariaPorId(id) {
    try {
      const { data: barbearia, error } = await this.supabase
        .from('barbearias')
        .select('*')
        .eq('id', id)
        .eq('ativo', true)
        .single();

      if (error || !barbearia) {
        throw new Error('Barbearia não encontrada');
      }

      return barbearia;
    } catch (error) {
      throw new Error(`Erro ao buscar barbearia: ${error.message}`);
    }
  }

  /**
   * Criar nova barbearia
   * @param {Object} barbeariaData - Dados da barbearia
   * @returns {Promise<Object>} Barbearia criada
   */
  async criarBarbearia(barbeariaData) {
    try {
      // Validar dados obrigatórios
      if (!barbeariaData.nome || !barbeariaData.endereco) {
        throw new Error('Nome e endereço são obrigatórios');
      }

      // Verificar se já existe uma barbearia com o mesmo nome
      const { data: barbeariaExistente } = await this.supabase
        .from('barbearias')
        .select('id')
        .eq('nome', barbeariaData.nome)
        .eq('ativo', true)
        .single();

      if (barbeariaExistente) {
        throw new Error('Já existe uma barbearia com este nome');
      }

      const { data: barbearia, error } = await this.supabase
        .from('barbearias')
        .insert({
          ...barbeariaData,
          ativo: true,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao criar barbearia: ${error.message}`);
      }

      return barbearia;
    } catch (error) {
      throw new Error(`Erro ao criar barbearia: ${error.message}`);
    }
  }

  /**
   * Atualizar barbearia
   * @param {number} id - ID da barbearia
   * @param {Object} updateData - Dados para atualização
   * @returns {Promise<Object>} Barbearia atualizada
   */
  async atualizarBarbearia(id, updateData) {
    try {
      // Verificar se a barbearia existe
      const barbeariaExistente = await this.buscarBarbeariaPorId(id);

      // Se estiver alterando o nome, verificar se não conflita
      if (updateData.nome && updateData.nome !== barbeariaExistente.nome) {
        const { data: barbeariaComMesmoNome } = await this.supabase
          .from('barbearias')
          .select('id')
          .eq('nome', updateData.nome)
          .eq('ativo', true)
          .neq('id', id)
          .single();

        if (barbeariaComMesmoNome) {
          throw new Error('Já existe uma barbearia com este nome');
        }
      }

      const { data: barbearia, error } = await this.supabase
        .from('barbearias')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao atualizar barbearia: ${error.message}`);
      }

      return barbearia;
    } catch (error) {
      throw new Error(`Erro ao atualizar barbearia: ${error.message}`);
    }
  }

  /**
   * Remover barbearia (desativar)
   * @param {number} id - ID da barbearia
   * @returns {Promise<boolean>} Sucesso da operação
   */
  async removerBarbearia(id) {
    try {
      // Verificar se a barbearia existe
      await this.buscarBarbeariaPorId(id);

      // Verificar se há barbeiros ativos na barbearia
      const { data: barbeirosAtivos } = await this.supabase
        .from('barbeiros_barbearias')
        .select('id')
        .eq('barbearia_id', id)
        .eq('ativo', true);

      if (barbeirosAtivos && barbeirosAtivos.length > 0) {
        throw new Error('Não é possível remover barbearia com barbeiros ativos');
      }

      // Verificar se há clientes na fila
      const { data: clientesNaFila } = await this.supabase
        .from('clientes')
        .select('id')
        .eq('barbearia_id', id)
        .in('status', ['aguardando', 'proximo', 'atendendo']);

      if (clientesNaFila && clientesNaFila.length > 0) {
        throw new Error('Não é possível remover barbearia com clientes na fila');
      }

      const { error } = await this.supabase
        .from('barbearias')
        .update({ 
          ativo: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        throw new Error(`Erro ao remover barbearia: ${error.message}`);
      }

      return true;
    } catch (error) {
      throw new Error(`Erro ao remover barbearia: ${error.message}`);
    }
  }

  /**
   * Chamar próximo cliente da fila
   * @param {number} barbeariaId - ID da barbearia
   * @param {string} userId - ID do barbeiro
   * @returns {Promise<Object>} Próximo cliente
   */
  async chamarProximoCliente(barbeariaId, userId) {
    try {
      // Verificar se o usuário é um barbeiro ativo na barbearia
      const { data: barbeiroAtivo, error: barbeiroError } = await this.supabase
        .from('barbeiros_barbearias')
        .select('id, ativo')
        .eq('user_id', userId)
        .eq('barbearia_id', barbeariaId)
        .eq('ativo', true)
        .single();

      if (barbeiroError || !barbeiroAtivo) {
        throw new Error('Você não está ativo nesta barbearia');
      }

      // Buscar próximo cliente na fila
      // Prioridade: 1) Clientes específicos do barbeiro, 2) Fila geral
      const { data: proximoCliente, error: clienteError } = await this.supabase
        .from('clientes')
        .select('*')
        .eq('barbearia_id', barbeariaId)
        .in('status', ['aguardando', 'proximo'])
        .or(`barbeiro_id.eq.${userId},barbeiro_id.is.null`)
        .order('barbeiro_id', { ascending: false }) // Clientes específicos primeiro
        .order('posicao', { ascending: true })
        .limit(1)
        .single();

      if (clienteError || !proximoCliente) {
        throw new Error('Não há clientes aguardando na fila');
      }

      // Atualizar status do cliente para 'proximo'
      const { data: clienteAtualizado, error: updateError } = await this.supabase
        .from('clientes')
        .update({
          status: 'proximo',
          barbeiro_id: userId,
          data_atendimento: new Date().toISOString()
        })
        .eq('id', proximoCliente.id)
        .select()
        .single();

      if (updateError) {
        throw new Error(`Erro ao atualizar status do cliente: ${updateError.message}`);
      }

      return clienteAtualizado;
    } catch (error) {
      throw new Error(`Erro ao chamar próximo cliente: ${error.message}`);
    }
  }

  /**
   * Verificar se barbeiro está ativo na barbearia
   * @param {string} userId - ID do usuário
   * @param {number} barbeariaId - ID da barbearia
   * @returns {Promise<boolean>} Se está ativo
   */
  async verificarBarbeiroAtivo(userId, barbeariaId) {
    try {
      const { data: barbeiro, error } = await this.supabase
        .from('barbeiros_barbearias')
        .select('ativo')
        .eq('user_id', userId)
        .eq('barbearia_id', barbeariaId)
        .eq('ativo', true)
        .single();

      if (error || !barbeiro) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = BarbeariaService; 