/**
 * Configurações de cookies para diferentes tipos de usuário
 */

// Tempos de expiração em milissegundos
const COOKIE_EXPIRATION = {
  // Funcionários (admin, gerente, barbeiro) - 12 horas
  FUNCIONARIO: 12 * 60 * 60 * 1000,
  
  // Clientes na fila - 4 horas
  CLIENTE: 4 * 60 * 60 * 1000,
  
  // Configuração via variável de ambiente (opcional)
  FUNCIONARIO_ENV: process.env.FUNCIONARIO_COOKIE_EXPIRES_IN || '12h',
  CLIENTE_ENV: process.env.CLIENTE_COOKIE_EXPIRES_IN || '4h'
};

// Configurações de segurança padrão
const COOKIE_SECURITY = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
  signed: true
};

// Configurações específicas para funcionários
const FUNCIONARIO_COOKIE_OPTIONS = {
  ...COOKIE_SECURITY,
  maxAge: COOKIE_EXPIRATION.FUNCIONARIO
};

// Configurações específicas para clientes
const CLIENTE_COOKIE_OPTIONS = {
  ...COOKIE_SECURITY,
  maxAge: COOKIE_EXPIRATION.CLIENTE
};

// Configurações de JWT
const JWT_CONFIG = {
  // Funcionários - 12 horas
  FUNCIONARIO: {
    expiresIn: process.env.JWT_EXPIRES_IN || '12h'
  },
  
  // Clientes - 4 horas
  CLIENTE: {
    expiresIn: '4h'
  }
};

module.exports = {
  COOKIE_EXPIRATION,
  COOKIE_SECURITY,
  FUNCIONARIO_COOKIE_OPTIONS,
  CLIENTE_COOKIE_OPTIONS,
  JWT_CONFIG
}; 