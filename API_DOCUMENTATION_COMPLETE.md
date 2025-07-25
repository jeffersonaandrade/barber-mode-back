# 📚 Documentação Completa da API - Lucas Barbearia

## 🎯 **RESUMO EXECUTIVO**

Esta documentação contém **TODOS** os endpoints disponíveis na API, organizados por funcionalidade e nível de acesso. A API está estruturada com 3 níveis de roles:

- **👑 ADMIN**: Acesso total ao sistema
- **👔 GERENTE**: Gerencia barbearias específicas  
- **✂️ BARBEIRO**: Acesso limitado ao seu trabalho
- **👤 PÚBLICO**: Endpoints sem autenticação para clientes

---

## 🔐 **SISTEMA DE AUTENTICAÇÃO**

### **Roles e Permissões**

| Role | Descrição | Acesso |
|------|-----------|---------|
| **admin** | Administrador do sistema | Todas as funcionalidades |
| **gerente** | Gerente de barbearia | Sua barbearia + relatórios |
| **barbeiro** | Barbeiro/funcionário | Fila + atendimentos |
| **público** | Clientes | Entrar na fila + ver status |

### **Autenticação JWT**
```bash
# Header obrigatório para endpoints protegidos
Authorization: Bearer SEU_TOKEN_JWT
```

---

## 📋 **ENDPOINTS POR CATEGORIA**

### **🔐 AUTENTICAÇÃO**

| Método | Endpoint | Role | Descrição |
|--------|----------|------|-----------|
| `POST` | `/api/auth/login` | PÚBLICO | Login de usuário |
| `POST` | `/api/auth/register` | PÚBLICO | Registro de usuário |
| `GET` | `/api/auth/me` | AUTENTICADO | Dados do usuário logado |
| `POST` | `/api/auth/logout` | AUTENTICADO | Logout |

### **🏪 BARBEARIAS**

| Método | Endpoint | Role | Descrição |
|--------|----------|------|-----------|
| `GET` | `/api/barbearias` | PÚBLICO | Listar barbearias ativas |
| `GET` | `/api/barbearias/{id}` | PÚBLICO | Buscar barbearia por ID |
| `POST` | `/api/barbearias` | ADMIN | Criar barbearia |
| `PUT` | `/api/barbearias/{id}` | ADMIN | Atualizar barbearia |
| `DELETE` | `/api/barbearias/{id}` | ADMIN | Remover barbearia |
| `POST` | `/api/barbearias/{id}/fila/proximo` | BARBEIRO | Chamar próximo cliente |

### **👥 USUÁRIOS**

| Método | Endpoint | Role | Descrição |
|--------|----------|------|-----------|
| `GET` | `/api/users` | ADMIN | Listar todos os usuários |
| `PUT` | `/api/users/{id}` | ADMIN | Atualizar usuário |
| `DELETE` | `/api/users/{id}` | ADMIN | Deletar usuário |
| `GET` | `/api/users/barbeiros` | MISTO | Listar barbeiros (com filtros) |
| `GET` | `/api/users/barbeiros/meu-status` | BARBEIRO | Status do barbeiro logado |
| `POST` | `/api/users/barbeiros/ativar` | ADMIN/GERENTE | Ativar barbeiro |
| `POST` | `/api/users/barbeiros/desativar` | ADMIN/GERENTE | Desativar barbeiro |

### **📋 FILA**

| Método | Endpoint | Role | Descrição |
|--------|----------|------|-----------|
| `POST` | `/api/fila/entrar` | PÚBLICO | Entrar na fila |
| `GET` | `/api/fila/{barbearia_id}` | BARBEIRO | Ver fila completa |
| `GET` | `/api/fila-gerente/{barbearia_id}` | GERENTE | Ver fila (dados completos) |
| `GET` | `/api/fila-publica/{barbearia_id}` | PÚBLICO | Ver estatísticas da fila |
| `POST` | `/api/fila/proximo/{barbearia_id}` | BARBEIRO | Chamar próximo cliente |
| `POST` | `/api/fila/iniciar-atendimento/{cliente_id}` | BARBEIRO | Iniciar atendimento |
| `POST` | `/api/fila/finalizar` | BARBEIRO | Finalizar atendimento |
| `POST` | `/api/fila/remover/{cliente_id}` | BARBEIRO | Remover cliente da fila |
| `GET` | `/api/fila/status/{token}` | PÚBLICO | Verificar status do cliente |

