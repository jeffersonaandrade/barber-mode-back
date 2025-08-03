# 🔒 Node.js Permission Model - Lucas Barbearia

## 📋 Visão Geral

O **Node.js Permission Model** é um sistema de segurança introduzido no Node.js 18.6.0 que permite controlar quais recursos o aplicativo pode acessar, seguindo o princípio de **menor privilégio** (least privilege principle).

## 🛡️ Como Funciona

### **Princípio Básico**
- Por padrão, o Node.js tem **todas as permissões**
- Com `--permission`, você **restringe** explicitamente o que o aplicativo pode fazer
- Se o código tentar acessar algo não permitido, o Node.js **bloqueia** e gera erro

### **Exemplo Básico**
```bash
# Sem permissões restritas (comportamento padrão)
node app.js

# Com permissões restritas
node --permission=fs.read=./logs,fs.write=./logs,net=localhost:3000 app.js
```

## 🚀 Implementação no Lucas Barbearia

### **1. Script de Inicialização Segura**
```bash
# Iniciar com permissões restritas
npm run start:secure

# Desenvolvimento com permissões restritas
npm run dev:secure
```

### **2. Configurações por Ambiente**

#### **Desenvolvimento**
```javascript
// config/permissions.js
development: {
  fsRead: ['./src', './database', './node_modules', './.env'],
  fsWrite: ['./logs', './uploads', './temp', './coverage'],
  net: ['localhost:*', 'api.supabase.co', 'supabase.co'],
  process: true,    // Permitido em desenvolvimento
  worker: true      // Permitido em desenvolvimento
}
```

#### **Produção**
```javascript
production: {
  fsRead: ['./src', './database', './node_modules', './.env'],
  fsWrite: ['./logs', './uploads'],
  net: ['localhost:3000', 'api.supabase.co', 'supabase.co'],
  process: false,   // Bloqueado em produção
  worker: false     // Bloqueado em produção
}
```

## 🔧 Tipos de Permissões

### **1. Sistema de Arquivos (fs)**
```bash
# Leitura de arquivos
--permission=fs.read=/path/to/directory

# Escrita de arquivos
--permission=fs.write=/path/to/directory

# Leitura e escrita
--permission=fs.read=/app,fs.write=/app/logs
```

### **2. Rede (net)**
```bash
# Acesso a localhost
--permission=net=localhost

# Acesso a portas específicas
--permission=net=localhost:3000,localhost:5432

# Acesso a domínios específicos
--permission=net=api.supabase.co
```

### **3. Processo (process)**
```bash
# Acesso ao processo (desabilitado por segurança)
--permission=process
```

### **4. Worker Threads (worker)**
```bash
# Acesso a worker threads (desabilitado por segurança)
--permission=worker
```

## 📊 Configurações Implementadas

### **Ambiente de Desenvolvimento**
```bash
node --permission=fs.read=./src,fs.read=./database,fs.read=./scripts,fs.read=./tests,fs.read=./node_modules,fs.read=./package.json,fs.read=./package-lock.json,fs.read=./.env,fs.read=./env.example,fs.read=/home/user,fs.read=/tmp,fs.write=./logs,fs.write=./uploads,fs.write=./temp,fs.write=./coverage,fs.write=/tmp,net=localhost:3000,net=localhost:5432,net=api.supabase.co,net=supabase.co,net=127.0.0.1:3000,net=127.0.0.1:5432,net=localhost:*,net=127.0.0.1:*,process,worker src/app.js
```

### **Ambiente de Produção**
```bash
node --permission=fs.read=./src,fs.read=./database,fs.read=./node_modules,fs.read=./package.json,fs.read=./.env,fs.write=./logs,fs.write=./uploads,fs.write=/tmp,net=localhost:3000,net=api.supabase.co,net=supabase.co src/app.js
```

## 🚀 Como Usar

### **1. Inicialização Manual**
```bash
# Desenvolvimento
npm run start:secure

# Produção
NODE_ENV=production npm run start:secure
```

### **2. Desenvolvimento com Hot Reload**
```bash
# Desenvolvimento com nodemon
npm run dev:secure
```

