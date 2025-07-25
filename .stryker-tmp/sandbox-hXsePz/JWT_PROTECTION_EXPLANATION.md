# 🔐 Como Funciona a Proteção JWT no Sistema

## 📋 **Visão Geral**

Sim, existe um processo centralizado de proteção JWT! O sistema usa uma arquitetura em camadas para proteger os endpoints:

1. **Plugin JWT** - Configuração e funções base
2. **Decorators** - Funções de autenticação e autorização
3. **Middlewares** - Verificações específicas de negócio
4. **PreValidation** - Aplicação nas rotas

## 🏗️ **Arquitetura da Proteção**

### **1. Plugin JWT (`src/plugins/jwt.js`)**
```javascript
// Configuração do JWT
await fastify.register(require('@fastify/jwt'), {
  secret: process.env.JWT_SECRET,
  sign: {
    expiresIn: '24h'
  }
});

// Decorator para autenticação básica
fastify.decorate('authenticate', async function(request, reply) {
  try {
    await request.jwtVerify(); // Verifica se o token é válido
  } catch (err) {
    return reply.status(401).send({
      success: false,
      error: 'Token inválido ou expirado'
    });
  }
});

// Decorator para autorização por roles
fastify.decorate('authorize', function(roles = []) {
  return async function(request, reply) {
    try {
      await request.jwtVerify();
      
      // Verifica se o usuário tem a role necessária
      if (roles.length > 0 && !roles.includes(request.user.role)) {
        return reply.status(403).send({
          success: false,
          error: 'Acesso negado'
        });
      }
    } catch (err) {
      return reply.status(401).send({
        success: false,
        error: 'Token inválido ou expirado'
      });
    }
  };
});
```

### **2. Middlewares Específicos (`src/middlewares/auth.js`)**
```javascript
// Verifica se o usuário tem acesso à barbearia específica
async function checkBarbeariaAccess(request, reply) {
  const { barbeariaId } = request.params;
  const userId = request.user.id;
  const userRole = request.user.role;

  // Admin pode acessar qualquer barbearia
  if (userRole === 'admin') {
    return;
  }

  // Verifica se o barbeiro está vinculado à barbearia
  const { data: barbeiroBarbearia } = await supabase
    .from('barbeiros_barbearias')
    .select('*')
    .eq('user_id', userId)
    .eq('barbearia_id', barbeariaId)
    .eq('ativo', true)
    .single();

  if (!barbeiroBarbearia) {
    return reply.status(403).send({
      error: 'Acesso negado',
      message: 'Você não tem acesso a esta barbearia'
    });
  }
}
```

## 🔄 **Fluxo de Proteção**

