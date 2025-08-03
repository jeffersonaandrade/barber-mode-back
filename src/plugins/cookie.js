const fp = require('fastify-plugin');
const { 
  COOKIE_EXPIRATION, 
  FUNCIONARIO_COOKIE_OPTIONS, 
  CLIENTE_COOKIE_OPTIONS 
} = require('../config/cookies');

async function cookiePlugin(fastify, options) {
  await fastify.register(require('@fastify/cookie'), {
    secret: process.env.COOKIE_SECRET || 'default-cookie-secret-change-in-production',
    parseOptions: {
      // Configurações de segurança para cookies
      httpOnly: true, // Cookie não acessível via JavaScript
      secure: process.env.NODE_ENV === 'production', // HTTPS apenas em produção
      sameSite: 'strict', // Proteção contra CSRF
      path: '/', // Cookie válido em todo o site
      maxAge: COOKIE_EXPIRATION.FUNCIONARIO // 12 horas em milissegundos (padrão para funcionários)
    }
  });

  // Decorator para definir cookie de autenticação de funcionário (12 horas)
  fastify.decorate('setAuthCookie', function(reply, token, userData) {
    // Log para debug do token
    console.log('🔍 [COOKIE] Token antes de salvar:', token);
    console.log('🔍 [COOKIE] Token length:', token.length);
    console.log('🔍 [COOKIE] Token parts:', token.split('.').length);
    
    // Verificar se o token tem formato correto (3 partes)
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      console.error('❌ [COOKIE] Token com formato incorreto:', tokenParts.length, 'partes');
      // Tentar corrigir se tiver 4 partes
      if (tokenParts.length === 4) {
        console.log('⚠️ [COOKIE] Tentando corrigir token com 4 partes...');
        token = tokenParts.slice(0, 3).join('.');
        console.log('✅ [COOKIE] Token corrigido:', token);
      }
    }
    
    // Definir cookie de autenticação
    reply.setCookie('auth_token', token, FUNCIONARIO_COOKIE_OPTIONS);
    
    // Definir cookie com dados básicos do usuário (sem informações sensíveis)
    const userInfo = {
      id: userData.id,
      nome: userData.nome,
      role: userData.role
    };
    reply.setCookie('user_info', JSON.stringify(userInfo), FUNCIONARIO_COOKIE_OPTIONS);
  });

  // Decorator para limpar cookies de autenticação de funcionário
  fastify.decorate('clearAuthCookies', function(reply) {
    reply.clearCookie('auth_token', { path: '/' });
    reply.clearCookie('user_info', { path: '/' });
  });

  // Decorator para obter token do cookie de funcionário
  fastify.decorate('getAuthToken', function(request) {
    return request.cookies.auth_token;
  });

  // Decorator para obter dados do usuário do cookie
  fastify.decorate('getUserFromCookie', function(request) {
    try {
      const userInfo = request.cookies.user_info;
      return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
      return null;
    }
  });

  // Decorator para definir cookies de cliente na fila (4 horas)
  fastify.decorate('setClienteCookies', function(reply, cliente, qrCodeFila, qrCodeStatus) {
    // Cookie com token único do cliente
    reply.setCookie('cliente_token', cliente.token, CLIENTE_COOKIE_OPTIONS);
    
    // Cookie com dados básicos do cliente
    const clienteInfo = {
      id: cliente.id,
      nome: cliente.nome,
      posicao: cliente.posicao,
      status: cliente.status,
      barbearia_id: cliente.barbearia_id
    };
    reply.setCookie('cliente_info', JSON.stringify(clienteInfo), CLIENTE_COOKIE_OPTIONS);
    
    // Cookie com QR codes
    const qrCodes = {
      fila: qrCodeFila,
      status: qrCodeStatus
    };
    reply.setCookie('cliente_qr', JSON.stringify(qrCodes), CLIENTE_COOKIE_OPTIONS);
  });

  // Decorator para limpar cookies do cliente
  fastify.decorate('clearClienteCookies', function(reply) {
    reply.clearCookie('cliente_token', { path: '/' });
    reply.clearCookie('cliente_info', { path: '/' });
    reply.clearCookie('cliente_qr', { path: '/' });
  });

  // Decorator para obter token do cliente do cookie
  fastify.decorate('getClienteToken', function(request) {
    return request.cookies.cliente_token;
  });

  // Decorator para obter dados do cliente do cookie
  fastify.decorate('getClienteFromCookie', function(request) {
    try {
      const clienteInfo = request.cookies.cliente_info;
      return clienteInfo ? JSON.parse(clienteInfo) : null;
    } catch (error) {
      return null;
    }
  });
}

module.exports = fp(cookiePlugin); 