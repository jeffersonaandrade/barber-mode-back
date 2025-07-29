# 🚀 Deploy - Lucas Barbearia Backend

## 📋 Visão Geral

Este documento explica como fazer deploy do sistema Lucas Barbearia Backend em diferentes ambientes, incluindo Vercel, e como funcionam os scripts de segurança implementados.

## ☁️ **Deploy no Vercel**

### **Configuração Automática**
O sistema está configurado para funcionar automaticamente no Vercel **sem necessidade de mudanças**:

```json
// package.json - Vercel usa estes comandos automaticamente
{
  "scripts": {
    "start": "node scripts/start.js",        // ← Vercel usa este
    "build": "echo 'No build step required'" // ← Vercel executa este primeiro
  }
}
```

### **Como Funciona**
1. **Vercel detecta** automaticamente que é um projeto Node.js
2. **Executa** `npm run build` (se existir)
3. **Inicia** com `npm start`
4. **Script inteligente** detecta ambiente Vercel e inicia sem Permission Model

### **Arquivo vercel.json**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/app.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/app.js"
    }
  ]
}
```

### **Deploy Simples**
```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Fazer login
vercel login

# 3. Deploy
vercel

# 4. Para produção
vercel --prod
```

## 🏠 **Desenvolvimento Local**

### **Comandos Disponíveis**
```bash
# ✅ Desenvolvimento normal (sem Permission Model)
npm run dev

# ✅ Desenvolvimento com Permission Model (opcional)
npm run dev:permissions

# ✅ Desenvolvimento com Permission Model (forçado)
npm run dev:secure

# ✅ Produção local normal
npm start

# ✅ Produção local com Permission Model (opcional)
npm run start:secure
```

### **Você NÃO precisa usar comandos manuais**
- ❌ **Não use**: `node --permission=... src/app.js`
- ✅ **Use**: `npm run dev` ou `npm start`

## 🔒 **Como Funciona a Segurança**

### **Script Inteligente (`scripts/start.js`)**
O script detecta automaticamente o ambiente e aplica as configurações apropriadas:

```javascript
// Detecção automática
const isVercel = process.env.VERCEL === '1';
const isProduction = process.env.NODE_ENV === 'production';

// Decisão automática
if (isVercel) {
  // Não usar Permission Model (Vercel gerencia segurança)
} else if (isProduction) {
  // Usar Permission Model se disponível
} else {
  // Iniciar normalmente
}
```

### **Ambientes e Comportamento**

#### **Vercel (Produção)**
- ✅ **Detecta automaticamente** ambiente Vercel
- ✅ **Inicia sem Permission Model** (Vercel gerencia segurança)
- ✅ **Funciona normalmente** sem configuração extra

#### **Produção Local**
- ✅ **Aplica Permission Model** se Node.js 18.6.0+
- ✅ **Permissões restritas** para máxima segurança
- ✅ **Fallback** se Permission Model não disponível

#### **Desenvolvimento**
- ✅ **Inicia normalmente** por padrão
- ✅ **Permission Model opcional** com `npm run dev:permissions`
- ✅ **Flexibilidade** para desenvolvimento

## 📊 **Comparação de Comandos**

### **Antes da Implementação**
```bash
# ❌ Comando manual necessário
node --permission=fs.read=./src,fs.write=./logs,net=localhost:3000 src/app.js
```

### **Após a Implementação**
```bash
# ✅ Comandos simples
npm run dev          # Desenvolvimento normal
npm run start        # Produção inteligente
npm run dev:permissions  # Desenvolvimento com Permission Model
```

## 🚀 **Deploy em Outros Ambientes**

### **Railway**
```json
// railway.json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

### **Heroku**
```json
// Procfile
web: npm start
```

### **DigitalOcean App Platform**
```yaml
# .do/app.yaml
name: lucas-barbearia-backend
services:
- name: web
  source_dir: /
  github:
    repo: seu-usuario/lucas-barbearia-backend
    branch: main
  run_command: npm start
```

### **Docker**
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔧 **Configuração de Variáveis de Ambiente**

### **Vercel**
```bash
# No dashboard do Vercel ou via CLI
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel env add JWT_SECRET
vercel env add NODE_ENV production
```

### **Local**
```bash
# .env
NODE_ENV=development
SUPABASE_URL=sua_url
SUPABASE_ANON_KEY=sua_chave
JWT_SECRET=seu_secret
USE_PERMISSIONS=true  # Para ativar Permission Model em desenvolvimento
```

## 📈 **Monitoramento e Logs**

### **Vercel**
- ✅ **Logs automáticos** no dashboard
- ✅ **Métricas** de performance
- ✅ **Alertas** de erro

### **Local**
```bash
# Ver logs em tempo real
npm run dev

# Verificar status
npm run security:check
```

## 🎯 **Resumo - O que Você Precisa Fazer**

### **Para Deploy no Vercel**
1. **Nada!** O sistema funciona automaticamente
2. **Configure variáveis** de ambiente no Vercel
3. **Deploy** com `vercel --prod`

### **Para Desenvolvimento Local**
1. **Use comandos normais**: `npm run dev` ou `npm start`
2. **Permission Model opcional**: `npm run dev:permissions`
3. **Verificações automáticas**: `npm run security:check`

### **Para Produção Local**
1. **Use**: `npm start` (aplica Permission Model automaticamente)
2. **Ou use**: `npm run start:secure` (força Permission Model)

## ❓ **Perguntas Frequentes**

### **Q: Preciso mudar algo no Vercel?**
**A: Não!** O sistema detecta automaticamente o ambiente Vercel e inicia sem Permission Model.

### **Q: O `npm run build` ainda funciona?**
**A: Sim!** O Vercel executa o build step, mas para Node.js backend não é necessário compilar.

### **Q: Como ativar Permission Model em desenvolvimento?**
**A: Use** `npm run dev:permissions` ou `npm run dev:secure`

### **Q: O sistema fica mais lento com Permission Model?**
**A: Não!** O Permission Model não afeta performance, apenas adiciona segurança.

### **Q: E se o Permission Model falhar?**
**A: O sistema tem fallback** e inicia normalmente sem Permission Model.

---

**🚀 Deploy simplificado!** O sistema funciona automaticamente em qualquer ambiente sem configuração extra. 