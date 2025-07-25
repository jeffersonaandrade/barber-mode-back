# Gerenciamento de Barbeiros - Lucas Barbearia

## 📋 **Visão Geral**

Este documento descreve o sistema de gerenciamento de barbeiros implementado na Lucas Barbearia, onde **o barbeiro controla 100% seu próprio status** e **só pode estar ativo em uma barbearia por vez**.

## 🔒 **Regra Principal**

**"Um barbeiro ativo em apenas uma barbearia"**

- ✅ Um barbeiro pode estar ativo em **apenas uma** barbearia simultaneamente
- ✅ Um barbeiro pode estar **inativo** em múltiplas barbearias
- ✅ **Barbeiro controla 100%** seu próprio status (ativar/desativar)
- ✅ **Admin apenas visualiza** o status dos barbeiros (não pode ativar/desativar)

## 🛠️ **Endpoints Disponíveis**

### **Para Barbeiro (Controle Próprio Status)**

#### **1. Ver Meu Status**
```http
GET /api/users/barbeiros/meu-status
Authorization: Bearer <token>
```

**Permissão:** Barbeiro (próprio usuário)

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-do-barbeiro",
    "email": "joao@lucasbarbearia.com",
    "nome": "João Silva",
    "telefone": "11999999999",
    "role": "barbeiro",
    "active": true,
    "barbearias": [
      {
        "barbearia_id": 1,
        "ativo": true,
        "especialidade": "Corte masculino",
        "dias_trabalho": ["segunda", "terca", "quarta"],
        "horario_inicio": "08:00",
        "horario_fim": "18:00",
        "barbearias": {
          "nome": "Lucas Barbearia - Centro",
          "endereco": "Rua das Flores, 123",
          "ativo": true
        }
      }
    ]
  }
}
```

#### **2. Ativar em Barbearia**
```http
POST /api/users/barbeiros/ativar
Authorization: Bearer <token>
Content-Type: application/json
```

**Permissão:** Barbeiro (próprio usuário)

**Body:**
```json
{
  "barbearia_id": 1,
  "especialidade": "Corte masculino premium",
  "dias_trabalho": ["segunda", "terca", "quarta", "quinta", "sexta"],
  "horario_inicio": "08:00",
  "horario_fim": "18:00"
}
```

**Campos obrigatórios:**
- `barbearia_id` (integer): ID da barbearia

**Campos opcionais:**
- `especialidade` (string): Especialidade do barbeiro
- `dias_trabalho` (array): Dias da semana que trabalha
- `horario_inicio` (string): Horário de início (formato HH:MM)
- `horario_fim` (string): Horário de fim (formato HH:MM)

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Você foi ativado com sucesso na barbearia Lucas Barbearia - Centro",
  "data": {
    "id": "uuid-da-relacao",
    "user_id": "uuid-do-barbeiro",
    "barbearia_id": 1,
    "especialidade": "Corte masculino premium",
    "dias_trabalho": ["segunda", "terca", "quarta", "quinta", "sexta"],
    "horario_inicio": "08:00",
    "horario_fim": "18:00",
    "ativo": true,
    "barbearias": {
      "nome": "Lucas Barbearia - Centro",
      "endereco": "Rua das Flores, 123"
    }
  }
}
```

**Resposta de Erro (Já ativo em outra barbearia):**
```json
{
  "success": false,
  "error": "Você já está ativo na barbearia 'Lucas Barbearia - Zona Norte'. Desative-se primeiro para ativar em outra barbearia.",
  "code": "BARBEIRO_JA_ATIVO",
  "barbearia_atual": "Lucas Barbearia - Zona Norte"
}
```

#### **3. Desativar de Barbearia**
```http
POST /api/users/barbeiros/desativar
Authorization: Bearer <token>
Content-Type: application/json
```

**Permissão:** Barbeiro (próprio usuário)

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
  "message": "Você foi desativado com sucesso da barbearia Lucas Barbearia - Centro",
  "data": {
    "id": "uuid-da-relacao",
    "user_id": "uuid-do-barbeiro",
    "barbearia_id": 1,
    "ativo": false,
    "barbearias": {
      "nome": "Lucas Barbearia - Centro"
    }
  }
}
```

### **Para Admin/Gerente (Apenas Visualização)**

#### **4. Listar Barbeiros com Status**
```http
GET /api/users/barbeiros
Authorization: Bearer <token>
```

**Permissão:** Admin, Gerente

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-do-barbeiro",
      "email": "joao@lucasbarbearia.com",
      "nome": "João Silva",
      "telefone": "11999999999",
      "role": "barbeiro",
      "active": true,
      "created_at": "2024-01-15T10:30:00Z",
      "barbearias": [
        {
          "barbearia_id": 1,
          "ativo": true,
          "especialidade": "Corte masculino",
          "dias_trabalho": ["segunda", "terca", "quarta"],
          "horario_inicio": "08:00",
          "horario_fim": "18:00",
          "barbearias": {
            "nome": "Lucas Barbearia - Centro",
            "endereco": "Rua das Flores, 123"
          }
        }
      ]
    }
  ]
}
```

