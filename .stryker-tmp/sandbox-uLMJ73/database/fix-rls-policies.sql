-- Script para corrigir as políticas RLS para autenticação customizada
-- Execute este script no SQL Editor do Supabase
-- 
-- QUANDO USAR:
-- - Quando você estiver usando autenticação customizada (não Supabase Auth)
-- - Quando as políticas RLS estiverem bloqueando operações
-- - Para desenvolvimento e testes
-- 
-- IMPORTANTE: Estas políticas são permissivas para desenvolvimento
-- Em produção, implemente políticas mais restritivas baseadas nos roles dos usuários

-- Remover políticas existentes
DROP POLICY IF EXISTS "Admin can view all users" ON users;
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Anyone can view active barbearias" ON barbearias;
DROP POLICY IF EXISTS "Admin can manage barbearias" ON barbearias;
DROP POLICY IF EXISTS "View barbeiros for barbearia" ON barbeiros_barbearias;
DROP POLICY IF EXISTS "Admin can manage barbeiros" ON barbeiros_barbearias;
DROP POLICY IF EXISTS "Barbeiro can view own data" ON barbeiros_barbearias;
DROP POLICY IF EXISTS "View clients for barbearia" ON clientes;
DROP POLICY IF EXISTS "Admin can manage clients" ON clientes;
DROP POLICY IF EXISTS "Barbeiro can manage clients in their barbearia" ON clientes;
DROP POLICY IF EXISTS "View avaliacoes" ON avaliacoes;
DROP POLICY IF EXISTS "Admin can manage avaliacoes" ON avaliacoes;
DROP POLICY IF EXISTS "View historico" ON historico_atendimentos;
DROP POLICY IF EXISTS "Admin can manage historico" ON historico_atendimentos;

-- Criar políticas mais permissivas para desenvolvimento
-- Em produção, você deve ajustar essas políticas conforme necessário

-- Políticas para users - permitir inserção e seleção
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true);

-- Políticas para barbearias - permitir todas as operações
CREATE POLICY "Allow all operations on barbearias" ON barbearias FOR ALL USING (true);

-- Políticas para barbeiros_barbearias - permitir todas as operações
CREATE POLICY "Allow all operations on barbeiros_barbearias" ON barbeiros_barbearias FOR ALL USING (true);

-- Políticas para clientes - permitir todas as operações
CREATE POLICY "Allow all operations on clientes" ON clientes FOR ALL USING (true);

-- Políticas para avaliacoes - permitir todas as operações
CREATE POLICY "Allow all operations on avaliacoes" ON avaliacoes FOR ALL USING (true);

-- Políticas para historico_atendimentos - permitir todas as operações
CREATE POLICY "Allow all operations on historico_atendimentos" ON historico_atendimentos FOR ALL USING (true);

-- Comentário: Estas políticas são permissivas para desenvolvimento
-- Em produção, você deve implementar políticas mais restritivas baseadas nos roles dos usuários 