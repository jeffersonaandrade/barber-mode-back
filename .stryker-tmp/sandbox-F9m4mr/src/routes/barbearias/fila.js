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
 * /api/barbearias/{id}/fila/proximo:
 *   post:
 *     tags: [barbearias]
 *     summary: Chamar próximo cliente da fila
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Próximo cliente chamado
 *       403:
 *         description: Barbeiro não está ativo na barbearia
 *       404:
 *         description: Não há clientes na fila
 */
async function filaBarbearia(fastify, options) {
  if (stryMutAct_9fa48("1112")) {
    {}
  } else {
    stryCov_9fa48("1112");
    // Instanciar serviço de barbearias
    const barbeariaService = new BarbeariaService(fastify.supabase);

    // Chamar próximo cliente da fila
    fastify.post(stryMutAct_9fa48("1113") ? "" : (stryCov_9fa48("1113"), '/:id/fila/proximo'), stryMutAct_9fa48("1114") ? {} : (stryCov_9fa48("1114"), {
      preValidation: stryMutAct_9fa48("1115") ? [] : (stryCov_9fa48("1115"), [fastify.authenticate])
    }), async (request, reply) => {
      if (stryMutAct_9fa48("1116")) {
        {}
      } else {
        stryCov_9fa48("1116");
        try {
          if (stryMutAct_9fa48("1117")) {
            {}
          } else {
            stryCov_9fa48("1117");
            const {
              id: barbearia_id
            } = request.params;
            const userId = request.user.id;
            const proximoCliente = await barbeariaService.chamarProximoCliente(barbearia_id, userId);
            return reply.status(200).send(stryMutAct_9fa48("1118") ? {} : (stryCov_9fa48("1118"), {
              success: stryMutAct_9fa48("1119") ? false : (stryCov_9fa48("1119"), true),
              message: stryMutAct_9fa48("1120") ? "" : (stryCov_9fa48("1120"), 'Próximo cliente chamado'),
              data: proximoCliente
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("1121")) {
            {}
          } else {
            stryCov_9fa48("1121");
            console.error(stryMutAct_9fa48("1122") ? "" : (stryCov_9fa48("1122"), 'Erro ao chamar próximo cliente:'), error);
            if (stryMutAct_9fa48("1124") ? false : stryMutAct_9fa48("1123") ? true : (stryCov_9fa48("1123", "1124"), error.message.includes(stryMutAct_9fa48("1125") ? "" : (stryCov_9fa48("1125"), 'não está ativo')))) {
              if (stryMutAct_9fa48("1126")) {
                {}
              } else {
                stryCov_9fa48("1126");
                return reply.status(403).send(stryMutAct_9fa48("1127") ? {} : (stryCov_9fa48("1127"), {
                  success: stryMutAct_9fa48("1128") ? true : (stryCov_9fa48("1128"), false),
                  error: error.message
                }));
              }
            }
            if (stryMutAct_9fa48("1130") ? false : stryMutAct_9fa48("1129") ? true : (stryCov_9fa48("1129", "1130"), error.message.includes(stryMutAct_9fa48("1131") ? "" : (stryCov_9fa48("1131"), 'Não há clientes')))) {
              if (stryMutAct_9fa48("1132")) {
                {}
              } else {
                stryCov_9fa48("1132");
                return reply.status(404).send(stryMutAct_9fa48("1133") ? {} : (stryCov_9fa48("1133"), {
                  success: stryMutAct_9fa48("1134") ? true : (stryCov_9fa48("1134"), false),
                  error: error.message
                }));
              }
            }
            return reply.status(500).send(stryMutAct_9fa48("1135") ? {} : (stryCov_9fa48("1135"), {
              success: stryMutAct_9fa48("1136") ? true : (stryCov_9fa48("1136"), false),
              error: stryMutAct_9fa48("1137") ? "" : (stryCov_9fa48("1137"), 'Erro interno do servidor')
            }));
          }
        }
      }
    });
  }
}
module.exports = filaBarbearia;