#### **5. Listar Barbeiros Disponíveis**
```http
GET /api/users/barbeiros/disponiveis?barbearia_id=1
Authorization: Bearer <token>
```

**Permissão:** Admin, Gerente, Barbeiro

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-do-barbeiro",
      "email": "maria@lucasbarbearia.com",
      "nome": "Maria Santos",
      "telefone": "11888888888",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Nota:** Retorna apenas barbeiros que **NÃO estão ativos em nenhuma barbearia**.

#### **6. Listar Barbeiros Ativos na Barbearia**
```http
GET /api/users/barbeiros/ativos?barbearia_id=1
Authorization: Bearer <token>
```

**Permissão:** Admin, Gerente, Barbeiro

**Parâmetros:**
- `barbearia_id` (query): ID da barbearia

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-do-barbeiro",
      "nome": "João Silva",
      "email": "joao@lucasbarbearia.com",
      "telefone": "11999999999",
      "especialidade": "Corte masculino premium",
      "dias_trabalho": ["segunda", "terca", "quarta", "quinta", "sexta"],
      "horario_inicio": "08:00",
      "horario_fim": "18:00"
    }
  ]
}
```

**Nota:** Retorna barbeiros que estão **ATIVOS na barbearia específica** (usado para seleção na fila).

### **Gerenciamento de Fila**

#### **7. Adicionar Cliente à Fila**
```http
POST /api/fila/entrar
Authorization: Bearer <token>
Content-Type: application/json
```

**Permissão:** Admin, Gerente, Barbeiro

**Body:**
```json
{
  "nome": "João Silva",
  "telefone": "11999999999",
  "barbearia_id": 7,
  "barbeiro_id": "uuid-do-barbeiro-especifico"
}
```

**Campos obrigatórios:**
- `nome` (string): Nome completo do cliente
- `telefone` (string): Telefone do cliente
- `barbearia_id` (integer): ID da barbearia

**Campos opcionais:**
- `barbeiro_id` (string): ID do barbeiro específico (se não informado, entra na fila geral)

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Cliente adicionado à fila com sucesso",
  "data": {
    "cliente": {
      "id": "uuid-do-cliente",
      "nome": "João Silva",
      "telefone": "11999999999",
      "token": "token-unico",
      "barbearia_id": 7,
      "barbeiro_id": "uuid-do-barbeiro",
      "status": "aguardando",
      "posicao": 1
    },
    "qr_code_fila": "data:image/png;base64,...",
    "qr_code_status": "data:image/png;base64,...",
    "posicao": 1
  }
}
```

**Nota:** Este endpoint permite que barbeiros adicionem clientes à fila, seja na fila geral ou para um barbeiro específico.

#### **8. Obter Fila da Barbearia**
```http
GET /api/fila/{barbearia_id}
Authorization: Bearer <token>
```

**Permissão:** Admin, Gerente, Barbeiro

**Parâmetros:**
- `barbearia_id` (path): ID da barbearia

**Resposta de Sucesso:**
```json
{
  "success": true,
  "data": {
    "clientes": [
      {
        "id": "uuid-do-cliente",
        "nome": "João Silva",
        "telefone": "11999999999",
        "token": "token-unico",
        "barbearia_id": 7,
        "barbeiro_id": "uuid-do-barbeiro",
        "status": "aguardando",
        "posicao": 1,
        "created_at": "2024-01-15T10:30:00Z",
        "barbeiro": {
          "nome": "Carlos Barbeiro"
        }
      }
    ],
    "estatisticas": {
      "total_clientes": 5,
      "aguardando": 3,
      "proximo": 1,
      "atendendo": 1,
      "tempo_estimado": 90,
      "barbeiros_ativos": 2
    }
  }
}
```

**Nota:** Este endpoint retorna a fila atual da barbearia com estatísticas em tempo real.

#### **9. Chamar Próximo Cliente**
```http
POST /api/barbearias/{barbearia_id}/fila/proximo
Authorization: Bearer <token>
```

**Permissão:** Admin, Gerente, Barbeiro

