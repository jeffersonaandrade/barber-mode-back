// @ts-nocheck
const { checkBarbeiroBarbeariaAccess } = require('../../middlewares/barbeariaAccess');
const { checkGerenteRole, checkGerenteBarbeariaAccess } = require('../../middlewares/rolePermissions');
const FilaService = require('../../services/filaService');

/**
 * @swagger
 * /api/fila/{barbearia_id}:
 *   get:
 *     tags: [fila]
 *     summary: Obter fila da barbearia (PRIVADO - para funcionários)
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
 *         description: Fila da barbearia
 *       403:
 *         description: Acesso negado
 */
async function visualizarFila(fastify, options) {
  // Instanciar serviço de fila
  const filaService = new FilaService(fastify.supabase);

  // Obter fila da barbearia (PRIVADO - para funcionários)
  fastify.get('/fila/:barbearia_id', {
    schema: {
      description: 'Obter fila da barbearia (PRIVADO - para funcionários)',
      tags: ['fila'],
      params: {
        type: 'object',
        required: ['barbearia_id'],
        properties: { barbearia_id: { type: 'integer' } }
      },
      response: {
        200: {
          description: 'Fila da barbearia',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                clientes: { type: 'array' },
                estatisticas: { type: 'object' }
              }
            }
          }
        }
      }
    },
    preHandler: [fastify.authenticate, checkBarbeiroBarbeariaAccess]
  }, async (request, reply) => {
    try {
      const { barbearia_id } = request.params;
      
      // Usar serviço para obter fila completa
      const resultado = await filaService.obterFilaCompleta(barbearia_id);
      
      return reply.status(200).send({
        success: true,
        data: resultado
      });
    } catch (error) {
      console.error('Erro ao obter fila completa:', error);
      
      if (error.message.includes('Barbearia não encontrada')) {
        return reply.status(404).send({ 
          success: false, 
          error: error.message 
        });
      }
      
      return reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
    }
  });

  // Obter fila da barbearia (GERENTE - dados completos)
  fastify.get('/fila-gerente/:barbearia_id', {
    schema: {
      description: 'Obter fila da barbearia (GERENTE - dados completos)',
      tags: ['fila'],
      params: {
        type: 'object',
        required: ['barbearia_id'],
        properties: { barbearia_id: { type: 'integer' } }
      },
      response: {
        200: {
          description: 'Fila da barbearia (dados completos)',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                estatisticas: { type: 'object' }
              }
            }
          }
        }
      }
    },
    preHandler: [fastify.authenticate, checkGerenteRole, checkGerenteBarbeariaAccess]
  }, async (request, reply) => {
    try {
      const { barbearia_id } = request.params;
      
      // Usar serviço para obter estatísticas (sem verificar se está ativa)
      const resultado = await filaService.obterEstatisticasFila(barbearia_id, false);
      
      return reply.status(200).send({
        success: true,
        data: resultado
      });
    } catch (error) {
      console.error('Erro ao obter estatísticas gerente:', error);
      
      if (error.message.includes('Barbearia não encontrada')) {
        return reply.status(404).send({ 
          success: false, 
          error: error.message 
        });
      }
      
      return reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
    }
  });

  // Obter fila da barbearia (PÚBLICO - para clientes)
  fastify.get('/fila-publica/:barbearia_id', {
    schema: {
      description: 'Obter fila da barbearia (PÚBLICO - para clientes)',
      tags: ['fila'],
      params: {
        type: 'object',
        required: ['barbearia_id'],
        properties: { barbearia_id: { type: 'integer' } }
      },
      response: {
        200: {
          description: 'Fila da barbearia (dados limitados)',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                barbearia: { type: 'object' },
                estatisticas: { type: 'object' }
              }
            }
          }
        }
      }
    }
    // SEM autenticação - endpoint público para clientes
  }, async (request, reply) => {
    try {
      const { barbearia_id } = request.params;
      
      // Usar serviço para obter estatísticas (verificando se está ativa)
      const resultado = await filaService.obterEstatisticasFila(barbearia_id, true);
      
      return reply.status(200).send({
        success: true,
        data: resultado
      });
    } catch (error) {
      console.error('Erro ao obter estatísticas públicas:', error);
      
      if (error.message.includes('Barbearia não encontrada')) {
        return reply.status(404).send({ 
          success: false, 
          error: error.message 
        });
      }
      
      return reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
    }
  });
}

module.exports = visualizarFila; 