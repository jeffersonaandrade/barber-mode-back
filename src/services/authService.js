const bcrypt = require('bcrypt');

// Tentar importar Supabase, mas não falhar se não estiver configurado
let supabase = null;
let supabaseAdmin = null;

try {
  const dbConfig = require('../config/database');
  supabase = dbConfig.supabase;
  supabaseAdmin = dbConfig.supabaseAdmin;
} catch (error) {
  console.log('⚠️ Supabase não configurado, usando dados simulados');
}

class AuthService {
  constructor(fastify) {
    this.fastify = fastify;
    
    // Dados simulados para desenvolvimento
    this.mockUsers = [
      {
        id: 'admin-001',
        email: 'admin@lucasbarbearia.com',
        password_hash: '$2b$12$IPjUL7HPYFXwsvKsZ1PtbuAq5ldfspojv/RAfXeHrQO9dI.iwJMAe', // senha: admin123
        nome: 'Administrador',
        telefone: '(11) 99999-9999',
        role: 'admin',
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'gerente-001',
        email: 'gerente@lucasbarbearia.com',
        password_hash: '$2b$12$ULsM8nj06NEwOsRsidcBreJbQEJgI2Ox6v9ZUFnXQV2JSiNfr.XYy', // senha: gerente123
        nome: 'Gerente',
        telefone: '(11) 88888-8888',
        role: 'gerente',
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'barbeiro-001',
        email: 'barbeiro@lucasbarbearia.com',
        password_hash: '$2b$12$CBTL89JaIL1jW2MM8eFbOeX86ddTRdoqRfN3AhJwnOq025XRjqxym', // senha: barbeiro123
        nome: 'Barbeiro',
        telefone: '(11) 77777-7777',
        role: 'barbeiro',
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }

  /**
   * Autentica um usuário
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @returns {Object} - Dados do usuário e token
   */
  async login(email, password) {
    try {
      let user = null;

      if (supabase) {
        // Usar Supabase se configurado
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .eq('active', true)
          .single();

        if (error || !data) {
          throw new Error('Email ou senha inválidos');
        }
        user = data;
      } else {
        // Usar dados simulados
        user = this.mockUsers.find(u => u.email === email && u.active);
        if (!user) {
          throw new Error('Email ou senha inválidos');
        }
      }

      // Verificar senha
      const senhaValida = await bcrypt.compare(password, user.password_hash);
      if (!senhaValida) {
        throw new Error('Email ou senha inválidos');
      }

      // Gerar token JWT
      const token = await this.generateToken(user);

      // Remover senha do objeto de retorno
      const { password_hash, ...userData } = user;

      return {
        user: userData,
        token
      };
    } catch (error) {
      throw new Error('Erro na autenticação: ' + error.message);
    }
  }

  /**
   * Registra um novo usuário
   * @param {Object} userData - Dados do usuário
   * @returns {Object} - Dados do usuário criado
   */
  async register(userData) {
    try {
      const { email, password, nome, telefone, role } = userData;

      if (supabase) {
        // Usar Supabase se configurado
        // Verificar se email já existe
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('email', email)
          .single();

        if (existingUser) {
          throw new Error('Email já cadastrado');
        }

        // Hash da senha
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Criar usuário usando o cliente admin para bypassar RLS
        const clientToUse = supabaseAdmin || supabase;
        const { data: newUser, error } = await clientToUse
          .from('users')
          .insert({
            email,
            password_hash: passwordHash,
            nome,
            telefone,
            role,
            active: true
          })
          .select()
          .single();

        if (error) {
          throw new Error('Erro ao criar usuário: ' + error.message);
        }

        // Remover senha do objeto de retorno
        const { password_hash, ...userDataReturn } = newUser;
        return userDataReturn;
      } else {
        // Usar dados simulados
        const existingUser = this.mockUsers.find(u => u.email === email);
        if (existingUser) {
          throw new Error('Email já cadastrado');
        }

        // Hash da senha
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Criar usuário simulado
        const newUser = {
          id: `user-${Date.now()}`,
          email,
          password_hash: passwordHash,
          nome,
          telefone,
          role,
          active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        this.mockUsers.push(newUser);

        // Remover senha do objeto de retorno
        const { password_hash, ...userDataReturn } = newUser;
        return userDataReturn;
      }
    } catch (error) {
      throw new Error('Erro no registro: ' + error.message);
    }
  }

  /**
   * Gera token JWT
   * @param {Object} user - Dados do usuário
   * @returns {string} - Token JWT
   */
  async generateToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      nome: user.nome
    };

    return this.fastify.jwt.sign(payload);
  }

  /**
   * Verifica se o usuário tem permissão
   * @param {string} userRole - Role do usuário
   * @param {Array} allowedRoles - Roles permitidas
   * @returns {boolean} - True se tem permissão
   */
  hasPermission(userRole, allowedRoles) {
    return allowedRoles.includes(userRole);
  }

  /**
   * Busca dados do usuário autenticado
   * @param {string} userId - ID do usuário
   * @returns {Object} - Dados do usuário
   */
  async getMe(userId) {
    try {
      let user = null;

      if (supabase) {
        // Usar Supabase se configurado
        const { data, error } = await supabase
          .from('users')
          .select('id, email, nome, telefone, role, active, created_at, updated_at')
          .eq('id', userId)
          .eq('active', true)
          .single();

        if (error || !data) {
          throw new Error('Usuário não encontrado');
        }
        user = data;
      } else {
        // Usar dados simulados
        user = this.mockUsers.find(u => u.id === userId && u.active);
        if (!user) {
          throw new Error('Usuário não encontrado');
        }
        // Remover senha do objeto de retorno
        const { password_hash, ...userData } = user;
        user = userData;
      }

      return user;
    } catch (error) {
      throw new Error('Erro ao buscar usuário: ' + error.message);
    }
  }
}

module.exports = AuthService; 