**Parâmetros:**
- `barbearia_id` (path): ID da barbearia

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Próximo cliente chamado",
  "data": {
    "id": "uuid-do-cliente",
    "nome": "João Silva",
    "telefone": "11999999999",
    "status": "proximo",
    "posicao": 1,
    "barbeiro_id": "uuid-do-barbeiro",
    "data_atendimento": "2024-01-15T10:30:00Z"
  }
}
```

**Nota:** Este endpoint chama o próximo cliente da fila para o barbeiro autenticado. O sistema automaticamente busca clientes da fila geral ou específica do barbeiro.

## 🔄 **Fluxo de Ativação**

### **Cenário 1: Primeira Ativação**
1. Barbeiro ativa em uma barbearia
2. ✅ Barbeiro fica ativo na barbearia

### **Cenário 2: Mudança de Barbearia**
1. Barbeiro está ativo na Barbearia A
2. Barbeiro ativa na Barbearia B
3. ✅ Sistema automaticamente desativa da Barbearia A
4. ✅ Barbeiro fica ativo apenas na Barbearia B

### **Cenário 3: Pausa Temporária**
1. Barbeiro está ativo na Barbearia A
2. Barbeiro desativa da Barbearia A
3. ✅ Barbeiro fica sem barbearia ativa
4. ✅ Pode ativar em qualquer barbearia depois

## 🚨 **Validações Implementadas**

### **Ao Ativar:**
- ✅ Verifica se o usuário é um barbeiro
- ✅ Verifica se a barbearia existe e está ativa
- ✅ Verifica se o barbeiro já está ativo em outra barbearia
- ✅ Desativa automaticamente de outras barbearias
- ✅ Cria/atualiza registro na tabela `barbeiros_barbearias`

### **Ao Desativar:**
- ✅ Verifica se o usuário é um barbeiro
- ✅ Verifica se o barbeiro está ativo na barbearia especificada
- ✅ Desativa o barbeiro da barbearia

## 📊 **Estrutura do Banco**

### **Tabela `barbeiros_barbearias`:**
```sql
CREATE TABLE barbeiros_barbearias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  barbearia_id INTEGER REFERENCES barbearias(id) ON DELETE CASCADE,
  especialidade VARCHAR(255),
  dias_trabalho JSONB NOT NULL DEFAULT '[]',
  horario_inicio TIME NOT NULL,
  horario_fim TIME NOT NULL,
  ativo BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, barbearia_id)
);
```

### **Campos Importantes:**
- `ativo`: Controla se o barbeiro está ativo na barbearia (Barbeiro controla)
- `user_id + barbearia_id`: Relacionamento único

## 🎯 **Casos de Uso**

### **1. Início de Trabalho**
```bash
# Barbeiro chega na barbearia e se ativa
curl -X POST "http://localhost:3000/api/users/barbeiros/ativar" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_BARBEIRO" \
  -d '{
    "barbearia_id": 1,
    "especialidade": "Corte masculino",
    "dias_trabalho": ["segunda", "terca", "quarta", "quinta", "sexta"],
    "horario_inicio": "08:00",
    "horario_fim": "18:00"
  }'
```

### **2. Mudança de Barbearia**
```bash
# Barbeiro vai trabalhar em outra barbearia
curl -X POST "http://localhost:3000/api/users/barbeiros/ativar" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_BARBEIRO" \
  -d '{
    "barbearia_id": 2
  }'
```

### **3. Fim de Trabalho**
```bash
# Barbeiro termina o trabalho
curl -X POST "http://localhost:3000/api/users/barbeiros/desativar" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_BARBEIRO" \
  -d '{
    "barbearia_id": 1
  }'
```

## 🧪 **Testes com cURL**

### **Pré-requisitos**
1. Obtenha um token JWT de barbeiro:
```bash
curl -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "barbeiro@lucasbarbearia.com",
    "password": "senha123"
  }'
```

2. Obtenha um token JWT de admin:
```bash
curl -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@lucasbarbearia.com",
    "password": "senha123"
  }'
```

3. Substitua `SEU_TOKEN_BARBEIRO` e `SEU_TOKEN_ADMIN` nos comandos abaixo pelos tokens obtidos

### **1. Ver Meu Status (Barbeiro)**
```bash
curl -X GET "http://localhost:3000/api/users/barbeiros/meu-status" \
  -H "Authorization: Bearer SEU_TOKEN_BARBEIRO"
```

### **2. Ativar em Barbearia (Barbeiro)**
```bash
curl -X POST "http://localhost:3000/api/users/barbeiros/ativar" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_BARBEIRO" \
  -d '{
    "barbearia_id": 1,
    "especialidade": "Corte masculino premium",
    "dias_trabalho": ["segunda", "terca", "quarta", "quinta", "sexta"],
    "horario_inicio": "08:00",
    "horario_fim": "18:00"
  }'
