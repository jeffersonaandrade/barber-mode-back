#!/usr/bin/env node

/**
 * Script para testar se o QR Code aparece logo no início
 * Simula o comportamento do Render
 */

require('dotenv').config();

console.log('🧪 TESTE QR CODE - SIMULANDO RENDER');
console.log('=====================================');

// Inicializar WhatsApp primeiro
console.log('📱 [WHATSAPP] Inicializando WhatsApp...');
const { getWhatsAppService } = require('./src/services/whatsappService');

// Aguardar um pouco para ver os logs
setTimeout(() => {
  console.log('✅ Teste concluído!');
  console.log('📱 Verifique se o QR Code apareceu logo no início dos logs');
  process.exit(0);
}, 10000); // 10 segundos

// Capturar erros
process.on('unhandledRejection', (error) => {
  console.error('❌ Erro não tratado:', error);
  process.exit(1);
}); 