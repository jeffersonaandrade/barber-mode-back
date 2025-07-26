/**
 * Serviço para operações relacionadas aos usuários
 * 
 * Este serviço contém toda a lógica de negócio relacionada aos usuários,
 * separando as operações de banco de dados das rotas.
 */
class UserService {
  constructor(supabase) {
    this.supabase = supabase;
  }

  /**
   * Listar barbeiros com filtros
   * @param {Object} filtros - Filtros para a busca
   * @param {number} filtros.barbearia_id - ID da barbearia
   * @param {string} filtros.status - Status dos barbeiros (ativo, inativo, disponivel)
   * @param {boolean} filtros.isPublic - Se é acesso público
   * @returns {Promise<Object>} Lista de barbeiros
   */
  async listarBarbeiros(filtros) {
    const { barbearia_id, status = 'ativo', isPublic = false } = filtros;

    // Se barbearia_id foi fornecido, verificar se existe e está ativa
    let barbearia = null;
    if (barbearia_id) {
      const { data: barbeariaData, error: barbeariaError } = await this.supabase
        .from('barbearias')
        .select('id, nome, ativo')
        .eq('id', barbearia_id)
        .eq('ativo', true)
        .single();
        
      if (barbeariaError || !barbeariaData) {
        console.error('Erro ao buscar barbearia:', barbeariaError);
        console.error('Barbearia ID:', barbearia_id);
        throw new Error('Barbearia não encontrada ou inativa');
      }
      barbearia = barbeariaData;
    }
    
    // Construir query base
    let query = this.supabase
      .from('barbeiros_barbearias')
      .select(`
        id,
        ativo,
        barbearia_id,
        users(
          id,
          nome,
          email,
          telefone
        )
      `);
    
    // Filtrar por barbearia se especificada
    if (barbearia_id) {
      query = query.eq('barbearia_id', barbearia_id);
    }
    
    // Aplicar filtros de status
    if (status === 'ativo') {
      query = query.eq('ativo', true);
    } else if (status === 'inativo') {
      query = query.eq('ativo', false);
    } else if (status === 'disponivel') {
      // Barbeiros ativos que não estão atendendo
      query = query.eq('ativo', true);
    }
    
    const { data: barbeiros, error: barbeirosError } = await query;
    
    if (barbeirosError) {
      console.error('Erro na query de barbeiros:', barbeirosError);
      console.error('Query params:', { barbearia_id, status, isPublic });
      throw new Error('Erro interno do servidor');
    }
    
    // Filtrar barbeiros disponíveis se necessário
    let barbeirosFiltrados = barbeiros;
    if (status === 'disponivel' && barbearia_id) {
      // Verificar quais barbeiros estão atendendo
      const { data: barbeirosAtendendo } = await this.supabase
        .from('clientes')
        .select('barbeiro_id')
        .eq('barbearia_id', barbearia_id)
        .in('status', ['proximo', 'atendendo']);
        
      const barbeirosOcupados = barbeirosAtendendo?.map(c => c.barbeiro_id) || [];
      barbeirosFiltrados = barbeiros.filter(b => !barbeirosOcupados.includes(b.users.id));
    }
    
    // Formatar resposta baseada no tipo de acesso
    const barbeirosFormatados = barbeirosFiltrados.map(barbeiro => {
      if (isPublic) {
        // Dados limitados para clientes
        return {
          id: barbeiro.users.id,
          nome: barbeiro.users.nome
        };
      } else {
        // Dados completos para funcionários
        return {
          id: barbeiro.users.id,
          nome: barbeiro.users.nome,
          email: barbeiro.users.email,
          telefone: barbeiro.users.telefone,
          ativo: barbeiro.ativo
        };
      }
    });
    
    return {
      barbearia: barbearia ? {
        id: barbearia.id,
        nome: barbearia.nome
      } : null,
      barbeiros: barbeirosFormatados,
      total: barbeirosFormatados.length
    };
  }

