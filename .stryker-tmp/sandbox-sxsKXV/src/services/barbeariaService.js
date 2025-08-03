/**
 * BarbeariaService - Serviço para gerenciar lógica de negócio das barbearias
 * 
 * Este serviço centraliza todas as operações relacionadas às barbearias,
 * incluindo CRUD, validações e regras de negócio.
 */
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
class BarbeariaService {
  constructor(supabase) {
    if (stryMutAct_9fa48("3632")) {
      {}
    } else {
      stryCov_9fa48("3632");
      this.supabase = supabase;
    }
  }

  /**
   * Listar todas as barbearias ativas
   * @returns {Promise<Array>} Lista de barbearias
   */
  async listarBarbearias() {
    if (stryMutAct_9fa48("3633")) {
      {}
    } else {
      stryCov_9fa48("3633");
      try {
        if (stryMutAct_9fa48("3634")) {
          {}
        } else {
          stryCov_9fa48("3634");
          const {
            data: barbearias,
            error
          } = await this.supabase.from(stryMutAct_9fa48("3635") ? "" : (stryCov_9fa48("3635"), 'barbearias')).select(stryMutAct_9fa48("3636") ? "" : (stryCov_9fa48("3636"), '*')).eq(stryMutAct_9fa48("3637") ? "" : (stryCov_9fa48("3637"), 'ativo'), stryMutAct_9fa48("3638") ? false : (stryCov_9fa48("3638"), true)).order(stryMutAct_9fa48("3639") ? "" : (stryCov_9fa48("3639"), 'nome'));
          if (stryMutAct_9fa48("3641") ? false : stryMutAct_9fa48("3640") ? true : (stryCov_9fa48("3640", "3641"), error)) {
            if (stryMutAct_9fa48("3642")) {
              {}
            } else {
              stryCov_9fa48("3642");
              throw new Error(stryMutAct_9fa48("3643") ? "" : (stryCov_9fa48("3643"), 'Erro ao buscar barbearias'));
            }
          }
          return barbearias;
        }
      } catch (error) {
        if (stryMutAct_9fa48("3644")) {
          {}
        } else {
          stryCov_9fa48("3644");
          throw new Error(stryMutAct_9fa48("3645") ? `` : (stryCov_9fa48("3645"), `Erro ao listar barbearias: ${error.message}`));
        }
      }
    }
  }

  /**
   * Buscar barbearia por ID
   * @param {number} id - ID da barbearia
   * @returns {Promise<Object>} Dados da barbearia
   */
  async buscarBarbeariaPorId(id) {
    if (stryMutAct_9fa48("3646")) {
      {}
    } else {
      stryCov_9fa48("3646");
      try {
        if (stryMutAct_9fa48("3647")) {
          {}
        } else {
          stryCov_9fa48("3647");
          const {
            data: barbearia,
            error
          } = await this.supabase.from(stryMutAct_9fa48("3648") ? "" : (stryCov_9fa48("3648"), 'barbearias')).select(stryMutAct_9fa48("3649") ? "" : (stryCov_9fa48("3649"), '*')).eq(stryMutAct_9fa48("3650") ? "" : (stryCov_9fa48("3650"), 'id'), id).eq(stryMutAct_9fa48("3651") ? "" : (stryCov_9fa48("3651"), 'ativo'), stryMutAct_9fa48("3652") ? false : (stryCov_9fa48("3652"), true)).single();
          if (stryMutAct_9fa48("3655") ? error && !barbearia : stryMutAct_9fa48("3654") ? false : stryMutAct_9fa48("3653") ? true : (stryCov_9fa48("3653", "3654", "3655"), error || (stryMutAct_9fa48("3656") ? barbearia : (stryCov_9fa48("3656"), !barbearia)))) {
            if (stryMutAct_9fa48("3657")) {
              {}
            } else {
              stryCov_9fa48("3657");
              throw new Error(stryMutAct_9fa48("3658") ? "" : (stryCov_9fa48("3658"), 'Barbearia não encontrada'));
            }
          }
          return barbearia;
        }
      } catch (error) {
        if (stryMutAct_9fa48("3659")) {
          {}
        } else {
          stryCov_9fa48("3659");
          throw new Error(stryMutAct_9fa48("3660") ? `` : (stryCov_9fa48("3660"), `Erro ao buscar barbearia: ${error.message}`));
        }
      }
    }
  }

