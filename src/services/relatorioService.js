const ExcelJS = require('exceljs');

class RelatorioService {
  constructor(supabase) {
    this.supabase = supabase;
  }

  /**
   * Gerar relatório completo do dashboard
   * @param {Object} filtros - Filtros para o relatório
   * @param {number} filtros.barbearia_id - ID da barbearia (opcional)
   * @param {string} filtros.data_inicio - Data inicial (YYYY-MM-DD)
   * @param {string} filtros.data_fim - Data final (YYYY-MM-DD)
   * @param {string} filtros.periodo - Período de comparação (semana, mes, ano)
   * @param {string} filtros.userRole - Role do usuário
   * @param {string} filtros.userId - ID do usuário (para barbeiros)
   */
  async gerarRelatorioDashboard(filtros) {
    try {
      const {
        barbearia_id,
        data_inicio,
        data_fim,
        periodo = 'mes',
        userRole,
        userId
      } = filtros;

      // Construir filtros base
      let whereConditions = [];
      let params = {};

      if (barbearia_id) {
        whereConditions.push('barbearia_id = :barbearia_id');
        params.barbearia_id = barbearia_id;
      }

      if (data_inicio) {
        whereConditions.push('data_inicio >= :data_inicio');
        params.data_inicio = data_inicio;
      }

      if (data_fim) {
        whereConditions.push('data_inicio <= :data_fim');
        params.data_fim = data_fim;
      }

      // Para barbeiros, filtrar apenas seus atendimentos
      if (userRole === 'barbeiro') {
        whereConditions.push('barbeiro_id = :barbeiro_id');
        params.barbeiro_id = userId;
      }

      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

      // 1. Total de atendimentos
      const { data: atendimentos, error: errorAtendimentos } = await this.supabase
        .from('historico_atendimentos')
        .select('*')
        .eq('status', 'finalizado');

      if (errorAtendimentos) throw new Error('Erro ao buscar atendimentos');

      // 2. Tempo médio de atendimento
      const temposAtendimento = atendimentos.map(atendimento => {
        const inicio = new Date(atendimento.data_inicio);
        const fim = new Date(atendimento.data_fim);
        return (fim - inicio) / (1000 * 60); // em minutos
      });

      const tempoMedio = temposAtendimento.length > 0 
        ? Math.round(temposAtendimento.reduce((a, b) => a + b, 0) / temposAtendimento.length)
        : 0;

      // 3. Faturamento total
      const faturamentoTotal = atendimentos.reduce((total, atendimento) => {
        return total + (atendimento.valor_atendimento || 0);
      }, 0);

      // 4. Satisfação geral dos clientes
      const { data: avaliacoes, error: errorAvaliacoes } = await this.supabase
        .from('avaliacoes')
        .select('rating, barbeiro_id, barbearia_id')
        .gte('created_at', data_inicio)
        .lte('created_at', data_fim);

      if (errorAvaliacoes) throw new Error('Erro ao buscar avaliações');

      const satisfacaoGeral = avaliacoes.length > 0
        ? Math.round((avaliacoes.reduce((sum, av) => sum + av.rating, 0) / avaliacoes.length) * 10) / 10
        : 0;

      // 5. Performance dos barbeiros
      const performanceBarbeiros = await this.calcularPerformanceBarbeiros(filtros);

      // 6. Atendimentos por barbearia
      const atendimentosPorBarbearia = await this.calcularAtendimentosPorBarbearia(filtros);

      // 7. Comparação com período anterior
      const comparacao = await this.calcularComparacaoPeriodo(filtros, periodo);

      return {
        success: true,
        data: {
          // Métricas principais
          total_atendimentos: atendimentos.length,
          tempo_medio_atendimento: tempoMedio,
          faturamento_total: faturamentoTotal,
          satisfacao_geral: satisfacaoGeral,
          
          // Comparação com período anterior
          comparacao: {
            atendimentos: comparacao.atendimentos,
            faturamento: comparacao.faturamento,
            satisfacao: comparacao.satisfacao,
            tempo_medio: comparacao.tempo_medio
          },

          // Detalhamentos
          performance_barbeiros: performanceBarbeiros,
          atendimentos_por_barbearia: atendimentosPorBarbearia,
          
          // Metadados
          periodo: {
            inicio: data_inicio,
            fim: data_fim,
            tipo: periodo
          },
          filtros_aplicados: {
            barbearia_id,
            user_role: userRole
          }
        }
      };

    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      throw new Error(`Erro ao gerar relatório: ${error.message}`);
    }
  }

