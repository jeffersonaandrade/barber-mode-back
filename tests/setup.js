/**
 * Setup de testes para o projeto Barber Mode Backend
 * 
 * Este arquivo configura o ambiente de testes, incluindo:
 * - Mocks globais
 * - Configurações de ambiente
 * - Helpers de teste
 */

// Configurar variáveis de ambiente para teste
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_ANON_KEY = 'test-anon-key';

// Mock do console para reduzir output durante testes
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock do Supabase
jest.mock('@supabase/supabase-js', () => {
  const mockSupabase = {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null })),
          order: jest.fn(() => Promise.resolve({ data: [], error: null }))
        })),
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: null, error: null }))
          }))
        })),
        update: jest.fn(() => ({
          eq: jest.fn(() => ({
            select: jest.fn(() => ({
              single: jest.fn(() => Promise.resolve({ data: null, error: null }))
            }))
          }))
        })),
        delete: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({ data: null, error: null }))
        }))
      }))
    }))
  };

  return {
    createClient: jest.fn(() => mockSupabase)
  };
});

// Mock do QRCode
jest.mock('qrcode', () => ({
  toDataURL: jest.fn(() => Promise.resolve('data:image/png;base64,mock-qr-code')),
  toString: jest.fn(() => Promise.resolve('mock-qr-code-string'))
}));

// Mock do bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn(() => Promise.resolve('hashed-password')),
  compare: jest.fn(() => Promise.resolve(true))
}));

// Mock do moment
jest.mock('moment', () => {
  const mockMoment = (date) => ({
    format: jest.fn(() => '2024-01-01T00:00:00Z'),
    toISOString: jest.fn(() => '2024-01-01T00:00:00Z'),
    add: jest.fn(() => mockMoment()),
    subtract: jest.fn(() => mockMoment()),
    isBefore: jest.fn(() => false),
    isAfter: jest.fn(() => true),
    diff: jest.fn(() => 0)
  });
  
  mockMoment.utc = jest.fn(() => mockMoment());
  mockMoment.now = jest.fn(() => 1704067200000);
  
  return mockMoment;
});

// Helper para criar dados de teste
global.createTestData = {
  // Dados de barbearia
  barbearia: {
    id: 1,
    nome: 'Barbearia Teste',
    endereco: 'Rua Teste, 123',
    telefone: '(11) 99999-9999',
    ativo: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },

  // Dados de usuário
  user: {
    id: 'user-123',
    nome: 'João Silva',
    email: 'joao@teste.com',
    role: 'barbeiro',
    ativo: true,
    created_at: '2024-01-01T00:00:00Z'
  },

  // Dados de cliente
  cliente: {
    id: 'cliente-123',
    nome: 'Pedro Santos',
    telefone: '(11) 88888-8888',
    barbearia_id: 1,
    barbeiro_id: 'user-123',
    status: 'aguardando',
    posicao: 1,
    token: 'token-123',
    qr_code_publico: 'qr-publico-123',
    qr_code_privado: 'qr-privado-123',
    created_at: '2024-01-01T00:00:00Z'
  },

  // Dados de avaliação
  avaliacao: {
    id: 'avaliacao-123',
    cliente_id: 'cliente-123',
    barbearia_id: 1,
    barbeiro_id: 'user-123',
    rating: 5,
    categoria: 'atendimento',
    comentario: 'Excelente atendimento!',
    created_at: '2024-01-01T00:00:00Z'
  }
};

// Helper para criar mocks do Supabase
global.createSupabaseMock = (returnData = null, returnError = null) => {
  return {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: returnData, error: returnError })),
          order: jest.fn(() => Promise.resolve({ data: returnData || [], error: returnError }))
        })),
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: returnData, error: returnError }))
          }))
        })),
        update: jest.fn(() => ({
          eq: jest.fn(() => ({
            select: jest.fn(() => ({
              single: jest.fn(() => Promise.resolve({ data: returnData, error: returnError }))
            }))
          }))
        })),
        delete: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({ data: returnData, error: returnError }))
        }))
      }))
    }))
  };
};

// Helper para limpar mocks entre testes
global.clearMocks = () => {
  jest.clearAllMocks();
};

// Configurar timeout global
jest.setTimeout(10000); 