  /**
   * Obter status do barbeiro logado
   * @param {string} userId - ID do usuário
   * @returns {Promise<Object>} Status do barbeiro
   */
  async obterStatusBarbeiro(userId) {
    // Buscar informações do barbeiro
    const { data: barbeiro, error: barbeiroError } = await this.supabase
      .from('barbeiros_barbearias')
      .select(`
        id,
        ativo,
        barbearia_id,
        barbearias(id, nome)
      `)
      .eq('user_id', userId)
      .eq('ativo', true)
      .single();
      
    if (barbeiroError || !barbeiro) {
      throw new Error('Barbeiro não encontrado ou inativo');
    }
    
    // Verificar se está atendendo algum cliente
    const { data: clienteAtual } = await this.supabase
      .from('clientes')
      .select('id, nome, status')
      .eq('barbeiro_id', userId)
      .eq('barbearia_id', barbeiro.barbearia_id)
      .in('status', ['proximo', 'atendendo'])
      .single();
    
    // Verificar próximos clientes na fila
    const { data: proximosClientes } = await this.supabase
      .from('clientes')
      .select('id, nome, posicao')
      .eq('barbearia_id', barbeiro.barbearia_id)
      .eq('status', 'aguardando')
      .order('posicao', { ascending: true })
      .limit(3);
    
    return {
      barbeiro: {
        id: userId,
        ativo: barbeiro.ativo,
        barbearia: barbeiro.barbearias
      },
      status_atual: {
        atendendo: clienteAtual || null,
        proximos_na_fila: proximosClientes || []
      }
    };
  }

