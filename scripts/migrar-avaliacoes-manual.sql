-- ========================================
-- 🚀 MIGRAÇÃO MANUAL DA TABELA AVALIAÇÕES
-- ========================================
-- Execute estes comandos no seu banco de dados PostgreSQL/Supabase

-- 1. Adicionar colunas rating_estrutura e rating_barbeiro
ALTER TABLE avaliacoes 
ADD COLUMN IF NOT EXISTS rating_estrutura INTEGER CHECK (rating_estrutura >= 1 AND rating_estrutura <= 5);

ALTER TABLE avaliacoes 
ADD COLUMN IF NOT EXISTS rating_barbeiro INTEGER CHECK (rating_barbeiro >= 1 AND rating_barbeiro <= 5);

-- 2. Migrar dados existentes (se houver)
UPDATE avaliacoes 
SET rating_estrutura = rating, rating_barbeiro = rating 
WHERE rating_estrutura IS NULL;

-- 3. Tornar colunas obrigatórias
ALTER TABLE avaliacoes 
ALTER COLUMN rating_estrutura SET NOT NULL;

ALTER TABLE avaliacoes 
ALTER COLUMN rating_barbeiro SET NOT NULL;

-- 4. Verificar se a migração foi bem-sucedida
SELECT 
  COUNT(*) as total_avaliacoes,
  COUNT(rating_estrutura) as com_rating_estrutura,
  COUNT(rating_barbeiro) as com_rating_barbeiro
FROM avaliacoes;

-- 5. Opcional: Remover coluna rating antiga (descomente se quiser)
-- ALTER TABLE avaliacoes DROP COLUMN IF EXISTS rating;

-- ========================================
-- ✅ MIGRAÇÃO CONCLUÍDA!
-- ======================================== 