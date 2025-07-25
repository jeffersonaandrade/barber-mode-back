/**
 * Serviço para operações relacionadas aos usuários
 * 
 * Este serviço contém toda a lógica de negócio relacionada aos usuários,
 * separando as operações de banco de dados das rotas.
 */
// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
class UserService {
  constructor(supabase) {
    if (stryMutAct_9fa48("4051")) {
      {}
    } else {
      stryCov_9fa48("4051");
      this.supabase = supabase;
    }
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
    if (stryMutAct_9fa48("4052")) {
      {}
    } else {
      stryCov_9fa48("4052");
      const {
        barbearia_id,
        status = stryMutAct_9fa48("4053") ? "" : (stryCov_9fa48("4053"), 'ativo'),
        isPublic = stryMutAct_9fa48("4054") ? true : (stryCov_9fa48("4054"), false)
      } = filtros;

      // Verificar se a barbearia existe e está ativa
      const {
        data: barbearia,
        error: barbeariaError
      } = await this.supabase.from(stryMutAct_9fa48("4055") ? "" : (stryCov_9fa48("4055"), 'barbearias')).select(stryMutAct_9fa48("4056") ? "" : (stryCov_9fa48("4056"), 'id, nome, ativo')).eq(stryMutAct_9fa48("4057") ? "" : (stryCov_9fa48("4057"), 'id'), barbearia_id).eq(stryMutAct_9fa48("4058") ? "" : (stryCov_9fa48("4058"), 'ativo'), stryMutAct_9fa48("4059") ? false : (stryCov_9fa48("4059"), true)).single();
      if (stryMutAct_9fa48("4062") ? barbeariaError && !barbearia : stryMutAct_9fa48("4061") ? false : stryMutAct_9fa48("4060") ? true : (stryCov_9fa48("4060", "4061", "4062"), barbeariaError || (stryMutAct_9fa48("4063") ? barbearia : (stryCov_9fa48("4063"), !barbearia)))) {
        if (stryMutAct_9fa48("4064")) {
          {}
        } else {
          stryCov_9fa48("4064");
          throw new Error(stryMutAct_9fa48("4065") ? "" : (stryCov_9fa48("4065"), 'Barbearia não encontrada ou inativa'));
        }
      }

      // Construir query base
      let query = this.supabase.from(stryMutAct_9fa48("4066") ? "" : (stryCov_9fa48("4066"), 'barbeiros_barbearias')).select(stryMutAct_9fa48("4067") ? `` : (stryCov_9fa48("4067"), `
        id,
        ativo,
        users(
          id,
          nome,
          email,
          telefone,
          foto_url
        )
      `)).eq(stryMutAct_9fa48("4068") ? "" : (stryCov_9fa48("4068"), 'barbearia_id'), barbearia_id);

      // Aplicar filtros de status
      if (stryMutAct_9fa48("4071") ? status !== 'ativo' : stryMutAct_9fa48("4070") ? false : stryMutAct_9fa48("4069") ? true : (stryCov_9fa48("4069", "4070", "4071"), status === (stryMutAct_9fa48("4072") ? "" : (stryCov_9fa48("4072"), 'ativo')))) {
        if (stryMutAct_9fa48("4073")) {
          {}
        } else {
          stryCov_9fa48("4073");
          query = query.eq(stryMutAct_9fa48("4074") ? "" : (stryCov_9fa48("4074"), 'ativo'), stryMutAct_9fa48("4075") ? false : (stryCov_9fa48("4075"), true));
        }
      } else if (stryMutAct_9fa48("4078") ? status !== 'inativo' : stryMutAct_9fa48("4077") ? false : stryMutAct_9fa48("4076") ? true : (stryCov_9fa48("4076", "4077", "4078"), status === (stryMutAct_9fa48("4079") ? "" : (stryCov_9fa48("4079"), 'inativo')))) {
        if (stryMutAct_9fa48("4080")) {
          {}
        } else {
          stryCov_9fa48("4080");
          query = query.eq(stryMutAct_9fa48("4081") ? "" : (stryCov_9fa48("4081"), 'ativo'), stryMutAct_9fa48("4082") ? true : (stryCov_9fa48("4082"), false));
        }
      } else if (stryMutAct_9fa48("4085") ? status !== 'disponivel' : stryMutAct_9fa48("4084") ? false : stryMutAct_9fa48("4083") ? true : (stryCov_9fa48("4083", "4084", "4085"), status === (stryMutAct_9fa48("4086") ? "" : (stryCov_9fa48("4086"), 'disponivel')))) {
        if (stryMutAct_9fa48("4087")) {
          {}
        } else {
          stryCov_9fa48("4087");
          // Barbeiros ativos que não estão atendendo
          query = query.eq(stryMutAct_9fa48("4088") ? "" : (stryCov_9fa48("4088"), 'ativo'), stryMutAct_9fa48("4089") ? false : (stryCov_9fa48("4089"), true));
        }
      }
      const {
        data: barbeiros,
        error: barbeirosError
      } = await query;
      if (stryMutAct_9fa48("4091") ? false : stryMutAct_9fa48("4090") ? true : (stryCov_9fa48("4090", "4091"), barbeirosError)) {
        if (stryMutAct_9fa48("4092")) {
          {}
        } else {
          stryCov_9fa48("4092");
          throw new Error(stryMutAct_9fa48("4093") ? "" : (stryCov_9fa48("4093"), 'Erro interno do servidor'));
        }
      }

      // Filtrar barbeiros disponíveis se necessário
      let barbeirosFiltrados = barbeiros;
      if (stryMutAct_9fa48("4096") ? status !== 'disponivel' : stryMutAct_9fa48("4095") ? false : stryMutAct_9fa48("4094") ? true : (stryCov_9fa48("4094", "4095", "4096"), status === (stryMutAct_9fa48("4097") ? "" : (stryCov_9fa48("4097"), 'disponivel')))) {
        if (stryMutAct_9fa48("4098")) {
          {}
        } else {
          stryCov_9fa48("4098");
          // Verificar quais barbeiros estão atendendo
          const {
            data: barbeirosAtendendo
          } = await this.supabase.from(stryMutAct_9fa48("4099") ? "" : (stryCov_9fa48("4099"), 'clientes')).select(stryMutAct_9fa48("4100") ? "" : (stryCov_9fa48("4100"), 'barbeiro_id')).eq(stryMutAct_9fa48("4101") ? "" : (stryCov_9fa48("4101"), 'barbearia_id'), barbearia_id).in(stryMutAct_9fa48("4102") ? "" : (stryCov_9fa48("4102"), 'status'), stryMutAct_9fa48("4103") ? [] : (stryCov_9fa48("4103"), [stryMutAct_9fa48("4104") ? "" : (stryCov_9fa48("4104"), 'proximo'), stryMutAct_9fa48("4105") ? "" : (stryCov_9fa48("4105"), 'atendendo')]));
          const barbeirosOcupados = stryMutAct_9fa48("4108") ? barbeirosAtendendo?.map(c => c.barbeiro_id) && [] : stryMutAct_9fa48("4107") ? false : stryMutAct_9fa48("4106") ? true : (stryCov_9fa48("4106", "4107", "4108"), (stryMutAct_9fa48("4109") ? barbeirosAtendendo.map(c => c.barbeiro_id) : (stryCov_9fa48("4109"), barbeirosAtendendo?.map(stryMutAct_9fa48("4110") ? () => undefined : (stryCov_9fa48("4110"), c => c.barbeiro_id)))) || (stryMutAct_9fa48("4111") ? ["Stryker was here"] : (stryCov_9fa48("4111"), [])));
          barbeirosFiltrados = stryMutAct_9fa48("4112") ? barbeiros : (stryCov_9fa48("4112"), barbeiros.filter(stryMutAct_9fa48("4113") ? () => undefined : (stryCov_9fa48("4113"), b => stryMutAct_9fa48("4114") ? barbeirosOcupados.includes(b.users.id) : (stryCov_9fa48("4114"), !barbeirosOcupados.includes(b.users.id)))));
        }
      }

      // Formatar resposta baseada no tipo de acesso
      const barbeirosFormatados = barbeirosFiltrados.map(barbeiro => {
        if (stryMutAct_9fa48("4115")) {
          {}
        } else {
          stryCov_9fa48("4115");
          if (stryMutAct_9fa48("4117") ? false : stryMutAct_9fa48("4116") ? true : (stryCov_9fa48("4116", "4117"), isPublic)) {
            if (stryMutAct_9fa48("4118")) {
              {}
            } else {
              stryCov_9fa48("4118");
              // Dados limitados para clientes
              return stryMutAct_9fa48("4119") ? {} : (stryCov_9fa48("4119"), {
                id: barbeiro.users.id,
                nome: barbeiro.users.nome,
                foto_url: barbeiro.users.foto_url
              });
            }
          } else {
            if (stryMutAct_9fa48("4120")) {
              {}
            } else {
              stryCov_9fa48("4120");
              // Dados completos para funcionários
              return stryMutAct_9fa48("4121") ? {} : (stryCov_9fa48("4121"), {
                id: barbeiro.users.id,
                nome: barbeiro.users.nome,
                email: barbeiro.users.email,
                telefone: barbeiro.users.telefone,
                foto_url: barbeiro.users.foto_url,
                ativo: barbeiro.ativo
              });
            }
          }
        }
      });
      return stryMutAct_9fa48("4122") ? {} : (stryCov_9fa48("4122"), {
        barbearia: stryMutAct_9fa48("4123") ? {} : (stryCov_9fa48("4123"), {
          id: barbearia.id,
          nome: barbearia.nome
        }),
        barbeiros: barbeirosFormatados,
        total: barbeirosFormatados.length
      });
    }
  }

