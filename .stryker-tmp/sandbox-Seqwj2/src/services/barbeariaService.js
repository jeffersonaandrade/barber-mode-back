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
    if (stryMutAct_9fa48("314")) {
      {}
    } else {
      stryCov_9fa48("314");
      this.supabase = supabase;
    }
  }

  /**
   * Listar todas as barbearias ativas
   * @returns {Promise<Array>} Lista de barbearias
   */
  async listarBarbearias() {
    if (stryMutAct_9fa48("315")) {
      {}
    } else {
      stryCov_9fa48("315");
      try {
        if (stryMutAct_9fa48("316")) {
          {}
        } else {
          stryCov_9fa48("316");
          const {
            data: barbearias,
            error
          } = await this.supabase.from(stryMutAct_9fa48("317") ? "" : (stryCov_9fa48("317"), 'barbearias')).select(stryMutAct_9fa48("318") ? "" : (stryCov_9fa48("318"), '*')).eq(stryMutAct_9fa48("319") ? "" : (stryCov_9fa48("319"), 'ativo'), stryMutAct_9fa48("320") ? false : (stryCov_9fa48("320"), true)).order(stryMutAct_9fa48("321") ? "" : (stryCov_9fa48("321"), 'nome'));
          if (stryMutAct_9fa48("323") ? false : stryMutAct_9fa48("322") ? true : (stryCov_9fa48("322", "323"), error)) {
            if (stryMutAct_9fa48("324")) {
              {}
            } else {
              stryCov_9fa48("324");
              throw new Error(stryMutAct_9fa48("325") ? "" : (stryCov_9fa48("325"), 'Erro ao buscar barbearias'));
            }
          }
          return barbearias;
        }
      } catch (error) {
        if (stryMutAct_9fa48("326")) {
          {}
        } else {
          stryCov_9fa48("326");
          throw new Error(stryMutAct_9fa48("327") ? `` : (stryCov_9fa48("327"), `Erro ao listar barbearias: ${error.message}`));
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
    if (stryMutAct_9fa48("328")) {
      {}
    } else {
      stryCov_9fa48("328");
      try {
        if (stryMutAct_9fa48("329")) {
          {}
        } else {
          stryCov_9fa48("329");
          const {
            data: barbearia,
            error
          } = await this.supabase.from(stryMutAct_9fa48("330") ? "" : (stryCov_9fa48("330"), 'barbearias')).select(stryMutAct_9fa48("331") ? "" : (stryCov_9fa48("331"), '*')).eq(stryMutAct_9fa48("332") ? "" : (stryCov_9fa48("332"), 'id'), id).eq(stryMutAct_9fa48("333") ? "" : (stryCov_9fa48("333"), 'ativo'), stryMutAct_9fa48("334") ? false : (stryCov_9fa48("334"), true)).single();
          if (stryMutAct_9fa48("337") ? error && !barbearia : stryMutAct_9fa48("336") ? false : stryMutAct_9fa48("335") ? true : (stryCov_9fa48("335", "336", "337"), error || (stryMutAct_9fa48("338") ? barbearia : (stryCov_9fa48("338"), !barbearia)))) {
            if (stryMutAct_9fa48("339")) {
              {}
            } else {
              stryCov_9fa48("339");
              throw new Error(stryMutAct_9fa48("340") ? "" : (stryCov_9fa48("340"), 'Barbearia não encontrada'));
            }
          }
          return barbearia;
        }
      } catch (error) {
        if (stryMutAct_9fa48("341")) {
          {}
        } else {
          stryCov_9fa48("341");
          throw new Error(stryMutAct_9fa48("342") ? `` : (stryCov_9fa48("342"), `Erro ao buscar barbearia: ${error.message}`));
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
    if (stryMutAct_9fa48("343")) {
      {}
    } else {
      stryCov_9fa48("343");
      try {
        if (stryMutAct_9fa48("344")) {
          {}
        } else {
          stryCov_9fa48("344");
          // Validar dados obrigatórios
          if (stryMutAct_9fa48("347") ? !barbeariaData.nome && !barbeariaData.endereco : stryMutAct_9fa48("346") ? false : stryMutAct_9fa48("345") ? true : (stryCov_9fa48("345", "346", "347"), (stryMutAct_9fa48("348") ? barbeariaData.nome : (stryCov_9fa48("348"), !barbeariaData.nome)) || (stryMutAct_9fa48("349") ? barbeariaData.endereco : (stryCov_9fa48("349"), !barbeariaData.endereco)))) {
            if (stryMutAct_9fa48("350")) {
              {}
            } else {
              stryCov_9fa48("350");
              throw new Error(stryMutAct_9fa48("351") ? "" : (stryCov_9fa48("351"), 'Nome e endereço são obrigatórios'));
            }
          }

          // Verificar se já existe uma barbearia com o mesmo nome
          const {
            data: barbeariaExistente
          } = await this.supabase.from(stryMutAct_9fa48("352") ? "" : (stryCov_9fa48("352"), 'barbearias')).select(stryMutAct_9fa48("353") ? "" : (stryCov_9fa48("353"), 'id')).eq(stryMutAct_9fa48("354") ? "" : (stryCov_9fa48("354"), 'nome'), barbeariaData.nome).eq(stryMutAct_9fa48("355") ? "" : (stryCov_9fa48("355"), 'ativo'), stryMutAct_9fa48("356") ? false : (stryCov_9fa48("356"), true)).single();
          if (stryMutAct_9fa48("358") ? false : stryMutAct_9fa48("357") ? true : (stryCov_9fa48("357", "358"), barbeariaExistente)) {
            if (stryMutAct_9fa48("359")) {
              {}
            } else {
              stryCov_9fa48("359");
              throw new Error(stryMutAct_9fa48("360") ? "" : (stryCov_9fa48("360"), 'Já existe uma barbearia com este nome'));
            }
          }
          const {
            data: barbearia,
            error
          } = await this.supabase.from(stryMutAct_9fa48("361") ? "" : (stryCov_9fa48("361"), 'barbearias')).insert(stryMutAct_9fa48("362") ? {} : (stryCov_9fa48("362"), {
            ...barbeariaData,
            ativo: stryMutAct_9fa48("363") ? false : (stryCov_9fa48("363"), true),
            created_at: new Date().toISOString()
          })).select().single();
          if (stryMutAct_9fa48("365") ? false : stryMutAct_9fa48("364") ? true : (stryCov_9fa48("364", "365"), error)) {
            if (stryMutAct_9fa48("366")) {
              {}
            } else {
              stryCov_9fa48("366");
              throw new Error(stryMutAct_9fa48("367") ? `` : (stryCov_9fa48("367"), `Erro ao criar barbearia: ${error.message}`));
            }
          }
          return barbearia;
        }
      } catch (error) {
        if (stryMutAct_9fa48("368")) {
          {}
        } else {
          stryCov_9fa48("368");
          throw new Error(stryMutAct_9fa48("369") ? `` : (stryCov_9fa48("369"), `Erro ao criar barbearia: ${error.message}`));
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
    if (stryMutAct_9fa48("370")) {
      {}
    } else {
      stryCov_9fa48("370");
      try {
        if (stryMutAct_9fa48("371")) {
          {}
        } else {
          stryCov_9fa48("371");
          // Verificar se a barbearia existe
          const barbeariaExistente = await this.buscarBarbeariaPorId(id);

          // Se estiver alterando o nome, verificar se não conflita
          if (stryMutAct_9fa48("374") ? updateData.nome || updateData.nome !== barbeariaExistente.nome : stryMutAct_9fa48("373") ? false : stryMutAct_9fa48("372") ? true : (stryCov_9fa48("372", "373", "374"), updateData.nome && (stryMutAct_9fa48("376") ? updateData.nome === barbeariaExistente.nome : stryMutAct_9fa48("375") ? true : (stryCov_9fa48("375", "376"), updateData.nome !== barbeariaExistente.nome)))) {
            if (stryMutAct_9fa48("377")) {
              {}
            } else {
              stryCov_9fa48("377");
              const {
                data: barbeariaComMesmoNome
              } = await this.supabase.from(stryMutAct_9fa48("378") ? "" : (stryCov_9fa48("378"), 'barbearias')).select(stryMutAct_9fa48("379") ? "" : (stryCov_9fa48("379"), 'id')).eq(stryMutAct_9fa48("380") ? "" : (stryCov_9fa48("380"), 'nome'), updateData.nome).eq(stryMutAct_9fa48("381") ? "" : (stryCov_9fa48("381"), 'ativo'), stryMutAct_9fa48("382") ? false : (stryCov_9fa48("382"), true)).neq(stryMutAct_9fa48("383") ? "" : (stryCov_9fa48("383"), 'id'), id).single();
              if (stryMutAct_9fa48("385") ? false : stryMutAct_9fa48("384") ? true : (stryCov_9fa48("384", "385"), barbeariaComMesmoNome)) {
                if (stryMutAct_9fa48("386")) {
                  {}
                } else {
                  stryCov_9fa48("386");
                  throw new Error(stryMutAct_9fa48("387") ? "" : (stryCov_9fa48("387"), 'Já existe uma barbearia com este nome'));
                }
              }
            }
          }
          const {
            data: barbearia,
            error
          } = await this.supabase.from(stryMutAct_9fa48("388") ? "" : (stryCov_9fa48("388"), 'barbearias')).update(stryMutAct_9fa48("389") ? {} : (stryCov_9fa48("389"), {
            ...updateData,
            updated_at: new Date().toISOString()
          })).eq(stryMutAct_9fa48("390") ? "" : (stryCov_9fa48("390"), 'id'), id).select().single();
          if (stryMutAct_9fa48("392") ? false : stryMutAct_9fa48("391") ? true : (stryCov_9fa48("391", "392"), error)) {
            if (stryMutAct_9fa48("393")) {
              {}
            } else {
              stryCov_9fa48("393");
              throw new Error(stryMutAct_9fa48("394") ? `` : (stryCov_9fa48("394"), `Erro ao atualizar barbearia: ${error.message}`));
            }
          }
          return barbearia;
        }
      } catch (error) {
        if (stryMutAct_9fa48("395")) {
          {}
        } else {
          stryCov_9fa48("395");
          throw new Error(stryMutAct_9fa48("396") ? `` : (stryCov_9fa48("396"), `Erro ao atualizar barbearia: ${error.message}`));
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
    if (stryMutAct_9fa48("397")) {
      {}
    } else {
      stryCov_9fa48("397");
      try {
        if (stryMutAct_9fa48("398")) {
          {}
        } else {
          stryCov_9fa48("398");
          // Verificar se a barbearia existe
          await this.buscarBarbeariaPorId(id);

          // Verificar se há barbeiros ativos na barbearia
          const {
            data: barbeirosAtivos
          } = await this.supabase.from(stryMutAct_9fa48("399") ? "" : (stryCov_9fa48("399"), 'barbeiros_barbearias')).select(stryMutAct_9fa48("400") ? "" : (stryCov_9fa48("400"), 'id')).eq(stryMutAct_9fa48("401") ? "" : (stryCov_9fa48("401"), 'barbearia_id'), id).eq(stryMutAct_9fa48("402") ? "" : (stryCov_9fa48("402"), 'ativo'), stryMutAct_9fa48("403") ? false : (stryCov_9fa48("403"), true));
          if (stryMutAct_9fa48("406") ? barbeirosAtivos || barbeirosAtivos.length > 0 : stryMutAct_9fa48("405") ? false : stryMutAct_9fa48("404") ? true : (stryCov_9fa48("404", "405", "406"), barbeirosAtivos && (stryMutAct_9fa48("409") ? barbeirosAtivos.length <= 0 : stryMutAct_9fa48("408") ? barbeirosAtivos.length >= 0 : stryMutAct_9fa48("407") ? true : (stryCov_9fa48("407", "408", "409"), barbeirosAtivos.length > 0)))) {
            if (stryMutAct_9fa48("410")) {
              {}
            } else {
              stryCov_9fa48("410");
              throw new Error(stryMutAct_9fa48("411") ? "" : (stryCov_9fa48("411"), 'Não é possível remover barbearia com barbeiros ativos'));
            }
          }

          // Verificar se há clientes na fila
          const {
            data: clientesNaFila
          } = await this.supabase.from(stryMutAct_9fa48("412") ? "" : (stryCov_9fa48("412"), 'clientes')).select(stryMutAct_9fa48("413") ? "" : (stryCov_9fa48("413"), 'id')).eq(stryMutAct_9fa48("414") ? "" : (stryCov_9fa48("414"), 'barbearia_id'), id).in(stryMutAct_9fa48("415") ? "" : (stryCov_9fa48("415"), 'status'), stryMutAct_9fa48("416") ? [] : (stryCov_9fa48("416"), [stryMutAct_9fa48("417") ? "" : (stryCov_9fa48("417"), 'aguardando'), stryMutAct_9fa48("418") ? "" : (stryCov_9fa48("418"), 'proximo'), stryMutAct_9fa48("419") ? "" : (stryCov_9fa48("419"), 'atendendo')]));
          if (stryMutAct_9fa48("422") ? clientesNaFila || clientesNaFila.length > 0 : stryMutAct_9fa48("421") ? false : stryMutAct_9fa48("420") ? true : (stryCov_9fa48("420", "421", "422"), clientesNaFila && (stryMutAct_9fa48("425") ? clientesNaFila.length <= 0 : stryMutAct_9fa48("424") ? clientesNaFila.length >= 0 : stryMutAct_9fa48("423") ? true : (stryCov_9fa48("423", "424", "425"), clientesNaFila.length > 0)))) {
            if (stryMutAct_9fa48("426")) {
              {}
            } else {
              stryCov_9fa48("426");
              throw new Error(stryMutAct_9fa48("427") ? "" : (stryCov_9fa48("427"), 'Não é possível remover barbearia com clientes na fila'));
            }
          }
          const {
            error
          } = await this.supabase.from(stryMutAct_9fa48("428") ? "" : (stryCov_9fa48("428"), 'barbearias')).update(stryMutAct_9fa48("429") ? {} : (stryCov_9fa48("429"), {
            ativo: stryMutAct_9fa48("430") ? true : (stryCov_9fa48("430"), false),
            updated_at: new Date().toISOString()
          })).eq(stryMutAct_9fa48("431") ? "" : (stryCov_9fa48("431"), 'id'), id);
          if (stryMutAct_9fa48("433") ? false : stryMutAct_9fa48("432") ? true : (stryCov_9fa48("432", "433"), error)) {
            if (stryMutAct_9fa48("434")) {
              {}
            } else {
              stryCov_9fa48("434");
              throw new Error(stryMutAct_9fa48("435") ? `` : (stryCov_9fa48("435"), `Erro ao remover barbearia: ${error.message}`));
            }
          }
          return stryMutAct_9fa48("436") ? false : (stryCov_9fa48("436"), true);
        }
      } catch (error) {
        if (stryMutAct_9fa48("437")) {
          {}
        } else {
          stryCov_9fa48("437");
          throw new Error(stryMutAct_9fa48("438") ? `` : (stryCov_9fa48("438"), `Erro ao remover barbearia: ${error.message}`));
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
    if (stryMutAct_9fa48("439")) {
      {}
    } else {
      stryCov_9fa48("439");
      try {
        if (stryMutAct_9fa48("440")) {
          {}
        } else {
          stryCov_9fa48("440");
          // Verificar se o usuário é um barbeiro ativo na barbearia
          const {
            data: barbeiroAtivo,
            error: barbeiroError
          } = await this.supabase.from(stryMutAct_9fa48("441") ? "" : (stryCov_9fa48("441"), 'barbeiros_barbearias')).select(stryMutAct_9fa48("442") ? "" : (stryCov_9fa48("442"), 'id, ativo')).eq(stryMutAct_9fa48("443") ? "" : (stryCov_9fa48("443"), 'user_id'), userId).eq(stryMutAct_9fa48("444") ? "" : (stryCov_9fa48("444"), 'barbearia_id'), barbeariaId).eq(stryMutAct_9fa48("445") ? "" : (stryCov_9fa48("445"), 'ativo'), stryMutAct_9fa48("446") ? false : (stryCov_9fa48("446"), true)).single();
          if (stryMutAct_9fa48("449") ? barbeiroError && !barbeiroAtivo : stryMutAct_9fa48("448") ? false : stryMutAct_9fa48("447") ? true : (stryCov_9fa48("447", "448", "449"), barbeiroError || (stryMutAct_9fa48("450") ? barbeiroAtivo : (stryCov_9fa48("450"), !barbeiroAtivo)))) {
            if (stryMutAct_9fa48("451")) {
              {}
            } else {
              stryCov_9fa48("451");
              throw new Error(stryMutAct_9fa48("452") ? "" : (stryCov_9fa48("452"), 'Você não está ativo nesta barbearia'));
            }
          }

          // Buscar próximo cliente na fila
          // Prioridade: 1) Clientes específicos do barbeiro, 2) Fila geral
          const {
            data: proximoCliente,
            error: clienteError
          } = await this.supabase.from(stryMutAct_9fa48("453") ? "" : (stryCov_9fa48("453"), 'clientes')).select(stryMutAct_9fa48("454") ? "" : (stryCov_9fa48("454"), '*')).eq(stryMutAct_9fa48("455") ? "" : (stryCov_9fa48("455"), 'barbearia_id'), barbeariaId).in(stryMutAct_9fa48("456") ? "" : (stryCov_9fa48("456"), 'status'), stryMutAct_9fa48("457") ? [] : (stryCov_9fa48("457"), [stryMutAct_9fa48("458") ? "" : (stryCov_9fa48("458"), 'aguardando'), stryMutAct_9fa48("459") ? "" : (stryCov_9fa48("459"), 'proximo')])).or(stryMutAct_9fa48("460") ? `` : (stryCov_9fa48("460"), `barbeiro_id.eq.${userId},barbeiro_id.is.null`)).order(stryMutAct_9fa48("461") ? "" : (stryCov_9fa48("461"), 'barbeiro_id'), stryMutAct_9fa48("462") ? {} : (stryCov_9fa48("462"), {
            ascending: stryMutAct_9fa48("463") ? true : (stryCov_9fa48("463"), false)
          })) // Clientes específicos primeiro
          .order(stryMutAct_9fa48("464") ? "" : (stryCov_9fa48("464"), 'posicao'), stryMutAct_9fa48("465") ? {} : (stryCov_9fa48("465"), {
            ascending: stryMutAct_9fa48("466") ? false : (stryCov_9fa48("466"), true)
          })).limit(1).single();
          if (stryMutAct_9fa48("469") ? clienteError && !proximoCliente : stryMutAct_9fa48("468") ? false : stryMutAct_9fa48("467") ? true : (stryCov_9fa48("467", "468", "469"), clienteError || (stryMutAct_9fa48("470") ? proximoCliente : (stryCov_9fa48("470"), !proximoCliente)))) {
            if (stryMutAct_9fa48("471")) {
              {}
            } else {
              stryCov_9fa48("471");
              throw new Error(stryMutAct_9fa48("472") ? "" : (stryCov_9fa48("472"), 'Não há clientes aguardando na fila'));
            }
          }

          // Atualizar status do cliente para 'proximo'
          const {
            data: clienteAtualizado,
            error: updateError
          } = await this.supabase.from(stryMutAct_9fa48("473") ? "" : (stryCov_9fa48("473"), 'clientes')).update(stryMutAct_9fa48("474") ? {} : (stryCov_9fa48("474"), {
            status: stryMutAct_9fa48("475") ? "" : (stryCov_9fa48("475"), 'proximo'),
            barbeiro_id: userId,
            data_atendimento: new Date().toISOString()
          })).eq(stryMutAct_9fa48("476") ? "" : (stryCov_9fa48("476"), 'id'), proximoCliente.id).select().single();
          if (stryMutAct_9fa48("478") ? false : stryMutAct_9fa48("477") ? true : (stryCov_9fa48("477", "478"), updateError)) {
            if (stryMutAct_9fa48("479")) {
              {}
            } else {
              stryCov_9fa48("479");
              throw new Error(stryMutAct_9fa48("480") ? `` : (stryCov_9fa48("480"), `Erro ao atualizar status do cliente: ${updateError.message}`));
            }
          }
          return clienteAtualizado;
        }
      } catch (error) {
        if (stryMutAct_9fa48("481")) {
          {}
        } else {
          stryCov_9fa48("481");
          throw new Error(stryMutAct_9fa48("482") ? `` : (stryCov_9fa48("482"), `Erro ao chamar próximo cliente: ${error.message}`));
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
    if (stryMutAct_9fa48("483")) {
      {}
    } else {
      stryCov_9fa48("483");
      try {
        if (stryMutAct_9fa48("484")) {
          {}
        } else {
          stryCov_9fa48("484");
          const {
            data: barbeiro,
            error
          } = await this.supabase.from(stryMutAct_9fa48("485") ? "" : (stryCov_9fa48("485"), 'barbeiros_barbearias')).select(stryMutAct_9fa48("486") ? "" : (stryCov_9fa48("486"), 'ativo')).eq(stryMutAct_9fa48("487") ? "" : (stryCov_9fa48("487"), 'user_id'), userId).eq(stryMutAct_9fa48("488") ? "" : (stryCov_9fa48("488"), 'barbearia_id'), barbeariaId).eq(stryMutAct_9fa48("489") ? "" : (stryCov_9fa48("489"), 'ativo'), stryMutAct_9fa48("490") ? false : (stryCov_9fa48("490"), true)).single();
          if (stryMutAct_9fa48("493") ? error && !barbeiro : stryMutAct_9fa48("492") ? false : stryMutAct_9fa48("491") ? true : (stryCov_9fa48("491", "492", "493"), error || (stryMutAct_9fa48("494") ? barbeiro : (stryCov_9fa48("494"), !barbeiro)))) {
            if (stryMutAct_9fa48("495")) {
              {}
            } else {
              stryCov_9fa48("495");
              return stryMutAct_9fa48("496") ? true : (stryCov_9fa48("496"), false);
            }
          }
          return stryMutAct_9fa48("497") ? false : (stryCov_9fa48("497"), true);
        }
      } catch (error) {
        if (stryMutAct_9fa48("498")) {
          {}
        } else {
          stryCov_9fa48("498");
          return stryMutAct_9fa48("499") ? true : (stryCov_9fa48("499"), false);
        }
      }
    }
  }
}
module.exports = BarbeariaService;