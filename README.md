# Lucas Barbearia - Backend

Sistema de gerenciamento de filas para barbearias com múltiplas unidades, desenvolvido com Fastify e Supabase.

## 🚀 Funcionalidades

- **Sistema de Filas**: Gerenciamento inteligente de filas por barbearia
- **🕐 Sistema de Agendamentos**: Agendamentos com prioridade na fila
- **QR Codes**: Geração automática de QR codes para entrada e status
- **Multi-unidades**: Suporte a múltiplas barbearias
- **Perfis de Usuário**: Admin, Gerente e Barbeiro com permissões específicas
- **Sistema de Avaliações**: Avaliação de atendimentos pelos clientes
- **Histórico e Relatórios**: Estatísticas detalhadas de atendimentos
- **API RESTful**: Documentação completa com Swagger
- **Autenticação JWT**: Sistema seguro de autenticação

## 🛠️ Stack Tecnológica

- **Fastify**: Framework web rápido e eficiente
- **Supabase**: Banco de dados PostgreSQL com autenticação
- **JWT**: Autenticação baseada em tokens
- **Joi**: Validação de schemas
- **bcrypt**: Hash de senhas
- **QRCode**: Geração de QR codes
- **Swagger**: Documentação da API

## 📋 Pré-requisitos

- Node.js 18+
- Conta no Supabase
- npm ou yarn

## 🔒 Segurança

O sistema inclui verificações automáticas de segurança:

```bash
# Verificação completa de segurança
npm run security:check

# Verificação rápida
npm run security:quick

# Apenas lock-file lint
npm run security:lockfile

# Verificar vulnerabilidades
npm run security:audit
```

**Nota**: As verificações de segurança são executadas automaticamente antes de `npm install` e `npm start`.

### **🛡️ Node.js Permission Model**
Para máxima segurança, use o Permission Model (requer Node.js 18.6.0+):

```bash
# Iniciar com permissões restritas
npm run start:secure

# Desenvolvimento com permissões restritas
npm run dev:secure
```

Consulte `SECURITY.md` e `NODE_PERMISSION_MODEL.md` para mais detalhes sobre as medidas de segurança implementadas.

## 🔧 Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd lucas-barbearia-backend
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
# Configurações do Servidor
PORT=3000
NODE_ENV=development

# Supabase
SUPABASE_URL=sua_url_do_supabase
SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_do_supabase

# JWT
JWT_SECRET=seu_jwt_secret_super_seguro
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

4. **Configure o banco de dados**
Execute os scripts SQL do arquivo `database/schema.sql` no seu projeto Supabase.

**Importante:** O schema já inclui políticas RLS permissivas para desenvolvimento. Se encontrar erros de RLS, consulte `database/README-RLS.md` para mais informações.

**🕐 Sistema de Agendamentos:** Para ativar o sistema de agendamentos com prioridade na fila, execute também:
```sql
-- 1. Criar estrutura de agendamentos
-- Execute: database/agendamentos_schema.sql

-- 2. Atualizar tabela clientes
-- Execute: database/update_clientes_agendamento.sql
```

5. **Execute o projeto**
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 📚 Documentação da API

Acesse a documentação interativa da API em:
```
http://localhost:3000/documentation
```

## 🚀 **CURLS PRINCIPAIS**

### **🏪 Para Clientes (PÚBLICO)**
```bash
# Listar barbearias
curl -X GET "http://localhost:3000/api/barbearias"

# Ver barbeiros de uma barbearia
curl -X GET "http://localhost:3000/api/users/barbeiros/ativos-publico?barbearia_id=7"

# Ver fila da barbearia
curl -X GET "http://localhost:3000/api/fila-publica/7"

# Entrar na fila (SEM autenticação)
curl -X POST "http://localhost:3000/api/fila/entrar" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "telefone": "(11) 99999-9999",
    "barbearia_id": 7
  }'
```

