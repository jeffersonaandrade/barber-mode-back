# 📋 DOCUMENTACAO PARA INTEGRAÇÃO FRONTEND - PARTE 4
## Sistema de Avaliações, Relatórios e Configurações

---

## ⭐ **SISTEMA DE AVALIAÇÕES**

### **1. Enviar Avaliação (PÚBLICO)**
```javascript
POST /api/avaliacoes

// Request Body
{
  "cliente_id": "uuid-cliente-1",
  "barbearia_id": 1,
  "barbeiro_id": "uuid-barbeiro-1", // opcional
  "rating": 5,
  "categoria": "atendimento", // atendimento, qualidade, ambiente, tempo, preco
  "comentario": "Excelente atendimento, muito profissional!"
}

// Response de Sucesso (201)
{
  "success": true,
  "message": "Avaliação enviada com sucesso",
  "data": {
    "id": "uuid-avaliacao-1",
    "cliente_id": "uuid-cliente-1",
    "barbearia_id": 1,
    "barbeiro_id": "uuid-barbeiro-1",
    "rating": 5,
    "categoria": "atendimento",
    "comentario": "Excelente atendimento, muito profissional!",
    "created_at": "2024-01-01T12:00:00.000Z"
  }
}

// Response de Erro (404)
{
  "success": false,
  "error": "Cliente não encontrado"
}
```

### **2. Listar Avaliações (ADMIN/GERENTE)**
```javascript
GET /api/avaliacoes?barbearia_id=1&barbeiro_id=uuid-barbeiro-1&categoria=atendimento
Authorization: Bearer SEU_JWT_TOKEN

// Query Parameters:
// - barbearia_id: ID da barbearia (opcional)
// - barbeiro_id: ID do barbeiro (opcional)
// - categoria: categoria da avaliação (opcional)
// - rating_min: rating mínimo (opcional)
// - data_inicio: data início (opcional)
// - data_fim: data fim (opcional)

// Response de Sucesso (200)
{
  "success": true,
  "data": [
    {
      "id": "uuid-avaliacao-1",
      "cliente_id": "uuid-cliente-1",
      "cliente_nome": "João Silva",
      "barbearia_id": 1,
      "barbearia_nome": "Barbearia Lucas",
      "barbeiro_id": "uuid-barbeiro-1",
      "barbeiro_nome": "Pedro Santos",
      "rating": 5,
      "categoria": "atendimento",
      "comentario": "Excelente atendimento!",
      "created_at": "2024-01-01T12:00:00.000Z"
    }
  ],
  "estatisticas": {
    "total_avaliacoes": 25,
    "media_geral": 4.6,
    "distribuicao_ratings": {
      "5": 15,
      "4": 7,
      "3": 2,
      "2": 1,
      "1": 0
    }
  }
}
```

---

## 📊 **SISTEMA DE RELATÓRIOS**

### **1. Dashboard de Relatórios (ADMIN/GERENTE)**
```javascript
GET /api/relatorios/dashboard?barbearia_id=1&periodo=mes&data_inicio=2024-01-01&data_fim=2024-01-31
Authorization: Bearer SEU_JWT_TOKEN

// Query Parameters:
// - barbearia_id: ID da barbearia (opcional)
// - periodo: semana, mes, ano (padrão: mes)
// - data_inicio: data início (YYYY-MM-DD)
// - data_fim: data fim (YYYY-MM-DD)

// Response de Sucesso (200)
{
  "success": true,
  "data": {
    "total_atendimentos": 150,
    "tempo_medio_atendimento": 25.5,
    "faturamento_total": 3750.00,
    "satisfacao_geral": 4.8,
    "comparacao": {
      "atendimentos": {
        "atual": 150,
        "anterior": 140,
        "crescimento": 7.14
      },
      "faturamento": {
        "atual": 3750.00,
        "anterior": 3500.00,
        "crescimento": 7.14
      },
      "satisfacao": {
        "atual": 4.8,
        "anterior": 4.6,
        "crescimento": 4.35
      },
      "tempo_medio": {
        "atual": 25.5,
        "anterior": 28.0,
        "melhoria": 8.93
      }
    },
    "performance_barbeiros": [
      {
        "barbeiro_id": "uuid-barbeiro-1",
        "barbeiro_nome": "João Silva",
        "atendimentos": 45,
        "tempo_medio": 24.2,
        "satisfacao": 4.9,
        "faturamento": 1125.00
      }
    ],
    "atendimentos_por_barbearia": [
      {
        "barbearia_id": 1,
        "barbearia_nome": "Barbearia Lucas",
        "atendimentos": 150,
        "faturamento": 3750.00,
        "satisfacao": 4.8
      }
    ],
    "periodo": {
      "data_inicio": "2024-01-01",
      "data_fim": "2024-01-31",
      "periodo": "mes"
    },
    "filtros_aplicados": {
      "barbearia_id": 1,
      "periodo": "mes"
    }
  }
}
```

