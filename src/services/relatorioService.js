const { supabase } = require('../config/database');

/**
 * Serviço para geração de relatórios financeiros e de performance
 */
class RelatorioService {
  constructor(supabase) {
    this.supabase = supabase;
  }

  /**
   * Gerar relatório financeiro completo
   */
  async gerarRelatorioFinanceiro(filtros) {
    const { barbearia_id, data_inicio, data_fim, periodo = 'mes' } = filtros;

    try {
      // Converter datas para UTC (timezone brasileiro -03:00)
      const dataInicioUTC = new Date(data_inicio + 'T00:00:00-03:00').toISOString();
      const dataFimUTC = new Date(data_fim + 'T23:59:59-03:00').toISOString();

      // Query base para histórico de atendimentos
      let query = this.supabase
        .from('historico_atendimentos')
        .select(`
          *,
          servicos(nome, preco),
          users(id, nome, email),
          barbearias(nome)
        `)
        .gte('data_inicio', dataInicioUTC)
        .lte('data_inicio', dataFimUTC);

      if (barbearia_id) {
        query = query.eq('barbearia_id', barbearia_id);
      }

      const { data: atendimentos, error } = await query;

      if (error) {
        throw new Error('Erro ao buscar atendimentos: ' + error.message);
      }

      // Calcular métricas financeiras
      const metricas = this.calcularMetricasFinanceiras(atendimentos);
      
      // Calcular dados por período
      const dadosPorPeriodo = this.calcularDadosPorPeriodo(atendimentos, periodo);
      
      // Calcular dados por barbeiro
      const dadosPorBarbeiro = this.calcularDadosPorBarbeiro(atendimentos);
      
      // Calcular dados por serviço
      const dadosPorServico = this.calcularDadosPorServico(atendimentos);

      return {
        success: true,
        data: {
          periodo: {
            inicio: data_inicio,
            fim: data_fim,
            tipo: periodo
          },
          metricas,
          dados_por_periodo: dadosPorPeriodo,
          dados_por_barbeiro: dadosPorBarbeiro,
          dados_por_servico: dadosPorServico,
          atendimentos: atendimentos || []
        }
      };

    } catch (error) {
      console.error('Erro ao gerar relatório financeiro:', error);
      throw error;
    }
  }

  /**
   * Gerar relatório de comissões
   */
  async gerarRelatorioComissoes(filtros) {
    const { barbearia_id, barbeiro_id, data_inicio, data_fim } = filtros;

    try {
      // Converter datas para UTC (timezone brasileiro -03:00)
      const dataInicioUTC = new Date(data_inicio + 'T00:00:00-03:00').toISOString();
      const dataFimUTC = new Date(data_fim + 'T23:59:59-03:00').toISOString();

      // Query base para comissões
      let query = this.supabase
        .from('historico_atendimentos')
        .select(`
          *,
          servicos(nome, preco),
          users(id, nome, email),
          barbearias(nome)
        `)
        .gte('data_inicio', dataInicioUTC)
        .lte('data_inicio', dataFimUTC)
        .gt('valor_comissao', 0);

      if (barbearia_id) {
        query = query.eq('barbearia_id', barbearia_id);
      }

      if (barbeiro_id) {
        query = query.eq('barbeiro_id', barbeiro_id);
      }

      const { data: atendimentos, error } = await query;

      if (error) {
        throw new Error('Erro ao buscar comissões: ' + error.message);
      }

      // Calcular comissões por barbeiro
      const comissoesPorBarbeiro = this.calcularComissoesPorBarbeiro(atendimentos);
      
      // Calcular comissões por período
      const comissoesPorPeriodo = this.calcularComissoesPorPeriodo(atendimentos);
      
      // Calcular comissões por serviço
      const comissoesPorServico = this.calcularComissoesPorServico(atendimentos);

      return {
        success: true,
        data: {
          periodo: {
            inicio: data_inicio,
            fim: data_fim
          },
          total_comissoes: atendimentos.reduce((sum, a) => sum + parseFloat(a.valor_comissao), 0),
          total_atendimentos: atendimentos.length,
          comissoes_por_barbeiro: comissoesPorBarbeiro,
          comissoes_por_periodo: comissoesPorPeriodo,
          comissoes_por_servico: comissoesPorServico,
          atendimentos: atendimentos || []
        }
      };

    } catch (error) {
      console.error('Erro ao gerar relatório de comissões:', error);
      throw error;
    }
  }

