const FilaService = require('../../services/filaService');

/**
 * @swagger
 * /api/fila/status/{token}:
 *   get:
 *     tags: [fila]
 *     summary: Verificar status do cliente na fila
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status do cliente
 *       404:
 *         description: Cliente não encontrado
 */
async function verificarStatus(fastify, options) {
  // Endpoint original: /api/fila/status/:token
  fastify.get('/fila/status/:token', async (request, reply) => {
    try {
      const { token } = request.params;
      
      // Buscar cliente diretamente
      const { data: cliente, error: clienteError } = await fastify.supabase
        .from('clientes')
        .select(`
          id,
          nome,
          telefone,
          posicao,
          status,
          created_at,
          barbearia_id,
          barbearias(id, nome)
        `)
        .eq('token', token)
        .single();
        
      if (clienteError || !cliente) {
        throw new Error('Cliente não encontrado');
      }
      
      // Calcular posição atual na fila
      let posicaoAtual = null;
      let tempoEstimado = null;
      
      if (cliente.status === 'aguardando') {
        const { data: clientesAguardando } = await fastify.supabase
          .from('clientes')
          .select('posicao')
          .eq('barbearia_id', cliente.barbearia_id)
          .eq('status', 'aguardando')
          .lte('posicao', cliente.posicao)
          .order('posicao', { ascending: true });
          
        if (clientesAguardando) {
          posicaoAtual = clientesAguardando.length;
          tempoEstimado = posicaoAtual * 15;
        }
      }
      
      // Obter informações adicionais da fila
      const { data: filaInfo, error: filaError } = await fastify.supabase
        .from('clientes')
        .select('status')
        .eq('barbearia_id', cliente.barbearia_id)
        .in('status', ['aguardando', 'proximo', 'atendendo']);
        
      let filaInfoObj = {};
      if (!filaError && filaInfo) {
        const totalNaFila = filaInfo.length;
        const aguardando = filaInfo.filter(c => c.status === 'aguardando').length;
        const proximo = filaInfo.filter(c => c.status === 'proximo').length;
        const atendendo = filaInfo.filter(c => c.status === 'atendendo').length;
        
        filaInfoObj = {
          total_na_fila: totalNaFila,
          aguardando,
          proximo,
          atendendo,
          tempo_estimado_total: aguardando * 15
        };
      }
      
      // Teste: construir objeto de forma mais simples
      const clienteObj = {
        id: cliente.id,
        nome: cliente.nome,
        telefone: cliente.telefone,
        posicao: cliente.posicao,
        status: cliente.status,
        created_at: cliente.created_at
      };
      
      const barbeariaObj = cliente.barbearias ? {
        id: cliente.barbearias.id,
        nome: cliente.barbearias.nome
      } : null;
      
      const resultado = {
        cliente: clienteObj,
        barbearia: barbeariaObj,
        posicao_atual: posicaoAtual,
        tempo_estimado: tempoEstimado,
        fila_info: filaInfoObj
      };
      
      return reply.status(200).send({
        success: true,
        data: resultado
      });
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      
      if (error.message.includes('Cliente não encontrado')) {
        return reply.status(404).send({ 
          success: false, 
          error: error.message 
        });
      }
      
      return reply.status(500).send({ 
        success: false, 
        error: 'Erro interno do servidor' 
      });
    }
  });
}

module.exports = verificarStatus; 