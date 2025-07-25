# Políticas RLS (Row Level Security) - Lucas Barbearia

## 📋 **Visão Geral**

Este documento explica as políticas RLS (Row Level Security) implementadas no projeto Lucas Barbearia.

## 🔐 **Políticas Atuais**

### **Desenvolvimento (Permissivas)**
As políticas atuais são **permissivas** para facilitar o desenvolvimento:

```sql
-- Todas as tabelas permitem todas as operações
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations on barbearias" ON barbearias FOR ALL USING (true);
CREATE POLICY "Allow all operations on barbeiros_barbearias" ON barbeiros_barbearias FOR ALL USING (true);
CREATE POLICY "Allow all operations on clientes" ON clientes FOR ALL USING (true);
CREATE POLICY "Allow all operations on avaliacoes" ON avaliacoes FOR ALL USING (true);
CREATE POLICY "Allow all operations on historico_atendimentos" ON historico_atendimentos FOR ALL USING (true);
```

## 🚨 **Problemas Comuns**

### **Erro: "new row violates row-level security policy"**
**Causa:** Políticas RLS restritivas bloqueando operações
**Solução:** Execute o script `fix-rls-policies.sql`

### **Erro: "policy already exists"**
**Causa:** Tentativa de criar política que já existe
**Solução:** Execute primeiro os comandos DROP POLICY

## 🛠️ **Como Aplicar as Políticas**

### **1. Via Schema Principal**
Execute o arquivo `schema.sql` no Supabase SQL Editor:
```sql
-- O schema já inclui as políticas permissivas
-- Execute: database/schema.sql
```

### **2. Via Script de Correção**
Se precisar corrigir políticas existentes:
```sql
-- Execute: database/fix-rls-policies.sql
```

### **3. Manualmente**
```sql
-- Remover políticas existentes
DROP POLICY IF EXISTS "Admin can view all users" ON users;
-- ... (outros DROP POLICY)

-- Criar políticas permissivas
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true);
-- ... (outras políticas)
```

## 🔒 **Políticas para Produção**

Para produção, implemente políticas mais restritivas:

```sql
-- Exemplo de política restritiva para barbearias
CREATE POLICY "Admin can manage barbearias" ON barbearias FOR ALL USING (
  auth.jwt() ->> 'role' = 'admin'
);

CREATE POLICY "Anyone can view active barbearias" ON barbearias FOR SELECT USING (
  ativo = true
);
```

## 📝 **Tabelas com RLS Habilitado**

- ✅ `users`
- ✅ `barbearias`
- ✅ `barbeiros_barbearias`
- ✅ `clientes`
- ✅ `avaliacoes`
- ✅ `historico_atendimentos`

## ⚠️ **Importante**

- **Desenvolvimento:** Use políticas permissivas
- **Produção:** Implemente políticas restritivas baseadas em roles
- **Autenticação Customizada:** As políticas atuais são compatíveis
- **Supabase Auth:** Requer políticas baseadas em `auth.jwt()` e `auth.uid()`

## 🔧 **Comandos Úteis**

### **Verificar políticas existentes:**
```sql
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

### **Remover todas as políticas:**
```sql
DROP POLICY IF EXISTS "Allow all operations on users" ON users;
DROP POLICY IF EXISTS "Allow all operations on barbearias" ON barbearias;
-- ... (repita para todas as tabelas)
```

### **Desabilitar RLS (não recomendado):**
```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE barbearias DISABLE ROW LEVEL SECURITY;
-- ... (repita para todas as tabelas)
``` 