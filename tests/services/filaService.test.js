/**
 * Testes unitários para FilaService
 * 
 * Testa todas as funcionalidades do serviço de fila:
 * - Adicionar cliente na fila
 * - Obter fila completa
 * - Obter estatísticas
 * - Chamar próximo cliente
 * - Verificar status do cliente
 */

const FilaService = require('../../src/services/filaService');

describe('FilaService', () => {
  let filaService;
  let mockSupabase;

  beforeEach(() => {
    // Criar mock do Supabase
    mockSupabase = createSupabaseMock();
    filaService = new FilaService(mockSupabase);
  });

  describe('adicionarClienteNaFila', () => {
    it('deve adicionar cliente na fila com sucesso', async () => {
      // Arrange
      const clienteData = {
        nome: 'João Silva',
        telefone: '(11) 99999-9999',
        barbearia_id: 1,
        barbeiro_id: 'user-123'
      };

      const mockCliente = {
        ...createTestData.cliente,
        ...clienteData
      };

      // Mock das chamadas do Supabase
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: createTestData.barbearia, error: null })
          })
        }),
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: mockCliente, error: null })
          })
        })
      });

      // Act
      const resultado = await filaService.adicionarClienteNaFila(clienteData);

      // Assert
      expect(resultado).toEqual(mockCliente);
      expect(mockSupabase.from).toHaveBeenCalledWith('barbearias');
      expect(mockSupabase.from).toHaveBeenCalledWith('clientes');
    });

    it('deve lançar erro quando barbearia não existe', async () => {
      // Arrange
      const clienteData = {
        nome: 'João Silva',
        telefone: '(11) 99999-9999',
        barbearia_id: 999,
        barbeiro_id: 'user-123'
      };

      // Mock retornando erro para barbearia não encontrada
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } })
          })
        })
      });

      // Act & Assert
      await expect(filaService.adicionarClienteNaFila(clienteData))
        .rejects
        .toThrow('Barbearia não encontrada');
    });

    it('deve lançar erro quando dados obrigatórios estão faltando', async () => {
      // Arrange
      const clienteData = {
        nome: 'João Silva',
        // telefone faltando
        barbearia_id: 1
      };

      // Act & Assert
      await expect(filaService.adicionarClienteNaFila(clienteData))
        .rejects
        .toThrow('Nome, telefone e barbearia_id são obrigatórios');
    });
  });

  describe('obterFilaCompleta', () => {
    it('deve retornar fila completa com estatísticas', async () => {
      // Arrange
      const barbeariaId = 1;
      const mockClientes = [
        { ...createTestData.cliente, status: 'aguardando', posicao: 1 },
        { ...createTestData.cliente, id: 'cliente-456', status: 'aguardando', posicao: 2 }
      ];

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ data: mockClientes, error: null })
          })
        })
      });

      // Act
      const resultado = await filaService.obterFilaCompleta(barbeariaId);

      // Assert
      expect(resultado).toHaveProperty('clientes');
      expect(resultado).toHaveProperty('estatisticas');
      expect(resultado.clientes).toHaveLength(2);
      expect(resultado.estatisticas.total_aguardando).toBe(2);
    });

    it('deve retornar fila vazia quando não há clientes', async () => {
      // Arrange
      const barbeariaId = 1;

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ data: [], error: null })
          })
        })
      });

      // Act
      const resultado = await filaService.obterFilaCompleta(barbeariaId);

      // Assert
      expect(resultado.clientes).toHaveLength(0);
      expect(resultado.estatisticas.total_aguardando).toBe(0);
    });
  });

  describe('obterEstatisticasFila', () => {
    it('deve retornar estatísticas públicas da fila', async () => {
      // Arrange
      const barbeariaId = 1;
      const mockClientes = [
        { ...createTestData.cliente, status: 'aguardando' },
        { ...createTestData.cliente, id: 'cliente-456', status: 'proximo' }
      ];

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ data: mockClientes, error: null })
          })
        })
      });

      // Act
      const resultado = await filaService.obterEstatisticasFila(barbeariaId);

      // Assert
      expect(resultado).toHaveProperty('total_aguardando');
      expect(resultado).toHaveProperty('tempo_medio_espera');
      expect(resultado.total_aguardando).toBe(1);
    });
  });

  describe('chamarProximoCliente', () => {
    it('deve chamar próximo cliente com sucesso', async () => {
      // Arrange
      const barbeariaId = 1;
      const barbeiroId = 'user-123';
      const mockProximoCliente = {
        ...createTestData.cliente,
        status: 'aguardando',
        posicao: 1
      };

      // Mock para verificar barbeiro ativo
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: { id: 1, ativo: true }, error: null })
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
                  limit: jest.fn().mockReturnValue({
                    single: jest.fn().mockResolvedValue({ data: mockProximoCliente, error: null })
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
      const resultado = await filaService.chamarProximoCliente(barbeariaId, barbeiroId);

      // Assert
      expect(resultado.status).toBe('proximo');
    });

    it('deve lançar erro quando barbeiro não está ativo', async () => {
      // Arrange
      const barbeariaId = 1;
      const barbeiroId = 'user-123';

      // Mock retornando que barbeiro não está ativo
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } })
          })
        })
      });

      // Act & Assert
      await expect(filaService.chamarProximoCliente(barbeariaId, barbeiroId))
        .rejects
        .toThrow('Você não está ativo nesta barbearia');
    });

    it('deve lançar erro quando não há clientes na fila', async () => {
      // Arrange
      const barbeariaId = 1;
      const barbeiroId = 'user-123';

      // Mock para barbeiro ativo
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: { id: 1, ativo: true }, error: null })
          })
        })
      });

      // Mock para fila vazia
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            in: jest.fn().mockReturnValue({
              or: jest.fn().mockReturnValue({
                order: jest.fn().mockReturnValue({
                  limit: jest.fn().mockReturnValue({
                    single: jest.fn().mockResolvedValue({ data: null, error: { message: 'No rows returned' } })
                  })
                })
              })
            })
          })
        })
      });

      // Act & Assert
      await expect(filaService.chamarProximoCliente(barbeariaId, barbeiroId))
        .rejects
        .toThrow('Não há clientes aguardando na fila');
    });
  });

  describe('verificarStatusCliente', () => {
    it('deve retornar status do cliente quando token é válido', async () => {
      // Arrange
      const token = 'token-123';
      const mockCliente = {
        ...createTestData.cliente,
        status: 'aguardando',
        posicao: 1
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: mockCliente, error: null })
          })
        })
      });

      // Act
      const resultado = await filaService.verificarStatusCliente(token);

      // Assert
      expect(resultado).toEqual(mockCliente);
    });

    it('deve lançar erro quando token não é encontrado', async () => {
      // Arrange
      const token = 'token-invalido';

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } })
          })
        })
      });

      // Act & Assert
      await expect(filaService.verificarStatusCliente(token))
        .rejects
        .toThrow('Cliente não encontrado');
    });
  });

  describe('calcularEstatisticas', () => {
    it('deve calcular estatísticas corretamente', () => {
      // Arrange
      const clientes = [
        { status: 'aguardando', created_at: '2024-01-01T10:00:00Z' },
        { status: 'aguardando', created_at: '2024-01-01T10:30:00Z' },
        { status: 'proximo', created_at: '2024-01-01T09:00:00Z' },
        { status: 'atendendo', created_at: '2024-01-01T08:00:00Z' }
      ];

      // Act
      const estatisticas = filaService.calcularEstatisticas(clientes);

      // Assert
      expect(estatisticas.total_aguardando).toBe(2);
      expect(estatisticas.total_proximo).toBe(1);
      expect(estatisticas.total_atendendo).toBe(1);
      expect(estatisticas).toHaveProperty('tempo_medio_espera');
    });

    it('deve retornar estatísticas vazias quando não há clientes', () => {
      // Arrange
      const clientes = [];

      // Act
      const estatisticas = filaService.calcularEstatisticas(clientes);

      // Assert
      expect(estatisticas.total_aguardando).toBe(0);
      expect(estatisticas.total_proximo).toBe(0);
      expect(estatisticas.total_atendendo).toBe(0);
      expect(estatisticas.tempo_medio_espera).toBe(0);
    });
  });
}); 