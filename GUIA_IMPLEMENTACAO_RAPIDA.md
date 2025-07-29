# 🚀 GUIA RÁPIDO DE IMPLEMENTAÇÃO - SISTEMA LUCAS BARBEARIA

## 🎯 RESUMO EXECUTIVO

Este guia fornece os passos essenciais para implementar o sistema Lucas Barbearia do zero.

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### **1️⃣ CONFIGURAÇÃO INICIAL**
- [ ] Criar projeto Node.js
- [ ] Instalar dependências (Fastify, Supabase, JWT, etc.)
- [ ] Configurar variáveis de ambiente
- [ ] Configurar Supabase (banco de dados)

### **2️⃣ ESTRUTURA DO BANCO**
- [ ] Executar schema principal (users, barbearias, clientes, etc.)
- [ ] Executar schema de agendamentos
- [ ] Configurar RLS (Row Level Security)
- [ ] Inserir dados iniciais (admin, barbearia exemplo)

### **3️⃣ AUTENTICAÇÃO E SEGURANÇA**
- [ ] Implementar JWT
- [ ] Criar middlewares de autenticação
- [ ] Implementar sistema de roles (admin, gerente, barbeiro)
- [ ] Configurar validação de dados (Joi)

### **4️⃣ SERVIÇOS PRINCIPAIS**
- [ ] FilaService (gerenciamento de filas)
- [ ] UserService (gerenciamento de usuários)
- [ ] BarbeariaService (gerenciamento de barbearias)
- [ ] AuthService (autenticação)

