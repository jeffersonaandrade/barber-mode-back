# 🧬 Testes de Mutação - Barber Mode Backend

## 📋 Visão Geral

Os **testes de mutação** são uma técnica avançada que introduz modificações artificiais no código para verificar se os testes realmente validam o comportamento correto, indo além da cobertura superficial.

## 🎯 Por que Testes de Mutação no Barber Mode?

### **1. Lógica de Negócio Crítica**
- **Prioridade da fila**: Tempo vs. barbeiro específico
- **Validações de acesso**: Admin, gerente, barbeiro
- **Cálculos de estatísticas**: Relatórios e métricas
- **Verificações de estado**: Cliente atendido, barbeiro ativo

### **2. Segurança e Controle de Acesso**
- **Middlewares de autenticação**: JWT e roles
- **Verificações de permissão**: Acesso a barbearias específicas
- **Validações de entrada**: Schemas e sanitização

### **3. Integridade dos Dados**
- **Operações de fila**: Adicionar/remover clientes
- **Gestão de barbeiros**: Ativar/desativar
- **Configurações de barbearia**: Criar/atualizar

## 🚀 Como Executar

### **Comandos Disponíveis**

```bash
# Executar todos os testes de mutação
npm run test:mutation

# Testes de mutação específicos por categoria
npm run test:mutation:services    # Apenas serviços
npm run test:mutation:middlewares # Apenas middlewares
npm run test:mutation:routes      # Apenas rotas
```

### **Interpretação dos Resultados**

| Score | Status | Ação Necessária |
|-------|--------|-----------------|
| **> 80%** | 🟢 Excelente | Manter padrão |
| **60-80%** | 🟡 Bom | Melhorar testes |
| **< 60%** | 🔴 Crítico | Refatorar testes |

## 🧪 Exemplos de Mutantes

### **1. FilaService - Lógica de Prioridade**

**Código Original:**
```javascript
if (filaEspecifica.length > 0) {
  return filaEspecifica[0];
} else if (filaGeral.length > 0) {
  return filaGeral[0];
}
```

**Mutantes Possíveis:**
- `filaEspecifica.length > 0` → `filaEspecifica.length >= 0`
- `filaEspecifica.length > 0` → `filaEspecifica.length < 0`
- `return filaEspecifica[0]` → `return null`

### **2. Middleware de Autenticação**

**Código Original:**
```javascript
if (userRole === 'admin' || userRole === 'gerente') {
  return next();
}
return reply.status(403).send({ error: 'Acesso negado' });
```

**Mutantes Possíveis:**
- `userRole === 'admin'` → `userRole !== 'admin'`
- `userRole === 'gerente'` → `userRole !== 'gerente'`
- `return next()` → `return reply.status(403)`

### **3. Validação de Entrada**

**Código Original:**
```javascript
if (!request.body.nome || request.body.nome.trim().length === 0) {
  return reply.status(400).send({ error: 'Nome é obrigatório' });
}
```

**Mutantes Possíveis:**
- `request.body.nome.trim().length === 0` → `request.body.nome.trim().length !== 0`
- `return reply.status(400)` → `return reply.status(200)`

## 📊 Relatórios Gerados

### **1. Relatório HTML**
- Localização: `reports/mutation/html/index.html`
- Visualização interativa dos mutantes
- Detalhes de cada mutação e teste

### **2. Relatório de Texto**
- Saída no console durante execução
- Resumo dos scores por arquivo
- Lista de mutantes sobreviventes

## 🔧 Configuração Avançada

### **Arquivo: `stryker.conf.json`**

```json
{
  "mutate": [
    "src/services/**/*.js",    // Lógica de negócio
    "src/middlewares/**/*.js", // Autenticação e autorização
    "src/routes/**/*.js"       // Endpoints da API
  ],
  "ignorePatterns": [
    "src/app.js",              // Arquivo principal
    "src/config/**",           // Configurações
    "src/plugins/**"           // Plugins do Fastify
  ],
  "thresholds": {
    "high": 80,                // Score mínimo para excelente
    "low": 60,                 // Score mínimo para bom
    "break": 50                // Score mínimo para aceitável
  }
}
```

## 🎯 Estratégia de Implementação

### **Fase 1: Serviços (Alta Prioridade)**
```bash
npm run test:mutation:services
```
- **FilaService**: Lógica de prioridade e gestão de fila
- **UserService**: Operações de usuário
- **BarbeariaService**: Gestão de barbearias
- **AvaliacaoService**: Sistema de avaliações

### **Fase 2: Middlewares (Alta Prioridade)**
```bash
npm run test:mutation:middlewares
```
- **Autenticação**: JWT e validação de token
- **Autorização**: Verificação de roles
- **Acesso**: Controle de acesso a barbearias

### **Fase 3: Rotas (Média Prioridade)**
```bash
npm run test:mutation:routes
```
- **Validação de entrada**: Schemas e sanitização
- **Respostas**: Estrutura e códigos de status
- **Tratamento de erros**: Mensagens e logging

## 📈 Métricas e KPIs

### **Métricas Importantes**
- **Mutation Score**: Percentual de mutantes mortos
- **Test Time**: Tempo de execução dos testes
- **Surviving Mutants**: Mutantes que sobreviveram
- **Killed Mutants**: Mutantes detectados pelos testes

### **Objetivos do Projeto**
- **Score Geral**: > 75%
- **Serviços**: > 85%
- **Middlewares**: > 90%
- **Rotas**: > 70%

## 🛠️ Troubleshooting

### **Problemas Comuns**

1. **Timeout nos Testes**
   ```bash
   # Aumentar timeout no stryker.conf.json
   "timeoutMS": 15000
   ```

2. **Mutantes Sobreviventes**
   - Revisar lógica de negócio
   - Adicionar casos de teste específicos
   - Verificar edge cases

3. **Falsos Positivos**
   - Ajustar configuração de mutantes
   - Excluir código não testável
   - Refatorar lógica complexa

## 🔄 Integração com CI/CD

### **GitHub Actions (Exemplo)**
```yaml
- name: Mutation Tests
  run: |
    npm run test:mutation
    # Falhar se score < 60%
```

### **Thresholds Automáticos**
- **Pull Request**: Score mínimo 60%
- **Main Branch**: Score mínimo 75%
- **Release**: Score mínimo 80%

## 📚 Recursos Adicionais

- [Documentação Stryker](https://stryker-mutator.io/)
- [Guia de Boas Práticas](https://stryker-mutator.io/docs/mutation-testing-elements/supported-mutators/)
- [Exemplos de Configuração](https://stryker-mutator.io/docs/stryker-js/configuration/)

---

**Última Atualização**: Dezembro 2024
**Versão**: 1.0.0 