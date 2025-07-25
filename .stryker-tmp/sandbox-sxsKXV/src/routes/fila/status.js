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

/**
 * @swagger
 * /api/fila/status/{token}:
 *   get:
 *     tags: [fila]
 *     summary: Verificar status do cliente na fila
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status do cliente
 *       404:
 *         description: Cliente não encontrado
 */
async function verificarStatus(fastify, options) {
  if (stryMutAct_9fa48("1713")) {
    {}
  } else {
    stryCov_9fa48("1713");
    // Instanciar serviço de fila
    const filaService = new FilaService(fastify.supabase);
    fastify.get(stryMutAct_9fa48("1714") ? "" : (stryCov_9fa48("1714"), '/fila/status/:token'), stryMutAct_9fa48("1715") ? {} : (stryCov_9fa48("1715"), {
      schema: stryMutAct_9fa48("1716") ? {} : (stryCov_9fa48("1716"), {
        description: stryMutAct_9fa48("1717") ? "" : (stryCov_9fa48("1717"), 'Verificar status do cliente na fila'),
        tags: stryMutAct_9fa48("1718") ? [] : (stryCov_9fa48("1718"), [stryMutAct_9fa48("1719") ? "" : (stryCov_9fa48("1719"), 'fila')]),
        params: stryMutAct_9fa48("1720") ? {} : (stryCov_9fa48("1720"), {
          type: stryMutAct_9fa48("1721") ? "" : (stryCov_9fa48("1721"), 'object'),
          required: stryMutAct_9fa48("1722") ? [] : (stryCov_9fa48("1722"), [stryMutAct_9fa48("1723") ? "" : (stryCov_9fa48("1723"), 'token')]),
          properties: stryMutAct_9fa48("1724") ? {} : (stryCov_9fa48("1724"), {
            token: stryMutAct_9fa48("1725") ? {} : (stryCov_9fa48("1725"), {
              type: stryMutAct_9fa48("1726") ? "" : (stryCov_9fa48("1726"), 'string')
            })
          })
        }),
        response: stryMutAct_9fa48("1727") ? {} : (stryCov_9fa48("1727"), {
          200: stryMutAct_9fa48("1728") ? {} : (stryCov_9fa48("1728"), {
            description: stryMutAct_9fa48("1729") ? "" : (stryCov_9fa48("1729"), 'Status do cliente'),
            type: stryMutAct_9fa48("1730") ? "" : (stryCov_9fa48("1730"), 'object'),
            properties: stryMutAct_9fa48("1731") ? {} : (stryCov_9fa48("1731"), {
              success: stryMutAct_9fa48("1732") ? {} : (stryCov_9fa48("1732"), {
                type: stryMutAct_9fa48("1733") ? "" : (stryCov_9fa48("1733"), 'boolean')
              }),
              data: stryMutAct_9fa48("1734") ? {} : (stryCov_9fa48("1734"), {
                type: stryMutAct_9fa48("1735") ? "" : (stryCov_9fa48("1735"), 'object'),
                properties: stryMutAct_9fa48("1736") ? {} : (stryCov_9fa48("1736"), {
                  cliente: stryMutAct_9fa48("1737") ? {} : (stryCov_9fa48("1737"), {
                    type: stryMutAct_9fa48("1738") ? "" : (stryCov_9fa48("1738"), 'object')
                  }),
                  barbearia: stryMutAct_9fa48("1739") ? {} : (stryCov_9fa48("1739"), {
                    type: stryMutAct_9fa48("1740") ? "" : (stryCov_9fa48("1740"), 'object')
                  }),
                  posicao_atual: stryMutAct_9fa48("1741") ? {} : (stryCov_9fa48("1741"), {
                    type: stryMutAct_9fa48("1742") ? "" : (stryCov_9fa48("1742"), 'integer')
                  }),
                  tempo_estimado: stryMutAct_9fa48("1743") ? {} : (stryCov_9fa48("1743"), {
                    type: stryMutAct_9fa48("1744") ? "" : (stryCov_9fa48("1744"), 'integer')
                  })
                })
              })
            })
          })
        })
      })
      // SEM autenticação - endpoint público para clientes
    }), async (request, reply) => {
      if (stryMutAct_9fa48("1745")) {
        {}
      } else {
        stryCov_9fa48("1745");
        try {
          if (stryMutAct_9fa48("1746")) {
            {}
          } else {
            stryCov_9fa48("1746");
            const {
              token
            } = request.params;

            // Usar serviço para verificar status do cliente
            const resultado = await filaService.verificarStatusCliente(token);
            return reply.status(200).send(stryMutAct_9fa48("1747") ? {} : (stryCov_9fa48("1747"), {
              success: stryMutAct_9fa48("1748") ? false : (stryCov_9fa48("1748"), true),
              data: resultado
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("1749")) {
            {}
          } else {
            stryCov_9fa48("1749");
            console.error(stryMutAct_9fa48("1750") ? "" : (stryCov_9fa48("1750"), 'Erro ao verificar status:'), error);
            if (stryMutAct_9fa48("1752") ? false : stryMutAct_9fa48("1751") ? true : (stryCov_9fa48("1751", "1752"), error.message.includes(stryMutAct_9fa48("1753") ? "" : (stryCov_9fa48("1753"), 'Cliente não encontrado')))) {
              if (stryMutAct_9fa48("1754")) {
                {}
              } else {
                stryCov_9fa48("1754");
                return reply.status(404).send(stryMutAct_9fa48("1755") ? {} : (stryCov_9fa48("1755"), {
                  success: stryMutAct_9fa48("1756") ? true : (stryCov_9fa48("1756"), false),
                  error: error.message
                }));
              }
            }
            return reply.status(500).send(stryMutAct_9fa48("1757") ? {} : (stryCov_9fa48("1757"), {
              success: stryMutAct_9fa48("1758") ? true : (stryCov_9fa48("1758"), false),
              error: stryMutAct_9fa48("1759") ? "" : (stryCov_9fa48("1759"), 'Erro interno do servidor')
            }));
          }
        }
      }
    });
  }
}
module.exports = verificarStatus;