  /**
   * Criar nova barbearia
   * @param {Object} barbeariaData - Dados da barbearia
   * @returns {Promise<Object>} Barbearia criada
   */
  async criarBarbearia(barbeariaData) {
    if (stryMutAct_9fa48("3661")) {
      {}
    } else {
      stryCov_9fa48("3661");
      try {
        if (stryMutAct_9fa48("3662")) {
          {}
        } else {
          stryCov_9fa48("3662");
          // Validar dados obrigatórios
          if (stryMutAct_9fa48("3665") ? !barbeariaData.nome && !barbeariaData.endereco : stryMutAct_9fa48("3664") ? false : stryMutAct_9fa48("3663") ? true : (stryCov_9fa48("3663", "3664", "3665"), (stryMutAct_9fa48("3666") ? barbeariaData.nome : (stryCov_9fa48("3666"), !barbeariaData.nome)) || (stryMutAct_9fa48("3667") ? barbeariaData.endereco : (stryCov_9fa48("3667"), !barbeariaData.endereco)))) {
            if (stryMutAct_9fa48("3668")) {
              {}
            } else {
              stryCov_9fa48("3668");
              throw new Error(stryMutAct_9fa48("3669") ? "" : (stryCov_9fa48("3669"), 'Nome e endereço são obrigatórios'));
            }
          }

          // Verificar se já existe uma barbearia com o mesmo nome
          const {
            data: barbeariaExistente
          } = await this.supabase.from(stryMutAct_9fa48("3670") ? "" : (stryCov_9fa48("3670"), 'barbearias')).select(stryMutAct_9fa48("3671") ? "" : (stryCov_9fa48("3671"), 'id')).eq(stryMutAct_9fa48("3672") ? "" : (stryCov_9fa48("3672"), 'nome'), barbeariaData.nome).eq(stryMutAct_9fa48("3673") ? "" : (stryCov_9fa48("3673"), 'ativo'), stryMutAct_9fa48("3674") ? false : (stryCov_9fa48("3674"), true)).single();
          if (stryMutAct_9fa48("3676") ? false : stryMutAct_9fa48("3675") ? true : (stryCov_9fa48("3675", "3676"), barbeariaExistente)) {
            if (stryMutAct_9fa48("3677")) {
              {}
            } else {
              stryCov_9fa48("3677");
              throw new Error(stryMutAct_9fa48("3678") ? "" : (stryCov_9fa48("3678"), 'Já existe uma barbearia com este nome'));
            }
          }
          const {
            data: barbearia,
            error
          } = await this.supabase.from(stryMutAct_9fa48("3679") ? "" : (stryCov_9fa48("3679"), 'barbearias')).insert(stryMutAct_9fa48("3680") ? {} : (stryCov_9fa48("3680"), {
            ...barbeariaData,
            ativo: stryMutAct_9fa48("3681") ? false : (stryCov_9fa48("3681"), true),
            created_at: new Date().toISOString()
          })).select().single();
          if (stryMutAct_9fa48("3683") ? false : stryMutAct_9fa48("3682") ? true : (stryCov_9fa48("3682", "3683"), error)) {
            if (stryMutAct_9fa48("3684")) {
              {}
            } else {
              stryCov_9fa48("3684");
              throw new Error(stryMutAct_9fa48("3685") ? `` : (stryCov_9fa48("3685"), `Erro ao criar barbearia: ${error.message}`));
            }
          }
          return barbearia;
        }
      } catch (error) {
        if (stryMutAct_9fa48("3686")) {
          {}
        } else {
          stryCov_9fa48("3686");
          throw new Error(stryMutAct_9fa48("3687") ? `` : (stryCov_9fa48("3687"), `Erro ao criar barbearia: ${error.message}`));
        }
      }
    }
  }

