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

  // ========================================
  // 🎯 MÉTODOS SIMPLIFICADOS - APENAS 2!
  // ========================================

  /**
   * 1. NOTIFICAR QUE A VEZ CHEGOU (COM NOME DO BARBEIRO)
   */
  async notificarVezChegou(nomeCliente, nomeBarbeiro, telefone) {
    try {
      if (!this.isReady) {
        console.warn('⚠️ [WHATSAPP] Cliente não está pronto');
        return false;
      }

      const telefoneFormatado = this.formatarTelefone(telefone);
      
      // Verificar rate limits
      const podeUsarGroq = await this.rateLimitController.podeFazerRequisicao('groq', 100);
      
      let mensagem;
      if (podeUsarGroq) {
        // Usar Groq AI para mensagem personalizada
        mensagem = await this.gerarMensagemVezChegou(nomeCliente, nomeBarbeiro);
      } else {
        // Usar mensagem padrão
        mensagem = this.getMensagemPadraoVezChegou(nomeCliente, nomeBarbeiro);
      }

      // Enviar mensagem
      await this.client.sendMessage(telefoneFormatado, mensagem);
      
      console.log(`✅ [WHATSAPP] Notificação enviada para ${nomeCliente} - Vez chegou!`);
      return true;
    } catch (error) {
      console.error('❌ [WHATSAPP] Erro ao notificar vez chegou:', error);
      return false;
    }
  }

  /**
   * 2. ENVIAR LINK DE AVALIAÇÃO
   */
  async enviarAvaliacao(nomeCliente, linkAvaliacao, telefone) {
    try {
      if (!this.isReady) {
        console.warn('⚠️ [WHATSAPP] Cliente não está pronto');
        return false;
      }

      const telefoneFormatado = this.formatarTelefone(telefone);
      
      // Verificar rate limits
      const podeUsarGroq = await this.rateLimitController.podeFazerRequisicao('groq', 100);
      
      let mensagem;
      if (podeUsarGroq) {
        // Usar Groq AI para mensagem personalizada
        mensagem = await this.gerarMensagemAvaliacao(nomeCliente, linkAvaliacao);
      } else {
        // Usar mensagem padrão
        mensagem = this.getMensagemPadraoAvaliacao(nomeCliente, linkAvaliacao);
      }

      // Enviar mensagem
      await this.client.sendMessage(telefoneFormatado, mensagem);
      
      console.log(`✅ [WHATSAPP] Link de avaliação enviado para ${nomeCliente}!`);
      return true;
    } catch (error) {
      console.error('❌ [WHATSAPP] Erro ao enviar avaliação:', error);
      return false;
    }
  }

  // ========================================
  // 🤖 GERAÇÃO DE MENSAGENS COM GROQ AI
  // ========================================

  async gerarMensagemVezChegou(nomeCliente, nomeBarbeiro) {
    try {
      const prompt = `Gere uma mensagem amigável e profissional para WhatsApp informando que a vez do cliente chegou na barbearia.

Contexto:
- Nome do cliente: ${nomeCliente}
- Nome do barbeiro: ${nomeBarbeiro}
- Barbearia: Lucas Barbearia

Requisitos:
- Tom amigável e profissional
- Incluir emojis apropriados
- Mencionar o nome do barbeiro
- Máximo 3 linhas
- Não incluir saudações longas

Exemplo de estrutura:
🎉 Olá [Nome]! Sua vez chegou na Lucas Barbearia!
✂️ Barbeiro: [Nome do Barbeiro]
Venha até o balcão!`;

      const completion = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama3-8b-8192',
        max_tokens: 100,
        temperature: 0.7,
      });

      return completion.choices[0]?.message?.content || this.getMensagemPadraoVezChegou(nomeCliente, nomeBarbeiro);
    } catch (error) {
      console.error('❌ [WHATSAPP] Erro ao gerar mensagem com Groq:', error);
      return this.getMensagemPadraoVezChegou(nomeCliente, nomeBarbeiro);
    }
  }

  async gerarMensagemAvaliacao(nomeCliente, linkAvaliacao) {
    try {
      const prompt = `Gere uma mensagem amigável para WhatsApp pedindo avaliação do serviço.

Contexto:
- Nome do cliente: ${nomeCliente}
- Link da avaliação: ${linkAvaliacao}
- Barbearia: Lucas Barbearia

Requisitos:
- Tom agradecido e amigável
- Incluir emojis apropriados
- Mencionar que o atendimento foi concluído
- Incluir o link da avaliação
- Máximo 4 linhas
- Não ser muito longo

Exemplo de estrutura:
✨ [Nome], seu atendimento foi concluído!
⭐ Que tal avaliar nosso serviço?
Clique aqui: [LINK]
Sua opinião é muito importante para nós!`;

      const completion = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama3-8b-8192',
        max_tokens: 120,
        temperature: 0.7,
      });

      return completion.choices[0]?.message?.content || this.getMensagemPadraoAvaliacao(nomeCliente, linkAvaliacao);
    } catch (error) {
      console.error('❌ [WHATSAPP] Erro ao gerar mensagem com Groq:', error);
      return this.getMensagemPadraoAvaliacao(nomeCliente, linkAvaliacao);
    }
  }

  // ========================================
  // 📝 MENSAGENS PADRÃO (FALLBACK)
  // ========================================

  getMensagemPadraoVezChegou(nomeCliente, nomeBarbeiro) {
    return `🎉 Olá ${nomeCliente}! Sua vez chegou na Lucas Barbearia!

✂️ Barbeiro: ${nomeBarbeiro}
Venha até o balcão!

Obrigado pela paciência! 🙏`;
  }

  getMensagemPadraoAvaliacao(nomeCliente, linkAvaliacao) {
    return `✨ ${nomeCliente}, seu atendimento foi concluído!

⭐ Que tal avaliar nosso serviço?
Clique aqui: ${linkAvaliacao}

Sua opinião é muito importante para nós! 🙏`;
  }

  // ========================================
  // 🛠️ UTILITÁRIOS
  // ========================================

  formatarTelefone(telefone) {
    // Remove tudo que não é número
    let numero = telefone.replace(/\D/g, '');
    
    // Adiciona código do país se não tiver
    if (numero.length === 11 && numero.startsWith('0')) {
      numero = '55' + numero.substring(1);
    } else if (numero.length === 10) {
      numero = '55' + numero;
    }
    
    // Adiciona @c.us para WhatsApp
    return numero + '@c.us';
  }

  async getStatus() {
    return {
      isReady: this.isReady,
      isConnected: this.client ? true : false,
      rateLimitStatus: await this.rateLimitController.getEstatisticas()
    };
  }

  async disconnect() {
    if (this.client) {
      await this.client.destroy();
      this.isReady = false;
      console.log('📱 [WHATSAPP] Cliente desconectado');
    }
  }
}

// ========================================
// 🎯 SINGLETON PATTERN
// ========================================

let whatsappServiceInstance = null;

function getWhatsAppService() {
  if (!whatsappServiceInstance) {
    whatsappServiceInstance = new WhatsAppService();
  }
  return whatsappServiceInstance;
}

module.exports = { WhatsAppService, getWhatsAppService }; 