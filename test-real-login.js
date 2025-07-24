require('dotenv').config();

async function testRealLogin() {
  try {
    const dbConfig = require('./src/config/database');
    const supabase = dbConfig.supabase;
    
    console.log('🔍 Testando login com usuário real do Supabase...\n');
    
    const email = 'admin@lucasbarbearia.com';
    const password = 'admin123';
    
    // 1. Buscar usuário no banco
    console.log('1️⃣ Buscando usuário no banco...');
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('active', true)
      .single();
    
    if (userError) {
      console.log('❌ Erro ao buscar usuário:', userError.message);
      return;
    }
    
    if (!user) {
      console.log('❌ Usuário não encontrado ou inativo');
      return;
    }
    
    console.log('✅ Usuário encontrado:', {
      id: user.id,
      email: user.email,
      nome: user.nome,
      role: user.role,
      active: user.active,
      hasPasswordHash: !!user.password_hash
    });
    
    // 2. Verificar senha
    console.log('\n2️⃣ Verificando senha...');
    const bcrypt = require('bcrypt');
    const senhaValida = await bcrypt.compare(password, user.password_hash);
    
    console.log('🔐 Senha válida:', senhaValida);
    
    if (!senhaValida) {
      console.log('❌ Senha inválida');
      console.log('💡 Dica: Verifique se a senha foi hasheada corretamente no banco');
      return;
    }
    
    console.log('✅ Login bem-sucedido!');
    
    // 3. Testar geração de token
    console.log('\n3️⃣ Testando geração de token JWT...');
    
    // Simular o fastify.jwt
    const jwt = require('jsonwebtoken');
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      nome: user.nome
    };
    
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '12h'
    });
    
    console.log('✅ Token gerado com sucesso');
    console.log('🔑 Token (primeiros 50 chars):', token.substring(0, 50) + '...');
    
    // 4. Verificar token
    console.log('\n4️⃣ Verificando token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token válido:', {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      nome: decoded.nome
    });
    
  } catch (error) {
    console.log('❌ Erro no teste:', error.message);
  }
}

testRealLogin(); 