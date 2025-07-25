/**
 * Testes unitários para BarbeariaService
 * 
 * Testa todas as funcionalidades do serviço de barbearias:
 * - Listar barbearias
 * - Buscar barbearia por ID
 * - Criar barbearia
 * - Atualizar barbearia
 * - Remover barbearia
 * - Chamar próximo cliente
 */
// @ts-nocheck


const BarbeariaService = require('../../src/services/barbeariaService');

describe('BarbeariaService', () => {
  let barbeariaService;
  let mockSupabase;

  beforeEach(() => {
    // Limpar mocks antes de cada teste
    clearMocks();
    
    // Criar mock do Supabase
    mockSupabase = createSupabaseMock();
    barbeariaService = new BarbeariaService(mockSupabase);
  });

  describe('listarBarbearias', () => {
    it('deve listar todas as barbearias ativas', async () => {
      // Arrange
      const mockBarbearias = [
        createTestData.barbearia,
        { ...createTestData.barbearia, id: 2, nome: 'Barbearia Teste 2' }
      ];

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ data: mockBarbearias, error: null })
          })
        })
      });

      // Act
      const resultado = await barbeariaService.listarBarbearias();

      // Assert
      expect(resultado).toEqual(mockBarbearias);
      expect(resultado).toHaveLength(2);
    });

    it('deve retornar lista vazia quando não há barbearias', async () => {
      // Arrange
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ data: [], error: null })
          })
        })
      });

      // Act
      const resultado = await barbeariaService.listarBarbearias();

      // Assert
      expect(resultado).toEqual([]);
    });
  });

  describe('buscarBarbeariaPorId', () => {
    it('deve retornar barbearia quando ID é válido', async () => {
      // Arrange
      const barbeariaId = 1;

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: createTestData.barbearia, error: null })
            })
          })
        })
      });

      // Act
      const resultado = await barbeariaService.buscarBarbeariaPorId(barbeariaId);

      // Assert
      expect(resultado).toEqual(createTestData.barbearia);
    });

    it('deve lançar erro quando barbearia não existe', async () => {
      // Arrange
      const barbeariaId = 999;

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } })
            })
          })
        })
      });

      // Act & Assert
      await expect(barbeariaService.buscarBarbeariaPorId(barbeariaId))
        .rejects
        .toThrow('Barbearia não encontrada');
    });
  });

  describe('criarBarbearia', () => {
    it('deve criar barbearia com sucesso', async () => {
      // Arrange
      const barbeariaData = {
        nome: 'Nova Barbearia',
        endereco: 'Rua Nova, 456',
        telefone: '(11) 77777-7777'
      };

      const mockBarbeariaCriada = {
        ...createTestData.barbearia,
        ...barbeariaData,
        id: 2
      };

      // Mock para verificar se já existe barbearia com mesmo nome
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } })
            })
          })
        })
      });

      // Mock para criar barbearia
      mockSupabase.from.mockReturnValueOnce({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: mockBarbeariaCriada, error: null })
          })
        })
      });

      // Act
      const resultado = await barbeariaService.criarBarbearia(barbeariaData);

      // Assert
      expect(resultado).toEqual(mockBarbeariaCriada);
      expect(resultado.nome).toBe('Nova Barbearia');
    });

    it('deve lançar erro quando dados obrigatórios estão faltando', async () => {
      // Arrange
      const barbeariaData = {
        nome: 'Barbearia Teste'
        // endereço faltando
      };

      // Act & Assert
      await expect(barbeariaService.criarBarbearia(barbeariaData))
        .rejects
        .toThrow('Nome e endereço são obrigatórios');
    });

    it('deve lançar erro quando já existe barbearia com mesmo nome', async () => {
      // Arrange
      const barbeariaData = {
        nome: 'Barbearia Teste',
        endereco: 'Rua Teste, 123'
      };

      // Mock retornando que já existe barbearia com mesmo nome
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: { id: 1 }, error: null })
            })
          })
        })
      });

      // Act & Assert
      await expect(barbeariaService.criarBarbearia(barbeariaData))
        .rejects
        .toThrow('Já existe uma barbearia com este nome');
    });
  });

  describe('atualizarBarbearia', () => {
    it('deve atualizar barbearia com sucesso', async () => {
      // Arrange
      const barbeariaId = 1;
      const updateData = {
        nome: 'Barbearia Atualizada',
        telefone: '(11) 66666-6666'
      };

      const mockBarbeariaAtualizada = {
        ...createTestData.barbearia,
        ...updateData,
        updated_at: '2024-01-01T12:00:00Z'
      };

      // Mock para buscar barbearia existente
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: createTestData.barbearia, error: null })
            })
          })
        })
      });

      // Mock para verificar se existe conflito de nome
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              neq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } })
              })
            })
          })
        })
      });

      // Mock para atualizar barbearia
      mockSupabase.from.mockReturnValueOnce({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: mockBarbeariaAtualizada, error: null })
            })
          })
        })
      });

      // Act
      const resultado = await barbeariaService.atualizarBarbearia(barbeariaId, updateData);

      // Assert
      expect(resultado).toEqual(mockBarbeariaAtualizada);
      expect(resultado.nome).toBe('Barbearia Atualizada');
    });

    it('deve lançar erro quando barbearia não existe', async () => {
      // Arrange
      const barbeariaId = 999;
      const updateData = { nome: 'Barbearia Teste' };

      // Mock retornando que barbearia não existe
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } })
            })
          })
        })
      });

      // Act & Assert
      await expect(barbeariaService.atualizarBarbearia(barbeariaId, updateData))
        .rejects
        .toThrow('Barbearia não encontrada');
    });
  });

  describe('removerBarbearia', () => {
    it('deve remover barbearia com sucesso', async () => {
      // Arrange
      const barbeariaId = 1;

      // Mock para buscar barbearia existente
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: createTestData.barbearia, error: null })
            })
          })
        })
      });

      // Mock para verificar barbeiros ativos
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              mockResolvedValue: jest.fn().mockResolvedValue({ data: [], error: null })
            })
          })
        })
      });

      // Mock para verificar clientes na fila
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            in: jest.fn().mockReturnValue({
              mockResolvedValue: jest.fn().mockResolvedValue({ data: [], error: null })
            })
          })
        })
      });

      // Mock para remover barbearia
      mockSupabase.from.mockReturnValueOnce({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            mockResolvedValue: jest.fn().mockResolvedValue({ data: null, error: null })
          })
        })
      });

      // Act
      const resultado = await barbeariaService.removerBarbearia(barbeariaId);

      // Assert
      expect(resultado).toBe(true);
    });

    it('deve lançar erro quando há barbeiros ativos', async () => {
      // Arrange
      const barbeariaId = 1;

      // Mock para buscar barbearia existente
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: createTestData.barbearia, error: null })
            })
          })
        })
      });

      // Mock para verificar barbeiros ativos
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              mockResolvedValue: jest.fn().mockResolvedValue({ data: [{ id: 1 }], error: null })
            })
          })
        })
      });

      // Act & Assert
      await expect(barbeariaService.removerBarbearia(barbeariaId))
        .rejects
        .toThrow('Não é possível remover barbearia com barbeiros ativos');
    });

    it('deve lançar erro quando há clientes na fila', async () => {
      // Arrange
      const barbeariaId = 1;

      // Mock para buscar barbearia existente
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: createTestData.barbearia, error: null })
            })
          })
        })
      });

      // Mock para verificar barbeiros ativos
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              mockResolvedValue: jest.fn().mockResolvedValue({ data: [], error: null })
            })
          })
        })
      });

      // Mock para verificar clientes na fila
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            in: jest.fn().mockReturnValue({
              mockResolvedValue: jest.fn().mockResolvedValue({ data: [{ id: 1 }], error: null })
            })
          })
        })
      });

      // Act & Assert
      await expect(barbeariaService.removerBarbearia(barbeariaId))
        .rejects
        .toThrow('Não é possível remover barbearia com clientes na fila');
    });
  });

  describe('chamarProximoCliente', () => {
    it('deve chamar próximo cliente com sucesso', async () => {
      // Arrange
      const barbeariaId = 1;
      const userId = 'user-123';
      const mockProximoCliente = {
        ...createTestData.cliente,
        status: 'aguardando',
        posicao: 1
      };

      // Mock para verificar barbeiro ativo
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({ data: { id: 1, ativo: true }, error: null })
              })
            })
          })
        })
      });

      // Mock para buscar próximo cliente
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            in: jest.fn().mockReturnValue({
              or: jest.fn().mockReturnValue({
                order: jest.fn().mockReturnValue({
                  order: jest.fn().mockReturnValue({
                    limit: jest.fn().mockReturnValue({
                      single: jest.fn().mockResolvedValue({ data: mockProximoCliente, error: null })
                    })
                  })
                })
              })
            })
          })
        })
      });

      // Mock para atualizar status
      mockSupabase.from.mockReturnValueOnce({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ 
                data: { ...mockProximoCliente, status: 'proximo' }, 
                error: null 
              })
            })
          })
        })
      });

      // Act
      const resultado = await barbeariaService.chamarProximoCliente(barbeariaId, userId);

      // Assert
      expect(resultado.status).toBe('proximo');
    });

    it('deve lançar erro quando barbeiro não está ativo', async () => {
      // Arrange
      const barbeariaId = 1;
      const userId = 'user-123';

      // Mock retornando que barbeiro não está ativo
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } })
              })
            })
          })
        })
      });

      // Act & Assert
      await expect(barbeariaService.chamarProximoCliente(barbeariaId, userId))
        .rejects
        .toThrow('Você não está ativo nesta barbearia');
    });
  });

  describe('verificarBarbeiroAtivo', () => {
    it('deve retornar true quando barbeiro está ativo', async () => {
      // Arrange
      const userId = 'user-123';
      const barbeariaId = 1;

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({ data: { ativo: true }, error: null })
              })
            })
          })
        })
      });

      // Act
      const resultado = await barbeariaService.verificarBarbeiroAtivo(userId, barbeariaId);

      // Assert
      expect(resultado).toBe(true);
    });

    it('deve retornar false quando barbeiro não está ativo', async () => {
      // Arrange
      const userId = 'user-123';
      const barbeariaId = 1;

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } })
              })
            })
          })
        })
      });

      // Act
      const resultado = await barbeariaService.verificarBarbeiroAtivo(userId, barbeariaId);

      // Assert
      expect(resultado).toBe(false);
    });
  });
}); 