  /**
   * Atualizar barbearia
   * @param {number} id - ID da barbearia
   * @param {Object} updateData - Dados para atualização
   * @returns {Promise<Object>} Barbearia atualizada
   */
  async atualizarBarbearia(id, updateData) {
    if (stryMutAct_9fa48("3688")) {
      {}
    } else {
      stryCov_9fa48("3688");
      try {
        if (stryMutAct_9fa48("3689")) {
          {}
        } else {
          stryCov_9fa48("3689");
          // Verificar se a barbearia existe
          const barbeariaExistente = await this.buscarBarbeariaPorId(id);

          // Se estiver alterando o nome, verificar se não conflita
          if (stryMutAct_9fa48("3692") ? updateData.nome || updateData.nome !== barbeariaExistente.nome : stryMutAct_9fa48("3691") ? false : stryMutAct_9fa48("3690") ? true : (stryCov_9fa48("3690", "3691", "3692"), updateData.nome && (stryMutAct_9fa48("3694") ? updateData.nome === barbeariaExistente.nome : stryMutAct_9fa48("3693") ? true : (stryCov_9fa48("3693", "3694"), updateData.nome !== barbeariaExistente.nome)))) {
            if (stryMutAct_9fa48("3695")) {
              {}
            } else {
              stryCov_9fa48("3695");
              const {
                data: barbeariaComMesmoNome
              } = await this.supabase.from(stryMutAct_9fa48("3696") ? "" : (stryCov_9fa48("3696"), 'barbearias')).select(stryMutAct_9fa48("3697") ? "" : (stryCov_9fa48("3697"), 'id')).eq(stryMutAct_9fa48("3698") ? "" : (stryCov_9fa48("3698"), 'nome'), updateData.nome).eq(stryMutAct_9fa48("3699") ? "" : (stryCov_9fa48("3699"), 'ativo'), stryMutAct_9fa48("3700") ? false : (stryCov_9fa48("3700"), true)).neq(stryMutAct_9fa48("3701") ? "" : (stryCov_9fa48("3701"), 'id'), id).single();
              if (stryMutAct_9fa48("3703") ? false : stryMutAct_9fa48("3702") ? true : (stryCov_9fa48("3702", "3703"), barbeariaComMesmoNome)) {
                if (stryMutAct_9fa48("3704")) {
                  {}
                } else {
                  stryCov_9fa48("3704");
                  throw new Error(stryMutAct_9fa48("3705") ? "" : (stryCov_9fa48("3705"), 'Já existe uma barbearia com este nome'));
                }
              }
            }
          }
          const {
            data: barbearia,
            error
          } = await this.supabase.from(stryMutAct_9fa48("3706") ? "" : (stryCov_9fa48("3706"), 'barbearias')).update(stryMutAct_9fa48("3707") ? {} : (stryCov_9fa48("3707"), {
            ...updateData,
            updated_at: new Date().toISOString()
          })).eq(stryMutAct_9fa48("3708") ? "" : (stryCov_9fa48("3708"), 'id'), id).select().single();
          if (stryMutAct_9fa48("3710") ? false : stryMutAct_9fa48("3709") ? true : (stryCov_9fa48("3709", "3710"), error)) {
            if (stryMutAct_9fa48("3711")) {
              {}
            } else {
              stryCov_9fa48("3711");
              throw new Error(stryMutAct_9fa48("3712") ? `` : (stryCov_9fa48("3712"), `Erro ao atualizar barbearia: ${error.message}`));
            }
          }
          return barbearia;
        }
      } catch (error) {
        if (stryMutAct_9fa48("3713")) {
          {}
        } else {
          stryCov_9fa48("3713");
          throw new Error(stryMutAct_9fa48("3714") ? `` : (stryCov_9fa48("3714"), `Erro ao atualizar barbearia: ${error.message}`));
        }
      }
    }
  }