```

### **3. Desativar de Barbearia (Barbeiro)**
```bash
curl -X POST "http://localhost:3000/api/users/barbeiros/desativar" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_BARBEIRO" \
  -d '{
    "barbearia_id": 1
  }'
```

### **4. Listar Barbeiros (Admin)**
```bash
curl -X GET "http://localhost:3000/api/users/barbeiros" \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN"
```

### **5. Listar Barbeiros Disponíveis (Admin/Barbeiro)**
```bash
curl -X GET "http://localhost:3000/api/users/barbeiros/disponiveis?barbearia_id=1" \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN"
```

### **6. Listar Barbeiros Ativos na Barbearia (Admin/Barbeiro)**
```bash
curl -X GET "http://localhost:3000/api/users/barbeiros/ativos?barbearia_id=1" \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN"
```

### **7. Adicionar Cliente à Fila**
```bash
curl -X POST "http://localhost:3000/api/fila/entrar" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_BARBEIRO" \
  -d '{
    "nome": "João Silva",
    "telefone": "11999999999",
    "barbearia_id": 7,
    "barbeiro_id": "uuid-do-barbeiro-especifico"
  }'
```

**Nota:** O campo `barbeiro_id` é opcional. Se não informado, o cliente entra na "Fila Geral" e pode ser atendido por qualquer barbeiro ativo.

### **8. Obter Fila da Barbearia**
```bash
curl -X GET "http://localhost:3000/api/fila/7" \
  -H "Authorization: Bearer SEU_TOKEN_BARBEIRO"
```

### **9. Chamar Próximo Cliente**
```bash
curl -X POST "http://localhost:3000/api/barbearias/7/fila/proximo" \
  -H "Authorization: Bearer SEU_TOKEN_BARBEIRO"
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Próximo cliente chamado",
  "data": {
    "id": "uuid-do-cliente",
    "nome": "João Silva",
    "telefone": "11999999999",
    "status": "proximo",
    "posicao": 1,
    "barbeiro_id": "uuid-do-barbeiro",
    "data_atendimento": "2024-01-15T10:30:00Z"
  }
}
```

### **10. Teste de Validação (Barbeiro já ativo)**
```bash
# Primeiro, ative em uma barbearia
curl -X POST "http://localhost:3000/api/users/barbeiros/ativar" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_BARBEIRO" \
  -d '{
    "barbearia_id": 1
  }'

# Depois, tente ativar em outra (deve dar erro)
curl -X POST "http://localhost:3000/api/users/barbeiros/ativar" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_BARBEIRO" \
  -d '{
    "barbearia_id": 2
  }'
```

### **11. Teste de Transferência Automática**
```bash
# Ativar na barbearia 1
curl -X POST "http://localhost:3000/api/users/barbeiros/ativar" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_BARBEIRO" \
  -d '{
    "barbearia_id": 1
  }'

# Ativar na barbearia 2 (deve desativar automaticamente da barbearia 1)
curl -X POST "http://localhost:3000/api/users/barbeiros/ativar" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_BARBEIRO" \
  -d '{
    "barbearia_id": 2
  }'
```

## 🔧 **Implementação Técnica**

### **Lógica de Validação:**
```javascript
// Verificar se barbeiro já está ativo em outra barbearia
const { data: barbeiroAtivo } = await supabase
  .from('barbeiros_barbearias')
  .select('barbearia_id, ativo, barbearias!inner(nome)')
  .eq('user_id', userId)
  .eq('ativo', true)
  .neq('barbearia_id', barbearia_id)
  .single();

if (barbeiroAtivo) {
  return reply.status(400).send({
    success: false,
    error: `Você já está ativo na barbearia '${barbeiroAtivo.barbearias.nome}'. Desative-se primeiro para ativar em outra barbearia.`,
    code: 'BARBEIRO_JA_ATIVO',
    barbearia_atual: barbeiroAtivo.barbearias.nome
  });
}
```

### **Desativação Automática:**
```javascript
// Desativar barbeiro em todas as outras barbearias
await supabase
  .from('barbeiros_barbearias')
  .update({ ativo: false })
  .eq('user_id', userId);
```

## 📝 **Notas Importantes**

1. **Barbeiro controla 100%** seu próprio status
2. **Admin apenas visualiza** o status dos barbeiros
3. **Uma barbearia ativa por vez** - regra principal
4. **Transferência automática** desativa da barbearia anterior
5. **Validação em tempo real** impede ativação dupla

## 🚀 **Próximos Passos**

- [ ] Implementar notificações para mudanças de status
- [ ] Adicionar histórico de ativações/desativações
- [ ] Criar dashboard para visualização de status
- [ ] Implementar agendamento automático baseado em disponibilidade 