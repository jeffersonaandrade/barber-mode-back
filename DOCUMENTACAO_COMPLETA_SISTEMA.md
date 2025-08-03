# 📋 DOCUMENTAÇÃO COMPLETA - SISTEMA LUCAS BARBEARIA

## 🎯 VISÃO GERAL DO SISTEMA

O **Sistema Lucas Barbearia** é uma solução completa de gerenciamento de filas e agendamentos para barbearias com múltiplas unidades. O sistema foi desenvolvido com foco em eficiência operacional, experiência do cliente e controle administrativo.

### **🏢 Propósito Principal**
- Gerenciar filas de clientes em tempo real
- Permitir agendamentos com prioridade na fila
- Controlar múltiplas barbearias e barbeiros
- Gerar relatórios e estatísticas de atendimento
- Sistema de avaliações dos clientes
- Controle de acesso baseado em roles (Admin, Gerente, Barbeiro)

### **🎯 Público-Alvo**
- **Barbearias** com múltiplas unidades
- **Barbeiros** que precisam gerenciar atendimentos
- **Gerentes** que supervisionam operações
- **Administradores** que controlam todo o sistema
- **Clientes** que utilizam o sistema de fila

---

## 🏗️ ARQUITETURA DO SISTEMA

### **📐 Stack Tecnológica**

#### **Backend**
- **Framework**: Fastify (Node.js)
- **Banco de Dados**: Supabase (PostgreSQL)
- **Autenticação**: JWT (JSON Web Tokens)
- **Validação**: Joi
- **Hash de Senhas**: bcrypt
- **QR Codes**: qrcode
- **Documentação**: Swagger/OpenAPI

#### **Infraestrutura**
- **Hosting**: Vercel (deploy automático)
- **Banco**: Supabase (PostgreSQL + Auth)
- **Segurança**: Row Level Security (RLS)
- **Monitoramento**: Logs estruturados

### **🏛️ Padrão Arquitetural**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │   Database      │
│   (Cliente)     │◄──►│   (Fastify)     │◄──►│   (Supabase)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Services      │
                       │   (Business     │
                       │    Logic)       │
                       └─────────────────┘
```

---

## 🗄️ ESTRUTURA DO BANCO DE DADOS

### **📊 Tabelas Principais**

#### **1. users** - Usuários do Sistema
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'gerente', 'barbeiro')),
  nome VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  active BOOLEAN DEFAULT true
);
```

**Campos Importantes:**
- `role`: Define o nível de acesso (admin, gerente, barbeiro)
- `active`: Controla se o usuário está ativo no sistema
- `password_hash`: Senha criptografada com bcrypt

#### **2. barbearias** - Barbearias do Sistema
```sql
CREATE TABLE barbearias (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  endereco TEXT NOT NULL,
  telefone VARCHAR(20),
  whatsapp VARCHAR(20),
  instagram VARCHAR(100),
  horario JSONB NOT NULL, -- Horários de funcionamento
  configuracoes JSONB NOT NULL DEFAULT '{}', -- Configurações específicas
  servicos JSONB NOT NULL, -- Lista de serviços oferecidos
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Campos JSONB:**
- `horario`: Horários de funcionamento por dia da semana
- `configuracoes`: Configurações como tempo médio de atendimento
- `servicos`: Lista de serviços com preços e durações

#### **3. barbeiros_barbearias** - Relacionamento Barbeiros-Barbearias
```sql
CREATE TABLE barbeiros_barbearias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  barbearia_id INTEGER REFERENCES barbearias(id) ON DELETE CASCADE,
  especialidade VARCHAR(255),
  dias_trabalho JSONB NOT NULL DEFAULT '[]',
  horario_inicio TIME NOT NULL,
  horario_fim TIME NOT NULL,
  disponivel BOOLEAN DEFAULT true,
  ativo BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, barbearia_id)
);
```

**Funcionalidades:**
- Um barbeiro pode trabalhar em múltiplas barbearias
- Controle de disponibilidade e status ativo
- Horários específicos por barbearia

#### **4. clientes** - Clientes na Fila
```sql
CREATE TABLE clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  barbearia_id INTEGER REFERENCES barbearias(id) ON DELETE CASCADE,
  barbeiro_id UUID REFERENCES users(id),
  status VARCHAR(50) NOT NULL DEFAULT 'aguardando' 
    CHECK (status IN ('aguardando', 'proximo', 'atendendo', 'finalizado', 'removido')),
  posicao INTEGER NOT NULL,
  tempo_estimado INTEGER,
  data_entrada TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_atendimento TIMESTAMP WITH TIME ZONE,
  data_finalizacao TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Estados da Fila:**
