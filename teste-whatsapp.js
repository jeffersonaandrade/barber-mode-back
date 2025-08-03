/**
 * Teste do Sistema de WhatsApp com Rate Limiting
 * 
 * Este arquivo demonstra como testar o sistema de notificações
 * WhatsApp com proteções de rate limiting implementadas.
 */

const { getWhatsAppService } = require('./src/services/whatsappService');
const { getRateLimitController } = require('./src/controllers/RateLimitController');

async function testarSistemaWhatsApp() {
  console.log('🧪 Iniciando testes do sistema WhatsApp...\n');

  // Obter instâncias
  const whatsappService = getWhatsAppService();
  const rateLimitController = getRateLimitController();

  // Aguardar WhatsApp estar pronto
  console.log('⏳ Aguardando WhatsApp conectar...');
  let tentativas = 0;
  while (!whatsappService.isReady && tentativas < 30) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    tentativas++;
    console.log(`⏳ Tentativa ${tentativas}/30...`);
  }

  if (!whatsappService.isReady) {
    console.log('❌ WhatsApp não conectou. Execute o servidor primeiro.');
    return;
  }

  console.log('✅ WhatsApp conectado!\n');

  // Teste 1: Verificar estatísticas de rate limiting
  console.log('📊 Teste 1: Verificar estatísticas de rate limiting');
  const stats = rateLimitController.getEstatisticas();
  console.log('Estatísticas atuais:', JSON.stringify(stats, null, 2));
  console.log('');

  // Teste 2: Verificar se sistema está ativo
  console.log('🔍 Teste 2: Verificar status do sistema');
  const sistemaAtivo = rateLimitController.sistemaEstaAtivo();
  console.log(`Sistema ativo: ${sistemaAtivo}`);
  console.log('');

  // Teste 3: Simular envio de notificação
  console.log('📱 Teste 3: Simular envio de notificação');
  const dadosTeste = {
    cliente: { nome: 'João Silva', telefone: '11999999999' },
    barbearia: { nome: 'Barbearia Lucas' }
  };

  // Verificar se pode enviar
  const podeEnviarGroq = await rateLimitController.podeFazerRequisicao('groq', 150);
  const podeEnviarWhatsApp = await rateLimitController.podeFazerRequisicao('whatsapp');
  const podeEnviarParaUsuario = await rateLimitController.podeEnviarParaUsuario('11999999999', 'vez_chegou');

  console.log(`Pode usar Groq: ${podeEnviarGroq}`);
  console.log(`Pode enviar WhatsApp: ${podeEnviarWhatsApp}`);
  console.log(`Pode enviar para usuário: ${podeEnviarParaUsuario}`);
  console.log('');

  // Teste 4: Simular múltiplas requisições para testar rate limiting
  console.log('⚡ Teste 4: Simular múltiplas requisições');
  for (let i = 1; i <= 5; i++) {
    const podeFazer = await rateLimitController.podeFazerRequisicao('groq', 150);
    console.log(`Requisição ${i}: ${podeFazer ? '✅ Permitida' : '❌ Bloqueada'}`);
    
    if (podeFazer) {
      rateLimitController.registrarUso('groq', 150);
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  console.log('');

  // Teste 5: Verificar estatísticas após uso
  console.log('📊 Teste 5: Estatísticas após uso');
  const statsAposUso = rateLimitController.getEstatisticas();
  console.log('Requests/minuto:', statsAposUso.requests.minuto.usado);
  console.log('Tokens/minuto:', statsAposUso.tokens.minuto.usado);
  console.log('');

  // Teste 6: Testar bloqueio de usuário
  console.log('🚫 Teste 6: Testar bloqueio de usuário');
  await rateLimitController.bloquearUsuario('11999999999', 'teste');
  const podeEnviarBloqueado = await rateLimitController.podeEnviarParaUsuario('11999999999', 'vez_chegou');
  console.log(`Pode enviar para usuário bloqueado: ${podeEnviarBloqueado}`);
  console.log('');

  // Teste 7: Listar usuários bloqueados
  console.log('📋 Teste 7: Listar usuários bloqueados');
  const usuariosBloqueados = rateLimitController.getUsuariosBloqueados();
  console.log('Usuários bloqueados:', usuariosBloqueados);
  console.log('');

  console.log('✅ Testes concluídos!');
}

// Função para testar endpoints da API
async function testarEndpointsAPI() {
  console.log('🌐 Testando endpoints da API...\n');

  const baseURL = 'http://localhost:3000/api';
  const token = 'SEU_TOKEN_JWT_AQUI'; // Substitua pelo token real

  const endpoints = [
    {
      nome: 'Status WhatsApp',
      url: `${baseURL}/whatsapp/status`,
      method: 'GET'
    },
    {
      nome: 'Estatísticas Rate Limit',
      url: `${baseURL}/whatsapp/rate-limit/stats`,
      method: 'GET'
    },
    {
      nome: 'Usuários Bloqueados',
      url: `${baseURL}/whatsapp/rate-limit/blocked-users`,
      method: 'GET'
    },
    {
      nome: 'Teste de Mensagem',
      url: `${baseURL}/whatsapp/test`,
      method: 'POST',
      body: {
        telefone: '11999999999',
        tipo: 'vez_chegou',
        dados_teste: {
          cliente: { nome: 'Teste API' },
          barbearia: { nome: 'Barbearia Teste' }
        }
      }
    }
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`🔍 Testando: ${endpoint.nome}`);
      
      const options = {
        method: endpoint.method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      if (endpoint.body) {
        options.body = JSON.stringify(endpoint.body);
      }

      const response = await fetch(endpoint.url, options);
      const data = await response.json();
      
      console.log(`Status: ${response.status}`);
      console.log(`Resposta:`, JSON.stringify(data, null, 2));
      console.log('');
    } catch (error) {
      console.error(`❌ Erro no endpoint ${endpoint.nome}:`, error.message);
      console.log('');
    }
  }
}

// Executar testes
if (require.main === module) {
  console.log('🚀 Sistema de WhatsApp com Rate Limiting - Testes\n');
  
  // Verificar se deve testar API
  const testarAPI = process.argv.includes('--api');
  
  if (testarAPI) {
    testarEndpointsAPI();
  } else {
    testarSistemaWhatsApp();
  }
}

module.exports = { testarSistemaWhatsApp, testarEndpointsAPI }; 