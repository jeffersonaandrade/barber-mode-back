-- Atualização da tabela clientes para suportar agendamentos
-- Execute este script no SQL Editor do Supabase

-- =====================================================
-- ADICIONAR CAMPOS PARA AGENDAMENTOS NA TABELA CLIENTES
-- =====================================================

-- Adicionar campo para identificar se o cliente veio de agendamento
ALTER TABLE clientes 
ADD COLUMN IF NOT EXISTS agendamento_id UUID REFERENCES agendamentos(id) ON DELETE SET NULL;

-- Adicionar campo para prioridade (agendamentos têm prioridade)
ALTER TABLE clientes 
ADD COLUMN IF NOT EXISTS prioridade INTEGER DEFAULT 0 CHECK (prioridade IN (0, 1, 2));

-- Adicionar campo para data/hora do agendamento (se aplicável)
ALTER TABLE clientes 
ADD COLUMN IF NOT EXISTS data_hora_agendamento TIMESTAMP WITH TIME ZONE;

-- Adicionar campo para tipo de entrada (fila normal ou agendamento)
ALTER TABLE clientes 
ADD COLUMN IF NOT EXISTS tipo_entrada VARCHAR(20) DEFAULT 'fila' CHECK (tipo_entrada IN ('fila', 'agendamento'));

-- Adicionar campo para observações do agendamento
ALTER TABLE clientes 
ADD COLUMN IF NOT EXISTS observacoes_agendamento TEXT;

-- =====================================================
-- ÍNDICES ADICIONAIS
-- =====================================================

-- Índice para agendamento_id
CREATE INDEX IF NOT EXISTS idx_clientes_agendamento_id ON clientes(agendamento_id);

-- Índice para prioridade
CREATE INDEX IF NOT EXISTS idx_clientes_prioridade ON clientes(prioridade);

-- Índice para tipo_entrada
CREATE INDEX IF NOT EXISTS idx_clientes_tipo_entrada ON clientes(tipo_entrada);

-- Índice para data_hora_agendamento
CREATE INDEX IF NOT EXISTS idx_clientes_data_hora_agendamento ON clientes(data_hora_agendamento);

-- =====================================================
-- FUNÇÃO PARA CALCULAR POSIÇÃO COM PRIORIDADE
-- =====================================================

