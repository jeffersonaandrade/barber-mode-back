const fs = require('fs').promises;
const path = require('path');

class RateLimitController {
  constructor() {
    // Configurações de rate limits (baseadas no bot)
    this.config = {
      rateLimits: {
        RPM: 30,        // Requests por minuto (Groq)
        RPD: 14400,     // Requests por dia (Groq)
        TPM: 6000,      // Tokens por minuto (Groq)
        TPD: 500000,    // Tokens por dia (Groq)
        WPM: 50,        // WhatsApp messages por minuto
        WPD: 1000,      // WhatsApp messages por dia
        marginSeguranca: 0.8  // 80% dos limites
      },
      numeroRespostas: {
        ativo: true,
        maxRespostas: 5,  // Máximo de notificações por cliente por dia
        permitirContinuarSeInteressado: true
      },
      bloqueioTransferencia: {
        ativo: true,
        tempoBloqueio: 24 * 60 * 60 * 1000,  // 24 horas em ms
        arquivoBloqueados: 'usuarios-bloqueados.json'
      }
    };

    // Controle de rate limits
    this.controle = {
      requests: {
        minuto: { contador: 0, resetTime: this.getNextMinute() },
        dia: { contador: 0, resetTime: this.getNextDay() }
      },
      tokens: {
        minuto: { contador: 0, resetTime: this.getNextMinute() },
        dia: { contador: 0, resetTime: this.getNextDay() }
      },
      whatsapp: {
        minuto: { contador: 0, resetTime: this.getNextMinute() },
        dia: { contador: 0, resetTime: this.getNextDay() }
      }
    };

    // Controle de usuários
    this.usuarios = new Map();
    this.usuariosBloqueados = new Map();

    // Status do sistema
    this.sistemaAtivo = true;
    this.motivoDesativacao = null;

    // Inicializar
    this.inicializar();
  }

  async inicializar() {
    try {
      // Carregar usuários bloqueados do arquivo
      await this.carregarUsuariosBloqueados();
      
      // Iniciar reset automático
      this.iniciarResetAutomatico();
      
      console.log('✅ [RATE_LIMIT] Controlador inicializado com sucesso');
    } catch (error) {
      console.error('❌ [RATE_LIMIT] Erro ao inicializar:', error);
    }
  }

  // ===== RATE LIMITS PRINCIPAIS =====

  async podeFazerRequisicao(tipo = 'groq', tokensEstimados = 0) {
    try {
      // Verificar se sistema está ativo
      if (!this.sistemaAtivo) {
        console.warn('⚠️ [RATE_LIMIT] Sistema desativado:', this.motivoDesativacao);
        return false;
      }

      // Reset automático se necessário
      this.verificarResetAutomatico();

      // Verificar limites baseados no tipo
      switch (tipo) {
        case 'groq':
          return this.verificarLimitesGroq(tokensEstimados);
        case 'whatsapp':
          return this.verificarLimitesWhatsApp();
        default:
          return true;
      }
    } catch (error) {
      console.error('❌ [RATE_LIMIT] Erro ao verificar rate limit:', error);
      return false;
    }
  }

  verificarLimitesGroq(tokensEstimados = 0) {
    const limites = this.config.rateLimits;
    
    // Calcular limites seguros (80%)
    const limiteSeguroRPM = Math.floor(limites.RPM * limites.marginSeguranca);
    const limiteSeguroRPD = Math.floor(limites.RPD * limites.marginSeguranca);
    const limiteSeguroTPM = Math.floor(limites.TPM * limites.marginSeguranca);
    const limiteSeguroTPD = Math.floor(limites.TPD * limites.marginSeguranca);

    // Verificar se próximo do limite
    const proximoLimiteRPM = this.controle.requests.minuto.contador >= limiteSeguroRPM;
    const proximoLimiteRPD = this.controle.requests.dia.contador >= limiteSeguroRPD;
    const proximoLimiteTPM = (this.controle.tokens.minuto.contador + tokensEstimados) >= limiteSeguroTPM;
    const proximoLimiteTPD = (this.controle.tokens.dia.contador + tokensEstimados) >= limiteSeguroTPD;

    if (proximoLimiteRPM || proximoLimiteRPD || proximoLimiteTPM || proximoLimiteTPD) {
      this.desativarSistema('rate_limit_proximo');
      return false;
    }

    return true;
  }

