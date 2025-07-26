-- Sistema de Agendamentos - Lucas Barbearia
-- Execute este script no SQL Editor do Supabase

-- =====================================================
-- TABELA DE AGENDAMENTOS
-- =====================================================

CREATE TABLE agendamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
  barbearia_id INTEGER REFERENCES barbearias(id) ON DELETE CASCADE,
  barbeiro_id UUID REFERENCES users(id),
  servico_id VARCHAR(255), -- ID do serviço escolhido
  data_agendamento DATE NOT NULL,
  hora_agendamento TIME NOT NULL,
  data_hora_agendamento TIMESTAMP WITH TIME ZONE NOT NULL, -- Combinação de data + hora
  duracao_estimada INTEGER DEFAULT 30, -- Duração em minutos
  status VARCHAR(50) NOT NULL DEFAULT 'agendado' CHECK (status IN ('agendado', 'confirmado', 'em_atendimento', 'finalizado', 'cancelado', 'nao_compareceu')),
  observacoes TEXT,
  nome_cliente VARCHAR(255) NOT NULL,
  telefone_cliente VARCHAR(20) NOT NULL,
  email_cliente VARCHAR(255),
  prioridade INTEGER DEFAULT 0, -- 0 = normal, 1 = alta, 2 = urgente
  token_agendamento VARCHAR(255) UNIQUE NOT NULL, -- Token único para o agendamento
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints para garantir integridade
  CONSTRAINT check_data_futura CHECK (data_hora_agendamento > NOW()),
  CONSTRAINT check_horario_valido CHECK (
    hora_agendamento >= '06:00' AND hora_agendamento <= '23:59'
  )
);

-- =====================================================
-- TABELA DE CONFIGURAÇÕES DE AGENDAMENTO POR BARBEARIA
-- =====================================================

CREATE TABLE configuracoes_agendamento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barbearia_id INTEGER REFERENCES barbearias(id) ON DELETE CASCADE UNIQUE,
  permitir_agendamento BOOLEAN DEFAULT false,
  antecipacao_minima INTEGER DEFAULT 60, -- Minutos mínimos para agendar
  antecipacao_maxima INTEGER DEFAULT 43200, -- Minutos máximos para agendar (30 dias)
  intervalo_agendamento INTEGER DEFAULT 30, -- Intervalo entre agendamentos em minutos
  max_agendamentos_dia INTEGER DEFAULT 50, -- Máximo de agendamentos por dia
  horarios_disponiveis JSONB DEFAULT '{
    "segunda": {"inicio": "08:00", "fim": "18:00", "ativo": true},
    "terca": {"inicio": "08:00", "fim": "18:00", "ativo": true},
    "quarta": {"inicio": "08:00", "fim": "18:00", "ativo": true},
    "quinta": {"inicio": "08:00", "fim": "18:00", "ativo": true},
    "sexta": {"inicio": "08:00", "fim": "18:00", "ativo": true},
    "sabado": {"inicio": "08:00", "fim": "17:00", "ativo": true},
    "domingo": {"inicio": "08:00", "fim": "17:00", "ativo": false}
  }',
  servicos_disponiveis JSONB DEFAULT '[]', -- Lista de serviços que podem ser agendados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA DE BLOQUEIOS DE HORÁRIOS (FERIADOS, FOLGAS, ETC.)
-- =====================================================

CREATE TABLE bloqueios_horario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barbearia_id INTEGER REFERENCES barbearias(id) ON DELETE CASCADE,
  barbeiro_id UUID REFERENCES users(id), -- NULL = bloqueio para toda barbearia
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  hora_inicio TIME,
  hora_fim TIME,
  motivo VARCHAR(255) NOT NULL,
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('feriado', 'folga', 'manutencao', 'evento', 'outro')),
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT check_data_valida CHECK (data_fim >= data_inicio)
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para agendamentos
CREATE INDEX idx_agendamentos_barbearia_id ON agendamentos(barbearia_id);
CREATE INDEX idx_agendamentos_barbeiro_id ON agendamentos(barbeiro_id);
CREATE INDEX idx_agendamentos_data_hora ON agendamentos(data_hora_agendamento);
CREATE INDEX idx_agendamentos_status ON agendamentos(status);
CREATE INDEX idx_agendamentos_data_agendamento ON agendamentos(data_agendamento);
CREATE INDEX idx_agendamentos_token ON agendamentos(token_agendamento);
CREATE INDEX idx_agendamentos_cliente_id ON agendamentos(cliente_id);

