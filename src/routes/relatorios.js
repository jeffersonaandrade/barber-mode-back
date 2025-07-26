const RelatorioService = require('../services/relatorioService');
const { checkAdminOrGerenteRole } = require('../middlewares/rolePermissions');

async function relatorioRoutes(fastify, options) {
  // Instanciar serviço de relatórios
  const relatorioService = new RelatorioService(fastify.supabase);

  // Dashboard de relatórios
  fastify.get('/relatorios/dashboard', {
    preValidation: [fastify.authenticate, checkAdminOrGerenteRole],
    schema: {
      description: 'Dashboard de relatórios completos (ADMIN/GERENTE)',
      tags: ['relatorios'],
      security: [{ Bearer: [] }],
      querystring: {
        type: 'object',
        properties: {
          barbearia_id: { type: 'integer' },
          data_inicio: { type: 'string', format: 'date' },
          data_fim: { type: 'string', format: 'date' },
          periodo: { type: 'string', enum: ['semana', 'mes', 'ano'], default: 'mes' }
        }
      },
      response: {
        200: {
          description: 'Relatório completo do dashboard',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                total_atendimentos: { type: 'integer' },
                tempo_medio_atendimento: { type: 'integer' },
                faturamento_total: { type: 'number' },
                satisfacao_geral: { type: 'number' },
                comparacao: {
                  type: 'object',
                  properties: {
                    atendimentos: { type: 'object' },
                    faturamento: { type: 'object' },
                    satisfacao: { type: 'object' },
                    tempo_medio: { type: 'object' }
                  }
                },
                performance_barbeiros: { type: 'array' },
                atendimentos_por_barbearia: { type: 'array' },
                periodo: { type: 'object' },
                filtros_aplicados: { type: 'object' }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { barbearia_id, data_inicio, data_fim, periodo } = request.query;
      const userRole = request.user.role;
      const userId = request.user.id;

      // Definir datas padrão se não fornecidas
      const hoje = new Date();
      const dataInicio = data_inicio || new Date(hoje.getFullYear(), hoje.getMonth(), 1).toISOString().split('T')[0];
      const dataFim = data_fim || hoje.toISOString().split('T')[0];

      const filtros = {
        barbearia_id,
        data_inicio: dataInicio,
        data_fim: dataFim,
        periodo: periodo || 'mes',
        userRole,
        userId
      };

      const resultado = await relatorioService.gerarRelatorioDashboard(filtros);

      return reply.send(resultado);

    } catch (error) {
      console.error('Erro ao gerar relatório dashboard:', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro ao gerar relatório: ' + error.message
      });
    }
  });

  // Download de relatórios
  fastify.get('/relatorios/download', {
    preValidation: [fastify.authenticate, checkAdminOrGerenteRole],
    schema: {
      description: 'Download de relatórios em Excel/PDF (ADMIN/GERENTE)',
      tags: ['relatorios'],
      security: [{ Bearer: [] }],
      querystring: {
        type: 'object',
        properties: {
          tipo: { type: 'string', enum: ['excel', 'pdf'], default: 'excel' },
          barbearia_id: { type: 'integer' },
          data_inicio: { type: 'string', format: 'date' },
          data_fim: { type: 'string', format: 'date' },
          periodo: { type: 'string', enum: ['semana', 'mes', 'ano'], default: 'mes' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { tipo, barbearia_id, data_inicio, data_fim, periodo } = request.query;
      const userRole = request.user.role;
      const userId = request.user.id;

      // Definir datas padrão se não fornecidas
      const hoje = new Date();
      const dataInicio = data_inicio || new Date(hoje.getFullYear(), hoje.getMonth(), 1).toISOString().split('T')[0];
      const dataFim = data_fim || hoje.toISOString().split('T')[0];

      const filtros = {
        barbearia_id,
        data_inicio: dataInicio,
        data_fim: dataFim,
        periodo: periodo || 'mes',
        userRole,
        userId
      };

      const resultado = await relatorioService.gerarRelatorioDownload(filtros, tipo);

      // Configurar headers para download
      reply.header('Content-Type', resultado.contentType);
      reply.header('Content-Disposition', `attachment; filename="${resultado.filename}"`);
      reply.header('Content-Length', resultado.buffer.length);

      return reply.send(resultado.buffer);

    } catch (error) {
      console.error('Erro ao gerar relatório para download:', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro ao gerar relatório: ' + error.message
      });
    }
  });

  // Relatório específico para barbeiros (seu próprio desempenho)
  fastify.get('/relatorios/barbeiro', {
    preValidation: [fastify.authenticate],
    schema: {
      description: 'Relatório de desempenho do barbeiro logado',
      tags: ['relatorios'],
      security: [{ Bearer: [] }],
      querystring: {
        type: 'object',
        properties: {
          barbearia_id: { type: 'integer' },
          data_inicio: { type: 'string', format: 'date' },
          data_fim: { type: 'string', format: 'date' },
          periodo: { type: 'string', enum: ['semana', 'mes', 'ano'], default: 'mes' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const userRole = request.user.role;
      
      // Verificar se é barbeiro
      if (userRole !== 'barbeiro') {
        return reply.status(403).send({
          success: false,
          error: 'Apenas barbeiros podem acessar este relatório'
        });
      }

      const { barbearia_id, data_inicio, data_fim, periodo } = request.query;
      const userId = request.user.id;

      // Definir datas padrão se não fornecidas
      const hoje = new Date();
      const dataInicio = data_inicio || new Date(hoje.getFullYear(), hoje.getMonth(), 1).toISOString().split('T')[0];
      const dataFim = data_fim || hoje.toISOString().split('T')[0];

      const filtros = {
        barbearia_id,
        data_inicio: dataInicio,
        data_fim: dataFim,
        periodo: periodo || 'mes',
        userRole,
        userId
      };

      const resultado = await relatorioService.gerarRelatorioDashboard(filtros);

      return reply.send(resultado);

    } catch (error) {
      console.error('Erro ao gerar relatório do barbeiro:', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro ao gerar relatório: ' + error.message
      });
    }
  });
}

module.exports = relatorioRoutes; 