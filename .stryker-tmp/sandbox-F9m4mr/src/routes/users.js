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
  supabase
} = require('../config/database');
const {
  checkAdminRole,
  checkAdminOrGerenteRole,
  checkBarbeiroRole
} = require('../middlewares/rolePermissions');
async function userRoutes(fastify, options) {
  if (stryMutAct_9fa48("2935")) {
    {}
  } else {
    stryCov_9fa48("2935");
    /**
     * @swagger
     * /api/users:
     *   get:
     *     tags: [users]
     *     summary: Listar usuários (apenas admin)
     *     security:
     *       - Bearer: []
     *     responses:
     *       200:
     *         description: Lista de usuários
     *       403:
     *         description: Acesso negado
     */
    fastify.get(stryMutAct_9fa48("2936") ? "" : (stryCov_9fa48("2936"), '/'), stryMutAct_9fa48("2937") ? {} : (stryCov_9fa48("2937"), {
      preValidation: stryMutAct_9fa48("2938") ? [] : (stryCov_9fa48("2938"), [fastify.authenticate, checkAdminRole])
    }), async (request, reply) => {
      if (stryMutAct_9fa48("2939")) {
        {}
      } else {
        stryCov_9fa48("2939");
        try {
          if (stryMutAct_9fa48("2940")) {
            {}
          } else {
            stryCov_9fa48("2940");
            const {
              data: users,
              error
            } = await supabase.from(stryMutAct_9fa48("2941") ? "" : (stryCov_9fa48("2941"), 'users')).select(stryMutAct_9fa48("2942") ? "" : (stryCov_9fa48("2942"), 'id, email, nome, telefone, role, active, created_at, updated_at')).order(stryMutAct_9fa48("2943") ? "" : (stryCov_9fa48("2943"), 'created_at'), stryMutAct_9fa48("2944") ? {} : (stryCov_9fa48("2944"), {
              ascending: stryMutAct_9fa48("2945") ? true : (stryCov_9fa48("2945"), false)
            }));
            if (stryMutAct_9fa48("2947") ? false : stryMutAct_9fa48("2946") ? true : (stryCov_9fa48("2946", "2947"), error)) {
              if (stryMutAct_9fa48("2948")) {
                {}
              } else {
                stryCov_9fa48("2948");
                throw new Error(stryMutAct_9fa48("2949") ? "" : (stryCov_9fa48("2949"), 'Erro ao buscar usuários'));
              }
            }
            return reply.send(stryMutAct_9fa48("2950") ? {} : (stryCov_9fa48("2950"), {
              success: stryMutAct_9fa48("2951") ? false : (stryCov_9fa48("2951"), true),
              data: users
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("2952")) {
            {}
          } else {
            stryCov_9fa48("2952");
            return reply.status(400).send(stryMutAct_9fa48("2953") ? {} : (stryCov_9fa48("2953"), {
              success: stryMutAct_9fa48("2954") ? true : (stryCov_9fa48("2954"), false),
              error: error.message
            }));
          }
        }
      }
    });

    /**
     * @swagger
     * /api/users/barbeiros:
     *   get:
     *     tags: [users]
     *     summary: Listar barbeiros com filtros (unificado)
     *     parameters:
     *       - in: query
     *         name: barbearia_id
     *         schema:
     *           type: integer
     *       - in: query
     *         name: status
     *         schema:
     *           type: string
     *           enum: [ativo, inativo, disponivel]
     *       - in: query
     *         name: public
     *         schema:
     *           type: boolean
     *           description: Se true, retorna dados limitados para clientes
     *     responses:
     *       200:
     *         description: Lista de barbeiros
     */
    fastify.get(stryMutAct_9fa48("2955") ? "" : (stryCov_9fa48("2955"), '/barbeiros'), async (request, reply) => {
      if (stryMutAct_9fa48("2956")) {
        {}
      } else {
        stryCov_9fa48("2956");
        try {
          if (stryMutAct_9fa48("2957")) {
            {}
          } else {
            stryCov_9fa48("2957");
            const {
              barbearia_id,
              status = stryMutAct_9fa48("2958") ? "" : (stryCov_9fa48("2958"), 'ativo'),
              public: isPublic = stryMutAct_9fa48("2959") ? true : (stryCov_9fa48("2959"), false)
            } = request.query;

            // Se é público, não requer autenticação
            if (stryMutAct_9fa48("2962") ? false : stryMutAct_9fa48("2961") ? true : stryMutAct_9fa48("2960") ? isPublic : (stryCov_9fa48("2960", "2961", "2962"), !isPublic)) {
              if (stryMutAct_9fa48("2963")) {
                {}
              } else {
                stryCov_9fa48("2963");
                // Verificar autenticação para dados privados
                try {
                  if (stryMutAct_9fa48("2964")) {
                    {}
                  } else {
                    stryCov_9fa48("2964");
                    await request.jwtVerify();
                  }
                } catch (err) {
                  if (stryMutAct_9fa48("2965")) {
                    {}
                  } else {
                    stryCov_9fa48("2965");
                    return reply.status(401).send(stryMutAct_9fa48("2966") ? {} : (stryCov_9fa48("2966"), {
                      success: stryMutAct_9fa48("2967") ? true : (stryCov_9fa48("2967"), false),
                      error: stryMutAct_9fa48("2968") ? "" : (stryCov_9fa48("2968"), 'Token inválido ou expirado')
                    }));
                  }
                }
              }
            }

            // Construir query base
            let query = supabase.from(stryMutAct_9fa48("2969") ? "" : (stryCov_9fa48("2969"), 'barbeiros_barbearias')).select(stryMutAct_9fa48("2970") ? `` : (stryCov_9fa48("2970"), `
          user_id,
          especialidade,
          dias_trabalho,
          horario_inicio,
          horario_fim,
          ativo,
          disponivel,
          users(id, nome, email, telefone)
        `));

            // Aplicar filtros
            if (stryMutAct_9fa48("2972") ? false : stryMutAct_9fa48("2971") ? true : (stryCov_9fa48("2971", "2972"), barbearia_id)) {
              if (stryMutAct_9fa48("2973")) {
                {}
              } else {
                stryCov_9fa48("2973");
                query = query.eq(stryMutAct_9fa48("2974") ? "" : (stryCov_9fa48("2974"), 'barbearia_id'), barbearia_id);
              }
            }
            if (stryMutAct_9fa48("2977") ? status !== 'ativo' : stryMutAct_9fa48("2976") ? false : stryMutAct_9fa48("2975") ? true : (stryCov_9fa48("2975", "2976", "2977"), status === (stryMutAct_9fa48("2978") ? "" : (stryCov_9fa48("2978"), 'ativo')))) {
              if (stryMutAct_9fa48("2979")) {
                {}
              } else {
                stryCov_9fa48("2979");
                query = query.eq(stryMutAct_9fa48("2980") ? "" : (stryCov_9fa48("2980"), 'ativo'), stryMutAct_9fa48("2981") ? false : (stryCov_9fa48("2981"), true));
              }
            } else if (stryMutAct_9fa48("2984") ? status !== 'inativo' : stryMutAct_9fa48("2983") ? false : stryMutAct_9fa48("2982") ? true : (stryCov_9fa48("2982", "2983", "2984"), status === (stryMutAct_9fa48("2985") ? "" : (stryCov_9fa48("2985"), 'inativo')))) {
              if (stryMutAct_9fa48("2986")) {
                {}
              } else {
                stryCov_9fa48("2986");
                query = query.eq(stryMutAct_9fa48("2987") ? "" : (stryCov_9fa48("2987"), 'ativo'), stryMutAct_9fa48("2988") ? true : (stryCov_9fa48("2988"), false));
              }
            } else if (stryMutAct_9fa48("2991") ? status !== 'disponivel' : stryMutAct_9fa48("2990") ? false : stryMutAct_9fa48("2989") ? true : (stryCov_9fa48("2989", "2990", "2991"), status === (stryMutAct_9fa48("2992") ? "" : (stryCov_9fa48("2992"), 'disponivel')))) {
              if (stryMutAct_9fa48("2993")) {
                {}
              } else {
                stryCov_9fa48("2993");
                query = query.eq(stryMutAct_9fa48("2994") ? "" : (stryCov_9fa48("2994"), 'disponivel'), stryMutAct_9fa48("2995") ? false : (stryCov_9fa48("2995"), true));
              }
            }
            const {
              data: barbeiros,
              error
            } = await query;
            if (stryMutAct_9fa48("2997") ? false : stryMutAct_9fa48("2996") ? true : (stryCov_9fa48("2996", "2997"), error)) {
              if (stryMutAct_9fa48("2998")) {
                {}
              } else {
                stryCov_9fa48("2998");
                return reply.status(500).send(stryMutAct_9fa48("2999") ? {} : (stryCov_9fa48("2999"), {
                  success: stryMutAct_9fa48("3000") ? true : (stryCov_9fa48("3000"), false),
                  error: stryMutAct_9fa48("3001") ? "" : (stryCov_9fa48("3001"), 'Erro ao buscar barbeiros')
                }));
              }
            }

            // Formatar dados baseado no tipo de acesso
            const barbeirosFormatados = stryMutAct_9fa48("3004") ? barbeiros?.map(bb => {
              if (isPublic) {
                // Dados limitados para clientes
                return {
                  id: bb.user_id,
                  nome: bb.users?.nome || 'Barbeiro',
                  especialidade: bb.especialidade || 'Corte geral',
                  dias_trabalho: bb.dias_trabalho || [],
                  horario_inicio: bb.horario_inicio,
                  horario_fim: bb.horario_fim
                };
              } else {
                // Dados completos para funcionários
                return {
                  id: bb.user_id,
                  nome: bb.users?.nome || 'Barbeiro',
                  email: bb.users?.email,
                  telefone: bb.users?.telefone,
                  especialidade: bb.especialidade,
                  dias_trabalho: bb.dias_trabalho || [],
                  horario_inicio: bb.horario_inicio,
                  horario_fim: bb.horario_fim,
                  ativo: bb.ativo,
                  disponivel: bb.disponivel
                };
              }
            }) && [] : stryMutAct_9fa48("3003") ? false : stryMutAct_9fa48("3002") ? true : (stryCov_9fa48("3002", "3003", "3004"), (stryMutAct_9fa48("3005") ? barbeiros.map(bb => {
              if (isPublic) {
                // Dados limitados para clientes
                return {
                  id: bb.user_id,
                  nome: bb.users?.nome || 'Barbeiro',
                  especialidade: bb.especialidade || 'Corte geral',
                  dias_trabalho: bb.dias_trabalho || [],
                  horario_inicio: bb.horario_inicio,
                  horario_fim: bb.horario_fim
                };
              } else {
                // Dados completos para funcionários
                return {
                  id: bb.user_id,
                  nome: bb.users?.nome || 'Barbeiro',
                  email: bb.users?.email,
                  telefone: bb.users?.telefone,
                  especialidade: bb.especialidade,
                  dias_trabalho: bb.dias_trabalho || [],
                  horario_inicio: bb.horario_inicio,
                  horario_fim: bb.horario_fim,
                  ativo: bb.ativo,
                  disponivel: bb.disponivel
                };
              }
            }) : (stryCov_9fa48("3005"), barbeiros?.map(bb => {
              if (stryMutAct_9fa48("3006")) {
                {}
              } else {
                stryCov_9fa48("3006");
                if (stryMutAct_9fa48("3008") ? false : stryMutAct_9fa48("3007") ? true : (stryCov_9fa48("3007", "3008"), isPublic)) {
                  if (stryMutAct_9fa48("3009")) {
                    {}
                  } else {
                    stryCov_9fa48("3009");
                    // Dados limitados para clientes
                    return stryMutAct_9fa48("3010") ? {} : (stryCov_9fa48("3010"), {
                      id: bb.user_id,
                      nome: stryMutAct_9fa48("3013") ? bb.users?.nome && 'Barbeiro' : stryMutAct_9fa48("3012") ? false : stryMutAct_9fa48("3011") ? true : (stryCov_9fa48("3011", "3012", "3013"), (stryMutAct_9fa48("3014") ? bb.users.nome : (stryCov_9fa48("3014"), bb.users?.nome)) || (stryMutAct_9fa48("3015") ? "" : (stryCov_9fa48("3015"), 'Barbeiro'))),
                      especialidade: stryMutAct_9fa48("3018") ? bb.especialidade && 'Corte geral' : stryMutAct_9fa48("3017") ? false : stryMutAct_9fa48("3016") ? true : (stryCov_9fa48("3016", "3017", "3018"), bb.especialidade || (stryMutAct_9fa48("3019") ? "" : (stryCov_9fa48("3019"), 'Corte geral'))),
                      dias_trabalho: stryMutAct_9fa48("3022") ? bb.dias_trabalho && [] : stryMutAct_9fa48("3021") ? false : stryMutAct_9fa48("3020") ? true : (stryCov_9fa48("3020", "3021", "3022"), bb.dias_trabalho || (stryMutAct_9fa48("3023") ? ["Stryker was here"] : (stryCov_9fa48("3023"), []))),
                      horario_inicio: bb.horario_inicio,
                      horario_fim: bb.horario_fim
                    });
                  }
                } else {
                  if (stryMutAct_9fa48("3024")) {
                    {}
                  } else {
                    stryCov_9fa48("3024");
                    // Dados completos para funcionários
                    return stryMutAct_9fa48("3025") ? {} : (stryCov_9fa48("3025"), {
                      id: bb.user_id,
                      nome: stryMutAct_9fa48("3028") ? bb.users?.nome && 'Barbeiro' : stryMutAct_9fa48("3027") ? false : stryMutAct_9fa48("3026") ? true : (stryCov_9fa48("3026", "3027", "3028"), (stryMutAct_9fa48("3029") ? bb.users.nome : (stryCov_9fa48("3029"), bb.users?.nome)) || (stryMutAct_9fa48("3030") ? "" : (stryCov_9fa48("3030"), 'Barbeiro'))),
                      email: stryMutAct_9fa48("3031") ? bb.users.email : (stryCov_9fa48("3031"), bb.users?.email),
                      telefone: stryMutAct_9fa48("3032") ? bb.users.telefone : (stryCov_9fa48("3032"), bb.users?.telefone),
                      especialidade: bb.especialidade,
                      dias_trabalho: stryMutAct_9fa48("3035") ? bb.dias_trabalho && [] : stryMutAct_9fa48("3034") ? false : stryMutAct_9fa48("3033") ? true : (stryCov_9fa48("3033", "3034", "3035"), bb.dias_trabalho || (stryMutAct_9fa48("3036") ? ["Stryker was here"] : (stryCov_9fa48("3036"), []))),
                      horario_inicio: bb.horario_inicio,
                      horario_fim: bb.horario_fim,
                      ativo: bb.ativo,
                      disponivel: bb.disponivel
                    });
                  }
                }
              }
            }))) || (stryMutAct_9fa48("3037") ? ["Stryker was here"] : (stryCov_9fa48("3037"), [])));

            // Estrutura de resposta padronizada
            const response = stryMutAct_9fa48("3038") ? {} : (stryCov_9fa48("3038"), {
              success: stryMutAct_9fa48("3039") ? false : (stryCov_9fa48("3039"), true),
              data: stryMutAct_9fa48("3040") ? {} : (stryCov_9fa48("3040"), {
                barbeiros: barbeirosFormatados,
                total: barbeirosFormatados.length,
                filtros: stryMutAct_9fa48("3041") ? {} : (stryCov_9fa48("3041"), {
                  barbearia_id,
                  status,
                  public: isPublic
                })
              })
            });

            // Adicionar dados da barbearia se especificada
            if (stryMutAct_9fa48("3043") ? false : stryMutAct_9fa48("3042") ? true : (stryCov_9fa48("3042", "3043"), barbearia_id)) {
              if (stryMutAct_9fa48("3044")) {
                {}
              } else {
                stryCov_9fa48("3044");
                const {
                  data: barbearia
                } = await supabase.from(stryMutAct_9fa48("3045") ? "" : (stryCov_9fa48("3045"), 'barbearias')).select(stryMutAct_9fa48("3046") ? "" : (stryCov_9fa48("3046"), 'id, nome')).eq(stryMutAct_9fa48("3047") ? "" : (stryCov_9fa48("3047"), 'id'), barbearia_id).single();
                if (stryMutAct_9fa48("3049") ? false : stryMutAct_9fa48("3048") ? true : (stryCov_9fa48("3048", "3049"), barbearia)) {
                  if (stryMutAct_9fa48("3050")) {
                    {}
                  } else {
                    stryCov_9fa48("3050");
                    response.data.barbearia = barbearia;
                  }
                }
              }
            }
            return reply.send(response);
          }
        } catch (error) {
          if (stryMutAct_9fa48("3051")) {
            {}
          } else {
            stryCov_9fa48("3051");
            return reply.status(500).send(stryMutAct_9fa48("3052") ? {} : (stryCov_9fa48("3052"), {
              success: stryMutAct_9fa48("3053") ? true : (stryCov_9fa48("3053"), false),
              error: stryMutAct_9fa48("3054") ? "" : (stryCov_9fa48("3054"), 'Erro interno do servidor')
            }));
          }
        }
      }
    });

    /**
     * @swagger
     * /api/users/barbeiros/meu-status:
     *   get:
     *     tags: [users]
     *     summary: Obter status do barbeiro autenticado nas barbearias
     *     security:
     *       - Bearer: []
     *     responses:
     *       200:
     *         description: Status do barbeiro nas barbearias
     *       403:
     *         description: Acesso negado
     */
    fastify.get(stryMutAct_9fa48("3055") ? "" : (stryCov_9fa48("3055"), '/barbeiros/meu-status'), stryMutAct_9fa48("3056") ? {} : (stryCov_9fa48("3056"), {
      preValidation: stryMutAct_9fa48("3057") ? [] : (stryCov_9fa48("3057"), [fastify.authenticate, checkBarbeiroRole])
    }), async (request, reply) => {
      if (stryMutAct_9fa48("3058")) {
        {}
      } else {
        stryCov_9fa48("3058");
        try {
          if (stryMutAct_9fa48("3059")) {
            {}
          } else {
            stryCov_9fa48("3059");
            const userId = request.user.id;

            // Verificar se o usuário é um barbeiro
            const {
              data: user,
              error: userError
            } = await supabase.from(stryMutAct_9fa48("3060") ? "" : (stryCov_9fa48("3060"), 'users')).select(stryMutAct_9fa48("3061") ? "" : (stryCov_9fa48("3061"), 'id, email, nome, telefone, role, active')).eq(stryMutAct_9fa48("3062") ? "" : (stryCov_9fa48("3062"), 'id'), userId).eq(stryMutAct_9fa48("3063") ? "" : (stryCov_9fa48("3063"), 'role'), stryMutAct_9fa48("3064") ? "" : (stryCov_9fa48("3064"), 'barbeiro')).single();
            if (stryMutAct_9fa48("3067") ? userError && !user : stryMutAct_9fa48("3066") ? false : stryMutAct_9fa48("3065") ? true : (stryCov_9fa48("3065", "3066", "3067"), userError || (stryMutAct_9fa48("3068") ? user : (stryCov_9fa48("3068"), !user)))) {
              if (stryMutAct_9fa48("3069")) {
                {}
              } else {
                stryCov_9fa48("3069");
                return reply.status(403).send(stryMutAct_9fa48("3070") ? {} : (stryCov_9fa48("3070"), {
                  success: stryMutAct_9fa48("3071") ? true : (stryCov_9fa48("3071"), false),
                  error: stryMutAct_9fa48("3072") ? "" : (stryCov_9fa48("3072"), 'Acesso negado. Apenas barbeiros podem acessar este endpoint.')
                }));
              }
            }

            // Buscar status nas barbearias
            const {
              data: statusBarbearias,
              error: statusError
            } = await supabase.from(stryMutAct_9fa48("3073") ? "" : (stryCov_9fa48("3073"), 'barbeiros_barbearias')).select(stryMutAct_9fa48("3074") ? `` : (stryCov_9fa48("3074"), `
          barbearia_id,
          ativo,
          disponivel,
          especialidade,
          dias_trabalho,
          horario_inicio,
          horario_fim,
          barbearias!inner(nome, endereco, ativo)
        `)).eq(stryMutAct_9fa48("3075") ? "" : (stryCov_9fa48("3075"), 'user_id'), userId);
            if (stryMutAct_9fa48("3077") ? false : stryMutAct_9fa48("3076") ? true : (stryCov_9fa48("3076", "3077"), statusError)) {
              if (stryMutAct_9fa48("3078")) {
                {}
              } else {
                stryCov_9fa48("3078");
                throw new Error(stryMutAct_9fa48("3079") ? "" : (stryCov_9fa48("3079"), 'Erro ao buscar status nas barbearias'));
              }
            }
            return reply.send(stryMutAct_9fa48("3080") ? {} : (stryCov_9fa48("3080"), {
              success: stryMutAct_9fa48("3081") ? false : (stryCov_9fa48("3081"), true),
              data: stryMutAct_9fa48("3082") ? {} : (stryCov_9fa48("3082"), {
                ...user,
                barbearias: stryMutAct_9fa48("3085") ? statusBarbearias && [] : stryMutAct_9fa48("3084") ? false : stryMutAct_9fa48("3083") ? true : (stryCov_9fa48("3083", "3084", "3085"), statusBarbearias || (stryMutAct_9fa48("3086") ? ["Stryker was here"] : (stryCov_9fa48("3086"), [])))
              })
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("3087")) {
            {}
          } else {
            stryCov_9fa48("3087");
            return reply.status(400).send(stryMutAct_9fa48("3088") ? {} : (stryCov_9fa48("3088"), {
              success: stryMutAct_9fa48("3089") ? true : (stryCov_9fa48("3089"), false),
              error: error.message
            }));
          }
        }
      }
    });

    /**
     * @swagger
     * /api/users/barbeiros/ativar:
     *   post:
     *     tags: [users]
     *     summary: Ativar barbeiro em uma barbearia específica
     *     security:
     *       - Bearer: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [barbearia_id]
     *             properties:
     *               barbearia_id:
     *                 type: integer
     *                 description: ID da barbearia onde o barbeiro será ativado
     *               especialidade:
     *                 type: string
     *               dias_trabalho:
     *                 type: array
     *                 items:
     *                   type: string
     *               horario_inicio:
     *                 type: string
     *                 format: time
     *               horario_fim:
     *                 type: string
     *                 format: time
     *     responses:
     *       200:
     *         description: Barbeiro ativado com sucesso
     *       400:
     *         description: Barbeiro já está ativo em outra barbearia
     *       403:
     *         description: Acesso negado
     */
    fastify.post(stryMutAct_9fa48("3090") ? "" : (stryCov_9fa48("3090"), '/barbeiros/ativar'), stryMutAct_9fa48("3091") ? {} : (stryCov_9fa48("3091"), {
      preValidation: stryMutAct_9fa48("3092") ? [] : (stryCov_9fa48("3092"), [fastify.authenticate, checkBarbeiroRole])
    }), async (request, reply) => {
      if (stryMutAct_9fa48("3093")) {
        {}
      } else {
        stryCov_9fa48("3093");
        try {
          if (stryMutAct_9fa48("3094")) {
            {}
          } else {
            stryCov_9fa48("3094");
            const userId = request.user.id;
            const {
              barbearia_id,
              especialidade,
              dias_trabalho,
              horario_inicio,
              horario_fim
            } = request.body;

            // Verificar se o usuário é um barbeiro
            const {
              data: user,
              error: userError
            } = await supabase.from(stryMutAct_9fa48("3095") ? "" : (stryCov_9fa48("3095"), 'users')).select(stryMutAct_9fa48("3096") ? "" : (stryCov_9fa48("3096"), 'id, nome, role')).eq(stryMutAct_9fa48("3097") ? "" : (stryCov_9fa48("3097"), 'id'), userId).eq(stryMutAct_9fa48("3098") ? "" : (stryCov_9fa48("3098"), 'role'), stryMutAct_9fa48("3099") ? "" : (stryCov_9fa48("3099"), 'barbeiro')).single();
            if (stryMutAct_9fa48("3102") ? userError && !user : stryMutAct_9fa48("3101") ? false : stryMutAct_9fa48("3100") ? true : (stryCov_9fa48("3100", "3101", "3102"), userError || (stryMutAct_9fa48("3103") ? user : (stryCov_9fa48("3103"), !user)))) {
              if (stryMutAct_9fa48("3104")) {
                {}
              } else {
                stryCov_9fa48("3104");
                return reply.status(403).send(stryMutAct_9fa48("3105") ? {} : (stryCov_9fa48("3105"), {
                  success: stryMutAct_9fa48("3106") ? true : (stryCov_9fa48("3106"), false),
                  error: stryMutAct_9fa48("3107") ? "" : (stryCov_9fa48("3107"), 'Acesso negado. Apenas barbeiros podem acessar este endpoint.')
                }));
              }
            }

            // Verificar se o barbeiro já está ativo em outra barbearia
            const {
              data: barbeiroAtivo,
              error: ativoError
            } = await supabase.from(stryMutAct_9fa48("3108") ? "" : (stryCov_9fa48("3108"), 'barbeiros_barbearias')).select(stryMutAct_9fa48("3109") ? `` : (stryCov_9fa48("3109"), `
          barbearia_id,
          ativo,
          barbearias!inner(nome)
        `)).eq(stryMutAct_9fa48("3110") ? "" : (stryCov_9fa48("3110"), 'user_id'), userId).eq(stryMutAct_9fa48("3111") ? "" : (stryCov_9fa48("3111"), 'ativo'), stryMutAct_9fa48("3112") ? false : (stryCov_9fa48("3112"), true)).neq(stryMutAct_9fa48("3113") ? "" : (stryCov_9fa48("3113"), 'barbearia_id'), barbearia_id).single();
            if (stryMutAct_9fa48("3116") ? ativoError || ativoError.code !== 'PGRST116' : stryMutAct_9fa48("3115") ? false : stryMutAct_9fa48("3114") ? true : (stryCov_9fa48("3114", "3115", "3116"), ativoError && (stryMutAct_9fa48("3118") ? ativoError.code === 'PGRST116' : stryMutAct_9fa48("3117") ? true : (stryCov_9fa48("3117", "3118"), ativoError.code !== (stryMutAct_9fa48("3119") ? "" : (stryCov_9fa48("3119"), 'PGRST116')))))) {
              if (stryMutAct_9fa48("3120")) {
                {}
              } else {
                stryCov_9fa48("3120");
                throw new Error(stryMutAct_9fa48("3121") ? "" : (stryCov_9fa48("3121"), 'Erro ao verificar status do barbeiro'));
              }
            }
            if (stryMutAct_9fa48("3123") ? false : stryMutAct_9fa48("3122") ? true : (stryCov_9fa48("3122", "3123"), barbeiroAtivo)) {
              if (stryMutAct_9fa48("3124")) {
                {}
              } else {
                stryCov_9fa48("3124");
                return reply.status(400).send(stryMutAct_9fa48("3125") ? {} : (stryCov_9fa48("3125"), {
                  success: stryMutAct_9fa48("3126") ? true : (stryCov_9fa48("3126"), false),
                  error: stryMutAct_9fa48("3127") ? `` : (stryCov_9fa48("3127"), `Você já está ativo na barbearia '${barbeiroAtivo.barbearias.nome}'. Desative-se primeiro para ativar em outra barbearia.`),
                  code: stryMutAct_9fa48("3128") ? "" : (stryCov_9fa48("3128"), 'BARBEIRO_JA_ATIVO'),
                  barbearia_atual: barbeiroAtivo.barbearias.nome
                }));
              }
            }

            // Verificar se a barbearia existe
            const {
              data: barbearia,
              error: barbeariaError
            } = await supabase.from(stryMutAct_9fa48("3129") ? "" : (stryCov_9fa48("3129"), 'barbearias')).select(stryMutAct_9fa48("3130") ? "" : (stryCov_9fa48("3130"), 'id, nome')).eq(stryMutAct_9fa48("3131") ? "" : (stryCov_9fa48("3131"), 'id'), barbearia_id).eq(stryMutAct_9fa48("3132") ? "" : (stryCov_9fa48("3132"), 'ativo'), stryMutAct_9fa48("3133") ? false : (stryCov_9fa48("3133"), true)).single();
            if (stryMutAct_9fa48("3135") ? false : stryMutAct_9fa48("3134") ? true : (stryCov_9fa48("3134", "3135"), barbeariaError)) {
              if (stryMutAct_9fa48("3136")) {
                {}
              } else {
                stryCov_9fa48("3136");
                console.error(stryMutAct_9fa48("3137") ? "" : (stryCov_9fa48("3137"), 'Erro ao buscar barbearia:'), barbeariaError);
                return reply.status(400).send(stryMutAct_9fa48("3138") ? {} : (stryCov_9fa48("3138"), {
                  success: stryMutAct_9fa48("3139") ? true : (stryCov_9fa48("3139"), false),
                  error: stryMutAct_9fa48("3140") ? `` : (stryCov_9fa48("3140"), `Erro ao buscar barbearia: ${barbeariaError.message}`)
                }));
              }
            }
            if (stryMutAct_9fa48("3143") ? false : stryMutAct_9fa48("3142") ? true : stryMutAct_9fa48("3141") ? barbearia : (stryCov_9fa48("3141", "3142", "3143"), !barbearia)) {
              if (stryMutAct_9fa48("3144")) {
                {}
              } else {
                stryCov_9fa48("3144");
                return reply.status(400).send(stryMutAct_9fa48("3145") ? {} : (stryCov_9fa48("3145"), {
                  success: stryMutAct_9fa48("3146") ? true : (stryCov_9fa48("3146"), false),
                  error: stryMutAct_9fa48("3147") ? `` : (stryCov_9fa48("3147"), `Barbearia com ID ${barbearia_id} não encontrada ou inativa`)
                }));
              }
            }

            // Desativar barbeiro em todas as outras barbearias
            const {
              error: desativacaoError
            } = await supabase.from(stryMutAct_9fa48("3148") ? "" : (stryCov_9fa48("3148"), 'barbeiros_barbearias')).update(stryMutAct_9fa48("3149") ? {} : (stryCov_9fa48("3149"), {
              ativo: stryMutAct_9fa48("3150") ? true : (stryCov_9fa48("3150"), false)
            })).eq(stryMutAct_9fa48("3151") ? "" : (stryCov_9fa48("3151"), 'user_id'), userId);
            if (stryMutAct_9fa48("3153") ? false : stryMutAct_9fa48("3152") ? true : (stryCov_9fa48("3152", "3153"), desativacaoError)) {
              if (stryMutAct_9fa48("3154")) {
                {}
              } else {
                stryCov_9fa48("3154");
                console.error(stryMutAct_9fa48("3155") ? "" : (stryCov_9fa48("3155"), 'Erro ao desativar barbeiro:'), desativacaoError);
                return reply.status(400).send(stryMutAct_9fa48("3156") ? {} : (stryCov_9fa48("3156"), {
                  success: stryMutAct_9fa48("3157") ? true : (stryCov_9fa48("3157"), false),
                  error: stryMutAct_9fa48("3158") ? `` : (stryCov_9fa48("3158"), `Erro ao desativar barbeiro: ${desativacaoError.message}`)
                }));
              }
            }

            // Verificar se já existe registro para este barbeiro e barbearia
            const {
              data: registroExistente,
              error: checkError
            } = await supabase.from(stryMutAct_9fa48("3159") ? "" : (stryCov_9fa48("3159"), 'barbeiros_barbearias')).select(stryMutAct_9fa48("3160") ? "" : (stryCov_9fa48("3160"), 'id')).eq(stryMutAct_9fa48("3161") ? "" : (stryCov_9fa48("3161"), 'user_id'), userId).eq(stryMutAct_9fa48("3162") ? "" : (stryCov_9fa48("3162"), 'barbearia_id'), barbearia_id).single();
            if (stryMutAct_9fa48("3165") ? checkError || checkError.code !== 'PGRST116' : stryMutAct_9fa48("3164") ? false : stryMutAct_9fa48("3163") ? true : (stryCov_9fa48("3163", "3164", "3165"), checkError && (stryMutAct_9fa48("3167") ? checkError.code === 'PGRST116' : stryMutAct_9fa48("3166") ? true : (stryCov_9fa48("3166", "3167"), checkError.code !== (stryMutAct_9fa48("3168") ? "" : (stryCov_9fa48("3168"), 'PGRST116')))))) {
              if (stryMutAct_9fa48("3169")) {
                {}
              } else {
                stryCov_9fa48("3169");
                console.error(stryMutAct_9fa48("3170") ? "" : (stryCov_9fa48("3170"), 'Erro ao verificar registro existente:'), checkError);
                return reply.status(400).send(stryMutAct_9fa48("3171") ? {} : (stryCov_9fa48("3171"), {
                  success: stryMutAct_9fa48("3172") ? true : (stryCov_9fa48("3172"), false),
                  error: stryMutAct_9fa48("3173") ? `` : (stryCov_9fa48("3173"), `Erro ao verificar registro existente: ${checkError.message}`)
                }));
              }
            }
            let resultado;
            let ativacaoError;
            if (stryMutAct_9fa48("3175") ? false : stryMutAct_9fa48("3174") ? true : (stryCov_9fa48("3174", "3175"), registroExistente)) {
              if (stryMutAct_9fa48("3176")) {
                {}
              } else {
                stryCov_9fa48("3176");
                // Atualizar registro existente
                const {
                  data: updateResult,
                  error: updateError
                } = await supabase.from(stryMutAct_9fa48("3177") ? "" : (stryCov_9fa48("3177"), 'barbeiros_barbearias')).update(stryMutAct_9fa48("3178") ? {} : (stryCov_9fa48("3178"), {
                  especialidade: stryMutAct_9fa48("3181") ? especialidade && null : stryMutAct_9fa48("3180") ? false : stryMutAct_9fa48("3179") ? true : (stryCov_9fa48("3179", "3180", "3181"), especialidade || null),
                  dias_trabalho: stryMutAct_9fa48("3184") ? dias_trabalho && [] : stryMutAct_9fa48("3183") ? false : stryMutAct_9fa48("3182") ? true : (stryCov_9fa48("3182", "3183", "3184"), dias_trabalho || (stryMutAct_9fa48("3185") ? ["Stryker was here"] : (stryCov_9fa48("3185"), []))),
                  horario_inicio: stryMutAct_9fa48("3188") ? horario_inicio && '08:00' : stryMutAct_9fa48("3187") ? false : stryMutAct_9fa48("3186") ? true : (stryCov_9fa48("3186", "3187", "3188"), horario_inicio || (stryMutAct_9fa48("3189") ? "" : (stryCov_9fa48("3189"), '08:00'))),
                  horario_fim: stryMutAct_9fa48("3192") ? horario_fim && '18:00' : stryMutAct_9fa48("3191") ? false : stryMutAct_9fa48("3190") ? true : (stryCov_9fa48("3190", "3191", "3192"), horario_fim || (stryMutAct_9fa48("3193") ? "" : (stryCov_9fa48("3193"), '18:00'))),
                  ativo: stryMutAct_9fa48("3194") ? false : (stryCov_9fa48("3194"), true),
                  updated_at: new Date().toISOString()
                })).eq(stryMutAct_9fa48("3195") ? "" : (stryCov_9fa48("3195"), 'id'), registroExistente.id).select(stryMutAct_9fa48("3196") ? `` : (stryCov_9fa48("3196"), `
            *,
            barbearias!inner(nome, endereco)
          `)).single();
                resultado = updateResult;
                ativacaoError = updateError;
              }
            } else {
              if (stryMutAct_9fa48("3197")) {
                {}
              } else {
                stryCov_9fa48("3197");
                // Criar novo registro
                const {
                  data: insertResult,
                  error: insertError
                } = await supabase.from(stryMutAct_9fa48("3198") ? "" : (stryCov_9fa48("3198"), 'barbeiros_barbearias')).insert(stryMutAct_9fa48("3199") ? {} : (stryCov_9fa48("3199"), {
                  user_id: userId,
                  barbearia_id: barbearia_id,
                  especialidade: stryMutAct_9fa48("3202") ? especialidade && null : stryMutAct_9fa48("3201") ? false : stryMutAct_9fa48("3200") ? true : (stryCov_9fa48("3200", "3201", "3202"), especialidade || null),
                  dias_trabalho: stryMutAct_9fa48("3205") ? dias_trabalho && [] : stryMutAct_9fa48("3204") ? false : stryMutAct_9fa48("3203") ? true : (stryCov_9fa48("3203", "3204", "3205"), dias_trabalho || (stryMutAct_9fa48("3206") ? ["Stryker was here"] : (stryCov_9fa48("3206"), []))),
                  horario_inicio: stryMutAct_9fa48("3209") ? horario_inicio && '08:00' : stryMutAct_9fa48("3208") ? false : stryMutAct_9fa48("3207") ? true : (stryCov_9fa48("3207", "3208", "3209"), horario_inicio || (stryMutAct_9fa48("3210") ? "" : (stryCov_9fa48("3210"), '08:00'))),
                  horario_fim: stryMutAct_9fa48("3213") ? horario_fim && '18:00' : stryMutAct_9fa48("3212") ? false : stryMutAct_9fa48("3211") ? true : (stryCov_9fa48("3211", "3212", "3213"), horario_fim || (stryMutAct_9fa48("3214") ? "" : (stryCov_9fa48("3214"), '18:00'))),
                  ativo: stryMutAct_9fa48("3215") ? false : (stryCov_9fa48("3215"), true)
                })).select(stryMutAct_9fa48("3216") ? `` : (stryCov_9fa48("3216"), `
            *,
            barbearias!inner(nome, endereco)
          `)).single();
                resultado = insertResult;
                ativacaoError = insertError;
              }
            }
            if (stryMutAct_9fa48("3218") ? false : stryMutAct_9fa48("3217") ? true : (stryCov_9fa48("3217", "3218"), ativacaoError)) {
              if (stryMutAct_9fa48("3219")) {
                {}
              } else {
                stryCov_9fa48("3219");
                console.error(stryMutAct_9fa48("3220") ? "" : (stryCov_9fa48("3220"), 'Erro ao ativar barbeiro:'), ativacaoError);
                return reply.status(400).send(stryMutAct_9fa48("3221") ? {} : (stryCov_9fa48("3221"), {
                  success: stryMutAct_9fa48("3222") ? true : (stryCov_9fa48("3222"), false),
                  error: stryMutAct_9fa48("3223") ? `` : (stryCov_9fa48("3223"), `Erro ao ativar barbeiro na barbearia: ${ativacaoError.message}`)
                }));
              }
            }
            return reply.send(stryMutAct_9fa48("3224") ? {} : (stryCov_9fa48("3224"), {
              success: stryMutAct_9fa48("3225") ? false : (stryCov_9fa48("3225"), true),
              message: stryMutAct_9fa48("3226") ? `` : (stryCov_9fa48("3226"), `Você foi ativado com sucesso na barbearia ${barbearia.nome}`),
              data: resultado
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("3227")) {
            {}
          } else {
            stryCov_9fa48("3227");
            return reply.status(400).send(stryMutAct_9fa48("3228") ? {} : (stryCov_9fa48("3228"), {
              success: stryMutAct_9fa48("3229") ? true : (stryCov_9fa48("3229"), false),
              error: error.message
            }));
          }
        }
      }
    });

    /**
     * @swagger
     * /api/users/barbeiros/desativar:
     *   post:
     *     tags: [users]
     *     summary: Desativar barbeiro de uma barbearia específica
     *     security:
     *       - Bearer: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [barbearia_id]
     *             properties:
     *               barbearia_id:
     *                 type: integer
     *                 description: ID da barbearia onde o barbeiro será desativado
     *     responses:
     *       200:
     *         description: Barbeiro desativado com sucesso
     *       400:
     *         description: Dados inválidos
     *       403:
     *         description: Acesso negado
     */
    fastify.post(stryMutAct_9fa48("3230") ? "" : (stryCov_9fa48("3230"), '/barbeiros/desativar'), stryMutAct_9fa48("3231") ? {} : (stryCov_9fa48("3231"), {
      preValidation: stryMutAct_9fa48("3232") ? [] : (stryCov_9fa48("3232"), [fastify.authenticate, checkBarbeiroRole])
    }), async (request, reply) => {
      if (stryMutAct_9fa48("3233")) {
        {}
      } else {
        stryCov_9fa48("3233");
        try {
          if (stryMutAct_9fa48("3234")) {
            {}
          } else {
            stryCov_9fa48("3234");
            const userId = request.user.id;
            const {
              barbearia_id
            } = request.body;

            // Verificar se o usuário é um barbeiro
            const {
              data: user,
              error: userError
            } = await supabase.from(stryMutAct_9fa48("3235") ? "" : (stryCov_9fa48("3235"), 'users')).select(stryMutAct_9fa48("3236") ? "" : (stryCov_9fa48("3236"), 'id, nome, role')).eq(stryMutAct_9fa48("3237") ? "" : (stryCov_9fa48("3237"), 'id'), userId).eq(stryMutAct_9fa48("3238") ? "" : (stryCov_9fa48("3238"), 'role'), stryMutAct_9fa48("3239") ? "" : (stryCov_9fa48("3239"), 'barbeiro')).single();
            if (stryMutAct_9fa48("3242") ? userError && !user : stryMutAct_9fa48("3241") ? false : stryMutAct_9fa48("3240") ? true : (stryCov_9fa48("3240", "3241", "3242"), userError || (stryMutAct_9fa48("3243") ? user : (stryCov_9fa48("3243"), !user)))) {
              if (stryMutAct_9fa48("3244")) {
                {}
              } else {
                stryCov_9fa48("3244");
                return reply.status(403).send(stryMutAct_9fa48("3245") ? {} : (stryCov_9fa48("3245"), {
                  success: stryMutAct_9fa48("3246") ? true : (stryCov_9fa48("3246"), false),
                  error: stryMutAct_9fa48("3247") ? "" : (stryCov_9fa48("3247"), 'Acesso negado. Apenas barbeiros podem acessar este endpoint.')
                }));
              }
            }

            // Verificar se o barbeiro está ativo na barbearia
            const {
              data: statusAtual,
              error: statusError
            } = await supabase.from(stryMutAct_9fa48("3248") ? "" : (stryCov_9fa48("3248"), 'barbeiros_barbearias')).select(stryMutAct_9fa48("3249") ? "" : (stryCov_9fa48("3249"), 'ativo, barbearias!inner(nome)')).eq(stryMutAct_9fa48("3250") ? "" : (stryCov_9fa48("3250"), 'user_id'), userId).eq(stryMutAct_9fa48("3251") ? "" : (stryCov_9fa48("3251"), 'barbearia_id'), barbearia_id).single();
            if (stryMutAct_9fa48("3254") ? statusError && !statusAtual : stryMutAct_9fa48("3253") ? false : stryMutAct_9fa48("3252") ? true : (stryCov_9fa48("3252", "3253", "3254"), statusError || (stryMutAct_9fa48("3255") ? statusAtual : (stryCov_9fa48("3255"), !statusAtual)))) {
              if (stryMutAct_9fa48("3256")) {
                {}
              } else {
                stryCov_9fa48("3256");
                return reply.status(400).send(stryMutAct_9fa48("3257") ? {} : (stryCov_9fa48("3257"), {
                  success: stryMutAct_9fa48("3258") ? true : (stryCov_9fa48("3258"), false),
                  error: stryMutAct_9fa48("3259") ? "" : (stryCov_9fa48("3259"), 'Você não está ativo nesta barbearia')
                }));
              }
            }
            if (stryMutAct_9fa48("3262") ? false : stryMutAct_9fa48("3261") ? true : stryMutAct_9fa48("3260") ? statusAtual.ativo : (stryCov_9fa48("3260", "3261", "3262"), !statusAtual.ativo)) {
              if (stryMutAct_9fa48("3263")) {
                {}
              } else {
                stryCov_9fa48("3263");
                return reply.status(400).send(stryMutAct_9fa48("3264") ? {} : (stryCov_9fa48("3264"), {
                  success: stryMutAct_9fa48("3265") ? true : (stryCov_9fa48("3265"), false),
                  error: stryMutAct_9fa48("3266") ? "" : (stryCov_9fa48("3266"), 'Você não está ativo nesta barbearia')
                }));
              }
            }

            // Desativar barbeiro na barbearia especificada
            const {
              data: resultado,
              error: desativacaoError
            } = await supabase.from(stryMutAct_9fa48("3267") ? "" : (stryCov_9fa48("3267"), 'barbeiros_barbearias')).update(stryMutAct_9fa48("3268") ? {} : (stryCov_9fa48("3268"), {
              ativo: stryMutAct_9fa48("3269") ? true : (stryCov_9fa48("3269"), false),
              updated_at: new Date().toISOString()
            })).eq(stryMutAct_9fa48("3270") ? "" : (stryCov_9fa48("3270"), 'user_id'), userId).eq(stryMutAct_9fa48("3271") ? "" : (stryCov_9fa48("3271"), 'barbearia_id'), barbearia_id).select(stryMutAct_9fa48("3272") ? `` : (stryCov_9fa48("3272"), `
          *,
          barbearias!inner(nome)
        `)).single();
            if (stryMutAct_9fa48("3274") ? false : stryMutAct_9fa48("3273") ? true : (stryCov_9fa48("3273", "3274"), desativacaoError)) {
              if (stryMutAct_9fa48("3275")) {
                {}
              } else {
                stryCov_9fa48("3275");
                throw new Error(stryMutAct_9fa48("3276") ? "" : (stryCov_9fa48("3276"), 'Erro ao desativar barbeiro na barbearia'));
              }
            }
            return reply.send(stryMutAct_9fa48("3277") ? {} : (stryCov_9fa48("3277"), {
              success: stryMutAct_9fa48("3278") ? false : (stryCov_9fa48("3278"), true),
              message: stryMutAct_9fa48("3279") ? `` : (stryCov_9fa48("3279"), `Você foi desativado com sucesso da barbearia ${resultado.barbearias.nome}`),
              data: resultado
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("3280")) {
            {}
          } else {
            stryCov_9fa48("3280");
            return reply.status(400).send(stryMutAct_9fa48("3281") ? {} : (stryCov_9fa48("3281"), {
              success: stryMutAct_9fa48("3282") ? true : (stryCov_9fa48("3282"), false),
              error: error.message
            }));
          }
        }
      }
    });

    // Endpoint unificado substitui os endpoints separados
    // Use: GET /api/users/barbeiros?barbearia_id=:id&status=ativo

    // Endpoint unificado substitui os endpoints separados
    // Use: GET /api/users/barbeiros?barbearia_id=:id&status=ativo&public=true

    // Endpoint de debug removido para produção

    // Endpoint unificado substitui os endpoints separados
    // Use: GET /api/users/barbeiros?status=disponivel

    /**
     * @swagger
     * /api/users/{id}:
     *   put:
     *     tags: [users]
     *     summary: Atualizar usuário (apenas admin)
     *     security:
     *       - Bearer: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               nome:
     *                 type: string
     *               telefone:
     *                 type: string
     *               role:
     *                 type: string
     *                 enum: [admin, gerente, barbeiro]
     *               active:
     *                 type: boolean
     *     responses:
     *       200:
     *         description: Usuário atualizado
     *       400:
     *         description: Dados inválidos
     *       403:
     *         description: Acesso negado
     */
    fastify.put(stryMutAct_9fa48("3283") ? "" : (stryCov_9fa48("3283"), '/:id'), stryMutAct_9fa48("3284") ? {} : (stryCov_9fa48("3284"), {
      preValidation: stryMutAct_9fa48("3285") ? [] : (stryCov_9fa48("3285"), [fastify.authenticate, checkAdminRole])
    }), async (request, reply) => {
      if (stryMutAct_9fa48("3286")) {
        {}
      } else {
        stryCov_9fa48("3286");
        try {
          if (stryMutAct_9fa48("3287")) {
            {}
          } else {
            stryCov_9fa48("3287");
            const {
              id
            } = request.params;
            const updateData = request.body;
            const {
              data: user,
              error
            } = await supabase.from(stryMutAct_9fa48("3288") ? "" : (stryCov_9fa48("3288"), 'users')).update(stryMutAct_9fa48("3289") ? {} : (stryCov_9fa48("3289"), {
              ...updateData,
              updated_at: new Date().toISOString()
            })).eq(stryMutAct_9fa48("3290") ? "" : (stryCov_9fa48("3290"), 'id'), id).select().single();
            if (stryMutAct_9fa48("3292") ? false : stryMutAct_9fa48("3291") ? true : (stryCov_9fa48("3291", "3292"), error)) {
              if (stryMutAct_9fa48("3293")) {
                {}
              } else {
                stryCov_9fa48("3293");
                throw new Error(stryMutAct_9fa48("3294") ? "" : (stryCov_9fa48("3294"), 'Erro ao atualizar usuário'));
              }
            }
            return reply.send(stryMutAct_9fa48("3295") ? {} : (stryCov_9fa48("3295"), {
              success: stryMutAct_9fa48("3296") ? false : (stryCov_9fa48("3296"), true),
              message: stryMutAct_9fa48("3297") ? "" : (stryCov_9fa48("3297"), 'Usuário atualizado com sucesso'),
              data: user
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("3298")) {
            {}
          } else {
            stryCov_9fa48("3298");
            return reply.status(400).send(stryMutAct_9fa48("3299") ? {} : (stryCov_9fa48("3299"), {
              success: stryMutAct_9fa48("3300") ? true : (stryCov_9fa48("3300"), false),
              error: error.message
            }));
          }
        }
      }
    });

    /**
     * @swagger
     * /api/users/{id}:
     *   delete:
     *     tags: [users]
     *     summary: Remover usuário (apenas admin)
     *     security:
     *       - Bearer: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       200:
     *         description: Usuário removido
     *       403:
     *         description: Acesso negado
     */
    fastify.delete(stryMutAct_9fa48("3301") ? "" : (stryCov_9fa48("3301"), '/:id'), stryMutAct_9fa48("3302") ? {} : (stryCov_9fa48("3302"), {
      preValidation: stryMutAct_9fa48("3303") ? [] : (stryCov_9fa48("3303"), [fastify.authenticate, checkAdminRole])
    }), async (request, reply) => {
      if (stryMutAct_9fa48("3304")) {
        {}
      } else {
        stryCov_9fa48("3304");
        try {
          if (stryMutAct_9fa48("3305")) {
            {}
          } else {
            stryCov_9fa48("3305");
            const {
              id
            } = request.params;
            const {
              error
            } = await supabase.from(stryMutAct_9fa48("3306") ? "" : (stryCov_9fa48("3306"), 'users')).delete().eq(stryMutAct_9fa48("3307") ? "" : (stryCov_9fa48("3307"), 'id'), id);
            if (stryMutAct_9fa48("3309") ? false : stryMutAct_9fa48("3308") ? true : (stryCov_9fa48("3308", "3309"), error)) {
              if (stryMutAct_9fa48("3310")) {
                {}
              } else {
                stryCov_9fa48("3310");
                throw new Error(stryMutAct_9fa48("3311") ? "" : (stryCov_9fa48("3311"), 'Erro ao remover usuário'));
              }
            }
            return reply.send(stryMutAct_9fa48("3312") ? {} : (stryCov_9fa48("3312"), {
              success: stryMutAct_9fa48("3313") ? false : (stryCov_9fa48("3313"), true),
              message: stryMutAct_9fa48("3314") ? "" : (stryCov_9fa48("3314"), 'Usuário removido com sucesso')
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("3315")) {
            {}
          } else {
            stryCov_9fa48("3315");
            return reply.status(400).send(stryMutAct_9fa48("3316") ? {} : (stryCov_9fa48("3316"), {
              success: stryMutAct_9fa48("3317") ? true : (stryCov_9fa48("3317"), false),
              error: error.message
            }));
          }
        }
      }
    });
  }
}
module.exports = userRoutes;