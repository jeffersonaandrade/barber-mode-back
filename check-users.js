require('dotenv').config();

async function checkUsers() {
  try {
    const dbConfig = require('./src/config/database');
    const supabase = dbConfig.supabase;
    
    console.log('🔍 Verificando usuários no banco...\n');
    
    // Buscar todos os usuários
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, nome, role, active, created_at')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.log('❌ Erro ao buscar usuários:', error.message);
      return;
    }
    
    console.log(`📊 Total de usuários encontrados: ${users.length}\n`);
    
    if (users.length === 0) {
      console.log('❌ Nenhum usuário encontrado no banco');
      return;
    }
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (${user.role}) - ${user.active ? '✅ Ativo' : '❌ Inativo'}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Nome: ${user.nome}`);
      console.log(`   Criado em: ${user.created_at}`);
      console.log('');
    });
    
    // Verificar usuários duplicados
    const emailCounts = {};
    users.forEach(user => {
      emailCounts[user.email] = (emailCounts[user.email] || 0) + 1;
    });
    
    const duplicates = Object.entries(emailCounts).filter(([email, count]) => count > 1);
    
    if (duplicates.length > 0) {
      console.log('⚠️  USUÁRIOS DUPLICADOS ENCONTRADOS:');
      duplicates.forEach(([email, count]) => {
        console.log(`   ${email}: ${count} registros`);
      });
      console.log('\n💡 Isso pode estar causando o erro de login!');
    }
    
  } catch (error) {
    console.log('❌ Erro:', error.message);
  }
}

checkUsers(); 