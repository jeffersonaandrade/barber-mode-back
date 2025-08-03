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
 * @typedef {Object} User
 * @property {string} id
 * @property {string} role
 * @property {string} email
 * @property {string} nome
 */

/**
 * Helper utilitário para verificar roles
 * @param {User} user - Usuário autenticado
 * @param {string|string[]} roles - Role(s) permitido(s)
 * @returns {boolean}
 */
function hasRole(user, roles) {
  if (stryMutAct_9fa48("555")) {
    {}
  } else {
    stryCov_9fa48("555");
    if (stryMutAct_9fa48("558") ? false : stryMutAct_9fa48("557") ? true : stryMutAct_9fa48("556") ? user?.role : (stryCov_9fa48("556", "557", "558"), !(stryMutAct_9fa48("559") ? user.role : (stryCov_9fa48("559"), user?.role)))) return stryMutAct_9fa48("560") ? true : (stryCov_9fa48("560"), false);
    const allowedRoles = Array.isArray(roles) ? roles : stryMutAct_9fa48("561") ? [] : (stryCov_9fa48("561"), [roles]);
    return allowedRoles.includes(user.role);
  }
}

/**
 * Verifica se o usuário é gerente de uma barbearia específica
 * @param {string} userId - ID do usuário
 * @param {number} barbeariaId - ID da barbearia
 * @returns {Promise<boolean>}
 */
async function isGerenteDaBarbearia(userId, barbeariaId) {
  if (stryMutAct_9fa48("562")) {
    {}
  } else {
    stryCov_9fa48("562");
    try {
      if (stryMutAct_9fa48("563")) {
        {}
      } else {
        stryCov_9fa48("563");
        const {
          data,
          error
        } = await supabase.from(stryMutAct_9fa48("564") ? "" : (stryCov_9fa48("564"), 'barbearias')).select(stryMutAct_9fa48("565") ? "" : (stryCov_9fa48("565"), 'gerente_id')).eq(stryMutAct_9fa48("566") ? "" : (stryCov_9fa48("566"), 'id'), barbeariaId).single();
        if (stryMutAct_9fa48("569") ? error && !data : stryMutAct_9fa48("568") ? false : stryMutAct_9fa48("567") ? true : (stryCov_9fa48("567", "568", "569"), error || (stryMutAct_9fa48("570") ? data : (stryCov_9fa48("570"), !data)))) return stryMutAct_9fa48("571") ? true : (stryCov_9fa48("571"), false);
        return stryMutAct_9fa48("574") ? data.gerente_id !== userId : stryMutAct_9fa48("573") ? false : stryMutAct_9fa48("572") ? true : (stryCov_9fa48("572", "573", "574"), data.gerente_id === userId);
      }
    } catch (error) {
      if (stryMutAct_9fa48("575")) {
        {}
      } else {
        stryCov_9fa48("575");
        console.error(stryMutAct_9fa48("576") ? "" : (stryCov_9fa48("576"), 'Erro ao verificar se usuário é gerente da barbearia:'), error);
        return stryMutAct_9fa48("577") ? true : (stryCov_9fa48("577"), false);
      }
    }
  }
}

/**
 * Verifica se o barbeiro trabalha em uma barbearia específica
 * @param {string} userId - ID do usuário
 * @param {number} barbeariaId - ID da barbearia
 * @returns {Promise<{ativo: boolean, disponivel: boolean}|null>}
 */
async function isBarbeiroDaBarbearia(userId, barbeariaId) {
  if (stryMutAct_9fa48("578")) {
    {}
  } else {
    stryCov_9fa48("578");
    try {
      if (stryMutAct_9fa48("579")) {
        {}
      } else {
        stryCov_9fa48("579");
        const {
          data,
          error
        } = await supabase.from(stryMutAct_9fa48("580") ? "" : (stryCov_9fa48("580"), 'barbeiros_barbearias')).select(stryMutAct_9fa48("581") ? "" : (stryCov_9fa48("581"), 'ativo, disponivel')).eq(stryMutAct_9fa48("582") ? "" : (stryCov_9fa48("582"), 'user_id'), userId).eq(stryMutAct_9fa48("583") ? "" : (stryCov_9fa48("583"), 'barbearia_id'), barbeariaId).single();
        if (stryMutAct_9fa48("586") ? error && !data : stryMutAct_9fa48("585") ? false : stryMutAct_9fa48("584") ? true : (stryCov_9fa48("584", "585", "586"), error || (stryMutAct_9fa48("587") ? data : (stryCov_9fa48("587"), !data)))) return null;
        return data;
      }
    } catch (error) {
      if (stryMutAct_9fa48("588")) {
        {}
      } else {
        stryCov_9fa48("588");
        console.error(stryMutAct_9fa48("589") ? "" : (stryCov_9fa48("589"), 'Erro ao verificar se barbeiro trabalha na barbearia:'), error);
        return null;
      }
    }
  }
}

