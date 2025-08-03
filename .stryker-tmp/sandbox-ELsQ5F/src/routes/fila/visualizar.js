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
  checkBarbeiroBarbeariaAccess
} = require('../../middlewares/barbeariaAccess');
const {
  checkGerenteRole,
  checkGerenteBarbeariaAccess
} = require('../../middlewares/rolePermissions');
const FilaService = require('../../services/filaService');

/**
 * @swagger
 * /api/fila/{barbearia_id}:
 *   get:
 *     tags: [fila]
 *     summary: Obter fila da barbearia (PRIVADO - para funcionários)
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: barbearia_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Fila da barbearia
 *       403:
 *         description: Acesso negado
 */
async function visualizarFila(fastify, options) {
  if (stryMutAct_9fa48("1760")) {
    {}
  } else {
    stryCov_9fa48("1760");
    // Instanciar serviço de fila
    const filaService = new FilaService(fastify.supabase);

    // Obter fila da barbearia (PRIVADO - para funcionários)
    fastify.get(stryMutAct_9fa48("1761") ? "" : (stryCov_9fa48("1761"), '/fila/:barbearia_id'), stryMutAct_9fa48("1762") ? {} : (stryCov_9fa48("1762"), {
      schema: stryMutAct_9fa48("1763") ? {} : (stryCov_9fa48("1763"), {
        description: stryMutAct_9fa48("1764") ? "" : (stryCov_9fa48("1764"), 'Obter fila da barbearia (PRIVADO - para funcionários)'),
        tags: stryMutAct_9fa48("1765") ? [] : (stryCov_9fa48("1765"), [stryMutAct_9fa48("1766") ? "" : (stryCov_9fa48("1766"), 'fila')]),
        params: stryMutAct_9fa48("1767") ? {} : (stryCov_9fa48("1767"), {
          type: stryMutAct_9fa48("1768") ? "" : (stryCov_9fa48("1768"), 'object'),
          required: stryMutAct_9fa48("1769") ? [] : (stryCov_9fa48("1769"), [stryMutAct_9fa48("1770") ? "" : (stryCov_9fa48("1770"), 'barbearia_id')]),
          properties: stryMutAct_9fa48("1771") ? {} : (stryCov_9fa48("1771"), {
            barbearia_id: stryMutAct_9fa48("1772") ? {} : (stryCov_9fa48("1772"), {
              type: stryMutAct_9fa48("1773") ? "" : (stryCov_9fa48("1773"), 'integer')
            })
          })
        }),
        response: stryMutAct_9fa48("1774") ? {} : (stryCov_9fa48("1774"), {
          200: stryMutAct_9fa48("1775") ? {} : (stryCov_9fa48("1775"), {
            description: stryMutAct_9fa48("1776") ? "" : (stryCov_9fa48("1776"), 'Fila da barbearia'),
            type: stryMutAct_9fa48("1777") ? "" : (stryCov_9fa48("1777"), 'object'),
            properties: stryMutAct_9fa48("1778") ? {} : (stryCov_9fa48("1778"), {
              success: stryMutAct_9fa48("1779") ? {} : (stryCov_9fa48("1779"), {
                type: stryMutAct_9fa48("1780") ? "" : (stryCov_9fa48("1780"), 'boolean')
              }),
              data: stryMutAct_9fa48("1781") ? {} : (stryCov_9fa48("1781"), {
                type: stryMutAct_9fa48("1782") ? "" : (stryCov_9fa48("1782"), 'object'),
                properties: stryMutAct_9fa48("1783") ? {} : (stryCov_9fa48("1783"), {
                  clientes: stryMutAct_9fa48("1784") ? {} : (stryCov_9fa48("1784"), {
                    type: stryMutAct_9fa48("1785") ? "" : (stryCov_9fa48("1785"), 'array')
                  }),
                  estatisticas: stryMutAct_9fa48("1786") ? {} : (stryCov_9fa48("1786"), {
                    type: stryMutAct_9fa48("1787") ? "" : (stryCov_9fa48("1787"), 'object')
                  })
                })
              })
            })
          })
        })
      }),
      preHandler: stryMutAct_9fa48("1788") ? [] : (stryCov_9fa48("1788"), [fastify.authenticate, checkBarbeiroBarbeariaAccess])
    }), async (request, reply) => {
      if (stryMutAct_9fa48("1789")) {
        {}
      } else {
        stryCov_9fa48("1789");
        try {
          if (stryMutAct_9fa48("1790")) {
            {}
          } else {
            stryCov_9fa48("1790");
            const {
              barbearia_id
            } = request.params;

            // Usar serviço para obter fila completa
            const resultado = await filaService.obterFilaCompleta(barbearia_id);
            return reply.status(200).send(stryMutAct_9fa48("1791") ? {} : (stryCov_9fa48("1791"), {
              success: stryMutAct_9fa48("1792") ? false : (stryCov_9fa48("1792"), true),
              data: resultado
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("1793")) {
            {}
          } else {
            stryCov_9fa48("1793");
            console.error(stryMutAct_9fa48("1794") ? "" : (stryCov_9fa48("1794"), 'Erro ao obter fila completa:'), error);
            if (stryMutAct_9fa48("1796") ? false : stryMutAct_9fa48("1795") ? true : (stryCov_9fa48("1795", "1796"), error.message.includes(stryMutAct_9fa48("1797") ? "" : (stryCov_9fa48("1797"), 'Barbearia não encontrada')))) {
              if (stryMutAct_9fa48("1798")) {
                {}
              } else {
                stryCov_9fa48("1798");
                return reply.status(404).send(stryMutAct_9fa48("1799") ? {} : (stryCov_9fa48("1799"), {
                  success: stryMutAct_9fa48("1800") ? true : (stryCov_9fa48("1800"), false),
                  error: error.message
                }));
              }
            }
            return reply.status(500).send(stryMutAct_9fa48("1801") ? {} : (stryCov_9fa48("1801"), {
              success: stryMutAct_9fa48("1802") ? true : (stryCov_9fa48("1802"), false),
              error: stryMutAct_9fa48("1803") ? "" : (stryCov_9fa48("1803"), 'Erro interno do servidor')
            }));
          }
        }
      }
    });

    // Obter fila da barbearia (GERENTE - dados completos)
    fastify.get(stryMutAct_9fa48("1804") ? "" : (stryCov_9fa48("1804"), '/fila-gerente/:barbearia_id'), stryMutAct_9fa48("1805") ? {} : (stryCov_9fa48("1805"), {
      schema: stryMutAct_9fa48("1806") ? {} : (stryCov_9fa48("1806"), {
        description: stryMutAct_9fa48("1807") ? "" : (stryCov_9fa48("1807"), 'Obter fila da barbearia (GERENTE - dados completos)'),
        tags: stryMutAct_9fa48("1808") ? [] : (stryCov_9fa48("1808"), [stryMutAct_9fa48("1809") ? "" : (stryCov_9fa48("1809"), 'fila')]),
        params: stryMutAct_9fa48("1810") ? {} : (stryCov_9fa48("1810"), {
          type: stryMutAct_9fa48("1811") ? "" : (stryCov_9fa48("1811"), 'object'),
          required: stryMutAct_9fa48("1812") ? [] : (stryCov_9fa48("1812"), [stryMutAct_9fa48("1813") ? "" : (stryCov_9fa48("1813"), 'barbearia_id')]),
          properties: stryMutAct_9fa48("1814") ? {} : (stryCov_9fa48("1814"), {
            barbearia_id: stryMutAct_9fa48("1815") ? {} : (stryCov_9fa48("1815"), {
              type: stryMutAct_9fa48("1816") ? "" : (stryCov_9fa48("1816"), 'integer')
            })
          })
        }),
        response: stryMutAct_9fa48("1817") ? {} : (stryCov_9fa48("1817"), {
          200: stryMutAct_9fa48("1818") ? {} : (stryCov_9fa48("1818"), {
            description: stryMutAct_9fa48("1819") ? "" : (stryCov_9fa48("1819"), 'Fila da barbearia (dados completos)'),
            type: stryMutAct_9fa48("1820") ? "" : (stryCov_9fa48("1820"), 'object'),
            properties: stryMutAct_9fa48("1821") ? {} : (stryCov_9fa48("1821"), {
              success: stryMutAct_9fa48("1822") ? {} : (stryCov_9fa48("1822"), {
                type: stryMutAct_9fa48("1823") ? "" : (stryCov_9fa48("1823"), 'boolean')
              }),
              data: stryMutAct_9fa48("1824") ? {} : (stryCov_9fa48("1824"), {
                type: stryMutAct_9fa48("1825") ? "" : (stryCov_9fa48("1825"), 'object'),
                properties: stryMutAct_9fa48("1826") ? {} : (stryCov_9fa48("1826"), {
                  estatisticas: stryMutAct_9fa48("1827") ? {} : (stryCov_9fa48("1827"), {
                    type: stryMutAct_9fa48("1828") ? "" : (stryCov_9fa48("1828"), 'object')
                  })
                })
              })
            })
          })
        })
      }),
      preHandler: stryMutAct_9fa48("1829") ? [] : (stryCov_9fa48("1829"), [fastify.authenticate, checkGerenteRole, checkGerenteBarbeariaAccess])
    }), async (request, reply) => {
      if (stryMutAct_9fa48("1830")) {
        {}
      } else {
        stryCov_9fa48("1830");
        try {
          if (stryMutAct_9fa48("1831")) {
            {}
          } else {
            stryCov_9fa48("1831");
            const {
              barbearia_id
            } = request.params;

            // Usar serviço para obter estatísticas (sem verificar se está ativa)
            const resultado = await filaService.obterEstatisticasFila(barbearia_id, stryMutAct_9fa48("1832") ? true : (stryCov_9fa48("1832"), false));
            return reply.status(200).send(stryMutAct_9fa48("1833") ? {} : (stryCov_9fa48("1833"), {
              success: stryMutAct_9fa48("1834") ? false : (stryCov_9fa48("1834"), true),
              data: resultado
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("1835")) {
            {}
          } else {
            stryCov_9fa48("1835");
            console.error(stryMutAct_9fa48("1836") ? "" : (stryCov_9fa48("1836"), 'Erro ao obter estatísticas gerente:'), error);
            if (stryMutAct_9fa48("1838") ? false : stryMutAct_9fa48("1837") ? true : (stryCov_9fa48("1837", "1838"), error.message.includes(stryMutAct_9fa48("1839") ? "" : (stryCov_9fa48("1839"), 'Barbearia não encontrada')))) {
              if (stryMutAct_9fa48("1840")) {
                {}
              } else {
                stryCov_9fa48("1840");
                return reply.status(404).send(stryMutAct_9fa48("1841") ? {} : (stryCov_9fa48("1841"), {
                  success: stryMutAct_9fa48("1842") ? true : (stryCov_9fa48("1842"), false),
                  error: error.message
                }));
              }
            }
            return reply.status(500).send(stryMutAct_9fa48("1843") ? {} : (stryCov_9fa48("1843"), {
              success: stryMutAct_9fa48("1844") ? true : (stryCov_9fa48("1844"), false),
              error: stryMutAct_9fa48("1845") ? "" : (stryCov_9fa48("1845"), 'Erro interno do servidor')
            }));
          }
        }
      }
    });

    // Obter fila da barbearia (PÚBLICO - para clientes)
    fastify.get(stryMutAct_9fa48("1846") ? "" : (stryCov_9fa48("1846"), '/fila-publica/:barbearia_id'), stryMutAct_9fa48("1847") ? {} : (stryCov_9fa48("1847"), {
      schema: stryMutAct_9fa48("1848") ? {} : (stryCov_9fa48("1848"), {
        description: stryMutAct_9fa48("1849") ? "" : (stryCov_9fa48("1849"), 'Obter fila da barbearia (PÚBLICO - para clientes)'),
        tags: stryMutAct_9fa48("1850") ? [] : (stryCov_9fa48("1850"), [stryMutAct_9fa48("1851") ? "" : (stryCov_9fa48("1851"), 'fila')]),
        params: stryMutAct_9fa48("1852") ? {} : (stryCov_9fa48("1852"), {
          type: stryMutAct_9fa48("1853") ? "" : (stryCov_9fa48("1853"), 'object'),
          required: stryMutAct_9fa48("1854") ? [] : (stryCov_9fa48("1854"), [stryMutAct_9fa48("1855") ? "" : (stryCov_9fa48("1855"), 'barbearia_id')]),
          properties: stryMutAct_9fa48("1856") ? {} : (stryCov_9fa48("1856"), {
            barbearia_id: stryMutAct_9fa48("1857") ? {} : (stryCov_9fa48("1857"), {
              type: stryMutAct_9fa48("1858") ? "" : (stryCov_9fa48("1858"), 'integer')
            })
          })
        }),
        response: stryMutAct_9fa48("1859") ? {} : (stryCov_9fa48("1859"), {
          200: stryMutAct_9fa48("1860") ? {} : (stryCov_9fa48("1860"), {
            description: stryMutAct_9fa48("1861") ? "" : (stryCov_9fa48("1861"), 'Fila da barbearia (dados limitados)'),
            type: stryMutAct_9fa48("1862") ? "" : (stryCov_9fa48("1862"), 'object'),
            properties: stryMutAct_9fa48("1863") ? {} : (stryCov_9fa48("1863"), {
              success: stryMutAct_9fa48("1864") ? {} : (stryCov_9fa48("1864"), {
                type: stryMutAct_9fa48("1865") ? "" : (stryCov_9fa48("1865"), 'boolean')
              }),
              data: stryMutAct_9fa48("1866") ? {} : (stryCov_9fa48("1866"), {
                type: stryMutAct_9fa48("1867") ? "" : (stryCov_9fa48("1867"), 'object'),
                properties: stryMutAct_9fa48("1868") ? {} : (stryCov_9fa48("1868"), {
                  barbearia: stryMutAct_9fa48("1869") ? {} : (stryCov_9fa48("1869"), {
                    type: stryMutAct_9fa48("1870") ? "" : (stryCov_9fa48("1870"), 'object')
                  }),
                  estatisticas: stryMutAct_9fa48("1871") ? {} : (stryCov_9fa48("1871"), {
                    type: stryMutAct_9fa48("1872") ? "" : (stryCov_9fa48("1872"), 'object')
                  })
                })
              })
            })
          })
        })
      })
      // SEM autenticação - endpoint público para clientes
    }), async (request, reply) => {
      if (stryMutAct_9fa48("1873")) {
        {}
      } else {
        stryCov_9fa48("1873");
        try {
          if (stryMutAct_9fa48("1874")) {
            {}
          } else {
            stryCov_9fa48("1874");
            const {
              barbearia_id
            } = request.params;

            // Usar serviço para obter estatísticas (verificando se está ativa)
            const resultado = await filaService.obterEstatisticasFila(barbearia_id, stryMutAct_9fa48("1875") ? false : (stryCov_9fa48("1875"), true));
            return reply.status(200).send(stryMutAct_9fa48("1876") ? {} : (stryCov_9fa48("1876"), {
              success: stryMutAct_9fa48("1877") ? false : (stryCov_9fa48("1877"), true),
              data: resultado
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("1878")) {
            {}
          } else {
            stryCov_9fa48("1878");
            console.error(stryMutAct_9fa48("1879") ? "" : (stryCov_9fa48("1879"), 'Erro ao obter estatísticas públicas:'), error);
            if (stryMutAct_9fa48("1881") ? false : stryMutAct_9fa48("1880") ? true : (stryCov_9fa48("1880", "1881"), error.message.includes(stryMutAct_9fa48("1882") ? "" : (stryCov_9fa48("1882"), 'Barbearia não encontrada')))) {
              if (stryMutAct_9fa48("1883")) {
                {}
              } else {
                stryCov_9fa48("1883");
                return reply.status(404).send(stryMutAct_9fa48("1884") ? {} : (stryCov_9fa48("1884"), {
                  success: stryMutAct_9fa48("1885") ? true : (stryCov_9fa48("1885"), false),
                  error: error.message
                }));
              }
            }
            return reply.status(500).send(stryMutAct_9fa48("1886") ? {} : (stryCov_9fa48("1886"), {
              success: stryMutAct_9fa48("1887") ? true : (stryCov_9fa48("1887"), false),
              error: stryMutAct_9fa48("1888") ? "" : (stryCov_9fa48("1888"), 'Erro interno do servidor')
            }));
          }
        }
      }
    });
  }
}
module.exports = visualizarFila;