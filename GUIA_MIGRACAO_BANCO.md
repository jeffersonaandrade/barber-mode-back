# 🗄️ Guia de Migração do Banco de Dados

## **Visão Geral**
Este guia te ajudará a migrar o banco de dados do schema antigo para o novo schema simplificado de forma segura.

## **⚠️ IMPORTANTE - Antes de Começar**

### **1. Backup Obrigatório**
**SEMPRE** faça backup antes de qualquer modificação no banco!

### **2. Ambiente de Teste**
Recomendamos testar primeiro em um ambiente de desenvolvimento.

### **3. Horário de Baixo Tráfego**
Execute a migração em horário de baixo movimento da barbearia.

## **📋 Pré-requisitos**

### **1. Verificar Configuração**
```bash
# Verificar se o .env está configurado
cat .env | grep SUPABASE
```

### **2. Instalar Dependências**
```bash
npm install
```

### **3. Verificar Conexão**
```bash
# Testar conexão com o banco
node -e "
const { supabase } = require('./src/config/database');
supabase.from('users').select('count').then(console.log).catch(console.error);
"
```

## **🚀 Passo a Passo da Migração**

### **Passo 1: Fazer Backup Completo**

```bash
# Executar script de backup
node scripts/backup-database.js
```

**O que acontece:**
- ✅ Backup de todas as tabelas principais
- ✅ Arquivo JSON com todos os dados
- ✅ Resumo em arquivo de texto
- ✅ Timestamp para identificação

**Arquivos criados:**
```
backups/
└── 2024-01-15T10-30-00-000Z/
    ├── backup-completo.json
    └── resumo-backup.txt
```

### **Passo 2: Verificar Estado Atual**

```bash
# Verificar tabelas existentes
node scripts/migrar-banco.js
```

**O que verificar:**
- ✅ Tabelas antigas existem
- ✅ Nenhuma tabela nova já existe
- ✅ Conexão com banco funcionando

### **Passo 3: Executar Migração**

#### **Opção A: Script Automatizado (Recomendado)**
```bash
# Executar migração completa
node scripts/migrar-banco.js
```

#### **Opção B: SQL Manual (Avançado)**
```sql
-- Executar no SQL Editor do Supabase
-- Copiar e colar o conteúdo de: database/migracao_simplificado.sql
```

### **Passo 4: Verificar Migração**

```bash
# Verificar se tudo foi migrado corretamente
node scripts/migrar-banco.js
```

**O que verificar:**
- ✅ Todas as tabelas novas foram criadas
- ✅ Dados foram migrados corretamente
- ✅ Índices foram criados
- ✅ Funções foram criadas

## **📊 Verificações Pós-Migração**

### **1. Verificar Tabelas Novas**

```sql
-- Verificar se as tabelas foram criadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'clientes_fila',
  'atendimentos_contabilizados', 
  'avaliacoes_novas',
  'servicos',
  'horarios_funcionamento',
  'configuracoes_barbearia'
);
```

### **2. Verificar Dados Migrados**

```sql
-- Verificar contagem de registros
SELECT 
  'clientes_fila' as tabela, COUNT(*) as total FROM clientes_fila
UNION ALL
SELECT 'atendimentos_contabilizados', COUNT(*) FROM atendimentos_contabilizados
UNION ALL
SELECT 'avaliacoes_novas', COUNT(*) FROM avaliacoes_novas
UNION ALL
SELECT 'servicos', COUNT(*) FROM servicos
UNION ALL
SELECT 'horarios_funcionamento', COUNT(*) FROM horarios_funcionamento
UNION ALL
SELECT 'configuracoes_barbearia', COUNT(*) FROM configuracoes_barbearia;
```

### **3. Testar APIs**

```bash
# Testar APIs de configuração
curl -X GET "http://localhost:3000/api/configuracoes/servicos" \
  -H "Authorization: Bearer SEU_TOKEN"
```

## **🔧 Configurações Pós-Migração**

### **1. Configurar Limpeza Automática**

```bash
# Testar limpeza manual
node scripts/limpeza-automatica.js
```

### **2. Configurar Cron Job (Linux/Mac)**

```bash
# Adicionar ao crontab para execução diária às 2h da manhã
crontab -e

# Adicionar esta linha:
0 2 * * * cd /caminho/para/seu/projeto && node scripts/limpeza-automatica.js >> logs/limpeza.log 2>&1
```

