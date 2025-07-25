const jwt = require('jsonwebtoken');
const { supabase } = require('../../config/database');

/**
 * Middleware de autenticação JWT
 * Verifica se o token é válido e adiciona o usuário ao request
 * 
 * @param {Object} request - Request do Fastify
 * @param {Object} reply - Reply do Fastify
 */
async function authenticate(request, reply) {
  try {
    const authHeader = request.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.status(401).send({
        success: false,
        error: 'Token de autenticação não fornecido'
      });
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer '
    
    // Verificar token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar usuário no banco para garantir que ainda existe e está ativo
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, nome, role, ativo')
      .eq('id', decoded.userId)
      .eq('ativo', true)
      .single();
      
    if (userError || !user) {
      return reply.status(401).send({
        success: false,
        error: 'Usuário não encontrado ou inativo'
      });
    }
    
    // Adicionar usuário ao request para uso posterior
    request.user = {
      id: user.id,
      email: user.email,
      nome: user.nome,
      role: user.role
    };
    
  } catch (error) {
    console.error('Erro na autenticação:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return reply.status(401).send({
        success: false,
        error: 'Token inválido'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return reply.status(401).send({
        success: false,
        error: 'Token expirado'
      });
    }
    
    return reply.status(500).send({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
}

module.exports = authenticate; 