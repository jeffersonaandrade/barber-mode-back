// @ts-nocheck
const { supabase } = require('../config/database');

// Middleware para verificar se o usuário tem acesso à barbearia
async function checkBarbeariaAccess(request, reply) {
  const { barbeariaId } = request.params;
  const userId = request.user.id;
  const userRole = request.user.role;

  try {
    // Admin pode acessar qualquer barbearia
    if (userRole === 'admin') {
      return;
    }

    // Verificar se o usuário tem acesso à barbearia
    const { data: barbeiroBarbearia, error } = await supabase
      .from('barbeiros_barbearias')
      .select('*')
      .eq('user_id', userId)
      .eq('barbearia_id', barbeariaId)
      .eq('ativo', true)
      .single();

    if (error || !barbeiroBarbearia) {
      return reply.status(403).send({
        error: 'Acesso negado',
        message: 'Você não tem acesso a esta barbearia'
      });
    }
  } catch (error) {
    return reply.status(500).send({
      error: 'Erro interno',
      message: 'Erro ao verificar acesso à barbearia'
    });
  }
}

// Middleware para verificar se o barbeiro está ativo
async function checkBarbeiroAtivo(request, reply) {
  const { barbeariaId } = request.params;
  const userId = request.user.id;

  try {
    const { data: barbeiroBarbearia, error } = await supabase
      .from('barbeiros_barbearias')
      .select('disponivel, ativo')
      .eq('user_id', userId)
      .eq('barbearia_id', barbeariaId)
      .single();

    if (error || !barbeiroBarbearia) {
      return reply.status(404).send({
        error: 'Barbeiro não encontrado',
        message: 'Barbeiro não encontrado nesta barbearia'
      });
    }

    if (!barbeiroBarbearia.ativo) {
      return reply.status(403).send({
        error: 'Barbeiro inativo',
        message: 'Você não está ativo nesta barbearia'
      });
    }

    // Adicionar informações do barbeiro ao request
    request.barbeiroInfo = barbeiroBarbearia;
  } catch (error) {
    return reply.status(500).send({
      error: 'Erro interno',
      message: 'Erro ao verificar status do barbeiro'
    });
  }
}

module.exports = {
  checkBarbeariaAccess,
  checkBarbeiroAtivo
}; 