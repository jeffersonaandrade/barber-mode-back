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
} = require('../config/database');

/**
 * Middleware para verificar se o usuário tem acesso à barbearia
 * @param {Object} request - Request do Fastify
 * @param {Object} reply - Reply do Fastify
 */
async function checkBarbeariaAccess(request, reply) {
  if (stryMutAct_9fa48("428")) {
    {}
  } else {
    stryCov_9fa48("428");
    const {
      barbearia_id
    } = request.params;
    const userId = stryMutAct_9fa48("429") ? request.user.id : (stryCov_9fa48("429"), request.user?.id);
    const userRole = stryMutAct_9fa48("430") ? request.user.role : (stryCov_9fa48("430"), request.user?.role);
    try {
      if (stryMutAct_9fa48("431")) {
        {}
      } else {
        stryCov_9fa48("431");
        // Admin pode acessar qualquer barbearia
        if (stryMutAct_9fa48("434") ? userRole !== 'admin' : stryMutAct_9fa48("433") ? false : stryMutAct_9fa48("432") ? true : (stryCov_9fa48("432", "433", "434"), userRole === (stryMutAct_9fa48("435") ? "" : (stryCov_9fa48("435"), 'admin')))) {
          if (stryMutAct_9fa48("436")) {
            {}
          } else {
            stryCov_9fa48("436");
            return;
          }
        }

        // Verificar se a barbearia existe
        const {
          data: barbearia,
          error: barbeariaError
        } = await supabase.from(stryMutAct_9fa48("437") ? "" : (stryCov_9fa48("437"), 'barbearias')).select(stryMutAct_9fa48("438") ? "" : (stryCov_9fa48("438"), 'id, nome, ativo')).eq(stryMutAct_9fa48("439") ? "" : (stryCov_9fa48("439"), 'id'), barbearia_id).single();
        if (stryMutAct_9fa48("442") ? barbeariaError && !barbearia : stryMutAct_9fa48("441") ? false : stryMutAct_9fa48("440") ? true : (stryCov_9fa48("440", "441", "442"), barbeariaError || (stryMutAct_9fa48("443") ? barbearia : (stryCov_9fa48("443"), !barbearia)))) {
          if (stryMutAct_9fa48("444")) {
            {}
          } else {
            stryCov_9fa48("444");
            return reply.status(404).send(stryMutAct_9fa48("445") ? {} : (stryCov_9fa48("445"), {
              success: stryMutAct_9fa48("446") ? true : (stryCov_9fa48("446"), false),
              error: stryMutAct_9fa48("447") ? "" : (stryCov_9fa48("447"), 'Barbearia não encontrada')
            }));
          }
        }
        if (stryMutAct_9fa48("450") ? false : stryMutAct_9fa48("449") ? true : stryMutAct_9fa48("448") ? barbearia.ativo : (stryCov_9fa48("448", "449", "450"), !barbearia.ativo)) {
          if (stryMutAct_9fa48("451")) {
            {}
          } else {
            stryCov_9fa48("451");
            return reply.status(404).send(stryMutAct_9fa48("452") ? {} : (stryCov_9fa48("452"), {
              success: stryMutAct_9fa48("453") ? true : (stryCov_9fa48("453"), false),
              error: stryMutAct_9fa48("454") ? "" : (stryCov_9fa48("454"), 'Barbearia inativa')
            }));
          }
        }

        // Verificar se o usuário tem acesso à barbearia
        const {
          data: barbeiroBarbearia,
          error
        } = await supabase.from(stryMutAct_9fa48("455") ? "" : (stryCov_9fa48("455"), 'barbeiros_barbearias')).select(stryMutAct_9fa48("456") ? "" : (stryCov_9fa48("456"), '*')).eq(stryMutAct_9fa48("457") ? "" : (stryCov_9fa48("457"), 'user_id'), userId).eq(stryMutAct_9fa48("458") ? "" : (stryCov_9fa48("458"), 'barbearia_id'), barbearia_id).eq(stryMutAct_9fa48("459") ? "" : (stryCov_9fa48("459"), 'ativo'), stryMutAct_9fa48("460") ? false : (stryCov_9fa48("460"), true)).single();
        if (stryMutAct_9fa48("463") ? error && !barbeiroBarbearia : stryMutAct_9fa48("462") ? false : stryMutAct_9fa48("461") ? true : (stryCov_9fa48("461", "462", "463"), error || (stryMutAct_9fa48("464") ? barbeiroBarbearia : (stryCov_9fa48("464"), !barbeiroBarbearia)))) {
          if (stryMutAct_9fa48("465")) {
            {}
          } else {
            stryCov_9fa48("465");
            return reply.status(403).send(stryMutAct_9fa48("466") ? {} : (stryCov_9fa48("466"), {
              success: stryMutAct_9fa48("467") ? true : (stryCov_9fa48("467"), false),
              error: stryMutAct_9fa48("468") ? "" : (stryCov_9fa48("468"), 'Acesso negado'),
              message: stryMutAct_9fa48("469") ? "" : (stryCov_9fa48("469"), 'Você não tem acesso a esta barbearia')
            }));
          }
        }

        // Adicionar informações do barbeiro ao request
        request.barbeiroInfo = barbeiroBarbearia;
      }
    } catch (error) {
      if (stryMutAct_9fa48("470")) {
        {}
      } else {
        stryCov_9fa48("470");
        return reply.status(500).send(stryMutAct_9fa48("471") ? {} : (stryCov_9fa48("471"), {
          success: stryMutAct_9fa48("472") ? true : (stryCov_9fa48("472"), false),
          error: stryMutAct_9fa48("473") ? "" : (stryCov_9fa48("473"), 'Erro interno'),
          message: stryMutAct_9fa48("474") ? "" : (stryCov_9fa48("474"), 'Erro ao verificar acesso à barbearia')
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
  if (stryMutAct_9fa48("475")) {
    {}
  } else {
    stryCov_9fa48("475");
    const {
      barbearia_id
    } = request.params;
    const userId = stryMutAct_9fa48("476") ? request.user.id : (stryCov_9fa48("476"), request.user?.id);
    const userRole = stryMutAct_9fa48("477") ? request.user.role : (stryCov_9fa48("477"), request.user?.role);
    try {
      if (stryMutAct_9fa48("478")) {
        {}
      } else {
        stryCov_9fa48("478");
        // Admin pode acessar qualquer barbearia
        if (stryMutAct_9fa48("481") ? userRole !== 'admin' : stryMutAct_9fa48("480") ? false : stryMutAct_9fa48("479") ? true : (stryCov_9fa48("479", "480", "481"), userRole === (stryMutAct_9fa48("482") ? "" : (stryCov_9fa48("482"), 'admin')))) {
          if (stryMutAct_9fa48("483")) {
            {}
          } else {
            stryCov_9fa48("483");
            return;
          }
        }

        // Gerente só pode acessar sua própria barbearia
        if (stryMutAct_9fa48("486") ? userRole !== 'gerente' : stryMutAct_9fa48("485") ? false : stryMutAct_9fa48("484") ? true : (stryCov_9fa48("484", "485", "486"), userRole === (stryMutAct_9fa48("487") ? "" : (stryCov_9fa48("487"), 'gerente')))) {
          if (stryMutAct_9fa48("488")) {
            {}
          } else {
            stryCov_9fa48("488");
            const {
              data: barbearia,
              error
            } = await supabase.from(stryMutAct_9fa48("489") ? "" : (stryCov_9fa48("489"), 'barbearias')).select(stryMutAct_9fa48("490") ? "" : (stryCov_9fa48("490"), 'id, nome, gerente_id')).eq(stryMutAct_9fa48("491") ? "" : (stryCov_9fa48("491"), 'id'), barbearia_id).single();
            if (stryMutAct_9fa48("494") ? error && !barbearia : stryMutAct_9fa48("493") ? false : stryMutAct_9fa48("492") ? true : (stryCov_9fa48("492", "493", "494"), error || (stryMutAct_9fa48("495") ? barbearia : (stryCov_9fa48("495"), !barbearia)))) {
              if (stryMutAct_9fa48("496")) {
                {}
              } else {
                stryCov_9fa48("496");
                return reply.status(404).send(stryMutAct_9fa48("497") ? {} : (stryCov_9fa48("497"), {
                  success: stryMutAct_9fa48("498") ? true : (stryCov_9fa48("498"), false),
                  error: stryMutAct_9fa48("499") ? "" : (stryCov_9fa48("499"), 'Barbearia não encontrada')
                }));
              }
            }
            if (stryMutAct_9fa48("502") ? barbearia.gerente_id === userId : stryMutAct_9fa48("501") ? false : stryMutAct_9fa48("500") ? true : (stryCov_9fa48("500", "501", "502"), barbearia.gerente_id !== userId)) {
              if (stryMutAct_9fa48("503")) {
                {}
              } else {
                stryCov_9fa48("503");
                return reply.status(403).send(stryMutAct_9fa48("504") ? {} : (stryCov_9fa48("504"), {
                  success: stryMutAct_9fa48("505") ? true : (stryCov_9fa48("505"), false),
                  error: stryMutAct_9fa48("506") ? "" : (stryCov_9fa48("506"), 'Acesso negado'),
                  message: stryMutAct_9fa48("507") ? "" : (stryCov_9fa48("507"), 'Você só pode gerenciar sua própria barbearia')
                }));
              }
            }
          }
        }
      }
    } catch (error) {
      if (stryMutAct_9fa48("508")) {
        {}
      } else {
        stryCov_9fa48("508");
        return reply.status(500).send(stryMutAct_9fa48("509") ? {} : (stryCov_9fa48("509"), {
          success: stryMutAct_9fa48("510") ? true : (stryCov_9fa48("510"), false),
          error: stryMutAct_9fa48("511") ? "" : (stryCov_9fa48("511"), 'Erro interno'),
          message: stryMutAct_9fa48("512") ? "" : (stryCov_9fa48("512"), 'Erro ao verificar propriedade da barbearia')
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
  if (stryMutAct_9fa48("513")) {
    {}
  } else {
    stryCov_9fa48("513");
    const {
      barbearia_id
    } = request.params;
    const userId = stryMutAct_9fa48("514") ? request.user.id : (stryCov_9fa48("514"), request.user?.id);
    const userRole = stryMutAct_9fa48("515") ? request.user.role : (stryCov_9fa48("515"), request.user?.role);
    try {
      if (stryMutAct_9fa48("516")) {
        {}
      } else {
        stryCov_9fa48("516");
        // Admin pode acessar qualquer barbearia
        if (stryMutAct_9fa48("519") ? userRole !== 'admin' : stryMutAct_9fa48("518") ? false : stryMutAct_9fa48("517") ? true : (stryCov_9fa48("517", "518", "519"), userRole === (stryMutAct_9fa48("520") ? "" : (stryCov_9fa48("520"), 'admin')))) {
          if (stryMutAct_9fa48("521")) {
            {}
          } else {
            stryCov_9fa48("521");
            return;
          }
        }

        // Barbeiro só pode acessar barbearias onde trabalha
        if (stryMutAct_9fa48("524") ? userRole !== 'barbeiro' : stryMutAct_9fa48("523") ? false : stryMutAct_9fa48("522") ? true : (stryCov_9fa48("522", "523", "524"), userRole === (stryMutAct_9fa48("525") ? "" : (stryCov_9fa48("525"), 'barbeiro')))) {
          if (stryMutAct_9fa48("526")) {
            {}
          } else {
            stryCov_9fa48("526");
            const {
              data: barbeiroBarbearia,
              error
            } = await supabase.from(stryMutAct_9fa48("527") ? "" : (stryCov_9fa48("527"), 'barbeiros_barbearias')).select(stryMutAct_9fa48("528") ? "" : (stryCov_9fa48("528"), 'ativo, disponivel')).eq(stryMutAct_9fa48("529") ? "" : (stryCov_9fa48("529"), 'user_id'), userId).eq(stryMutAct_9fa48("530") ? "" : (stryCov_9fa48("530"), 'barbearia_id'), barbearia_id).single();
            if (stryMutAct_9fa48("533") ? error && !barbeiroBarbearia : stryMutAct_9fa48("532") ? false : stryMutAct_9fa48("531") ? true : (stryCov_9fa48("531", "532", "533"), error || (stryMutAct_9fa48("534") ? barbeiroBarbearia : (stryCov_9fa48("534"), !barbeiroBarbearia)))) {
              if (stryMutAct_9fa48("535")) {
                {}
              } else {
                stryCov_9fa48("535");
                return reply.status(403).send(stryMutAct_9fa48("536") ? {} : (stryCov_9fa48("536"), {
                  success: stryMutAct_9fa48("537") ? true : (stryCov_9fa48("537"), false),
                  error: stryMutAct_9fa48("538") ? "" : (stryCov_9fa48("538"), 'Acesso negado'),
                  message: stryMutAct_9fa48("539") ? "" : (stryCov_9fa48("539"), 'Você não trabalha nesta barbearia')
                }));
              }
            }
            if (stryMutAct_9fa48("542") ? false : stryMutAct_9fa48("541") ? true : stryMutAct_9fa48("540") ? barbeiroBarbearia.ativo : (stryCov_9fa48("540", "541", "542"), !barbeiroBarbearia.ativo)) {
              if (stryMutAct_9fa48("543")) {
                {}
              } else {
                stryCov_9fa48("543");
                return reply.status(403).send(stryMutAct_9fa48("544") ? {} : (stryCov_9fa48("544"), {
                  success: stryMutAct_9fa48("545") ? true : (stryCov_9fa48("545"), false),
                  error: stryMutAct_9fa48("546") ? "" : (stryCov_9fa48("546"), 'Barbeiro inativo'),
                  message: stryMutAct_9fa48("547") ? "" : (stryCov_9fa48("547"), 'Você não está ativo nesta barbearia')
                }));
              }
            }

            // Adicionar informações do barbeiro ao request
            request.barbeiroInfo = barbeiroBarbearia;
          }
        }
      }
    } catch (error) {
      if (stryMutAct_9fa48("548")) {
        {}
      } else {
        stryCov_9fa48("548");
        return reply.status(500).send(stryMutAct_9fa48("549") ? {} : (stryCov_9fa48("549"), {
          success: stryMutAct_9fa48("550") ? true : (stryCov_9fa48("550"), false),
          error: stryMutAct_9fa48("551") ? "" : (stryCov_9fa48("551"), 'Erro interno'),
          message: stryMutAct_9fa48("552") ? "" : (stryCov_9fa48("552"), 'Erro ao verificar acesso do barbeiro')
        }));
      }
    }
  }
}
module.exports = stryMutAct_9fa48("553") ? {} : (stryCov_9fa48("553"), {
  checkBarbeariaAccess,
  checkBarbeariaOwnership,
  checkBarbeiroBarbeariaAccess
});