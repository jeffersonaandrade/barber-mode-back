// @ts-nocheck
const AuthController = require('../controllers/authController');

async function authRoutes(fastify, options) {
  const authController = new AuthController(fastify);
  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     tags: [auth]
   *     summary: Login de usuário
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *                 minLength: 6
   *     responses:
   *       200:
   *         description: Login realizado com sucesso
   *       400:
   *         description: Dados inválidos
   */
  fastify.post('/login', authController.login);

  /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     tags: [auth]
   *     summary: Registro de usuário (apenas admin)
   *     security:
   *       - Bearer: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *               - nome
   *               - role
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *                 minLength: 6
   *               nome:
   *                 type: string
   *                 minLength: 2
   *               telefone:
   *                 type: string
   *               role:
   *                 type: string
   *                 enum: [admin, gerente, barbeiro]
   *     responses:
   *       201:
   *         description: Usuário criado com sucesso
   *       400:
   *         description: Dados inválidos
   *       403:
   *         description: Acesso negado
   */
  fastify.post('/register', {
    preValidation: [fastify.authenticate, fastify.authorize(['admin'])]
  }, authController.register);

  /**
   * @swagger
   * /api/auth/me:
   *   get:
   *     tags: [auth]
   *     summary: Dados do usuário autenticado
   *     security:
   *       - Bearer: []
   *     responses:
   *       200:
   *         description: Dados do usuário
   *       401:
   *         description: Não autorizado
   */
  fastify.get('/me', {
    preValidation: [fastify.authenticate]
  }, authController.me);

  /**
   * @swagger
   * /api/auth/logout:
   *   post:
   *     tags: [auth]
   *     summary: Logout de usuário
   *     security:
   *       - Bearer: []
   *     responses:
   *       200:
   *         description: Logout realizado com sucesso
   *       401:
   *         description: Não autorizado
   */
  fastify.post('/logout', {
    preValidation: [fastify.authenticate]
  }, authController.logout);
}

module.exports = authRoutes; 