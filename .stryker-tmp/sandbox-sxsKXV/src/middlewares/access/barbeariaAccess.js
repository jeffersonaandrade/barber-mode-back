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
  supabase
} = require('../../config/database');

/**
 * Middleware para verificar se o usuário tem acesso à barbearia
 * @param {Object} request - Request do Fastify
 * @param {Object} reply - Reply do Fastify
 */
async function checkBarbeariaAccess(request, reply) {
  if (stryMutAct_9fa48("0")) {
    {}
  } else {
    stryCov_9fa48("0");
    const {
      barbearia_id
    } = request.params;
    const userId = stryMutAct_9fa48("1") ? request.user.id : (stryCov_9fa48("1"), request.user?.id);
    const userRole = stryMutAct_9fa48("2") ? request.user.role : (stryCov_9fa48("2"), request.user?.role);
    try {
      if (stryMutAct_9fa48("3")) {
        {}
      } else {
        stryCov_9fa48("3");
        // Admin pode acessar qualquer barbearia
        if (stryMutAct_9fa48("6") ? userRole !== 'admin' : stryMutAct_9fa48("5") ? false : stryMutAct_9fa48("4") ? true : (stryCov_9fa48("4", "5", "6"), userRole === (stryMutAct_9fa48("7") ? "" : (stryCov_9fa48("7"), 'admin')))) {
          if (stryMutAct_9fa48("8")) {
            {}
          } else {
            stryCov_9fa48("8");
            return;
          }
        }

        // Verificar se a barbearia existe
        const {
          data: barbearia,
          error: barbeariaError
        } = await supabase.from(stryMutAct_9fa48("9") ? "" : (stryCov_9fa48("9"), 'barbearias')).select(stryMutAct_9fa48("10") ? "" : (stryCov_9fa48("10"), 'id, nome, ativo')).eq(stryMutAct_9fa48("11") ? "" : (stryCov_9fa48("11"), 'id'), barbearia_id).single();
        if (stryMutAct_9fa48("14") ? barbeariaError && !barbearia : stryMutAct_9fa48("13") ? false : stryMutAct_9fa48("12") ? true : (stryCov_9fa48("12", "13", "14"), barbeariaError || (stryMutAct_9fa48("15") ? barbearia : (stryCov_9fa48("15"), !barbearia)))) {
          if (stryMutAct_9fa48("16")) {
            {}
          } else {
            stryCov_9fa48("16");
            return reply.status(404).send(stryMutAct_9fa48("17") ? {} : (stryCov_9fa48("17"), {
              success: stryMutAct_9fa48("18") ? true : (stryCov_9fa48("18"), false),
              error: stryMutAct_9fa48("19") ? "" : (stryCov_9fa48("19"), 'Barbearia não encontrada')
            }));
          }
        }
        if (stryMutAct_9fa48("22") ? false : stryMutAct_9fa48("21") ? true : stryMutAct_9fa48("20") ? barbearia.ativo : (stryCov_9fa48("20", "21", "22"), !barbearia.ativo)) {
          if (stryMutAct_9fa48("23")) {
            {}
          } else {
            stryCov_9fa48("23");
            return reply.status(404).send(stryMutAct_9fa48("24") ? {} : (stryCov_9fa48("24"), {
              success: stryMutAct_9fa48("25") ? true : (stryCov_9fa48("25"), false),
              error: stryMutAct_9fa48("26") ? "" : (stryCov_9fa48("26"), 'Barbearia inativa')
            }));
          }
        }

        // Verificar se o usuário tem acesso à barbearia
        const {
          data: barbeiroBarbearia,
          error
        } = await supabase.from(stryMutAct_9fa48("27") ? "" : (stryCov_9fa48("27"), 'barbeiros_barbearias')).select(stryMutAct_9fa48("28") ? "" : (stryCov_9fa48("28"), '*')).eq(stryMutAct_9fa48("29") ? "" : (stryCov_9fa48("29"), 'user_id'), userId).eq(stryMutAct_9fa48("30") ? "" : (stryCov_9fa48("30"), 'barbearia_id'), barbearia_id).eq(stryMutAct_9fa48("31") ? "" : (stryCov_9fa48("31"), 'ativo'), stryMutAct_9fa48("32") ? false : (stryCov_9fa48("32"), true)).single();
        if (stryMutAct_9fa48("35") ? error && !barbeiroBarbearia : stryMutAct_9fa48("34") ? false : stryMutAct_9fa48("33") ? true : (stryCov_9fa48("33", "34", "35"), error || (stryMutAct_9fa48("36") ? barbeiroBarbearia : (stryCov_9fa48("36"), !barbeiroBarbearia)))) {
          if (stryMutAct_9fa48("37")) {
            {}
          } else {
            stryCov_9fa48("37");
            return reply.status(403).send(stryMutAct_9fa48("38") ? {} : (stryCov_9fa48("38"), {
              success: stryMutAct_9fa48("39") ? true : (stryCov_9fa48("39"), false),
              error: stryMutAct_9fa48("40") ? "" : (stryCov_9fa48("40"), 'Acesso negado'),
              message: stryMutAct_9fa48("41") ? "" : (stryCov_9fa48("41"), 'Você não tem acesso a esta barbearia')
            }));
          }
        }

        // Adicionar informações do barbeiro ao request
        request.barbeiroInfo = barbeiroBarbearia;
      }
    } catch (error) {
      if (stryMutAct_9fa48("42")) {
        {}
      } else {
        stryCov_9fa48("42");
        return reply.status(500).send(stryMutAct_9fa48("43") ? {} : (stryCov_9fa48("43"), {
          success: stryMutAct_9fa48("44") ? true : (stryCov_9fa48("44"), false),
          error: stryMutAct_9fa48("45") ? "" : (stryCov_9fa48("45"), 'Erro interno'),
          message: stryMutAct_9fa48("46") ? "" : (stryCov_9fa48("46"), 'Erro ao verificar acesso à barbearia')
        }));
      }
    }
  }
}

