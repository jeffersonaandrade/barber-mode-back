/**
 * Testes para middlewares de autenticação
 * 
 * Testa os middlewares:
 * - authenticate
 * - authorize
 */
// @ts-nocheck


const { test } = require('tap');
const jwt = require('jsonwebtoken');

// Mock do JWT
jest.mock('jsonwebtoken');

test('Middleware authenticate', async (t) => {
  t.test('deve autenticar usuário com token válido', async (t) => {
    // Arrange
    const mockUser = { id: 'user-123', role: 'barbeiro' };
    const mockToken = 'valid-token';
    
    jwt.verify.mockReturnValue(mockUser);
    
    const request = {
      headers: {
        authorization: `Bearer ${mockToken}`
      }
    };
    
    const reply = {
      code: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    const authenticate = require('../../src/middlewares/auth/authenticate');

    // Act
    await authenticate(request, reply);

    // Assert
    t.equal(request.user, mockUser);
    t.ok(jwt.verify.calledWith(mockToken, process.env.JWT_SECRET));
    t.notOk(reply.code.called);
  });

  t.test('deve retornar erro quando token não é fornecido', async (t) => {
    // Arrange
    const request = {
      headers: {}
    };
    
    const reply = {
      code: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    const authenticate = require('../../src/middlewares/auth/authenticate');

    // Act
    await authenticate(request, reply);

    // Assert
    t.equal(reply.code.mock.calls[0][0], 401);
    t.equal(reply.send.mock.calls[0][0].success, false);
    t.equal(reply.send.mock.calls[0][0].message, 'Token não fornecido');
  });

  t.test('deve retornar erro quando token é inválido', async (t) => {
    // Arrange
    const mockToken = 'invalid-token';
    
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });
    
    const request = {
      headers: {
        authorization: `Bearer ${mockToken}`
      }
    };
    
    const reply = {
      code: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    const authenticate = require('../../src/middlewares/auth/authenticate');

    // Act
    await authenticate(request, reply);

    // Assert
    t.equal(reply.code.mock.calls[0][0], 401);
    t.equal(reply.send.mock.calls[0][0].success, false);
    t.equal(reply.send.mock.calls[0][0].message, 'Token inválido');
  });

  t.test('deve retornar erro quando formato do token é inválido', async (t) => {
    // Arrange
    const request = {
      headers: {
        authorization: 'InvalidFormat token'
      }
    };
    
    const reply = {
      code: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    const authenticate = require('../../src/middlewares/auth/authenticate');

    // Act
    await authenticate(request, reply);

    // Assert
    t.equal(reply.code.mock.calls[0][0], 401);
    t.equal(reply.send.mock.calls[0][0].success, false);
    t.equal(reply.send.mock.calls[0][0].message, 'Formato de token inválido');
  });
});

test('Middleware authorize', async (t) => {
  t.test('deve autorizar usuário com role correto', async (t) => {
    // Arrange
    const allowedRoles = ['admin', 'gerente'];
    const request = {
      user: { id: 'user-123', role: 'admin' }
    };
    
    const reply = {
      code: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    const authorize = require('../../src/middlewares/auth/authorize');

    // Act
    await authorize(allowedRoles)(request, reply);

    // Assert
    t.notOk(reply.code.called);
  });

  t.test('deve retornar erro quando usuário não tem role permitido', async (t) => {
    // Arrange
    const allowedRoles = ['admin', 'gerente'];
    const request = {
      user: { id: 'user-123', role: 'barbeiro' }
    };
    
    const reply = {
      code: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    const authorize = require('../../src/middlewares/auth/authorize');

    // Act
    await authorize(allowedRoles)(request, reply);

    // Assert
    t.equal(reply.code.mock.calls[0][0], 403);
    t.equal(reply.send.mock.calls[0][0].success, false);
    t.equal(reply.send.mock.calls[0][0].message, 'Acesso negado');
  });

  t.test('deve retornar erro quando usuário não está autenticado', async (t) => {
    // Arrange
    const allowedRoles = ['admin'];
    const request = {
      user: null
    };
    
    const reply = {
      code: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    const authorize = require('../../src/middlewares/auth/authorize');

    // Act
    await authorize(allowedRoles)(request, reply);

    // Assert
    t.equal(reply.code.mock.calls[0][0], 401);
    t.equal(reply.send.mock.calls[0][0].success, false);
    t.equal(reply.send.mock.calls[0][0].message, 'Usuário não autenticado');
  });
}); 