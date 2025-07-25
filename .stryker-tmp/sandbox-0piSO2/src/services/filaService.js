// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
const QRCode = require('qrcode');

/**
 * Serviço para operações relacionadas à fila de clientes
 * 
 * Este serviço contém toda a lógica de negócio relacionada à fila,
 * separando as operações de banco de dados das rotas.
 */
class FilaService {
  constructor(supabase) {
    if (stryMutAct_9fa48("500")) {
      {}
    } else {
      stryCov_9fa48("500");
      this.supabase = supabase;
    }
  }

  /**
   * Adicionar cliente à fila
   * @param {Object} clienteData - Dados do cliente
   * @param {string} clienteData.nome - Nome do cliente
   * @param {string} clienteData.telefone - Telefone do cliente
   * @param {number} clienteData.barbearia_id - ID da barbearia
   * @param {string} clienteData.barbeiro_id - ID do barbeiro (opcional)
   * @returns {Promise<Object>} Cliente criado com QR codes
   */
  async adicionarClienteNaFila(clienteData) {
    if (stryMutAct_9fa48("501")) {
      {}
    } else {
      stryCov_9fa48("501");
      const {
        nome,
        telefone,
        barbearia_id,
        barbeiro_id
      } = clienteData;

      // Verificar se a barbearia existe e está ativa
      const {
        data: barbearia,
        error: barbeariaError
      } = await this.supabase.from(stryMutAct_9fa48("502") ? "" : (stryCov_9fa48("502"), 'barbearias')).select(stryMutAct_9fa48("503") ? "" : (stryCov_9fa48("503"), 'id, nome, ativo')).eq(stryMutAct_9fa48("504") ? "" : (stryCov_9fa48("504"), 'id'), barbearia_id).eq(stryMutAct_9fa48("505") ? "" : (stryCov_9fa48("505"), 'ativo'), stryMutAct_9fa48("506") ? false : (stryCov_9fa48("506"), true)).single();
      if (stryMutAct_9fa48("509") ? barbeariaError && !barbearia : stryMutAct_9fa48("508") ? false : stryMutAct_9fa48("507") ? true : (stryCov_9fa48("507", "508", "509"), barbeariaError || (stryMutAct_9fa48("510") ? barbearia : (stryCov_9fa48("510"), !barbearia)))) {
        if (stryMutAct_9fa48("511")) {
          {}
        } else {
          stryCov_9fa48("511");
          throw new Error(stryMutAct_9fa48("512") ? "" : (stryCov_9fa48("512"), 'Barbearia não encontrada ou inativa'));
        }
      }

      // Se barbeiro_id foi especificado, verificar se o barbeiro está ativo na barbearia
      if (stryMutAct_9fa48("514") ? false : stryMutAct_9fa48("513") ? true : (stryCov_9fa48("513", "514"), barbeiro_id)) {
        if (stryMutAct_9fa48("515")) {
          {}
        } else {
          stryCov_9fa48("515");
          const {
            data: barbeiroAtivo,
            error: barbeiroError
          } = await this.supabase.from(stryMutAct_9fa48("516") ? "" : (stryCov_9fa48("516"), 'barbeiros_barbearias')).select(stryMutAct_9fa48("517") ? "" : (stryCov_9fa48("517"), 'id, ativo')).eq(stryMutAct_9fa48("518") ? "" : (stryCov_9fa48("518"), 'user_id'), barbeiro_id).eq(stryMutAct_9fa48("519") ? "" : (stryCov_9fa48("519"), 'barbearia_id'), barbearia_id).eq(stryMutAct_9fa48("520") ? "" : (stryCov_9fa48("520"), 'ativo'), stryMutAct_9fa48("521") ? false : (stryCov_9fa48("521"), true)).single();
          if (stryMutAct_9fa48("524") ? barbeiroError && !barbeiroAtivo : stryMutAct_9fa48("523") ? false : stryMutAct_9fa48("522") ? true : (stryCov_9fa48("522", "523", "524"), barbeiroError || (stryMutAct_9fa48("525") ? barbeiroAtivo : (stryCov_9fa48("525"), !barbeiroAtivo)))) {
            if (stryMutAct_9fa48("526")) {
              {}
            } else {
              stryCov_9fa48("526");
              throw new Error(stryMutAct_9fa48("527") ? "" : (stryCov_9fa48("527"), 'Barbeiro especificado não está ativo nesta barbearia'));
            }
          }
        }
      }

      // Gerar token único para o cliente
      const token = this.gerarTokenUnico();

      // Obter posição atual na fila
      const posicao = await this.calcularProximaPosicao(barbearia_id);

      // Inserir cliente na fila
      const {
        data: cliente,
        error: insertError
      } = await this.supabase.from(stryMutAct_9fa48("528") ? "" : (stryCov_9fa48("528"), 'clientes')).insert(stryMutAct_9fa48("529") ? {} : (stryCov_9fa48("529"), {
        nome,
        telefone,
        token,
        barbearia_id,
        barbeiro_id,
        posicao,
        status: stryMutAct_9fa48("530") ? "" : (stryCov_9fa48("530"), 'aguardando'),
        created_at: new Date().toISOString()
      })).select().single();
      if (stryMutAct_9fa48("532") ? false : stryMutAct_9fa48("531") ? true : (stryCov_9fa48("531", "532"), insertError)) {
        if (stryMutAct_9fa48("533")) {
          {}
        } else {
          stryCov_9fa48("533");
          console.error(stryMutAct_9fa48("534") ? "" : (stryCov_9fa48("534"), 'Erro ao inserir cliente:'), insertError);
          throw new Error(stryMutAct_9fa48("535") ? "" : (stryCov_9fa48("535"), 'Erro interno do servidor'));
        }
      }

      // Gerar QR codes
      const qrCodeFila = await this.gerarQRCodeFila(cliente);
      const qrCodeStatus = await this.gerarQRCodeStatus(cliente);
      return stryMutAct_9fa48("536") ? {} : (stryCov_9fa48("536"), {
        cliente: stryMutAct_9fa48("537") ? {} : (stryCov_9fa48("537"), {
          id: cliente.id,
          nome: cliente.nome,
          telefone: cliente.telefone,
          posicao: cliente.posicao,
          status: cliente.status,
          token: cliente.token
        }),
        qr_code_fila: qrCodeFila,
        qr_code_status: qrCodeStatus,
        posicao: cliente.posicao
      });
    }
  }

