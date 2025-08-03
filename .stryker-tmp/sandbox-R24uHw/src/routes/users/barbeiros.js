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
  checkAdminRole,
  checkAdminOrGerenteRole,
  checkBarbeiroRole
} = require('../../middlewares/rolePermissions');
const UserService = require('../../services/userService');

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
async function barbeirosRoutes(fastify, options) {
  if (stryMutAct_9fa48("2739")) {
    {}
  } else {
    stryCov_9fa48("2739");
    // Instanciar serviço de usuários
    const userService = new UserService(fastify.supabase);

    // Listar barbeiros com filtros (unificado)
    fastify.get(stryMutAct_9fa48("2740") ? "" : (stryCov_9fa48("2740"), '/barbeiros'), async (request, reply) => {
      if (stryMutAct_9fa48("2741")) {
        {}
      } else {
        stryCov_9fa48("2741");
        try {
          if (stryMutAct_9fa48("2742")) {
            {}
          } else {
            stryCov_9fa48("2742");
            const {
              barbearia_id,
              status = stryMutAct_9fa48("2743") ? "" : (stryCov_9fa48("2743"), 'ativo'),
              public: isPublic = stryMutAct_9fa48("2744") ? true : (stryCov_9fa48("2744"), false)
            } = request.query;

            // Se não for público, requer autenticação
            if (stryMutAct_9fa48("2747") ? false : stryMutAct_9fa48("2746") ? true : stryMutAct_9fa48("2745") ? isPublic : (stryCov_9fa48("2745", "2746", "2747"), !isPublic)) {
              if (stryMutAct_9fa48("2748")) {
                {}
              } else {
                stryCov_9fa48("2748");
                await fastify.authenticate(request, reply);
                await fastify.authorize(stryMutAct_9fa48("2749") ? [] : (stryCov_9fa48("2749"), [stryMutAct_9fa48("2750") ? "" : (stryCov_9fa48("2750"), 'admin'), stryMutAct_9fa48("2751") ? "" : (stryCov_9fa48("2751"), 'gerente'), stryMutAct_9fa48("2752") ? "" : (stryCov_9fa48("2752"), 'barbeiro')]))(request, reply);
              }
            }
            if (stryMutAct_9fa48("2755") ? false : stryMutAct_9fa48("2754") ? true : stryMutAct_9fa48("2753") ? barbearia_id : (stryCov_9fa48("2753", "2754", "2755"), !barbearia_id)) {
              if (stryMutAct_9fa48("2756")) {
                {}
              } else {
                stryCov_9fa48("2756");
                return reply.status(400).send(stryMutAct_9fa48("2757") ? {} : (stryCov_9fa48("2757"), {
                  success: stryMutAct_9fa48("2758") ? true : (stryCov_9fa48("2758"), false),
                  error: stryMutAct_9fa48("2759") ? "" : (stryCov_9fa48("2759"), 'barbearia_id é obrigatório')
                }));
              }
            }

            // Usar serviço para listar barbeiros
            const resultado = await userService.listarBarbeiros(stryMutAct_9fa48("2760") ? {} : (stryCov_9fa48("2760"), {
              barbearia_id,
              status,
              isPublic
            }));
            return reply.status(200).send(stryMutAct_9fa48("2761") ? {} : (stryCov_9fa48("2761"), {
              success: stryMutAct_9fa48("2762") ? false : (stryCov_9fa48("2762"), true),
              data: resultado
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("2763")) {
            {}
          } else {
            stryCov_9fa48("2763");
            console.error(stryMutAct_9fa48("2764") ? "" : (stryCov_9fa48("2764"), 'Erro ao listar barbeiros:'), error);
            if (stryMutAct_9fa48("2766") ? false : stryMutAct_9fa48("2765") ? true : (stryCov_9fa48("2765", "2766"), error.message.includes(stryMutAct_9fa48("2767") ? "" : (stryCov_9fa48("2767"), 'Barbearia não encontrada')))) {
              if (stryMutAct_9fa48("2768")) {
                {}
              } else {
                stryCov_9fa48("2768");
                return reply.status(404).send(stryMutAct_9fa48("2769") ? {} : (stryCov_9fa48("2769"), {
                  success: stryMutAct_9fa48("2770") ? true : (stryCov_9fa48("2770"), false),
                  error: error.message
                }));
              }
            }
            return reply.status(500).send(stryMutAct_9fa48("2771") ? {} : (stryCov_9fa48("2771"), {
              success: stryMutAct_9fa48("2772") ? true : (stryCov_9fa48("2772"), false),
              error: stryMutAct_9fa48("2773") ? "" : (stryCov_9fa48("2773"), 'Erro interno do servidor')
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
     *     summary: Obter status do barbeiro logado
     *     security:
     *       - Bearer: []
     *     responses:
     *       200:
     *         description: Status do barbeiro
     *       403:
     *         description: Acesso negado
     */
    fastify.get(stryMutAct_9fa48("2774") ? "" : (stryCov_9fa48("2774"), '/barbeiros/meu-status'), stryMutAct_9fa48("2775") ? {} : (stryCov_9fa48("2775"), {
      preHandler: stryMutAct_9fa48("2776") ? [] : (stryCov_9fa48("2776"), [fastify.authenticate, checkBarbeiroRole])
    }), async (request, reply) => {
      if (stryMutAct_9fa48("2777")) {
        {}
      } else {
        stryCov_9fa48("2777");
        try {
          if (stryMutAct_9fa48("2778")) {
            {}
          } else {
            stryCov_9fa48("2778");
            const userId = request.user.id;

            // Usar serviço para obter status do barbeiro
            const resultado = await userService.obterStatusBarbeiro(userId);
            return reply.status(200).send(stryMutAct_9fa48("2779") ? {} : (stryCov_9fa48("2779"), {
              success: stryMutAct_9fa48("2780") ? false : (stryCov_9fa48("2780"), true),
              data: resultado
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("2781")) {
            {}
          } else {
            stryCov_9fa48("2781");
            console.error(stryMutAct_9fa48("2782") ? "" : (stryCov_9fa48("2782"), 'Erro ao obter status do barbeiro:'), error);
            if (stryMutAct_9fa48("2784") ? false : stryMutAct_9fa48("2783") ? true : (stryCov_9fa48("2783", "2784"), error.message.includes(stryMutAct_9fa48("2785") ? "" : (stryCov_9fa48("2785"), 'Barbeiro não encontrado')))) {
              if (stryMutAct_9fa48("2786")) {
                {}
              } else {
                stryCov_9fa48("2786");
                return reply.status(404).send(stryMutAct_9fa48("2787") ? {} : (stryCov_9fa48("2787"), {
                  success: stryMutAct_9fa48("2788") ? true : (stryCov_9fa48("2788"), false),
                  error: error.message
                }));
              }
            }
            return reply.status(500).send(stryMutAct_9fa48("2789") ? {} : (stryCov_9fa48("2789"), {
              success: stryMutAct_9fa48("2790") ? true : (stryCov_9fa48("2790"), false),
              error: stryMutAct_9fa48("2791") ? "" : (stryCov_9fa48("2791"), 'Erro interno do servidor')
            }));
          }
        }
      }
    });
  }
}
module.exports = barbeirosRoutes;