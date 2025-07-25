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

// Middleware para verificar se o usuário tem acesso à barbearia
async function checkBarbeariaAccess(request, reply) {
  if (stryMutAct_9fa48("377")) {
    {}
  } else {
    stryCov_9fa48("377");
    const {
      barbeariaId
    } = request.params;
    const userId = request.user.id;
    const userRole = request.user.role;
    try {
      if (stryMutAct_9fa48("378")) {
        {}
      } else {
        stryCov_9fa48("378");
        // Admin pode acessar qualquer barbearia
        if (stryMutAct_9fa48("381") ? userRole !== 'admin' : stryMutAct_9fa48("380") ? false : stryMutAct_9fa48("379") ? true : (stryCov_9fa48("379", "380", "381"), userRole === (stryMutAct_9fa48("382") ? "" : (stryCov_9fa48("382"), 'admin')))) {
          if (stryMutAct_9fa48("383")) {
            {}
          } else {
            stryCov_9fa48("383");
            return;
          }
        }

        // Verificar se o usuário tem acesso à barbearia
        const {
          data: barbeiroBarbearia,
          error
        } = await supabase.from(stryMutAct_9fa48("384") ? "" : (stryCov_9fa48("384"), 'barbeiros_barbearias')).select(stryMutAct_9fa48("385") ? "" : (stryCov_9fa48("385"), '*')).eq(stryMutAct_9fa48("386") ? "" : (stryCov_9fa48("386"), 'user_id'), userId).eq(stryMutAct_9fa48("387") ? "" : (stryCov_9fa48("387"), 'barbearia_id'), barbeariaId).eq(stryMutAct_9fa48("388") ? "" : (stryCov_9fa48("388"), 'ativo'), stryMutAct_9fa48("389") ? false : (stryCov_9fa48("389"), true)).single();
        if (stryMutAct_9fa48("392") ? error && !barbeiroBarbearia : stryMutAct_9fa48("391") ? false : stryMutAct_9fa48("390") ? true : (stryCov_9fa48("390", "391", "392"), error || (stryMutAct_9fa48("393") ? barbeiroBarbearia : (stryCov_9fa48("393"), !barbeiroBarbearia)))) {
          if (stryMutAct_9fa48("394")) {
            {}
          } else {
            stryCov_9fa48("394");
            return reply.status(403).send(stryMutAct_9fa48("395") ? {} : (stryCov_9fa48("395"), {
              error: stryMutAct_9fa48("396") ? "" : (stryCov_9fa48("396"), 'Acesso negado'),
              message: stryMutAct_9fa48("397") ? "" : (stryCov_9fa48("397"), 'Você não tem acesso a esta barbearia')
            }));
          }
        }
      }
    } catch (error) {
      if (stryMutAct_9fa48("398")) {
        {}
      } else {
        stryCov_9fa48("398");
        return reply.status(500).send(stryMutAct_9fa48("399") ? {} : (stryCov_9fa48("399"), {
          error: stryMutAct_9fa48("400") ? "" : (stryCov_9fa48("400"), 'Erro interno'),
          message: stryMutAct_9fa48("401") ? "" : (stryCov_9fa48("401"), 'Erro ao verificar acesso à barbearia')
        }));
      }
    }
  }
}

// Middleware para verificar se o barbeiro está ativo
async function checkBarbeiroAtivo(request, reply) {
  if (stryMutAct_9fa48("402")) {
    {}
  } else {
    stryCov_9fa48("402");
    const {
      barbeariaId
    } = request.params;
    const userId = request.user.id;
    try {
      if (stryMutAct_9fa48("403")) {
        {}
      } else {
        stryCov_9fa48("403");
        const {
          data: barbeiroBarbearia,
          error
        } = await supabase.from(stryMutAct_9fa48("404") ? "" : (stryCov_9fa48("404"), 'barbeiros_barbearias')).select(stryMutAct_9fa48("405") ? "" : (stryCov_9fa48("405"), 'disponivel, ativo')).eq(stryMutAct_9fa48("406") ? "" : (stryCov_9fa48("406"), 'user_id'), userId).eq(stryMutAct_9fa48("407") ? "" : (stryCov_9fa48("407"), 'barbearia_id'), barbeariaId).single();
        if (stryMutAct_9fa48("410") ? error && !barbeiroBarbearia : stryMutAct_9fa48("409") ? false : stryMutAct_9fa48("408") ? true : (stryCov_9fa48("408", "409", "410"), error || (stryMutAct_9fa48("411") ? barbeiroBarbearia : (stryCov_9fa48("411"), !barbeiroBarbearia)))) {
          if (stryMutAct_9fa48("412")) {
            {}
          } else {
            stryCov_9fa48("412");
            return reply.status(404).send(stryMutAct_9fa48("413") ? {} : (stryCov_9fa48("413"), {
              error: stryMutAct_9fa48("414") ? "" : (stryCov_9fa48("414"), 'Barbeiro não encontrado'),
              message: stryMutAct_9fa48("415") ? "" : (stryCov_9fa48("415"), 'Barbeiro não encontrado nesta barbearia')
            }));
          }
        }
        if (stryMutAct_9fa48("418") ? false : stryMutAct_9fa48("417") ? true : stryMutAct_9fa48("416") ? barbeiroBarbearia.ativo : (stryCov_9fa48("416", "417", "418"), !barbeiroBarbearia.ativo)) {
          if (stryMutAct_9fa48("419")) {
            {}
          } else {
            stryCov_9fa48("419");
            return reply.status(403).send(stryMutAct_9fa48("420") ? {} : (stryCov_9fa48("420"), {
              error: stryMutAct_9fa48("421") ? "" : (stryCov_9fa48("421"), 'Barbeiro inativo'),
              message: stryMutAct_9fa48("422") ? "" : (stryCov_9fa48("422"), 'Você não está ativo nesta barbearia')
            }));
          }
        }

        // Adicionar informações do barbeiro ao request
        request.barbeiroInfo = barbeiroBarbearia;
      }
    } catch (error) {
      if (stryMutAct_9fa48("423")) {
        {}
      } else {
        stryCov_9fa48("423");
        return reply.status(500).send(stryMutAct_9fa48("424") ? {} : (stryCov_9fa48("424"), {
          error: stryMutAct_9fa48("425") ? "" : (stryCov_9fa48("425"), 'Erro interno'),
          message: stryMutAct_9fa48("426") ? "" : (stryCov_9fa48("426"), 'Erro ao verificar status do barbeiro')
        }));
      }
    }
  }
}
module.exports = stryMutAct_9fa48("427") ? {} : (stryCov_9fa48("427"), {
  checkBarbeariaAccess,
  checkBarbeiroAtivo
});