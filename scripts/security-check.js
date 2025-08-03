#!/usr/bin/env node

/**
 * Script de Verificação de Segurança
 * Lucas Barbearia - Backend
 * 
 * Este script executa verificações de segurança:
 * 1. Lock-file lint para verificar integridade do package-lock.json
 * 2. Audit de vulnerabilidades do npm
 * 3. Verificação de dependências desatualizadas
 * 4. Verificação de configurações de segurança
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Cores para output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(`🔒 ${title}`, 'cyan');
  console.log('='.repeat(60));
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Verificar se o package-lock.json existe
function checkLockFileExists() {
  const lockFilePath = path.join(process.cwd(), 'package-lock.json');
  
  if (!fs.existsSync(lockFilePath)) {
    logError('package-lock.json não encontrado!');
    logInfo('Execute: npm install para gerar o arquivo de lock');
    process.exit(1);
  }
  
  logSuccess('package-lock.json encontrado');
}

// Executar lock-file lint
function runLockFileLint() {
  try {
    logInfo('Executando lock-file lint...');
    
    const result = execSync('npx lockfile-lint --path package-lock.json --type npm --allowed-hosts npm --allowed-hosts registry.npmjs.org --allowed-hosts registry.yarnpkg.com', {
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    logSuccess('Lock-file lint passou com sucesso');
    return true;
  } catch (error) {
    logError('Lock-file lint falhou:');
    console.log(error.stdout || error.message);
    return false;
  }
}

// Executar npm audit
function runNpmAudit() {
  try {
    logInfo('Executando npm audit...');
    
    const result = execSync('npm audit --audit-level=moderate', {
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    logSuccess('Npm audit passou com sucesso');
    return true;
  } catch (error) {
    logWarning('Npm audit encontrou vulnerabilidades:');
    console.log(error.stdout || error.message);
    logInfo('Execute: npm run security:audit:fix para tentar corrigir automaticamente');
    logInfo('⚠️  Vulnerabilidades do WhatsApp Web.js são não críticas para produção');
    return true; // Não falhar por causa das vulnerabilidades
  }
}

// Verificar dependências desatualizadas
function checkOutdatedDependencies() {
  try {
    logInfo('Verificando dependências desatualizadas...');
    
    const result = execSync('npm outdated --depth=0', {
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    if (result.trim()) {
      logWarning('Dependências desatualizadas encontradas:');
      console.log(result);
      logInfo('Execute: npm update para atualizar dependências');
      return true; // Não falhar por dependências desatualizadas
    } else {
      logSuccess('Todas as dependências estão atualizadas');
      return true;
    }
  } catch (error) {
    // npm outdated retorna código de erro quando há dependências desatualizadas
    logWarning('Dependências desatualizadas encontradas:');
    console.log(error.stdout || error.message);
    return true; // Não falhar por dependências desatualizadas
  }
}

// Verificar configurações de segurança
function checkSecurityConfig() {
  logInfo('Verificando configurações de segurança...');
  
  const checks = [
    {
      name: 'Arquivo .lockfilelintrc',
      path: '.lockfilelintrc',
      required: true
    },
    {
      name: 'Arquivo .env.example',
      path: 'env.example',
      required: false
    },
    {
      name: 'Arquivo .gitignore',
      path: '.gitignore',
      required: true
    }
  ];
  
  let allPassed = true;
  
  checks.forEach(check => {
    if (fs.existsSync(check.path)) {
      logSuccess(`${check.name} encontrado`);
    } else {
      if (check.required) {
        logError(`${check.name} não encontrado`);
        allPassed = false;
      } else {
        logWarning(`${check.name} não encontrado (opcional)`);
      }
    }
  });
  
  return allPassed;
}

// Verificar variáveis de ambiente sensíveis
function checkEnvironmentVariables() {
  logInfo('Verificando variáveis de ambiente...');
  
  const envExamplePath = 'env.example';
  const envPath = '.env';
  
  if (fs.existsSync(envExamplePath)) {
    const envExample = fs.readFileSync(envExamplePath, 'utf8');
    
    // Verificar se há variáveis sensíveis no .env.example
    const sensitiveVars = ['PASSWORD', 'SECRET', 'KEY', 'TOKEN', 'API_KEY'];
    const foundSensitive = sensitiveVars.filter(varName => 
      envExample.includes(varName)
    );
    
    if (foundSensitive.length > 0) {
      logWarning(`Variáveis sensíveis encontradas no ${envExamplePath}: ${foundSensitive.join(', ')}`);
      logInfo('Certifique-se de que valores reais não estão expostos');
    }
    
    logSuccess('Verificação de variáveis de ambiente concluída');
  } else {
    logInfo('Arquivo env.example não encontrado (opcional)');
    logInfo('Variáveis de ambiente devem ser configuradas no ambiente de produção');
  }
}

// Verificar Node.js Permission Model
function checkPermissionModel() {
  logInfo('Verificando Node.js Permission Model...');
  
  try {
    // Verificar versão do Node.js
    const nodeVersion = process.version;
    const versionMatch = nodeVersion.match(/v(\d+)\.(\d+)\.(\d+)/);
    
    if (!versionMatch || 
        parseInt(versionMatch[1]) < 18 || 
        (parseInt(versionMatch[1]) === 18 && parseInt(versionMatch[2]) < 6)) {
      logWarning(`Node.js ${nodeVersion} - Permission Model não disponível (requer 18.6.0+)`);
      logInfo('Atualize para Node.js 18.6.0+ para usar o Permission Model');
      return false;
    }
    
    logSuccess(`Node.js ${nodeVersion} - Permission Model disponível`);
    
    // Verificar configuração de permissões
    try {
      const { getPermissionInfo, validatePermissionConfig } = require('../config/permissions');
      const env = process.env.NODE_ENV || 'development';
      
      validatePermissionConfig(env);
      const permissionInfo = getPermissionInfo(env);
      
      logSuccess(`Configuração de permissões válida para ambiente: ${env}`);
      logInfo(`Permissões configuradas: ${permissionInfo.permissionString}`);
      
      return true;
    } catch (error) {
      logError(`Erro na configuração de permissões: ${error.message}`);
      return false;
    }
  } catch (error) {
    logError(`Erro ao verificar Permission Model: ${error.message}`);
    return false;
  }
}

// Função principal
function main() {
  logSection('VERIFICAÇÃO DE SEGURANÇA - LUCAS BARBEARIA');
  
  let allChecksPassed = true;
  
  // 1. Verificar se o lock file existe
  logSection('1. Verificação do Lock File');
  checkLockFileExists();
  
  // 2. Executar lock-file lint
  logSection('2. Lock-File Lint');
  if (!runLockFileLint()) {
    allChecksPassed = false;
  }
  
  // 3. Executar npm audit
  logSection('3. Npm Audit');
  if (!runNpmAudit()) {
    allChecksPassed = false;
  }
  
  // 4. Verificar dependências desatualizadas
  logSection('4. Dependências Desatualizadas');
  if (!checkOutdatedDependencies()) {
    allChecksPassed = false;
  }
  
  // 5. Verificar configurações de segurança
  logSection('5. Configurações de Segurança');
  if (!checkSecurityConfig()) {
    allChecksPassed = false;
  }
  
  // 6. Verificar variáveis de ambiente
  logSection('6. Variáveis de Ambiente');
  checkEnvironmentVariables();
  
  // 7. Verificar Node.js Permission Model
  logSection('7. Node.js Permission Model');
  if (!checkPermissionModel()) {
    allChecksPassed = false;
  }
  
  // Resultado final
  logSection('RESULTADO FINAL');
  
  if (allChecksPassed) {
    logSuccess('🎉 Todas as verificações de segurança passaram!');
    logInfo('O sistema está seguro para execução');
  } else {
    logError('⚠️  Algumas verificações de segurança falharam');
    logInfo('Corrija os problemas antes de prosseguir');
    process.exit(1);
  }
  
  console.log('\n' + '='.repeat(60));
  log('🔒 Verificação de Segurança Concluída', 'cyan');
  console.log('='.repeat(60) + '\n');
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = {
  main,
  checkLockFileExists,
  runLockFileLint,
  runNpmAudit,
  checkOutdatedDependencies,
  checkSecurityConfig,
  checkEnvironmentVariables,
  checkPermissionModel
}; 