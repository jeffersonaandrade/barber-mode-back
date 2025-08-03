# 📋 DOCUMENTACAO PARA INTEGRAÇÃO FRONTEND - PARTE 2
## Gerenciamento de Barbearias e Usuários

---

## 🏪 **GERENCIAMENTO DE BARBEARIAS**

### **1. Listar Todas as Barbearias (PÚBLICO)**
```javascript
GET /api/barbearias

// Response de Sucesso (200)
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nome": "Barbearia Lucas",
      "endereco": "Rua das Flores, 123",
      "telefone": "(11) 99999-9999",
      "whatsapp": "(11) 99999-9999",
      "ativo": true,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### **2. Listar Barbearias Disponíveis (PÚBLICO)**
```javascript
GET /api/barbearias/disponiveis

// Response de Sucesso (200)
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nome": "Barbearia Lucas",
      "endereco": "Rua das Flores, 123",
      "telefone": "(11) 99999-9999",
      "whatsapp": "(11) 99999-9999",
      "barbeiros_ativos": 3,
      "tempo_estimado": 45,
      "clientes_aguardando": 3,
      "barbeiros": [
        {
          "id": "uuid-barbeiro-1",
          "nome": "João Silva",
          "especialidade": "Corte Masculino"
        },
        {
          "id": "uuid-barbeiro-2", 
          "nome": "Pedro Santos",
          "especialidade": "Barba"
        }
      ]
    }
  ]
}
```

### **3. Buscar Barbearia por ID (PÚBLICO)**
```javascript
GET /api/barbearias/{id}

