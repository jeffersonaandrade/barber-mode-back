const fp = require('fastify-plugin');
const { supabase, supabaseAdmin } = require('../config/database');

async function supabasePlugin(fastify, options) {
  // Decorar o fastify com as instâncias do Supabase
  fastify.decorate('supabase', supabase);
  fastify.decorate('supabaseAdmin', supabaseAdmin);
}

module.exports = fp(supabasePlugin); 