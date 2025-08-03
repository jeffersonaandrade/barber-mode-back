# 📋 DOCUMENTACAO PARA INTEGRAÇÃO FRONTEND - PARTE 3
## Sistema de Fila e Atendimentos

---

## 🚶 **SISTEMA DE FILA**

### **1. Entrar na Fila (PÚBLICO)**
```javascript
POST /api/fila/entrar

// Request Body
{
  "nome": "João Silva",
  "telefone": "(11) 99999-9999",
  "barbearia_id": 1,
  "barbeiro_id": "uuid-barbeiro-1" // opcional
}

// Response de Sucesso (201)
{
  "success": true,
  "message": "Cliente adicionado à fila com sucesso",
  "data": {
    "id": "uuid-cliente-1",
    "nome": "João Silva",
    "telefone": "(11) 99999-9999",
    "barbearia_id": 1,
    "barbeiro_id": "uuid-barbeiro-1",
    "posicao": 3,
    "status": "aguardando",
    "token": "ABC123",
    "qr_code_fila": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "qr_code_status": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "created_at": "2024-01-01T10:00:00.000Z"
  }
}

// Response de Erro (404)
{
  "success": false,
  "error": "Barbearia não encontrada"
}

// Response de Erro (400)
{
  "success": false,
  "error": "Barbeiro especificado não está ativo nesta barbearia"
}
```

### **2. Verificar Status do Cliente (PÚBLICO)**
```javascript
GET /api/fila/status/{token}

// Response de Sucesso (200)
{
  "success": true,
  "data": {
    "id": "uuid-cliente-1",
    "nome": "João Silva",
    "telefone": "(11) 99999-9999",
    "barbearia_id": 1,
    "barbearia_nome": "Barbearia Lucas",
    "posicao": 2,
    "status": "aguardando",
    "tempo_estimado": 30,
    "created_at": "2024-01-01T10:00:00.000Z",
    "updated_at": "2024-01-01T10:00:00.000Z"
  }
}

// Response de Erro (404)
{
  "success": false,
  "error": "Cliente não encontrado"
}
```

### **3. Visualizar Fila (BARBEIRO/GERENTE)**
```javascript
GET /api/fila/{barbearia_id}
Authorization: Bearer SEU_JWT_TOKEN

// Response de Sucesso (200)
{
  "success": true,
  "data": {
    "clientes": [
      {
        "id": "uuid-cliente-1",
        "nome": "João Silva",
        "telefone": "(11) 99999-9999",
        "posicao": 1,
        "status": "proximo",
        "barbeiro_id": "uuid-barbeiro-1",
        "barbeiro_nome": "Pedro Santos",
        "created_at": "2024-01-01T10:00:00.000Z"
      },
      {
        "id": "uuid-cliente-2",
        "nome": "Maria Santos",
        "telefone": "(11) 88888-8888",
        "posicao": 2,
        "status": "aguardando",
        "barbeiro_id": null,
        "barbeiro_nome": null,
        "created_at": "2024-01-01T10:15:00.000Z"
      }
    ],
    "estatisticas": {
      "total_clientes": 5,
      "aguardando": 3,
      "proximo": 1,
      "atendendo": 1,
      "finalizados_hoje": 8,
      "tempo_medio_atendimento": 25
    }
  }
}
```

### **4. Visualizar Fila Gerente (DADOS COMPLETOS)**
```javascript
GET /api/fila-gerente/{barbearia_id}
Authorization: Bearer SEU_JWT_TOKEN

// Response de Sucesso (200)
{
  "success": true,
  "data": {
    "clientes": [
      {
        "id": "uuid-cliente-1",
        "nome": "João Silva",
        "telefone": "(11) 99999-9999",
        "posicao": 1,
        "status": "proximo",
        "barbeiro_id": "uuid-barbeiro-1",
        "barbeiro_nome": "Pedro Santos",
        "servico": "Corte Masculino",
        "observacoes": "Corte na altura do pescoço",
        "created_at": "2024-01-01T10:00:00.000Z",
        "updated_at": "2024-01-01T10:30:00.000Z"
      }
    ],
    "estatisticas": {
      "total_clientes": 5,
      "aguardando": 3,
      "proximo": 1,
      "atendendo": 1,
      "finalizados_hoje": 8,
      "tempo_medio_atendimento": 25,
      "barbeiros_ativos": 3,
      "tempo_estimado_proximo": 15
    }
  }
}
```

---

## 🎯 **GERENCIAMENTO DE ATENDIMENTOS**

### **1. Chamar Próximo Cliente**
```javascript
POST /api/fila/proximo/{barbearia_id}
Authorization: Bearer SEU_JWT_TOKEN

// Request Body (opcional)
{
  "barbeiro_id": "uuid-barbeiro-1" // apenas para gerentes
}

// Response de Sucesso (200)
{
  "success": true,
  "message": "Próximo cliente chamado com sucesso",
  "data": {
    "cliente": {
      "id": "uuid-cliente-1",
      "nome": "João Silva",
      "telefone": "(11) 99999-9999",
      "posicao": 1,
      "status": "proximo",
      "barbeiro_id": "uuid-barbeiro-1",
      "barbeiro_nome": "Pedro Santos"
    },
    "posicao_anterior": 2,
    "posicao_atual": 1
  }
}

// Response de Erro (404)
{
  "success": false,
  "error": "Não há clientes aguardando na fila"
}
```

