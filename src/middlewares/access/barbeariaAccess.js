const { supabase } = require('../../config/database');

/**
 * Middleware para verificar se o usuário tem acesso à barbearia
 * @param {Object} request - Request do Fastify
 * @param {Object} reply - Reply do Fastify
 */
async function checkBarbeariaAccess(request, reply) {
  const { barbearia_id } = request.params;
  const userId = request.user?.id;
  const userRole = request.user?.role;

  try {
    // Admin pode acessar qualquer barbearia
    if (userRole === 'admin') {
      return;
    }

    // Verificar se a barbearia existe
    const { data: barbearia, error: barbeariaError } = await supabase
      .from('barbearias')
      .select('id, nome, ativo')
      .eq('id', barbearia_id)
      .single();

    if (barbeariaError || !barbearia) {
      return reply.status(404).send({
        success: false,
        error: 'Barbearia não encontrada'
      });
    }

    if (!barbearia.ativo) {
      return reply.status(404).send({
        success: false,
        error: 'Barbearia inativa'
      });
    }

    // Verificar se o usuário tem acesso à barbearia
    const { data: barbeiroBarbearia, error } = await supabase
      .from('barbeiros_barbearias')
      .select('*')
      .eq('user_id', userId)
      .eq('barbearia_id', barbearia_id)
      .eq('ativo', true)
      .single();

    if (error || !barbeiroBarbearia) {
      return reply.status(403).send({
        success: false,
        error: 'Acesso negado',
        message: 'Você não tem acesso a esta barbearia'
      });
    }

    // Adicionar informações do barbeiro ao request
    request.barbeiroInfo = barbeiroBarbearia;
  } catch (error) {
    return reply.status(500).send({
      success: false,
      error: 'Erro interno',
      message: 'Erro ao verificar acesso à barbearia'
    });
  }
}

/**
 * Middleware para verificar se o gerente é dono da barbearia
 * @param {Object} request - Request do Fastify
 * @param {Object} reply - Reply do Fastify
 */
async function checkBarbeariaOwnership(request, reply) {
  const { barbearia_id } = request.params;
  const userId = request.user?.id;
  const userRole = request.user?.role;

  try {
    // Admin pode acessar qualquer barbearia
    if (userRole === 'admin') {
      return;
    }

    // Gerente só pode acessar sua própria barbearia
    if (userRole === 'gerente') {
      const { data: barbearia, error } = await supabase
        .from('barbearias')
        .select('id, nome, gerente_id')
        .eq('id', barbearia_id)
        .single();

      if (error || !barbearia) {
        return reply.status(404).send({
          success: false,
          error: 'Barbearia não encontrada'
        });
      }

      if (barbearia.gerente_id !== userId) {
        return reply.status(403).send({
          success: false,
          error: 'Acesso negado',
          message: 'Você só pode gerenciar sua própria barbearia'
        });
      }
    }
  } catch (error) {
    return reply.status(500).send({
      success: false,
      error: 'Erro interno',
      message: 'Erro ao verificar propriedade da barbearia'
    });
  }
}

/**
 * Middleware para verificar se o barbeiro trabalha na barbearia
 * @param {Object} request - Request do Fastify
 * @param {Object} reply - Reply do Fastify
 */
async function checkBarbeiroBarbeariaAccess(request, reply) {
  const { barbearia_id } = request.params;
  const userId = request.user?.id;
  const userRole = request.user?.role;

  try {
    // Admin pode acessar qualquer barbearia
    if (userRole === 'admin') {
      return;
    }

    // Barbeiro só pode acessar barbearias onde trabalha
    if (userRole === 'barbeiro') {
      const { data: barbeiroBarbearia, error } = await supabase
        .from('barbeiros_barbearias')
        .select('ativo, disponivel')
        .eq('user_id', userId)
        .eq('barbearia_id', barbearia_id)
        .single();

      if (error || !barbeiroBarbearia) {
        return reply.status(403).send({
          success: false,
          error: 'Acesso negado',
          message: 'Você não trabalha nesta barbearia'
        });
      }

      if (!barbeiroBarbearia.ativo) {
        return reply.status(403).send({
          success: false,
          error: 'Barbeiro inativo',
          message: 'Você não está ativo nesta barbearia'
        });
      }

      // Adicionar informações do barbeiro ao request
      request.barbeiroInfo = barbeiroBarbearia;
    }
  } catch (error) {
    return reply.status(500).send({
      success: false,
      error: 'Erro interno',
      message: 'Erro ao verificar acesso do barbeiro'
    });
  }
}

module.exports = {
  checkBarbeariaAccess,
  checkBarbeariaOwnership,
  checkBarbeiroBarbeariaAccess
}; 