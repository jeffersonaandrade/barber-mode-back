/**
 * Gerenciador de Cookies para o Sistema de Barbearia
 * 
 * Este módulo gerencia os cookies de autenticação e clientes,
 * incluindo correção automática de tokens malformados.
 */

class CookieManager {
  /**
   * Corrigir token JWT malformado
   * @param {string} token - Token original
   * @returns {string} - Token corrigido
   */
  static fixToken(token) {
    if (!token) return null;
    
    // Decodificar URL encoding se presente
    let decodedToken = token;
    if (token.includes('%')) {
      try {
        decodedToken = decodeURIComponent(token);
        console.log('🔧 [COOKIE] Token URL-decoded:', decodedToken.substring(0, 50) + '...');
      } catch (e) {
        console.error('❌ [COOKIE] Erro ao decodificar URL:', e);
      }
    }
    
    // Verificar se tem 4 partes em vez de 3
    const parts = decodedToken.split('.');
    if (parts.length === 4) {
      console.log('⚠️ [COOKIE] Token com 4 partes detectado, extraindo as 3 primeiras...');
      const correctedToken = parts.slice(0, 3).join('.');
      console.log('✅ [COOKIE] Token corrigido:', correctedToken.substring(0, 50) + '...');
      return correctedToken;
    }
    
    // Verificar se tem formato correto (3 partes)
    if (parts.length === 3) {
      console.log('✅ [COOKIE] Token com formato correto (3 partes)');
      return decodedToken;
    }
    
    console.error('❌ [COOKIE] Token com formato inválido:', parts.length, 'partes');
    return null;
  }

  /**
   * Obter token de autenticação de funcionário
   * @returns {string|null} - Token corrigido ou null
   */
  static getAdminToken() {
    try {
      const token = this.getCookie('auth_token');
      if (!token) {
        console.log('🔍 [COOKIE] Nenhum token de admin encontrado');
        return null;
      }
      
      const fixedToken = this.fixToken(token);
      if (fixedToken) {
        console.log('✅ [COOKIE] Token de admin obtido e corrigido');
        return fixedToken;
      }
      
      return null;
    } catch (error) {
      console.error('❌ [COOKIE] Erro ao obter token de admin:', error);
      return null;
    }
  }

  /**
   * Definir token de autenticação de funcionário
   * @param {string} token - Token JWT
   */
  static setAdminToken(token) {
    try {
      const fixedToken = this.fixToken(token);
      if (fixedToken) {
        this.setCookie('auth_token', fixedToken, 12 * 60 * 60 * 1000); // 12 horas
        console.log('✅ [COOKIE] Token de admin salvo');
      }
    } catch (error) {
      console.error('❌ [COOKIE] Erro ao salvar token de admin:', error);
    }
  }

  /**
   * Obter dados do usuário do cookie
   * @returns {Object|null} - Dados do usuário
   */
  static getAdminUserInfo() {
    try {
      const userInfo = this.getCookie('user_info');
      if (!userInfo) {
        console.log('🔍 [COOKIE] Nenhuma informação de usuário encontrada');
        return null;
      }
      
      const parsed = JSON.parse(userInfo);
      console.log('✅ [COOKIE] Informações do usuário obtidas:', parsed.nome);
      return parsed;
    } catch (error) {
      console.error('❌ [COOKIE] Erro ao obter informações do usuário:', error);
      return null;
    }
  }

  /**
   * Verificar se o admin está autenticado
   * @returns {boolean} - True se autenticado
   */
  static isAdminAuthenticated() {
    const token = this.getAdminToken();
    const userInfo = this.getAdminUserInfo();
    
    const isAuth = !!(token && userInfo);
    console.log('🔍 [COOKIE] Verificação de autenticação admin:', isAuth ? '✅ Autenticado' : '❌ Não autenticado');
    
    return isAuth;
  }

  /**
   * Obter token de cliente
   * @returns {string|null} - Token corrigido ou null
   */
  static getClienteToken() {
    try {
      const token = this.getCookie('cliente_token');
      if (!token) {
        console.log('🔍 [COOKIE] Nenhum token de cliente encontrado');
        return null;
      }
      
      const fixedToken = this.fixToken(token);
      if (fixedToken) {
        console.log('✅ [COOKIE] Token de cliente obtido e corrigido');
        return fixedToken;
      }
      
      return null;
    } catch (error) {
      console.error('❌ [COOKIE] Erro ao obter token de cliente:', error);
      return null;
    }
  }

  /**
   * Obter dados do cliente
   * @returns {Object|null} - Dados do cliente
   */
  static getClienteInfo() {
    try {
      const clienteInfo = this.getCookie('cliente_info');
      if (!clienteInfo) {
        console.log('🔍 [COOKIE] Nenhuma informação de cliente encontrada');
        return null;
      }
      
      const parsed = JSON.parse(clienteInfo);
      console.log('✅ [COOKIE] Informações do cliente obtidas:', parsed.nome);
      return parsed;
    } catch (error) {
      console.error('❌ [COOKIE] Erro ao obter informações do cliente:', error);
      return null;
    }
  }

  /**
   * Verificar se o cliente está autenticado
   * @returns {boolean} - True se autenticado
   */
  static isClienteAuthenticated() {
    const token = this.getClienteToken();
    const clienteInfo = this.getClienteInfo();
    
    const isAuth = !!(token && clienteInfo);
    console.log('🔍 [COOKIE] Verificação de autenticação cliente:', isAuth ? '✅ Autenticado' : '❌ Não autenticado');
    
    return isAuth;
  }

  /**
   * Limpar todos os cookies de autenticação
   */
  static clearAllAuth() {
    try {
      this.deleteCookie('auth_token');
      this.deleteCookie('user_info');
      this.deleteCookie('cliente_token');
      this.deleteCookie('cliente_info');
      this.deleteCookie('cliente_qr');
      console.log('✅ [COOKIE] Todos os cookies de autenticação limpos');
    } catch (error) {
      console.error('❌ [COOKIE] Erro ao limpar cookies:', error);
    }
  }

  /**
   * Obter valor de um cookie
   * @param {string} name - Nome do cookie
   * @returns {string|null} - Valor do cookie
   */
  static getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(';').shift();
    }
    return null;
  }

  /**
   * Definir um cookie
   * @param {string} name - Nome do cookie
   * @param {string} value - Valor do cookie
   * @param {number} maxAge - Idade máxima em milissegundos
   */
  static setCookie(name, value, maxAge) {
    const expires = new Date(Date.now() + maxAge).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Strict`;
  }

  /**
   * Deletar um cookie
   * @param {string} name - Nome do cookie
   */
  static deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  /**
   * Analisar token JWT (para debug)
   * @param {string} token - Token JWT
   * @returns {Object} - Análise do token
   */
  static analyzeToken(token) {
    if (!token) {
      return { error: 'Token não fornecido' };
    }

    const parts = token.split('.');
    const analysis = {
      totalParts: parts.length,
      expectedParts: 3,
      isValidFormat: parts.length === 3,
      hasUrlEncoding: token.includes('%'),
      tokenLength: token.length,
      tokenPreview: token.substring(0, 50) + '...'
    };

    // Tentar decodificar o payload
    try {
      if (parts[1]) {
        const payload = JSON.parse(atob(parts[1]));
        analysis.payload = payload;
      }
    } catch (e) {
      analysis.payloadError = e.message;
    }

    return analysis;
  }
}

export default CookieManager; 