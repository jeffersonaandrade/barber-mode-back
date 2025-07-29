-- ===== VERIFICAR ESTRUTURA DAS TABELAS =====
-- Execute este script primeiro para ver a estrutura real das tabelas

-- Verificar estrutura da tabela avaliacoes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'avaliacoes' 
ORDER BY ordinal_position;

-- Verificar estrutura da tabela clientes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'clientes' 
ORDER BY ordinal_position;

-- Verificar estrutura da tabela historico_atendimentos
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'historico_atendimentos' 
ORDER BY ordinal_position;

-- Verificar se as tabelas existem
SELECT table_name 
FROM information_schema.tables 
WHERE table_name IN ('avaliacoes', 'clientes', 'historico_atendimentos', 'barbearias', 'users');

-- Verificar alguns dados de exemplo da tabela avaliacoes (se existir)
SELECT * FROM avaliacoes LIMIT 3; 