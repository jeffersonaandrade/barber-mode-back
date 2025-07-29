-- Script para adicionar campo finalizado_por na tabela historico_atendimentos
-- Execute este script no SQL Editor do Supabase

-- Adicionar coluna finalizado_por para registrar quando um gerente finaliza um atendimento
ALTER TABLE historico_atendimentos 
ADD COLUMN IF NOT EXISTS finalizado_por UUID REFERENCES users(id);

-- Adicionar comentário explicativo
COMMENT ON COLUMN historico_atendimentos.finalizado_por IS 'ID do usuário (gerente) que finalizou o atendimento, quando diferente do barbeiro que iniciou';

-- Criar índice para melhor performance em consultas
CREATE INDEX IF NOT EXISTS idx_historico_finalizado_por ON historico_atendimentos(finalizado_por);

-- Atualizar políticas RLS se necessário
-- (As políticas atuais já são permissivas para desenvolvimento) 