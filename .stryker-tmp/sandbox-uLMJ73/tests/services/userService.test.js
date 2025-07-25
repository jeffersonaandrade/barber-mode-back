/**
 * Testes unitários para UserService
 * 
 * Testa todas as funcionalidades do serviço de usuários:
 * - Listar barbeiros
 * - Obter status do barbeiro
 * - Ativar/desativar barbeiros
 * - Gerenciar usuários
 */
// @ts-nocheck


const UserService = require('../../src/services/userService');

describe('UserService', () => {
  let userService;
  let mockSupabase;

  beforeEach(() => {
    // Criar mock do Supabase
    mockSupabase = createSupabaseMock();
    userService = new UserService(mockSupabase);
  });

  describe('listarBarbeiros', () => {
    it('deve listar barbeiros com filtros', async () => {
      // Arrange
      const filtros = {
        barbearia_id: 1,
        status: 'ativo',
        isPublic: true
      };

      const mockBarbeiros = [
        { ...createTestData.user, role: 'barbeiro' },
        { ...createTestData.user, id: 'user-456', nome: 'Maria Silva', role: 'barbeiro' }
      ];

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                order: jest.fn().mockResolvedValue({ data: mockBarbeiros, error: null })
              })
            })
          })
        })
      });

      // Act
      const resultado = await userService.listarBarbeiros(filtros);

      // Assert
      expect(resultado).toEqual(mockBarbeiros);
      expect(resultado).toHaveLength(2);
    });

    it('deve retornar lista vazia quando não há barbeiros', async () => {
      // Arrange
      const filtros = { barbearia_id: 1 };

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ data: [], error: null })
          })
        })
      });

      // Act
      const resultado = await userService.listarBarbeiros(filtros);

      // Assert
      expect(resultado).toEqual([]);
    });
  });

  describe('obterStatusBarbeiro', () => {
    it('deve retornar status do barbeiro', async () => {
      // Arrange
      const userId = 'user-123';
      const mockStatus = {
        barbearia_id: 1,
        ativo: true,
        ultima_atividade: '2024-01-01T10:00:00Z'
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: mockStatus, error: null })
          })
        })
      });

      // Act
      const resultado = await userService.obterStatusBarbeiro(userId);

      // Assert
      expect(resultado).toEqual(mockStatus);
    });

    it('deve retornar null quando barbeiro não tem status', async () => {
      // Arrange
      const userId = 'user-invalido';

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } })
          })
        })
      });

      // Act
      const resultado = await userService.obterStatusBarbeiro(userId);

      // Assert
      expect(resultado).toBeNull();
    });
  });

  describe('ativarBarbeiro', () => {
    it('deve ativar barbeiro com sucesso', async () => {
      // Arrange
      const dados = {
        user_id: 'user-123',
        barbearia_id: 1
      };

      const mockResultado = {
        acao: 'ativado',
        barbeiro: createTestData.user,
        barbearia: createTestData.barbearia
      };

      // Mock para verificar usuário
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({ data: createTestData.user, error: null })
              })
            })
          })
        })
      });

      // Mock para verificar barbearia
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: createTestData.barbearia, error: null })
            })
          })
        })
      });

      // Mock para verificar relação existente
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } })
            })
          })
        })
      });

      // Mock para criar nova relação
      mockSupabase.from.mockReturnValueOnce({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: { id: 1 }, error: null })
          })
        })
      });

      // Act
      const resultado = await userService.ativarBarbeiro(dados);

      // Assert
      expect(resultado.acao).toBe('ativado');
      expect(resultado.barbeiro).toEqual(createTestData.user);
      expect(resultado.barbearia).toEqual(createTestData.barbearia);
    });

    it('deve reativar barbeiro quando relação já existe', async () => {
      // Arrange
      const dados = {
        user_id: 'user-123',
        barbearia_id: 1
      };

      const relacaoExistente = {
        id: 1,
        user_id: 'user-123',
        barbearia_id: 1,
        ativo: false
      };

      // Mock para verificar usuário
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({ data: createTestData.user, error: null })
              })
            })
          })
        })
      });

      // Mock para verificar barbearia
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: createTestData.barbearia, error: null })
            })
          })
        })
      });

      // Mock para verificar relação existente
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: relacaoExistente, error: null })
            })
          })
        })
      });

      // Mock para reativar barbeiro
      mockSupabase.from.mockReturnValueOnce({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: { ...relacaoExistente, ativo: true }, error: null })
            })
          })
        })
      });

      // Act
      const resultado = await userService.ativarBarbeiro(dados);

      // Assert
      expect(resultado.acao).toBe('reativado');
    });

    it('deve lançar erro quando usuário não é barbeiro', async () => {
      // Arrange
      const dados = {
        user_id: 'user-123',
        barbearia_id: 1
      };

      const mockUser = { ...createTestData.user, role: 'admin' };

      // Mock retornando usuário que não é barbeiro
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({ data: mockUser, error: null })
              })
            })
          })
        })
      });

      // Act & Assert
      await expect(userService.ativarBarbeiro(dados))
        .rejects
        .toThrow('Usuário não é um barbeiro');
    });
  });

  describe('desativarBarbeiro', () => {
    it('deve desativar barbeiro com sucesso', async () => {
      // Arrange
      const dados = {
        user_id: 'user-123',
        barbearia_id: 1
      };

      const relacaoExistente = {
        id: 1,
        user_id: 'user-123',
        barbearia_id: 1,
        ativo: true
      };

      // Mock para verificar usuário
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({ data: createTestData.user, error: null })
              })
            })
          })
        })
      });

      // Mock para verificar barbearia
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: createTestData.barbearia, error: null })
            })
          })
        })
      });

      // Mock para verificar relação existente
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: relacaoExistente, error: null })
            })
          })
        })
      });

      // Mock para desativar barbeiro
      mockSupabase.from.mockReturnValueOnce({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: { ...relacaoExistente, ativo: false }, error: null })
            })
          })
        })
      });

      // Act
      const resultado = await userService.desativarBarbeiro(dados);

      // Assert
      expect(resultado.acao).toBe('desativado');
    });

    it('deve lançar erro quando barbeiro não está ativo', async () => {
      // Arrange
      const dados = {
        user_id: 'user-123',
        barbearia_id: 1
      };

      const relacaoExistente = {
        id: 1,
        user_id: 'user-123',
        barbearia_id: 1,
        ativo: false
      };

      // Mock para verificar usuário
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({ data: createTestData.user, error: null })
              })
            })
          })
        })
      });

      // Mock para verificar barbearia
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: createTestData.barbearia, error: null })
            })
          })
        })
      });

      // Mock para verificar relação existente
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: relacaoExistente, error: null })
            })
          })
        })
      });

      // Act & Assert
      await expect(userService.desativarBarbeiro(dados))
        .rejects
        .toThrow('Barbeiro não está ativo nesta barbearia');
    });
  });

  describe('listarUsuarios', () => {
    it('deve listar todos os usuários', async () => {
      // Arrange
      const mockUsuarios = [
        createTestData.user,
        { ...createTestData.user, id: 'user-456', nome: 'Maria Silva' }
      ];

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({ data: mockUsuarios, error: null })
        })
      });

      // Act
      const resultado = await userService.listarUsuarios();

      // Assert
      expect(resultado).toEqual(mockUsuarios);
      expect(resultado).toHaveLength(2);
    });
  });

  describe('atualizarUsuario', () => {
    it('deve atualizar usuário com sucesso', async () => {
      // Arrange
      const userId = 'user-123';
      const dados = {
        nome: 'João Silva Atualizado',
        email: 'joao.atualizado@teste.com'
      };

      const mockUsuarioAtualizado = {
        ...createTestData.user,
        ...dados,
        updated_at: '2024-01-01T12:00:00Z'
      };

      mockSupabase.from.mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: mockUsuarioAtualizado, error: null })
            })
          })
        })
      });

      // Act
      const resultado = await userService.atualizarUsuario(userId, dados);

      // Assert
      expect(resultado).toEqual(mockUsuarioAtualizado);
      expect(resultado.nome).toBe('João Silva Atualizado');
    });
  });

  describe('deletarUsuario', () => {
    it('deve deletar usuário com sucesso', async () => {
      // Arrange
      const userId = 'user-123';
      const adminId = 'admin-123';

      const mockUsuarioDeletado = {
        ...createTestData.user,
        ativo: false,
        deleted_at: '2024-01-01T12:00:00Z'
      };

      // Mock para verificar se é admin
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: { role: 'admin' }, error: null })
            })
          })
        })
      });

      // Mock para deletar usuário
      mockSupabase.from.mockReturnValueOnce({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: mockUsuarioDeletado, error: null })
            })
          })
        })
      });

      // Act
      const resultado = await userService.deletarUsuario(userId, adminId);

      // Assert
      expect(resultado).toEqual(mockUsuarioDeletado);
      expect(resultado.ativo).toBe(false);
    });

    it('deve lançar erro quando não é admin', async () => {
      // Arrange
      const userId = 'user-123';
      const adminId = 'user-456';

      // Mock retornando que não é admin
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: { role: 'barbeiro' }, error: null })
            })
          })
        })
      });

      // Act & Assert
      await expect(userService.deletarUsuario(userId, adminId))
        .rejects
        .toThrow('Apenas administradores podem deletar usuários');
    });
  });
}); 