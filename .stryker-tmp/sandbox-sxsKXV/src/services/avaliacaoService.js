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
    if (stryMutAct_9fa48("3452")) {
      {}
    } else {
      stryCov_9fa48("3452");
      this.supabase = supabase;
    }
  }

  /**
   * Enviar avaliação
   * @param {Object} avaliacaoData - Dados da avaliação
   * @returns {Promise<Object>} Avaliação criada
   */
  async enviarAvaliacao(avaliacaoData) {
    if (stryMutAct_9fa48("3453")) {
      {}
    } else {
      stryCov_9fa48("3453");
      try {
        if (stryMutAct_9fa48("3454")) {
          {}
        } else {
          stryCov_9fa48("3454");
          const {
            cliente_id,
            barbearia_id,
            barbeiro_id,
            rating,
            categoria,
            comentario
          } = avaliacaoData;

          // Validar dados obrigatórios
          if (stryMutAct_9fa48("3457") ? (!cliente_id || !barbearia_id) && !rating : stryMutAct_9fa48("3456") ? false : stryMutAct_9fa48("3455") ? true : (stryCov_9fa48("3455", "3456", "3457"), (stryMutAct_9fa48("3459") ? !cliente_id && !barbearia_id : stryMutAct_9fa48("3458") ? false : (stryCov_9fa48("3458", "3459"), (stryMutAct_9fa48("3460") ? cliente_id : (stryCov_9fa48("3460"), !cliente_id)) || (stryMutAct_9fa48("3461") ? barbearia_id : (stryCov_9fa48("3461"), !barbearia_id)))) || (stryMutAct_9fa48("3462") ? rating : (stryCov_9fa48("3462"), !rating)))) {
            if (stryMutAct_9fa48("3463")) {
              {}
            } else {
              stryCov_9fa48("3463");
              throw new Error(stryMutAct_9fa48("3464") ? "" : (stryCov_9fa48("3464"), 'Cliente ID, barbearia ID e rating são obrigatórios'));
            }
          }

          // Validar rating
          if (stryMutAct_9fa48("3467") ? rating < 1 && rating > 5 : stryMutAct_9fa48("3466") ? false : stryMutAct_9fa48("3465") ? true : (stryCov_9fa48("3465", "3466", "3467"), (stryMutAct_9fa48("3470") ? rating >= 1 : stryMutAct_9fa48("3469") ? rating <= 1 : stryMutAct_9fa48("3468") ? false : (stryCov_9fa48("3468", "3469", "3470"), rating < 1)) || (stryMutAct_9fa48("3473") ? rating <= 5 : stryMutAct_9fa48("3472") ? rating >= 5 : stryMutAct_9fa48("3471") ? false : (stryCov_9fa48("3471", "3472", "3473"), rating > 5)))) {
            if (stryMutAct_9fa48("3474")) {
              {}
            } else {
              stryCov_9fa48("3474");
              throw new Error(stryMutAct_9fa48("3475") ? "" : (stryCov_9fa48("3475"), 'Rating deve estar entre 1 e 5'));
            }
          }

          // Verificar se o cliente existe e foi atendido
          const cliente = await this.verificarClienteAtendido(cliente_id, barbearia_id);
          if (stryMutAct_9fa48("3478") ? false : stryMutAct_9fa48("3477") ? true : stryMutAct_9fa48("3476") ? cliente : (stryCov_9fa48("3476", "3477", "3478"), !cliente)) {
            if (stryMutAct_9fa48("3479")) {
              {}
            } else {
              stryCov_9fa48("3479");
              throw new Error(stryMutAct_9fa48("3480") ? "" : (stryCov_9fa48("3480"), 'Cliente não encontrado ou não foi atendido'));
            }
          }

          // Verificar se já existe avaliação para este cliente
          const avaliacaoExistente = await this.verificarAvaliacaoExistente(cliente_id);
          if (stryMutAct_9fa48("3482") ? false : stryMutAct_9fa48("3481") ? true : (stryCov_9fa48("3481", "3482"), avaliacaoExistente)) {
            if (stryMutAct_9fa48("3483")) {
              {}
            } else {
              stryCov_9fa48("3483");
              throw new Error(stryMutAct_9fa48("3484") ? "" : (stryCov_9fa48("3484"), 'Cliente já avaliou este atendimento'));
            }
          }

          // Criar avaliação
          const {
            data: avaliacao,
            error
          } = await this.supabase.from(stryMutAct_9fa48("3485") ? "" : (stryCov_9fa48("3485"), 'avaliacoes')).insert(stryMutAct_9fa48("3486") ? {} : (stryCov_9fa48("3486"), {
            cliente_id,
            barbearia_id,
            barbeiro_id,
            rating,
            categoria,
            comentario,
            created_at: new Date().toISOString()
          })).select().single();
          if (stryMutAct_9fa48("3488") ? false : stryMutAct_9fa48("3487") ? true : (stryCov_9fa48("3487", "3488"), error)) {
            if (stryMutAct_9fa48("3489")) {
              {}
            } else {
              stryCov_9fa48("3489");
              throw new Error(stryMutAct_9fa48("3490") ? `` : (stryCov_9fa48("3490"), `Erro ao criar avaliação: ${error.message}`));
            }
          }
          return avaliacao;
        }
      } catch (error) {
        if (stryMutAct_9fa48("3491")) {
          {}
        } else {
          stryCov_9fa48("3491");
          throw new Error(stryMutAct_9fa48("3492") ? `` : (stryCov_9fa48("3492"), `Erro ao enviar avaliação: ${error.message}`));
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
    if (stryMutAct_9fa48("3493")) {
      {}
    } else {
      stryCov_9fa48("3493");
      try {
        if (stryMutAct_9fa48("3494")) {
          {}
        } else {
          stryCov_9fa48("3494");
          const {
            barbearia_id,
            barbeiro_id,
            categoria,
            rating_min,
            rating_max,
            data_inicio,
            data_fim
          } = filtros;
          let query = this.supabase.from(stryMutAct_9fa48("3495") ? "" : (stryCov_9fa48("3495"), 'avaliacoes')).select(stryMutAct_9fa48("3496") ? `` : (stryCov_9fa48("3496"), `
          *,
          cliente:clientes(nome, telefone),
          barbearia:barbearias(nome),
          barbeiro:users(nome)
        `)).order(stryMutAct_9fa48("3497") ? "" : (stryCov_9fa48("3497"), 'created_at'), stryMutAct_9fa48("3498") ? {} : (stryCov_9fa48("3498"), {
            ascending: stryMutAct_9fa48("3499") ? true : (stryCov_9fa48("3499"), false)
          }));

          // Aplicar filtros
          if (stryMutAct_9fa48("3501") ? false : stryMutAct_9fa48("3500") ? true : (stryCov_9fa48("3500", "3501"), barbearia_id)) {
            if (stryMutAct_9fa48("3502")) {
              {}
            } else {
              stryCov_9fa48("3502");
              query = query.eq(stryMutAct_9fa48("3503") ? "" : (stryCov_9fa48("3503"), 'barbearia_id'), barbearia_id);
            }
          }
          if (stryMutAct_9fa48("3505") ? false : stryMutAct_9fa48("3504") ? true : (stryCov_9fa48("3504", "3505"), barbeiro_id)) {
            if (stryMutAct_9fa48("3506")) {
              {}
            } else {
              stryCov_9fa48("3506");
              query = query.eq(stryMutAct_9fa48("3507") ? "" : (stryCov_9fa48("3507"), 'barbeiro_id'), barbeiro_id);
            }
          }
          if (stryMutAct_9fa48("3509") ? false : stryMutAct_9fa48("3508") ? true : (stryCov_9fa48("3508", "3509"), categoria)) {
            if (stryMutAct_9fa48("3510")) {
              {}
            } else {
              stryCov_9fa48("3510");
              query = query.eq(stryMutAct_9fa48("3511") ? "" : (stryCov_9fa48("3511"), 'categoria'), categoria);
            }
          }
          if (stryMutAct_9fa48("3513") ? false : stryMutAct_9fa48("3512") ? true : (stryCov_9fa48("3512", "3513"), rating_min)) {
            if (stryMutAct_9fa48("3514")) {
              {}
            } else {
              stryCov_9fa48("3514");
              query = query.gte(stryMutAct_9fa48("3515") ? "" : (stryCov_9fa48("3515"), 'rating'), rating_min);
            }
          }
          if (stryMutAct_9fa48("3517") ? false : stryMutAct_9fa48("3516") ? true : (stryCov_9fa48("3516", "3517"), rating_max)) {
            if (stryMutAct_9fa48("3518")) {
              {}
            } else {
              stryCov_9fa48("3518");
              query = query.lte(stryMutAct_9fa48("3519") ? "" : (stryCov_9fa48("3519"), 'rating'), rating_max);
            }
          }
          if (stryMutAct_9fa48("3521") ? false : stryMutAct_9fa48("3520") ? true : (stryCov_9fa48("3520", "3521"), data_inicio)) {
            if (stryMutAct_9fa48("3522")) {
              {}
            } else {
              stryCov_9fa48("3522");
              query = query.gte(stryMutAct_9fa48("3523") ? "" : (stryCov_9fa48("3523"), 'created_at'), data_inicio);
            }
          }
          if (stryMutAct_9fa48("3525") ? false : stryMutAct_9fa48("3524") ? true : (stryCov_9fa48("3524", "3525"), data_fim)) {
            if (stryMutAct_9fa48("3526")) {
              {}
            } else {
              stryCov_9fa48("3526");
              query = query.lte(stryMutAct_9fa48("3527") ? "" : (stryCov_9fa48("3527"), 'created_at'), data_fim);
            }
          }
          const {
            data: avaliacoes,
            error
          } = await query;
          if (stryMutAct_9fa48("3529") ? false : stryMutAct_9fa48("3528") ? true : (stryCov_9fa48("3528", "3529"), error)) {
            if (stryMutAct_9fa48("3530")) {
              {}
            } else {
              stryCov_9fa48("3530");
              throw new Error(stryMutAct_9fa48("3531") ? `` : (stryCov_9fa48("3531"), `Erro ao buscar avaliações: ${error.message}`));
            }
          }

          // Calcular estatísticas
          const estatisticas = this.calcularEstatisticas(avaliacoes);
          return stryMutAct_9fa48("3532") ? {} : (stryCov_9fa48("3532"), {
            avaliacoes,
            estatisticas
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("3533")) {
          {}
        } else {
          stryCov_9fa48("3533");
          throw new Error(stryMutAct_9fa48("3534") ? `` : (stryCov_9fa48("3534"), `Erro ao listar avaliações: ${error.message}`));
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
    if (stryMutAct_9fa48("3535")) {
      {}
    } else {
      stryCov_9fa48("3535");
      try {
        if (stryMutAct_9fa48("3536")) {
          {}
        } else {
          stryCov_9fa48("3536");
          const {
            data: cliente,
            error
          } = await this.supabase.from(stryMutAct_9fa48("3537") ? "" : (stryCov_9fa48("3537"), 'clientes')).select(stryMutAct_9fa48("3538") ? "" : (stryCov_9fa48("3538"), '*')).eq(stryMutAct_9fa48("3539") ? "" : (stryCov_9fa48("3539"), 'id'), cliente_id).eq(stryMutAct_9fa48("3540") ? "" : (stryCov_9fa48("3540"), 'barbearia_id'), barbearia_id).eq(stryMutAct_9fa48("3541") ? "" : (stryCov_9fa48("3541"), 'status'), stryMutAct_9fa48("3542") ? "" : (stryCov_9fa48("3542"), 'finalizado')).single();
          if (stryMutAct_9fa48("3545") ? error && !cliente : stryMutAct_9fa48("3544") ? false : stryMutAct_9fa48("3543") ? true : (stryCov_9fa48("3543", "3544", "3545"), error || (stryMutAct_9fa48("3546") ? cliente : (stryCov_9fa48("3546"), !cliente)))) {
            if (stryMutAct_9fa48("3547")) {
              {}
            } else {
              stryCov_9fa48("3547");
              return null;
            }
          }
          return cliente;
        }
      } catch (error) {
        if (stryMutAct_9fa48("3548")) {
          {}
        } else {
          stryCov_9fa48("3548");
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
    if (stryMutAct_9fa48("3549")) {
      {}
    } else {
      stryCov_9fa48("3549");
      try {
        if (stryMutAct_9fa48("3550")) {
          {}
        } else {
          stryCov_9fa48("3550");
          const {
            data: avaliacao
          } = await this.supabase.from(stryMutAct_9fa48("3551") ? "" : (stryCov_9fa48("3551"), 'avaliacoes')).select(stryMutAct_9fa48("3552") ? "" : (stryCov_9fa48("3552"), 'id')).eq(stryMutAct_9fa48("3553") ? "" : (stryCov_9fa48("3553"), 'cliente_id'), cliente_id).single();
          return stryMutAct_9fa48("3554") ? !avaliacao : (stryCov_9fa48("3554"), !(stryMutAct_9fa48("3555") ? avaliacao : (stryCov_9fa48("3555"), !avaliacao)));
        }
      } catch (error) {
        if (stryMutAct_9fa48("3556")) {
          {}
        } else {
          stryCov_9fa48("3556");
          return stryMutAct_9fa48("3557") ? true : (stryCov_9fa48("3557"), false);
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
    if (stryMutAct_9fa48("3558")) {
      {}
    } else {
      stryCov_9fa48("3558");
      const totalAvaliacoes = avaliacoes.length;
      if (stryMutAct_9fa48("3561") ? totalAvaliacoes !== 0 : stryMutAct_9fa48("3560") ? false : stryMutAct_9fa48("3559") ? true : (stryCov_9fa48("3559", "3560", "3561"), totalAvaliacoes === 0)) {
        if (stryMutAct_9fa48("3562")) {
          {}
        } else {
          stryCov_9fa48("3562");
          return stryMutAct_9fa48("3563") ? {} : (stryCov_9fa48("3563"), {
            total: 0,
            media_rating: 0,
            por_rating: stryMutAct_9fa48("3564") ? {} : (stryCov_9fa48("3564"), {
              1: 0,
              2: 0,
              3: 0,
              4: 0,
              5: 0
            })
          });
        }
      }
      const mediaRating = stryMutAct_9fa48("3565") ? avaliacoes.reduce((sum, av) => sum + av.rating, 0) * totalAvaliacoes : (stryCov_9fa48("3565"), avaliacoes.reduce(stryMutAct_9fa48("3566") ? () => undefined : (stryCov_9fa48("3566"), (sum, av) => stryMutAct_9fa48("3567") ? sum - av.rating : (stryCov_9fa48("3567"), sum + av.rating)), 0) / totalAvaliacoes);
      return stryMutAct_9fa48("3568") ? {} : (stryCov_9fa48("3568"), {
        total: totalAvaliacoes,
        media_rating: stryMutAct_9fa48("3569") ? Math.round(mediaRating * 10) * 10 : (stryCov_9fa48("3569"), Math.round(stryMutAct_9fa48("3570") ? mediaRating / 10 : (stryCov_9fa48("3570"), mediaRating * 10)) / 10),
        por_rating: stryMutAct_9fa48("3571") ? {} : (stryCov_9fa48("3571"), {
          1: stryMutAct_9fa48("3572") ? avaliacoes.length : (stryCov_9fa48("3572"), avaliacoes.filter(stryMutAct_9fa48("3573") ? () => undefined : (stryCov_9fa48("3573"), av => stryMutAct_9fa48("3576") ? av.rating !== 1 : stryMutAct_9fa48("3575") ? false : stryMutAct_9fa48("3574") ? true : (stryCov_9fa48("3574", "3575", "3576"), av.rating === 1))).length),
          2: stryMutAct_9fa48("3577") ? avaliacoes.length : (stryCov_9fa48("3577"), avaliacoes.filter(stryMutAct_9fa48("3578") ? () => undefined : (stryCov_9fa48("3578"), av => stryMutAct_9fa48("3581") ? av.rating !== 2 : stryMutAct_9fa48("3580") ? false : stryMutAct_9fa48("3579") ? true : (stryCov_9fa48("3579", "3580", "3581"), av.rating === 2))).length),
          3: stryMutAct_9fa48("3582") ? avaliacoes.length : (stryCov_9fa48("3582"), avaliacoes.filter(stryMutAct_9fa48("3583") ? () => undefined : (stryCov_9fa48("3583"), av => stryMutAct_9fa48("3586") ? av.rating !== 3 : stryMutAct_9fa48("3585") ? false : stryMutAct_9fa48("3584") ? true : (stryCov_9fa48("3584", "3585", "3586"), av.rating === 3))).length),
          4: stryMutAct_9fa48("3587") ? avaliacoes.length : (stryCov_9fa48("3587"), avaliacoes.filter(stryMutAct_9fa48("3588") ? () => undefined : (stryCov_9fa48("3588"), av => stryMutAct_9fa48("3591") ? av.rating !== 4 : stryMutAct_9fa48("3590") ? false : stryMutAct_9fa48("3589") ? true : (stryCov_9fa48("3589", "3590", "3591"), av.rating === 4))).length),
          5: stryMutAct_9fa48("3592") ? avaliacoes.length : (stryCov_9fa48("3592"), avaliacoes.filter(stryMutAct_9fa48("3593") ? () => undefined : (stryCov_9fa48("3593"), av => stryMutAct_9fa48("3596") ? av.rating !== 5 : stryMutAct_9fa48("3595") ? false : stryMutAct_9fa48("3594") ? true : (stryCov_9fa48("3594", "3595", "3596"), av.rating === 5))).length)
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
    if (stryMutAct_9fa48("3597")) {
      {}
    } else {
      stryCov_9fa48("3597");
      try {
        if (stryMutAct_9fa48("3598")) {
          {}
        } else {
          stryCov_9fa48("3598");
          const {
            data: avaliacoes,
            error
          } = await this.supabase.from(stryMutAct_9fa48("3599") ? "" : (stryCov_9fa48("3599"), 'avaliacoes')).select(stryMutAct_9fa48("3600") ? "" : (stryCov_9fa48("3600"), 'rating, categoria')).eq(stryMutAct_9fa48("3601") ? "" : (stryCov_9fa48("3601"), 'barbearia_id'), barbearia_id);
          if (stryMutAct_9fa48("3603") ? false : stryMutAct_9fa48("3602") ? true : (stryCov_9fa48("3602", "3603"), error)) {
            if (stryMutAct_9fa48("3604")) {
              {}
            } else {
              stryCov_9fa48("3604");
              throw new Error(stryMutAct_9fa48("3605") ? `` : (stryCov_9fa48("3605"), `Erro ao buscar avaliações da barbearia: ${error.message}`));
            }
          }
          const estatisticas = this.calcularEstatisticas(avaliacoes);

          // Adicionar estatísticas por categoria
          const categorias = stryMutAct_9fa48("3606") ? [] : (stryCov_9fa48("3606"), [stryMutAct_9fa48("3607") ? "" : (stryCov_9fa48("3607"), 'atendimento'), stryMutAct_9fa48("3608") ? "" : (stryCov_9fa48("3608"), 'qualidade'), stryMutAct_9fa48("3609") ? "" : (stryCov_9fa48("3609"), 'ambiente'), stryMutAct_9fa48("3610") ? "" : (stryCov_9fa48("3610"), 'tempo'), stryMutAct_9fa48("3611") ? "" : (stryCov_9fa48("3611"), 'preco')]);
          const estatisticasPorCategoria = {};
          categorias.forEach(categoria => {
            if (stryMutAct_9fa48("3612")) {
              {}
            } else {
              stryCov_9fa48("3612");
              const avaliacoesCategoria = stryMutAct_9fa48("3613") ? avaliacoes : (stryCov_9fa48("3613"), avaliacoes.filter(stryMutAct_9fa48("3614") ? () => undefined : (stryCov_9fa48("3614"), av => stryMutAct_9fa48("3617") ? av.categoria !== categoria : stryMutAct_9fa48("3616") ? false : stryMutAct_9fa48("3615") ? true : (stryCov_9fa48("3615", "3616", "3617"), av.categoria === categoria))));
              estatisticasPorCategoria[categoria] = this.calcularEstatisticas(avaliacoesCategoria);
            }
          });
          return stryMutAct_9fa48("3618") ? {} : (stryCov_9fa48("3618"), {
            ...estatisticas,
            por_categoria: estatisticasPorCategoria
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("3619")) {
          {}
        } else {
          stryCov_9fa48("3619");
          throw new Error(stryMutAct_9fa48("3620") ? `` : (stryCov_9fa48("3620"), `Erro ao obter estatísticas da barbearia: ${error.message}`));
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
    if (stryMutAct_9fa48("3621")) {
      {}
    } else {
      stryCov_9fa48("3621");
      try {
        if (stryMutAct_9fa48("3622")) {
          {}
        } else {
          stryCov_9fa48("3622");
          const {
            data: avaliacoes,
            error
          } = await this.supabase.from(stryMutAct_9fa48("3623") ? "" : (stryCov_9fa48("3623"), 'avaliacoes')).select(stryMutAct_9fa48("3624") ? "" : (stryCov_9fa48("3624"), 'rating, categoria')).eq(stryMutAct_9fa48("3625") ? "" : (stryCov_9fa48("3625"), 'barbeiro_id'), barbeiro_id);
          if (stryMutAct_9fa48("3627") ? false : stryMutAct_9fa48("3626") ? true : (stryCov_9fa48("3626", "3627"), error)) {
            if (stryMutAct_9fa48("3628")) {
              {}
            } else {
              stryCov_9fa48("3628");
              throw new Error(stryMutAct_9fa48("3629") ? `` : (stryCov_9fa48("3629"), `Erro ao buscar avaliações do barbeiro: ${error.message}`));
            }
          }
          return this.calcularEstatisticas(avaliacoes);
        }
      } catch (error) {
        if (stryMutAct_9fa48("3630")) {
          {}
        } else {
          stryCov_9fa48("3630");
          throw new Error(stryMutAct_9fa48("3631") ? `` : (stryCov_9fa48("3631"), `Erro ao obter estatísticas do barbeiro: ${error.message}`));
        }
      }
    }
  }
}
module.exports = AvaliacaoService;