require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function testarTimezone() {
  try {
    console.log('🧪 Testando correção de timezone nos relatórios...');
    
    // Testar conversão de datas
    const dataInicio = '2025-08-01';
    const dataFim = '2025-08-04';
    
    console.log('📅 Datas originais:');
    console.log(`   Início: ${dataInicio}`);
    console.log(`   Fim: ${dataFim}`);
    
    // Converter para UTC (timezone brasileiro -03:00)
    const dataInicioUTC = new Date(dataInicio + 'T00:00:00-03:00').toISOString();
    const dataFimUTC = new Date(dataFim + 'T23:59:59-03:00').toISOString();
    
    console.log('🌍 Datas convertidas para UTC:');
    console.log(`   Início UTC: ${dataInicioUTC}`);
    console.log(`   Fim UTC: ${dataFimUTC}`);
    
    // Testar busca direta no banco
    console.log('🔍 Testando busca direta no banco...');
    
    const { data: atendimentos, error: atendimentosError } = await supabase
      .from('historico_atendimentos')
      .select('*')
      .gte('data_inicio', dataInicioUTC)
      .lte('data_inicio', dataFimUTC);
      
    if (atendimentosError) {
      console.log('❌ Erro ao buscar atendimentos:', atendimentosError);
    } else {
      console.log(`✅ Encontrados ${atendimentos.length} atendimentos no período`);
      if (atendimentos.length > 0) {
        console.log('📊 Primeiro atendimento:', atendimentos[0]);
      }
    }
    
    const { data: avaliacoes, error: avaliacoesError } = await supabase
      .from('avaliacoes')
      .select('*')
      .gte('created_at', dataInicioUTC)
      .lte('created_at', dataFimUTC);
      
    if (avaliacoesError) {
      console.log('❌ Erro ao buscar avaliações:', avaliacoesError);
    } else {
      console.log(`✅ Encontradas ${avaliacoes.length} avaliações no período`);
      if (avaliacoes.length > 0) {
        console.log('⭐ Primeira avaliação:', avaliacoes[0]);
      }
    }
    
    console.log('🎯 Teste concluído!');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
}

testarTimezone(); 