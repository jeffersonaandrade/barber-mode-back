const entrarFilaSchema = {
  body: {
    type: 'object',
    required: ['nome', 'telefone'],
    properties: {
      nome: {
        type: 'string',
        minLength: 2,
        maxLength: 255,
        description: 'Nome do cliente'
      },
      telefone: {
        type: 'string',
        pattern: '^\\+?[1-9]\\d{1,14}$',
        description: 'Telefone do cliente'
      },
      barbeiro_id: {
        type: 'string',
        format: 'uuid',
        description: 'ID do barbeiro preferido'
      }
    },
    description: 'Dados para entrar na fila'
  }
};

const adicionarClienteSchema = {
  body: {
    type: 'object',
    required: ['nome', 'telefone'],
    properties: {
      nome: {
        type: 'string',
        minLength: 2,
        maxLength: 255,
        description: 'Nome do cliente'
      },
      telefone: {
        type: 'string',
        pattern: '^\\+?[1-9]\\d{1,14}$',
        description: 'Telefone do cliente'
      },
      barbeiro_id: {
        type: 'string',
        format: 'uuid',
        description: 'ID do barbeiro preferido'
      },
      posicao: {
        type: 'integer',
        minimum: 1,
        description: 'Posição específica na fila'
      }
    },
    description: 'Dados para adicionar cliente manualmente'
  }
};

const finalizarAtendimentoSchema = {
  body: {
    type: 'object',
    properties: {
      servico: {
        type: 'string',
        description: 'Nome do serviço realizado'
      },
      duracao: {
        type: 'integer',
        minimum: 1,
        description: 'Duração do atendimento em minutos'
      }
    },
    description: 'Dados para finalizar atendimento'
  }
};

module.exports = {
  entrarFilaSchema,
  adicionarClienteSchema,
  finalizarAtendimentoSchema
}; 