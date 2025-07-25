// @ts-nocheck
const UserService = require('../../src/services/userService');

// Mock mais completo do Supabase
const createMockSupabase = () => ({
  from: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnValue({
      eq: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: null, error: null }),
          order: jest.fn().mockResolvedValue({ data: [], error: null })
        }),
        single: jest.fn().mockResolvedValue({ data: null, error: null }),
        order: jest.fn().mockResolvedValue({ data: [], error: null })
      }),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
      order: jest.fn().mockResolvedValue({ data: [], error: null })
    }),
    insert: jest.fn().mockResolvedValue({ data: null, error: null }),
    update: jest.fn().mockResolvedValue({ data: null, error: null }),
    delete: jest.fn().mockResolvedValue({ data: null, error: null })
  })
});

describe('UserService - Testes Melhorados', () => {
  let userService;
  let mockSupabase;

  beforeEach(() => {
    mockSupabase = createMockSupabase();
    userService = new UserService(mockSupabase);
  });

  describe('criarUsuario', () => {
    it('deve validar dados obrigatórios - nome', async () => {
      const dadosUsuario = {
        email: 'joao@teste.com',
        senha: '123456',
        role: 'cliente'
      };

      await expect(userService.criarUsuario(dadosUsuario))
        .rejects.toThrow('Dados obrigatórios estão faltando');
    });

    it('deve validar dados obrigatórios - email', async () => {
      const dadosUsuario = {
        nome: 'João Silva',
        senha: '123456',
        role: 'cliente'
      };

      await expect(userService.criarUsuario(dadosUsuario))
        .rejects.toThrow('Dados obrigatórios estão faltando');
    });

    it('deve validar dados obrigatórios - senha', async () => {
      const dadosUsuario = {
        nome: 'João Silva',
        email: 'joao@teste.com',
        role: 'cliente'
      };

      await expect(userService.criarUsuario(dadosUsuario))
        .rejects.toThrow('Dados obrigatórios estão faltando');
    });

    it('deve validar email inválido', async () => {
      const dadosUsuario = {
        nome: 'João Silva',
        email: 'email-invalido',
        senha: '123456',
        role: 'cliente'
      };

      await expect(userService.criarUsuario(dadosUsuario))
        .rejects.toThrow('Email inválido');
    });

    it('deve validar senha muito curta', async () => {
      const dadosUsuario = {
        nome: 'João Silva',
        email: 'joao@teste.com',
        senha: '123',
        role: 'cliente'
      };

      await expect(userService.criarUsuario(dadosUsuario))
        .rejects.toThrow('Senha deve ter pelo menos 6 caracteres');
    });

    it('deve validar role inválida', async () => {
      const dadosUsuario = {
        nome: 'João Silva',
        email: 'joao@teste.com',
        senha: '123456',
        role: 'role-invalida'
      };

      await expect(userService.criarUsuario(dadosUsuario))
        .rejects.toThrow('Role inválida');
    });
  });

  describe('atualizarUsuario', () => {
    it('deve validar ID nulo', async () => {
      const dadosUsuario = {
        nome: 'João Silva Atualizado'
      };

      await expect(userService.atualizarUsuario(null, dadosUsuario))
        .rejects.toThrow('ID é obrigatório');
    });

    it('deve validar ID zero', async () => {
      const dadosUsuario = {
        nome: 'João Silva Atualizado'
      };

      await expect(userService.atualizarUsuario(0, dadosUsuario))
        .rejects.toThrow('ID é obrigatório');
    });

    it('deve validar dados vazios', async () => {
      await expect(userService.atualizarUsuario(1, {}))
        .rejects.toThrow('Dados para atualização são obrigatórios');
    });

    it('deve validar email inválido', async () => {
      const dadosUsuario = {
        email: 'email-invalido'
      };

      await expect(userService.atualizarUsuario(1, dadosUsuario))
        .rejects.toThrow('Email inválido');
    });
  });

  describe('deletarUsuario', () => {
    it('deve validar ID nulo', async () => {
      await expect(userService.deletarUsuario(null))
        .rejects.toThrow('ID é obrigatório');
    });

    it('deve validar ID zero', async () => {
      await expect(userService.deletarUsuario(0))
        .rejects.toThrow('ID é obrigatório');
    });

    it('deve validar ID negativo', async () => {
      await expect(userService.deletarUsuario(-1))
        .rejects.toThrow('ID é obrigatório');
    });
  });

  describe('obterUsuarioPorId', () => {
    it('deve validar ID nulo', async () => {
      await expect(userService.obterUsuarioPorId(null))
        .rejects.toThrow('ID é obrigatório');
    });

    it('deve validar ID zero', async () => {
      await expect(userService.obterUsuarioPorId(0))
        .rejects.toThrow('ID é obrigatório');
    });

    it('deve validar usuário não encontrado', async () => {
      // Mock para usuário não encontrado
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } })
          })
        })
      });

      await expect(userService.obterUsuarioPorId(999))
        .rejects.toThrow('Usuário não encontrado');
    });
  });

  describe('listarBarbeiros', () => {
    it('deve validar barbearia_id nulo', async () => {
      await expect(userService.listarBarbeiros({ barbearia_id: null }))
        .rejects.toThrow('Barbearia ID é obrigatório');
    });

    it('deve validar barbearia_id zero', async () => {
      await expect(userService.listarBarbeiros({ barbearia_id: 0 }))
        .rejects.toThrow('Barbearia ID é obrigatório');
    });

    it('deve validar status inválido', async () => {
      await expect(userService.listarBarbeiros({ 
        barbearia_id: 1, 
        status: 'status-invalido' 
      }))
        .rejects.toThrow('Status inválido');
    });
  });

  describe('ativarBarbeiro', () => {
    it('deve validar ID nulo', async () => {
      await expect(userService.ativarBarbeiro(null))
        .rejects.toThrow('ID é obrigatório');
    });

    it('deve validar ID zero', async () => {
      await expect(userService.ativarBarbeiro(0))
        .rejects.toThrow('ID é obrigatório');
    });

    it('deve validar barbeiro não encontrado', async () => {
      // Mock para barbeiro não encontrado
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } })
          })
        })
      });

      await expect(userService.ativarBarbeiro(999))
        .rejects.toThrow('Barbeiro não encontrado');
    });
  });

  describe('desativarBarbeiro', () => {
    it('deve validar ID nulo', async () => {
      await expect(userService.desativarBarbeiro(null))
        .rejects.toThrow('ID é obrigatório');
    });

    it('deve validar ID zero', async () => {
      await expect(userService.desativarBarbeiro(0))
        .rejects.toThrow('ID é obrigatório');
    });

    it('deve validar barbeiro não encontrado', async () => {
      // Mock para barbeiro não encontrado
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } })
          })
        })
      });

      await expect(userService.desativarBarbeiro(999))
        .rejects.toThrow('Barbeiro não encontrado');
    });
  });
}); 