/**
 * Middleware para verificar se o gerente é dono da barbearia
 * @param {Object} request - Request do Fastify
 * @param {Object} reply - Reply do Fastify
 */
async function checkBarbeariaOwnership(request, reply) {
  if (stryMutAct_9fa48("47")) {
    {}
  } else {
    stryCov_9fa48("47");
    const {
      barbearia_id
    } = request.params;
    const userId = stryMutAct_9fa48("48") ? request.user.id : (stryCov_9fa48("48"), request.user?.id);
    const userRole = stryMutAct_9fa48("49") ? request.user.role : (stryCov_9fa48("49"), request.user?.role);
    try {
      if (stryMutAct_9fa48("50")) {
        {}
      } else {
        stryCov_9fa48("50");
        // Admin pode acessar qualquer barbearia
        if (stryMutAct_9fa48("53") ? userRole !== 'admin' : stryMutAct_9fa48("52") ? false : stryMutAct_9fa48("51") ? true : (stryCov_9fa48("51", "52", "53"), userRole === (stryMutAct_9fa48("54") ? "" : (stryCov_9fa48("54"), 'admin')))) {
          if (stryMutAct_9fa48("55")) {
            {}
          } else {
            stryCov_9fa48("55");
            return;
          }
        }

        // Gerente só pode acessar sua própria barbearia
        if (stryMutAct_9fa48("58") ? userRole !== 'gerente' : stryMutAct_9fa48("57") ? false : stryMutAct_9fa48("56") ? true : (stryCov_9fa48("56", "57", "58"), userRole === (stryMutAct_9fa48("59") ? "" : (stryCov_9fa48("59"), 'gerente')))) {
          if (stryMutAct_9fa48("60")) {
            {}
          } else {
            stryCov_9fa48("60");
            const {
              data: barbearia,
              error
            } = await supabase.from(stryMutAct_9fa48("61") ? "" : (stryCov_9fa48("61"), 'barbearias')).select(stryMutAct_9fa48("62") ? "" : (stryCov_9fa48("62"), 'id, nome, gerente_id')).eq(stryMutAct_9fa48("63") ? "" : (stryCov_9fa48("63"), 'id'), barbearia_id).single();
            if (stryMutAct_9fa48("66") ? error && !barbearia : stryMutAct_9fa48("65") ? false : stryMutAct_9fa48("64") ? true : (stryCov_9fa48("64", "65", "66"), error || (stryMutAct_9fa48("67") ? barbearia : (stryCov_9fa48("67"), !barbearia)))) {
              if (stryMutAct_9fa48("68")) {
                {}
              } else {
                stryCov_9fa48("68");
                return reply.status(404).send(stryMutAct_9fa48("69") ? {} : (stryCov_9fa48("69"), {
                  success: stryMutAct_9fa48("70") ? true : (stryCov_9fa48("70"), false),
                  error: stryMutAct_9fa48("71") ? "" : (stryCov_9fa48("71"), 'Barbearia não encontrada')
                }));
              }
            }
            if (stryMutAct_9fa48("74") ? barbearia.gerente_id === userId : stryMutAct_9fa48("73") ? false : stryMutAct_9fa48("72") ? true : (stryCov_9fa48("72", "73", "74"), barbearia.gerente_id !== userId)) {
              if (stryMutAct_9fa48("75")) {
                {}
              } else {
                stryCov_9fa48("75");
                return reply.status(403).send(stryMutAct_9fa48("76") ? {} : (stryCov_9fa48("76"), {
                  success: stryMutAct_9fa48("77") ? true : (stryCov_9fa48("77"), false),
                  error: stryMutAct_9fa48("78") ? "" : (stryCov_9fa48("78"), 'Acesso negado'),
                  message: stryMutAct_9fa48("79") ? "" : (stryCov_9fa48("79"), 'Você só pode gerenciar sua própria barbearia')
                }));
              }
            }
          }
        }
      }
    } catch (error) {
      if (stryMutAct_9fa48("80")) {
        {}
      } else {
        stryCov_9fa48("80");
        return reply.status(500).send(stryMutAct_9fa48("81") ? {} : (stryCov_9fa48("81"), {
          success: stryMutAct_9fa48("82") ? true : (stryCov_9fa48("82"), false),
          error: stryMutAct_9fa48("83") ? "" : (stryCov_9fa48("83"), 'Erro interno'),
          message: stryMutAct_9fa48("84") ? "" : (stryCov_9fa48("84"), 'Erro ao verificar propriedade da barbearia')
        }));
      }
    }
  }
}