  /**
   * Obter fila completa da barbearia (para funcionários)
   * @param {number} barbearia_id - ID da barbearia
   * @returns {Promise<Object>} Fila com clientes e estatísticas
   */
  async obterFilaCompleta(barbearia_id) {
    if (stryMutAct_9fa48("538")) {
      {}
    } else {
      stryCov_9fa48("538");
      // Verificar se a barbearia existe
      const {
        data: barbearia,
        error: barbeariaError
      } = await this.supabase.from(stryMutAct_9fa48("539") ? "" : (stryCov_9fa48("539"), 'barbearias')).select(stryMutAct_9fa48("540") ? "" : (stryCov_9fa48("540"), 'id, nome, ativo')).eq(stryMutAct_9fa48("541") ? "" : (stryCov_9fa48("541"), 'id'), barbearia_id).single();
      if (stryMutAct_9fa48("544") ? barbeariaError && !barbearia : stryMutAct_9fa48("543") ? false : stryMutAct_9fa48("542") ? true : (stryCov_9fa48("542", "543", "544"), barbeariaError || (stryMutAct_9fa48("545") ? barbearia : (stryCov_9fa48("545"), !barbearia)))) {
        if (stryMutAct_9fa48("546")) {
          {}
        } else {
          stryCov_9fa48("546");
          throw new Error(stryMutAct_9fa48("547") ? "" : (stryCov_9fa48("547"), 'Barbearia não encontrada'));
        }
      }

      // Obter clientes na fila
      const {
        data: clientes,
        error: clientesError
      } = await this.supabase.from(stryMutAct_9fa48("548") ? "" : (stryCov_9fa48("548"), 'clientes')).select(stryMutAct_9fa48("549") ? `` : (stryCov_9fa48("549"), `
        id,
        nome,
        telefone,
        posicao,
        status,
        created_at,
        barbeiro_id,
        users(id, nome)
      `)).eq(stryMutAct_9fa48("550") ? "" : (stryCov_9fa48("550"), 'barbearia_id'), barbearia_id).in(stryMutAct_9fa48("551") ? "" : (stryCov_9fa48("551"), 'status'), stryMutAct_9fa48("552") ? [] : (stryCov_9fa48("552"), [stryMutAct_9fa48("553") ? "" : (stryCov_9fa48("553"), 'aguardando'), stryMutAct_9fa48("554") ? "" : (stryCov_9fa48("554"), 'proximo'), stryMutAct_9fa48("555") ? "" : (stryCov_9fa48("555"), 'atendendo'), stryMutAct_9fa48("556") ? "" : (stryCov_9fa48("556"), 'finalizado'), stryMutAct_9fa48("557") ? "" : (stryCov_9fa48("557"), 'removido')])).order(stryMutAct_9fa48("558") ? "" : (stryCov_9fa48("558"), 'posicao'), stryMutAct_9fa48("559") ? {} : (stryCov_9fa48("559"), {
        ascending: stryMutAct_9fa48("560") ? false : (stryCov_9fa48("560"), true)
      }));
      if (stryMutAct_9fa48("562") ? false : stryMutAct_9fa48("561") ? true : (stryCov_9fa48("561", "562"), clientesError)) {
        if (stryMutAct_9fa48("563")) {
          {}
        } else {
          stryCov_9fa48("563");
          throw new Error(stryMutAct_9fa48("564") ? "" : (stryCov_9fa48("564"), 'Erro interno do servidor'));
        }
      }

      // Calcular estatísticas
      const estatisticas = this.calcularEstatisticas(clientes);

      // Obter número de barbeiros ativos
      const barbeirosAtivosCount = await this.obterBarbeirosAtivosCount(barbearia_id);
      estatisticas.barbeiros_ativos = barbeirosAtivosCount;
      return stryMutAct_9fa48("565") ? {} : (stryCov_9fa48("565"), {
        barbearia: stryMutAct_9fa48("566") ? {} : (stryCov_9fa48("566"), {
          id: barbearia.id,
          nome: barbearia.nome
        }),
        clientes: clientes.map(stryMutAct_9fa48("567") ? () => undefined : (stryCov_9fa48("567"), cliente => stryMutAct_9fa48("568") ? {} : (stryCov_9fa48("568"), {
          id: cliente.id,
          nome: cliente.nome,
          telefone: cliente.telefone,
          posicao: cliente.posicao,
          status: cliente.status,
          created_at: cliente.created_at,
          barbeiro: cliente.users ? stryMutAct_9fa48("569") ? {} : (stryCov_9fa48("569"), {
            id: cliente.users.id,
            nome: cliente.users.nome
          }) : null
        }))),
        estatisticas
      });
    }
  }