### **⭐ AVALIAÇÕES**

| Método | Endpoint | Role | Descrição |
|--------|----------|------|-----------|
| `POST` | `/api/avaliacoes` | PÚBLICO | Enviar avaliação |
| `GET` | `/api/avaliacoes` | ADMIN/GERENTE | Listar avaliações |

### **📊 HISTÓRICO (2 endpoints)**
| Método | Endpoint | Role | Descrição |
|--------|----------|------|-----------|
| `GET` | `/api/historico` | ADMIN/GERENTE/BARBEIRO | Histórico de atendimentos |
| `GET` | `/api/historico/relatorios` | ADMIN/GERENTE | Relatórios e estatísticas |

**Nota:** Barbeiros podem ver apenas seu próprio histórico. Se não especificar `barbeiro_id`, automaticamente filtra pelo ID do barbeiro logado.

### **🏥 UTILITÁRIOS**

| Método | Endpoint | Role | Descrição |
|--------|----------|------|-----------|
| `GET` | `/health` | PÚBLICO | Health check |
| `GET` | `/` | PÚBLICO | Informações da API |

---

## 🔍 **DETALHAMENTO COMPLETO DOS ENDPOINTS**

### **🔐 AUTENTICAÇÃO**

#### **1. Login**
```http
POST /api/auth/login
Content-Type: application/json

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
      "id": "uuid-do-usuario",
      "email": "admin@lucasbarbearia.com",
      "nome": "Administrador",
      "role": "admin",
      "telefone": "(11) 99999-9999",
      "active": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### **2. Registro**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "gerente@lucasbarbearia.com",
  "password": "gerente123",
  "nome": "Gerente",
  "telefone": "(11) 88888-8888",
  "role": "gerente"
}
```

#### **3. Dados do Usuário**
```http
GET /api/auth/me
Authorization: Bearer SEU_TOKEN_JWT
```

#### **4. Logout**
```http
POST /api/auth/logout
Authorization: Bearer SEU_TOKEN_JWT
```

### **🏪 BARBEARIAS**

#### **1. Listar Barbearias (PÚBLICO)**
```http
GET /api/barbearias
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
      "ativo": true
    }
  ]
}
```

#### **2. Buscar Barbearia por ID (PÚBLICO)**
```http
GET /api/barbearias/{id}
```

#### **3. Criar Barbearia (ADMIN)**
```http
POST /api/barbearias
Authorization: Bearer SEU_TOKEN_JWT
Content-Type: application/json

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
    }
  ]
}
```

#### **4. Atualizar Barbearia (ADMIN)**
```http
PUT /api/barbearias/{id}
Authorization: Bearer SEU_TOKEN_JWT
Content-Type: application/json

{
  "nome": "Novo Nome",
  "endereco": "Novo Endereço",
  "telefone": "(11) 99999-8888"
}
```

#### **5. Remover Barbearia (ADMIN)**
```http
DELETE /api/barbearias/{id}
Authorization: Bearer SEU_TOKEN_JWT
```

### **👥 USUÁRIOS**

#### **1. Listar Usuários (ADMIN)**
```http
GET /api/users
Authorization: Bearer SEU_TOKEN_JWT
```

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-do-usuario",
      "email": "admin@lucasbarbearia.com",
      "nome": "Administrador",
      "role": "admin",
      "telefone": "(11) 99999-9999",
      "active": true,
      "created_at": "2025-07-23T21:56:41.156527+00:00",
      "updated_at": "2025-07-23T21:56:41.156527+00:00"
    }
  ]
}
```

#### **2. Atualizar Usuário (ADMIN)**
```http
PUT /api/users/{id}
Authorization: Bearer SEU_TOKEN_JWT
Content-Type: application/json

