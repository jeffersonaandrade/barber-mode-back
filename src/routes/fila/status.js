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
  // Instanciar serviço de fila
  const filaService = new FilaService(fastify.supabase);

  // Endpoint original: /api/fila/status/:token
  fastify.get('/fila/status/:token', {
    schema: {
      description: 'Verificar status do cliente na fila',
      tags: ['fila'],
      params: {
        type: 'object',
        required: ['token'],
        properties: { token: { type: 'string' } }
      },
      response: {
        200: {
          description: 'Status do cliente',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                cliente: { type: 'object' },
                barbearia: { type: 'object' },
                posicao_atual: { type: 'integer' },
                tempo_estimado: { type: 'integer' },
                fila_info: { type: 'object' }
              }
            }
          }
        }
      }
    }
    // SEM autenticação - endpoint público para clientes
  }, async (request, reply) => {
    try {
      const { token } = request.params;
      
      // Usar serviço para verificar status do cliente
      const resultado = await filaService.verificarStatusCliente(token);
      
      // Obter informações adicionais da fila
      const { data: filaInfo, error: filaError } = await fastify.supabase
        .from('clientes')
        .select('status')
        .eq('barbearia_id', resultado.barbearia.id)
        .in('status', ['aguardando', 'proximo', 'atendendo']);
        
      if (!filaError && filaInfo) {
        const totalNaFila = filaInfo.length;
        const aguardando = filaInfo.filter(c => c.status === 'aguardando').length;
        const proximo = filaInfo.filter(c => c.status === 'proximo').length;
        const atendendo = filaInfo.filter(c => c.status === 'atendendo').length;
        
        resultado.fila_info = {
          total_na_fila: totalNaFila,
          aguardando,
          proximo,
          atendendo,
          tempo_estimado_total: aguardando * 15 // 15 minutos por cliente
        };
      }
      
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



  // Novo endpoint compatível: /api/fila/:barbeariaId/status/:token
  fastify.get('/fila/:barbeariaId/status/:token', {
    schema: {
      description: 'Verificar status do cliente na fila (compatível com frontend)',
      tags: ['fila'],
      params: {
        type: 'object',
        required: ['barbeariaId', 'token'],
        properties: { 
          barbeariaId: { type: 'string' },
          token: { type: 'string' } 
        }
      },
      response: {
        200: {
          description: 'Status do cliente',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                cliente: { type: 'object' },
                barbearia: { type: 'object' },
                posicao_atual: { type: 'integer' },
                tempo_estimado: { type: 'integer' },
                fila_info: { type: 'object' }
              }
            }
          }
        }
      }
    }
    // SEM autenticação - endpoint público para clientes
  }, async (request, reply) => {
    try {
      const { token } = request.params;
      
      // Usar serviço para verificar status do cliente
      const resultado = await filaService.verificarStatusCliente(token);
      
      // Obter informações adicionais da fila
      const { data: filaInfo, error: filaError } = await fastify.supabase
        .from('clientes')
        .select('status')
        .eq('barbearia_id', resultado.barbearia.id)
        .in('status', ['aguardando', 'proximo', 'atendendo']);
        
      if (!filaError && filaInfo) {
        const totalNaFila = filaInfo.length;
        const aguardando = filaInfo.filter(c => c.status === 'aguardando').length;
        const proximo = filaInfo.filter(c => c.status === 'proximo').length;
        const atendendo = filaInfo.filter(c => c.status === 'atendendo').length;
        
        resultado.fila_info = {
          total_na_fila: totalNaFila,
          aguardando,
          proximo,
          atendendo,
          tempo_estimado_total: aguardando * 15 // 15 minutos por cliente
        };
      }
      
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