/**
 * Testes de integração para rotas de fila
 * 
 * Testa os endpoints de fila:
 * - POST /api/fila/entrar
 * - GET /api/fila/visualizar
 * - POST /api/fila/gerenciar/proximo
 * - GET /api/fila/status/:token
 */

const { test } = require('tap');
const Fastify = require('fastify');
const FilaService = require('../../src/services/filaService');

// Mock do FilaService
jest.mock('../../src/services/filaService');

test('Rotas de Fila', async (t) => {
  let fastify;

  t.beforeEach(async () => {
    // Criar instância do Fastify para cada teste
    fastify = Fastify();
    
    // Mock do Supabase
    fastify.decorate('supabase', createSupabaseMock());
    
    // Mock do authenticate middleware
    fastify.decorate('authenticate', async (request, reply) => {
      request.user = { id: 'user-123', role: 'barbeiro' };
    });

    // Registrar rotas de fila
    await fastify.register(require('../../src/routes/fila/index'));
  });

  t.afterEach(async () => {
    await fastify.close();
  });

  t.test('POST /api/fila/entrar - deve adicionar cliente na fila', async (t) => {
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

    // Mock do FilaService
    FilaService.prototype.adicionarClienteNaFila = jest.fn().mockResolvedValue(mockCliente);

    // Act
    const response = await fastify.inject({
      method: 'POST',
      url: '/api/fila/entrar',
      payload: clienteData
    });

    // Assert
    t.equal(response.statusCode, 200);
    const result = JSON.parse(response.payload);
    t.equal(result.success, true);
    t.equal(result.data.nome, 'João Silva');
    t.ok(FilaService.prototype.adicionarClienteNaFila.calledWith(clienteData));
  });

  t.test('POST /api/fila/entrar - deve retornar erro quando dados inválidos', async (t) => {
    // Arrange
    const clienteData = {
      nome: 'João Silva'
      // dados obrigatórios faltando
    };

    // Mock do FilaService
    FilaService.prototype.adicionarClienteNaFila = jest.fn().mockRejectedValue(
      new Error('Nome, telefone e barbearia_id são obrigatórios')
    );

    // Act
    const response = await fastify.inject({
      method: 'POST',
      url: '/api/fila/entrar',
      payload: clienteData
    });

    // Assert
    t.equal(response.statusCode, 400);
    const result = JSON.parse(response.payload);
    t.equal(result.success, false);
    t.equal(result.message, 'Nome, telefone e barbearia_id são obrigatórios');
  });

  t.test('GET /api/fila/visualizar - deve retornar fila completa', async (t) => {
    // Arrange
    const barbeariaId = 1;
    const mockFila = {
      clientes: [
        { ...createTestData.cliente, status: 'aguardando', posicao: 1 },
        { ...createTestData.cliente, id: 'cliente-456', status: 'aguardando', posicao: 2 }
      ],
      estatisticas: {
        total_aguardando: 2,
        total_proximo: 0,
        total_atendendo: 0,
        tempo_medio_espera: 15
      }
    };

    // Mock do FilaService
    FilaService.prototype.obterFilaCompleta = jest.fn().mockResolvedValue(mockFila);

    // Act
    const response = await fastify.inject({
      method: 'GET',
      url: `/api/fila/visualizar?barbearia_id=${barbeariaId}`
    });

    // Assert
    t.equal(response.statusCode, 200);
    const result = JSON.parse(response.payload);
    t.equal(result.success, true);
    t.equal(result.data.clientes.length, 2);
    t.equal(result.data.estatisticas.total_aguardando, 2);
  });

  t.test('GET /api/fila/visualizar - deve retornar estatísticas públicas', async (t) => {
    // Arrange
    const barbeariaId = 1;
    const mockEstatisticas = {
      total_aguardando: 3,
      tempo_medio_espera: 20
    };

    // Mock do FilaService
    FilaService.prototype.obterEstatisticasFila = jest.fn().mockResolvedValue(mockEstatisticas);

    // Act
    const response = await fastify.inject({
      method: 'GET',
      url: `/api/fila/visualizar?barbearia_id=${barbeariaId}&public=true`
    });

    // Assert
    t.equal(response.statusCode, 200);
    const result = JSON.parse(response.payload);
    t.equal(result.success, true);
    t.equal(result.data.total_aguardando, 3);
    t.equal(result.data.tempo_medio_espera, 20);
  });

  t.test('POST /api/fila/gerenciar/proximo - deve chamar próximo cliente', async (t) => {
    // Arrange
    const dados = {
      barbearia_id: 1,
      user_id: 'user-123'
    };

    const mockProximoCliente = {
      ...createTestData.cliente,
      status: 'proximo',
      posicao: 1
    };

    // Mock do FilaService
    FilaService.prototype.chamarProximoCliente = jest.fn().mockResolvedValue(mockProximoCliente);

    // Act
    const response = await fastify.inject({
      method: 'POST',
      url: '/api/fila/gerenciar/proximo',
      payload: dados,
      headers: {
        authorization: 'Bearer mock-token'
      }
    });

    // Assert
    t.equal(response.statusCode, 200);
    const result = JSON.parse(response.payload);
    t.equal(result.success, true);
    t.equal(result.data.status, 'proximo');
    t.ok(FilaService.prototype.chamarProximoCliente.calledWith(dados.barbearia_id, dados.user_id));
  });

  t.test('POST /api/fila/gerenciar/proximo - deve retornar erro quando não autorizado', async (t) => {
    // Arrange
    const dados = {
      barbearia_id: 1,
      user_id: 'user-123'
    };

    // Mock do FilaService
    FilaService.prototype.chamarProximoCliente = jest.fn().mockRejectedValue(
      new Error('Você não está ativo nesta barbearia')
    );

    // Act
    const response = await fastify.inject({
      method: 'POST',
      url: '/api/fila/gerenciar/proximo',
      payload: dados,
      headers: {
        authorization: 'Bearer mock-token'
      }
    });

    // Assert
    t.equal(response.statusCode, 403);
    const result = JSON.parse(response.payload);
    t.equal(result.success, false);
    t.equal(result.message, 'Você não está ativo nesta barbearia');
  });

  t.test('GET /api/fila/status/:token - deve retornar status do cliente', async (t) => {
    // Arrange
    const token = 'token-123';
    const mockCliente = {
      ...createTestData.cliente,
      status: 'aguardando',
      posicao: 1
    };

    // Mock do FilaService
    FilaService.prototype.verificarStatusCliente = jest.fn().mockResolvedValue(mockCliente);

    // Act
    const response = await fastify.inject({
      method: 'GET',
      url: `/api/fila/status/${token}`
    });

    // Assert
    t.equal(response.statusCode, 200);
    const result = JSON.parse(response.payload);
    t.equal(result.success, true);
    t.equal(result.data.status, 'aguardando');
    t.equal(result.data.posicao, 1);
    t.ok(FilaService.prototype.verificarStatusCliente.calledWith(token));
  });

  t.test('GET /api/fila/status/:token - deve retornar erro quando token inválido', async (t) => {
    // Arrange
    const token = 'token-invalido';

    // Mock do FilaService
    FilaService.prototype.verificarStatusCliente = jest.fn().mockRejectedValue(
      new Error('Cliente não encontrado')
    );

    // Act
    const response = await fastify.inject({
      method: 'GET',
      url: `/api/fila/status/${token}`
    });

    // Assert
    t.equal(response.statusCode, 404);
    const result = JSON.parse(response.payload);
    t.equal(result.success, false);
    t.equal(result.message, 'Cliente não encontrado');
  });
}); 