{
  "nome": "Novo Nome",
  "email": "novo@email.com",
  "role": "gerente",
  "ativo": true
}
```

#### **3. Deletar Usuário (ADMIN)**
```http
DELETE /api/users/{id}
Authorization: Bearer SEU_TOKEN_JWT
```

#### **4. Listar Barbeiros (MISTO)**
```http
GET /api/users/barbeiros?barbearia_id=7&status=ativo&public=false
Authorization: Bearer SEU_TOKEN_JWT
```

**Parâmetros:**
- `barbearia_id` (obrigatório): ID da barbearia
- `status`: `ativo`, `inativo`, `disponivel`
- `public`: `true` para dados limitados (sem autenticação), `false` para dados completos

**Resposta (Público):**
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
        "id": "uuid-do-barbeiro",
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

#### **5. Status do Barbeiro (BARBEIRO)**
```http
GET /api/users/barbeiros/meu-status
Authorization: Bearer SEU_TOKEN_JWT
```

#### **6. Ativar Barbeiro (ADMIN/GERENTE)**
```http
POST /api/users/barbeiros/ativar
Authorization: Bearer SEU_TOKEN_JWT
Content-Type: application/json

{
  "user_id": "uuid-do-usuario",
  "barbearia_id": 7
}
```

#### **7. Desativar Barbeiro (ADMIN/GERENTE)**
```http
POST /api/users/barbeiros/desativar
Authorization: Bearer SEU_TOKEN_JWT
Content-Type: application/json

{
  "user_id": "uuid-do-usuario",
  "barbearia_id": 7
}
```

### **📋 FILA**

#### **📊 Status dos Clientes**

O sistema de fila utiliza 5 status diferentes:

| Status | Descrição | Ação Necessária |
|--------|-----------|-----------------|
| **`aguardando`** | Cliente na fila, aguardando ser chamado | - |
| **`proximo`** | Cliente foi chamado, aguardando aparecer | Botão "Iniciar Atendimento" |
| **`atendendo`** | Cliente apareceu, atendimento iniciado | Botão "Finalizar Atendimento" |
| **`finalizado`** | Atendimento concluído com sucesso | - |
| **`removido`** | Cliente não apareceu, removido da fila | - |

**Fluxo de Status:**
```
aguardando → proximo → atendendo → finalizado
     ↓
  removido (se não aparecer no balcão)
```

#### **1. Entrar na Fila (PÚBLICO)**
```http
POST /api/fila/entrar
Content-Type: application/json

