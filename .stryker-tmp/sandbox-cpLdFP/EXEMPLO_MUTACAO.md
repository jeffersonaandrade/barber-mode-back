# 🧪 Exemplo Prático - Testes de Mutação

## 🚀 Como Executar

### **1. Teste Completo**
```bash
npm run test:mutation
```

### **2. Teste por Categoria**
```bash
# Apenas serviços (lógica de negócio)
npm run test:mutation:services

# Apenas middlewares (autenticação/autorização)
npm run test:mutation:middlewares

# Apenas rotas (endpoints)
npm run test:mutation:routes
```

## 📊 Exemplo de Resultado

### **Saída Esperada:**
```
[2024-01-XX 10:30:15.123] INFO Stryker Mutator v7.0.0
[2024-01-XX 10:30:15.124] INFO Using config file: stryker.conf.json
[2024-01-XX 10:30:15.125] INFO Starting mutation testing...

[2024-01-XX 10:30:20.456] INFO Mutation testing finished
[2024-01-XX 10:30:20.457] INFO Mutation score: 78.95%

┌─────────────────────────────────────────────────────────────────────────────┐
│ File                    │  % Score │     # Killed │      # Survived │      # Timeout │      # No Coverage │      # Ignored │      # Total │
├─────────────────────────────────────────────────────────────────────────────┤
│ All files              │    78.95 │           15 │              4 │             0 │                 0 │              0 │          19 │
│ src/services/filaService.js │    85.71 │            6 │              1 │             0 │                 0 │              0 │           7 │
│ src/middlewares/auth.js │    90.00 │            9 │              1 │             0 │                 0 │              0 │          10 │
│ src/routes/fila/entrar.js │    66.67 │            2 │              1 │             0 │                 0 │              0 │           3 │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 🎯 Interpretação dos Resultados

### **Score: 78.95%** 🟡
- **Status**: Bom, mas pode melhorar
- **Ação**: Revisar testes dos arquivos com score baixo

### **Análise por Arquivo:**

| Arquivo | Score | Status | Ação |
|---------|-------|--------|------|
| `filaService.js` | 85.71% | 🟢 Excelente | Manter |
| `auth.js` | 90.00% | 🟢 Excelente | Manter |
| `entrar.js` | 66.67% | 🟡 Bom | Melhorar |

## 🔍 Mutantes Sobreviventes

### **Exemplo de Mutante Sobrevivente:**
```
src/services/filaService.js:45:1
- if (filaEspecifica.length > 0) {
+ if (filaEspecifica.length >= 0) {
```

**Problema**: O teste não detectou essa mudança
**Solução**: Adicionar teste específico para array vazio

## 📈 Melhorando o Score

### **1. Adicionar Teste Específico**
```javascript
// tests/services/filaService.test.js
test('deve retornar null quando fila específica está vazia', async () => {
  const mockFilaEspecifica = [];
  const mockFilaGeral = [{ id: 1, nome: 'Cliente A' }];
  
  // Mock do Supabase para retornar filas vazias
  global.supabase.from.mockReturnValue({
    select: jest.fn().mockResolvedValue({ data: mockFilaEspecifica })
  });
  
  const resultado = await FilaService.obterProximoCliente(1);
  expect(resultado).toBeNull();
});
```

### **2. Executar Novamente**
```bash
npm run test:mutation:services
```

### **3. Verificar Melhoria**
```
src/services/filaService.js │    92.86 │            6 │              0 │             0 │                 0 │              0 │           7 │
```

## 🎯 Objetivos do Projeto

### **Metas de Score:**
- **Geral**: > 75% ✅ (78.95%)
- **Serviços**: > 85% ✅ (85.71%)
- **Middlewares**: > 90% ✅ (90.00%)
- **Rotas**: > 70% ⚠️ (66.67%)

### **Próximos Passos:**
1. Melhorar testes das rotas
2. Adicionar casos edge para filaService
3. Revisar validações de entrada

## 📁 Relatórios Gerados

### **Relatório HTML:**
- Localização: `reports/mutation/html/index.html`
- Abrir no navegador para visualização detalhada
- Mostra cada mutante e seus testes

### **Relatório de Texto:**
- Saída no console
- Resumo rápido dos scores
- Lista de mutantes sobreviventes

## 🔄 Integração com Desenvolvimento

### **Workflow Recomendado:**
1. Desenvolver funcionalidade
2. Escrever testes unitários
3. Executar testes de mutação
4. Melhorar testes se score < 80%
5. Commit e push

### **Git Hook (Opcional):**
```bash
# .git/hooks/pre-commit
npm run test:mutation:services
if [ $? -ne 0 ]; then
  echo "Testes de mutação falharam. Score muito baixo."
  exit 1
fi
```

---

**Dica**: Execute os testes de mutação regularmente para manter a qualidade do código! 