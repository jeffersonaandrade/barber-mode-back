# 📚 Documentação da API - Lucas Barbearia

## 🚀 Como Iniciar

```bash
npm start
```

A documentação Swagger estará disponível em: `http://localhost:3000/documentation`

## 📋 **CURLS COMPLETOS POR CATEGORIA**

### **🏪 BARBEARIAS (PÚBLICO)**
```bash
# Listar todas as barbearias
curl -X GET "http://localhost:3000/api/barbearias"

# Buscar barbearia específica
curl -X GET "http://localhost:3000/api/barbearias/7"
```

### **👥 BARBEIROS (PÚBLICO)**
```bash
# Listar barbeiros ativos de uma barbearia
curl -X GET "http://localhost:3000/api/users/barbeiros/ativos-publico?barbearia_id=7"
```

### **📋 FILAS (PÚBLICO)**
```bash
# Ver estatísticas da fila (sem dados pessoais)
curl -X GET "http://localhost:3000/api/fila-publica/7"

# Entrar na fila (SEM autenticação)
curl -X POST "http://localhost:3000/api/fila/entrar" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "telefone": "(11) 99999-9999",
    "barbearia_id": 7,
    "barbeiro_id": "cf8053c6-3dc9-4bb6-87ff-fcd6db26d270"
  }'
```

### **🔐 AUTENTICAÇÃO**
```bash
# Login
curl -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@lucasbarbearia.com",
    "password": "admin123"
  }'

# Registro
curl -X POST "http://localhost:3000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "gerente@lucasbarbearia.com",
    "password": "gerente123",
    "nome": "Gerente",
    "telefone": "(11) 88888-8888",
    "role": "gerente"
  }'
```

### **📋 FILAS (PRIVADO - Funcionários)**
```bash
# Ver fila completa (com dados dos clientes)
curl -X GET "http://localhost:3000/api/fila/7" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# Chamar próximo cliente
curl -X POST "http://localhost:3000/api/fila/proximo" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "barbearia_id": 7,
    "barbeiro_id": "cf8053c6-3dc9-4bb6-87ff-fcd6db26d270"
  }'

# Iniciar atendimento
curl -X POST "http://localhost:3000/api/fila/iniciar-atendimento/77a20b2e-9f03-48b2-8724-bfb20d3d332b" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "barbearia_id": 7
  }'

# Finalizar atendimento
curl -X POST "http://localhost:3000/api/fila/finalizar" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "cliente_id": "77a20b2e-9f03-48b2-8724-bfb20d3d332b",
    "barbearia_id": 7,
    "servico": "Corte + Barba",
    "duracao": 45
  }'

# Remover cliente da fila (não apareceu)
curl -X POST "http://localhost:3000/api/fila/remover/77a20b2e-9f03-48b2-8724-bfb20d3d332b" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "barbearia_id": 7
  }'
```

### **📊 HISTÓRICO (PRIVADO - Funcionários)**
```bash
# Histórico de atendimentos
curl -X GET "http://localhost:3000/api/historico?barbeiro_id=cf8053c6-3dc9-4bb6-87ff-fcd6db26d270&data_inicio=2025-07-01&data_fim=2025-07-31" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# Histórico sem filtros
curl -X GET "http://localhost:3000/api/historico" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### **⭐ AVALIAÇÕES (PÚBLICO)**
```bash
# Criar avaliação
curl -X POST "http://localhost:3000/api/avaliacoes" \
  -H "Content-Type: application/json" \
  -d '{
    "cliente_id": "77a20b2e-9f03-48b2-8724-bfb20d3d332b",
    "barbearia_id": 7,
    "barbeiro_id": "cf8053c6-3dc9-4bb6-87ff-fcd6db26d270",
    "rating": 5,
    "categoria": "atendimento",
    "comentario": "Excelente atendimento!"
  }'

# Listar avaliações
curl -X GET "http://localhost:3000/api/avaliacoes?barbearia_id=7"
```

### **👥 USUÁRIOS (PRIVADO - Admin/Gerente)**
```bash
# Listar usuários
curl -X GET "http://localhost:3000/api/users" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# Buscar usuário por ID
curl -X GET "http://localhost:3000/api/users/8d01bfc1-b9cf-4046-be4b-7b1c9197db42" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# Atualizar usuário
curl -X PUT "http://localhost:3000/api/users/8d01bfc1-b9cf-4046-be4b-7b1c9197db42" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "nome": "Novo Nome",
    "telefone": "(11) 99999-8888",
    "role": "gerente"
  }'

