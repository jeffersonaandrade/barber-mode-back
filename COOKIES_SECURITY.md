# 🍪 Sistema de Cookies Seguros - Lucas Barbearia

## **Visão Geral**

O sistema implementa cookies seguros para **duas finalidades principais**:

1. **Autenticação de Funcionários** (admin, gerente, barbeiro) - **12 horas**
2. **Identificação de Clientes** na fila - **4 horas**

**⚠️ IMPORTANTE**: O sistema trabalha **exclusivamente com cookies**. Não há mais suporte para tokens via headers.

## **⏰ Tempos de Expiração**

### **👥 Funcionários (12 horas)**
- **Cookie**: `maxAge: 12 * 60 * 60 * 1000` (43.200.000 ms)
- **JWT**: `expiresIn: '12h'`
- **Motivo**: Funcionários precisam de sessões longas para trabalhar

### **👤 Clientes (4 horas)**
- **Cookie**: `maxAge: 4 * 60 * 60 * 1000` (14.400.000 ms)
- **JWT**: `expiresIn: '4h'`
- **Motivo**: Clientes geralmente não ficam mais de 4 horas na fila

## **🔐 Configurações de Segurança**

### **Cookies HttpOnly**
- `httpOnly: true` - Cookies não acessíveis via JavaScript
- Proteção contra ataques XSS

### **Cookies Secure**
- `secure: true` em produção (HTTPS obrigatório)
- `secure: false` em desenvolvimento

### **SameSite Strict**
- `sameSite: 'strict'` - Proteção contra CSRF
- Cookies só enviados em requisições do mesmo site

### **Cookies Assinados**
- `signed: true` - Cookies criptografados
- Verificação de integridade

## **👥 Cookies para Funcionários (12h)**

### **Cookies Configurados**
- `auth_token` - Token JWT do usuário
- `user_info` - Dados básicos do usuário (id, nome, role)

### **Endpoints**
- `POST /api/auth/login` - Login e configuração de cookies
- `POST /api/auth/logout` - Logout e limpeza de cookies
- `GET /api/auth/me` - Dados do usuário autenticado
- `GET /api/auth/check` - Verificar status de autenticação

### **Exemplo de Uso**
```javascript
// Login - cookies são configurados automaticamente (12h)
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
  credentials: 'include' // OBRIGATÓRIO
});

// Verificar se está logado
const checkAuth = async () => {
  const response = await fetch('/api/auth/check', {
    credentials: 'include' // OBRIGATÓRIO
  });
  const data = await response.json();
  
  if (data.authenticated) {
    setUser(data.data);
    return true;
  } else {
    redirectToLogin();
    return false;
  }
};

// Requisições autenticadas - cookies são enviados automaticamente
const authResponse = await fetch('/api/users', {
  credentials: 'include' // OBRIGATÓRIO
});
```

## **👤 Cookies para Clientes (4h)**

### **Cookies Configurados**
- `cliente_token` - Token único do cliente na fila
- `cliente_info` - Dados básicos do cliente (id, nome, posição, status)
- `cliente_qr` - QR codes para acesso rápido

### **Endpoints**
- `POST /api/fila/entrar` - Entrar na fila e configurar cookies
- `GET /api/fila/status` - Verificar status via cookies
- `POST /api/fila/sair` - Sair da fila e limpar cookies

### **Exemplo de Uso**
```javascript
// Entrar na fila - cookies são configurados automaticamente (4h)
const response = await fetch('/api/fila/entrar', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nome, telefone, barbearia_id }),
  credentials: 'include' // OBRIGATÓRIO
});

// Verificar status - cookies são enviados automaticamente
const status = await fetch('/api/fila/status', {
  credentials: 'include' // OBRIGATÓRIO
});

// Sair da fila
const sair = await fetch('/api/fila/sair', {
  method: 'POST',
  credentials: 'include' // OBRIGATÓRIO
});
```

## **🔧 Configuração de Variáveis de Ambiente**

```bash
# Configurações de JWT
JWT_SECRET=seu_jwt_secret_muito_seguro_aqui
JWT_EXPIRES_IN=12h  # Para funcionários

# Configurações de Cookies
COOKIE_SECRET=seu_cookie_secret_muito_seguro_aqui

# Configurações opcionais de expiração
FUNCIONARIO_COOKIE_EXPIRES_IN=12h  # Padrão: 12h
CLIENTE_COOKIE_EXPIRES_IN=4h       # Padrão: 4h

# Ambiente
NODE_ENV=production  # ou development
```

## **⚙️ Configuração Centralizada**

As configurações estão centralizadas em `src/config/cookies.js`:

