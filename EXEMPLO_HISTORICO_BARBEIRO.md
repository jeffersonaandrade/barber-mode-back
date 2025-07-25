# 🧪 Exemplo Prático: Histórico para Barbeiros

## 🎯 **CENÁRIO DE TESTE**

Vamos testar se o barbeiro consegue ver seu próprio histórico após a correção do bug.

---

## 📋 **PASSOS PARA TESTE**

### **1. Login do Barbeiro**
```bash
curl -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "barbeiro@lucasbarbearia.com",
    "password": "barbeiro123"
  }'
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "user": {
      "id": "uuid-do-barbeiro",
      "email": "barbeiro@lucasbarbearia.com",
      "nome": "João Barbeiro",
      "role": "barbeiro"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### **2. Teste 1: Histórico sem especificar barbeiro_id**
```bash
curl -X GET "http://localhost:3000/api/historico" \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

**Comportamento esperado:**
- ✅ **ANTES (bug):** Retornava 403 - Acesso negado
- ✅ **AGORA (corrigido):** Retorna apenas o histórico do barbeiro logado

### **3. Teste 2: Histórico especificando seu próprio barbeiro_id**
```bash
curl -X GET "http://localhost:3000/api/historico?barbeiro_id=uuid-do-barbeiro" \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

**Comportamento esperado:**
- ✅ **ANTES (bug):** Retornava 403 - Acesso negado
- ✅ **AGORA (corrigido):** Retorna o histórico do barbeiro especificado

### **4. Teste 3: Histórico especificando barbeiro_id de outro barbeiro**
```bash
curl -X GET "http://localhost:3000/api/historico?barbeiro_id=uuid-de-outro-barbeiro" \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

**Comportamento esperado:**
- ✅ **ANTES (bug):** Retornava 403 - Acesso negado
- ✅ **AGORA (corrigido):** Retorna 403 - "Você só pode visualizar seu próprio histórico"

### **5. Teste 4: Histórico com filtros adicionais**
```bash
curl -X GET "http://localhost:3000/api/historico?barbearia_id=7&data_inicio=2025-07-01&data_fim=2025-07-31" \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

**Comportamento esperado:**
- ✅ **ANTES (bug):** Retornava 403 - Acesso negado
- ✅ **AGORA (corrigido):** Retorna o histórico do barbeiro logado com os filtros aplicados

---

## 🔍 **VERIFICAÇÃO DOS RESULTADOS**

### **Resposta de Sucesso (Testes 1, 2 e 4):**
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

### **Resposta de Erro (Teste 3):**
```json
{
  "success": false,
  "errorCode": "ACCESS_DENIED",
  "message": "Você só pode visualizar seu próprio histórico",
  "timestamp": "2025-07-23T22:00:00.000Z"
}
```

---

## 🎯 **COMPARAÇÃO: ANTES vs DEPOIS**

| Teste | Antes (Bug) | Depois (Corrigido) |
|-------|-------------|-------------------|
| **Histórico sem barbeiro_id** | ❌ 403 - Acesso negado | ✅ 200 - Histórico próprio |
| **Histórico próprio** | ❌ 403 - Acesso negado | ✅ 200 - Histórico próprio |
| **Histórico de outro** | ❌ 403 - Acesso negado | ✅ 403 - Erro específico |
| **Com filtros** | ❌ 403 - Acesso negado | ✅ 200 - Histórico filtrado |

---

## 🔧 **IMPLEMENTAÇÃO TÉCNICA**

### **Middleware Criado:**
```javascript
async function checkHistoricoAccess(request, reply) {
  const userRole = request.user?.role;
  const userId = request.user?.id;
  const { barbeiro_id } = request.query;

  // Admin e Gerente podem acessar qualquer histórico
  if (hasRole(request.user, ['admin', 'gerente'])) {
    return;
  }

  // Barbeiro só pode ver seu próprio histórico
  if (userRole === 'barbeiro') {
    // Se não foi especificado barbeiro_id, usar o ID do usuário logado
    if (!barbeiro_id) {
      request.query.barbeiro_id = userId;
      return;
    }

    // Se foi especificado um barbeiro_id diferente, bloquear
    if (barbeiro_id !== userId) {
      return reply.status(403).send({
        success: false,
        errorCode: 'ACCESS_DENIED',
        message: 'Você só pode visualizar seu próprio histórico'
      });
    }
  }
}
```

### **Endpoint Atualizado:**
```javascript
fastify.get('/historico', {
  preValidation: [fastify.authenticate, checkHistoricoAccess],
  // ... resto da configuração
});
```

---

## ✅ **CONCLUSÃO**

O bug foi **corrigido com sucesso**! Agora:

- ✅ **Barbeiros podem ver seu próprio histórico**
- ✅ **Segurança mantida** - não podem ver histórico de outros
- ✅ **Flexibilidade** - podem usar filtros normalmente
- ✅ **Compatibilidade** - admin/gerente continuam com acesso total

**Status:** 🐛 **BUG CORRIGIDO** ✅ 