  verificarLimitesWhatsApp() {
    const limites = this.config.rateLimits;
    
    // Calcular limites seguros (80%)
    const limiteSeguroWPM = Math.floor(limites.WPM * limites.marginSeguranca);
    const limiteSeguroWPD = Math.floor(limites.WPD * limites.marginSeguranca);

    // Verificar se próximo do limite
    const proximoLimiteWPM = this.controle.whatsapp.minuto.contador >= limiteSeguroWPM;
    const proximoLimiteWPD = this.controle.whatsapp.dia.contador >= limiteSeguroWPD;

    if (proximoLimiteWPM || proximoLimiteWPD) {
      this.desativarSistema('whatsapp_rate_limit_proximo');
      return false;
    }

    return true;
  }

  // ===== REGISTRO DE USO =====

  registrarUso(tipo = 'groq', tokens = 0) {
    try {
      // Reset automático se necessário
      this.verificarResetAutomatico();

      // Registrar uso baseado no tipo
      switch (tipo) {
        case 'groq':
          this.controle.requests.minuto.contador++;
          this.controle.requests.dia.contador++;
          this.controle.tokens.minuto.contador += tokens;
          this.controle.tokens.dia.contador += tokens;
          break;
        case 'whatsapp':
          this.controle.whatsapp.minuto.contador++;
          this.controle.whatsapp.dia.contador++;
          break;
      }

      // Log do uso
      this.logger.info('Uso registrado', {
        tipo,
        tokens,
        requests: {
          minuto: this.controle.requests.minuto.contador,
          dia: this.controle.requests.dia.contador
        },
        tokens: {
          minuto: this.controle.tokens.minuto.contador,
          dia: this.controle.tokens.dia.contador
        },
        whatsapp: {
          minuto: this.controle.whatsapp.minuto.contador,
          dia: this.controle.whatsapp.dia.contador
        }
      });

    } catch (error) {
      console.error('❌ [RATE_LIMIT] Erro ao registrar uso:', error);
    }
  }

  // ===== CONTROLE DE USUÁRIOS =====

  async podeEnviarParaUsuario(telefone, tipoNotificacao = 'vez_chegou') {
    try {
      // Verificar se usuário está bloqueado
      if (this.usuariosBloqueados.has(telefone)) {
        const bloqueio = this.usuariosBloqueados.get(telefone);
        if (Date.now() < bloqueio.ate) {
          console.log(`🚫 [RATE_LIMIT] Usuário ${telefone} bloqueado até ${new Date(bloqueio.ate)}`);
          return false;
        } else {
          // Remover bloqueio expirado
          this.usuariosBloqueados.delete(telefone);
          await this.salvarUsuariosBloqueados();
        }
      }

      // Verificar limite de notificações por usuário
      if (!this.config.numeroRespostas.ativo) {
        return true;
      }

      const hoje = new Date().toDateString();
      const usuario = this.usuarios.get(telefone) || { notificacoes: {} };
      
      if (!usuario.notificacoes[hoje]) {
        usuario.notificacoes[hoje] = 0;
      }

      const limite = this.config.numeroRespostas.maxRespostas;
      
      if (usuario.notificacoes[hoje] >= limite) {
        console.log(`🚫 [RATE_LIMIT] Usuário ${telefone} atingiu limite de ${limite} notificações hoje`);
        return false;
      }

      // Registrar notificação
      usuario.notificacoes[hoje]++;
      this.usuarios.set(telefone, usuario);

      return true;
    } catch (error) {
      console.error('❌ [RATE_LIMIT] Erro ao verificar usuário:', error);
      return false;
    }
  }

