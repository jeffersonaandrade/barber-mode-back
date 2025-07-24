const barbeariaSchema = {
  body: {
    type: 'object',
    required: ['nome', 'endereco', 'horario', 'servicos'],
    properties: {
      nome: {
        type: 'string',
        minLength: 2,
        maxLength: 255,
        description: 'Nome da barbearia'
      },
      endereco: {
        type: 'string',
        minLength: 10,
        description: 'Endereço completo da barbearia'
      },
      telefone: {
        anyOf: [
          { type: 'null' },
          { type: 'string', pattern: '^\\+?[1-9]\\d{1,14}$' }
        ],
        description: 'Telefone da barbearia'
      },
      whatsapp: {
        anyOf: [
          { type: 'null' },
          { type: 'string', pattern: '^\\+?[1-9]\\d{1,14}$' }
        ],
        description: 'WhatsApp da barbearia'
      },
      instagram: {
        anyOf: [
          { type: 'null' },
          { type: 'string', pattern: '^@?[a-zA-Z0-9._]+$' }
        ],
        description: 'Instagram da barbearia'
      },
      horario: {
        type: 'object',
        required: ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'],
        properties: {
          segunda: {
            type: 'object',
            required: ['aberto'],
            properties: {
              aberto: { type: 'boolean' },
              inicio: { 
                type: 'string', 
                pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$' 
              },
              fim: { 
                type: 'string', 
                pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$' 
              }
            }
          },
          terca: {
            type: 'object',
            required: ['aberto'],
            properties: {
              aberto: { type: 'boolean' },
              inicio: { 
                type: 'string', 
                pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$' 
              },
              fim: { 
                type: 'string', 
                pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$' 
              }
            }
          },
          quarta: {
            type: 'object',
            required: ['aberto'],
            properties: {
              aberto: { type: 'boolean' },
              inicio: { 
                type: 'string', 
                pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$' 
              },
              fim: { 
                type: 'string', 
                pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$' 
              }
            }
          },
          quinta: {
            type: 'object',
            required: ['aberto'],
            properties: {
              aberto: { type: 'boolean' },
              inicio: { 
                type: 'string', 
                pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$' 
              },
              fim: { 
                type: 'string', 
                pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$' 
              }
            }
          },
          sexta: {
            type: 'object',
            required: ['aberto'],
            properties: {
              aberto: { type: 'boolean' },
              inicio: { 
                type: 'string', 
                pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$' 
              },
              fim: { 
                type: 'string', 
                pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$' 
              }
            }
          },
          sabado: {
            type: 'object',
            required: ['aberto'],
            properties: {
              aberto: { type: 'boolean' },
              inicio: { 
                type: 'string', 
                pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$' 
              },
              fim: { 
                type: 'string', 
                pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$' 
              }
            }
          },
          domingo: {
            type: 'object',
            required: ['aberto'],
            properties: {
              aberto: { type: 'boolean' },
              inicio: { 
                type: 'string', 
                pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$' 
              },
              fim: { 
                type: 'string', 
                pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$' 
              }
            }
          }
        },
        description: 'Horário de funcionamento da barbearia'
      },
      configuracoes: {
        type: 'object',
        properties: {
          tempo_medio_atendimento: {
            type: 'integer',
            minimum: 10,
            maximum: 120,
            default: 30,
            description: 'Tempo médio de atendimento em minutos'
          },
          max_clientes_fila: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 50,
            description: 'Máximo de clientes na fila'
          },
          permitir_agendamento: {
            type: 'boolean',
            default: false,
            description: 'Permitir agendamento de horários'
          },
          mostrar_tempo_estimado: {
            type: 'boolean',
            default: true,
            description: 'Mostrar tempo estimado de espera'
          }
        },
        default: {},
        description: 'Configurações da barbearia'
      },
      servicos: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          required: ['nome', 'preco', 'duracao'],
          properties: {
            nome: {
              type: 'string',
              description: 'Nome do serviço'
            },
            preco: {
              type: 'number',
              minimum: 0,
              description: 'Preço do serviço'
            },
            duracao: {
              type: 'integer',
              minimum: 1,
              description: 'Duração do serviço em minutos'
            },
            descricao: {
              type: 'string',
              description: 'Descrição do serviço'
            }
          }
        },
        description: 'Lista de serviços oferecidos'
      }
    },
    description: 'Dados da barbearia'
  }
};

const barbeariaUpdateSchema = {
  body: {
    type: 'object',
    properties: {
      nome: {
        type: 'string',
        minLength: 2,
        maxLength: 255
      },
      endereco: {
        type: 'string',
        minLength: 10
      },
      telefone: {
        type: 'string',
        pattern: '^\\+?[1-9]\\d{1,14}$'
      },
      whatsapp: {
        type: 'string',
        pattern: '^\\+?[1-9]\\d{1,14}$'
      },
      instagram: {
        type: 'string',
        pattern: '^[a-zA-Z0-9._]+$'
      },
      horario: {
        type: 'object'
      },
      configuracoes: {
        type: 'object'
      },
      servicos: {
        type: 'array',
        items: {
          type: 'object',
          required: ['nome', 'preco', 'duracao'],
          properties: {
            nome: { type: 'string' },
            preco: { type: 'number', minimum: 0 },
            duracao: { type: 'integer', minimum: 1 },
            descricao: { type: 'string' }
          }
        }
      },
      ativo: {
        type: 'boolean'
      }
    }
  }
};

module.exports = {
  barbeariaSchema,
  barbeariaUpdateSchema
}; 