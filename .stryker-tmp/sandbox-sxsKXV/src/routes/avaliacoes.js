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
const {
  supabase
} = require('../config/database');
const {
  checkAdminOrGerenteRole
} = require('../middlewares/rolePermissions');
async function avaliacaoRoutes(fastify, options) {
  if (stryMutAct_9fa48("989")) {
    {}
  } else {
    stryCov_9fa48("989");
    /**
     * @swagger
     * /api/avaliacoes:
     *   post:
     *     tags: [avaliacoes]
     *     summary: Enviar avaliação
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - cliente_id
     *               - barbearia_id
     *               - rating
     *             properties:
     *               cliente_id:
     *                 type: string
     *                 format: uuid
     *               barbearia_id:
     *                 type: integer
     *               barbeiro_id:
     *                 type: string
     *                 format: uuid
     *               rating:
     *                 type: integer
     *                 minimum: 1
     *                 maximum: 5
     *               categoria:
     *                 type: string
     *                 enum: [atendimento, qualidade, ambiente, tempo, preco]
     *               comentario:
     *                 type: string
     *     responses:
     *       201:
     *         description: Avaliação enviada
     *       400:
     *         description: Dados inválidos
     */
    fastify.post(stryMutAct_9fa48("990") ? "" : (stryCov_9fa48("990"), '/'), async (request, reply) => {
      if (stryMutAct_9fa48("991")) {
        {}
      } else {
        stryCov_9fa48("991");
        try {
          if (stryMutAct_9fa48("992")) {
            {}
          } else {
            stryCov_9fa48("992");
            const {
              cliente_id,
              barbearia_id,
              barbeiro_id,
              rating,
              categoria,
              comentario
            } = request.body;

            // Verificar se o cliente existe e foi atendido
            const {
              data: cliente,
              error: clienteError
            } = await supabase.from(stryMutAct_9fa48("993") ? "" : (stryCov_9fa48("993"), 'clientes')).select(stryMutAct_9fa48("994") ? "" : (stryCov_9fa48("994"), '*')).eq(stryMutAct_9fa48("995") ? "" : (stryCov_9fa48("995"), 'id'), cliente_id).eq(stryMutAct_9fa48("996") ? "" : (stryCov_9fa48("996"), 'barbearia_id'), barbearia_id).eq(stryMutAct_9fa48("997") ? "" : (stryCov_9fa48("997"), 'status'), stryMutAct_9fa48("998") ? "" : (stryCov_9fa48("998"), 'finalizado')).single();
            if (stryMutAct_9fa48("1001") ? clienteError && !cliente : stryMutAct_9fa48("1000") ? false : stryMutAct_9fa48("999") ? true : (stryCov_9fa48("999", "1000", "1001"), clienteError || (stryMutAct_9fa48("1002") ? cliente : (stryCov_9fa48("1002"), !cliente)))) {
              if (stryMutAct_9fa48("1003")) {
                {}
              } else {
                stryCov_9fa48("1003");
                return reply.status(404).send(stryMutAct_9fa48("1004") ? {} : (stryCov_9fa48("1004"), {
                  success: stryMutAct_9fa48("1005") ? true : (stryCov_9fa48("1005"), false),
                  error: stryMutAct_9fa48("1006") ? "" : (stryCov_9fa48("1006"), 'Cliente não encontrado ou não foi atendido')
                }));
              }
            }

            // Verificar se já existe avaliação para este cliente
            const {
              data: avaliacaoExistente
            } = await supabase.from(stryMutAct_9fa48("1007") ? "" : (stryCov_9fa48("1007"), 'avaliacoes')).select(stryMutAct_9fa48("1008") ? "" : (stryCov_9fa48("1008"), 'id')).eq(stryMutAct_9fa48("1009") ? "" : (stryCov_9fa48("1009"), 'cliente_id'), cliente_id).single();
            if (stryMutAct_9fa48("1011") ? false : stryMutAct_9fa48("1010") ? true : (stryCov_9fa48("1010", "1011"), avaliacaoExistente)) {
              if (stryMutAct_9fa48("1012")) {
                {}
              } else {
                stryCov_9fa48("1012");
                return reply.status(400).send(stryMutAct_9fa48("1013") ? {} : (stryCov_9fa48("1013"), {
                  success: stryMutAct_9fa48("1014") ? true : (stryCov_9fa48("1014"), false),
                  error: stryMutAct_9fa48("1015") ? "" : (stryCov_9fa48("1015"), 'Cliente já avaliou este atendimento')
                }));
              }
            }

            // Criar avaliação
            const {
              data: avaliacao,
              error
            } = await supabase.from(stryMutAct_9fa48("1016") ? "" : (stryCov_9fa48("1016"), 'avaliacoes')).insert(stryMutAct_9fa48("1017") ? {} : (stryCov_9fa48("1017"), {
              cliente_id,
              barbearia_id,
              barbeiro_id,
              rating,
              categoria,
              comentario
            })).select().single();
            if (stryMutAct_9fa48("1019") ? false : stryMutAct_9fa48("1018") ? true : (stryCov_9fa48("1018", "1019"), error)) {
              if (stryMutAct_9fa48("1020")) {
                {}
              } else {
                stryCov_9fa48("1020");
                throw new Error((stryMutAct_9fa48("1021") ? "" : (stryCov_9fa48("1021"), 'Erro ao criar avaliação: ')) + error.message);
              }
            }
            return reply.status(201).send(stryMutAct_9fa48("1022") ? {} : (stryCov_9fa48("1022"), {
              success: stryMutAct_9fa48("1023") ? false : (stryCov_9fa48("1023"), true),
              message: stryMutAct_9fa48("1024") ? "" : (stryCov_9fa48("1024"), 'Avaliação enviada com sucesso'),
              data: avaliacao
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("1025")) {
            {}
          } else {
            stryCov_9fa48("1025");
            return reply.status(400).send(stryMutAct_9fa48("1026") ? {} : (stryCov_9fa48("1026"), {
              success: stryMutAct_9fa48("1027") ? true : (stryCov_9fa48("1027"), false),
              error: error.message
            }));
          }
        }
      }
    });

    /**
     * @swagger
     * /api/avaliacoes:
     *   get:
     *     tags: [avaliacoes]
     *     summary: Listar avaliações (com filtros)
     *     security:
     *       - Bearer: []
     *     parameters:
     *       - in: query
     *         name: barbearia_id
     *         schema:
     *           type: integer
     *       - in: query
     *         name: barbeiro_id
     *         schema:
     *           type: string
     *           format: uuid
     *       - in: query
     *         name: categoria
     *         schema:
     *           type: string
     *           enum: [atendimento, qualidade, ambiente, tempo, preco]
     *       - in: query
     *         name: rating_min
     *         schema:
     *           type: integer
     *           minimum: 1
     *       - in: query
     *         name: rating_max
     *         schema:
     *           type: integer
     *           maximum: 5
     *       - in: query
     *         name: data_inicio
     *         schema:
     *           type: string
     *           format: date
     *       - in: query
     *         name: data_fim
     *         schema:
     *           type: string
     *           format: date
     *     responses:
     *       200:
     *         description: Lista de avaliações
     *       403:
     *         description: Acesso negado
     */
    fastify.get(stryMutAct_9fa48("1028") ? "" : (stryCov_9fa48("1028"), '/'), stryMutAct_9fa48("1029") ? {} : (stryCov_9fa48("1029"), {
      preValidation: stryMutAct_9fa48("1030") ? [] : (stryCov_9fa48("1030"), [fastify.authenticate, checkAdminOrGerenteRole])
    }), async (request, reply) => {
      if (stryMutAct_9fa48("1031")) {
        {}
      } else {
        stryCov_9fa48("1031");
        try {
          if (stryMutAct_9fa48("1032")) {
            {}
          } else {
            stryCov_9fa48("1032");
            const {
              barbearia_id,
              barbeiro_id,
              categoria,
              rating_min,
              rating_max,
              data_inicio,
              data_fim
            } = request.query;
            let query = supabase.from(stryMutAct_9fa48("1033") ? "" : (stryCov_9fa48("1033"), 'avaliacoes')).select(stryMutAct_9fa48("1034") ? `` : (stryCov_9fa48("1034"), `
          *,
          cliente:clientes(nome, telefone),
          barbearia:barbearias(nome),
          barbeiro:users(nome)
        `)).order(stryMutAct_9fa48("1035") ? "" : (stryCov_9fa48("1035"), 'created_at'), stryMutAct_9fa48("1036") ? {} : (stryCov_9fa48("1036"), {
              ascending: stryMutAct_9fa48("1037") ? true : (stryCov_9fa48("1037"), false)
            }));

            // Aplicar filtros
            if (stryMutAct_9fa48("1039") ? false : stryMutAct_9fa48("1038") ? true : (stryCov_9fa48("1038", "1039"), barbearia_id)) {
              if (stryMutAct_9fa48("1040")) {
                {}
              } else {
                stryCov_9fa48("1040");
                query = query.eq(stryMutAct_9fa48("1041") ? "" : (stryCov_9fa48("1041"), 'barbearia_id'), barbearia_id);
              }
            }
            if (stryMutAct_9fa48("1043") ? false : stryMutAct_9fa48("1042") ? true : (stryCov_9fa48("1042", "1043"), barbeiro_id)) {
              if (stryMutAct_9fa48("1044")) {
                {}
              } else {
                stryCov_9fa48("1044");
                query = query.eq(stryMutAct_9fa48("1045") ? "" : (stryCov_9fa48("1045"), 'barbeiro_id'), barbeiro_id);
              }
            }
            if (stryMutAct_9fa48("1047") ? false : stryMutAct_9fa48("1046") ? true : (stryCov_9fa48("1046", "1047"), categoria)) {
              if (stryMutAct_9fa48("1048")) {
                {}
              } else {
                stryCov_9fa48("1048");
                query = query.eq(stryMutAct_9fa48("1049") ? "" : (stryCov_9fa48("1049"), 'categoria'), categoria);
              }
            }
            if (stryMutAct_9fa48("1051") ? false : stryMutAct_9fa48("1050") ? true : (stryCov_9fa48("1050", "1051"), rating_min)) {
              if (stryMutAct_9fa48("1052")) {
                {}
              } else {
                stryCov_9fa48("1052");
                query = query.gte(stryMutAct_9fa48("1053") ? "" : (stryCov_9fa48("1053"), 'rating'), rating_min);
              }
            }
            if (stryMutAct_9fa48("1055") ? false : stryMutAct_9fa48("1054") ? true : (stryCov_9fa48("1054", "1055"), rating_max)) {
              if (stryMutAct_9fa48("1056")) {
                {}
              } else {
                stryCov_9fa48("1056");
                query = query.lte(stryMutAct_9fa48("1057") ? "" : (stryCov_9fa48("1057"), 'rating'), rating_max);
              }
            }
            if (stryMutAct_9fa48("1059") ? false : stryMutAct_9fa48("1058") ? true : (stryCov_9fa48("1058", "1059"), data_inicio)) {
              if (stryMutAct_9fa48("1060")) {
                {}
              } else {
                stryCov_9fa48("1060");
                query = query.gte(stryMutAct_9fa48("1061") ? "" : (stryCov_9fa48("1061"), 'created_at'), data_inicio);
              }
            }
            if (stryMutAct_9fa48("1063") ? false : stryMutAct_9fa48("1062") ? true : (stryCov_9fa48("1062", "1063"), data_fim)) {
              if (stryMutAct_9fa48("1064")) {
                {}
              } else {
                stryCov_9fa48("1064");
                query = query.lte(stryMutAct_9fa48("1065") ? "" : (stryCov_9fa48("1065"), 'created_at'), data_fim);
              }
            }
            const {
              data: avaliacoes,
              error
            } = await query;
            if (stryMutAct_9fa48("1067") ? false : stryMutAct_9fa48("1066") ? true : (stryCov_9fa48("1066", "1067"), error)) {
              if (stryMutAct_9fa48("1068")) {
                {}
              } else {
                stryCov_9fa48("1068");
                throw new Error(stryMutAct_9fa48("1069") ? "" : (stryCov_9fa48("1069"), 'Erro ao buscar avaliações'));
              }
            }

            // Calcular estatísticas
            const totalAvaliacoes = avaliacoes.length;
            const mediaRating = (stryMutAct_9fa48("1073") ? totalAvaliacoes <= 0 : stryMutAct_9fa48("1072") ? totalAvaliacoes >= 0 : stryMutAct_9fa48("1071") ? false : stryMutAct_9fa48("1070") ? true : (stryCov_9fa48("1070", "1071", "1072", "1073"), totalAvaliacoes > 0)) ? stryMutAct_9fa48("1074") ? avaliacoes.reduce((sum, av) => sum + av.rating, 0) * totalAvaliacoes : (stryCov_9fa48("1074"), avaliacoes.reduce(stryMutAct_9fa48("1075") ? () => undefined : (stryCov_9fa48("1075"), (sum, av) => stryMutAct_9fa48("1076") ? sum - av.rating : (stryCov_9fa48("1076"), sum + av.rating)), 0) / totalAvaliacoes) : 0;
            const estatisticas = stryMutAct_9fa48("1077") ? {} : (stryCov_9fa48("1077"), {
              total: totalAvaliacoes,
              media_rating: stryMutAct_9fa48("1078") ? Math.round(mediaRating * 10) * 10 : (stryCov_9fa48("1078"), Math.round(stryMutAct_9fa48("1079") ? mediaRating / 10 : (stryCov_9fa48("1079"), mediaRating * 10)) / 10),
              por_rating: stryMutAct_9fa48("1080") ? {} : (stryCov_9fa48("1080"), {
                1: stryMutAct_9fa48("1081") ? avaliacoes.length : (stryCov_9fa48("1081"), avaliacoes.filter(stryMutAct_9fa48("1082") ? () => undefined : (stryCov_9fa48("1082"), av => stryMutAct_9fa48("1085") ? av.rating !== 1 : stryMutAct_9fa48("1084") ? false : stryMutAct_9fa48("1083") ? true : (stryCov_9fa48("1083", "1084", "1085"), av.rating === 1))).length),
                2: stryMutAct_9fa48("1086") ? avaliacoes.length : (stryCov_9fa48("1086"), avaliacoes.filter(stryMutAct_9fa48("1087") ? () => undefined : (stryCov_9fa48("1087"), av => stryMutAct_9fa48("1090") ? av.rating !== 2 : stryMutAct_9fa48("1089") ? false : stryMutAct_9fa48("1088") ? true : (stryCov_9fa48("1088", "1089", "1090"), av.rating === 2))).length),
                3: stryMutAct_9fa48("1091") ? avaliacoes.length : (stryCov_9fa48("1091"), avaliacoes.filter(stryMutAct_9fa48("1092") ? () => undefined : (stryCov_9fa48("1092"), av => stryMutAct_9fa48("1095") ? av.rating !== 3 : stryMutAct_9fa48("1094") ? false : stryMutAct_9fa48("1093") ? true : (stryCov_9fa48("1093", "1094", "1095"), av.rating === 3))).length),
                4: stryMutAct_9fa48("1096") ? avaliacoes.length : (stryCov_9fa48("1096"), avaliacoes.filter(stryMutAct_9fa48("1097") ? () => undefined : (stryCov_9fa48("1097"), av => stryMutAct_9fa48("1100") ? av.rating !== 4 : stryMutAct_9fa48("1099") ? false : stryMutAct_9fa48("1098") ? true : (stryCov_9fa48("1098", "1099", "1100"), av.rating === 4))).length),
                5: stryMutAct_9fa48("1101") ? avaliacoes.length : (stryCov_9fa48("1101"), avaliacoes.filter(stryMutAct_9fa48("1102") ? () => undefined : (stryCov_9fa48("1102"), av => stryMutAct_9fa48("1105") ? av.rating !== 5 : stryMutAct_9fa48("1104") ? false : stryMutAct_9fa48("1103") ? true : (stryCov_9fa48("1103", "1104", "1105"), av.rating === 5))).length)
              })
            });
            return reply.send(stryMutAct_9fa48("1106") ? {} : (stryCov_9fa48("1106"), {
              success: stryMutAct_9fa48("1107") ? false : (stryCov_9fa48("1107"), true),
              data: stryMutAct_9fa48("1108") ? {} : (stryCov_9fa48("1108"), {
                avaliacoes,
                estatisticas
              })
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("1109")) {
            {}
          } else {
            stryCov_9fa48("1109");
            return reply.status(400).send(stryMutAct_9fa48("1110") ? {} : (stryCov_9fa48("1110"), {
              success: stryMutAct_9fa48("1111") ? true : (stryCov_9fa48("1111"), false),
              error: error.message
            }));
          }
        }
      }
    });
  }
}
module.exports = avaliacaoRoutes;