  async bloquearUsuario(telefone, motivo = 'transferencia') {
    try {
      const bloqueio = {
        telefone,
        motivo,
        desde: Date.now(),
        ate: Date.now() + this.config.bloqueioTransferencia.tempoBloqueio
      };

      this.usuariosBloqueados.set(telefone, bloqueio);
      await this.salvarUsuariosBloqueados();

      console.log(`🚫 [RATE_LIMIT] Usuário ${telefone} bloqueado por ${motivo} até ${new Date(bloqueio.ate)}`);
    } catch (error) {
      console.error('❌ [RATE_LIMIT] Erro ao bloquear usuário:', error);
    }
  }

  // ===== RESET AUTOMÁTICO =====

  verificarResetAutomatico() {
    const agora = Date.now();

    // Reset por minuto
    if (agora >= this.controle.requests.minuto.resetTime) {
      this.resetMinuto();
    }

    // Reset por dia
    if (agora >= this.controle.requests.dia.resetTime) {
      this.resetDia();
    }
  }

  resetMinuto() {
    this.controle.requests.minuto.contador = 0;
    this.controle.requests.minuto.resetTime = this.getNextMinute();
    this.controle.tokens.minuto.contador = 0;
    this.controle.tokens.minuto.resetTime = this.getNextMinute();
    this.controle.whatsapp.minuto.contador = 0;
    this.controle.whatsapp.minuto.resetTime = this.getNextMinute();

    console.log('🔄 [RATE_LIMIT] Reset por minuto realizado');
  }

  resetDia() {
    this.controle.requests.dia.contador = 0;
    this.controle.requests.dia.resetTime = this.getNextDay();
    this.controle.tokens.dia.contador = 0;
    this.controle.tokens.dia.resetTime = this.getNextDay();
    this.controle.whatsapp.dia.contador = 0;
    this.controle.whatsapp.dia.resetTime = this.getNextDay();

    // Limpar notificações diárias dos usuários
    this.usuarios.clear();

    console.log('🔄 [RATE_LIMIT] Reset diário realizado');
  }

  iniciarResetAutomatico() {
    // Verificar a cada 30 segundos
    setInterval(() => {
      this.verificarResetAutomatico();
    }, 30000);
  }

  // ===== UTILITÁRIOS =====

  getNextMinute() {
    const agora = new Date();
    agora.setMinutes(agora.getMinutes() + 1, 0, 0);
    return agora.getTime();
  }

  getNextDay() {
    const agora = new Date();
    agora.setDate(agora.getDate() + 1);
    agora.setHours(0, 0, 0, 0);
    return agora.getTime();
  }

  // ===== CONTROLE DO SISTEMA =====

  desativarSistema(motivo) {
    this.sistemaAtivo = false;
    this.motivoDesativacao = motivo;
    
    console.warn(`🛑 [RATE_LIMIT] Sistema desativado: ${motivo}`);
    
    // Log das estatísticas no momento da desativação
    this.logger.info('Sistema desativado - Estatísticas finais', this.getEstatisticas());
  }

  reativarSistema() {
    this.sistemaAtivo = true;
    this.motivoDesativacao = null;
    console.log('✅ [RATE_LIMIT] Sistema reativado manualmente');
  }

  sistemaEstaAtivo() {
    return this.sistemaAtivo;
  }

  // ===== ESTATÍSTICAS =====