{
  "nome": "João Silva",
  "telefone": "(11) 99999-9999",
  "barbearia_id": 7,
  "barbeiro_id": "uuid-do-barbeiro" // opcional
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

#### **2. Ver Fila Completa (BARBEIRO)**
```http
GET /api/fila/{barbearia_id}
Authorization: Bearer SEU_TOKEN_JWT
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "clientes": [
      {
        "id": "uuid-do-cliente",
        "nome": "João Silva",
        "telefone": "(11) 99999-9999",
        "posicao": 1,
        "status": "aguardando",
        "created_at": "2025-07-23T22:00:00.000Z"
      }
    ],
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

#### **3. Ver Fila Gerente (GERENTE)**
```http
GET /api/fila-gerente/{barbearia_id}
Authorization: Bearer SEU_TOKEN_JWT
```

#### **4. Ver Estatísticas Públicas (PÚBLICO)**
```http
GET /api/fila-publica/{barbearia_id}
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

#### **5. Chamar Próximo Cliente (BARBEIRO)**
```http
POST /api/fila/proximo/{barbearia_id}
Authorization: Bearer SEU_TOKEN_JWT
```

**Resposta:**
```json
{
  "success": true,
  "message": "Próximo cliente chamado com sucesso",
  "data": {
    "cliente": {
      "id": "uuid-do-cliente",
      "nome": "João Silva",
      "telefone": "(11) 99999-9999",
      "posicao": 1,
      "status": "proximo"
    },
    "barbearia": {
      "id": 7,
      "nome": "Lucas Barbearia"
    }
  }
}
```

#### **6. Iniciar Atendimento (BARBEIRO)**
```http
POST /api/fila/iniciar-atendimento/{cliente_id}
Authorization: Bearer SEU_TOKEN_JWT
```

**Resposta:**
```json
{
  "success": true,
  "message": "Atendimento iniciado com sucesso",
  "data": {
    "cliente": {
      "id": "uuid-do-cliente",
      "nome": "João Silva",
      "telefone": "(11) 99999-9999",
      "posicao": 1,
      "status": "atendendo"
    }
  }
}
```

#### **7. Finalizar Atendimento (BARBEIRO)**
```http
POST /api/fila/finalizar
Authorization: Bearer SEU_TOKEN_JWT
Content-Type: application/json

{
  "cliente_id": "uuid-do-cliente",
  "observacoes": "Cliente satisfeito com o serviço"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Atendimento finalizado com sucesso",
  "data": {
    "cliente": {
      "id": "uuid-do-cliente",
      "nome": "João Silva",
      "telefone": "(11) 99999-9999",
      "posicao": 1,
      "status": "finalizado"
    }
  }
}
```

#### **8. Remover Cliente da Fila (BARBEIRO)**
```http
POST /api/fila/remover/{cliente_id}
Authorization: Bearer SEU_TOKEN_JWT
```

#### **9. Verificar Status do Cliente (PÚBLICO)**
```http
GET /api/fila/status/{token}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "cliente": {
      "id": "uuid-do-cliente",
      "nome": "João Silva",
      "status": "aguardando"
    },
    "barbearia": {
      "id": 7,
      "nome": "Lucas Barbearia"
    },
    "posicao_atual": 3,
    "tempo_estimado": 45
  }
}
```

### **⭐ AVALIAÇÕES**

#### **1. Enviar Avaliação (PÚBLICO)**
```http
POST /api/avaliacoes
Content-Type: application/json

{
  "cliente_id": "uuid-do-cliente",
  "barbearia_id": 7,
  "barbeiro_id": "uuid-do-barbeiro",
  "rating": 5,
  "categoria": "atendimento",
  "comentario": "Excelente atendimento!"
}
```

**Categorias disponíveis:** `atendimento`, `qualidade`, `ambiente`, `tempo`, `preco`

#### **2. Listar Avaliações (ADMIN/GERENTE)**
```http
GET /api/avaliacoes?barbearia_id=7&rating_min=4&categoria=atendimento
Authorization: Bearer SEU_TOKEN_JWT
```

**Parâmetros opcionais:**
- `barbearia_id`: Filtrar por barbearia
- `barbeiro_id`: Filtrar por barbeiro
- `categoria`: Filtrar por categoria
- `rating_min`: Rating mínimo (1-5)
- `rating_max`: Rating máximo (1-5)
- `data_inicio`: Data inicial (YYYY-MM-DD)
- `data_fim`: Data final (YYYY-MM-DD)

### **📊 HISTÓRICO**

#### **1. Histórico de Atendimentos (ADMIN/GERENTE/BARBEIRO)**
```http
GET /api/historico?barbearia_id=7&data_inicio=2025-07-01&data_fim=2025-07-31&barbeiro_id=uuid&limit=50&offset=0
Authorization: Bearer SEU_TOKEN_JWT
```

**Parâmetros opcionais:**
- `barbearia_id`: Filtrar por barbearia
- `data_inicio`: Data inicial (YYYY-MM-DD)
- `data_fim`: Data final (YYYY-MM-DD)
- `barbeiro_id`: Filtrar por barbeiro (barbeiros só podem ver seu próprio ID)
- `limit`: Limite de registros (padrão: 50)
- `offset`: Offset para paginação (padrão: 0)

**Comportamento por Role:**
- **ADMIN/GERENTE**: Podem ver todo o histórico, filtrar por qualquer barbeiro
- **BARBEIRO**: Podem ver apenas seu próprio histórico (barbeiro_id é automaticamente definido)

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-do-historico",
      "cliente_id": "uuid-do-cliente",
      "barbeiro_id": "uuid-do-barbeiro",
      "barbearia_id": 7,
      "status": "finalizado",
      "observacoes": "Cliente satisfeito",
      "data_inicio": "2025-07-23T22:00:00.000Z",
      "data_fim": "2025-07-23T22:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 50,
    "offset": 0,
    "hasMore": false
  }
}
```

#### **2. Relatórios e Estatísticas (ADMIN/GERENTE)**
```http
GET /api/historico/relatorios
Authorization: Bearer SEU_TOKEN_JWT
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "total_atendimentos": 150,
    "tempo_medio_atendimento": 30,
    "faturamento_total": 3750.00,
    "atendimentos_por_dia": [
      {
        "data": "2025-07-23",
        "total": 25
      }
    ],
    "top_barbeiros": [
      {
        "barbeiro_id": "uuid-do-barbeiro",
        "nome": "João Silva",
        "total_atendimentos": 45
      }
    ],
    "servicos_mais_populares": [
      {
        "servico": "Corte + Barba",
        "total": 80
      }
    ]
  }
}
```

### **📊 HISTÓRICO (2 endpoints)**
| Método | Endpoint | Role | Descrição |
|--------|----------|------|-----------|
| `GET` | `/api/historico` | ADMIN/GERENTE/BARBEIRO | Histórico de atendimentos |
| `GET` | `/api/historico/relatorios` | ADMIN/GERENTE | Relatórios e estatísticas |

**Nota:** Barbeiros podem ver apenas seu próprio histórico. Se não especificar `barbeiro_id`, automaticamente filtra pelo ID do barbeiro logado.

### **🏥 UTILITÁRIOS**

#### **1. Health Check**
```http
GET /health
```

**Resposta:**
```json
{
  "status": "OK",
  "timestamp": "2025-07-23T21:56:41.156527+00:00"
}
```

#### **2. Informações da API**
```http
GET /
```

**Resposta:**
```json
{
  "message": "Lucas Barbearia API",
  "version": "1.0.0"
}
```

---

## 🚨 **CÓDIGOS DE ERRO**

| Código | Descrição | Exemplo |
|--------|-----------|---------|
| **400** | Dados inválidos | Campos obrigatórios faltando |
| **401** | Não autorizado | Token inválido ou expirado |
| **403** | Acesso negado | Role insuficiente |
| **404** | Recurso não encontrado | Barbearia/usuário não existe |
| **500** | Erro interno do servidor | Problema no banco de dados |

**Exemplo de erro:**
```json
{
  "success": false,
  "error": "Barbearia não encontrada",
  "errorCode": "BARBEARIA_NOT_FOUND",
  "timestamp": "2025-07-23T21:56:41.156527+00:00"
}
```

---

## 🧪 **EXEMPLOS PRÁTICOS**

### **Fluxo Completo de Atendimento**

#### **1. Cliente entra na fila**
```bash
curl -X POST "http://localhost:3000/api/fila/entrar" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "telefone": "(11) 99999-9999",
    "barbearia_id": 7
  }'
