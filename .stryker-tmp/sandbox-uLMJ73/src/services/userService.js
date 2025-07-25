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
    if (stryMutAct_9fa48("733")) {
      {}
    } else {
      stryCov_9fa48("733");
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
    if (stryMutAct_9fa48("734")) {
      {}
    } else {
      stryCov_9fa48("734");
      const {
        barbearia_id,
        status = stryMutAct_9fa48("735") ? "" : (stryCov_9fa48("735"), 'ativo'),
        isPublic = stryMutAct_9fa48("736") ? true : (stryCov_9fa48("736"), false)
      } = filtros;

      // Verificar se a barbearia existe e está ativa
      const {
        data: barbearia,
        error: barbeariaError
      } = await this.supabase.from(stryMutAct_9fa48("737") ? "" : (stryCov_9fa48("737"), 'barbearias')).select(stryMutAct_9fa48("738") ? "" : (stryCov_9fa48("738"), 'id, nome, ativo')).eq(stryMutAct_9fa48("739") ? "" : (stryCov_9fa48("739"), 'id'), barbearia_id).eq(stryMutAct_9fa48("740") ? "" : (stryCov_9fa48("740"), 'ativo'), stryMutAct_9fa48("741") ? false : (stryCov_9fa48("741"), true)).single();
      if (stryMutAct_9fa48("744") ? barbeariaError && !barbearia : stryMutAct_9fa48("743") ? false : stryMutAct_9fa48("742") ? true : (stryCov_9fa48("742", "743", "744"), barbeariaError || (stryMutAct_9fa48("745") ? barbearia : (stryCov_9fa48("745"), !barbearia)))) {
        if (stryMutAct_9fa48("746")) {
          {}
        } else {
          stryCov_9fa48("746");
          throw new Error(stryMutAct_9fa48("747") ? "" : (stryCov_9fa48("747"), 'Barbearia não encontrada ou inativa'));
        }
      }

      // Construir query base
      let query = this.supabase.from(stryMutAct_9fa48("748") ? "" : (stryCov_9fa48("748"), 'barbeiros_barbearias')).select(stryMutAct_9fa48("749") ? `` : (stryCov_9fa48("749"), `
        id,
        ativo,
        users(
          id,
          nome,
          email,
          telefone,
          foto_url
        )
      `)).eq(stryMutAct_9fa48("750") ? "" : (stryCov_9fa48("750"), 'barbearia_id'), barbearia_id);

      // Aplicar filtros de status
      if (stryMutAct_9fa48("753") ? status !== 'ativo' : stryMutAct_9fa48("752") ? false : stryMutAct_9fa48("751") ? true : (stryCov_9fa48("751", "752", "753"), status === (stryMutAct_9fa48("754") ? "" : (stryCov_9fa48("754"), 'ativo')))) {
        if (stryMutAct_9fa48("755")) {
          {}
        } else {
          stryCov_9fa48("755");
          query = query.eq(stryMutAct_9fa48("756") ? "" : (stryCov_9fa48("756"), 'ativo'), stryMutAct_9fa48("757") ? false : (stryCov_9fa48("757"), true));
        }
      } else if (stryMutAct_9fa48("760") ? status !== 'inativo' : stryMutAct_9fa48("759") ? false : stryMutAct_9fa48("758") ? true : (stryCov_9fa48("758", "759", "760"), status === (stryMutAct_9fa48("761") ? "" : (stryCov_9fa48("761"), 'inativo')))) {
        if (stryMutAct_9fa48("762")) {
          {}
        } else {
          stryCov_9fa48("762");
          query = query.eq(stryMutAct_9fa48("763") ? "" : (stryCov_9fa48("763"), 'ativo'), stryMutAct_9fa48("764") ? true : (stryCov_9fa48("764"), false));
        }
      } else if (stryMutAct_9fa48("767") ? status !== 'disponivel' : stryMutAct_9fa48("766") ? false : stryMutAct_9fa48("765") ? true : (stryCov_9fa48("765", "766", "767"), status === (stryMutAct_9fa48("768") ? "" : (stryCov_9fa48("768"), 'disponivel')))) {
        if (stryMutAct_9fa48("769")) {
          {}
        } else {
          stryCov_9fa48("769");
          // Barbeiros ativos que não estão atendendo
          query = query.eq(stryMutAct_9fa48("770") ? "" : (stryCov_9fa48("770"), 'ativo'), stryMutAct_9fa48("771") ? false : (stryCov_9fa48("771"), true));
        }
      }
      const {
        data: barbeiros,
        error: barbeirosError
      } = await query;
      if (stryMutAct_9fa48("773") ? false : stryMutAct_9fa48("772") ? true : (stryCov_9fa48("772", "773"), barbeirosError)) {
        if (stryMutAct_9fa48("774")) {
          {}
        } else {
          stryCov_9fa48("774");
          throw new Error(stryMutAct_9fa48("775") ? "" : (stryCov_9fa48("775"), 'Erro interno do servidor'));
        }
      }

      // Filtrar barbeiros disponíveis se necessário
      let barbeirosFiltrados = barbeiros;
      if (stryMutAct_9fa48("778") ? status !== 'disponivel' : stryMutAct_9fa48("777") ? false : stryMutAct_9fa48("776") ? true : (stryCov_9fa48("776", "777", "778"), status === (stryMutAct_9fa48("779") ? "" : (stryCov_9fa48("779"), 'disponivel')))) {
        if (stryMutAct_9fa48("780")) {
          {}
        } else {
          stryCov_9fa48("780");
          // Verificar quais barbeiros estão atendendo
          const {
            data: barbeirosAtendendo
          } = await this.supabase.from(stryMutAct_9fa48("781") ? "" : (stryCov_9fa48("781"), 'clientes')).select(stryMutAct_9fa48("782") ? "" : (stryCov_9fa48("782"), 'barbeiro_id')).eq(stryMutAct_9fa48("783") ? "" : (stryCov_9fa48("783"), 'barbearia_id'), barbearia_id).in(stryMutAct_9fa48("784") ? "" : (stryCov_9fa48("784"), 'status'), stryMutAct_9fa48("785") ? [] : (stryCov_9fa48("785"), [stryMutAct_9fa48("786") ? "" : (stryCov_9fa48("786"), 'proximo'), stryMutAct_9fa48("787") ? "" : (stryCov_9fa48("787"), 'atendendo')]));
          const barbeirosOcupados = stryMutAct_9fa48("790") ? barbeirosAtendendo?.map(c => c.barbeiro_id) && [] : stryMutAct_9fa48("789") ? false : stryMutAct_9fa48("788") ? true : (stryCov_9fa48("788", "789", "790"), (stryMutAct_9fa48("791") ? barbeirosAtendendo.map(c => c.barbeiro_id) : (stryCov_9fa48("791"), barbeirosAtendendo?.map(stryMutAct_9fa48("792") ? () => undefined : (stryCov_9fa48("792"), c => c.barbeiro_id)))) || (stryMutAct_9fa48("793") ? ["Stryker was here"] : (stryCov_9fa48("793"), [])));
          barbeirosFiltrados = stryMutAct_9fa48("794") ? barbeiros : (stryCov_9fa48("794"), barbeiros.filter(stryMutAct_9fa48("795") ? () => undefined : (stryCov_9fa48("795"), b => stryMutAct_9fa48("796") ? barbeirosOcupados.includes(b.users.id) : (stryCov_9fa48("796"), !barbeirosOcupados.includes(b.users.id)))));
        }
      }

      // Formatar resposta baseada no tipo de acesso
      const barbeirosFormatados = barbeirosFiltrados.map(barbeiro => {
        if (stryMutAct_9fa48("797")) {
          {}
        } else {
          stryCov_9fa48("797");
          if (stryMutAct_9fa48("799") ? false : stryMutAct_9fa48("798") ? true : (stryCov_9fa48("798", "799"), isPublic)) {
            if (stryMutAct_9fa48("800")) {
              {}
            } else {
              stryCov_9fa48("800");
              // Dados limitados para clientes
              return stryMutAct_9fa48("801") ? {} : (stryCov_9fa48("801"), {
                id: barbeiro.users.id,
                nome: barbeiro.users.nome,
                foto_url: barbeiro.users.foto_url
              });
            }
          } else {
            if (stryMutAct_9fa48("802")) {
              {}
            } else {
              stryCov_9fa48("802");
              // Dados completos para funcionários
              return stryMutAct_9fa48("803") ? {} : (stryCov_9fa48("803"), {
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
      return stryMutAct_9fa48("804") ? {} : (stryCov_9fa48("804"), {
        barbearia: stryMutAct_9fa48("805") ? {} : (stryCov_9fa48("805"), {
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
    if (stryMutAct_9fa48("806")) {
      {}
    } else {
      stryCov_9fa48("806");
      // Buscar informações do barbeiro
      const {
        data: barbeiro,
        error: barbeiroError
      } = await this.supabase.from(stryMutAct_9fa48("807") ? "" : (stryCov_9fa48("807"), 'barbeiros_barbearias')).select(stryMutAct_9fa48("808") ? `` : (stryCov_9fa48("808"), `
        id,
        ativo,
        barbearia_id,
        barbearias(id, nome)
      `)).eq(stryMutAct_9fa48("809") ? "" : (stryCov_9fa48("809"), 'user_id'), userId).eq(stryMutAct_9fa48("810") ? "" : (stryCov_9fa48("810"), 'ativo'), stryMutAct_9fa48("811") ? false : (stryCov_9fa48("811"), true)).single();
      if (stryMutAct_9fa48("814") ? barbeiroError && !barbeiro : stryMutAct_9fa48("813") ? false : stryMutAct_9fa48("812") ? true : (stryCov_9fa48("812", "813", "814"), barbeiroError || (stryMutAct_9fa48("815") ? barbeiro : (stryCov_9fa48("815"), !barbeiro)))) {
        if (stryMutAct_9fa48("816")) {
          {}
        } else {
          stryCov_9fa48("816");
          throw new Error(stryMutAct_9fa48("817") ? "" : (stryCov_9fa48("817"), 'Barbeiro não encontrado ou inativo'));
        }
      }

      // Verificar se está atendendo algum cliente
      const {
        data: clienteAtual
      } = await this.supabase.from(stryMutAct_9fa48("818") ? "" : (stryCov_9fa48("818"), 'clientes')).select(stryMutAct_9fa48("819") ? "" : (stryCov_9fa48("819"), 'id, nome, status')).eq(stryMutAct_9fa48("820") ? "" : (stryCov_9fa48("820"), 'barbeiro_id'), userId).eq(stryMutAct_9fa48("821") ? "" : (stryCov_9fa48("821"), 'barbearia_id'), barbeiro.barbearia_id).in(stryMutAct_9fa48("822") ? "" : (stryCov_9fa48("822"), 'status'), stryMutAct_9fa48("823") ? [] : (stryCov_9fa48("823"), [stryMutAct_9fa48("824") ? "" : (stryCov_9fa48("824"), 'proximo'), stryMutAct_9fa48("825") ? "" : (stryCov_9fa48("825"), 'atendendo')])).single();

      // Verificar próximos clientes na fila
      const {
        data: proximosClientes
      } = await this.supabase.from(stryMutAct_9fa48("826") ? "" : (stryCov_9fa48("826"), 'clientes')).select(stryMutAct_9fa48("827") ? "" : (stryCov_9fa48("827"), 'id, nome, posicao')).eq(stryMutAct_9fa48("828") ? "" : (stryCov_9fa48("828"), 'barbearia_id'), barbeiro.barbearia_id).eq(stryMutAct_9fa48("829") ? "" : (stryCov_9fa48("829"), 'status'), stryMutAct_9fa48("830") ? "" : (stryCov_9fa48("830"), 'aguardando')).order(stryMutAct_9fa48("831") ? "" : (stryCov_9fa48("831"), 'posicao'), stryMutAct_9fa48("832") ? {} : (stryCov_9fa48("832"), {
        ascending: stryMutAct_9fa48("833") ? false : (stryCov_9fa48("833"), true)
      })).limit(3);
      return stryMutAct_9fa48("834") ? {} : (stryCov_9fa48("834"), {
        barbeiro: stryMutAct_9fa48("835") ? {} : (stryCov_9fa48("835"), {
          id: userId,
          ativo: barbeiro.ativo,
          barbearia: barbeiro.barbearias
        }),
        status_atual: stryMutAct_9fa48("836") ? {} : (stryCov_9fa48("836"), {
          atendendo: stryMutAct_9fa48("839") ? clienteAtual && null : stryMutAct_9fa48("838") ? false : stryMutAct_9fa48("837") ? true : (stryCov_9fa48("837", "838", "839"), clienteAtual || null),
          proximos_na_fila: stryMutAct_9fa48("842") ? proximosClientes && [] : stryMutAct_9fa48("841") ? false : stryMutAct_9fa48("840") ? true : (stryCov_9fa48("840", "841", "842"), proximosClientes || (stryMutAct_9fa48("843") ? ["Stryker was here"] : (stryCov_9fa48("843"), [])))
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
    if (stryMutAct_9fa48("844")) {
      {}
    } else {
      stryCov_9fa48("844");
      const {
        user_id,
        barbearia_id
      } = dados;

      // Verificar se o usuário existe e é um barbeiro
      const {
        data: user,
        error: userError
      } = await this.supabase.from(stryMutAct_9fa48("845") ? "" : (stryCov_9fa48("845"), 'users')).select(stryMutAct_9fa48("846") ? "" : (stryCov_9fa48("846"), 'id, nome, email, role, ativo')).eq(stryMutAct_9fa48("847") ? "" : (stryCov_9fa48("847"), 'id'), user_id).eq(stryMutAct_9fa48("848") ? "" : (stryCov_9fa48("848"), 'role'), stryMutAct_9fa48("849") ? "" : (stryCov_9fa48("849"), 'barbeiro')).eq(stryMutAct_9fa48("850") ? "" : (stryCov_9fa48("850"), 'ativo'), stryMutAct_9fa48("851") ? false : (stryCov_9fa48("851"), true)).single();
      if (stryMutAct_9fa48("854") ? userError && !user : stryMutAct_9fa48("853") ? false : stryMutAct_9fa48("852") ? true : (stryCov_9fa48("852", "853", "854"), userError || (stryMutAct_9fa48("855") ? user : (stryCov_9fa48("855"), !user)))) {
        if (stryMutAct_9fa48("856")) {
          {}
        } else {
          stryCov_9fa48("856");
          throw new Error(stryMutAct_9fa48("857") ? "" : (stryCov_9fa48("857"), 'Usuário não encontrado ou não é um barbeiro ativo'));
        }
      }

      // Verificar se a barbearia existe e está ativa
      const {
        data: barbearia,
        error: barbeariaError
      } = await this.supabase.from(stryMutAct_9fa48("858") ? "" : (stryCov_9fa48("858"), 'barbearias')).select(stryMutAct_9fa48("859") ? "" : (stryCov_9fa48("859"), 'id, nome, ativo')).eq(stryMutAct_9fa48("860") ? "" : (stryCov_9fa48("860"), 'id'), barbearia_id).eq(stryMutAct_9fa48("861") ? "" : (stryCov_9fa48("861"), 'ativo'), stryMutAct_9fa48("862") ? false : (stryCov_9fa48("862"), true)).single();
      if (stryMutAct_9fa48("865") ? barbeariaError && !barbearia : stryMutAct_9fa48("864") ? false : stryMutAct_9fa48("863") ? true : (stryCov_9fa48("863", "864", "865"), barbeariaError || (stryMutAct_9fa48("866") ? barbearia : (stryCov_9fa48("866"), !barbearia)))) {
        if (stryMutAct_9fa48("867")) {
          {}
        } else {
          stryCov_9fa48("867");
          throw new Error(stryMutAct_9fa48("868") ? "" : (stryCov_9fa48("868"), 'Barbearia não encontrada ou inativa'));
        }
      }

      // Verificar se já existe uma relação entre o barbeiro e a barbearia
      const {
        data: relacaoExistente,
        error: relacaoError
      } = await this.supabase.from(stryMutAct_9fa48("869") ? "" : (stryCov_9fa48("869"), 'barbeiros_barbearias')).select(stryMutAct_9fa48("870") ? "" : (stryCov_9fa48("870"), 'id, ativo')).eq(stryMutAct_9fa48("871") ? "" : (stryCov_9fa48("871"), 'user_id'), user_id).eq(stryMutAct_9fa48("872") ? "" : (stryCov_9fa48("872"), 'barbearia_id'), barbearia_id).single();
      if (stryMutAct_9fa48("875") ? relacaoError || relacaoError.code !== 'PGRST116' : stryMutAct_9fa48("874") ? false : stryMutAct_9fa48("873") ? true : (stryCov_9fa48("873", "874", "875"), relacaoError && (stryMutAct_9fa48("877") ? relacaoError.code === 'PGRST116' : stryMutAct_9fa48("876") ? true : (stryCov_9fa48("876", "877"), relacaoError.code !== (stryMutAct_9fa48("878") ? "" : (stryCov_9fa48("878"), 'PGRST116')))))) {
        if (stryMutAct_9fa48("879")) {
          {}
        } else {
          stryCov_9fa48("879");
          throw new Error(stryMutAct_9fa48("880") ? "" : (stryCov_9fa48("880"), 'Erro interno do servidor'));
        }
      }
      if (stryMutAct_9fa48("882") ? false : stryMutAct_9fa48("881") ? true : (stryCov_9fa48("881", "882"), relacaoExistente)) {
        if (stryMutAct_9fa48("883")) {
          {}
        } else {
          stryCov_9fa48("883");
          if (stryMutAct_9fa48("885") ? false : stryMutAct_9fa48("884") ? true : (stryCov_9fa48("884", "885"), relacaoExistente.ativo)) {
            if (stryMutAct_9fa48("886")) {
              {}
            } else {
              stryCov_9fa48("886");
              throw new Error(stryMutAct_9fa48("887") ? "" : (stryCov_9fa48("887"), 'Barbeiro já está ativo nesta barbearia'));
            }
          } else {
            if (stryMutAct_9fa48("888")) {
              {}
            } else {
              stryCov_9fa48("888");
              // Reativar barbeiro
              const {
                error: updateError
              } = await this.supabase.from(stryMutAct_9fa48("889") ? "" : (stryCov_9fa48("889"), 'barbeiros_barbearias')).update(stryMutAct_9fa48("890") ? {} : (stryCov_9fa48("890"), {
                ativo: stryMutAct_9fa48("891") ? false : (stryCov_9fa48("891"), true),
                updated_at: new Date().toISOString()
              })).eq(stryMutAct_9fa48("892") ? "" : (stryCov_9fa48("892"), 'id'), relacaoExistente.id);
              if (stryMutAct_9fa48("894") ? false : stryMutAct_9fa48("893") ? true : (stryCov_9fa48("893", "894"), updateError)) {
                if (stryMutAct_9fa48("895")) {
                  {}
                } else {
                  stryCov_9fa48("895");
                  throw new Error(stryMutAct_9fa48("896") ? "" : (stryCov_9fa48("896"), 'Erro interno do servidor'));
                }
              }
              return stryMutAct_9fa48("897") ? {} : (stryCov_9fa48("897"), {
                barbeiro: stryMutAct_9fa48("898") ? {} : (stryCov_9fa48("898"), {
                  id: user.id,
                  nome: user.nome,
                  email: user.email
                }),
                barbearia: stryMutAct_9fa48("899") ? {} : (stryCov_9fa48("899"), {
                  id: barbearia.id,
                  nome: barbearia.nome
                }),
                acao: stryMutAct_9fa48("900") ? "" : (stryCov_9fa48("900"), 'reativado')
              });
            }
          }
        }
      } else {
        if (stryMutAct_9fa48("901")) {
          {}
        } else {
          stryCov_9fa48("901");
          // Criar nova relação
          const {
            data: novaRelacao,
            error: insertError
          } = await this.supabase.from(stryMutAct_9fa48("902") ? "" : (stryCov_9fa48("902"), 'barbeiros_barbearias')).insert(stryMutAct_9fa48("903") ? {} : (stryCov_9fa48("903"), {
            user_id: user_id,
            barbearia_id: barbearia_id,
            ativo: stryMutAct_9fa48("904") ? false : (stryCov_9fa48("904"), true),
            created_at: new Date().toISOString()
          })).select().single();
          if (stryMutAct_9fa48("906") ? false : stryMutAct_9fa48("905") ? true : (stryCov_9fa48("905", "906"), insertError)) {
            if (stryMutAct_9fa48("907")) {
              {}
            } else {
              stryCov_9fa48("907");
              throw new Error(stryMutAct_9fa48("908") ? "" : (stryCov_9fa48("908"), 'Erro interno do servidor'));
            }
          }
          return stryMutAct_9fa48("909") ? {} : (stryCov_9fa48("909"), {
            barbeiro: stryMutAct_9fa48("910") ? {} : (stryCov_9fa48("910"), {
              id: user.id,
              nome: user.nome,
              email: user.email
            }),
            barbearia: stryMutAct_9fa48("911") ? {} : (stryCov_9fa48("911"), {
              id: barbearia.id,
              nome: barbearia.nome
            }),
            acao: stryMutAct_9fa48("912") ? "" : (stryCov_9fa48("912"), 'ativado')
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
    if (stryMutAct_9fa48("913")) {
      {}
    } else {
      stryCov_9fa48("913");
      const {
        user_id,
        barbearia_id
      } = dados;

      // Verificar se existe a relação entre barbeiro e barbearia
      const {
        data: relacao,
        error: relacaoError
      } = await this.supabase.from(stryMutAct_9fa48("914") ? "" : (stryCov_9fa48("914"), 'barbeiros_barbearias')).select(stryMutAct_9fa48("915") ? `` : (stryCov_9fa48("915"), `
        id,
        ativo,
        users(id, nome, email),
        barbearias(id, nome)
      `)).eq(stryMutAct_9fa48("916") ? "" : (stryCov_9fa48("916"), 'user_id'), user_id).eq(stryMutAct_9fa48("917") ? "" : (stryCov_9fa48("917"), 'barbearia_id'), barbearia_id).single();
      if (stryMutAct_9fa48("920") ? relacaoError && !relacao : stryMutAct_9fa48("919") ? false : stryMutAct_9fa48("918") ? true : (stryCov_9fa48("918", "919", "920"), relacaoError || (stryMutAct_9fa48("921") ? relacao : (stryCov_9fa48("921"), !relacao)))) {
        if (stryMutAct_9fa48("922")) {
          {}
        } else {
          stryCov_9fa48("922");
          throw new Error(stryMutAct_9fa48("923") ? "" : (stryCov_9fa48("923"), 'Relação barbeiro-barbearia não encontrada'));
        }
      }
      if (stryMutAct_9fa48("926") ? false : stryMutAct_9fa48("925") ? true : stryMutAct_9fa48("924") ? relacao.ativo : (stryCov_9fa48("924", "925", "926"), !relacao.ativo)) {
        if (stryMutAct_9fa48("927")) {
          {}
        } else {
          stryCov_9fa48("927");
          throw new Error(stryMutAct_9fa48("928") ? "" : (stryCov_9fa48("928"), 'Barbeiro já está inativo nesta barbearia'));
        }
      }

      // Verificar se o barbeiro está atendendo algum cliente
      const {
        data: clienteAtendendo
      } = await this.supabase.from(stryMutAct_9fa48("929") ? "" : (stryCov_9fa48("929"), 'clientes')).select(stryMutAct_9fa48("930") ? "" : (stryCov_9fa48("930"), 'id, nome')).eq(stryMutAct_9fa48("931") ? "" : (stryCov_9fa48("931"), 'barbeiro_id'), user_id).eq(stryMutAct_9fa48("932") ? "" : (stryCov_9fa48("932"), 'barbearia_id'), barbearia_id).in(stryMutAct_9fa48("933") ? "" : (stryCov_9fa48("933"), 'status'), stryMutAct_9fa48("934") ? [] : (stryCov_9fa48("934"), [stryMutAct_9fa48("935") ? "" : (stryCov_9fa48("935"), 'proximo'), stryMutAct_9fa48("936") ? "" : (stryCov_9fa48("936"), 'atendendo')])).single();
      if (stryMutAct_9fa48("938") ? false : stryMutAct_9fa48("937") ? true : (stryCov_9fa48("937", "938"), clienteAtendendo)) {
        if (stryMutAct_9fa48("939")) {
          {}
        } else {
          stryCov_9fa48("939");
          throw new Error(stryMutAct_9fa48("940") ? "" : (stryCov_9fa48("940"), 'Não é possível desativar barbeiro que está atendendo um cliente'));
        }
      }

      // Desativar barbeiro
      const {
        error: updateError
      } = await this.supabase.from(stryMutAct_9fa48("941") ? "" : (stryCov_9fa48("941"), 'barbeiros_barbearias')).update(stryMutAct_9fa48("942") ? {} : (stryCov_9fa48("942"), {
        ativo: stryMutAct_9fa48("943") ? true : (stryCov_9fa48("943"), false),
        updated_at: new Date().toISOString()
      })).eq(stryMutAct_9fa48("944") ? "" : (stryCov_9fa48("944"), 'id'), relacao.id);
      if (stryMutAct_9fa48("946") ? false : stryMutAct_9fa48("945") ? true : (stryCov_9fa48("945", "946"), updateError)) {
        if (stryMutAct_9fa48("947")) {
          {}
        } else {
          stryCov_9fa48("947");
          throw new Error(stryMutAct_9fa48("948") ? "" : (stryCov_9fa48("948"), 'Erro interno do servidor'));
        }
      }
      return stryMutAct_9fa48("949") ? {} : (stryCov_9fa48("949"), {
        barbeiro: stryMutAct_9fa48("950") ? {} : (stryCov_9fa48("950"), {
          id: relacao.users.id,
          nome: relacao.users.nome,
          email: relacao.users.email
        }),
        barbearia: stryMutAct_9fa48("951") ? {} : (stryCov_9fa48("951"), {
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
    if (stryMutAct_9fa48("952")) {
      {}
    } else {
      stryCov_9fa48("952");
      const {
        data: users,
        error: usersError
      } = await this.supabase.from(stryMutAct_9fa48("953") ? "" : (stryCov_9fa48("953"), 'users')).select(stryMutAct_9fa48("954") ? "" : (stryCov_9fa48("954"), 'id, nome, email, role, ativo, created_at')).order(stryMutAct_9fa48("955") ? "" : (stryCov_9fa48("955"), 'created_at'), stryMutAct_9fa48("956") ? {} : (stryCov_9fa48("956"), {
        ascending: stryMutAct_9fa48("957") ? true : (stryCov_9fa48("957"), false)
      }));
      if (stryMutAct_9fa48("959") ? false : stryMutAct_9fa48("958") ? true : (stryCov_9fa48("958", "959"), usersError)) {
        if (stryMutAct_9fa48("960")) {
          {}
        } else {
          stryCov_9fa48("960");
          throw new Error(stryMutAct_9fa48("961") ? "" : (stryCov_9fa48("961"), 'Erro interno do servidor'));
        }
      }
      return stryMutAct_9fa48("962") ? {} : (stryCov_9fa48("962"), {
        users: users.map(stryMutAct_9fa48("963") ? () => undefined : (stryCov_9fa48("963"), user => stryMutAct_9fa48("964") ? {} : (stryCov_9fa48("964"), {
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
    if (stryMutAct_9fa48("965")) {
      {}
    } else {
      stryCov_9fa48("965");
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
      } = await this.supabase.from(stryMutAct_9fa48("966") ? "" : (stryCov_9fa48("966"), 'users')).select(stryMutAct_9fa48("967") ? "" : (stryCov_9fa48("967"), 'id, nome, email, role')).eq(stryMutAct_9fa48("968") ? "" : (stryCov_9fa48("968"), 'id'), id).single();
      if (stryMutAct_9fa48("971") ? userError && !userExistente : stryMutAct_9fa48("970") ? false : stryMutAct_9fa48("969") ? true : (stryCov_9fa48("969", "970", "971"), userError || (stryMutAct_9fa48("972") ? userExistente : (stryCov_9fa48("972"), !userExistente)))) {
        if (stryMutAct_9fa48("973")) {
          {}
        } else {
          stryCov_9fa48("973");
          throw new Error(stryMutAct_9fa48("974") ? "" : (stryCov_9fa48("974"), 'Usuário não encontrado'));
        }
      }

      // Preparar dados para atualização
      const dadosAtualizacao = {};
      if (stryMutAct_9fa48("977") ? nome === undefined : stryMutAct_9fa48("976") ? false : stryMutAct_9fa48("975") ? true : (stryCov_9fa48("975", "976", "977"), nome !== undefined)) dadosAtualizacao.nome = nome;
      if (stryMutAct_9fa48("980") ? email === undefined : stryMutAct_9fa48("979") ? false : stryMutAct_9fa48("978") ? true : (stryCov_9fa48("978", "979", "980"), email !== undefined)) dadosAtualizacao.email = email;
      if (stryMutAct_9fa48("983") ? role === undefined : stryMutAct_9fa48("982") ? false : stryMutAct_9fa48("981") ? true : (stryCov_9fa48("981", "982", "983"), role !== undefined)) dadosAtualizacao.role = role;
      if (stryMutAct_9fa48("986") ? ativo === undefined : stryMutAct_9fa48("985") ? false : stryMutAct_9fa48("984") ? true : (stryCov_9fa48("984", "985", "986"), ativo !== undefined)) dadosAtualizacao.ativo = ativo;
      dadosAtualizacao.updated_at = new Date().toISOString();

      // Atualizar usuário
      const {
        data: userAtualizado,
        error: updateError
      } = await this.supabase.from(stryMutAct_9fa48("987") ? "" : (stryCov_9fa48("987"), 'users')).update(dadosAtualizacao).eq(stryMutAct_9fa48("988") ? "" : (stryCov_9fa48("988"), 'id'), id).select(stryMutAct_9fa48("989") ? "" : (stryCov_9fa48("989"), 'id, nome, email, role, ativo, updated_at')).single();
      if (stryMutAct_9fa48("991") ? false : stryMutAct_9fa48("990") ? true : (stryCov_9fa48("990", "991"), updateError)) {
        if (stryMutAct_9fa48("992")) {
          {}
        } else {
          stryCov_9fa48("992");
          throw new Error(stryMutAct_9fa48("993") ? "" : (stryCov_9fa48("993"), 'Erro interno do servidor'));
        }
      }
      return stryMutAct_9fa48("994") ? {} : (stryCov_9fa48("994"), {
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
    if (stryMutAct_9fa48("995")) {
      {}
    } else {
      stryCov_9fa48("995");
      // Verificar se o usuário existe
      const {
        data: userExistente,
        error: userError
      } = await this.supabase.from(stryMutAct_9fa48("996") ? "" : (stryCov_9fa48("996"), 'users')).select(stryMutAct_9fa48("997") ? "" : (stryCov_9fa48("997"), 'id, nome, email, role')).eq(stryMutAct_9fa48("998") ? "" : (stryCov_9fa48("998"), 'id'), id).single();
      if (stryMutAct_9fa48("1001") ? userError && !userExistente : stryMutAct_9fa48("1000") ? false : stryMutAct_9fa48("999") ? true : (stryCov_9fa48("999", "1000", "1001"), userError || (stryMutAct_9fa48("1002") ? userExistente : (stryCov_9fa48("1002"), !userExistente)))) {
        if (stryMutAct_9fa48("1003")) {
          {}
        } else {
          stryCov_9fa48("1003");
          throw new Error(stryMutAct_9fa48("1004") ? "" : (stryCov_9fa48("1004"), 'Usuário não encontrado'));
        }
      }

      // Verificar se o usuário está sendo deletado não é o próprio admin
      if (stryMutAct_9fa48("1007") ? adminId !== id : stryMutAct_9fa48("1006") ? false : stryMutAct_9fa48("1005") ? true : (stryCov_9fa48("1005", "1006", "1007"), adminId === id)) {
        if (stryMutAct_9fa48("1008")) {
          {}
        } else {
          stryCov_9fa48("1008");
          throw new Error(stryMutAct_9fa48("1009") ? "" : (stryCov_9fa48("1009"), 'Não é possível deletar o próprio usuário'));
        }
      }

      // Verificar se o usuário tem relações ativas (barbeiro em barbearias)
      if (stryMutAct_9fa48("1012") ? userExistente.role !== 'barbeiro' : stryMutAct_9fa48("1011") ? false : stryMutAct_9fa48("1010") ? true : (stryCov_9fa48("1010", "1011", "1012"), userExistente.role === (stryMutAct_9fa48("1013") ? "" : (stryCov_9fa48("1013"), 'barbeiro')))) {
        if (stryMutAct_9fa48("1014")) {
          {}
        } else {
          stryCov_9fa48("1014");
          const {
            data: relacoesAtivas
          } = await this.supabase.from(stryMutAct_9fa48("1015") ? "" : (stryCov_9fa48("1015"), 'barbeiros_barbearias')).select(stryMutAct_9fa48("1016") ? "" : (stryCov_9fa48("1016"), 'id')).eq(stryMutAct_9fa48("1017") ? "" : (stryCov_9fa48("1017"), 'user_id'), id).eq(stryMutAct_9fa48("1018") ? "" : (stryCov_9fa48("1018"), 'ativo'), stryMutAct_9fa48("1019") ? false : (stryCov_9fa48("1019"), true));
          if (stryMutAct_9fa48("1022") ? relacoesAtivas || relacoesAtivas.length > 0 : stryMutAct_9fa48("1021") ? false : stryMutAct_9fa48("1020") ? true : (stryCov_9fa48("1020", "1021", "1022"), relacoesAtivas && (stryMutAct_9fa48("1025") ? relacoesAtivas.length <= 0 : stryMutAct_9fa48("1024") ? relacoesAtivas.length >= 0 : stryMutAct_9fa48("1023") ? true : (stryCov_9fa48("1023", "1024", "1025"), relacoesAtivas.length > 0)))) {
            if (stryMutAct_9fa48("1026")) {
              {}
            } else {
              stryCov_9fa48("1026");
              throw new Error(stryMutAct_9fa48("1027") ? "" : (stryCov_9fa48("1027"), 'Não é possível deletar barbeiro com relações ativas em barbearias'));
            }
          }
        }
      }

      // Deletar usuário
      const {
        error: deleteError
      } = await this.supabase.from(stryMutAct_9fa48("1028") ? "" : (stryCov_9fa48("1028"), 'users')).delete().eq(stryMutAct_9fa48("1029") ? "" : (stryCov_9fa48("1029"), 'id'), id);
      if (stryMutAct_9fa48("1031") ? false : stryMutAct_9fa48("1030") ? true : (stryCov_9fa48("1030", "1031"), deleteError)) {
        if (stryMutAct_9fa48("1032")) {
          {}
        } else {
          stryCov_9fa48("1032");
          throw new Error(stryMutAct_9fa48("1033") ? "" : (stryCov_9fa48("1033"), 'Erro interno do servidor'));
        }
      }
      return stryMutAct_9fa48("1034") ? {} : (stryCov_9fa48("1034"), {
        id: userExistente.id,
        nome: userExistente.nome,
        email: userExistente.email,
        role: userExistente.role
      });
    }
  }
}
module.exports = UserService;