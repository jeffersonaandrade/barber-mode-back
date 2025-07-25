// @ts-nocheck
const moment = require('moment');

/**
 * Verifica se a barbearia está aberta
 * @param {Object} horario - Horário da barbearia
 * @returns {boolean} - True se estiver aberta
 */
function barbeariaEstaAberta(horario) {
  const hoje = moment().format('dddd').toLowerCase();
  const horaAtual = moment().format('HH:mm');
  
  const diaSemana = {
    'monday': 'segunda',
    'tuesday': 'terca',
    'wednesday': 'quarta',
    'thursday': 'quinta',
    'friday': 'sexta',
    'saturday': 'sabado',
    'sunday': 'domingo'
  };

  const dia = diaSemana[hoje];
  const horarioDia = horario[dia];

  if (!horarioDia || !horarioDia.aberto) {
    return false;
  }

  if (horarioDia.inicio && horarioDia.fim) {
    return horaAtual >= horarioDia.inicio && horaAtual <= horarioDia.fim;
  }

  return true;
}

/**
 * Calcula tempo estimado de espera
 * @param {number} posicao - Posição na fila
 * @param {number} tempoMedioAtendimento - Tempo médio por atendimento em minutos
 * @param {number} barbeirosAtivos - Número de barbeiros ativos
 * @returns {number} - Tempo estimado em minutos
 */
function calcularTempoEstimado(posicao, tempoMedioAtendimento = 30, barbeirosAtivos = 1) {
  if (posicao <= 0) return 0;
  
  const tempoEstimado = Math.ceil((posicao * tempoMedioAtendimento) / barbeirosAtivos);
  return tempoEstimado;
}

/**
 * Valida formato de telefone
 * @param {string} telefone - Número de telefone
 * @returns {boolean} - True se válido
 */
function validarTelefone(telefone) {
  const regex = /^\+?[1-9]\d{1,14}$/;
  return regex.test(telefone);
}

/**
 * Formata telefone para exibição
 * @param {string} telefone - Número de telefone
 * @returns {string} - Telefone formatado
 */
function formatarTelefone(telefone) {
  if (!telefone) return '';
  
  // Remove tudo que não é número
  const numeros = telefone.replace(/\D/g, '');
  
  if (numeros.length === 11) {
    return `(${numeros.slice(0,2)}) ${numeros.slice(2,7)}-${numeros.slice(7)}`;
  } else if (numeros.length === 10) {
    return `(${numeros.slice(0,2)}) ${numeros.slice(2,6)}-${numeros.slice(6)}`;
  }
  
  return telefone;
}

/**
 * Gera estatísticas da fila
 * @param {Array} clientes - Lista de clientes na fila
 * @param {Object} configuracoes - Configurações da barbearia
 * @param {number} barbeirosAtivos - Número de barbeiros ativos
 * @returns {Object} - Estatísticas
 */
function gerarEstatisticasFila(clientes, configuracoes = {}, barbeirosAtivos = 1) {
  const tempoMedio = configuracoes.tempo_medio_atendimento || 30;
  const totalClientes = clientes.length;
  const aguardando = clientes.filter(c => c.status === 'aguardando').length;
  const atendendo = clientes.filter(c => c.status === 'atendendo').length;
  const proximo = clientes.filter(c => c.status === 'proximo').length;
  
  const tempoEstimadoTotal = calcularTempoEstimado(aguardando, tempoMedio, barbeirosAtivos);
  
  return {
    total: totalClientes,
    aguardando,
    atendendo,
    proximo,
    tempo_estimado_total: tempoEstimadoTotal,
    barbeiros_ativos: barbeirosAtivos,
    tempo_medio_atendimento: tempoMedio
  };
}

module.exports = {
  barbeariaEstaAberta,
  calcularTempoEstimado,
  validarTelefone,
  formatarTelefone,
  gerarEstatisticasFila
}; 