  /**
   * Obter estatísticas da fila (para clientes e gerentes)
   * @param {number} barbearia_id - ID da barbearia
   * @param {boolean} verificarAtivo - Se deve verificar se barbearia está ativa
   * @returns {Promise<Object>} Estatísticas da fila
   */
  async obterEstatisticasFila(barbearia_id, verificarAtivo = stryMutAct_9fa48("570") ? true : (stryCov_9fa48("570"), false)) {
    if (stryMutAct_9fa48("571")) {
      {}
    } else {
      stryCov_9fa48("571");
      // Verificar se a barbearia existe
      let query = this.supabase.from(stryMutAct_9fa48("572") ? "" : (stryCov_9fa48("572"), 'barbearias')).select(stryMutAct_9fa48("573") ? "" : (stryCov_9fa48("573"), 'id, nome, ativo')).eq(stryMutAct_9fa48("574") ? "" : (stryCov_9fa48("574"), 'id'), barbearia_id);
      if (stryMutAct_9fa48("576") ? false : stryMutAct_9fa48("575") ? true : (stryCov_9fa48("575", "576"), verificarAtivo)) {
        if (stryMutAct_9fa48("577")) {
          {}
        } else {
          stryCov_9fa48("577");
          query = query.eq(stryMutAct_9fa48("578") ? "" : (stryCov_9fa48("578"), 'ativo'), stryMutAct_9fa48("579") ? false : (stryCov_9fa48("579"), true));
        }
      }
      const {
        data: barbearia,
        error: barbeariaError
      } = await query.single();
      if (stryMutAct_9fa48("582") ? barbeariaError && !barbearia : stryMutAct_9fa48("581") ? false : stryMutAct_9fa48("580") ? true : (stryCov_9fa48("580", "581", "582"), barbeariaError || (stryMutAct_9fa48("583") ? barbearia : (stryCov_9fa48("583"), !barbearia)))) {
        if (stryMutAct_9fa48("584")) {
          {}
        } else {
          stryCov_9fa48("584");
          throw new Error(verificarAtivo ? stryMutAct_9fa48("585") ? "" : (stryCov_9fa48("585"), 'Barbearia não encontrada ou inativa') : stryMutAct_9fa48("586") ? "" : (stryCov_9fa48("586"), 'Barbearia não encontrada'));
        }
      }

      // Obter apenas estatísticas da fila (sem dados pessoais dos clientes)
      const {
        data: clientes,
        error: clientesError
      } = await this.supabase.from(stryMutAct_9fa48("587") ? "" : (stryCov_9fa48("587"), 'clientes')).select(stryMutAct_9fa48("588") ? "" : (stryCov_9fa48("588"), 'status')).eq(stryMutAct_9fa48("589") ? "" : (stryCov_9fa48("589"), 'barbearia_id'), barbearia_id).in(stryMutAct_9fa48("590") ? "" : (stryCov_9fa48("590"), 'status'), stryMutAct_9fa48("591") ? [] : (stryCov_9fa48("591"), [stryMutAct_9fa48("592") ? "" : (stryCov_9fa48("592"), 'aguardando'), stryMutAct_9fa48("593") ? "" : (stryCov_9fa48("593"), 'proximo'), stryMutAct_9fa48("594") ? "" : (stryCov_9fa48("594"), 'atendendo'), stryMutAct_9fa48("595") ? "" : (stryCov_9fa48("595"), 'finalizado'), stryMutAct_9fa48("596") ? "" : (stryCov_9fa48("596"), 'removido')]));
      if (stryMutAct_9fa48("598") ? false : stryMutAct_9fa48("597") ? true : (stryCov_9fa48("597", "598"), clientesError)) {
        if (stryMutAct_9fa48("599")) {
          {}
        } else {
          stryCov_9fa48("599");
          throw new Error(stryMutAct_9fa48("600") ? "" : (stryCov_9fa48("600"), 'Erro interno do servidor'));
        }
      }

      // Calcular estatísticas
      const estatisticas = this.calcularEstatisticas(clientes);

      // Obter número de barbeiros ativos
      const barbeirosAtivosCount = await this.obterBarbeirosAtivosCount(barbearia_id);
      estatisticas.barbeiros_ativos = barbeirosAtivosCount;
      return stryMutAct_9fa48("601") ? {} : (stryCov_9fa48("601"), {
        barbearia: stryMutAct_9fa48("602") ? {} : (stryCov_9fa48("602"), {
          id: barbearia.id,
          nome: barbearia.nome
        }),
        estatisticas
      });
    }
  }