```javascript
const COOKIE_EXPIRATION = {
  // Funcionários (admin, gerente, barbeiro) - 12 horas
  FUNCIONARIO: 12 * 60 * 60 * 1000,
  
  // Clientes na fila - 4 horas
  CLIENTE: 4 * 60 * 60 * 1000
};

const JWT_CONFIG = {
  // Funcionários - 12 horas
  FUNCIONARIO: {
    expiresIn: process.env.JWT_EXPIRES_IN || '12h'
  },
  
  // Clientes - 4 horas
  CLIENTE: {
    expiresIn: '4h'
  }
};
```

## **🛡️ Benefícios de Segurança**

### **1. Proteção XSS**
- Cookies HttpOnly não podem ser acessados por JavaScript malicioso

### **2. Proteção CSRF**
- SameSite Strict previne ataques cross-site

### **3. Criptografia**
- Cookies assinados garantem integridade

### **4. Expiração Diferenciada**
- Funcionários: 12 horas (sessões longas para trabalho)
- Clientes: 4 horas (sessões curtas para fila)
- Reduz janela de vulnerabilidade para clientes

### **5. Isolamento**
- Cookies separados para funcionários e clientes
- Diferentes níveis de acesso
- Diferentes tempos de expiração

### **6. Simplificação**
- Sem necessidade de gerenciar tokens manualmente
- Menos código no frontend
- Menos pontos de falha

## **🚀 Implementação no Frontend**

### **Configuração Global**
```javascript
// Configurar fetch global para sempre incluir credentials
const apiFetch = (url, options = {}) => {
  return fetch(url, {
    ...options,
    credentials: 'include', // SEMPRE OBRIGATÓRIO
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
};

// Configurar Axios (se usar)
import axios from 'axios';
axios.defaults.withCredentials = true;
```

### **Para Funcionários (12h)**
```javascript
// Login automático via cookies
const checkAuth = async () => {
  const response = await fetch('/api/auth/check', {
    credentials: 'include' // OBRIGATÓRIO
  });
  const data = await response.json();
  
  if (data.authenticated) {
    // Usuário está logado (sessão válida por 12h)
    setUser(data.data);
  } else {
    // Redirecionar para login
    redirectToLogin();
  }
};

// Logout
const logout = async () => {
  await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include' // OBRIGATÓRIO
  });
  // Redirecionar para login
  redirectToLogin();
};
```

### **Para Clientes (4h)**
```javascript
// Verificar status da fila via cookies
const checkFilaStatus = async () => {
  const response = await fetch('/api/fila/status', {
    credentials: 'include' // OBRIGATÓRIO
  });
  const data = await response.json();
  
  if (data.success) {
    // Cliente está na fila (sessão válida por 4h)
    setCliente(data.data);
  } else {
    // Cliente não está na fila ou sessão expirou
    redirectToFila();
  }
};

// Sair da fila
const sairFila = async () => {
  await fetch('/api/fila/sair', {
    method: 'POST',
    credentials: 'include' // OBRIGATÓRIO
  });
  // Redirecionar para entrada na fila
  redirectToFila();
};
```

## **⚠️ Mudanças Importantes**

### **❌ Removido**
- Suporte a tokens via headers Authorization
- localStorage para armazenar tokens
- Gerenciamento manual de tokens

### **✅ Obrigatório**
- `credentials: 'include'` em TODAS as requisições
- HTTPS em produção
- Configuração adequada de CORS

### **🔄 Migração Necessária**
```javascript
// ANTES (não funciona mais)
const response = await fetch('/api/users', {
  headers: {
    'Authorization': 'Bearer token_aqui'
  }
});

// DEPOIS (obrigatório)
const response = await fetch('/api/users', {
  credentials: 'include'
});
```

## **🔍 Debugging**

### **Verificar Cookies**
```javascript
// No navegador (apenas cookies não-httpOnly)
console.log(document.cookie);

// Via DevTools
// Application > Cookies > Seu domínio
```

### **Logs do Servidor**
```bash
# Verificar se cookies estão sendo configurados
npm run dev
# Observar logs de autenticação
```

## **📋 Checklist de Segurança**

- [ ] HTTPS configurado em produção
- [ ] Secrets fortes definidos
- [ ] Cookies HttpOnly habilitados
- [ ] SameSite Strict configurado
- [ ] Expiração diferenciada configurada (12h/4h)
- [ ] Logout limpa cookies
- [ ] Monitoramento implementado
- [ ] Rate limiting configurado
- [ ] Logs de segurança ativos
- [ ] Backup de secrets seguro
- [ ] `credentials: 'include'` em todas as requisições
- [ ] CORS configurado adequadamente 