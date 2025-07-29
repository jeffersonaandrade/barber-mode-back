-- ===== LIMPEZA DE DADOS ANTIGOS - EXECUTAR NO SQL EDITOR DO SUPABASE =====
-- ⚠️ ATENÇÃO: Este script vai EXCLUIR permanentemente as tabelas antigas
-- Execute apenas se tiver certeza de que os dados são de teste

-- ===== 1. VERIFICAR DADOS ANTES DE EXCLUIR =====

-- Verificar quantos registros existem nas tabelas antigas
SELECT 'clientes' as tabela, COUNT(*) as total FROM clientes;
SELECT 'avaliacoes' as tabela, COUNT(*) as total FROM avaliacoes;
SELECT 'historico_atendimentos' as tabela, COUNT(*) as total FROM historico_atendimentos;

-- Verificar dados de exemplo (últimos 3 registros)
SELECT 'Últimos clientes:' as info;
SELECT id, nome, telefone, status, created_at FROM clientes ORDER BY created_at DESC LIMIT 3;

SELECT 'Últimas avaliações:' as info;
SELECT id, rating, categoria, created_at FROM avaliacoes ORDER BY created_at DESC LIMIT 3;

SELECT 'Último histórico:' as info;
SELECT id, servico, data_inicio, created_at FROM historico_atendimentos ORDER BY created_at DESC LIMIT 3;

-- ===== 2. EXCLUIR TABELAS ANTIGAS =====

-- Excluir tabelas na ordem correta (respeitando foreign keys)
DROP TABLE IF EXISTS historico_atendimentos CASCADE;
DROP TABLE IF EXISTS avaliacoes CASCADE;
DROP TABLE IF EXISTS clientes CASCADE;

-- ===== 3. VERIFICAR LIMPEZA =====

-- Verificar se as tabelas foram excluídas
SELECT table_name 
FROM information_schema.tables 
WHERE table_name IN ('clientes', 'avaliacoes', 'historico_atendimentos');

-- Verificar tabelas que permaneceram
SELECT 'Tabelas restantes:' as info;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- ===== 4. VERIFICAR NOVAS TABELAS =====

-- Verificar se as novas tabelas estão funcionando
SELECT 'Novas tabelas criadas:' as info, COUNT(*) as total FROM information_schema.tables 
WHERE table_name IN ('clientes_fila', 'atendimentos_contabilizados', 'avaliacoes_novas', 'servicos', 'horarios_funcionamento', 'configuracoes_barbearia');

SELECT 'Serviços disponíveis:' as info, COUNT(*) as total FROM servicos;
SELECT 'Horários configurados:' as info, COUNT(*) as total FROM horarios_funcionamento;
SELECT 'Configurações criadas:' as info, COUNT(*) as total FROM configuracoes_barbearia;

-- ===== LIMPEZA CONCLUÍDA! =====
-- As tabelas antigas foram excluídas
-- Apenas as novas tabelas permanecem
-- O sistema está limpo e pronto para uso 