- `aguardando`: Cliente aguardando na fila
- `proximo`: Cliente foi chamado
- `atendendo`: Cliente está sendo atendido
- `finalizado`: Atendimento concluído
- `removido`: Cliente foi removido da fila

#### **5. agendamentos** - Sistema de Agendamentos
```sql
CREATE TABLE agendamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
  barbearia_id INTEGER REFERENCES barbearias(id) ON DELETE CASCADE,
  barbeiro_id UUID REFERENCES users(id),
  servico_id VARCHAR(255),
  data_agendamento DATE NOT NULL,
  hora_agendamento TIME NOT NULL,
  data_hora_agendamento TIMESTAMP WITH TIME ZONE NOT NULL,
  duracao_estimada INTEGER DEFAULT 30,
  status VARCHAR(50) NOT NULL DEFAULT 'agendado' 
    CHECK (status IN ('agendado', 'confirmado', 'em_atendimento', 'finalizado', 'cancelado', 'nao_compareceu')),
  observacoes TEXT,
  nome_cliente VARCHAR(255) NOT NULL,
  telefone_cliente VARCHAR(20) NOT NULL,
  email_cliente VARCHAR(255),
  prioridade INTEGER DEFAULT 0, -- 0 = normal, 1 = alta, 2 = urgente
  token_agendamento VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **6. avaliacoes** - Avaliações dos Clientes
```sql
CREATE TABLE avaliacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
  barbearia_id INTEGER REFERENCES barbearias(id) ON DELETE CASCADE,
  barbeiro_id UUID REFERENCES users(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  categoria VARCHAR(50) CHECK (categoria IN ('atendimento', 'qualidade', 'ambiente', 'tempo', 'preco')),
  comentario TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **7. historico_atendimentos** - Histórico de Atendimentos
```sql
CREATE TABLE historico_atendimentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
  barbearia_id INTEGER REFERENCES barbearias(id) ON DELETE CASCADE,
  barbeiro_id UUID REFERENCES users(id),
  servico VARCHAR(255),
  duracao INTEGER,
  data_inicio TIMESTAMP WITH TIME ZONE,
  data_fim TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **🔐 Segurança do Banco (RLS)**

O sistema utiliza **Row Level Security (RLS)** do PostgreSQL para garantir que:
- Usuários só acessem dados autorizados
- Gerentes só vejam dados de suas barbearias
- Barbeiros só vejam dados de onde trabalham
- Admins tenham acesso total

---

## 🔐 SISTEMA DE AUTENTICAÇÃO E AUTORIZAÇÃO

### **🎫 JWT (JSON Web Tokens)**

#### **Estrutura do Token**
```javascript
{
  "userId": "uuid-do-usuario",
  "email": "usuario@exemplo.com",
  "role": "admin|gerente|barbeiro",
  "iat": 1234567890,
  "exp": 1234567890
}
```

#### **Configuração JWT**
```javascript
// src/plugins/jwt.js
const jwt = require('@fastify/jwt');

module.exports = async function(fastify, options) {
  await fastify.register(jwt, {
    secret: process.env.JWT_SECRET,
    sign: {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    }
  });
};
```

### **👥 Sistema de Roles**

#### **1. Admin**
- **Acesso**: Total ao sistema
- **Permissões**: 
  - Criar/editar/remover usuários
  - Criar/editar/remover barbearias
  - Acessar todos os dados
  - Configurar sistema

#### **2. Gerente**
- **Acesso**: Apenas à sua barbearia
- **Permissões**:
  - Gerenciar barbeiros da sua barbearia
  - Ver estatísticas da sua barbearia
  - Acessar histórico da sua barbearia
  - Configurar sua barbearia

#### **3. Barbeiro**
- **Acesso**: Apenas operações de atendimento
- **Permissões**:
  - Gerenciar fila (chamar próximo, finalizar)
  - Ver clientes em atendimento
  - Ativar/desativar status
  - Ver histórico próprio

### **🛡️ Middlewares de Segurança**

#### **Autenticação**
```javascript
// src/middlewares/auth/authenticate.js
async function authenticate(request, reply) {
  const token = request.headers.authorization?.replace('Bearer ', '');
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await supabase.from('users').select('*').eq('id', decoded.userId).single();
  request.user = user;
}
```

#### **Verificação de Roles**
```javascript
// src/middlewares/access/rolePermissions.js
async function checkAdminRole(request, reply) {
  if (request.user.role !== 'admin') {
    return reply.status(403).send({
      success: false,
      error: 'Apenas administradores podem acessar este recurso'
    });
  }
}
```

---

## 🔄 FLUXO DE FUNCIONAMENTO DO SISTEMA

### **📋 Fluxo Principal da Fila**

#### **1. Cliente Entra na Fila**
```
Cliente → POST /api/fila/entrar → Sistema gera token → Cliente recebe QR Code
```

#### **2. Barbeiro Chama Próximo**
```
Barbeiro → POST /api/fila/proximo/:barbearia_id → Sistema atualiza status → Cliente é notificado
```

#### **3. Início do Atendimento**
```
Barbeiro → POST /api/fila/iniciar-atendimento/:cliente_id → Status muda para "atendendo"
```

#### **4. Finalização**
```
Barbeiro → POST /api/fila/finalizar → Cliente vai para histórico → Avaliação é solicitada
```

### **📅 Fluxo de Agendamentos**

#### **1. Cliente Faz Agendamento**
```
Cliente → POST /api/agendamentos → Sistema verifica disponibilidade → Agendamento confirmado
```

#### **2. Agendamento com Prioridade**
```
Cliente com agendamento → Entra na fila → Recebe prioridade → É chamado primeiro
```

#### **3. Confirmação de Presença**
```
Cliente chega → Confirma presença → Agendamento vira atendimento
```

---

## 🛠️ SERVIÇOS PRINCIPAIS

### **🎯 FilaService** - Gerenciamento de Filas

#### **Funcionalidades Principais**
- Adicionar cliente na fila
- Chamar próximo cliente
- Gerenciar status de atendimento
- Gerar QR codes
- Calcular estatísticas

#### **Métodos Principais**
```javascript
class FilaService {
  // Adicionar cliente na fila
  async adicionarClienteNaFila(clienteData) {
    // Verifica barbearia ativa
    // Gera token único
    // Calcula posição na fila
    // Gera QR codes
    // Retorna dados do cliente
  }

  // Chamar próximo cliente
  async chamarProximoCliente(barbearia_id, barbeiro_id) {
    // Busca próximo cliente na fila
    // Atualiza status para "proximo"
    // Reordena fila se necessário
    // Retorna dados do cliente
  }

  // Verificar status do cliente
  async verificarStatusCliente(token) {
    // Busca cliente pelo token
    // Retorna posição e status atual
    // Calcula tempo estimado
  }

  // Gerar QR codes
  async gerarQRCodeFila(cliente) {
    // Gera QR code para entrada na fila
    // Contém dados do cliente e barbearia
  }

  async gerarQRCodeStatus(cliente) {
    // Gera QR code para consulta de status
    // Contém token único do cliente
  }
}
```

### **👤 UserService** - Gerenciamento de Usuários

#### **Funcionalidades**
- CRUD de usuários
- Gerenciamento de roles
- Ativação/desativação de barbeiros
- Relacionamento barbeiro-barbearia

### **🏪 BarbeariaService** - Gerenciamento de Barbearias

#### **Funcionalidades**
- CRUD de barbearias
- Configurações específicas
- Horários de funcionamento
- Serviços oferecidos

### **📊 RelatorioService** - Relatórios e Estatísticas

#### **Funcionalidades**
- Estatísticas de atendimento
- Relatórios por período
- Métricas de performance
- Exportação de dados

---

## 🔧 CONFIGURAÇÃO E DEPLOY

### **📦 Dependências Principais**

```json
{
  "dependencies": {
    "@fastify/cors": "^11.0.1",
    "@fastify/helmet": "^13.0.1",
    "@fastify/jwt": "^9.1.0",
    "@fastify/swagger": "^9.5.1",
    "@supabase/supabase-js": "^2.38.4",
    "bcrypt": "^5.1.1",
    "fastify": "^5.4.0",
    "joi": "^17.12.0",
    "qrcode": "^1.5.3"
  }
}
```

### **⚙️ Variáveis de Ambiente**

```env
# Supabase
SUPABASE_URL=sua_url_do_supabase
SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_do_supabase

# JWT
JWT_SECRET=sua_chave_secreta_jwt_muito_segura
JWT_EXPIRES_IN=24h

# Servidor
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

### **🚀 Scripts de Deploy**

```bash
# Desenvolvimento
npm run dev

# Produção
npm start

# Com segurança
npm run start:secure

# Testes
npm test
npm run test:coverage
```

---

## 🔒 SEGURANÇA E BOAS PRÁTICAS

### **🛡️ Medidas de Segurança**

#### **1. Verificação de Dependências**
- Lock-file lint para verificar integridade
- Npm audit para vulnerabilidades
- Verificações automáticas antes do deploy

#### **2. Autenticação e Autorização**
- JWT com expiração
- Verificação de roles
- Middlewares de segurança

#### **3. Validação de Dados**
- Joi para validação de schemas
- Sanitização de inputs
- Validação no banco de dados

#### **4. Row Level Security**
- Políticas RLS no PostgreSQL
- Controle de acesso por usuário
- Isolamento de dados por barbearia

### **📋 Checklist de Segurança**

- ✅ Dependências atualizadas
- ✅ Variáveis de ambiente seguras
- ✅ Autenticação JWT implementada
- ✅ Validação de inputs
- ✅ RLS configurado
- ✅ Logs de segurança
- ✅ Backup automático
- ✅ Monitoramento de erros

---

## 📊 API ENDPOINTS PRINCIPAIS

### **🔐 Autenticação**
```
POST /api/auth/login          - Login de usuário
POST /api/auth/register       - Registro (apenas admin)
GET  /api/auth/me             - Dados do usuário autenticado
POST /api/auth/logout         - Logout
```

### **🏪 Barbearias**
```
GET    /api/barbearias                    - Listar barbearias
POST   /api/barbearias                    - Criar barbearia (admin)
PUT    /api/barbearias/:id                - Atualizar barbearia (admin)
DELETE /api/barbearias/:id                - Remover barbearia (admin)
GET    /api/barbearias/:id/configuracoes  - Configurações da barbearia
```

### **👥 Usuários**
```
GET    /api/users                    - Listar usuários (admin/gerente)
POST   /api/users                    - Criar usuário (admin)
PUT    /api/users/:id                - Atualizar usuário (admin)
DELETE /api/users/:id                - Remover usuário (admin)
GET    /api/users/barbeiros/ativos   - Barbeiros ativos
POST   /api/users/barbeiros/:id/ativar - Ativar barbeiro
```

### **📋 Fila**
```
POST   /api/fila/entrar                    - Cliente entra na fila
GET    /api/fila/:barbearia_id             - Ver fila (barbeiro/gerente)
GET    /api/fila-publica/:barbearia_id     - Ver fila pública
POST   /api/fila/proximo/:barbearia_id     - Chamar próximo cliente
POST   /api/fila/iniciar-atendimento/:id   - Iniciar atendimento
POST   /api/fila/finalizar                 - Finalizar atendimento
GET    /api/fila/status/:token             - Status do cliente
```

### **📅 Agendamentos**
```
POST   /api/agendamentos                   - Criar agendamento
GET    /api/agendamentos                   - Listar agendamentos
PUT    /api/agendamentos/:id               - Atualizar agendamento
DELETE /api/agendamentos/:id               - Cancelar agendamento
GET    /api/agendamentos/horarios          - Horários disponíveis
```

### **⭐ Avaliações**
```
POST   /api/avaliacoes                     - Enviar avaliação
GET    /api/avaliacoes                     - Listar avaliações
GET    /api/avaliacoes/barbearia/:id       - Avaliações da barbearia
```

### **📊 Histórico e Relatórios**
```
GET    /api/historico                      - Histórico de atendimentos
GET    /api/historico/barbearias/:id       - Histórico da barbearia
GET    /api/relatorios/barbearias/:id      - Relatórios da barbearia
GET    /api/relatorios/exportar            - Exportar relatórios
```

---

## 🧪 TESTES E QUALIDADE

### **📋 Estrutura de Testes**

```
tests/
├── services/           - Testes dos serviços
├── routes/            - Testes das rotas
├── middlewares/       - Testes dos middlewares
├── mocks/             - Mocks para testes
└── setup.js           - Configuração dos testes
```

### **🔧 Ferramentas de Teste**

- **Jest**: Framework de testes
- **Stryker**: Testes de mutação
- **Tap**: Testes de integração

### **📊 Cobertura de Testes**

```bash
# Executar todos os testes
npm test

# Testes com cobertura
npm run test:coverage

# Testes de mutação
npm run test:mutation

# Testes específicos
npm run test:services
npm run test:routes
```

---

## 📈 MONITORAMENTO E LOGS

### **📊 Métricas Principais**

- Tempo médio de atendimento
- Número de clientes na fila
- Taxa de abandono
- Avaliações dos clientes
- Performance dos barbeiros

### **📝 Logs Estruturados**

```javascript
// Exemplo de log estruturado
{
  "timestamp": "2024-01-15T10:30:00Z",
  "level": "info",
  "message": "Cliente adicionado à fila",
  "data": {
    "cliente_id": "uuid",
    "barbearia_id": 1,
    "posicao": 5,
    "user_id": "uuid-do-barbeiro"
  }
}
```

---

## 🔄 BACKUP E RECUPERAÇÃO

### **💾 Backup Automático**

O sistema inclui scripts de backup automático:

```javascript
// scripts/backup-database.js
async function backupDatabase() {
  // Backup completo do banco
  // Backup incremental
  // Compressão dos dados
  // Upload para storage seguro
}
```

### **🔄 Recuperação**

- Backup diário automático
- Backup antes de migrações
- Scripts de recuperação
- Testes de restauração

---

## 🚀 DEPLOY E INFRAESTRUTURA

### **🌐 Vercel (Deploy Automático)**

```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "src/app.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/app.js"
    }
  ]
}
```

### **🗄️ Supabase (Banco de Dados)**

- PostgreSQL gerenciado
- Autenticação integrada
- Row Level Security
- Backup automático
- Monitoramento em tempo real

---

## 📚 DOCUMENTAÇÃO DA API

### **🔗 Swagger/OpenAPI**

A documentação interativa está disponível em:
```
http://localhost:3000/documentation
```

### **📖 Exemplos de Uso**

#### **Login de Usuário**
```bash
curl -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@lucasbarbearia.com",
    "password": "admin123"
  }'
```

#### **Adicionar Cliente na Fila**
```bash
curl -X POST "http://localhost:3000/api/fila/entrar" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "telefone": "(11) 99999-9999",
    "barbearia_id": 1
  }'
```

#### **Chamar Próximo Cliente**
```bash
curl -X POST "http://localhost:3000/api/fila/proximo/1" \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

---

## 🔧 MANUTENÇÃO E SUPORTE

### **🛠️ Tarefas de Manutenção**

#### **Limpeza Automática**
```javascript
// scripts/limpeza-automatica.js
async function limpezaAutomatica() {
  // Remover clientes antigos da fila
  // Limpar histórico antigo
  // Otimizar banco de dados
  // Backup de segurança
}
```

#### **Migrações de Banco**
```javascript
// scripts/migrar-banco.js
async function executarMigracoes() {
  // Executar scripts SQL
  // Verificar integridade
  // Backup antes da migração
  // Rollback em caso de erro
}
```

### **📞 Suporte**

- Documentação completa
- Logs detalhados
- Monitoramento em tempo real
- Backup automático
- Scripts de recuperação

---

## 🎯 CONCLUSÃO

O **Sistema Lucas Barbearia** é uma solução robusta e completa para gerenciamento de filas e agendamentos de barbearias. Com arquitetura moderna, segurança avançada e funcionalidades abrangentes, o sistema atende às necessidades de barbearias de todos os tamanhos.

### **✅ Pontos Fortes**
- Arquitetura escalável
- Segurança robusta
- Interface intuitiva
- Funcionalidades completas
- Documentação detalhada
- Testes abrangentes

### **🚀 Próximos Passos**
- Implementar notificações push
- Adicionar integração com pagamentos
- Desenvolver app mobile
- Implementar IA para otimização de filas
- Adicionar análise preditiva

---

**📞 Para mais informações, consulte a documentação completa ou entre em contato com a equipe de desenvolvimento.** 