  /**
   * Chamar próximo cliente da fila
   * @param {number} barbearia_id - ID da barbearia
   * @param {string} barbeiro_id - ID do barbeiro
   * @returns {Promise<Object>} Próximo cliente chamado
   */
  async chamarProximoCliente(barbearia_id, barbeiro_id) {
    if (stryMutAct_9fa48("603")) {
      {}
    } else {
      stryCov_9fa48("603");
      // Verificar se a barbearia existe
      const {
        data: barbearia,
        error: barbeariaError
      } = await this.supabase.from(stryMutAct_9fa48("604") ? "" : (stryCov_9fa48("604"), 'barbearias')).select(stryMutAct_9fa48("605") ? "" : (stryCov_9fa48("605"), 'id, nome, ativo')).eq(stryMutAct_9fa48("606") ? "" : (stryCov_9fa48("606"), 'id'), barbearia_id).single();
      if (stryMutAct_9fa48("609") ? barbeariaError && !barbearia : stryMutAct_9fa48("608") ? false : stryMutAct_9fa48("607") ? true : (stryCov_9fa48("607", "608", "609"), barbeariaError || (stryMutAct_9fa48("610") ? barbearia : (stryCov_9fa48("610"), !barbearia)))) {
        if (stryMutAct_9fa48("611")) {
          {}
        } else {
          stryCov_9fa48("611");
          throw new Error(stryMutAct_9fa48("612") ? "" : (stryCov_9fa48("612"), 'Barbearia não encontrada'));
        }
      }

      // Buscar próximo cliente na fila
      const {
        data: proximoCliente,
        error: clienteError
      } = await this.supabase.from(stryMutAct_9fa48("613") ? "" : (stryCov_9fa48("613"), 'clientes')).select(stryMutAct_9fa48("614") ? "" : (stryCov_9fa48("614"), 'id, nome, telefone, posicao, status')).eq(stryMutAct_9fa48("615") ? "" : (stryCov_9fa48("615"), 'barbearia_id'), barbearia_id).eq(stryMutAct_9fa48("616") ? "" : (stryCov_9fa48("616"), 'status'), stryMutAct_9fa48("617") ? "" : (stryCov_9fa48("617"), 'aguardando')).order(stryMutAct_9fa48("618") ? "" : (stryCov_9fa48("618"), 'posicao'), stryMutAct_9fa48("619") ? {} : (stryCov_9fa48("619"), {
        ascending: stryMutAct_9fa48("620") ? false : (stryCov_9fa48("620"), true)
      })).limit(1).single();
      if (stryMutAct_9fa48("623") ? clienteError && !proximoCliente : stryMutAct_9fa48("622") ? false : stryMutAct_9fa48("621") ? true : (stryCov_9fa48("621", "622", "623"), clienteError || (stryMutAct_9fa48("624") ? proximoCliente : (stryCov_9fa48("624"), !proximoCliente)))) {
        if (stryMutAct_9fa48("625")) {
          {}
        } else {
          stryCov_9fa48("625");
          throw new Error(stryMutAct_9fa48("626") ? "" : (stryCov_9fa48("626"), 'Não há clientes aguardando na fila'));
        }
      }

      // Atualizar status do cliente para 'próximo'
      const {
        error: updateError
      } = await this.supabase.from(stryMutAct_9fa48("627") ? "" : (stryCov_9fa48("627"), 'clientes')).update(stryMutAct_9fa48("628") ? {} : (stryCov_9fa48("628"), {
        status: stryMutAct_9fa48("629") ? "" : (stryCov_9fa48("629"), 'proximo'),
        barbeiro_id: barbeiro_id,
        updated_at: new Date().toISOString()
      })).eq(stryMutAct_9fa48("630") ? "" : (stryCov_9fa48("630"), 'id'), proximoCliente.id);
      if (stryMutAct_9fa48("632") ? false : stryMutAct_9fa48("631") ? true : (stryCov_9fa48("631", "632"), updateError)) {
        if (stryMutAct_9fa48("633")) {
          {}
        } else {
          stryCov_9fa48("633");
          throw new Error(stryMutAct_9fa48("634") ? "" : (stryCov_9fa48("634"), 'Erro ao atualizar status do cliente'));
        }
      }
      return stryMutAct_9fa48("635") ? {} : (stryCov_9fa48("635"), {
        cliente: stryMutAct_9fa48("636") ? {} : (stryCov_9fa48("636"), {
          id: proximoCliente.id,
          nome: proximoCliente.nome,
          telefone: proximoCliente.telefone,
          posicao: proximoCliente.posicao,
          status: stryMutAct_9fa48("637") ? "" : (stryCov_9fa48("637"), 'proximo')
        }),
        barbearia: stryMutAct_9fa48("638") ? {} : (stryCov_9fa48("638"), {
          id: barbearia.id,
          nome: barbearia.nome
        })
      });
    }
  }

