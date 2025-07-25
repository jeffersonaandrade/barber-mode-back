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
const bcrypt = require('bcrypt');

// Tentar importar Supabase, mas não falhar se não estiver configurado
let supabase = null;
let supabaseAdmin = null;
try {
  if (stryMutAct_9fa48("0")) {
    {}
  } else {
    stryCov_9fa48("0");
    const dbConfig = require('../config/database');
    supabase = dbConfig.supabase;
    supabaseAdmin = dbConfig.supabaseAdmin;
  }
} catch (error) {
  if (stryMutAct_9fa48("1")) {
    {}
  } else {
    stryCov_9fa48("1");
    console.log(stryMutAct_9fa48("2") ? "" : (stryCov_9fa48("2"), '⚠️ Supabase não configurado, usando dados simulados'));
  }
}
class AuthService {
  constructor(fastify) {
    if (stryMutAct_9fa48("3")) {
      {}
    } else {
      stryCov_9fa48("3");
      this.fastify = fastify;

      // Dados simulados para desenvolvimento
      this.mockUsers = stryMutAct_9fa48("4") ? [] : (stryCov_9fa48("4"), [stryMutAct_9fa48("5") ? {} : (stryCov_9fa48("5"), {
        id: stryMutAct_9fa48("6") ? "" : (stryCov_9fa48("6"), 'admin-001'),
        email: stryMutAct_9fa48("7") ? "" : (stryCov_9fa48("7"), 'admin@lucasbarbearia.com'),
        password_hash: stryMutAct_9fa48("8") ? "" : (stryCov_9fa48("8"), '$2b$12$IPjUL7HPYFXwsvKsZ1PtbuAq5ldfspojv/RAfXeHrQO9dI.iwJMAe'),
        // senha: admin123
        nome: stryMutAct_9fa48("9") ? "" : (stryCov_9fa48("9"), 'Administrador'),
        telefone: stryMutAct_9fa48("10") ? "" : (stryCov_9fa48("10"), '(11) 99999-9999'),
        role: stryMutAct_9fa48("11") ? "" : (stryCov_9fa48("11"), 'admin'),
        active: stryMutAct_9fa48("12") ? false : (stryCov_9fa48("12"), true),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }), stryMutAct_9fa48("13") ? {} : (stryCov_9fa48("13"), {
        id: stryMutAct_9fa48("14") ? "" : (stryCov_9fa48("14"), 'gerente-001'),
        email: stryMutAct_9fa48("15") ? "" : (stryCov_9fa48("15"), 'gerente@lucasbarbearia.com'),
        password_hash: stryMutAct_9fa48("16") ? "" : (stryCov_9fa48("16"), '$2b$12$ULsM8nj06NEwOsRsidcBreJbQEJgI2Ox6v9ZUFnXQV2JSiNfr.XYy'),
        // senha: gerente123
        nome: stryMutAct_9fa48("17") ? "" : (stryCov_9fa48("17"), 'Gerente'),
        telefone: stryMutAct_9fa48("18") ? "" : (stryCov_9fa48("18"), '(11) 88888-8888'),
        role: stryMutAct_9fa48("19") ? "" : (stryCov_9fa48("19"), 'gerente'),
        active: stryMutAct_9fa48("20") ? false : (stryCov_9fa48("20"), true),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }), stryMutAct_9fa48("21") ? {} : (stryCov_9fa48("21"), {
        id: stryMutAct_9fa48("22") ? "" : (stryCov_9fa48("22"), 'barbeiro-001'),
        email: stryMutAct_9fa48("23") ? "" : (stryCov_9fa48("23"), 'barbeiro@lucasbarbearia.com'),
        password_hash: stryMutAct_9fa48("24") ? "" : (stryCov_9fa48("24"), '$2b$12$CBTL89JaIL1jW2MM8eFbOeX86ddTRdoqRfN3AhJwnOq025XRjqxym'),
        // senha: barbeiro123
        nome: stryMutAct_9fa48("25") ? "" : (stryCov_9fa48("25"), 'Barbeiro'),
        telefone: stryMutAct_9fa48("26") ? "" : (stryCov_9fa48("26"), '(11) 77777-7777'),
        role: stryMutAct_9fa48("27") ? "" : (stryCov_9fa48("27"), 'barbeiro'),
        active: stryMutAct_9fa48("28") ? false : (stryCov_9fa48("28"), true),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })]);
    }
  }

