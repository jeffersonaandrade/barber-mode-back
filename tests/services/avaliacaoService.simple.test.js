const AvaliacaoService = require('../../src/services/avaliacaoService');
const { createSupabaseMock } = require('../mocks/supabaseMock');

describe('AvaliacaoService - Testes Completos', () => {
  let avaliacaoService;
  let mockSupabase;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Criar mock do Supabase
    mockSupabase = createSupabaseMock();
    
    // Criar instância do AvaliacaoService
    avaliacaoService = new AvaliacaoService(mockSupabase);
  });

  describe('enviarAvaliacao', () => {
    it('deve falhar quando cliente_id está faltando', async () => {
      // Arrange
      const avaliacaoData = {
        barbearia_id: 'barbearia-001',
        rating: 5
      };

      // Act & Assert
      await expect(avaliacaoService.enviarAvaliacao(avaliacaoData))
        .rejects
        .toThrow('Cliente ID, barbearia ID e rating são obrigatórios');
    });

    it('deve falhar quando barbearia_id está faltando', async () => {
      // Arrange
      const avaliacaoData = {
        cliente_id: 'user-001',
        rating: 5
      };

      // Act & Assert
      await expect(avaliacaoService.enviarAvaliacao(avaliacaoData))
        .rejects
        .toThrow('Cliente ID, barbearia ID e rating são obrigatórios');
    });

    it('deve falhar quando rating está faltando', async () => {
      // Arrange
      const avaliacaoData = {
        cliente_id: 'user-001',
        barbearia_id: 'barbearia-001'
      };

      // Act & Assert
      await expect(avaliacaoService.enviarAvaliacao(avaliacaoData))
        .rejects
        .toThrow('Cliente ID, barbearia ID e rating são obrigatórios');
    });

    it('deve falhar quando rating é menor que 1', async () => {
      // Arrange
      const avaliacaoData = {
        cliente_id: 'user-001',
        barbearia_id: 'barbearia-001',
        rating: 0
      };

      // Act & Assert
      await expect(avaliacaoService.enviarAvaliacao(avaliacaoData))
        .rejects
        .toThrow('Rating deve estar entre 1 e 5');
    });

    it('deve falhar quando rating é maior que 5', async () => {
      // Arrange
      const avaliacaoData = {
        cliente_id: 'user-001',
        barbearia_id: 'barbearia-001',
        rating: 6
      };

      // Act & Assert
      await expect(avaliacaoService.enviarAvaliacao(avaliacaoData))
        .rejects
        .toThrow('Rating deve estar entre 1 e 5');
    });

    it('deve falhar quando cliente não foi atendido', async () => {
      // Arrange
      const avaliacaoData = {
        cliente_id: 'cliente-inexistente',
        barbearia_id: 'barbearia-001',
        rating: 5
      };

      // Act & Assert
      await expect(avaliacaoService.enviarAvaliacao(avaliacaoData))
        .rejects
        .toThrow('Cliente não encontrado ou não foi atendido');
    });

    it('deve falhar quando cliente já avaliou', async () => {
      // Arrange
      const avaliacaoData = {
        cliente_id: 'user-001', // Cliente que já tem avaliação no mock
        barbearia_id: 'barbearia-001',
        rating: 5
      };

      // Act & Assert
      await expect(avaliacaoService.enviarAvaliacao(avaliacaoData))
        .rejects
        .toThrow('Cliente já avaliou este atendimento');
    });
  });

  describe('verificarClienteAtendido', () => {
    it('deve retornar null quando cliente não foi atendido', async () => {
      // Arrange
      const cliente_id = 'cliente-inexistente';
      const barbearia_id = 'barbearia-001';

      // Act
      const result = await avaliacaoService.verificarClienteAtendido(cliente_id, barbearia_id);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('verificarAvaliacaoExistente', () => {
    it('deve retornar true quando avaliação já existe', async () => {
      // Arrange
      const cliente_id = 'user-001'; // Cliente que já tem avaliação no mock

      // Act
      const result = await avaliacaoService.verificarAvaliacaoExistente(cliente_id);

      // Assert
      expect(result).toBe(true);
    });

    it('deve retornar false quando avaliação não existe', async () => {
      // Arrange
      const cliente_id = 'cliente-sem-avaliacao';

      // Act
      const result = await avaliacaoService.verificarAvaliacaoExistente(cliente_id);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('calcularEstatisticas', () => {
    it('deve calcular estatísticas corretamente', () => {
      // Arrange
      const avaliacoes = [
        { rating: 5 },
        { rating: 4 },
        { rating: 3 },
        { rating: 5 },
        { rating: 2 }
      ];

      // Act
      const result = avaliacaoService.calcularEstatisticas(avaliacoes);

      // Assert
      expect(result).toHaveProperty('total', 5);
      expect(result).toHaveProperty('media_rating', 3.8);
      expect(result).toHaveProperty('por_rating');
      expect(result.por_rating).toHaveProperty('5', 2);
      expect(result.por_rating).toHaveProperty('4', 1);
      expect(result.por_rating).toHaveProperty('3', 1);
      expect(result.por_rating).toHaveProperty('2', 1);
      expect(result.por_rating).toHaveProperty('1', 0);
    });

    it('deve calcular estatísticas com lista vazia', () => {
      // Arrange
      const avaliacoes = [];

      // Act
      const result = avaliacaoService.calcularEstatisticas(avaliacoes);

      // Assert
      expect(result).toHaveProperty('total', 0);
      expect(result).toHaveProperty('media_rating', 0);
      expect(result).toHaveProperty('por_rating');
    });

    it('deve calcular estatísticas com uma avaliação', () => {
      // Arrange
      const avaliacoes = [{ rating: 5 }];

      // Act
      const result = avaliacaoService.calcularEstatisticas(avaliacoes);

      // Assert
      expect(result).toHaveProperty('total', 1);
      expect(result).toHaveProperty('media_rating', 5);
      expect(result.por_rating).toHaveProperty('5', 1);
    });
  });

  describe('obterEstatisticasBarbearia', () => {
    it('deve obter estatísticas da barbearia com sucesso', async () => {
      // Arrange
      const barbearia_id = 'barbearia-001';

      // Act
      const result = await avaliacaoService.obterEstatisticasBarbearia(barbearia_id);

      // Assert
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('media_rating');
      expect(result).toHaveProperty('por_rating');
      expect(result).toHaveProperty('por_categoria');
    });

    it('deve falhar quando Supabase retorna erro', async () => {
      // Arrange
      const barbearia_id = 'barbearia-001';

      // Mock erro do Supabase
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ 
            data: null, 
            error: { message: 'Erro de conexão' } 
          })
        })
      });

      // Act & Assert
      await expect(avaliacaoService.obterEstatisticasBarbearia(barbearia_id))
        .rejects
        .toThrow('Erro ao obter estatísticas da barbearia');
    });
  });

  describe('obterEstatisticasBarbeiro', () => {
    it('deve obter estatísticas do barbeiro com sucesso', async () => {
      // Arrange
      const barbeiro_id = 'barbeiro-001';

      // Act
      const result = await avaliacaoService.obterEstatisticasBarbeiro(barbeiro_id);

      // Assert
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('media_rating');
      expect(result).toHaveProperty('por_rating');
    });

    it('deve falhar quando Supabase retorna erro', async () => {
      // Arrange
      const barbeiro_id = 'barbeiro-001';

      // Mock erro do Supabase
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ 
            data: null, 
            error: { message: 'Erro de conexão' } 
          })
        })
      });

      // Act & Assert
      await expect(avaliacaoService.obterEstatisticasBarbeiro(barbeiro_id))
        .rejects
        .toThrow('Erro ao obter estatísticas do barbeiro');
    });
  });

  describe('Validações de entrada', () => {
    it('deve validar cliente_id nulo', async () => {
      // Arrange
      const avaliacaoData = {
        cliente_id: null,
        barbearia_id: 'barbearia-001',
        rating: 5
      };

      // Act & Assert
      await expect(avaliacaoService.enviarAvaliacao(avaliacaoData))
        .rejects
        .toThrow('Cliente ID, barbearia ID e rating são obrigatórios');
    });

    it('deve validar barbearia_id nulo', async () => {
      // Arrange
      const avaliacaoData = {
        cliente_id: 'user-001',
        barbearia_id: null,
        rating: 5
      };

      // Act & Assert
      await expect(avaliacaoService.enviarAvaliacao(avaliacaoData))
        .rejects
        .toThrow('Cliente ID, barbearia ID e rating são obrigatórios');
    });

    it('deve validar rating nulo', async () => {
      // Arrange
      const avaliacaoData = {
        cliente_id: 'user-001',
        barbearia_id: 'barbearia-001',
        rating: null
      };

      // Act & Assert
      await expect(avaliacaoService.enviarAvaliacao(avaliacaoData))
        .rejects
        .toThrow('Cliente ID, barbearia ID e rating são obrigatórios');
    });
  });

  describe('Cenários de erro', () => {
    it('deve lidar com erro genérico no enviarAvaliacao', async () => {
      // Arrange
      const avaliacaoData = {
        cliente_id: 'user-001',
        barbearia_id: 'barbearia-001',
        rating: 5
      };

      // Mock erro genérico
      mockSupabase.from.mockImplementation(() => {
        throw new Error('Erro genérico');
      });

      // Act & Assert
      await expect(avaliacaoService.enviarAvaliacao(avaliacaoData))
        .rejects
        .toThrow('Erro ao enviar avaliação');
    });
  });
}); 