### **5️⃣ ROTAS E ENDPOINTS**
- [ ] Rotas de autenticação (/api/auth/*)
- [ ] Rotas de fila (/api/fila/*)
- [ ] Rotas de usuários (/api/users/*)
- [ ] Rotas de barbearias (/api/barbearias/*)

### **6️⃣ FUNCIONALIDADES ESPECIAIS**
- [ ] Sistema de QR Codes
- [ ] Sistema de agendamentos
- [ ] Sistema de avaliações
- [ ] Relatórios e estatísticas

---

## 🔧 DEPENDÊNCIAS ESSENCIAIS

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

---

## 🗄️ TABELAS PRINCIPAIS DO BANCO

### **users** - Usuários do Sistema
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'gerente', 'barbeiro')),
  nome VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  active BOOLEAN DEFAULT true
);
```

### **barbearias** - Barbearias
```sql
CREATE TABLE barbearias (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  endereco TEXT NOT NULL,
  horario JSONB NOT NULL,
  servicos JSONB NOT NULL,
  ativo BOOLEAN DEFAULT true
);
```

### **clientes** - Clientes na Fila
```sql
CREATE TABLE clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  barbearia_id INTEGER REFERENCES barbearias(id),
  status VARCHAR(50) DEFAULT 'aguardando',
  posicao INTEGER NOT NULL
);
```

---

## 🔐 SISTEMA DE AUTENTICAÇÃO

### **JWT Configuration**
```javascript
// src/plugins/jwt.js
const jwt = require('@fastify/jwt');

module.exports = async function(fastify, options) {
  await fastify.register(jwt, {
    secret: process.env.JWT_SECRET,
    sign: { expiresIn: '24h' }
  });
};
```

### **Middleware de Autenticação**
```javascript
// src/middlewares/auth/authenticate.js
async function authenticate(request, reply) {
  const token = request.headers.authorization?.replace('Bearer ', '');
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await supabase.from('users').select('*').eq('id', decoded.userId).single();
  request.user = user;
}
```

---

## 🎯 SERVIÇOS PRINCIPAIS

### **FilaService** - Gerenciamento de Filas
```javascript
class FilaService {
  async adicionarClienteNaFila(clienteData) {
    // 1. Verificar barbearia ativa
    // 2. Gerar token único
    // 3. Calcular posição na fila
    // 4. Inserir cliente
    // 5. Gerar QR codes
  }

  async chamarProximoCliente(barbearia_id, barbeiro_id) {
    // 1. Buscar próximo cliente
    // 2. Atualizar status para "proximo"
    // 3. Reordenar fila
  }

  async verificarStatusCliente(token) {
    // 1. Buscar cliente pelo token
    // 2. Retornar posição e status
  }
}
```

### **UserService** - Gerenciamento de Usuários
```javascript
class UserService {
  async criarUsuario(userData) {
    // 1. Validar dados
    // 2. Hash da senha
    // 3. Inserir usuário
    // 4. Retornar dados
  }

  async listarBarbeirosAtivos(barbearia_id) {
    // 1. Buscar barbeiros ativos
    // 2. Filtrar por barbearia
    // 3. Retornar lista
  }
}
```

---

## 🛣️ ENDPOINTS PRINCIPAIS

### **Autenticação**
```
POST /api/auth/login          - Login
POST /api/auth/register       - Registro (admin)
GET  /api/auth/me             - Dados do usuário
```

### **Fila**
```
POST /api/fila/entrar                    - Entrar na fila
GET  /api/fila/:barbearia_id             - Ver fila
POST /api/fila/proximo/:barbearia_id     - Chamar próximo
POST /api/fila/finalizar                 - Finalizar atendimento
GET  /api/fila/status/:token             - Status do cliente
```

### **Usuários**
```
GET    /api/users                    - Listar usuários
POST   /api/users                    - Criar usuário
PUT    /api/users/:id                - Atualizar usuário
GET    /api/users/barbeiros/ativos   - Barbeiros ativos
```

### **Barbearias**
```
GET    /api/barbearias               - Listar barbearias
POST   /api/barbearias               - Criar barbearia
PUT    /api/barbearias/:id           - Atualizar barbearia
```

---

## 🔄 FLUXO PRINCIPAL DO SISTEMA

### **1. Cliente Entra na Fila**
```
Cliente → POST /api/fila/entrar → Sistema gera token → QR Code
```

### **2. Barbeiro Chama Próximo**
```
Barbeiro → POST /api/fila/proximo/:id → Status muda → Cliente notificado
```

### **3. Atendimento**
```
Barbeiro → POST /api/fila/iniciar/:id → Status "atendendo"
Barbeiro → POST /api/fila/finalizar → Cliente vai para histórico
```

---

## 🛡️ SEGURANÇA

### **Row Level Security (RLS)**
```sql
-- Políticas básicas
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations on barbearias" ON barbearias FOR ALL USING (true);
```

### **Validação de Dados**
```javascript
// Exemplo com Joi
const schema = Joi.object({
  nome: Joi.string().min(2).required(),
  telefone: Joi.string().pattern(/^\(\d{2}\) \d{4,5}-\d{4}$/).required(),
  barbearia_id: Joi.number().integer().positive().required()
});
```

---

## 🚀 DEPLOY

### **Vercel Configuration**
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "src/app.js",
      "use": "@vercel/node"
    }
  ]
}
```

### **Scripts de Inicialização**
```json
{
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "test": "jest"
  }
}
```

---

## 📊 FUNCIONALIDADES ESPECIAIS

### **QR Codes**
- QR Code para entrada na fila
- QR Code para consulta de status
- Geração automática com dados do cliente

### **Agendamentos**
- Sistema de agendamentos com prioridade
- Verificação de disponibilidade
- Confirmação de presença

### **Avaliações**
- Sistema de rating (1-5 estrelas)
- Comentários dos clientes
- Categorias de avaliação

### **Relatórios**
- Estatísticas de atendimento
- Performance dos barbeiros
- Exportação de dados

---

## 🔧 CONFIGURAÇÃO RÁPIDA

### **1. Instalar Dependências**
```bash
npm install fastify @fastify/cors @fastify/jwt @supabase/supabase-js bcrypt joi qrcode
```

### **2. Configurar Variáveis**
```env
SUPABASE_URL=sua_url
SUPABASE_ANON_KEY=sua_chave
JWT_SECRET=sua_chave_secreta
PORT=3000
```

### **3. Executar Schema do Banco**
```bash
# Executar database/schema.sql no Supabase
```

### **4. Iniciar Servidor**
```bash
npm run dev
```

---

## 📚 PRÓXIMOS PASSOS

1. **Implementar autenticação JWT**
2. **Criar serviços básicos**
3. **Implementar rotas principais**
4. **Adicionar validação de dados**
5. **Implementar sistema de fila**
6. **Adicionar QR codes**
7. **Implementar agendamentos**
8. **Adicionar relatórios**
9. **Configurar segurança**
10. **Deploy em produção**

---

## 🎯 CONCLUSÃO

Este guia fornece os passos essenciais para implementar o sistema Lucas Barbearia. Siga a ordem apresentada e consulte a documentação completa para detalhes específicos de cada componente.

**Tempo estimado de implementação**: 2-4 semanas
**Complexidade**: Média
**Requisitos**: Conhecimento em Node.js, PostgreSQL, JWT 