  /**
   * Remover barbearia (desativar)
   * @param {number} id - ID da barbearia
   * @returns {Promise<boolean>} Sucesso da operação
   */
  async removerBarbearia(id) {
    if (stryMutAct_9fa48("3715")) {
      {}
    } else {
      stryCov_9fa48("3715");
      try {
        if (stryMutAct_9fa48("3716")) {
          {}
        } else {
          stryCov_9fa48("3716");
          // Verificar se a barbearia existe
          await this.buscarBarbeariaPorId(id);

          // Verificar se há barbeiros ativos na barbearia
          const {
            data: barbeirosAtivos
          } = await this.supabase.from(stryMutAct_9fa48("3717") ? "" : (stryCov_9fa48("3717"), 'barbeiros_barbearias')).select(stryMutAct_9fa48("3718") ? "" : (stryCov_9fa48("3718"), 'id')).eq(stryMutAct_9fa48("3719") ? "" : (stryCov_9fa48("3719"), 'barbearia_id'), id).eq(stryMutAct_9fa48("3720") ? "" : (stryCov_9fa48("3720"), 'ativo'), stryMutAct_9fa48("3721") ? false : (stryCov_9fa48("3721"), true));
          if (stryMutAct_9fa48("3724") ? barbeirosAtivos || barbeirosAtivos.length > 0 : stryMutAct_9fa48("3723") ? false : stryMutAct_9fa48("3722") ? true : (stryCov_9fa48("3722", "3723", "3724"), barbeirosAtivos && (stryMutAct_9fa48("3727") ? barbeirosAtivos.length <= 0 : stryMutAct_9fa48("3726") ? barbeirosAtivos.length >= 0 : stryMutAct_9fa48("3725") ? true : (stryCov_9fa48("3725", "3726", "3727"), barbeirosAtivos.length > 0)))) {
            if (stryMutAct_9fa48("3728")) {
              {}
            } else {
              stryCov_9fa48("3728");
              throw new Error(stryMutAct_9fa48("3729") ? "" : (stryCov_9fa48("3729"), 'Não é possível remover barbearia com barbeiros ativos'));
            }
          }

          // Verificar se há clientes na fila
          const {
            data: clientesNaFila
          } = await this.supabase.from(stryMutAct_9fa48("3730") ? "" : (stryCov_9fa48("3730"), 'clientes')).select(stryMutAct_9fa48("3731") ? "" : (stryCov_9fa48("3731"), 'id')).eq(stryMutAct_9fa48("3732") ? "" : (stryCov_9fa48("3732"), 'barbearia_id'), id).in(stryMutAct_9fa48("3733") ? "" : (stryCov_9fa48("3733"), 'status'), stryMutAct_9fa48("3734") ? [] : (stryCov_9fa48("3734"), [stryMutAct_9fa48("3735") ? "" : (stryCov_9fa48("3735"), 'aguardando'), stryMutAct_9fa48("3736") ? "" : (stryCov_9fa48("3736"), 'proximo'), stryMutAct_9fa48("3737") ? "" : (stryCov_9fa48("3737"), 'atendendo')]));
          if (stryMutAct_9fa48("3740") ? clientesNaFila || clientesNaFila.length > 0 : stryMutAct_9fa48("3739") ? false : stryMutAct_9fa48("3738") ? true : (stryCov_9fa48("3738", "3739", "3740"), clientesNaFila && (stryMutAct_9fa48("3743") ? clientesNaFila.length <= 0 : stryMutAct_9fa48("3742") ? clientesNaFila.length >= 0 : stryMutAct_9fa48("3741") ? true : (stryCov_9fa48("3741", "3742", "3743"), clientesNaFila.length > 0)))) {
            if (stryMutAct_9fa48("3744")) {
              {}
            } else {
              stryCov_9fa48("3744");
              throw new Error(stryMutAct_9fa48("3745") ? "" : (stryCov_9fa48("3745"), 'Não é possível remover barbearia com clientes na fila'));
            }
          }
          const {
            error
          } = await this.supabase.from(stryMutAct_9fa48("3746") ? "" : (stryCov_9fa48("3746"), 'barbearias')).update(stryMutAct_9fa48("3747") ? {} : (stryCov_9fa48("3747"), {
            ativo: stryMutAct_9fa48("3748") ? true : (stryCov_9fa48("3748"), false),
            updated_at: new Date().toISOString()
          })).eq(stryMutAct_9fa48("3749") ? "" : (stryCov_9fa48("3749"), 'id'), id);
          if (stryMutAct_9fa48("3751") ? false : stryMutAct_9fa48("3750") ? true : (stryCov_9fa48("3750", "3751"), error)) {
            if (stryMutAct_9fa48("3752")) {
              {}
            } else {
              stryCov_9fa48("3752");
              throw new Error(stryMutAct_9fa48("3753") ? `` : (stryCov_9fa48("3753"), `Erro ao remover barbearia: ${error.message}`));
            }
          }
          return stryMutAct_9fa48("3754") ? false : (stryCov_9fa48("3754"), true);
        }
      } catch (error) {
        if (stryMutAct_9fa48("3755")) {
          {}
        } else {
          stryCov_9fa48("3755");
          throw new Error(stryMutAct_9fa48("3756") ? `` : (stryCov_9fa48("3756"), `Erro ao remover barbearia: ${error.message}`));
        }
      }
    }
  }