  /**
   * Autentica um usuário
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @returns {Object} - Dados do usuário e token
   */
  async login(email, password) {
    if (stryMutAct_9fa48("29")) {
      {}
    } else {
      stryCov_9fa48("29");
      try {
        if (stryMutAct_9fa48("30")) {
          {}
        } else {
          stryCov_9fa48("30");
          let user = null;
          if (stryMutAct_9fa48("32") ? false : stryMutAct_9fa48("31") ? true : (stryCov_9fa48("31", "32"), supabase)) {
            if (stryMutAct_9fa48("33")) {
              {}
            } else {
              stryCov_9fa48("33");
              // Usar Supabase se configurado
              const {
                data,
                error
              } = await supabase.from(stryMutAct_9fa48("34") ? "" : (stryCov_9fa48("34"), 'users')).select(stryMutAct_9fa48("35") ? "" : (stryCov_9fa48("35"), '*')).eq(stryMutAct_9fa48("36") ? "" : (stryCov_9fa48("36"), 'email'), email).eq(stryMutAct_9fa48("37") ? "" : (stryCov_9fa48("37"), 'active'), stryMutAct_9fa48("38") ? false : (stryCov_9fa48("38"), true)).single();
              if (stryMutAct_9fa48("41") ? error && !data : stryMutAct_9fa48("40") ? false : stryMutAct_9fa48("39") ? true : (stryCov_9fa48("39", "40", "41"), error || (stryMutAct_9fa48("42") ? data : (stryCov_9fa48("42"), !data)))) {
                if (stryMutAct_9fa48("43")) {
                  {}
                } else {
                  stryCov_9fa48("43");
                  throw new Error(stryMutAct_9fa48("44") ? "" : (stryCov_9fa48("44"), 'Email ou senha inválidos'));
                }
              }
              user = data;
            }
          } else {
            if (stryMutAct_9fa48("45")) {
              {}
            } else {
              stryCov_9fa48("45");
              // Usar dados simulados
              user = this.mockUsers.find(stryMutAct_9fa48("46") ? () => undefined : (stryCov_9fa48("46"), u => stryMutAct_9fa48("49") ? u.email === email || u.active : stryMutAct_9fa48("48") ? false : stryMutAct_9fa48("47") ? true : (stryCov_9fa48("47", "48", "49"), (stryMutAct_9fa48("51") ? u.email !== email : stryMutAct_9fa48("50") ? true : (stryCov_9fa48("50", "51"), u.email === email)) && u.active)));
              if (stryMutAct_9fa48("54") ? false : stryMutAct_9fa48("53") ? true : stryMutAct_9fa48("52") ? user : (stryCov_9fa48("52", "53", "54"), !user)) {
                if (stryMutAct_9fa48("55")) {
                  {}
                } else {
                  stryCov_9fa48("55");
                  throw new Error(stryMutAct_9fa48("56") ? "" : (stryCov_9fa48("56"), 'Email ou senha inválidos'));
                }
              }
            }
          }

          // Verificar senha
          const senhaValida = await bcrypt.compare(password, user.password_hash);
          if (stryMutAct_9fa48("59") ? false : stryMutAct_9fa48("58") ? true : stryMutAct_9fa48("57") ? senhaValida : (stryCov_9fa48("57", "58", "59"), !senhaValida)) {
            if (stryMutAct_9fa48("60")) {
              {}
            } else {
              stryCov_9fa48("60");
              throw new Error(stryMutAct_9fa48("61") ? "" : (stryCov_9fa48("61"), 'Email ou senha inválidos'));
            }
          }

          // Gerar token JWT
          const token = await this.generateToken(user);

          // Remover senha do objeto de retorno
          const {
            password_hash,
            ...userData
          } = user;
          return stryMutAct_9fa48("62") ? {} : (stryCov_9fa48("62"), {
            user: userData,
            token
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("63")) {
          {}
        } else {
          stryCov_9fa48("63");
          throw new Error((stryMutAct_9fa48("64") ? "" : (stryCov_9fa48("64"), 'Erro na autenticação: ')) + error.message);
        }
      }
    }
  }

  /**
   * Registra um novo usuário
   * @param {Object} userData - Dados do usuário
   * @returns {Object} - Dados do usuário criado
   */
  async register(userData) {
    if (stryMutAct_9fa48("65")) {
      {}
    } else {
      stryCov_9fa48("65");
      try {
        if (stryMutAct_9fa48("66")) {
          {}
        } else {
          stryCov_9fa48("66");
          const {
            email,
            password,
            nome,
            telefone,
            role
          } = userData;
          if (stryMutAct_9fa48("68") ? false : stryMutAct_9fa48("67") ? true : (stryCov_9fa48("67", "68"), supabase)) {
            if (stryMutAct_9fa48("69")) {
              {}
            } else {
              stryCov_9fa48("69");
              // Usar Supabase se configurado
              // Verificar se email já existe
              const {
                data: existingUser
              } = await supabase.from(stryMutAct_9fa48("70") ? "" : (stryCov_9fa48("70"), 'users')).select(stryMutAct_9fa48("71") ? "" : (stryCov_9fa48("71"), 'id')).eq(stryMutAct_9fa48("72") ? "" : (stryCov_9fa48("72"), 'email'), email).single();
              if (stryMutAct_9fa48("74") ? false : stryMutAct_9fa48("73") ? true : (stryCov_9fa48("73", "74"), existingUser)) {
                if (stryMutAct_9fa48("75")) {
                  {}
                } else {
                  stryCov_9fa48("75");
                  throw new Error(stryMutAct_9fa48("76") ? "" : (stryCov_9fa48("76"), 'Email já cadastrado'));
                }
              }

              // Hash da senha
              const saltRounds = 12;
              const passwordHash = await bcrypt.hash(password, saltRounds);

              // Criar usuário usando o cliente admin para bypassar RLS
              const clientToUse = stryMutAct_9fa48("79") ? supabaseAdmin && supabase : stryMutAct_9fa48("78") ? false : stryMutAct_9fa48("77") ? true : (stryCov_9fa48("77", "78", "79"), supabaseAdmin || supabase);
              const {
                data: newUser,
                error
              } = await clientToUse.from(stryMutAct_9fa48("80") ? "" : (stryCov_9fa48("80"), 'users')).insert(stryMutAct_9fa48("81") ? {} : (stryCov_9fa48("81"), {
                email,
                password_hash: passwordHash,
                nome,
                telefone,
                role,
                active: stryMutAct_9fa48("82") ? false : (stryCov_9fa48("82"), true)
              })).select().single();
              if (stryMutAct_9fa48("84") ? false : stryMutAct_9fa48("83") ? true : (stryCov_9fa48("83", "84"), error)) {
                if (stryMutAct_9fa48("85")) {
                  {}
                } else {
                  stryCov_9fa48("85");
                  throw new Error((stryMutAct_9fa48("86") ? "" : (stryCov_9fa48("86"), 'Erro ao criar usuário: ')) + error.message);
                }
              }

              // Remover senha do objeto de retorno
              const {
                password_hash,
                ...userDataReturn
              } = newUser;
              return userDataReturn;
            }
          } else {
            if (stryMutAct_9fa48("87")) {
              {}
            } else {
              stryCov_9fa48("87");
              // Usar dados simulados
              const existingUser = this.mockUsers.find(stryMutAct_9fa48("88") ? () => undefined : (stryCov_9fa48("88"), u => stryMutAct_9fa48("91") ? u.email !== email : stryMutAct_9fa48("90") ? false : stryMutAct_9fa48("89") ? true : (stryCov_9fa48("89", "90", "91"), u.email === email)));
              if (stryMutAct_9fa48("93") ? false : stryMutAct_9fa48("92") ? true : (stryCov_9fa48("92", "93"), existingUser)) {
                if (stryMutAct_9fa48("94")) {
                  {}
                } else {
                  stryCov_9fa48("94");
                  throw new Error(stryMutAct_9fa48("95") ? "" : (stryCov_9fa48("95"), 'Email já cadastrado'));
                }
              }

              // Hash da senha
              const saltRounds = 12;
              const passwordHash = await bcrypt.hash(password, saltRounds);

              // Criar usuário simulado
              const newUser = stryMutAct_9fa48("96") ? {} : (stryCov_9fa48("96"), {
                id: stryMutAct_9fa48("97") ? `` : (stryCov_9fa48("97"), `user-${Date.now()}`),
                email,
                password_hash: passwordHash,
                nome,
                telefone,
                role,
                active: stryMutAct_9fa48("98") ? false : (stryCov_9fa48("98"), true),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });
              this.mockUsers.push(newUser);

              // Remover senha do objeto de retorno
              const {
                password_hash,
                ...userDataReturn
              } = newUser;
              return userDataReturn;
            }
          }
        }
      } catch (error) {
        if (stryMutAct_9fa48("99")) {
          {}
        } else {
          stryCov_9fa48("99");
          throw new Error((stryMutAct_9fa48("100") ? "" : (stryCov_9fa48("100"), 'Erro no registro: ')) + error.message);
        }
      }
    }
  }

  /**
   * Gera token JWT
   * @param {Object} user - Dados do usuário
   * @returns {string} - Token JWT
   */
  async generateToken(user) {
    if (stryMutAct_9fa48("101")) {
      {}
    } else {
      stryCov_9fa48("101");
      const payload = stryMutAct_9fa48("102") ? {} : (stryCov_9fa48("102"), {
        id: user.id,
        email: user.email,
        role: user.role,
        nome: user.nome
      });
      return this.fastify.jwt.sign(payload);
    }
  }

  /**
   * Verifica se o usuário tem permissão
   * @param {string} userRole - Role do usuário
   * @param {Array} allowedRoles - Roles permitidas
   * @returns {boolean} - True se tem permissão
   */
  hasPermission(userRole, allowedRoles) {
    if (stryMutAct_9fa48("103")) {
      {}
    } else {
      stryCov_9fa48("103");
      return allowedRoles.includes(userRole);
    }
  }

  /**
   * Busca dados do usuário autenticado
   * @param {string} userId - ID do usuário
   * @returns {Object} - Dados do usuário
   */
  async getMe(userId) {
    if (stryMutAct_9fa48("104")) {
      {}
    } else {
      stryCov_9fa48("104");
      try {
        if (stryMutAct_9fa48("105")) {
          {}
        } else {
          stryCov_9fa48("105");
          let user = null;
          if (stryMutAct_9fa48("107") ? false : stryMutAct_9fa48("106") ? true : (stryCov_9fa48("106", "107"), supabase)) {
            if (stryMutAct_9fa48("108")) {
              {}
            } else {
              stryCov_9fa48("108");
              // Usar Supabase se configurado
              const {
                data,
                error
              } = await supabase.from(stryMutAct_9fa48("109") ? "" : (stryCov_9fa48("109"), 'users')).select(stryMutAct_9fa48("110") ? "" : (stryCov_9fa48("110"), 'id, email, nome, telefone, role, active, created_at, updated_at')).eq(stryMutAct_9fa48("111") ? "" : (stryCov_9fa48("111"), 'id'), userId).eq(stryMutAct_9fa48("112") ? "" : (stryCov_9fa48("112"), 'active'), stryMutAct_9fa48("113") ? false : (stryCov_9fa48("113"), true)).single();
              if (stryMutAct_9fa48("116") ? error && !data : stryMutAct_9fa48("115") ? false : stryMutAct_9fa48("114") ? true : (stryCov_9fa48("114", "115", "116"), error || (stryMutAct_9fa48("117") ? data : (stryCov_9fa48("117"), !data)))) {
                if (stryMutAct_9fa48("118")) {
                  {}
                } else {
                  stryCov_9fa48("118");
                  throw new Error(stryMutAct_9fa48("119") ? "" : (stryCov_9fa48("119"), 'Usuário não encontrado'));
                }
              }
              user = data;
            }
          } else {
            if (stryMutAct_9fa48("120")) {
              {}
            } else {
              stryCov_9fa48("120");
              // Usar dados simulados
              user = this.mockUsers.find(stryMutAct_9fa48("121") ? () => undefined : (stryCov_9fa48("121"), u => stryMutAct_9fa48("124") ? u.id === userId || u.active : stryMutAct_9fa48("123") ? false : stryMutAct_9fa48("122") ? true : (stryCov_9fa48("122", "123", "124"), (stryMutAct_9fa48("126") ? u.id !== userId : stryMutAct_9fa48("125") ? true : (stryCov_9fa48("125", "126"), u.id === userId)) && u.active)));
              if (stryMutAct_9fa48("129") ? false : stryMutAct_9fa48("128") ? true : stryMutAct_9fa48("127") ? user : (stryCov_9fa48("127", "128", "129"), !user)) {
                if (stryMutAct_9fa48("130")) {
                  {}
                } else {
                  stryCov_9fa48("130");
                  throw new Error(stryMutAct_9fa48("131") ? "" : (stryCov_9fa48("131"), 'Usuário não encontrado'));
                }
              }
              // Remover senha do objeto de retorno
              const {
                password_hash,
                ...userData
              } = user;
              user = userData;
            }
          }
          return user;
        }
      } catch (error) {
        if (stryMutAct_9fa48("132")) {
          {}
        } else {
          stryCov_9fa48("132");
          throw new Error((stryMutAct_9fa48("133") ? "" : (stryCov_9fa48("133"), 'Erro ao buscar usuário: ')) + error.message);
        }
      }
    }
  }
}
module.exports = AuthService;