### **2. Download de Relatórios (ADMIN/GERENTE)**
```javascript
GET /api/relatorios/download?tipo=excel&barbearia_id=1&data_inicio=2024-01-01&data_fim=2024-01-31
Authorization: Bearer SEU_JWT_TOKEN

// Query Parameters:
// - tipo: excel, pdf (padrão: excel)
// - barbearia_id: ID da barbearia (opcional)
// - data_inicio: data início (YYYY-MM-DD)
// - data_fim: data fim (YYYY-MM-DD)
// - formato: detalhado, resumido (padrão: detalhado)

// Response de Sucesso (200)
// Retorna o arquivo para download (Excel ou PDF)
// Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
// ou application/pdf
```

### **3. Relatório de Histórico (ADMIN/GERENTE)**
```javascript
GET /api/relatorios/historico?barbearia_id=1&data_inicio=2024-01-01&data_fim=2024-01-31
Authorization: Bearer SEU_JWT_TOKEN

// Response de Sucesso (200)
{
  "success": true,
  "data": {
    "atendimentos": [
      {
        "id": "uuid-historico-1",
        "cliente_nome": "João Silva",
        "barbeiro_nome": "Pedro Santos",
        "barbearia_nome": "Barbearia Lucas",
        "servico_realizado": "Corte Masculino",
        "inicio_atendimento": "2024-01-01T10:30:00.000Z",
        "fim_atendimento": "2024-01-01T11:00:00.000Z",
        "duracao": 30,
        "observacoes": "Cliente satisfeito"
      }
    ],
    "resumo": {
      "total_atendimentos": 150,
      "tempo_total": 3750,
      "servicos_mais_populares": [
        {
          "servico": "Corte Masculino",
          "quantidade": 45,
          "percentual": 30
        }
      ]
    }
  }
}
```

---

## ⚙️ **SISTEMA DE CONFIGURAÇÕES**

### **1. Gerenciar Serviços (ADMIN/GERENTE)**

#### **Listar Serviços**
```javascript
GET /api/configuracoes/servicos?barbearia_id=1
Authorization: Bearer SEU_JWT_TOKEN

// Response de Sucesso (200)
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nome": "Corte Masculino",
      "descricao": "Corte tradicional masculino",
      "preco": 25.00,
      "duracao": 30,
      "categoria": "corte",
      "ativo": true,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### **Criar Serviço**
```javascript
POST /api/configuracoes/servicos
Authorization: Bearer SEU_JWT_TOKEN

// Request Body
{
  "nome": "Barba",
  "descricao": "Fazer a barba",
  "preco": 15.00,
  "duracao": 20,
  "categoria": "barba"
}