  /**
   * Calcular performance dos barbeiros
   */
  async calcularPerformanceBarbeiros(filtros) {
    const { barbearia_id, data_inicio, data_fim, userRole, userId } = filtros;

    let query = this.supabase
      .from('historico_atendimentos')
      .select(`
        barbeiro_id,
        barbearia_id,
        status,
        data_inicio,
        data_fim,
        valor_atendimento,
        barbeiros:barbeiro_id(nome, email),
        barbearias:barbearia_id(nome)
      `)
      .eq('status', 'finalizado');

    if (barbearia_id) query = query.eq('barbearia_id', barbearia_id);
    if (data_inicio) query = query.gte('data_inicio', data_inicio);
    if (data_fim) query = query.lte('data_inicio', data_fim);
    if (userRole === 'barbeiro') query = query.eq('barbeiro_id', userId);

    const { data: atendimentos, error } = await query;

    if (error) throw new Error('Erro ao buscar atendimentos dos barbeiros');

    // Agrupar por barbeiro
    const barbeirosMap = new Map();

    atendimentos.forEach(atendimento => {
      const barbeiroId = atendimento.barbeiro_id;
      
      if (!barbeirosMap.has(barbeiroId)) {
        barbeirosMap.set(barbeiroId, {
          id: barbeiroId,
          nome: atendimento.barbeiros?.nome || 'Barbeiro não encontrado',
          email: atendimento.barbeiros?.email,
          barbearia: atendimento.barbearias?.nome,
          total_atendimentos: 0,
          faturamento_total: 0,
          tempo_medio_atendimento: 0,
          tempos: []
        });
      }

      const barbeiro = barbeirosMap.get(barbeiroId);
      barbeiro.total_atendimentos++;
      barbeiro.faturamento_total += atendimento.valor_atendimento || 0;

      // Calcular tempo do atendimento
      const inicio = new Date(atendimento.data_inicio);
      const fim = new Date(atendimento.data_fim);
      const tempo = (fim - inicio) / (1000 * 60); // em minutos
      barbeiro.tempos.push(tempo);
    });

    // Calcular tempo médio e buscar avaliações
    const performanceBarbeiros = [];

    for (const [barbeiroId, barbeiro] of barbeirosMap) {
      // Calcular tempo médio
      barbeiro.tempo_medio_atendimento = barbeiro.tempos.length > 0
        ? Math.round(barbeiro.tempos.reduce((a, b) => a + b, 0) / barbeiro.tempos.length)
        : 0;

      // Buscar avaliações do barbeiro
      const { data: avaliacoes } = await this.supabase
        .from('avaliacoes')
        .select('rating')
        .eq('barbeiro_id', barbeiroId)
        .gte('created_at', data_inicio)
        .lte('created_at', data_fim);

      const avaliacaoMedia = avaliacoes.length > 0
        ? Math.round((avaliacoes.reduce((sum, av) => sum + av.rating, 0) / avaliacoes.length) * 10) / 10
        : 0;

      performanceBarbeiros.push({
        ...barbeiro,
        avaliacao_media: avaliacaoMedia,
        total_avaliacoes: avaliacoes.length
      });

      // Remover array de tempos (não necessário na resposta)
      delete barbeiro.tempos;
    }

    // Ordenar por total de atendimentos (decrescente)
    return performanceBarbeiros.sort((a, b) => b.total_atendimentos - a.total_atendimentos);
  }

