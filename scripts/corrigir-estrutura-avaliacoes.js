require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function corrigirEstrutura() {
  try {
    console.log('🔧 Corrigindo estrutura da tabela avaliacoes...');
    
    // 1. Primeiro, vamos tentar inserir com a coluna rating para confirmar o problema
    console.log('📝 Testando inserção com rating...');
    const { error: errorComRating } = await supabase
      .from('avaliacoes')
      .insert({
        cliente_id: '00000000-0000-0000-0000-000000000000',
        barbearia_id: 1,
        barbeiro_id: '00000000-0000-0000-0000-000000000000',
        rating: 5, // Coluna antiga
        rating_estrutura: 5,
        rating_barbeiro: 5,
        comentario: 'Teste com rating'
      });
      
    if (errorComRating) {
      console.log('❌ Erro com rating:', errorComRating.message);
    } else {
      console.log('✅ Inserção com rating funcionou');
    }
    
    // 2. Tentar inserir sem a coluna rating
    console.log('📝 Testando inserção sem rating...');
    const { error: errorSemRating } = await supabase
      .from('avaliacoes')
      .insert({
        cliente_id: '00000000-0000-0000-0000-000000000000',
        barbearia_id: 1,
        barbeiro_id: '00000000-0000-0000-0000-000000000000',
        rating_estrutura: 5,
        rating_barbeiro: 5,
        comentario: 'Teste sem rating'
      });
      
    if (errorSemRating) {
      console.log('❌ Erro sem rating:', errorSemRating.message);
      
      // 3. Se der erro, precisamos remover a coluna rating
      console.log('🔧 A coluna rating ainda existe e está causando problemas...');
      console.log('📋 Execute manualmente no seu banco de dados:');
      console.log('');
      console.log('-- Remover a coluna rating antiga');
      console.log('ALTER TABLE avaliacoes DROP COLUMN IF EXISTS rating;');
      console.log('');
      console.log('-- Verificar se as novas colunas existem');
      console.log('SELECT column_name, data_type, is_nullable');
      console.log('FROM information_schema.columns');
      console.log('WHERE table_name = \'avaliacoes\'');
      console.log('ORDER BY ordinal_position;');
      console.log('');
      
    } else {
      console.log('✅ Inserção sem rating funcionou!');
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

corrigirEstrutura(); 