### **2. Iniciar Atendimento**
```javascript
POST /api/fila/iniciar/{barbearia_id}
Authorization: Bearer SEU_JWT_TOKEN

// Request Body
{
  "cliente_id": "uuid-cliente-1",
  "barbeiro_id": "uuid-barbeiro-1"
}

// Response de Sucesso (200)
{
  "success": true,
  "message": "Atendimento iniciado com sucesso",
  "data": {
    "cliente": {
      "id": "uuid-cliente-1",
      "nome": "João Silva",
      "status": "atendendo",
      "inicio_atendimento": "2024-01-01T10:30:00.000Z"
    }
  }
}
```

### **3. Finalizar Atendimento**
```javascript
POST /api/fila/finalizar/{barbearia_id}
Authorization: Bearer SEU_JWT_TOKEN

// Request Body
{
  "cliente_id": "uuid-cliente-1",
  "barbeiro_id": "uuid-barbeiro-1",
  "servico_realizado": "Corte Masculino",
  "observacoes": "Cliente satisfeito com o serviço"
}

// Response de Sucesso (200)
{
  "success": true,
  "message": "Atendimento finalizado com sucesso",
  "data": {
    "cliente": {
      "id": "uuid-cliente-1",
      "nome": "João Silva",
      "status": "finalizado",
      "fim_atendimento": "2024-01-01T11:00:00.000Z",
      "duracao_atendimento": 30
    },
    "historico": {
      "id": "uuid-historico-1",
      "cliente_id": "uuid-cliente-1",
      "barbeiro_id": "uuid-barbeiro-1",
      "barbearia_id": 1,
      "servico_realizado": "Corte Masculino",
      "observacoes": "Cliente satisfeito com o serviço",
      "inicio_atendimento": "2024-01-01T10:30:00.000Z",
      "fim_atendimento": "2024-01-01T11:00:00.000Z"
    }
  }
}
```

### **4. Remover Cliente da Fila**
```javascript
DELETE /api/fila/remover/{barbearia_id}/{cliente_id}
Authorization: Bearer SEU_JWT_TOKEN

// Response de Sucesso (200)
{
  "success": true,
  "message": "Cliente removido da fila com sucesso",
  "data": {
    "cliente_removido": {
      "id": "uuid-cliente-1",
      "nome": "João Silva",
      "status": "removido"
    }
  }
}
```

### **5. Reordenar Fila**
```javascript
PUT /api/fila/reordenar/{barbearia_id}
Authorization: Bearer SEU_JWT_TOKEN

// Request Body
{
  "reordenacao": [
    {
      "cliente_id": "uuid-cliente-1",
      "nova_posicao": 1
    },
    {
      "cliente_id": "uuid-cliente-2", 
      "nova_posicao": 2
    }
  ]
}

// Response de Sucesso (200)
{
  "success": true,
  "message": "Fila reordenada com sucesso",
  "data": {
    "fila_atualizada": [
      {
        "id": "uuid-cliente-1",
        "nome": "João Silva",
        "posicao": 1
      },
      {
        "id": "uuid-cliente-2",
        "nome": "Maria Santos", 
        "posicao": 2
      }
    ]
  }
}
```

---

## 📊 **ESTATÍSTICAS DA FILA**

### **1. Estatísticas Gerais**
```javascript
GET /api/fila/estatisticas/{barbearia_id}
Authorization: Bearer SEU_JWT_TOKEN

// Response de Sucesso (200)
{
  "success": true,
  "data": {
    "estatisticas_gerais": {
      "total_clientes_hoje": 15,
      "clientes_atendidos": 12,
      "clientes_aguardando": 3,
      "tempo_medio_atendimento": 25,
      "tempo_medio_espera": 45,
      "barbeiros_ativos": 3
    },
    "estatisticas_por_status": {
      "aguardando": 3,
      "proximo": 1,
      "atendendo": 2,
      "finalizado": 12,
      "removido": 1
    },
    "estatisticas_por_barbeiro": [
      {
        "barbeiro_id": "uuid-barbeiro-1",
        "barbeiro_nome": "João Silva",
        "clientes_atendidos": 5,
        "tempo_medio": 28,
        "status": "ativo"
      }
    ]
  }
}
```

### **2. Estatísticas Detalhadas**
```javascript
GET /api/fila/estatisticas-detalhadas/{barbearia_id}
Authorization: Bearer SEU_JWT_TOKEN

// Query Parameters
?data_inicio=2024-01-01&data_fim=2024-01-31&barbeiro_id=uuid-barbeiro-1

// Response de Sucesso (200)
{
  "success": true,
  "data": {
    "periodo": {
      "data_inicio": "2024-01-01",
      "data_fim": "2024-01-31"
    },
    "metricas": {
      "total_atendimentos": 150,
      "tempo_medio_atendimento": 25.5,
      "tempo_medio_espera": 42.3,
      "satisfacao_media": 4.8,
      "taxa_abandono": 0.05
    },
    "evolucao_diaria": [
      {
        "data": "2024-01-01",
        "atendimentos": 8,
        "tempo_medio": 26,
        "satisfacao": 4.9
      }
    ],
    "top_servicos": [
      {
        "servico": "Corte Masculino",
        "quantidade": 45,
        "percentual": 30
      }
    ]
  }
}
```

