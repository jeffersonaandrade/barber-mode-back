#!/usr/bin/env node

/**
 * Script de Migração do Banco de Dados
 * Migra do schema antigo para o schema simplificado
 */

require('dotenv').config();
const { supabase } = require('../src/config/database');
const fs = require('fs');
const path = require('path');

/**
 * Verificar se as tabelas antigas existem
 */
async function verificarTabelasAntigas() {
  try {
    console.log('🔍 Verificando tabelas antigas...');
    
    const tabelasAntigas = [
      'clientes',
      'avaliacoes', 
      'historico_atendimentos'
    ];
    
    const tabelasExistentes = [];
    
    for (const tabela of tabelasAntigas) {
      try {
        const { data, error } = await supabase
          .from(tabela)
          .select('count')
          .limit(1);
        
        if (!error) {
          tabelasExistentes.push(tabela);
          console.log(`✅ Tabela ${tabela} existe`);
        } else {
          console.log(`❌ Tabela ${tabela} não existe`);
        }
      } catch (error) {
        console.log(`❌ Erro ao verificar tabela ${tabela}:`, error.message);
      }
    }
    
    return tabelasExistentes;
    
  } catch (error) {
    console.error('❌ Erro ao verificar tabelas antigas:', error);
    throw error;
  }
}

/**
 * Verificar se as novas tabelas já existem
 */
async function verificarTabelasNovas() {
  try {
    console.log('🔍 Verificando tabelas novas...');
    
    const tabelasNovas = [
      'clientes_fila',
      'atendimentos_contabilizados',
      'avaliacoes_novas',
      'servicos',
      'horarios_funcionamento',
      'configuracoes_barbearia'
    ];
    
    const tabelasExistentes = [];
    
    for (const tabela of tabelasNovas) {
      try {
        const { data, error } = await supabase
          .from(tabela)
          .select('count')
          .limit(1);
        
        if (!error) {
          tabelasExistentes.push(tabela);
          console.log(`✅ Tabela ${tabela} já existe`);
        } else {
          console.log(`❌ Tabela ${tabela} não existe`);
        }
      } catch (error) {
        console.log(`❌ Erro ao verificar tabela ${tabela}:`, error.message);
      }
    }
    
    return tabelasExistentes;
    
  } catch (error) {
    console.error('❌ Erro ao verificar tabelas novas:', error);
    throw error;
  }
}

/**
 * Executar migração SQL
 */
async function executarMigracao() {
  try {
    console.log('🔄 Executando migração SQL...');
    
    // Ler arquivo de migração
    const migracaoPath = path.join(__dirname, '..', 'database', 'migracao_simplificado.sql');
    
    if (!fs.existsSync(migracaoPath)) {
      throw new Error('Arquivo de migração não encontrado');
    }
    
    const sqlMigracao = fs.readFileSync(migracaoPath, 'utf8');
    
    console.log('📋 Executando script de migração...');
    
    // Dividir o SQL em comandos individuais
    const comandos = sqlMigracao
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
    
    console.log(`📊 Total de comandos SQL: ${comandos.length}`);
    
    let comandosExecutados = 0;
    let erros = [];
    
    for (const comando of comandos) {
      try {
        if (comando.trim()) {
          const { error } = await supabase.rpc('exec_sql', { sql: comando });
          
          if (error) {
            console.log(`⚠️  Comando com erro (continuando): ${error.message}`);
            erros.push({ comando: comando.substring(0, 100) + '...', erro: error.message });
          } else {
            comandosExecutados++;
          }
        }
      } catch (error) {
        console.log(`⚠️  Erro no comando (continuando): ${error.message}`);
        erros.push({ comando: comando.substring(0, 100) + '...', erro: error.message });
      }
    }
    
    console.log(`✅ Comandos executados: ${comandosExecutados}/${comandos.length}`);
    
    if (erros.length > 0) {
      console.log(`⚠️  Erros encontrados: ${erros.length}`);
      erros.forEach(erro => {
        console.log(`   - ${erro.erro}`);
      });
    }
    
    return {
      comandosExecutados,
      totalComandos: comandos.length,
      erros
    };
    
  } catch (error) {
    console.error('❌ Erro durante migração:', error);
    throw error;
  }
}