/**
 * Middleware para verificar se o barbeiro trabalha na barbearia
 * @param {Object} request - Request do Fastify
 * @param {Object} reply - Reply do Fastify
 */
async function checkBarbeiroBarbeariaAccess(request, reply) {
  if (stryMutAct_9fa48("85")) {
    {}
  } else {
    stryCov_9fa48("85");
    const {
      barbearia_id
    } = request.params;
    const userId = stryMutAct_9fa48("86") ? request.user.id : (stryCov_9fa48("86"), request.user?.id);
    const userRole = stryMutAct_9fa48("87") ? request.user.role : (stryCov_9fa48("87"), request.user?.role);
    try {
      if (stryMutAct_9fa48("88")) {
        {}
      } else {
        stryCov_9fa48("88");
        // Admin pode acessar qualquer barbearia
        if (stryMutAct_9fa48("91") ? userRole !== 'admin' : stryMutAct_9fa48("90") ? false : stryMutAct_9fa48("89") ? true : (stryCov_9fa48("89", "90", "91"), userRole === (stryMutAct_9fa48("92") ? "" : (stryCov_9fa48("92"), 'admin')))) {
          if (stryMutAct_9fa48("93")) {
            {}
          } else {
            stryCov_9fa48("93");
            return;
          }
        }

        // Barbeiro só pode acessar barbearias onde trabalha
        if (stryMutAct_9fa48("96") ? userRole !== 'barbeiro' : stryMutAct_9fa48("95") ? false : stryMutAct_9fa48("94") ? true : (stryCov_9fa48("94", "95", "96"), userRole === (stryMutAct_9fa48("97") ? "" : (stryCov_9fa48("97"), 'barbeiro')))) {
          if (stryMutAct_9fa48("98")) {
            {}
          } else {
            stryCov_9fa48("98");
            const {
              data: barbeiroBarbearia,
              error
            } = await supabase.from(stryMutAct_9fa48("99") ? "" : (stryCov_9fa48("99"), 'barbeiros_barbearias')).select(stryMutAct_9fa48("100") ? "" : (stryCov_9fa48("100"), 'ativo, disponivel')).eq(stryMutAct_9fa48("101") ? "" : (stryCov_9fa48("101"), 'user_id'), userId).eq(stryMutAct_9fa48("102") ? "" : (stryCov_9fa48("102"), 'barbearia_id'), barbearia_id).single();
            if (stryMutAct_9fa48("105") ? error && !barbeiroBarbearia : stryMutAct_9fa48("104") ? false : stryMutAct_9fa48("103") ? true : (stryCov_9fa48("103", "104", "105"), error || (stryMutAct_9fa48("106") ? barbeiroBarbearia : (stryCov_9fa48("106"), !barbeiroBarbearia)))) {
              if (stryMutAct_9fa48("107")) {
                {}
              } else {
                stryCov_9fa48("107");
                return reply.status(403).send(stryMutAct_9fa48("108") ? {} : (stryCov_9fa48("108"), {
                  success: stryMutAct_9fa48("109") ? true : (stryCov_9fa48("109"), false),
                  error: stryMutAct_9fa48("110") ? "" : (stryCov_9fa48("110"), 'Acesso negado'),
                  message: stryMutAct_9fa48("111") ? "" : (stryCov_9fa48("111"), 'Você não trabalha nesta barbearia')
                }));
              }
            }
            if (stryMutAct_9fa48("114") ? false : stryMutAct_9fa48("113") ? true : stryMutAct_9fa48("112") ? barbeiroBarbearia.ativo : (stryCov_9fa48("112", "113", "114"), !barbeiroBarbearia.ativo)) {
              if (stryMutAct_9fa48("115")) {
                {}
              } else {
                stryCov_9fa48("115");
                return reply.status(403).send(stryMutAct_9fa48("116") ? {} : (stryCov_9fa48("116"), {
                  success: stryMutAct_9fa48("117") ? true : (stryCov_9fa48("117"), false),
                  error: stryMutAct_9fa48("118") ? "" : (stryCov_9fa48("118"), 'Barbeiro inativo'),
                  message: stryMutAct_9fa48("119") ? "" : (stryCov_9fa48("119"), 'Você não está ativo nesta barbearia')
                }));
              }
            }

            // Adicionar informações do barbeiro ao request
            request.barbeiroInfo = barbeiroBarbearia;
          }
        }
      }
    } catch (error) {
      if (stryMutAct_9fa48("120")) {
        {}
      } else {
        stryCov_9fa48("120");
        return reply.status(500).send(stryMutAct_9fa48("121") ? {} : (stryCov_9fa48("121"), {
          success: stryMutAct_9fa48("122") ? true : (stryCov_9fa48("122"), false),
          error: stryMutAct_9fa48("123") ? "" : (stryCov_9fa48("123"), 'Erro interno'),
          message: stryMutAct_9fa48("124") ? "" : (stryCov_9fa48("124"), 'Erro ao verificar acesso do barbeiro')
        }));
      }
    }
  }
}
module.exports = stryMutAct_9fa48("125") ? {} : (stryCov_9fa48("125"), {
  checkBarbeariaAccess,
  checkBarbeariaOwnership,
  checkBarbeiroBarbeariaAccess
});