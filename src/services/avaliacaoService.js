/**
 * AvaliacaoService - Serviço para gerenciar lógica de negócio das avaliações
 * 
 * Este serviço centraliza todas as operações relacionadas às avaliações,
 * incluindo envio, listagem, filtros e cálculo de estatísticas.
 */

class AvaliacaoService {
  constructor(supabase) {
    this.supabase = supabase;
  }

  /**
   * Enviar avaliação
   * @param {Object} avaliacaoData - Dados da avaliação
   * @returns {Promise<Object>} Avaliação criada
   */
  async enviarAvaliacao(avaliacaoData) {
    try {
      const { cliente_id, barbearia_id, barbeiro_id, rating, categoria, comentario } = avaliacaoData;

      // Validar dados obrigatórios
      if (!cliente_id || !barbearia_id || !rating) {
        throw new Error('Cliente ID, barbearia ID e rating são obrigatórios');
      }

      // Validar rating
      if (rating < 1 || rating > 5) {
        throw new Error('Rating deve estar entre 1 e 5');
      }

      // Verificar se o cliente existe e foi atendido
      const cliente = await this.verificarClienteAtendido(cliente_id, barbearia_id);
      if (!cliente) {
        throw new Error('Cliente não encontrado ou não foi atendido');
      }

      // Verificar se já existe avaliação para este cliente
      const avaliacaoExistente = await this.verificarAvaliacaoExistente(cliente_id);
      if (avaliacaoExistente) {
        throw new Error('Cliente já avaliou este atendimento');
      }

      // Criar avaliação
      const { data: avaliacao, error } = await this.supabase
        .from('avaliacoes')
        .insert({
          cliente_id,
          barbearia_id,
          barbeiro_id,
          rating,
          categoria,
          comentario,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao criar avaliação: ${error.message}`);
      }

      return avaliacao;
    } catch (error) {
      throw new Error(`Erro ao enviar avaliação: ${error.message}`);
    }
  }

  /**
   * Listar avaliações com filtros
   * @param {Object} filtros - Filtros para a busca
   * @returns {Promise<Object>} Avaliações e estatísticas
   */
  async listarAvaliacoes(filtros = {}) {
    try {
      const {
        barbearia_id,
        barbeiro_id,
        categoria,
        rating_min,
        rating_max,
        data_inicio,
        data_fim
      } = filtros;

      let query = this.supabase
        .from('avaliacoes')
        .select(`
          *,
          cliente:clientes(nome, telefone),
          barbearia:barbearias(nome),
          barbeiro:users(nome)
        `)
        .order('created_at', { ascending: false });

      // Aplicar filtros
      if (barbearia_id) {
        query = query.eq('barbearia_id', barbearia_id);
      }

      if (barbeiro_id) {
        query = query.eq('barbeiro_id', barbeiro_id);
      }

      if (categoria) {
        query = query.eq('categoria', categoria);
      }

      if (rating_min) {
        query = query.gte('rating', rating_min);
      }

      if (rating_max) {
        query = query.lte('rating', rating_max);
      }

      if (data_inicio) {
        query = query.gte('created_at', data_inicio);
      }

      if (data_fim) {
        query = query.lte('created_at', data_fim);
      }

      const { data: avaliacoes, error } = await query;

      if (error) {
        throw new Error(`Erro ao buscar avaliações: ${error.message}`);
      }

      // Calcular estatísticas
      const estatisticas = this.calcularEstatisticas(avaliacoes);

      return {
        avaliacoes,
        estatisticas
      };
    } catch (error) {
      throw new Error(`Erro ao listar avaliações: ${error.message}`);
    }
  }

  /**
   * Verificar se cliente foi atendido
   * @param {string} cliente_id - ID do cliente
   * @param {number} barbearia_id - ID da barbearia
   * @returns {Promise<Object|null>} Dados do cliente ou null
   */
  async verificarClienteAtendido(cliente_id, barbearia_id) {
    try {
      const { data: cliente, error } = await this.supabase
        .from('clientes')
        .select('*')
        .eq('id', cliente_id)
        .eq('barbearia_id', barbearia_id)
        .eq('status', 'finalizado')
        .single();

      if (error || !cliente) {
        return null;
      }

      return cliente;
    } catch (error) {
      return null;
    }
  }

  /**
   * Verificar se já existe avaliação para o cliente
   * @param {string} cliente_id - ID do cliente
   * @returns {Promise<boolean>} Se existe avaliação
   */
  async verificarAvaliacaoExistente(cliente_id) {
    try {
      const { data: avaliacao } = await this.supabase
        .from('avaliacoes')
        .select('id')
        .eq('cliente_id', cliente_id)
        .single();

      return !!avaliacao;
    } catch (error) {
      return false;
    }
  }

  /**
   * Calcular estatísticas das avaliações
   * @param {Array} avaliacoes - Lista de avaliações
   * @returns {Object} Estatísticas calculadas
   */
  calcularEstatisticas(avaliacoes) {
    const totalAvaliacoes = avaliacoes.length;
    
    if (totalAvaliacoes === 0) {
      return {
        total: 0,
        media_rating: 0,
        por_rating: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      };
    }

    const mediaRating = avaliacoes.reduce((sum, av) => sum + av.rating, 0) / totalAvaliacoes;

    return {
      total: totalAvaliacoes,
      media_rating: Math.round(mediaRating * 10) / 10,
      por_rating: {
        1: avaliacoes.filter(av => av.rating === 1).length,
        2: avaliacoes.filter(av => av.rating === 2).length,
        3: avaliacoes.filter(av => av.rating === 3).length,
        4: avaliacoes.filter(av => av.rating === 4).length,
        5: avaliacoes.filter(av => av.rating === 5).length
      }
    };
  }

  /**
   * Obter estatísticas de uma barbearia
   * @param {number} barbearia_id - ID da barbearia
   * @returns {Promise<Object>} Estatísticas da barbearia
   */
  async obterEstatisticasBarbearia(barbearia_id) {
    try {
      const { data: avaliacoes, error } = await this.supabase
        .from('avaliacoes')
        .select('rating, categoria')
        .eq('barbearia_id', barbearia_id);

      if (error) {
        throw new Error(`Erro ao buscar avaliações da barbearia: ${error.message}`);
      }

      const estatisticas = this.calcularEstatisticas(avaliacoes);

      // Adicionar estatísticas por categoria
      const categorias = ['atendimento', 'qualidade', 'ambiente', 'tempo', 'preco'];
      const estatisticasPorCategoria = {};

      categorias.forEach(categoria => {
        const avaliacoesCategoria = avaliacoes.filter(av => av.categoria === categoria);
        estatisticasPorCategoria[categoria] = this.calcularEstatisticas(avaliacoesCategoria);
      });

      return {
        ...estatisticas,
        por_categoria: estatisticasPorCategoria
      };
    } catch (error) {
      throw new Error(`Erro ao obter estatísticas da barbearia: ${error.message}`);
    }
  }

  /**
   * Obter estatísticas de um barbeiro
   * @param {string} barbeiro_id - ID do barbeiro
   * @returns {Promise<Object>} Estatísticas do barbeiro
   */
  async obterEstatisticasBarbeiro(barbeiro_id) {
    try {
      const { data: avaliacoes, error } = await this.supabase
        .from('avaliacoes')
        .select('rating, categoria')
        .eq('barbeiro_id', barbeiro_id);

      if (error) {
        throw new Error(`Erro ao buscar avaliações do barbeiro: ${error.message}`);
      }

      return this.calcularEstatisticas(avaliacoes);
    } catch (error) {
      throw new Error(`Erro ao obter estatísticas do barbeiro: ${error.message}`);
    }
  }
}

module.exports = AvaliacaoService; 