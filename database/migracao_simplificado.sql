-- Script de Migração para Schema Simplificado
-- Execute este script para migrar do schema antigo para o novo

-- ===== BACKUP DAS TABELAS ATUAIS =====

-- Criar backup das tabelas existentes
CREATE TABLE IF NOT EXISTS backup_clientes AS SELECT * FROM clientes;
CREATE TABLE IF NOT EXISTS backup_avaliacoes AS SELECT * FROM avaliacoes;
CREATE TABLE IF NOT EXISTS backup_historico_atendimentos AS SELECT * FROM historico_atendimentos;

-- ===== CRIAR NOVAS TABELAS =====

-- Tabela de clientes na fila (TEMPORÁRIA - limpeza em 24h)
CREATE TABLE IF NOT EXISTS clientes_fila (
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
CREATE TABLE IF NOT EXISTS atendimentos_contabilizados (
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
CREATE TABLE IF NOT EXISTS avaliacoes_novas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barbearia_id INTEGER REFERENCES barbearias(id) ON DELETE CASCADE,
  barbeiro_id UUID REFERENCES users(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  categoria VARCHAR(50) CHECK (categoria IN ('atendimento', 'qualidade', 'ambiente', 'tempo', 'preco')),
  comentario TEXT,
  data_avaliacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de serviços (centralizada)
CREATE TABLE IF NOT EXISTS servicos (
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
CREATE TABLE IF NOT EXISTS horarios_funcionamento (
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
CREATE TABLE IF NOT EXISTS configuracoes_barbearia (
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

-- ===== MIGRAR DADOS EXISTENTES =====

-- Migrar clientes ativos para nova tabela
INSERT INTO clientes_fila (
  id, nome, telefone, token, barbearia_id, barbeiro_id, 
  status, posicao, tempo_estimado, data_entrada, 
  data_atendimento, data_finalizacao, created_at, updated_at
)
SELECT 
  id, nome, telefone, token, barbearia_id, barbeiro_id,
  status, posicao, tempo_estimado, data_entrada,
  data_atendimento, data_finalizacao, created_at, updated_at
FROM backup_clientes
WHERE status IN ('aguardando', 'proximo', 'atendendo');

-- Migrar avaliações (sem dados pessoais)
INSERT INTO avaliacoes_novas (
  barbearia_id, barbeiro_id, rating, categoria, comentario, data_avaliacao, created_at
)
SELECT 
  a.barbearia_id, a.barbeiro_id, a.rating, a.categoria, a.comentario, a.created_at, a.created_at
FROM backup_avaliacoes a
JOIN backup_clientes c ON a.cliente_id = c.id;

-- Migrar histórico para contabilização
INSERT INTO atendimentos_contabilizados (
  barbearia_id, barbeiro_id, data_atendimento, quantidade, valor_total, servico_principal, created_at
)
SELECT 
  h.barbearia_id, h.barbeiro_id, 
  DATE(h.data_inicio) as data_atendimento,
  COUNT(*) as quantidade,
  SUM(0) as valor_total, -- Valor será calculado baseado nos serviços
  'Serviço' as servico_principal,
  MIN(h.created_at) as created_at
FROM backup_historico_atendimentos h
GROUP BY h.barbearia_id, h.barbeiro_id, DATE(h.data_inicio);

-- Migrar serviços das barbearias existentes
INSERT INTO servicos (nome, descricao, preco, duracao, categoria, created_by)
SELECT 
  'Corte Masculino', 'Corte tradicional ou moderno com acabamento perfeito', 35.00, 30, 'corte',
  (SELECT id FROM users WHERE role = 'admin' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE nome = 'Corte Masculino');

INSERT INTO servicos (nome, descricao, preco, duracao, categoria, created_by)
SELECT 
  'Barba', 'Acabamento de barba com navalha e produtos premium', 25.00, 20, 'barba',
  (SELECT id FROM users WHERE role = 'admin' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE nome = 'Barba');

INSERT INTO servicos (nome, descricao, preco, duracao, categoria, created_by)
SELECT 
  'Corte + Barba', 'Combo completo com desconto especial', 50.00, 45, 'combo',
  (SELECT id FROM users WHERE role = 'admin' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE nome = 'Corte + Barba');

-- Migrar horários das barbearias existentes
INSERT INTO horarios_funcionamento (barbearia_id, dia_semana, aberto, hora_inicio, hora_fim)
SELECT 
  b.id, 1, true, '08:00', '18:00' -- Segunda
FROM barbearias b
WHERE NOT EXISTS (SELECT 1 FROM horarios_funcionamento WHERE barbearia_id = b.id AND dia_semana = 1);

INSERT INTO horarios_funcionamento (barbearia_id, dia_semana, aberto, hora_inicio, hora_fim)
SELECT 
  b.id, 2, true, '08:00', '18:00' -- Terça
FROM barbearias b
WHERE NOT EXISTS (SELECT 1 FROM horarios_funcionamento WHERE barbearia_id = b.id AND dia_semana = 2);

INSERT INTO horarios_funcionamento (barbearia_id, dia_semana, aberto, hora_inicio, hora_fim)
SELECT 
  b.id, 3, true, '08:00', '18:00' -- Quarta
FROM barbearias b
WHERE NOT EXISTS (SELECT 1 FROM horarios_funcionamento WHERE barbearia_id = b.id AND dia_semana = 3);

INSERT INTO horarios_funcionamento (barbearia_id, dia_semana, aberto, hora_inicio, hora_fim)
SELECT 
  b.id, 4, true, '08:00', '18:00' -- Quinta
FROM barbearias b
WHERE NOT EXISTS (SELECT 1 FROM horarios_funcionamento WHERE barbearia_id = b.id AND dia_semana = 4);

INSERT INTO horarios_funcionamento (barbearia_id, dia_semana, aberto, hora_inicio, hora_fim)
SELECT 
  b.id, 5, true, '08:00', '18:00' -- Sexta
FROM barbearias b
WHERE NOT EXISTS (SELECT 1 FROM horarios_funcionamento WHERE barbearia_id = b.id AND dia_semana = 5);

INSERT INTO horarios_funcionamento (barbearia_id, dia_semana, aberto, hora_inicio, hora_fim)
SELECT 
  b.id, 6, true, '08:00', '17:00' -- Sábado
FROM barbearias b
WHERE NOT EXISTS (SELECT 1 FROM horarios_funcionamento WHERE barbearia_id = b.id AND dia_semana = 6);

INSERT INTO horarios_funcionamento (barbearia_id, dia_semana, aberto, hora_inicio, hora_fim)
SELECT 
  b.id, 0, false, NULL, NULL -- Domingo
FROM barbearias b
WHERE NOT EXISTS (SELECT 1 FROM horarios_funcionamento WHERE barbearia_id = b.id AND dia_semana = 0);

-- Migrar configurações das barbearias existentes
INSERT INTO configuracoes_barbearia (barbearia_id, chave, valor, tipo, descricao)
SELECT 
  b.id, 'tempo_medio_atendimento', '30', 'number', 'Tempo médio de atendimento em minutos'
FROM barbearias b
WHERE NOT EXISTS (SELECT 1 FROM configuracoes_barbearia WHERE barbearia_id = b.id AND chave = 'tempo_medio_atendimento');

INSERT INTO configuracoes_barbearia (barbearia_id, chave, valor, tipo, descricao)
SELECT 
  b.id, 'max_clientes_fila', '50', 'number', 'Máximo de clientes na fila'
FROM barbearias b
WHERE NOT EXISTS (SELECT 1 FROM configuracoes_barbearia WHERE barbearia_id = b.id AND chave = 'max_clientes_fila');

INSERT INTO configuracoes_barbearia (barbearia_id, chave, valor, tipo, descricao)
SELECT 
  b.id, 'permitir_agendamento', 'false', 'boolean', 'Permitir agendamento de horários'
FROM barbearias b
WHERE NOT EXISTS (SELECT 1 FROM configuracoes_barbearia WHERE barbearia_id = b.id AND chave = 'permitir_agendamento');

INSERT INTO configuracoes_barbearia (barbearia_id, chave, valor, tipo, descricao)
SELECT 
  b.id, 'mostrar_tempo_estimado', 'true', 'boolean', 'Mostrar tempo estimado na fila'
FROM barbearias b
WHERE NOT EXISTS (SELECT 1 FROM configuracoes_barbearia WHERE barbearia_id = b.id AND chave = 'mostrar_tempo_estimado');

INSERT INTO configuracoes_barbearia (barbearia_id, chave, valor, tipo, descricao)
SELECT 
  b.id, 'notificar_whatsapp', 'true', 'boolean', 'Enviar notificação por WhatsApp'
FROM barbearias b
WHERE NOT EXISTS (SELECT 1 FROM configuracoes_barbearia WHERE barbearia_id = b.id AND chave = 'notificar_whatsapp');

INSERT INTO configuracoes_barbearia (barbearia_id, chave, valor, tipo, descricao)
SELECT 
  b.id, 'limpeza_automatica_horas', '24', 'number', 'Horas para limpeza automática de dados'
FROM barbearias b
WHERE NOT EXISTS (SELECT 1 FROM configuracoes_barbearia WHERE barbearia_id = b.id AND chave = 'limpeza_automatica_horas');

-- ===== CRIAR ÍNDICES =====

-- Índices para clientes_fila
CREATE INDEX IF NOT EXISTS idx_clientes_fila_barbearia_id ON clientes_fila(barbearia_id);
CREATE INDEX IF NOT EXISTS idx_clientes_fila_status ON clientes_fila(status);
CREATE INDEX IF NOT EXISTS idx_clientes_fila_posicao ON clientes_fila(posicao);
CREATE INDEX IF NOT EXISTS idx_clientes_fila_token ON clientes_fila(token);
CREATE INDEX IF NOT EXISTS idx_clientes_fila_barbeiro_id ON clientes_fila(barbeiro_id);
CREATE INDEX IF NOT EXISTS idx_clientes_fila_data_finalizacao ON clientes_fila(data_finalizacao);

-- Índices para atendimentos_contabilizados
CREATE INDEX IF NOT EXISTS idx_atendimentos_barbearia_id ON atendimentos_contabilizados(barbearia_id);
CREATE INDEX IF NOT EXISTS idx_atendimentos_barbeiro_id ON atendimentos_contabilizados(barbeiro_id);
CREATE INDEX IF NOT EXISTS idx_atendimentos_data ON atendimentos_contabilizados(data_atendimento);

-- Índices para avaliações
CREATE INDEX IF NOT EXISTS idx_avaliacoes_barbearia_id ON avaliacoes_novas(barbearia_id);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_barbeiro_id ON avaliacoes_novas(barbeiro_id);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_rating ON avaliacoes_novas(rating);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_data ON avaliacoes_novas(data_avaliacao);

-- Índices para configurações
CREATE INDEX IF NOT EXISTS idx_servicos_ativo ON servicos(ativo);
CREATE INDEX IF NOT EXISTS idx_servicos_categoria ON servicos(categoria);
CREATE INDEX IF NOT EXISTS idx_horarios_barbearia_id ON horarios_funcionamento(barbearia_id);
CREATE INDEX IF NOT EXISTS idx_config_barbearia_id ON configuracoes_barbearia(barbearia_id);

-- ===== CRIAR FUNÇÕES E TRIGGERS =====

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
DROP TRIGGER IF EXISTS update_clientes_fila_updated_at ON clientes_fila;
CREATE TRIGGER update_clientes_fila_updated_at BEFORE UPDATE ON clientes_fila FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_servicos_updated_at ON servicos;
CREATE TRIGGER update_servicos_updated_at BEFORE UPDATE ON servicos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_horarios_updated_at ON horarios_funcionamento;
CREATE TRIGGER update_horarios_updated_at BEFORE UPDATE ON horarios_funcionamento FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_config_updated_at ON configuracoes_barbearia;
CREATE TRIGGER update_config_updated_at BEFORE UPDATE ON configuracoes_barbearia FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função de limpeza automática
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

-- ===== CONFIGURAR RLS =====

ALTER TABLE clientes_fila ENABLE ROW LEVEL SECURITY;
ALTER TABLE atendimentos_contabilizados ENABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacoes_novas ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE horarios_funcionamento ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracoes_barbearia ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para desenvolvimento
CREATE POLICY "Allow all operations on clientes_fila" ON clientes_fila FOR ALL USING (true);
CREATE POLICY "Allow all operations on atendimentos_contabilizados" ON atendimentos_contabilizados FOR ALL USING (true);
CREATE POLICY "Allow all operations on avaliacoes_novas" ON avaliacoes_novas FOR ALL USING (true);
CREATE POLICY "Allow all operations on servicos" ON servicos FOR ALL USING (true);
CREATE POLICY "Allow all operations on horarios_funcionamento" ON horarios_funcionamento FOR ALL USING (true);
CREATE POLICY "Allow all operations on configuracoes_barbearia" ON configuracoes_barbearia FOR ALL USING (true);

-- ===== REMOVER TABELAS ANTIGAS (OPCIONAL) =====

-- DESCOMENTE AS LINHAS ABAIXO APÓS CONFIRMAR QUE A MIGRAÇÃO FOI BEM-SUCEDIDA
-- DROP TABLE IF EXISTS clientes;
-- DROP TABLE IF EXISTS avaliacoes;
-- DROP TABLE IF EXISTS historico_atendimentos;

-- ===== VERIFICAÇÃO DA MIGRAÇÃO =====

-- Verificar se os dados foram migrados corretamente
SELECT 'Clientes na fila migrados:' as info, COUNT(*) as total FROM clientes_fila;
SELECT 'Avaliações migradas:' as info, COUNT(*) as total FROM avaliacoes_novas;
SELECT 'Atendimentos contabilizados:' as info, COUNT(*) as total FROM atendimentos_contabilizados;
SELECT 'Serviços criados:' as info, COUNT(*) as total FROM servicos;
SELECT 'Horários criados:' as info, COUNT(*) as total FROM horarios_funcionamento;
SELECT 'Configurações criadas:' as info, COUNT(*) as total FROM configuracoes_barbearia; 