/**
 * Resposta padronizada de erro de acesso
 * @param {string} errorCode - Código do erro
 * @param {string} message - Mensagem para o usuário
 * @returns {Object}
 */
function createAccessError(errorCode, message) {
  if (stryMutAct_9fa48("590")) {
    {}
  } else {
    stryCov_9fa48("590");
    return stryMutAct_9fa48("591") ? {} : (stryCov_9fa48("591"), {
      success: stryMutAct_9fa48("592") ? true : (stryCov_9fa48("592"), false),
      errorCode,
      message,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Middleware para verificar se o usuário é barbeiro
 * @param {import('fastify').FastifyRequest & { user: User }} request
 * @param {import('fastify').FastifyReply} reply
 */
async function checkBarbeiroRole(request, reply) {
  if (stryMutAct_9fa48("593")) {
    {}
  } else {
    stryCov_9fa48("593");
    if (stryMutAct_9fa48("596") ? false : stryMutAct_9fa48("595") ? true : stryMutAct_9fa48("594") ? hasRole(request.user, 'barbeiro') : (stryCov_9fa48("594", "595", "596"), !hasRole(request.user, stryMutAct_9fa48("597") ? "" : (stryCov_9fa48("597"), 'barbeiro')))) {
      if (stryMutAct_9fa48("598")) {
        {}
      } else {
        stryCov_9fa48("598");
        return reply.status(403).send(createAccessError(stryMutAct_9fa48("599") ? "" : (stryCov_9fa48("599"), 'ACCESS_DENIED'), stryMutAct_9fa48("600") ? "" : (stryCov_9fa48("600"), 'Apenas barbeiros podem acessar este recurso')));
      }
    }
  }
}

/**
 * Middleware para verificar se o usuário é gerente
 * @param {import('fastify').FastifyRequest & { user: User }} request
 * @param {import('fastify').FastifyReply} reply
 */
async function checkGerenteRole(request, reply) {
  if (stryMutAct_9fa48("601")) {
    {}
  } else {
    stryCov_9fa48("601");
    if (stryMutAct_9fa48("604") ? false : stryMutAct_9fa48("603") ? true : stryMutAct_9fa48("602") ? hasRole(request.user, 'gerente') : (stryCov_9fa48("602", "603", "604"), !hasRole(request.user, stryMutAct_9fa48("605") ? "" : (stryCov_9fa48("605"), 'gerente')))) {
      if (stryMutAct_9fa48("606")) {
        {}
      } else {
        stryCov_9fa48("606");
        return reply.status(403).send(createAccessError(stryMutAct_9fa48("607") ? "" : (stryCov_9fa48("607"), 'ACCESS_DENIED'), stryMutAct_9fa48("608") ? "" : (stryCov_9fa48("608"), 'Apenas gerentes podem acessar este recurso')));
      }
    }
  }
}

/**
 * Middleware para verificar se o usuário é admin
 * @param {import('fastify').FastifyRequest & { user: User }} request
 * @param {import('fastify').FastifyReply} reply
 */
async function checkAdminRole(request, reply) {
  if (stryMutAct_9fa48("609")) {
    {}
  } else {
    stryCov_9fa48("609");
    if (stryMutAct_9fa48("612") ? false : stryMutAct_9fa48("611") ? true : stryMutAct_9fa48("610") ? hasRole(request.user, 'admin') : (stryCov_9fa48("610", "611", "612"), !hasRole(request.user, stryMutAct_9fa48("613") ? "" : (stryCov_9fa48("613"), 'admin')))) {
      if (stryMutAct_9fa48("614")) {
        {}
      } else {
        stryCov_9fa48("614");
        return reply.status(403).send(createAccessError(stryMutAct_9fa48("615") ? "" : (stryCov_9fa48("615"), 'ACCESS_DENIED'), stryMutAct_9fa48("616") ? "" : (stryCov_9fa48("616"), 'Apenas administradores podem acessar este recurso')));
      }
    }
  }
}

/**
 * Middleware para verificar se o usuário é admin ou gerente
 * @param {import('fastify').FastifyRequest & { user: User }} request
 * @param {import('fastify').FastifyReply} reply
 */
async function checkAdminOrGerenteRole(request, reply) {
  if (stryMutAct_9fa48("617")) {
    {}
  } else {
    stryCov_9fa48("617");
    if (stryMutAct_9fa48("620") ? false : stryMutAct_9fa48("619") ? true : stryMutAct_9fa48("618") ? hasRole(request.user, ['admin', 'gerente']) : (stryCov_9fa48("618", "619", "620"), !hasRole(request.user, stryMutAct_9fa48("621") ? [] : (stryCov_9fa48("621"), [stryMutAct_9fa48("622") ? "" : (stryCov_9fa48("622"), 'admin'), stryMutAct_9fa48("623") ? "" : (stryCov_9fa48("623"), 'gerente')])))) {
      if (stryMutAct_9fa48("624")) {
        {}
      } else {
        stryCov_9fa48("624");
        return reply.status(403).send(createAccessError(stryMutAct_9fa48("625") ? "" : (stryCov_9fa48("625"), 'ACCESS_DENIED'), stryMutAct_9fa48("626") ? "" : (stryCov_9fa48("626"), 'Apenas administradores e gerentes podem acessar este recurso')));
      }
    }
  }
}

/**
 * Middleware para verificar se o gerente tem acesso à barbearia específica
 * @param {import('fastify').FastifyRequest & { user: User }} request
 * @param {import('fastify').FastifyReply} reply
 */
async function checkGerenteBarbeariaAccess(request, reply) {
  if (stryMutAct_9fa48("627")) {
    {}
  } else {
    stryCov_9fa48("627");
    const {
      barbearia_id
    } = request.params;
    const userId = stryMutAct_9fa48("628") ? request.user.id : (stryCov_9fa48("628"), request.user?.id);
    const userRole = stryMutAct_9fa48("629") ? request.user.role : (stryCov_9fa48("629"), request.user?.role);
    try {
      if (stryMutAct_9fa48("630")) {
        {}
      } else {
        stryCov_9fa48("630");
        // Admin pode acessar qualquer barbearia
        if (stryMutAct_9fa48("633") ? userRole !== 'admin' : stryMutAct_9fa48("632") ? false : stryMutAct_9fa48("631") ? true : (stryCov_9fa48("631", "632", "633"), userRole === (stryMutAct_9fa48("634") ? "" : (stryCov_9fa48("634"), 'admin')))) {
          if (stryMutAct_9fa48("635")) {
            {}
          } else {
            stryCov_9fa48("635");
            return;
          }
        }

        // Gerente só pode acessar sua própria barbearia
        if (stryMutAct_9fa48("638") ? userRole !== 'gerente' : stryMutAct_9fa48("637") ? false : stryMutAct_9fa48("636") ? true : (stryCov_9fa48("636", "637", "638"), userRole === (stryMutAct_9fa48("639") ? "" : (stryCov_9fa48("639"), 'gerente')))) {
          if (stryMutAct_9fa48("640")) {
            {}
          } else {
            stryCov_9fa48("640");
            const isGerente = await isGerenteDaBarbearia(userId, barbearia_id);
            if (stryMutAct_9fa48("643") ? false : stryMutAct_9fa48("642") ? true : stryMutAct_9fa48("641") ? isGerente : (stryCov_9fa48("641", "642", "643"), !isGerente)) {
              if (stryMutAct_9fa48("644")) {
                {}
              } else {
                stryCov_9fa48("644");
                return reply.status(403).send(createAccessError(stryMutAct_9fa48("645") ? "" : (stryCov_9fa48("645"), 'BARBEARIA_ACCESS_DENIED'), stryMutAct_9fa48("646") ? "" : (stryCov_9fa48("646"), 'Você só pode gerenciar sua própria barbearia')));
              }
            }
          }
        }
      }
    } catch (error) {
      if (stryMutAct_9fa48("647")) {
        {}
      } else {
        stryCov_9fa48("647");
        console.error(stryMutAct_9fa48("648") ? "" : (stryCov_9fa48("648"), 'Erro em checkGerenteBarbeariaAccess:'), error);
        return reply.status(500).send(createAccessError(stryMutAct_9fa48("649") ? "" : (stryCov_9fa48("649"), 'INTERNAL_ERROR'), stryMutAct_9fa48("650") ? "" : (stryCov_9fa48("650"), 'Erro ao verificar acesso à barbearia')));
      }
    }
  }
}

/**
 * Middleware para verificar se o barbeiro trabalha na barbearia
 * @param {import('fastify').FastifyRequest & { user: User }} request
 * @param {import('fastify').FastifyReply} reply
 */
async function checkBarbeiroBarbeariaAccess(request, reply) {
  if (stryMutAct_9fa48("651")) {
    {}
  } else {
    stryCov_9fa48("651");
    const {
      barbearia_id
    } = request.params;
    const userId = stryMutAct_9fa48("652") ? request.user.id : (stryCov_9fa48("652"), request.user?.id);
    const userRole = stryMutAct_9fa48("653") ? request.user.role : (stryCov_9fa48("653"), request.user?.role);
    try {
      if (stryMutAct_9fa48("654")) {
        {}
      } else {
        stryCov_9fa48("654");
        // Admin pode acessar qualquer barbearia
        if (stryMutAct_9fa48("657") ? userRole !== 'admin' : stryMutAct_9fa48("656") ? false : stryMutAct_9fa48("655") ? true : (stryCov_9fa48("655", "656", "657"), userRole === (stryMutAct_9fa48("658") ? "" : (stryCov_9fa48("658"), 'admin')))) {
          if (stryMutAct_9fa48("659")) {
            {}
          } else {
            stryCov_9fa48("659");
            return;
          }
        }

        // Barbeiro só pode acessar barbearias onde trabalha
        if (stryMutAct_9fa48("662") ? userRole !== 'barbeiro' : stryMutAct_9fa48("661") ? false : stryMutAct_9fa48("660") ? true : (stryCov_9fa48("660", "661", "662"), userRole === (stryMutAct_9fa48("663") ? "" : (stryCov_9fa48("663"), 'barbeiro')))) {
          if (stryMutAct_9fa48("664")) {
            {}
          } else {
            stryCov_9fa48("664");
            const barbeiroInfo = await isBarbeiroDaBarbearia(userId, barbearia_id);
            if (stryMutAct_9fa48("667") ? false : stryMutAct_9fa48("666") ? true : stryMutAct_9fa48("665") ? barbeiroInfo : (stryCov_9fa48("665", "666", "667"), !barbeiroInfo)) {
              if (stryMutAct_9fa48("668")) {
                {}
              } else {
                stryCov_9fa48("668");
                return reply.status(403).send(createAccessError(stryMutAct_9fa48("669") ? "" : (stryCov_9fa48("669"), 'BARBEARIA_ACCESS_DENIED'), stryMutAct_9fa48("670") ? "" : (stryCov_9fa48("670"), 'Você não trabalha nesta barbearia')));
              }
            }
            if (stryMutAct_9fa48("673") ? false : stryMutAct_9fa48("672") ? true : stryMutAct_9fa48("671") ? barbeiroInfo.ativo : (stryCov_9fa48("671", "672", "673"), !barbeiroInfo.ativo)) {
              if (stryMutAct_9fa48("674")) {
                {}
              } else {
                stryCov_9fa48("674");
                return reply.status(403).send(createAccessError(stryMutAct_9fa48("675") ? "" : (stryCov_9fa48("675"), 'BARBEIRO_INACTIVE'), stryMutAct_9fa48("676") ? "" : (stryCov_9fa48("676"), 'Você não está ativo nesta barbearia')));
              }
            }

            // Adicionar informações do barbeiro ao request
            request.barbeiroInfo = barbeiroInfo;
          }
        }
      }
    } catch (error) {
      if (stryMutAct_9fa48("677")) {
        {}
      } else {
        stryCov_9fa48("677");
        console.error(stryMutAct_9fa48("678") ? "" : (stryCov_9fa48("678"), 'Erro em checkBarbeiroBarbeariaAccess:'), error);
        return reply.status(500).send(createAccessError(stryMutAct_9fa48("679") ? "" : (stryCov_9fa48("679"), 'INTERNAL_ERROR'), stryMutAct_9fa48("680") ? "" : (stryCov_9fa48("680"), 'Erro ao verificar acesso do barbeiro')));
      }
    }
  }
}

/**
 * Middleware genérico para verificar múltiplas roles
 * @param {string|string[]} allowedRoles - Roles permitidos
 * @returns {Function} Middleware function
 */
function requireRoles(allowedRoles) {
  if (stryMutAct_9fa48("681")) {
    {}
  } else {
    stryCov_9fa48("681");
    return async function (request, reply) {
      if (stryMutAct_9fa48("682")) {
        {}
      } else {
        stryCov_9fa48("682");
        if (stryMutAct_9fa48("685") ? false : stryMutAct_9fa48("684") ? true : stryMutAct_9fa48("683") ? hasRole(request.user, allowedRoles) : (stryCov_9fa48("683", "684", "685"), !hasRole(request.user, allowedRoles))) {
          if (stryMutAct_9fa48("686")) {
            {}
          } else {
            stryCov_9fa48("686");
            const rolesText = Array.isArray(allowedRoles) ? allowedRoles.join(stryMutAct_9fa48("687") ? "" : (stryCov_9fa48("687"), ' ou ')) : allowedRoles;
            return reply.status(403).send(createAccessError(stryMutAct_9fa48("688") ? "" : (stryCov_9fa48("688"), 'ACCESS_DENIED'), stryMutAct_9fa48("689") ? `` : (stryCov_9fa48("689"), `Apenas ${rolesText} podem acessar este recurso`)));
          }
        }
      }
    };
  }
}

/**
 * Middleware para verificar acesso à barbearia baseado no role
 * @param {string|string[]} allowedRoles - Roles permitidos
 * @returns {Function} Middleware function
 */
function requireBarbeariaAccess(allowedRoles) {
  if (stryMutAct_9fa48("690")) {
    {}
  } else {
    stryCov_9fa48("690");
    return async function (request, reply) {
      if (stryMutAct_9fa48("691")) {
        {}
      } else {
        stryCov_9fa48("691");
        const {
          barbearia_id
        } = request.params;
        const userId = stryMutAct_9fa48("692") ? request.user.id : (stryCov_9fa48("692"), request.user?.id);
        const userRole = stryMutAct_9fa48("693") ? request.user.role : (stryCov_9fa48("693"), request.user?.role);
        try {
          if (stryMutAct_9fa48("694")) {
            {}
          } else {
            stryCov_9fa48("694");
            // Admin pode acessar qualquer barbearia
            if (stryMutAct_9fa48("697") ? userRole !== 'admin' : stryMutAct_9fa48("696") ? false : stryMutAct_9fa48("695") ? true : (stryCov_9fa48("695", "696", "697"), userRole === (stryMutAct_9fa48("698") ? "" : (stryCov_9fa48("698"), 'admin')))) {
              if (stryMutAct_9fa48("699")) {
                {}
              } else {
                stryCov_9fa48("699");
                return;
              }
            }

            // Verificar se o role está permitido
            if (stryMutAct_9fa48("702") ? false : stryMutAct_9fa48("701") ? true : stryMutAct_9fa48("700") ? hasRole(request.user, allowedRoles) : (stryCov_9fa48("700", "701", "702"), !hasRole(request.user, allowedRoles))) {
              if (stryMutAct_9fa48("703")) {
                {}
              } else {
                stryCov_9fa48("703");
                const rolesText = Array.isArray(allowedRoles) ? allowedRoles.join(stryMutAct_9fa48("704") ? "" : (stryCov_9fa48("704"), ' ou ')) : allowedRoles;
                return reply.status(403).send(createAccessError(stryMutAct_9fa48("705") ? "" : (stryCov_9fa48("705"), 'ACCESS_DENIED'), stryMutAct_9fa48("706") ? `` : (stryCov_9fa48("706"), `Apenas ${rolesText} podem acessar este recurso`)));
              }
            }

            // Verificar acesso específico baseado no role
            if (stryMutAct_9fa48("709") ? userRole !== 'gerente' : stryMutAct_9fa48("708") ? false : stryMutAct_9fa48("707") ? true : (stryCov_9fa48("707", "708", "709"), userRole === (stryMutAct_9fa48("710") ? "" : (stryCov_9fa48("710"), 'gerente')))) {
              if (stryMutAct_9fa48("711")) {
                {}
              } else {
                stryCov_9fa48("711");
                const isGerente = await isGerenteDaBarbearia(userId, barbearia_id);
                if (stryMutAct_9fa48("714") ? false : stryMutAct_9fa48("713") ? true : stryMutAct_9fa48("712") ? isGerente : (stryCov_9fa48("712", "713", "714"), !isGerente)) {
                  if (stryMutAct_9fa48("715")) {
                    {}
                  } else {
                    stryCov_9fa48("715");
                    return reply.status(403).send(createAccessError(stryMutAct_9fa48("716") ? "" : (stryCov_9fa48("716"), 'BARBEARIA_ACCESS_DENIED'), stryMutAct_9fa48("717") ? "" : (stryCov_9fa48("717"), 'Você só pode acessar sua própria barbearia')));
                  }
                }
              }
            } else if (stryMutAct_9fa48("720") ? userRole !== 'barbeiro' : stryMutAct_9fa48("719") ? false : stryMutAct_9fa48("718") ? true : (stryCov_9fa48("718", "719", "720"), userRole === (stryMutAct_9fa48("721") ? "" : (stryCov_9fa48("721"), 'barbeiro')))) {
              if (stryMutAct_9fa48("722")) {
                {}
              } else {
                stryCov_9fa48("722");
                const barbeiroInfo = await isBarbeiroDaBarbearia(userId, barbearia_id);
                if (stryMutAct_9fa48("725") ? !barbeiroInfo && !barbeiroInfo.ativo : stryMutAct_9fa48("724") ? false : stryMutAct_9fa48("723") ? true : (stryCov_9fa48("723", "724", "725"), (stryMutAct_9fa48("726") ? barbeiroInfo : (stryCov_9fa48("726"), !barbeiroInfo)) || (stryMutAct_9fa48("727") ? barbeiroInfo.ativo : (stryCov_9fa48("727"), !barbeiroInfo.ativo)))) {
                  if (stryMutAct_9fa48("728")) {
                    {}
                  } else {
                    stryCov_9fa48("728");
                    return reply.status(403).send(createAccessError(stryMutAct_9fa48("729") ? "" : (stryCov_9fa48("729"), 'BARBEARIA_ACCESS_DENIED'), stryMutAct_9fa48("730") ? "" : (stryCov_9fa48("730"), 'Você não trabalha nesta barbearia ou não está ativo')));
                  }
                }
                request.barbeiroInfo = barbeiroInfo;
              }
            }
          }
        } catch (error) {
          if (stryMutAct_9fa48("731")) {
            {}
          } else {
            stryCov_9fa48("731");
            console.error(stryMutAct_9fa48("732") ? "" : (stryCov_9fa48("732"), 'Erro em requireBarbeariaAccess:'), error);
            return reply.status(500).send(createAccessError(stryMutAct_9fa48("733") ? "" : (stryCov_9fa48("733"), 'INTERNAL_ERROR'), stryMutAct_9fa48("734") ? "" : (stryCov_9fa48("734"), 'Erro ao verificar acesso à barbearia')));
          }
        }
      }
    };
  }
}
module.exports = stryMutAct_9fa48("735") ? {} : (stryCov_9fa48("735"), {
  // Funções utilitárias
  hasRole,
  isGerenteDaBarbearia,
  isBarbeiroDaBarbearia,
  createAccessError,
  // Middlewares específicos
  checkBarbeiroRole,
  checkGerenteRole,
  checkAdminRole,
  checkAdminOrGerenteRole,
  checkGerenteBarbeariaAccess,
  checkBarbeiroBarbeariaAccess,
  // Middlewares genéricos
  requireRoles,
  requireBarbeariaAccess
});