  /**
   * Calcular atendimentos por barbearia
   */
  async calcularAtendimentosPorBarbearia(filtros) {
    const { data_inicio, data_fim, userRole, userId } = filtros;

    let query = this.supabase
      .from('historico_atendimentos')
      .select(`
        barbearia_id,
        status,
        valor_atendimento,
        barbearias:barbearia_id(nome, endereco)
      `)
      .eq('status', 'finalizado');

    if (data_inicio) query = query.gte('data_inicio', data_inicio);
    if (data_fim) query = query.lte('data_inicio', data_fim);

    // Para barbeiros, filtrar apenas suas barbearias
    if (userRole === 'barbeiro') {
      const { data: barbeiroBarbearias } = await this.supabase
        .from('barbeiros_barbearias')
        .select('barbearia_id')
        .eq('user_id', userId)
        .eq('ativo', true);

      const barbeariaIds = barbeiroBarbearias.map(bb => bb.barbearia_id);
      if (barbeariaIds.length > 0) {
        query = query.in('barbearia_id', barbeariaIds);
      }
    }

    const { data: atendimentos, error } = await query;

    if (error) throw new Error('Erro ao buscar atendimentos por barbearia');

    // Agrupar por barbearia
    const barbeariasMap = new Map();

    atendimentos.forEach(atendimento => {
      const barbeariaId = atendimento.barbearia_id;
      
      if (!barbeariasMap.has(barbeariaId)) {
        barbeariasMap.set(barbeariaId, {
          id: barbeariaId,
          nome: atendimento.barbearias?.nome || 'Barbearia não encontrada',
          endereco: atendimento.barbearias?.endereco,
          total_atendimentos: 0,
          faturamento_total: 0
        });
      }

      const barbearia = barbeariasMap.get(barbeariaId);
      barbearia.total_atendimentos++;
      barbearia.faturamento_total += atendimento.valor_atendimento || 0;
    });

    // Converter para array e ordenar por atendimentos
    return Array.from(barbeariasMap.values())
      .sort((a, b) => b.total_atendimentos - a.total_atendimentos);
  }

  /**
   * Calcular comparação com período anterior
   */
  async calcularComparacaoPeriodo(filtros, periodo) {
    const { data_inicio, data_fim, barbearia_id, userRole, userId } = filtros;

    // Calcular período anterior
    const inicioAtual = new Date(data_inicio);
    const fimAtual = new Date(data_fim);
    const duracao = fimAtual - inicioAtual;

    const inicioAnterior = new Date(inicioAtual.getTime() - duracao);
    const fimAnterior = new Date(inicioAtual.getTime() - 1);

    // Buscar dados do período anterior
    const filtrosAnterior = {
      ...filtros,
      data_inicio: inicioAnterior.toISOString().split('T')[0],
      data_fim: fimAnterior.toISOString().split('T')[0]
    };

    const relatorioAnterior = await this.gerarRelatorioDashboard(filtrosAnterior);
    const dadosAnterior = relatorioAnterior.data;

    // Buscar dados do período atual
    const relatorioAtual = await this.gerarRelatorioDashboard(filtros);
    const dadosAtual = relatorioAtual.data;

    // Calcular variações percentuais
    const calcularVariacao = (atual, anterior) => {
      if (anterior === 0) return atual > 0 ? 100 : 0;
      return Math.round(((atual - anterior) / anterior) * 100);
    };

    return {
      atendimentos: {
        atual: dadosAtual.total_atendimentos,
        anterior: dadosAnterior.total_atendimentos,
        variacao: calcularVariacao(dadosAtual.total_atendimentos, dadosAnterior.total_atendimentos)
      },
      faturamento: {
        atual: dadosAtual.faturamento_total,
        anterior: dadosAnterior.faturamento_total,
        variacao: calcularVariacao(dadosAtual.faturamento_total, dadosAnterior.faturamento_total)
      },
      satisfacao: {
        atual: dadosAtual.satisfacao_geral,
        anterior: dadosAnterior.satisfacao_geral,
        variacao: calcularVariacao(dadosAtual.satisfacao_geral, dadosAnterior.satisfacao_geral)
      },
      tempo_medio: {
        atual: dadosAtual.tempo_medio_atendimento,
        anterior: dadosAnterior.tempo_medio_atendimento,
        variacao: calcularVariacao(dadosAtual.tempo_medio_atendimento, dadosAnterior.tempo_medio_atendimento)
      }
    };
  }