# Listar barbeiros ativos (funcionários)
curl -X GET "http://localhost:3000/api/users/barbeiros/ativos?barbearia_id=7" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## 📖 **DOCUMENTAÇÃO DETALHADA**

## 🔐 Endpoints de Autenticação

### 1. Login
**POST** `/api/auth/login`

**Curl:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@lucasbarbearia.com",
    "password": "admin123"
  }'
```

**Body:**
```json
{
  "email": "admin@lucasbarbearia.com",
  "password": "admin123"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "user": {
      "id": "8d01bfc1-b9cf-4046-be4b-7b1c9197db42",
      "email": "admin@lucasbarbearia.com",
      "nome": "Administrador",
      "role": "admin",
      "telefone": "(11) 99999-9999",
      "active": true,
      "created_at": "2025-07-23T21:56:41.156527+00:00",
      "updated_at": "2025-07-23T21:56:41.156527+00:00"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Registro
**POST** `/api/auth/register`

**Curl:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "gerente@lucasbarbearia.com",
    "password": "gerente123",
    "nome": "Gerente",
    "telefone": "(11) 88888-8888",
    "role": "gerente"
  }'
```

**Body:**
```json
{
  "email": "gerente@lucasbarbearia.com",
  "password": "gerente123",
  "nome": "Gerente",
  "telefone": "(11) 88888-8888",
  "role": "gerente"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Usuário criado com sucesso",
  "data": {
    "id": "uuid-do-usuario",
    "email": "gerente@lucasbarbearia.com",
    "nome": "Gerente",
    "role": "gerente",
    "telefone": "(11) 88888-8888",
    "active": true,
    "created_at": "2025-07-23T21:56:41.156527+00:00",
    "updated_at": "2025-07-23T21:56:41.156527+00:00"
  }
}
```

### 3. Dados do Usuário
**GET** `/api/auth/me`

**Curl:**
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "8d01bfc1-b9cf-4046-be4b-7b1c9197db42",
    "email": "admin@lucasbarbearia.com",
    "nome": "Administrador",
    "role": "admin",
    "telefone": "(11) 99999-9999",
    "active": true,
    "created_at": "2025-07-23T21:56:41.156527+00:00",
    "updated_at": "2025-07-23T21:56:41.156527+00:00"
  }
}
```

### 4. Logout
**POST** `/api/auth/logout`

**Curl:**
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
```

**Resposta:**
```json
{
  "success": true,
  "message": "Logout realizado com sucesso"
}
```

## 🏥 Endpoints de Barbearias

### 1. Listar Barbearias (PÚBLICO)
**GET** `/api/barbearias`

**Curl:**
```bash
curl -X GET "http://localhost:3000/api/barbearias"
```

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 7,
      "nome": "Lucas Barbearia",
      "endereco": "Rua das Flores, 123",
      "telefone": "(11) 99999-9999",
      "ativo": true
    }
  ]
}
```

**Nota:** Este endpoint é **PÚBLICO** e não requer autenticação. Usado pelos clientes para escolher barbearia.

### 2. Buscar Barbearia por ID (PÚBLICO)
**GET** `/api/barbearias/{id}`

**Curl:**
```bash
curl -X GET "http://localhost:3000/api/barbearias/7"
```

### 3. Criar Barbearia
**GET** `/api/barbearias`

**Curl:**
```bash
curl -X GET http://localhost:3000/api/barbearias
```

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nome": "Lucas Barbearia - Centro",
      "endereco": "Rua das Flores, 123 - Centro, São Paulo - SP",
      "telefone": "(11) 99999-9999",
      "whatsapp": "(11) 99999-9999",
      "instagram": "@lucasbarbearia",
      "horario": {
        "segunda": {"aberto": true, "inicio": "08:00", "fim": "18:00"},
        "terca": {"aberto": true, "inicio": "08:00", "fim": "18:00"},
        "quarta": {"aberto": true, "inicio": "08:00", "fim": "18:00"},
        "quinta": {"aberto": true, "inicio": "08:00", "fim": "18:00"},
        "sexta": {"aberto": true, "inicio": "08:00", "fim": "18:00"},
        "sabado": {"aberto": true, "inicio": "08:00", "fim": "17:00"},
        "domingo": {"aberto": false}
      },
      "configuracoes": {
        "tempo_medio_atendimento": 30,
        "max_clientes_fila": 50,
        "permitir_agendamento": false,
        "mostrar_tempo_estimado": true
      },
      "servicos": [
        {
          "nome": "Corte Masculino",
          "preco": 25.00,
          "duracao": 30,
          "descricao": "Corte tradicional masculino"
        }
      ],
      "ativo": true,
      "created_at": "2025-07-23T21:56:41.156527+00:00",
      "updated_at": "2025-07-23T21:56:41.156527+00:00"
    }
  ]
}
```

### 2. Criar Barbearia
**POST** `/api/barbearias`

**Curl:**
```bash
curl -X POST http://localhost:3000/api/barbearias \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "nome": "Lucas Barbearia - Zona Sul",
    "endereco": "Av. Paulista, 1000 - Zona Sul, São Paulo - SP",
    "telefone": "(11) 77777-7777",
    "whatsapp": "(11) 77777-7777",
    "instagram": "@lucasbarbearia_sul",
    "horario": {
      "segunda": {"aberto": true, "inicio": "08:00", "fim": "18:00"},
      "terca": {"aberto": true, "inicio": "08:00", "fim": "18:00"},
      "quarta": {"aberto": true, "inicio": "08:00", "fim": "18:00"},
      "quinta": {"aberto": true, "inicio": "08:00", "fim": "18:00"},
      "sexta": {"aberto": true, "inicio": "08:00", "fim": "18:00"},
      "sabado": {"aberto": true, "inicio": "08:00", "fim": "17:00"},
      "domingo": {"aberto": false}
    },
    "configuracoes": {
      "tempo_medio_atendimento": 30,
      "max_clientes_fila": 50,
      "permitir_agendamento": false,
      "mostrar_tempo_estimado": true
    },
    "servicos": [
      {
        "nome": "Corte Masculino",
        "preco": 25.00,
        "duracao": 30,
        "descricao": "Corte tradicional masculino"
      },
      {
        "nome": "Barba",
        "preco": 15.00,
        "duracao": 20,
        "descricao": "Acabamento na barba"
      }
    ]
  }'
