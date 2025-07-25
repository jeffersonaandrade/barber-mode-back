// @ts-nocheck
const FilaService = require('../../src/services/filaService');

// Mock simples do Supabase
const createMockSupabase = () => ({
  from: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnValue({
      eq: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({ data: [], error: null })
        })
      })
    }),
    insert: jest.fn().mockResolvedValue({ data: null, error: null }),
    update: jest.fn().mockResolvedValue({ data: null, error: null }),
    delete: jest.fn().mockResolvedValue({ data: null, error: null })
  })
});

describe('FilaService - Testes Simplificados', () => {
  let filaService;
  let mockSupabase;

  beforeEach(() => {
    mockSupabase = createMockSupabase();
    filaService = new FilaService(mockSupabase);
  });

  describe('adicionarClienteNaFila', () => {
    it('deve validar dados obrigatórios', async () => {
      // Teste sem dados
      await expect(filaService.adicionarClienteNaFila({}))
        .rejects.toThrow('Dados obrigatórios estão faltando');

      // Teste com dados incompletos
      await expect(filaService.adicionarClienteNaFila({ nome: 'João' }))
        .rejects.toThrow('Dados obrigatórios estão faltando');
    });

    it('deve validar barbearia_id', async () => {
      const dadosCliente = {
        nome: 'João Silva',
        telefone: '11999999999',
        barbearia_id: null
      };

      await expect(filaService.adicionarClienteNaFila(dadosCliente))
        .rejects.toThrow('Barbearia ID é obrigatório');
    });
  });

  describe('obterFilaCompleta', () => {
    it('deve retornar estrutura correta', async () => {
      const mockFila = [
        { id: 1, nome: 'João', status: 'aguardando' },
        { id: 2, nome: 'Maria', status: 'aguardando' }
      ];

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ data: mockFila, error: null })
          })
        })
      });

      const resultado = await filaService.obterFilaCompleta(1);

      expect(resultado).toHaveProperty('clientes');
      expect(resultado).toHaveProperty('estatisticas');
      expect(Array.isArray(resultado.clientes)).toBe(true);
    });
  });

  describe('chamarProximoCliente', () => {
    it('deve validar barbearia_id', async () => {
      await expect(filaService.chamarProximoCliente(null))
        .rejects.toThrow('Barbearia ID é obrigatório');

      await expect(filaService.chamarProximoCliente(0))
        .rejects.toThrow('Barbearia ID é obrigatório');
    });
  });

  describe('verificarStatusCliente', () => {
    it('deve validar token', async () => {
      await expect(filaService.verificarStatusCliente(null))
        .rejects.toThrow('Token é obrigatório');

      await expect(filaService.verificarStatusCliente(''))
        .rejects.toThrow('Token é obrigatório');
    });
  });
}); 