### **🔐 Para Funcionários (PRIVADO)**
```bash
# Login
curl -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@lucasbarbearia.com",
    "password": "admin123"
  }'

# Ver fila completa
curl -X GET "http://localhost:3000/api/fila/7" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# Histórico de atendimentos
curl -X GET "http://localhost:3000/api/historico?barbeiro_id=cf8053c6-3dc9-4bb6-87ff-fcd6db26d270" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**📋 Para todos os curls, consulte `API_DOCUMENTATION.md`**

## 🔧 Troubleshooting

### Problemas Comuns

#### **Endpoint `/api/historico` retorna 404**
- **Causa:** Problema com `fastify-plugin`
- **Solução:** Remova `fastify-plugin` do arquivo `src/routes/historico.js`
- **Detalhes:** Consulte `API_DOCUMENTATION.md` - Seção Troubleshooting

#### **Erro de coluna inexistente no banco**
- **Causa:** Nomes incorretos das colunas
- **Solução:** Use `data_inicio` e `data_fim` (não `data_atendimento`)
- **Detalhes:** Consulte `API_DOCUMENTATION.md` - Seção Troubleshooting

#### **Token inválido ou expirado**
- **Solução:** Gere novo token via `/api/auth/login`
- **Detalhes:** Consulte `API_DOCUMENTATION.md` - Seção Troubleshooting

**Para troubleshooting detalhado, consulte `API_DOCUMENTATION.md`**

## 📋 **Documentação Específica**

- **🕐 Sistema de Agendamentos**: Consulte `SISTEMA_AGENDAMENTOS.md` para detalhes sobre agendamentos com prioridade na fila
- **Gerenciamento de Barbeiros**: Consulte `BARBEIROS_MANAGEMENT.md` para detalhes sobre ativação/desativação de barbeiros nas barbearias
- **Políticas RLS**: Consulte `database/README-RLS.md` para informações sobre Row Level Security

## 🗂️ Estrutura do Projeto

```
src/
├── app.js                 # Arquivo principal da aplicação
├── config/
│   └── database.js        # Configuração do Supabase
├── plugins/
│   ├── jwt.js            # Plugin de autenticação JWT
│   ├── cors.js           # Plugin CORS
│   ├── helmet.js         # Plugin de segurança
│   └── swagger.js        # Plugin de documentação
├── middlewares/
│   └── auth.js           # Middlewares de autenticação
├── schemas/
│   ├── auth.js           # Schemas de validação - Auth
│   ├── barbearia.js      # Schemas de validação - Barbearia
│   └── fila.js           # Schemas de validação - Fila
├── utils/
│   ├── qrcode.js         # Utilitários de QR Code
│   └── validators.js     # Utilitários de validação
├── services/
│   └── authService.js    # Serviço de autenticação
├── controllers/
│   └── authController.js # Controller de autenticação
└── routes/
    ├── auth.js           # Rotas de autenticação
    ├── users.js          # Rotas de usuários
    ├── barbearias.js     # Rotas de barbearias
    ├── fila.js           # Rotas do sistema de fila
    ├── avaliacoes.js     # Rotas de avaliações
    └── historico.js      # Rotas de histórico

database/
├── schema.sql            # Schema principal do banco
├── agendamentos_schema.sql    # 🕐 Sistema de agendamentos
├── update_clientes_agendamento.sql # Atualizações para agendamentos
└── README-RLS.md         # Documentação RLS

Documentação/
├── SISTEMA_AGENDAMENTOS.md    # 🕐 Documentação completa dos agendamentos
├── EXEMPLO_AGENDAMENTOS.sql   # Exemplos práticos para testar
└── API_DOCUMENTATION_COMPLETE.md # Documentação da API
```

## 🔐 Autenticação e Permissões

### Perfis de Usuário

- **Admin**: Acesso total ao sistema
- **Gerente**: Gerenciamento da barbearia específica
- **Barbeiro**: Operações de fila e atendimento

### Endpoints Protegidos

Todos os endpoints (exceto login e entrada na fila) requerem autenticação JWT:

```bash
Authorization: Bearer <seu_token_jwt>
```

## 📊 Endpoints Principais

### Autenticação
- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/register` - Registro (apenas admin)
- `GET /api/auth/me` - Dados do usuário autenticado

### Barbearias
- `GET /api/barbearias` - Listar barbearias
- `POST /api/barbearias` - Criar barbearia (admin)
- `PUT /api/barbearias/:id` - Atualizar barbearia (admin)

### Sistema de Fila
- `POST /api/fila/entrar` - Cliente entra na fila
- `GET /api/fila/:barbearia_id` - Fila atual e estatísticas
- `GET /api/fila/status/:token` - Status do cliente
- `POST /api/fila/proximo/:barbearia_id` - Chamar próximo cliente
- `POST /api/fila/finalizar` - Finalizar atendimento
- `POST /api/fila/iniciar-atendimento/:cliente_id` - Iniciar atendimento
- `POST /api/fila/remover/:cliente_id` - Remover cliente da fila (não apareceu)