/**
 * Verificar resultado da migração
 */
async function verificarMigracao() {
  try {
    console.log('🔍 Verificando resultado da migração...');
    
    const verificacoes = [
      { tabela: 'clientes_fila', descricao: 'Clientes na fila' },
      { tabela: 'atendimentos_contabilizados', descricao: 'Atendimentos contabilizados' },
      { tabela: 'avaliacoes_novas', descricao: 'Avaliações' },
      { tabela: 'servicos', descricao: 'Serviços' },
      { tabela: 'horarios_funcionamento', descricao: 'Horários' },
      { tabela: 'configuracoes_barbearia', descricao: 'Configurações' }
    ];
    
    const resultados = {};
    
    for (const verificacao of verificacoes) {
      try {
        const { data, error } = await supabase
          .from(verificacao.tabela)
          .select('count');
        
        if (!error) {
          const { count } = await supabase
            .from(verificacao.tabela)
            .select('*', { count: 'exact', head: true });
          
          resultados[verificacao.tabela] = count || 0;
          console.log(`✅ ${verificacao.descricao}: ${count || 0} registros`);
        } else {
          resultados[verificacao.tabela] = 'ERRO';
          console.log(`❌ ${verificacao.descricao}: ERRO - ${error.message}`);
        }
      } catch (error) {
        resultados[verificacao.tabela] = 'ERRO';
        console.log(`❌ ${verificacao.descricao}: ERRO - ${error.message}`);
      }
    }
    
    return resultados;
    
  } catch (error) {
    console.error('❌ Erro ao verificar migração:', error);
    throw error;
  }
}

/**
 * Função principal
 */
async function main() {
  console.log('🚀 Script de Migração - Lucas Barbearia');
  console.log('=' .repeat(50));
  
  try {
    // 1. Verificar tabelas antigas
    const tabelasAntigas = await verificarTabelasAntigas();
    console.log(`📋 Tabelas antigas encontradas: ${tabelasAntigas.length}`);
    
    // 2. Verificar tabelas novas
    const tabelasNovas = await verificarTabelasNovas();
    console.log(`📋 Tabelas novas existentes: ${tabelasNovas.length}`);
    
    // 3. Perguntar se deve continuar
    if (tabelasNovas.length > 0) {
      console.log('\n⚠️  ATENÇÃO: Algumas tabelas novas já existem!');
      console.log('   Isso pode indicar que a migração já foi executada.');
      console.log('   Deseja continuar mesmo assim? (s/n)');
      
      // Em produção, você pode querer parar aqui
      // Por enquanto, vamos continuar
    }
    
    // 4. Executar migração
    console.log('\n🔄 Iniciando migração...');
    const resultadoMigracao = await executarMigracao();
    
    // 5. Verificar resultado
    console.log('\n🔍 Verificando resultado...');
    const resultados = await verificarMigracao();
    
    // 6. Resumo final
    console.log('\n✅ Migração concluída!');
    console.log('=' .repeat(50));
    console.log('📊 Resumo da migração:');
    console.log(`   - Comandos executados: ${resultadoMigracao.comandosExecutados}/${resultadoMigracao.totalComandos}`);
    console.log(`   - Erros: ${resultadoMigracao.erros.length}`);
    
    if (resultadoMigracao.erros.length > 0) {
      console.log('\n⚠️  Erros encontrados:');
      resultadoMigracao.erros.forEach(erro => {
        console.log(`   - ${erro.erro}`);
      });
    }
    
    console.log('\n📋 Tabelas migradas:');
    Object.keys(resultados).forEach(tabela => {
      const count = resultados[tabela];
      console.log(`   - ${tabela}: ${count} registros`);
    });
    
    return {
      success: true,
      tabelasAntigas,
      tabelasNovas,
      resultadoMigracao,
      resultados
    };
    
  } catch (error) {
    console.error('💥 Erro fatal durante migração:', error);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main()
    .then(resultado => {
      console.log('\n🎉 Migração finalizada:', resultado);
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Erro fatal:', error);
      process.exit(1);
    });
}

module.exports = {
  verificarTabelasAntigas,
  verificarTabelasNovas,
  executarMigracao,
  verificarMigracao,
  main
}; 