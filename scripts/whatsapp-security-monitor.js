#!/usr/bin/env node

/**
 * Script de Monitoramento de Segurança - WhatsApp
 * Monitora vulnerabilidades específicas do WhatsApp Web.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Carregar variáveis de ambiente
require('dotenv').config();

class WhatsAppSecurityMonitor {
  constructor() {
    this.logFile = path.join(__dirname, '../logs/security-whatsapp.log');
    this.alertFile = path.join(__dirname, '../logs/security-alerts.json');
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${message}\n`;
    
    console.log(logEntry.trim());
    fs.appendFileSync(this.logFile, logEntry);
  }

  async checkVulnerabilities() {
    try {
      this.log('🔍 Iniciando verificação de vulnerabilidades do WhatsApp...');
      
      // Verificar vulnerabilidades específicas
      const auditResult = execSync('npm audit --json', { encoding: 'utf8' });
      const auditData = JSON.parse(auditResult);
      
      const whatsappVulnerabilities = this.filterWhatsAppVulnerabilities(auditData);
      
      if (whatsappVulnerabilities.length > 0) {
        this.log(`⚠️ Encontradas ${whatsappVulnerabilities.length} vulnerabilidades relacionadas ao WhatsApp`, 'WARN');
        this.saveAlert('vulnerabilities_found', {
          count: whatsappVulnerabilities.length,
          vulnerabilities: whatsappVulnerabilities
        });
        
        whatsappVulnerabilities.forEach(vuln => {
          this.log(`  - ${vuln.module_name}@${vuln.version}: ${vuln.title}`, 'WARN');
        });
      } else {
        this.log('✅ Nenhuma vulnerabilidade crítica encontrada');
      }
      
      return whatsappVulnerabilities;
    } catch (error) {
      this.log(`❌ Erro ao verificar vulnerabilidades: ${error.message}`, 'ERROR');
      return [];
    }
  }

  filterWhatsAppVulnerabilities(auditData) {
    const whatsappRelated = [];
    const relevantPackages = ['whatsapp-web.js', 'puppeteer', 'puppeteer-core', 'tar-fs', 'ws'];
    
    if (auditData.vulnerabilities) {
      Object.values(auditData.vulnerabilities).forEach(vuln => {
        if (relevantPackages.some(pkg => vuln.module_name.includes(pkg))) {
          whatsappRelated.push({
            module_name: vuln.module_name,
            version: vuln.version,
            title: vuln.title,
            severity: vuln.severity,
            cwe: vuln.cwe,
            recommendation: vuln.recommendation
          });
        }
      });
    }
    
    return whatsappRelated;
  }

  async checkSystemResources() {
    try {
      this.log('💻 Verificando recursos do sistema...');
      
      const os = require('os');
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const usedMem = totalMem - freeMem;
      const memoryUsage = (usedMem / totalMem) * 100;
      
      this.log(`  - Memória total: ${(totalMem / 1024 / 1024 / 1024).toFixed(2)} GB`);
      this.log(`  - Memória usada: ${(usedMem / 1024 / 1024 / 1024).toFixed(2)} GB (${memoryUsage.toFixed(1)}%)`);
      
      if (memoryUsage > 80) {
        this.log('⚠️ Uso de memória alto detectado', 'WARN');
        this.saveAlert('high_memory_usage', { usage: memoryUsage });
      }
      
      const cpuLoad = os.loadavg();
      this.log(`  - Load CPU: ${cpuLoad.map(load => load.toFixed(2)).join(', ')}`);
      
      if (cpuLoad[0] > 2.0) {
        this.log('⚠️ Carga de CPU alta detectada', 'WARN');
        this.saveAlert('high_cpu_load', { load: cpuLoad[0] });
      }
      
    } catch (error) {
      this.log(`❌ Erro ao verificar recursos: ${error.message}`, 'ERROR');
    }
  }

  async checkWhatsAppService() {
    try {
      this.log('📱 Verificando status do serviço WhatsApp...');
      
      // Verificar se o processo está rodando
      const { getWhatsAppService } = require('../src/services/whatsappService');
      const whatsappService = getWhatsAppService();
      
      if (whatsappService) {
        const status = await whatsappService.getStatus();
        this.log(`  - Status: ${status.connected ? 'Conectado' : 'Desconectado'}`);
        this.log(`  - Pronto: ${status.ready ? 'Sim' : 'Não'}`);
        
        if (!status.connected) {
          this.log('⚠️ Serviço WhatsApp desconectado', 'WARN');
          this.saveAlert('whatsapp_disconnected', status);
        }
      } else {
        this.log('❌ Serviço WhatsApp não encontrado', 'ERROR');
        this.saveAlert('whatsapp_service_not_found');
      }
      
    } catch (error) {
      this.log(`❌ Erro ao verificar serviço WhatsApp: ${error.message}`, 'ERROR');
    }
  }

  async checkRateLimits() {
    try {
      this.log('🚦 Verificando rate limits...');
      
      const { getRateLimitController } = require('../src/controllers/RateLimitController');
      const rateLimitController = getRateLimitController();
      
      if (rateLimitController) {
        const stats = rateLimitController.getEstatisticas();
        
        this.log(`  - Sistema ativo: ${stats.sistemaAtivo ? 'Sim' : 'Não'}`);
        
        if (!stats.sistemaAtivo) {
          this.log(`⚠️ Sistema desativado: ${stats.motivoDesativacao}`, 'WARN');
          this.saveAlert('system_deactivated', { reason: stats.motivoDesativacao });
        }
        
        // Verificar uso de tokens
        const tokenUsage = stats.tokens?.minuto?.usado || 0;
        const tokenLimit = stats.tokens?.minuto?.limiteSeguro || 0;
        const tokenPercentage = (tokenUsage / tokenLimit) * 100;
        
        this.log(`  - Uso de tokens: ${tokenUsage}/${tokenLimit} (${tokenPercentage.toFixed(1)}%)`);
        
        if (tokenPercentage > 70) {
          this.log('⚠️ Uso de tokens próximo do limite', 'WARN');
          this.saveAlert('high_token_usage', { usage: tokenPercentage });
        }
        
      } else {
        this.log('❌ Rate limit controller não encontrado', 'ERROR');
      }
      
    } catch (error) {
      this.log(`❌ Erro ao verificar rate limits: ${error.message}`, 'ERROR');
    }
  }

  saveAlert(type, data = {}) {
    try {
      const alerts = this.loadAlerts();
      alerts.push({
        type,
        timestamp: new Date().toISOString(),
        data
      });
      
      // Manter apenas os últimos 100 alertas
      if (alerts.length > 100) {
        alerts.splice(0, alerts.length - 100);
      }
      
      fs.writeFileSync(this.alertFile, JSON.stringify(alerts, null, 2));
    } catch (error) {
      this.log(`❌ Erro ao salvar alerta: ${error.message}`, 'ERROR');
    }
  }

  loadAlerts() {
    try {
      if (fs.existsSync(this.alertFile)) {
        return JSON.parse(fs.readFileSync(this.alertFile, 'utf8'));
      }
    } catch (error) {
      this.log(`❌ Erro ao carregar alertas: ${error.message}`, 'ERROR');
    }
    return [];
  }

  async generateReport() {
    try {
      this.log('📊 Gerando relatório de segurança...');
      
      const report = {
        timestamp: new Date().toISOString(),
        vulnerabilities: await this.checkVulnerabilities(),
        systemResources: await this.checkSystemResources(),
        whatsappService: await this.checkWhatsAppService(),
        rateLimits: await this.checkRateLimits(),
        alerts: this.loadAlerts()
      };
      
      const reportFile = path.join(__dirname, '../logs/security-report.json');
      fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
      
      this.log(`📄 Relatório salvo em: ${reportFile}`);
      
      return report;
    } catch (error) {
      this.log(`❌ Erro ao gerar relatório: ${error.message}`, 'ERROR');
      return null;
    }
  }

  async run() {
    this.log('🛡️ Iniciando monitoramento de segurança do WhatsApp...');
    
    try {
      await this.generateReport();
      this.log('✅ Monitoramento concluído com sucesso');
    } catch (error) {
      this.log(`❌ Erro durante monitoramento: ${error.message}`, 'ERROR');
      process.exit(1);
    }
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  const monitor = new WhatsAppSecurityMonitor();
  monitor.run();
}

module.exports = WhatsAppSecurityMonitor; 