  /**
   * Obter status do barbeiro logado
   * @param {string} userId - ID do usuário
   * @returns {Promise<Object>} Status do barbeiro
   */
  async obterStatusBarbeiro(userId) {
    if (stryMutAct_9fa48("4124")) {
      {}
    } else {
      stryCov_9fa48("4124");
      // Buscar informações do barbeiro
      const {
        data: barbeiro,
        error: barbeiroError
      } = await this.supabase.from(stryMutAct_9fa48("4125") ? "" : (stryCov_9fa48("4125"), 'barbeiros_barbearias')).select(stryMutAct_9fa48("4126") ? `` : (stryCov_9fa48("4126"), `
        id,
        ativo,
        barbearia_id,
        barbearias(id, nome)
      `)).eq(stryMutAct_9fa48("4127") ? "" : (stryCov_9fa48("4127"), 'user_id'), userId).eq(stryMutAct_9fa48("4128") ? "" : (stryCov_9fa48("4128"), 'ativo'), stryMutAct_9fa48("4129") ? false : (stryCov_9fa48("4129"), true)).single();
      if (stryMutAct_9fa48("4132") ? barbeiroError && !barbeiro : stryMutAct_9fa48("4131") ? false : stryMutAct_9fa48("4130") ? true : (stryCov_9fa48("4130", "4131", "4132"), barbeiroError || (stryMutAct_9fa48("4133") ? barbeiro : (stryCov_9fa48("4133"), !barbeiro)))) {
        if (stryMutAct_9fa48("4134")) {
          {}
        } else {
          stryCov_9fa48("4134");
          throw new Error(stryMutAct_9fa48("4135") ? "" : (stryCov_9fa48("4135"), 'Barbeiro não encontrado ou inativo'));
        }
      }

      // Verificar se está atendendo algum cliente
      const {
        data: clienteAtual
      } = await this.supabase.from(stryMutAct_9fa48("4136") ? "" : (stryCov_9fa48("4136"), 'clientes')).select(stryMutAct_9fa48("4137") ? "" : (stryCov_9fa48("4137"), 'id, nome, status')).eq(stryMutAct_9fa48("4138") ? "" : (stryCov_9fa48("4138"), 'barbeiro_id'), userId).eq(stryMutAct_9fa48("4139") ? "" : (stryCov_9fa48("4139"), 'barbearia_id'), barbeiro.barbearia_id).in(stryMutAct_9fa48("4140") ? "" : (stryCov_9fa48("4140"), 'status'), stryMutAct_9fa48("4141") ? [] : (stryCov_9fa48("4141"), [stryMutAct_9fa48("4142") ? "" : (stryCov_9fa48("4142"), 'proximo'), stryMutAct_9fa48("4143") ? "" : (stryCov_9fa48("4143"), 'atendendo')])).single();

      // Verificar próximos clientes na fila
      const {
        data: proximosClientes
      } = await this.supabase.from(stryMutAct_9fa48("4144") ? "" : (stryCov_9fa48("4144"), 'clientes')).select(stryMutAct_9fa48("4145") ? "" : (stryCov_9fa48("4145"), 'id, nome, posicao')).eq(stryMutAct_9fa48("4146") ? "" : (stryCov_9fa48("4146"), 'barbearia_id'), barbeiro.barbearia_id).eq(stryMutAct_9fa48("4147") ? "" : (stryCov_9fa48("4147"), 'status'), stryMutAct_9fa48("4148") ? "" : (stryCov_9fa48("4148"), 'aguardando')).order(stryMutAct_9fa48("4149") ? "" : (stryCov_9fa48("4149"), 'posicao'), stryMutAct_9fa48("4150") ? {} : (stryCov_9fa48("4150"), {
        ascending: stryMutAct_9fa48("4151") ? false : (stryCov_9fa48("4151"), true)
      })).limit(3);
      return stryMutAct_9fa48("4152") ? {} : (stryCov_9fa48("4152"), {
        barbeiro: stryMutAct_9fa48("4153") ? {} : (stryCov_9fa48("4153"), {
          id: userId,
          ativo: barbeiro.ativo,
          barbearia: barbeiro.barbearias
        }),
        status_atual: stryMutAct_9fa48("4154") ? {} : (stryCov_9fa48("4154"), {
          atendendo: stryMutAct_9fa48("4157") ? clienteAtual && null : stryMutAct_9fa48("4156") ? false : stryMutAct_9fa48("4155") ? true : (stryCov_9fa48("4155", "4156", "4157"), clienteAtual || null),
          proximos_na_fila: stryMutAct_9fa48("4160") ? proximosClientes && [] : stryMutAct_9fa48("4159") ? false : stryMutAct_9fa48("4158") ? true : (stryCov_9fa48("4158", "4159", "4160"), proximosClientes || (stryMutAct_9fa48("4161") ? ["Stryker was here"] : (stryCov_9fa48("4161"), [])))
        })
      });
    }
  }

