/**
 * Configurações de Permissões - Node.js Permission Model
 * Lucas Barbearia - Backend
 * 
 * Este arquivo define diferentes níveis de permissão para o sistema.
 */

const path = require('path');
const os = require('os');

// Configuração base
const BASE_CONFIG = {
  // Diretórios do projeto
  projectDirs: {
    src: './src',
    database: './database',
    scripts: './scripts',
    tests: './tests',
    logs: './logs',
    uploads: './uploads',
    temp: './temp',
    coverage: './coverage'
  },
  
  // Hosts permitidos
  allowedHosts: [
    'localhost:3000',      // Servidor local
    'localhost:5432',      // PostgreSQL local
    'api.supabase.co',     // Supabase API
    'supabase.co',         // Supabase
    '127.0.0.1:3000',      // Localhost alternativo
    '127.0.0.1:5432'       // PostgreSQL alternativo
  ]
};

// Configurações por ambiente
const PERMISSION_LEVELS = {
  // Desenvolvimento - Permissões mais amplas
  development: {
    fsRead: [
      BASE_CONFIG.projectDirs.src,
      BASE_CONFIG.projectDirs.database,
      BASE_CONFIG.projectDirs.scripts,
      BASE_CONFIG.projectDirs.tests,
      './node_modules',
      './package.json',
      './package-lock.json',
      './.env',
      './env.example',
      os.homedir(), // Para arquivos de configuração do usuário
      '/tmp'        // Para arquivos temporários
    ],
    
    fsWrite: [
      BASE_CONFIG.projectDirs.logs,
      BASE_CONFIG.projectDirs.uploads,
      BASE_CONFIG.projectDirs.temp,
      BASE_CONFIG.projectDirs.coverage,
      '/tmp'
    ],
    
    net: [
      ...BASE_CONFIG.allowedHosts,
      'localhost:*',        // Qualquer porta local
      '127.0.0.1:*'        // Qualquer porta local
    ],
    
    process: true,          // Permitido em desenvolvimento
    worker: true            // Permitido em desenvolvimento
  },
  
  // Teste - Permissões restritas para testes
  test: {
    fsRead: [
      BASE_CONFIG.projectDirs.src,
      BASE_CONFIG.projectDirs.database,
      BASE_CONFIG.projectDirs.scripts,
      BASE_CONFIG.projectDirs.tests,
      './node_modules',
      './package.json',
      './jest.config.js',
      './.env.test'
    ],
    
    fsWrite: [
      BASE_CONFIG.projectDirs.temp,
      BASE_CONFIG.projectDirs.coverage,
      '/tmp'
    ],
    
    net: [
      'localhost:3000',
      'localhost:5432',
      'api.supabase.co'
    ],
    
    process: false,         // Bloqueado em testes
    worker: false           // Bloqueado em testes
  },
  
  // Produção - Permissões mínimas
  production: {
    fsRead: [
      BASE_CONFIG.projectDirs.src,
      BASE_CONFIG.projectDirs.database,
      './node_modules',
      './package.json',
      './.env'
    ],
    
    fsWrite: [
      BASE_CONFIG.projectDirs.logs,
      BASE_CONFIG.projectDirs.uploads,
      '/tmp'
    ],
    
    net: [
      'localhost:3000',
      'api.supabase.co',
      'supabase.co'
    ],
    
    process: false,         // Bloqueado em produção
    worker: false           // Bloqueado em produção
  },
  
  // Staging - Permissões intermediárias
  staging: {
    fsRead: [
      BASE_CONFIG.projectDirs.src,
      BASE_CONFIG.projectDirs.database,
      BASE_CONFIG.projectDirs.scripts,
      './node_modules',
      './package.json',
      './.env.staging'
    ],
    
    fsWrite: [
      BASE_CONFIG.projectDirs.logs,
      BASE_CONFIG.projectDirs.uploads,
      BASE_CONFIG.projectDirs.temp,
      '/tmp'
    ],
    
    net: [
      ...BASE_CONFIG.allowedHosts
    ],
    
    process: false,         // Bloqueado em staging
    worker: false           // Bloqueado em staging
  }
};

// Função para obter configuração por ambiente
function getPermissionConfig(env = process.env.NODE_ENV || 'development') {
  const config = PERMISSION_LEVELS[env];
  
  if (!config) {
    throw new Error(`Configuração de permissão não encontrada para ambiente: ${env}`);
  }
  
  return config;
}

// Função para construir string de permissões
function buildPermissionString(env = process.env.NODE_ENV || 'development') {
  const config = getPermissionConfig(env);
  const permissions = [];
  
  // Permissões de sistema de arquivos
  if (config.fsRead && config.fsRead.length > 0) {
    const readPerms = config.fsRead.map(dir => `fs.read=${dir}`).join(',');
    permissions.push(readPerms);
  }
  
  if (config.fsWrite && config.fsWrite.length > 0) {
    const writePerms = config.fsWrite.map(dir => `fs.write=${dir}`).join(',');
    permissions.push(writePerms);
  }
  
  // Permissões de rede
  if (config.net && config.net.length > 0) {
    const netPerms = config.net.map(host => `net=${host}`).join(',');
    permissions.push(netPerms);
  }
  
  // Permissões de processo
  if (config.process) {
    permissions.push('process');
  }
  
  // Permissões de worker threads
  if (config.worker) {
    permissions.push('worker');
  }
  
  return permissions.join(',');
}

// Função para validar configuração
function validatePermissionConfig(env = process.env.NODE_ENV || 'development') {
  const config = getPermissionConfig(env);
  const errors = [];
  
  // Verificar se diretórios de leitura existem
  config.fsRead.forEach(dir => {
    if (!dir.startsWith('./') && !dir.startsWith('/') && !dir.includes(':')) {
      errors.push(`Diretório de leitura inválido: ${dir}`);
    }
  });
  
  // Verificar se diretórios de escrita existem
  config.fsWrite.forEach(dir => {
    if (!dir.startsWith('./') && !dir.startsWith('/') && !dir.includes(':')) {
      errors.push(`Diretório de escrita inválido: ${dir}`);
    }
  });
  
  // Verificar hosts de rede
  config.net.forEach(host => {
    if (!host.includes(':') && !host.includes('.')) {
      errors.push(`Host de rede inválido: ${host}`);
    }
  });
  
  if (errors.length > 0) {
    throw new Error(`Configuração de permissão inválida:\n${errors.join('\n')}`);
  }
  
  return true;
}

// Função para obter informações da configuração
function getPermissionInfo(env = process.env.NODE_ENV || 'development') {
  const config = getPermissionConfig(env);
  
  return {
    environment: env,
    fsRead: config.fsRead,
    fsWrite: config.fsWrite,
    net: config.net,
    process: config.process,
    worker: config.worker,
    permissionString: buildPermissionString(env)
  };
}

module.exports = {
  PERMISSION_LEVELS,
  getPermissionConfig,
  buildPermissionString,
  validatePermissionConfig,
  getPermissionInfo,
  BASE_CONFIG
}; 