  /**
   * Gerar relatório para download
   */
  async gerarRelatorioDownload(filtros, tipo = 'excel') {
    try {
      const relatorio = await this.gerarRelatorioDashboard(filtros);
      const dados = relatorio.data;

      if (tipo === 'excel') {
        return await this.gerarExcel(dados, filtros);
      } else if (tipo === 'pdf') {
        return await this.gerarPDF(dados, filtros);
      } else {
        throw new Error('Tipo de relatório não suportado');
      }

    } catch (error) {
      console.error('Erro ao gerar relatório para download:', error);
      throw new Error(`Erro ao gerar relatório: ${error.message}`);
    }
  }

  /**
   * Gerar arquivo Excel
   */
  async gerarExcel(dados, filtros) {
    const workbook = new ExcelJS.Workbook();
    
    // Planilha de Resumo
    const resumoSheet = workbook.addWorksheet('Resumo');
    resumoSheet.columns = [
      { header: 'Métrica', key: 'metrica', width: 30 },
      { header: 'Valor Atual', key: 'atual', width: 20 },
      { header: 'Valor Anterior', key: 'anterior', width: 20 },
      { header: 'Variação (%)', key: 'variacao', width: 15 }
    ];

    resumoSheet.addRows([
      { metrica: 'Total de Atendimentos', atual: dados.total_atendimentos, anterior: dados.comparacao.atendimentos.anterior, variacao: dados.comparacao.atendimentos.variacao },
      { metrica: 'Tempo Médio (min)', atual: dados.tempo_medio_atendimento, anterior: dados.comparacao.tempo_medio.anterior, variacao: dados.comparacao.tempo_medio.variacao },
      { metrica: 'Faturamento (R$)', atual: dados.faturamento_total, anterior: dados.comparacao.faturamento.anterior, variacao: dados.comparacao.faturamento.variacao },
      { metrica: 'Satisfação (1-5)', atual: dados.satisfacao_geral, anterior: dados.comparacao.satisfacao.anterior, variacao: dados.comparacao.satisfacao.variacao }
    ]);

    // Planilha de Performance dos Barbeiros
    const barbeirosSheet = workbook.addWorksheet('Performance Barbeiros');
    barbeirosSheet.columns = [
      { header: 'Barbeiro', key: 'nome', width: 25 },
      { header: 'Barbearia', key: 'barbearia', width: 20 },
      { header: 'Atendimentos', key: 'atendimentos', width: 15 },
      { header: 'Faturamento (R$)', key: 'faturamento', width: 20 },
      { header: 'Tempo Médio (min)', key: 'tempo', width: 20 },
      { header: 'Avaliação Média', key: 'avaliacao', width: 20 },
      { header: 'Total Avaliações', key: 'total_avaliacoes', width: 20 }
    ];

    dados.performance_barbeiros.forEach(barbeiro => {
      barbeirosSheet.addRow({
        nome: barbeiro.nome,
        barbearia: barbeiro.barbearia,
        atendimentos: barbeiro.total_atendimentos,
        faturamento: barbeiro.faturamento_total,
        tempo: barbeiro.tempo_medio_atendimento,
        avaliacao: barbeiro.avaliacao_media,
        total_avaliacoes: barbeiro.total_avaliacoes
      });
    });

    // Planilha de Barbearias
    const barbeariasSheet = workbook.addWorksheet('Atendimentos por Barbearia');
    barbeariasSheet.columns = [
      { header: 'Barbearia', key: 'nome', width: 30 },
      { header: 'Endereço', key: 'endereco', width: 40 },
      { header: 'Atendimentos', key: 'atendimentos', width: 15 },
      { header: 'Faturamento (R$)', key: 'faturamento', width: 20 }
    ];

    dados.atendimentos_por_barbearia.forEach(barbearia => {
      barbeariasSheet.addRow({
        nome: barbearia.nome,
        endereco: barbearia.endereco,
        atendimentos: barbearia.total_atendimentos,
        faturamento: barbearia.faturamento_total
      });
    });

    // Gerar buffer do Excel
    const buffer = await workbook.xlsx.writeBuffer();
    
    return {
      buffer,
      filename: `relatorio_${filtros.data_inicio}_${filtros.data_fim}.xlsx`,
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    };
  }

  /**
   * Gerar arquivo PDF (implementação futura)
   */
  async gerarPDF(dados, filtros) {
    // TODO: Implementar geração de PDF
    throw new Error('Geração de PDF ainda não implementada');
  }
}

module.exports = RelatorioService; 