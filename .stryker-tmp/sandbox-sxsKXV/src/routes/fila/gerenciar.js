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
  checkBarbeiroRole
} = require('../../middlewares/rolePermissions');

/**
 * @swagger
 * /api/fila/proximo/{barbearia_id}:
 *   post:
 *     tags: [fila]
 *     summary: Chamar próximo cliente da fila
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
 *         description: Próximo cliente chamado
 *       403:
 *         description: Acesso negado
 */
async function gerenciarFila(fastify, options) {
  if (stryMutAct_9fa48("1415")) {
    {}
  } else {
    stryCov_9fa48("1415");
    // Chamar próximo cliente
    fastify.post(stryMutAct_9fa48("1416") ? "" : (stryCov_9fa48("1416"), '/fila/proximo/:barbearia_id'), stryMutAct_9fa48("1417") ? {} : (stryCov_9fa48("1417"), {
      schema: stryMutAct_9fa48("1418") ? {} : (stryCov_9fa48("1418"), {
        description: stryMutAct_9fa48("1419") ? "" : (stryCov_9fa48("1419"), 'Chamar próximo cliente da fila'),
        tags: stryMutAct_9fa48("1420") ? [] : (stryCov_9fa48("1420"), [stryMutAct_9fa48("1421") ? "" : (stryCov_9fa48("1421"), 'fila')]),
        params: stryMutAct_9fa48("1422") ? {} : (stryCov_9fa48("1422"), {
          type: stryMutAct_9fa48("1423") ? "" : (stryCov_9fa48("1423"), 'object'),
          required: stryMutAct_9fa48("1424") ? [] : (stryCov_9fa48("1424"), [stryMutAct_9fa48("1425") ? "" : (stryCov_9fa48("1425"), 'barbearia_id')]),
          properties: stryMutAct_9fa48("1426") ? {} : (stryCov_9fa48("1426"), {
            barbearia_id: stryMutAct_9fa48("1427") ? {} : (stryCov_9fa48("1427"), {
              type: stryMutAct_9fa48("1428") ? "" : (stryCov_9fa48("1428"), 'integer')
            })
          })
        }),
        response: stryMutAct_9fa48("1429") ? {} : (stryCov_9fa48("1429"), {
          200: stryMutAct_9fa48("1430") ? {} : (stryCov_9fa48("1430"), {
            description: stryMutAct_9fa48("1431") ? "" : (stryCov_9fa48("1431"), 'Próximo cliente chamado'),
            type: stryMutAct_9fa48("1432") ? "" : (stryCov_9fa48("1432"), 'object'),
            properties: stryMutAct_9fa48("1433") ? {} : (stryCov_9fa48("1433"), {
              success: stryMutAct_9fa48("1434") ? {} : (stryCov_9fa48("1434"), {
                type: stryMutAct_9fa48("1435") ? "" : (stryCov_9fa48("1435"), 'boolean')
              }),
              message: stryMutAct_9fa48("1436") ? {} : (stryCov_9fa48("1436"), {
                type: stryMutAct_9fa48("1437") ? "" : (stryCov_9fa48("1437"), 'string')
              }),
              data: stryMutAct_9fa48("1438") ? {} : (stryCov_9fa48("1438"), {
                type: stryMutAct_9fa48("1439") ? "" : (stryCov_9fa48("1439"), 'object')
              })
            })
          })
        })
      }),
      preHandler: stryMutAct_9fa48("1440") ? [] : (stryCov_9fa48("1440"), [fastify.authenticate, checkBarbeiroRole, checkBarbeiroBarbeariaAccess])
    }), async (request, reply) => {
      if (stryMutAct_9fa48("1441")) {
        {}
      } else {
        stryCov_9fa48("1441");
        try {
          if (stryMutAct_9fa48("1442")) {
            {}
          } else {
            stryCov_9fa48("1442");
            const {
              barbearia_id
            } = request.params;
            const barbeiroId = request.user.id;

            // Verificar se a barbearia existe
            const {
              data: barbearia,
              error: barbeariaError
            } = await fastify.supabase.from(stryMutAct_9fa48("1443") ? "" : (stryCov_9fa48("1443"), 'barbearias')).select(stryMutAct_9fa48("1444") ? "" : (stryCov_9fa48("1444"), 'id, nome, ativo')).eq(stryMutAct_9fa48("1445") ? "" : (stryCov_9fa48("1445"), 'id'), barbearia_id).single();
            if (stryMutAct_9fa48("1448") ? barbeariaError && !barbearia : stryMutAct_9fa48("1447") ? false : stryMutAct_9fa48("1446") ? true : (stryCov_9fa48("1446", "1447", "1448"), barbeariaError || (stryMutAct_9fa48("1449") ? barbearia : (stryCov_9fa48("1449"), !barbearia)))) {
              if (stryMutAct_9fa48("1450")) {
                {}
              } else {
                stryCov_9fa48("1450");
                return reply.status(404).send(stryMutAct_9fa48("1451") ? {} : (stryCov_9fa48("1451"), {
                  success: stryMutAct_9fa48("1452") ? true : (stryCov_9fa48("1452"), false),
                  error: stryMutAct_9fa48("1453") ? "" : (stryCov_9fa48("1453"), 'Barbearia não encontrada')
                }));
              }
            }

            // Buscar próximo cliente na fila
            const {
              data: proximoCliente,
              error: clienteError
            } = await fastify.supabase.from(stryMutAct_9fa48("1454") ? "" : (stryCov_9fa48("1454"), 'clientes')).select(stryMutAct_9fa48("1455") ? "" : (stryCov_9fa48("1455"), 'id, nome, telefone, posicao, status')).eq(stryMutAct_9fa48("1456") ? "" : (stryCov_9fa48("1456"), 'barbearia_id'), barbearia_id).eq(stryMutAct_9fa48("1457") ? "" : (stryCov_9fa48("1457"), 'status'), stryMutAct_9fa48("1458") ? "" : (stryCov_9fa48("1458"), 'aguardando')).order(stryMutAct_9fa48("1459") ? "" : (stryCov_9fa48("1459"), 'posicao'), stryMutAct_9fa48("1460") ? {} : (stryCov_9fa48("1460"), {
              ascending: stryMutAct_9fa48("1461") ? false : (stryCov_9fa48("1461"), true)
            })).limit(1).single();
            if (stryMutAct_9fa48("1464") ? clienteError && !proximoCliente : stryMutAct_9fa48("1463") ? false : stryMutAct_9fa48("1462") ? true : (stryCov_9fa48("1462", "1463", "1464"), clienteError || (stryMutAct_9fa48("1465") ? proximoCliente : (stryCov_9fa48("1465"), !proximoCliente)))) {
              if (stryMutAct_9fa48("1466")) {
                {}
              } else {
                stryCov_9fa48("1466");
                return reply.status(404).send(stryMutAct_9fa48("1467") ? {} : (stryCov_9fa48("1467"), {
                  success: stryMutAct_9fa48("1468") ? true : (stryCov_9fa48("1468"), false),
                  error: stryMutAct_9fa48("1469") ? "" : (stryCov_9fa48("1469"), 'Não há clientes aguardando na fila')
                }));
              }
            }

            // Atualizar status do cliente para 'próximo'
            const {
              error: updateError
            } = await fastify.supabase.from(stryMutAct_9fa48("1470") ? "" : (stryCov_9fa48("1470"), 'clientes')).update(stryMutAct_9fa48("1471") ? {} : (stryCov_9fa48("1471"), {
              status: stryMutAct_9fa48("1472") ? "" : (stryCov_9fa48("1472"), 'proximo'),
              barbeiro_id: barbeiroId,
              updated_at: new Date().toISOString()
            })).eq(stryMutAct_9fa48("1473") ? "" : (stryCov_9fa48("1473"), 'id'), proximoCliente.id);
            if (stryMutAct_9fa48("1475") ? false : stryMutAct_9fa48("1474") ? true : (stryCov_9fa48("1474", "1475"), updateError)) {
              if (stryMutAct_9fa48("1476")) {
                {}
              } else {
                stryCov_9fa48("1476");
                return reply.status(500).send(stryMutAct_9fa48("1477") ? {} : (stryCov_9fa48("1477"), {
                  success: stryMutAct_9fa48("1478") ? true : (stryCov_9fa48("1478"), false),
                  error: stryMutAct_9fa48("1479") ? "" : (stryCov_9fa48("1479"), 'Erro ao atualizar status do cliente')
                }));
              }
            }
            return reply.status(200).send(stryMutAct_9fa48("1480") ? {} : (stryCov_9fa48("1480"), {
              success: stryMutAct_9fa48("1481") ? false : (stryCov_9fa48("1481"), true),
              message: stryMutAct_9fa48("1482") ? "" : (stryCov_9fa48("1482"), 'Próximo cliente chamado com sucesso'),
              data: stryMutAct_9fa48("1483") ? {} : (stryCov_9fa48("1483"), {
                cliente: stryMutAct_9fa48("1484") ? {} : (stryCov_9fa48("1484"), {
                  id: proximoCliente.id,
                  nome: proximoCliente.nome,
                  telefone: proximoCliente.telefone,
                  posicao: proximoCliente.posicao,
                  status: stryMutAct_9fa48("1485") ? "" : (stryCov_9fa48("1485"), 'proximo')
                }),
                barbearia: stryMutAct_9fa48("1486") ? {} : (stryCov_9fa48("1486"), {
                  id: barbearia.id,
                  nome: barbearia.nome
                })
              })
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("1487")) {
            {}
          } else {
            stryCov_9fa48("1487");
            return reply.status(500).send(stryMutAct_9fa48("1488") ? {} : (stryCov_9fa48("1488"), {
              success: stryMutAct_9fa48("1489") ? true : (stryCov_9fa48("1489"), false),
              error: stryMutAct_9fa48("1490") ? "" : (stryCov_9fa48("1490"), 'Erro interno do servidor')
            }));
          }
        }
      }
    });

    // Iniciar atendimento
    fastify.post(stryMutAct_9fa48("1491") ? "" : (stryCov_9fa48("1491"), '/fila/iniciar-atendimento/:cliente_id'), stryMutAct_9fa48("1492") ? {} : (stryCov_9fa48("1492"), {
      schema: stryMutAct_9fa48("1493") ? {} : (stryCov_9fa48("1493"), {
        description: stryMutAct_9fa48("1494") ? "" : (stryCov_9fa48("1494"), 'Iniciar atendimento de um cliente'),
        tags: stryMutAct_9fa48("1495") ? [] : (stryCov_9fa48("1495"), [stryMutAct_9fa48("1496") ? "" : (stryCov_9fa48("1496"), 'fila')]),
        params: stryMutAct_9fa48("1497") ? {} : (stryCov_9fa48("1497"), {
          type: stryMutAct_9fa48("1498") ? "" : (stryCov_9fa48("1498"), 'object'),
          required: stryMutAct_9fa48("1499") ? [] : (stryCov_9fa48("1499"), [stryMutAct_9fa48("1500") ? "" : (stryCov_9fa48("1500"), 'cliente_id')]),
          properties: stryMutAct_9fa48("1501") ? {} : (stryCov_9fa48("1501"), {
            cliente_id: stryMutAct_9fa48("1502") ? {} : (stryCov_9fa48("1502"), {
              type: stryMutAct_9fa48("1503") ? "" : (stryCov_9fa48("1503"), 'string'),
              format: stryMutAct_9fa48("1504") ? "" : (stryCov_9fa48("1504"), 'uuid')
            })
          })
        }),
        response: stryMutAct_9fa48("1505") ? {} : (stryCov_9fa48("1505"), {
          200: stryMutAct_9fa48("1506") ? {} : (stryCov_9fa48("1506"), {
            description: stryMutAct_9fa48("1507") ? "" : (stryCov_9fa48("1507"), 'Atendimento iniciado'),
            type: stryMutAct_9fa48("1508") ? "" : (stryCov_9fa48("1508"), 'object'),
            properties: stryMutAct_9fa48("1509") ? {} : (stryCov_9fa48("1509"), {
              success: stryMutAct_9fa48("1510") ? {} : (stryCov_9fa48("1510"), {
                type: stryMutAct_9fa48("1511") ? "" : (stryCov_9fa48("1511"), 'boolean')
              }),
              message: stryMutAct_9fa48("1512") ? {} : (stryCov_9fa48("1512"), {
                type: stryMutAct_9fa48("1513") ? "" : (stryCov_9fa48("1513"), 'string')
              }),
              data: stryMutAct_9fa48("1514") ? {} : (stryCov_9fa48("1514"), {
                type: stryMutAct_9fa48("1515") ? "" : (stryCov_9fa48("1515"), 'object')
              })
            })
          })
        })
      }),
      preHandler: stryMutAct_9fa48("1516") ? [] : (stryCov_9fa48("1516"), [fastify.authenticate, checkBarbeiroRole])
    }), async (request, reply) => {
      if (stryMutAct_9fa48("1517")) {
        {}
      } else {
        stryCov_9fa48("1517");
        try {
          if (stryMutAct_9fa48("1518")) {
            {}
          } else {
            stryCov_9fa48("1518");
            const {
              cliente_id
            } = request.params;
            const barbeiroId = request.user.id;

            // Verificar se o cliente existe e está com status 'próximo'
            const {
              data: cliente,
              error: clienteError
            } = await fastify.supabase.from(stryMutAct_9fa48("1519") ? "" : (stryCov_9fa48("1519"), 'clientes')).select(stryMutAct_9fa48("1520") ? "" : (stryCov_9fa48("1520"), 'id, nome, telefone, posicao, status, barbearia_id, barbeiro_id')).eq(stryMutAct_9fa48("1521") ? "" : (stryCov_9fa48("1521"), 'id'), cliente_id).eq(stryMutAct_9fa48("1522") ? "" : (stryCov_9fa48("1522"), 'status'), stryMutAct_9fa48("1523") ? "" : (stryCov_9fa48("1523"), 'proximo')).single();
            if (stryMutAct_9fa48("1526") ? clienteError && !cliente : stryMutAct_9fa48("1525") ? false : stryMutAct_9fa48("1524") ? true : (stryCov_9fa48("1524", "1525", "1526"), clienteError || (stryMutAct_9fa48("1527") ? cliente : (stryCov_9fa48("1527"), !cliente)))) {
              if (stryMutAct_9fa48("1528")) {
                {}
              } else {
                stryCov_9fa48("1528");
                return reply.status(404).send(stryMutAct_9fa48("1529") ? {} : (stryCov_9fa48("1529"), {
                  success: stryMutAct_9fa48("1530") ? true : (stryCov_9fa48("1530"), false),
                  error: stryMutAct_9fa48("1531") ? "" : (stryCov_9fa48("1531"), 'Cliente não encontrado ou não está pronto para atendimento')
                }));
              }
            }

            // Verificar se o barbeiro tem permissão para atender este cliente
            if (stryMutAct_9fa48("1534") ? cliente.barbeiro_id || cliente.barbeiro_id !== barbeiroId : stryMutAct_9fa48("1533") ? false : stryMutAct_9fa48("1532") ? true : (stryCov_9fa48("1532", "1533", "1534"), cliente.barbeiro_id && (stryMutAct_9fa48("1536") ? cliente.barbeiro_id === barbeiroId : stryMutAct_9fa48("1535") ? true : (stryCov_9fa48("1535", "1536"), cliente.barbeiro_id !== barbeiroId)))) {
              if (stryMutAct_9fa48("1537")) {
                {}
              } else {
                stryCov_9fa48("1537");
                return reply.status(403).send(stryMutAct_9fa48("1538") ? {} : (stryCov_9fa48("1538"), {
                  success: stryMutAct_9fa48("1539") ? true : (stryCov_9fa48("1539"), false),
                  error: stryMutAct_9fa48("1540") ? "" : (stryCov_9fa48("1540"), 'Você não tem permissão para atender este cliente')
                }));
              }
            }

            // Atualizar status do cliente para 'atendendo'
            const {
              error: updateError
            } = await fastify.supabase.from(stryMutAct_9fa48("1541") ? "" : (stryCov_9fa48("1541"), 'clientes')).update(stryMutAct_9fa48("1542") ? {} : (stryCov_9fa48("1542"), {
              status: stryMutAct_9fa48("1543") ? "" : (stryCov_9fa48("1543"), 'atendendo'),
              barbeiro_id: barbeiroId,
              updated_at: new Date().toISOString()
            })).eq(stryMutAct_9fa48("1544") ? "" : (stryCov_9fa48("1544"), 'id'), cliente_id);
            if (stryMutAct_9fa48("1546") ? false : stryMutAct_9fa48("1545") ? true : (stryCov_9fa48("1545", "1546"), updateError)) {
              if (stryMutAct_9fa48("1547")) {
                {}
              } else {
                stryCov_9fa48("1547");
                return reply.status(500).send(stryMutAct_9fa48("1548") ? {} : (stryCov_9fa48("1548"), {
                  success: stryMutAct_9fa48("1549") ? true : (stryCov_9fa48("1549"), false),
                  error: stryMutAct_9fa48("1550") ? "" : (stryCov_9fa48("1550"), 'Erro ao atualizar status do cliente')
                }));
              }
            }
            return reply.status(200).send(stryMutAct_9fa48("1551") ? {} : (stryCov_9fa48("1551"), {
              success: stryMutAct_9fa48("1552") ? false : (stryCov_9fa48("1552"), true),
              message: stryMutAct_9fa48("1553") ? "" : (stryCov_9fa48("1553"), 'Atendimento iniciado com sucesso'),
              data: stryMutAct_9fa48("1554") ? {} : (stryCov_9fa48("1554"), {
                cliente: stryMutAct_9fa48("1555") ? {} : (stryCov_9fa48("1555"), {
                  id: cliente.id,
                  nome: cliente.nome,
                  telefone: cliente.telefone,
                  posicao: cliente.posicao,
                  status: stryMutAct_9fa48("1556") ? "" : (stryCov_9fa48("1556"), 'atendendo')
                })
              })
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("1557")) {
            {}
          } else {
            stryCov_9fa48("1557");
            return reply.status(500).send(stryMutAct_9fa48("1558") ? {} : (stryCov_9fa48("1558"), {
              success: stryMutAct_9fa48("1559") ? true : (stryCov_9fa48("1559"), false),
              error: stryMutAct_9fa48("1560") ? "" : (stryCov_9fa48("1560"), 'Erro interno do servidor')
            }));
          }
        }
      }
    });

    // Remover cliente da fila
    fastify.post(stryMutAct_9fa48("1561") ? "" : (stryCov_9fa48("1561"), '/fila/remover/:cliente_id'), stryMutAct_9fa48("1562") ? {} : (stryCov_9fa48("1562"), {
      schema: stryMutAct_9fa48("1563") ? {} : (stryCov_9fa48("1563"), {
        description: stryMutAct_9fa48("1564") ? "" : (stryCov_9fa48("1564"), 'Remover cliente da fila'),
        tags: stryMutAct_9fa48("1565") ? [] : (stryCov_9fa48("1565"), [stryMutAct_9fa48("1566") ? "" : (stryCov_9fa48("1566"), 'fila')]),
        params: stryMutAct_9fa48("1567") ? {} : (stryCov_9fa48("1567"), {
          type: stryMutAct_9fa48("1568") ? "" : (stryCov_9fa48("1568"), 'object'),
          required: stryMutAct_9fa48("1569") ? [] : (stryCov_9fa48("1569"), [stryMutAct_9fa48("1570") ? "" : (stryCov_9fa48("1570"), 'cliente_id')]),
          properties: stryMutAct_9fa48("1571") ? {} : (stryCov_9fa48("1571"), {
            cliente_id: stryMutAct_9fa48("1572") ? {} : (stryCov_9fa48("1572"), {
              type: stryMutAct_9fa48("1573") ? "" : (stryCov_9fa48("1573"), 'string'),
              format: stryMutAct_9fa48("1574") ? "" : (stryCov_9fa48("1574"), 'uuid')
            })
          })
        }),
        response: stryMutAct_9fa48("1575") ? {} : (stryCov_9fa48("1575"), {
          200: stryMutAct_9fa48("1576") ? {} : (stryCov_9fa48("1576"), {
            description: stryMutAct_9fa48("1577") ? "" : (stryCov_9fa48("1577"), 'Cliente removido da fila'),
            type: stryMutAct_9fa48("1578") ? "" : (stryCov_9fa48("1578"), 'object'),
            properties: stryMutAct_9fa48("1579") ? {} : (stryCov_9fa48("1579"), {
              success: stryMutAct_9fa48("1580") ? {} : (stryCov_9fa48("1580"), {
                type: stryMutAct_9fa48("1581") ? "" : (stryCov_9fa48("1581"), 'boolean')
              }),
              message: stryMutAct_9fa48("1582") ? {} : (stryCov_9fa48("1582"), {
                type: stryMutAct_9fa48("1583") ? "" : (stryCov_9fa48("1583"), 'string')
              })
            })
          })
        })
      }),
      preHandler: stryMutAct_9fa48("1584") ? [] : (stryCov_9fa48("1584"), [fastify.authenticate, checkBarbeiroRole])
    }), async (request, reply) => {
      if (stryMutAct_9fa48("1585")) {
        {}
      } else {
        stryCov_9fa48("1585");
        try {
          if (stryMutAct_9fa48("1586")) {
            {}
          } else {
            stryCov_9fa48("1586");
            const {
              cliente_id
            } = request.params;
            const barbeiroId = request.user.id;

            // Verificar se o cliente existe
            const {
              data: cliente,
              error: clienteError
            } = await fastify.supabase.from(stryMutAct_9fa48("1587") ? "" : (stryCov_9fa48("1587"), 'clientes')).select(stryMutAct_9fa48("1588") ? "" : (stryCov_9fa48("1588"), 'id, nome, status, barbeiro_id')).eq(stryMutAct_9fa48("1589") ? "" : (stryCov_9fa48("1589"), 'id'), cliente_id).in(stryMutAct_9fa48("1590") ? "" : (stryCov_9fa48("1590"), 'status'), stryMutAct_9fa48("1591") ? [] : (stryCov_9fa48("1591"), [stryMutAct_9fa48("1592") ? "" : (stryCov_9fa48("1592"), 'aguardando'), stryMutAct_9fa48("1593") ? "" : (stryCov_9fa48("1593"), 'proximo'), stryMutAct_9fa48("1594") ? "" : (stryCov_9fa48("1594"), 'atendendo')])).single();
            if (stryMutAct_9fa48("1597") ? clienteError && !cliente : stryMutAct_9fa48("1596") ? false : stryMutAct_9fa48("1595") ? true : (stryCov_9fa48("1595", "1596", "1597"), clienteError || (stryMutAct_9fa48("1598") ? cliente : (stryCov_9fa48("1598"), !cliente)))) {
              if (stryMutAct_9fa48("1599")) {
                {}
              } else {
                stryCov_9fa48("1599");
                return reply.status(404).send(stryMutAct_9fa48("1600") ? {} : (stryCov_9fa48("1600"), {
                  success: stryMutAct_9fa48("1601") ? true : (stryCov_9fa48("1601"), false),
                  error: stryMutAct_9fa48("1602") ? "" : (stryCov_9fa48("1602"), 'Cliente não encontrado ou não está na fila')
                }));
              }
            }

            // Verificar se o barbeiro tem permissão para remover este cliente
            if (stryMutAct_9fa48("1605") ? cliente.barbeiro_id || cliente.barbeiro_id !== barbeiroId : stryMutAct_9fa48("1604") ? false : stryMutAct_9fa48("1603") ? true : (stryCov_9fa48("1603", "1604", "1605"), cliente.barbeiro_id && (stryMutAct_9fa48("1607") ? cliente.barbeiro_id === barbeiroId : stryMutAct_9fa48("1606") ? true : (stryCov_9fa48("1606", "1607"), cliente.barbeiro_id !== barbeiroId)))) {
              if (stryMutAct_9fa48("1608")) {
                {}
              } else {
                stryCov_9fa48("1608");
                return reply.status(403).send(stryMutAct_9fa48("1609") ? {} : (stryCov_9fa48("1609"), {
                  success: stryMutAct_9fa48("1610") ? true : (stryCov_9fa48("1610"), false),
                  error: stryMutAct_9fa48("1611") ? "" : (stryCov_9fa48("1611"), 'Você não tem permissão para remover este cliente')
                }));
              }
            }

            // Atualizar status do cliente para 'removido'
            const {
              error: updateError
            } = await fastify.supabase.from(stryMutAct_9fa48("1612") ? "" : (stryCov_9fa48("1612"), 'clientes')).update(stryMutAct_9fa48("1613") ? {} : (stryCov_9fa48("1613"), {
              status: stryMutAct_9fa48("1614") ? "" : (stryCov_9fa48("1614"), 'removido'),
              updated_at: new Date().toISOString()
            })).eq(stryMutAct_9fa48("1615") ? "" : (stryCov_9fa48("1615"), 'id'), cliente_id);
            if (stryMutAct_9fa48("1617") ? false : stryMutAct_9fa48("1616") ? true : (stryCov_9fa48("1616", "1617"), updateError)) {
              if (stryMutAct_9fa48("1618")) {
                {}
              } else {
                stryCov_9fa48("1618");
                return reply.status(500).send(stryMutAct_9fa48("1619") ? {} : (stryCov_9fa48("1619"), {
                  success: stryMutAct_9fa48("1620") ? true : (stryCov_9fa48("1620"), false),
                  error: stryMutAct_9fa48("1621") ? "" : (stryCov_9fa48("1621"), 'Erro ao remover cliente da fila')
                }));
              }
            }
            return reply.status(200).send(stryMutAct_9fa48("1622") ? {} : (stryCov_9fa48("1622"), {
              success: stryMutAct_9fa48("1623") ? false : (stryCov_9fa48("1623"), true),
              message: stryMutAct_9fa48("1624") ? "" : (stryCov_9fa48("1624"), 'Cliente removido da fila com sucesso')
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("1625")) {
            {}
          } else {
            stryCov_9fa48("1625");
            return reply.status(500).send(stryMutAct_9fa48("1626") ? {} : (stryCov_9fa48("1626"), {
              success: stryMutAct_9fa48("1627") ? true : (stryCov_9fa48("1627"), false),
              error: stryMutAct_9fa48("1628") ? "" : (stryCov_9fa48("1628"), 'Erro interno do servidor')
            }));
          }
        }
      }
    });

    // Finalizar atendimento
    fastify.post(stryMutAct_9fa48("1629") ? "" : (stryCov_9fa48("1629"), '/fila/finalizar'), stryMutAct_9fa48("1630") ? {} : (stryCov_9fa48("1630"), {
      schema: stryMutAct_9fa48("1631") ? {} : (stryCov_9fa48("1631"), {
        description: stryMutAct_9fa48("1632") ? "" : (stryCov_9fa48("1632"), 'Finalizar atendimento de um cliente'),
        tags: stryMutAct_9fa48("1633") ? [] : (stryCov_9fa48("1633"), [stryMutAct_9fa48("1634") ? "" : (stryCov_9fa48("1634"), 'fila')]),
        body: stryMutAct_9fa48("1635") ? {} : (stryCov_9fa48("1635"), {
          type: stryMutAct_9fa48("1636") ? "" : (stryCov_9fa48("1636"), 'object'),
          required: stryMutAct_9fa48("1637") ? [] : (stryCov_9fa48("1637"), [stryMutAct_9fa48("1638") ? "" : (stryCov_9fa48("1638"), 'cliente_id')]),
          properties: stryMutAct_9fa48("1639") ? {} : (stryCov_9fa48("1639"), {
            cliente_id: stryMutAct_9fa48("1640") ? {} : (stryCov_9fa48("1640"), {
              type: stryMutAct_9fa48("1641") ? "" : (stryCov_9fa48("1641"), 'string'),
              format: stryMutAct_9fa48("1642") ? "" : (stryCov_9fa48("1642"), 'uuid')
            }),
            observacoes: stryMutAct_9fa48("1643") ? {} : (stryCov_9fa48("1643"), {
              type: stryMutAct_9fa48("1644") ? "" : (stryCov_9fa48("1644"), 'string')
            })
          })
        }),
        response: stryMutAct_9fa48("1645") ? {} : (stryCov_9fa48("1645"), {
          200: stryMutAct_9fa48("1646") ? {} : (stryCov_9fa48("1646"), {
            description: stryMutAct_9fa48("1647") ? "" : (stryCov_9fa48("1647"), 'Atendimento finalizado'),
            type: stryMutAct_9fa48("1648") ? "" : (stryCov_9fa48("1648"), 'object'),
            properties: stryMutAct_9fa48("1649") ? {} : (stryCov_9fa48("1649"), {
              success: stryMutAct_9fa48("1650") ? {} : (stryCov_9fa48("1650"), {
                type: stryMutAct_9fa48("1651") ? "" : (stryCov_9fa48("1651"), 'boolean')
              }),
              message: stryMutAct_9fa48("1652") ? {} : (stryCov_9fa48("1652"), {
                type: stryMutAct_9fa48("1653") ? "" : (stryCov_9fa48("1653"), 'string')
              }),
              data: stryMutAct_9fa48("1654") ? {} : (stryCov_9fa48("1654"), {
                type: stryMutAct_9fa48("1655") ? "" : (stryCov_9fa48("1655"), 'object')
              })
            })
          })
        })
      }),
      preHandler: stryMutAct_9fa48("1656") ? [] : (stryCov_9fa48("1656"), [fastify.authenticate, checkBarbeiroRole])
    }), async (request, reply) => {
      if (stryMutAct_9fa48("1657")) {
        {}
      } else {
        stryCov_9fa48("1657");
        try {
          if (stryMutAct_9fa48("1658")) {
            {}
          } else {
            stryCov_9fa48("1658");
            const {
              cliente_id,
              observacoes
            } = request.body;
            const barbeiroId = request.user.id;

            // Verificar se o cliente existe e está sendo atendido
            const {
              data: cliente,
              error: clienteError
            } = await fastify.supabase.from(stryMutAct_9fa48("1659") ? "" : (stryCov_9fa48("1659"), 'clientes')).select(stryMutAct_9fa48("1660") ? "" : (stryCov_9fa48("1660"), 'id, nome, telefone, posicao, status, barbearia_id, barbeiro_id')).eq(stryMutAct_9fa48("1661") ? "" : (stryCov_9fa48("1661"), 'id'), cliente_id).eq(stryMutAct_9fa48("1662") ? "" : (stryCov_9fa48("1662"), 'status'), stryMutAct_9fa48("1663") ? "" : (stryCov_9fa48("1663"), 'atendendo')).single();
            if (stryMutAct_9fa48("1666") ? clienteError && !cliente : stryMutAct_9fa48("1665") ? false : stryMutAct_9fa48("1664") ? true : (stryCov_9fa48("1664", "1665", "1666"), clienteError || (stryMutAct_9fa48("1667") ? cliente : (stryCov_9fa48("1667"), !cliente)))) {
              if (stryMutAct_9fa48("1668")) {
                {}
              } else {
                stryCov_9fa48("1668");
                return reply.status(404).send(stryMutAct_9fa48("1669") ? {} : (stryCov_9fa48("1669"), {
                  success: stryMutAct_9fa48("1670") ? true : (stryCov_9fa48("1670"), false),
                  error: stryMutAct_9fa48("1671") ? "" : (stryCov_9fa48("1671"), 'Cliente não encontrado ou não está sendo atendido')
                }));
              }
            }

            // Verificar se o barbeiro tem permissão para finalizar este atendimento
            if (stryMutAct_9fa48("1674") ? cliente.barbeiro_id === barbeiroId : stryMutAct_9fa48("1673") ? false : stryMutAct_9fa48("1672") ? true : (stryCov_9fa48("1672", "1673", "1674"), cliente.barbeiro_id !== barbeiroId)) {
              if (stryMutAct_9fa48("1675")) {
                {}
              } else {
                stryCov_9fa48("1675");
                return reply.status(403).send(stryMutAct_9fa48("1676") ? {} : (stryCov_9fa48("1676"), {
                  success: stryMutAct_9fa48("1677") ? true : (stryCov_9fa48("1677"), false),
                  error: stryMutAct_9fa48("1678") ? "" : (stryCov_9fa48("1678"), 'Você não tem permissão para finalizar este atendimento')
                }));
              }
            }

            // Atualizar status do cliente para 'finalizado'
            const {
              error: updateError
            } = await fastify.supabase.from(stryMutAct_9fa48("1679") ? "" : (stryCov_9fa48("1679"), 'clientes')).update(stryMutAct_9fa48("1680") ? {} : (stryCov_9fa48("1680"), {
              status: stryMutAct_9fa48("1681") ? "" : (stryCov_9fa48("1681"), 'finalizado'),
              observacoes: stryMutAct_9fa48("1684") ? observacoes && null : stryMutAct_9fa48("1683") ? false : stryMutAct_9fa48("1682") ? true : (stryCov_9fa48("1682", "1683", "1684"), observacoes || null),
              updated_at: new Date().toISOString()
            })).eq(stryMutAct_9fa48("1685") ? "" : (stryCov_9fa48("1685"), 'id'), cliente_id);
            if (stryMutAct_9fa48("1687") ? false : stryMutAct_9fa48("1686") ? true : (stryCov_9fa48("1686", "1687"), updateError)) {
              if (stryMutAct_9fa48("1688")) {
                {}
              } else {
                stryCov_9fa48("1688");
                return reply.status(500).send(stryMutAct_9fa48("1689") ? {} : (stryCov_9fa48("1689"), {
                  success: stryMutAct_9fa48("1690") ? true : (stryCov_9fa48("1690"), false),
                  error: stryMutAct_9fa48("1691") ? "" : (stryCov_9fa48("1691"), 'Erro ao finalizar atendimento')
                }));
              }
            }

            // Registrar no histórico
            const {
              error: historicoError
            } = await fastify.supabase.from(stryMutAct_9fa48("1692") ? "" : (stryCov_9fa48("1692"), 'historico_atendimentos')).insert(stryMutAct_9fa48("1693") ? {} : (stryCov_9fa48("1693"), {
              cliente_id: cliente_id,
              barbeiro_id: barbeiroId,
              barbearia_id: cliente.barbearia_id,
              status: stryMutAct_9fa48("1694") ? "" : (stryCov_9fa48("1694"), 'finalizado'),
              observacoes: stryMutAct_9fa48("1697") ? observacoes && null : stryMutAct_9fa48("1696") ? false : stryMutAct_9fa48("1695") ? true : (stryCov_9fa48("1695", "1696", "1697"), observacoes || null),
              created_at: new Date().toISOString()
            }));
            if (stryMutAct_9fa48("1699") ? false : stryMutAct_9fa48("1698") ? true : (stryCov_9fa48("1698", "1699"), historicoError)) {
              if (stryMutAct_9fa48("1700")) {
                {}
              } else {
                stryCov_9fa48("1700");
                console.error(stryMutAct_9fa48("1701") ? "" : (stryCov_9fa48("1701"), 'Erro ao registrar histórico:'), historicoError);
              }
            }
            return reply.status(200).send(stryMutAct_9fa48("1702") ? {} : (stryCov_9fa48("1702"), {
              success: stryMutAct_9fa48("1703") ? false : (stryCov_9fa48("1703"), true),
              message: stryMutAct_9fa48("1704") ? "" : (stryCov_9fa48("1704"), 'Atendimento finalizado com sucesso'),
              data: stryMutAct_9fa48("1705") ? {} : (stryCov_9fa48("1705"), {
                cliente: stryMutAct_9fa48("1706") ? {} : (stryCov_9fa48("1706"), {
                  id: cliente.id,
                  nome: cliente.nome,
                  telefone: cliente.telefone,
                  posicao: cliente.posicao,
                  status: stryMutAct_9fa48("1707") ? "" : (stryCov_9fa48("1707"), 'finalizado')
                })
              })
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("1708")) {
            {}
          } else {
            stryCov_9fa48("1708");
            return reply.status(500).send(stryMutAct_9fa48("1709") ? {} : (stryCov_9fa48("1709"), {
              success: stryMutAct_9fa48("1710") ? true : (stryCov_9fa48("1710"), false),
              error: stryMutAct_9fa48("1711") ? "" : (stryCov_9fa48("1711"), 'Erro interno do servidor')
            }));
          }
        }
      }
    });
  }
}
module.exports = gerenciarFila;