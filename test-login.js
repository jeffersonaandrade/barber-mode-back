const bcrypt = require('bcrypt');

// Simular o teste de hash da senha
async function testPasswordHash() {
  const password = 'admin123';
  const storedHash = '$2b$12$IPjUL7HPYFXwsvKsZ1PtbuAq5ldfspojv/RAfXeHrQO9dI.iwJMAe'; // Hash do mock
  
  console.log('🔍 Testando hash da senha...');
  console.log('Senha:', password);
  console.log('Hash armazenado:', storedHash);
  
  const isValid = await bcrypt.compare(password, storedHash);
  console.log('✅ Hash válido:', isValid);
  
  // Gerar novo hash para comparação
  const newHash = await bcrypt.hash(password, 12);
  console.log('🆕 Novo hash gerado:', newHash);
  
  const isNewValid = await bcrypt.compare(password, newHash);
  console.log('✅ Novo hash válido:', isNewValid);
}

// Testar se o problema está na consulta do banco
async function testDatabaseQuery() {
  try {
    const dbConfig = require('./src/config/database');
    const supabase = dbConfig.supabase;
    
    if (!supabase) {
      console.log('❌ Supabase não configurado');
      return;
    }
    
    console.log('🔍 Consultando usuário no banco...');
    
    // Consultar usuário específico
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'admin@lucasbarbearia.com')
      .single();
    
    if (error) {
      console.log('❌ Erro na consulta:', error);
      return;
    }
    
    if (!data) {
      console.log('❌ Usuário não encontrado no banco');
      return;
    }
    
    console.log('✅ Usuário encontrado:', {
      id: data.id,
      email: data.email,
      nome: data.nome,
      role: data.role,
      active: data.active,
      hasPasswordHash: !!data.password_hash
    });
    
    // Testar hash da senha
    const password = 'admin123';
    const isValid = await bcrypt.compare(password, data.password_hash);
    console.log('✅ Hash da senha válido:', isValid);
    
  } catch (error) {
    console.log('❌ Erro no teste:', error.message);
  }
}

// Testar login com dados mockados
async function testMockLogin() {
  console.log('🔍 Testando login com dados mockados...');
  
  // Simular dados mockados do AuthService
  const mockUsers = [
    {
      id: 'admin-001',
      email: 'admin@lucasbarbearia.com',
      password_hash: '$2b$12$IPjUL7HPYFXwsvKsZ1PtbuAq5ldfspojv/RAfXeHrQO9dI.iwJMAe', // senha: admin123
      nome: 'Administrador',
      telefone: '(11) 99999-9999',
      role: 'admin',
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
  
  const email = 'admin@lucasbarbearia.com';
  const password = 'admin123';
  
  // Buscar usuário
  const user = mockUsers.find(u => u.email === email && u.active);
  console.log('👤 Usuário encontrado:', user ? 'Sim' : 'Não');
  
  if (!user) {
    console.log('❌ Usuário não encontrado ou inativo');
    return;
  }
  
  // Verificar senha
  const senhaValida = await bcrypt.compare(password, user.password_hash);
  console.log('🔐 Senha válida:', senhaValida);
  
  if (senhaValida) {
    console.log('✅ Login bem-sucedido!');
    console.log('📋 Dados do usuário:', {
      id: user.id,
      email: user.email,
      nome: user.nome,
      role: user.role
    });
  } else {
    console.log('❌ Senha inválida');
  }
}

// Executar testes
async function runTests() {
  console.log('🧪 Iniciando testes de autenticação...\n');
  
  await testPasswordHash();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await testDatabaseQuery();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await testMockLogin();
}

runTests(); 