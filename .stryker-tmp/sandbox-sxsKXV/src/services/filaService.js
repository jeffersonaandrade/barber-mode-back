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
    if (stryMutAct_9fa48("3818")) {
      {}
    } else {
      stryCov_9fa48("3818");
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
    if (stryMutAct_9fa48("3819")) {
      {}
    } else {
      stryCov_9fa48("3819");
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
      } = await this.supabase.from(stryMutAct_9fa48("3820") ? "" : (stryCov_9fa48("3820"), 'barbearias')).select(stryMutAct_9fa48("3821") ? "" : (stryCov_9fa48("3821"), 'id, nome, ativo')).eq(stryMutAct_9fa48("3822") ? "" : (stryCov_9fa48("3822"), 'id'), barbearia_id).eq(stryMutAct_9fa48("3823") ? "" : (stryCov_9fa48("3823"), 'ativo'), stryMutAct_9fa48("3824") ? false : (stryCov_9fa48("3824"), true)).single();
      if (stryMutAct_9fa48("3827") ? barbeariaError && !barbearia : stryMutAct_9fa48("3826") ? false : stryMutAct_9fa48("3825") ? true : (stryCov_9fa48("3825", "3826", "3827"), barbeariaError || (stryMutAct_9fa48("3828") ? barbearia : (stryCov_9fa48("3828"), !barbearia)))) {
        if (stryMutAct_9fa48("3829")) {
          {}
        } else {
          stryCov_9fa48("3829");
          throw new Error(stryMutAct_9fa48("3830") ? "" : (stryCov_9fa48("3830"), 'Barbearia não encontrada ou inativa'));
        }
      }

      // Se barbeiro_id foi especificado, verificar se o barbeiro está ativo na barbearia
      if (stryMutAct_9fa48("3832") ? false : stryMutAct_9fa48("3831") ? true : (stryCov_9fa48("3831", "3832"), barbeiro_id)) {
        if (stryMutAct_9fa48("3833")) {
          {}
        } else {
          stryCov_9fa48("3833");
          const {
            data: barbeiroAtivo,
            error: barbeiroError
          } = await this.supabase.from(stryMutAct_9fa48("3834") ? "" : (stryCov_9fa48("3834"), 'barbeiros_barbearias')).select(stryMutAct_9fa48("3835") ? "" : (stryCov_9fa48("3835"), 'id, ativo')).eq(stryMutAct_9fa48("3836") ? "" : (stryCov_9fa48("3836"), 'user_id'), barbeiro_id).eq(stryMutAct_9fa48("3837") ? "" : (stryCov_9fa48("3837"), 'barbearia_id'), barbearia_id).eq(stryMutAct_9fa48("3838") ? "" : (stryCov_9fa48("3838"), 'ativo'), stryMutAct_9fa48("3839") ? false : (stryCov_9fa48("3839"), true)).single();
          if (stryMutAct_9fa48("3842") ? barbeiroError && !barbeiroAtivo : stryMutAct_9fa48("3841") ? false : stryMutAct_9fa48("3840") ? true : (stryCov_9fa48("3840", "3841", "3842"), barbeiroError || (stryMutAct_9fa48("3843") ? barbeiroAtivo : (stryCov_9fa48("3843"), !barbeiroAtivo)))) {
            if (stryMutAct_9fa48("3844")) {
              {}
            } else {
              stryCov_9fa48("3844");
              throw new Error(stryMutAct_9fa48("3845") ? "" : (stryCov_9fa48("3845"), 'Barbeiro especificado não está ativo nesta barbearia'));
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
      } = await this.supabase.from(stryMutAct_9fa48("3846") ? "" : (stryCov_9fa48("3846"), 'clientes')).insert(stryMutAct_9fa48("3847") ? {} : (stryCov_9fa48("3847"), {
        nome,
        telefone,
        token,
        barbearia_id,
        barbeiro_id,
        posicao,
        status: stryMutAct_9fa48("3848") ? "" : (stryCov_9fa48("3848"), 'aguardando'),
        created_at: new Date().toISOString()
      })).select().single();
      if (stryMutAct_9fa48("3850") ? false : stryMutAct_9fa48("3849") ? true : (stryCov_9fa48("3849", "3850"), insertError)) {
        if (stryMutAct_9fa48("3851")) {
          {}
        } else {
          stryCov_9fa48("3851");
          console.error(stryMutAct_9fa48("3852") ? "" : (stryCov_9fa48("3852"), 'Erro ao inserir cliente:'), insertError);
          throw new Error(stryMutAct_9fa48("3853") ? "" : (stryCov_9fa48("3853"), 'Erro interno do servidor'));
        }
      }

      // Gerar QR codes
      const qrCodeFila = await this.gerarQRCodeFila(cliente);
      const qrCodeStatus = await this.gerarQRCodeStatus(cliente);
      return stryMutAct_9fa48("3854") ? {} : (stryCov_9fa48("3854"), {
        cliente: stryMutAct_9fa48("3855") ? {} : (stryCov_9fa48("3855"), {
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
    if (stryMutAct_9fa48("3856")) {
      {}
    } else {
      stryCov_9fa48("3856");
      // Verificar se a barbearia existe
      const {
        data: barbearia,
        error: barbeariaError
      } = await this.supabase.from(stryMutAct_9fa48("3857") ? "" : (stryCov_9fa48("3857"), 'barbearias')).select(stryMutAct_9fa48("3858") ? "" : (stryCov_9fa48("3858"), 'id, nome, ativo')).eq(stryMutAct_9fa48("3859") ? "" : (stryCov_9fa48("3859"), 'id'), barbearia_id).single();
      if (stryMutAct_9fa48("3862") ? barbeariaError && !barbearia : stryMutAct_9fa48("3861") ? false : stryMutAct_9fa48("3860") ? true : (stryCov_9fa48("3860", "3861", "3862"), barbeariaError || (stryMutAct_9fa48("3863") ? barbearia : (stryCov_9fa48("3863"), !barbearia)))) {
        if (stryMutAct_9fa48("3864")) {
          {}
        } else {
          stryCov_9fa48("3864");
          throw new Error(stryMutAct_9fa48("3865") ? "" : (stryCov_9fa48("3865"), 'Barbearia não encontrada'));
        }
      }

      // Obter clientes na fila
      const {
        data: clientes,
        error: clientesError
      } = await this.supabase.from(stryMutAct_9fa48("3866") ? "" : (stryCov_9fa48("3866"), 'clientes')).select(stryMutAct_9fa48("3867") ? `` : (stryCov_9fa48("3867"), `
        id,
        nome,
        telefone,
        posicao,
        status,
        created_at,
        barbeiro_id,
        users(id, nome)
      `)).eq(stryMutAct_9fa48("3868") ? "" : (stryCov_9fa48("3868"), 'barbearia_id'), barbearia_id).in(stryMutAct_9fa48("3869") ? "" : (stryCov_9fa48("3869"), 'status'), stryMutAct_9fa48("3870") ? [] : (stryCov_9fa48("3870"), [stryMutAct_9fa48("3871") ? "" : (stryCov_9fa48("3871"), 'aguardando'), stryMutAct_9fa48("3872") ? "" : (stryCov_9fa48("3872"), 'proximo'), stryMutAct_9fa48("3873") ? "" : (stryCov_9fa48("3873"), 'atendendo'), stryMutAct_9fa48("3874") ? "" : (stryCov_9fa48("3874"), 'finalizado'), stryMutAct_9fa48("3875") ? "" : (stryCov_9fa48("3875"), 'removido')])).order(stryMutAct_9fa48("3876") ? "" : (stryCov_9fa48("3876"), 'posicao'), stryMutAct_9fa48("3877") ? {} : (stryCov_9fa48("3877"), {
        ascending: stryMutAct_9fa48("3878") ? false : (stryCov_9fa48("3878"), true)
      }));
      if (stryMutAct_9fa48("3880") ? false : stryMutAct_9fa48("3879") ? true : (stryCov_9fa48("3879", "3880"), clientesError)) {
        if (stryMutAct_9fa48("3881")) {
          {}
        } else {
          stryCov_9fa48("3881");
          throw new Error(stryMutAct_9fa48("3882") ? "" : (stryCov_9fa48("3882"), 'Erro interno do servidor'));
        }
      }

      // Calcular estatísticas
      const estatisticas = this.calcularEstatisticas(clientes);

      // Obter número de barbeiros ativos
      const barbeirosAtivosCount = await this.obterBarbeirosAtivosCount(barbearia_id);
      estatisticas.barbeiros_ativos = barbeirosAtivosCount;
      return stryMutAct_9fa48("3883") ? {} : (stryCov_9fa48("3883"), {
        barbearia: stryMutAct_9fa48("3884") ? {} : (stryCov_9fa48("3884"), {
          id: barbearia.id,
          nome: barbearia.nome
        }),
        clientes: clientes.map(stryMutAct_9fa48("3885") ? () => undefined : (stryCov_9fa48("3885"), cliente => stryMutAct_9fa48("3886") ? {} : (stryCov_9fa48("3886"), {
          id: cliente.id,
          nome: cliente.nome,
          telefone: cliente.telefone,
          posicao: cliente.posicao,
          status: cliente.status,
          created_at: cliente.created_at,
          barbeiro: cliente.users ? stryMutAct_9fa48("3887") ? {} : (stryCov_9fa48("3887"), {
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
  async obterEstatisticasFila(barbearia_id, verificarAtivo = stryMutAct_9fa48("3888") ? true : (stryCov_9fa48("3888"), false)) {
    if (stryMutAct_9fa48("3889")) {
      {}
    } else {
      stryCov_9fa48("3889");
      // Verificar se a barbearia existe
      let query = this.supabase.from(stryMutAct_9fa48("3890") ? "" : (stryCov_9fa48("3890"), 'barbearias')).select(stryMutAct_9fa48("3891") ? "" : (stryCov_9fa48("3891"), 'id, nome, ativo')).eq(stryMutAct_9fa48("3892") ? "" : (stryCov_9fa48("3892"), 'id'), barbearia_id);
      if (stryMutAct_9fa48("3894") ? false : stryMutAct_9fa48("3893") ? true : (stryCov_9fa48("3893", "3894"), verificarAtivo)) {
        if (stryMutAct_9fa48("3895")) {
          {}
        } else {
          stryCov_9fa48("3895");
          query = query.eq(stryMutAct_9fa48("3896") ? "" : (stryCov_9fa48("3896"), 'ativo'), stryMutAct_9fa48("3897") ? false : (stryCov_9fa48("3897"), true));
        }
      }
      const {
        data: barbearia,
        error: barbeariaError
      } = await query.single();
      if (stryMutAct_9fa48("3900") ? barbeariaError && !barbearia : stryMutAct_9fa48("3899") ? false : stryMutAct_9fa48("3898") ? true : (stryCov_9fa48("3898", "3899", "3900"), barbeariaError || (stryMutAct_9fa48("3901") ? barbearia : (stryCov_9fa48("3901"), !barbearia)))) {
        if (stryMutAct_9fa48("3902")) {
          {}
        } else {
          stryCov_9fa48("3902");
          throw new Error(verificarAtivo ? stryMutAct_9fa48("3903") ? "" : (stryCov_9fa48("3903"), 'Barbearia não encontrada ou inativa') : stryMutAct_9fa48("3904") ? "" : (stryCov_9fa48("3904"), 'Barbearia não encontrada'));
        }
      }

      // Obter apenas estatísticas da fila (sem dados pessoais dos clientes)
      const {
        data: clientes,
        error: clientesError
      } = await this.supabase.from(stryMutAct_9fa48("3905") ? "" : (stryCov_9fa48("3905"), 'clientes')).select(stryMutAct_9fa48("3906") ? "" : (stryCov_9fa48("3906"), 'status')).eq(stryMutAct_9fa48("3907") ? "" : (stryCov_9fa48("3907"), 'barbearia_id'), barbearia_id).in(stryMutAct_9fa48("3908") ? "" : (stryCov_9fa48("3908"), 'status'), stryMutAct_9fa48("3909") ? [] : (stryCov_9fa48("3909"), [stryMutAct_9fa48("3910") ? "" : (stryCov_9fa48("3910"), 'aguardando'), stryMutAct_9fa48("3911") ? "" : (stryCov_9fa48("3911"), 'proximo'), stryMutAct_9fa48("3912") ? "" : (stryCov_9fa48("3912"), 'atendendo'), stryMutAct_9fa48("3913") ? "" : (stryCov_9fa48("3913"), 'finalizado'), stryMutAct_9fa48("3914") ? "" : (stryCov_9fa48("3914"), 'removido')]));
      if (stryMutAct_9fa48("3916") ? false : stryMutAct_9fa48("3915") ? true : (stryCov_9fa48("3915", "3916"), clientesError)) {
        if (stryMutAct_9fa48("3917")) {
          {}
        } else {
          stryCov_9fa48("3917");
          throw new Error(stryMutAct_9fa48("3918") ? "" : (stryCov_9fa48("3918"), 'Erro interno do servidor'));
        }
      }

      // Calcular estatísticas
      const estatisticas = this.calcularEstatisticas(clientes);

      // Obter número de barbeiros ativos
      const barbeirosAtivosCount = await this.obterBarbeirosAtivosCount(barbearia_id);
      estatisticas.barbeiros_ativos = barbeirosAtivosCount;
      return stryMutAct_9fa48("3919") ? {} : (stryCov_9fa48("3919"), {
        barbearia: stryMutAct_9fa48("3920") ? {} : (stryCov_9fa48("3920"), {
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
    if (stryMutAct_9fa48("3921")) {
      {}
    } else {
      stryCov_9fa48("3921");
      // Verificar se a barbearia existe
      const {
        data: barbearia,
        error: barbeariaError
      } = await this.supabase.from(stryMutAct_9fa48("3922") ? "" : (stryCov_9fa48("3922"), 'barbearias')).select(stryMutAct_9fa48("3923") ? "" : (stryCov_9fa48("3923"), 'id, nome, ativo')).eq(stryMutAct_9fa48("3924") ? "" : (stryCov_9fa48("3924"), 'id'), barbearia_id).single();
      if (stryMutAct_9fa48("3927") ? barbeariaError && !barbearia : stryMutAct_9fa48("3926") ? false : stryMutAct_9fa48("3925") ? true : (stryCov_9fa48("3925", "3926", "3927"), barbeariaError || (stryMutAct_9fa48("3928") ? barbearia : (stryCov_9fa48("3928"), !barbearia)))) {
        if (stryMutAct_9fa48("3929")) {
          {}
        } else {
          stryCov_9fa48("3929");
          throw new Error(stryMutAct_9fa48("3930") ? "" : (stryCov_9fa48("3930"), 'Barbearia não encontrada'));
        }
      }

      // Buscar próximo cliente na fila
      const {
        data: proximoCliente,
        error: clienteError
      } = await this.supabase.from(stryMutAct_9fa48("3931") ? "" : (stryCov_9fa48("3931"), 'clientes')).select(stryMutAct_9fa48("3932") ? "" : (stryCov_9fa48("3932"), 'id, nome, telefone, posicao, status')).eq(stryMutAct_9fa48("3933") ? "" : (stryCov_9fa48("3933"), 'barbearia_id'), barbearia_id).eq(stryMutAct_9fa48("3934") ? "" : (stryCov_9fa48("3934"), 'status'), stryMutAct_9fa48("3935") ? "" : (stryCov_9fa48("3935"), 'aguardando')).order(stryMutAct_9fa48("3936") ? "" : (stryCov_9fa48("3936"), 'posicao'), stryMutAct_9fa48("3937") ? {} : (stryCov_9fa48("3937"), {
        ascending: stryMutAct_9fa48("3938") ? false : (stryCov_9fa48("3938"), true)
      })).limit(1).single();
      if (stryMutAct_9fa48("3941") ? clienteError && !proximoCliente : stryMutAct_9fa48("3940") ? false : stryMutAct_9fa48("3939") ? true : (stryCov_9fa48("3939", "3940", "3941"), clienteError || (stryMutAct_9fa48("3942") ? proximoCliente : (stryCov_9fa48("3942"), !proximoCliente)))) {
        if (stryMutAct_9fa48("3943")) {
          {}
        } else {
          stryCov_9fa48("3943");
          throw new Error(stryMutAct_9fa48("3944") ? "" : (stryCov_9fa48("3944"), 'Não há clientes aguardando na fila'));
        }
      }

      // Atualizar status do cliente para 'próximo'
      const {
        error: updateError
      } = await this.supabase.from(stryMutAct_9fa48("3945") ? "" : (stryCov_9fa48("3945"), 'clientes')).update(stryMutAct_9fa48("3946") ? {} : (stryCov_9fa48("3946"), {
        status: stryMutAct_9fa48("3947") ? "" : (stryCov_9fa48("3947"), 'proximo'),
        barbeiro_id: barbeiro_id,
        updated_at: new Date().toISOString()
      })).eq(stryMutAct_9fa48("3948") ? "" : (stryCov_9fa48("3948"), 'id'), proximoCliente.id);
      if (stryMutAct_9fa48("3950") ? false : stryMutAct_9fa48("3949") ? true : (stryCov_9fa48("3949", "3950"), updateError)) {
        if (stryMutAct_9fa48("3951")) {
          {}
        } else {
          stryCov_9fa48("3951");
          throw new Error(stryMutAct_9fa48("3952") ? "" : (stryCov_9fa48("3952"), 'Erro ao atualizar status do cliente'));
        }
      }
      return stryMutAct_9fa48("3953") ? {} : (stryCov_9fa48("3953"), {
        cliente: stryMutAct_9fa48("3954") ? {} : (stryCov_9fa48("3954"), {
          id: proximoCliente.id,
          nome: proximoCliente.nome,
          telefone: proximoCliente.telefone,
          posicao: proximoCliente.posicao,
          status: stryMutAct_9fa48("3955") ? "" : (stryCov_9fa48("3955"), 'proximo')
        }),
        barbearia: stryMutAct_9fa48("3956") ? {} : (stryCov_9fa48("3956"), {
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
    if (stryMutAct_9fa48("3957")) {
      {}
    } else {
      stryCov_9fa48("3957");
      // Buscar cliente pelo token
      const {
        data: cliente,
        error: clienteError
      } = await this.supabase.from(stryMutAct_9fa48("3958") ? "" : (stryCov_9fa48("3958"), 'clientes')).select(stryMutAct_9fa48("3959") ? `` : (stryCov_9fa48("3959"), `
        id,
        nome,
        telefone,
        posicao,
        status,
        created_at,
        barbearia_id,
        barbearias(id, nome)
      `)).eq(stryMutAct_9fa48("3960") ? "" : (stryCov_9fa48("3960"), 'token'), token).single();
      if (stryMutAct_9fa48("3963") ? clienteError && !cliente : stryMutAct_9fa48("3962") ? false : stryMutAct_9fa48("3961") ? true : (stryCov_9fa48("3961", "3962", "3963"), clienteError || (stryMutAct_9fa48("3964") ? cliente : (stryCov_9fa48("3964"), !cliente)))) {
        if (stryMutAct_9fa48("3965")) {
          {}
        } else {
          stryCov_9fa48("3965");
          throw new Error(stryMutAct_9fa48("3966") ? "" : (stryCov_9fa48("3966"), 'Cliente não encontrado'));
        }
      }

      // Calcular posição atual na fila (apenas para clientes aguardando)
      let posicaoAtual = null;
      let tempoEstimado = null;
      if (stryMutAct_9fa48("3969") ? cliente.status !== 'aguardando' : stryMutAct_9fa48("3968") ? false : stryMutAct_9fa48("3967") ? true : (stryCov_9fa48("3967", "3968", "3969"), cliente.status === (stryMutAct_9fa48("3970") ? "" : (stryCov_9fa48("3970"), 'aguardando')))) {
        if (stryMutAct_9fa48("3971")) {
          {}
        } else {
          stryCov_9fa48("3971");
          const {
            data: clientesAguardando,
            error: posicaoError
          } = await this.supabase.from(stryMutAct_9fa48("3972") ? "" : (stryCov_9fa48("3972"), 'clientes')).select(stryMutAct_9fa48("3973") ? "" : (stryCov_9fa48("3973"), 'posicao')).eq(stryMutAct_9fa48("3974") ? "" : (stryCov_9fa48("3974"), 'barbearia_id'), cliente.barbearia_id).eq(stryMutAct_9fa48("3975") ? "" : (stryCov_9fa48("3975"), 'status'), stryMutAct_9fa48("3976") ? "" : (stryCov_9fa48("3976"), 'aguardando')).lte(stryMutAct_9fa48("3977") ? "" : (stryCov_9fa48("3977"), 'posicao'), cliente.posicao).order(stryMutAct_9fa48("3978") ? "" : (stryCov_9fa48("3978"), 'posicao'), stryMutAct_9fa48("3979") ? {} : (stryCov_9fa48("3979"), {
            ascending: stryMutAct_9fa48("3980") ? false : (stryCov_9fa48("3980"), true)
          }));
          if (stryMutAct_9fa48("3983") ? !posicaoError || clientesAguardando : stryMutAct_9fa48("3982") ? false : stryMutAct_9fa48("3981") ? true : (stryCov_9fa48("3981", "3982", "3983"), (stryMutAct_9fa48("3984") ? posicaoError : (stryCov_9fa48("3984"), !posicaoError)) && clientesAguardando)) {
            if (stryMutAct_9fa48("3985")) {
              {}
            } else {
              stryCov_9fa48("3985");
              posicaoAtual = clientesAguardando.length;
              tempoEstimado = stryMutAct_9fa48("3986") ? posicaoAtual / 15 : (stryCov_9fa48("3986"), posicaoAtual * 15); // 15 minutos por cliente
            }
          }
        }
      }
      return stryMutAct_9fa48("3987") ? {} : (stryCov_9fa48("3987"), {
        cliente: stryMutAct_9fa48("3988") ? {} : (stryCov_9fa48("3988"), {
          id: cliente.id,
          nome: cliente.nome,
          telefone: cliente.telefone,
          posicao: cliente.posicao,
          status: cliente.status,
          created_at: cliente.created_at
        }),
        barbearia: cliente.barbearias ? stryMutAct_9fa48("3989") ? {} : (stryCov_9fa48("3989"), {
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
    if (stryMutAct_9fa48("3990")) {
      {}
    } else {
      stryCov_9fa48("3990");
      return stryMutAct_9fa48("3991") ? Math.random().toString(36).substring(2, 15) - Math.random().toString(36).substring(2, 15) : (stryCov_9fa48("3991"), (stryMutAct_9fa48("3992") ? Math.random().toString(36) : (stryCov_9fa48("3992"), Math.random().toString(36).substring(2, 15))) + (stryMutAct_9fa48("3993") ? Math.random().toString(36) : (stryCov_9fa48("3993"), Math.random().toString(36).substring(2, 15))));
    }
  }

  /**
   * Calcular próxima posição na fila
   * @param {number} barbearia_id - ID da barbearia
   * @returns {Promise<number>} Próxima posição
   */
  async calcularProximaPosicao(barbearia_id) {
    if (stryMutAct_9fa48("3994")) {
      {}
    } else {
      stryCov_9fa48("3994");
      const {
        data: ultimoCliente,
        error: posicaoError
      } = await this.supabase.from(stryMutAct_9fa48("3995") ? "" : (stryCov_9fa48("3995"), 'clientes')).select(stryMutAct_9fa48("3996") ? "" : (stryCov_9fa48("3996"), 'posicao')).eq(stryMutAct_9fa48("3997") ? "" : (stryCov_9fa48("3997"), 'barbearia_id'), barbearia_id).in(stryMutAct_9fa48("3998") ? "" : (stryCov_9fa48("3998"), 'status'), stryMutAct_9fa48("3999") ? [] : (stryCov_9fa48("3999"), [stryMutAct_9fa48("4000") ? "" : (stryCov_9fa48("4000"), 'aguardando'), stryMutAct_9fa48("4001") ? "" : (stryCov_9fa48("4001"), 'proximo')])).order(stryMutAct_9fa48("4002") ? "" : (stryCov_9fa48("4002"), 'posicao'), stryMutAct_9fa48("4003") ? {} : (stryCov_9fa48("4003"), {
        ascending: stryMutAct_9fa48("4004") ? true : (stryCov_9fa48("4004"), false)
      })).limit(1).single();
      return ultimoCliente ? stryMutAct_9fa48("4005") ? ultimoCliente.posicao - 1 : (stryCov_9fa48("4005"), ultimoCliente.posicao + 1) : 1;
    }
  }

  /**
   * Gerar QR code para fila
   * @param {Object} cliente - Dados do cliente
   * @returns {Promise<string>} QR code em base64
   */
  async gerarQRCodeFila(cliente) {
    if (stryMutAct_9fa48("4006")) {
      {}
    } else {
      stryCov_9fa48("4006");
      return await QRCode.toDataURL(JSON.stringify(stryMutAct_9fa48("4007") ? {} : (stryCov_9fa48("4007"), {
        token: cliente.token,
        barbearia_id: cliente.barbearia_id,
        tipo: stryMutAct_9fa48("4008") ? "" : (stryCov_9fa48("4008"), 'fila')
      })));
    }
  }

  /**
   * Gerar QR code para status
   * @param {Object} cliente - Dados do cliente
   * @returns {Promise<string>} QR code em base64
   */
  async gerarQRCodeStatus(cliente) {
    if (stryMutAct_9fa48("4009")) {
      {}
    } else {
      stryCov_9fa48("4009");
      return await QRCode.toDataURL(JSON.stringify(stryMutAct_9fa48("4010") ? {} : (stryCov_9fa48("4010"), {
        token: cliente.token,
        tipo: stryMutAct_9fa48("4011") ? "" : (stryCov_9fa48("4011"), 'status')
      })));
    }
  }

  /**
   * Calcular estatísticas da fila
   * @param {Array} clientes - Lista de clientes
   * @returns {Object} Estatísticas calculadas
   */
  calcularEstatisticas(clientes) {
    if (stryMutAct_9fa48("4012")) {
      {}
    } else {
      stryCov_9fa48("4012");
      const totalClientes = clientes.length;
      const aguardando = stryMutAct_9fa48("4013") ? clientes.length : (stryCov_9fa48("4013"), clientes.filter(stryMutAct_9fa48("4014") ? () => undefined : (stryCov_9fa48("4014"), c => stryMutAct_9fa48("4017") ? c.status !== 'aguardando' : stryMutAct_9fa48("4016") ? false : stryMutAct_9fa48("4015") ? true : (stryCov_9fa48("4015", "4016", "4017"), c.status === (stryMutAct_9fa48("4018") ? "" : (stryCov_9fa48("4018"), 'aguardando'))))).length);
      const proximo = stryMutAct_9fa48("4019") ? clientes.length : (stryCov_9fa48("4019"), clientes.filter(stryMutAct_9fa48("4020") ? () => undefined : (stryCov_9fa48("4020"), c => stryMutAct_9fa48("4023") ? c.status !== 'proximo' : stryMutAct_9fa48("4022") ? false : stryMutAct_9fa48("4021") ? true : (stryCov_9fa48("4021", "4022", "4023"), c.status === (stryMutAct_9fa48("4024") ? "" : (stryCov_9fa48("4024"), 'proximo'))))).length);
      const atendendo = stryMutAct_9fa48("4025") ? clientes.length : (stryCov_9fa48("4025"), clientes.filter(stryMutAct_9fa48("4026") ? () => undefined : (stryCov_9fa48("4026"), c => stryMutAct_9fa48("4029") ? c.status !== 'atendendo' : stryMutAct_9fa48("4028") ? false : stryMutAct_9fa48("4027") ? true : (stryCov_9fa48("4027", "4028", "4029"), c.status === (stryMutAct_9fa48("4030") ? "" : (stryCov_9fa48("4030"), 'atendendo'))))).length);
      const finalizados = stryMutAct_9fa48("4031") ? clientes.length : (stryCov_9fa48("4031"), clientes.filter(stryMutAct_9fa48("4032") ? () => undefined : (stryCov_9fa48("4032"), c => stryMutAct_9fa48("4035") ? c.status !== 'finalizado' : stryMutAct_9fa48("4034") ? false : stryMutAct_9fa48("4033") ? true : (stryCov_9fa48("4033", "4034", "4035"), c.status === (stryMutAct_9fa48("4036") ? "" : (stryCov_9fa48("4036"), 'finalizado'))))).length);
      const removidos = stryMutAct_9fa48("4037") ? clientes.length : (stryCov_9fa48("4037"), clientes.filter(stryMutAct_9fa48("4038") ? () => undefined : (stryCov_9fa48("4038"), c => stryMutAct_9fa48("4041") ? c.status !== 'removido' : stryMutAct_9fa48("4040") ? false : stryMutAct_9fa48("4039") ? true : (stryCov_9fa48("4039", "4040", "4041"), c.status === (stryMutAct_9fa48("4042") ? "" : (stryCov_9fa48("4042"), 'removido'))))).length);

      // Calcular tempo estimado (15 minutos por cliente)
      const tempoEstimado = stryMutAct_9fa48("4043") ? aguardando / 15 : (stryCov_9fa48("4043"), aguardando * 15);
      return stryMutAct_9fa48("4044") ? {} : (stryCov_9fa48("4044"), {
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
    if (stryMutAct_9fa48("4045")) {
      {}
    } else {
      stryCov_9fa48("4045");
      const {
        data: barbeirosAtivos
      } = await this.supabase.from(stryMutAct_9fa48("4046") ? "" : (stryCov_9fa48("4046"), 'barbeiros_barbearias')).select(stryMutAct_9fa48("4047") ? "" : (stryCov_9fa48("4047"), 'id')).eq(stryMutAct_9fa48("4048") ? "" : (stryCov_9fa48("4048"), 'barbearia_id'), barbearia_id).eq(stryMutAct_9fa48("4049") ? "" : (stryCov_9fa48("4049"), 'ativo'), stryMutAct_9fa48("4050") ? false : (stryCov_9fa48("4050"), true));
      return barbeirosAtivos ? barbeirosAtivos.length : 0;
    }
  }
}
module.exports = FilaService;