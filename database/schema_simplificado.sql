-- Lucas Barbearia - Schema Simplificado
-- Sistema otimizado para limpeza automática e centralização de configurações

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de usuários (mantida)
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

-- Tabela de barbearias (simplificada)
CREATE TABLE barbearias (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  endereco TEXT NOT NULL,
  telefone VARCHAR(20),
  whatsapp VARCHAR(20),
  instagram VARCHAR(100),
  ativo BOOLEAN DEFAULT true,
  gerente_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de relacionamento barbeiros-barbearias (mantida)
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

-- Tabela de clientes na fila (TEMPORÁRIA - limpeza em 24h)
CREATE TABLE clientes_fila (
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

-- Tabela de contabilização de atendimentos (PERMANENTE - para dashboard)
CREATE TABLE atendimentos_contabilizados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barbearia_id INTEGER REFERENCES barbearias(id) ON DELETE CASCADE,
  barbeiro_id UUID REFERENCES users(id),
  data_atendimento DATE NOT NULL,
  quantidade INTEGER NOT NULL DEFAULT 1,
  valor_total DECIMAL(10,2) DEFAULT 0,
  servico_principal VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de avaliações (PERMANENTE - sem dados pessoais)
CREATE TABLE avaliacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barbearia_id INTEGER REFERENCES barbearias(id) ON DELETE CASCADE,
  barbeiro_id UUID REFERENCES users(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  categoria VARCHAR(50) CHECK (categoria IN ('atendimento', 'qualidade', 'ambiente', 'tempo', 'preco')),
  comentario TEXT,
  data_avaliacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== NOVAS TABELAS DE CONFIGURAÇÃO CENTRALIZADA =====

-- Tabela de serviços (centralizada)
CREATE TABLE servicos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10,2) NOT NULL,
  duracao INTEGER NOT NULL, -- em minutos
  categoria VARCHAR(100),
  ativo BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de horários de funcionamento (centralizada)
CREATE TABLE horarios_funcionamento (
  id SERIAL PRIMARY KEY,
  barbearia_id INTEGER REFERENCES barbearias(id) ON DELETE CASCADE,
  dia_semana INTEGER NOT NULL CHECK (dia_semana >= 0 AND dia_semana <= 6), -- 0=domingo, 1=segunda, etc
  aberto BOOLEAN DEFAULT true,
  hora_inicio TIME,
  hora_fim TIME,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(barbearia_id, dia_semana)
);

-- Tabela de configurações gerais (centralizada)
CREATE TABLE configuracoes_barbearia (
  id SERIAL PRIMARY KEY,
  barbearia_id INTEGER REFERENCES barbearias(id) ON DELETE CASCADE,
  chave VARCHAR(100) NOT NULL,
  valor TEXT,
  tipo VARCHAR(50) DEFAULT 'string', -- string, number, boolean, json
  descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(barbearia_id, chave)
);

-- ===== ÍNDICES PARA PERFORMANCE =====

-- Índices para clientes_fila (tabela temporária)
CREATE INDEX idx_clientes_fila_barbearia_id ON clientes_fila(barbearia_id);
CREATE INDEX idx_clientes_fila_status ON clientes_fila(status);
CREATE INDEX idx_clientes_fila_posicao ON clientes_fila(posicao);
CREATE INDEX idx_clientes_fila_token ON clientes_fila(token);
CREATE INDEX idx_clientes_fila_barbeiro_id ON clientes_fila(barbeiro_id);
CREATE INDEX idx_clientes_fila_data_finalizacao ON clientes_fila(data_finalizacao);

-- Índices para atendimentos_contabilizados
CREATE INDEX idx_atendimentos_barbearia_id ON atendimentos_contabilizados(barbearia_id);
CREATE INDEX idx_atendimentos_barbeiro_id ON atendimentos_contabilizados(barbeiro_id);
CREATE INDEX idx_atendimentos_data ON atendimentos_contabilizados(data_atendimento);

-- Índices para avaliações
CREATE INDEX idx_avaliacoes_barbearia_id ON avaliacoes(barbearia_id);
CREATE INDEX idx_avaliacoes_barbeiro_id ON avaliacoes(barbeiro_id);
CREATE INDEX idx_avaliacoes_rating ON avaliacoes(rating);
CREATE INDEX idx_avaliacoes_data ON avaliacoes(data_avaliacao);

-- Índices para configurações
CREATE INDEX idx_servicos_ativo ON servicos(ativo);
CREATE INDEX idx_servicos_categoria ON servicos(categoria);
CREATE INDEX idx_horarios_barbearia_id ON horarios_funcionamento(barbearia_id);
CREATE INDEX idx_config_barbearia_id ON configuracoes_barbearia(barbearia_id);

-- ===== FUNÇÕES E TRIGGERS =====

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
CREATE TRIGGER update_clientes_fila_updated_at BEFORE UPDATE ON clientes_fila FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_servicos_updated_at BEFORE UPDATE ON servicos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_horarios_updated_at BEFORE UPDATE ON horarios_funcionamento FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_config_updated_at BEFORE UPDATE ON configuracoes_barbearia FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===== FUNÇÃO DE LIMPEZA AUTOMÁTICA =====

-- Função para limpar dados antigos da fila (executar diariamente)
CREATE OR REPLACE FUNCTION limpar_fila_antiga()
RETURNS INTEGER AS $$
DECLARE
    registros_removidos INTEGER;
BEGIN
    DELETE FROM clientes_fila 
    WHERE data_finalizacao IS NOT NULL 
    AND data_finalizacao < NOW() - INTERVAL '24 hours';
    
    GET DIAGNOSTICS registros_removidos = ROW_COUNT;
    
    RETURN registros_removidos;
END;
$$ LANGUAGE plpgsql;

-- ===== ROW LEVEL SECURITY (RLS) =====

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE barbearias ENABLE ROW LEVEL SECURITY;
ALTER TABLE barbeiros_barbearias ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes_fila ENABLE ROW LEVEL SECURITY;
ALTER TABLE atendimentos_contabilizados ENABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE horarios_funcionamento ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracoes_barbearia ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para desenvolvimento (permissivas)
-- IMPORTANTE: Em produção, implementar políticas mais restritivas

CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations on barbearias" ON barbearias FOR ALL USING (true);
CREATE POLICY "Allow all operations on barbeiros_barbearias" ON barbeiros_barbearias FOR ALL USING (true);
CREATE POLICY "Allow all operations on clientes_fila" ON clientes_fila FOR ALL USING (true);
CREATE POLICY "Allow all operations on atendimentos_contabilizados" ON atendimentos_contabilizados FOR ALL USING (true);
CREATE POLICY "Allow all operations on avaliacoes" ON avaliacoes FOR ALL USING (true);
CREATE POLICY "Allow all operations on servicos" ON servicos FOR ALL USING (true);
CREATE POLICY "Allow all operations on horarios_funcionamento" ON horarios_funcionamento FOR ALL USING (true);
CREATE POLICY "Allow all operations on configuracoes_barbearia" ON configuracoes_barbearia FOR ALL USING (true);

-- ===== DADOS INICIAIS =====

-- Inserir usuário admin padrão (senha: admin123)
INSERT INTO users (email, password_hash, role, nome, active) VALUES (
  'admin@lucasbarbearia.com',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', -- admin123
  'admin',
  'Administrador',
  true
);

-- Inserir barbearia de exemplo
INSERT INTO barbearias (nome, endereco, telefone, whatsapp, instagram, gerente_id) VALUES (
  'Lucas Barbearia - Centro',
  'Rua das Flores, 123 - Centro, São Paulo - SP',
  '(11) 99999-9999',
  '(11) 99999-9999',
  '@lucasbarbearia',
  (SELECT id FROM users WHERE email = 'admin@lucasbarbearia.com')
);

-- Inserir serviços padrão
INSERT INTO servicos (nome, descricao, preco, duracao, categoria, created_by) VALUES
('Corte Masculino', 'Corte tradicional ou moderno com acabamento perfeito. Inclui lavagem, corte e finalização.', 35.00, 30, 'corte', (SELECT id FROM users WHERE email = 'admin@lucasbarbearia.com')),
('Barba', 'Acabamento de barba com navalha e produtos premium para um visual impecável.', 25.00, 20, 'barba', (SELECT id FROM users WHERE email = 'admin@lucasbarbearia.com')),
('Corte + Barba', 'Combo completo com desconto especial. Corte e barba em uma única sessão.', 50.00, 45, 'combo', (SELECT id FROM users WHERE email = 'admin@lucasbarbearia.com')),
('Hidratação', 'Tratamento hidratante para cabelo e couro cabeludo.', 20.00, 15, 'tratamento', (SELECT id FROM users WHERE email = 'admin@lucasbarbearia.com')),
('Pigmentação', 'Coloração natural para cabelo e barba.', 40.00, 60, 'coloração', (SELECT id FROM users WHERE email = 'admin@lucasbarbearia.com')),
('Pacote Completo', 'Experiência completa com todos os serviços incluídos.', 80.00, 90, 'pacote', (SELECT id FROM users WHERE email = 'admin@lucasbarbearia.com'));

-- Inserir horários padrão (segunda a sábado)
INSERT INTO horarios_funcionamento (barbearia_id, dia_semana, aberto, hora_inicio, hora_fim) VALUES
(1, 1, true, '08:00', '18:00'), -- Segunda
(1, 2, true, '08:00', '18:00'), -- Terça
(1, 3, true, '08:00', '18:00'), -- Quarta
(1, 4, true, '08:00', '18:00'), -- Quinta
(1, 5, true, '08:00', '18:00'), -- Sexta
(1, 6, true, '08:00', '17:00'), -- Sábado
(1, 0, false, NULL, NULL);      -- Domingo

-- Inserir configurações padrão
INSERT INTO configuracoes_barbearia (barbearia_id, chave, valor, tipo, descricao) VALUES
(1, 'tempo_medio_atendimento', '30', 'number', 'Tempo médio de atendimento em minutos'),
(1, 'max_clientes_fila', '50', 'number', 'Máximo de clientes na fila'),
(1, 'permitir_agendamento', 'false', 'boolean', 'Permitir agendamento de horários'),
(1, 'mostrar_tempo_estimado', 'true', 'boolean', 'Mostrar tempo estimado na fila'),
(1, 'notificar_whatsapp', 'true', 'boolean', 'Enviar notificação por WhatsApp'),
(1, 'limpeza_automatica_horas', '24', 'number', 'Horas para limpeza automática de dados');

-- Comentários das tabelas
COMMENT ON TABLE users IS 'Tabela de usuários do sistema (admin, gerente, barbeiro)';
COMMENT ON TABLE barbearias IS 'Tabela de barbearias do sistema';
COMMENT ON TABLE barbeiros_barbearias IS 'Relacionamento entre barbeiros e barbearias';
COMMENT ON TABLE clientes_fila IS 'Clientes na fila das barbearias (dados temporários - limpeza em 24h)';
COMMENT ON TABLE atendimentos_contabilizados IS 'Contabilização de atendimentos para dashboard (dados permanentes)';
COMMENT ON TABLE avaliacoes IS 'Avaliações dos clientes (sem dados pessoais)';
COMMENT ON TABLE servicos IS 'Serviços oferecidos pelas barbearias (centralizado)';
COMMENT ON TABLE horarios_funcionamento IS 'Horários de funcionamento das barbearias (centralizado)';
COMMENT ON TABLE configuracoes_barbearia IS 'Configurações gerais das barbearias (centralizado)'; 