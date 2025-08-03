const loginSchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
        description: 'Email do usuário'
      },
      password: {
        type: 'string',
        minLength: 6,
        description: 'Senha do usuário'
      }
    }
  }
};

const registerSchema = {
  body: {
    type: 'object',
    required: ['email', 'password', 'nome', 'role'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
        description: 'Email do usuário'
      },
      password: {
        type: 'string',
        minLength: 6,
        description: 'Senha do usuário'
      },
      nome: {
        type: 'string',
        minLength: 2,
        maxLength: 255,
        description: 'Nome do usuário'
      },
      telefone: {
        type: 'string',
        pattern: '^\\+?[1-9]\\d{1,14}$',
        description: 'Telefone do usuário'
      },
      role: {
        type: 'string',
        enum: ['admin', 'gerente', 'barbeiro'],
        description: 'Papel do usuário no sistema'
      }
    }
  }
};

module.exports = {
  loginSchema,
  registerSchema
}; 