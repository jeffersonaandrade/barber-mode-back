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
const AvaliacaoService = require('../../services/avaliacaoService');

/**
 * @swagger
 * /api/avaliacoes:
 *   post:
 *     tags: [avaliacoes]
 *     summary: Enviar avaliação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cliente_id
 *               - barbearia_id
 *               - rating
 *             properties:
 *               cliente_id:
 *                 type: string
 *                 format: uuid
 *               barbearia_id:
 *                 type: integer
 *               barbeiro_id:
 *                 type: string
 *                 format: uuid
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               categoria:
 *                 type: string
 *                 enum: [atendimento, qualidade, ambiente, tempo, preco]
 *               comentario:
 *                 type: string
 *     responses:
 *       201:
 *         description: Avaliação enviada
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Cliente não encontrado
 */
async function enviarAvaliacao(fastify, options) {
  if (stryMutAct_9fa48("961")) {
    {}
  } else {
    stryCov_9fa48("961");
    // Instanciar serviço de avaliações
    const avaliacaoService = new AvaliacaoService(fastify.supabase);

    // Enviar avaliação (PÚBLICO)
    fastify.post(stryMutAct_9fa48("962") ? "" : (stryCov_9fa48("962"), '/'), async (request, reply) => {
      if (stryMutAct_9fa48("963")) {
        {}
      } else {
        stryCov_9fa48("963");
        try {
          if (stryMutAct_9fa48("964")) {
            {}
          } else {
            stryCov_9fa48("964");
            const avaliacaoData = request.body;
            const avaliacao = await avaliacaoService.enviarAvaliacao(avaliacaoData);
            return reply.status(201).send(stryMutAct_9fa48("965") ? {} : (stryCov_9fa48("965"), {
              success: stryMutAct_9fa48("966") ? false : (stryCov_9fa48("966"), true),
              message: stryMutAct_9fa48("967") ? "" : (stryCov_9fa48("967"), 'Avaliação enviada com sucesso'),
              data: avaliacao
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("968")) {
            {}
          } else {
            stryCov_9fa48("968");
            if (stryMutAct_9fa48("970") ? false : stryMutAct_9fa48("969") ? true : (stryCov_9fa48("969", "970"), error.message.includes(stryMutAct_9fa48("971") ? "" : (stryCov_9fa48("971"), 'não encontrado')))) {
              if (stryMutAct_9fa48("972")) {
                {}
              } else {
                stryCov_9fa48("972");
                return reply.status(404).send(stryMutAct_9fa48("973") ? {} : (stryCov_9fa48("973"), {
                  success: stryMutAct_9fa48("974") ? true : (stryCov_9fa48("974"), false),
                  error: error.message
                }));
              }
            }
            return reply.status(400).send(stryMutAct_9fa48("975") ? {} : (stryCov_9fa48("975"), {
              success: stryMutAct_9fa48("976") ? true : (stryCov_9fa48("976"), false),
              error: error.message
            }));
          }
        }
      }
    });
  }
}
module.exports = enviarAvaliacao;