```

**Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
```

**Body:**
```json
{
  "nome": "Lucas Barbearia - Zona Sul",
  "endereco": "Av. Paulista, 1000 - Zona Sul, São Paulo - SP",
  "telefone": "(11) 77777-7777",
  "whatsapp": "(11) 77777-7777",
  "instagram": "@lucasbarbearia_sul",
  "horario": {
    "segunda": {"aberto": true, "inicio": "08:00", "fim": "18:00"},
    "terca": {"aberto": true, "inicio": "08:00", "fim": "18:00"},
    "quarta": {"aberto": true, "inicio": "08:00", "fim": "18:00"},
    "quinta": {"aberto": true, "inicio": "08:00", "fim": "18:00"},
    "sexta": {"aberto": true, "inicio": "08:00", "fim": "18:00"},
    "sabado": {"aberto": true, "inicio": "08:00", "fim": "17:00"},
    "domingo": {"aberto": false}
  },
  "configuracoes": {
    "tempo_medio_atendimento": 30,
    "max_clientes_fila": 50,
    "permitir_agendamento": false,
    "mostrar_tempo_estimado": true
  },
  "servicos": [
    {
      "nome": "Corte Masculino",
      "preco": 25.00,
      "duracao": 30,
      "descricao": "Corte tradicional masculino"
    },
    {
      "nome": "Barba",
      "preco": 15.00,
      "duracao": 20,
      "descricao": "Acabamento na barba"
    }
  ]
}
```

## 👥 Endpoints de Usuários

### 1. Listar Barbeiros Ativos (PÚBLICO)
**GET** `/api/users/barbeiros/ativos-publico?barbearia_id={id}`

**Curl:**
```bash
curl -X GET "http://localhost:3000/api/users/barbeiros/ativos-publico?barbearia_id=7"
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "barbearia": {
      "id": 7,
      "nome": "Lucas Barbearia"
    },
    "barbeiros": [
      {
        "id": "cf8053c6-3dc9-4bb6-87ff-fcd6db26d270",
        "nome": "João Silva",
        "especialidade": "Corte masculino premium",
        "dias_trabalho": ["segunda", "terca", "quarta", "quinta", "sexta"],
        "horario_inicio": "08:00",
        "horario_fim": "18:00"
      }
    ],
    "total_barbeiros": 1
  }
}
```

