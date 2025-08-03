#!/usr/bin/env node

/**
 * Script de Inicialização Segura
 * Lucas Barbearia - Backend
 * 
 * Este script inicia o servidor com permissões restritas usando
 * o Node.js Permission Model para maior segurança.
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configurações de segurança
const SECURITY_CONFIG = {
  // Diretórios permitidos para leitura
  fsRead: [
    './src',
    './database',
    './scripts',
    './tests',
    './node_modules',
    process.env.HOME || process.env.USERPROFILE // Para .env
  ],
  
  // Diretórios permitidos para escrita
  fsWrite: [
    './logs',
    './uploads',
    './temp',
    './coverage'
  ],
  
  // Hosts permitidos para rede
  net: [
    'localhost:3000',
    'localhost:5432',
    'api.supabase.co',
    'supabase.co'
  ],
  
  // Permissões de processo
  process: false, // Desabilitado por segurança
  
  // Permissões de worker threads
  worker: false // Desabilitado por segurança
};

// Função para construir string de permissões
function buildPermissions() {
  const permissions = [];
  
  // Permissões de sistema de arquivos
  if (SECURITY_CONFIG.fsRead.length > 0) {
    const readPerms = SECURITY_CONFIG.fsRead.map(dir => `fs.read=${dir}`).join(',');
    permissions.push(readPerms);
  }
  
  if (SECURITY_CONFIG.fsWrite.length > 0) {
    const writePerms = SECURITY_CONFIG.fsWrite.map(dir => `fs.write=${dir}`).join(',');
    permissions.push(writePerms);
  }
  
  // Permissões de rede
  if (SECURITY_CONFIG.net.length > 0) {
    const netPerms = SECURITY_CONFIG.net.map(host => `net=${host}`).join(',');
    permissions.push(netPerms);
  }
  
  // Permissões de processo
  if (SECURITY_CONFIG.process) {
    permissions.push('process');
  }
  
  // Permissões de worker threads
  if (SECURITY_CONFIG.worker) {
    permissions.push('worker');
  }
  
  return permissions.join(',');
}

// Função para criar diretórios necessários
function createRequiredDirectories() {
  const dirs = [
    './logs',
    './uploads',
    './temp',
    './coverage'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Diretório criado: ${dir}`);
    }
  });
}

// Função para verificar configuração de segurança
function checkSecurityConfig() {
  console.log('🔒 Configuração de Segurança:');
  console.log(`📁 Leitura permitida: ${SECURITY_CONFIG.fsRead.join(', ')}`);
  console.log(`📝 Escrita permitida: ${SECURITY_CONFIG.fsWrite.join(', ')}`);
  console.log(`🌐 Rede permitida: ${SECURITY_CONFIG.net.join(', ')}`);
  console.log(`⚙️ Processo: ${SECURITY_CONFIG.process ? 'Permitido' : 'Bloqueado'}`);
  console.log(`🧵 Worker threads: ${SECURITY_CONFIG.worker ? 'Permitido' : 'Bloqueado'}`);
  console.log('');
}

// Função principal
function startSecureServer() {
  console.log('🚀 Iniciando Lucas Barbearia com permissões restritas...\n');
  
  // Verificar se estamos no Node.js 18.6.0+
  const nodeVersion = process.version;
  const versionMatch = nodeVersion.match(/v(\d+)\.(\d+)\.(\d+)/);
  
  if (!versionMatch || 
      parseInt(versionMatch[1]) < 18 || 
      (parseInt(versionMatch[1]) === 18 && parseInt(versionMatch[2]) < 6)) {
    console.error('❌ Node.js 18.6.0+ é necessário para usar o Permission Model');
    console.error(`   Versão atual: ${nodeVersion}`);
    console.error('   Execute: npm install -g n && n stable');
    process.exit(1);
  }
  
  console.log(`✅ Node.js ${nodeVersion} - Permission Model disponível\n`);
  
  // Criar diretórios necessários
  createRequiredDirectories();
  
  // Verificar configuração
  checkSecurityConfig();
  
  // Construir permissões
  const permissions = buildPermissions();
  
  if (!permissions) {
    console.error('❌ Nenhuma permissão configurada!');
    process.exit(1);
  }
  
  console.log(`🔐 Permissões aplicadas: ${permissions}\n`);
  
  // Argumentos para o Node.js
  const nodeArgs = [
    '--permission=' + permissions,
    'src/app.js'
  ];
  
  // Variáveis de ambiente
  const env = {
    ...process.env,
    NODE_ENV: process.env.NODE_ENV || 'development',
    SECURITY_MODE: 'permission-model'
  };
  
  // Iniciar processo com permissões restritas
  const child = spawn('node', nodeArgs, {
    stdio: 'inherit',
    env: env,
    cwd: process.cwd()
  });
  
  // Gerenciar eventos do processo
  child.on('error', (error) => {
    console.error('❌ Erro ao iniciar servidor:', error.message);
    process.exit(1);
  });
  
  child.on('exit', (code) => {
    if (code !== 0) {
      console.error(`❌ Servidor encerrado com código: ${code}`);
      process.exit(code);
    }
  });
  
  // Gerenciar sinais
  process.on('SIGINT', () => {
    console.log('\n🛑 Encerrando servidor...');
    child.kill('SIGINT');
  });
  
  process.on('SIGTERM', () => {
    console.log('\n🛑 Encerrando servidor...');
    child.kill('SIGTERM');
  });
}

// Executar se chamado diretamente
if (require.main === module) {
  startSecureServer();
}

module.exports = {
  startSecureServer,
  buildPermissions,
  SECURITY_CONFIG
}; 