const BarbeariaService = require('../../services/barbeariaService');

/**
 * @swagger
 * /api/barbearias:
 *   get:
 *     tags: [barbearias]
 *     summary: Listar barbearias (PÚBLICO)
 *     responses:
 *       200:
 *         description: Lista de barbearias ativas
 */
async function listarBarbearias(fastify, options) {
  // Instanciar serviço de barbearias
  const barbeariaService = new BarbeariaService(fastify.supabase);

  // Listar todas as barbearias ativas (PÚBLICO)
  fastify.get('/', async (request, reply) => {
    try {
      const barbearias = await barbeariaService.listarBarbearias();

      return reply.send({
        success: true,
        data: barbearias
      });
    } catch (error) {
      return reply.status(400).send({
        success: false,
        error: error.message
      });
    }
  });

  /**
   * @swagger
   * /api/barbearias/disponiveis:
   *   get:
   *     tags: [barbearias]
   *     summary: Listar barbearias disponíveis com barbeiros ativos (PÚBLICO)
   *     description: Retorna apenas barbearias que possuem barbeiros ativos, incluindo informações dos barbeiros para seleção do cliente
   *     responses:
   *       200:
   *         description: Lista de barbearias disponíveis com barbeiros ativos
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: integer
   *                       nome:
   *                         type: string
   *                       endereco:
   *                         type: string
   *                       telefone:
   *                         type: string
   *                       barbeiros_ativos:
   *                         type: integer
   *                       tempo_estimado:
   *                         type: integer
   *                       clientes_aguardando:
   *                         type: integer
   *                       barbeiros:
   *                         type: array
   *                         items:
   *                           type: object
   *                           properties:
   *                             id:
   *                               type: string
   *                             nome:
   *                               type: string
   *                             especialidade:
   *                               type: string
   *       500:
   *         description: Erro interno do servidor
   */
  // Listar barbearias disponíveis com barbeiros ativos (PÚBLICO)
  fastify.get('/disponiveis', async (request, reply) => {
    try {
      // Buscar todas as barbearias ativas
      const { data: barbearias, error: barbeariasError } = await fastify.supabase
        .from('barbearias')
        .select('*')
        .eq('ativo', true)
        .order('nome');

      if (barbeariasError) {
        throw new Error('Erro ao buscar barbearias');
      }

      const barbeariasDisponiveis = [];

      // Para cada barbearia, verificar se tem barbeiros ativos
      for (const barbearia of barbearias) {
        // Buscar barbeiros ativos na barbearia
        const { data: barbeirosAtivos, error: barbeirosError } = await fastify.supabase
          .from('barbeiros_barbearias')
          .select(`
            id,
            ativo,
            especialidade,
            users(id, nome)
          `)
          .eq('barbearia_id', barbearia.id)
          .eq('ativo', true);

        if (barbeirosError) {
          console.error(`Erro ao buscar barbeiros da barbearia ${barbearia.id}:`, barbeirosError);
          continue;
        }

        // Se tem barbeiros ativos, incluir na lista
        if (barbeirosAtivos && barbeirosAtivos.length > 0) {
          // Buscar estatísticas da fila
          const { data: clientes, error: clientesError } = await fastify.supabase
            .from('clientes')
            .select('status')
            .eq('barbearia_id', barbearia.id)
            .in('status', ['aguardando', 'proximo', 'atendendo']);

          if (clientesError) {
            console.error(`Erro ao buscar clientes da barbearia ${barbearia.id}:`, clientesError);
          }

          // Calcular estatísticas
          const clientesAguardando = clientes ? clientes.filter(c => c.status === 'aguardando').length : 0;
          const tempoEstimado = clientesAguardando * 15; // 15 minutos por cliente

          // Formatar dados dos barbeiros
          const barbeiros = barbeirosAtivos.map(bb => ({
            id: bb.users.id,
            nome: bb.users.nome,
            especialidade: bb.especialidade || 'Geral'
          }));

          barbeariasDisponiveis.push({
            id: barbearia.id,
            nome: barbearia.nome,
            endereco: barbearia.endereco,
            telefone: barbearia.telefone,
            whatsapp: barbearia.whatsapp,
            barbeiros_ativos: barbeirosAtivos.length,
            tempo_estimado: tempoEstimado,
            clientes_aguardando: clientesAguardando,
            barbeiros: barbeiros
          });
        }
      }

      return reply.send({
        success: true,
        data: barbeariasDisponiveis
      });
    } catch (error) {
      console.error('Erro ao buscar barbearias disponíveis:', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  });

  /**
   * @swagger
   * /api/barbearias/{id}:
   *   get:
   *     tags: [barbearias]
   *     summary: Buscar barbearia por ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Dados da barbearia
   *       404:
   *         description: Barbearia não encontrada
   */
  // Buscar barbearia por ID (PÚBLICO)
  fastify.get('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const barbearia = await barbeariaService.buscarBarbeariaPorId(id);

      return reply.send({
        success: true,
        data: barbearia
      });
    } catch (error) {
      if (error.message.includes('não encontrada')) {
        return reply.status(404).send({
          success: false,
          error: error.message
        });
      }
      
      return reply.status(400).send({
        success: false,
        error: error.message
      });
    }
  });
}

module.exports = listarBarbearias; 