-- ===== LIMPEZA DE DADOS ANTIGOS CORRIGIDA - EXECUTAR NO SQL EDITOR DO SUPABASE =====
-- ⚠️ ATENÇÃO: Este script vai EXCLUIR permanentemente as tabelas antigas
-- Execute apenas se tiver certeza de que os dados são de teste

-- ===== 1. VERIFICAR ESTRUTURA DAS TABELAS ANTES DE EXCLUIR =====

-- Verificar se as tabelas existem e suas estruturas
SELECT 'Verificando estrutura das tabelas:' as info;

-- Verificar estrutura da tabela clientes (se existir)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'clientes') THEN
        RAISE NOTICE 'Tabela clientes existe';
        -- Verificar colunas da tabela clientes
        PERFORM column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'clientes' 
        ORDER BY ordinal_position;
    ELSE
        RAISE NOTICE 'Tabela clientes não existe';
    END IF;
END $$;

-- Verificar estrutura da tabela avaliacoes (se existir)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'avaliacoes') THEN
        RAISE NOTICE 'Tabela avaliacoes existe';
        -- Verificar colunas da tabela avaliacoes
        PERFORM column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'avaliacoes' 
        ORDER BY ordinal_position;
    ELSE
        RAISE NOTICE 'Tabela avaliacoes não existe';
    END IF;
END $$;

-- Verificar estrutura da tabela historico_atendimentos (se existir)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'historico_atendimentos') THEN
        RAISE NOTICE 'Tabela historico_atendimentos existe';
        -- Verificar colunas da tabela historico_atendimentos
        PERFORM column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'historico_atendimentos' 
        ORDER BY ordinal_position;
    ELSE
        RAISE NOTICE 'Tabela historico_atendimentos não existe';
    END IF;
END $$;

-- ===== 2. VERIFICAR DADOS (COM VERIFICAÇÃO DE EXISTÊNCIA) =====

-- Verificar dados da tabela clientes (se existir)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'clientes') THEN
        RAISE NOTICE 'Dados da tabela clientes:';
        -- Contar registros
        PERFORM COUNT(*) FROM clientes;
        -- Mostrar alguns registros (apenas colunas que existem)
        PERFORM id, nome, telefone, status, created_at FROM clientes ORDER BY created_at DESC LIMIT 3;
    END IF;
END $$;

-- Verificar dados da tabela avaliacoes (se existir)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'avaliacoes') THEN
        RAISE NOTICE 'Dados da tabela avaliacoes:';
        -- Contar registros
        PERFORM COUNT(*) FROM avaliacoes;
        -- Mostrar alguns registros (apenas colunas que existem)
        PERFORM id, created_at FROM avaliacoes ORDER BY created_at DESC LIMIT 3;
    END IF;
END $$;

-- Verificar dados da tabela historico_atendimentos (se existir)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'historico_atendimentos') THEN
        RAISE NOTICE 'Dados da tabela historico_atendimentos:';
        -- Contar registros
        PERFORM COUNT(*) FROM historico_atendimentos;
        -- Mostrar alguns registros (apenas colunas que existem)
        PERFORM id, created_at FROM historico_atendimentos ORDER BY created_at DESC LIMIT 3;
    END IF;
END $$;

-- ===== 3. EXCLUIR TABELAS ANTIGAS =====

-- Excluir tabelas na ordem correta (respeitando foreign keys)
DROP TABLE IF EXISTS historico_atendimentos CASCADE;
DROP TABLE IF EXISTS avaliacoes CASCADE;
DROP TABLE IF EXISTS clientes CASCADE;

-- ===== 4. VERIFICAR LIMPEZA =====

-- Verificar se as tabelas foram excluídas
SELECT 'Tabelas antigas excluídas:' as info;
SELECT table_name 
FROM information_schema.tables 
WHERE table_name IN ('clientes', 'avaliacoes', 'historico_atendimentos');

-- Verificar tabelas que permaneceram
SELECT 'Tabelas restantes:' as info;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- ===== 5. VERIFICAR NOVAS TABELAS =====

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