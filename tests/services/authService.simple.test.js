const AuthService = require('../../src/services/authService');
const { createSupabaseMock } = require('../mocks/supabaseMock');

// Mock do bcrypt
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn()
}));

// Mock do fastify
const mockFastify = {
  jwt: {
    sign: jest.fn()
  }
};

describe('AuthService - Testes Completos', () => {
  let authService;
  let mockSupabase;
  let bcrypt;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Importar bcrypt mockado
    bcrypt = require('bcrypt');
    
    // Criar mock do Supabase
    mockSupabase = createSupabaseMock();
    
    // Criar instância do AuthService
    authService = new AuthService(mockFastify);
  });

  describe('login', () => {
    it('deve fazer login com sucesso usando dados simulados', async () => {
      // Arrange
      const email = 'admin@lucasbarbearia.com';
      const password = 'admin123';
      
      bcrypt.compare.mockResolvedValue(true);
      mockFastify.jwt.sign.mockReturnValue('token_jwt_mockado');

      // Act
      const result = await authService.login(email, password);

      // Assert
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user.email).toBe(email);
      expect(result.user.role).toBe('admin');
      expect(result.token).toBe('token_jwt_mockado');
    });

    it('deve falhar quando email não existe', async () => {
      // Arrange
      const email = 'inexistente@example.com';
      const password = 'senha123';

      // Act & Assert
      await expect(authService.login(email, password))
        .rejects
        .toThrow('Erro na autenticação: Email ou senha inválidos');
    });

    it('deve falhar quando senha está incorreta', async () => {
      // Arrange
      const email = 'admin@lucasbarbearia.com';
      const password = 'senha_incorreta';

      bcrypt.compare.mockResolvedValue(false);

      // Act & Assert
      await expect(authService.login(email, password))
        .rejects
        .toThrow('Erro na autenticação: Email ou senha inválidos');
    });
  });

  describe('register', () => {
    it('deve registrar usuário com sucesso usando dados simulados', async () => {
      // Arrange
      const userData = {
        email: 'novo@example.com',
        password: 'senha123',
        nome: 'Novo Usuário',
        telefone: '(11) 1234-5678',
        role: 'cliente'
      };

      bcrypt.hash.mockResolvedValue('hash_da_senha');
      mockFastify.jwt.sign.mockReturnValue('token_jwt_mockado');

      // Act
      const result = await authService.register(userData);

      // Assert
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user.email).toBe(userData.email);
      expect(result.user.nome).toBe(userData.nome);
      expect(result.token).toBe('token_jwt_mockado');
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 12);
    });

    it('deve falhar quando email já existe', async () => {
      // Arrange
      const userData = {
        email: 'admin@lucasbarbearia.com', // Email já existe nos dados simulados
        password: 'senha123',
        nome: 'Usuário Teste',
        telefone: '(11) 1234-5678',
        role: 'cliente'
      };

      // Act & Assert
      await expect(authService.register(userData))
        .rejects
        .toThrow('Erro no registro: Email já cadastrado');
    });
  });

  describe('generateToken', () => {
    it('deve gerar token JWT com sucesso', async () => {
      // Arrange
      const user = {
        id: 'user-001',
        email: 'test@example.com',
        role: 'cliente'
      };

      mockFastify.jwt.sign.mockReturnValue('token_gerado');

      // Act
      const token = await authService.generateToken(user);

      // Assert
      expect(token).toBe('token_gerado');
      expect(mockFastify.jwt.sign).toHaveBeenCalledWith({
        id: user.id,
        email: user.email,
        role: user.role
      });
    });

    it('deve falhar quando fastify não está configurado', async () => {
      // Arrange
      const user = {
        id: 'user-001',
        email: 'test@example.com',
        role: 'cliente'
      };

      authService.fastify = null;

      // Act & Assert
      await expect(authService.generateToken(user))
        .rejects
        .toThrow('Cannot read properties of null (reading \'jwt\')');
    });
  });

  describe('hasPermission', () => {
    it('deve retornar true quando usuário tem permissão', () => {
      // Arrange
      const userRole = 'admin';
      const allowedRoles = ['admin', 'gerente'];

      // Act
      const result = authService.hasPermission(userRole, allowedRoles);

      // Assert
      expect(result).toBe(true);
    });

    it('deve retornar false quando usuário não tem permissão', () => {
      // Arrange
      const userRole = 'cliente';
      const allowedRoles = ['admin', 'gerente'];

      // Act
      const result = authService.hasPermission(userRole, allowedRoles);

      // Assert
      expect(result).toBe(false);
    });

    it('deve retornar false quando role é null', () => {
      // Arrange
      const userRole = null;
      const allowedRoles = ['admin', 'gerente'];

      // Act
      const result = authService.hasPermission(userRole, allowedRoles);

      // Assert
      expect(result).toBe(false);
    });

    it('deve retornar false quando allowedRoles é vazio', () => {
      // Arrange
      const userRole = 'admin';
      const allowedRoles = [];

      // Act
      const result = authService.hasPermission(userRole, allowedRoles);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('getMe', () => {
    it('deve retornar dados do usuário com sucesso usando dados simulados', async () => {
      // Arrange
      const userId = 'admin-001';

      // Act
      const result = await authService.getMe(userId);

      // Assert
      expect(result).toHaveProperty('id', userId);
      expect(result).toHaveProperty('email', 'admin@lucasbarbearia.com');
      expect(result).toHaveProperty('role', 'admin');
    });

    it('deve falhar quando usuário não existe', async () => {
      // Arrange
      const userId = 'usuario-inexistente';

      // Act & Assert
      await expect(authService.getMe(userId))
        .rejects
        .toThrow('Erro ao buscar usuário: Usuário não encontrado');
    });
  });

  describe('Cenários de erro', () => {
    it('deve lidar com erro de bcrypt no registro', async () => {
      // Arrange
      const userData = {
        email: 'novo@example.com',
        password: 'senha123',
        nome: 'Novo Usuário',
        telefone: '(11) 1234-5678',
        role: 'cliente'
      };

      bcrypt.hash.mockRejectedValue(new Error('Erro de bcrypt'));

      // Act & Assert
      await expect(authService.register(userData))
        .rejects
        .toThrow('Erro no registro: Erro de bcrypt');
    });

    it('deve lidar com erro de JWT', async () => {
      // Arrange
      const user = {
        id: 'user-001',
        email: 'test@example.com',
        role: 'cliente'
      };

      mockFastify.jwt.sign.mockImplementation(() => {
        throw new Error('Erro de JWT');
      });

      // Act & Assert
      await expect(authService.generateToken(user))
        .rejects
        .toThrow('Erro de JWT');
    });
  });
}); 