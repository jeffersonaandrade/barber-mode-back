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
const {
  checkAdminOrGerenteRole
} = require('../../middlewares/access');

/**
 * @swagger
 * /api/avaliacoes:
 *   get:
 *     tags: [avaliacoes]
 *     summary: Listar avaliações (com filtros)
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: query
 *         name: barbearia_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: barbeiro_id
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *           enum: [atendimento, qualidade, ambiente, tempo, preco]
 *       - in: query
 *         name: rating_min
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - in: query
 *         name: rating_max
 *         schema:
 *           type: integer
 *           maximum: 5
 *       - in: query
 *         name: data_inicio
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: data_fim
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Lista de avaliações
 *       403:
 *         description: Acesso negado
 */
async function listarAvaliacoes(fastify, options) {
  if (stryMutAct_9fa48("978")) {
    {}
  } else {
    stryCov_9fa48("978");
    // Instanciar serviço de avaliações
    const avaliacaoService = new AvaliacaoService(fastify.supabase);

    // Listar avaliações com filtros (ADMIN/GERENTE)
    fastify.get(stryMutAct_9fa48("979") ? "" : (stryCov_9fa48("979"), '/'), stryMutAct_9fa48("980") ? {} : (stryCov_9fa48("980"), {
      preValidation: stryMutAct_9fa48("981") ? [] : (stryCov_9fa48("981"), [fastify.authenticate, checkAdminOrGerenteRole])
    }), async (request, reply) => {
      if (stryMutAct_9fa48("982")) {
        {}
      } else {
        stryCov_9fa48("982");
        try {
          if (stryMutAct_9fa48("983")) {
            {}
          } else {
            stryCov_9fa48("983");
            const filtros = request.query;
            const resultado = await avaliacaoService.listarAvaliacoes(filtros);
            return reply.send(stryMutAct_9fa48("984") ? {} : (stryCov_9fa48("984"), {
              success: stryMutAct_9fa48("985") ? false : (stryCov_9fa48("985"), true),
              data: resultado
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("986")) {
            {}
          } else {
            stryCov_9fa48("986");
            return reply.status(400).send(stryMutAct_9fa48("987") ? {} : (stryCov_9fa48("987"), {
              success: stryMutAct_9fa48("988") ? true : (stryCov_9fa48("988"), false),
              error: error.message
            }));
          }
        }
      }
    });
  }
}
module.exports = listarAvaliacoes;