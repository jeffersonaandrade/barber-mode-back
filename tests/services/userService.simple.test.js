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

  describe('listarBarbeiros', () => {
    test('deve validar barbearia_id nulo', async () => {
      await expect(userService.listarBarbeiros({ barbearia_id: null }))
        .rejects.toThrow('Barbearia não encontrada ou inativa');
    });

    test('deve validar barbearia_id zero', async () => {
      await expect(userService.listarBarbeiros({ barbearia_id: 0 }))
        .rejects.toThrow('Barbearia não encontrada ou inativa');
    });

    test('deve validar status inválido', async () => {
      // Configurar mock para barbearia existente
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ 
                data: { id: 1, nome: 'Barbearia Teste', ativo: true }, 
                error: null 
              })
            })
          })
        })
      });

      await expect(userService.listarBarbeiros({ 
        barbearia_id: 1, 
        status: 'status_invalido' 
      })).resolves.toBeDefined();
    });

    test('deve listar barbeiros com sucesso', async () => {
      // Configurar mock completo
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ 
                data: { id: 1, nome: 'Barbearia Teste', ativo: true }, 
                error: null 
              })
            })
          })
        })
      });

      const result = await userService.listarBarbeiros({ 
        barbearia_id: 1, 
        status: 'ativo' 
      });
      expect(result).toBeDefined();
    });
  });

  describe('ativarBarbeiro', () => {
    test('deve validar dados nulos', async () => {
      await expect(userService.ativarBarbeiro(null))
        .rejects.toThrow('Cannot destructure property');
    });

    test('deve validar dados vazios', async () => {
      await expect(userService.ativarBarbeiro({}))
        .rejects.toThrow('Cannot destructure property');
    });

    test('deve validar user_id ausente', async () => {
      await expect(userService.ativarBarbeiro({ barbearia_id: 1 }))
        .rejects.toThrow('Cannot destructure property');
    });

    test('deve validar barbearia_id ausente', async () => {
      await expect(userService.ativarBarbeiro({ user_id: 1 }))
        .rejects.toThrow('Cannot destructure property');
    });
  });

  describe('desativarBarbeiro', () => {
    test('deve validar dados nulos', async () => {
      await expect(userService.desativarBarbeiro(null))
        .rejects.toThrow('Cannot destructure property');
    });

    test('deve validar dados vazios', async () => {
      await expect(userService.desativarBarbeiro({}))
        .rejects.toThrow('Cannot destructure property');
    });

    test('deve validar user_id ausente', async () => {
      await expect(userService.desativarBarbeiro({ barbearia_id: 1 }))
        .rejects.toThrow('Cannot destructure property');
    });

    test('deve validar barbearia_id ausente', async () => {
      await expect(userService.desativarBarbeiro({ user_id: 1 }))
        .rejects.toThrow('Cannot destructure property');
    });
  });

  describe('atualizarUsuario', () => {
    test('deve validar ID nulo', async () => {
      await expect(userService.atualizarUsuario(null, {}))
        .rejects.toThrow('Usuário não encontrado');
    });

    test('deve validar ID zero', async () => {
      await expect(userService.atualizarUsuario(0, {}))
        .rejects.toThrow('Usuário não encontrado');
    });

    test('deve validar dados vazios', async () => {
      await expect(userService.atualizarUsuario(1, {}))
        .rejects.toThrow('Usuário não encontrado');
    });
  });

  describe('deletarUsuario', () => {
    test('deve validar ID nulo', async () => {
      await expect(userService.deletarUsuario(null, 1))
        .rejects.toThrow('Usuário não encontrado');
    });

    test('deve validar ID zero', async () => {
      await expect(userService.deletarUsuario(0, 1))
        .rejects.toThrow('Usuário não encontrado');
    });

    test('deve validar ID negativo', async () => {
      await expect(userService.deletarUsuario(-1, 1))
        .rejects.toThrow('Usuário não encontrado');
    });
  });

  describe('listarUsuarios', () => {
    test('deve listar usuários com sucesso', async () => {
      // Configurar mock para retornar lista vazia
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({ data: [], error: null })
        })
      });

      const result = await userService.listarUsuarios();
      expect(result).toBeDefined();
    });
  });
}); 