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
} = require('../../middlewares/access');
const {
  validateBarbeiroAction
} = require('../../middlewares/validation');
const UserService = require('../../services/userService');

/**
 * @swagger
 * /api/users/barbeiros/ativar:
 *   post:
 *     tags: [users]
 *     summary: Ativar barbeiro em uma barbearia
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [user_id, barbearia_id]
 *             properties:
 *               user_id: { type: string, format: uuid }
 *               barbearia_id: { type: integer }
 *     responses:
 *       200:
 *         description: Barbeiro ativado com sucesso
 *       403:
 *         description: Acesso negado
 */
async function gerenciamentoRoutes(fastify, options) {
  if (stryMutAct_9fa48("2792")) {
    {}
  } else {
    stryCov_9fa48("2792");
    // Instanciar serviço de usuários
    const userService = new UserService(fastify.supabase);

    // Ativar barbeiro em uma barbearia
    fastify.post(stryMutAct_9fa48("2793") ? "" : (stryCov_9fa48("2793"), '/barbeiros/ativar'), stryMutAct_9fa48("2794") ? {} : (stryCov_9fa48("2794"), {
      preHandler: stryMutAct_9fa48("2795") ? [] : (stryCov_9fa48("2795"), [fastify.authenticate, checkAdminOrGerenteRole, validateBarbeiroAction])
    }), async (request, reply) => {
      if (stryMutAct_9fa48("2796")) {
        {}
      } else {
        stryCov_9fa48("2796");
        try {
          if (stryMutAct_9fa48("2797")) {
            {}
          } else {
            stryCov_9fa48("2797");
            const {
              user_id,
              barbearia_id
            } = request.body;

            // Usar serviço para ativar barbeiro
            const resultado = await userService.ativarBarbeiro(stryMutAct_9fa48("2798") ? {} : (stryCov_9fa48("2798"), {
              user_id,
              barbearia_id
            }));
            const statusCode = (stryMutAct_9fa48("2801") ? resultado.acao !== 'reativado' : stryMutAct_9fa48("2800") ? false : stryMutAct_9fa48("2799") ? true : (stryCov_9fa48("2799", "2800", "2801"), resultado.acao === (stryMutAct_9fa48("2802") ? "" : (stryCov_9fa48("2802"), 'reativado')))) ? 200 : 201;
            const message = (stryMutAct_9fa48("2805") ? resultado.acao !== 'reativado' : stryMutAct_9fa48("2804") ? false : stryMutAct_9fa48("2803") ? true : (stryCov_9fa48("2803", "2804", "2805"), resultado.acao === (stryMutAct_9fa48("2806") ? "" : (stryCov_9fa48("2806"), 'reativado')))) ? stryMutAct_9fa48("2807") ? "" : (stryCov_9fa48("2807"), 'Barbeiro reativado com sucesso') : stryMutAct_9fa48("2808") ? "" : (stryCov_9fa48("2808"), 'Barbeiro ativado com sucesso');
            return reply.status(statusCode).send(stryMutAct_9fa48("2809") ? {} : (stryCov_9fa48("2809"), {
              success: stryMutAct_9fa48("2810") ? false : (stryCov_9fa48("2810"), true),
              message,
              data: stryMutAct_9fa48("2811") ? {} : (stryCov_9fa48("2811"), {
                barbeiro: resultado.barbeiro,
                barbearia: resultado.barbearia
              })
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("2812")) {
            {}
          } else {
            stryCov_9fa48("2812");
            console.error(stryMutAct_9fa48("2813") ? "" : (stryCov_9fa48("2813"), 'Erro ao ativar barbeiro:'), error);
            if (stryMutAct_9fa48("2815") ? false : stryMutAct_9fa48("2814") ? true : (stryCov_9fa48("2814", "2815"), error.message.includes(stryMutAct_9fa48("2816") ? "" : (stryCov_9fa48("2816"), 'Usuário não encontrado')))) {
              if (stryMutAct_9fa48("2817")) {
                {}
              } else {
                stryCov_9fa48("2817");
                return reply.status(404).send(stryMutAct_9fa48("2818") ? {} : (stryCov_9fa48("2818"), {
                  success: stryMutAct_9fa48("2819") ? true : (stryCov_9fa48("2819"), false),
                  error: error.message
                }));
              }
            }
            if (stryMutAct_9fa48("2821") ? false : stryMutAct_9fa48("2820") ? true : (stryCov_9fa48("2820", "2821"), error.message.includes(stryMutAct_9fa48("2822") ? "" : (stryCov_9fa48("2822"), 'Barbearia não encontrada')))) {
              if (stryMutAct_9fa48("2823")) {
                {}
              } else {
                stryCov_9fa48("2823");
                return reply.status(404).send(stryMutAct_9fa48("2824") ? {} : (stryCov_9fa48("2824"), {
                  success: stryMutAct_9fa48("2825") ? true : (stryCov_9fa48("2825"), false),
                  error: error.message
                }));
              }
            }
            if (stryMutAct_9fa48("2827") ? false : stryMutAct_9fa48("2826") ? true : (stryCov_9fa48("2826", "2827"), error.message.includes(stryMutAct_9fa48("2828") ? "" : (stryCov_9fa48("2828"), 'já está ativo')))) {
              if (stryMutAct_9fa48("2829")) {
                {}
              } else {
                stryCov_9fa48("2829");
                return reply.status(400).send(stryMutAct_9fa48("2830") ? {} : (stryCov_9fa48("2830"), {
                  success: stryMutAct_9fa48("2831") ? true : (stryCov_9fa48("2831"), false),
                  error: error.message
                }));
              }
            }
            return reply.status(500).send(stryMutAct_9fa48("2832") ? {} : (stryCov_9fa48("2832"), {
              success: stryMutAct_9fa48("2833") ? true : (stryCov_9fa48("2833"), false),
              error: stryMutAct_9fa48("2834") ? "" : (stryCov_9fa48("2834"), 'Erro interno do servidor')
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
     *     summary: Desativar barbeiro em uma barbearia
     *     security:
     *       - Bearer: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [user_id, barbearia_id]
     *             properties:
     *               user_id: { type: string, format: uuid }
     *               barbearia_id: { type: integer }
     *     responses:
     *       200:
     *         description: Barbeiro desativado com sucesso
     *       403:
     *         description: Acesso negado
     */
    fastify.post(stryMutAct_9fa48("2835") ? "" : (stryCov_9fa48("2835"), '/barbeiros/desativar'), stryMutAct_9fa48("2836") ? {} : (stryCov_9fa48("2836"), {
      preHandler: stryMutAct_9fa48("2837") ? [] : (stryCov_9fa48("2837"), [fastify.authenticate, checkAdminOrGerenteRole, validateBarbeiroAction])
    }), async (request, reply) => {
      if (stryMutAct_9fa48("2838")) {
        {}
      } else {
        stryCov_9fa48("2838");
        try {
          if (stryMutAct_9fa48("2839")) {
            {}
          } else {
            stryCov_9fa48("2839");
            const {
              user_id,
              barbearia_id
            } = request.body;

            // Usar serviço para desativar barbeiro
            const resultado = await userService.desativarBarbeiro(stryMutAct_9fa48("2840") ? {} : (stryCov_9fa48("2840"), {
              user_id,
              barbearia_id
            }));
            return reply.status(200).send(stryMutAct_9fa48("2841") ? {} : (stryCov_9fa48("2841"), {
              success: stryMutAct_9fa48("2842") ? false : (stryCov_9fa48("2842"), true),
              message: stryMutAct_9fa48("2843") ? "" : (stryCov_9fa48("2843"), 'Barbeiro desativado com sucesso'),
              data: stryMutAct_9fa48("2844") ? {} : (stryCov_9fa48("2844"), {
                barbeiro: resultado.barbeiro,
                barbearia: resultado.barbearia
              })
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("2845")) {
            {}
          } else {
            stryCov_9fa48("2845");
            console.error(stryMutAct_9fa48("2846") ? "" : (stryCov_9fa48("2846"), 'Erro ao desativar barbeiro:'), error);
            if (stryMutAct_9fa48("2848") ? false : stryMutAct_9fa48("2847") ? true : (stryCov_9fa48("2847", "2848"), error.message.includes(stryMutAct_9fa48("2849") ? "" : (stryCov_9fa48("2849"), 'Relação barbeiro-barbearia não encontrada')))) {
              if (stryMutAct_9fa48("2850")) {
                {}
              } else {
                stryCov_9fa48("2850");
                return reply.status(404).send(stryMutAct_9fa48("2851") ? {} : (stryCov_9fa48("2851"), {
                  success: stryMutAct_9fa48("2852") ? true : (stryCov_9fa48("2852"), false),
                  error: error.message
                }));
              }
            }
            if (stryMutAct_9fa48("2854") ? false : stryMutAct_9fa48("2853") ? true : (stryCov_9fa48("2853", "2854"), error.message.includes(stryMutAct_9fa48("2855") ? "" : (stryCov_9fa48("2855"), 'já está inativo')))) {
              if (stryMutAct_9fa48("2856")) {
                {}
              } else {
                stryCov_9fa48("2856");
                return reply.status(400).send(stryMutAct_9fa48("2857") ? {} : (stryCov_9fa48("2857"), {
                  success: stryMutAct_9fa48("2858") ? true : (stryCov_9fa48("2858"), false),
                  error: error.message
                }));
              }
            }
            if (stryMutAct_9fa48("2860") ? false : stryMutAct_9fa48("2859") ? true : (stryCov_9fa48("2859", "2860"), error.message.includes(stryMutAct_9fa48("2861") ? "" : (stryCov_9fa48("2861"), 'atendendo um cliente')))) {
              if (stryMutAct_9fa48("2862")) {
                {}
              } else {
                stryCov_9fa48("2862");
                return reply.status(400).send(stryMutAct_9fa48("2863") ? {} : (stryCov_9fa48("2863"), {
                  success: stryMutAct_9fa48("2864") ? true : (stryCov_9fa48("2864"), false),
                  error: error.message
                }));
              }
            }
            return reply.status(500).send(stryMutAct_9fa48("2865") ? {} : (stryCov_9fa48("2865"), {
              success: stryMutAct_9fa48("2866") ? true : (stryCov_9fa48("2866"), false),
              error: stryMutAct_9fa48("2867") ? "" : (stryCov_9fa48("2867"), 'Erro interno do servidor')
            }));
          }
        }
      }
    });
  }
}
module.exports = gerenciamentoRoutes;