  /**
   * Ativar barbeiro em uma barbearia
   * @param {Object} dados - Dados para ativação
   * @param {string} dados.user_id - ID do usuário
   * @param {number} dados.barbearia_id - ID da barbearia
   * @returns {Promise<Object>} Resultado da ativação
   */
  async ativarBarbeiro(dados) {
    const { user_id, barbearia_id } = dados;

    // Verificar se o usuário existe e é um barbeiro
    const { data: user, error: userError } = await this.supabase
      .from('users')
      .select('id, nome, email, role, ativo')
      .eq('id', user_id)
      .eq('role', 'barbeiro')
      .eq('ativo', true)
      .single();
      
    if (userError || !user) {
      throw new Error('Usuário não encontrado ou não é um barbeiro ativo');
    }
    
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
    
    // Verificar se já existe uma relação entre o barbeiro e a barbearia
    const { data: relacaoExistente, error: relacaoError } = await this.supabase
      .from('barbeiros_barbearias')
      .select('id, ativo')
      .eq('user_id', user_id)
      .eq('barbearia_id', barbearia_id)
      .single();
      
    if (relacaoError && relacaoError.code !== 'PGRST116') {
      throw new Error('Erro interno do servidor');
    }
    
    if (relacaoExistente) {
      if (relacaoExistente.ativo) {
        throw new Error('Barbeiro já está ativo nesta barbearia');
      } else {
        // Reativar barbeiro
        const { error: updateError } = await this.supabase
          .from('barbeiros_barbearias')
          .update({ 
            ativo: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', relacaoExistente.id);
          
        if (updateError) {
          throw new Error('Erro interno do servidor');
        }
        
        return {
          barbeiro: {
            id: user.id,
            nome: user.nome,
            email: user.email
          },
          barbearia: {
            id: barbearia.id,
            nome: barbearia.nome
          },
          acao: 'reativado'
        };
      }
    } else {
      // Criar nova relação
      const { data: novaRelacao, error: insertError } = await this.supabase
        .from('barbeiros_barbearias')
        .insert({
          user_id: user_id,
          barbearia_id: barbearia_id,
          ativo: true,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
        
      if (insertError) {
        throw new Error('Erro interno do servidor');
      }
      
      return {
        barbeiro: {
          id: user.id,
          nome: user.nome,
          email: user.email
        },
        barbearia: {
          id: barbearia.id,
          nome: barbearia.nome
        },
        acao: 'ativado'
      };
    }
  }

  /**
   * Desativar barbeiro em uma barbearia
   * @param {Object} dados - Dados para desativação
   * @param {string} dados.user_id - ID do usuário
   * @param {number} dados.barbearia_id - ID da barbearia
   * @returns {Promise<Object>} Resultado da desativação
   */
  async desativarBarbeiro(dados) {
    const { user_id, barbearia_id } = dados;

    // Verificar se existe a relação entre barbeiro e barbearia
    const { data: relacao, error: relacaoError } = await this.supabase
      .from('barbeiros_barbearias')
      .select(`
        id,
        ativo,
        users(id, nome, email),
        barbearias(id, nome)
      `)
      .eq('user_id', user_id)
      .eq('barbearia_id', barbearia_id)
      .single();
      
    if (relacaoError || !relacao) {
      throw new Error('Relação barbeiro-barbearia não encontrada');
    }
    
    if (!relacao.ativo) {
      throw new Error('Barbeiro já está inativo nesta barbearia');
    }
    
    // Verificar se o barbeiro está atendendo algum cliente
    const { data: clienteAtendendo } = await this.supabase
      .from('clientes')
      .select('id, nome')
      .eq('barbeiro_id', user_id)
      .eq('barbearia_id', barbearia_id)
      .in('status', ['proximo', 'atendendo'])
      .single();
      
    if (clienteAtendendo) {
      throw new Error('Não é possível desativar barbeiro que está atendendo um cliente');
    }
    
    // Desativar barbeiro
    const { error: updateError } = await this.supabase
      .from('barbeiros_barbearias')
      .update({ 
        ativo: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', relacao.id);
      
    if (updateError) {
      throw new Error('Erro interno do servidor');
    }
    
    return {
      barbeiro: {
        id: relacao.users.id,
        nome: relacao.users.nome,
        email: relacao.users.email
      },
      barbearia: {
        id: relacao.barbearias.id,
        nome: relacao.barbearias.nome
      }
    };
  }

  /**
   * Listar todos os usuários (ADMIN)
   * @returns {Promise<Object>} Lista de usuários
   */
  async listarUsuarios() {
    const { data: users, error: usersError } = await this.supabase
      .from('users')
      .select('id, nome, email, telefone, role, active, created_at, updated_at')
      .order('created_at', { ascending: false });
      
    if (usersError) {
      throw new Error('Erro interno do servidor');
    }
    
    return {
      users: users.map(user => ({
        id: user.id,
        nome: user.nome,
        email: user.email,
        telefone: user.telefone,
        role: user.role,
        ativo: user.active, // Mapear 'active' para 'ativo' para manter compatibilidade
        created_at: user.created_at,
        updated_at: user.updated_at
      })),
      total: users.length
    };
  }

  /**
   * Atualizar usuário (ADMIN)
   * @param {string} id - ID do usuário
   * @param {Object} dados - Dados para atualização
   * @returns {Promise<Object>} Usuário atualizado
   */
  async atualizarUsuario(id, dados) {
    const { nome, email, role, ativo } = dados;
    
    // Verificar se o usuário existe
    const { data: userExistente, error: userError } = await this.supabase
      .from('users')
      .select('id, nome, email, role')
      .eq('id', id)
      .single();
      
    if (userError || !userExistente) {
      throw new Error('Usuário não encontrado');
    }
    
    // Preparar dados para atualização
    const dadosAtualizacao = {};
    if (nome !== undefined) dadosAtualizacao.nome = nome;
    if (email !== undefined) dadosAtualizacao.email = email;
    if (role !== undefined) dadosAtualizacao.role = role;
    if (ativo !== undefined) dadosAtualizacao.ativo = ativo;
    
    dadosAtualizacao.updated_at = new Date().toISOString();
    
    // Atualizar usuário
    const { data: userAtualizado, error: updateError } = await this.supabase
      .from('users')
      .update(dadosAtualizacao)
      .eq('id', id)
      .select('id, nome, email, role, ativo, updated_at')
      .single();
      
    if (updateError) {
      throw new Error('Erro interno do servidor');
    }
    
    return {
      id: userAtualizado.id,
      nome: userAtualizado.nome,
      email: userAtualizado.email,
      role: userAtualizado.role,
      ativo: userAtualizado.ativo,
      updated_at: userAtualizado.updated_at
    };
  }

  /**
   * Barbeiro altera seu próprio status (ativo/inativo)
   * @param {Object} dados - Dados para alteração
   * @param {string} dados.user_id - ID do barbeiro
   * @param {number} dados.barbearia_id - ID da barbearia
   * @param {boolean} dados.ativo - Novo status (true = ativo, false = inativo)
   * @returns {Promise<Object>} Status atualizado
   */
  async alterarStatusBarbeiro(dados) {
    const { user_id, barbearia_id, ativo } = dados;

    console.log(`Alterando status do barbeiro ${user_id} na barbearia ${barbearia_id} para ${ativo}`);

    // Verificar se a barbearia existe e está ativa
    const { data: barbearia, error: barbeariaError } = await this.supabase
      .from('barbearias')
      .select('id, nome, ativo')
      .eq('id', barbearia_id)
      .single();
      
    if (barbeariaError || !barbearia) {
      throw new Error(`Barbearia ID ${barbearia_id} não encontrada`);
    }
    
    if (!barbearia.ativo) {
      throw new Error(`Barbearia ${barbearia.nome} está inativa`);
    }

    // Verificar se o barbeiro está associado à barbearia
    let { data: associacao, error: associacaoError } = await this.supabase
      .from('barbeiros_barbearias')
      .select('id, ativo, users(id, nome, email)')
      .eq('user_id', user_id)
      .eq('barbearia_id', barbearia_id)
      .single();
      
    // Se não existe associação, criar automaticamente (barbeiro tem acesso a todas)
    if (associacaoError || !associacao) {
      console.log(`Criando associação para barbeiro ${user_id} na barbearia ${barbearia_id}`);
      
      try {
        // Verificar se o usuário existe e é barbeiro
        const { data: usuario, error: usuarioError } = await this.supabase
          .from('users')
          .select('id, nome, email, role')
          .eq('id', user_id)
          .single();
          
        if (usuarioError || !usuario) {
          throw new Error(`Usuário ID ${user_id} não encontrado`);
        }
        
        if (usuario.role !== 'barbeiro') {
          throw new Error(`Usuário ${usuario.nome} não é um barbeiro`);
        }

        // Tentar criar a associação
        // Dados para inserção com campos básicos obrigatórios
        const dadosInsercao = {
          user_id: user_id,
          barbearia_id: barbearia_id,
          ativo: false, // Começa inativo
          dias_trabalho: ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'], // Dias padrão
          horario_inicio: '08:00', // Horário padrão de início
          horario_fim: '18:00', // Horário padrão de fim
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        console.log('Dados para inserção:', dadosInsercao);

        const { data: novaAssociacao, error: createError } = await this.supabase
          .from('barbeiros_barbearias')
          .insert(dadosInsercao)
          .select('id, ativo, users(id, nome, email)')
          .single();
          
        if (createError) {
          console.error('Erro ao criar associação:', createError);
          
          // Se for erro de constraint unique, tentar buscar a associação existente
          if (createError.code === '23505') {
            console.log('Associação já existe, buscando...');
            const { data: assocExistente, error: buscaError } = await this.supabase
              .from('barbeiros_barbearias')
              .select('id, ativo, users(id, nome, email)')
              .eq('user_id', user_id)
              .eq('barbearia_id', barbearia_id)
              .single();
              
            if (buscaError || !assocExistente) {
              throw new Error(`Erro inesperado: ${createError.message}`);
            }
            
            associacao = assocExistente;
            console.log('Associação encontrada:', associacao);
          } else {
            throw new Error(`Erro ao criar associação com a barbearia: ${createError.message}`);
          }
        } else {
          associacao = novaAssociacao;
          console.log('Associação criada com sucesso:', associacao);
        }
      } catch (error) {
        console.error('Erro completo:', error);
        throw error;
      }
    }

    // Atualizar status do barbeiro
    const { data: barbeiroAtualizado, error: updateError } = await this.supabase
      .from('barbeiros_barbearias')
      .update({ 
        ativo: ativo,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user_id)
      .eq('barbearia_id', barbearia_id)
      .select(`
        id,
        ativo,
        updated_at,
        users(id, nome, email),
        barbearias(id, nome)
      `)
      .single();
      
    if (updateError) {
      throw new Error('Erro interno do servidor');
    }

    return {
      barbeiro: {
        id: barbeiroAtualizado.users.id,
        nome: barbeiroAtualizado.users.nome,
        email: barbeiroAtualizado.users.email
      },
      barbearia: {
        id: barbeiroAtualizado.barbearias.id,
        nome: barbeiroAtualizado.barbearias.nome
      },
      ativo: barbeiroAtualizado.ativo,
      updated_at: barbeiroAtualizado.updated_at
    };
  }

  /**
   * Listar todas as barbearias disponíveis para o barbeiro
   * @param {string} userId - ID do barbeiro
   * @returns {Promise<Array>} Lista de barbearias
   */
  async listarBarbeariasDoBarbeiro(userId) {
    // Buscar TODAS as barbearias ativas da rede
    const { data: todasBarbearias, error: barbeariasError } = await this.supabase
      .from('barbearias')
      .select(`
        id,
        nome,
        endereco,
        telefone,
        ativo,
        created_at,
        updated_at
      `)
      .eq('ativo', true)
      .order('nome');
      
    if (barbeariasError) {
      throw new Error('Erro interno do servidor');
    }

    // Buscar status do barbeiro em cada barbearia
    const { data: associacoes, error: associacoesError } = await this.supabase
      .from('barbeiros_barbearias')
      .select('barbearia_id, ativo, updated_at')
      .eq('user_id', userId);
      
    if (associacoesError) {
      throw new Error('Erro interno do servidor');
    }

    // Criar mapa de status por barbearia
    const statusMap = new Map();
    associacoes.forEach(assoc => {
      statusMap.set(assoc.barbearia_id, {
        ativo: assoc.ativo,
        updated_at: assoc.updated_at
      });
    });

    // Combinar dados: todas as barbearias com status do barbeiro
    return todasBarbearias.map(barbearia => {
      const status = statusMap.get(barbearia.id);
      return {
        id: barbearia.id,
        nome: barbearia.nome,
        endereco: barbearia.endereco,
        telefone: barbearia.telefone,
        ativo: status ? status.ativo : false, // Se não tem associação, começa inativo
        updated_at: status ? status.updated_at : barbearia.created_at
      };
    });
  }

  /**
   * Deletar usuário (ADMIN)
   * @param {string} id - ID do usuário
   * @param {string} adminId - ID do admin que está deletando
   * @returns {Promise<Object>} Usuário deletado
   */
  async deletarUsuario(id, adminId) {
    // Verificar se o usuário existe
    const { data: userExistente, error: userError } = await this.supabase
      .from('users')
      .select('id, nome, email, role')
      .eq('id', id)
      .single();
      
    if (userError || !userExistente) {
      throw new Error('Usuário não encontrado');
    }
    
    // Verificar se o usuário está sendo deletado não é o próprio admin
    if (adminId === id) {
      throw new Error('Não é possível deletar o próprio usuário');
    }
    
    // Verificar se o usuário tem relações ativas (barbeiro em barbearias)
    if (userExistente.role === 'barbeiro') {
      const { data: relacoesAtivas } = await this.supabase
        .from('barbeiros_barbearias')
        .select('id')
        .eq('user_id', id)
        .eq('ativo', true);
        
      if (relacoesAtivas && relacoesAtivas.length > 0) {
        throw new Error('Não é possível deletar barbeiro com relações ativas em barbearias');
      }
    }
    
    // Deletar usuário
    const { error: deleteError } = await this.supabase
      .from('users')
      .delete()
      .eq('id', id);
      
    if (deleteError) {
      throw new Error('Erro interno do servidor');
    }
    
    return {
      id: userExistente.id,
      nome: userExistente.nome,
      email: userExistente.email,
      role: userExistente.role
    };
  }

  /**
   * Desativar todos os barbeiros de uma barbearia (ADMIN/GERENTE)
   * @param {number} barbearia_id - ID da barbearia
   * @param {string} adminId - ID do admin/gerente que está executando a ação
   * @returns {Promise<Object>} Resultado da operação
   */
  async desativarTodosBarbeiros(barbearia_id, adminId) {
    console.log(`Desativando todos os barbeiros da barbearia ${barbearia_id} por ${adminId}`);

    // Verificar se a barbearia existe e está ativa
    const { data: barbearia, error: barbeariaError } = await this.supabase
      .from('barbearias')
      .select('id, nome, ativo')
      .eq('id', barbearia_id)
      .single();
      
    if (barbeariaError || !barbearia) {
      throw new Error(`Barbearia ID ${barbearia_id} não encontrada`);
    }
    
    if (!barbearia.ativo) {
      throw new Error(`Barbearia ${barbearia.nome} está inativa`);
    }

    // Buscar todos os barbeiros ativos na barbearia
    const { data: barbeirosAtivos, error: barbeirosError } = await this.supabase
      .from('barbeiros_barbearias')
      .select(`
        id,
        user_id,
        ativo,
        users(id, nome, email)
      `)
      .eq('barbearia_id', barbearia_id)
      .eq('ativo', true);
      
    if (barbeirosError) {
      throw new Error('Erro interno do servidor');
    }

    if (!barbeirosAtivos || barbeirosAtivos.length === 0) {
      return {
        barbearia: {
          id: barbearia.id,
          nome: barbearia.nome
        },
        barbeiros_desativados: 0,
        message: 'Nenhum barbeiro estava ativo nesta barbearia'
      };
    }

    // Desativar todos os barbeiros
    const { data: barbeirosDesativados, error: updateError } = await this.supabase
      .from('barbeiros_barbearias')
      .update({ 
        ativo: false,
        updated_at: new Date().toISOString()
      })
      .eq('barbearia_id', barbearia_id)
      .eq('ativo', true)
      .select(`
        id,
        user_id,
        ativo,
        updated_at,
        users(id, nome, email)
      `);
      
    if (updateError) {
      throw new Error('Erro interno do servidor');
    }

    return {
      barbearia: {
        id: barbearia.id,
        nome: barbearia.nome
      },
      barbeiros_desativados: barbeirosDesativados.length,
      barbeiros: barbeirosDesativados.map(b => ({
        id: b.users.id,
        nome: b.users.nome,
        email: b.users.email
      })),
      message: `${barbeirosDesativados.length} barbeiro(s) desativado(s) com sucesso`,
      updated_at: new Date().toISOString()
    };
  }
}

module.exports = UserService; 