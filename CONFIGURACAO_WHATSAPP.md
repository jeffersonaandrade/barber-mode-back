# Configuração do Sistema de Notificações WhatsApp

## 📱 Visão Geral

Este sistema integra notificações automáticas via WhatsApp usando:
- **whatsapp-web.js**: Para conexão com WhatsApp Web
- **Groq AI**: Para geração de mensagens inteligentes e personalizadas
- **Sistema de Fila**: Para notificações automáticas baseadas em eventos

## 🔧 Configuração Inicial

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Adicione ao seu arquivo `.env`:

```env
# API Key do Groq (obrigatório)
GROQ_API_KEY=sua_api_key_do_groq

# Outras configurações existentes...
SUPABASE_URL=sua_url_do_supabase
SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
JWT_SECRET=seu_jwt_secret
```

### 3. Obter API Key do Groq

1. Acesse [console.groq.com](https://console.groq.com)
2. Crie uma conta ou faça login
3. Vá para "API Keys"
4. Crie uma nova API key
5. Copie a chave e adicione ao `.env`

## 🚀 Primeira Execução

### 1. Iniciar o Servidor

```bash
npm run dev
```

### 2. Conectar WhatsApp

Na primeira execução, você verá um QR Code no terminal:

```
📱 [WHATSAPP] QR Code gerado. Escaneie com o WhatsApp:
[QR Code aparecerá aqui]
```

1. Abra o WhatsApp no seu celular
2. Vá em **Configurações > Dispositivos Vinculados**
3. Toque em **Vincular um Dispositivo**
4. Escaneie o QR Code que aparece no terminal
5. Aguarde a confirmação: `✅ [WHATSAPP] Cliente WhatsApp conectado e pronto!`

## 📋 Tipos de Notificações

### 1. **Vez Chegou** (`vez_chegou`)
- **Quando**: Cliente é chamado para atendimento
- **Mensagem**: "Sua vez chegou! Dirija-se ao atendimento"

### 2. **Atendimento Iniciado** (`atendimento_iniciado`)
- **Quando**: Barbeiro inicia o atendimento
- **Mensagem**: "Atendimento iniciado! Seu barbeiro está pronto"

### 3. **Atendimento Finalizado** (`atendimento_finalizado`)
- **Quando**: Atendimento é concluído
- **Mensagem**: "Obrigado pela preferência! Volte sempre"

### 4. **Posição na Fila** (`posicao_fila`)
- **Quando**: Cliente entra na fila ou posição muda
- **Mensagem**: "Você está na posição X. Tempo estimado: Y minutos"

## 🔧 Endpoints de Gerenciamento

### Verificar Status
```http
GET /api/whatsapp/status
Authorization: Bearer <token>
```

### Testar Mensagem
```http
POST /api/whatsapp/test
Authorization: Bearer <token>
Content-Type: application/json

{
  "telefone": "11999999999",
  "tipo": "vez_chegou",
  "dados_teste": {
    "cliente": { "nome": "João Silva" },
    "barbearia": { "nome": "Barbearia Lucas" }
  }
}
```

### Reconectar WhatsApp
```http
POST /api/whatsapp/reconnect
Authorization: Bearer <token>
```

### Configurações
```http
GET /api/whatsapp/config
PUT /api/whatsapp/config
Authorization: Bearer <token>
```

### Rate Limiting
```http
# Verificar estatísticas
GET /api/whatsapp/rate-limit/stats
Authorization: Bearer <token>

# Reativar sistema
POST /api/whatsapp/rate-limit/reactivate
Authorization: Bearer <token>

# Listar usuários bloqueados
GET /api/whatsapp/rate-limit/blocked-users
Authorization: Bearer <token>

# Bloquear usuário
POST /api/whatsapp/rate-limit/block-user
Authorization: Bearer <token>
Content-Type: application/json

{
  "telefone": "11999999999",
  "motivo": "spam"
}

# Limpar usuários bloqueados
POST /api/whatsapp/rate-limit/clear-blocked-users
Authorization: Bearer <token>
```

## 🎯 Exemplo de Uso

### 1. Cliente entra na fila
```javascript
// Sistema automaticamente:
// - Adiciona cliente à fila
// - Calcula posição
// - Envia notificação de posição (se configurado)
```

### 2. Barbeiro chama próximo cliente
```javascript
// Sistema automaticamente:
// - Atualiza status para 'próximo'
// - Envia WhatsApp: "Sua vez chegou!"
// - Reordena fila
```

### 3. Barbeiro inicia atendimento
```javascript
// Sistema automaticamente:
// - Atualiza status para 'atendendo'
// - Envia WhatsApp: "Atendimento iniciado!"
```

## ⚙️ Configurações Avançadas

### Personalizar Mensagens

As mensagens são geradas automaticamente pelo Groq AI, mas você pode:

1. **Modificar prompts** em `src/services/whatsappService.js`
2. **Ajustar temperatura** do modelo (0.0 a 1.0)
3. **Alterar modelo** do Groq (llama3-8b-8192, mixtral-8x7b-32768, etc.)

### Configurar Horários

```javascript
// Em /api/whatsapp/config
{
  "notificacoes_ativas": true,
  "tipos_notificacao": ["vez_chegou", "atendimento_iniciado"],
  "horario_inicio": "08:00",
  "horario_fim": "20:00"
}
```

## 🛠️ Solução de Problemas

### WhatsApp não conecta
1. Verifique se o número está ativo
2. Tente reconectar: `POST /api/whatsapp/reconnect`
3. Verifique logs do terminal

### Mensagens não chegam
1. Verifique formato do telefone (deve ter DDD)
2. Confirme se o número tem WhatsApp
3. Teste com endpoint de teste

### Erro do Groq
1. Verifique se `GROQ_API_KEY` está correta
2. Confirme se tem créditos na conta Groq
3. Verifique logs de erro

## 📊 Monitoramento

### Logs Importantes
```
📱 [WHATSAPP] Cliente WhatsApp conectado e pronto!
✅ [WHATSAPP] Notificação enviada para 11999999999
⚠️ [WHATSAPP] Falha ao enviar notificação
❌ [GROQ] Erro ao gerar mensagem
📊 [RATE_LIMIT] Uso registrado
🔄 [RATE_LIMIT] Reset por minuto realizado
🛑 [RATE_LIMIT] Sistema desativado: rate_limit_proximo
```

### Métricas
- Taxa de entrega de mensagens
- Tempo de resposta do Groq
- Status de conexão do WhatsApp
- **Rate limits**: Requests/min, Tokens/min, WhatsApp/min
- **Usuários**: Total ativos, Bloqueados, Limite diário

### Rate Limiting
O sistema implementa proteções robustas baseadas no seu bot:

#### **Limites Groq (80% de segurança):**
- **RPM**: 24 requests/minuto (30 * 0.8)
- **RPD**: 11.520 requests/dia (14.400 * 0.8)
- **TPM**: 4.800 tokens/minuto (6.000 * 0.8)
- **TPD**: 400.000 tokens/dia (500.000 * 0.8)

#### **Limites WhatsApp:**
- **WPM**: 40 mensagens/minuto (50 * 0.8)
- **WPD**: 800 mensagens/dia (1.000 * 0.8)

#### **Limites por Usuário:**
- **Máximo**: 5 notificações por dia por cliente
- **Bloqueio**: 24h após transferência para humano
- **Reset**: Automático à meia-noite

## 🔒 Segurança

- **Autenticação**: Todas as rotas de admin requerem JWT
- **Validação**: Telefones são validados e formatados
- **Logs**: Todas as ações são registradas
- **Fallback**: Mensagens padrão caso Groq falhe

## 🚀 Próximos Passos

1. **Implementar fila de mensagens** para alta demanda
2. **Adicionar templates personalizáveis** por barbearia
3. **Integrar com sistema de agendamento**
4. **Adicionar notificações de promoções**
5. **Implementar relatórios de notificações** 