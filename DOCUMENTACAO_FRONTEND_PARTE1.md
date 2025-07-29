# 📋 DOCUMENTAÇÃO PARA INTEGRAÇÃO FRONTEND - PARTE 1
## Estrutura Geral e Autenticação

---

## 🏗️ **ESTRUTURA GERAL DA API**

### **Base URL**
```
http://localhost:3000 (desenvolvimento)
https://seu-dominio.vercel.app (produção)
```

### **Configuração CORS**
A API está configurada para aceitar requisições dos seguintes domínios:
- `http://localhost:3000`
- `http://localhost:3001` 
- `http://localhost:5173`
- `http://localhost:5174`
- Domínios configurados em `CORS_ORIGIN` (variável de ambiente)

### **Headers Necessários**
```javascript
// Para todas as requisições autenticadas
headers: {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer SEU_JWT_TOKEN'
}
```

---

## 🔐 **SISTEMA DE AUTENTICAÇÃO**

### **1. Login de Usuário**
```javascript
POST /api/auth/login

// Request Body
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}

// Response de Sucesso (200)
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "user": {
      "id": "uuid-do-usuario",
      "email": "usuario@exemplo.com",
      "nome": "Nome do Usuário",
      "role": "admin|gerente|barbeiro",
      "ativo": true,
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt-token-aqui"
  }
}

// Response de Erro (401)
{
  "success": false,
  "message": "Credenciais inválidas"
}
```

### **2. Obter Dados do Usuário Logado**
```javascript
GET /api/auth/me

// Headers necessários
Authorization: Bearer SEU_JWT_TOKEN

// Response de Sucesso (200)
{
  "success": true,
  "data": {
    "id": "uuid-do-usuario",
    "email": "usuario@exemplo.com",
    "nome": "Nome do Usuário",
    "role": "admin|gerente|barbeiro",
    "ativo": true,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### **3. Logout**
```javascript
POST /api/auth/logout

// Headers necessários
Authorization: Bearer SEU_JWT_TOKEN

// Response de Sucesso (200)
{
  "success": true,
  "message": "Logout realizado com sucesso"
}
```

### **4. Registro de Usuário (Apenas Admin)**
```javascript
POST /api/auth/register

// Headers necessários
Authorization: Bearer SEU_JWT_TOKEN_ADMIN

// Request Body
{
  "email": "novo@usuario.com",
  "password": "senha123",
  "nome": "Nome do Novo Usuário",
  "role": "gerente|barbeiro"
}

// Response de Sucesso (201)
{
  "success": true,
  "message": "Usuário criado com sucesso",
  "data": {
    "id": "uuid-do-novo-usuario",
    "email": "novo@usuario.com",
    "nome": "Nome do Novo Usuário",
    "role": "gerente",
    "ativo": true,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 👥 **TIPOS DE USUÁRIO (ROLES)**

### **1. Admin**
- **Acesso**: Total ao sistema
- **Pode**: Criar usuários, gerenciar todas as barbearias, acessar relatórios globais
- **Endpoints**: Todos disponíveis

### **2. Gerente**
- **Acesso**: Apenas à(s) barbearia(s) associada(s)
- **Pode**: Gerenciar barbeiros, fila, configurações da sua barbearia
- **Endpoints**: Limitados à sua barbearia

### **3. Barbeiro**
- **Acesso**: Apenas à(s) barbearia(s) onde trabalha
- **Pode**: Ver fila, chamar próximo cliente, finalizar atendimentos
- **Endpoints**: Limitados às operações de atendimento

---

## 🛡️ **GERENCIAMENTO DE TOKENS**

### **Armazenamento Seguro**
```javascript
// Recomendado: Armazenar em localStorage ou sessionStorage
localStorage.setItem('authToken', token);
localStorage.setItem('userData', JSON.stringify(userData));

// Recuperar token
const token = localStorage.getItem('authToken');
const userData = JSON.parse(localStorage.getItem('userData'));
```

### **Interceptor para Requisições**
```javascript
// Axios interceptor exemplo
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para respostas (tratar token expirado)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado - redirecionar para login
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 📊 **RESPOSTAS PADRÃO DA API**

### **Estrutura de Sucesso**
```javascript
{
  "success": true,
  "message": "Operação realizada com sucesso",
  "data": { /* dados da resposta */ }
}
```

### **Estrutura de Erro**
```javascript
{
  "success": false,
  "message": "Descrição do erro",
  "error": "Código do erro (opcional)"
}
```

### **Códigos de Status HTTP**
- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Dados inválidos
- `401` - Não autorizado (token inválido/expirado)
- `403` - Acesso negado (sem permissão)
- `404` - Recurso não encontrado
- `500` - Erro interno do servidor

---

## 🔍 **HEALTH CHECK**

### **Verificar Status da API**
```javascript
GET /health

// Response
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### **Informações da API**
```javascript
GET /

// Response
{
  "message": "Lucas Barbearia API",
  "version": "1.0.0"
}
```

---

## 📝 **EXEMPLO DE IMPLEMENTAÇÃO FRONTEND**

### **Classe de Autenticação**
```javascript
class AuthService {
  constructor() {
    this.baseURL = 'http://localhost:3000/api';
  }

  async login(email, password) {
    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('authToken', data.data.token);
        localStorage.setItem('userData', JSON.stringify(data.data.user));
        return data.data;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      throw error;
    }
  }

  async getMe() {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Token não encontrado');

    const response = await fetch(`${this.baseURL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    
    return data.data;
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  }

  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }
}
```

---

**Próxima parte**: Gerenciamento de Barbearias e Usuários 