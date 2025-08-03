/**
 * Testes unitários para AvaliacaoService
 * 
 * Testa todas as funcionalidades do serviço de avaliações:
 * - Enviar avaliação
 * - Listar avaliações com filtros
 * - Calcular estatísticas
 * - Verificar validações
 */

const AvaliacaoService = require('../../src/services/avaliacaoService');

describe('AvaliacaoService', () => {
  let avaliacaoService;
  let mockSupabase;

  beforeEach(() => {
    // Criar mock do Supabase
    mockSupabase = createSupabaseMock();
    avaliacaoService = new AvaliacaoService(mockSupabase);
  });

  describe('enviarAvaliacao', () => {
    it('deve enviar avaliação com sucesso', async () => {
      // Arrange
      const avaliacaoData = {
        cliente_id: 'cliente-123',
        barbearia_id: 1,
        barbeiro_id: 'user-123',
        rating: 5,
        categoria: 'atendimento',
        comentario: 'Excelente atendimento!'
      };

      const mockAvaliacaoCriada = {
        ...createTestData.avaliacao,
        ...avaliacaoData
      };

      // Mock para verificar se cliente foi atendido
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({ data: { status: 'finalizado' }, error: null })
              })
            })
          })
        })
      });

      // Mock para verificar se já existe avaliação
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } })
          })
        })
      });

      // Mock para criar avaliação
      mockSupabase.from.mockReturnValueOnce({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: mockAvaliacaoCriada, error: null })
          })
        })
      });

      // Act
      const resultado = await avaliacaoService.enviarAvaliacao(avaliacaoData);

      // Assert
      expect(resultado).toEqual(mockAvaliacaoCriada);
      expect(resultado.rating).toBe(5);
    });

    it('deve lançar erro quando dados obrigatórios estão faltando', async () => {
      // Arrange
      const avaliacaoData = {
        cliente_id: 'cliente-123',
        // rating faltando
        categoria: 'atendimento'
      };

      // Act & Assert
      await expect(avaliacaoService.enviarAvaliacao(avaliacaoData))
        .rejects
        .toThrow('Cliente ID, barbearia ID, barbeiro ID, rating e categoria são obrigatórios');
    });

    it('deve lançar erro quando cliente não foi atendido', async () => {
      // Arrange
      const avaliacaoData = {
        cliente_id: 'cliente-123',
        barbearia_id: 1,
        barbeiro_id: 'user-123',
        rating: 5,
        categoria: 'atendimento'
      };

      // Mock retornando que cliente não foi atendido
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
      await expect(avaliacaoService.enviarAvaliacao(avaliacaoData))
        .rejects
        .toThrow('Cliente não foi atendido nesta barbearia');
    });

    it('deve lançar erro quando cliente já avaliou', async () => {
      // Arrange
      const avaliacaoData = {
        cliente_id: 'cliente-123',
        barbearia_id: 1,
        barbeiro_id: 'user-123',
        rating: 5,
        categoria: 'atendimento'
      };

      // Mock para verificar se cliente foi atendido
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({ data: { status: 'finalizado' }, error: null })
              })
            })
          })
        })
      });

      // Mock retornando que já existe avaliação
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: { id: 1 }, error: null })
          })
        })
      });

      // Act & Assert
      await expect(avaliacaoService.enviarAvaliacao(avaliacaoData))
        .rejects
        .toThrow('Cliente já avaliou este atendimento');
    });

    it('deve lançar erro quando rating é inválido', async () => {
      // Arrange
      const avaliacaoData = {
        cliente_id: 'cliente-123',
        barbearia_id: 1,
        barbeiro_id: 'user-123',
        rating: 6, // Rating inválido (deve ser 1-5)
        categoria: 'atendimento'
      };

      // Act & Assert
      await expect(avaliacaoService.enviarAvaliacao(avaliacaoData))
        .rejects
        .toThrow('Rating deve estar entre 1 e 5');
    });
  });

  describe('listarAvaliacoes', () => {
    it('deve listar avaliações com filtros', async () => {
      // Arrange
      const filtros = {
        barbearia_id: 1,
        barbeiro_id: 'user-123',
        categoria: 'atendimento',
        rating_min: 4
      };

      const mockAvaliacoes = [
        createTestData.avaliacao,
        { ...createTestData.avaliacao, id: 'avaliacao-456', rating: 4 }
      ];

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                gte: jest.fn().mockReturnValue({
                  order: jest.fn().mockResolvedValue({ data: mockAvaliacoes, error: null })
                })
              })
            })
          })
        })
      });

      // Act
      const resultado = await avaliacaoService.listarAvaliacoes(filtros);

      // Assert
      expect(resultado).toEqual(mockAvaliacoes);
      expect(resultado).toHaveLength(2);
    });

    it('deve retornar lista vazia quando não há avaliações', async () => {
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
      const resultado = await avaliacaoService.listarAvaliacoes(filtros);

      // Assert
      expect(resultado).toEqual([]);
    });
  });

  describe('verificarClienteAtendido', () => {
    it('deve retornar true quando cliente foi atendido', async () => {
      // Arrange
      const clienteId = 'cliente-123';
      const barbeariaId = 1;

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({ data: { status: 'finalizado' }, error: null })
              })
            })
          })
        })
      });

      // Act
      const resultado = await avaliacaoService.verificarClienteAtendido(clienteId, barbeariaId);

      // Assert
      expect(resultado).toBe(true);
    });

    it('deve retornar false quando cliente não foi atendido', async () => {
      // Arrange
      const clienteId = 'cliente-123';
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
      const resultado = await avaliacaoService.verificarClienteAtendido(clienteId, barbeariaId);

      // Assert
      expect(resultado).toBe(false);
    });
  });

  describe('verificarAvaliacaoExistente', () => {
    it('deve retornar true quando avaliação já existe', async () => {
      // Arrange
      const clienteId = 'cliente-123';

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: { id: 1 }, error: null })
          })
        })
      });

      // Act
      const resultado = await avaliacaoService.verificarAvaliacaoExistente(clienteId);

      // Assert
      expect(resultado).toBe(true);
    });

    it('deve retornar false quando avaliação não existe', async () => {
      // Arrange
      const clienteId = 'cliente-123';

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } })
          })
        })
      });

      // Act
      const resultado = await avaliacaoService.verificarAvaliacaoExistente(clienteId);

      // Assert
      expect(resultado).toBe(false);
    });
  });

  describe('calcularEstatisticas', () => {
    it('deve calcular estatísticas corretamente', () => {
      // Arrange
      const avaliacoes = [
        { rating: 5, categoria: 'atendimento' },
        { rating: 4, categoria: 'atendimento' },
        { rating: 3, categoria: 'qualidade' },
        { rating: 5, categoria: 'atendimento' },
        { rating: 2, categoria: 'qualidade' }
      ];

      // Act
      const estatisticas = avaliacaoService.calcularEstatisticas(avaliacoes);

      // Assert
      expect(estatisticas.total_avaliacoes).toBe(5);
      expect(estatisticas.media_rating).toBe(3.8);
      expect(estatisticas.rating_5).toBe(2);
      expect(estatisticas.rating_4).toBe(1);
      expect(estatisticas.rating_3).toBe(1);
      expect(estatisticas.rating_2).toBe(1);
      expect(estatisticas.rating_1).toBe(0);
      expect(estatisticas.por_categoria).toEqual({
        atendimento: 3,
        qualidade: 2
      });
    });

    it('deve retornar estatísticas vazias quando não há avaliações', () => {
      // Arrange
      const avaliacoes = [];

      // Act
      const estatisticas = avaliacaoService.calcularEstatisticas(avaliacoes);

      // Assert
      expect(estatisticas.total_avaliacoes).toBe(0);
      expect(estatisticas.media_rating).toBe(0);
      expect(estatisticas.rating_5).toBe(0);
      expect(estatisticas.por_categoria).toEqual({});
    });
  });

  describe('obterEstatisticasBarbearia', () => {
    it('deve retornar estatísticas da barbearia', async () => {
      // Arrange
      const barbeariaId = 1;
      const mockAvaliacoes = [
        { rating: 5, categoria: 'atendimento' },
        { rating: 4, categoria: 'qualidade' },
        { rating: 5, categoria: 'atendimento' }
      ];

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ data: mockAvaliacoes, error: null })
          })
        })
      });

      // Act
      const resultado = await avaliacaoService.obterEstatisticasBarbearia(barbeariaId);

      // Assert
      expect(resultado.total_avaliacoes).toBe(3);
      expect(resultado.media_rating).toBe(4.67);
      expect(resultado.rating_5).toBe(2);
      expect(resultado.por_categoria).toEqual({
        atendimento: 2,
        qualidade: 1
      });
    });
  });

  describe('obterEstatisticasBarbeiro', () => {
    it('deve retornar estatísticas do barbeiro', async () => {
      // Arrange
      const barbeiroId = 'user-123';
      const mockAvaliacoes = [
        { rating: 5, categoria: 'atendimento' },
        { rating: 4, categoria: 'qualidade' }
      ];

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ data: mockAvaliacoes, error: null })
          })
        })
      });

      // Act
      const resultado = await avaliacaoService.obterEstatisticasBarbeiro(barbeiroId);

      // Assert
      expect(resultado.total_avaliacoes).toBe(2);
      expect(resultado.media_rating).toBe(4.5);
      expect(resultado.rating_5).toBe(1);
      expect(resultado.rating_4).toBe(1);
      expect(resultado.por_categoria).toEqual({
        atendimento: 1,
        qualidade: 1
      });
    });
  });
}); 