**Nota:** Este endpoint é **PÚBLICO** e não requer autenticação. Usado pelos clientes para escolher entre fila geral ou barbeiro específico.

### 2. Listar Usuários
**GET** `/api/users`

**Curl:**
```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
```

### 2. Buscar Usuário por ID
**GET** `/api/users/:id`

**Curl:**
```bash
curl -X GET http://localhost:3000/api/users/8d01bfc1-b9cf-4046-be4b-7b1c9197db42 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
```

### 3. Atualizar Usuário
**PUT** `/api/users/:id`

**Curl:**
```bash
curl -X PUT http://localhost:3000/api/users/8d01bfc1-b9cf-4046-be4b-7b1c9197db42 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "nome": "Novo Nome",
    "telefone": "(11) 99999-8888",
    "role": "gerente"
  }'
```

**Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
```

**Body:**
```json
{
  "nome": "Novo Nome",
  "telefone": "(11) 99999-8888",
  "role": "gerente"
}
```

## 📋 Endpoints de Fila

### 📊 Status dos Clientes

O sistema de fila utiliza 5 status diferentes para controlar o fluxo dos clientes:

| Status | Descrição | Ação Necessária |
|--------|-----------|-----------------|
| **`aguardando`** | Cliente na fila, aguardando ser chamado | - |
| **`proximo`** | Cliente foi chamado, aguardando aparecer no balcão | Botão "Iniciar Atendimento" |
| **`atendendo`** | Cliente apareceu no balcão, atendimento iniciado | Botão "Finalizar Atendimento" |
| **`finalizado`** | Atendimento concluído com sucesso | - |
| **`removido`** | Cliente não apareceu no balcão, removido da fila | - |

**Fluxo de Status:**
```
aguardando → proximo → atendendo → finalizado
     ↓
  removido (se não aparecer no balcão)
```

### 1. Ver Fila da Barbearia (PÚBLICO)
**GET** `/api/fila-publica/{barbearia_id}`

**Curl:**
```bash
curl -X GET "http://localhost:3000/api/fila-publica/7"
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "barbearia": {
      "id": 7,
      "nome": "Lucas Barbearia",
      "endereco": "Rua das Flores, 123",
      "telefone": "(11) 99999-9999"
    },
    "estatisticas": {
      "aguardando": 5,
      "proximo": 1,
      "atendendo": 2,
      "tempo_estimado": 75,
      "barbeiros_ativos": 3
    }
  }
}
```

**Nota:** Este endpoint é **PÚBLICO** e não requer autenticação. Retorna apenas estatísticas da fila (sem dados pessoais dos clientes).

### 2. Entrar na Fila (PÚBLICO)
**POST** `/api/fila/entrar`

**Curl:**
```bash
curl -X POST "http://localhost:3000/api/fila/entrar" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "telefone": "(11) 99999-9999",
    "barbearia_id": 7,
    "barbeiro_id": "cf8053c6-3dc9-4bb6-87ff-fcd6db26d270"
  }'
```

**Body:**
```json
{
  "nome": "João Silva",
  "telefone": "(11) 99999-9999",
  "barbearia_id": 7,
  "barbeiro_id": "cf8053c6-3dc9-4bb6-87ff-fcd6db26d270" // opcional
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Cliente adicionado à fila com sucesso",
  "data": {
    "cliente": {
      "id": "uuid-do-cliente",
      "nome": "João Silva",
      "posicao": 3,
      "status": "aguardando",
      "token": "token-unico"
    },
    "qr_code_fila": "data:image/png;base64,...",
    "qr_code_status": "data:image/png;base64,...",
    "posicao": 3
  }
}
```

**Nota:** Este endpoint é **PÚBLICO** e não requer autenticação. Usado pelos clientes para entrar na fila.

### 3. Ver Fila Completa (PRIVADO - Funcionários)

**Curl:**
```bash
curl -X POST http://localhost:3000/api/fila/entrar \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "telefone": "(11) 99999-9999",
    "barbearia_id": 1,
    "barbeiro_id": "uuid-do-barbeiro"
  }'