  getEstatisticas() {
    const limites = this.config.rateLimits;
    
    return {
      sistemaAtivo: this.sistemaAtivo,
      motivoDesativacao: this.motivoDesativacao,
      requests: {
        minuto: {
          usado: this.controle.requests.minuto.contador,
          limite: limites.RPM,
          limiteSeguro: Math.floor(limites.RPM * limites.marginSeguranca),
          resetTime: this.controle.requests.minuto.resetTime
        },
        dia: {
          usado: this.controle.requests.dia.contador,
          limite: limites.RPD,
          limiteSeguro: Math.floor(limites.RPD * limites.marginSeguranca),
          resetTime: this.controle.requests.dia.resetTime
        }
      },
      tokens: {
        minuto: {
          usado: this.controle.tokens.minuto.contador,
          limite: limites.TPM,
          limiteSeguro: Math.floor(limites.TPM * limites.marginSeguranca),
          resetTime: this.controle.tokens.minuto.resetTime
        },
        dia: {
          usado: this.controle.tokens.dia.contador,
          limite: limites.TPD,
          limiteSeguro: Math.floor(limites.TPD * limites.marginSeguranca),
          resetTime: this.controle.tokens.dia.resetTime
        }
      },
      whatsapp: {
        minuto: {
          usado: this.controle.whatsapp.minuto.contador,
          limite: limites.WPM,
          limiteSeguro: Math.floor(limites.WPM * limites.marginSeguranca),
          resetTime: this.controle.whatsapp.minuto.resetTime
        },
        dia: {
          usado: this.controle.whatsapp.dia.contador,
          limite: limites.WPD,
          limiteSeguro: Math.floor(limites.WPD * limites.marginSeguranca),
          resetTime: this.controle.whatsapp.dia.resetTime
        }
      },
      usuarios: {
        total: this.usuarios.size,
        bloqueados: this.usuariosBloqueados.size
      }
    };
  }

  // ===== PERSISTÊNCIA =====

  async carregarUsuariosBloqueados() {
    try {
      const arquivo = path.join(process.cwd(), this.config.bloqueioTransferencia.arquivoBloqueados);
      const dados = await fs.readFile(arquivo, 'utf8');
      const usuarios = JSON.parse(dados);
      
      // Filtrar apenas bloqueios ainda válidos
      const agora = Date.now();
      for (const [telefone, bloqueio] of Object.entries(usuarios)) {
        if (bloqueio.ate > agora) {
          this.usuariosBloqueados.set(telefone, bloqueio);
        }
      }
      
      console.log(`📂 [RATE_LIMIT] ${this.usuariosBloqueados.size} usuários bloqueados carregados`);
    } catch (error) {
      // Arquivo não existe ou erro - normal na primeira execução
      console.log('📂 [RATE_LIMIT] Nenhum usuário bloqueado encontrado');
    }
  }

  async salvarUsuariosBloqueados() {
    try {
      const arquivo = path.join(process.cwd(), this.config.bloqueioTransferencia.arquivoBloqueados);
      const dados = Object.fromEntries(this.usuariosBloqueados);
      await fs.writeFile(arquivo, JSON.stringify(dados, null, 2));
    } catch (error) {
      console.error('❌ [RATE_LIMIT] Erro ao salvar usuários bloqueados:', error);
    }
  }

  // ===== LOGGER =====

  get logger() {
    return {
      info: (mensagem, dados = {}) => {
        console.log(`📊 [RATE_LIMIT] ${mensagem}`, dados);
      },
      warn: (mensagem, dados = {}) => {
        console.warn(`⚠️ [RATE_LIMIT] ${mensagem}`, dados);
      },
      error: (mensagem, dados = {}) => {
        console.error(`❌ [RATE_LIMIT] ${mensagem}`, dados);
      }
    };
  }

  // ===== MÉTODOS PÚBLICOS =====

  getUsuariosBloqueados() {
    return Array.from(this.usuariosBloqueados.entries()).map(([telefone, bloqueio]) => ({
      telefone,
      ...bloqueio,
      ate: new Date(bloqueio.ate)
    }));
  }

  limparUsuariosBloqueados() {
    this.usuariosBloqueados.clear();
    this.salvarUsuariosBloqueados();
    console.log('🧹 [RATE_LIMIT] Usuários bloqueados limpos');
  }
}

// Singleton para garantir uma única instância
let rateLimitControllerInstance = null;

function getRateLimitController() {
  if (!rateLimitControllerInstance) {
    rateLimitControllerInstance = new RateLimitController();
  }
  return rateLimitControllerInstance;
}

module.exports = { RateLimitController, getRateLimitController }; 