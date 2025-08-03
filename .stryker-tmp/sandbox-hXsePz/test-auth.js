// @ts-nocheck
require('dotenv').config();

async function testAuth() {
  try {
    console.log('🔍 Testando AuthService...\n');
    
    // Simular fastify
    const fastify = {
      jwt: {
        sign: (payload) => {
          console.log('✅ JWT sign chamado com payload:', payload);
          return 'test-token-123';
        }
      }
    };
    
    const AuthService = require('./src/services/authService');
    const authService = new AuthService(fastify);
    
    console.log('1️⃣ Testando login com dados mockados...');
    const result = await authService.login('admin@lucasbarbearia.com', 'admin123');
    
    console.log('✅ Login bem-sucedido:', {
      user: result.user,
      hasToken: !!result.token
    });
    
  } catch (error) {
    console.log('❌ Erro no teste:', error.message);
    console.log('Stack:', error.stack);
  }
}

testAuth(); 