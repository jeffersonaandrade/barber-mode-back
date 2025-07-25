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
const QRCode = require('qrcode');
const {
  checkBarbeiroBarbeariaAccess
} = require('../middlewares/barbeariaAccess');
const {
  checkBarbeiroRole,
  checkGerenteBarbeariaAccess,
  checkGerenteRole
} = require('../middlewares/rolePermissions');
async function filaRoutes(fastify, options) {
  if (stryMutAct_9fa48("1889")) {
    {}
  } else {
    stryCov_9fa48("1889");
    // Adicionar cliente à fila (PÚBLICO)
    fastify.post(stryMutAct_9fa48("1890") ? "" : (stryCov_9fa48("1890"), '/fila/entrar'), stryMutAct_9fa48("1891") ? {} : (stryCov_9fa48("1891"), {
      schema: stryMutAct_9fa48("1892") ? {} : (stryCov_9fa48("1892"), {
        description: stryMutAct_9fa48("1893") ? "" : (stryCov_9fa48("1893"), 'Adicionar cliente à fila (PÚBLICO)'),
        tags: stryMutAct_9fa48("1894") ? [] : (stryCov_9fa48("1894"), [stryMutAct_9fa48("1895") ? "" : (stryCov_9fa48("1895"), 'fila')]),
        body: stryMutAct_9fa48("1896") ? {} : (stryCov_9fa48("1896"), {
          type: stryMutAct_9fa48("1897") ? "" : (stryCov_9fa48("1897"), 'object'),
          required: stryMutAct_9fa48("1898") ? [] : (stryCov_9fa48("1898"), [stryMutAct_9fa48("1899") ? "" : (stryCov_9fa48("1899"), 'nome'), stryMutAct_9fa48("1900") ? "" : (stryCov_9fa48("1900"), 'telefone'), stryMutAct_9fa48("1901") ? "" : (stryCov_9fa48("1901"), 'barbearia_id')]),
          properties: stryMutAct_9fa48("1902") ? {} : (stryCov_9fa48("1902"), {
            nome: stryMutAct_9fa48("1903") ? {} : (stryCov_9fa48("1903"), {
              type: stryMutAct_9fa48("1904") ? "" : (stryCov_9fa48("1904"), 'string')
            }),
            telefone: stryMutAct_9fa48("1905") ? {} : (stryCov_9fa48("1905"), {
              type: stryMutAct_9fa48("1906") ? "" : (stryCov_9fa48("1906"), 'string')
            }),
            barbearia_id: stryMutAct_9fa48("1907") ? {} : (stryCov_9fa48("1907"), {
              type: stryMutAct_9fa48("1908") ? "" : (stryCov_9fa48("1908"), 'integer')
            }),
            barbeiro_id: stryMutAct_9fa48("1909") ? {} : (stryCov_9fa48("1909"), {
              type: stryMutAct_9fa48("1910") ? "" : (stryCov_9fa48("1910"), 'string'),
              format: stryMutAct_9fa48("1911") ? "" : (stryCov_9fa48("1911"), 'uuid')
            })
          })
        }),
        response: stryMutAct_9fa48("1912") ? {} : (stryCov_9fa48("1912"), {
          201: stryMutAct_9fa48("1913") ? {} : (stryCov_9fa48("1913"), {
            description: stryMutAct_9fa48("1914") ? "" : (stryCov_9fa48("1914"), 'Cliente adicionado com sucesso'),
            type: stryMutAct_9fa48("1915") ? "" : (stryCov_9fa48("1915"), 'object'),
            properties: stryMutAct_9fa48("1916") ? {} : (stryCov_9fa48("1916"), {
              success: stryMutAct_9fa48("1917") ? {} : (stryCov_9fa48("1917"), {
                type: stryMutAct_9fa48("1918") ? "" : (stryCov_9fa48("1918"), 'boolean')
              }),
              message: stryMutAct_9fa48("1919") ? {} : (stryCov_9fa48("1919"), {
                type: stryMutAct_9fa48("1920") ? "" : (stryCov_9fa48("1920"), 'string')
              }),
              data: stryMutAct_9fa48("1921") ? {} : (stryCov_9fa48("1921"), {
                type: stryMutAct_9fa48("1922") ? "" : (stryCov_9fa48("1922"), 'object'),
                properties: stryMutAct_9fa48("1923") ? {} : (stryCov_9fa48("1923"), {
                  cliente: stryMutAct_9fa48("1924") ? {} : (stryCov_9fa48("1924"), {
                    type: stryMutAct_9fa48("1925") ? "" : (stryCov_9fa48("1925"), 'object')
                  }),
                  qr_code_fila: stryMutAct_9fa48("1926") ? {} : (stryCov_9fa48("1926"), {
                    type: stryMutAct_9fa48("1927") ? "" : (stryCov_9fa48("1927"), 'string')
                  }),
                  qr_code_status: stryMutAct_9fa48("1928") ? {} : (stryCov_9fa48("1928"), {
                    type: stryMutAct_9fa48("1929") ? "" : (stryCov_9fa48("1929"), 'string')
                  }),
                  posicao: stryMutAct_9fa48("1930") ? {} : (stryCov_9fa48("1930"), {
                    type: stryMutAct_9fa48("1931") ? "" : (stryCov_9fa48("1931"), 'integer')
                  })
                })
              })
            })
          })
        })
      })
      // SEM autenticação - endpoint público
    }), async (request, reply) => {
      if (stryMutAct_9fa48("1932")) {
        {}
      } else {
        stryCov_9fa48("1932");
        try {
          if (stryMutAct_9fa48("1933")) {
            {}
          } else {
            stryCov_9fa48("1933");
            const {
              nome,
              telefone,
              barbearia_id,
              barbeiro_id
            } = request.body;

            // Validações básicas
            if (stryMutAct_9fa48("1936") ? (!nome || !telefone) && !barbearia_id : stryMutAct_9fa48("1935") ? false : stryMutAct_9fa48("1934") ? true : (stryCov_9fa48("1934", "1935", "1936"), (stryMutAct_9fa48("1938") ? !nome && !telefone : stryMutAct_9fa48("1937") ? false : (stryCov_9fa48("1937", "1938"), (stryMutAct_9fa48("1939") ? nome : (stryCov_9fa48("1939"), !nome)) || (stryMutAct_9fa48("1940") ? telefone : (stryCov_9fa48("1940"), !telefone)))) || (stryMutAct_9fa48("1941") ? barbearia_id : (stryCov_9fa48("1941"), !barbearia_id)))) {
              if (stryMutAct_9fa48("1942")) {
                {}
              } else {
                stryCov_9fa48("1942");
                return reply.status(400).send(stryMutAct_9fa48("1943") ? {} : (stryCov_9fa48("1943"), {
                  success: stryMutAct_9fa48("1944") ? true : (stryCov_9fa48("1944"), false),
                  error: stryMutAct_9fa48("1945") ? "" : (stryCov_9fa48("1945"), 'Nome, telefone e barbearia_id são obrigatórios')
                }));
              }
            }

            // Verificar se a barbearia existe e está ativa
            const {
              data: barbearia,
              error: barbeariaError
            } = await fastify.supabase.from(stryMutAct_9fa48("1946") ? "" : (stryCov_9fa48("1946"), 'barbearias')).select(stryMutAct_9fa48("1947") ? "" : (stryCov_9fa48("1947"), 'id, nome, ativo')).eq(stryMutAct_9fa48("1948") ? "" : (stryCov_9fa48("1948"), 'id'), barbearia_id).eq(stryMutAct_9fa48("1949") ? "" : (stryCov_9fa48("1949"), 'ativo'), stryMutAct_9fa48("1950") ? false : (stryCov_9fa48("1950"), true)).single();
            if (stryMutAct_9fa48("1953") ? barbeariaError && !barbearia : stryMutAct_9fa48("1952") ? false : stryMutAct_9fa48("1951") ? true : (stryCov_9fa48("1951", "1952", "1953"), barbeariaError || (stryMutAct_9fa48("1954") ? barbearia : (stryCov_9fa48("1954"), !barbearia)))) {
              if (stryMutAct_9fa48("1955")) {
                {}
              } else {
                stryCov_9fa48("1955");
                return reply.status(404).send(stryMutAct_9fa48("1956") ? {} : (stryCov_9fa48("1956"), {
                  success: stryMutAct_9fa48("1957") ? true : (stryCov_9fa48("1957"), false),
                  error: stryMutAct_9fa48("1958") ? "" : (stryCov_9fa48("1958"), 'Barbearia não encontrada ou inativa')
                }));
              }
            }

            // Se barbeiro_id foi especificado, verificar se o barbeiro está ativo na barbearia
            if (stryMutAct_9fa48("1960") ? false : stryMutAct_9fa48("1959") ? true : (stryCov_9fa48("1959", "1960"), barbeiro_id)) {
              if (stryMutAct_9fa48("1961")) {
                {}
              } else {
                stryCov_9fa48("1961");
                const {
                  data: barbeiroAtivo,
                  error: barbeiroError
                } = await fastify.supabase.from(stryMutAct_9fa48("1962") ? "" : (stryCov_9fa48("1962"), 'barbeiros_barbearias')).select(stryMutAct_9fa48("1963") ? "" : (stryCov_9fa48("1963"), 'id, ativo')).eq(stryMutAct_9fa48("1964") ? "" : (stryCov_9fa48("1964"), 'user_id'), barbeiro_id).eq(stryMutAct_9fa48("1965") ? "" : (stryCov_9fa48("1965"), 'barbearia_id'), barbearia_id).eq(stryMutAct_9fa48("1966") ? "" : (stryCov_9fa48("1966"), 'ativo'), stryMutAct_9fa48("1967") ? false : (stryCov_9fa48("1967"), true)).single();
                if (stryMutAct_9fa48("1970") ? barbeiroError && !barbeiroAtivo : stryMutAct_9fa48("1969") ? false : stryMutAct_9fa48("1968") ? true : (stryCov_9fa48("1968", "1969", "1970"), barbeiroError || (stryMutAct_9fa48("1971") ? barbeiroAtivo : (stryCov_9fa48("1971"), !barbeiroAtivo)))) {
                  if (stryMutAct_9fa48("1972")) {
                    {}
                  } else {
                    stryCov_9fa48("1972");
                    return reply.status(400).send(stryMutAct_9fa48("1973") ? {} : (stryCov_9fa48("1973"), {
                      success: stryMutAct_9fa48("1974") ? true : (stryCov_9fa48("1974"), false),
                      error: stryMutAct_9fa48("1975") ? "" : (stryCov_9fa48("1975"), 'Barbeiro especificado não está ativo nesta barbearia')
                    }));
                  }
                }
              }
            }

            // Gerar token único para o cliente
            const token = stryMutAct_9fa48("1976") ? Math.random().toString(36).substring(2, 15) - Math.random().toString(36).substring(2, 15) : (stryCov_9fa48("1976"), (stryMutAct_9fa48("1977") ? Math.random().toString(36) : (stryCov_9fa48("1977"), Math.random().toString(36).substring(2, 15))) + (stryMutAct_9fa48("1978") ? Math.random().toString(36) : (stryCov_9fa48("1978"), Math.random().toString(36).substring(2, 15))));

            // Obter posição atual na fila
            const {
              data: ultimoCliente,
              error: posicaoError
            } = await fastify.supabase.from(stryMutAct_9fa48("1979") ? "" : (stryCov_9fa48("1979"), 'clientes')).select(stryMutAct_9fa48("1980") ? "" : (stryCov_9fa48("1980"), 'posicao')).eq(stryMutAct_9fa48("1981") ? "" : (stryCov_9fa48("1981"), 'barbearia_id'), barbearia_id).in(stryMutAct_9fa48("1982") ? "" : (stryCov_9fa48("1982"), 'status'), stryMutAct_9fa48("1983") ? [] : (stryCov_9fa48("1983"), [stryMutAct_9fa48("1984") ? "" : (stryCov_9fa48("1984"), 'aguardando'), stryMutAct_9fa48("1985") ? "" : (stryCov_9fa48("1985"), 'proximo')])).order(stryMutAct_9fa48("1986") ? "" : (stryCov_9fa48("1986"), 'posicao'), stryMutAct_9fa48("1987") ? {} : (stryCov_9fa48("1987"), {
              ascending: stryMutAct_9fa48("1988") ? true : (stryCov_9fa48("1988"), false)
            })).limit(1).single();
            const posicao = ultimoCliente ? stryMutAct_9fa48("1989") ? ultimoCliente.posicao - 1 : (stryCov_9fa48("1989"), ultimoCliente.posicao + 1) : 1;

            // Inserir cliente na fila
            const {
              data: cliente,
              error: insertError
            } = await fastify.supabase.from(stryMutAct_9fa48("1990") ? "" : (stryCov_9fa48("1990"), 'clientes')).insert(stryMutAct_9fa48("1991") ? {} : (stryCov_9fa48("1991"), {
              nome,
              telefone,
              token,
              barbearia_id,
              barbeiro_id: stryMutAct_9fa48("1994") ? barbeiro_id && null : stryMutAct_9fa48("1993") ? false : stryMutAct_9fa48("1992") ? true : (stryCov_9fa48("1992", "1993", "1994"), barbeiro_id || null),
              status: stryMutAct_9fa48("1995") ? "" : (stryCov_9fa48("1995"), 'aguardando'),
              posicao
            })).select().single();
            if (stryMutAct_9fa48("1997") ? false : stryMutAct_9fa48("1996") ? true : (stryCov_9fa48("1996", "1997"), insertError)) {
              if (stryMutAct_9fa48("1998")) {
                {}
              } else {
                stryCov_9fa48("1998");
                return reply.status(500).send(stryMutAct_9fa48("1999") ? {} : (stryCov_9fa48("1999"), {
                  success: stryMutAct_9fa48("2000") ? true : (stryCov_9fa48("2000"), false),
                  error: stryMutAct_9fa48("2001") ? "" : (stryCov_9fa48("2001"), 'Erro interno do servidor')
                }));
              }
            }

            // Gerar QR codes
            const baseUrl = stryMutAct_9fa48("2004") ? process.env.BASE_URL && 'http://localhost:3000' : stryMutAct_9fa48("2003") ? false : stryMutAct_9fa48("2002") ? true : (stryCov_9fa48("2002", "2003", "2004"), process.env.BASE_URL || (stryMutAct_9fa48("2005") ? "" : (stryCov_9fa48("2005"), 'http://localhost:3000')));
            const qrCodeFila = await QRCode.toDataURL(stryMutAct_9fa48("2006") ? `` : (stryCov_9fa48("2006"), `${baseUrl}/fila/${cliente.id}`));
            const qrCodeStatus = await QRCode.toDataURL(stryMutAct_9fa48("2007") ? `` : (stryCov_9fa48("2007"), `${baseUrl}/status/${cliente.token}`));
            return reply.status(201).send(stryMutAct_9fa48("2008") ? {} : (stryCov_9fa48("2008"), {
              success: stryMutAct_9fa48("2009") ? false : (stryCov_9fa48("2009"), true),
              message: stryMutAct_9fa48("2010") ? "" : (stryCov_9fa48("2010"), 'Cliente adicionado à fila com sucesso'),
              data: stryMutAct_9fa48("2011") ? {} : (stryCov_9fa48("2011"), {
                cliente: stryMutAct_9fa48("2012") ? {} : (stryCov_9fa48("2012"), {
                  id: cliente.id,
                  nome: cliente.nome,
                  posicao: cliente.posicao,
                  status: cliente.status,
                  token: cliente.token
                }),
                qr_code_fila: qrCodeFila,
                qr_code_status: qrCodeStatus,
                posicao
              })
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("2013")) {
            {}
          } else {
            stryCov_9fa48("2013");
            return reply.status(500).send(stryMutAct_9fa48("2014") ? {} : (stryCov_9fa48("2014"), {
              success: stryMutAct_9fa48("2015") ? true : (stryCov_9fa48("2015"), false),
              error: stryMutAct_9fa48("2016") ? "" : (stryCov_9fa48("2016"), 'Erro interno do servidor')
            }));
          }
        }
      }
    });

    // Obter fila da barbearia (APENAS BARBEIROS)
    fastify.get(stryMutAct_9fa48("2017") ? "" : (stryCov_9fa48("2017"), '/fila/:barbearia_id'), stryMutAct_9fa48("2018") ? {} : (stryCov_9fa48("2018"), {
      schema: stryMutAct_9fa48("2019") ? {} : (stryCov_9fa48("2019"), {
        description: stryMutAct_9fa48("2020") ? "" : (stryCov_9fa48("2020"), 'Obter fila da barbearia (APENAS BARBEIROS)'),
        tags: stryMutAct_9fa48("2021") ? [] : (stryCov_9fa48("2021"), [stryMutAct_9fa48("2022") ? "" : (stryCov_9fa48("2022"), 'fila')]),
        params: stryMutAct_9fa48("2023") ? {} : (stryCov_9fa48("2023"), {
          type: stryMutAct_9fa48("2024") ? "" : (stryCov_9fa48("2024"), 'object'),
          required: stryMutAct_9fa48("2025") ? [] : (stryCov_9fa48("2025"), [stryMutAct_9fa48("2026") ? "" : (stryCov_9fa48("2026"), 'barbearia_id')]),
          properties: stryMutAct_9fa48("2027") ? {} : (stryCov_9fa48("2027"), {
            barbearia_id: stryMutAct_9fa48("2028") ? {} : (stryCov_9fa48("2028"), {
              type: stryMutAct_9fa48("2029") ? "" : (stryCov_9fa48("2029"), 'integer')
            })
          })
        }),
        response: stryMutAct_9fa48("2030") ? {} : (stryCov_9fa48("2030"), {
          200: stryMutAct_9fa48("2031") ? {} : (stryCov_9fa48("2031"), {
            description: stryMutAct_9fa48("2032") ? "" : (stryCov_9fa48("2032"), 'Fila da barbearia'),
            type: stryMutAct_9fa48("2033") ? "" : (stryCov_9fa48("2033"), 'object'),
            properties: stryMutAct_9fa48("2034") ? {} : (stryCov_9fa48("2034"), {
              success: stryMutAct_9fa48("2035") ? {} : (stryCov_9fa48("2035"), {
                type: stryMutAct_9fa48("2036") ? "" : (stryCov_9fa48("2036"), 'boolean')
              }),
              data: stryMutAct_9fa48("2037") ? {} : (stryCov_9fa48("2037"), {
                type: stryMutAct_9fa48("2038") ? "" : (stryCov_9fa48("2038"), 'object'),
                properties: stryMutAct_9fa48("2039") ? {} : (stryCov_9fa48("2039"), {
                  clientes: stryMutAct_9fa48("2040") ? {} : (stryCov_9fa48("2040"), {
                    type: stryMutAct_9fa48("2041") ? "" : (stryCov_9fa48("2041"), 'array')
                  }),
                  estatisticas: stryMutAct_9fa48("2042") ? {} : (stryCov_9fa48("2042"), {
                    type: stryMutAct_9fa48("2043") ? "" : (stryCov_9fa48("2043"), 'object')
                  })
                })
              })
            })
          })
        })
      }),
      preHandler: stryMutAct_9fa48("2044") ? [] : (stryCov_9fa48("2044"), [fastify.authenticate, checkBarbeiroBarbeariaAccess])
    }), async (request, reply) => {
      if (stryMutAct_9fa48("2045")) {
        {}
      } else {
        stryCov_9fa48("2045");
        try {
          if (stryMutAct_9fa48("2046")) {
            {}
          } else {
            stryCov_9fa48("2046");
            const {
              barbearia_id
            } = request.params;
            // Verificar se a barbearia existe
            const {
              data: barbearia,
              error: barbeariaError
            } = await fastify.supabase.from(stryMutAct_9fa48("2047") ? "" : (stryCov_9fa48("2047"), 'barbearias')).select(stryMutAct_9fa48("2048") ? "" : (stryCov_9fa48("2048"), 'id, nome, ativo')).eq(stryMutAct_9fa48("2049") ? "" : (stryCov_9fa48("2049"), 'id'), barbearia_id).single();
            if (stryMutAct_9fa48("2052") ? barbeariaError && !barbearia : stryMutAct_9fa48("2051") ? false : stryMutAct_9fa48("2050") ? true : (stryCov_9fa48("2050", "2051", "2052"), barbeariaError || (stryMutAct_9fa48("2053") ? barbearia : (stryCov_9fa48("2053"), !barbearia)))) {
              if (stryMutAct_9fa48("2054")) {
                {}
              } else {
                stryCov_9fa48("2054");
                return reply.status(404).send(stryMutAct_9fa48("2055") ? {} : (stryCov_9fa48("2055"), {
                  success: stryMutAct_9fa48("2056") ? true : (stryCov_9fa48("2056"), false),
                  error: stryMutAct_9fa48("2057") ? "" : (stryCov_9fa48("2057"), 'Barbearia não encontrada')
                }));
              }
            }
            // Obter clientes na fila (incluindo removidos para estatísticas)
            const {
              data: clientes,
              error: clientesError
            } = await fastify.supabase.from(stryMutAct_9fa48("2058") ? "" : (stryCov_9fa48("2058"), 'clientes')).select(stryMutAct_9fa48("2059") ? `` : (stryCov_9fa48("2059"), `
          id,
          nome,
          telefone,
          token,
          barbearia_id,
          barbeiro_id,
          status,
          posicao,
          created_at,
          data_atendimento,
          data_finalizacao
        `)).eq(stryMutAct_9fa48("2060") ? "" : (stryCov_9fa48("2060"), 'barbearia_id'), barbearia_id).in(stryMutAct_9fa48("2061") ? "" : (stryCov_9fa48("2061"), 'status'), stryMutAct_9fa48("2062") ? [] : (stryCov_9fa48("2062"), [stryMutAct_9fa48("2063") ? "" : (stryCov_9fa48("2063"), 'aguardando'), stryMutAct_9fa48("2064") ? "" : (stryCov_9fa48("2064"), 'proximo'), stryMutAct_9fa48("2065") ? "" : (stryCov_9fa48("2065"), 'atendendo'), stryMutAct_9fa48("2066") ? "" : (stryCov_9fa48("2066"), 'finalizado'), stryMutAct_9fa48("2067") ? "" : (stryCov_9fa48("2067"), 'removido')])).order(stryMutAct_9fa48("2068") ? "" : (stryCov_9fa48("2068"), 'posicao'), stryMutAct_9fa48("2069") ? {} : (stryCov_9fa48("2069"), {
              ascending: stryMutAct_9fa48("2070") ? false : (stryCov_9fa48("2070"), true)
            }));
            if (stryMutAct_9fa48("2072") ? false : stryMutAct_9fa48("2071") ? true : (stryCov_9fa48("2071", "2072"), clientesError)) {
              if (stryMutAct_9fa48("2073")) {
                {}
              } else {
                stryCov_9fa48("2073");
                return reply.status(500).send(stryMutAct_9fa48("2074") ? {} : (stryCov_9fa48("2074"), {
                  success: stryMutAct_9fa48("2075") ? true : (stryCov_9fa48("2075"), false),
                  error: stryMutAct_9fa48("2076") ? "" : (stryCov_9fa48("2076"), 'Erro interno do servidor')
                }));
              }
            }
            // Filtrar apenas clientes ativos para exibição
            const clientesAtivos = stryMutAct_9fa48("2077") ? clientes : (stryCov_9fa48("2077"), clientes.filter(stryMutAct_9fa48("2078") ? () => undefined : (stryCov_9fa48("2078"), c => stryMutAct_9fa48("2079") ? ['finalizado', 'removido'].includes(c.status) : (stryCov_9fa48("2079"), !(stryMutAct_9fa48("2080") ? [] : (stryCov_9fa48("2080"), [stryMutAct_9fa48("2081") ? "" : (stryCov_9fa48("2081"), 'finalizado'), stryMutAct_9fa48("2082") ? "" : (stryCov_9fa48("2082"), 'removido')])).includes(c.status)))));

            // Calcular estatísticas
            const totalClientes = clientes.length;
            const aguardando = stryMutAct_9fa48("2083") ? clientes.length : (stryCov_9fa48("2083"), clientes.filter(stryMutAct_9fa48("2084") ? () => undefined : (stryCov_9fa48("2084"), c => stryMutAct_9fa48("2087") ? c.status !== 'aguardando' : stryMutAct_9fa48("2086") ? false : stryMutAct_9fa48("2085") ? true : (stryCov_9fa48("2085", "2086", "2087"), c.status === (stryMutAct_9fa48("2088") ? "" : (stryCov_9fa48("2088"), 'aguardando'))))).length);
            const proximo = stryMutAct_9fa48("2089") ? clientes.length : (stryCov_9fa48("2089"), clientes.filter(stryMutAct_9fa48("2090") ? () => undefined : (stryCov_9fa48("2090"), c => stryMutAct_9fa48("2093") ? c.status !== 'proximo' : stryMutAct_9fa48("2092") ? false : stryMutAct_9fa48("2091") ? true : (stryCov_9fa48("2091", "2092", "2093"), c.status === (stryMutAct_9fa48("2094") ? "" : (stryCov_9fa48("2094"), 'proximo'))))).length);
            const atendendo = stryMutAct_9fa48("2095") ? clientes.length : (stryCov_9fa48("2095"), clientes.filter(stryMutAct_9fa48("2096") ? () => undefined : (stryCov_9fa48("2096"), c => stryMutAct_9fa48("2099") ? c.status !== 'atendendo' : stryMutAct_9fa48("2098") ? false : stryMutAct_9fa48("2097") ? true : (stryCov_9fa48("2097", "2098", "2099"), c.status === (stryMutAct_9fa48("2100") ? "" : (stryCov_9fa48("2100"), 'atendendo'))))).length);
            const finalizados = stryMutAct_9fa48("2101") ? clientes.length : (stryCov_9fa48("2101"), clientes.filter(stryMutAct_9fa48("2102") ? () => undefined : (stryCov_9fa48("2102"), c => stryMutAct_9fa48("2105") ? c.status !== 'finalizado' : stryMutAct_9fa48("2104") ? false : stryMutAct_9fa48("2103") ? true : (stryCov_9fa48("2103", "2104", "2105"), c.status === (stryMutAct_9fa48("2106") ? "" : (stryCov_9fa48("2106"), 'finalizado'))))).length);
            const removidos = stryMutAct_9fa48("2107") ? clientes.length : (stryCov_9fa48("2107"), clientes.filter(stryMutAct_9fa48("2108") ? () => undefined : (stryCov_9fa48("2108"), c => stryMutAct_9fa48("2111") ? c.status !== 'removido' : stryMutAct_9fa48("2110") ? false : stryMutAct_9fa48("2109") ? true : (stryCov_9fa48("2109", "2110", "2111"), c.status === (stryMutAct_9fa48("2112") ? "" : (stryCov_9fa48("2112"), 'removido'))))).length);

            // Obter número de barbeiros ativos
            const {
              data: barbeirosAtivos
            } = await fastify.supabase.from(stryMutAct_9fa48("2113") ? "" : (stryCov_9fa48("2113"), 'barbeiros_barbearias')).select(stryMutAct_9fa48("2114") ? "" : (stryCov_9fa48("2114"), 'id')).eq(stryMutAct_9fa48("2115") ? "" : (stryCov_9fa48("2115"), 'barbearia_id'), barbearia_id).eq(stryMutAct_9fa48("2116") ? "" : (stryCov_9fa48("2116"), 'ativo'), stryMutAct_9fa48("2117") ? false : (stryCov_9fa48("2117"), true));
            const barbeirosAtivosCount = barbeirosAtivos ? barbeirosAtivos.length : 0;

            // Calcular tempo estimado (15 minutos por cliente)
            const tempoEstimado = stryMutAct_9fa48("2118") ? aguardando / 15 : (stryCov_9fa48("2118"), aguardando * 15);
            return reply.status(200).send(stryMutAct_9fa48("2119") ? {} : (stryCov_9fa48("2119"), {
              success: stryMutAct_9fa48("2120") ? false : (stryCov_9fa48("2120"), true),
              data: stryMutAct_9fa48("2121") ? {} : (stryCov_9fa48("2121"), {
                clientes: clientesAtivos,
                estatisticas: stryMutAct_9fa48("2122") ? {} : (stryCov_9fa48("2122"), {
                  total_clientes: totalClientes,
                  aguardando,
                  proximo,
                  atendendo,
                  finalizados,
                  removidos,
                  tempo_estimado: tempoEstimado,
                  barbeiros_ativos: barbeirosAtivosCount
                })
              })
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("2123")) {
            {}
          } else {
            stryCov_9fa48("2123");
            return reply.status(500).send(stryMutAct_9fa48("2124") ? {} : (stryCov_9fa48("2124"), {
              success: stryMutAct_9fa48("2125") ? true : (stryCov_9fa48("2125"), false),
              error: stryMutAct_9fa48("2126") ? "" : (stryCov_9fa48("2126"), 'Erro interno do servidor')
            }));
          }
        }
      }
    });

    // Obter fila da barbearia (APENAS GERENTES)
    fastify.get(stryMutAct_9fa48("2127") ? "" : (stryCov_9fa48("2127"), '/fila-gerente/:barbearia_id'), stryMutAct_9fa48("2128") ? {} : (stryCov_9fa48("2128"), {
      schema: stryMutAct_9fa48("2129") ? {} : (stryCov_9fa48("2129"), {
        description: stryMutAct_9fa48("2130") ? "" : (stryCov_9fa48("2130"), 'Obter fila da barbearia (APENAS GERENTES)'),
        tags: stryMutAct_9fa48("2131") ? [] : (stryCov_9fa48("2131"), [stryMutAct_9fa48("2132") ? "" : (stryCov_9fa48("2132"), 'fila')]),
        params: stryMutAct_9fa48("2133") ? {} : (stryCov_9fa48("2133"), {
          type: stryMutAct_9fa48("2134") ? "" : (stryCov_9fa48("2134"), 'object'),
          required: stryMutAct_9fa48("2135") ? [] : (stryCov_9fa48("2135"), [stryMutAct_9fa48("2136") ? "" : (stryCov_9fa48("2136"), 'barbearia_id')]),
          properties: stryMutAct_9fa48("2137") ? {} : (stryCov_9fa48("2137"), {
            barbearia_id: stryMutAct_9fa48("2138") ? {} : (stryCov_9fa48("2138"), {
              type: stryMutAct_9fa48("2139") ? "" : (stryCov_9fa48("2139"), 'integer')
            })
          })
        }),
        response: stryMutAct_9fa48("2140") ? {} : (stryCov_9fa48("2140"), {
          200: stryMutAct_9fa48("2141") ? {} : (stryCov_9fa48("2141"), {
            description: stryMutAct_9fa48("2142") ? "" : (stryCov_9fa48("2142"), 'Fila da barbearia (dados limitados para gerente)'),
            type: stryMutAct_9fa48("2143") ? "" : (stryCov_9fa48("2143"), 'object'),
            properties: stryMutAct_9fa48("2144") ? {} : (stryCov_9fa48("2144"), {
              success: stryMutAct_9fa48("2145") ? {} : (stryCov_9fa48("2145"), {
                type: stryMutAct_9fa48("2146") ? "" : (stryCov_9fa48("2146"), 'boolean')
              }),
              data: stryMutAct_9fa48("2147") ? {} : (stryCov_9fa48("2147"), {
                type: stryMutAct_9fa48("2148") ? "" : (stryCov_9fa48("2148"), 'object'),
                properties: stryMutAct_9fa48("2149") ? {} : (stryCov_9fa48("2149"), {
                  estatisticas: stryMutAct_9fa48("2150") ? {} : (stryCov_9fa48("2150"), {
                    type: stryMutAct_9fa48("2151") ? "" : (stryCov_9fa48("2151"), 'object')
                  })
                })
              })
            })
          })
        })
      }),
      preHandler: stryMutAct_9fa48("2152") ? [] : (stryCov_9fa48("2152"), [fastify.authenticate, checkGerenteRole, checkGerenteBarbeariaAccess])
    }), async (request, reply) => {
      if (stryMutAct_9fa48("2153")) {
        {}
      } else {
        stryCov_9fa48("2153");
        try {
          if (stryMutAct_9fa48("2154")) {
            {}
          } else {
            stryCov_9fa48("2154");
            const {
              barbearia_id
            } = request.params;

            // Verificar se a barbearia existe
            const {
              data: barbearia,
              error: barbeariaError
            } = await fastify.supabase.from(stryMutAct_9fa48("2155") ? "" : (stryCov_9fa48("2155"), 'barbearias')).select(stryMutAct_9fa48("2156") ? "" : (stryCov_9fa48("2156"), 'id, nome, ativo')).eq(stryMutAct_9fa48("2157") ? "" : (stryCov_9fa48("2157"), 'id'), barbearia_id).single();
            if (stryMutAct_9fa48("2160") ? barbeariaError && !barbearia : stryMutAct_9fa48("2159") ? false : stryMutAct_9fa48("2158") ? true : (stryCov_9fa48("2158", "2159", "2160"), barbeariaError || (stryMutAct_9fa48("2161") ? barbearia : (stryCov_9fa48("2161"), !barbearia)))) {
              if (stryMutAct_9fa48("2162")) {
                {}
              } else {
                stryCov_9fa48("2162");
                return reply.status(404).send(stryMutAct_9fa48("2163") ? {} : (stryCov_9fa48("2163"), {
                  success: stryMutAct_9fa48("2164") ? true : (stryCov_9fa48("2164"), false),
                  error: stryMutAct_9fa48("2165") ? "" : (stryCov_9fa48("2165"), 'Barbearia não encontrada')
                }));
              }
            }

            // Obter apenas estatísticas da fila (sem dados pessoais dos clientes)
            const {
              data: clientes,
              error: clientesError
            } = await fastify.supabase.from(stryMutAct_9fa48("2166") ? "" : (stryCov_9fa48("2166"), 'clientes')).select(stryMutAct_9fa48("2167") ? "" : (stryCov_9fa48("2167"), 'status')).eq(stryMutAct_9fa48("2168") ? "" : (stryCov_9fa48("2168"), 'barbearia_id'), barbearia_id).in(stryMutAct_9fa48("2169") ? "" : (stryCov_9fa48("2169"), 'status'), stryMutAct_9fa48("2170") ? [] : (stryCov_9fa48("2170"), [stryMutAct_9fa48("2171") ? "" : (stryCov_9fa48("2171"), 'aguardando'), stryMutAct_9fa48("2172") ? "" : (stryCov_9fa48("2172"), 'proximo'), stryMutAct_9fa48("2173") ? "" : (stryCov_9fa48("2173"), 'atendendo'), stryMutAct_9fa48("2174") ? "" : (stryCov_9fa48("2174"), 'finalizado'), stryMutAct_9fa48("2175") ? "" : (stryCov_9fa48("2175"), 'removido')]));
            if (stryMutAct_9fa48("2177") ? false : stryMutAct_9fa48("2176") ? true : (stryCov_9fa48("2176", "2177"), clientesError)) {
              if (stryMutAct_9fa48("2178")) {
                {}
              } else {
                stryCov_9fa48("2178");
                return reply.status(500).send(stryMutAct_9fa48("2179") ? {} : (stryCov_9fa48("2179"), {
                  success: stryMutAct_9fa48("2180") ? true : (stryCov_9fa48("2180"), false),
                  error: stryMutAct_9fa48("2181") ? "" : (stryCov_9fa48("2181"), 'Erro interno do servidor')
                }));
              }
            }

            // Calcular estatísticas
            const totalClientes = clientes.length;
            const aguardando = stryMutAct_9fa48("2182") ? clientes.length : (stryCov_9fa48("2182"), clientes.filter(stryMutAct_9fa48("2183") ? () => undefined : (stryCov_9fa48("2183"), c => stryMutAct_9fa48("2186") ? c.status !== 'aguardando' : stryMutAct_9fa48("2185") ? false : stryMutAct_9fa48("2184") ? true : (stryCov_9fa48("2184", "2185", "2186"), c.status === (stryMutAct_9fa48("2187") ? "" : (stryCov_9fa48("2187"), 'aguardando'))))).length);
            const proximo = stryMutAct_9fa48("2188") ? clientes.length : (stryCov_9fa48("2188"), clientes.filter(stryMutAct_9fa48("2189") ? () => undefined : (stryCov_9fa48("2189"), c => stryMutAct_9fa48("2192") ? c.status !== 'proximo' : stryMutAct_9fa48("2191") ? false : stryMutAct_9fa48("2190") ? true : (stryCov_9fa48("2190", "2191", "2192"), c.status === (stryMutAct_9fa48("2193") ? "" : (stryCov_9fa48("2193"), 'proximo'))))).length);
            const atendendo = stryMutAct_9fa48("2194") ? clientes.length : (stryCov_9fa48("2194"), clientes.filter(stryMutAct_9fa48("2195") ? () => undefined : (stryCov_9fa48("2195"), c => stryMutAct_9fa48("2198") ? c.status !== 'atendendo' : stryMutAct_9fa48("2197") ? false : stryMutAct_9fa48("2196") ? true : (stryCov_9fa48("2196", "2197", "2198"), c.status === (stryMutAct_9fa48("2199") ? "" : (stryCov_9fa48("2199"), 'atendendo'))))).length);
            const finalizados = stryMutAct_9fa48("2200") ? clientes.length : (stryCov_9fa48("2200"), clientes.filter(stryMutAct_9fa48("2201") ? () => undefined : (stryCov_9fa48("2201"), c => stryMutAct_9fa48("2204") ? c.status !== 'finalizado' : stryMutAct_9fa48("2203") ? false : stryMutAct_9fa48("2202") ? true : (stryCov_9fa48("2202", "2203", "2204"), c.status === (stryMutAct_9fa48("2205") ? "" : (stryCov_9fa48("2205"), 'finalizado'))))).length);
            const removidos = stryMutAct_9fa48("2206") ? clientes.length : (stryCov_9fa48("2206"), clientes.filter(stryMutAct_9fa48("2207") ? () => undefined : (stryCov_9fa48("2207"), c => stryMutAct_9fa48("2210") ? c.status !== 'removido' : stryMutAct_9fa48("2209") ? false : stryMutAct_9fa48("2208") ? true : (stryCov_9fa48("2208", "2209", "2210"), c.status === (stryMutAct_9fa48("2211") ? "" : (stryCov_9fa48("2211"), 'removido'))))).length);

            // Obter número de barbeiros ativos
            const {
              data: barbeirosAtivos
            } = await fastify.supabase.from(stryMutAct_9fa48("2212") ? "" : (stryCov_9fa48("2212"), 'barbeiros_barbearias')).select(stryMutAct_9fa48("2213") ? "" : (stryCov_9fa48("2213"), 'id')).eq(stryMutAct_9fa48("2214") ? "" : (stryCov_9fa48("2214"), 'barbearia_id'), barbearia_id).eq(stryMutAct_9fa48("2215") ? "" : (stryCov_9fa48("2215"), 'ativo'), stryMutAct_9fa48("2216") ? false : (stryCov_9fa48("2216"), true));
            const barbeirosAtivosCount = barbeirosAtivos ? barbeirosAtivos.length : 0;

            // Calcular tempo estimado (15 minutos por cliente)
            const tempoEstimado = stryMutAct_9fa48("2217") ? aguardando / 15 : (stryCov_9fa48("2217"), aguardando * 15);
            return reply.status(200).send(stryMutAct_9fa48("2218") ? {} : (stryCov_9fa48("2218"), {
              success: stryMutAct_9fa48("2219") ? false : (stryCov_9fa48("2219"), true),
              data: stryMutAct_9fa48("2220") ? {} : (stryCov_9fa48("2220"), {
                barbearia: stryMutAct_9fa48("2221") ? {} : (stryCov_9fa48("2221"), {
                  id: barbearia.id,
                  nome: barbearia.nome
                }),
                estatisticas: stryMutAct_9fa48("2222") ? {} : (stryCov_9fa48("2222"), {
                  total_clientes: totalClientes,
                  aguardando,
                  proximo,
                  atendendo,
                  finalizados,
                  removidos,
                  tempo_estimado: tempoEstimado,
                  barbeiros_ativos: barbeirosAtivosCount
                })
              })
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("2223")) {
            {}
          } else {
            stryCov_9fa48("2223");
            return reply.status(500).send(stryMutAct_9fa48("2224") ? {} : (stryCov_9fa48("2224"), {
              success: stryMutAct_9fa48("2225") ? true : (stryCov_9fa48("2225"), false),
              error: stryMutAct_9fa48("2226") ? "" : (stryCov_9fa48("2226"), 'Erro interno do servidor')
            }));
          }
        }
      }
    });

    // Obter fila da barbearia (PÚBLICO - para clientes)
    fastify.get(stryMutAct_9fa48("2227") ? "" : (stryCov_9fa48("2227"), '/fila-publica/:barbearia_id'), stryMutAct_9fa48("2228") ? {} : (stryCov_9fa48("2228"), {
      schema: stryMutAct_9fa48("2229") ? {} : (stryCov_9fa48("2229"), {
        description: stryMutAct_9fa48("2230") ? "" : (stryCov_9fa48("2230"), 'Obter fila da barbearia (PÚBLICO - para clientes)'),
        tags: stryMutAct_9fa48("2231") ? [] : (stryCov_9fa48("2231"), [stryMutAct_9fa48("2232") ? "" : (stryCov_9fa48("2232"), 'fila')]),
        params: stryMutAct_9fa48("2233") ? {} : (stryCov_9fa48("2233"), {
          type: stryMutAct_9fa48("2234") ? "" : (stryCov_9fa48("2234"), 'object'),
          required: stryMutAct_9fa48("2235") ? [] : (stryCov_9fa48("2235"), [stryMutAct_9fa48("2236") ? "" : (stryCov_9fa48("2236"), 'barbearia_id')]),
          properties: stryMutAct_9fa48("2237") ? {} : (stryCov_9fa48("2237"), {
            barbearia_id: stryMutAct_9fa48("2238") ? {} : (stryCov_9fa48("2238"), {
              type: stryMutAct_9fa48("2239") ? "" : (stryCov_9fa48("2239"), 'integer')
            })
          })
        }),
        response: stryMutAct_9fa48("2240") ? {} : (stryCov_9fa48("2240"), {
          200: stryMutAct_9fa48("2241") ? {} : (stryCov_9fa48("2241"), {
            description: stryMutAct_9fa48("2242") ? "" : (stryCov_9fa48("2242"), 'Fila da barbearia (dados limitados)'),
            type: stryMutAct_9fa48("2243") ? "" : (stryCov_9fa48("2243"), 'object'),
            properties: stryMutAct_9fa48("2244") ? {} : (stryCov_9fa48("2244"), {
              success: stryMutAct_9fa48("2245") ? {} : (stryCov_9fa48("2245"), {
                type: stryMutAct_9fa48("2246") ? "" : (stryCov_9fa48("2246"), 'boolean')
              }),
              data: stryMutAct_9fa48("2247") ? {} : (stryCov_9fa48("2247"), {
                type: stryMutAct_9fa48("2248") ? "" : (stryCov_9fa48("2248"), 'object'),
                properties: stryMutAct_9fa48("2249") ? {} : (stryCov_9fa48("2249"), {
                  barbearia: stryMutAct_9fa48("2250") ? {} : (stryCov_9fa48("2250"), {
                    type: stryMutAct_9fa48("2251") ? "" : (stryCov_9fa48("2251"), 'object')
                  }),
                  estatisticas: stryMutAct_9fa48("2252") ? {} : (stryCov_9fa48("2252"), {
                    type: stryMutAct_9fa48("2253") ? "" : (stryCov_9fa48("2253"), 'object')
                  })
                })
              })
            })
          })
        })
      })
      // SEM autenticação - endpoint público
    }), async (request, reply) => {
      if (stryMutAct_9fa48("2254")) {
        {}
      } else {
        stryCov_9fa48("2254");
        try {
          if (stryMutAct_9fa48("2255")) {
            {}
          } else {
            stryCov_9fa48("2255");
            const {
              barbearia_id
            } = request.params;

            // Verificar se a barbearia existe e está ativa
            const {
              data: barbearia,
              error: barbeariaError
            } = await fastify.supabase.from(stryMutAct_9fa48("2256") ? "" : (stryCov_9fa48("2256"), 'barbearias')).select(stryMutAct_9fa48("2257") ? "" : (stryCov_9fa48("2257"), 'id, nome, ativo, endereco, telefone')).eq(stryMutAct_9fa48("2258") ? "" : (stryCov_9fa48("2258"), 'id'), barbearia_id).eq(stryMutAct_9fa48("2259") ? "" : (stryCov_9fa48("2259"), 'ativo'), stryMutAct_9fa48("2260") ? false : (stryCov_9fa48("2260"), true)).single();
            if (stryMutAct_9fa48("2263") ? barbeariaError && !barbearia : stryMutAct_9fa48("2262") ? false : stryMutAct_9fa48("2261") ? true : (stryCov_9fa48("2261", "2262", "2263"), barbeariaError || (stryMutAct_9fa48("2264") ? barbearia : (stryCov_9fa48("2264"), !barbearia)))) {
              if (stryMutAct_9fa48("2265")) {
                {}
              } else {
                stryCov_9fa48("2265");
                return reply.status(404).send(stryMutAct_9fa48("2266") ? {} : (stryCov_9fa48("2266"), {
                  success: stryMutAct_9fa48("2267") ? true : (stryCov_9fa48("2267"), false),
                  error: stryMutAct_9fa48("2268") ? "" : (stryCov_9fa48("2268"), 'Barbearia não encontrada ou inativa')
                }));
              }
            }

            // Obter apenas estatísticas da fila (sem dados pessoais dos clientes)
            const {
              data: clientes,
              error: clientesError
            } = await fastify.supabase.from(stryMutAct_9fa48("2269") ? "" : (stryCov_9fa48("2269"), 'clientes')).select(stryMutAct_9fa48("2270") ? "" : (stryCov_9fa48("2270"), 'status')).eq(stryMutAct_9fa48("2271") ? "" : (stryCov_9fa48("2271"), 'barbearia_id'), barbearia_id).in(stryMutAct_9fa48("2272") ? "" : (stryCov_9fa48("2272"), 'status'), stryMutAct_9fa48("2273") ? [] : (stryCov_9fa48("2273"), [stryMutAct_9fa48("2274") ? "" : (stryCov_9fa48("2274"), 'aguardando'), stryMutAct_9fa48("2275") ? "" : (stryCov_9fa48("2275"), 'proximo'), stryMutAct_9fa48("2276") ? "" : (stryCov_9fa48("2276"), 'atendendo'), stryMutAct_9fa48("2277") ? "" : (stryCov_9fa48("2277"), 'finalizado'), stryMutAct_9fa48("2278") ? "" : (stryCov_9fa48("2278"), 'removido')]));
            if (stryMutAct_9fa48("2280") ? false : stryMutAct_9fa48("2279") ? true : (stryCov_9fa48("2279", "2280"), clientesError)) {
              if (stryMutAct_9fa48("2281")) {
                {}
              } else {
                stryCov_9fa48("2281");
                return reply.status(500).send(stryMutAct_9fa48("2282") ? {} : (stryCov_9fa48("2282"), {
                  success: stryMutAct_9fa48("2283") ? true : (stryCov_9fa48("2283"), false),
                  error: stryMutAct_9fa48("2284") ? "" : (stryCov_9fa48("2284"), 'Erro interno do servidor')
                }));
              }
            }

            // Calcular estatísticas
            const totalClientes = clientes.length;
            const aguardando = stryMutAct_9fa48("2285") ? clientes.length : (stryCov_9fa48("2285"), clientes.filter(stryMutAct_9fa48("2286") ? () => undefined : (stryCov_9fa48("2286"), c => stryMutAct_9fa48("2289") ? c.status !== 'aguardando' : stryMutAct_9fa48("2288") ? false : stryMutAct_9fa48("2287") ? true : (stryCov_9fa48("2287", "2288", "2289"), c.status === (stryMutAct_9fa48("2290") ? "" : (stryCov_9fa48("2290"), 'aguardando'))))).length);
            const proximo = stryMutAct_9fa48("2291") ? clientes.length : (stryCov_9fa48("2291"), clientes.filter(stryMutAct_9fa48("2292") ? () => undefined : (stryCov_9fa48("2292"), c => stryMutAct_9fa48("2295") ? c.status !== 'proximo' : stryMutAct_9fa48("2294") ? false : stryMutAct_9fa48("2293") ? true : (stryCov_9fa48("2293", "2294", "2295"), c.status === (stryMutAct_9fa48("2296") ? "" : (stryCov_9fa48("2296"), 'proximo'))))).length);
            const atendendo = stryMutAct_9fa48("2297") ? clientes.length : (stryCov_9fa48("2297"), clientes.filter(stryMutAct_9fa48("2298") ? () => undefined : (stryCov_9fa48("2298"), c => stryMutAct_9fa48("2301") ? c.status !== 'atendendo' : stryMutAct_9fa48("2300") ? false : stryMutAct_9fa48("2299") ? true : (stryCov_9fa48("2299", "2300", "2301"), c.status === (stryMutAct_9fa48("2302") ? "" : (stryCov_9fa48("2302"), 'atendendo'))))).length);
            const finalizados = stryMutAct_9fa48("2303") ? clientes.length : (stryCov_9fa48("2303"), clientes.filter(stryMutAct_9fa48("2304") ? () => undefined : (stryCov_9fa48("2304"), c => stryMutAct_9fa48("2307") ? c.status !== 'finalizado' : stryMutAct_9fa48("2306") ? false : stryMutAct_9fa48("2305") ? true : (stryCov_9fa48("2305", "2306", "2307"), c.status === (stryMutAct_9fa48("2308") ? "" : (stryCov_9fa48("2308"), 'finalizado'))))).length);
            const removidos = stryMutAct_9fa48("2309") ? clientes.length : (stryCov_9fa48("2309"), clientes.filter(stryMutAct_9fa48("2310") ? () => undefined : (stryCov_9fa48("2310"), c => stryMutAct_9fa48("2313") ? c.status !== 'removido' : stryMutAct_9fa48("2312") ? false : stryMutAct_9fa48("2311") ? true : (stryCov_9fa48("2311", "2312", "2313"), c.status === (stryMutAct_9fa48("2314") ? "" : (stryCov_9fa48("2314"), 'removido'))))).length);

            // Obter número de barbeiros ativos
            const {
              data: barbeirosAtivos
            } = await fastify.supabase.from(stryMutAct_9fa48("2315") ? "" : (stryCov_9fa48("2315"), 'barbeiros_barbearias')).select(stryMutAct_9fa48("2316") ? "" : (stryCov_9fa48("2316"), 'id')).eq(stryMutAct_9fa48("2317") ? "" : (stryCov_9fa48("2317"), 'barbearia_id'), barbearia_id).eq(stryMutAct_9fa48("2318") ? "" : (stryCov_9fa48("2318"), 'ativo'), stryMutAct_9fa48("2319") ? false : (stryCov_9fa48("2319"), true));
            const barbeirosAtivosCount = barbeirosAtivos ? barbeirosAtivos.length : 0;

            // Calcular tempo estimado (15 minutos por cliente)
            const tempoEstimado = stryMutAct_9fa48("2320") ? aguardando / 15 : (stryCov_9fa48("2320"), aguardando * 15);
            return reply.status(200).send(stryMutAct_9fa48("2321") ? {} : (stryCov_9fa48("2321"), {
              success: stryMutAct_9fa48("2322") ? false : (stryCov_9fa48("2322"), true),
              data: stryMutAct_9fa48("2323") ? {} : (stryCov_9fa48("2323"), {
                barbearia: stryMutAct_9fa48("2324") ? {} : (stryCov_9fa48("2324"), {
                  id: barbearia.id,
                  nome: barbearia.nome,
                  endereco: barbearia.endereco,
                  telefone: barbearia.telefone
                }),
                estatisticas: stryMutAct_9fa48("2325") ? {} : (stryCov_9fa48("2325"), {
                  aguardando,
                  proximo,
                  atendendo,
                  tempo_estimado: tempoEstimado,
                  barbeiros_ativos: barbeirosAtivosCount
                })
              })
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("2326")) {
            {}
          } else {
            stryCov_9fa48("2326");
            return reply.status(500).send(stryMutAct_9fa48("2327") ? {} : (stryCov_9fa48("2327"), {
              success: stryMutAct_9fa48("2328") ? true : (stryCov_9fa48("2328"), false),
              error: stryMutAct_9fa48("2329") ? "" : (stryCov_9fa48("2329"), 'Erro interno do servidor')
            }));
          }
        }
      }
    });

    // Chamar próximo cliente (APENAS BARBEIROS)
    fastify.post(stryMutAct_9fa48("2330") ? "" : (stryCov_9fa48("2330"), '/fila/proximo/:barbearia_id'), stryMutAct_9fa48("2331") ? {} : (stryCov_9fa48("2331"), {
      schema: stryMutAct_9fa48("2332") ? {} : (stryCov_9fa48("2332"), {
        description: stryMutAct_9fa48("2333") ? "" : (stryCov_9fa48("2333"), 'Chamar próximo cliente da fila (APENAS BARBEIROS)'),
        tags: stryMutAct_9fa48("2334") ? [] : (stryCov_9fa48("2334"), [stryMutAct_9fa48("2335") ? "" : (stryCov_9fa48("2335"), 'fila')]),
        params: stryMutAct_9fa48("2336") ? {} : (stryCov_9fa48("2336"), {
          type: stryMutAct_9fa48("2337") ? "" : (stryCov_9fa48("2337"), 'object'),
          required: stryMutAct_9fa48("2338") ? [] : (stryCov_9fa48("2338"), [stryMutAct_9fa48("2339") ? "" : (stryCov_9fa48("2339"), 'barbearia_id')]),
          properties: stryMutAct_9fa48("2340") ? {} : (stryCov_9fa48("2340"), {
            barbearia_id: stryMutAct_9fa48("2341") ? {} : (stryCov_9fa48("2341"), {
              type: stryMutAct_9fa48("2342") ? "" : (stryCov_9fa48("2342"), 'integer')
            })
          })
        }),
        response: stryMutAct_9fa48("2343") ? {} : (stryCov_9fa48("2343"), {
          200: stryMutAct_9fa48("2344") ? {} : (stryCov_9fa48("2344"), {
            description: stryMutAct_9fa48("2345") ? "" : (stryCov_9fa48("2345"), 'Próximo cliente chamado'),
            type: stryMutAct_9fa48("2346") ? "" : (stryCov_9fa48("2346"), 'object'),
            properties: stryMutAct_9fa48("2347") ? {} : (stryCov_9fa48("2347"), {
              success: stryMutAct_9fa48("2348") ? {} : (stryCov_9fa48("2348"), {
                type: stryMutAct_9fa48("2349") ? "" : (stryCov_9fa48("2349"), 'boolean')
              }),
              message: stryMutAct_9fa48("2350") ? {} : (stryCov_9fa48("2350"), {
                type: stryMutAct_9fa48("2351") ? "" : (stryCov_9fa48("2351"), 'string')
              }),
              data: stryMutAct_9fa48("2352") ? {} : (stryCov_9fa48("2352"), {
                type: stryMutAct_9fa48("2353") ? "" : (stryCov_9fa48("2353"), 'object')
              })
            })
          })
        })
      }),
      preHandler: stryMutAct_9fa48("2354") ? [] : (stryCov_9fa48("2354"), [fastify.authenticate, checkBarbeiroRole, checkBarbeiroBarbeariaAccess])
    }), async (request, reply) => {
      if (stryMutAct_9fa48("2355")) {
        {}
      } else {
        stryCov_9fa48("2355");
        try {
          if (stryMutAct_9fa48("2356")) {
            {}
          } else {
            stryCov_9fa48("2356");
            const {
              barbearia_id
            } = request.params;
            const userId = request.user.id;

            // Verificar se o usuário é um barbeiro ativo na barbearia
            const {
              data: barbeiroAtivo
            } = await fastify.supabase.from(stryMutAct_9fa48("2357") ? "" : (stryCov_9fa48("2357"), 'barbeiros_barbearias')).select(stryMutAct_9fa48("2358") ? "" : (stryCov_9fa48("2358"), 'id, ativo')).eq(stryMutAct_9fa48("2359") ? "" : (stryCov_9fa48("2359"), 'user_id'), userId).eq(stryMutAct_9fa48("2360") ? "" : (stryCov_9fa48("2360"), 'barbearia_id'), barbearia_id).eq(stryMutAct_9fa48("2361") ? "" : (stryCov_9fa48("2361"), 'ativo'), stryMutAct_9fa48("2362") ? false : (stryCov_9fa48("2362"), true)).single();
            if (stryMutAct_9fa48("2365") ? false : stryMutAct_9fa48("2364") ? true : stryMutAct_9fa48("2363") ? barbeiroAtivo : (stryCov_9fa48("2363", "2364", "2365"), !barbeiroAtivo)) {
              if (stryMutAct_9fa48("2366")) {
                {}
              } else {
                stryCov_9fa48("2366");
                return reply.status(403).send(stryMutAct_9fa48("2367") ? {} : (stryCov_9fa48("2367"), {
                  success: stryMutAct_9fa48("2368") ? true : (stryCov_9fa48("2368"), false),
                  error: stryMutAct_9fa48("2369") ? "" : (stryCov_9fa48("2369"), 'Você não está ativo nesta barbearia')
                }));
              }
            }

            // Buscar próximo cliente na fila (clientes específicos do barbeiro ou fila geral)
            const {
              data: proximoCliente
            } = await fastify.supabase.from(stryMutAct_9fa48("2370") ? "" : (stryCov_9fa48("2370"), 'clientes')).select(stryMutAct_9fa48("2371") ? "" : (stryCov_9fa48("2371"), '*')).eq(stryMutAct_9fa48("2372") ? "" : (stryCov_9fa48("2372"), 'barbearia_id'), barbearia_id).eq(stryMutAct_9fa48("2373") ? "" : (stryCov_9fa48("2373"), 'status'), stryMutAct_9fa48("2374") ? "" : (stryCov_9fa48("2374"), 'aguardando')).or(stryMutAct_9fa48("2375") ? `` : (stryCov_9fa48("2375"), `barbeiro_id.eq.${userId},barbeiro_id.is.null`)).order(stryMutAct_9fa48("2376") ? "" : (stryCov_9fa48("2376"), 'barbeiro_id'), stryMutAct_9fa48("2377") ? {} : (stryCov_9fa48("2377"), {
              ascending: stryMutAct_9fa48("2378") ? true : (stryCov_9fa48("2378"), false)
            })).order(stryMutAct_9fa48("2379") ? "" : (stryCov_9fa48("2379"), 'posicao'), stryMutAct_9fa48("2380") ? {} : (stryCov_9fa48("2380"), {
              ascending: stryMutAct_9fa48("2381") ? false : (stryCov_9fa48("2381"), true)
            })).limit(1).single();
            if (stryMutAct_9fa48("2384") ? false : stryMutAct_9fa48("2383") ? true : stryMutAct_9fa48("2382") ? proximoCliente : (stryCov_9fa48("2382", "2383", "2384"), !proximoCliente)) {
              if (stryMutAct_9fa48("2385")) {
                {}
              } else {
                stryCov_9fa48("2385");
                return reply.status(404).send(stryMutAct_9fa48("2386") ? {} : (stryCov_9fa48("2386"), {
                  success: stryMutAct_9fa48("2387") ? true : (stryCov_9fa48("2387"), false),
                  error: stryMutAct_9fa48("2388") ? "" : (stryCov_9fa48("2388"), 'Não há clientes aguardando na fila')
                }));
              }
            }

            // Atualizar status do cliente para 'proximo'
            const {
              data: clienteAtualizado,
              error: updateError
            } = await fastify.supabase.from(stryMutAct_9fa48("2389") ? "" : (stryCov_9fa48("2389"), 'clientes')).update(stryMutAct_9fa48("2390") ? {} : (stryCov_9fa48("2390"), {
              status: stryMutAct_9fa48("2391") ? "" : (stryCov_9fa48("2391"), 'proximo'),
              barbeiro_id: userId,
              data_atendimento: new Date().toISOString()
            })).eq(stryMutAct_9fa48("2392") ? "" : (stryCov_9fa48("2392"), 'id'), proximoCliente.id).select().single();
            if (stryMutAct_9fa48("2394") ? false : stryMutAct_9fa48("2393") ? true : (stryCov_9fa48("2393", "2394"), updateError)) {
              if (stryMutAct_9fa48("2395")) {
                {}
              } else {
                stryCov_9fa48("2395");
                return reply.status(500).send(stryMutAct_9fa48("2396") ? {} : (stryCov_9fa48("2396"), {
                  success: stryMutAct_9fa48("2397") ? true : (stryCov_9fa48("2397"), false),
                  error: stryMutAct_9fa48("2398") ? "" : (stryCov_9fa48("2398"), 'Erro interno do servidor')
                }));
              }
            }
            return reply.status(200).send(stryMutAct_9fa48("2399") ? {} : (stryCov_9fa48("2399"), {
              success: stryMutAct_9fa48("2400") ? false : (stryCov_9fa48("2400"), true),
              message: stryMutAct_9fa48("2401") ? "" : (stryCov_9fa48("2401"), 'Próximo cliente chamado'),
              data: clienteAtualizado
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("2402")) {
            {}
          } else {
            stryCov_9fa48("2402");
            return reply.status(500).send(stryMutAct_9fa48("2403") ? {} : (stryCov_9fa48("2403"), {
              success: stryMutAct_9fa48("2404") ? true : (stryCov_9fa48("2404"), false),
              error: stryMutAct_9fa48("2405") ? "" : (stryCov_9fa48("2405"), 'Erro interno do servidor')
            }));
          }
        }
      }
    });

    // Iniciar atendimento (APENAS BARBEIROS)
    fastify.post(stryMutAct_9fa48("2406") ? "" : (stryCov_9fa48("2406"), '/fila/iniciar-atendimento/:cliente_id'), stryMutAct_9fa48("2407") ? {} : (stryCov_9fa48("2407"), {
      schema: stryMutAct_9fa48("2408") ? {} : (stryCov_9fa48("2408"), {
        description: stryMutAct_9fa48("2409") ? "" : (stryCov_9fa48("2409"), 'Iniciar atendimento de um cliente (APENAS BARBEIROS)'),
        tags: stryMutAct_9fa48("2410") ? [] : (stryCov_9fa48("2410"), [stryMutAct_9fa48("2411") ? "" : (stryCov_9fa48("2411"), 'fila')]),
        params: stryMutAct_9fa48("2412") ? {} : (stryCov_9fa48("2412"), {
          type: stryMutAct_9fa48("2413") ? "" : (stryCov_9fa48("2413"), 'object'),
          required: stryMutAct_9fa48("2414") ? [] : (stryCov_9fa48("2414"), [stryMutAct_9fa48("2415") ? "" : (stryCov_9fa48("2415"), 'cliente_id')]),
          properties: stryMutAct_9fa48("2416") ? {} : (stryCov_9fa48("2416"), {
            cliente_id: stryMutAct_9fa48("2417") ? {} : (stryCov_9fa48("2417"), {
              type: stryMutAct_9fa48("2418") ? "" : (stryCov_9fa48("2418"), 'string')
            })
          })
        }),
        response: stryMutAct_9fa48("2419") ? {} : (stryCov_9fa48("2419"), {
          200: stryMutAct_9fa48("2420") ? {} : (stryCov_9fa48("2420"), {
            description: stryMutAct_9fa48("2421") ? "" : (stryCov_9fa48("2421"), 'Atendimento iniciado'),
            type: stryMutAct_9fa48("2422") ? "" : (stryCov_9fa48("2422"), 'object'),
            properties: stryMutAct_9fa48("2423") ? {} : (stryCov_9fa48("2423"), {
              success: stryMutAct_9fa48("2424") ? {} : (stryCov_9fa48("2424"), {
                type: stryMutAct_9fa48("2425") ? "" : (stryCov_9fa48("2425"), 'boolean')
              }),
              message: stryMutAct_9fa48("2426") ? {} : (stryCov_9fa48("2426"), {
                type: stryMutAct_9fa48("2427") ? "" : (stryCov_9fa48("2427"), 'string')
              }),
              data: stryMutAct_9fa48("2428") ? {} : (stryCov_9fa48("2428"), {
                type: stryMutAct_9fa48("2429") ? "" : (stryCov_9fa48("2429"), 'object')
              })
            })
          })
        })
      }),
      preHandler: fastify.authenticate
    }), async (request, reply) => {
      if (stryMutAct_9fa48("2430")) {
        {}
      } else {
        stryCov_9fa48("2430");
        try {
          if (stryMutAct_9fa48("2431")) {
            {}
          } else {
            stryCov_9fa48("2431");
            const {
              cliente_id
            } = request.params;
            const userId = request.user.id;

            // Buscar cliente
            const {
              data: cliente
            } = await fastify.supabase.from(stryMutAct_9fa48("2432") ? "" : (stryCov_9fa48("2432"), 'clientes')).select(stryMutAct_9fa48("2433") ? "" : (stryCov_9fa48("2433"), '*')).eq(stryMutAct_9fa48("2434") ? "" : (stryCov_9fa48("2434"), 'id'), cliente_id).eq(stryMutAct_9fa48("2435") ? "" : (stryCov_9fa48("2435"), 'barbeiro_id'), userId).eq(stryMutAct_9fa48("2436") ? "" : (stryCov_9fa48("2436"), 'status'), stryMutAct_9fa48("2437") ? "" : (stryCov_9fa48("2437"), 'proximo')).single();
            if (stryMutAct_9fa48("2440") ? false : stryMutAct_9fa48("2439") ? true : stryMutAct_9fa48("2438") ? cliente : (stryCov_9fa48("2438", "2439", "2440"), !cliente)) {
              if (stryMutAct_9fa48("2441")) {
                {}
              } else {
                stryCov_9fa48("2441");
                return reply.status(404).send(stryMutAct_9fa48("2442") ? {} : (stryCov_9fa48("2442"), {
                  success: stryMutAct_9fa48("2443") ? true : (stryCov_9fa48("2443"), false),
                  error: stryMutAct_9fa48("2444") ? "" : (stryCov_9fa48("2444"), 'Cliente não encontrado ou não está no status correto')
                }));
              }
            }

            // Atualizar status para 'atendendo' e registrar hora de início
            const {
              data: clienteAtualizado,
              error: updateError
            } = await fastify.supabase.from(stryMutAct_9fa48("2445") ? "" : (stryCov_9fa48("2445"), 'clientes')).update(stryMutAct_9fa48("2446") ? {} : (stryCov_9fa48("2446"), {
              status: stryMutAct_9fa48("2447") ? "" : (stryCov_9fa48("2447"), 'atendendo'),
              data_atendimento: new Date().toISOString()
            })).eq(stryMutAct_9fa48("2448") ? "" : (stryCov_9fa48("2448"), 'id'), cliente_id).select().single();
            if (stryMutAct_9fa48("2450") ? false : stryMutAct_9fa48("2449") ? true : (stryCov_9fa48("2449", "2450"), updateError)) {
              if (stryMutAct_9fa48("2451")) {
                {}
              } else {
                stryCov_9fa48("2451");
                return reply.status(500).send(stryMutAct_9fa48("2452") ? {} : (stryCov_9fa48("2452"), {
                  success: stryMutAct_9fa48("2453") ? true : (stryCov_9fa48("2453"), false),
                  error: stryMutAct_9fa48("2454") ? "" : (stryCov_9fa48("2454"), 'Erro interno do servidor')
                }));
              }
            }
            return reply.status(200).send(stryMutAct_9fa48("2455") ? {} : (stryCov_9fa48("2455"), {
              success: stryMutAct_9fa48("2456") ? false : (stryCov_9fa48("2456"), true),
              message: stryMutAct_9fa48("2457") ? "" : (stryCov_9fa48("2457"), 'Atendimento iniciado com sucesso'),
              data: clienteAtualizado
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("2458")) {
            {}
          } else {
            stryCov_9fa48("2458");
            return reply.status(500).send(stryMutAct_9fa48("2459") ? {} : (stryCov_9fa48("2459"), {
              success: stryMutAct_9fa48("2460") ? true : (stryCov_9fa48("2460"), false),
              error: stryMutAct_9fa48("2461") ? "" : (stryCov_9fa48("2461"), 'Erro interno do servidor')
            }));
          }
        }
      }
    });

    // Remover cliente da fila (APENAS BARBEIROS)
    fastify.post(stryMutAct_9fa48("2462") ? "" : (stryCov_9fa48("2462"), '/fila/remover/:cliente_id'), stryMutAct_9fa48("2463") ? {} : (stryCov_9fa48("2463"), {
      schema: stryMutAct_9fa48("2464") ? {} : (stryCov_9fa48("2464"), {
        description: stryMutAct_9fa48("2465") ? "" : (stryCov_9fa48("2465"), 'Remover cliente da fila (APENAS BARBEIROS)'),
        tags: stryMutAct_9fa48("2466") ? [] : (stryCov_9fa48("2466"), [stryMutAct_9fa48("2467") ? "" : (stryCov_9fa48("2467"), 'fila')]),
        params: stryMutAct_9fa48("2468") ? {} : (stryCov_9fa48("2468"), {
          type: stryMutAct_9fa48("2469") ? "" : (stryCov_9fa48("2469"), 'object'),
          required: stryMutAct_9fa48("2470") ? [] : (stryCov_9fa48("2470"), [stryMutAct_9fa48("2471") ? "" : (stryCov_9fa48("2471"), 'cliente_id')]),
          properties: stryMutAct_9fa48("2472") ? {} : (stryCov_9fa48("2472"), {
            cliente_id: stryMutAct_9fa48("2473") ? {} : (stryCov_9fa48("2473"), {
              type: stryMutAct_9fa48("2474") ? "" : (stryCov_9fa48("2474"), 'string')
            })
          })
        }),
        response: stryMutAct_9fa48("2475") ? {} : (stryCov_9fa48("2475"), {
          200: stryMutAct_9fa48("2476") ? {} : (stryCov_9fa48("2476"), {
            description: stryMutAct_9fa48("2477") ? "" : (stryCov_9fa48("2477"), 'Cliente removido da fila'),
            type: stryMutAct_9fa48("2478") ? "" : (stryCov_9fa48("2478"), 'object'),
            properties: stryMutAct_9fa48("2479") ? {} : (stryCov_9fa48("2479"), {
              success: stryMutAct_9fa48("2480") ? {} : (stryCov_9fa48("2480"), {
                type: stryMutAct_9fa48("2481") ? "" : (stryCov_9fa48("2481"), 'boolean')
              }),
              message: stryMutAct_9fa48("2482") ? {} : (stryCov_9fa48("2482"), {
                type: stryMutAct_9fa48("2483") ? "" : (stryCov_9fa48("2483"), 'string')
              }),
              data: stryMutAct_9fa48("2484") ? {} : (stryCov_9fa48("2484"), {
                type: stryMutAct_9fa48("2485") ? "" : (stryCov_9fa48("2485"), 'object')
              })
            })
          })
        })
      }),
      preHandler: fastify.authenticate
    }), async (request, reply) => {
      if (stryMutAct_9fa48("2486")) {
        {}
      } else {
        stryCov_9fa48("2486");
        try {
          if (stryMutAct_9fa48("2487")) {
            {}
          } else {
            stryCov_9fa48("2487");
            const {
              cliente_id
            } = request.params;
            const userId = request.user.id;

            // Buscar cliente
            const {
              data: cliente
            } = await fastify.supabase.from(stryMutAct_9fa48("2488") ? "" : (stryCov_9fa48("2488"), 'clientes')).select(stryMutAct_9fa48("2489") ? "" : (stryCov_9fa48("2489"), '*')).eq(stryMutAct_9fa48("2490") ? "" : (stryCov_9fa48("2490"), 'id'), cliente_id).eq(stryMutAct_9fa48("2491") ? "" : (stryCov_9fa48("2491"), 'barbeiro_id'), userId).eq(stryMutAct_9fa48("2492") ? "" : (stryCov_9fa48("2492"), 'status'), stryMutAct_9fa48("2493") ? "" : (stryCov_9fa48("2493"), 'proximo')).single();
            if (stryMutAct_9fa48("2496") ? false : stryMutAct_9fa48("2495") ? true : stryMutAct_9fa48("2494") ? cliente : (stryCov_9fa48("2494", "2495", "2496"), !cliente)) {
              if (stryMutAct_9fa48("2497")) {
                {}
              } else {
                stryCov_9fa48("2497");
                return reply.status(404).send(stryMutAct_9fa48("2498") ? {} : (stryCov_9fa48("2498"), {
                  success: stryMutAct_9fa48("2499") ? true : (stryCov_9fa48("2499"), false),
                  error: stryMutAct_9fa48("2500") ? "" : (stryCov_9fa48("2500"), 'Cliente não encontrado ou não está no status correto')
                }));
              }
            }

            // Atualizar status para 'removido'
            const {
              data: clienteAtualizado,
              error: updateError
            } = await fastify.supabase.from(stryMutAct_9fa48("2501") ? "" : (stryCov_9fa48("2501"), 'clientes')).update(stryMutAct_9fa48("2502") ? {} : (stryCov_9fa48("2502"), {
              status: stryMutAct_9fa48("2503") ? "" : (stryCov_9fa48("2503"), 'removido'),
              data_finalizacao: new Date().toISOString()
            })).eq(stryMutAct_9fa48("2504") ? "" : (stryCov_9fa48("2504"), 'id'), cliente_id).select().single();
            if (stryMutAct_9fa48("2506") ? false : stryMutAct_9fa48("2505") ? true : (stryCov_9fa48("2505", "2506"), updateError)) {
              if (stryMutAct_9fa48("2507")) {
                {}
              } else {
                stryCov_9fa48("2507");
                return reply.status(500).send(stryMutAct_9fa48("2508") ? {} : (stryCov_9fa48("2508"), {
                  success: stryMutAct_9fa48("2509") ? true : (stryCov_9fa48("2509"), false),
                  error: stryMutAct_9fa48("2510") ? "" : (stryCov_9fa48("2510"), 'Erro interno do servidor')
                }));
              }
            }
            return reply.status(200).send(stryMutAct_9fa48("2511") ? {} : (stryCov_9fa48("2511"), {
              success: stryMutAct_9fa48("2512") ? false : (stryCov_9fa48("2512"), true),
              message: stryMutAct_9fa48("2513") ? "" : (stryCov_9fa48("2513"), 'Cliente removido da fila com sucesso'),
              data: clienteAtualizado
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("2514")) {
            {}
          } else {
            stryCov_9fa48("2514");
            return reply.status(500).send(stryMutAct_9fa48("2515") ? {} : (stryCov_9fa48("2515"), {
              success: stryMutAct_9fa48("2516") ? true : (stryCov_9fa48("2516"), false),
              error: stryMutAct_9fa48("2517") ? "" : (stryCov_9fa48("2517"), 'Erro interno do servidor')
            }));
          }
        }
      }
    });

    // Finalizar atendimento (APENAS BARBEIROS)
    fastify.post(stryMutAct_9fa48("2518") ? "" : (stryCov_9fa48("2518"), '/fila/finalizar'), stryMutAct_9fa48("2519") ? {} : (stryCov_9fa48("2519"), {
      schema: stryMutAct_9fa48("2520") ? {} : (stryCov_9fa48("2520"), {
        description: stryMutAct_9fa48("2521") ? "" : (stryCov_9fa48("2521"), 'Finalizar atendimento de um cliente (APENAS BARBEIROS)'),
        tags: stryMutAct_9fa48("2522") ? [] : (stryCov_9fa48("2522"), [stryMutAct_9fa48("2523") ? "" : (stryCov_9fa48("2523"), 'fila')]),
        body: stryMutAct_9fa48("2524") ? {} : (stryCov_9fa48("2524"), {
          type: stryMutAct_9fa48("2525") ? "" : (stryCov_9fa48("2525"), 'object'),
          required: stryMutAct_9fa48("2526") ? [] : (stryCov_9fa48("2526"), [stryMutAct_9fa48("2527") ? "" : (stryCov_9fa48("2527"), 'cliente_id'), stryMutAct_9fa48("2528") ? "" : (stryCov_9fa48("2528"), 'barbearia_id'), stryMutAct_9fa48("2529") ? "" : (stryCov_9fa48("2529"), 'servico'), stryMutAct_9fa48("2530") ? "" : (stryCov_9fa48("2530"), 'duracao')]),
          properties: stryMutAct_9fa48("2531") ? {} : (stryCov_9fa48("2531"), {
            cliente_id: stryMutAct_9fa48("2532") ? {} : (stryCov_9fa48("2532"), {
              type: stryMutAct_9fa48("2533") ? "" : (stryCov_9fa48("2533"), 'string')
            }),
            barbearia_id: stryMutAct_9fa48("2534") ? {} : (stryCov_9fa48("2534"), {
              type: stryMutAct_9fa48("2535") ? "" : (stryCov_9fa48("2535"), 'integer')
            }),
            servico: stryMutAct_9fa48("2536") ? {} : (stryCov_9fa48("2536"), {
              type: stryMutAct_9fa48("2537") ? "" : (stryCov_9fa48("2537"), 'string')
            }),
            duracao: stryMutAct_9fa48("2538") ? {} : (stryCov_9fa48("2538"), {
              type: stryMutAct_9fa48("2539") ? "" : (stryCov_9fa48("2539"), 'integer')
            })
          })
        }),
        response: stryMutAct_9fa48("2540") ? {} : (stryCov_9fa48("2540"), {
          200: stryMutAct_9fa48("2541") ? {} : (stryCov_9fa48("2541"), {
            description: stryMutAct_9fa48("2542") ? "" : (stryCov_9fa48("2542"), 'Atendimento finalizado'),
            type: stryMutAct_9fa48("2543") ? "" : (stryCov_9fa48("2543"), 'object'),
            properties: stryMutAct_9fa48("2544") ? {} : (stryCov_9fa48("2544"), {
              success: stryMutAct_9fa48("2545") ? {} : (stryCov_9fa48("2545"), {
                type: stryMutAct_9fa48("2546") ? "" : (stryCov_9fa48("2546"), 'boolean')
              }),
              message: stryMutAct_9fa48("2547") ? {} : (stryCov_9fa48("2547"), {
                type: stryMutAct_9fa48("2548") ? "" : (stryCov_9fa48("2548"), 'string')
              }),
              data: stryMutAct_9fa48("2549") ? {} : (stryCov_9fa48("2549"), {
                type: stryMutAct_9fa48("2550") ? "" : (stryCov_9fa48("2550"), 'object')
              })
            })
          })
        })
      }),
      preHandler: fastify.authenticate
    }), async (request, reply) => {
      if (stryMutAct_9fa48("2551")) {
        {}
      } else {
        stryCov_9fa48("2551");
        try {
          if (stryMutAct_9fa48("2552")) {
            {}
          } else {
            stryCov_9fa48("2552");
            const {
              cliente_id,
              barbearia_id,
              servico,
              duracao
            } = request.body;
            const userId = request.user.id;

            // Verificar se o usuário é barbeiro ativo na barbearia
            const {
              data: barbeiroAtivo
            } = await fastify.supabase.from(stryMutAct_9fa48("2553") ? "" : (stryCov_9fa48("2553"), 'barbeiros_barbearias')).select(stryMutAct_9fa48("2554") ? "" : (stryCov_9fa48("2554"), 'id, ativo')).eq(stryMutAct_9fa48("2555") ? "" : (stryCov_9fa48("2555"), 'user_id'), userId).eq(stryMutAct_9fa48("2556") ? "" : (stryCov_9fa48("2556"), 'barbearia_id'), barbearia_id).eq(stryMutAct_9fa48("2557") ? "" : (stryCov_9fa48("2557"), 'ativo'), stryMutAct_9fa48("2558") ? false : (stryCov_9fa48("2558"), true)).single();
            if (stryMutAct_9fa48("2561") ? false : stryMutAct_9fa48("2560") ? true : stryMutAct_9fa48("2559") ? barbeiroAtivo : (stryCov_9fa48("2559", "2560", "2561"), !barbeiroAtivo)) {
              if (stryMutAct_9fa48("2562")) {
                {}
              } else {
                stryCov_9fa48("2562");
                return reply.status(403).send(stryMutAct_9fa48("2563") ? {} : (stryCov_9fa48("2563"), {
                  success: stryMutAct_9fa48("2564") ? true : (stryCov_9fa48("2564"), false),
                  error: stryMutAct_9fa48("2565") ? "" : (stryCov_9fa48("2565"), 'Você não está ativo nesta barbearia')
                }));
              }
            }

            // Buscar cliente
            const {
              data: cliente
            } = await fastify.supabase.from(stryMutAct_9fa48("2566") ? "" : (stryCov_9fa48("2566"), 'clientes')).select(stryMutAct_9fa48("2567") ? "" : (stryCov_9fa48("2567"), '*')).eq(stryMutAct_9fa48("2568") ? "" : (stryCov_9fa48("2568"), 'id'), cliente_id).eq(stryMutAct_9fa48("2569") ? "" : (stryCov_9fa48("2569"), 'barbearia_id'), barbearia_id).eq(stryMutAct_9fa48("2570") ? "" : (stryCov_9fa48("2570"), 'status'), stryMutAct_9fa48("2571") ? "" : (stryCov_9fa48("2571"), 'atendendo')).single();
            if (stryMutAct_9fa48("2574") ? false : stryMutAct_9fa48("2573") ? true : stryMutAct_9fa48("2572") ? cliente : (stryCov_9fa48("2572", "2573", "2574"), !cliente)) {
              if (stryMutAct_9fa48("2575")) {
                {}
              } else {
                stryCov_9fa48("2575");
                return reply.status(404).send(stryMutAct_9fa48("2576") ? {} : (stryCov_9fa48("2576"), {
                  success: stryMutAct_9fa48("2577") ? true : (stryCov_9fa48("2577"), false),
                  error: stryMutAct_9fa48("2578") ? "" : (stryCov_9fa48("2578"), 'Cliente não encontrado ou não está sendo atendido')
                }));
              }
            }

            // Atualizar status do cliente para 'finalizado'
            await fastify.supabase.from(stryMutAct_9fa48("2579") ? "" : (stryCov_9fa48("2579"), 'clientes')).update(stryMutAct_9fa48("2580") ? {} : (stryCov_9fa48("2580"), {
              status: stryMutAct_9fa48("2581") ? "" : (stryCov_9fa48("2581"), 'finalizado'),
              data_finalizacao: new Date().toISOString()
            })).eq(stryMutAct_9fa48("2582") ? "" : (stryCov_9fa48("2582"), 'id'), cliente_id);

            // Registrar no histórico de atendimentos
            await fastify.supabase.from(stryMutAct_9fa48("2583") ? "" : (stryCov_9fa48("2583"), 'historico_atendimentos')).insert(stryMutAct_9fa48("2584") ? {} : (stryCov_9fa48("2584"), {
              cliente_id,
              barbearia_id,
              barbeiro_id: userId,
              servico,
              duracao,
              data_inicio: cliente.data_atendimento,
              data_fim: new Date().toISOString()
            }));
            return reply.status(200).send(stryMutAct_9fa48("2585") ? {} : (stryCov_9fa48("2585"), {
              success: stryMutAct_9fa48("2586") ? false : (stryCov_9fa48("2586"), true),
              message: stryMutAct_9fa48("2587") ? "" : (stryCov_9fa48("2587"), 'Atendimento finalizado com sucesso'),
              data: stryMutAct_9fa48("2588") ? {} : (stryCov_9fa48("2588"), {
                cliente_id,
                barbearia_id,
                servico,
                duracao
              })
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("2589")) {
            {}
          } else {
            stryCov_9fa48("2589");
            return reply.status(500).send(stryMutAct_9fa48("2590") ? {} : (stryCov_9fa48("2590"), {
              success: stryMutAct_9fa48("2591") ? true : (stryCov_9fa48("2591"), false),
              error: stryMutAct_9fa48("2592") ? "" : (stryCov_9fa48("2592"), 'Erro interno do servidor')
            }));
          }
        }
      }
    });

    // Status do cliente na fila
    fastify.get(stryMutAct_9fa48("2593") ? "" : (stryCov_9fa48("2593"), '/fila/status/:token'), stryMutAct_9fa48("2594") ? {} : (stryCov_9fa48("2594"), {
      schema: stryMutAct_9fa48("2595") ? {} : (stryCov_9fa48("2595"), {
        description: stryMutAct_9fa48("2596") ? "" : (stryCov_9fa48("2596"), 'Obter status do cliente na fila'),
        tags: stryMutAct_9fa48("2597") ? [] : (stryCov_9fa48("2597"), [stryMutAct_9fa48("2598") ? "" : (stryCov_9fa48("2598"), 'fila')]),
        params: stryMutAct_9fa48("2599") ? {} : (stryCov_9fa48("2599"), {
          type: stryMutAct_9fa48("2600") ? "" : (stryCov_9fa48("2600"), 'object'),
          required: stryMutAct_9fa48("2601") ? [] : (stryCov_9fa48("2601"), [stryMutAct_9fa48("2602") ? "" : (stryCov_9fa48("2602"), 'token')]),
          properties: stryMutAct_9fa48("2603") ? {} : (stryCov_9fa48("2603"), {
            token: stryMutAct_9fa48("2604") ? {} : (stryCov_9fa48("2604"), {
              type: stryMutAct_9fa48("2605") ? "" : (stryCov_9fa48("2605"), 'string')
            })
          })
        }),
        response: stryMutAct_9fa48("2606") ? {} : (stryCov_9fa48("2606"), {
          200: stryMutAct_9fa48("2607") ? {} : (stryCov_9fa48("2607"), {
            description: stryMutAct_9fa48("2608") ? "" : (stryCov_9fa48("2608"), 'Status do cliente'),
            type: stryMutAct_9fa48("2609") ? "" : (stryCov_9fa48("2609"), 'object'),
            properties: stryMutAct_9fa48("2610") ? {} : (stryCov_9fa48("2610"), {
              success: stryMutAct_9fa48("2611") ? {} : (stryCov_9fa48("2611"), {
                type: stryMutAct_9fa48("2612") ? "" : (stryCov_9fa48("2612"), 'boolean')
              }),
              data: stryMutAct_9fa48("2613") ? {} : (stryCov_9fa48("2613"), {
                type: stryMutAct_9fa48("2614") ? "" : (stryCov_9fa48("2614"), 'object')
              })
            })
          })
        })
      })
    }), async (request, reply) => {
      if (stryMutAct_9fa48("2615")) {
        {}
      } else {
        stryCov_9fa48("2615");
        try {
          if (stryMutAct_9fa48("2616")) {
            {}
          } else {
            stryCov_9fa48("2616");
            const {
              token
            } = request.params;
            const {
              data: cliente
            } = await fastify.supabase.from(stryMutAct_9fa48("2617") ? "" : (stryCov_9fa48("2617"), 'clientes')).select(stryMutAct_9fa48("2618") ? "" : (stryCov_9fa48("2618"), '*')).eq(stryMutAct_9fa48("2619") ? "" : (stryCov_9fa48("2619"), 'token'), token).single();
            if (stryMutAct_9fa48("2622") ? false : stryMutAct_9fa48("2621") ? true : stryMutAct_9fa48("2620") ? cliente : (stryCov_9fa48("2620", "2621", "2622"), !cliente)) {
              if (stryMutAct_9fa48("2623")) {
                {}
              } else {
                stryCov_9fa48("2623");
                return reply.status(404).send(stryMutAct_9fa48("2624") ? {} : (stryCov_9fa48("2624"), {
                  success: stryMutAct_9fa48("2625") ? true : (stryCov_9fa48("2625"), false),
                  error: stryMutAct_9fa48("2626") ? "" : (stryCov_9fa48("2626"), 'Cliente não encontrado')
                }));
              }
            }
            return reply.status(200).send(stryMutAct_9fa48("2627") ? {} : (stryCov_9fa48("2627"), {
              success: stryMutAct_9fa48("2628") ? false : (stryCov_9fa48("2628"), true),
              data: cliente
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("2629")) {
            {}
          } else {
            stryCov_9fa48("2629");
            return reply.status(500).send(stryMutAct_9fa48("2630") ? {} : (stryCov_9fa48("2630"), {
              success: stryMutAct_9fa48("2631") ? true : (stryCov_9fa48("2631"), false),
              error: stryMutAct_9fa48("2632") ? "" : (stryCov_9fa48("2632"), 'Erro interno do servidor')
            }));
          }
        }
      }
    });
  }
}
module.exports = filaRoutes;