  /**
   * Gerar relatório de performance
   */
  async gerarRelatorioPerformance(filtros) {
    const { barbearia_id, data_inicio, data_fim, periodo = 'mes' } = filtros;

    try {
      // Converter datas para UTC (timezone brasileiro -03:00)
      const dataInicioUTC = new Date(data_inicio + 'T00:00:00-03:00').toISOString();
      const dataFimUTC = new Date(data_fim + 'T23:59:59-03:00').toISOString();

      // Query base para atendimentos
      let query = this.supabase
        .from('historico_atendimentos')
        .select(`
          *,
          servicos(nome, preco, duracao),
          users(id, nome, email),
          barbearias(nome)
        `)
        .gte('data_inicio', dataInicioUTC)
        .lte('data_inicio', dataFimUTC);

      if (barbearia_id) {
        query = query.eq('barbearia_id', barbearia_id);
      }

      const { data: atendimentos, error } = await query;

      if (error) {
        throw new Error('Erro ao buscar atendimentos: ' + error.message);
      }

      // Calcular performance por barbeiro
      const performancePorBarbeiro = this.calcularPerformancePorBarbeiro(atendimentos);
      
      // Calcular métricas de tempo
      const metricasTempo = this.calcularMetricasTempo(atendimentos);
      
      // Calcular produtividade
      const produtividade = this.calcularProdutividade(atendimentos);

      return {
        success: true,
        data: {
          periodo: {
            inicio: data_inicio,
            fim: data_fim
          },
          performance_por_barbeiro: performancePorBarbeiro,
          metricas_tempo: metricasTempo,
          produtividade,
          total_atendimentos: atendimentos.length
        }
      };

    } catch (error) {
      console.error('Erro ao gerar relatório de performance:', error);
      throw error;
    }
  }

  /**
   * Gerar relatório de satisfação
   */
  async gerarRelatorioSatisfacao(filtros) {
    const { barbearia_id, data_inicio, data_fim, periodo = 'mes' } = filtros;

    try {
      // Converter datas para UTC (timezone brasileiro -03:00)
      const dataInicioUTC = new Date(data_inicio + 'T00:00:00-03:00').toISOString();
      const dataFimUTC = new Date(data_fim + 'T23:59:59-03:00').toISOString();

      // Query para avaliações
      let query = this.supabase
        .from('avaliacoes')
        .select(`
          *,
          clientes(nome),
          users(id, nome),
          barbearias(nome)
        `)
        .gte('created_at', dataInicioUTC)
        .lte('created_at', dataFimUTC);

      if (barbearia_id) {
        query = query.eq('barbearia_id', barbearia_id);
      }

      const { data: avaliacoes, error } = await query;

      if (error) {
        throw new Error('Erro ao buscar avaliações: ' + error.message);
      }

      // Calcular métricas de satisfação
      const metricas = this.calcularMetricasSatisfacao(avaliacoes);
      
      // Calcular satisfação por barbeiro
      const satisfacaoPorBarbeiro = this.calcularSatisfacaoPorBarbeiro(avaliacoes);
      
      // Calcular satisfação por categoria
      const satisfacaoPorCategoria = this.calcularSatisfacaoPorCategoria(avaliacoes);

      return {
        success: true,
        data: {
          periodo: {
            inicio: data_inicio,
            fim: data_fim
          },
          metricas,
          satisfacao_por_barbeiro: satisfacaoPorBarbeiro,
          satisfacao_por_categoria: satisfacaoPorCategoria,
          total_avaliacoes: avaliacoes.length,
          avaliacoes: avaliacoes || []
        }
      };

    } catch (error) {
      console.error('Erro ao gerar relatório de satisfação:', error);
      throw error;
    }
  }

  // Métodos auxiliares privados

