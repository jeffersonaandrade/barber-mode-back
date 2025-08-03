// @ts-nocheck
const { checkAdminOrGerenteRole } = require('../middlewares/rolePermissions');

// Versão sem fastify-plugin (funcionando)
async function historicoRoutes(fastify, options) {


  // Histórico de atendimentos
  fastify.get('/historico', {
    preValidation: [fastify.authenticate, checkAdminOrGerenteRole],
    schema: {
      description: 'Histórico de atendimentos',
      tags: ['historico'],
      security: [{ Bearer: [] }],
      querystring: {
        type: 'object',
        properties: {
          barbearia_id: { type: 'integer' },
          data_inicio: { type: 'string', format: 'date' },
          data_fim: { type: 'string', format: 'date' },
          barbeiro_id: { type: 'string' },
          limit: { type: 'integer', default: 50 },
          offset: { type: 'integer', default: 0 }
        }
      }
    }
  }, async (request, reply) => {
    try {

      const { barbearia_id, data_inicio, data_fim, barbeiro_id, limit = 50, offset = 0 } = request.query;
      
      // Query base
      let query = fastify.supabase
        .from('historico_atendimentos')
        .select('*')
        .order('data_inicio', { ascending: false })
        .range(offset, offset + limit - 1);

      // Aplicar filtros
      if (barbearia_id) {
        query = query.eq('barbearia_id', barbearia_id);
      }
      
      if (barbeiro_id) {
        query = query.eq('barbeiro_id', barbeiro_id);
      }
      
      if (data_inicio) {
        query = query.gte('data_inicio', data_inicio);
      }
      
      if (data_fim) {
        query = query.lte('data_inicio', data_fim);
      }

      const { data: historico, error } = await query;

      if (error) {
        console.error('Erro ao buscar histórico:', error);
        return reply.status(500).send({
          success: false,
          error: 'Erro ao buscar histórico: ' + error.message
        });
      }

      return reply.send({
        success: true,
        data: historico || [],
        pagination: {
          total: historico ? historico.length : 0,
          limit,
          offset,
          hasMore: historico ? historico.length === limit : false
        }
      });

    } catch (error) {
      console.error('Erro interno:', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor: ' + error.message
      });
    }
  });

  // Relatórios e estatísticas
  fastify.get('/historico/relatorios', {
    preValidation: [fastify.authenticate, checkAdminOrGerenteRole],
    schema: {
      description: 'Relatórios e estatísticas de atendimentos',
      tags: ['historico'],
      security: [{ Bearer: [] }]
    }
  }, async (request, reply) => {
    try {
      const { data: historico, error } = await fastify.supabase
        .from('historico_atendimentos')
        .select('*');

      if (error) {
        return reply.status(500).send({
          success: false,
          error: 'Erro ao buscar relatórios: ' + error.message
        });
      }

      return reply.send({
        success: true,
        data: {
          total_atendimentos: historico ? historico.length : 0,
          tempo_medio_atendimento: 0,
          faturamento_total: 0,
          atendimentos_por_dia: [],
          top_barbeiros: [],
          servicos_mais_populares: []
        }
      });

    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor: ' + error.message
      });
    }
  });
}

module.exports = historicoRoutes; 