-- Função para calcular posição considerando prioridade de agendamentos
CREATE OR REPLACE FUNCTION calcular_posicao_com_prioridade(
  p_barbearia_id INTEGER,
  p_prioridade INTEGER DEFAULT 0,
  p_data_hora_agendamento TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  v_ultima_posicao INTEGER;
  v_posicao_agendamento INTEGER;
BEGIN
  -- Se é um agendamento, calcular posição baseada no horário
  IF p_data_hora_agendamento IS NOT NULL THEN
    -- Contar quantos agendamentos existem para horários anteriores
    SELECT COALESCE(COUNT(*), 0) INTO v_posicao_agendamento
    FROM clientes
    WHERE barbearia_id = p_barbearia_id
      AND tipo_entrada = 'agendamento'
      AND data_hora_agendamento < p_data_hora_agendamento
      AND status IN ('aguardando', 'proximo');
    
    -- Adicionar clientes da fila normal que chegaram antes
    SELECT COALESCE(COUNT(*), 0) INTO v_ultima_posicao
    FROM clientes
    WHERE barbearia_id = p_barbearia_id
      AND tipo_entrada = 'fila'
      AND status IN ('aguardando', 'proximo');
    
    RETURN v_posicao_agendamento + v_ultima_posicao + 1;
  ELSE
    -- Cliente da fila normal
    SELECT COALESCE(MAX(posicao), 0) INTO v_ultima_posicao
    FROM clientes
    WHERE barbearia_id = p_barbearia_id
      AND status IN ('aguardando', 'proximo');
    
    RETURN v_ultima_posicao + 1;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNÇÃO PARA REORDENAR FILA COM PRIORIDADE
-- =====================================================

-- Função para reordenar a fila considerando agendamentos
CREATE OR REPLACE FUNCTION reordenar_fila_com_prioridade(p_barbearia_id INTEGER)
RETURNS VOID AS $$
DECLARE
  v_cliente RECORD;
  v_nova_posicao INTEGER := 1;
BEGIN
  -- Reordenar clientes considerando agendamentos
  FOR v_cliente IN 
    SELECT id, tipo_entrada, data_hora_agendamento, prioridade
    FROM clientes
    WHERE barbearia_id = p_barbearia_id
      AND status IN ('aguardando', 'proximo')
    ORDER BY 
      tipo_entrada DESC, -- Agendamentos primeiro
      data_hora_agendamento ASC, -- Agendamentos por horário
      prioridade DESC, -- Prioridade alta primeiro
      created_at ASC -- Fila normal por ordem de chegada
  LOOP
    UPDATE clientes 
    SET posicao = v_nova_posicao
    WHERE id = v_cliente.id;
    
    v_nova_posicao := v_nova_posicao + 1;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGER PARA ATUALIZAR POSIÇÕES QUANDO AGENDAMENTO É INSERIDO
-- =====================================================

-- Função do trigger
CREATE OR REPLACE FUNCTION trigger_reordenar_fila_agendamento()
RETURNS TRIGGER AS $$
BEGIN
  -- Se é um agendamento, reordenar a fila
  IF NEW.tipo_entrada = 'agendamento' THEN
    PERFORM reordenar_fila_com_prioridade(NEW.barbearia_id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger
DROP TRIGGER IF EXISTS trigger_reordenar_fila_agendamento ON clientes;
CREATE TRIGGER trigger_reordenar_fila_agendamento
  AFTER INSERT ON clientes
  FOR EACH ROW EXECUTE FUNCTION trigger_reordenar_fila_agendamento();

-- =====================================================
-- VIEW PARA FILA ORDENADA COM PRIORIDADE
-- =====================================================

-- View para visualizar a fila ordenada com prioridade
CREATE OR REPLACE VIEW fila_ordenada_prioridade AS
SELECT 
  c.id,
  c.nome,
  c.telefone,
  c.posicao,
  c.status,
  c.tipo_entrada,
  c.prioridade,
  c.data_hora_agendamento,
  c.agendamento_id,
  c.barbeiro_id,
  c.created_at,
  CASE 
    WHEN c.tipo_entrada = 'agendamento' THEN '🕐 Agendamento'
    WHEN c.prioridade = 2 THEN '🚨 Urgente'
    WHEN c.prioridade = 1 THEN '⚡ Alta Prioridade'
    ELSE '📋 Fila Normal'
  END as tipo_display
FROM clientes c
WHERE c.status IN ('aguardando', 'proximo')
ORDER BY 
  c.barbearia_id,
  c.tipo_entrada DESC,
  c.data_hora_agendamento ASC,
  c.prioridade DESC,
  c.created_at ASC;

-- =====================================================
-- COMENTÁRIOS
-- =====================================================

COMMENT ON COLUMN clientes.agendamento_id IS 'Referência ao agendamento, se o cliente veio de agendamento';
COMMENT ON COLUMN clientes.prioridade IS '0 = normal, 1 = alta, 2 = urgente';
COMMENT ON COLUMN clientes.data_hora_agendamento IS 'Data e hora do agendamento, se aplicável';
COMMENT ON COLUMN clientes.tipo_entrada IS 'Tipo de entrada: fila (normal) ou agendamento';
COMMENT ON COLUMN clientes.observacoes_agendamento IS 'Observações específicas do agendamento';

COMMENT ON FUNCTION calcular_posicao_com_prioridade IS 'Calcula posição na fila considerando prioridade de agendamentos';
COMMENT ON FUNCTION reordenar_fila_com_prioridade IS 'Reordena a fila considerando agendamentos e prioridades';
COMMENT ON VIEW fila_ordenada_prioridade IS 'View para visualizar fila ordenada com prioridade de agendamentos'; 