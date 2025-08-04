require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function verificarEstrutura() {
  try {
    console.log('🔍 Verificando estrutura da tabela avaliacoes...');
    
    // Tentar inserir uma avaliação de teste para ver o erro
    const { data, error } = await supabase
      .from('avaliacoes')
      .insert({
        cliente_id: '00000000-0000-0000-0000-000000000000',
        barbearia_id: 1,
        barbeiro_id: '00000000-0000-0000-0000-000000000000',
        rating_estrutura: 5,
        rating_barbeiro: 5,
        comentario: 'Teste'
      })
      .select();
      
    if (error) {
      console.log('❌ Erro ao inserir:', error);
      
      // Verificar se a coluna rating ainda existe
      const { data: colunas, error: colunasError } = await supabase
        .from('avaliacoes')
        .select('*')
        .limit(0);
        
      if (colunasError) {
        console.log('❌ Erro ao verificar colunas:', colunasError);
      } else {
        console.log('✅ Tabela existe, mas há problema com as colunas');
      }
    } else {
      console.log('✅ Inserção bem-sucedida:', data);
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

verificarEstrutura(); 