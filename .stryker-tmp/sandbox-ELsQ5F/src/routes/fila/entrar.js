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
const FilaService = require('../../services/filaService');
const {
  validateFilaEntry
} = require('../../middlewares/validation');

/**
 * @swagger
 * /api/fila/entrar:
 *   post:
 *     tags: [fila]
 *     summary: Adicionar cliente à fila (PÚBLICO)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, telefone, barbearia_id]
 *             properties:
 *               nome: { type: string }
 *               telefone: { type: string }
 *               barbearia_id: { type: integer }
 *               barbeiro_id: { type: string, format: uuid }
 *     responses:
 *       201:
 *         description: Cliente adicionado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Barbearia não encontrada
 */
async function entrarNaFila(fastify, options) {
  if (stryMutAct_9fa48("1348")) {
    {}
  } else {
    stryCov_9fa48("1348");
    // Instanciar serviço de fila
    const filaService = new FilaService(fastify.supabase);
    fastify.post(stryMutAct_9fa48("1349") ? "" : (stryCov_9fa48("1349"), '/fila/entrar'), stryMutAct_9fa48("1350") ? {} : (stryCov_9fa48("1350"), {
      preHandler: stryMutAct_9fa48("1351") ? [] : (stryCov_9fa48("1351"), [validateFilaEntry]),
      schema: stryMutAct_9fa48("1352") ? {} : (stryCov_9fa48("1352"), {
        description: stryMutAct_9fa48("1353") ? "" : (stryCov_9fa48("1353"), 'Adicionar cliente à fila (PÚBLICO)'),
        tags: stryMutAct_9fa48("1354") ? [] : (stryCov_9fa48("1354"), [stryMutAct_9fa48("1355") ? "" : (stryCov_9fa48("1355"), 'fila')]),
        body: stryMutAct_9fa48("1356") ? {} : (stryCov_9fa48("1356"), {
          type: stryMutAct_9fa48("1357") ? "" : (stryCov_9fa48("1357"), 'object'),
          required: stryMutAct_9fa48("1358") ? [] : (stryCov_9fa48("1358"), [stryMutAct_9fa48("1359") ? "" : (stryCov_9fa48("1359"), 'nome'), stryMutAct_9fa48("1360") ? "" : (stryCov_9fa48("1360"), 'telefone'), stryMutAct_9fa48("1361") ? "" : (stryCov_9fa48("1361"), 'barbearia_id')]),
          properties: stryMutAct_9fa48("1362") ? {} : (stryCov_9fa48("1362"), {
            nome: stryMutAct_9fa48("1363") ? {} : (stryCov_9fa48("1363"), {
              type: stryMutAct_9fa48("1364") ? "" : (stryCov_9fa48("1364"), 'string')
            }),
            telefone: stryMutAct_9fa48("1365") ? {} : (stryCov_9fa48("1365"), {
              type: stryMutAct_9fa48("1366") ? "" : (stryCov_9fa48("1366"), 'string')
            }),
            barbearia_id: stryMutAct_9fa48("1367") ? {} : (stryCov_9fa48("1367"), {
              type: stryMutAct_9fa48("1368") ? "" : (stryCov_9fa48("1368"), 'integer')
            }),
            barbeiro_id: stryMutAct_9fa48("1369") ? {} : (stryCov_9fa48("1369"), {
              type: stryMutAct_9fa48("1370") ? "" : (stryCov_9fa48("1370"), 'string'),
              format: stryMutAct_9fa48("1371") ? "" : (stryCov_9fa48("1371"), 'uuid')
            })
          })
        }),
        response: stryMutAct_9fa48("1372") ? {} : (stryCov_9fa48("1372"), {
          201: stryMutAct_9fa48("1373") ? {} : (stryCov_9fa48("1373"), {
            description: stryMutAct_9fa48("1374") ? "" : (stryCov_9fa48("1374"), 'Cliente adicionado com sucesso'),
            type: stryMutAct_9fa48("1375") ? "" : (stryCov_9fa48("1375"), 'object'),
            properties: stryMutAct_9fa48("1376") ? {} : (stryCov_9fa48("1376"), {
              success: stryMutAct_9fa48("1377") ? {} : (stryCov_9fa48("1377"), {
                type: stryMutAct_9fa48("1378") ? "" : (stryCov_9fa48("1378"), 'boolean')
              }),
              message: stryMutAct_9fa48("1379") ? {} : (stryCov_9fa48("1379"), {
                type: stryMutAct_9fa48("1380") ? "" : (stryCov_9fa48("1380"), 'string')
              }),
              data: stryMutAct_9fa48("1381") ? {} : (stryCov_9fa48("1381"), {
                type: stryMutAct_9fa48("1382") ? "" : (stryCov_9fa48("1382"), 'object'),
                properties: stryMutAct_9fa48("1383") ? {} : (stryCov_9fa48("1383"), {
                  cliente: stryMutAct_9fa48("1384") ? {} : (stryCov_9fa48("1384"), {
                    type: stryMutAct_9fa48("1385") ? "" : (stryCov_9fa48("1385"), 'object')
                  }),
                  qr_code_fila: stryMutAct_9fa48("1386") ? {} : (stryCov_9fa48("1386"), {
                    type: stryMutAct_9fa48("1387") ? "" : (stryCov_9fa48("1387"), 'string')
                  }),
                  qr_code_status: stryMutAct_9fa48("1388") ? {} : (stryCov_9fa48("1388"), {
                    type: stryMutAct_9fa48("1389") ? "" : (stryCov_9fa48("1389"), 'string')
                  }),
                  posicao: stryMutAct_9fa48("1390") ? {} : (stryCov_9fa48("1390"), {
                    type: stryMutAct_9fa48("1391") ? "" : (stryCov_9fa48("1391"), 'integer')
                  })
                })
              })
            })
          })
        })
      })
      // SEM autenticação - endpoint público
    }), async (request, reply) => {
      if (stryMutAct_9fa48("1392")) {
        {}
      } else {
        stryCov_9fa48("1392");
        try {
          if (stryMutAct_9fa48("1393")) {
            {}
          } else {
            stryCov_9fa48("1393");
            const {
              nome,
              telefone,
              barbearia_id,
              barbeiro_id
            } = request.body;

            // Usar serviço para adicionar cliente na fila
            const resultado = await filaService.adicionarClienteNaFila(stryMutAct_9fa48("1394") ? {} : (stryCov_9fa48("1394"), {
              nome,
              telefone,
              barbearia_id,
              barbeiro_id
            }));
            return reply.status(201).send(stryMutAct_9fa48("1395") ? {} : (stryCov_9fa48("1395"), {
              success: stryMutAct_9fa48("1396") ? false : (stryCov_9fa48("1396"), true),
              message: stryMutAct_9fa48("1397") ? "" : (stryCov_9fa48("1397"), 'Cliente adicionado à fila com sucesso'),
              data: resultado
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("1398")) {
            {}
          } else {
            stryCov_9fa48("1398");
            console.error(stryMutAct_9fa48("1399") ? "" : (stryCov_9fa48("1399"), 'Erro em entrar na fila:'), error);

            // Mapear erros específicos para códigos HTTP apropriados
            if (stryMutAct_9fa48("1401") ? false : stryMutAct_9fa48("1400") ? true : (stryCov_9fa48("1400", "1401"), error.message.includes(stryMutAct_9fa48("1402") ? "" : (stryCov_9fa48("1402"), 'Barbearia não encontrada')))) {
              if (stryMutAct_9fa48("1403")) {
                {}
              } else {
                stryCov_9fa48("1403");
                return reply.status(404).send(stryMutAct_9fa48("1404") ? {} : (stryCov_9fa48("1404"), {
                  success: stryMutAct_9fa48("1405") ? true : (stryCov_9fa48("1405"), false),
                  error: error.message
                }));
              }
            }
            if (stryMutAct_9fa48("1407") ? false : stryMutAct_9fa48("1406") ? true : (stryCov_9fa48("1406", "1407"), error.message.includes(stryMutAct_9fa48("1408") ? "" : (stryCov_9fa48("1408"), 'Barbeiro especificado')))) {
              if (stryMutAct_9fa48("1409")) {
                {}
              } else {
                stryCov_9fa48("1409");
                return reply.status(400).send(stryMutAct_9fa48("1410") ? {} : (stryCov_9fa48("1410"), {
                  success: stryMutAct_9fa48("1411") ? true : (stryCov_9fa48("1411"), false),
                  error: error.message
                }));
              }
            }
            return reply.status(500).send(stryMutAct_9fa48("1412") ? {} : (stryCov_9fa48("1412"), {
              success: stryMutAct_9fa48("1413") ? true : (stryCov_9fa48("1413"), false),
              error: stryMutAct_9fa48("1414") ? "" : (stryCov_9fa48("1414"), 'Erro interno do servidor')
            }));
          }
        }
      }
    });
  }
}
module.exports = entrarNaFila;