```

**Body:**
```json
{
  "nome": "João Silva",
  "telefone": "(11) 99999-9999",
  "barbearia_id": 1,
  "barbeiro_id": "uuid-do-barbeiro" // opcional
}
```

### 2. Ver Fila
**GET** `/api/fila/:barbearia_id`

**Curl:**
```bash
curl -X GET http://localhost:3000/api/fila/1
```

### 3. Próximo Cliente
**POST** `/api/fila/proximo`

**Curl:**
```bash
curl -X POST http://localhost:3000/api/fila/proximo \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "barbearia_id": 1,
    "barbeiro_id": "uuid-do-barbeiro"
  }'
```

**Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
```

**Body:**
```json
{
  "barbearia_id": 1,
  "barbeiro_id": "uuid-do-barbeiro"
}
```

### 4. Finalizar Atendimento
**POST** `/api/fila/finalizar`

**Curl:**
```bash
curl -X POST http://localhost:3000/api/fila/finalizar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "cliente_id": "uuid-do-cliente",
    "barbearia_id": 1,
    "servico": "Corte + Barba",
    "duracao": 45
  }'
```

**Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
```

**Body:**
```json
{
  "cliente_id": "uuid-do-cliente",
  "barbearia_id": 1,
  "servico": "Corte + Barba",
  "duracao": 45
}
```

### 5. Iniciar Atendimento
**POST** `/api/fila/iniciar-atendimento/:cliente_id`

**Curl:**
```bash
curl -X POST http://localhost:3000/api/fila/iniciar-atendimento/uuid-do-cliente \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "barbearia_id": 1
  }'
```

**Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
```

**Body:**
```json
{
  "barbearia_id": 1
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Atendimento iniciado com sucesso",
  "data": {
    "id": "uuid-do-cliente",
    "nome": "João Silva",
    "status": "atendendo",
    "data_atendimento": "2025-07-23T22:00:00.000Z"
  }
}
```

### 6. Remover Cliente da Fila
**POST** `/api/fila/remover/:cliente_id`

**Curl:**
```bash
curl -X POST http://localhost:3000/api/fila/remover/uuid-do-cliente \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "barbearia_id": 1
  }'
```

**Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
```

**Body:**
```json
{
  "barbearia_id": 1
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Cliente removido da fila com sucesso",
  "data": {
    "id": "uuid-do-cliente",
    "nome": "João Silva",
    "status": "removido",
    "data_finalizacao": "2025-07-23T22:00:00.000Z"
  }
}
```

## ⭐ Endpoints de Avaliações

### 1. Criar Avaliação
**POST** `/api/avaliacoes`

**Curl:**
```bash
curl -X POST http://localhost:3000/api/avaliacoes \
  -H "Content-Type: application/json" \
  -d '{
    "cliente_id": "uuid-do-cliente",
    "barbearia_id": 1,
    "barbeiro_id": "uuid-do-barbeiro",
    "rating": 5,
    "categoria": "atendimento",
    "comentario": "Excelente atendimento!"
  }'
