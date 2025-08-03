# 🔄 Guia de Migração para Cookies - Frontend

## **⚠️ IMPORTANTE**

O backend agora trabalha **exclusivamente com cookies**. Todas as requisições devem incluir `credentials: 'include'`.

## **🚀 Migração Rápida**

### **1. Configuração Global**

```javascript
// config/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Função fetch global que sempre inclui credentials
export const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    ...options,
    credentials: 'include', // SEMPRE OBRIGATÓRIO
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Para Axios (se usar)
import axios from 'axios';

axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true; // SEMPRE OBRIGATÓRIO
```

### **2. Remover Código Antigo**

```javascript
// ❌ REMOVER - Não funciona mais
localStorage.setItem('token', token);
localStorage.removeItem('token');
const token = localStorage.getItem('token');

// ❌ REMOVER - Não funciona mais
headers: {
  'Authorization': `Bearer ${token}`
}
```

### **3. Atualizar Autenticação**

```javascript
// hooks/useAuth.js
import { useState, useEffect } from 'react';
import { apiFetch } from '../config/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const data = await apiFetch('/api/auth/check');
      
      if (data.authenticated) {
        setUser(data.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const data = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      
      if (data.success) {
        setUser(data.data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Erro no login' };
    }
  };

  const logout = async () => {
    try {
      await apiFetch('/api/auth/logout', {
        method: 'POST'
      });
      setUser(null);
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return { user, loading, login, logout, checkAuth };
};
```

### **4. Atualizar Componentes de Login**

```javascript
// components/Login.js
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await login(email, password);
    
    if (result.success) {
      // Redirecionar para dashboard
      window.location.href = '/dashboard';
    } else {
      setError(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Senha"
        required
      />
      {error && <p className="error">{error}</p>}
      <button type="submit">Entrar</button>
    </form>
  );
};
```

### **5. Atualizar Componentes de Fila**

```javascript
// hooks/useFila.js
import { useState, useEffect } from 'react';
import { apiFetch } from '../config/api';

export const useFila = () => {
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkStatus = async () => {
    try {
      const data = await apiFetch('/api/fila/status');
      
      if (data.success) {
        setCliente(data.data);
      } else {
        setCliente(null);
      }
    } catch (error) {
      setCliente(null);
    } finally {
      setLoading(false);
    }
  };

  const entrarFila = async (dados) => {
    try {
      const data = await apiFetch('/api/fila/entrar', {
        method: 'POST',
        body: JSON.stringify(dados)
      });
      
      if (data.success) {
        setCliente(data.data.cliente);
        return { success: true, data: data.data };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Erro ao entrar na fila' };
    }
  };

  const sairFila = async () => {
    try {
      await apiFetch('/api/fila/sair', {
        method: 'POST'
      });
      setCliente(null);
    } catch (error) {
      console.error('Erro ao sair da fila:', error);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return { cliente, loading, checkStatus, entrarFila, sairFila };
};
```

### **6. Atualizar Componentes de Fila**

```javascript
// components/FilaStatus.js
import { useFila } from '../hooks/useFila';

export const FilaStatus = () => {
  const { cliente, loading, checkStatus, sairFila } = useFila();

  useEffect(() => {
    // Verificar status a cada 30 segundos
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, [checkStatus]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!cliente) {
    return (
      <div>
        <p>Você não está na fila</p>
        <button onClick={() => window.location.href = '/fila/entrar'}>
          Entrar na Fila
        </button>
      </div>
    );
  }

  return (
    <div>
      <h3>Olá, {cliente.nome}!</h3>
      <p>Posição na fila: {cliente.posicao}</p>
      <p>Status: {cliente.status}</p>
      <button onClick={sairFila}>Sair da Fila</button>
    </div>
  );
};
```

## **🔧 Configurações Adicionais**

### **CORS (se necessário)**

Se o frontend estiver em um domínio diferente, configure o CORS no backend:

```javascript
// No backend
await fastify.register(require('@fastify/cors'), {
  origin: ['http://localhost:3000', 'https://seu-dominio.com'],
  credentials: true // IMPORTANTE para cookies
});
```

### **HTTPS em Produção**

```javascript
// Em produção, certifique-se de que o backend está em HTTPS
// Os cookies secure só funcionam com HTTPS
```

## **🧪 Testando a Migração**

### **1. Teste de Login**
```javascript
// Teste se o login funciona
const testLogin = async () => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@lucasbarbearia.com',
        password: 'admin123'
      }),
      credentials: 'include'
    });
    
    const data = await response.json();
    console.log('Login:', data);
  } catch (error) {
    console.error('Erro no login:', error);
  }
};
```

### **2. Teste de Autenticação**
```javascript
// Teste se a autenticação funciona
const testAuth = async () => {
  try {
    const response = await fetch('/api/auth/check', {
      credentials: 'include'
    });
    
    const data = await response.json();
    console.log('Auth check:', data);
  } catch (error) {
    console.error('Erro na verificação:', error);
  }
};
```

### **3. Verificar Cookies**
```javascript
// No console do navegador
console.log('Cookies:', document.cookie);

// Via DevTools: Application > Cookies
```

## **❌ Problemas Comuns**

### **1. CORS Error**
```
Access to fetch at 'http://localhost:3000/api/auth/login' from origin 'http://localhost:3001' has been blocked by CORS policy
```
**Solução**: Configure CORS no backend com `credentials: true`

### **2. Cookies não sendo enviados**
```
Token de autenticação não encontrado
```
**Solução**: Adicione `credentials: 'include'` em todas as requisições

### **3. HTTPS Required**
```
Cookie 'auth_token' was rejected because it has the 'secure' attribute but the request was not made over HTTPS
```
**Solução**: Use HTTPS em produção ou configure `secure: false` em desenvolvimento

## **✅ Checklist de Migração**

- [ ] Remover todo código de localStorage
- [ ] Remover headers Authorization
- [ ] Adicionar `credentials: 'include'` em todas as requisições
- [ ] Configurar função fetch global
- [ ] Atualizar hooks de autenticação
- [ ] Atualizar componentes de login
- [ ] Atualizar componentes de fila
- [ ] Configurar CORS adequadamente
- [ ] Testar login/logout
- [ ] Testar fila
- [ ] Verificar cookies no DevTools
- [ ] Testar em produção com HTTPS 