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
  barbeariaSchema,
  barbeariaUpdateSchema
} = require('../schemas/barbearia');
const {
  checkAdminRole
} = require('../middlewares/rolePermissions');
async function barbeariaRoutes(fastify, options) {
  if (stryMutAct_9fa48("1196")) {
    {}
  } else {
    stryCov_9fa48("1196");
    /**
     * @swagger
     * /api/barbearias:
     *   get:
     *     tags: [barbearias]
     *     summary: Listar barbearias (PÚBLICO)
     *     responses:
     *       200:
     *         description: Lista de barbearias ativas
     */
    fastify.get(stryMutAct_9fa48("1197") ? "" : (stryCov_9fa48("1197"), '/'), async (request, reply) => {
      if (stryMutAct_9fa48("1198")) {
        {}
      } else {
        stryCov_9fa48("1198");
        try {
          if (stryMutAct_9fa48("1199")) {
            {}
          } else {
            stryCov_9fa48("1199");
            const {
              data: barbearias,
              error
            } = await supabase.from(stryMutAct_9fa48("1200") ? "" : (stryCov_9fa48("1200"), 'barbearias')).select(stryMutAct_9fa48("1201") ? "" : (stryCov_9fa48("1201"), '*')).eq(stryMutAct_9fa48("1202") ? "" : (stryCov_9fa48("1202"), 'ativo'), stryMutAct_9fa48("1203") ? false : (stryCov_9fa48("1203"), true)).order(stryMutAct_9fa48("1204") ? "" : (stryCov_9fa48("1204"), 'nome'));
            if (stryMutAct_9fa48("1206") ? false : stryMutAct_9fa48("1205") ? true : (stryCov_9fa48("1205", "1206"), error)) {
              if (stryMutAct_9fa48("1207")) {
                {}
              } else {
                stryCov_9fa48("1207");
                throw new Error(stryMutAct_9fa48("1208") ? "" : (stryCov_9fa48("1208"), 'Erro ao buscar barbearias'));
              }
            }
            return reply.send(stryMutAct_9fa48("1209") ? {} : (stryCov_9fa48("1209"), {
              success: stryMutAct_9fa48("1210") ? false : (stryCov_9fa48("1210"), true),
              data: barbearias
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("1211")) {
            {}
          } else {
            stryCov_9fa48("1211");
            return reply.status(400).send(stryMutAct_9fa48("1212") ? {} : (stryCov_9fa48("1212"), {
              success: stryMutAct_9fa48("1213") ? true : (stryCov_9fa48("1213"), false),
              error: error.message
            }));
          }
        }
      }
    });

    /**
     * @swagger
     * /api/barbearias/{id}:
     *   get:
     *     tags: [barbearias]
     *     summary: Buscar barbearia por ID
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Dados da barbearia
     *       404:
     *         description: Barbearia não encontrada
     */
    fastify.get(stryMutAct_9fa48("1214") ? "" : (stryCov_9fa48("1214"), '/:id'), async (request, reply) => {
      if (stryMutAct_9fa48("1215")) {
        {}
      } else {
        stryCov_9fa48("1215");
        try {
          if (stryMutAct_9fa48("1216")) {
            {}
          } else {
            stryCov_9fa48("1216");
            const {
              id
            } = request.params;
            const {
              data: barbearia,
              error
            } = await supabase.from(stryMutAct_9fa48("1217") ? "" : (stryCov_9fa48("1217"), 'barbearias')).select(stryMutAct_9fa48("1218") ? "" : (stryCov_9fa48("1218"), '*')).eq(stryMutAct_9fa48("1219") ? "" : (stryCov_9fa48("1219"), 'id'), id).eq(stryMutAct_9fa48("1220") ? "" : (stryCov_9fa48("1220"), 'ativo'), stryMutAct_9fa48("1221") ? false : (stryCov_9fa48("1221"), true)).single();
            if (stryMutAct_9fa48("1224") ? error && !barbearia : stryMutAct_9fa48("1223") ? false : stryMutAct_9fa48("1222") ? true : (stryCov_9fa48("1222", "1223", "1224"), error || (stryMutAct_9fa48("1225") ? barbearia : (stryCov_9fa48("1225"), !barbearia)))) {
              if (stryMutAct_9fa48("1226")) {
                {}
              } else {
                stryCov_9fa48("1226");
                return reply.status(404).send(stryMutAct_9fa48("1227") ? {} : (stryCov_9fa48("1227"), {
                  success: stryMutAct_9fa48("1228") ? true : (stryCov_9fa48("1228"), false),
                  error: stryMutAct_9fa48("1229") ? "" : (stryCov_9fa48("1229"), 'Barbearia não encontrada')
                }));
              }
            }
            return reply.send(stryMutAct_9fa48("1230") ? {} : (stryCov_9fa48("1230"), {
              success: stryMutAct_9fa48("1231") ? false : (stryCov_9fa48("1231"), true),
              data: barbearia
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("1232")) {
            {}
          } else {
            stryCov_9fa48("1232");
            return reply.status(400).send(stryMutAct_9fa48("1233") ? {} : (stryCov_9fa48("1233"), {
              success: stryMutAct_9fa48("1234") ? true : (stryCov_9fa48("1234"), false),
              error: error.message
            }));
          }
        }
      }
    });

    /**
     * @swagger
     * /api/barbearias:
     *   post:
     *     tags: [barbearias]
     *     summary: Criar barbearia (apenas admin)
     *     security:
     *       - Bearer: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Barbearia'
     *     responses:
     *       201:
     *         description: Barbearia criada
     *       400:
     *         description: Dados inválidos
     *       403:
     *         description: Acesso negado
     */
    fastify.post(stryMutAct_9fa48("1235") ? "" : (stryCov_9fa48("1235"), '/'), stryMutAct_9fa48("1236") ? {} : (stryCov_9fa48("1236"), {
      preValidation: stryMutAct_9fa48("1237") ? [] : (stryCov_9fa48("1237"), [fastify.authenticate, checkAdminRole]),
      schema: barbeariaSchema
    }), async (request, reply) => {
      if (stryMutAct_9fa48("1238")) {
        {}
      } else {
        stryCov_9fa48("1238");
        try {
          if (stryMutAct_9fa48("1239")) {
            {}
          } else {
            stryCov_9fa48("1239");
            const barbeariaData = request.body;
            const {
              data: barbearia,
              error
            } = await supabase.from(stryMutAct_9fa48("1240") ? "" : (stryCov_9fa48("1240"), 'barbearias')).insert(barbeariaData).select().single();
            if (stryMutAct_9fa48("1242") ? false : stryMutAct_9fa48("1241") ? true : (stryCov_9fa48("1241", "1242"), error)) {
              if (stryMutAct_9fa48("1243")) {
                {}
              } else {
                stryCov_9fa48("1243");
                throw new Error((stryMutAct_9fa48("1244") ? "" : (stryCov_9fa48("1244"), 'Erro ao criar barbearia: ')) + error.message);
              }
            }
            return reply.status(201).send(stryMutAct_9fa48("1245") ? {} : (stryCov_9fa48("1245"), {
              success: stryMutAct_9fa48("1246") ? false : (stryCov_9fa48("1246"), true),
              message: stryMutAct_9fa48("1247") ? "" : (stryCov_9fa48("1247"), 'Barbearia criada com sucesso'),
              data: barbearia
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("1248")) {
            {}
          } else {
            stryCov_9fa48("1248");
            return reply.status(400).send(stryMutAct_9fa48("1249") ? {} : (stryCov_9fa48("1249"), {
              success: stryMutAct_9fa48("1250") ? true : (stryCov_9fa48("1250"), false),
              error: error.message
            }));
          }
        }
      }
    });

    /**
     * @swagger
     * /api/barbearias/{id}:
     *   put:
     *     tags: [barbearias]
     *     summary: Atualizar barbearia (apenas admin)
     *     security:
     *       - Bearer: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/BarbeariaUpdate'
     *     responses:
     *       200:
     *         description: Barbearia atualizada
     *       400:
     *         description: Dados inválidos
     *       403:
     *         description: Acesso negado
     */
    fastify.put(stryMutAct_9fa48("1251") ? "" : (stryCov_9fa48("1251"), '/:id'), stryMutAct_9fa48("1252") ? {} : (stryCov_9fa48("1252"), {
      preValidation: stryMutAct_9fa48("1253") ? [] : (stryCov_9fa48("1253"), [fastify.authenticate, checkAdminRole]),
      schema: barbeariaUpdateSchema
    }), async (request, reply) => {
      if (stryMutAct_9fa48("1254")) {
        {}
      } else {
        stryCov_9fa48("1254");
        try {
          if (stryMutAct_9fa48("1255")) {
            {}
          } else {
            stryCov_9fa48("1255");
            const {
              id
            } = request.params;
            const updateData = request.body;
            const {
              data: barbearia,
              error
            } = await supabase.from(stryMutAct_9fa48("1256") ? "" : (stryCov_9fa48("1256"), 'barbearias')).update(stryMutAct_9fa48("1257") ? {} : (stryCov_9fa48("1257"), {
              ...updateData,
              updated_at: new Date().toISOString()
            })).eq(stryMutAct_9fa48("1258") ? "" : (stryCov_9fa48("1258"), 'id'), id).select().single();
            if (stryMutAct_9fa48("1260") ? false : stryMutAct_9fa48("1259") ? true : (stryCov_9fa48("1259", "1260"), error)) {
              if (stryMutAct_9fa48("1261")) {
                {}
              } else {
                stryCov_9fa48("1261");
                throw new Error(stryMutAct_9fa48("1262") ? "" : (stryCov_9fa48("1262"), 'Erro ao atualizar barbearia'));
              }
            }
            return reply.send(stryMutAct_9fa48("1263") ? {} : (stryCov_9fa48("1263"), {
              success: stryMutAct_9fa48("1264") ? false : (stryCov_9fa48("1264"), true),
              message: stryMutAct_9fa48("1265") ? "" : (stryCov_9fa48("1265"), 'Barbearia atualizada com sucesso'),
              data: barbearia
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("1266")) {
            {}
          } else {
            stryCov_9fa48("1266");
            return reply.status(400).send(stryMutAct_9fa48("1267") ? {} : (stryCov_9fa48("1267"), {
              success: stryMutAct_9fa48("1268") ? true : (stryCov_9fa48("1268"), false),
              error: error.message
            }));
          }
        }
      }
    });

    /**
     * @swagger
     * /api/barbearias/{id}/fila/proximo:
     *   post:
     *     tags: [barbearias]
     *     summary: Chamar próximo cliente da fila
     *     security:
     *       - Bearer: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Próximo cliente chamado
     *       403:
     *         description: Barbeiro não está ativo na barbearia
     *       404:
     *         description: Não há clientes na fila
     */
    fastify.post(stryMutAct_9fa48("1269") ? "" : (stryCov_9fa48("1269"), '/:id/fila/proximo'), stryMutAct_9fa48("1270") ? {} : (stryCov_9fa48("1270"), {
      preValidation: stryMutAct_9fa48("1271") ? [] : (stryCov_9fa48("1271"), [fastify.authenticate])
    }), async (request, reply) => {
      if (stryMutAct_9fa48("1272")) {
        {}
      } else {
        stryCov_9fa48("1272");
        try {
          if (stryMutAct_9fa48("1273")) {
            {}
          } else {
            stryCov_9fa48("1273");
            const {
              id: barbearia_id
            } = request.params;
            const userId = request.user.id;

            // Verificar se o usuário é um barbeiro ativo na barbearia
            const {
              data: barbeiroAtivo,
              error: barbeiroError
            } = await supabase.from(stryMutAct_9fa48("1274") ? "" : (stryCov_9fa48("1274"), 'barbeiros_barbearias')).select(stryMutAct_9fa48("1275") ? "" : (stryCov_9fa48("1275"), 'id, ativo')).eq(stryMutAct_9fa48("1276") ? "" : (stryCov_9fa48("1276"), 'user_id'), userId).eq(stryMutAct_9fa48("1277") ? "" : (stryCov_9fa48("1277"), 'barbearia_id'), barbearia_id).eq(stryMutAct_9fa48("1278") ? "" : (stryCov_9fa48("1278"), 'ativo'), stryMutAct_9fa48("1279") ? false : (stryCov_9fa48("1279"), true)).single();
            if (stryMutAct_9fa48("1282") ? barbeiroError && !barbeiroAtivo : stryMutAct_9fa48("1281") ? false : stryMutAct_9fa48("1280") ? true : (stryCov_9fa48("1280", "1281", "1282"), barbeiroError || (stryMutAct_9fa48("1283") ? barbeiroAtivo : (stryCov_9fa48("1283"), !barbeiroAtivo)))) {
              if (stryMutAct_9fa48("1284")) {
                {}
              } else {
                stryCov_9fa48("1284");
                return reply.status(403).send(stryMutAct_9fa48("1285") ? {} : (stryCov_9fa48("1285"), {
                  success: stryMutAct_9fa48("1286") ? true : (stryCov_9fa48("1286"), false),
                  error: stryMutAct_9fa48("1287") ? "" : (stryCov_9fa48("1287"), 'Você não está ativo nesta barbearia')
                }));
              }
            }

            // Buscar próximo cliente na fila
            // Prioridade: 1) Clientes específicos do barbeiro, 2) Fila geral
            const {
              data: proximoCliente,
              error: clienteError
            } = await supabase.from(stryMutAct_9fa48("1288") ? "" : (stryCov_9fa48("1288"), 'fila')).select(stryMutAct_9fa48("1289") ? "" : (stryCov_9fa48("1289"), '*')).eq(stryMutAct_9fa48("1290") ? "" : (stryCov_9fa48("1290"), 'barbearia_id'), barbearia_id).in(stryMutAct_9fa48("1291") ? "" : (stryCov_9fa48("1291"), 'status'), stryMutAct_9fa48("1292") ? [] : (stryCov_9fa48("1292"), [stryMutAct_9fa48("1293") ? "" : (stryCov_9fa48("1293"), 'aguardando'), stryMutAct_9fa48("1294") ? "" : (stryCov_9fa48("1294"), 'proximo')])).or(stryMutAct_9fa48("1295") ? `` : (stryCov_9fa48("1295"), `barbeiro_id.eq.${userId},barbeiro_id.is.null`)).order(stryMutAct_9fa48("1296") ? "" : (stryCov_9fa48("1296"), 'barbeiro_id'), stryMutAct_9fa48("1297") ? {} : (stryCov_9fa48("1297"), {
              ascending: stryMutAct_9fa48("1298") ? true : (stryCov_9fa48("1298"), false)
            })) // Clientes específicos primeiro
            .order(stryMutAct_9fa48("1299") ? "" : (stryCov_9fa48("1299"), 'posicao'), stryMutAct_9fa48("1300") ? {} : (stryCov_9fa48("1300"), {
              ascending: stryMutAct_9fa48("1301") ? false : (stryCov_9fa48("1301"), true)
            })).limit(1).single();
            if (stryMutAct_9fa48("1304") ? clienteError && !proximoCliente : stryMutAct_9fa48("1303") ? false : stryMutAct_9fa48("1302") ? true : (stryCov_9fa48("1302", "1303", "1304"), clienteError || (stryMutAct_9fa48("1305") ? proximoCliente : (stryCov_9fa48("1305"), !proximoCliente)))) {
              if (stryMutAct_9fa48("1306")) {
                {}
              } else {
                stryCov_9fa48("1306");
                return reply.status(404).send(stryMutAct_9fa48("1307") ? {} : (stryCov_9fa48("1307"), {
                  success: stryMutAct_9fa48("1308") ? true : (stryCov_9fa48("1308"), false),
                  error: stryMutAct_9fa48("1309") ? "" : (stryCov_9fa48("1309"), 'Não há clientes aguardando na fila')
                }));
              }
            }

            // Atualizar status do cliente para 'proximo'
            const {
              data: clienteAtualizado,
              error: updateError
            } = await supabase.from(stryMutAct_9fa48("1310") ? "" : (stryCov_9fa48("1310"), 'fila')).update(stryMutAct_9fa48("1311") ? {} : (stryCov_9fa48("1311"), {
              status: stryMutAct_9fa48("1312") ? "" : (stryCov_9fa48("1312"), 'proximo'),
              barbeiro_id: userId,
              data_atendimento: new Date().toISOString()
            })).eq(stryMutAct_9fa48("1313") ? "" : (stryCov_9fa48("1313"), 'id'), proximoCliente.id).select().single();
            if (stryMutAct_9fa48("1315") ? false : stryMutAct_9fa48("1314") ? true : (stryCov_9fa48("1314", "1315"), updateError)) {
              if (stryMutAct_9fa48("1316")) {
                {}
              } else {
                stryCov_9fa48("1316");
                console.error(stryMutAct_9fa48("1317") ? "" : (stryCov_9fa48("1317"), 'Erro ao atualizar status do cliente:'), updateError);
                return reply.status(500).send(stryMutAct_9fa48("1318") ? {} : (stryCov_9fa48("1318"), {
                  success: stryMutAct_9fa48("1319") ? true : (stryCov_9fa48("1319"), false),
                  error: stryMutAct_9fa48("1320") ? "" : (stryCov_9fa48("1320"), 'Erro interno do servidor')
                }));
              }
            }
            return reply.status(200).send(stryMutAct_9fa48("1321") ? {} : (stryCov_9fa48("1321"), {
              success: stryMutAct_9fa48("1322") ? false : (stryCov_9fa48("1322"), true),
              message: stryMutAct_9fa48("1323") ? "" : (stryCov_9fa48("1323"), 'Próximo cliente chamado'),
              data: clienteAtualizado
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("1324")) {
            {}
          } else {
            stryCov_9fa48("1324");
            console.error(stryMutAct_9fa48("1325") ? "" : (stryCov_9fa48("1325"), 'Erro ao chamar próximo cliente:'), error);
            return reply.status(500).send(stryMutAct_9fa48("1326") ? {} : (stryCov_9fa48("1326"), {
              success: stryMutAct_9fa48("1327") ? true : (stryCov_9fa48("1327"), false),
              error: stryMutAct_9fa48("1328") ? "" : (stryCov_9fa48("1328"), 'Erro interno do servidor')
            }));
          }
        }
      }
    });

    /**
     * @swagger
     * /api/barbearias/{id}:
     *   delete:
     *     tags: [barbearias]
     *     summary: Remover barbearia (apenas admin)
     *     security:
     *       - Bearer: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Barbearia removida
     *       403:
     *         description: Acesso negado
     */
    fastify.delete(stryMutAct_9fa48("1329") ? "" : (stryCov_9fa48("1329"), '/:id'), stryMutAct_9fa48("1330") ? {} : (stryCov_9fa48("1330"), {
      preValidation: stryMutAct_9fa48("1331") ? [] : (stryCov_9fa48("1331"), [fastify.authenticate, checkAdminRole])
    }), async (request, reply) => {
      if (stryMutAct_9fa48("1332")) {
        {}
      } else {
        stryCov_9fa48("1332");
        try {
          if (stryMutAct_9fa48("1333")) {
            {}
          } else {
            stryCov_9fa48("1333");
            const {
              id
            } = request.params;
            const {
              error
            } = await supabase.from(stryMutAct_9fa48("1334") ? "" : (stryCov_9fa48("1334"), 'barbearias')).update(stryMutAct_9fa48("1335") ? {} : (stryCov_9fa48("1335"), {
              ativo: stryMutAct_9fa48("1336") ? true : (stryCov_9fa48("1336"), false)
            })).eq(stryMutAct_9fa48("1337") ? "" : (stryCov_9fa48("1337"), 'id'), id);
            if (stryMutAct_9fa48("1339") ? false : stryMutAct_9fa48("1338") ? true : (stryCov_9fa48("1338", "1339"), error)) {
              if (stryMutAct_9fa48("1340")) {
                {}
              } else {
                stryCov_9fa48("1340");
                throw new Error(stryMutAct_9fa48("1341") ? "" : (stryCov_9fa48("1341"), 'Erro ao remover barbearia'));
              }
            }
            return reply.send(stryMutAct_9fa48("1342") ? {} : (stryCov_9fa48("1342"), {
              success: stryMutAct_9fa48("1343") ? false : (stryCov_9fa48("1343"), true),
              message: stryMutAct_9fa48("1344") ? "" : (stryCov_9fa48("1344"), 'Barbearia removida com sucesso')
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("1345")) {
            {}
          } else {
            stryCov_9fa48("1345");
            return reply.status(400).send(stryMutAct_9fa48("1346") ? {} : (stryCov_9fa48("1346"), {
              success: stryMutAct_9fa48("1347") ? true : (stryCov_9fa48("1347"), false),
              error: error.message
            }));
          }
        }
      }
    });
  }
}
module.exports = barbeariaRoutes;