### **3. Configurar Task Scheduler (Windows)**

```powershell
# Criar tarefa agendada no Windows
SCHTASKS /CREATE /SC DAILY /TN "LimpezaBarbearia" /TR "node C:\caminho\para\scripts\limpeza-automatica.js" /ST 02:00
```

## **🚨 Solução de Problemas**

### **Problema: Erro de Conexão**
```bash
# Verificar variáveis de ambiente
echo $SUPABASE_URL
echo $SUPABASE_ANON_KEY

# Testar conexão
node -e "
const { supabase } = require('./src/config/database');
supabase.from('users').select('count').then(r => console.log('OK')).catch(e => console.error('ERRO:', e.message));
"
```

### **Problema: Tabelas Já Existem**
```sql
-- Remover tabelas se necessário (CUIDADO!)
DROP TABLE IF EXISTS clientes_fila CASCADE;
DROP TABLE IF EXISTS atendimentos_contabilizados CASCADE;
DROP TABLE IF EXISTS avaliacoes_novas CASCADE;
DROP TABLE IF EXISTS servicos CASCADE;
DROP TABLE IF EXISTS horarios_funcionamento CASCADE;
DROP TABLE IF EXISTS configuracoes_barbearia CASCADE;
```

### **Problema: Dados Não Migrados**
```sql
-- Verificar dados antigos
SELECT COUNT(*) FROM clientes;
SELECT COUNT(*) FROM avaliacoes;
SELECT COUNT(*) FROM historico_atendimentos;

-- Migrar manualmente se necessário
INSERT INTO clientes_fila SELECT * FROM clientes WHERE status IN ('aguardando', 'proximo', 'atendendo');
```

### **Problema: Permissões RLS**
```sql
-- Verificar políticas RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('clientes_fila', 'atendimentos_contabilizados', 'avaliacoes_novas');
```

## **📋 Checklist de Migração**

### **Antes da Migração:**
- [ ] Backup completo executado
- [ ] Ambiente de teste configurado
- [ ] Horário de baixo tráfego escolhido
- [ ] Equipe notificada
- [ ] Sistema em manutenção

### **Durante a Migração:**
- [ ] Script de backup executado com sucesso
- [ ] Verificação de tabelas antigas OK
- [ ] Migração SQL executada
- [ ] Verificação de tabelas novas OK
- [ ] Dados migrados corretamente

### **Após a Migração:**
- [ ] APIs testadas
- [ ] Limpeza automática configurada
- [ ] Cron job configurado
- [ ] Sistema testado em produção
- [ ] Equipe treinada nas novas funcionalidades

## **🔄 Rollback (Se Necessário)**

### **1. Restaurar Backup**
```bash
# Se precisar voltar ao estado anterior
# Use o arquivo de backup criado em: backups/TIMESTAMP/backup-completo.json
```

### **2. Remover Tabelas Novas**
```sql
-- Remover tabelas novas (CUIDADO!)
DROP TABLE IF EXISTS clientes_fila CASCADE;
DROP TABLE IF EXISTS atendimentos_contabilizados CASCADE;
DROP TABLE IF EXISTS avaliacoes_novas CASCADE;
DROP TABLE IF EXISTS servicos CASCADE;
DROP TABLE IF EXISTS horarios_funcionamento CASCADE;
DROP TABLE IF EXISTS configuracoes_barbearia CASCADE;
```

### **3. Restaurar Tabelas Antigas**
```sql
-- Se as tabelas antigas foram removidas, recriar
-- Use o arquivo: database/schema.sql
```

## **📞 Suporte**

### **Em Caso de Problemas:**
1. **Verificar logs** do script de migração
2. **Consultar backup** para verificar dados originais
3. **Testar em ambiente** de desenvolvimento
4. **Contatar suporte** com logs e detalhes do erro

### **Informações Úteis:**
- **Arquivo de backup:** `backups/TIMESTAMP/backup-completo.json`
- **Logs de migração:** Console do script
- **Logs de limpeza:** `logs/limpeza.log` (se configurado)

---

**✅ Migração concluída com sucesso!**

O sistema agora está usando o novo schema simplificado com:
- ✅ Limpeza automática de dados
- ✅ Configurações centralizadas
- ✅ Melhor performance
- ✅ Maior privacidade 