  /**
   * Calcular métricas financeiras
   */
  calcularMetricasFinanceiras(atendimentos) {
    const total = atendimentos.length;
    const valorTotal = atendimentos.reduce((sum, a) => sum + parseFloat(a.valor_servico), 0);
    const comissoesTotal = atendimentos.reduce((sum, a) => sum + parseFloat(a.valor_comissao), 0);
    const lucroLiquido = valorTotal - comissoesTotal;

    return {
      total_atendimentos: total,
      valor_total: valorTotal,
      comissoes_total: comissoesTotal,
      lucro_liquido: lucroLiquido,
      ticket_medio: total > 0 ? valorTotal / total : 0,
      comissao_media: total > 0 ? comissoesTotal / total : 0
    };
  }

  /**
   * Calcular dados por período
   */
  calcularDadosPorPeriodo(atendimentos, periodo) {
    const dados = {};
    
    atendimentos.forEach(atendimento => {
      const data = new Date(atendimento.data_inicio);
      let chave;
      
      switch (periodo) {
        case 'dia':
          chave = data.toISOString().split('T')[0];
          break;
        case 'semana':
          const semana = this.getWeekNumber(data);
          chave = `${data.getFullYear()}-W${semana}`;
          break;
        case 'mes':
        default:
          chave = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
          break;
      }
      
      if (!dados[chave]) {
        dados[chave] = {
          periodo: chave,
          atendimentos: 0,
          valor_total: 0,
          comissoes: 0
        };
      }
      
      dados[chave].atendimentos++;
      dados[chave].valor_total += parseFloat(atendimento.valor_servico);
      dados[chave].comissoes += parseFloat(atendimento.valor_comissao);
    });
    
    return Object.values(dados).sort((a, b) => a.periodo.localeCompare(b.periodo));
  }

  /**
   * Calcular dados por barbeiro
   */
  calcularDadosPorBarbeiro(atendimentos) {
    const dados = {};

    atendimentos.forEach(atendimento => {
      const barbeiroId = atendimento.barbeiro_id;
      
      if (!dados[barbeiroId]) {
        dados[barbeiroId] = {
          barbeiro_id: barbeiroId,
          nome: atendimento.users?.nome || 'N/A',
          atendimentos: 0,
          valor_total: 0,
          comissoes: 0,
          ticket_medio: 0
        };
      }
      
      dados[barbeiroId].atendimentos++;
      dados[barbeiroId].valor_total += parseFloat(atendimento.valor_servico);
      dados[barbeiroId].comissoes += parseFloat(atendimento.valor_comissao);
    });
    
    // Calcular ticket médio
    Object.values(dados).forEach(barbeiro => {
      barbeiro.ticket_medio = barbeiro.atendimentos > 0 ? barbeiro.valor_total / barbeiro.atendimentos : 0;
    });
    
    return Object.values(dados).sort((a, b) => b.valor_total - a.valor_total);
  }

  /**
   * Calcular dados por serviço
   */
  calcularDadosPorServico(atendimentos) {
    const dados = {};
    
    atendimentos.forEach(atendimento => {
      const servicoId = atendimento.servico_id;
      
      if (!dados[servicoId]) {
        dados[servicoId] = {
          servico_id: servicoId,
          nome: atendimento.servicos?.nome || 'N/A',
          atendimentos: 0,
          valor_total: 0,
          comissoes: 0,
          preco_medio: 0
        };
      }
      
      dados[servicoId].atendimentos++;
      dados[servicoId].valor_total += parseFloat(atendimento.valor_servico);
      dados[servicoId].comissoes += parseFloat(atendimento.valor_comissao);
    });
    
    // Calcular preço médio
    Object.values(dados).forEach(servico => {
      servico.preco_medio = servico.atendimentos > 0 ? servico.valor_total / servico.atendimentos : 0;
    });
    
    return Object.values(dados).sort((a, b) => b.atendimentos - a.atendimentos);
  }