  /**
   * Verificar status do cliente pelo token
   * @param {string} token - Token do cliente
   * @returns {Promise<Object>} Status do cliente
   */
  async verificarStatusCliente(token) {
    if (stryMutAct_9fa48("639")) {
      {}
    } else {
      stryCov_9fa48("639");
      // Buscar cliente pelo token
      const {
        data: cliente,
        error: clienteError
      } = await this.supabase.from(stryMutAct_9fa48("640") ? "" : (stryCov_9fa48("640"), 'clientes')).select(stryMutAct_9fa48("641") ? `` : (stryCov_9fa48("641"), `
        id,
        nome,
        telefone,
        posicao,
        status,
        created_at,
        barbearia_id,
        barbearias(id, nome)
      `)).eq(stryMutAct_9fa48("642") ? "" : (stryCov_9fa48("642"), 'token'), token).single();
      if (stryMutAct_9fa48("645") ? clienteError && !cliente : stryMutAct_9fa48("644") ? false : stryMutAct_9fa48("643") ? true : (stryCov_9fa48("643", "644", "645"), clienteError || (stryMutAct_9fa48("646") ? cliente : (stryCov_9fa48("646"), !cliente)))) {
        if (stryMutAct_9fa48("647")) {
          {}
        } else {
          stryCov_9fa48("647");
          throw new Error(stryMutAct_9fa48("648") ? "" : (stryCov_9fa48("648"), 'Cliente não encontrado'));
        }
      }

      // Calcular posição atual na fila (apenas para clientes aguardando)
      let posicaoAtual = null;
      let tempoEstimado = null;
      if (stryMutAct_9fa48("651") ? cliente.status !== 'aguardando' : stryMutAct_9fa48("650") ? false : stryMutAct_9fa48("649") ? true : (stryCov_9fa48("649", "650", "651"), cliente.status === (stryMutAct_9fa48("652") ? "" : (stryCov_9fa48("652"), 'aguardando')))) {
        if (stryMutAct_9fa48("653")) {
          {}
        } else {
          stryCov_9fa48("653");
          const {
            data: clientesAguardando,
            error: posicaoError
          } = await this.supabase.from(stryMutAct_9fa48("654") ? "" : (stryCov_9fa48("654"), 'clientes')).select(stryMutAct_9fa48("655") ? "" : (stryCov_9fa48("655"), 'posicao')).eq(stryMutAct_9fa48("656") ? "" : (stryCov_9fa48("656"), 'barbearia_id'), cliente.barbearia_id).eq(stryMutAct_9fa48("657") ? "" : (stryCov_9fa48("657"), 'status'), stryMutAct_9fa48("658") ? "" : (stryCov_9fa48("658"), 'aguardando')).lte(stryMutAct_9fa48("659") ? "" : (stryCov_9fa48("659"), 'posicao'), cliente.posicao).order(stryMutAct_9fa48("660") ? "" : (stryCov_9fa48("660"), 'posicao'), stryMutAct_9fa48("661") ? {} : (stryCov_9fa48("661"), {
            ascending: stryMutAct_9fa48("662") ? false : (stryCov_9fa48("662"), true)
          }));
          if (stryMutAct_9fa48("665") ? !posicaoError || clientesAguardando : stryMutAct_9fa48("664") ? false : stryMutAct_9fa48("663") ? true : (stryCov_9fa48("663", "664", "665"), (stryMutAct_9fa48("666") ? posicaoError : (stryCov_9fa48("666"), !posicaoError)) && clientesAguardando)) {
            if (stryMutAct_9fa48("667")) {
              {}
            } else {
              stryCov_9fa48("667");
              posicaoAtual = clientesAguardando.length;
              tempoEstimado = stryMutAct_9fa48("668") ? posicaoAtual / 15 : (stryCov_9fa48("668"), posicaoAtual * 15); // 15 minutos por cliente
            }
          }
        }
      }
      return stryMutAct_9fa48("669") ? {} : (stryCov_9fa48("669"), {
        cliente: stryMutAct_9fa48("670") ? {} : (stryCov_9fa48("670"), {
          id: cliente.id,
          nome: cliente.nome,
          telefone: cliente.telefone,
          posicao: cliente.posicao,
          status: cliente.status,
          created_at: cliente.created_at
        }),
        barbearia: cliente.barbearias ? stryMutAct_9fa48("671") ? {} : (stryCov_9fa48("671"), {
          id: cliente.barbearias.id,
          nome: cliente.barbearias.nome
        }) : null,
        posicao_atual: posicaoAtual,
        tempo_estimado: tempoEstimado
      });
    }
  }