### **1. Requisição Chega**
```
POST /api/fila/proximo
Headers: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **2. PreValidation é Executado**
```javascript
preValidation: [
  fastify.authenticate,           // 1. Verifica se o token é válido
  fastify.authorize(['admin', 'gerente', 'barbeiro']), // 2. Verifica se tem role adequada
  checkBarbeariaAccess,           // 3. Verifica acesso à barbearia
  checkBarbeiroAtivo             // 4. Verifica se barbeiro está ativo
]
```

### **3. Processo de Verificação**

#### **Passo 1: Autenticação (authenticate)**
- ✅ Extrai o token do header `Authorization`
- ✅ Verifica se o token é válido (assinatura, expiração)
- ✅ Decodifica o payload e adiciona `request.user`
- ❌ Se inválido: Retorna 401

#### **Passo 2: Autorização (authorize)**
- ✅ Verifica se `request.user.role` está na lista permitida
- ❌ Se não autorizado: Retorna 403

#### **Passo 3: Verificações Específicas (middlewares)**
- ✅ Verifica acesso à barbearia específica
- ✅ Verifica se barbeiro está ativo
- ❌ Se não permitido: Retorna 403

#### **Passo 4: Handler da Rota**
- ✅ Se passou por todas as verificações, executa a lógica da rota

## 🎯 **Exemplos de Proteção por Endpoint**

### **Endpoint Público (Sem Proteção)**
```javascript
// Qualquer um pode acessar
fastify.post('/api/auth/login', async (request, reply) => {
  // Lógica de login
});
```

### **Endpoint com Autenticação Básica**
```javascript
// Precisa estar logado
fastify.get('/api/auth/me', {
  preValidation: [fastify.authenticate]
}, async (request, reply) => {
  // Retorna dados do usuário logado
});
```

### **Endpoint com Role Específica**
```javascript
// Precisa ser admin
fastify.post('/api/barbearias', {
  preValidation: [fastify.authenticate, fastify.authorize(['admin'])]
}, async (request, reply) => {
  // Cria nova barbearia
});
```

### **Endpoint com Verificações Complexas**
```javascript
// Precisa ser barbeiro ativo na barbearia
fastify.post('/api/fila/proximo', {
  preValidation: [
    fastify.authenticate, 
    fastify.authorize(['admin', 'gerente', 'barbeiro']), 
    checkBarbeariaAccess, 
    checkBarbeiroAtivo
  ]
}, async (request, reply) => {
  // Chama próximo cliente
});
```

## 🔑 **Tipos de Proteção**

### **1. Autenticação (authenticate)**
- **O que faz:** Verifica se o usuário está logado
- **Quando usar:** Endpoints que precisam de usuário autenticado
- **Exemplo:** `/api/auth/me`, `/api/auth/logout`

### **2. Autorização por Role (authorize)**
- **O que faz:** Verifica se o usuário tem a role necessária
- **Roles disponíveis:** `admin`, `gerente`, `barbeiro`
- **Exemplo:** 
  - `authorize(['admin'])` - Apenas admin
  - `authorize(['admin', 'gerente'])` - Admin ou gerente
  - `authorize(['admin', 'gerente', 'barbeiro'])` - Qualquer role

### **3. Verificações Específicas (middlewares)**
- **O que faz:** Verificações de negócio específicas
- **Exemplos:**
  - `checkBarbeariaAccess` - Verifica acesso à barbearia
  - `checkBarbeiroAtivo` - Verifica se barbeiro está ativo

## 🚨 **Códigos de Resposta**

### **401 - Não Autorizado**
```json
{
  "success": false,
  "error": "Token inválido ou expirado"
}
```

### **403 - Acesso Negado**
```json
{
  "success": false,
  "error": "Acesso negado",
  "message": "Você não tem permissão para acessar este recurso"
}
```

## 📊 **Hierarquia de Roles**

```
admin (Acesso total)
├── gerente (Gerencia barbearias)
└── barbeiro (Acesso limitado ao trabalho)
```

## 🔧 **Como Adicionar Proteção a Novos Endpoints**

### **1. Endpoint Público**
```javascript
fastify.get('/api/public/info', async (request, reply) => {
  // Sem proteção
});
```

### **2. Endpoint Autenticado**
```javascript
fastify.get('/api/private/data', {
  preValidation: [fastify.authenticate]
}, async (request, reply) => {
  // Precisa estar logado
});
```

### **3. Endpoint com Role Específica**
```javascript
fastify.post('/api/admin/users', {
  preValidation: [fastify.authenticate, fastify.authorize(['admin'])]
}, async (request, reply) => {
  // Precisa ser admin
});
```

### **4. Endpoint com Verificações Customizadas**
```javascript
fastify.put('/api/barbearias/:id/config', {
  preValidation: [
    fastify.authenticate, 
    fastify.authorize(['admin', 'gerente']),
    checkBarbeariaAccess
  ]
}, async (request, reply) => {
  // Precisa ser admin/gerente com acesso à barbearia
});
```

## ✅ **Resumo**

**Sim, existe um processo centralizado!** O sistema usa:

1. **Plugin JWT** - Configuração base
2. **Decorators** - `authenticate` e `authorize`
3. **Middlewares** - Verificações específicas
4. **PreValidation** - Aplicação nas rotas

Cada endpoint pode ter diferentes níveis de proteção, desde público até verificações complexas de negócio. O sistema é flexível e permite combinar diferentes tipos de proteção conforme necessário! 🚀 