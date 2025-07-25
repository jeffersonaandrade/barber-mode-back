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
  checkAdminRole
} = require('../../middlewares/rolePermissions');
const UserService = require('../../services/userService');

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [users]
 *     summary: Listar todos os usuários (ADMIN)
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Lista de usuários
 *       403:
 *         description: Acesso negado
 */
async function perfilRoutes(fastify, options) {
  if (stryMutAct_9fa48("2869")) {
    {}
  } else {
    stryCov_9fa48("2869");
    // Instanciar serviço de usuários
    const userService = new UserService(fastify.supabase);

    // Listar todos os usuários (ADMIN)
    fastify.get(stryMutAct_9fa48("2870") ? "" : (stryCov_9fa48("2870"), '/'), stryMutAct_9fa48("2871") ? {} : (stryCov_9fa48("2871"), {
      preHandler: stryMutAct_9fa48("2872") ? [] : (stryCov_9fa48("2872"), [fastify.authenticate, checkAdminRole])
    }), async (request, reply) => {
      if (stryMutAct_9fa48("2873")) {
        {}
      } else {
        stryCov_9fa48("2873");
        try {
          if (stryMutAct_9fa48("2874")) {
            {}
          } else {
            stryCov_9fa48("2874");
            const resultado = await userService.listarUsuarios();
            return reply.status(200).send(stryMutAct_9fa48("2875") ? {} : (stryCov_9fa48("2875"), {
              success: stryMutAct_9fa48("2876") ? false : (stryCov_9fa48("2876"), true),
              data: resultado
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("2877")) {
            {}
          } else {
            stryCov_9fa48("2877");
            console.error(stryMutAct_9fa48("2878") ? "" : (stryCov_9fa48("2878"), 'Erro ao listar usuários:'), error);
            return reply.status(500).send(stryMutAct_9fa48("2879") ? {} : (stryCov_9fa48("2879"), {
              success: stryMutAct_9fa48("2880") ? true : (stryCov_9fa48("2880"), false),
              error: stryMutAct_9fa48("2881") ? "" : (stryCov_9fa48("2881"), 'Erro interno do servidor')
            }));
          }
        }
      }
    });

    /**
     * @swagger
     * /api/users/{id}:
     *   put:
     *     tags: [users]
     *     summary: Atualizar usuário (ADMIN)
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
     *               nome: { type: string }
     *               email: { type: string }
     *               role: { type: string, enum: [admin, gerente, barbeiro] }
     *               ativo: { type: boolean }
     *     responses:
     *       200:
     *         description: Usuário atualizado com sucesso
     *       403:
     *         description: Acesso negado
     */
    fastify.put(stryMutAct_9fa48("2882") ? "" : (stryCov_9fa48("2882"), '/:id'), stryMutAct_9fa48("2883") ? {} : (stryCov_9fa48("2883"), {
      preHandler: stryMutAct_9fa48("2884") ? [] : (stryCov_9fa48("2884"), [fastify.authenticate, checkAdminRole])
    }), async (request, reply) => {
      if (stryMutAct_9fa48("2885")) {
        {}
      } else {
        stryCov_9fa48("2885");
        try {
          if (stryMutAct_9fa48("2886")) {
            {}
          } else {
            stryCov_9fa48("2886");
            const {
              id
            } = request.params;
            const {
              nome,
              email,
              role,
              ativo
            } = request.body;

            // Usar serviço para atualizar usuário
            const resultado = await userService.atualizarUsuario(id, stryMutAct_9fa48("2887") ? {} : (stryCov_9fa48("2887"), {
              nome,
              email,
              role,
              ativo
            }));
            return reply.status(200).send(stryMutAct_9fa48("2888") ? {} : (stryCov_9fa48("2888"), {
              success: stryMutAct_9fa48("2889") ? false : (stryCov_9fa48("2889"), true),
              message: stryMutAct_9fa48("2890") ? "" : (stryCov_9fa48("2890"), 'Usuário atualizado com sucesso'),
              data: stryMutAct_9fa48("2891") ? {} : (stryCov_9fa48("2891"), {
                user: resultado
              })
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("2892")) {
            {}
          } else {
            stryCov_9fa48("2892");
            console.error(stryMutAct_9fa48("2893") ? "" : (stryCov_9fa48("2893"), 'Erro ao atualizar usuário:'), error);
            if (stryMutAct_9fa48("2895") ? false : stryMutAct_9fa48("2894") ? true : (stryCov_9fa48("2894", "2895"), error.message.includes(stryMutAct_9fa48("2896") ? "" : (stryCov_9fa48("2896"), 'Usuário não encontrado')))) {
              if (stryMutAct_9fa48("2897")) {
                {}
              } else {
                stryCov_9fa48("2897");
                return reply.status(404).send(stryMutAct_9fa48("2898") ? {} : (stryCov_9fa48("2898"), {
                  success: stryMutAct_9fa48("2899") ? true : (stryCov_9fa48("2899"), false),
                  error: error.message
                }));
              }
            }
            return reply.status(500).send(stryMutAct_9fa48("2900") ? {} : (stryCov_9fa48("2900"), {
              success: stryMutAct_9fa48("2901") ? true : (stryCov_9fa48("2901"), false),
              error: stryMutAct_9fa48("2902") ? "" : (stryCov_9fa48("2902"), 'Erro interno do servidor')
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
     *     summary: Deletar usuário (ADMIN)
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
     *         description: Usuário deletado com sucesso
     *       403:
     *         description: Acesso negado
     */
    fastify.delete(stryMutAct_9fa48("2903") ? "" : (stryCov_9fa48("2903"), '/:id'), stryMutAct_9fa48("2904") ? {} : (stryCov_9fa48("2904"), {
      preHandler: stryMutAct_9fa48("2905") ? [] : (stryCov_9fa48("2905"), [fastify.authenticate, checkAdminRole])
    }), async (request, reply) => {
      if (stryMutAct_9fa48("2906")) {
        {}
      } else {
        stryCov_9fa48("2906");
        try {
          if (stryMutAct_9fa48("2907")) {
            {}
          } else {
            stryCov_9fa48("2907");
            const {
              id
            } = request.params;
            const adminId = request.user.id;

            // Usar serviço para deletar usuário
            const resultado = await userService.deletarUsuario(id, adminId);
            return reply.status(200).send(stryMutAct_9fa48("2908") ? {} : (stryCov_9fa48("2908"), {
              success: stryMutAct_9fa48("2909") ? false : (stryCov_9fa48("2909"), true),
              message: stryMutAct_9fa48("2910") ? "" : (stryCov_9fa48("2910"), 'Usuário deletado com sucesso'),
              data: stryMutAct_9fa48("2911") ? {} : (stryCov_9fa48("2911"), {
                user: resultado
              })
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("2912")) {
            {}
          } else {
            stryCov_9fa48("2912");
            console.error(stryMutAct_9fa48("2913") ? "" : (stryCov_9fa48("2913"), 'Erro ao deletar usuário:'), error);
            if (stryMutAct_9fa48("2915") ? false : stryMutAct_9fa48("2914") ? true : (stryCov_9fa48("2914", "2915"), error.message.includes(stryMutAct_9fa48("2916") ? "" : (stryCov_9fa48("2916"), 'Usuário não encontrado')))) {
              if (stryMutAct_9fa48("2917")) {
                {}
              } else {
                stryCov_9fa48("2917");
                return reply.status(404).send(stryMutAct_9fa48("2918") ? {} : (stryCov_9fa48("2918"), {
                  success: stryMutAct_9fa48("2919") ? true : (stryCov_9fa48("2919"), false),
                  error: error.message
                }));
              }
            }
            if (stryMutAct_9fa48("2921") ? false : stryMutAct_9fa48("2920") ? true : (stryCov_9fa48("2920", "2921"), error.message.includes(stryMutAct_9fa48("2922") ? "" : (stryCov_9fa48("2922"), 'próprio usuário')))) {
              if (stryMutAct_9fa48("2923")) {
                {}
              } else {
                stryCov_9fa48("2923");
                return reply.status(400).send(stryMutAct_9fa48("2924") ? {} : (stryCov_9fa48("2924"), {
                  success: stryMutAct_9fa48("2925") ? true : (stryCov_9fa48("2925"), false),
                  error: error.message
                }));
              }
            }
            if (stryMutAct_9fa48("2927") ? false : stryMutAct_9fa48("2926") ? true : (stryCov_9fa48("2926", "2927"), error.message.includes(stryMutAct_9fa48("2928") ? "" : (stryCov_9fa48("2928"), 'relações ativas')))) {
              if (stryMutAct_9fa48("2929")) {
                {}
              } else {
                stryCov_9fa48("2929");
                return reply.status(400).send(stryMutAct_9fa48("2930") ? {} : (stryCov_9fa48("2930"), {
                  success: stryMutAct_9fa48("2931") ? true : (stryCov_9fa48("2931"), false),
                  error: error.message
                }));
              }
            }
            return reply.status(500).send(stryMutAct_9fa48("2932") ? {} : (stryCov_9fa48("2932"), {
              success: stryMutAct_9fa48("2933") ? true : (stryCov_9fa48("2933"), false),
              error: stryMutAct_9fa48("2934") ? "" : (stryCov_9fa48("2934"), 'Erro interno do servidor')
            }));
          }
        }
      }
    });
  }
}
module.exports = perfilRoutes;