  /**
   * Calcular comissões por barbeiro
   */
  calcularComissoesPorBarbeiro(atendimentos) {
    const dados = {};
    
    atendimentos.forEach(atendimento => {
      const barbeiroId = atendimento.barbeiro_id;
      
      if (!dados[barbeiroId]) {
        dados[barbeiroId] = {
          barbeiro_id: barbeiroId,
          nome: atendimento.users?.nome || 'N/A',
          atendimentos: 0,
          valor_total: 0,
          comissoes: 0,
          percentual_medio: 0
        };
      }
      
      dados[barbeiroId].atendimentos++;
      dados[barbeiroId].valor_total += parseFloat(atendimento.valor_servico);
      dados[barbeiroId].comissoes += parseFloat(atendimento.valor_comissao);
    });
    
    // Calcular percentual médio
    Object.values(dados).forEach(barbeiro => {
      barbeiro.percentual_medio = barbeiro.valor_total > 0 ? (barbeiro.comissoes / barbeiro.valor_total) * 100 : 0;
    });
    
    return Object.values(dados).sort((a, b) => b.comissoes - a.comissoes);
  }

  /**
   * Calcular comissões por período
   */
  calcularComissoesPorPeriodo(atendimentos) {
    const dados = {};
    
    atendimentos.forEach(atendimento => {
      const data = new Date(atendimento.data_inicio);
      const chave = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
      
      if (!dados[chave]) {
        dados[chave] = {
          periodo: chave,
          atendimentos: 0,
          comissoes: 0
        };
      }
      
      dados[chave].atendimentos++;
      dados[chave].comissoes += parseFloat(atendimento.valor_comissao);
    });
    
    return Object.values(dados).sort((a, b) => a.periodo.localeCompare(b.periodo));
  }

  /**
   * Calcular comissões por serviço
   */
  calcularComissoesPorServico(atendimentos) {
    const dados = {};
    
    atendimentos.forEach(atendimento => {
      const servicoId = atendimento.servico_id;
      
      if (!dados[servicoId]) {
        dados[servicoId] = {
          servico_id: servicoId,
          nome: atendimento.servicos?.nome || 'N/A',
          atendimentos: 0,
          comissoes: 0,
          comissao_media: 0
        };
      }
      
      dados[servicoId].atendimentos++;
      dados[servicoId].comissoes += parseFloat(atendimento.valor_comissao);
    });
    
    // Calcular comissão média
    Object.values(dados).forEach(servico => {
      servico.comissao_media = servico.atendimentos > 0 ? servico.comissoes / servico.atendimentos : 0;
    });
    
    return Object.values(dados).sort((a, b) => b.comissoes - a.comissoes);
  }

  /**
   * Calcular performance por barbeiro
   */
  calcularPerformancePorBarbeiro(atendimentos) {
    const dados = {};

    atendimentos.forEach(atendimento => {
      const barbeiroId = atendimento.barbeiro_id;
      
      if (!dados[barbeiroId]) {
        dados[barbeiroId] = {
          barbeiro_id: barbeiroId,
          nome: atendimento.users?.nome || 'N/A',
          atendimentos: 0,
          valor_total: 0,
          tempo_total: 0,
          tempo_medio: 0,
          produtividade: 0
        };
      }
      
      dados[barbeiroId].atendimentos++;
      dados[barbeiroId].valor_total += parseFloat(atendimento.valor_servico);
      
             // Usar tempo real se disponível, senão usar tempo estimado
       if (atendimento.tempo_real) {
         dados[barbeiroId].tempo_total += parseInt(atendimento.tempo_real);
       } else if (atendimento.servicos?.duracao) {
         dados[barbeiroId].tempo_total += parseInt(atendimento.servicos.duracao);
       }
    });
    
    // Calcular métricas
    Object.values(dados).forEach(barbeiro => {
      barbeiro.tempo_medio = barbeiro.atendimentos > 0 ? barbeiro.tempo_total / barbeiro.atendimentos : 0;
      barbeiro.produtividade = barbeiro.tempo_total > 0 ? (barbeiro.valor_total / barbeiro.tempo_total) * 60 : 0; // R$/hora
    });
    
    return Object.values(dados).sort((a, b) => b.valor_total - a.valor_total);
  }

