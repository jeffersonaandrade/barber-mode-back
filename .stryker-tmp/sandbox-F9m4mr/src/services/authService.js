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
  if (stryMutAct_9fa48("3318")) {
    {}
  } else {
    stryCov_9fa48("3318");
    const dbConfig = require('../config/database');
    supabase = dbConfig.supabase;
    supabaseAdmin = dbConfig.supabaseAdmin;
  }
} catch (error) {
  if (stryMutAct_9fa48("3319")) {
    {}
  } else {
    stryCov_9fa48("3319");
    console.log(stryMutAct_9fa48("3320") ? "" : (stryCov_9fa48("3320"), '⚠️ Supabase não configurado, usando dados simulados'));
  }
}
class AuthService {
  constructor(fastify) {
    if (stryMutAct_9fa48("3321")) {
      {}
    } else {
      stryCov_9fa48("3321");
      this.fastify = fastify;

      // Dados simulados para desenvolvimento
      this.mockUsers = stryMutAct_9fa48("3322") ? [] : (stryCov_9fa48("3322"), [stryMutAct_9fa48("3323") ? {} : (stryCov_9fa48("3323"), {
        id: stryMutAct_9fa48("3324") ? "" : (stryCov_9fa48("3324"), 'admin-001'),
        email: stryMutAct_9fa48("3325") ? "" : (stryCov_9fa48("3325"), 'admin@lucasbarbearia.com'),
        password_hash: stryMutAct_9fa48("3326") ? "" : (stryCov_9fa48("3326"), '$2b$12$IPjUL7HPYFXwsvKsZ1PtbuAq5ldfspojv/RAfXeHrQO9dI.iwJMAe'),
        // senha: admin123
        nome: stryMutAct_9fa48("3327") ? "" : (stryCov_9fa48("3327"), 'Administrador'),
        telefone: stryMutAct_9fa48("3328") ? "" : (stryCov_9fa48("3328"), '(11) 99999-9999'),
        role: stryMutAct_9fa48("3329") ? "" : (stryCov_9fa48("3329"), 'admin'),
        active: stryMutAct_9fa48("3330") ? false : (stryCov_9fa48("3330"), true),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }), stryMutAct_9fa48("3331") ? {} : (stryCov_9fa48("3331"), {
        id: stryMutAct_9fa48("3332") ? "" : (stryCov_9fa48("3332"), 'gerente-001'),
        email: stryMutAct_9fa48("3333") ? "" : (stryCov_9fa48("3333"), 'gerente@lucasbarbearia.com'),
        password_hash: stryMutAct_9fa48("3334") ? "" : (stryCov_9fa48("3334"), '$2b$12$ULsM8nj06NEwOsRsidcBreJbQEJgI2Ox6v9ZUFnXQV2JSiNfr.XYy'),
        // senha: gerente123
        nome: stryMutAct_9fa48("3335") ? "" : (stryCov_9fa48("3335"), 'Gerente'),
        telefone: stryMutAct_9fa48("3336") ? "" : (stryCov_9fa48("3336"), '(11) 88888-8888'),
        role: stryMutAct_9fa48("3337") ? "" : (stryCov_9fa48("3337"), 'gerente'),
        active: stryMutAct_9fa48("3338") ? false : (stryCov_9fa48("3338"), true),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }), stryMutAct_9fa48("3339") ? {} : (stryCov_9fa48("3339"), {
        id: stryMutAct_9fa48("3340") ? "" : (stryCov_9fa48("3340"), 'barbeiro-001'),
        email: stryMutAct_9fa48("3341") ? "" : (stryCov_9fa48("3341"), 'barbeiro@lucasbarbearia.com'),
        password_hash: stryMutAct_9fa48("3342") ? "" : (stryCov_9fa48("3342"), '$2b$12$CBTL89JaIL1jW2MM8eFbOeX86ddTRdoqRfN3AhJwnOq025XRjqxym'),
        // senha: barbeiro123
        nome: stryMutAct_9fa48("3343") ? "" : (stryCov_9fa48("3343"), 'Barbeiro'),
        telefone: stryMutAct_9fa48("3344") ? "" : (stryCov_9fa48("3344"), '(11) 77777-7777'),
        role: stryMutAct_9fa48("3345") ? "" : (stryCov_9fa48("3345"), 'barbeiro'),
        active: stryMutAct_9fa48("3346") ? false : (stryCov_9fa48("3346"), true),
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
    if (stryMutAct_9fa48("3347")) {
      {}
    } else {
      stryCov_9fa48("3347");
      try {
        if (stryMutAct_9fa48("3348")) {
          {}
        } else {
          stryCov_9fa48("3348");
          let user = null;
          if (stryMutAct_9fa48("3350") ? false : stryMutAct_9fa48("3349") ? true : (stryCov_9fa48("3349", "3350"), supabase)) {
            if (stryMutAct_9fa48("3351")) {
              {}
            } else {
              stryCov_9fa48("3351");
              // Usar Supabase se configurado
              const {
                data,
                error
              } = await supabase.from(stryMutAct_9fa48("3352") ? "" : (stryCov_9fa48("3352"), 'users')).select(stryMutAct_9fa48("3353") ? "" : (stryCov_9fa48("3353"), '*')).eq(stryMutAct_9fa48("3354") ? "" : (stryCov_9fa48("3354"), 'email'), email).eq(stryMutAct_9fa48("3355") ? "" : (stryCov_9fa48("3355"), 'active'), stryMutAct_9fa48("3356") ? false : (stryCov_9fa48("3356"), true)).single();
              if (stryMutAct_9fa48("3359") ? error && !data : stryMutAct_9fa48("3358") ? false : stryMutAct_9fa48("3357") ? true : (stryCov_9fa48("3357", "3358", "3359"), error || (stryMutAct_9fa48("3360") ? data : (stryCov_9fa48("3360"), !data)))) {
                if (stryMutAct_9fa48("3361")) {
                  {}
                } else {
                  stryCov_9fa48("3361");
                  throw new Error(stryMutAct_9fa48("3362") ? "" : (stryCov_9fa48("3362"), 'Email ou senha inválidos'));
                }
              }
              user = data;
            }
          } else {
            if (stryMutAct_9fa48("3363")) {
              {}
            } else {
              stryCov_9fa48("3363");
              // Usar dados simulados
              user = this.mockUsers.find(stryMutAct_9fa48("3364") ? () => undefined : (stryCov_9fa48("3364"), u => stryMutAct_9fa48("3367") ? u.email === email || u.active : stryMutAct_9fa48("3366") ? false : stryMutAct_9fa48("3365") ? true : (stryCov_9fa48("3365", "3366", "3367"), (stryMutAct_9fa48("3369") ? u.email !== email : stryMutAct_9fa48("3368") ? true : (stryCov_9fa48("3368", "3369"), u.email === email)) && u.active)));
              if (stryMutAct_9fa48("3372") ? false : stryMutAct_9fa48("3371") ? true : stryMutAct_9fa48("3370") ? user : (stryCov_9fa48("3370", "3371", "3372"), !user)) {
                if (stryMutAct_9fa48("3373")) {
                  {}
                } else {
                  stryCov_9fa48("3373");
                  throw new Error(stryMutAct_9fa48("3374") ? "" : (stryCov_9fa48("3374"), 'Email ou senha inválidos'));
                }
              }
            }
          }

          // Verificar senha
          const senhaValida = await bcrypt.compare(password, user.password_hash);
          if (stryMutAct_9fa48("3377") ? false : stryMutAct_9fa48("3376") ? true : stryMutAct_9fa48("3375") ? senhaValida : (stryCov_9fa48("3375", "3376", "3377"), !senhaValida)) {
            if (stryMutAct_9fa48("3378")) {
              {}
            } else {
              stryCov_9fa48("3378");
              throw new Error(stryMutAct_9fa48("3379") ? "" : (stryCov_9fa48("3379"), 'Email ou senha inválidos'));
            }
          }

          // Gerar token JWT
          const token = await this.generateToken(user);

          // Remover senha do objeto de retorno
          const {
            password_hash,
            ...userData
          } = user;
          return stryMutAct_9fa48("3380") ? {} : (stryCov_9fa48("3380"), {
            user: userData,
            token
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("3381")) {
          {}
        } else {
          stryCov_9fa48("3381");
          throw new Error((stryMutAct_9fa48("3382") ? "" : (stryCov_9fa48("3382"), 'Erro na autenticação: ')) + error.message);
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
    if (stryMutAct_9fa48("3383")) {
      {}
    } else {
      stryCov_9fa48("3383");
      try {
        if (stryMutAct_9fa48("3384")) {
          {}
        } else {
          stryCov_9fa48("3384");
          const {
            email,
            password,
            nome,
            telefone,
            role
          } = userData;
          if (stryMutAct_9fa48("3386") ? false : stryMutAct_9fa48("3385") ? true : (stryCov_9fa48("3385", "3386"), supabase)) {
            if (stryMutAct_9fa48("3387")) {
              {}
            } else {
              stryCov_9fa48("3387");
              // Usar Supabase se configurado
              // Verificar se email já existe
              const {
                data: existingUser
              } = await supabase.from(stryMutAct_9fa48("3388") ? "" : (stryCov_9fa48("3388"), 'users')).select(stryMutAct_9fa48("3389") ? "" : (stryCov_9fa48("3389"), 'id')).eq(stryMutAct_9fa48("3390") ? "" : (stryCov_9fa48("3390"), 'email'), email).single();
              if (stryMutAct_9fa48("3392") ? false : stryMutAct_9fa48("3391") ? true : (stryCov_9fa48("3391", "3392"), existingUser)) {
                if (stryMutAct_9fa48("3393")) {
                  {}
                } else {
                  stryCov_9fa48("3393");
                  throw new Error(stryMutAct_9fa48("3394") ? "" : (stryCov_9fa48("3394"), 'Email já cadastrado'));
                }
              }

              // Hash da senha
              const saltRounds = 12;
              const passwordHash = await bcrypt.hash(password, saltRounds);

              // Criar usuário usando o cliente admin para bypassar RLS
              const clientToUse = stryMutAct_9fa48("3397") ? supabaseAdmin && supabase : stryMutAct_9fa48("3396") ? false : stryMutAct_9fa48("3395") ? true : (stryCov_9fa48("3395", "3396", "3397"), supabaseAdmin || supabase);
              const {
                data: newUser,
                error
              } = await clientToUse.from(stryMutAct_9fa48("3398") ? "" : (stryCov_9fa48("3398"), 'users')).insert(stryMutAct_9fa48("3399") ? {} : (stryCov_9fa48("3399"), {
                email,
                password_hash: passwordHash,
                nome,
                telefone,
                role,
                active: stryMutAct_9fa48("3400") ? false : (stryCov_9fa48("3400"), true)
              })).select().single();
              if (stryMutAct_9fa48("3402") ? false : stryMutAct_9fa48("3401") ? true : (stryCov_9fa48("3401", "3402"), error)) {
                if (stryMutAct_9fa48("3403")) {
                  {}
                } else {
                  stryCov_9fa48("3403");
                  throw new Error((stryMutAct_9fa48("3404") ? "" : (stryCov_9fa48("3404"), 'Erro ao criar usuário: ')) + error.message);
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
            if (stryMutAct_9fa48("3405")) {
              {}
            } else {
              stryCov_9fa48("3405");
              // Usar dados simulados
              const existingUser = this.mockUsers.find(stryMutAct_9fa48("3406") ? () => undefined : (stryCov_9fa48("3406"), u => stryMutAct_9fa48("3409") ? u.email !== email : stryMutAct_9fa48("3408") ? false : stryMutAct_9fa48("3407") ? true : (stryCov_9fa48("3407", "3408", "3409"), u.email === email)));
              if (stryMutAct_9fa48("3411") ? false : stryMutAct_9fa48("3410") ? true : (stryCov_9fa48("3410", "3411"), existingUser)) {
                if (stryMutAct_9fa48("3412")) {
                  {}
                } else {
                  stryCov_9fa48("3412");
                  throw new Error(stryMutAct_9fa48("3413") ? "" : (stryCov_9fa48("3413"), 'Email já cadastrado'));
                }
              }

              // Hash da senha
              const saltRounds = 12;
              const passwordHash = await bcrypt.hash(password, saltRounds);

              // Criar usuário simulado
              const newUser = stryMutAct_9fa48("3414") ? {} : (stryCov_9fa48("3414"), {
                id: stryMutAct_9fa48("3415") ? `` : (stryCov_9fa48("3415"), `user-${Date.now()}`),
                email,
                password_hash: passwordHash,
                nome,
                telefone,
                role,
                active: stryMutAct_9fa48("3416") ? false : (stryCov_9fa48("3416"), true),
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
        if (stryMutAct_9fa48("3417")) {
          {}
        } else {
          stryCov_9fa48("3417");
          throw new Error((stryMutAct_9fa48("3418") ? "" : (stryCov_9fa48("3418"), 'Erro no registro: ')) + error.message);
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
    if (stryMutAct_9fa48("3419")) {
      {}
    } else {
      stryCov_9fa48("3419");
      const payload = stryMutAct_9fa48("3420") ? {} : (stryCov_9fa48("3420"), {
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
    if (stryMutAct_9fa48("3421")) {
      {}
    } else {
      stryCov_9fa48("3421");
      return allowedRoles.includes(userRole);
    }
  }

  /**
   * Busca dados do usuário autenticado
   * @param {string} userId - ID do usuário
   * @returns {Object} - Dados do usuário
   */
  async getMe(userId) {
    if (stryMutAct_9fa48("3422")) {
      {}
    } else {
      stryCov_9fa48("3422");
      try {
        if (stryMutAct_9fa48("3423")) {
          {}
        } else {
          stryCov_9fa48("3423");
          let user = null;
          if (stryMutAct_9fa48("3425") ? false : stryMutAct_9fa48("3424") ? true : (stryCov_9fa48("3424", "3425"), supabase)) {
            if (stryMutAct_9fa48("3426")) {
              {}
            } else {
              stryCov_9fa48("3426");
              // Usar Supabase se configurado
              const {
                data,
                error
              } = await supabase.from(stryMutAct_9fa48("3427") ? "" : (stryCov_9fa48("3427"), 'users')).select(stryMutAct_9fa48("3428") ? "" : (stryCov_9fa48("3428"), 'id, email, nome, telefone, role, active, created_at, updated_at')).eq(stryMutAct_9fa48("3429") ? "" : (stryCov_9fa48("3429"), 'id'), userId).eq(stryMutAct_9fa48("3430") ? "" : (stryCov_9fa48("3430"), 'active'), stryMutAct_9fa48("3431") ? false : (stryCov_9fa48("3431"), true)).single();
              if (stryMutAct_9fa48("3434") ? error && !data : stryMutAct_9fa48("3433") ? false : stryMutAct_9fa48("3432") ? true : (stryCov_9fa48("3432", "3433", "3434"), error || (stryMutAct_9fa48("3435") ? data : (stryCov_9fa48("3435"), !data)))) {
                if (stryMutAct_9fa48("3436")) {
                  {}
                } else {
                  stryCov_9fa48("3436");
                  throw new Error(stryMutAct_9fa48("3437") ? "" : (stryCov_9fa48("3437"), 'Usuário não encontrado'));
                }
              }
              user = data;
            }
          } else {
            if (stryMutAct_9fa48("3438")) {
              {}
            } else {
              stryCov_9fa48("3438");
              // Usar dados simulados
              user = this.mockUsers.find(stryMutAct_9fa48("3439") ? () => undefined : (stryCov_9fa48("3439"), u => stryMutAct_9fa48("3442") ? u.id === userId || u.active : stryMutAct_9fa48("3441") ? false : stryMutAct_9fa48("3440") ? true : (stryCov_9fa48("3440", "3441", "3442"), (stryMutAct_9fa48("3444") ? u.id !== userId : stryMutAct_9fa48("3443") ? true : (stryCov_9fa48("3443", "3444"), u.id === userId)) && u.active)));
              if (stryMutAct_9fa48("3447") ? false : stryMutAct_9fa48("3446") ? true : stryMutAct_9fa48("3445") ? user : (stryCov_9fa48("3445", "3446", "3447"), !user)) {
                if (stryMutAct_9fa48("3448")) {
                  {}
                } else {
                  stryCov_9fa48("3448");
                  throw new Error(stryMutAct_9fa48("3449") ? "" : (stryCov_9fa48("3449"), 'Usuário não encontrado'));
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
        if (stryMutAct_9fa48("3450")) {
          {}
        } else {
          stryCov_9fa48("3450");
          throw new Error((stryMutAct_9fa48("3451") ? "" : (stryCov_9fa48("3451"), 'Erro ao buscar usuário: ')) + error.message);
        }
      }
    }
  }
}
module.exports = AuthService;