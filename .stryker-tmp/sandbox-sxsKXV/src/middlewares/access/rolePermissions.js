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
  if (stryMutAct_9fa48("127")) {
    {}
  } else {
    stryCov_9fa48("127");
    if (stryMutAct_9fa48("130") ? false : stryMutAct_9fa48("129") ? true : stryMutAct_9fa48("128") ? user?.role : (stryCov_9fa48("128", "129", "130"), !(stryMutAct_9fa48("131") ? user.role : (stryCov_9fa48("131"), user?.role)))) return stryMutAct_9fa48("132") ? true : (stryCov_9fa48("132"), false);
    const allowedRoles = Array.isArray(roles) ? roles : stryMutAct_9fa48("133") ? [] : (stryCov_9fa48("133"), [roles]);
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
  if (stryMutAct_9fa48("134")) {
    {}
  } else {
    stryCov_9fa48("134");
    try {
      if (stryMutAct_9fa48("135")) {
        {}
      } else {
        stryCov_9fa48("135");
        const {
          data,
          error
        } = await supabase.from(stryMutAct_9fa48("136") ? "" : (stryCov_9fa48("136"), 'barbearias')).select(stryMutAct_9fa48("137") ? "" : (stryCov_9fa48("137"), 'gerente_id')).eq(stryMutAct_9fa48("138") ? "" : (stryCov_9fa48("138"), 'id'), barbeariaId).single();
        if (stryMutAct_9fa48("141") ? error && !data : stryMutAct_9fa48("140") ? false : stryMutAct_9fa48("139") ? true : (stryCov_9fa48("139", "140", "141"), error || (stryMutAct_9fa48("142") ? data : (stryCov_9fa48("142"), !data)))) return stryMutAct_9fa48("143") ? true : (stryCov_9fa48("143"), false);
        return stryMutAct_9fa48("146") ? data.gerente_id !== userId : stryMutAct_9fa48("145") ? false : stryMutAct_9fa48("144") ? true : (stryCov_9fa48("144", "145", "146"), data.gerente_id === userId);
      }
    } catch (error) {
      if (stryMutAct_9fa48("147")) {
        {}
      } else {
        stryCov_9fa48("147");
        console.error(stryMutAct_9fa48("148") ? "" : (stryCov_9fa48("148"), 'Erro ao verificar se usuário é gerente da barbearia:'), error);
        return stryMutAct_9fa48("149") ? true : (stryCov_9fa48("149"), false);
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
  if (stryMutAct_9fa48("150")) {
    {}
  } else {
    stryCov_9fa48("150");
    try {
      if (stryMutAct_9fa48("151")) {
        {}
      } else {
        stryCov_9fa48("151");
        const {
          data,
          error
        } = await supabase.from(stryMutAct_9fa48("152") ? "" : (stryCov_9fa48("152"), 'barbeiros_barbearias')).select(stryMutAct_9fa48("153") ? "" : (stryCov_9fa48("153"), 'ativo, disponivel')).eq(stryMutAct_9fa48("154") ? "" : (stryCov_9fa48("154"), 'user_id'), userId).eq(stryMutAct_9fa48("155") ? "" : (stryCov_9fa48("155"), 'barbearia_id'), barbeariaId).single();
        if (stryMutAct_9fa48("158") ? error && !data : stryMutAct_9fa48("157") ? false : stryMutAct_9fa48("156") ? true : (stryCov_9fa48("156", "157", "158"), error || (stryMutAct_9fa48("159") ? data : (stryCov_9fa48("159"), !data)))) return null;
        return data;
      }
    } catch (error) {
      if (stryMutAct_9fa48("160")) {
        {}
      } else {
        stryCov_9fa48("160");
        console.error(stryMutAct_9fa48("161") ? "" : (stryCov_9fa48("161"), 'Erro ao verificar se barbeiro trabalha na barbearia:'), error);
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
  if (stryMutAct_9fa48("162")) {
    {}
  } else {
    stryCov_9fa48("162");
    return stryMutAct_9fa48("163") ? {} : (stryCov_9fa48("163"), {
      success: stryMutAct_9fa48("164") ? true : (stryCov_9fa48("164"), false),
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
  if (stryMutAct_9fa48("165")) {
    {}
  } else {
    stryCov_9fa48("165");
    if (stryMutAct_9fa48("168") ? false : stryMutAct_9fa48("167") ? true : stryMutAct_9fa48("166") ? hasRole(request.user, 'barbeiro') : (stryCov_9fa48("166", "167", "168"), !hasRole(request.user, stryMutAct_9fa48("169") ? "" : (stryCov_9fa48("169"), 'barbeiro')))) {
      if (stryMutAct_9fa48("170")) {
        {}
      } else {
        stryCov_9fa48("170");
        return reply.status(403).send(createAccessError(stryMutAct_9fa48("171") ? "" : (stryCov_9fa48("171"), 'ACCESS_DENIED'), stryMutAct_9fa48("172") ? "" : (stryCov_9fa48("172"), 'Apenas barbeiros podem acessar este recurso')));
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
  if (stryMutAct_9fa48("173")) {
    {}
  } else {
    stryCov_9fa48("173");
    if (stryMutAct_9fa48("176") ? false : stryMutAct_9fa48("175") ? true : stryMutAct_9fa48("174") ? hasRole(request.user, 'gerente') : (stryCov_9fa48("174", "175", "176"), !hasRole(request.user, stryMutAct_9fa48("177") ? "" : (stryCov_9fa48("177"), 'gerente')))) {
      if (stryMutAct_9fa48("178")) {
        {}
      } else {
        stryCov_9fa48("178");
        return reply.status(403).send(createAccessError(stryMutAct_9fa48("179") ? "" : (stryCov_9fa48("179"), 'ACCESS_DENIED'), stryMutAct_9fa48("180") ? "" : (stryCov_9fa48("180"), 'Apenas gerentes podem acessar este recurso')));
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
  if (stryMutAct_9fa48("181")) {
    {}
  } else {
    stryCov_9fa48("181");
    if (stryMutAct_9fa48("184") ? false : stryMutAct_9fa48("183") ? true : stryMutAct_9fa48("182") ? hasRole(request.user, 'admin') : (stryCov_9fa48("182", "183", "184"), !hasRole(request.user, stryMutAct_9fa48("185") ? "" : (stryCov_9fa48("185"), 'admin')))) {
      if (stryMutAct_9fa48("186")) {
        {}
      } else {
        stryCov_9fa48("186");
        return reply.status(403).send(createAccessError(stryMutAct_9fa48("187") ? "" : (stryCov_9fa48("187"), 'ACCESS_DENIED'), stryMutAct_9fa48("188") ? "" : (stryCov_9fa48("188"), 'Apenas administradores podem acessar este recurso')));
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
  if (stryMutAct_9fa48("189")) {
    {}
  } else {
    stryCov_9fa48("189");
    if (stryMutAct_9fa48("192") ? false : stryMutAct_9fa48("191") ? true : stryMutAct_9fa48("190") ? hasRole(request.user, ['admin', 'gerente']) : (stryCov_9fa48("190", "191", "192"), !hasRole(request.user, stryMutAct_9fa48("193") ? [] : (stryCov_9fa48("193"), [stryMutAct_9fa48("194") ? "" : (stryCov_9fa48("194"), 'admin'), stryMutAct_9fa48("195") ? "" : (stryCov_9fa48("195"), 'gerente')])))) {
      if (stryMutAct_9fa48("196")) {
        {}
      } else {
        stryCov_9fa48("196");
        return reply.status(403).send(createAccessError(stryMutAct_9fa48("197") ? "" : (stryCov_9fa48("197"), 'ACCESS_DENIED'), stryMutAct_9fa48("198") ? "" : (stryCov_9fa48("198"), 'Apenas administradores ou gerentes podem acessar este recurso')));
      }
    }
  }
}

/**
 * Middleware para verificar acesso de gerente a uma barbearia específica
 * @param {import('fastify').FastifyRequest & { user: User }} request
 * @param {import('fastify').FastifyReply} reply
 */
async function checkGerenteBarbeariaAccess(request, reply) {
  if (stryMutAct_9fa48("199")) {
    {}
  } else {
    stryCov_9fa48("199");
    const {
      barbearia_id
    } = request.params;
    const userId = stryMutAct_9fa48("200") ? request.user.id : (stryCov_9fa48("200"), request.user?.id);
    if (stryMutAct_9fa48("203") ? false : stryMutAct_9fa48("202") ? true : stryMutAct_9fa48("201") ? barbearia_id : (stryCov_9fa48("201", "202", "203"), !barbearia_id)) {
      if (stryMutAct_9fa48("204")) {
        {}
      } else {
        stryCov_9fa48("204");
        return reply.status(400).send(createAccessError(stryMutAct_9fa48("205") ? "" : (stryCov_9fa48("205"), 'MISSING_PARAMETER'), stryMutAct_9fa48("206") ? "" : (stryCov_9fa48("206"), 'ID da barbearia é obrigatório')));
      }
    }
    if (stryMutAct_9fa48("209") ? false : stryMutAct_9fa48("208") ? true : stryMutAct_9fa48("207") ? userId : (stryCov_9fa48("207", "208", "209"), !userId)) {
      if (stryMutAct_9fa48("210")) {
        {}
      } else {
        stryCov_9fa48("210");
        return reply.status(401).send(createAccessError(stryMutAct_9fa48("211") ? "" : (stryCov_9fa48("211"), 'UNAUTHORIZED'), stryMutAct_9fa48("212") ? "" : (stryCov_9fa48("212"), 'Usuário não autenticado')));
      }
    }

    // Admin tem acesso total
    if (stryMutAct_9fa48("214") ? false : stryMutAct_9fa48("213") ? true : (stryCov_9fa48("213", "214"), hasRole(request.user, stryMutAct_9fa48("215") ? "" : (stryCov_9fa48("215"), 'admin')))) {
      if (stryMutAct_9fa48("216")) {
        {}
      } else {
        stryCov_9fa48("216");
        return;
      }
    }

    // Gerente precisa ser gerente da barbearia específica
    if (stryMutAct_9fa48("218") ? false : stryMutAct_9fa48("217") ? true : (stryCov_9fa48("217", "218"), hasRole(request.user, stryMutAct_9fa48("219") ? "" : (stryCov_9fa48("219"), 'gerente')))) {
      if (stryMutAct_9fa48("220")) {
        {}
      } else {
        stryCov_9fa48("220");
        const isGerente = await isGerenteDaBarbearia(userId, barbearia_id);
        if (stryMutAct_9fa48("223") ? false : stryMutAct_9fa48("222") ? true : stryMutAct_9fa48("221") ? isGerente : (stryCov_9fa48("221", "222", "223"), !isGerente)) {
          if (stryMutAct_9fa48("224")) {
            {}
          } else {
            stryCov_9fa48("224");
            return reply.status(403).send(createAccessError(stryMutAct_9fa48("225") ? "" : (stryCov_9fa48("225"), 'ACCESS_DENIED'), stryMutAct_9fa48("226") ? "" : (stryCov_9fa48("226"), 'Você não é gerente desta barbearia')));
          }
        }
        return;
      }
    }
    return reply.status(403).send(createAccessError(stryMutAct_9fa48("227") ? "" : (stryCov_9fa48("227"), 'ACCESS_DENIED'), stryMutAct_9fa48("228") ? "" : (stryCov_9fa48("228"), 'Acesso negado para este recurso')));
  }
}

/**
 * Middleware para verificar acesso de barbeiro a uma barbearia específica
 * @param {import('fastify').FastifyRequest & { user: User }} request
 * @param {import('fastify').FastifyReply} reply
 */
async function checkBarbeiroBarbeariaAccess(request, reply) {
  if (stryMutAct_9fa48("229")) {
    {}
  } else {
    stryCov_9fa48("229");
    const {
      barbearia_id
    } = request.params;
    const userId = stryMutAct_9fa48("230") ? request.user.id : (stryCov_9fa48("230"), request.user?.id);
    if (stryMutAct_9fa48("233") ? false : stryMutAct_9fa48("232") ? true : stryMutAct_9fa48("231") ? barbearia_id : (stryCov_9fa48("231", "232", "233"), !barbearia_id)) {
      if (stryMutAct_9fa48("234")) {
        {}
      } else {
        stryCov_9fa48("234");
        return reply.status(400).send(createAccessError(stryMutAct_9fa48("235") ? "" : (stryCov_9fa48("235"), 'MISSING_PARAMETER'), stryMutAct_9fa48("236") ? "" : (stryCov_9fa48("236"), 'ID da barbearia é obrigatório')));
      }
    }
    if (stryMutAct_9fa48("239") ? false : stryMutAct_9fa48("238") ? true : stryMutAct_9fa48("237") ? userId : (stryCov_9fa48("237", "238", "239"), !userId)) {
      if (stryMutAct_9fa48("240")) {
        {}
      } else {
        stryCov_9fa48("240");
        return reply.status(401).send(createAccessError(stryMutAct_9fa48("241") ? "" : (stryCov_9fa48("241"), 'UNAUTHORIZED'), stryMutAct_9fa48("242") ? "" : (stryCov_9fa48("242"), 'Usuário não autenticado')));
      }
    }

    // Admin tem acesso total
    if (stryMutAct_9fa48("244") ? false : stryMutAct_9fa48("243") ? true : (stryCov_9fa48("243", "244"), hasRole(request.user, stryMutAct_9fa48("245") ? "" : (stryCov_9fa48("245"), 'admin')))) {
      if (stryMutAct_9fa48("246")) {
        {}
      } else {
        stryCov_9fa48("246");
        return;
      }
    }

    // Gerente tem acesso total
    if (stryMutAct_9fa48("248") ? false : stryMutAct_9fa48("247") ? true : (stryCov_9fa48("247", "248"), hasRole(request.user, stryMutAct_9fa48("249") ? "" : (stryCov_9fa48("249"), 'gerente')))) {
      if (stryMutAct_9fa48("250")) {
        {}
      } else {
        stryCov_9fa48("250");
        return;
      }
    }

    // Barbeiro precisa trabalhar na barbearia
    if (stryMutAct_9fa48("252") ? false : stryMutAct_9fa48("251") ? true : (stryCov_9fa48("251", "252"), hasRole(request.user, stryMutAct_9fa48("253") ? "" : (stryCov_9fa48("253"), 'barbeiro')))) {
      if (stryMutAct_9fa48("254")) {
        {}
      } else {
        stryCov_9fa48("254");
        const barbeiroInfo = await isBarbeiroDaBarbearia(userId, barbearia_id);
        if (stryMutAct_9fa48("257") ? false : stryMutAct_9fa48("256") ? true : stryMutAct_9fa48("255") ? barbeiroInfo : (stryCov_9fa48("255", "256", "257"), !barbeiroInfo)) {
          if (stryMutAct_9fa48("258")) {
            {}
          } else {
            stryCov_9fa48("258");
            return reply.status(403).send(createAccessError(stryMutAct_9fa48("259") ? "" : (stryCov_9fa48("259"), 'ACCESS_DENIED'), stryMutAct_9fa48("260") ? "" : (stryCov_9fa48("260"), 'Você não trabalha nesta barbearia')));
          }
        }
        if (stryMutAct_9fa48("263") ? false : stryMutAct_9fa48("262") ? true : stryMutAct_9fa48("261") ? barbeiroInfo.ativo : (stryCov_9fa48("261", "262", "263"), !barbeiroInfo.ativo)) {
          if (stryMutAct_9fa48("264")) {
            {}
          } else {
            stryCov_9fa48("264");
            return reply.status(403).send(createAccessError(stryMutAct_9fa48("265") ? "" : (stryCov_9fa48("265"), 'ACCESS_DENIED'), stryMutAct_9fa48("266") ? "" : (stryCov_9fa48("266"), 'Você não está ativo nesta barbearia')));
          }
        }
        return;
      }
    }
    return reply.status(403).send(createAccessError(stryMutAct_9fa48("267") ? "" : (stryCov_9fa48("267"), 'ACCESS_DENIED'), stryMutAct_9fa48("268") ? "" : (stryCov_9fa48("268"), 'Acesso negado para este recurso')));
  }
}

/**
 * Factory function para criar middleware que verifica roles específicos
 * @param {string|string[]} allowedRoles - Role(s) permitido(s)
 * @returns {Function} Middleware function
 */
function requireRoles(allowedRoles) {
  if (stryMutAct_9fa48("269")) {
    {}
  } else {
    stryCov_9fa48("269");
    return async function (request, reply) {
      if (stryMutAct_9fa48("270")) {
        {}
      } else {
        stryCov_9fa48("270");
        if (stryMutAct_9fa48("273") ? false : stryMutAct_9fa48("272") ? true : stryMutAct_9fa48("271") ? hasRole(request.user, allowedRoles) : (stryCov_9fa48("271", "272", "273"), !hasRole(request.user, allowedRoles))) {
          if (stryMutAct_9fa48("274")) {
            {}
          } else {
            stryCov_9fa48("274");
            const rolesText = Array.isArray(allowedRoles) ? allowedRoles.join(stryMutAct_9fa48("275") ? "" : (stryCov_9fa48("275"), ' ou ')) : allowedRoles;
            return reply.status(403).send(createAccessError(stryMutAct_9fa48("276") ? "" : (stryCov_9fa48("276"), 'ACCESS_DENIED'), stryMutAct_9fa48("277") ? `` : (stryCov_9fa48("277"), `Apenas ${rolesText} podem acessar este recurso`)));
          }
        }
      }
    };
  }
}

/**
 * Factory function para criar middleware que verifica acesso a barbearia
 * @param {string|string[]} allowedRoles - Role(s) permitido(s)
 * @returns {Function} Middleware function
 */
function requireBarbeariaAccess(allowedRoles) {
  if (stryMutAct_9fa48("278")) {
    {}
  } else {
    stryCov_9fa48("278");
    return async function (request, reply) {
      if (stryMutAct_9fa48("279")) {
        {}
      } else {
        stryCov_9fa48("279");
        const {
          barbearia_id
        } = request.params;
        const userId = stryMutAct_9fa48("280") ? request.user.id : (stryCov_9fa48("280"), request.user?.id);
        if (stryMutAct_9fa48("283") ? false : stryMutAct_9fa48("282") ? true : stryMutAct_9fa48("281") ? barbearia_id : (stryCov_9fa48("281", "282", "283"), !barbearia_id)) {
          if (stryMutAct_9fa48("284")) {
            {}
          } else {
            stryCov_9fa48("284");
            return reply.status(400).send(createAccessError(stryMutAct_9fa48("285") ? "" : (stryCov_9fa48("285"), 'MISSING_PARAMETER'), stryMutAct_9fa48("286") ? "" : (stryCov_9fa48("286"), 'ID da barbearia é obrigatório')));
          }
        }
        if (stryMutAct_9fa48("289") ? false : stryMutAct_9fa48("288") ? true : stryMutAct_9fa48("287") ? userId : (stryCov_9fa48("287", "288", "289"), !userId)) {
          if (stryMutAct_9fa48("290")) {
            {}
          } else {
            stryCov_9fa48("290");
            return reply.status(401).send(createAccessError(stryMutAct_9fa48("291") ? "" : (stryCov_9fa48("291"), 'UNAUTHORIZED'), stryMutAct_9fa48("292") ? "" : (stryCov_9fa48("292"), 'Usuário não autenticado')));
          }
        }

        // Verificar se o usuário tem um dos roles permitidos
        if (stryMutAct_9fa48("295") ? false : stryMutAct_9fa48("294") ? true : stryMutAct_9fa48("293") ? hasRole(request.user, allowedRoles) : (stryCov_9fa48("293", "294", "295"), !hasRole(request.user, allowedRoles))) {
          if (stryMutAct_9fa48("296")) {
            {}
          } else {
            stryCov_9fa48("296");
            const rolesText = Array.isArray(allowedRoles) ? allowedRoles.join(stryMutAct_9fa48("297") ? "" : (stryCov_9fa48("297"), ' ou ')) : allowedRoles;
            return reply.status(403).send(createAccessError(stryMutAct_9fa48("298") ? "" : (stryCov_9fa48("298"), 'ACCESS_DENIED'), stryMutAct_9fa48("299") ? `` : (stryCov_9fa48("299"), `Apenas ${rolesText} podem acessar este recurso`)));
          }
        }

        // Admin tem acesso total
        if (stryMutAct_9fa48("301") ? false : stryMutAct_9fa48("300") ? true : (stryCov_9fa48("300", "301"), hasRole(request.user, stryMutAct_9fa48("302") ? "" : (stryCov_9fa48("302"), 'admin')))) {
          if (stryMutAct_9fa48("303")) {
            {}
          } else {
            stryCov_9fa48("303");
            return;
          }
        }

        // Gerente precisa ser gerente da barbearia
        if (stryMutAct_9fa48("305") ? false : stryMutAct_9fa48("304") ? true : (stryCov_9fa48("304", "305"), hasRole(request.user, stryMutAct_9fa48("306") ? "" : (stryCov_9fa48("306"), 'gerente')))) {
          if (stryMutAct_9fa48("307")) {
            {}
          } else {
            stryCov_9fa48("307");
            const isGerente = await isGerenteDaBarbearia(userId, barbearia_id);
            if (stryMutAct_9fa48("310") ? false : stryMutAct_9fa48("309") ? true : stryMutAct_9fa48("308") ? isGerente : (stryCov_9fa48("308", "309", "310"), !isGerente)) {
              if (stryMutAct_9fa48("311")) {
                {}
              } else {
                stryCov_9fa48("311");
                return reply.status(403).send(createAccessError(stryMutAct_9fa48("312") ? "" : (stryCov_9fa48("312"), 'ACCESS_DENIED'), stryMutAct_9fa48("313") ? "" : (stryCov_9fa48("313"), 'Você não é gerente desta barbearia')));
              }
            }
            return;
          }
        }

        // Barbeiro precisa trabalhar na barbearia
        if (stryMutAct_9fa48("315") ? false : stryMutAct_9fa48("314") ? true : (stryCov_9fa48("314", "315"), hasRole(request.user, stryMutAct_9fa48("316") ? "" : (stryCov_9fa48("316"), 'barbeiro')))) {
          if (stryMutAct_9fa48("317")) {
            {}
          } else {
            stryCov_9fa48("317");
            const barbeiroInfo = await isBarbeiroDaBarbearia(userId, barbearia_id);
            if (stryMutAct_9fa48("320") ? !barbeiroInfo && !barbeiroInfo.ativo : stryMutAct_9fa48("319") ? false : stryMutAct_9fa48("318") ? true : (stryCov_9fa48("318", "319", "320"), (stryMutAct_9fa48("321") ? barbeiroInfo : (stryCov_9fa48("321"), !barbeiroInfo)) || (stryMutAct_9fa48("322") ? barbeiroInfo.ativo : (stryCov_9fa48("322"), !barbeiroInfo.ativo)))) {
              if (stryMutAct_9fa48("323")) {
                {}
              } else {
                stryCov_9fa48("323");
                return reply.status(403).send(createAccessError(stryMutAct_9fa48("324") ? "" : (stryCov_9fa48("324"), 'ACCESS_DENIED'), stryMutAct_9fa48("325") ? "" : (stryCov_9fa48("325"), 'Você não trabalha nesta barbearia ou não está ativo')));
              }
            }
            return;
          }
        }
      }
    };
  }
}
module.exports = stryMutAct_9fa48("326") ? {} : (stryCov_9fa48("326"), {
  hasRole,
  isGerenteDaBarbearia,
  isBarbeiroDaBarbearia,
  createAccessError,
  checkBarbeiroRole,
  checkGerenteRole,
  checkAdminRole,
  checkAdminOrGerenteRole,
  checkGerenteBarbeariaAccess,
  checkBarbeiroBarbeariaAccess,
  requireRoles,
  requireBarbeariaAccess
});