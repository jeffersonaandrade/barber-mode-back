// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
const AuthController = require('../controllers/authController');
async function authRoutes(fastify, options) {
  if (stryMutAct_9fa48("948")) {
    {}
  } else {
    stryCov_9fa48("948");
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
    fastify.post(stryMutAct_9fa48("949") ? "" : (stryCov_9fa48("949"), '/login'), authController.login);

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
    fastify.post(stryMutAct_9fa48("950") ? "" : (stryCov_9fa48("950"), '/register'), stryMutAct_9fa48("951") ? {} : (stryCov_9fa48("951"), {
      preValidation: stryMutAct_9fa48("952") ? [] : (stryCov_9fa48("952"), [fastify.authenticate, fastify.authorize(stryMutAct_9fa48("953") ? [] : (stryCov_9fa48("953"), [stryMutAct_9fa48("954") ? "" : (stryCov_9fa48("954"), 'admin')]))])
    }), authController.register);

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
    fastify.get(stryMutAct_9fa48("955") ? "" : (stryCov_9fa48("955"), '/me'), stryMutAct_9fa48("956") ? {} : (stryCov_9fa48("956"), {
      preValidation: stryMutAct_9fa48("957") ? [] : (stryCov_9fa48("957"), [fastify.authenticate])
    }), authController.me);

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
    fastify.post(stryMutAct_9fa48("958") ? "" : (stryCov_9fa48("958"), '/logout'), stryMutAct_9fa48("959") ? {} : (stryCov_9fa48("959"), {
      preValidation: stryMutAct_9fa48("960") ? [] : (stryCov_9fa48("960"), [fastify.authenticate])
    }), authController.logout);
  }
}
module.exports = authRoutes;