const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');

// Configuração do Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const supabaseAdmin = supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

async function verificarUsuario() {
  try {
    console.log('🔍 Verificando usuário admin...');
    
    // Buscar usuário no banco
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'admin@lucasbarbearia.com')
      .single();

    if (error) {
      console.error('❌ Erro ao buscar usuário:', error);
      return;
    }

    if (!user) {
      console.log('❌ Usuário não encontrado');
      return;
    }

    console.log('✅ Usuário encontrado:');
    console.log('  - ID:', user.id);
    console.log('  - Email:', user.email);
    console.log('  - Nome:', user.nome);
    console.log('  - Role:', user.role);
    console.log('  - Active:', user.active);
    console.log('  - Hash:', user.password_hash);

    // Testar hash da senha
    console.log('\n🔐 Testando hash da senha...');
    const senhaTeste = 'admin123';
    const hashEsperado = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G';
    
    console.log('  - Senha de teste:', senhaTeste);
    console.log('  - Hash no banco:', user.password_hash);
    console.log('  - Hash esperado:', hashEsperado);
    
    // Comparar com hash do banco
    const senhaValidaBanco = await bcrypt.compare(senhaTeste, user.password_hash);
    console.log('  - Senha válida (hash do banco):', senhaValidaBanco);
    
    // Comparar com hash esperado
    const senhaValidaEsperado = await bcrypt.compare(senhaTeste, hashEsperado);
    console.log('  - Senha válida (hash esperado):', senhaValidaEsperado);
    
    // Gerar novo hash para comparação
    const novoHash = await bcrypt.hash(senhaTeste, 12);
    console.log('  - Novo hash gerado:', novoHash);
    
    const senhaValidaNovo = await bcrypt.compare(senhaTeste, novoHash);
    console.log('  - Senha válida (novo hash):', senhaValidaNovo);

  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

verificarUsuario(); 