  /**
   * Chamar próximo cliente da fila
   * @param {number} barbeariaId - ID da barbearia
   * @param {string} userId - ID do barbeiro
   * @returns {Promise<Object>} Próximo cliente
   */
  async chamarProximoCliente(barbeariaId, userId) {
    if (stryMutAct_9fa48("3757")) {
      {}
    } else {
      stryCov_9fa48("3757");
      try {
        if (stryMutAct_9fa48("3758")) {
          {}
        } else {
          stryCov_9fa48("3758");
          // Verificar se o usuário é um barbeiro ativo na barbearia
          const {
            data: barbeiroAtivo,
            error: barbeiroError
          } = await this.supabase.from(stryMutAct_9fa48("3759") ? "" : (stryCov_9fa48("3759"), 'barbeiros_barbearias')).select(stryMutAct_9fa48("3760") ? "" : (stryCov_9fa48("3760"), 'id, ativo')).eq(stryMutAct_9fa48("3761") ? "" : (stryCov_9fa48("3761"), 'user_id'), userId).eq(stryMutAct_9fa48("3762") ? "" : (stryCov_9fa48("3762"), 'barbearia_id'), barbeariaId).eq(stryMutAct_9fa48("3763") ? "" : (stryCov_9fa48("3763"), 'ativo'), stryMutAct_9fa48("3764") ? false : (stryCov_9fa48("3764"), true)).single();
          if (stryMutAct_9fa48("3767") ? barbeiroError && !barbeiroAtivo : stryMutAct_9fa48("3766") ? false : stryMutAct_9fa48("3765") ? true : (stryCov_9fa48("3765", "3766", "3767"), barbeiroError || (stryMutAct_9fa48("3768") ? barbeiroAtivo : (stryCov_9fa48("3768"), !barbeiroAtivo)))) {
            if (stryMutAct_9fa48("3769")) {
              {}
            } else {
              stryCov_9fa48("3769");
              throw new Error(stryMutAct_9fa48("3770") ? "" : (stryCov_9fa48("3770"), 'Você não está ativo nesta barbearia'));
            }
          }

          // Buscar próximo cliente na fila
          // Prioridade: 1) Clientes específicos do barbeiro, 2) Fila geral
          const {
            data: proximoCliente,
            error: clienteError
          } = await this.supabase.from(stryMutAct_9fa48("3771") ? "" : (stryCov_9fa48("3771"), 'clientes')).select(stryMutAct_9fa48("3772") ? "" : (stryCov_9fa48("3772"), '*')).eq(stryMutAct_9fa48("3773") ? "" : (stryCov_9fa48("3773"), 'barbearia_id'), barbeariaId).in(stryMutAct_9fa48("3774") ? "" : (stryCov_9fa48("3774"), 'status'), stryMutAct_9fa48("3775") ? [] : (stryCov_9fa48("3775"), [stryMutAct_9fa48("3776") ? "" : (stryCov_9fa48("3776"), 'aguardando'), stryMutAct_9fa48("3777") ? "" : (stryCov_9fa48("3777"), 'proximo')])).or(stryMutAct_9fa48("3778") ? `` : (stryCov_9fa48("3778"), `barbeiro_id.eq.${userId},barbeiro_id.is.null`)).order(stryMutAct_9fa48("3779") ? "" : (stryCov_9fa48("3779"), 'barbeiro_id'), stryMutAct_9fa48("3780") ? {} : (stryCov_9fa48("3780"), {
            ascending: stryMutAct_9fa48("3781") ? true : (stryCov_9fa48("3781"), false)
          })) // Clientes específicos primeiro
          .order(stryMutAct_9fa48("3782") ? "" : (stryCov_9fa48("3782"), 'posicao'), stryMutAct_9fa48("3783") ? {} : (stryCov_9fa48("3783"), {
            ascending: stryMutAct_9fa48("3784") ? false : (stryCov_9fa48("3784"), true)
          })).limit(1).single();
          if (stryMutAct_9fa48("3787") ? clienteError && !proximoCliente : stryMutAct_9fa48("3786") ? false : stryMutAct_9fa48("3785") ? true : (stryCov_9fa48("3785", "3786", "3787"), clienteError || (stryMutAct_9fa48("3788") ? proximoCliente : (stryCov_9fa48("3788"), !proximoCliente)))) {
            if (stryMutAct_9fa48("3789")) {
              {}
            } else {
              stryCov_9fa48("3789");
              throw new Error(stryMutAct_9fa48("3790") ? "" : (stryCov_9fa48("3790"), 'Não há clientes aguardando na fila'));
            }
          }

          // Atualizar status do cliente para 'proximo'
          const {
            data: clienteAtualizado,
            error: updateError
          } = await this.supabase.from(stryMutAct_9fa48("3791") ? "" : (stryCov_9fa48("3791"), 'clientes')).update(stryMutAct_9fa48("3792") ? {} : (stryCov_9fa48("3792"), {
            status: stryMutAct_9fa48("3793") ? "" : (stryCov_9fa48("3793"), 'proximo'),
            barbeiro_id: userId,
            data_atendimento: new Date().toISOString()
          })).eq(stryMutAct_9fa48("3794") ? "" : (stryCov_9fa48("3794"), 'id'), proximoCliente.id).select().single();
          if (stryMutAct_9fa48("3796") ? false : stryMutAct_9fa48("3795") ? true : (stryCov_9fa48("3795", "3796"), updateError)) {
            if (stryMutAct_9fa48("3797")) {
              {}
            } else {
              stryCov_9fa48("3797");
              throw new Error(stryMutAct_9fa48("3798") ? `` : (stryCov_9fa48("3798"), `Erro ao atualizar status do cliente: ${updateError.message}`));
            }
          }
          return clienteAtualizado;
        }
      } catch (error) {
        if (stryMutAct_9fa48("3799")) {
          {}
        } else {
          stryCov_9fa48("3799");
          throw new Error(stryMutAct_9fa48("3800") ? `` : (stryCov_9fa48("3800"), `Erro ao chamar próximo cliente: ${error.message}`));
        }
      }
    }
  }

