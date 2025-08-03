const AuthService = require('../services/authService');

class AuthController {
  constructor(fastify) {
    this.fastify = fastify;
    this.authService = new AuthService(fastify);
  }

  /**
   * Login de usuário (funcionário)
   */
  async login(request, reply) {
    try {
      const { email, password } = request.body;
      
      if (!email || !password) {
        return reply.status(400).send({
          success: false,
          error: 'Email e senha são obrigatórios'
        });
      }

      console.log('Tentando fazer login para:', email);
      const result = await this.authService.login(email, password);
      console.log('Login bem-sucedido, resultado:', result);

      // Configurar cookies de autenticação usando decorator centralizado
      if (this.fastify.setAuthCookie) {
        // console.log('Configurando cookies...');
        this.fastify.setAuthCookie(reply, result.token, result.user);
      } else {
                  // console.log('Decorator setAuthCookie não encontrado');
      }

      return reply.send({
        success: true,
        message: 'Login realizado com sucesso',
        data: {
          user: result.user,
          token: result.token,
          expiresIn: result.expiresIn
        }
      });
    } catch (error) {
      console.error('Erro no login:', error);
      return reply.status(401).send({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Registro de usuário (apenas admin)
   */
  async register(request, reply) {
    try {
      const userData = request.body;
      const newUser = await this.authService.register(userData);

      return reply.status(201).send({
        success: true,
        message: 'Usuário criado com sucesso',
        data: newUser
      });
    } catch (error) {
      return reply.status(400).send({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Dados do usuário autenticado
   */
  async getMe(request, reply) {
    try {
      const user = await this.authService.getMe(request.user.id);

      return reply.send({
        success: true,
        data: user
      });
    } catch (error) {
      return reply.status(400).send({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Logout (limpa cookies)
   */
  async logout(request, reply) {
    try {
      // Limpar cookies de autenticação usando decorator centralizado
      this.fastify.clearAuthCookies(reply);
      
      return reply.send({
        success: true,
        message: 'Logout realizado com sucesso'
      });
    } catch (error) {
      return reply.status(400).send({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Verificar status de autenticação
   */
  async checkAuth(request, reply) {
    try {
      // Verificar se há cookies de autenticação usando decorator centralizado
      const userInfo = this.fastify.getUserFromCookie(request);
      
      if (!userInfo) {
        return reply.status(401).send({
          success: false,
          authenticated: false,
          error: 'Usuário não autenticado'
        });
      }

      return reply.send({
        success: true,
        authenticated: true,
        data: userInfo
      });
    } catch (error) {
      return reply.status(401).send({
        success: false,
        authenticated: false,
        error: 'Erro na verificação de autenticação'
      });
    }
  }

  /**
   * Debug do token (apenas para desenvolvimento)
   */
  async debugToken(request, reply) {
    try {
      const token = this.fastify.getAuthToken(request);
      
      if (!token) {
        return reply.send({
          success: false,
          error: 'Nenhum token encontrado'
        });
      }

      // Análise do token
      const tokenParts = token.split('.');
      const tokenAnalysis = {
        totalParts: tokenParts.length,
        expectedParts: 3,
        isValidFormat: tokenParts.length === 3,
        header: tokenParts[0] ? 'Presente' : 'Ausente',
        payload: tokenParts[1] ? 'Presente' : 'Ausente',
        signature: tokenParts[2] ? 'Presente' : 'Ausente',
        hasUrlEncoding: token.includes('%'),
        tokenLength: token.length,
        tokenPreview: token.substring(0, 50) + '...'
      };

      // Tentar decodificar o payload
      let decodedPayload = null;
      try {
        if (tokenParts[1]) {
          decodedPayload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
        }
      } catch (e) {
        decodedPayload = { error: 'Não foi possível decodificar o payload' };
      }

      return reply.send({
        success: true,
        tokenAnalysis,
        decodedPayload,
        fullToken: token
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Erro ao analisar token: ' + error.message
      });
    }
  }
}

module.exports = AuthController; 