**Status dos Clientes:**
- `aguardando` → `proximo` → `atendendo` → `finalizado`
- `proximo` → `removido` (se não aparecer no balcão)

### Avaliações
- `POST /api/avaliacoes` - Enviar avaliação
- `GET /api/avaliacoes` - Listar avaliações (com filtros)

### Histórico e Relatórios
- `GET /api/historico/barbearias/:id` - Histórico de atendimentos
- `GET /api/historico/relatorios/barbearias/:id` - Relatórios e estatísticas

## 🧪 Testes

```bash
npm test
```

## 🚀 Deploy

### Variáveis de Ambiente para Produção

```env
NODE_ENV=production
PORT=3000
SUPABASE_URL=sua_url_producao
SUPABASE_ANON_KEY=sua_chave_anonima_producao
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_producao
JWT_SECRET=seu_jwt_secret_producao_super_seguro
CORS_ORIGIN=https://seu-dominio.com
```

### Comandos de Deploy

```bash
# Build para produção
npm run build

# Iniciar em produção
npm start
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte, envie um email para [seu-email@exemplo.com] ou abra uma issue no repositório.

---

**Desenvolvido com ❤️ para Lucas Barbearia** 

---

## Permissões e Alterações Recentes

### 1. Middlewares de Permissão por Role
Arquivo: `src/middlewares/rolePermissions.js`
- `checkBarbeiroRole`: Permite acesso apenas a barbeiros.
- `checkGerenteRole`: Permite acesso apenas a gerentes.
- `checkAdminRole`: Permite acesso apenas a administradores.
- `checkAdminOrGerenteRole`: Permite acesso a admins e gerentes.
- `checkGerenteBarbeariaAccess`: Garante que o gerente só acesse sua própria barbearia.
- `checkBarbeiroBarbeariaAccess`: Garante que o barbeiro só acesse barbearias onde trabalha.

### 2. Atualização das Rotas de Fila (`src/routes/fila.js`)
- Endpoints de operações de fila (chamar próximo, iniciar atendimento, remover cliente, finalizar atendimento) agora exigem autenticação e o middleware de barbeiro.
- Endpoint exclusivo para gerente visualizar estatísticas da fila: `GET /api/fila-gerente/:barbearia_id` (apenas gerente/admin, só da sua barbearia).
- Endpoint público para clientes verem estatísticas da fila: `GET /api/fila-publica/:barbearia_id` (qualquer cliente pode ver quantas pessoas estão na fila, barbeiros ativos, etc).

### 3. Atualização das Rotas de Usuários (`src/routes/users.js`)
- Apenas admin pode cadastrar, editar e remover usuários.
- Apenas barbeiros podem ativar/desativar seu status.
- Listagem de barbeiros agora usa o middleware `checkAdminOrGerenteRole` para garantir que só admin/gerente acessem dados completos.

### 4. Atualização das Rotas de Barbearias (`src/routes/barbearias.js`)
- Apenas admin pode cadastrar, editar e remover barbearias.

### 5. Atualização das Rotas de Avaliações (`src/routes/avaliacoes.js`)
- Apenas admin e gerente podem acessar avaliações completas.

### 6. Atualização das Rotas de Histórico (`src/routes/historico.js`)
- Apenas admin e gerente podem acessar histórico e relatórios.

### 7. Remoção de Endpoints Duplicados e de Debug
- Endpoints duplicados de barbeiros e rotas de debug foram removidos para evitar confusão e garantir clareza na API.

### 8. Padronização das Respostas
- Todas as rotas seguem o padrão:
  ```json
  {
    "success": true/false,
    "data": { ... },
    "message": "mensagem opcional",
    "error": "erro opcional"
  }
  ```

### 9. Resumo das Permissões por Perfil
- **Admin:** Acesso total a todas as operações e dados.
- **Gerente:** Acesso apenas à sua barbearia, sem funções de barbeiro.
- **Barbeiro:** Apenas operações de atendimento e fila, sem acesso administrativo.
- **Cliente:** Pode entrar na fila e consultar estatísticas públicas da fila.

### 10. Garantia de Segurança
- Todos os endpoints sensíveis agora exigem autenticação e validação de role.
- Dados sensíveis só são expostos para perfis autorizados. 