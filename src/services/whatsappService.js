const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { getRateLimitController } = require('../controllers/RateLimitController');

class WhatsAppService {
  constructor() {
    this.client = null;
    this.isReady = false;
    
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
      console.log('📱 [WHATSAPP] ========================================');
      console.log('📱 [WHATSAPP] 🎯 INICIANDO NOTIFICAÇÃO: VEZ CHEGOU');
      console.log('📱 [WHATSAPP] ========================================');
      console.log(`📱 [WHATSAPP] Cliente: ${nomeCliente}`);
      console.log(`📱 [WHATSAPP] Barbeiro: ${nomeBarbeiro}`);
      console.log(`📱 [WHATSAPP] Telefone: ${telefone}`);
      
      if (!this.isReady) {
        console.warn('⚠️ [WHATSAPP] ❌ CLIENTE NÃO ESTÁ PRONTO');
        return false;
      }
      
      console.log('✅ [WHATSAPP] Cliente WhatsApp está pronto');

      // Gerar números alternativos (com e sem 9)
      const numerosAlternativos = this.gerarNumerosAlternativos(telefone);
      
      // Usar mensagem padrão (sem IA desnecessária)
      console.log('📱 [WHATSAPP] Usando mensagem padrão...');
      const mensagem = this.getMensagemPadraoVezChegou(nomeCliente, nomeBarbeiro);
      console.log('✅ [WHATSAPP] Mensagem padrão definida');
      
      console.log('📱 [WHATSAPP] Mensagem final:');
      console.log('📱 [WHATSAPP] ========================================');
      console.log(mensagem);
      console.log('📱 [WHATSAPP] ========================================');

      // Enviar mensagem para múltiplos números
      console.log('📱 [WHATSAPP] Enviando mensagem para múltiplos números...');
      const enviado = await this.tentarEnviarParaMultiplos(numerosAlternativos, mensagem);
      
      if (enviado) {
        console.log('📱 [WHATSAPP] ========================================');
        console.log(`✅ [WHATSAPP] NOTIFICAÇÃO ENVIADA COM SUCESSO!`);
        console.log(`✅ [WHATSAPP] Cliente: ${nomeCliente}`);
        console.log(`✅ [WHATSAPP] Barbeiro: ${nomeBarbeiro}`);
        console.log(`✅ [WHATSAPP] Números tentados: ${numerosAlternativos.length}`);
        console.log('📱 [WHATSAPP] ========================================');
        return true;
      } else {
        console.log('📱 [WHATSAPP] ========================================');
        console.log(`❌ [WHATSAPP] FALHA AO ENVIAR NOTIFICAÇÃO`);
        console.log(`❌ [WHATSAPP] Cliente: ${nomeCliente}`);
        console.log(`❌ [WHATSAPP] Barbeiro: ${nomeBarbeiro}`);
        console.log(`❌ [WHATSAPP] Números tentados: ${numerosAlternativos.length}`);
        console.log('📱 [WHATSAPP] ========================================');
        return false;
      }
    } catch (error) {
      console.log('📱 [WHATSAPP] ========================================');
      console.log('❌ [WHATSAPP] ERRO AO NOTIFICAR VEZ CHEGOU');
      console.log('❌ [WHATSAPP] ========================================');
      console.error('❌ [WHATSAPP] Erro completo:', error);
      console.log('❌ [WHATSAPP] ========================================');
      return false;
    }
  }

  /**
   * 2. ENVIAR LINK DE AVALIAÇÃO
   */
  async enviarAvaliacao(nomeCliente, linkAvaliacao, telefone) {
    try {
      console.log('📱 [WHATSAPP] ========================================');
      console.log('📱 [WHATSAPP] 🎯 INICIANDO ENVIO: LINK DE AVALIAÇÃO');
      console.log('📱 [WHATSAPP] ========================================');
      console.log(`📱 [WHATSAPP] Cliente: ${nomeCliente}`);
      console.log(`📱 [WHATSAPP] Link: ${linkAvaliacao}`);
      console.log(`📱 [WHATSAPP] Telefone: ${telefone}`);
      
      if (!this.isReady) {
        console.warn('⚠️ [WHATSAPP] ❌ CLIENTE NÃO ESTÁ PRONTO');
        return false;
      }
      
      console.log('✅ [WHATSAPP] Cliente WhatsApp está pronto');

      // Gerar números alternativos (com e sem 9)
      const numerosAlternativos = this.gerarNumerosAlternativos(telefone);
      
      // Usar mensagem padrão (sem IA desnecessária)
      console.log('📱 [WHATSAPP] Usando mensagem padrão...');
      const mensagem = this.getMensagemPadraoAvaliacao(nomeCliente, linkAvaliacao);
      console.log('✅ [WHATSAPP] Mensagem padrão definida');
      
      console.log('📱 [WHATSAPP] Mensagem final:');
      console.log('📱 [WHATSAPP] ========================================');
      console.log(mensagem);
      console.log('📱 [WHATSAPP] ========================================');

      // Enviar mensagem para múltiplos números
      console.log('📱 [WHATSAPP] Enviando mensagem para múltiplos números...');
      const enviado = await this.tentarEnviarParaMultiplos(numerosAlternativos, mensagem);
      
      if (enviado) {
        console.log('📱 [WHATSAPP] ========================================');
        console.log(`✅ [WHATSAPP] LINK DE AVALIAÇÃO ENVIADO COM SUCESSO!`);
        console.log(`✅ [WHATSAPP] Cliente: ${nomeCliente}`);
        console.log(`✅ [WHATSAPP] Link: ${linkAvaliacao}`);
        console.log(`✅ [WHATSAPP] Números tentados: ${numerosAlternativos.length}`);
        console.log('📱 [WHATSAPP] ========================================');
        return true;
      } else {
        console.log('📱 [WHATSAPP] ========================================');
        console.log(`❌ [WHATSAPP] FALHA AO ENVIAR LINK DE AVALIAÇÃO`);
        console.log(`❌ [WHATSAPP] Cliente: ${nomeCliente}`);
        console.log(`❌ [WHATSAPP] Link: ${linkAvaliacao}`);
        console.log(`❌ [WHATSAPP] Números tentados: ${numerosAlternativos.length}`);
        console.log('📱 [WHATSAPP] ========================================');
        return false;
      }
    } catch (error) {
      console.log('📱 [WHATSAPP] ========================================');
      console.log('❌ [WHATSAPP] ERRO AO ENVIAR LINK DE AVALIAÇÃO');
      console.log('❌ [WHATSAPP] ========================================');
      console.error('❌ [WHATSAPP] Erro completo:', error);
      console.log('❌ [WHATSAPP] ========================================');
      return false;
    }
  }



  // ========================================
  // 📝 MENSAGENS PADRÃO (FALLBACK)
  // ========================================

  getMensagemPadraoVezChegou(nomeCliente, nomeBarbeiro) {
    console.log('📝 [PADRÃO] Usando mensagem padrão para vez chegou');
    return `🎉 Olá ${nomeCliente}! Sua vez chegou na Lucas Barbearia!

✂️ Barbeiro: ${nomeBarbeiro}
Venha até o balcão!

Obrigado pela paciência! 🙏`;
  }

  getMensagemPadraoAvaliacao(nomeCliente, linkAvaliacao) {
    console.log('📝 [PADRÃO] Usando mensagem padrão para avaliação');
    return `✨ ${nomeCliente}, seu atendimento foi concluído!

⭐ Que tal avaliar nosso serviço?
Clique aqui: ${linkAvaliacao}

⏰ Link válido por 24 horas
Sua opinião é muito importante para nós! 🙏`;
  }

  // ========================================
  // 🛠️ UTILITÁRIOS
  // ========================================

  formatarTelefone(telefone) {
    console.log(`📱 [FORMATAÇÃO] Telefone original: ${telefone}`);
    
    // Remove tudo que não é número
    let numero = telefone.replace(/\D/g, '');
    console.log(`📱 [FORMATAÇÃO] Apenas números: ${numero}`);
    
    // Garantir que sempre tenha o código do Brasil (55)
    if (numero.startsWith('55')) {
      // Já tem código do Brasil
      console.log(`📱 [FORMATAÇÃO] Já tem código do Brasil: ${numero}`);
    } else if (numero.length === 11 && numero.startsWith('0')) {
      // Remove o 0 inicial e adiciona 55
      numero = '55' + numero.substring(1);
      console.log(`📱 [FORMATAÇÃO] Adicionado código do país (11 dígitos com 0): ${numero}`);
    } else if (numero.length === 11 && !numero.startsWith('0')) {
      // Número de 11 dígitos sem 0 inicial, adiciona 55
      numero = '55' + numero;
      console.log(`📱 [FORMATAÇÃO] Adicionado código do país (11 dígitos): ${numero}`);
    } else if (numero.length === 10) {
      // Número de 10 dígitos, adiciona 55
      numero = '55' + numero;
      console.log(`📱 [FORMATAÇÃO] Adicionado código do país (10 dígitos): ${numero}`);
    } else if (numero.length === 9) {
      // Número de 9 dígitos (celular), adiciona 55
      numero = '55' + numero;
      console.log(`📱 [FORMATAÇÃO] Adicionado código do país (9 dígitos): ${numero}`);
    } else {
      // Outros casos, adiciona 55 por segurança
      numero = '55' + numero;
      console.log(`📱 [FORMATAÇÃO] Adicionado código do país (outros casos): ${numero}`);
    }
    
    // Adiciona @c.us para WhatsApp
    const numeroFinal = numero + '@c.us';
    console.log(`📱 [FORMATAÇÃO] Número final: ${numeroFinal}`);
    
    return numeroFinal;
  }

  /**
   * Gerar números alternativos para WhatsApp (solução definitiva)
   * - Prioriza o número SEM 9 (formato real do WhatsApp)
   * - Gera versão COM 9 apenas como fallback para celulares
   */
  gerarNumerosAlternativos(telefone) {
    // 1. Normaliza o número (remove tudo que não é dígito)
    const numero = telefone.replace(/\D/g, '');

    // 2. Garante o DDI 55
    const numeroComDDI = numero.startsWith('55') ? numero : `55${numero}`;

    // 3. Extrai DDD e o restante
    const ddd = numeroComDDI.substring(2, 4);
    let resto = numeroComDDI.substring(4);

    // 4. Remove o 9 inicial se existir (padrão WhatsApp)
    const numeroWhatsApp = `55${ddd}${resto.startsWith('9') ? resto.substring(1) : resto}@c.us`;

    // 5. Versão com 9 (apenas para celulares como fallback)
    const isCelular = [6, 7, 8, 9].includes(resto.charAt(0)); // Verifica se é celular
    const numeroCom9 = isCelular && resto.length === 8 ? `55${ddd}9${resto}@c.us` : null;

    const numeros = [numeroWhatsApp];
    if (numeroCom9) numeros.push(numeroCom9);

    console.log('📱 Números gerados:', numeros);
    return numeros;
  }

  /**
   * Tentar enviar mensagem para múltiplos números
   */
  async tentarEnviarParaMultiplos(numeros, mensagem) {
    console.log(`📱 [MULTIPLOS] Tentando enviar para ${numeros.length} números...`);
    
    for (let i = 0; i < numeros.length; i++) {
      const numero = numeros[i];
      const numeroParaLink = numero.replace('@c.us', '');
      const linkWhatsApp = `https://api.whatsapp.com/send/?phone=${numeroParaLink}&text&type=phone_number&app_absent=0`;
      
      console.log(`📱 [MULTIPLOS] Tentativa ${i + 1}/${numeros.length}: ${numeroParaLink}`);
      console.log(`📱 [MULTIPLOS] Link: ${linkWhatsApp}`);
      
      try {
        await this.client.sendMessage(numero, mensagem);
        console.log(`✅ [MULTIPLOS] Mensagem enviada com sucesso para: ${numeroParaLink}`);
        return true; // Sucesso, para de tentar
      } catch (error) {
        console.log(`❌ [MULTIPLOS] Falha ao enviar para: ${numeroParaLink} - ${error.message}`);
        
        // Se é a última tentativa, retorna false
        if (i === numeros.length - 1) {
          console.log(`❌ [MULTIPLOS] Todas as tentativas falharam`);
          return false;
        }
        
        // Aguarda um pouco antes da próxima tentativa
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return false;
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