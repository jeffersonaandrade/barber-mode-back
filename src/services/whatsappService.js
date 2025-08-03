const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const Groq = require('groq-sdk');
const { getRateLimitController } = require('../controllers/RateLimitController');

class WhatsAppService {
  constructor() {
    this.client = null;
    this.isReady = false;
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
    
    // Inicializar rate limit controller
    this.rateLimitController = getRateLimitController();
    
    this.init();
  }

  async init() {
    try {
      console.log('📱 [WHATSAPP] ========================================');
      console.log('📱 [WHATSAPP] INICIANDO CLIENTE WHATSAPP WEB.JS');
      console.log('📱 [WHATSAPP] ========================================');
      
      // Configurações de segurança do Puppeteer
      const puppeteerOptions = {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor',
          '--disable-extensions',
          '--disable-plugins',
          '--disable-images',
          '--disable-javascript',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding',
          '--disable-field-trial-config',
          '--disable-ipc-flooding-protection',
          '--single-process', // Importante para Render
          '--no-zygote',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage'
        ],
        ignoreDefaultArgs: ['--enable-automation'],
        timeout: 30000
      };

      this.client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: puppeteerOptions
      });

      this.client.on('qr', (qr) => {
        console.log('📱 [WHATSAPP] ========================================');
        console.log('📱 [WHATSAPP] 🔥 QR CODE GERADO - ESCANEIE AGORA! 🔥');
        console.log('📱 [WHATSAPP] ========================================');
        console.log('📱 [WHATSAPP] Abra o WhatsApp no celular e escaneie:');
        qrcode.generate(qr, { small: true });
        console.log('📱 [WHATSAPP] ========================================');
      });

      this.client.on('ready', () => {
        console.log('📱 [WHATSAPP] ========================================');
        console.log('📱 [WHATSAPP] ✅ WHATSAPP CONECTADO E PRONTO! ✅');
        console.log('📱 [WHATSAPP] ========================================');
        this.isReady = true;
      });

      this.client.on('disconnected', (reason) => {
        console.log('❌ [WHATSAPP] Cliente desconectado:', reason);
        this.isReady = false;
      });

      this.client.on('auth_failure', (msg) => {
        console.error('❌ [WHATSAPP] Falha na autenticação:', msg);
      });

      await this.client.initialize();
    } catch (error) {
      console.error('❌ [WHATSAPP] Erro ao inicializar:', error);
    }
  }

  async gerarMensagemInteligente(tipo, dados) {
    try {
      // Verificar rate limits antes de usar Groq
      const tokensEstimados = 150; // Estimativa baseada no max_tokens
      const podeUsarGroq = await this.rateLimitController.podeFazerRequisicao('groq', tokensEstimados);
      
      if (!podeUsarGroq) {
        console.warn('⚠️ [WHATSAPP] Rate limit atingido, usando mensagem padrão');
        return this.getMensagemPadrao(tipo, dados);
      }

      const prompt = this.criarPrompt(tipo, dados);
      
      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "Você é um assistente de barbearia que envia mensagens amigáveis e profissionais via WhatsApp. Mantenha as mensagens curtas, cordiais e informativas."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        model: "llama3-8b-8192",
        temperature: 0.7,
        max_tokens: 150,
      });

      // Registrar uso do Groq
      const tokensUsados = completion.usage?.total_tokens || tokensEstimados;
      this.rateLimitController.registrarUso('groq', tokensUsados);

      return completion.choices[0]?.message?.content || this.getMensagemPadrao(tipo, dados);
    } catch (error) {
      console.error('❌ [GROQ] Erro ao gerar mensagem:', error);
      return this.getMensagemPadrao(tipo, dados);
    }
  }

  criarPrompt(tipo, dados) {
    const { cliente, barbearia, posicao, tempoEstimado } = dados;
    
    switch (tipo) {
      case 'vez_chegou':
        return `Gere uma mensagem amigável para ${cliente.nome} informando que sua vez chegou na barbearia ${barbearia.nome}. 
        A mensagem deve ser curta, cordial e incluir instruções para se dirigir ao atendimento. 
        Use emojis apropriados e seja profissional mas caloroso.`;
      
      case 'atendimento_iniciado':
        return `Gere uma mensagem para ${cliente.nome} informando que o atendimento foi iniciado na barbearia ${barbearia.nome}. 
        A mensagem deve ser breve e agradecer a paciência.`;
      
      case 'atendimento_finalizado':
        return `Gere uma mensagem de agradecimento para ${cliente.nome} pelo atendimento na barbearia ${barbearia.nome}. 
        A mensagem deve ser cordial e convidar para retornar.`;
      
      case 'posicao_fila':
        return `Gere uma mensagem informativa para ${cliente.nome} sobre sua posição ${posicao} na fila da barbearia ${barbearia.nome}. 
        Inclua tempo estimado de ${tempoEstimado} minutos. Seja positivo e informativo.`;
      
      default:
        return `Gere uma mensagem amigável para ${cliente.nome} sobre a barbearia ${barbearia.nome}.`;
    }
  }

  getMensagemPadrao(tipo, dados) {
    const { cliente, barbearia, posicao, tempoEstimado } = dados;
    
    switch (tipo) {
      case 'vez_chegou':
        return `🎉 *${cliente.nome}*, sua vez chegou!\n\n` +
               `📍 *${barbearia.nome}*\n` +
               `⏰ Dirija-se ao atendimento\n` +
               `🙏 Obrigado pela paciência!`;
      
      case 'atendimento_iniciado':
        return `✂️ *${cliente.nome}*, atendimento iniciado!\n\n` +
               `📍 *${barbearia.nome}*\n` +
               `⏰ Seu barbeiro está pronto\n` +
               `🎯 Aproveite o serviço!`;
      
      case 'atendimento_finalizado':
        return `✨ *${cliente.nome}*, atendimento finalizado!\n\n` +
               `📍 *${barbearia.nome}*\n` +
               `💇‍♂️ Obrigado pela preferência\n` +
               `🔄 Volte sempre!`;
      
      case 'posicao_fila':
        return `📋 *${cliente.nome}*, status da fila:\n\n` +
               `📍 *${barbearia.nome}*\n` +
               `🎯 Posição: ${posicao}\n` +
               `⏱️ Tempo estimado: ${tempoEstimado} min\n` +
               `⏳ Aguarde ser chamado`;
      
      default:
        return `Olá *${cliente.nome}*! Mensagem da *${barbearia.nome}*.`;
    }
  }

  async enviarNotificacao(telefone, tipo, dados) {
    try {
      if (!this.isReady) {
        console.warn('⚠️ [WHATSAPP] Cliente não está pronto. Tentando reconectar...');
        await this.init();
        return false;
      }

      // Verificar rate limits do WhatsApp
      const podeEnviarWhatsApp = await this.rateLimitController.podeFazerRequisicao('whatsapp');
      if (!podeEnviarWhatsApp) {
        console.warn('⚠️ [WHATSAPP] Rate limit do WhatsApp atingido');
        return false;
      }

      // Verificar se pode enviar para este usuário
      const podeEnviarParaUsuario = await this.rateLimitController.podeEnviarParaUsuario(telefone, tipo);
      if (!podeEnviarParaUsuario) {
        console.warn('⚠️ [WHATSAPP] Usuário atingiu limite de notificações');
        return false;
      }

      // Formatar telefone (remover caracteres especiais e adicionar código do país se necessário)
      const telefoneFormatado = this.formatarTelefone(telefone);
      
      if (!telefoneFormatado) {
        console.error('❌ [WHATSAPP] Telefone inválido:', telefone);
        return false;
      }

      // Gerar mensagem inteligente
      const mensagem = await this.gerarMensagemInteligente(tipo, dados);
      
      // Enviar mensagem
      const chatId = `${telefoneFormatado}@c.us`;
      const resultado = await this.client.sendMessage(chatId, mensagem);
      
      // Registrar uso do WhatsApp
      this.rateLimitController.registrarUso('whatsapp');
      
      console.log(`✅ [WHATSAPP] Notificação enviada para ${telefoneFormatado}:`, {
        tipo,
        cliente: dados.cliente?.nome,
        barbearia: dados.barbearia?.nome,
        messageId: resultado.id._serialized
      });

      return true;
    } catch (error) {
      console.error('❌ [WHATSAPP] Erro ao enviar notificação:', error);
      return false;
    }
  }

  formatarTelefone(telefone) {
    try {
      // Remover todos os caracteres não numéricos
      let numero = telefone.replace(/\D/g, '');
      
      // Se não tem código do país, adicionar 55 (Brasil)
      if (numero.length === 11 && numero.startsWith('0')) {
        numero = '55' + numero.substring(1);
      } else if (numero.length === 10) {
        numero = '55' + numero;
      } else if (numero.length === 11 && !numero.startsWith('55')) {
        numero = '55' + numero;
      }
      
      // Validar se tem pelo menos 12 dígitos (55 + DDD + número)
      if (numero.length < 12) {
        return null;
      }
      
      return numero;
    } catch (error) {
      console.error('❌ [WHATSAPP] Erro ao formatar telefone:', error);
      return null;
    }
  }

  async notificarVezChegou(cliente, barbearia) {
    return this.enviarNotificacao(cliente.telefone, 'vez_chegou', {
      cliente,
      barbearia
    });
  }

  async notificarAtendimentoIniciado(cliente, barbearia) {
    return this.enviarNotificacao(cliente.telefone, 'atendimento_iniciado', {
      cliente,
      barbearia
    });
  }

  async notificarAtendimentoFinalizado(cliente, barbearia) {
    return this.enviarNotificacao(cliente.telefone, 'atendimento_finalizado', {
      cliente,
      barbearia
    });
  }

  async notificarPosicaoFila(cliente, barbearia, posicao, tempoEstimado = 15) {
    return this.enviarNotificacao(cliente.telefone, 'posicao_fila', {
      cliente,
      barbearia,
      posicao,
      tempoEstimado
    });
  }

  async getStatus() {
    return {
      isReady: this.isReady,
      isConnected: this.client ? true : false
    };
  }

  async disconnect() {
    if (this.client) {
      await this.client.destroy();
      this.isReady = false;
    }
  }
}

// Singleton para garantir uma única instância
let whatsappServiceInstance = null;

function getWhatsAppService() {
  if (!whatsappServiceInstance) {
    whatsappServiceInstance = new WhatsAppService();
  }
  return whatsappServiceInstance;
}

module.exports = { WhatsAppService, getWhatsAppService }; 