  /**
   * Verificar se barbeiro está ativo na barbearia
   * @param {string} userId - ID do usuário
   * @param {number} barbeariaId - ID da barbearia
   * @returns {Promise<boolean>} Se está ativo
   */
  async verificarBarbeiroAtivo(userId, barbeariaId) {
    if (stryMutAct_9fa48("3801")) {
      {}
    } else {
      stryCov_9fa48("3801");
      try {
        if (stryMutAct_9fa48("3802")) {
          {}
        } else {
          stryCov_9fa48("3802");
          const {
            data: barbeiro,
            error
          } = await this.supabase.from(stryMutAct_9fa48("3803") ? "" : (stryCov_9fa48("3803"), 'barbeiros_barbearias')).select(stryMutAct_9fa48("3804") ? "" : (stryCov_9fa48("3804"), 'ativo')).eq(stryMutAct_9fa48("3805") ? "" : (stryCov_9fa48("3805"), 'user_id'), userId).eq(stryMutAct_9fa48("3806") ? "" : (stryCov_9fa48("3806"), 'barbearia_id'), barbeariaId).eq(stryMutAct_9fa48("3807") ? "" : (stryCov_9fa48("3807"), 'ativo'), stryMutAct_9fa48("3808") ? false : (stryCov_9fa48("3808"), true)).single();
          if (stryMutAct_9fa48("3811") ? error && !barbeiro : stryMutAct_9fa48("3810") ? false : stryMutAct_9fa48("3809") ? true : (stryCov_9fa48("3809", "3810", "3811"), error || (stryMutAct_9fa48("3812") ? barbeiro : (stryCov_9fa48("3812"), !barbeiro)))) {
            if (stryMutAct_9fa48("3813")) {
              {}
            } else {
              stryCov_9fa48("3813");
              return stryMutAct_9fa48("3814") ? true : (stryCov_9fa48("3814"), false);
            }
          }
          return stryMutAct_9fa48("3815") ? false : (stryCov_9fa48("3815"), true);
        }
      } catch (error) {
        if (stryMutAct_9fa48("3816")) {
          {}
        } else {
          stryCov_9fa48("3816");
          return stryMutAct_9fa48("3817") ? true : (stryCov_9fa48("3817"), false);
        }
      }
    }
  }
}
module.exports = BarbeariaService;