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

  // Relatório financeiro
  fastify.get('/relatorios/financeiro', {
    preValidation: [fastify.authenticate, checkAdminOrGerenteRole],
    schema: {
      description: 'Relatório financeiro detalhado (ADMIN/GERENTE)',
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
      const { barbearia_id, data_inicio, data_fim, periodo } = request.query;

      // Definir datas padrão se não fornecidas
      const hoje = new Date();
      const dataInicio = data_inicio || new Date(hoje.getFullYear(), hoje.getMonth(), 1).toISOString().split('T')[0];
      const dataFim = data_fim || hoje.toISOString().split('T')[0];

      const filtros = {
        barbearia_id,
        data_inicio: dataInicio,
        data_fim: dataFim,
        periodo: periodo || 'mes'
      };

      const resultado = await relatorioService.gerarRelatorioFinanceiro(filtros);

      return reply.send(resultado);

    } catch (error) {
      console.error('Erro ao gerar relatório financeiro:', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro ao gerar relatório: ' + error.message
      });
    }
  });

  // Relatório de comissões
  fastify.get('/relatorios/comissoes', {
    preValidation: [fastify.authenticate, checkAdminOrGerenteRole],
    schema: {
      description: 'Relatório de comissões (ADMIN/GERENTE)',
      tags: ['relatorios'],
      security: [{ Bearer: [] }],
      querystring: {
        type: 'object',
        properties: {
          barbearia_id: { type: 'integer' },
          barbeiro_id: { type: 'string' },
          data_inicio: { type: 'string', format: 'date' },
          data_fim: { type: 'string', format: 'date' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { barbearia_id, barbeiro_id, data_inicio, data_fim } = request.query;

      // Definir datas padrão se não fornecidas
      const hoje = new Date();
      const dataInicio = data_inicio || new Date(hoje.getFullYear(), hoje.getMonth(), 1).toISOString().split('T')[0];
      const dataFim = data_fim || hoje.toISOString().split('T')[0];

      const filtros = {
        barbearia_id,
        barbeiro_id,
        data_inicio: dataInicio,
        data_fim: dataFim
      };

      const resultado = await relatorioService.gerarRelatorioComissoes(filtros);

      return reply.send(resultado);

    } catch (error) {
      console.error('Erro ao gerar relatório de comissões:', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro ao gerar relatório: ' + error.message
      });
    }
  });

  // Relatório de performance
  fastify.get('/relatorios/performance', {
    preValidation: [fastify.authenticate, checkAdminOrGerenteRole],
    schema: {
      description: 'Relatório de performance (ADMIN/GERENTE)',
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
      const { barbearia_id, data_inicio, data_fim, periodo } = request.query;

      // Definir datas padrão se não fornecidas
      const hoje = new Date();
      const dataInicio = data_inicio || new Date(hoje.getFullYear(), hoje.getMonth(), 1).toISOString().split('T')[0];
      const dataFim = data_fim || hoje.toISOString().split('T')[0];

      const filtros = {
        barbearia_id,
        data_inicio: dataInicio,
        data_fim: dataFim,
        periodo: periodo || 'mes'
      };

      const resultado = await relatorioService.gerarRelatorioPerformance(filtros);

      return reply.send(resultado);

    } catch (error) {
      console.error('Erro ao gerar relatório de performance:', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro ao gerar relatório: ' + error.message
      });
    }
  });

  // Relatório de satisfação
  fastify.get('/relatorios/satisfacao', {
    preValidation: [fastify.authenticate, checkAdminOrGerenteRole],
    schema: {
      description: 'Relatório de satisfação (ADMIN/GERENTE)',
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
      const { barbearia_id, data_inicio, data_fim, periodo } = request.query;

      // Definir datas padrão se não fornecidas
      const hoje = new Date();
      const dataInicio = data_inicio || new Date(hoje.getFullYear(), hoje.getMonth(), 1).toISOString().split('T')[0];
      const dataFim = data_fim || hoje.toISOString().split('T')[0];

      const filtros = {
        barbearia_id,
        data_inicio: dataInicio,
        data_fim: dataFim,
        periodo: periodo || 'mes'
      };

      const resultado = await relatorioService.gerarRelatorioSatisfacao(filtros);

      return reply.send(resultado);

    } catch (error) {
      console.error('Erro ao gerar relatório de satisfação:', error);
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