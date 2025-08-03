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
const jwt = require('jsonwebtoken');
const {
  supabase
} = require('../../config/database');

/**
 * Middleware de autenticação JWT
 * Verifica se o token é válido e adiciona o usuário ao request
 * 
 * @param {Object} request - Request do Fastify
 * @param {Object} reply - Reply do Fastify
 */
async function authenticate(request, reply) {
  if (stryMutAct_9fa48("327")) {
    {}
  } else {
    stryCov_9fa48("327");
    try {
      if (stryMutAct_9fa48("328")) {
        {}
      } else {
        stryCov_9fa48("328");
        const authHeader = request.headers.authorization;
        if (stryMutAct_9fa48("331") ? !authHeader && !authHeader.startsWith('Bearer ') : stryMutAct_9fa48("330") ? false : stryMutAct_9fa48("329") ? true : (stryCov_9fa48("329", "330", "331"), (stryMutAct_9fa48("332") ? authHeader : (stryCov_9fa48("332"), !authHeader)) || (stryMutAct_9fa48("333") ? authHeader.startsWith('Bearer ') : (stryCov_9fa48("333"), !(stryMutAct_9fa48("334") ? authHeader.endsWith('Bearer ') : (stryCov_9fa48("334"), authHeader.startsWith(stryMutAct_9fa48("335") ? "" : (stryCov_9fa48("335"), 'Bearer ')))))))) {
          if (stryMutAct_9fa48("336")) {
            {}
          } else {
            stryCov_9fa48("336");
            return reply.status(401).send(stryMutAct_9fa48("337") ? {} : (stryCov_9fa48("337"), {
              success: stryMutAct_9fa48("338") ? true : (stryCov_9fa48("338"), false),
              error: stryMutAct_9fa48("339") ? "" : (stryCov_9fa48("339"), 'Token de autenticação não fornecido')
            }));
          }
        }
        const token = stryMutAct_9fa48("340") ? authHeader : (stryCov_9fa48("340"), authHeader.substring(7)); // Remove 'Bearer '

        // Verificar token JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Buscar usuário no banco para garantir que ainda existe e está ativo
        const {
          data: user,
          error: userError
        } = await supabase.from(stryMutAct_9fa48("341") ? "" : (stryCov_9fa48("341"), 'users')).select(stryMutAct_9fa48("342") ? "" : (stryCov_9fa48("342"), 'id, email, nome, role, ativo')).eq(stryMutAct_9fa48("343") ? "" : (stryCov_9fa48("343"), 'id'), decoded.userId).eq(stryMutAct_9fa48("344") ? "" : (stryCov_9fa48("344"), 'ativo'), stryMutAct_9fa48("345") ? false : (stryCov_9fa48("345"), true)).single();
        if (stryMutAct_9fa48("348") ? userError && !user : stryMutAct_9fa48("347") ? false : stryMutAct_9fa48("346") ? true : (stryCov_9fa48("346", "347", "348"), userError || (stryMutAct_9fa48("349") ? user : (stryCov_9fa48("349"), !user)))) {
          if (stryMutAct_9fa48("350")) {
            {}
          } else {
            stryCov_9fa48("350");
            return reply.status(401).send(stryMutAct_9fa48("351") ? {} : (stryCov_9fa48("351"), {
              success: stryMutAct_9fa48("352") ? true : (stryCov_9fa48("352"), false),
              error: stryMutAct_9fa48("353") ? "" : (stryCov_9fa48("353"), 'Usuário não encontrado ou inativo')
            }));
          }
        }

        // Adicionar usuário ao request para uso posterior
        request.user = stryMutAct_9fa48("354") ? {} : (stryCov_9fa48("354"), {
          id: user.id,
          email: user.email,
          nome: user.nome,
          role: user.role
        });
      }
    } catch (error) {
      if (stryMutAct_9fa48("355")) {
        {}
      } else {
        stryCov_9fa48("355");
        console.error(stryMutAct_9fa48("356") ? "" : (stryCov_9fa48("356"), 'Erro na autenticação:'), error);
        if (stryMutAct_9fa48("359") ? error.name !== 'JsonWebTokenError' : stryMutAct_9fa48("358") ? false : stryMutAct_9fa48("357") ? true : (stryCov_9fa48("357", "358", "359"), error.name === (stryMutAct_9fa48("360") ? "" : (stryCov_9fa48("360"), 'JsonWebTokenError')))) {
          if (stryMutAct_9fa48("361")) {
            {}
          } else {
            stryCov_9fa48("361");
            return reply.status(401).send(stryMutAct_9fa48("362") ? {} : (stryCov_9fa48("362"), {
              success: stryMutAct_9fa48("363") ? true : (stryCov_9fa48("363"), false),
              error: stryMutAct_9fa48("364") ? "" : (stryCov_9fa48("364"), 'Token inválido')
            }));
          }
        }
        if (stryMutAct_9fa48("367") ? error.name !== 'TokenExpiredError' : stryMutAct_9fa48("366") ? false : stryMutAct_9fa48("365") ? true : (stryCov_9fa48("365", "366", "367"), error.name === (stryMutAct_9fa48("368") ? "" : (stryCov_9fa48("368"), 'TokenExpiredError')))) {
          if (stryMutAct_9fa48("369")) {
            {}
          } else {
            stryCov_9fa48("369");
            return reply.status(401).send(stryMutAct_9fa48("370") ? {} : (stryCov_9fa48("370"), {
              success: stryMutAct_9fa48("371") ? true : (stryCov_9fa48("371"), false),
              error: stryMutAct_9fa48("372") ? "" : (stryCov_9fa48("372"), 'Token expirado')
            }));
          }
        }
        return reply.status(500).send(stryMutAct_9fa48("373") ? {} : (stryCov_9fa48("373"), {
          success: stryMutAct_9fa48("374") ? true : (stryCov_9fa48("374"), false),
          error: stryMutAct_9fa48("375") ? "" : (stryCov_9fa48("375"), 'Erro interno do servidor')
        }));
      }
    }
  }
}
module.exports = authenticate;