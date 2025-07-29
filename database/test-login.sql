-- Teste de login direto no banco
-- Esta query simula o que o código está fazendo

-- 1. Verificar se o usuário existe e está ativo
SELECT 
  id, 
  email, 
  nome, 
  role, 
  active, 
  password_hash,
  created_at
FROM users 
WHERE email = 'admin@lucasbarbearia.com' 
  AND active = true;

-- 2. Verificar se há políticas RLS que possam estar bloqueando
-- Execute esta query como usuário anônimo para ver se consegue acessar
SELECT 
  'Teste de acesso anônimo' as teste,
  COUNT(*) as total_usuarios
FROM users 
WHERE email = 'admin@lucasbarbearia.com';

-- 3. Verificar estrutura da tabela users
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. Verificar políticas RLS na tabela users
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'users'; 