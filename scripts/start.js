#!/usr/bin/env node

/**
 * Script de Inicialização Inteligente
 * Lucas Barbearia - Backend
 * 
 * Este script detecta automaticamente o ambiente e aplica as configurações
 * apropriadas, incluindo Permission Model quando disponível.
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Detectar ambiente
const isVercel = process.env.VERCEL === '1';
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
const isTest = process.env.NODE_ENV === 'test';

// Verificar se Permission Model está disponível
function isPermissionModelAvailable() {
  const nodeVersion = process.version;
  const versionMatch = nodeVersion.match(/v(\d+)\.(\d+)\.(\d+)/);
  
  return versionMatch && 
         parseInt(versionMatch[1]) >= 18 && 
         (parseInt(versionMatch[1]) > 18 || parseInt(versionMatch[2]) >= 6);
}

// Função para iniciar servidor
function startServer() {
  console.log('🚀 Iniciando Lucas Barbearia Backend...\n');
  
  // Informações do ambiente
  console.log('📋 Informações do Ambiente:');
  console.log(`   Node.js: ${process.version}`);
  console.log(`   Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Vercel: ${isVercel ? 'Sim' : 'Não'}`);
  console.log(`   Permission Model: ${isPermissionModelAvailable() ? 'Disponível' : 'Não disponível'}`);
  console.log('');
  
  // Decidir como iniciar
  let nodeArgs = ['src/app.js'];
  let env = { ...process.env };
  
  // Em Vercel, não usar Permission Model (pode causar problemas)
  if (isVercel) {
    console.log('☁️  Ambiente Vercel detectado - Iniciando sem Permission Model');
    console.log('   (O Vercel gerencia a segurança internamente)\n');
  }
  // Em produção local, usar Permission Model se disponível
  else if (isProduction && isPermissionModelAvailable()) {
    console.log('🔒 Ambiente de produção - Aplicando Permission Model\n');
    
    try {
      const { buildPermissionString } = require('../config/permissions');
      const permissions = buildPermissionString('production');
      
      nodeArgs.unshift(`--permission=${permissions}`);
      env.SECURITY_MODE = 'permission-model';
      
      console.log(`🔐 Permissões aplicadas: ${permissions}\n`);
    } catch (error) {
      console.warn('⚠️  Erro ao aplicar Permission Model:', error.message);
      console.log('   Continuando sem Permission Model...\n');
    }
  }
  // Em desenvolvimento, usar Permission Model se disponível e solicitado
  else if (isDevelopment && isPermissionModelAvailable() && process.env.USE_PERMISSIONS === 'true') {
    console.log('🔒 Desenvolvimento com Permission Model ativado\n');
    
    try {
      const { buildPermissionString } = require('../config/permissions');
      const permissions = buildPermissionString('development');
      
      nodeArgs.unshift(`--permission=${permissions}`);
      env.SECURITY_MODE = 'permission-model';
      
      console.log(`🔐 Permissões aplicadas: ${permissions}\n`);
    } catch (error) {
      console.warn('⚠️  Erro ao aplicar Permission Model:', error.message);
      console.log('   Continuando sem Permission Model...\n');
    }
  }
  // Caso padrão: iniciar normalmente
  else {
    console.log('⚡ Iniciando normalmente (sem Permission Model)\n');
  }
  
  // Iniciar processo
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
  startServer();
}

module.exports = { startServer }; 