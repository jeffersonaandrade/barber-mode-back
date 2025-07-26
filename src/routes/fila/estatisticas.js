const { checkBarbeiroBarbeariaAccess } = require('../../middlewares/barbeariaAccess');
const { checkBarbeiroRole, checkAdminRole } = require('../../middlewares/rolePermissions');
const FilaService = require('../../services/filaService');

/**
 * @swagger
 * /api/fila/{barbearia_id}/estatisticas:
 *   get:
 *     tags: [fila]
 *     summary: Obter estatísticas detalhadas da fila
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: barbearia_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Estatísticas da fila
 *       403:
 *         description: Acesso negado
 */
async function estatisticasFila(fastify, options) {
  // Instanciar serviço de fila
  const filaService = new FilaService(fastify.supabase);

  // Obter estatísticas detalhadas da fila (PÚBLICO)
  fastify.get('/fila/:barbearia_id/estatisticas', {
    schema: {
      description: 'Obter estatísticas detalhadas da fila (PÚBLICO)',
      tags: ['fila'],
      params: {
        type: 'object',
        required: ['barbearia_id'],
        properties: { barbearia_id: { type: 'integer' } }
      },
      response: {
        200: {
          description: 'Estatísticas da fila',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                barbeariaId: { type: 'integer' },
                timestamp: { type: 'string' },
                fila: {
                  type: 'object',
                  properties: {
                    total: { type: 'integer' },
                    aguardando: { type: 'integer' },
                    proximo: { type: 'integer' },
                    atendendo: { type: 'integer' },
                    finalizado: { type: 'integer' },
                    removido: { type: 'integer' }
                  }
                },
                barbeiros: {
                  type: 'object',
                  properties: {
                    total: { type: 'integer' },
                    atendendo: { type: 'integer' },
                    disponiveis: { type: 'integer' },
                    ocupados: { type: 'integer' }
                  }
                },
                tempos: {
                  type: 'object',
                  properties: {
                    medioEspera: { type: 'integer' },
                    medioAtendimento: { type: 'integer' },
                    estimadoProximo: { type: 'integer' }
                  }
                },
                ultimas24h: {
                  type: 'object',
                  properties: {
                    totalAtendidos: { type: 'integer' },
                    tempoMedioEspera: { type: 'integer' },
                    tempoMedioAtendimento: { type: 'integer' },
                    clientesPorHora: { type: 'number' },
                    barbeirosAtivos: { type: 'integer' }
                  }
                }
              }
            }
          }
        }
      }
    }
    // SEM autenticação - endpoint público
  }, async (request, reply) => {
    try {
      const { barbearia_id } = request.params;
      
      // Verificar se a barbearia existe
      const { data: barbearia, error: barbeariaError } = await fastify.supabase
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

      // Obter estatísticas usando o serviço
      const estatisticas = await filaService.obterEstatisticasDetalhadas(barbearia_id);
      
      return reply.status(200).send({
        success: true,
        data: {
          barbeariaId: parseInt(barbearia_id),
          timestamp: new Date().toISOString(),
          fila: estatisticas.fila,
          barbeiros: estatisticas.barbeiros,
          tempos: estatisticas.tempos,
          ultimas24h: estatisticas.ultimas24h
        }
      });
    } catch (error) {
      console.error('Erro ao obter estatísticas da fila:', error);
      return reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
    }
  });
}

module.exports = estatisticasFila; 