  // Métodos auxiliares privados

  /**
   * Gerar token único para o cliente
   * @returns {string} Token único
   */
  gerarTokenUnico() {
    if (stryMutAct_9fa48("672")) {
      {}
    } else {
      stryCov_9fa48("672");
      return stryMutAct_9fa48("673") ? Math.random().toString(36).substring(2, 15) - Math.random().toString(36).substring(2, 15) : (stryCov_9fa48("673"), (stryMutAct_9fa48("674") ? Math.random().toString(36) : (stryCov_9fa48("674"), Math.random().toString(36).substring(2, 15))) + (stryMutAct_9fa48("675") ? Math.random().toString(36) : (stryCov_9fa48("675"), Math.random().toString(36).substring(2, 15))));
    }
  }

  /**
   * Calcular próxima posição na fila
   * @param {number} barbearia_id - ID da barbearia
   * @returns {Promise<number>} Próxima posição
   */
  async calcularProximaPosicao(barbearia_id) {
    if (stryMutAct_9fa48("676")) {
      {}
    } else {
      stryCov_9fa48("676");
      const {
        data: ultimoCliente,
        error: posicaoError
      } = await this.supabase.from(stryMutAct_9fa48("677") ? "" : (stryCov_9fa48("677"), 'clientes')).select(stryMutAct_9fa48("678") ? "" : (stryCov_9fa48("678"), 'posicao')).eq(stryMutAct_9fa48("679") ? "" : (stryCov_9fa48("679"), 'barbearia_id'), barbearia_id).in(stryMutAct_9fa48("680") ? "" : (stryCov_9fa48("680"), 'status'), stryMutAct_9fa48("681") ? [] : (stryCov_9fa48("681"), [stryMutAct_9fa48("682") ? "" : (stryCov_9fa48("682"), 'aguardando'), stryMutAct_9fa48("683") ? "" : (stryCov_9fa48("683"), 'proximo')])).order(stryMutAct_9fa48("684") ? "" : (stryCov_9fa48("684"), 'posicao'), stryMutAct_9fa48("685") ? {} : (stryCov_9fa48("685"), {
        ascending: stryMutAct_9fa48("686") ? true : (stryCov_9fa48("686"), false)
      })).limit(1).single();
      return ultimoCliente ? stryMutAct_9fa48("687") ? ultimoCliente.posicao - 1 : (stryCov_9fa48("687"), ultimoCliente.posicao + 1) : 1;
    }
  }

