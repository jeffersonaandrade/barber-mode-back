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
const BarbeariaService = require('../../services/barbeariaService');

/**
 * @swagger
 * /api/barbearias:
 *   get:
 *     tags: [barbearias]
 *     summary: Listar barbearias (PÚBLICO)
 *     responses:
 *       200:
 *         description: Lista de barbearias ativas
 */
async function listarBarbearias(fastify, options) {
  if (stryMutAct_9fa48("1173")) {
    {}
  } else {
    stryCov_9fa48("1173");
    // Instanciar serviço de barbearias
    const barbeariaService = new BarbeariaService(fastify.supabase);

    // Listar todas as barbearias ativas (PÚBLICO)
    fastify.get(stryMutAct_9fa48("1174") ? "" : (stryCov_9fa48("1174"), '/'), async (request, reply) => {
      if (stryMutAct_9fa48("1175")) {
        {}
      } else {
        stryCov_9fa48("1175");
        try {
          if (stryMutAct_9fa48("1176")) {
            {}
          } else {
            stryCov_9fa48("1176");
            const barbearias = await barbeariaService.listarBarbearias();
            return reply.send(stryMutAct_9fa48("1177") ? {} : (stryCov_9fa48("1177"), {
              success: stryMutAct_9fa48("1178") ? false : (stryCov_9fa48("1178"), true),
              data: barbearias
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("1179")) {
            {}
          } else {
            stryCov_9fa48("1179");
            return reply.status(400).send(stryMutAct_9fa48("1180") ? {} : (stryCov_9fa48("1180"), {
              success: stryMutAct_9fa48("1181") ? true : (stryCov_9fa48("1181"), false),
              error: error.message
            }));
          }
        }
      }
    });

    /**
     * @swagger
     * /api/barbearias/{id}:
     *   get:
     *     tags: [barbearias]
     *     summary: Buscar barbearia por ID
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Dados da barbearia
     *       404:
     *         description: Barbearia não encontrada
     */
    // Buscar barbearia por ID (PÚBLICO)
    fastify.get(stryMutAct_9fa48("1182") ? "" : (stryCov_9fa48("1182"), '/:id'), async (request, reply) => {
      if (stryMutAct_9fa48("1183")) {
        {}
      } else {
        stryCov_9fa48("1183");
        try {
          if (stryMutAct_9fa48("1184")) {
            {}
          } else {
            stryCov_9fa48("1184");
            const {
              id
            } = request.params;
            const barbearia = await barbeariaService.buscarBarbeariaPorId(id);
            return reply.send(stryMutAct_9fa48("1185") ? {} : (stryCov_9fa48("1185"), {
              success: stryMutAct_9fa48("1186") ? false : (stryCov_9fa48("1186"), true),
              data: barbearia
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("1187")) {
            {}
          } else {
            stryCov_9fa48("1187");
            if (stryMutAct_9fa48("1189") ? false : stryMutAct_9fa48("1188") ? true : (stryCov_9fa48("1188", "1189"), error.message.includes(stryMutAct_9fa48("1190") ? "" : (stryCov_9fa48("1190"), 'não encontrada')))) {
              if (stryMutAct_9fa48("1191")) {
                {}
              } else {
                stryCov_9fa48("1191");
                return reply.status(404).send(stryMutAct_9fa48("1192") ? {} : (stryCov_9fa48("1192"), {
                  success: stryMutAct_9fa48("1193") ? true : (stryCov_9fa48("1193"), false),
                  error: error.message
                }));
              }
            }
            return reply.status(400).send(stryMutAct_9fa48("1194") ? {} : (stryCov_9fa48("1194"), {
              success: stryMutAct_9fa48("1195") ? true : (stryCov_9fa48("1195"), false),
              error: error.message
            }));
          }
        }
      }
    });
  }
}
module.exports = listarBarbearias;