-- Adicionar coluna gerente_id na tabela barbearias
-- Execute este script no SQL Editor do Supabase

-- Adicionar coluna gerente_id
ALTER TABLE barbearias 
ADD COLUMN gerente_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- Adicionar índice para melhor performance
CREATE INDEX idx_barbearias_gerente_id ON barbearias(gerente_id);

-- Comentário explicativo
COMMENT ON COLUMN barbearias.gerente_id IS 'ID do usuário gerente responsável por esta barbearia';

-- Verificar se a coluna foi adicionada
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'barbearias' AND column_name = 'gerente_id'; 