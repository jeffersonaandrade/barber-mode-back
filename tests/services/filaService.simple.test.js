const FilaService = require('../../src/services/filaService');

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

describe('FilaService - Testes Melhorados', () => {
  let filaService;
  let mockSupabase;

  beforeEach(() => {
    mockSupabase = createMockSupabase();
    filaService = new FilaService(mockSupabase);
  });

  describe('adicionarClienteNaFila', () => {
    it('deve validar dados obrigatórios - nome', async () => {
      const dadosCliente = {
        telefone: '11999999999',
        barbearia_id: 1
      };

      await expect(filaService.adicionarClienteNaFila(dadosCliente))
        .rejects.toThrow('Dados obrigatórios estão faltando');
    });

    it('deve validar dados obrigatórios - telefone', async () => {
      const dadosCliente = {
        nome: 'João Silva',
        barbearia_id: 1
      };

      await expect(filaService.adicionarClienteNaFila(dadosCliente))
        .rejects.toThrow('Dados obrigatórios estão faltando');
    });

    it('deve validar dados obrigatórios - barbearia_id', async () => {
      const dadosCliente = {
        nome: 'João Silva',
        telefone: '11999999999'
      };

      await expect(filaService.adicionarClienteNaFila(dadosCliente))
        .rejects.toThrow('Dados obrigatórios estão faltando');
    });

    it('deve validar barbearia_id nulo', async () => {
      const dadosCliente = {
        nome: 'João Silva',
        telefone: '11999999999',
        barbearia_id: null
      };

      await expect(filaService.adicionarClienteNaFila(dadosCliente))
        .rejects.toThrow('Barbearia ID é obrigatório');
    });

    it('deve validar barbearia_id zero', async () => {
      const dadosCliente = {
        nome: 'João Silva',
        telefone: '11999999999',
        barbearia_id: 0
      };

      await expect(filaService.adicionarClienteNaFila(dadosCliente))
        .rejects.toThrow('Barbearia ID é obrigatório');
    });

    it('deve validar barbearia_id negativo', async () => {
      const dadosCliente = {
        nome: 'João Silva',
        telefone: '11999999999',
        barbearia_id: -1
      };

      await expect(filaService.adicionarClienteNaFila(dadosCliente))
        .rejects.toThrow('Barbearia ID é obrigatório');
    });

    it('deve validar barbearia não encontrada', async () => {
      const dadosCliente = {
        nome: 'João Silva',
        telefone: '11999999999',
        barbearia_id: 999
      };

      // Mock para barbearia não encontrada
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } })
            })
          })
        })
      });

      await expect(filaService.adicionarClienteNaFila(dadosCliente))
        .rejects.toThrow('Barbearia não encontrada ou inativa');
    });

    it('deve validar barbearia inativa', async () => {
      const dadosCliente = {
        nome: 'João Silva',
        telefone: '11999999999',
        barbearia_id: 1
      };

      // Mock para barbearia inativa
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ 
                data: { id: 1, nome: 'Barbearia Teste', ativo: false }, 
                error: null 
              })
            })
          })
        })
      });

      await expect(filaService.adicionarClienteNaFila(dadosCliente))
        .rejects.toThrow('Barbearia não encontrada ou inativa');
    });
  });

  describe('chamarProximoCliente', () => {
    it('deve validar barbearia_id nulo', async () => {
      await expect(filaService.chamarProximoCliente(null))
        .rejects.toThrow('Barbearia ID é obrigatório');
    });

    it('deve validar barbearia_id zero', async () => {
      await expect(filaService.chamarProximoCliente(0))
        .rejects.toThrow('Barbearia ID é obrigatório');
    });

    it('deve validar barbearia_id negativo', async () => {
      await expect(filaService.chamarProximoCliente(-1))
        .rejects.toThrow('Barbearia ID é obrigatório');
    });

    it('deve validar barbearia não encontrada', async () => {
      // Mock para barbearia não encontrada
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } })
          })
        })
      });

      await expect(filaService.chamarProximoCliente(999))
        .rejects.toThrow('Barbearia não encontrada');
    });
  });

  describe('verificarStatusCliente', () => {
    it('deve validar token nulo', async () => {
      await expect(filaService.verificarStatusCliente(null))
        .rejects.toThrow('Token é obrigatório');
    });

    it('deve validar token vazio', async () => {
      await expect(filaService.verificarStatusCliente(''))
        .rejects.toThrow('Token é obrigatório');
    });

    it('deve validar token com espaços', async () => {
      await expect(filaService.verificarStatusCliente('   '))
        .rejects.toThrow('Token é obrigatório');
    });

    it('deve validar cliente não encontrado', async () => {
      // Mock para cliente não encontrado
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } })
          })
        })
      });

      await expect(filaService.verificarStatusCliente('token-invalido'))
        .rejects.toThrow('Cliente não encontrado');
    });
  });

  describe('obterFilaCompleta', () => {
    it('deve retornar estrutura correta com clientes', async () => {
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
      expect(resultado.clientes).toHaveLength(2);
    });

    it('deve retornar estrutura correta sem clientes', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ data: [], error: null })
          })
        })
      });

      const resultado = await filaService.obterFilaCompleta(1);

      expect(resultado).toHaveProperty('clientes');
      expect(resultado).toHaveProperty('estatisticas');
      expect(Array.isArray(resultado.clientes)).toBe(true);
      expect(resultado.clientes).toHaveLength(0);
    });
  });
}); 