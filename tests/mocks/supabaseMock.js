/**
 * Mock completo do Supabase para testes
 * Simula todos os métodos e comportamentos do Supabase
 */

const createSupabaseMock = () => {
  const mockData = {
    users: [
      {
        id: 'user-001',
        email: 'test@example.com',
        nome: 'Usuário Teste',
        role: 'cliente',
        active: true,
        created_at: new Date().toISOString()
      }
    ],
    barbearias: [
      {
        id: 'barbearia-001',
        nome: 'Barbearia Teste',
        endereco: 'Rua Teste, 123',
        telefone: '(11) 1234-5678',
        active: true,
        created_at: new Date().toISOString()
      }
    ],
    fila: [
      {
        id: 'fila-001',
        cliente_id: 'user-001',
        barbearia_id: 'barbearia-001',
        barbeiro_id: null,
        tipo_fila: 'geral',
        status: 'aguardando',
        posicao: 1,
        created_at: new Date().toISOString()
      }
    ],
    avaliacoes: [
      {
        id: 'avaliacao-001',
        cliente_id: 'user-001',
        barbearia_id: 'barbearia-001',
        barbeiro_id: 'barbeiro-001',
        rating: 5,
        categoria: 'corte',
        comentario: 'Excelente atendimento',
        created_at: new Date().toISOString()
      }
    ],
    historico: [
      {
        id: 'historico-001',
        cliente_id: 'user-001',
        barbearia_id: 'barbearia-001',
        barbeiro_id: 'barbeiro-001',
        status: 'finalizado',
        created_at: new Date().toISOString()
      }
    ]
  };

  // Função para simular delay de rede
  const simulateNetworkDelay = () => new Promise(resolve => setTimeout(resolve, 10));

  // Função para simular erro
  const simulateError = (message) => {
    const error = new Error(message);
    error.code = 'TEST_ERROR';
    return error;
  };

  // Função para buscar dados
  const findData = (table, filters = {}) => {
    let data = mockData[table] || [];
    
    Object.keys(filters).forEach(key => {
      data = data.filter(item => item[key] === filters[key]);
    });
    
    return data;
  };

  // Função para inserir dados
  const insertData = (table, newData) => {
    const id = `${table}-${Date.now()}`;
    const data = {
      id,
      ...newData,
      created_at: newData.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    if (!mockData[table]) {
      mockData[table] = [];
    }
    
    mockData[table].push(data);
    return data;
  };

  // Função para atualizar dados
  const updateData = (table, filters, updates) => {
    const data = findData(table, filters);
    if (data.length === 0) {
      throw simulateError('Registro não encontrado');
    }
    
    Object.assign(data[0], updates, { updated_at: new Date().toISOString() });
    return data[0];
  };

  // Função para deletar dados
  const deleteData = (table, filters) => {
    const data = findData(table, filters);
    if (data.length === 0) {
      throw simulateError('Registro não encontrado');
    }
    
    const index = mockData[table].findIndex(item => 
      Object.keys(filters).every(key => item[key] === filters[key])
    );
    
    mockData[table].splice(index, 1);
    return { success: true };
  };

  // Criar mock do Supabase
  const mockSupabase = {
    from: jest.fn().mockImplementation((table) => {
      let currentQuery = {
        table,
        selectColumns: '*',
        filters: {},
        orderBy: null,
        limitCount: null,
        inValues: null
      };

      const queryBuilder = {
        // SELECT
        select: jest.fn().mockImplementation((columns = '*') => {
          currentQuery.selectColumns = columns;
          return queryBuilder;
        }),

        // WHERE
        eq: jest.fn().mockImplementation((column, value) => {
          currentQuery.filters[column] = value;
          return queryBuilder;
        }),

        // IN
        in: jest.fn().mockImplementation((column, values) => {
          currentQuery.inValues = { column, values };
          return queryBuilder;
        }),

        // ORDER
        order: jest.fn().mockImplementation((column, options = {}) => {
          currentQuery.orderBy = { column, options };
          return queryBuilder;
        }),

        // LIMIT
        limit: jest.fn().mockImplementation((count) => {
          currentQuery.limitCount = count;
          return queryBuilder;
        }),

        // SINGLE
        single: jest.fn().mockImplementation(async () => {
          await simulateNetworkDelay();
          
          let data = findData(table, currentQuery.filters);
          
          // Aplicar filtro IN se especificado
          if (currentQuery.inValues) {
            data = data.filter(item => 
              currentQuery.inValues.values.includes(item[currentQuery.inValues.column])
            );
          }
          
          // Aplicar ordenação se especificada
          if (currentQuery.orderBy) {
            data = data.sort((a, b) => {
              const aVal = a[currentQuery.orderBy.column];
              const bVal = b[currentQuery.orderBy.column];
              
              if (currentQuery.orderBy.options.ascending === false) {
                return bVal > aVal ? 1 : -1;
              }
              return aVal > bVal ? 1 : -1;
            });
          }
          
          // Aplicar limite se especificado
          if (currentQuery.limitCount) {
            data = data.slice(0, currentQuery.limitCount);
          }
          
          return { 
            data: data[0] || null, 
            error: data[0] ? null : simulateError('Registro não encontrado') 
          };
        }),

        // INSERT
        insert: jest.fn().mockImplementation(async (data) => {
          await simulateNetworkDelay();
          const newData = insertData(table, data);
          return { data: newData, error: null };
        }),

        // UPDATE
        update: jest.fn().mockImplementation(async (updates) => {
          await simulateNetworkDelay();
          const updatedData = updateData(table, currentQuery.filters, updates);
          return { data: updatedData, error: null };
        }),

        // DELETE
        delete: jest.fn().mockImplementation(async () => {
          await simulateNetworkDelay();
          const result = deleteData(table, currentQuery.filters);
          return { data: result, error: null };
        })
      };

      return queryBuilder;
    })
  };

  return mockSupabase;
};

module.exports = { createSupabaseMock }; 