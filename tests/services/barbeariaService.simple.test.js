const BarbeariaService = require('../../src/services/barbeariaService');

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

describe('BarbeariaService - Testes Melhorados', () => {
  let barbeariaService;
  let mockSupabase;

  beforeEach(() => {
    mockSupabase = createMockSupabase();
    barbeariaService = new BarbeariaService(mockSupabase);
  });

  describe('criarBarbearia', () => {
    it('deve validar dados obrigatórios - nome', async () => {
      const dadosBarbearia = {
        endereco: 'Rua Teste, 123',
        telefone: '11999999999',
        proprietario_id: 1
      };

      await expect(barbeariaService.criarBarbearia(dadosBarbearia))
        .rejects.toThrow('Dados obrigatórios estão faltando');
    });

    it('deve validar dados obrigatórios - endereco', async () => {
      const dadosBarbearia = {
        nome: 'Barbearia Teste',
        telefone: '11999999999',
        proprietario_id: 1
      };

      await expect(barbeariaService.criarBarbearia(dadosBarbearia))
        .rejects.toThrow('Dados obrigatórios estão faltando');
    });

    it('deve validar dados obrigatórios - telefone', async () => {
      const dadosBarbearia = {
        nome: 'Barbearia Teste',
        endereco: 'Rua Teste, 123',
        proprietario_id: 1
      };

      await expect(barbeariaService.criarBarbearia(dadosBarbearia))
        .rejects.toThrow('Dados obrigatórios estão faltando');
    });

    it('deve validar dados obrigatórios - proprietario_id', async () => {
      const dadosBarbearia = {
        nome: 'Barbearia Teste',
        endereco: 'Rua Teste, 123',
        telefone: '11999999999'
      };

      await expect(barbeariaService.criarBarbearia(dadosBarbearia))
        .rejects.toThrow('Dados obrigatórios estão faltando');
    });

    it('deve validar proprietario_id nulo', async () => {
      const dadosBarbearia = {
        nome: 'Barbearia Teste',
        endereco: 'Rua Teste, 123',
        telefone: '11999999999',
        proprietario_id: null
      };

      await expect(barbeariaService.criarBarbearia(dadosBarbearia))
        .rejects.toThrow('Proprietário ID é obrigatório');
    });

    it('deve validar proprietario_id zero', async () => {
      const dadosBarbearia = {
        nome: 'Barbearia Teste',
        endereco: 'Rua Teste, 123',
        telefone: '11999999999',
        proprietario_id: 0
      };

      await expect(barbeariaService.criarBarbearia(dadosBarbearia))
        .rejects.toThrow('Proprietário ID é obrigatório');
    });

    it('deve validar telefone inválido', async () => {
      const dadosBarbearia = {
        nome: 'Barbearia Teste',
        endereco: 'Rua Teste, 123',
        telefone: 'telefone-invalido',
        proprietario_id: 1
      };

      await expect(barbeariaService.criarBarbearia(dadosBarbearia))
        .rejects.toThrow('Telefone inválido');
    });
  });

  describe('atualizarBarbearia', () => {
    it('deve validar ID nulo', async () => {
      const dadosBarbearia = {
        nome: 'Barbearia Atualizada'
      };

      await expect(barbeariaService.atualizarBarbearia(null, dadosBarbearia))
        .rejects.toThrow('ID é obrigatório');
    });

    it('deve validar ID zero', async () => {
      const dadosBarbearia = {
        nome: 'Barbearia Atualizada'
      };

      await expect(barbeariaService.atualizarBarbearia(0, dadosBarbearia))
        .rejects.toThrow('ID é obrigatório');
    });

    it('deve validar dados vazios', async () => {
      await expect(barbeariaService.atualizarBarbearia(1, {}))
        .rejects.toThrow('Dados para atualização são obrigatórios');
    });

    it('deve validar telefone inválido', async () => {
      const dadosBarbearia = {
        telefone: 'telefone-invalido'
      };

      await expect(barbeariaService.atualizarBarbearia(1, dadosBarbearia))
        .rejects.toThrow('Telefone inválido');
    });
  });

  describe('deletarBarbearia', () => {
    it('deve validar ID nulo', async () => {
      await expect(barbeariaService.deletarBarbearia(null))
        .rejects.toThrow('ID é obrigatório');
    });

    it('deve validar ID zero', async () => {
      await expect(barbeariaService.deletarBarbearia(0))
        .rejects.toThrow('ID é obrigatório');
    });

    it('deve validar ID negativo', async () => {
      await expect(barbeariaService.deletarBarbearia(-1))
        .rejects.toThrow('ID é obrigatório');
    });
  });

  describe('obterBarbeariaPorId', () => {
    it('deve validar ID nulo', async () => {
      await expect(barbeariaService.obterBarbeariaPorId(null))
        .rejects.toThrow('ID é obrigatório');
    });

    it('deve validar ID zero', async () => {
      await expect(barbeariaService.obterBarbeariaPorId(0))
        .rejects.toThrow('ID é obrigatório');
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

      await expect(barbeariaService.obterBarbeariaPorId(999))
        .rejects.toThrow('Barbearia não encontrada');
    });
  });

  describe('listarBarbearias', () => {
    it('deve validar proprietario_id nulo', async () => {
      await expect(barbeariaService.listarBarbearias({ proprietario_id: null }))
        .rejects.toThrow('Proprietário ID é obrigatório');
    });

    it('deve validar proprietario_id zero', async () => {
      await expect(barbeariaService.listarBarbearias({ proprietario_id: 0 }))
        .rejects.toThrow('Proprietário ID é obrigatório');
    });

    it('deve validar status inválido', async () => {
      await expect(barbeariaService.listarBarbearias({ 
        proprietario_id: 1, 
        status: 'status-invalido' 
      }))
        .rejects.toThrow('Status inválido');
    });
  });

  describe('ativarBarbearia', () => {
    it('deve validar ID nulo', async () => {
      await expect(barbeariaService.ativarBarbearia(null))
        .rejects.toThrow('ID é obrigatório');
    });

    it('deve validar ID zero', async () => {
      await expect(barbeariaService.ativarBarbearia(0))
        .rejects.toThrow('ID é obrigatório');
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

      await expect(barbeariaService.ativarBarbearia(999))
        .rejects.toThrow('Barbearia não encontrada');
    });
  });

  describe('desativarBarbearia', () => {
    it('deve validar ID nulo', async () => {
      await expect(barbeariaService.desativarBarbearia(null))
        .rejects.toThrow('ID é obrigatório');
    });

    it('deve validar ID zero', async () => {
      await expect(barbeariaService.desativarBarbearia(0))
        .rejects.toThrow('ID é obrigatório');
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

      await expect(barbeariaService.desativarBarbearia(999))
        .rejects.toThrow('Barbearia não encontrada');
    });
  });
}); 