-- Índices para configurações
CREATE INDEX idx_config_agendamento_barbearia_id ON configuracoes_agendamento(barbearia_id);

-- Índices para bloqueios
CREATE INDEX idx_bloqueios_barbearia_id ON bloqueios_horario(barbearia_id);
CREATE INDEX idx_bloqueios_barbeiro_id ON bloqueios_horario(barbeiro_id);
CREATE INDEX idx_bloqueios_data_inicio ON bloqueios_horario(data_inicio);
CREATE INDEX idx_bloqueios_data_fim ON bloqueios_horario(data_fim);
CREATE INDEX idx_bloqueios_ativo ON bloqueios_horario(ativo);

-- =====================================================
-- FUNÇÕES AUXILIARES
-- =====================================================

-- Função para gerar token único de agendamento
CREATE OR REPLACE FUNCTION gerar_token_agendamento()
RETURNS VARCHAR(255) AS $$
BEGIN
  RETURN 'AGD_' || substr(md5(random()::text), 1, 8) || '_' || 
         substr(md5(random()::text), 1, 8) || '_' || 
         extract(epoch from now())::bigint;
END;
$$ LANGUAGE plpgsql;

-- Função para verificar disponibilidade de horário
CREATE OR REPLACE FUNCTION verificar_disponibilidade_horario(
  p_barbearia_id INTEGER,
  p_barbeiro_id UUID,
  p_data_hora TIMESTAMP WITH TIME ZONE,
  p_duracao INTEGER DEFAULT 30
)
RETURNS BOOLEAN AS $$
DECLARE
  v_data_fim TIMESTAMP WITH TIME ZONE;
  v_conflitos INTEGER;
BEGIN
  -- Calcular data/hora fim
  v_data_fim := p_data_hora + (p_duracao || ' minutes')::INTERVAL;
  
  -- Verificar conflitos de agendamentos
  SELECT COUNT(*) INTO v_conflitos
  FROM agendamentos
  WHERE barbearia_id = p_barbearia_id
    AND (barbeiro_id = p_barbeiro_id OR p_barbeiro_id IS NULL)
    AND status IN ('agendado', 'confirmado')
    AND (
      (data_hora_agendamento < v_data_fim AND 
       data_hora_agendamento + (duracao_estimada || ' minutes')::INTERVAL > p_data_hora)
    );
  
  -- Verificar bloqueios de horário
  SELECT COUNT(*) INTO v_conflitos
  FROM bloqueios_horario
  WHERE barbearia_id = p_barbearia_id
    AND (barbeiro_id = p_barbeiro_id OR barbeiro_id IS NULL)
    AND ativo = true
    AND (
      (data_inicio <= p_data_hora::date AND data_fim >= p_data_hora::date) AND
      (hora_inicio IS NULL OR hora_inicio <= p_data_hora::time) AND
      (hora_fim IS NULL OR hora_fim >= v_data_fim::time)
    );
  
  RETURN v_conflitos = 0;
END;
$$ LANGUAGE plpgsql;

