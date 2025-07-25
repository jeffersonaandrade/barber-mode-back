// @ts-nocheck
const AuthService = require('../services/authService');

class AuthController {
  constructor(fastify) {
    this.authService = new AuthService(fastify);
  }

  /**
   * Login de usuário
   */
  async login(email, password) {
    try {
      const result = await this.authService.login(email, password);

      return {
        success: true,
        message: 'Login realizado com sucesso',
        data: result
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Registro de usuário (apenas admin)
   */
  async register(userData) {
    try {
      const newUser = await this.authService.register(userData);

      return {
        success: true,
        message: 'Usuário criado com sucesso',
        data: newUser
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Dados do usuário autenticado
   */
  async getMe(userId) {
    try {
      const user = await this.authService.getMe(userId);

      return {
        success: true,
        data: user
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Logout (invalidação do token)
   */
  async logout() {
    try {
      // Em uma implementação mais robusta, você pode adicionar o token
      // a uma blacklist ou usar refresh tokens
      
      return {
        success: true,
        message: 'Logout realizado com sucesso'
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = AuthController; 