  /**
   * Calcular métricas de tempo
   */
     calcularMetricasTempo(atendimentos) {
     const tempos = atendimentos
       .filter(a => a.tempo_real || a.servicos?.duracao)
       .map(a => a.tempo_real ? parseInt(a.tempo_real) : parseInt(a.servicos.duracao));
    
    if (tempos.length === 0) {
      return {
        tempo_medio: 0,
        tempo_minimo: 0,
        tempo_maximo: 0,
        total_horas: 0
      };
    }
    
    const tempoMedio = tempos.reduce((sum, t) => sum + t, 0) / tempos.length;
    const tempoMinimo = Math.min(...tempos);
    const tempoMaximo = Math.max(...tempos);
    const totalHoras = tempos.reduce((sum, t) => sum + t, 0) / 60;
    
    return {
      tempo_medio: tempoMedio,
      tempo_minimo: tempoMinimo,
      tempo_maximo: tempoMaximo,
      total_horas: totalHoras
    };
  }

  /**
   * Calcular produtividade
   */
  calcularProdutividade(atendimentos) {
    const totalAtendimentos = atendimentos.length;
    const valorTotal = atendimentos.reduce((sum, a) => sum + parseFloat(a.valor_servico), 0);
         const tempoTotal = atendimentos
       .filter(a => a.tempo_real || a.servicos?.duracao)
       .reduce((sum, a) => sum + (a.tempo_real ? parseInt(a.tempo_real) : parseInt(a.servicos.duracao)), 0);

    return {
      atendimentos_por_hora: tempoTotal > 0 ? (totalAtendimentos / tempoTotal) * 60 : 0,
      valor_por_hora: tempoTotal > 0 ? (valorTotal / tempoTotal) * 60 : 0,
      atendimentos_por_dia: this.calcularAtendimentosPorDia(atendimentos)
    };
  }

  /**
   * Calcular atendimentos por dia
   */
  calcularAtendimentosPorDia(atendimentos) {
    const dias = {};
    
    atendimentos.forEach(atendimento => {
      const data = new Date(atendimento.data_inicio).toISOString().split('T')[0];
      dias[data] = (dias[data] || 0) + 1;
    });
    
    const valores = Object.values(dias);
    return valores.length > 0 ? valores.reduce((sum, v) => sum + v, 0) / valores.length : 0;
  }

  /**
   * Calcular métricas de satisfação
   */
  calcularMetricasSatisfacao(avaliacoes) {
    if (avaliacoes.length === 0) {
      return {
        nota_media_estrutura: 0,
        nota_media_barbeiros: 0,
        total_avaliacoes: 0,
        distribuicao_estrutura: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        distribuicao_barbeiros: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      };
    }
    
    const notasEstrutura = avaliacoes.map(a => a.rating_estrutura);
    const notasBarbeiros = avaliacoes.map(a => a.rating_barbeiro);
    
    const notaMediaEstrutura = notasEstrutura.reduce((sum, n) => sum + n, 0) / notasEstrutura.length;
    const notaMediaBarbeiros = notasBarbeiros.reduce((sum, n) => sum + n, 0) / notasBarbeiros.length;
    
    const distribuicaoEstrutura = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const distribuicaoBarbeiros = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    notasEstrutura.forEach(nota => {
      distribuicaoEstrutura[nota] = (distribuicaoEstrutura[nota] || 0) + 1;
    });
    
    notasBarbeiros.forEach(nota => {
      distribuicaoBarbeiros[nota] = (distribuicaoBarbeiros[nota] || 0) + 1;
    });
    
    return {
      nota_media_estrutura: notaMediaEstrutura,
      nota_media_barbeiros: notaMediaBarbeiros,
      total_avaliacoes: avaliacoes.length,
      distribuicao_estrutura: distribuicaoEstrutura,
      distribuicao_barbeiros: distribuicaoBarbeiros
    };
  }

