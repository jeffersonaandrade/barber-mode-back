# 🧪 Testes das Novas APIs de Configuração

## **🔐 1. Login para obter token**

```bash
curl -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@lucasbarbearia.com",
    "password": "admin123"
  }'
```

**Guarde o token retornado para usar nos próximos testes.**

## **📋 2. Testar APIs de Serviços**

### Listar todos os serviços
```bash
curl -X GET "http://localhost:3000/api/configuracoes/servicos" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Criar novo serviço
```bash
curl -X POST "http://localhost:3000/api/configuracoes/servicos" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Corte Degradê",
    "descricao": "Corte moderno com degradê perfeito",
    "preco": 45.00,
    "duracao": 40,
    "categoria": "corte"
  }'
```

### Atualizar serviço
```bash
curl -X PUT "http://localhost:3000/api/configuracoes/servicos/1" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "preco": 40.00,
    "duracao": 35
  }'
```

## **🕐 3. Testar APIs de Horários**

### Listar horários de uma barbearia
```bash
curl -X GET "http://localhost:3000/api/configuracoes/horarios/1" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Atualizar horários
```bash
curl -X PUT "http://localhost:3000/api/configuracoes/horarios/1" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "dia_semana": 1,
      "aberto": true,
      "hora_inicio": "09:00",
      "hora_fim": "19:00"
    },
    {
      "dia_semana": 2,
      "aberto": true,
      "hora_inicio": "09:00",
      "hora_fim": "19:00"
    },
    {
      "dia_semana": 3,
      "aberto": true,
      "hora_inicio": "09:00",
      "hora_fim": "19:00"
    },
    {
      "dia_semana": 4,
      "aberto": true,
      "hora_inicio": "09:00",
      "hora_fim": "19:00"
    },
    {
      "dia_semana": 5,
      "aberto": true,
      "hora_inicio": "09:00",
      "hora_fim": "19:00"
    },
    {
      "dia_semana": 6,
      "aberto": true,
      "hora_inicio": "08:00",
      "hora_fim": "18:00"
    },
    {
      "dia_semana": 0,
      "aberto": false
    }
  ]'
```

## **⚙️ 4. Testar APIs de Configurações Gerais**

### Listar configurações de uma barbearia
```bash
curl -X GET "http://localhost:3000/api/configuracoes/gerais/1" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Atualizar configurações
```bash
curl -X PUT "http://localhost:3000/api/configuracoes/gerais/1" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "tempo_medio_atendimento": 35,
    "max_clientes_fila": 60,
    "permitir_agendamento": true,
    "mostrar_tempo_estimado": true,
    "notificar_whatsapp": true,
    "limpeza_automatica_horas": 24
  }'
```

## **📊 5. Testar API de Configuração Completa**

### Obter todas as configurações de uma barbearia
```bash
curl -X GET "http://localhost:3000/api/configuracoes/completa/1" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## **🧹 6. Testar Limpeza Automática**

### Executar limpeza manual (apenas ADMIN)
```bash
curl -X POST "http://localhost:3000/api/configuracoes/limpeza" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## **📋 7. Verificar Dados no Banco**

### Verificar serviços criados
```sql
SELECT * FROM servicos ORDER BY id;
```

### Verificar horários criados
```sql
SELECT * FROM horarios_funcionamento WHERE barbearia_id = 1 ORDER BY dia_semana;
```

### Verificar configurações criadas
```sql
SELECT * FROM configuracoes_barbearia WHERE barbearia_id = 1 ORDER BY chave;
```

## **🎯 Resultados Esperados**

### ✅ Serviços
- 6 serviços padrão criados
- Preços entre R$ 20,00 e R$ 80,00
- Categorias: corte, barba, combo, tratamento, coloração, pacote

### ✅ Horários
- 7 dias da semana configurados
- Segunda a Sexta: 08:00-18:00
- Sábado: 08:00-17:00
- Domingo: Fechado

### ✅ Configurações
- 6 configurações por barbearia
- Tempo médio: 30 minutos
- Máximo fila: 50 clientes
- WhatsApp: habilitado
- Limpeza automática: 24h

## **🚨 Possíveis Problemas**

### Erro 404 - Rota não encontrada
- Verificar se o servidor está rodando
- Verificar se as rotas foram registradas em `app.js`

### Erro 401 - Não autorizado
- Verificar se o token está correto
- Verificar se o usuário tem permissão (admin/gerente)

### Erro 500 - Erro interno
- Verificar logs do servidor
- Verificar se as tabelas foram criadas corretamente 