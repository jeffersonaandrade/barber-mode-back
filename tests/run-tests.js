/**
 * Script para executar todos os testes
 * 
 * Este script executa:
 * 1. Testes unitários dos serviços
 * 2. Testes de integração das rotas
 * 3. Testes dos middlewares
 * 4. Gera relatório de cobertura
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Iniciando execução dos testes...\n');

// Função para executar comandos
function runCommand(command, description) {
  console.log(`📋 ${description}...`);
  try {
    const result = execSync(command, { 
      stdio: 'inherit',
      encoding: 'utf8'
    });
    console.log(`✅ ${description} - Concluído com sucesso!\n`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} - Falhou!\n`);
    return false;
  }
}

// Função para verificar se arquivo existe
function fileExists(filePath) {
  return fs.existsSync(path.join(__dirname, filePath));
}

// Executar testes
async function runTests() {
  let allTestsPassed = true;

  // 1. Testes unitários dos serviços
  console.log('🔧 TESTES UNITÁRIOS DOS SERVIÇOS');
  console.log('================================\n');

  if (fileExists('../services/filaService.test.js')) {
    const filaServicePassed = runCommand(
      'npm test -- tests/services/filaService.test.js',
      'Testes do FilaService'
    );
    allTestsPassed = allTestsPassed && filaServicePassed;
  }

  if (fileExists('../services/userService.test.js')) {
    const userServicePassed = runCommand(
      'npm test -- tests/services/userService.test.js',
      'Testes do UserService'
    );
    allTestsPassed = allTestsPassed && userServicePassed;
  }

  if (fileExists('../services/barbeariaService.test.js')) {
    const barbeariaServicePassed = runCommand(
      'npm test -- tests/services/barbeariaService.test.js',
      'Testes do BarbeariaService'
    );
    allTestsPassed = allTestsPassed && barbeariaServicePassed;
  }

  if (fileExists('../services/avaliacaoService.test.js')) {
    const avaliacaoServicePassed = runCommand(
      'npm test -- tests/services/avaliacaoService.test.js',
      'Testes do AvaliacaoService'
    );
    allTestsPassed = allTestsPassed && avaliacaoServicePassed;
  }

  // 2. Testes de integração das rotas
  console.log('🌐 TESTES DE INTEGRAÇÃO DAS ROTAS');
  console.log('=================================\n');

  if (fileExists('../routes/fila.test.js')) {
    const filaRoutesPassed = runCommand(
      'npm test -- tests/routes/fila.test.js',
      'Testes das rotas de fila'
    );
    allTestsPassed = allTestsPassed && filaRoutesPassed;
  }

  // 3. Testes dos middlewares
  console.log('🛡️ TESTES DOS MIDDLEWARES');
  console.log('==========================\n');

  if (fileExists('../middlewares/auth.test.js')) {
    const authMiddlewarePassed = runCommand(
      'npm test -- tests/middlewares/auth.test.js',
      'Testes dos middlewares de autenticação'
    );
    allTestsPassed = allTestsPassed && authMiddlewarePassed;
  }

  // 4. Executar todos os testes juntos
  console.log('🎯 EXECUÇÃO COMPLETA DOS TESTES');
  console.log('===============================\n');

  const allTestsPassed = runCommand(
    'npm test',
    'Todos os testes'
  );

  // 5. Gerar relatório de cobertura
  console.log('📊 RELATÓRIO DE COBERTURA');
  console.log('=========================\n');

  if (fs.existsSync(path.join(__dirname, '../coverage'))) {
    console.log('📈 Cobertura de código gerada em: ./coverage/index.html');
    console.log('📋 Relatório detalhado disponível em: ./coverage/lcov-report/index.html\n');
  }

  // Resultado final
  console.log('🏁 RESULTADO FINAL');
  console.log('==================\n');

  if (allTestsPassed) {
    console.log('🎉 Todos os testes passaram com sucesso!');
    console.log('✅ O código está funcionando corretamente');
    console.log('🚀 Pronto para produção!\n');
  } else {
    console.log('❌ Alguns testes falharam');
    console.log('🔧 Verifique os erros acima e corrija os problemas');
    console.log('🔄 Execute novamente após as correções\n');
  }

  return allTestsPassed;
}

// Executar se chamado diretamente
if (require.main === module) {
  runTests().then((success) => {
    process.exit(success ? 0 : 1);
  }).catch((error) => {
    console.error('Erro ao executar testes:', error);
    process.exit(1);
  });
}

module.exports = { runTests }; 