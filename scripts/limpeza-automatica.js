#!/usr/bin/env node

/**
 * Script de Limpeza Automática da Fila
 * Executa limpeza de dados antigos da tabela clientes_fila
 * 
 * Uso:
 * - Manual: node scripts/limpeza-automatica.js
 * - Agendado: Adicionar ao cron para execução diária
 */

require('dotenv').config();
const { supabase } = require('../src/config/database');

/**
 * Executar limpeza automática
 */
async function executarLimpeza() {
  try {
    console.log('🔄 Iniciando limpeza automática da fila...');
    console.log(`📅 Data/Hora: ${new Date().toISOString()}`);
    
    // Executar função de limpeza no banco
    const { data: registrosRemovidos, error } = await supabase.rpc('limpar_fila_antiga');
    
    if (error) {
      console.error('❌ Erro ao executar limpeza:', error);
      process.exit(1);
    }
    
    console.log(`✅ Limpeza concluída com sucesso!`);
    console.log(`🗑️  Registros removidos: ${registrosRemovidos || 0}`);
    
    // Log adicional para auditoria
    console.log(`📊 Resumo da limpeza:`);
    console.log(`   - Registros removidos: ${registrosRemovidos || 0}`);
    console.log(`   - Critério: dados finalizados há mais de 24h`);
    console.log(`   - Timestamp: ${new Date().toISOString()}`);
    
    return {
      success: true,
      registrosRemovidos: registrosRemovidos || 0,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('❌ Erro inesperado durante limpeza:', error);
    process.exit(1);
  }
}

/**
 * Verificar estatísticas da fila
 */
async function verificarEstatisticas() {
  try {
    console.log('\n📊 Verificando estatísticas da fila...');
    
    // Contar clientes por status
    const { data: estatisticas, error } = await supabase
      .from('clientes_fila')
      .select('status');
    
    if (error) {
      console.error('❌ Erro ao buscar estatísticas:', error);
      return;
    }
    
    const contadores = {
      aguardando: 0,
      proximo: 0,
      atendendo: 0,
      finalizado: 0,
      removido: 0
    };
    
    estatisticas.forEach(cliente => {
      contadores[cliente.status]++;
    });
    
    console.log('📈 Estatísticas atuais:');
    console.log(`   - Aguardando: ${contadores.aguardando}`);
    console.log(`   - Próximo: ${contadores.proximo}`);
    console.log(`   - Atendendo: ${contadores.atendendo}`);
    console.log(`   - Finalizado: ${contadores.finalizado}`);
    console.log(`   - Removido: ${contadores.removido}`);
    console.log(`   - Total: ${estatisticas.length}`);
    
    return contadores;
    
  } catch (error) {
    console.error('❌ Erro ao verificar estatísticas:', error);
  }
}

/**
 * Verificar dados antigos (para debug)
 */
async function verificarDadosAntigos() {
  try {
    console.log('\n🔍 Verificando dados antigos...');
    
    // Buscar registros finalizados há mais de 24h
    const { data: dadosAntigos, error } = await supabase
      .from('clientes_fila')
      .select('id, nome, status, data_finalizacao')
      .not('data_finalizacao', 'is', null)
      .lt('data_finalizacao', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
    
    if (error) {
      console.error('❌ Erro ao buscar dados antigos:', error);
      return;
    }
    
    console.log(`📅 Registros finalizados há mais de 24h: ${dadosAntigos.length}`);
    
    if (dadosAntigos.length > 0) {
      console.log('📋 Exemplos de registros antigos:');
      dadosAntigos.slice(0, 5).forEach(registro => {
        console.log(`   - ${registro.nome} (${registro.status}) - ${registro.data_finalizacao}`);
      });
      
      if (dadosAntigos.length > 5) {
        console.log(`   ... e mais ${dadosAntigos.length - 5} registros`);
      }
    }
    
    return dadosAntigos;
    
  } catch (error) {
    console.error('❌ Erro ao verificar dados antigos:', error);
  }
}

/**
 * Função principal
 */
async function main() {
  console.log('🚀 Script de Limpeza Automática - Lucas Barbearia');
  console.log('=' .repeat(50));
  
  // Verificar estatísticas antes da limpeza
  await verificarEstatisticas();
  
  // Verificar dados antigos
  await verificarDadosAntigos();
  
  // Executar limpeza
  const resultado = await executarLimpeza();
  
  // Verificar estatísticas após limpeza
  console.log('\n📊 Verificando estatísticas após limpeza...');
  await verificarEstatisticas();
  
  console.log('\n✅ Script concluído com sucesso!');
  console.log('=' .repeat(50));
  
  return resultado;
}

// Executar se chamado diretamente
if (require.main === module) {
  main()
    .then(resultado => {
      console.log('🎉 Processo finalizado:', resultado);
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Erro fatal:', error);
      process.exit(1);
    });
}

module.exports = {
  executarLimpeza,
  verificarEstatisticas,
  verificarDadosAntigos,
  main
}; 