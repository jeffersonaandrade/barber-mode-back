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
const {
  checkAdminOrGerenteRole
} = require('../middlewares/rolePermissions');

// Versão sem fastify-plugin (funcionando)
async function historicoRoutes(fastify, options) {
  if (stryMutAct_9fa48("2633")) {
    {}
  } else {
    stryCov_9fa48("2633");
    // Histórico de atendimentos
    fastify.get(stryMutAct_9fa48("2634") ? "" : (stryCov_9fa48("2634"), '/historico'), stryMutAct_9fa48("2635") ? {} : (stryCov_9fa48("2635"), {
      preValidation: stryMutAct_9fa48("2636") ? [] : (stryCov_9fa48("2636"), [fastify.authenticate, checkAdminOrGerenteRole]),
      schema: stryMutAct_9fa48("2637") ? {} : (stryCov_9fa48("2637"), {
        description: stryMutAct_9fa48("2638") ? "" : (stryCov_9fa48("2638"), 'Histórico de atendimentos'),
        tags: stryMutAct_9fa48("2639") ? [] : (stryCov_9fa48("2639"), [stryMutAct_9fa48("2640") ? "" : (stryCov_9fa48("2640"), 'historico')]),
        security: stryMutAct_9fa48("2641") ? [] : (stryCov_9fa48("2641"), [stryMutAct_9fa48("2642") ? {} : (stryCov_9fa48("2642"), {
          Bearer: stryMutAct_9fa48("2643") ? ["Stryker was here"] : (stryCov_9fa48("2643"), [])
        })]),
        querystring: stryMutAct_9fa48("2644") ? {} : (stryCov_9fa48("2644"), {
          type: stryMutAct_9fa48("2645") ? "" : (stryCov_9fa48("2645"), 'object'),
          properties: stryMutAct_9fa48("2646") ? {} : (stryCov_9fa48("2646"), {
            barbearia_id: stryMutAct_9fa48("2647") ? {} : (stryCov_9fa48("2647"), {
              type: stryMutAct_9fa48("2648") ? "" : (stryCov_9fa48("2648"), 'integer')
            }),
            data_inicio: stryMutAct_9fa48("2649") ? {} : (stryCov_9fa48("2649"), {
              type: stryMutAct_9fa48("2650") ? "" : (stryCov_9fa48("2650"), 'string'),
              format: stryMutAct_9fa48("2651") ? "" : (stryCov_9fa48("2651"), 'date')
            }),
            data_fim: stryMutAct_9fa48("2652") ? {} : (stryCov_9fa48("2652"), {
              type: stryMutAct_9fa48("2653") ? "" : (stryCov_9fa48("2653"), 'string'),
              format: stryMutAct_9fa48("2654") ? "" : (stryCov_9fa48("2654"), 'date')
            }),
            barbeiro_id: stryMutAct_9fa48("2655") ? {} : (stryCov_9fa48("2655"), {
              type: stryMutAct_9fa48("2656") ? "" : (stryCov_9fa48("2656"), 'string')
            }),
            limit: stryMutAct_9fa48("2657") ? {} : (stryCov_9fa48("2657"), {
              type: stryMutAct_9fa48("2658") ? "" : (stryCov_9fa48("2658"), 'integer'),
              default: 50
            }),
            offset: stryMutAct_9fa48("2659") ? {} : (stryCov_9fa48("2659"), {
              type: stryMutAct_9fa48("2660") ? "" : (stryCov_9fa48("2660"), 'integer'),
              default: 0
            })
          })
        })
      })
    }), async (request, reply) => {
      if (stryMutAct_9fa48("2661")) {
        {}
      } else {
        stryCov_9fa48("2661");
        try {
          if (stryMutAct_9fa48("2662")) {
            {}
          } else {
            stryCov_9fa48("2662");
            const {
              barbearia_id,
              data_inicio,
              data_fim,
              barbeiro_id,
              limit = 50,
              offset = 0
            } = request.query;

            // Query base
            let query = fastify.supabase.from(stryMutAct_9fa48("2663") ? "" : (stryCov_9fa48("2663"), 'historico_atendimentos')).select(stryMutAct_9fa48("2664") ? "" : (stryCov_9fa48("2664"), '*')).order(stryMutAct_9fa48("2665") ? "" : (stryCov_9fa48("2665"), 'data_inicio'), stryMutAct_9fa48("2666") ? {} : (stryCov_9fa48("2666"), {
              ascending: stryMutAct_9fa48("2667") ? true : (stryCov_9fa48("2667"), false)
            })).range(offset, stryMutAct_9fa48("2668") ? offset + limit + 1 : (stryCov_9fa48("2668"), (stryMutAct_9fa48("2669") ? offset - limit : (stryCov_9fa48("2669"), offset + limit)) - 1));

            // Aplicar filtros
            if (stryMutAct_9fa48("2671") ? false : stryMutAct_9fa48("2670") ? true : (stryCov_9fa48("2670", "2671"), barbearia_id)) {
              if (stryMutAct_9fa48("2672")) {
                {}
              } else {
                stryCov_9fa48("2672");
                query = query.eq(stryMutAct_9fa48("2673") ? "" : (stryCov_9fa48("2673"), 'barbearia_id'), barbearia_id);
              }
            }
            if (stryMutAct_9fa48("2675") ? false : stryMutAct_9fa48("2674") ? true : (stryCov_9fa48("2674", "2675"), barbeiro_id)) {
              if (stryMutAct_9fa48("2676")) {
                {}
              } else {
                stryCov_9fa48("2676");
                query = query.eq(stryMutAct_9fa48("2677") ? "" : (stryCov_9fa48("2677"), 'barbeiro_id'), barbeiro_id);
              }
            }
            if (stryMutAct_9fa48("2679") ? false : stryMutAct_9fa48("2678") ? true : (stryCov_9fa48("2678", "2679"), data_inicio)) {
              if (stryMutAct_9fa48("2680")) {
                {}
              } else {
                stryCov_9fa48("2680");
                query = query.gte(stryMutAct_9fa48("2681") ? "" : (stryCov_9fa48("2681"), 'data_inicio'), data_inicio);
              }
            }
            if (stryMutAct_9fa48("2683") ? false : stryMutAct_9fa48("2682") ? true : (stryCov_9fa48("2682", "2683"), data_fim)) {
              if (stryMutAct_9fa48("2684")) {
                {}
              } else {
                stryCov_9fa48("2684");
                query = query.lte(stryMutAct_9fa48("2685") ? "" : (stryCov_9fa48("2685"), 'data_inicio'), data_fim);
              }
            }
            const {
              data: historico,
              error
            } = await query;
            if (stryMutAct_9fa48("2687") ? false : stryMutAct_9fa48("2686") ? true : (stryCov_9fa48("2686", "2687"), error)) {
              if (stryMutAct_9fa48("2688")) {
                {}
              } else {
                stryCov_9fa48("2688");
                console.error(stryMutAct_9fa48("2689") ? "" : (stryCov_9fa48("2689"), 'Erro ao buscar histórico:'), error);
                return reply.status(500).send(stryMutAct_9fa48("2690") ? {} : (stryCov_9fa48("2690"), {
                  success: stryMutAct_9fa48("2691") ? true : (stryCov_9fa48("2691"), false),
                  error: (stryMutAct_9fa48("2692") ? "" : (stryCov_9fa48("2692"), 'Erro ao buscar histórico: ')) + error.message
                }));
              }
            }
            return reply.send(stryMutAct_9fa48("2693") ? {} : (stryCov_9fa48("2693"), {
              success: stryMutAct_9fa48("2694") ? false : (stryCov_9fa48("2694"), true),
              data: stryMutAct_9fa48("2697") ? historico && [] : stryMutAct_9fa48("2696") ? false : stryMutAct_9fa48("2695") ? true : (stryCov_9fa48("2695", "2696", "2697"), historico || (stryMutAct_9fa48("2698") ? ["Stryker was here"] : (stryCov_9fa48("2698"), []))),
              pagination: stryMutAct_9fa48("2699") ? {} : (stryCov_9fa48("2699"), {
                total: historico ? historico.length : 0,
                limit,
                offset,
                hasMore: historico ? stryMutAct_9fa48("2702") ? historico.length !== limit : stryMutAct_9fa48("2701") ? false : stryMutAct_9fa48("2700") ? true : (stryCov_9fa48("2700", "2701", "2702"), historico.length === limit) : stryMutAct_9fa48("2703") ? true : (stryCov_9fa48("2703"), false)
              })
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("2704")) {
            {}
          } else {
            stryCov_9fa48("2704");
            console.error(stryMutAct_9fa48("2705") ? "" : (stryCov_9fa48("2705"), 'Erro interno:'), error);
            return reply.status(500).send(stryMutAct_9fa48("2706") ? {} : (stryCov_9fa48("2706"), {
              success: stryMutAct_9fa48("2707") ? true : (stryCov_9fa48("2707"), false),
              error: (stryMutAct_9fa48("2708") ? "" : (stryCov_9fa48("2708"), 'Erro interno do servidor: ')) + error.message
            }));
          }
        }
      }
    });

    // Relatórios e estatísticas
    fastify.get(stryMutAct_9fa48("2709") ? "" : (stryCov_9fa48("2709"), '/historico/relatorios'), stryMutAct_9fa48("2710") ? {} : (stryCov_9fa48("2710"), {
      preValidation: stryMutAct_9fa48("2711") ? [] : (stryCov_9fa48("2711"), [fastify.authenticate, checkAdminOrGerenteRole]),
      schema: stryMutAct_9fa48("2712") ? {} : (stryCov_9fa48("2712"), {
        description: stryMutAct_9fa48("2713") ? "" : (stryCov_9fa48("2713"), 'Relatórios e estatísticas de atendimentos'),
        tags: stryMutAct_9fa48("2714") ? [] : (stryCov_9fa48("2714"), [stryMutAct_9fa48("2715") ? "" : (stryCov_9fa48("2715"), 'historico')]),
        security: stryMutAct_9fa48("2716") ? [] : (stryCov_9fa48("2716"), [stryMutAct_9fa48("2717") ? {} : (stryCov_9fa48("2717"), {
          Bearer: stryMutAct_9fa48("2718") ? ["Stryker was here"] : (stryCov_9fa48("2718"), [])
        })])
      })
    }), async (request, reply) => {
      if (stryMutAct_9fa48("2719")) {
        {}
      } else {
        stryCov_9fa48("2719");
        try {
          if (stryMutAct_9fa48("2720")) {
            {}
          } else {
            stryCov_9fa48("2720");
            const {
              data: historico,
              error
            } = await fastify.supabase.from(stryMutAct_9fa48("2721") ? "" : (stryCov_9fa48("2721"), 'historico_atendimentos')).select(stryMutAct_9fa48("2722") ? "" : (stryCov_9fa48("2722"), '*'));
            if (stryMutAct_9fa48("2724") ? false : stryMutAct_9fa48("2723") ? true : (stryCov_9fa48("2723", "2724"), error)) {
              if (stryMutAct_9fa48("2725")) {
                {}
              } else {
                stryCov_9fa48("2725");
                return reply.status(500).send(stryMutAct_9fa48("2726") ? {} : (stryCov_9fa48("2726"), {
                  success: stryMutAct_9fa48("2727") ? true : (stryCov_9fa48("2727"), false),
                  error: (stryMutAct_9fa48("2728") ? "" : (stryCov_9fa48("2728"), 'Erro ao buscar relatórios: ')) + error.message
                }));
              }
            }
            return reply.send(stryMutAct_9fa48("2729") ? {} : (stryCov_9fa48("2729"), {
              success: stryMutAct_9fa48("2730") ? false : (stryCov_9fa48("2730"), true),
              data: stryMutAct_9fa48("2731") ? {} : (stryCov_9fa48("2731"), {
                total_atendimentos: historico ? historico.length : 0,
                tempo_medio_atendimento: 0,
                faturamento_total: 0,
                atendimentos_por_dia: stryMutAct_9fa48("2732") ? ["Stryker was here"] : (stryCov_9fa48("2732"), []),
                top_barbeiros: stryMutAct_9fa48("2733") ? ["Stryker was here"] : (stryCov_9fa48("2733"), []),
                servicos_mais_populares: stryMutAct_9fa48("2734") ? ["Stryker was here"] : (stryCov_9fa48("2734"), [])
              })
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("2735")) {
            {}
          } else {
            stryCov_9fa48("2735");
            return reply.status(500).send(stryMutAct_9fa48("2736") ? {} : (stryCov_9fa48("2736"), {
              success: stryMutAct_9fa48("2737") ? true : (stryCov_9fa48("2737"), false),
              error: (stryMutAct_9fa48("2738") ? "" : (stryCov_9fa48("2738"), 'Erro interno do servidor: ')) + error.message
            }));
          }
        }
      }
    });
  }
}
module.exports = historicoRoutes;