```

#### **2. Barbeiro faz login**
```bash
curl -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "barbeiro@lucasbarbearia.com",
    "password": "barbeiro123"
  }'
```

#### **3. Barbeiro vê a fila**
```bash
curl -X GET "http://localhost:3000/api/fila/7" \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

#### **4. Barbeiro chama próximo cliente**
```bash
curl -X POST "http://localhost:3000/api/fila/proximo/7" \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

#### **5. Barbeiro inicia atendimento**
```bash
curl -X POST "http://localhost:3000/api/fila/iniciar-atendimento/uuid-do-cliente" \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

#### **6. Barbeiro finaliza atendimento**
```bash
curl -X POST "http://localhost:3000/api/fila/finalizar" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -d '{
    "cliente_id": "uuid-do-cliente",
    "observacoes": "Cliente satisfeito"
  }'
```

---

## 📝 **NOTAS IMPORTANTES**

### **Para o Frontend:**

1. **Endpoints Públicos** não precisam de autenticação
2. **Endpoints Protegidos** precisam do header `Authorization: Bearer TOKEN`
3. **QR Codes** são retornados em base64 para exibição
4. **Status da fila** segue um fluxo específico
5. **Paginação** está disponível no histórico
6. **Filtros** estão disponíveis em vários endpoints

### **Segurança:**

1. **JWT tokens** expiram automaticamente
2. **Roles** são verificados em cada endpoint
3. **Acesso à barbearia** é restrito por role
4. **Dados sensíveis** não são expostos em endpoints públicos

### **Performance:**

1. **Cache** pode ser implementado para endpoints públicos
2. **Paginação** deve ser usada para listas grandes
3. **Filtros** reduzem a quantidade de dados transferidos

---

## 🔗 **LINKS ÚTEIS**

- **Documentação Swagger**: `http://localhost:3000/documentation`
- **Health Check**: `http://localhost:3000/health`
- **Informações da API**: `http://localhost:3000/`

---

**📅 Última atualização:** 23/07/2025  
**🔄 Versão da API:** 1.0.0  
**👨‍💻 Desenvolvido por:** Equipe Lucas Barbearia 