  /**
   * Gerar QR code para fila
   * @param {Object} cliente - Dados do cliente
   * @returns {Promise<string>} QR code em base64
   */
  async gerarQRCodeFila(cliente) {
    if (stryMutAct_9fa48("688")) {
      {}
    } else {
      stryCov_9fa48("688");
      return await QRCode.toDataURL(JSON.stringify(stryMutAct_9fa48("689") ? {} : (stryCov_9fa48("689"), {
        token: cliente.token,
        barbearia_id: cliente.barbearia_id,
        tipo: stryMutAct_9fa48("690") ? "" : (stryCov_9fa48("690"), 'fila')
      })));
    }
  }

  /**
   * Gerar QR code para status
   * @param {Object} cliente - Dados do cliente
   * @returns {Promise<string>} QR code em base64
   */
  async gerarQRCodeStatus(cliente) {
    if (stryMutAct_9fa48("691")) {
      {}
    } else {
      stryCov_9fa48("691");
      return await QRCode.toDataURL(JSON.stringify(stryMutAct_9fa48("692") ? {} : (stryCov_9fa48("692"), {
        token: cliente.token,
        tipo: stryMutAct_9fa48("693") ? "" : (stryCov_9fa48("693"), 'status')
      })));
    }
  }

  /**
   * Calcular estatísticas da fila
   * @param {Array} clientes - Lista de clientes
   * @returns {Object} Estatísticas calculadas
   */
  calcularEstatisticas(clientes) {
    if (stryMutAct_9fa48("694")) {
      {}
    } else {
      stryCov_9fa48("694");
      const totalClientes = clientes.length;
      const aguardando = stryMutAct_9fa48("695") ? clientes.length : (stryCov_9fa48("695"), clientes.filter(stryMutAct_9fa48("696") ? () => undefined : (stryCov_9fa48("696"), c => stryMutAct_9fa48("699") ? c.status !== 'aguardando' : stryMutAct_9fa48("698") ? false : stryMutAct_9fa48("697") ? true : (stryCov_9fa48("697", "698", "699"), c.status === (stryMutAct_9fa48("700") ? "" : (stryCov_9fa48("700"), 'aguardando'))))).length);
      const proximo = stryMutAct_9fa48("701") ? clientes.length : (stryCov_9fa48("701"), clientes.filter(stryMutAct_9fa48("702") ? () => undefined : (stryCov_9fa48("702"), c => stryMutAct_9fa48("705") ? c.status !== 'proximo' : stryMutAct_9fa48("704") ? false : stryMutAct_9fa48("703") ? true : (stryCov_9fa48("703", "704", "705"), c.status === (stryMutAct_9fa48("706") ? "" : (stryCov_9fa48("706"), 'proximo'))))).length);
      const atendendo = stryMutAct_9fa48("707") ? clientes.length : (stryCov_9fa48("707"), clientes.filter(stryMutAct_9fa48("708") ? () => undefined : (stryCov_9fa48("708"), c => stryMutAct_9fa48("711") ? c.status !== 'atendendo' : stryMutAct_9fa48("710") ? false : stryMutAct_9fa48("709") ? true : (stryCov_9fa48("709", "710", "711"), c.status === (stryMutAct_9fa48("712") ? "" : (stryCov_9fa48("712"), 'atendendo'))))).length);
      const finalizados = stryMutAct_9fa48("713") ? clientes.length : (stryCov_9fa48("713"), clientes.filter(stryMutAct_9fa48("714") ? () => undefined : (stryCov_9fa48("714"), c => stryMutAct_9fa48("717") ? c.status !== 'finalizado' : stryMutAct_9fa48("716") ? false : stryMutAct_9fa48("715") ? true : (stryCov_9fa48("715", "716", "717"), c.status === (stryMutAct_9fa48("718") ? "" : (stryCov_9fa48("718"), 'finalizado'))))).length);
      const removidos = stryMutAct_9fa48("719") ? clientes.length : (stryCov_9fa48("719"), clientes.filter(stryMutAct_9fa48("720") ? () => undefined : (stryCov_9fa48("720"), c => stryMutAct_9fa48("723") ? c.status !== 'removido' : stryMutAct_9fa48("722") ? false : stryMutAct_9fa48("721") ? true : (stryCov_9fa48("721", "722", "723"), c.status === (stryMutAct_9fa48("724") ? "" : (stryCov_9fa48("724"), 'removido'))))).length);

      // Calcular tempo estimado (15 minutos por cliente)
      const tempoEstimado = stryMutAct_9fa48("725") ? aguardando / 15 : (stryCov_9fa48("725"), aguardando * 15);
      return stryMutAct_9fa48("726") ? {} : (stryCov_9fa48("726"), {
        total_clientes: totalClientes,
        aguardando,
        proximo,
        atendendo,
        finalizados,
        removidos,
        tempo_estimado: tempoEstimado
      });
    }
  }

  /**
   * Obter número de barbeiros ativos
   * @param {number} barbearia_id - ID da barbearia
   * @returns {Promise<number>} Número de barbeiros ativos
   */
  async obterBarbeirosAtivosCount(barbearia_id) {
    if (stryMutAct_9fa48("727")) {
      {}
    } else {
      stryCov_9fa48("727");
      const {
        data: barbeirosAtivos
      } = await this.supabase.from(stryMutAct_9fa48("728") ? "" : (stryCov_9fa48("728"), 'barbeiros_barbearias')).select(stryMutAct_9fa48("729") ? "" : (stryCov_9fa48("729"), 'id')).eq(stryMutAct_9fa48("730") ? "" : (stryCov_9fa48("730"), 'barbearia_id'), barbearia_id).eq(stryMutAct_9fa48("731") ? "" : (stryCov_9fa48("731"), 'ativo'), stryMutAct_9fa48("732") ? false : (stryCov_9fa48("732"), true));
      return barbeirosAtivos ? barbeirosAtivos.length : 0;
    }
  }
}
module.exports = FilaService;