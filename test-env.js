require('dotenv').config();

console.log('🔍 Verificando variáveis de ambiente...\n');

const envVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY', 
  'SUPABASE_SERVICE_ROLE_KEY',
  'JWT_SECRET',
  'PORT',
  'NODE_ENV'
];

envVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${varName.includes('KEY') || varName.includes('SECRET') ? '***CONFIGURADO***' : value}`);
  } else {
    console.log(`❌ ${varName}: NÃO CONFIGURADO`);
  }
});

console.log('\n🔍 Testando conexão com Supabase...');

try {
  const dbConfig = require('./src/config/database');
  
  if (dbConfig.supabase) {
    console.log('✅ Supabase configurado corretamente');
    
    // Testar uma consulta simples
    dbConfig.supabase
      .from('users')
      .select('count')
      .then(({ data, error }) => {
        if (error) {
          console.log('❌ Erro na consulta:', error.message);
        } else {
          console.log('✅ Conexão com banco funcionando');
        }
      });
  } else {
    console.log('❌ Supabase não foi inicializado');
  }
} catch (error) {
  console.log('❌ Erro ao carregar configuração do banco:', error.message);
} 