  /**
   * Calcular satisfação por barbeiro
   */
  calcularSatisfacaoPorBarbeiro(avaliacoes) {
    const dados = {};
    
    avaliacoes.forEach(avaliacao => {
      const barbeiroId = avaliacao.barbeiro_id;
      
      if (!dados[barbeiroId]) {
        dados[barbeiroId] = {
          barbeiro_id: barbeiroId,
          nome: avaliacao.users?.nome || 'N/A',
          avaliacoes: 0,
          nota_media: 0,
          notas: []
        };
      }
      
      dados[barbeiroId].avaliacoes++;
      dados[barbeiroId].notas.push(avaliacao.rating_barbeiro); // Usar rating_barbeiro
    });
    
    // Calcular nota média
    Object.values(dados).forEach(barbeiro => {
      barbeiro.nota_media = barbeiro.notas.reduce((sum, n) => sum + n, 0) / barbeiro.notas.length;
    });
    
    return Object.values(dados).sort((a, b) => b.nota_media - a.nota_media);
  }

  /**
   * Calcular satisfação por categoria
   */
  calcularSatisfacaoPorCategoria(avaliacoes) {
    const dados = {};
    
    avaliacoes.forEach(avaliacao => {
      const categoria = avaliacao.categoria || 'geral';
      
      if (!dados[categoria]) {
        dados[categoria] = {
          categoria,
          avaliacoes: 0,
          nota_media: 0,
          notas: []
        };
      }
      
      dados[categoria].avaliacoes++;
      dados[categoria].notas.push(avaliacao.rating);
    });
    
    // Calcular nota média
    Object.values(dados).forEach(cat => {
      cat.nota_media = cat.notas.reduce((sum, n) => sum + n, 0) / cat.notas.length;
    });
    
    return Object.values(dados).sort((a, b) => b.nota_media - a.nota_media);
  }

  /**
   * Obter número da semana
   */
  getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  }

  /**
   * Gerar relatório dashboard (método existente atualizado)
   */
  async gerarRelatorioDashboard(filtros) {
    const { barbearia_id, data_inicio, data_fim, periodo = 'mes' } = filtros;

    try {
      // Definir datas padrão se não fornecidas (considerando timezone brasileiro)
      const hoje = new Date();
      const dataInicio = data_inicio || new Date(hoje.getFullYear(), hoje.getMonth(), 1).toISOString().split('T')[0];
      const dataFim = data_fim || hoje.toISOString().split('T')[0];

      // Gerar relatórios específicos (já com timezone corrigido)
      const [financeiro, comissoes, performance, satisfacao] = await Promise.all([
        this.gerarRelatorioFinanceiro({ barbearia_id, data_inicio: dataInicio, data_fim: dataFim, periodo }),
        this.gerarRelatorioComissoes({ barbearia_id, data_inicio: dataInicio, data_fim: dataFim }),
        this.gerarRelatorioPerformance({ barbearia_id, data_inicio: dataInicio, data_fim: dataFim }),
        this.gerarRelatorioSatisfacao({ barbearia_id, data_inicio: dataInicio, data_fim: dataFim })
      ]);
    
    return {
        success: true,
        data: {
          periodo: {
            inicio: dataInicio,
            fim: dataFim,
            tipo: periodo
          },
          financeiro: financeiro.data,
          comissoes: comissoes.data,
          performance: performance.data,
          satisfacao: satisfacao.data,
          filtros_aplicados: filtros
        }
      };

    } catch (error) {
      console.error('Erro ao gerar relatório dashboard:', error);
      throw error;
    }
  }

  /**
   * Gerar relatório para download
   */
  async gerarRelatorioDownload(filtros, tipo = 'excel') {
    // Implementação para download de relatórios
    // Por enquanto, retorna dados básicos
    const relatorio = await this.gerarRelatorioDashboard(filtros);
    
    if (tipo === 'excel') {
      return {
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        filename: `relatorio_${new Date().toISOString().split('T')[0]}.xlsx`,
        buffer: Buffer.from('Relatório em Excel - Implementar geração real')
      };
    } else {
      return {
        contentType: 'application/pdf',
        filename: `relatorio_${new Date().toISOString().split('T')[0]}.pdf`,
        buffer: Buffer.from('Relatório em PDF - Implementar geração real')
      };
    }
  }
}

module.exports = RelatorioService; 