/**
 * Middlewares de Validação de Requisições
 * 
 * Este módulo contém middlewares para validar dados de entrada
 * antes de processar as requisições.
 */
// @ts-nocheck


/**
 * Middleware para validar se barbearia_id está presente nos parâmetros
 * @param {Object} request - Request do Fastify
 * @param {Object} reply - Reply do Fastify
 */function stryNS_9fa48() {
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
function validateBarbeariaId(request, reply) {
  if (stryMutAct_9fa48("737")) {
    {}
  } else {
    stryCov_9fa48("737");
    const {
      barbearia_id
    } = request.params;
    if (stryMutAct_9fa48("740") ? false : stryMutAct_9fa48("739") ? true : stryMutAct_9fa48("738") ? barbearia_id : (stryCov_9fa48("738", "739", "740"), !barbearia_id)) {
      if (stryMutAct_9fa48("741")) {
        {}
      } else {
        stryCov_9fa48("741");
        return reply.status(400).send(stryMutAct_9fa48("742") ? {} : (stryCov_9fa48("742"), {
          success: stryMutAct_9fa48("743") ? true : (stryCov_9fa48("743"), false),
          error: stryMutAct_9fa48("744") ? "" : (stryCov_9fa48("744"), 'Parâmetro obrigatório'),
          message: stryMutAct_9fa48("745") ? "" : (stryCov_9fa48("745"), 'barbearia_id é obrigatório')
        }));
      }
    }

    // Validar se é um número válido
    const barbeariaId = parseInt(barbearia_id);
    if (stryMutAct_9fa48("748") ? isNaN(barbeariaId) && barbeariaId <= 0 : stryMutAct_9fa48("747") ? false : stryMutAct_9fa48("746") ? true : (stryCov_9fa48("746", "747", "748"), isNaN(barbeariaId) || (stryMutAct_9fa48("751") ? barbeariaId > 0 : stryMutAct_9fa48("750") ? barbeariaId < 0 : stryMutAct_9fa48("749") ? false : (stryCov_9fa48("749", "750", "751"), barbeariaId <= 0)))) {
      if (stryMutAct_9fa48("752")) {
        {}
      } else {
        stryCov_9fa48("752");
        return reply.status(400).send(stryMutAct_9fa48("753") ? {} : (stryCov_9fa48("753"), {
          success: stryMutAct_9fa48("754") ? true : (stryCov_9fa48("754"), false),
          error: stryMutAct_9fa48("755") ? "" : (stryCov_9fa48("755"), 'Parâmetro inválido'),
          message: stryMutAct_9fa48("756") ? "" : (stryCov_9fa48("756"), 'barbearia_id deve ser um número positivo')
        }));
      }
    }
  }
}

/**
 * Middleware para validar dados de entrada na fila
 * @param {Object} request - Request do Fastify
 * @param {Object} reply - Reply do Fastify
 */
function validateFilaEntry(request, reply) {
  if (stryMutAct_9fa48("757")) {
    {}
  } else {
    stryCov_9fa48("757");
    const {
      nome,
      telefone,
      barbearia_id
    } = request.body;
    if (stryMutAct_9fa48("760") ? (!nome || !telefone) && !barbearia_id : stryMutAct_9fa48("759") ? false : stryMutAct_9fa48("758") ? true : (stryCov_9fa48("758", "759", "760"), (stryMutAct_9fa48("762") ? !nome && !telefone : stryMutAct_9fa48("761") ? false : (stryCov_9fa48("761", "762"), (stryMutAct_9fa48("763") ? nome : (stryCov_9fa48("763"), !nome)) || (stryMutAct_9fa48("764") ? telefone : (stryCov_9fa48("764"), !telefone)))) || (stryMutAct_9fa48("765") ? barbearia_id : (stryCov_9fa48("765"), !barbearia_id)))) {
      if (stryMutAct_9fa48("766")) {
        {}
      } else {
        stryCov_9fa48("766");
        return reply.status(400).send(stryMutAct_9fa48("767") ? {} : (stryCov_9fa48("767"), {
          success: stryMutAct_9fa48("768") ? true : (stryCov_9fa48("768"), false),
          error: stryMutAct_9fa48("769") ? "" : (stryCov_9fa48("769"), 'Dados obrigatórios'),
          message: stryMutAct_9fa48("770") ? "" : (stryCov_9fa48("770"), 'nome, telefone e barbearia_id são obrigatórios')
        }));
      }
    }

    // Validar nome
    if (stryMutAct_9fa48("773") ? typeof nome !== 'string' && nome.trim().length < 2 : stryMutAct_9fa48("772") ? false : stryMutAct_9fa48("771") ? true : (stryCov_9fa48("771", "772", "773"), (stryMutAct_9fa48("775") ? typeof nome === 'string' : stryMutAct_9fa48("774") ? false : (stryCov_9fa48("774", "775"), typeof nome !== (stryMutAct_9fa48("776") ? "" : (stryCov_9fa48("776"), 'string')))) || (stryMutAct_9fa48("779") ? nome.trim().length >= 2 : stryMutAct_9fa48("778") ? nome.trim().length <= 2 : stryMutAct_9fa48("777") ? false : (stryCov_9fa48("777", "778", "779"), (stryMutAct_9fa48("780") ? nome.length : (stryCov_9fa48("780"), nome.trim().length)) < 2)))) {
      if (stryMutAct_9fa48("781")) {
        {}
      } else {
        stryCov_9fa48("781");
        return reply.status(400).send(stryMutAct_9fa48("782") ? {} : (stryCov_9fa48("782"), {
          success: stryMutAct_9fa48("783") ? true : (stryCov_9fa48("783"), false),
          error: stryMutAct_9fa48("784") ? "" : (stryCov_9fa48("784"), 'Nome inválido'),
          message: stryMutAct_9fa48("785") ? "" : (stryCov_9fa48("785"), 'Nome deve ter pelo menos 2 caracteres')
        }));
      }
    }

    // Validar telefone (formato básico)
    const telefoneRegex = stryMutAct_9fa48("791") ? /^[\d\S\-\+\(\)]+$/ : stryMutAct_9fa48("790") ? /^[\D\s\-\+\(\)]+$/ : stryMutAct_9fa48("789") ? /^[^\d\s\-\+\(\)]+$/ : stryMutAct_9fa48("788") ? /^[\d\s\-\+\(\)]$/ : stryMutAct_9fa48("787") ? /^[\d\s\-\+\(\)]+/ : stryMutAct_9fa48("786") ? /[\d\s\-\+\(\)]+$/ : (stryCov_9fa48("786", "787", "788", "789", "790", "791"), /^[\d\s\-\+\(\)]+$/);
    if (stryMutAct_9fa48("794") ? !telefoneRegex.test(telefone) && telefone.replace(/\D/g, '').length < 10 : stryMutAct_9fa48("793") ? false : stryMutAct_9fa48("792") ? true : (stryCov_9fa48("792", "793", "794"), (stryMutAct_9fa48("795") ? telefoneRegex.test(telefone) : (stryCov_9fa48("795"), !telefoneRegex.test(telefone))) || (stryMutAct_9fa48("798") ? telefone.replace(/\D/g, '').length >= 10 : stryMutAct_9fa48("797") ? telefone.replace(/\D/g, '').length <= 10 : stryMutAct_9fa48("796") ? false : (stryCov_9fa48("796", "797", "798"), telefone.replace(stryMutAct_9fa48("799") ? /\d/g : (stryCov_9fa48("799"), /\D/g), stryMutAct_9fa48("800") ? "Stryker was here!" : (stryCov_9fa48("800"), '')).length < 10)))) {
      if (stryMutAct_9fa48("801")) {
        {}
      } else {
        stryCov_9fa48("801");
        return reply.status(400).send(stryMutAct_9fa48("802") ? {} : (stryCov_9fa48("802"), {
          success: stryMutAct_9fa48("803") ? true : (stryCov_9fa48("803"), false),
          error: stryMutAct_9fa48("804") ? "" : (stryCov_9fa48("804"), 'Telefone inválido'),
          message: stryMutAct_9fa48("805") ? "" : (stryCov_9fa48("805"), 'Telefone deve ter pelo menos 10 dígitos')
        }));
      }
    }

    // Validar barbearia_id
    const barbeariaId = parseInt(barbearia_id);
    if (stryMutAct_9fa48("808") ? isNaN(barbeariaId) && barbeariaId <= 0 : stryMutAct_9fa48("807") ? false : stryMutAct_9fa48("806") ? true : (stryCov_9fa48("806", "807", "808"), isNaN(barbeariaId) || (stryMutAct_9fa48("811") ? barbeariaId > 0 : stryMutAct_9fa48("810") ? barbeariaId < 0 : stryMutAct_9fa48("809") ? false : (stryCov_9fa48("809", "810", "811"), barbeariaId <= 0)))) {
      if (stryMutAct_9fa48("812")) {
        {}
      } else {
        stryCov_9fa48("812");
        return reply.status(400).send(stryMutAct_9fa48("813") ? {} : (stryCov_9fa48("813"), {
          success: stryMutAct_9fa48("814") ? true : (stryCov_9fa48("814"), false),
          error: stryMutAct_9fa48("815") ? "" : (stryCov_9fa48("815"), 'Barbearia inválida'),
          message: stryMutAct_9fa48("816") ? "" : (stryCov_9fa48("816"), 'barbearia_id deve ser um número positivo')
        }));
      }
    }
  }
}

/**
 * Middleware para validar dados de usuário
 * @param {Object} request - Request do Fastify
 * @param {Object} reply - Reply do Fastify
 */
function validateUserData(request, reply) {
  if (stryMutAct_9fa48("817")) {
    {}
  } else {
    stryCov_9fa48("817");
    const {
      nome,
      email,
      role
    } = request.body;
    if (stryMutAct_9fa48("820") ? nome === undefined : stryMutAct_9fa48("819") ? false : stryMutAct_9fa48("818") ? true : (stryCov_9fa48("818", "819", "820"), nome !== undefined)) {
      if (stryMutAct_9fa48("821")) {
        {}
      } else {
        stryCov_9fa48("821");
        if (stryMutAct_9fa48("824") ? typeof nome !== 'string' && nome.trim().length < 2 : stryMutAct_9fa48("823") ? false : stryMutAct_9fa48("822") ? true : (stryCov_9fa48("822", "823", "824"), (stryMutAct_9fa48("826") ? typeof nome === 'string' : stryMutAct_9fa48("825") ? false : (stryCov_9fa48("825", "826"), typeof nome !== (stryMutAct_9fa48("827") ? "" : (stryCov_9fa48("827"), 'string')))) || (stryMutAct_9fa48("830") ? nome.trim().length >= 2 : stryMutAct_9fa48("829") ? nome.trim().length <= 2 : stryMutAct_9fa48("828") ? false : (stryCov_9fa48("828", "829", "830"), (stryMutAct_9fa48("831") ? nome.length : (stryCov_9fa48("831"), nome.trim().length)) < 2)))) {
          if (stryMutAct_9fa48("832")) {
            {}
          } else {
            stryCov_9fa48("832");
            return reply.status(400).send(stryMutAct_9fa48("833") ? {} : (stryCov_9fa48("833"), {
              success: stryMutAct_9fa48("834") ? true : (stryCov_9fa48("834"), false),
              error: stryMutAct_9fa48("835") ? "" : (stryCov_9fa48("835"), 'Nome inválido'),
              message: stryMutAct_9fa48("836") ? "" : (stryCov_9fa48("836"), 'Nome deve ter pelo menos 2 caracteres')
            }));
          }
        }
      }
    }
    if (stryMutAct_9fa48("839") ? email === undefined : stryMutAct_9fa48("838") ? false : stryMutAct_9fa48("837") ? true : (stryCov_9fa48("837", "838", "839"), email !== undefined)) {
      if (stryMutAct_9fa48("840")) {
        {}
      } else {
        stryCov_9fa48("840");
        const emailRegex = stryMutAct_9fa48("851") ? /^[^\s@]+@[^\s@]+\.[^\S@]+$/ : stryMutAct_9fa48("850") ? /^[^\s@]+@[^\s@]+\.[\s@]+$/ : stryMutAct_9fa48("849") ? /^[^\s@]+@[^\s@]+\.[^\s@]$/ : stryMutAct_9fa48("848") ? /^[^\s@]+@[^\S@]+\.[^\s@]+$/ : stryMutAct_9fa48("847") ? /^[^\s@]+@[\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("846") ? /^[^\s@]+@[^\s@]\.[^\s@]+$/ : stryMutAct_9fa48("845") ? /^[^\S@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("844") ? /^[\s@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("843") ? /^[^\s@]@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("842") ? /^[^\s@]+@[^\s@]+\.[^\s@]+/ : stryMutAct_9fa48("841") ? /[^\s@]+@[^\s@]+\.[^\s@]+$/ : (stryCov_9fa48("841", "842", "843", "844", "845", "846", "847", "848", "849", "850", "851"), /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        if (stryMutAct_9fa48("854") ? false : stryMutAct_9fa48("853") ? true : stryMutAct_9fa48("852") ? emailRegex.test(email) : (stryCov_9fa48("852", "853", "854"), !emailRegex.test(email))) {
          if (stryMutAct_9fa48("855")) {
            {}
          } else {
            stryCov_9fa48("855");
            return reply.status(400).send(stryMutAct_9fa48("856") ? {} : (stryCov_9fa48("856"), {
              success: stryMutAct_9fa48("857") ? true : (stryCov_9fa48("857"), false),
              error: stryMutAct_9fa48("858") ? "" : (stryCov_9fa48("858"), 'Email inválido'),
              message: stryMutAct_9fa48("859") ? "" : (stryCov_9fa48("859"), 'Email deve ter um formato válido')
            }));
          }
        }
      }
    }
    if (stryMutAct_9fa48("862") ? role === undefined : stryMutAct_9fa48("861") ? false : stryMutAct_9fa48("860") ? true : (stryCov_9fa48("860", "861", "862"), role !== undefined)) {
      if (stryMutAct_9fa48("863")) {
        {}
      } else {
        stryCov_9fa48("863");
        const rolesValidos = stryMutAct_9fa48("864") ? [] : (stryCov_9fa48("864"), [stryMutAct_9fa48("865") ? "" : (stryCov_9fa48("865"), 'admin'), stryMutAct_9fa48("866") ? "" : (stryCov_9fa48("866"), 'gerente'), stryMutAct_9fa48("867") ? "" : (stryCov_9fa48("867"), 'barbeiro')]);
        if (stryMutAct_9fa48("870") ? false : stryMutAct_9fa48("869") ? true : stryMutAct_9fa48("868") ? rolesValidos.includes(role) : (stryCov_9fa48("868", "869", "870"), !rolesValidos.includes(role))) {
          if (stryMutAct_9fa48("871")) {
            {}
          } else {
            stryCov_9fa48("871");
            return reply.status(400).send(stryMutAct_9fa48("872") ? {} : (stryCov_9fa48("872"), {
              success: stryMutAct_9fa48("873") ? true : (stryCov_9fa48("873"), false),
              error: stryMutAct_9fa48("874") ? "" : (stryCov_9fa48("874"), 'Role inválido'),
              message: stryMutAct_9fa48("875") ? `` : (stryCov_9fa48("875"), `Role deve ser um dos seguintes: ${rolesValidos.join(stryMutAct_9fa48("876") ? "" : (stryCov_9fa48("876"), ', '))}`)
            }));
          }
        }
      }
    }
  }
}

/**
 * Middleware para validar dados de ativação/desativação de barbeiro
 * @param {Object} request - Request do Fastify
 * @param {Object} reply - Reply do Fastify
 */
function validateBarbeiroAction(request, reply) {
  if (stryMutAct_9fa48("877")) {
    {}
  } else {
    stryCov_9fa48("877");
    const {
      user_id,
      barbearia_id
    } = request.body;
    if (stryMutAct_9fa48("880") ? !user_id && !barbearia_id : stryMutAct_9fa48("879") ? false : stryMutAct_9fa48("878") ? true : (stryCov_9fa48("878", "879", "880"), (stryMutAct_9fa48("881") ? user_id : (stryCov_9fa48("881"), !user_id)) || (stryMutAct_9fa48("882") ? barbearia_id : (stryCov_9fa48("882"), !barbearia_id)))) {
      if (stryMutAct_9fa48("883")) {
        {}
      } else {
        stryCov_9fa48("883");
        return reply.status(400).send(stryMutAct_9fa48("884") ? {} : (stryCov_9fa48("884"), {
          success: stryMutAct_9fa48("885") ? true : (stryCov_9fa48("885"), false),
          error: stryMutAct_9fa48("886") ? "" : (stryCov_9fa48("886"), 'Dados obrigatórios'),
          message: stryMutAct_9fa48("887") ? "" : (stryCov_9fa48("887"), 'user_id e barbearia_id são obrigatórios')
        }));
      }
    }

    // Validar user_id (UUID)
    const uuidRegex = stryMutAct_9fa48("901") ? /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[^0-9a-f]{12}$/i : stryMutAct_9fa48("900") ? /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]$/i : stryMutAct_9fa48("899") ? /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][^0-9a-f]{3}-[0-9a-f]{12}$/i : stryMutAct_9fa48("898") ? /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]-[0-9a-f]{12}$/i : stryMutAct_9fa48("897") ? /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[^89ab][0-9a-f]{3}-[0-9a-f]{12}$/i : stryMutAct_9fa48("896") ? /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][^0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i : stryMutAct_9fa48("895") ? /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i : stryMutAct_9fa48("894") ? /^[0-9a-f]{8}-[0-9a-f]{4}-[^1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i : stryMutAct_9fa48("893") ? /^[0-9a-f]{8}-[^0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i : stryMutAct_9fa48("892") ? /^[0-9a-f]{8}-[0-9a-f]-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i : stryMutAct_9fa48("891") ? /^[^0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i : stryMutAct_9fa48("890") ? /^[0-9a-f]-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i : stryMutAct_9fa48("889") ? /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i : stryMutAct_9fa48("888") ? /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i : (stryCov_9fa48("888", "889", "890", "891", "892", "893", "894", "895", "896", "897", "898", "899", "900", "901"), /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    if (stryMutAct_9fa48("904") ? false : stryMutAct_9fa48("903") ? true : stryMutAct_9fa48("902") ? uuidRegex.test(user_id) : (stryCov_9fa48("902", "903", "904"), !uuidRegex.test(user_id))) {
      if (stryMutAct_9fa48("905")) {
        {}
      } else {
        stryCov_9fa48("905");
        return reply.status(400).send(stryMutAct_9fa48("906") ? {} : (stryCov_9fa48("906"), {
          success: stryMutAct_9fa48("907") ? true : (stryCov_9fa48("907"), false),
          error: stryMutAct_9fa48("908") ? "" : (stryCov_9fa48("908"), 'User ID inválido'),
          message: stryMutAct_9fa48("909") ? "" : (stryCov_9fa48("909"), 'user_id deve ser um UUID válido')
        }));
      }
    }

    // Validar barbearia_id
    const barbeariaId = parseInt(barbearia_id);
    if (stryMutAct_9fa48("912") ? isNaN(barbeariaId) && barbeariaId <= 0 : stryMutAct_9fa48("911") ? false : stryMutAct_9fa48("910") ? true : (stryCov_9fa48("910", "911", "912"), isNaN(barbeariaId) || (stryMutAct_9fa48("915") ? barbeariaId > 0 : stryMutAct_9fa48("914") ? barbeariaId < 0 : stryMutAct_9fa48("913") ? false : (stryCov_9fa48("913", "914", "915"), barbeariaId <= 0)))) {
      if (stryMutAct_9fa48("916")) {
        {}
      } else {
        stryCov_9fa48("916");
        return reply.status(400).send(stryMutAct_9fa48("917") ? {} : (stryCov_9fa48("917"), {
          success: stryMutAct_9fa48("918") ? true : (stryCov_9fa48("918"), false),
          error: stryMutAct_9fa48("919") ? "" : (stryCov_9fa48("919"), 'Barbearia inválida'),
          message: stryMutAct_9fa48("920") ? "" : (stryCov_9fa48("920"), 'barbearia_id deve ser um número positivo')
        }));
      }
    }
  }
}

/**
 * Factory function para criar middleware de validação de campos obrigatórios
 * @param {string[]} requiredFields - Campos obrigatórios
 * @returns {Function} Middleware function
 */
function requireFields(requiredFields) {
  if (stryMutAct_9fa48("921")) {
    {}
  } else {
    stryCov_9fa48("921");
    return function (request, reply) {
      if (stryMutAct_9fa48("922")) {
        {}
      } else {
        stryCov_9fa48("922");
        const missingFields = stryMutAct_9fa48("923") ? requiredFields : (stryCov_9fa48("923"), requiredFields.filter(field => {
          if (stryMutAct_9fa48("924")) {
            {}
          } else {
            stryCov_9fa48("924");
            const value = request.body[field];
            return stryMutAct_9fa48("927") ? (value === undefined || value === null) && value === '' : stryMutAct_9fa48("926") ? false : stryMutAct_9fa48("925") ? true : (stryCov_9fa48("925", "926", "927"), (stryMutAct_9fa48("929") ? value === undefined && value === null : stryMutAct_9fa48("928") ? false : (stryCov_9fa48("928", "929"), (stryMutAct_9fa48("931") ? value !== undefined : stryMutAct_9fa48("930") ? false : (stryCov_9fa48("930", "931"), value === undefined)) || (stryMutAct_9fa48("933") ? value !== null : stryMutAct_9fa48("932") ? false : (stryCov_9fa48("932", "933"), value === null)))) || (stryMutAct_9fa48("935") ? value !== '' : stryMutAct_9fa48("934") ? false : (stryCov_9fa48("934", "935"), value === (stryMutAct_9fa48("936") ? "Stryker was here!" : (stryCov_9fa48("936"), '')))));
          }
        }));
        if (stryMutAct_9fa48("940") ? missingFields.length <= 0 : stryMutAct_9fa48("939") ? missingFields.length >= 0 : stryMutAct_9fa48("938") ? false : stryMutAct_9fa48("937") ? true : (stryCov_9fa48("937", "938", "939", "940"), missingFields.length > 0)) {
          if (stryMutAct_9fa48("941")) {
            {}
          } else {
            stryCov_9fa48("941");
            return reply.status(400).send(stryMutAct_9fa48("942") ? {} : (stryCov_9fa48("942"), {
              success: stryMutAct_9fa48("943") ? true : (stryCov_9fa48("943"), false),
              error: stryMutAct_9fa48("944") ? "" : (stryCov_9fa48("944"), 'Campos obrigatórios'),
              message: stryMutAct_9fa48("945") ? `` : (stryCov_9fa48("945"), `Os seguintes campos são obrigatórios: ${missingFields.join(stryMutAct_9fa48("946") ? "" : (stryCov_9fa48("946"), ', '))}`)
            }));
          }
        }
      }
    };
  }
}
module.exports = stryMutAct_9fa48("947") ? {} : (stryCov_9fa48("947"), {
  validateBarbeariaId,
  validateFilaEntry,
  validateUserData,
  validateBarbeiroAction,
  requireFields
});