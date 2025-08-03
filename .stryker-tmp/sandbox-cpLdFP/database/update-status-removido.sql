-- Script para atualizar o banco de dados com o novo status 'removido'
-- Execute este script no SQL Editor do Supabase

-- 1. Remover a constraint atual de status
ALTER TABLE clientes DROP CONSTRAINT IF EXISTS clientes_status_check;

-- 2. Adicionar nova constraint com o status 'removido'
ALTER TABLE clientes ADD CONSTRAINT clientes_status_check 
CHECK (status IN ('aguardando', 'proximo', 'atendendo', 'finalizado', 'removido'));

-- 3. Verificar se a alteração foi aplicada
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'clientes' AND column_name = 'status';

-- 4. Verificar as constraints da tabela
SELECT 
    constraint_name,
    constraint_type,
    check_clause
FROM information_schema.check_constraints 
WHERE constraint_name = 'clientes_status_check';

-- 5. Testar inserção com o novo status (opcional - remover após teste)
-- INSERT INTO clientes (nome, telefone, token, barbearia_id, status, posicao) 
-- VALUES ('Teste Removido', '11999999999', 'test-token-removido', 1, 'removido', 999);

-- 6. Limpar dados de teste (se aplicável)
-- DELETE FROM clientes WHERE nome = 'Teste Removido';

-- Comentário: Agora a tabela clientes suporta todos os 5 status:
-- - aguardando: Cliente na fila, aguardando ser chamado
-- - proximo: Cliente foi chamado, aguardando aparecer no balcão  
-- - atendendo: Cliente apareceu no balcão, atendimento iniciado
-- - finalizado: Atendimento concluído com sucesso
-- - removido: Cliente não apareceu no balcão, removido da fila 