  /**
   * Ativar barbeiro em uma barbearia
   * @param {Object} dados - Dados para ativação
   * @param {string} dados.user_id - ID do usuário
   * @param {number} dados.barbearia_id - ID da barbearia
   * @returns {Promise<Object>} Resultado da ativação
   */
  async ativarBarbeiro(dados) {
    if (stryMutAct_9fa48("4162")) {
      {}
    } else {
      stryCov_9fa48("4162");
      const {
        user_id,
        barbearia_id
      } = dados;

      // Verificar se o usuário existe e é um barbeiro
      const {
        data: user,
        error: userError
      } = await this.supabase.from(stryMutAct_9fa48("4163") ? "" : (stryCov_9fa48("4163"), 'users')).select(stryMutAct_9fa48("4164") ? "" : (stryCov_9fa48("4164"), 'id, nome, email, role, ativo')).eq(stryMutAct_9fa48("4165") ? "" : (stryCov_9fa48("4165"), 'id'), user_id).eq(stryMutAct_9fa48("4166") ? "" : (stryCov_9fa48("4166"), 'role'), stryMutAct_9fa48("4167") ? "" : (stryCov_9fa48("4167"), 'barbeiro')).eq(stryMutAct_9fa48("4168") ? "" : (stryCov_9fa48("4168"), 'ativo'), stryMutAct_9fa48("4169") ? false : (stryCov_9fa48("4169"), true)).single();
      if (stryMutAct_9fa48("4172") ? userError && !user : stryMutAct_9fa48("4171") ? false : stryMutAct_9fa48("4170") ? true : (stryCov_9fa48("4170", "4171", "4172"), userError || (stryMutAct_9fa48("4173") ? user : (stryCov_9fa48("4173"), !user)))) {
        if (stryMutAct_9fa48("4174")) {
          {}
        } else {
          stryCov_9fa48("4174");
          throw new Error(stryMutAct_9fa48("4175") ? "" : (stryCov_9fa48("4175"), 'Usuário não encontrado ou não é um barbeiro ativo'));
        }
      }

      // Verificar se a barbearia existe e está ativa
      const {
        data: barbearia,
        error: barbeariaError
      } = await this.supabase.from(stryMutAct_9fa48("4176") ? "" : (stryCov_9fa48("4176"), 'barbearias')).select(stryMutAct_9fa48("4177") ? "" : (stryCov_9fa48("4177"), 'id, nome, ativo')).eq(stryMutAct_9fa48("4178") ? "" : (stryCov_9fa48("4178"), 'id'), barbearia_id).eq(stryMutAct_9fa48("4179") ? "" : (stryCov_9fa48("4179"), 'ativo'), stryMutAct_9fa48("4180") ? false : (stryCov_9fa48("4180"), true)).single();
      if (stryMutAct_9fa48("4183") ? barbeariaError && !barbearia : stryMutAct_9fa48("4182") ? false : stryMutAct_9fa48("4181") ? true : (stryCov_9fa48("4181", "4182", "4183"), barbeariaError || (stryMutAct_9fa48("4184") ? barbearia : (stryCov_9fa48("4184"), !barbearia)))) {
        if (stryMutAct_9fa48("4185")) {
          {}
        } else {
          stryCov_9fa48("4185");
          throw new Error(stryMutAct_9fa48("4186") ? "" : (stryCov_9fa48("4186"), 'Barbearia não encontrada ou inativa'));
        }
      }

      // Verificar se já existe uma relação entre o barbeiro e a barbearia
      const {
        data: relacaoExistente,
        error: relacaoError
      } = await this.supabase.from(stryMutAct_9fa48("4187") ? "" : (stryCov_9fa48("4187"), 'barbeiros_barbearias')).select(stryMutAct_9fa48("4188") ? "" : (stryCov_9fa48("4188"), 'id, ativo')).eq(stryMutAct_9fa48("4189") ? "" : (stryCov_9fa48("4189"), 'user_id'), user_id).eq(stryMutAct_9fa48("4190") ? "" : (stryCov_9fa48("4190"), 'barbearia_id'), barbearia_id).single();
      if (stryMutAct_9fa48("4193") ? relacaoError || relacaoError.code !== 'PGRST116' : stryMutAct_9fa48("4192") ? false : stryMutAct_9fa48("4191") ? true : (stryCov_9fa48("4191", "4192", "4193"), relacaoError && (stryMutAct_9fa48("4195") ? relacaoError.code === 'PGRST116' : stryMutAct_9fa48("4194") ? true : (stryCov_9fa48("4194", "4195"), relacaoError.code !== (stryMutAct_9fa48("4196") ? "" : (stryCov_9fa48("4196"), 'PGRST116')))))) {
        if (stryMutAct_9fa48("4197")) {
          {}
        } else {
          stryCov_9fa48("4197");
          throw new Error(stryMutAct_9fa48("4198") ? "" : (stryCov_9fa48("4198"), 'Erro interno do servidor'));
        }
      }
      if (stryMutAct_9fa48("4200") ? false : stryMutAct_9fa48("4199") ? true : (stryCov_9fa48("4199", "4200"), relacaoExistente)) {
        if (stryMutAct_9fa48("4201")) {
          {}
        } else {
          stryCov_9fa48("4201");
          if (stryMutAct_9fa48("4203") ? false : stryMutAct_9fa48("4202") ? true : (stryCov_9fa48("4202", "4203"), relacaoExistente.ativo)) {
            if (stryMutAct_9fa48("4204")) {
              {}
            } else {
              stryCov_9fa48("4204");
              throw new Error(stryMutAct_9fa48("4205") ? "" : (stryCov_9fa48("4205"), 'Barbeiro já está ativo nesta barbearia'));
            }
          } else {
            if (stryMutAct_9fa48("4206")) {
              {}
            } else {
              stryCov_9fa48("4206");
              // Reativar barbeiro
              const {
                error: updateError
              } = await this.supabase.from(stryMutAct_9fa48("4207") ? "" : (stryCov_9fa48("4207"), 'barbeiros_barbearias')).update(stryMutAct_9fa48("4208") ? {} : (stryCov_9fa48("4208"), {
                ativo: stryMutAct_9fa48("4209") ? false : (stryCov_9fa48("4209"), true),
                updated_at: new Date().toISOString()
              })).eq(stryMutAct_9fa48("4210") ? "" : (stryCov_9fa48("4210"), 'id'), relacaoExistente.id);
              if (stryMutAct_9fa48("4212") ? false : stryMutAct_9fa48("4211") ? true : (stryCov_9fa48("4211", "4212"), updateError)) {
                if (stryMutAct_9fa48("4213")) {
                  {}
                } else {
                  stryCov_9fa48("4213");
                  throw new Error(stryMutAct_9fa48("4214") ? "" : (stryCov_9fa48("4214"), 'Erro interno do servidor'));
                }
              }
              return stryMutAct_9fa48("4215") ? {} : (stryCov_9fa48("4215"), {
                barbeiro: stryMutAct_9fa48("4216") ? {} : (stryCov_9fa48("4216"), {
                  id: user.id,
                  nome: user.nome,
                  email: user.email
                }),
                barbearia: stryMutAct_9fa48("4217") ? {} : (stryCov_9fa48("4217"), {
                  id: barbearia.id,
                  nome: barbearia.nome
                }),
                acao: stryMutAct_9fa48("4218") ? "" : (stryCov_9fa48("4218"), 'reativado')
              });
            }
          }
        }
      } else {
        if (stryMutAct_9fa48("4219")) {
          {}
        } else {
          stryCov_9fa48("4219");
          // Criar nova relação
          const {
            data: novaRelacao,
            error: insertError
          } = await this.supabase.from(stryMutAct_9fa48("4220") ? "" : (stryCov_9fa48("4220"), 'barbeiros_barbearias')).insert(stryMutAct_9fa48("4221") ? {} : (stryCov_9fa48("4221"), {
            user_id: user_id,
            barbearia_id: barbearia_id,
            ativo: stryMutAct_9fa48("4222") ? false : (stryCov_9fa48("4222"), true),
            created_at: new Date().toISOString()
          })).select().single();
          if (stryMutAct_9fa48("4224") ? false : stryMutAct_9fa48("4223") ? true : (stryCov_9fa48("4223", "4224"), insertError)) {
            if (stryMutAct_9fa48("4225")) {
              {}
            } else {
              stryCov_9fa48("4225");
              throw new Error(stryMutAct_9fa48("4226") ? "" : (stryCov_9fa48("4226"), 'Erro interno do servidor'));
            }
          }
          return stryMutAct_9fa48("4227") ? {} : (stryCov_9fa48("4227"), {
            barbeiro: stryMutAct_9fa48("4228") ? {} : (stryCov_9fa48("4228"), {
              id: user.id,
              nome: user.nome,
              email: user.email
            }),
            barbearia: stryMutAct_9fa48("4229") ? {} : (stryCov_9fa48("4229"), {
              id: barbearia.id,
              nome: barbearia.nome
            }),
            acao: stryMutAct_9fa48("4230") ? "" : (stryCov_9fa48("4230"), 'ativado')
          });
        }
      }
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
    if (stryMutAct_9fa48("4231")) {
      {}
    } else {
      stryCov_9fa48("4231");
      const {
        user_id,
        barbearia_id
      } = dados;

      // Verificar se existe a relação entre barbeiro e barbearia
      const {
        data: relacao,
        error: relacaoError
      } = await this.supabase.from(stryMutAct_9fa48("4232") ? "" : (stryCov_9fa48("4232"), 'barbeiros_barbearias')).select(stryMutAct_9fa48("4233") ? `` : (stryCov_9fa48("4233"), `
        id,
        ativo,
        users(id, nome, email),
        barbearias(id, nome)
      `)).eq(stryMutAct_9fa48("4234") ? "" : (stryCov_9fa48("4234"), 'user_id'), user_id).eq(stryMutAct_9fa48("4235") ? "" : (stryCov_9fa48("4235"), 'barbearia_id'), barbearia_id).single();
      if (stryMutAct_9fa48("4238") ? relacaoError && !relacao : stryMutAct_9fa48("4237") ? false : stryMutAct_9fa48("4236") ? true : (stryCov_9fa48("4236", "4237", "4238"), relacaoError || (stryMutAct_9fa48("4239") ? relacao : (stryCov_9fa48("4239"), !relacao)))) {
        if (stryMutAct_9fa48("4240")) {
          {}
        } else {
          stryCov_9fa48("4240");
          throw new Error(stryMutAct_9fa48("4241") ? "" : (stryCov_9fa48("4241"), 'Relação barbeiro-barbearia não encontrada'));
        }
      }
      if (stryMutAct_9fa48("4244") ? false : stryMutAct_9fa48("4243") ? true : stryMutAct_9fa48("4242") ? relacao.ativo : (stryCov_9fa48("4242", "4243", "4244"), !relacao.ativo)) {
        if (stryMutAct_9fa48("4245")) {
          {}
        } else {
          stryCov_9fa48("4245");
          throw new Error(stryMutAct_9fa48("4246") ? "" : (stryCov_9fa48("4246"), 'Barbeiro já está inativo nesta barbearia'));
        }
      }

      // Verificar se o barbeiro está atendendo algum cliente
      const {
        data: clienteAtendendo
      } = await this.supabase.from(stryMutAct_9fa48("4247") ? "" : (stryCov_9fa48("4247"), 'clientes')).select(stryMutAct_9fa48("4248") ? "" : (stryCov_9fa48("4248"), 'id, nome')).eq(stryMutAct_9fa48("4249") ? "" : (stryCov_9fa48("4249"), 'barbeiro_id'), user_id).eq(stryMutAct_9fa48("4250") ? "" : (stryCov_9fa48("4250"), 'barbearia_id'), barbearia_id).in(stryMutAct_9fa48("4251") ? "" : (stryCov_9fa48("4251"), 'status'), stryMutAct_9fa48("4252") ? [] : (stryCov_9fa48("4252"), [stryMutAct_9fa48("4253") ? "" : (stryCov_9fa48("4253"), 'proximo'), stryMutAct_9fa48("4254") ? "" : (stryCov_9fa48("4254"), 'atendendo')])).single();
      if (stryMutAct_9fa48("4256") ? false : stryMutAct_9fa48("4255") ? true : (stryCov_9fa48("4255", "4256"), clienteAtendendo)) {
        if (stryMutAct_9fa48("4257")) {
          {}
        } else {
          stryCov_9fa48("4257");
          throw new Error(stryMutAct_9fa48("4258") ? "" : (stryCov_9fa48("4258"), 'Não é possível desativar barbeiro que está atendendo um cliente'));
        }
      }

      // Desativar barbeiro
      const {
        error: updateError
      } = await this.supabase.from(stryMutAct_9fa48("4259") ? "" : (stryCov_9fa48("4259"), 'barbeiros_barbearias')).update(stryMutAct_9fa48("4260") ? {} : (stryCov_9fa48("4260"), {
        ativo: stryMutAct_9fa48("4261") ? true : (stryCov_9fa48("4261"), false),
        updated_at: new Date().toISOString()
      })).eq(stryMutAct_9fa48("4262") ? "" : (stryCov_9fa48("4262"), 'id'), relacao.id);
      if (stryMutAct_9fa48("4264") ? false : stryMutAct_9fa48("4263") ? true : (stryCov_9fa48("4263", "4264"), updateError)) {
        if (stryMutAct_9fa48("4265")) {
          {}
        } else {
          stryCov_9fa48("4265");
          throw new Error(stryMutAct_9fa48("4266") ? "" : (stryCov_9fa48("4266"), 'Erro interno do servidor'));
        }
      }
      return stryMutAct_9fa48("4267") ? {} : (stryCov_9fa48("4267"), {
        barbeiro: stryMutAct_9fa48("4268") ? {} : (stryCov_9fa48("4268"), {
          id: relacao.users.id,
          nome: relacao.users.nome,
          email: relacao.users.email
        }),
        barbearia: stryMutAct_9fa48("4269") ? {} : (stryCov_9fa48("4269"), {
          id: relacao.barbearias.id,
          nome: relacao.barbearias.nome
        })
      });
    }
  }

  /**
   * Listar todos os usuários (ADMIN)
   * @returns {Promise<Object>} Lista de usuários
   */
  async listarUsuarios() {
    if (stryMutAct_9fa48("4270")) {
      {}
    } else {
      stryCov_9fa48("4270");
      const {
        data: users,
        error: usersError
      } = await this.supabase.from(stryMutAct_9fa48("4271") ? "" : (stryCov_9fa48("4271"), 'users')).select(stryMutAct_9fa48("4272") ? "" : (stryCov_9fa48("4272"), 'id, nome, email, role, ativo, created_at')).order(stryMutAct_9fa48("4273") ? "" : (stryCov_9fa48("4273"), 'created_at'), stryMutAct_9fa48("4274") ? {} : (stryCov_9fa48("4274"), {
        ascending: stryMutAct_9fa48("4275") ? true : (stryCov_9fa48("4275"), false)
      }));
      if (stryMutAct_9fa48("4277") ? false : stryMutAct_9fa48("4276") ? true : (stryCov_9fa48("4276", "4277"), usersError)) {
        if (stryMutAct_9fa48("4278")) {
          {}
        } else {
          stryCov_9fa48("4278");
          throw new Error(stryMutAct_9fa48("4279") ? "" : (stryCov_9fa48("4279"), 'Erro interno do servidor'));
        }
      }
      return stryMutAct_9fa48("4280") ? {} : (stryCov_9fa48("4280"), {
        users: users.map(stryMutAct_9fa48("4281") ? () => undefined : (stryCov_9fa48("4281"), user => stryMutAct_9fa48("4282") ? {} : (stryCov_9fa48("4282"), {
          id: user.id,
          nome: user.nome,
          email: user.email,
          role: user.role,
          ativo: user.ativo,
          created_at: user.created_at
        }))),
        total: users.length
      });
    }
  }

  /**
   * Atualizar usuário (ADMIN)
   * @param {string} id - ID do usuário
   * @param {Object} dados - Dados para atualização
   * @returns {Promise<Object>} Usuário atualizado
   */
  async atualizarUsuario(id, dados) {
    if (stryMutAct_9fa48("4283")) {
      {}
    } else {
      stryCov_9fa48("4283");
      const {
        nome,
        email,
        role,
        ativo
      } = dados;

      // Verificar se o usuário existe
      const {
        data: userExistente,
        error: userError
      } = await this.supabase.from(stryMutAct_9fa48("4284") ? "" : (stryCov_9fa48("4284"), 'users')).select(stryMutAct_9fa48("4285") ? "" : (stryCov_9fa48("4285"), 'id, nome, email, role')).eq(stryMutAct_9fa48("4286") ? "" : (stryCov_9fa48("4286"), 'id'), id).single();
      if (stryMutAct_9fa48("4289") ? userError && !userExistente : stryMutAct_9fa48("4288") ? false : stryMutAct_9fa48("4287") ? true : (stryCov_9fa48("4287", "4288", "4289"), userError || (stryMutAct_9fa48("4290") ? userExistente : (stryCov_9fa48("4290"), !userExistente)))) {
        if (stryMutAct_9fa48("4291")) {
          {}
        } else {
          stryCov_9fa48("4291");
          throw new Error(stryMutAct_9fa48("4292") ? "" : (stryCov_9fa48("4292"), 'Usuário não encontrado'));
        }
      }

      // Preparar dados para atualização
      const dadosAtualizacao = {};
      if (stryMutAct_9fa48("4295") ? nome === undefined : stryMutAct_9fa48("4294") ? false : stryMutAct_9fa48("4293") ? true : (stryCov_9fa48("4293", "4294", "4295"), nome !== undefined)) dadosAtualizacao.nome = nome;
      if (stryMutAct_9fa48("4298") ? email === undefined : stryMutAct_9fa48("4297") ? false : stryMutAct_9fa48("4296") ? true : (stryCov_9fa48("4296", "4297", "4298"), email !== undefined)) dadosAtualizacao.email = email;
      if (stryMutAct_9fa48("4301") ? role === undefined : stryMutAct_9fa48("4300") ? false : stryMutAct_9fa48("4299") ? true : (stryCov_9fa48("4299", "4300", "4301"), role !== undefined)) dadosAtualizacao.role = role;
      if (stryMutAct_9fa48("4304") ? ativo === undefined : stryMutAct_9fa48("4303") ? false : stryMutAct_9fa48("4302") ? true : (stryCov_9fa48("4302", "4303", "4304"), ativo !== undefined)) dadosAtualizacao.ativo = ativo;
      dadosAtualizacao.updated_at = new Date().toISOString();

      // Atualizar usuário
      const {
        data: userAtualizado,
        error: updateError
      } = await this.supabase.from(stryMutAct_9fa48("4305") ? "" : (stryCov_9fa48("4305"), 'users')).update(dadosAtualizacao).eq(stryMutAct_9fa48("4306") ? "" : (stryCov_9fa48("4306"), 'id'), id).select(stryMutAct_9fa48("4307") ? "" : (stryCov_9fa48("4307"), 'id, nome, email, role, ativo, updated_at')).single();
      if (stryMutAct_9fa48("4309") ? false : stryMutAct_9fa48("4308") ? true : (stryCov_9fa48("4308", "4309"), updateError)) {
        if (stryMutAct_9fa48("4310")) {
          {}
        } else {
          stryCov_9fa48("4310");
          throw new Error(stryMutAct_9fa48("4311") ? "" : (stryCov_9fa48("4311"), 'Erro interno do servidor'));
        }
      }
      return stryMutAct_9fa48("4312") ? {} : (stryCov_9fa48("4312"), {
        id: userAtualizado.id,
        nome: userAtualizado.nome,
        email: userAtualizado.email,
        role: userAtualizado.role,
        ativo: userAtualizado.ativo,
        updated_at: userAtualizado.updated_at
      });
    }
  }

  /**
   * Deletar usuário (ADMIN)
   * @param {string} id - ID do usuário
   * @param {string} adminId - ID do admin que está deletando
   * @returns {Promise<Object>} Usuário deletado
   */
  async deletarUsuario(id, adminId) {
    if (stryMutAct_9fa48("4313")) {
      {}
    } else {
      stryCov_9fa48("4313");
      // Verificar se o usuário existe
      const {
        data: userExistente,
        error: userError
      } = await this.supabase.from(stryMutAct_9fa48("4314") ? "" : (stryCov_9fa48("4314"), 'users')).select(stryMutAct_9fa48("4315") ? "" : (stryCov_9fa48("4315"), 'id, nome, email, role')).eq(stryMutAct_9fa48("4316") ? "" : (stryCov_9fa48("4316"), 'id'), id).single();
      if (stryMutAct_9fa48("4319") ? userError && !userExistente : stryMutAct_9fa48("4318") ? false : stryMutAct_9fa48("4317") ? true : (stryCov_9fa48("4317", "4318", "4319"), userError || (stryMutAct_9fa48("4320") ? userExistente : (stryCov_9fa48("4320"), !userExistente)))) {
        if (stryMutAct_9fa48("4321")) {
          {}
        } else {
          stryCov_9fa48("4321");
          throw new Error(stryMutAct_9fa48("4322") ? "" : (stryCov_9fa48("4322"), 'Usuário não encontrado'));
        }
      }

      // Verificar se o usuário está sendo deletado não é o próprio admin
      if (stryMutAct_9fa48("4325") ? adminId !== id : stryMutAct_9fa48("4324") ? false : stryMutAct_9fa48("4323") ? true : (stryCov_9fa48("4323", "4324", "4325"), adminId === id)) {
        if (stryMutAct_9fa48("4326")) {
          {}
        } else {
          stryCov_9fa48("4326");
          throw new Error(stryMutAct_9fa48("4327") ? "" : (stryCov_9fa48("4327"), 'Não é possível deletar o próprio usuário'));
        }
      }

      // Verificar se o usuário tem relações ativas (barbeiro em barbearias)
      if (stryMutAct_9fa48("4330") ? userExistente.role !== 'barbeiro' : stryMutAct_9fa48("4329") ? false : stryMutAct_9fa48("4328") ? true : (stryCov_9fa48("4328", "4329", "4330"), userExistente.role === (stryMutAct_9fa48("4331") ? "" : (stryCov_9fa48("4331"), 'barbeiro')))) {
        if (stryMutAct_9fa48("4332")) {
          {}
        } else {
          stryCov_9fa48("4332");
          const {
            data: relacoesAtivas
          } = await this.supabase.from(stryMutAct_9fa48("4333") ? "" : (stryCov_9fa48("4333"), 'barbeiros_barbearias')).select(stryMutAct_9fa48("4334") ? "" : (stryCov_9fa48("4334"), 'id')).eq(stryMutAct_9fa48("4335") ? "" : (stryCov_9fa48("4335"), 'user_id'), id).eq(stryMutAct_9fa48("4336") ? "" : (stryCov_9fa48("4336"), 'ativo'), stryMutAct_9fa48("4337") ? false : (stryCov_9fa48("4337"), true));
          if (stryMutAct_9fa48("4340") ? relacoesAtivas || relacoesAtivas.length > 0 : stryMutAct_9fa48("4339") ? false : stryMutAct_9fa48("4338") ? true : (stryCov_9fa48("4338", "4339", "4340"), relacoesAtivas && (stryMutAct_9fa48("4343") ? relacoesAtivas.length <= 0 : stryMutAct_9fa48("4342") ? relacoesAtivas.length >= 0 : stryMutAct_9fa48("4341") ? true : (stryCov_9fa48("4341", "4342", "4343"), relacoesAtivas.length > 0)))) {
            if (stryMutAct_9fa48("4344")) {
              {}
            } else {
              stryCov_9fa48("4344");
              throw new Error(stryMutAct_9fa48("4345") ? "" : (stryCov_9fa48("4345"), 'Não é possível deletar barbeiro com relações ativas em barbearias'));
            }
          }
        }
      }

      // Deletar usuário
      const {
        error: deleteError
      } = await this.supabase.from(stryMutAct_9fa48("4346") ? "" : (stryCov_9fa48("4346"), 'users')).delete().eq(stryMutAct_9fa48("4347") ? "" : (stryCov_9fa48("4347"), 'id'), id);
      if (stryMutAct_9fa48("4349") ? false : stryMutAct_9fa48("4348") ? true : (stryCov_9fa48("4348", "4349"), deleteError)) {
        if (stryMutAct_9fa48("4350")) {
          {}
        } else {
          stryCov_9fa48("4350");
          throw new Error(stryMutAct_9fa48("4351") ? "" : (stryCov_9fa48("4351"), 'Erro interno do servidor'));
        }
      }
      return stryMutAct_9fa48("4352") ? {} : (stryCov_9fa48("4352"), {
        id: userExistente.id,
        nome: userExistente.nome,
        email: userExistente.email,
        role: userExistente.role
      });
    }
  }
}
module.exports = UserService;