// Response de Sucesso (200)
{
  "success": true,
  "data": {
    "id": 1,
    "nome": "Barbearia Lucas",
    "endereco": "Rua das Flores, 123",
    "telefone": "(11) 99999-9999",
    "whatsapp": "(11) 99999-9999",
    "ativo": true,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}

// Response de Erro (404)
{
  "success": false,
  "error": "Barbearia não encontrada"
}
```

### **4. Gerenciar Barbearias (ADMIN/GERENTE)**
```javascript
// Criar nova barbearia
POST /api/barbearias/gerenciar
Authorization: Bearer SEU_JWT_TOKEN

// Request Body
{
  "nome": "Nova Barbearia",
  "endereco": "Rua Nova, 456",
  "telefone": "(11) 88888-8888",
  "whatsapp": "(11) 88888-8888"
}

// Atualizar barbearia
PUT /api/barbearias/gerenciar/{id}
Authorization: Bearer SEU_JWT_TOKEN

// Request Body
{
  "nome": "Barbearia Atualizada",
  "endereco": "Rua Atualizada, 789",
  "telefone": "(11) 77777-7777",
  "whatsapp": "(11) 77777-7777"
}

// Ativar/Desativar barbearia
PATCH /api/barbearias/gerenciar/{id}/status
Authorization: Bearer SEU_JWT_TOKEN

// Request Body
{
  "ativo": false
}
```

---

## 👥 **GERENCIAMENTO DE USUÁRIOS**

### **1. Listar Barbeiros (Com Filtros)**
```javascript
GET /api/users/barbeiros?barbearia_id=1&status=ativo&public=false
Authorization: Bearer SEU_JWT_TOKEN

// Parâmetros de Query:
// - barbearia_id: ID da barbearia (opcional)
// - status: ativo, inativo, disponivel (padrão: ativo)
// - public: true/false (se true, não requer autenticação)

// Response de Sucesso (200)
{
  "success": true,
  "data": [
    {
      "id": "uuid-barbeiro-1",
      "nome": "João Silva",
      "email": "joao@barbearia.com",
      "especialidade": "Corte Masculino",
      "status": "ativo",
      "barbearia_id": 1,
      "barbearia_nome": "Barbearia Lucas",
      "ultimo_atendimento": "2024-01-01T10:00:00.000Z",
      "clientes_atendidos_hoje": 5
    }
  ]
}
```

### **2. Obter Status do Barbeiro Logado**
```javascript
GET /api/users/barbeiros/meu-status
Authorization: Bearer SEU_JWT_TOKEN

// Response de Sucesso (200)
{
  "success": true,
  "data": {
    "id": "uuid-barbeiro-1",
    "nome": "João Silva",
    "status": "ativo",
    "barbearia_id": 1,
    "barbearia_nome": "Barbearia Lucas",
    "especialidade": "Corte Masculino",
    "ultimo_atendimento": "2024-01-01T10:00:00.000Z",
    "clientes_atendidos_hoje": 5,
    "proximo_cliente": {
      "id": "uuid-cliente-1",
      "nome": "Cliente Teste",
      "servico": "Corte Masculino"
    }
  }
}
```

### **3. Atualizar Status do Barbeiro**
```javascript
PATCH /api/users/barbeiros/meu-status
Authorization: Bearer SEU_JWT_TOKEN

// Request Body
{
  "status": "disponivel" // ativo, inativo, disponivel, ocupado
}

// Response de Sucesso (200)
{
  "success": true,
  "message": "Status atualizado com sucesso",
  "data": {
    "status": "disponivel"
  }
}
```

### **4. Gerenciar Barbeiros (ADMIN/GERENTE)**
```javascript
// Ativar/Desativar barbeiro
PATCH /api/users/gerenciamento/barbeiros/{user_id}/status
Authorization: Bearer SEU_JWT_TOKEN

// Request Body
{
  "ativo": false
}

// Response de Sucesso (200)
{
  "success": true,
  "message": "Status do barbeiro atualizado com sucesso"
}

// Associar barbeiro à barbearia
POST /api/users/gerenciamento/barbeiros/{user_id}/barbearias
Authorization: Bearer SEU_JWT_TOKEN

// Request Body
{
  "barbearia_id": 1,
  "especialidade": "Corte Masculino"
}

// Remover barbeiro da barbearia
DELETE /api/users/gerenciamento/barbeiros/{user_id}/barbearias/{barbearia_id}
Authorization: Bearer SEU_JWT_TOKEN
```

### **5. Gerenciar Perfil do Usuário**
```javascript
// Obter perfil do usuário logado
GET /api/users/perfil
Authorization: Bearer SEU_JWT_TOKEN

// Response de Sucesso (200)
{
  "success": true,
  "data": {
    "id": "uuid-usuario-1",
    "nome": "João Silva",
    "email": "joao@barbearia.com",
    "role": "barbeiro",
    "ativo": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "barbearias": [
      {
        "id": 1,
        "nome": "Barbearia Lucas",
        "especialidade": "Corte Masculino"
      }
    ]
  }
}

// Atualizar perfil
PUT /api/users/perfil
Authorization: Bearer SEU_JWT_TOKEN

// Request Body
{
  "nome": "João Silva Atualizado",
  "email": "joao.novo@barbearia.com"
}

// Alterar senha
PATCH /api/users/perfil/senha
Authorization: Bearer SEU_JWT_TOKEN

// Request Body
{
  "senha_atual": "senha123",
  "nova_senha": "novaSenha123"
}
```

---

## 🔐 **PERMISSÕES POR ROLE**

### **Admin**
- ✅ Criar/editar/excluir barbearias
- ✅ Gerenciar todos os usuários
- ✅ Acessar todas as barbearias
- ✅ Ver relatórios globais

### **Gerente**
- ✅ Gerenciar apenas suas barbearias
- ✅ Ativar/desativar barbeiros da sua barbearia
- ✅ Ver relatórios da sua barbearia
- ❌ Não pode criar novas barbearias

### **Barbeiro**
- ✅ Ver apenas suas barbearias
- ✅ Atualizar seu próprio status
- ✅ Ver fila da sua barbearia
- ❌ Não pode gerenciar outros usuários

---

## 📊 **ESTRUTURAS DE DADOS**

### **Barbearia**
```javascript
{
  id: number,
  nome: string,
  endereco: string,
  telefone: string,
  whatsapp: string,
  ativo: boolean,
  created_at: string,
  updated_at: string
}
```

### **Barbeiro**
```javascript
{
  id: string, // UUID
  nome: string,
  email: string,
  role: "barbeiro",
  especialidade: string,
  status: "ativo" | "inativo" | "disponivel" | "ocupado",
  barbearia_id: number,
  barbearia_nome: string,
  ultimo_atendimento: string,
  clientes_atendidos_hoje: number
}
```

### **Usuário (Perfil Completo)**
```javascript
{
  id: string, // UUID
  nome: string,
  email: string,
  role: "admin" | "gerente" | "barbeiro",
  ativo: boolean,
  created_at: string,
  barbearias: [
    {
      id: number,
      nome: string,
      especialidade: string
    }
  ]
}
```

---

## 📝 **EXEMPLO DE IMPLEMENTAÇÃO FRONTEND**

### **Classe de Gerenciamento de Barbearias**
```javascript
class BarbeariaService {
  constructor() {
    this.baseURL = 'http://localhost:3000/api/barbearias';
  }

  // Listar todas as barbearias (público)
  async listarBarbearias() {
    const response = await fetch(this.baseURL);
    const data = await response.json();
    
    if (!data.success) throw new Error(data.error);
    return data.data;
  }

  // Listar barbearias disponíveis (público)
  async listarDisponiveis() {
    const response = await fetch(`${this.baseURL}/disponiveis`);
    const data = await response.json();
    
    if (!data.success) throw new Error(data.error);
    return data.data;
  }

  // Buscar barbearia por ID (público)
  async buscarPorId(id) {
    const response = await fetch(`${this.baseURL}/${id}`);
    const data = await response.json();
    
    if (!data.success) throw new Error(data.error);
    return data.data;
  }

  // Criar barbearia (admin/gerente)
  async criarBarbearia(barbeariaData) {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`${this.baseURL}/gerenciar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(barbeariaData)
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  }

  // Atualizar barbearia (admin/gerente)
  async atualizarBarbearia(id, barbeariaData) {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`${this.baseURL}/gerenciar/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(barbeariaData)
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  }
}
```

### **Classe de Gerenciamento de Usuários**
```javascript
class UserService {
  constructor() {
    this.baseURL = 'http://localhost:3000/api/users';
  }

  // Listar barbeiros
  async listarBarbeiros(filtros = {}) {
    const token = localStorage.getItem('authToken');
    const params = new URLSearchParams(filtros);
    
    const response = await fetch(`${this.baseURL}/barbeiros?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  }

  // Obter status do barbeiro logado
  async obterMeuStatus() {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`${this.baseURL}/barbeiros/meu-status`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  }

  // Atualizar status do barbeiro
  async atualizarMeuStatus(status) {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`${this.baseURL}/barbeiros/meu-status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  }

  // Obter perfil do usuário
  async obterPerfil() {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`${this.baseURL}/perfil`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  }

  // Atualizar perfil
  async atualizarPerfil(perfilData) {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`${this.baseURL}/perfil`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(perfilData)
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  }
}
```

---

**Próxima parte**: Sistema de Fila e Atendimentos 