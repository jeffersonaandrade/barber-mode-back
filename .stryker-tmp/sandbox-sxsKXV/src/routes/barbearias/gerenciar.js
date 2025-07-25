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
const {
  barbeariaSchema,
  barbeariaUpdateSchema
} = require('../../schemas/barbearia');
const {
  checkAdminRole
} = require('../../middlewares/access');

/**
 * @swagger
 * /api/barbearias:
 *   post:
 *     tags: [barbearias]
 *     summary: Criar barbearia (apenas admin)
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Barbearia'
 *     responses:
 *       201:
 *         description: Barbearia criada
 *       400:
 *         description: Dados inválidos
 *       403:
 *         description: Acesso negado
 */
async function gerenciarBarbearias(fastify, options) {
  if (stryMutAct_9fa48("1138")) {
    {}
  } else {
    stryCov_9fa48("1138");
    // Instanciar serviço de barbearias
    const barbeariaService = new BarbeariaService(fastify.supabase);

    // Criar barbearia (ADMIN)
    fastify.post(stryMutAct_9fa48("1139") ? "" : (stryCov_9fa48("1139"), '/'), stryMutAct_9fa48("1140") ? {} : (stryCov_9fa48("1140"), {
      preValidation: stryMutAct_9fa48("1141") ? [] : (stryCov_9fa48("1141"), [fastify.authenticate, checkAdminRole]),
      schema: barbeariaSchema
    }), async (request, reply) => {
      if (stryMutAct_9fa48("1142")) {
        {}
      } else {
        stryCov_9fa48("1142");
        try {
          if (stryMutAct_9fa48("1143")) {
            {}
          } else {
            stryCov_9fa48("1143");
            const barbeariaData = request.body;
            const barbearia = await barbeariaService.criarBarbearia(barbeariaData);
            return reply.status(201).send(stryMutAct_9fa48("1144") ? {} : (stryCov_9fa48("1144"), {
              success: stryMutAct_9fa48("1145") ? false : (stryCov_9fa48("1145"), true),
              message: stryMutAct_9fa48("1146") ? "" : (stryCov_9fa48("1146"), 'Barbearia criada com sucesso'),
              data: barbearia
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("1147")) {
            {}
          } else {
            stryCov_9fa48("1147");
            return reply.status(400).send(stryMutAct_9fa48("1148") ? {} : (stryCov_9fa48("1148"), {
              success: stryMutAct_9fa48("1149") ? true : (stryCov_9fa48("1149"), false),
              error: error.message
            }));
          }
        }
      }
    });

    /**
     * @swagger
     * /api/barbearias/{id}:
     *   put:
     *     tags: [barbearias]
     *     summary: Atualizar barbearia (apenas admin)
     *     security:
     *       - Bearer: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/BarbeariaUpdate'
     *     responses:
     *       200:
     *         description: Barbearia atualizada
     *       400:
     *         description: Dados inválidos
     *       403:
     *         description: Acesso negado
     */
    // Atualizar barbearia (ADMIN)
    fastify.put(stryMutAct_9fa48("1150") ? "" : (stryCov_9fa48("1150"), '/:id'), stryMutAct_9fa48("1151") ? {} : (stryCov_9fa48("1151"), {
      preValidation: stryMutAct_9fa48("1152") ? [] : (stryCov_9fa48("1152"), [fastify.authenticate, checkAdminRole]),
      schema: barbeariaUpdateSchema
    }), async (request, reply) => {
      if (stryMutAct_9fa48("1153")) {
        {}
      } else {
        stryCov_9fa48("1153");
        try {
          if (stryMutAct_9fa48("1154")) {
            {}
          } else {
            stryCov_9fa48("1154");
            const {
              id
            } = request.params;
            const updateData = request.body;
            const barbearia = await barbeariaService.atualizarBarbearia(id, updateData);
            return reply.send(stryMutAct_9fa48("1155") ? {} : (stryCov_9fa48("1155"), {
              success: stryMutAct_9fa48("1156") ? false : (stryCov_9fa48("1156"), true),
              message: stryMutAct_9fa48("1157") ? "" : (stryCov_9fa48("1157"), 'Barbearia atualizada com sucesso'),
              data: barbearia
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("1158")) {
            {}
          } else {
            stryCov_9fa48("1158");
            return reply.status(400).send(stryMutAct_9fa48("1159") ? {} : (stryCov_9fa48("1159"), {
              success: stryMutAct_9fa48("1160") ? true : (stryCov_9fa48("1160"), false),
              error: error.message
            }));
          }
        }
      }
    });

    /**
     * @swagger
     * /api/barbearias/{id}:
     *   delete:
     *     tags: [barbearias]
     *     summary: Remover barbearia (apenas admin)
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
     *         description: Barbearia removida
     *       403:
     *         description: Acesso negado
     */
    // Remover barbearia (ADMIN)
    fastify.delete(stryMutAct_9fa48("1161") ? "" : (stryCov_9fa48("1161"), '/:id'), stryMutAct_9fa48("1162") ? {} : (stryCov_9fa48("1162"), {
      preValidation: stryMutAct_9fa48("1163") ? [] : (stryCov_9fa48("1163"), [fastify.authenticate, checkAdminRole])
    }), async (request, reply) => {
      if (stryMutAct_9fa48("1164")) {
        {}
      } else {
        stryCov_9fa48("1164");
        try {
          if (stryMutAct_9fa48("1165")) {
            {}
          } else {
            stryCov_9fa48("1165");
            const {
              id
            } = request.params;
            await barbeariaService.removerBarbearia(id);
            return reply.send(stryMutAct_9fa48("1166") ? {} : (stryCov_9fa48("1166"), {
              success: stryMutAct_9fa48("1167") ? false : (stryCov_9fa48("1167"), true),
              message: stryMutAct_9fa48("1168") ? "" : (stryCov_9fa48("1168"), 'Barbearia removida com sucesso')
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("1169")) {
            {}
          } else {
            stryCov_9fa48("1169");
            return reply.status(400).send(stryMutAct_9fa48("1170") ? {} : (stryCov_9fa48("1170"), {
              success: stryMutAct_9fa48("1171") ? true : (stryCov_9fa48("1171"), false),
              error: error.message
            }));
          }
        }
      }
    });
  }
}
module.exports = gerenciarBarbearias;