### **3. Verificação de Configuração**
```bash
# Verificar configuração de permissões
npm run security:check
```

## 🔍 Exemplos de Uso

### **Exemplo 1: Acesso Restrito a Arquivos**
```javascript
// ❌ Isso falhará se não tiver permissão
const fs = require('fs');
fs.readFileSync('/etc/passwd'); // Erro: Permission denied

// ✅ Isso funcionará se tiver permissão
fs.readFileSync('./logs/app.log'); // OK se ./logs estiver permitido
```

### **Exemplo 2: Acesso Restrito à Rede**
```javascript
// ❌ Isso falhará se não tiver permissão
const https = require('https');
https.get('https://malicious-site.com', () => {}); // Erro: Permission denied

// ✅ Isso funcionará se tiver permissão
https.get('https://api.supabase.co', () => {}); // OK se api.supabase.co estiver permitido
```

### **Exemplo 3: Acesso Restrito ao Processo**
```javascript
// ❌ Isso falhará se process não estiver permitido
process.exit(1); // Erro: Permission denied

// ✅ Isso funcionará se process estiver permitido
console.log(process.pid); // OK se process estiver permitido
```

## ⚠️ Tratamento de Erros

### **Erro de Permissão**
```javascript
// Quando uma permissão é negada
try {
  fs.readFileSync('/etc/passwd');
} catch (error) {
  if (error.code === 'ERR_PERMISSION_DENIED') {
    console.error('Acesso negado: arquivo não permitido');
  }
}
```

### **Verificação de Permissões**
```javascript
// Verificar se uma permissão está disponível
const { permission } = require('node:process');

if (permission.has('fs.read')) {
  console.log('Permissão de leitura disponível');
}

if (permission.has('net')) {
  console.log('Permissão de rede disponível');
}
```

## 🔧 Configuração Avançada

### **Personalizar Permissões**
Edite o arquivo `config/permissions.js`:

```javascript
// Adicionar novo ambiente
const customEnv = {
  fsRead: ['./src', './custom'],
  fsWrite: ['./logs'],
  net: ['localhost:3000'],
  process: false,
  worker: false
};

PERMISSION_LEVELS.custom = customEnv;
```

### **Permissões Dinâmicas**
```javascript
// Verificar permissões em tempo de execução
const { permission } = require('node:process');

function safeFileOperation(path) {
  if (permission.has('fs.read')) {
    return fs.readFileSync(path);
  } else {
    throw new Error('Permissão de leitura não disponível');
  }
}
```

## 📊 Benefícios de Segurança

### **Antes do Permission Model**
- ❌ Acesso irrestrito ao sistema de arquivos
- ❌ Conexões de rede para qualquer host
- ❌ Controle total do processo
- ❌ Possibilidade de execução de código malicioso

### **Com Permission Model**
- ✅ Acesso restrito apenas a diretórios necessários
- ✅ Conexões de rede apenas para hosts permitidos
- ✅ Controle limitado do processo
- ✅ Isolamento de recursos do sistema

## 🚨 Considerações Importantes

### **1. Compatibilidade**
- Requer Node.js 18.6.0+
- Algumas bibliotecas podem não funcionar com permissões restritas
- Teste sempre em ambiente de desenvolvimento

### **2. Debugging**
```bash
# Executar com debug para ver permissões
NODE_OPTIONS="--permission=fs.read=./src --trace-permissions" node app.js
```

### **3. Migração Gradual**
1. **Fase 1**: Teste em desenvolvimento
2. **Fase 2**: Teste em staging
3. **Fase 3**: Implemente em produção

## 📚 Recursos Adicionais

- [Node.js Permission Model Documentation](https://nodejs.org/api/permissions.html)
- [Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Permission Model Examples](https://github.com/nodejs/node/tree/main/test/permission)

## 🎯 Próximos Passos

1. **Testar configurações**: Execute `npm run start:secure`
2. **Ajustar permissões**: Modifique `config/permissions.js` conforme necessário
3. **Monitorar logs**: Verifique se há erros de permissão
4. **Documentar mudanças**: Registre quais permissões são necessárias

---

**🔒 Segurança é prioridade!** O Permission Model adiciona uma camada extra de proteção ao sistema. 