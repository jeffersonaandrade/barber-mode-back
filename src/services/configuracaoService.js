const { supabase } = require('../config/database');

/**
 * Service para gerenciar configurações centralizadas
 * Permite admin/gerente configurar serviços, horários e configurações gerais
 */
class ConfiguracaoService {
  
  /**
   * Listar todos os serviços (admin vê todos, gerente vê apenas da sua barbearia)
   */
  async listarServicos(userId, userRole, barbeariaId = null) {
    try {
      let query = supabase
        .from('servicos')
        .select('*')
        .eq('ativo', true)
        .order('nome');

      // Se for gerente, filtrar por barbearia (futuro: quando implementar relação serviço-barbearia)
      if (userRole === 'gerente' && barbeariaId) {
        // Por enquanto, gerente vê todos os serviços
        // Futuro: adicionar campo barbearia_id na tabela servicos
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao listar serviços:', error);
        throw new Error('Erro ao buscar serviços');
      }

      return {
        success: true,
        data: data || []
      };
    } catch (error) {
      console.error('Erro no service listarServicos:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Criar novo serviço
   */
  async criarServico(servicoData, userId, userRole) {
    try {
      // Validar dados obrigatórios
      if (!servicoData.nome || !servicoData.preco || !servicoData.duracao) {
        throw new Error('Nome, preço e duração são obrigatórios');
      }

      const novoServico = {
        nome: servicoData.nome,
        descricao: servicoData.descricao || '',
        preco: parseFloat(servicoData.preco),
        duracao: parseInt(servicoData.duracao),
        categoria: servicoData.categoria || 'geral',
        ativo: true,
        created_by: userId
      };

      const { data, error } = await supabase
        .from('servicos')
        .insert([novoServico])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar serviço:', error);
        throw new Error('Erro ao criar serviço');
      }

      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Erro no service criarServico:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Atualizar serviço
   */
  async atualizarServico(servicoId, servicoData, userId, userRole) {
    try {
      // Verificar se serviço existe
      const { data: servicoExistente, error: errorBusca } = await supabase
        .from('servicos')
        .select('*')
        .eq('id', servicoId)
        .single();

      if (errorBusca || !servicoExistente) {
        throw new Error('Serviço não encontrado');
      }

      // Validar dados obrigatórios
      if (!servicoData.nome || !servicoData.preco || !servicoData.duracao) {
        throw new Error('Nome, preço e duração são obrigatórios');
      }

      const servicoAtualizado = {
        nome: servicoData.nome,
        descricao: servicoData.descricao || servicoExistente.descricao,
        preco: parseFloat(servicoData.preco),
        duracao: parseInt(servicoData.duracao),
        categoria: servicoData.categoria || servicoExistente.categoria,
        ativo: servicoData.ativo !== undefined ? servicoData.ativo : servicoExistente.ativo
      };

      const { data, error } = await supabase
        .from('servicos')
        .update(servicoAtualizado)
        .eq('id', servicoId)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar serviço:', error);
        throw new Error('Erro ao atualizar serviço');
      }

      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Erro no service atualizarServico:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Excluir serviço (soft delete)
   */
  async excluirServico(servicoId, userId, userRole) {
    try {
      // Verificar se serviço existe
      const { data: servicoExistente, error: errorBusca } = await supabase
        .from('servicos')
        .select('*')
        .eq('id', servicoId)
        .single();

      if (errorBusca || !servicoExistente) {
        throw new Error('Serviço não encontrado');
      }

      // Soft delete - apenas desativar
      const { error } = await supabase
        .from('servicos')
        .update({ ativo: false })
        .eq('id', servicoId);

      if (error) {
        console.error('Erro ao excluir serviço:', error);
        throw new Error('Erro ao excluir serviço');
      }

      return {
        success: true,
        message: 'Serviço excluído com sucesso'
      };
    } catch (error) {
      console.error('Erro no service excluirServico:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Listar horários de funcionamento de uma barbearia
   */
  async listarHorarios(barbeariaId, userId, userRole) {
    try {
      // Verificar permissão
      if (userRole === 'gerente') {
        // Verificar se é gerente da barbearia
        const { data: barbearia, error: errorBarbearia } = await supabase
          .from('barbearias')
          .select('gerente_id')
          .eq('id', barbeariaId)
          .single();

        if (errorBarbearia || barbearia.gerente_id !== userId) {
          throw new Error('Acesso negado');
        }
      }

      const { data, error } = await supabase
        .from('horarios_funcionamento')
        .select('*')
        .eq('barbearia_id', barbeariaId)
        .order('dia_semana');

      if (error) {
        console.error('Erro ao listar horários:', error);
        throw new Error('Erro ao buscar horários');
      }

      // Organizar por dia da semana
      const horariosOrganizados = {};
      const diasSemana = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
      
      data.forEach(horario => {
        horariosOrganizados[diasSemana[horario.dia_semana]] = {
          aberto: horario.aberto,
          hora_inicio: horario.hora_inicio,
          hora_fim: horario.hora_fim
        };
      });

      return {
        success: true,
        data: horariosOrganizados
      };
    } catch (error) {
      console.error('Erro no service listarHorarios:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Atualizar horários de funcionamento
   */
  async atualizarHorarios(barbeariaId, horariosData, userId, userRole) {
    try {
      // Verificar permissão
      if (userRole === 'gerente') {
        const { data: barbearia, error: errorBarbearia } = await supabase
          .from('barbearias')
          .select('gerente_id')
          .eq('id', barbeariaId)
          .single();

        if (errorBarbearia || barbearia.gerente_id !== userId) {
          throw new Error('Acesso negado');
        }
      }

      const diasSemana = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
      const horariosParaAtualizar = [];

      // Preparar dados para atualização
      Object.keys(horariosData).forEach(dia => {
        const diaIndex = diasSemana.indexOf(dia);
        if (diaIndex !== -1) {
          const horario = horariosData[dia];
          horariosParaAtualizar.push({
            barbearia_id: barbeariaId,
            dia_semana: diaIndex,
            aberto: horario.aberto,
            hora_inicio: horario.aberto ? horario.hora_inicio : null,
            hora_fim: horario.aberto ? horario.hora_fim : null
          });
        }
      });

      // Atualizar horários usando upsert
      const { error } = await supabase
        .from('horarios_funcionamento')
        .upsert(horariosParaAtualizar, { 
          onConflict: 'barbearia_id,dia_semana' 
        });

      if (error) {
        console.error('Erro ao atualizar horários:', error);
        throw new Error('Erro ao atualizar horários');
      }

      return {
        success: true,
        message: 'Horários atualizados com sucesso'
      };
    } catch (error) {
      console.error('Erro no service atualizarHorarios:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Listar configurações de uma barbearia
   */
  async listarConfiguracoes(barbeariaId, userId, userRole) {
    try {
      // Verificar permissão
      if (userRole === 'gerente') {
        const { data: barbearia, error: errorBarbearia } = await supabase
          .from('barbearias')
          .select('gerente_id')
          .eq('id', barbeariaId)
          .single();

        if (errorBarbearia || barbearia.gerente_id !== userId) {
          throw new Error('Acesso negado');
        }
      }

      const { data, error } = await supabase
        .from('configuracoes_barbearia')
        .select('*')
        .eq('barbearia_id', barbeariaId)
        .order('chave');

      if (error) {
        console.error('Erro ao listar configurações:', error);
        throw new Error('Erro ao buscar configurações');
      }

      // Organizar por chave
      const configuracoesOrganizadas = {};
      data.forEach(config => {
        let valor = config.valor;
        
        // Converter valor baseado no tipo
        switch (config.tipo) {
          case 'number':
            valor = parseFloat(valor);
            break;
          case 'boolean':
            valor = valor === 'true';
            break;
          case 'json':
            try {
              valor = JSON.parse(valor);
            } catch (e) {
              valor = valor;
            }
            break;
        }
        
        configuracoesOrganizadas[config.chave] = {
          valor: valor,
          tipo: config.tipo,
          descricao: config.descricao
        };
      });

      return {
        success: true,
        data: configuracoesOrganizadas
      };
    } catch (error) {
      console.error('Erro no service listarConfiguracoes:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Atualizar configurações de uma barbearia
   */
  async atualizarConfiguracoes(barbeariaId, configuracoesData, userId, userRole) {
    try {
      // Verificar permissão
      if (userRole === 'gerente') {
        const { data: barbearia, error: errorBarbearia } = await supabase
          .from('barbearias')
          .select('gerente_id')
          .eq('id', barbeariaId)
          .single();

        if (errorBarbearia || barbearia.gerente_id !== userId) {
          throw new Error('Acesso negado');
        }
      }

      const configuracoesParaAtualizar = [];

      // Preparar dados para atualização
      Object.keys(configuracoesData).forEach(chave => {
        const config = configuracoesData[chave];
        let valor = config.valor;
        
        // Converter valor para string baseado no tipo
        if (config.tipo === 'json' && typeof valor === 'object') {
          valor = JSON.stringify(valor);
        } else if (typeof valor === 'boolean') {
          valor = valor.toString();
        } else if (typeof valor === 'number') {
          valor = valor.toString();
        }

        configuracoesParaAtualizar.push({
          barbearia_id: barbeariaId,
          chave: chave,
          valor: valor,
          tipo: config.tipo || 'string',
          descricao: config.descricao || ''
        });
      });

      // Atualizar configurações usando upsert
      const { error } = await supabase
        .from('configuracoes_barbearia')
        .upsert(configuracoesParaAtualizar, { 
          onConflict: 'barbearia_id,chave' 
        });

      if (error) {
        console.error('Erro ao atualizar configurações:', error);
        throw new Error('Erro ao atualizar configurações');
      }

      return {
        success: true,
        message: 'Configurações atualizadas com sucesso'
      };
    } catch (error) {
      console.error('Erro no service atualizarConfiguracoes:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obter configurações completas de uma barbearia (serviços + horários + configurações)
   */
  async obterConfiguracaoCompleta(barbeariaId, userId, userRole) {
    try {
      const [servicosResult, horariosResult, configuracoesResult] = await Promise.all([
        this.listarServicos(userId, userRole, barbeariaId),
        this.listarHorarios(barbeariaId, userId, userRole),
        this.listarConfiguracoes(barbeariaId, userId, userRole)
      ]);

      if (!servicosResult.success || !horariosResult.success || !configuracoesResult.success) {
        throw new Error('Erro ao buscar configurações');
      }

      return {
        success: true,
        data: {
          servicos: servicosResult.data,
          horarios: horariosResult.data,
          configuracoes: configuracoesResult.data
        }
      };
    } catch (error) {
      console.error('Erro no service obterConfiguracaoCompleta:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Executar limpeza automática da fila
   */
  async executarLimpezaAutomatica() {
    try {
      const { data, error } = await supabase.rpc('limpar_fila_antiga');

      if (error) {
        console.error('Erro ao executar limpeza automática:', error);
        throw new Error('Erro ao executar limpeza automática');
      }

      return {
        success: true,
        registrosRemovidos: data || 0,
        message: `Limpeza executada com sucesso. ${data || 0} registros removidos.`
      };
    } catch (error) {
      console.error('Erro no service executarLimpezaAutomatica:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new ConfiguracaoService(); 