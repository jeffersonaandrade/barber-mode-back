#!/usr/bin/env node

/**
 * Script de Backup do Banco de Dados
 * Faz backup completo antes da migração para o schema simplificado
 */

require('dotenv').config();
const { supabase } = require('../src/config/database');
const fs = require('fs');
const path = require('path');

/**
 * Fazer backup das tabelas principais
 */
async function fazerBackup() {
  try {
    console.log('🔄 Iniciando backup do banco de dados...');
    console.log(`📅 Data/Hora: ${new Date().toISOString()}`);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(__dirname, '..', 'backups', timestamp);
    
    // Criar diretório de backup
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    console.log(`📁 Diretório de backup: ${backupDir}`);
    
    // Lista de tabelas para backup
    const tabelas = [
      'users',
      'barbearias', 
      'barbeiros_barbearias',
      'clientes',
      'avaliacoes',
      'historico_atendimentos'
    ];
    
    const backupData = {
      timestamp: timestamp,
      tabelas: {}
    };
    
    // Fazer backup de cada tabela
    for (const tabela of tabelas) {
      console.log(`📋 Fazendo backup da tabela: ${tabela}`);
      
      const { data, error } = await supabase
        .from(tabela)
        .select('*');
      
      if (error) {
        console.error(`❌ Erro ao fazer backup da tabela ${tabela}:`, error);
        continue;
      }
      
      backupData.tabelas[tabela] = data || [];
      console.log(`✅ ${tabela}: ${data?.length || 0} registros`);
    }
    
    // Salvar backup em arquivo JSON
    const backupFile = path.join(backupDir, 'backup-completo.json');
    fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));
    
    console.log(`💾 Backup salvo em: ${backupFile}`);
    
    // Criar arquivo de resumo
    const resumoFile = path.join(backupDir, 'resumo-backup.txt');
    let resumo = `Backup do Banco de Dados - Lucas Barbearia\n`;
    resumo += `Data/Hora: ${timestamp}\n`;
    resumo += `==========================================\n\n`;
    
    Object.keys(backupData.tabelas).forEach(tabela => {
      const registros = backupData.tabelas[tabela].length;
      resumo += `${tabela}: ${registros} registros\n`;
    });
    
    fs.writeFileSync(resumoFile, resumo);
    
    console.log('✅ Backup concluído com sucesso!');
    console.log(`📊 Total de tabelas: ${Object.keys(backupData.tabelas).length}`);
    
    return {
      success: true,
      backupDir: backupDir,
      backupFile: backupFile,
      resumoFile: resumoFile,
      timestamp: timestamp
    };
    
  } catch (error) {
    console.error('❌ Erro durante backup:', error);
    throw error;
  }
}

/**
 * Verificar se o backup foi bem-sucedido
 */
async function verificarBackup(backupFile) {
  try {
    console.log('\n🔍 Verificando integridade do backup...');
    
    if (!fs.existsSync(backupFile)) {
      throw new Error('Arquivo de backup não encontrado');
    }
    
    const backupData = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
    
    console.log('📋 Resumo do backup:');
    Object.keys(backupData.tabelas).forEach(tabela => {
      const registros = backupData.tabelas[tabela].length;
      console.log(`   - ${tabela}: ${registros} registros`);
    });
    
    console.log('✅ Backup verificado com sucesso!');
    return true;
    
  } catch (error) {
    console.error('❌ Erro ao verificar backup:', error);
    return false;
  }
}

/**
 * Função principal
 */
async function main() {
  console.log('🚀 Script de Backup - Lucas Barbearia');
  console.log('=' .repeat(50));
  
  try {
    // Fazer backup
    const resultado = await fazerBackup();
    
    // Verificar backup
    await verificarBackup(resultado.backupFile);
    
    console.log('\n✅ Processo de backup finalizado!');
    console.log('=' .repeat(50));
    console.log('📁 Arquivos criados:');
    console.log(`   - Backup: ${resultado.backupFile}`);
    console.log(`   - Resumo: ${resultado.resumoFile}`);
    console.log(`   - Diretório: ${resultado.backupDir}`);
    
    return resultado;
    
  } catch (error) {
    console.error('💥 Erro fatal durante backup:', error);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main()
    .then(resultado => {
      console.log('\n🎉 Backup concluído:', resultado);
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Erro fatal:', error);
      process.exit(1);
    });
}

module.exports = {
  fazerBackup,
  verificarBackup,
  main
}; 