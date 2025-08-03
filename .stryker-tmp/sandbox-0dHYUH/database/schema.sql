-- Lucas Barbearia - Schema do Banco de Dados
-- Execute este script no SQL Editor do Supabase

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de usuários
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'gerente', 'barbeiro')),
  nome VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  active BOOLEAN DEFAULT true
);

-- Tabela de barbearias
CREATE TABLE barbearias (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  endereco TEXT NOT NULL,
  telefone VARCHAR(20),
  whatsapp VARCHAR(20),
  instagram VARCHAR(100),
  horario JSONB NOT NULL,
  configuracoes JSONB NOT NULL DEFAULT '{}',
  servicos JSONB NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de relacionamento barbeiros-barbearias
CREATE TABLE barbeiros_barbearias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  barbearia_id INTEGER REFERENCES barbearias(id) ON DELETE CASCADE,
  especialidade VARCHAR(255),
  dias_trabalho JSONB NOT NULL DEFAULT '[]',
  horario_inicio TIME NOT NULL,
  horario_fim TIME NOT NULL,
  disponivel BOOLEAN DEFAULT true,
  ativo BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, barbearia_id)
);

-- Tabela de clientes na fila
CREATE TABLE clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  barbearia_id INTEGER REFERENCES barbearias(id) ON DELETE CASCADE,
  barbeiro_id UUID REFERENCES users(id),
  status VARCHAR(50) NOT NULL DEFAULT 'aguardando' CHECK (status IN ('aguardando', 'proximo', 'atendendo', 'finalizado', 'removido')),
  posicao INTEGER NOT NULL,
  tempo_estimado INTEGER,
  data_entrada TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_atendimento TIMESTAMP WITH TIME ZONE,
  data_finalizacao TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de avaliações
CREATE TABLE avaliacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
  barbearia_id INTEGER REFERENCES barbearias(id) ON DELETE CASCADE,
  barbeiro_id UUID REFERENCES users(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  categoria VARCHAR(50) CHECK (categoria IN ('atendimento', 'qualidade', 'ambiente', 'tempo', 'preco')),
  comentario TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de histórico de atendimentos
CREATE TABLE historico_atendimentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
  barbearia_id INTEGER REFERENCES barbearias(id) ON DELETE CASCADE,
  barbeiro_id UUID REFERENCES users(id),
  servico VARCHAR(255),
  duracao INTEGER,
  data_inicio TIMESTAMP WITH TIME ZONE,
  data_fim TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(active);

CREATE INDEX idx_barbearias_ativo ON barbearias(ativo);
CREATE INDEX idx_barbearias_nome ON barbearias(nome);

CREATE INDEX idx_barbeiros_barbearias_user_id ON barbeiros_barbearias(user_id);
CREATE INDEX idx_barbeiros_barbearias_barbearia_id ON barbeiros_barbearias(barbearia_id);
CREATE INDEX idx_barbeiros_barbearias_ativo ON barbeiros_barbearias(ativo);
CREATE INDEX idx_barbeiros_barbearias_disponivel ON barbeiros_barbearias(disponivel);

CREATE INDEX idx_clientes_barbearia_id ON clientes(barbearia_id);
CREATE INDEX idx_clientes_status ON clientes(status);
CREATE INDEX idx_clientes_posicao ON clientes(posicao);
CREATE INDEX idx_clientes_token ON clientes(token);
CREATE INDEX idx_clientes_barbeiro_id ON clientes(barbeiro_id);

CREATE INDEX idx_avaliacoes_barbearia_id ON avaliacoes(barbearia_id);
CREATE INDEX idx_avaliacoes_barbeiro_id ON avaliacoes(barbeiro_id);
CREATE INDEX idx_avaliacoes_rating ON avaliacoes(rating);
CREATE INDEX idx_avaliacoes_created_at ON avaliacoes(created_at);

CREATE INDEX idx_historico_barbearia_id ON historico_atendimentos(barbearia_id);
CREATE INDEX idx_historico_barbeiro_id ON historico_atendimentos(barbeiro_id);
CREATE INDEX idx_historico_data_inicio ON historico_atendimentos(data_inicio);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_barbearias_updated_at BEFORE UPDATE ON barbearias FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_barbeiros_barbearias_updated_at BEFORE UPDATE ON barbeiros_barbearias FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON clientes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) - Políticas de segurança
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE barbearias ENABLE ROW LEVEL SECURITY;
ALTER TABLE barbeiros_barbearias ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE historico_atendimentos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para desenvolvimento (permissivas)
-- IMPORTANTE: Estas políticas são permissivas para desenvolvimento
-- Em produção, você deve implementar políticas mais restritivas baseadas nos roles dos usuários

-- Políticas para users - permitir todas as operações
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

-- Inserir usuário admin padrão (senha: admin123)
-- IMPORTANTE: Altere a senha em produção!
INSERT INTO users (email, password_hash, role, nome, active) VALUES (
  'admin@lucasbarbearia.com',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', -- admin123
  'admin',
  'Administrador',
  true
);

-- Inserir barbearia de exemplo
INSERT INTO barbearias (nome, endereco, telefone, whatsapp, instagram, horario, configuracoes, servicos) VALUES (
  'Lucas Barbearia - Centro',
  'Rua das Flores, 123 - Centro, São Paulo - SP',
  '(11) 99999-9999',
  '(11) 99999-9999',
  '@lucasbarbearia',
  '{
    "segunda": {"aberto": true, "inicio": "08:00", "fim": "18:00"},
    "terca": {"aberto": true, "inicio": "08:00", "fim": "18:00"},
    "quarta": {"aberto": true, "inicio": "08:00", "fim": "18:00"},
    "quinta": {"aberto": true, "inicio": "08:00", "fim": "18:00"},
    "sexta": {"aberto": true, "inicio": "08:00", "fim": "18:00"},
    "sabado": {"aberto": true, "inicio": "08:00", "fim": "17:00"},
    "domingo": {"aberto": false}
  }',
  '{
    "tempo_medio_atendimento": 30,
    "max_clientes_fila": 50,
    "permitir_agendamento": false,
    "mostrar_tempo_estimado": true
  }',
  '[
    {"nome": "Corte Masculino", "preco": 25.00, "duracao": 30, "descricao": "Corte tradicional masculino"},
    {"nome": "Barba", "preco": 15.00, "duracao": 20, "descricao": "Acabamento na barba"},
    {"nome": "Corte + Barba", "preco": 35.00, "duracao": 45, "descricao": "Corte completo com barba"},
    {"nome": "Sobrancelha", "preco": 10.00, "duracao": 15, "descricao": "Design de sobrancelha"}
  ]'
);

-- Comentários das tabelas
COMMENT ON TABLE users IS 'Tabela de usuários do sistema (admin, gerente, barbeiro)';
COMMENT ON TABLE barbearias IS 'Tabela de barbearias do sistema';
COMMENT ON TABLE barbeiros_barbearias IS 'Relacionamento entre barbeiros e barbearias';
COMMENT ON TABLE clientes IS 'Clientes na fila das barbearias';
COMMENT ON TABLE avaliacoes IS 'Avaliações dos clientes sobre os atendimentos';
COMMENT ON TABLE historico_atendimentos IS 'Histórico de todos os atendimentos realizados'; 