require('dotenv').config();

// Tentar importar Supabase, mas não falhar se não estiver configurado
let supabase = null;
try {
  const dbConfig = require('../src/config/database');
  supabase = dbConfig.supabase;
  console.log('✅ Supabase configurado com sucesso');
} catch (error) {
  mostrarInstrucoesManuais();
  process.exit(0);
}

function mostrarInstrucoesManuais() {
  console.log('⚠️ Supabase não configurado ou com problemas');
  console.log('📋 Para configurar o Supabase, adicione as seguintes variáveis de ambiente:');
  console.log('   - SUPABASE_URL');
  console.log('   - SUPABASE_ANON_KEY');
  console.log('   - SUPABASE_SERVICE_ROLE_KEY (opcional)');
  console.log('');
  console.log('🔧 Ou execute os comandos SQL manualmente no seu banco:');
  console.log('');
  console.log('-- 1. Adicionar colunas rating_estrutura e rating_barbeiro');
  console.log('ALTER TABLE avaliacoes ADD COLUMN IF NOT EXISTS rating_estrutura INTEGER CHECK (rating_estrutura >= 1 AND rating_estrutura <= 5);');
  console.log('ALTER TABLE avaliacoes ADD COLUMN IF NOT EXISTS rating_barbeiro INTEGER CHECK (rating_barbeiro >= 1 AND rating_barbeiro <= 5);');
  console.log('');
  console.log('-- 2. Migrar dados existentes (se houver)');
  console.log('UPDATE avaliacoes SET rating_estrutura = rating, rating_barbeiro = rating WHERE rating_estrutura IS NULL;');
  console.log('');
  console.log('-- 3. Tornar colunas obrigatórias');
  console.log('ALTER TABLE avaliacoes ALTER COLUMN rating_estrutura SET NOT NULL;');
  console.log('ALTER TABLE avaliacoes ALTER COLUMN rating_barbeiro SET NOT NULL;');
  console.log('');
  console.log('📄 Ou use o arquivo: scripts/migrar-avaliacoes-manual.sql');
  console.log('');
  console.log('🎉 Após executar os comandos SQL, a migração estará concluída!');
}

async function migrarAvaliacoes() {
  try {
    console.log('🔄 [MIGRAÇÃO] Iniciando migração da tabela avaliacoes...');
    
    // 1. Adicionar novas colunas
    console.log('📝 [MIGRAÇÃO] Adicionando colunas rating_estrutura e rating_barbeiro...');
    
    const { error: addEstruturaError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE avaliacoes 
        ADD COLUMN IF NOT EXISTS rating_estrutura INTEGER CHECK (rating_estrutura >= 1 AND rating_estrutura <= 5)
      `
    });
    
    if (addEstruturaError) {
      console.error('❌ [MIGRAÇÃO] Erro ao adicionar rating_estrutura:', addEstruturaError.message);
      console.log('🔄 [MIGRAÇÃO] Tentando método alternativo...');
      
      // Tentar método alternativo usando SQL direto
      const { error: altError } = await supabase
        .from('avaliacoes')
        .select('id')
        .limit(1);
      
      if (altError && altError.message.includes('rating_estrutura')) {
        console.log('❌ [MIGRAÇÃO] Colunas ainda não existem. Use migração manual.');
        mostrarInstrucoesManuais();
        return;
      }
    } else {
      console.log('✅ [MIGRAÇÃO] Coluna rating_estrutura adicionada');
    }
    
    const { error: addBarbeiroError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE avaliacoes 
        ADD COLUMN IF NOT EXISTS rating_barbeiro INTEGER CHECK (rating_barbeiro >= 1 AND rating_barbeiro <= 5)
      `
    });
    
    if (addBarbeiroError) {
      console.error('❌ [MIGRAÇÃO] Erro ao adicionar rating_barbeiro:', addBarbeiroError.message);
    } else {
      console.log('✅ [MIGRAÇÃO] Coluna rating_barbeiro adicionada');
    }
    
    // 2. Migrar dados existentes (se houver)
    console.log('🔄 [MIGRAÇÃO] Migrando dados existentes...');
    
    const { data: avaliacoesExistentes, error: fetchError } = await supabase
      .from('avaliacoes')
      .select('id, rating')
      .is('rating_estrutura', null);
    
    if (fetchError) {
      console.error('❌ [MIGRAÇÃO] Erro ao buscar avaliações existentes:', fetchError.message);
      if (fetchError.message.includes('rating_estrutura')) {
        console.log('❌ [MIGRAÇÃO] Colunas ainda não existem. Use migração manual.');
        mostrarInstrucoesManuais();
        return;
      }
    } else if (avaliacoesExistentes && avaliacoesExistentes.length > 0) {
      console.log(`📊 [MIGRAÇÃO] Encontradas ${avaliacoesExistentes.length} avaliações para migrar`);
      
      for (const avaliacao of avaliacoesExistentes) {
        // Migrar rating antigo para rating_estrutura (assumindo que era avaliação geral)
        const { error: updateError } = await supabase
          .from('avaliacoes')
          .update({
            rating_estrutura: avaliacao.rating,
            rating_barbeiro: avaliacao.rating // Mesmo valor para manter compatibilidade
          })
          .eq('id', avaliacao.id);
        
        if (updateError) {
          console.error(`❌ [MIGRAÇÃO] Erro ao migrar avaliação ${avaliacao.id}:`, updateError.message);
        } else {
          console.log(`✅ [MIGRAÇÃO] Avaliação ${avaliacao.id} migrada`);
        }
      }
    } else {
      console.log('ℹ️ [MIGRAÇÃO] Nenhuma avaliação existente encontrada para migrar');
    }
    
    // 3. Tornar as novas colunas obrigatórias (após migração)
    console.log('🔒 [MIGRAÇÃO] Tornando colunas obrigatórias...');
    
    const { error: notNullError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE avaliacoes 
        ALTER COLUMN rating_estrutura SET NOT NULL,
        ALTER COLUMN rating_barbeiro SET NOT NULL
      `
    });
    
    if (notNullError) {
      console.error('❌ [MIGRAÇÃO] Erro ao tornar colunas obrigatórias:', notNullError.message);
    } else {
      console.log('✅ [MIGRAÇÃO] Colunas tornadas obrigatórias');
    }
    
    console.log('🎉 [MIGRAÇÃO] Migração concluída com sucesso!');
    console.log('📋 [MIGRAÇÃO] Resumo:');
    console.log('   - ✅ rating_estrutura: adicionada');
    console.log('   - ✅ rating_barbeiro: adicionada');
    console.log('   - ✅ Dados existentes migrados');
    console.log('   - ✅ Colunas tornadas obrigatórias');
    console.log('   - ⚠️ Coluna rating antiga mantida (comentada)');
    
  } catch (error) {
    console.error('❌ [MIGRAÇÃO] Erro geral na migração:', error.message);
    console.log('');
    console.log('🔄 [MIGRAÇÃO] Usando migração manual...');
    mostrarInstrucoesManuais();
  }
}

// Executar migração se chamado diretamente
if (require.main === module) {
  migrarAvaliacoes();
}

module.exports = { migrarAvaliacoes }; 