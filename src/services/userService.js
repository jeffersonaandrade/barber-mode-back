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
    
    // Construir query base
    let query = this.supabase
      .from('barbeiros_barbearias')
      .select(`
        id,
        ativo,
        users(
          id,
          nome,
          email,
          telefone,
          foto_url
        )
      `)
      .eq('barbearia_id', barbearia_id);
    
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
      throw new Error('Erro interno do servidor');
    }
    
    // Filtrar barbeiros disponíveis se necessário
    let barbeirosFiltrados = barbeiros;
    if (status === 'disponivel') {
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
          nome: barbeiro.users.nome,
          foto_url: barbeiro.users.foto_url
        };
      } else {
        // Dados completos para funcionários
        return {
          id: barbeiro.users.id,
          nome: barbeiro.users.nome,
          email: barbeiro.users.email,
          telefone: barbeiro.users.telefone,
          foto_url: barbeiro.users.foto_url,
          ativo: barbeiro.ativo
        };
      }
    });
    
    return {
      barbearia: {
        id: barbearia.id,
        nome: barbearia.nome
      },
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
      .select('id, nome, email, role, ativo, created_at')
      .order('created_at', { ascending: false });
      
    if (usersError) {
      throw new Error('Erro interno do servidor');
    }
    
    return {
      users: users.map(user => ({
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
        ativo: user.ativo,
        created_at: user.created_at
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
}

module.exports = UserService; 