---

## 🔄 **STATUS DOS CLIENTES**

### **Estados Possíveis:**
- **`aguardando`**: Cliente na fila, aguardando ser chamado
- **`proximo`**: Cliente foi chamado, próximo a ser atendido
- **`atendendo`**: Cliente está sendo atendido
- **`finalizado`**: Atendimento concluído
- **`removido`**: Cliente foi removido da fila

### **Fluxo de Status:**
```
aguardando → proximo → atendendo → finalizado
     ↓           ↓         ↓
  removido    removido   removido
```

---

## 📱 **QR CODES**

### **Tipos de QR Code Gerados:**
1. **QR Code da Fila**: Para o cliente acompanhar sua posição
2. **QR Code de Status**: Para verificar status em tempo real

### **Estrutura dos QR Codes:**
```javascript
// QR Code da Fila
{
  "tipo": "fila",
  "token": "ABC123",
  "barbearia_id": 1,
  "url_status": "https://api.com/fila/status/ABC123"
}

// QR Code de Status
{
  "tipo": "status",
  "token": "ABC123",
  "url_status": "https://api.com/fila/status/ABC123"
}
```

---

## 📝 **EXEMPLO DE IMPLEMENTAÇÃO FRONTEND**

### **Classe de Gerenciamento de Fila**
```javascript
class FilaService {
  constructor() {
    this.baseURL = 'http://localhost:3000/api/fila';
  }

  // Entrar na fila (público)
  async entrarNaFila(dadosCliente) {
    const response = await fetch(`${this.baseURL}/entrar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dadosCliente)
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  }

  // Verificar status do cliente (público)
  async verificarStatus(token) {
    const response = await fetch(`${this.baseURL}/status/${token}`);
    const data = await response.json();
    
    if (!data.success) throw new Error(data.error);
    return data.data;
  }

  // Visualizar fila (barbeiro/gerente)
  async visualizarFila(barbeariaId) {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`${this.baseURL}/${barbeariaId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  }

  // Chamar próximo cliente
  async chamarProximo(barbeariaId, barbeiroId = null) {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`${this.baseURL}/proximo/${barbeariaId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ barbeiro_id: barbeiroId })
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  }

  // Iniciar atendimento
  async iniciarAtendimento(barbeariaId, clienteId, barbeiroId) {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`${this.baseURL}/iniciar/${barbeariaId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        cliente_id: clienteId,
        barbeiro_id: barbeiroId
      })
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  }

  // Finalizar atendimento
  async finalizarAtendimento(barbeariaId, dadosAtendimento) {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`${this.baseURL}/finalizar/${barbeariaId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(dadosAtendimento)
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  }

  // Remover cliente da fila
  async removerCliente(barbeariaId, clienteId) {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`${this.baseURL}/remover/${barbeariaId}/${clienteId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  }

  // Obter estatísticas
  async obterEstatisticas(barbeariaId, filtros = {}) {
    const token = localStorage.getItem('authToken');
    const params = new URLSearchParams(filtros);
    
    const response = await fetch(`${this.baseURL}/estatisticas/${barbeariaId}?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  }
}
```

### **Exemplo de Uso - Tela de Fila**
```javascript
class FilaScreen {
  constructor() {
    this.filaService = new FilaService();
    this.barbeariaId = 1;
    this.intervalId = null;
  }

  // Inicializar tela de fila
  async init() {
    await this.carregarFila();
    this.iniciarAtualizacaoAutomatica();
  }

  // Carregar dados da fila
  async carregarFila() {
    try {
      const dados = await this.filaService.visualizarFila(this.barbeariaId);
      this.renderizarFila(dados);
    } catch (error) {
      console.error('Erro ao carregar fila:', error);
    }
  }

  // Renderizar fila na tela
  renderizarFila(dados) {
    const { clientes, estatisticas } = dados;
    
    // Renderizar lista de clientes
    this.renderizarClientes(clientes);
    
    // Renderizar estatísticas
    this.renderizarEstatisticas(estatisticas);
  }

  // Chamar próximo cliente
  async chamarProximo() {
    try {
      const resultado = await this.filaService.chamarProximo(this.barbeariaId);
      this.mostrarNotificacao(`Próximo: ${resultado.cliente.nome}`);
      await this.carregarFila(); // Recarregar fila
    } catch (error) {
      console.error('Erro ao chamar próximo:', error);
    }
  }

  // Iniciar atualização automática
  iniciarAtualizacaoAutomatica() {
    this.intervalId = setInterval(() => {
      this.carregarFila();
    }, 30000); // Atualizar a cada 30 segundos
  }

  // Parar atualização automática
  pararAtualizacaoAutomatica() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
```

---

**Próxima parte**: Sistema de Avaliações e Relatórios 