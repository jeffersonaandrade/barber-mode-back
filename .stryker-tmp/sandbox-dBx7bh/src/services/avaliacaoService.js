/**
 * AvaliacaoService - Serviço para gerenciar lógica de negócio das avaliações
 * 
 * Este serviço centraliza todas as operações relacionadas às avaliações,
 * incluindo envio, listagem, filtros e cálculo de estatísticas.
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
class AvaliacaoService {
  constructor(supabase) {
    if (stryMutAct_9fa48("134")) {
      {}
    } else {
      stryCov_9fa48("134");
      this.supabase = supabase;
    }
  }

  /**
   * Enviar avaliação
   * @param {Object} avaliacaoData - Dados da avaliação
   * @returns {Promise<Object>} Avaliação criada
   */
  async enviarAvaliacao(avaliacaoData) {
    if (stryMutAct_9fa48("135")) {
      {}
    } else {
      stryCov_9fa48("135");
      try {
        if (stryMutAct_9fa48("136")) {
          {}
        } else {
          stryCov_9fa48("136");
          const {
            cliente_id,
            barbearia_id,
            barbeiro_id,
            rating,
            categoria,
            comentario
          } = avaliacaoData;

          // Validar dados obrigatórios
          if (stryMutAct_9fa48("139") ? (!cliente_id || !barbearia_id) && !rating : stryMutAct_9fa48("138") ? false : stryMutAct_9fa48("137") ? true : (stryCov_9fa48("137", "138", "139"), (stryMutAct_9fa48("141") ? !cliente_id && !barbearia_id : stryMutAct_9fa48("140") ? false : (stryCov_9fa48("140", "141"), (stryMutAct_9fa48("142") ? cliente_id : (stryCov_9fa48("142"), !cliente_id)) || (stryMutAct_9fa48("143") ? barbearia_id : (stryCov_9fa48("143"), !barbearia_id)))) || (stryMutAct_9fa48("144") ? rating : (stryCov_9fa48("144"), !rating)))) {
            if (stryMutAct_9fa48("145")) {
              {}
            } else {
              stryCov_9fa48("145");
              throw new Error(stryMutAct_9fa48("146") ? "" : (stryCov_9fa48("146"), 'Cliente ID, barbearia ID e rating são obrigatórios'));
            }
          }

          // Validar rating
          if (stryMutAct_9fa48("149") ? rating < 1 && rating > 5 : stryMutAct_9fa48("148") ? false : stryMutAct_9fa48("147") ? true : (stryCov_9fa48("147", "148", "149"), (stryMutAct_9fa48("152") ? rating >= 1 : stryMutAct_9fa48("151") ? rating <= 1 : stryMutAct_9fa48("150") ? false : (stryCov_9fa48("150", "151", "152"), rating < 1)) || (stryMutAct_9fa48("155") ? rating <= 5 : stryMutAct_9fa48("154") ? rating >= 5 : stryMutAct_9fa48("153") ? false : (stryCov_9fa48("153", "154", "155"), rating > 5)))) {
            if (stryMutAct_9fa48("156")) {
              {}
            } else {
              stryCov_9fa48("156");
              throw new Error(stryMutAct_9fa48("157") ? "" : (stryCov_9fa48("157"), 'Rating deve estar entre 1 e 5'));
            }
          }

          // Verificar se o cliente existe e foi atendido
          const cliente = await this.verificarClienteAtendido(cliente_id, barbearia_id);
          if (stryMutAct_9fa48("160") ? false : stryMutAct_9fa48("159") ? true : stryMutAct_9fa48("158") ? cliente : (stryCov_9fa48("158", "159", "160"), !cliente)) {
            if (stryMutAct_9fa48("161")) {
              {}
            } else {
              stryCov_9fa48("161");
              throw new Error(stryMutAct_9fa48("162") ? "" : (stryCov_9fa48("162"), 'Cliente não encontrado ou não foi atendido'));
            }
          }

          // Verificar se já existe avaliação para este cliente
          const avaliacaoExistente = await this.verificarAvaliacaoExistente(cliente_id);
          if (stryMutAct_9fa48("164") ? false : stryMutAct_9fa48("163") ? true : (stryCov_9fa48("163", "164"), avaliacaoExistente)) {
            if (stryMutAct_9fa48("165")) {
              {}
            } else {
              stryCov_9fa48("165");
              throw new Error(stryMutAct_9fa48("166") ? "" : (stryCov_9fa48("166"), 'Cliente já avaliou este atendimento'));
            }
          }

          // Criar avaliação
          const {
            data: avaliacao,
            error
          } = await this.supabase.from(stryMutAct_9fa48("167") ? "" : (stryCov_9fa48("167"), 'avaliacoes')).insert(stryMutAct_9fa48("168") ? {} : (stryCov_9fa48("168"), {
            cliente_id,
            barbearia_id,
            barbeiro_id,
            rating,
            categoria,
            comentario,
            created_at: new Date().toISOString()
          })).select().single();
          if (stryMutAct_9fa48("170") ? false : stryMutAct_9fa48("169") ? true : (stryCov_9fa48("169", "170"), error)) {
            if (stryMutAct_9fa48("171")) {
              {}
            } else {
              stryCov_9fa48("171");
              throw new Error(stryMutAct_9fa48("172") ? `` : (stryCov_9fa48("172"), `Erro ao criar avaliação: ${error.message}`));
            }
          }
          return avaliacao;
        }
      } catch (error) {
        if (stryMutAct_9fa48("173")) {
          {}
        } else {
          stryCov_9fa48("173");
          throw new Error(stryMutAct_9fa48("174") ? `` : (stryCov_9fa48("174"), `Erro ao enviar avaliação: ${error.message}`));
        }
      }
    }
  }

  /**
   * Listar avaliações com filtros
   * @param {Object} filtros - Filtros para a busca
   * @returns {Promise<Object>} Avaliações e estatísticas
   */
  async listarAvaliacoes(filtros = {}) {
    if (stryMutAct_9fa48("175")) {
      {}
    } else {
      stryCov_9fa48("175");
      try {
        if (stryMutAct_9fa48("176")) {
          {}
        } else {
          stryCov_9fa48("176");
          const {
            barbearia_id,
            barbeiro_id,
            categoria,
            rating_min,
            rating_max,
            data_inicio,
            data_fim
          } = filtros;
          let query = this.supabase.from(stryMutAct_9fa48("177") ? "" : (stryCov_9fa48("177"), 'avaliacoes')).select(stryMutAct_9fa48("178") ? `` : (stryCov_9fa48("178"), `
          *,
          cliente:clientes(nome, telefone),
          barbearia:barbearias(nome),
          barbeiro:users(nome)
        `)).order(stryMutAct_9fa48("179") ? "" : (stryCov_9fa48("179"), 'created_at'), stryMutAct_9fa48("180") ? {} : (stryCov_9fa48("180"), {
            ascending: stryMutAct_9fa48("181") ? true : (stryCov_9fa48("181"), false)
          }));

          // Aplicar filtros
          if (stryMutAct_9fa48("183") ? false : stryMutAct_9fa48("182") ? true : (stryCov_9fa48("182", "183"), barbearia_id)) {
            if (stryMutAct_9fa48("184")) {
              {}
            } else {
              stryCov_9fa48("184");
              query = query.eq(stryMutAct_9fa48("185") ? "" : (stryCov_9fa48("185"), 'barbearia_id'), barbearia_id);
            }
          }
          if (stryMutAct_9fa48("187") ? false : stryMutAct_9fa48("186") ? true : (stryCov_9fa48("186", "187"), barbeiro_id)) {
            if (stryMutAct_9fa48("188")) {
              {}
            } else {
              stryCov_9fa48("188");
              query = query.eq(stryMutAct_9fa48("189") ? "" : (stryCov_9fa48("189"), 'barbeiro_id'), barbeiro_id);
            }
          }
          if (stryMutAct_9fa48("191") ? false : stryMutAct_9fa48("190") ? true : (stryCov_9fa48("190", "191"), categoria)) {
            if (stryMutAct_9fa48("192")) {
              {}
            } else {
              stryCov_9fa48("192");
              query = query.eq(stryMutAct_9fa48("193") ? "" : (stryCov_9fa48("193"), 'categoria'), categoria);
            }
          }
          if (stryMutAct_9fa48("195") ? false : stryMutAct_9fa48("194") ? true : (stryCov_9fa48("194", "195"), rating_min)) {
            if (stryMutAct_9fa48("196")) {
              {}
            } else {
              stryCov_9fa48("196");
              query = query.gte(stryMutAct_9fa48("197") ? "" : (stryCov_9fa48("197"), 'rating'), rating_min);
            }
          }
          if (stryMutAct_9fa48("199") ? false : stryMutAct_9fa48("198") ? true : (stryCov_9fa48("198", "199"), rating_max)) {
            if (stryMutAct_9fa48("200")) {
              {}
            } else {
              stryCov_9fa48("200");
              query = query.lte(stryMutAct_9fa48("201") ? "" : (stryCov_9fa48("201"), 'rating'), rating_max);
            }
          }
          if (stryMutAct_9fa48("203") ? false : stryMutAct_9fa48("202") ? true : (stryCov_9fa48("202", "203"), data_inicio)) {
            if (stryMutAct_9fa48("204")) {
              {}
            } else {
              stryCov_9fa48("204");
              query = query.gte(stryMutAct_9fa48("205") ? "" : (stryCov_9fa48("205"), 'created_at'), data_inicio);
            }
          }
          if (stryMutAct_9fa48("207") ? false : stryMutAct_9fa48("206") ? true : (stryCov_9fa48("206", "207"), data_fim)) {
            if (stryMutAct_9fa48("208")) {
              {}
            } else {
              stryCov_9fa48("208");
              query = query.lte(stryMutAct_9fa48("209") ? "" : (stryCov_9fa48("209"), 'created_at'), data_fim);
            }
          }
          const {
            data: avaliacoes,
            error
          } = await query;
          if (stryMutAct_9fa48("211") ? false : stryMutAct_9fa48("210") ? true : (stryCov_9fa48("210", "211"), error)) {
            if (stryMutAct_9fa48("212")) {
              {}
            } else {
              stryCov_9fa48("212");
              throw new Error(stryMutAct_9fa48("213") ? `` : (stryCov_9fa48("213"), `Erro ao buscar avaliações: ${error.message}`));
            }
          }

          // Calcular estatísticas
          const estatisticas = this.calcularEstatisticas(avaliacoes);
          return stryMutAct_9fa48("214") ? {} : (stryCov_9fa48("214"), {
            avaliacoes,
            estatisticas
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("215")) {
          {}
        } else {
          stryCov_9fa48("215");
          throw new Error(stryMutAct_9fa48("216") ? `` : (stryCov_9fa48("216"), `Erro ao listar avaliações: ${error.message}`));
        }
      }
    }
  }

  /**
   * Verificar se cliente foi atendido
   * @param {string} cliente_id - ID do cliente
   * @param {number} barbearia_id - ID da barbearia
   * @returns {Promise<Object|null>} Dados do cliente ou null
   */
  async verificarClienteAtendido(cliente_id, barbearia_id) {
    if (stryMutAct_9fa48("217")) {
      {}
    } else {
      stryCov_9fa48("217");
      try {
        if (stryMutAct_9fa48("218")) {
          {}
        } else {
          stryCov_9fa48("218");
          const {
            data: cliente,
            error
          } = await this.supabase.from(stryMutAct_9fa48("219") ? "" : (stryCov_9fa48("219"), 'clientes')).select(stryMutAct_9fa48("220") ? "" : (stryCov_9fa48("220"), '*')).eq(stryMutAct_9fa48("221") ? "" : (stryCov_9fa48("221"), 'id'), cliente_id).eq(stryMutAct_9fa48("222") ? "" : (stryCov_9fa48("222"), 'barbearia_id'), barbearia_id).eq(stryMutAct_9fa48("223") ? "" : (stryCov_9fa48("223"), 'status'), stryMutAct_9fa48("224") ? "" : (stryCov_9fa48("224"), 'finalizado')).single();
          if (stryMutAct_9fa48("227") ? error && !cliente : stryMutAct_9fa48("226") ? false : stryMutAct_9fa48("225") ? true : (stryCov_9fa48("225", "226", "227"), error || (stryMutAct_9fa48("228") ? cliente : (stryCov_9fa48("228"), !cliente)))) {
            if (stryMutAct_9fa48("229")) {
              {}
            } else {
              stryCov_9fa48("229");
              return null;
            }
          }
          return cliente;
        }
      } catch (error) {
        if (stryMutAct_9fa48("230")) {
          {}
        } else {
          stryCov_9fa48("230");
          return null;
        }
      }
    }
  }

  /**
   * Verificar se já existe avaliação para o cliente
   * @param {string} cliente_id - ID do cliente
   * @returns {Promise<boolean>} Se existe avaliação
   */
  async verificarAvaliacaoExistente(cliente_id) {
    if (stryMutAct_9fa48("231")) {
      {}
    } else {
      stryCov_9fa48("231");
      try {
        if (stryMutAct_9fa48("232")) {
          {}
        } else {
          stryCov_9fa48("232");
          const {
            data: avaliacao
          } = await this.supabase.from(stryMutAct_9fa48("233") ? "" : (stryCov_9fa48("233"), 'avaliacoes')).select(stryMutAct_9fa48("234") ? "" : (stryCov_9fa48("234"), 'id')).eq(stryMutAct_9fa48("235") ? "" : (stryCov_9fa48("235"), 'cliente_id'), cliente_id).single();
          return stryMutAct_9fa48("236") ? !avaliacao : (stryCov_9fa48("236"), !(stryMutAct_9fa48("237") ? avaliacao : (stryCov_9fa48("237"), !avaliacao)));
        }
      } catch (error) {
        if (stryMutAct_9fa48("238")) {
          {}
        } else {
          stryCov_9fa48("238");
          return stryMutAct_9fa48("239") ? true : (stryCov_9fa48("239"), false);
        }
      }
    }
  }

  /**
   * Calcular estatísticas das avaliações
   * @param {Array} avaliacoes - Lista de avaliações
   * @returns {Object} Estatísticas calculadas
   */
  calcularEstatisticas(avaliacoes) {
    if (stryMutAct_9fa48("240")) {
      {}
    } else {
      stryCov_9fa48("240");
      const totalAvaliacoes = avaliacoes.length;
      if (stryMutAct_9fa48("243") ? totalAvaliacoes !== 0 : stryMutAct_9fa48("242") ? false : stryMutAct_9fa48("241") ? true : (stryCov_9fa48("241", "242", "243"), totalAvaliacoes === 0)) {
        if (stryMutAct_9fa48("244")) {
          {}
        } else {
          stryCov_9fa48("244");
          return stryMutAct_9fa48("245") ? {} : (stryCov_9fa48("245"), {
            total: 0,
            media_rating: 0,
            por_rating: stryMutAct_9fa48("246") ? {} : (stryCov_9fa48("246"), {
              1: 0,
              2: 0,
              3: 0,
              4: 0,
              5: 0
            })
          });
        }
      }
      const mediaRating = stryMutAct_9fa48("247") ? avaliacoes.reduce((sum, av) => sum + av.rating, 0) * totalAvaliacoes : (stryCov_9fa48("247"), avaliacoes.reduce(stryMutAct_9fa48("248") ? () => undefined : (stryCov_9fa48("248"), (sum, av) => stryMutAct_9fa48("249") ? sum - av.rating : (stryCov_9fa48("249"), sum + av.rating)), 0) / totalAvaliacoes);
      return stryMutAct_9fa48("250") ? {} : (stryCov_9fa48("250"), {
        total: totalAvaliacoes,
        media_rating: stryMutAct_9fa48("251") ? Math.round(mediaRating * 10) * 10 : (stryCov_9fa48("251"), Math.round(stryMutAct_9fa48("252") ? mediaRating / 10 : (stryCov_9fa48("252"), mediaRating * 10)) / 10),
        por_rating: stryMutAct_9fa48("253") ? {} : (stryCov_9fa48("253"), {
          1: stryMutAct_9fa48("254") ? avaliacoes.length : (stryCov_9fa48("254"), avaliacoes.filter(stryMutAct_9fa48("255") ? () => undefined : (stryCov_9fa48("255"), av => stryMutAct_9fa48("258") ? av.rating !== 1 : stryMutAct_9fa48("257") ? false : stryMutAct_9fa48("256") ? true : (stryCov_9fa48("256", "257", "258"), av.rating === 1))).length),
          2: stryMutAct_9fa48("259") ? avaliacoes.length : (stryCov_9fa48("259"), avaliacoes.filter(stryMutAct_9fa48("260") ? () => undefined : (stryCov_9fa48("260"), av => stryMutAct_9fa48("263") ? av.rating !== 2 : stryMutAct_9fa48("262") ? false : stryMutAct_9fa48("261") ? true : (stryCov_9fa48("261", "262", "263"), av.rating === 2))).length),
          3: stryMutAct_9fa48("264") ? avaliacoes.length : (stryCov_9fa48("264"), avaliacoes.filter(stryMutAct_9fa48("265") ? () => undefined : (stryCov_9fa48("265"), av => stryMutAct_9fa48("268") ? av.rating !== 3 : stryMutAct_9fa48("267") ? false : stryMutAct_9fa48("266") ? true : (stryCov_9fa48("266", "267", "268"), av.rating === 3))).length),
          4: stryMutAct_9fa48("269") ? avaliacoes.length : (stryCov_9fa48("269"), avaliacoes.filter(stryMutAct_9fa48("270") ? () => undefined : (stryCov_9fa48("270"), av => stryMutAct_9fa48("273") ? av.rating !== 4 : stryMutAct_9fa48("272") ? false : stryMutAct_9fa48("271") ? true : (stryCov_9fa48("271", "272", "273"), av.rating === 4))).length),
          5: stryMutAct_9fa48("274") ? avaliacoes.length : (stryCov_9fa48("274"), avaliacoes.filter(stryMutAct_9fa48("275") ? () => undefined : (stryCov_9fa48("275"), av => stryMutAct_9fa48("278") ? av.rating !== 5 : stryMutAct_9fa48("277") ? false : stryMutAct_9fa48("276") ? true : (stryCov_9fa48("276", "277", "278"), av.rating === 5))).length)
        })
      });
    }
  }

  /**
   * Obter estatísticas de uma barbearia
   * @param {number} barbearia_id - ID da barbearia
   * @returns {Promise<Object>} Estatísticas da barbearia
   */
  async obterEstatisticasBarbearia(barbearia_id) {
    if (stryMutAct_9fa48("279")) {
      {}
    } else {
      stryCov_9fa48("279");
      try {
        if (stryMutAct_9fa48("280")) {
          {}
        } else {
          stryCov_9fa48("280");
          const {
            data: avaliacoes,
            error
          } = await this.supabase.from(stryMutAct_9fa48("281") ? "" : (stryCov_9fa48("281"), 'avaliacoes')).select(stryMutAct_9fa48("282") ? "" : (stryCov_9fa48("282"), 'rating, categoria')).eq(stryMutAct_9fa48("283") ? "" : (stryCov_9fa48("283"), 'barbearia_id'), barbearia_id);
          if (stryMutAct_9fa48("285") ? false : stryMutAct_9fa48("284") ? true : (stryCov_9fa48("284", "285"), error)) {
            if (stryMutAct_9fa48("286")) {
              {}
            } else {
              stryCov_9fa48("286");
              throw new Error(stryMutAct_9fa48("287") ? `` : (stryCov_9fa48("287"), `Erro ao buscar avaliações da barbearia: ${error.message}`));
            }
          }
          const estatisticas = this.calcularEstatisticas(avaliacoes);

          // Adicionar estatísticas por categoria
          const categorias = stryMutAct_9fa48("288") ? [] : (stryCov_9fa48("288"), [stryMutAct_9fa48("289") ? "" : (stryCov_9fa48("289"), 'atendimento'), stryMutAct_9fa48("290") ? "" : (stryCov_9fa48("290"), 'qualidade'), stryMutAct_9fa48("291") ? "" : (stryCov_9fa48("291"), 'ambiente'), stryMutAct_9fa48("292") ? "" : (stryCov_9fa48("292"), 'tempo'), stryMutAct_9fa48("293") ? "" : (stryCov_9fa48("293"), 'preco')]);
          const estatisticasPorCategoria = {};
          categorias.forEach(categoria => {
            if (stryMutAct_9fa48("294")) {
              {}
            } else {
              stryCov_9fa48("294");
              const avaliacoesCategoria = stryMutAct_9fa48("295") ? avaliacoes : (stryCov_9fa48("295"), avaliacoes.filter(stryMutAct_9fa48("296") ? () => undefined : (stryCov_9fa48("296"), av => stryMutAct_9fa48("299") ? av.categoria !== categoria : stryMutAct_9fa48("298") ? false : stryMutAct_9fa48("297") ? true : (stryCov_9fa48("297", "298", "299"), av.categoria === categoria))));
              estatisticasPorCategoria[categoria] = this.calcularEstatisticas(avaliacoesCategoria);
            }
          });
          return stryMutAct_9fa48("300") ? {} : (stryCov_9fa48("300"), {
            ...estatisticas,
            por_categoria: estatisticasPorCategoria
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("301")) {
          {}
        } else {
          stryCov_9fa48("301");
          throw new Error(stryMutAct_9fa48("302") ? `` : (stryCov_9fa48("302"), `Erro ao obter estatísticas da barbearia: ${error.message}`));
        }
      }
    }
  }

  /**
   * Obter estatísticas de um barbeiro
   * @param {string} barbeiro_id - ID do barbeiro
   * @returns {Promise<Object>} Estatísticas do barbeiro
   */
  async obterEstatisticasBarbeiro(barbeiro_id) {
    if (stryMutAct_9fa48("303")) {
      {}
    } else {
      stryCov_9fa48("303");
      try {
        if (stryMutAct_9fa48("304")) {
          {}
        } else {
          stryCov_9fa48("304");
          const {
            data: avaliacoes,
            error
          } = await this.supabase.from(stryMutAct_9fa48("305") ? "" : (stryCov_9fa48("305"), 'avaliacoes')).select(stryMutAct_9fa48("306") ? "" : (stryCov_9fa48("306"), 'rating, categoria')).eq(stryMutAct_9fa48("307") ? "" : (stryCov_9fa48("307"), 'barbeiro_id'), barbeiro_id);
          if (stryMutAct_9fa48("309") ? false : stryMutAct_9fa48("308") ? true : (stryCov_9fa48("308", "309"), error)) {
            if (stryMutAct_9fa48("310")) {
              {}
            } else {
              stryCov_9fa48("310");
              throw new Error(stryMutAct_9fa48("311") ? `` : (stryCov_9fa48("311"), `Erro ao buscar avaliações do barbeiro: ${error.message}`));
            }
          }
          return this.calcularEstatisticas(avaliacoes);
        }
      } catch (error) {
        if (stryMutAct_9fa48("312")) {
          {}
        } else {
          stryCov_9fa48("312");
          throw new Error(stryMutAct_9fa48("313") ? `` : (stryCov_9fa48("313"), `Erro ao obter estatísticas do barbeiro: ${error.message}`));
        }
      }
    }
  }
}
module.exports = AvaliacaoService;