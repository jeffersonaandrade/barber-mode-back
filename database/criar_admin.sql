-- Script para criar usuário admin padrão
-- Execute este script no seu banco de dados Supabase

-- Primeiro, vamos remover o admin existente (se houver) para evitar duplicatas
DELETE FROM users WHERE email = 'admin@lucasbarbearia.com';

-- Inserir usuário admin padrão
-- Email: admin@lucasbarbearia.com
-- Senha: admin123
-- Role: admin
INSERT INTO users (email, password_hash, role, nome, active, created_at, updated_at) VALUES (
  'admin@lucasbarbearia.com',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', -- senha: admin123
  'admin',
  'Administrador',
  true,
  NOW(),
  NOW()
);

-- Verificar se foi inserido corretamente
SELECT id, email, role, nome, active, created_at 
FROM users 
WHERE email = 'admin@lucasbarbearia.com';

-- Se você quiser criar também um gerente de exemplo:
-- Email: gerente@lucasbarbearia.com
-- Senha: gerente123
-- Role: gerente
INSERT INTO users (email, password_hash, role, nome, active, created_at, updated_at) VALUES (
  'gerente@lucasbarbearia.com',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', -- senha: admin123 (mesma do admin)
  'gerente',
  'Gerente',
  true,
  NOW(),
  NOW()
);

-- Se você quiser criar também um barbeiro de exemplo:
-- Email: barbeiro@lucasbarbearia.com
-- Senha: barbeiro123
-- Role: barbeiro
INSERT INTO users (email, password_hash, role, nome, active, created_at, updated_at) VALUES (
  'barbeiro@lucasbarbearia.com',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', -- senha: admin123 (mesma do admin)
  'barbeiro',
  'Barbeiro',
  true,
  NOW(),
  NOW()
);

-- Listar todos os usuários criados
SELECT id, email, role, nome, active, created_at 
FROM users 
WHERE email IN (
  'admin@lucasbarbearia.com',
  'gerente@lucasbarbearia.com', 
  'barbeiro@lucasbarbearia.com'
)
ORDER BY role, email; 