```

**Body:**
```json
{
  "cliente_id": "uuid-do-cliente",
  "barbearia_id": 1,
  "barbeiro_id": "uuid-do-barbeiro",
  "rating": 5,
  "categoria": "atendimento",
  "comentario": "Excelente atendimento!"
}
```

### 2. Listar Avaliações
**GET** `/api/avaliacoes?barbearia_id=1`

**Curl:**
```bash
curl -X GET "http://localhost:3000/api/avaliacoes?barbearia_id=1"
```

## 📊 Endpoints de Histórico

### 🔧 Troubleshooting: Resolução de Problemas Comuns

#### **Problema: Endpoint `/api/historico` retorna 404**

**Causa:** Problema com `fastify-plugin` na estrutura do plugin.

**Solução:**
1. **Remova o `fastify-plugin`** do arquivo `src/routes/historico.js`:
   ```javascript
   // ❌ NÃO usar
   const fp = require('fastify-plugin');
   module.exports = fp(historicoRoutes);
   
   // ✅ USAR
   module.exports = historicoRoutes;
   ```

2. **Estrutura correta do plugin:**
   ```javascript
   // Versão sem fastify-plugin (funcionando)
   async function historicoRoutes(fastify, options) {
     // Histórico de atendimentos
     fastify.get('/historico', {
       preValidation: [fastify.authenticate],
       // ... resto da configuração
     }, async (request, reply) => {
       // ... lógica da rota
     });
   }
   
   module.exports = historicoRoutes;
   ```

#### **Problema: Erro "column historico_atendimentos.data_atendimento does not exist"**

**Causa:** Nome incorreto da coluna no banco de dados.

**Solução:** Use os nomes corretos das colunas:
   - ✅ `data_inicio` (não `data_atendimento`)
   - ✅ `data_fim` (não `data_finalizacao`)

#### **Problema: "Token inválido ou expirado"**

**Soluções:**
1. **Gere um novo token:**
   ```bash
   curl -X POST "http://localhost:3000/api/auth/login" \
     -H "Content-Type: application/json" \
     -d '{
       "email": "barbeiro@lucasbarbearia.com",
       "password": "barbeiro123"
     }'
   ```

2. **Use o token mais recente** nos headers:
   ```bash
   curl -X GET "http://localhost:3000/api/historico" \
     -H "Authorization: Bearer NOVO_TOKEN_AQUI"
   ```

#### **Processo de Debug Recomendado:**

1. **Teste endpoint básico:**
   ```bash
   curl -X GET "http://localhost:3000/api/test-historico"
   ```

2. **Teste sem autenticação** (temporariamente):
   ```javascript
   // Remova preValidation temporariamente
   fastify.get('/historico', {
     // preValidation: [fastify.authenticate], // Comente esta linha
     // ... resto da configuração
   });
   ```

3. **Verifique logs do servidor** para mensagens de erro.

### 1. Histórico de Atendimentos
**GET** `/api/historico?barbearia_id=1&data_inicio=2025-07-01&data_fim=2025-07-31`

**Curl:**
```bash
curl -X GET "http://localhost:3000/api/historico?barbearia_id=1&data_inicio=2025-07-01&data_fim=2025-07-31" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
```

## 🔧 Endpoints Utilitários

### 1. Health Check
**GET** `/health`

**Curl:**
```bash
curl -X GET http://localhost:3000/health
```

**Resposta:**
```json
{
  "status": "OK",
  "timestamp": "2025-07-23T21:56:41.156527+00:00"
}
```

### 2. Informações da API
**GET** `/`

**Curl:**
```bash
curl -X GET http://localhost:3000/
```

**Resposta:**
```json
{
  "message": "Lucas Barbearia API",
  "version": "1.0.0"
}
```

## 🔑 Autenticação

Para endpoints protegidos, inclua o header:
```
Authorization: Bearer SEU_TOKEN_JWT
```

## 📝 Roles Disponíveis

- **admin**: Acesso total ao sistema
- **gerente**: Gerencia barbearias específicas
- **barbeiro**: Acesso limitado ao seu trabalho

## 🚨 Códigos de Erro

- **400**: Dados inválidos
- **401**: Não autorizado
- **403**: Acesso negado
- **404**: Recurso não encontrado
- **500**: Erro interno do servidor

## 🧪 Exemplo Prático de Uso

### 1. Fazer Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@lucasbarbearia.com",
    "password": "admin123"
  }'
```

### 2. Copiar o Token da Resposta
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Usar o Token nos Próximos Requests
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 4. Criar uma Barbearia
```bash
curl -X POST http://localhost:3000/api/barbearias \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "nome": "Lucas Barbearia - Zona Sul",
    "endereco": "Av. Paulista, 1000 - Zona Sul, São Paulo - SP",
    "telefone": "(11) 77777-7777",
    "whatsapp": "(11) 77777-7777",
    "instagram": "@lucasbarbearia_sul",
    "horario": {
      "segunda": {"aberto": true, "inicio": "08:00", "fim": "18:00"},
      "terca": {"aberto": true, "inicio": "08:00", "fim": "18:00"},
      "quarta": {"aberto": true, "inicio": "08:00", "fim": "18:00"},
      "quinta": {"aberto": true, "inicio": "08:00", "fim": "18:00"},
      "sexta": {"aberto": true, "inicio": "08:00", "fim": "18:00"},
      "sabado": {"aberto": true, "inicio": "08:00", "fim": "17:00"},
      "domingo": {"aberto": false}
    },
    "configuracoes": {
      "tempo_medio_atendimento": 30,
      "max_clientes_fila": 50,
      "permitir_agendamento": false,
      "mostrar_tempo_estimado": true
    },
    "servicos": [
      {
        "nome": "Corte Masculino",
        "preco": 25.00,
        "duracao": 30,
        "descricao": "Corte tradicional masculino"
      }
    ]
  }'
``` 