// Response de Sucesso (201)
{
  "success": true,
  "message": "Serviço criado com sucesso",
  "data": {
    "id": 2,
    "nome": "Barba",
    "descricao": "Fazer a barba",
    "preco": 15.00,
    "duracao": 20,
    "categoria": "barba",
    "ativo": true,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### **Atualizar Serviço**
```javascript
PUT /api/configuracoes/servicos/{id}
Authorization: Bearer SEU_JWT_TOKEN

// Request Body
{
  "nome": "Corte Masculino Premium",
  "descricao": "Corte masculino com acabamento premium",
  "preco": 30.00,
  "duracao": 35,
  "categoria": "corte"
}

// Response de Sucesso (200)
{
  "success": true,
  "message": "Serviço atualizado com sucesso",
  "data": {
    "id": 1,
    "nome": "Corte Masculino Premium",
    "descricao": "Corte masculino com acabamento premium",
    "preco": 30.00,
    "duracao": 35,
    "categoria": "corte",
    "ativo": true,
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### **Excluir Serviço**
```javascript
DELETE /api/configuracoes/servicos/{id}
Authorization: Bearer SEU_JWT_TOKEN

// Response de Sucesso (200)
{
  "success": true,
  "message": "Serviço excluído com sucesso"
}
```

### **2. Gerenciar Horários de Funcionamento (ADMIN/GERENTE)**

#### **Listar Horários**
```javascript
GET /api/configuracoes/horarios?barbearia_id=1
Authorization: Bearer SEU_JWT_TOKEN

// Response de Sucesso (200)
{
  "success": true,
  "data": [
    {
      "id": 1,
      "barbearia_id": 1,
      "dia_semana": 1, // 0=domingo, 1=segunda, ..., 6=sábado
      "hora_inicio": "08:00",
      "hora_fim": "18:00",
      "ativo": true
    }
  ]
}
```

#### **Criar/Atualizar Horário**
```javascript
POST /api/configuracoes/horarios
Authorization: Bearer SEU_JWT_TOKEN

// Request Body
{
  "barbearia_id": 1,
  "horarios": [
    {
      "dia_semana": 1,
      "hora_inicio": "08:00",
      "hora_fim": "18:00",
      "ativo": true
    },
    {
      "dia_semana": 2,
      "hora_inicio": "08:00",
      "hora_fim": "18:00",
      "ativo": true
    }
  ]
}

// Response de Sucesso (200)
{
  "success": true,
  "message": "Horários configurados com sucesso",
  "data": {
    "horarios_criados": 2,
    "horarios_atualizados": 0
  }
}
```

### **3. Configurações Gerais da Barbearia (ADMIN/GERENTE)**

#### **Obter Configurações**
```javascript
GET /api/configuracoes/barbearia/{barbearia_id}
Authorization: Bearer SEU_JWT_TOKEN

// Response de Sucesso (200)
{
  "success": true,
  "data": {
    "id": 1,
    "barbearia_id": 1,
    "tempo_medio_atendimento": 25,
    "max_clientes_fila": 20,
    "notificacoes_whatsapp": true,
    "exibir_tempo_estimado": true,
    "permitir_agendamento": true,
    "configuracoes_agendamento": {
      "antecedencia_minima": 30,
      "antecedencia_maxima": 7,
      "intervalo_agendamento": 15,
      "limite_diario": 50
    }
  }
}
```

#### **Atualizar Configurações**
```javascript
PUT /api/configuracoes/barbearia/{barbearia_id}
Authorization: Bearer SEU_JWT_TOKEN

// Request Body
{
  "tempo_medio_atendimento": 30,
  "max_clientes_fila": 25,
  "notificacoes_whatsapp": false,
  "exibir_tempo_estimado": true,
  "permitir_agendamento": true,
  "configuracoes_agendamento": {
    "antecedencia_minima": 60,
    "antecedencia_maxima": 14,
    "intervalo_agendamento": 30,
    "limite_diario": 40
  }
}

// Response de Sucesso (200)
{
  "success": true,
  "message": "Configurações atualizadas com sucesso",
  "data": {
    "id": 1,
    "barbearia_id": 1,
    "tempo_medio_atendimento": 30,
    "max_clientes_fila": 25,
    "notificacoes_whatsapp": false,
    "exibir_tempo_estimado": true,
    "permitir_agendamento": true,
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 📱 **NOTIFICAÇÕES E COMUNICAÇÃO**

### **1. Notificações WhatsApp**
```javascript
// Configuração automática baseada nas configurações da barbearia
// Quando notificacoes_whatsapp = true, o sistema envia:
// - Notificação quando cliente entra na fila
// - Notificação quando é chamado
// - Notificação quando está próximo
```

### **2. Tempo Estimado**
```javascript
// Calculado automaticamente baseado em:
// - Posição na fila
// - Tempo médio de atendimento
// - Número de barbeiros ativos
// - Configuração exibir_tempo_estimado
```

---

## 📝 **EXEMPLO DE IMPLEMENTAÇÃO FRONTEND**

### **Classe de Avaliações**
```javascript
class AvaliacaoService {
  constructor() {
    this.baseURL = 'http://localhost:3000/api/avaliacoes';
  }

  // Enviar avaliação (público)
  async enviarAvaliacao(dadosAvaliacao) {
    const response = await fetch(this.baseURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dadosAvaliacao)
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  }

  // Listar avaliações (admin/gerente)
  async listarAvaliacoes(filtros = {}) {
    const token = localStorage.getItem('authToken');
    const params = new URLSearchParams(filtros);
    
    const response = await fetch(`${this.baseURL}?${params}`, {
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

### **Classe de Relatórios**
```javascript
class RelatorioService {
  constructor() {
    this.baseURL = 'http://localhost:3000/api/relatorios';
  }

  // Obter dashboard
  async obterDashboard(filtros = {}) {
    const token = localStorage.getItem('authToken');
    const params = new URLSearchParams(filtros);
    
    const response = await fetch(`${this.baseURL}/dashboard?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  }

  // Download de relatório
  async downloadRelatorio(filtros = {}) {
    const token = localStorage.getItem('authToken');
    const params = new URLSearchParams(filtros);
    
    const response = await fetch(`${this.baseURL}/download?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Erro ao baixar relatório');
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-${filtros.tipo || 'excel'}.${filtros.tipo || 'xlsx'}`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  // Obter histórico
  async obterHistorico(filtros = {}) {
    const token = localStorage.getItem('authToken');
    const params = new URLSearchParams(filtros);
    
    const response = await fetch(`${this.baseURL}/historico?${params}`, {
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

### **Classe de Configurações**
```javascript
class ConfiguracaoService {
  constructor() {
    this.baseURL = 'http://localhost:3000/api/configuracoes';
  }

  // Gerenciar serviços
  async listarServicos(barbeariaId = null) {
    const token = localStorage.getItem('authToken');
    const params = barbeariaId ? `?barbearia_id=${barbeariaId}` : '';
    
    const response = await fetch(`${this.baseURL}/servicos${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  }

  async criarServico(dadosServico) {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`${this.baseURL}/servicos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(dadosServico)
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  }

  async atualizarServico(id, dadosServico) {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`${this.baseURL}/servicos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(dadosServico)
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  }

  async excluirServico(id) {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`${this.baseURL}/servicos/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  }

  // Gerenciar horários
  async listarHorarios(barbeariaId) {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`${this.baseURL}/horarios?barbearia_id=${barbeariaId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  }

  async configurarHorarios(dadosHorarios) {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`${this.baseURL}/horarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(dadosHorarios)
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  }

  // Configurações gerais
  async obterConfiguracoes(barbeariaId) {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`${this.baseURL}/barbearia/${barbeariaId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  }

  async atualizarConfiguracoes(barbeariaId, dadosConfiguracao) {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`${this.baseURL}/barbearia/${barbeariaId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(dadosConfiguracao)
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  }
}
```

---

## 🎯 **RESUMO COMPLETO DA INTEGRAÇÃO**

### **Arquivos de Documentação Criados:**
1. **`DOCUMENTACAO_FRONTEND_PARTE1.md`** - Estrutura Geral e Autenticação
2. **`DOCUMENTACAO_FRONTEND_PARTE2.md`** - Gerenciamento de Barbearias e Usuários
3. **`DOCUMENTACAO_FRONTEND_PARTE3.md`** - Sistema de Fila e Atendimentos
4. **`DOCUMENTACAO_FRONTEND_PARTE4.md`** - Avaliações, Relatórios e Configurações

### **Principais Funcionalidades Documentadas:**
- ✅ **Autenticação JWT** com roles (admin, gerente, barbeiro)
- ✅ **Gerenciamento de Barbearias** (CRUD completo)
- ✅ **Gerenciamento de Usuários** (barbeiros, perfis)
- ✅ **Sistema de Fila** (entrar, visualizar, gerenciar)
- ✅ **Atendimentos** (iniciar, finalizar, remover)
- ✅ **QR Codes** para acompanhamento
- ✅ **Avaliações** (enviar, listar)
- ✅ **Relatórios** (dashboard, download, histórico)
- ✅ **Configurações** (serviços, horários, gerais)
- ✅ **Estatísticas** em tempo real
- ✅ **Permissões** baseadas em roles

### **Exemplos de Implementação:**
- ✅ Classes de serviço para cada funcionalidade
- ✅ Exemplos de uso prático
- ✅ Estruturas de dados completas
- ✅ Tratamento de erros
- ✅ Headers e autenticação

### **Próximos Passos para o Frontend:**
1. **Implementar as classes de serviço** documentadas
2. **Criar componentes de UI** para cada funcionalidade
3. **Implementar sistema de autenticação** com JWT
4. **Configurar interceptors** para requisições
5. **Implementar atualizações em tempo real** para a fila
6. **Criar dashboards** para relatórios
7. **Implementar sistema de notificações**

---

## 🚀 **CONSIDERAÇÕES FINAIS**

Esta documentação fornece **TUDO** que um desenvolvedor frontend precisa para integrar com o sistema Lucas Barbearia Backend. Cada endpoint está documentado com:

- **URL e método HTTP**
- **Headers necessários**
- **Parâmetros de query/body**
- **Respostas de sucesso e erro**
- **Exemplos práticos de implementação**
- **Classes de serviço prontas para uso**

O sistema está **100% pronto** para integração frontend! 🎉 