-- Função para obter próximos horários disponíveis
CREATE OR REPLACE FUNCTION obter_horarios_disponiveis(
  p_barbearia_id INTEGER,
  p_barbeiro_id UUID DEFAULT NULL,
  p_data_inicio DATE DEFAULT CURRENT_DATE,
  p_dias_para_frente INTEGER DEFAULT 7
)
RETURNS TABLE (
  data_disponivel DATE,
  hora_disponivel TIME,
  data_hora_disponivel TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
  v_config JSONB;
  v_data_atual DATE := p_data_inicio;
  v_hora_atual TIME;
  v_dia_semana TEXT;
  v_horario_dia JSONB;
  v_hora_inicio TIME;
  v_hora_fim TIME;
  v_intervalo INTEGER;
BEGIN
  -- Obter configurações da barbearia
  SELECT horarios_disponiveis, intervalo_agendamento INTO v_config, v_intervalo
  FROM configuracoes_agendamento
  WHERE barbearia_id = p_barbearia_id;
  
  IF v_config IS NULL THEN
    RETURN;
  END IF;
  
  -- Para cada dia no período
  FOR i IN 0..p_dias_para_frente LOOP
    v_data_atual := p_data_inicio + (i || ' days')::INTERVAL;
    v_dia_semana := to_char(v_data_atual, 'day');
    
    -- Obter horário do dia
    v_horario_dia := v_config->v_dia_semana;
    
    IF v_horario_dia->>'ativo' = 'true' THEN
      v_hora_inicio := (v_horario_dia->>'inicio')::TIME;
      v_hora_fim := (v_horario_dia->>'fim')::TIME;
      
      -- Para cada intervalo de tempo
      v_hora_atual := v_hora_inicio;
      WHILE v_hora_atual < v_hora_fim LOOP
        -- Verificar se o horário está disponível
        IF verificar_disponibilidade_horario(
          p_barbearia_id, 
          p_barbeiro_id, 
          (v_data_atual || ' ' || v_hora_atual)::TIMESTAMP WITH TIME ZONE,
          30
        ) THEN
          data_disponivel := v_data_atual;
          hora_disponivel := v_hora_atual;
          data_hora_disponivel := (v_data_atual || ' ' || v_hora_atual)::TIMESTAMP WITH TIME ZONE;
          RETURN NEXT;
        END IF;
        
        v_hora_atual := v_hora_atual + (v_intervalo || ' minutes')::INTERVAL;
      END LOOP;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger para atualizar updated_at
CREATE TRIGGER update_agendamentos_updated_at 
  BEFORE UPDATE ON agendamentos 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_config_agendamento_updated_at 
  BEFORE UPDATE ON configuracoes_agendamento 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bloqueios_horario_updated_at 
  BEFORE UPDATE ON bloqueios_horario 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para gerar token automaticamente
CREATE OR REPLACE FUNCTION gerar_token_agendamento_trigger()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.token_agendamento IS NULL THEN
    NEW.token_agendamento := gerar_token_agendamento();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_gerar_token_agendamento
  BEFORE INSERT ON agendamentos
  FOR EACH ROW EXECUTE FUNCTION gerar_token_agendamento_trigger();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracoes_agendamento ENABLE ROW LEVEL SECURITY;
ALTER TABLE bloqueios_horario ENABLE ROW LEVEL SECURITY;

-- Políticas permissivas para desenvolvimento
CREATE POLICY "Allow all operations on agendamentos" ON agendamentos FOR ALL USING (true);
CREATE POLICY "Allow all operations on configuracoes_agendamento" ON configuracoes_agendamento FOR ALL USING (true);
CREATE POLICY "Allow all operations on bloqueios_horario" ON bloqueios_horario FOR ALL USING (true);

-- =====================================================
-- DADOS INICIAIS
-- =====================================================

-- Inserir configurações padrão para a barbearia existente
INSERT INTO configuracoes_agendamento (barbearia_id, permitir_agendamento, antecipacao_minima, antecipacao_maxima) VALUES (
  1, -- ID da barbearia existente
  true,
  60, -- 1 hora mínima
  43200 -- 30 dias máximo
);

-- =====================================================
-- COMENTÁRIOS
-- =====================================================

COMMENT ON TABLE agendamentos IS 'Tabela de agendamentos dos clientes';
COMMENT ON TABLE configuracoes_agendamento IS 'Configurações de agendamento por barbearia';
COMMENT ON TABLE bloqueios_horario IS 'Bloqueios de horários (feriados, folgas, etc.)';

COMMENT ON COLUMN agendamentos.prioridade IS '0 = normal, 1 = alta, 2 = urgente';
COMMENT ON COLUMN agendamentos.status IS 'Status do agendamento: agendado, confirmado, em_atendimento, finalizado, cancelado, nao_compareceu';
COMMENT ON COLUMN agendamentos.token_agendamento IS 'Token único para identificação do agendamento';
COMMENT ON COLUMN configuracoes_agendamento.antecipacao_minima IS 'Tempo mínimo em minutos para agendar';
COMMENT ON COLUMN configuracoes_agendamento.antecipacao_maxima IS 'Tempo máximo em minutos para agendar';
COMMENT ON COLUMN configuracoes_agendamento.intervalo_agendamento IS 'Intervalo entre agendamentos em minutos';
COMMENT ON COLUMN bloqueios_horario.tipo IS 'Tipo de bloqueio: feriado, folga, manutencao, evento, outro'; 