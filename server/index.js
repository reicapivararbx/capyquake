import { createServer } from 'http';
import { readFile, stat } from 'fs/promises';
import { extname, join, normalize, relative, resolve } from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer } from 'ws';
import { networkInterfaces } from 'os';
import { handleApi, ensureAdminSeed, ensureEasterEggSeed, attachSession, hasPermission } from './api.js';
import {
  getUserById, findByUsername, banUser, suspendUser, unbanUser,
  giveCoins, giveXp, setLevel, heal, logAdminAction, revokeTargetSessions,
  setCoins, giveTokens, setTokens, setXp, maxStats, addItemToInventory,
  removeItemFromInventory, resetPlayer, changeRole,
  getCapybara, updateCapybara, getInventory, getProfileRaw,
  searchUsers, listLogs, dashboardStats, countUsers, levelUp
} from './services.js';

ensureAdminSeed();
ensureEasterEggSeed();

const startTime = Date.now();
const ADMIN_DIR = resolve(fileURLToPath(new URL('.', import.meta.url)), 'admin');
const ADMIN_FILES = new Set(['login.html', 'index.html', 'app.js', 'admin.css']);

// Sub-subdominio do painel administrativo (ex.: admin.m.zanona.com.br).
// Em dev local usa-se admin.localhost:<porta>.
function isAdminHost(req) {
  const host = String(req.headers.host || '').toLowerCase().split(':')[0];
  return host === 'admin.localhost' || host.endsWith('.m.zanona.com.br') && host.startsWith('admin.');
}

const HOST = '0.0.0.0';
const PORT = Number.parseInt(process.env.PORT || '8080', 10);
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const DIST_DIR = resolve(__dirname, '../dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.m4a': 'audio/mp4',
  '.wasm': 'application/wasm',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.obj': 'text/plain; charset=utf-8',
  '.mtl': 'text/plain; charset=utf-8'
};

const rooms = new Map();
let roomIdCounter = 0;

// ---------- chat global (menus, fora do gameplay) ----------

const GLOBAL_CHAT_HISTORY_LIMIT = 40;
const globalChatHistory = [];
const globalChatClients = new Map();

function sanitizeChatText(value, maxLen) {
  return String(value ?? '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .trim()
    .slice(0, maxLen);
}

function broadcastGlobalChat(payload) {
  const data = JSON.stringify({ type: 'globalChat', data: payload });
  for (const [ws] of globalChatClients) {
    if (ws.readyState === 1) ws.send(data);
  }
}

function handleGlobalChat(ws, msg) {
  const client = globalChatClients.get(ws);
  if (!client) return;
  const now = Date.now();
  client.times = (client.times || []).filter(t => now - t < 15000);
  if (client.lastMsgAt && now - client.lastMsgAt < 1000) return;
  if (client.times.length >= 6) return;
  const message = sanitizeChatText(msg.message, 150);
  if (!message) return;
  client.lastMsgAt = now;
  client.times.push(now);
  const payload = {
    name: client.name || 'Anon',
    role: client.role || null,
    message,
    ts: now
  };
  globalChatHistory.push(payload);
  if (globalChatHistory.length > GLOBAL_CHAT_HISTORY_LIMIT) globalChatHistory.shift();
  broadcastGlobalChat(payload);
}

const CHAT_COMMANDS = [
  { name: 'kick', params: ['user'], perm: 'users.suspend', destructive: true, desc: 'Desconecta o jogador agora' },
  { name: 'ban', params: ['user'], perm: 'users.ban', destructive: true, desc: 'Bane permanentemente' },
  { name: 'tempban', params: ['user', 'days'], perm: 'users.suspend', destructive: true, desc: 'Ban temporário em dias' },
  { name: 'unban', params: ['user'], perm: 'users.suspend', destructive: false, desc: 'Reativa a conta' },
  { name: 'givecoins', params: ['user', 'amount'], perm: 'economy.give', destructive: false, desc: 'Dá moedas' },
  { name: 'removecoins', params: ['user', 'amount'], perm: 'economy.remove', destructive: true, desc: 'Remove moedas' },
  { name: 'setcoins', params: ['user', 'amount'], perm: 'economy.set', destructive: false, desc: 'Define o saldo de moedas' },
  { name: 'givetokens', params: ['user', 'amount'], perm: 'economy.give', destructive: false, desc: 'Dá tokens' },
  { name: 'removetokens', params: ['user', 'amount'], perm: 'economy.remove', destructive: true, desc: 'Remove tokens' },
  { name: 'settokens', params: ['user', 'amount'], perm: 'economy.set', destructive: false, desc: 'Define o saldo de tokens' },
  { name: 'givexp', params: ['user', 'amount'], perm: 'game.giveXp', destructive: false, desc: 'Dá XP' },
  { name: 'setxp', params: ['user', 'amount'], perm: 'game.giveXp', destructive: false, desc: 'Define o XP total' },
  { name: 'setlevel', params: ['user', 'level'], perm: 'game.setLevel', destructive: false, desc: 'Define o nível' },
  { name: 'levelup', params: ['user'], perm: 'game.levelUp', destructive: false, desc: 'Sobe 1 nível' },
  { name: 'heal', params: ['user'], perm: 'game.heal', destructive: false, desc: 'Cura a capivara' },
  { name: 'maxstats', params: ['user'], perm: 'game.maxStats', destructive: false, desc: 'Stats máximos da capivara' },
  { name: 'giveitem', params: ['user', 'item'], perm: 'inventory.give', destructive: false, desc: 'Dá item (ex: ak47 x5)' },
  { name: 'removeitem', params: ['user', 'item'], perm: 'inventory.remove', destructive: true, desc: 'Remove item' },
  { name: 'role', params: ['user', 'role'], perm: 'roles.manage', destructive: true, desc: 'Altera cargo do jogador' },
  { name: 'reset', params: ['user'], perm: 'game.reset', destructive: true, desc: 'Reseta todo progresso do jogador' },
  // --- Economy Extended ---
  { name: 'givert', params: ['user', 'amount'], perm: 'economy.give', destructive: false, desc: 'Dá tokens de renascimento (x1000)' },
  { name: 'giveallcoins', params: ['amount'], perm: 'economy.give', destructive: false, desc: 'Dá moedas a todos online' },
  { name: 'givealltokens', params: ['amount'], perm: 'economy.give', destructive: false, desc: 'Dá tokens a todos online' },
  { name: 'giveallxp', params: ['amount'], perm: 'game.giveXp', destructive: false, desc: 'Dá XP a todos online' },
  { name: 'doublecoins', params: ['user'], perm: 'economy.set', destructive: false, desc: 'Dobra as moedas' },
  { name: 'halfcoins', params: ['user'], perm: 'economy.remove', destructive: true, desc: 'Metade das moedas' },
  { name: 'doubletokens', params: ['user'], perm: 'economy.set', destructive: false, desc: 'Dobra os tokens' },
  { name: 'halftokens', params: ['user'], perm: 'economy.remove', destructive: true, desc: 'Metade dos tokens' },
  { name: 'maxcoins', params: ['user'], perm: 'economy.set', destructive: false, desc: 'Moedas máximas (999999)' },
  { name: 'maxtokens', params: ['user'], perm: 'economy.set', destructive: false, desc: 'Tokens máximos (999)' },
  { name: 'zerocoins', params: ['user'], perm: 'economy.remove', destructive: true, desc: 'Zera moedas' },
  { name: 'zerotokens', params: ['user'], perm: 'economy.remove', destructive: true, desc: 'Zera tokens' },
  { name: 'rich', params: ['user', 'amount'], perm: 'economy.give', destructive: false, desc: 'Dá moedas em grande quantidade (padrão 50000)' },
  { name: 'poor', params: ['user'], perm: 'economy.remove', destructive: true, desc: 'Zera toda moeda' },
  { name: 'whale', params: ['user'], perm: 'economy.give', destructive: false, desc: 'Dá 50000 moedas + 500 tokens' },
  // --- Player Stats / Capybara ---
  { name: 'sethp', params: ['user', 'amount'], perm: 'game.heal', destructive: false, desc: 'Define HP da capivara' },
  { name: 'setenergy', params: ['user', 'amount'], perm: 'game.heal', destructive: false, desc: 'Define energia da capivara' },
  { name: 'sethunger', params: ['user', 'amount'], perm: 'game.heal', destructive: false, desc: 'Define fome da capivara' },
  { name: 'sethappiness', params: ['user', 'amount'], perm: 'game.heal', destructive: false, desc: 'Define felicidade da capivara' },
  { name: 'feed', params: ['user'], perm: 'game.heal', destructive: false, desc: 'Alimenta a capivara (fome 100)' },
  { name: 'pet', params: ['user'], perm: 'game.heal', destructive: false, desc: 'Acaricia a capivara (felicidade 100)' },
  { name: 'rest', params: ['user'], perm: 'game.heal', destructive: false, desc: 'Descansa a capivara (energia 100)' },
  { name: 'name', params: ['user', 'newname'], perm: 'game.heal', destructive: false, desc: 'Renomeia a capivara' },
  { name: 'maxall', params: ['user'], perm: 'game.heal', destructive: false, desc: 'Todas stats da capivara a 100' },
  { name: 'minall', params: ['user'], perm: 'game.heal', destructive: false, desc: 'Todas stats da capivara a 0' },
  { name: 'healall', params: ['user'], perm: 'game.heal', destructive: false, desc: 'Cura, alimenta, acaricia e descansa' },
  { name: 'starve', params: ['user'], perm: 'game.heal', destructive: true, desc: 'Zera fome, felicidade e energia' },
  // --- Inventory Extended ---
  { name: 'giveallitems', params: ['user'], perm: 'inventory.give', destructive: false, desc: 'Dá itens comuns (IDs 1-10)' },
  { name: 'clearinv', params: ['user'], perm: 'inventory.remove', destructive: true, desc: 'Limpa inventário' },
  { name: 'giveammo', params: ['user', 'weaponId', 'amount'], perm: 'inventory.give', destructive: false, desc: 'Dá munição para arma' },
  { name: 'givearmor', params: ['user', 'type'], perm: 'inventory.give', destructive: false, desc: 'Dá armadura' },
  { name: 'giveskin', params: ['user', 'id'], perm: 'inventory.give', destructive: false, desc: 'Dá skin' },
  { name: 'giveboost', params: ['user', 'type'], perm: 'inventory.give', destructive: false, desc: 'Dá boost' },
  { name: 'inv', params: ['user'], perm: 'admin.view', destructive: false, desc: 'Mostra inventário do jogador' },
  { name: 'weapon', params: ['user', 'id'], perm: 'inventory.give', destructive: false, desc: 'Dá arma por ID' },
  { name: 'consumable', params: ['user', 'id', 'amount'], perm: 'inventory.give', destructive: false, desc: 'Dá consumível por ID' },
  { name: 'removeallitems', params: ['user'], perm: 'inventory.remove', destructive: true, desc: 'Remove todos os itens' },
  // --- Player Management Extended ---
  { name: 'warn', params: ['user', 'message'], perm: 'users.suspend', destructive: false, desc: 'Avisa o jogador' },
  { name: 'mute', params: ['user', 'time'], perm: 'users.suspend', destructive: false, desc: 'Silencia jogador por X min' },
  { name: 'unmute', params: ['user'], perm: 'users.suspend', destructive: false, desc: 'Remove silêncio' },
  { name: 'freeze', params: ['user'], perm: 'users.suspend', destructive: false, desc: 'Congela jogador' },
  { name: 'unfreeze', params: ['user'], perm: 'users.suspend', destructive: false, desc: 'Descongela jogador' },
  { name: 'timeout', params: ['user', 'time'], perm: 'users.suspend', destructive: true, desc: 'Timeout por X minutos' },
  { name: 'jail', params: ['user'], perm: 'users.suspend', destructive: false, desc: 'Prende jogador' },
  { name: 'unjail', params: ['user'], perm: 'users.suspend', destructive: false, desc: 'Solta jogador' },
  { name: 'invisible', params: ['user'], perm: 'admin.view', destructive: false, desc: 'Alterna invisibilidade' },
  { name: 'god', params: ['user'], perm: 'admin.view', destructive: false, desc: 'Alterna godmode' },
  { name: 'speed', params: ['user', 'mult'], perm: 'admin.view', destructive: false, desc: 'Altera velocidade' },
  { name: 'size', params: ['user', 'mult'], perm: 'admin.view', destructive: false, desc: 'Altera tamanho' },
  // --- Server Admin ---
  { name: 'online', params: [], perm: 'admin.view', destructive: false, desc: 'Jogadores online' },
  { name: 'serverstats', params: [], perm: 'admin.view', destructive: false, desc: 'Estatísticas do servidor' },
  { name: 'announce', params: ['message'], perm: 'admin.view', destructive: false, desc: 'Anuncia para todos' },
  { name: 'motd', params: ['message'], perm: 'admin.view', destructive: false, desc: 'Define mensagem do dia' },
  { name: 'playercount', params: [], perm: 'admin.view', destructive: false, desc: 'Quantidade de jogadores' },
  { name: 'totalusers', params: [], perm: 'admin.view', destructive: false, desc: 'Total de usuários' },
  { name: 'totalbanned', params: [], perm: 'admin.view', destructive: false, desc: 'Total de banidos' },
  { name: 'totaladmins', params: [], perm: 'admin.view', destructive: false, desc: 'Total de admins' },
  { name: 'uptime', params: [], perm: 'admin.view', destructive: false, desc: 'Tempo ligado do servidor' },
  { name: 'version', params: [], perm: 'admin.view', destructive: false, desc: 'Versão do servidor' },
  // --- Info/Utility ---
  { name: 'whois', params: ['user'], perm: 'admin.view', destructive: false, desc: 'Informações do usuário' },
  { name: 'profile', params: ['user'], perm: 'admin.view', destructive: false, desc: 'Perfil completo' },
  { name: 'capybara', params: ['user'], perm: 'admin.view', destructive: false, desc: 'Stats da capivara' },
  { name: 'id', params: ['user'], perm: 'admin.view', destructive: false, desc: 'ID do usuário' },
  { name: 'search', params: ['query'], perm: 'admin.view', destructive: false, desc: 'Busca usuários' },
  { name: 'roles', params: [], perm: 'admin.view', destructive: false, desc: 'Lista cargos disponíveis' },
  { name: 'myrole', params: [], perm: 'admin.view', destructive: false, desc: 'Seu cargo atual' },
  { name: 'help', params: [], perm: 'admin.view', destructive: false, desc: 'Lista todos comandos' },
  { name: 'cmdhelp', params: ['command'], perm: 'admin.view', destructive: false, desc: 'Ajuda de um comando' },
  { name: 'logs', params: ['user'], perm: 'admin.logs', destructive: false, desc: 'Logs de um usuário' },
  // --- Fun/Cosmetic ---
  { name: 'shiny', params: ['user'], perm: 'game.heal', destructive: false, desc: 'Capivara brilhante' },
  { name: 'mega', params: ['user'], perm: 'game.heal', destructive: false, desc: 'Mega evolui capivara' },
  { name: 'baby', params: ['user'], perm: 'game.reset', destructive: true, desc: 'Resetar para filhote' },
  { name: 'elder', params: ['user'], perm: 'game.heal', destructive: false, desc: 'Capivara idosa (max tudo)' },
  { name: 'clone', params: ['user', 'id'], perm: 'economy.set', destructive: false, desc: 'Copia stats para outro' },
  { name: 'swap', params: ['user', 'id'], perm: 'economy.set', destructive: false, desc: 'Troca moedas entre dois' },
  { name: 'steal', params: ['user', 'id', 'amount'], perm: 'economy.remove', destructive: true, desc: 'Tira moedas e dá a outro' },
  { name: 'tax', params: ['user', 'percentage'], perm: 'economy.remove', destructive: true, desc: 'Cobra imposto X%' },
  { name: 'bonus', params: ['user', 'percentage'], perm: 'economy.give', destructive: false, desc: 'Bônus de X%' },
  { name: 'lottery', params: ['amount'], perm: 'economy.give', destructive: false, desc: 'Dá valor aleatório a todos' },
  // --- Quick Kits ---
  { name: 'starter', params: ['user'], perm: 'economy.give', destructive: false, desc: 'Kit iniciante' },
  { name: 'veteran', params: ['user'], perm: 'economy.give', destructive: false, desc: 'Kit veterano' },
  { name: 'pro', params: ['user'], perm: 'economy.give', destructive: false, desc: 'Kit profissional' },
  { name: 'legend', params: ['user'], perm: 'economy.give', destructive: false, desc: 'Kit lenda' },
  { name: 'vip', params: ['user'], perm: 'economy.give', destructive: false, desc: 'Kit VIP' },
  { name: 'wipeday', params: ['user'], perm: 'economy.remove', destructive: true, desc: 'Limpa moedas, dá 10 tokens' },
  { name: 'birthday', params: ['user'], perm: 'economy.give', destructive: false, desc: 'Kit aniversário' },
  { name: 'christmas', params: ['user'], perm: 'economy.give', destructive: false, desc: 'Kit natal' },
  { name: 'newyear', params: ['user'], perm: 'economy.give', destructive: false, desc: 'Kit ano novo' },
  { name: 'anniversary', params: ['user'], perm: 'economy.give', destructive: false, desc: 'Kit aniversário do jogo' },
  // --- Moderation Extended ---
  { name: 'ipban', params: ['user'], perm: 'users.ban', destructive: true, desc: 'Ban por IP' },
  { name: 'ipunban', params: ['user'], perm: 'users.suspend', destructive: false, desc: 'Desban por IP' },
  { name: 'blacklist', params: ['user'], perm: 'users.ban', destructive: true, desc: 'Adiciona à lista negra' },
  { name: 'whitelist', params: ['user'], perm: 'users.suspend', destructive: false, desc: 'Remove da lista negra' },
  { name: 'chatban', params: ['user'], perm: 'users.suspend', destructive: true, desc: 'Ban do chat' },
  { name: 'chatunban', params: ['user'], perm: 'users.suspend', destructive: false, desc: 'Desban do chat' },
  { name: 'kickall', params: [], perm: 'users.suspend', destructive: true, desc: 'Kicka todos não-admin' },
  { name: 'banall', params: [], perm: 'users.ban', destructive: true, desc: 'Bane todos não-admin' },
  { name: 'pardon', params: ['user'], perm: 'users.suspend', destructive: false, desc: 'Perdoa e desban' },
  { name: 'history', params: ['user'], perm: 'admin.logs', destructive: false, desc: 'Histórico de ações' },
  // --- Game Tools ---
  { name: 'giveall', params: ['amount'], perm: 'economy.give', destructive: false, desc: 'Dá moedas e tokens a todos' }
];

function commandsForUser(user) {
  if (!user) return [];
  return CHAT_COMMANDS.filter(c => hasPermission(user, c.perm))
    .map(({ name, params, desc, destructive }) => ({ name, params, desc, destructive }));
}

function resolveTargetUser(raw) {
  const value = String(raw ?? '').trim();
  if (!value) return null;
  if (/^\d+$/.test(value)) return getUserById(Number(value));
  const byName = findByUsername(value.replace(/^@/, ''));
  return byName ? getUserById(byName.id) : null;
}

async function handleChatCommand(ws, msg) {
  const user = ws.chatUser;
  const reply = (ok, message) => {
    try { ws.send(JSON.stringify({ type: 'commandResult', data: { ok, message } })); } catch {}
  };
  if (!user) return reply(false, 'Faça login para usar comandos.');
  if (!hasPermission(user, 'admin.view')) return reply(false, 'Sem permissão.');

  const name = String(msg.name || '').replace(/^\//, '').toLowerCase().trim();
  const command = CHAT_COMMANDS.find(c => c.name === name);
  if (!command) return reply(false, `Comando desconhecido: /${name}`);
  if (!hasPermission(user, command.perm)) {
    logAdminAction(user.id, null, 'COMMAND_DENIED', { command: name }, false);
    return reply(false, `Você não tem permissão para /${name}.`);
  }

  const args = Array.isArray(msg.args) ? msg.args.map(String) : [];
  const needsTarget = command.params[0] === 'user';
  const target = needsTarget ? resolveTargetUser(args[0]) : null;
  if (needsTarget) {
    if (!target) return reply(false, `Jogador não encontrado: ${args[0] || '(vazio)'}`);
    if (target.id !== user.id && ROLE_RANK_CHECK(target.role, user.role)) {
      return reply(false, 'Alvo com cargo igual ou superior ao seu.');
    }
  }

  const actor = getUserById(user.id);
  const reasonBase = args.slice(command.params.length).join(' ').slice(0, 120) || `/${name} por ${actor.username}`;
  const numArg = (idx, min, max) => {
    const n = Math.trunc(Number(args[idx]));
    if (!Number.isSafeInteger(n) || n < min || n > max) return null;
    return n;
  };

  try {
    switch (command.name) {
      case 'kick':
        revokeTargetSessions(target.id);
        logAdminAction(actor.id, target.id, 'KICK', { reason: reasonBase, via: 'chat-command' }, true);
        return reply(true, `${target.username} foi kickado.`);
      case 'ban':
        banUser(actor, target.id, reasonBase);
        return reply(true, `${target.username} foi banido.`);
      case 'tempban': {
        const days = numArg(1, 1, 365);
        if (!days) return reply(false, 'Dias inválido (1-365).');
        suspendUser(actor, target.id, reasonBase, days * 86400000);
        return reply(true, `${target.username} suspenso por ${days} dias.`);
      }
      case 'unban':
        unbanUser(actor, target.id, reasonBase);
        return reply(true, `${target.username} reativado.`);
      case 'givecoins': {
        const amount = numArg(1, 1, 1e12);
        if (!amount) return reply(false, 'Quantidade inválida.');
        giveCoins(actor, target.id, amount, reasonBase);
        return reply(true, `+${amount} moedas para ${target.username}.`);
      }
      case 'removecoins': {
        const amount = numArg(1, 1, 1e12);
        if (!amount) return reply(false, 'Quantidade inválida.');
        giveCoins(actor, target.id, -amount, reasonBase);
        return reply(true, `-${amount} moedas de ${target.username}.`);
      }
      case 'setcoins': {
        const amount = numArg(1, 0, 1e12);
        if (amount === null) return reply(false, 'Quantidade inválida.');
        setCoins(actor, target.id, amount, reasonBase);
        return reply(true, `${target.username} agora tem R$ ${amount.toLocaleString('pt-BR')}.`);
      }
      case 'givetokens': {
        const amount = numArg(1, 1, 1e9);
        if (!amount) return reply(false, 'Quantidade inválida.');
        giveTokens(actor, target.id, amount, reasonBase);
        return reply(true, `+${amount} tokens para ${target.username}.`);
      }
      case 'removetokens': {
        const amount = numArg(1, 1, 1e9);
        if (!amount) return reply(false, 'Quantidade inválida.');
        giveTokens(actor, target.id, -amount, reasonBase);
        return reply(true, `-${amount} tokens de ${target.username}.`);
      }
      case 'settokens': {
        const amount = numArg(1, 0, 1e9);
        if (amount === null) return reply(false, 'Quantidade inválida.');
        setTokens(actor, target.id, amount, reasonBase);
        return reply(true, `${target.username} agora tem ${amount} tokens.`);
      }
      case 'givexp': {
        const amount = numArg(1, 1, 1e10);
        if (!amount) return reply(false, 'Quantidade inválida.');
        giveXp(actor, target.id, amount, reasonBase);
        return reply(true, `+${amount} XP para ${target.username}.`);
      }
      case 'setxp': {
        const amount = numArg(1, 0, 1e10);
        if (amount === null) return reply(false, 'Quantidade inválida.');
        setXp(actor, target.id, amount, reasonBase);
        return reply(true, `${target.username} agora tem ${amount} XP.`);
      }
      case 'setlevel': {
        const level = numArg(1, 1, 100);
        if (!level) return reply(false, 'Nível inválido (1-100).');
        setLevel(actor, target.id, level, reasonBase);
        return reply(true, `${target.username} agora é nível ${level}.`);
      }
      case 'levelup': {
        giveXp(actor, target.id, 1, reasonBase);
        return reply(true, `${target.username} subiu de nível.`);
      }
      case 'heal':
        heal(actor, target.id, reasonBase);
        return reply(true, `${target.username} curado.`);
      case 'maxstats':
        maxStats(actor, target.id, reasonBase);
        return reply(true, `Stats de ${target.username} maxados.`);
      case 'giveitem': {
        const itemId = String(args[1] || '').trim();
        if (!itemId) return reply(false, 'Informe o ID do item.');
        const quantity = numArg(2, 1, 999) || 1;
        addItemToInventory(actor, target.id, itemId, quantity, reasonBase);
        return reply(true, `+${quantity}x ${itemId} para ${target.username}.`);
      }
      case 'removeitem': {
        const itemId = String(args[1] || '').trim();
        if (!itemId) return reply(false, 'Informe o ID do item.');
        const quantity = numArg(2, 1, 999) || 1;
        removeItemFromInventory(actor, target.id, itemId, quantity, reasonBase);
        return reply(true, `-${quantity}x ${itemId} de ${target.username}.`);
      }
      case 'role': {
        const newRole = String(args[1] || '').trim().toLowerCase();
        if (!newRole) return reply(false, 'Informe o cargo (ex: citizen, admin, king).');
        const customPerms = newRole === 'custom' && args.length > 2
          ? args.slice(2).map(s => s.trim()).filter(Boolean) : undefined;
        changeRole(actor, target.id, newRole, reasonBase, customPerms);
        const extra = customPerms ? ` (${customPerms.join(', ')})` : '';
        return reply(true, `${target.username} agora é ${newRole}${extra}.`);
      }
      case 'reset': {
        resetPlayer(actor, target.id, ['coins', 'tokens', 'xp', 'level', 'kills', 'damage', 'matches', 'inventory', 'capybara'], null, reasonBase);
        return reply(true, `Progresso de ${target.username} resetado.`);
      }
      // --- Economy Extended ---
      case 'givert': {
        const amount = numArg(1, 1, 1e6);
        if (!amount) return reply(false, 'Quantidade inválida.');
        giveTokens(actor, target.id, amount * 1000, reasonBase);
        return reply(true, `+${amount * 1000} tokens de renascimento para ${target.username}.`);
      }
      case 'giveallcoins': {
        const amount = numArg(0, 1, 1e12);
        if (!amount) return reply(false, 'Quantidade inválida.');
        let cnt = 0;
        for (const client of wss.clients) {
          if (client.readyState === 1 && client.chatUser && client.chatUser.id) {
            giveCoins(actor, client.chatUser.id, amount, reasonBase);
            cnt++;
          }
        }
        return reply(true, `+${amount} moedas para ${cnt} jogadores.`);
      }
      case 'givealltokens': {
        const amount = numArg(0, 1, 1e9);
        if (!amount) return reply(false, 'Quantidade inválida.');
        let cnt = 0;
        for (const client of wss.clients) {
          if (client.readyState === 1 && client.chatUser && client.chatUser.id) {
            giveTokens(actor, client.chatUser.id, amount, reasonBase);
            cnt++;
          }
        }
        return reply(true, `+${amount} tokens para ${cnt} jogadores.`);
      }
      case 'giveallxp': {
        const amount = numArg(0, 1, 1e10);
        if (!amount) return reply(false, 'Quantidade inválida.');
        let cnt = 0;
        for (const client of wss.clients) {
          if (client.readyState === 1 && client.chatUser && client.chatUser.id) {
            giveXp(actor, client.chatUser.id, amount, reasonBase);
            cnt++;
          }
        }
        return reply(true, `+${amount} XP para ${cnt} jogadores.`);
      }
      case 'doublecoins': {
        const prof = getProfileRaw(target.id);
        setCoins(actor, target.id, prof.coins * 2, reasonBase);
        return reply(true, `Moedas de ${target.username} dobradas: ${prof.coins} → ${prof.coins * 2}.`);
      }
      case 'halfcoins': {
        const prof = getProfileRaw(target.id);
        setCoins(actor, target.id, Math.floor(prof.coins / 2), reasonBase);
        return reply(true, `Moedas de ${target.username} pela metade: ${prof.coins} → ${Math.floor(prof.coins / 2)}.`);
      }
      case 'doubletokens': {
        const prof = getProfileRaw(target.id);
        setTokens(actor, target.id, prof.tokens * 2, reasonBase);
        return reply(true, `Tokens de ${target.username} dobrados: ${prof.tokens} → ${prof.tokens * 2}.`);
      }
      case 'halftokens': {
        const prof = getProfileRaw(target.id);
        setTokens(actor, target.id, Math.floor(prof.tokens / 2), reasonBase);
        return reply(true, `Tokens de ${target.username} pela metade: ${prof.tokens} → ${Math.floor(prof.tokens / 2)}.`);
      }
      case 'maxcoins': {
        setCoins(actor, target.id, 999999, reasonBase);
        return reply(true, `Moedas de ${target.username} definidas para 999999.`);
      }
      case 'maxtokens': {
        setTokens(actor, target.id, 999, reasonBase);
        return reply(true, `Tokens de ${target.username} definidos para 999.`);
      }
      case 'zerocoins': {
        setCoins(actor, target.id, 0, reasonBase);
        return reply(true, `Moedas de ${target.username} zeradas.`);
      }
      case 'zerotokens': {
        setTokens(actor, target.id, 0, reasonBase);
        return reply(true, `Tokens de ${target.username} zerados.`);
      }
      case 'rich': {
        const amount = numArg(1, 1, 1e12) || 50000;
        giveCoins(actor, target.id, amount, reasonBase);
        return reply(true, `+${amount.toLocaleString('pt-BR')} moedas para ${target.username}.`);
      }
      case 'poor': {
        setCoins(actor, target.id, 0, reasonBase);
        setTokens(actor, target.id, 0, reasonBase);
        return reply(true, `Toda moeda de ${target.username} zerada.`);
      }
      case 'whale': {
        giveCoins(actor, target.id, 50000, reasonBase);
        giveTokens(actor, target.id, 500, reasonBase);
        return reply(true, `+50000 moedas +500 tokens para ${target.username}.`);
      }
      // --- Player Stats / Capybara ---
      case 'sethp': {
        const amount = numArg(1, 0, 100);
        if (amount === null) return reply(false, 'Valor inválido (0-100).');
        updateCapybara(target.id, { health: amount });
        return reply(true, `HP de ${target.username} definido para ${amount}.`);
      }
      case 'setenergy': {
        const amount = numArg(1, 0, 100);
        if (amount === null) return reply(false, 'Valor inválido (0-100).');
        updateCapybara(target.id, { energy: amount });
        return reply(true, `Energia de ${target.username} definida para ${amount}.`);
      }
      case 'sethunger': {
        const amount = numArg(1, 0, 100);
        if (amount === null) return reply(false, 'Valor inválido (0-100).');
        updateCapybara(target.id, { hunger: amount });
        return reply(true, `Fome de ${target.username} definida para ${amount}.`);
      }
      case 'sethappiness': {
        const amount = numArg(1, 0, 100);
        if (amount === null) return reply(false, 'Valor inválido (0-100).');
        updateCapybara(target.id, { happiness: amount });
        return reply(true, `Felicidade de ${target.username} definida para ${amount}.`);
      }
      case 'feed': {
        updateCapybara(target.id, { hunger: 100 });
        return reply(true, `${target.username} alimentado.`);
      }
      case 'pet': {
        updateCapybara(target.id, { happiness: 100 });
        return reply(true, `${target.username} acariciado.`);
      }
      case 'rest': {
        updateCapybara(target.id, { energy: 100 });
        return reply(true, `${target.username} descansou.`);
      }
      case 'name': {
        const newName = String(args[1] || '').trim();
        if (!newName) return reply(false, 'Informe o novo nome.');
        updateCapybara(target.id, { name: newName });
        return reply(true, `Capivara de ${target.username} renomeada para "${newName}".`);
      }
      case 'maxall': {
        updateCapybara(target.id, { health: 100, energy: 100, hunger: 100, happiness: 100 });
        return reply(true, `Todas stats de ${target.username} definidas para 100.`);
      }
      case 'minall': {
        updateCapybara(target.id, { health: 0, energy: 0, hunger: 0, happiness: 0 });
        return reply(true, `Todas stats de ${target.username} definidas para 0.`);
      }
      case 'healall': {
        updateCapybara(target.id, { health: 100, energy: 100, hunger: 100, happiness: 100 });
        return reply(true, `${target.username} totalmente curado, alimentado, acariciado e descansado.`);
      }
      case 'starve': {
        updateCapybara(target.id, { hunger: 0, happiness: 0, energy: 0 });
        return reply(true, `${target.username} passando fome.`);
      }
      // --- Inventory Extended ---
      case 'giveallitems': {
        for (let i = 1; i <= 10; i++) {
          try { addItemToInventory(actor, target.id, String(i), 1, reasonBase); } catch {}
        }
        return reply(true, `Itens 1-10 dados para ${target.username}.`);
      }
      case 'clearinv': {
        const inv = getInventory(target.id);
        for (const item of inv) {
          removeItemFromInventory(actor, target.id, item.itemId, item.quantity, reasonBase);
        }
        return reply(true, `Inventário de ${target.username} limpo (${inv.length} itens removidos).`);
      }
      case 'giveammo': {
        const weaponId = String(args[1] || '').trim();
        if (!weaponId) return reply(false, 'Informe o ID da arma.');
        const ammoAmount = numArg(2, 1, 9999) || 100;
        addItemToInventory(actor, target.id, `ammo_${weaponId}`, ammoAmount, reasonBase);
        return reply(true, `+${ammoAmount} munição (ammo_${weaponId}) para ${target.username}.`);
      }
      case 'givearmor': {
        const armorType = String(args[1] || '').trim();
        if (!armorType) return reply(false, 'Informe o tipo de armadura.');
        addItemToInventory(actor, target.id, `armor_${armorType}`, 1, reasonBase);
        return reply(true, `+1 armadura (armor_${armorType}) para ${target.username}.`);
      }
      case 'giveskin': {
        const skinId = String(args[1] || '').trim();
        if (!skinId) return reply(false, 'Informe o ID da skin.');
        addItemToInventory(actor, target.id, `skin_${skinId}`, 1, reasonBase);
        return reply(true, `+1 skin (skin_${skinId}) para ${target.username}.`);
      }
      case 'giveboost': {
        const boostType = String(args[1] || '').trim();
        if (!boostType) return reply(false, 'Informe o tipo de boost.');
        addItemToInventory(actor, target.id, `boost_${boostType}`, 1, reasonBase);
        return reply(true, `+1 boost (boost_${boostType}) para ${target.username}.`);
      }
      case 'inv': {
        const inv = getInventory(target.id);
        if (!inv.length) return reply(true, `${target.username} não tem itens.`);
        const list = inv.map(i => `${i.itemId} x${i.quantity}`).join(', ');
        return reply(true, `Inventário de ${target.username}: ${list}`);
      }
      case 'weapon': {
        const weaponId = String(args[1] || '').trim();
        if (!weaponId) return reply(false, 'Informe o ID da arma.');
        addItemToInventory(actor, target.id, weaponId, 1, reasonBase);
        return reply(true, `+1 arma (${weaponId}) para ${target.username}.`);
      }
      case 'consumable': {
        const itemId = String(args[1] || '').trim();
        if (!itemId) return reply(false, 'Informe o ID do consumível.');
        const consumableAmount = numArg(2, 1, 999) || 1;
        addItemToInventory(actor, target.id, itemId, consumableAmount, reasonBase);
        return reply(true, `+${consumableAmount}x ${itemId} para ${target.username}.`);
      }
      case 'removeallitems': {
        const inv = getInventory(target.id);
        for (const item of inv) {
          removeItemFromInventory(actor, target.id, item.itemId, item.quantity, reasonBase);
        }
        return reply(true, `Todos itens de ${target.username} removidos (${inv.length} tipos).`);
      }
      // --- Player Management Extended ---
      case 'warn': {
        const warnMsg = args.slice(1).join(' ').slice(0, 200) || 'Sem motivo';
        logAdminAction(actor.id, target.id, 'WARN', { message: warnMsg, via: 'chat-command' }, true);
        return reply(true, `${target.username} foi avisado: "${warnMsg}"`);
      }
      case 'mute': {
        const minutes = numArg(1, 1, 1440);
        if (!minutes) return reply(false, 'Minutos inválidos (1-1440).');
        logAdminAction(actor.id, target.id, 'MUTE', { duration: minutes, via: 'chat-command' }, true);
        return reply(true, `${target.username} silenciado por ${minutes} min.`);
      }
      case 'unmute': {
        logAdminAction(actor.id, target.id, 'UNMUTE', { via: 'chat-command' }, true);
        return reply(true, `${target.username} pode falar novamente.`);
      }
      case 'freeze': {
        logAdminAction(actor.id, target.id, 'FREEZE', { via: 'chat-command' }, true);
        return reply(true, `${target.username} foi congelado.`);
      }
      case 'unfreeze': {
        logAdminAction(actor.id, target.id, 'UNFREEZE', { via: 'chat-command' }, true);
        return reply(true, `${target.username} foi descongelado.`);
      }
      case 'timeout': {
        const minutes = numArg(1, 1, 1440);
        if (!minutes) return reply(false, 'Minutos inválidos (1-1440).');
        suspendUser(actor, target.id, reasonBase, minutes * 60000);
        return reply(true, `${target.username} em timeout por ${minutes} min.`);
      }
      case 'jail': {
        logAdminAction(actor.id, target.id, 'JAIL', { via: 'chat-command' }, true);
        return reply(true, `${target.username} foi preso.`);
      }
      case 'unjail': {
        logAdminAction(actor.id, target.id, 'UNJAIL', { via: 'chat-command' }, true);
        return reply(true, `${target.username} foi solto.`);
      }
      case 'invisible': {
        logAdminAction(actor.id, target.id, 'INVISIBLE', { via: 'chat-command' }, true);
        return reply(true, `Invisibilidade alternada para ${target.username}.`);
      }
      case 'god': {
        logAdminAction(actor.id, target.id, 'GODMODE', { via: 'chat-command' }, true);
        return reply(true, `Godmode alternado para ${target.username}.`);
      }
      case 'speed': {
        const mult = numArg(1, 1, 100);
        if (!mult) return reply(false, 'Multiplicador inválido (1-100).');
        logAdminAction(actor.id, target.id, 'SPEED', { multiplier: mult, via: 'chat-command' }, true);
        return reply(true, `Velocidade de ${target.username} definida para x${mult}.`);
      }
      case 'size': {
        const mult = numArg(1, 1, 100);
        if (!mult) return reply(false, 'Multiplicador inválido (1-100).');
        logAdminAction(actor.id, target.id, 'SIZE', { multiplier: mult, via: 'chat-command' }, true);
        return reply(true, `Tamanho de ${target.username} definido para x${mult}.`);
      }
      // --- Server Admin ---
      case 'online': {
        let cnt = 0;
        for (const client of wss.clients) {
          if (client.readyState === 1 && client.chatUser) cnt++;
        }
        return reply(true, `${cnt} jogadores online.`);
      }
      case 'serverstats': {
        const stats = dashboardStats();
        return reply(true, `Usuários: ${stats.totalUsers} | Ativos: ${stats.activeUsers} | Banidos: ${stats.bannedUsers} | Online: ${stats.onlineUsers} | Moedas total: R$ ${stats.totalCoins.toLocaleString('pt-BR')}`);
      }
      case 'announce': {
        const text = args.join(' ').slice(0, 200);
        if (!text) return reply(false, 'Informe a mensagem.');
        const announceData = JSON.stringify({ type: 'globalChat', data: { name: '[ADMIN]', role: 'admin', message: text, ts: Date.now() } });
        for (const client of wss.clients) {
          if (client.readyState === 1) client.send(announceData);
        }
        return reply(true, `Anúncio enviado: "${text}"`);
      }
      case 'motd': {
        const text = args.join(' ').slice(0, 200);
        if (!text) return reply(false, 'Informe a mensagem.');
        logAdminAction(actor.id, null, 'SET_MOTD', { message: text, via: 'chat-command' }, true);
        return reply(true, `MOTD definido: "${text}"`);
      }
      case 'playercount': {
        let cnt = 0;
        for (const client of wss.clients) {
          if (client.readyState === 1 && client.chatUser) cnt++;
        }
        return reply(true, `${cnt} jogadores conectados.`);
      }
      case 'totalusers': {
        return reply(true, `Total de usuários: ${countUsers()}.`);
      }
      case 'totalbanned': {
        const stats = dashboardStats();
        return reply(true, `Total de banidos: ${stats.bannedUsers}.`);
      }
      case 'totaladmins': {
        let total = 0;
        for (const r of ['admin', 'head_admin', 'co_king', 'king']) {
          total += searchUsers({ role: r, limit: 100 }).length;
        }
        return reply(true, `Total de admins: ${total}.`);
      }
      case 'uptime': {
        const ms = Date.now() - startTime;
        const h = Math.floor(ms / 3600000);
        const m = Math.floor((ms % 3600000) / 60000);
        const s = Math.floor((ms % 60000) / 1000);
        return reply(true, `Uptime: ${h}h ${m}m ${s}s`);
      }
      case 'version': {
        return reply(true, 'CapiQuake v1.0.0');
      }
      // --- Info/Utility ---
      case 'whois': {
        return reply(true, `Usuário: ${target.username} | ID: ${target.id} | Cargo: ${target.role} | Status: ${target.status} | Criado: ${new Date(target.createdAt).toLocaleDateString('pt-BR')}`);
      }
      case 'profile': {
        const prof = getProfileRaw(target.id);
        return reply(true, `${target.username}: R$ ${prof.coins.toLocaleString('pt-BR')} | ${prof.tokens} tokens | Nv.${prof.level} | ${prof.xp} XP | ${prof.rebirths} rebirths`);
      }
      case 'capybara': {
        const capy = getCapybara(target.id);
        return reply(true, `Capivara de ${target.username}: "${capy.name}" | HP:${capy.health} | Energia:${capy.energy} | Fome:${capy.hunger} | Felicidade:${capy.happiness}`);
      }
      case 'id': {
        return reply(true, `ID de ${target.username}: ${target.id}`);
      }
      case 'search': {
        const query = args.join(' ').slice(0, 50);
        if (!query) return reply(false, 'Informe a busca.');
        const results = searchUsers({ q: query, limit: 5 });
        if (!results.length) return reply(true, 'Nenhum resultado.');
        const list = results.map(u => `${u.username} (${u.id}) [${u.role}]`).join(', ');
        return reply(true, `Resultados: ${list}`);
      }
      case 'roles': {
        return reply(true, 'Cargos: citizen < cool < hazbin < friend < best_capybara < developer < admin < head_admin < co_king < king');
      }
      case 'myrole': {
        return reply(true, `Seu cargo: ${user.role}`);
      }
      case 'help': {
        const cmds = CHAT_COMMANDS.filter(c => hasPermission(user, c.perm));
        return reply(true, `Comandos disponíveis (${cmds.length}): ${cmds.map(c => '/' + c.name).join(', ')}`);
      }
      case 'cmdhelp': {
        const cmdName = String(args[0] || '').replace(/^\//, '').toLowerCase();
        const cmd = CHAT_COMMANDS.find(c => c.name === cmdName);
        if (!cmd) return reply(false, `Comando desconhecido: /${cmdName}`);
        return reply(true, `/${cmd.name} [${cmd.params.join(' ')}] — ${cmd.desc}${cmd.destructive ? ' (DESTRUTIVO)' : ''}`);
      }
      case 'logs': {
        const targetLogs = listLogs({ targetUserId: target.id, limit: 10 });
        if (!targetLogs.length) return reply(true, `Nenhum log para ${target.username}.`);
        const logList = targetLogs.map(l => `${l.action} por ${l.actor_username || '?'} em ${new Date(l.created_at).toLocaleDateString('pt-BR')}`).join(' | ');
        return reply(true, `Logs de ${target.username}: ${logList}`);
      }
      // --- Fun/Cosmetic ---
      case 'shiny': {
        updateCapybara(target.id, { health: 100, energy: 100, hunger: 100, happiness: 100 });
        logAdminAction(actor.id, target.id, 'SHINY', { via: 'chat-command' }, true);
        return reply(true, `Capivara de ${target.username} agora é brilhante!`);
      }
      case 'mega': {
        updateCapybara(target.id, { health: 100, energy: 100, hunger: 100, happiness: 100 });
        logAdminAction(actor.id, target.id, 'MEGA', { via: 'chat-command' }, true);
        return reply(true, `Capivara de ${target.username} mega evoluiu!`);
      }
      case 'baby': {
        resetPlayer(actor, target.id, ['capybara'], target.username, reasonBase);
        return reply(true, `Capivara de ${target.username} virou filhote.`);
      }
      case 'elder': {
        updateCapybara(target.id, { health: 100, energy: 100, hunger: 100, happiness: 100 });
        logAdminAction(actor.id, target.id, 'ELDER', { via: 'chat-command' }, true);
        return reply(true, `Capivara de ${target.username} é agora idosa (max tudo).`);
      }
      case 'clone': {
        const target2 = resolveTargetUser(args[1]);
        if (!target2) return reply(false, `Segundo jogador não encontrado: ${args[1]}`);
        const prof = getProfileRaw(target.id);
        setCoins(actor, target2.id, prof.coins, reasonBase);
        setTokens(actor, target2.id, prof.tokens, reasonBase);
        return reply(true, `Stats de ${target.username} copiados para ${target2.username}.`);
      }
      case 'swap': {
        const target2 = resolveTargetUser(args[1]);
        if (!target2) return reply(false, `Segundo jogador não encontrado: ${args[1]}`);
        const prof1 = getProfileRaw(target.id);
        const prof2 = getProfileRaw(target2.id);
        setCoins(actor, target.id, prof2.coins, reasonBase);
        setCoins(actor, target2.id, prof1.coins, reasonBase);
        return reply(true, `Moedas trocadas entre ${target.username} e ${target2.username}.`);
      }
      case 'steal': {
        const target2 = resolveTargetUser(args[1]);
        if (!target2) return reply(false, `Segundo jogador não encontrado: ${args[1]}`);
        const amount = numArg(2, 1, 1e12);
        if (!amount) return reply(false, 'Quantidade inválida.');
        giveCoins(actor, target.id, -amount, reasonBase);
        giveCoins(actor, target2.id, amount, reasonBase);
        return reply(true, `${amount} moedas tiradas de ${target.username} e dadas a ${target2.username}.`);
      }
      case 'tax': {
        const percentage = numArg(1, 1, 100);
        if (!percentage) return reply(false, 'Porcentagem inválida (1-100).');
        const prof = getProfileRaw(target.id);
        const taxAmount = Math.floor(prof.coins * percentage / 100);
        setCoins(actor, target.id, prof.coins - taxAmount, reasonBase);
        return reply(true, `${percentage}% de imposto cobrado de ${target.username}: -R$ ${taxAmount.toLocaleString('pt-BR')}.`);
      }
      case 'bonus': {
        const percentage = numArg(1, 1, 100);
        if (!percentage) return reply(false, 'Porcentagem inválida (1-100).');
        const prof = getProfileRaw(target.id);
        const bonusAmount = Math.floor(prof.coins * percentage / 100);
        giveCoins(actor, target.id, bonusAmount, reasonBase);
        return reply(true, `+${percentage}% bônus para ${target.username}: +R$ ${bonusAmount.toLocaleString('pt-BR')}.`);
      }
      case 'lottery': {
        const maxAmount = numArg(0, 1, 1e12);
        if (!maxAmount) return reply(false, 'Quantidade inválida.');
        let cnt = 0;
        for (const client of wss.clients) {
          if (client.readyState === 1 && client.chatUser && client.chatUser.id) {
            const won = Math.floor(Math.random() * maxAmount) + 1;
            giveCoins(actor, client.chatUser.id, won, reasonBase);
            cnt++;
          }
        }
        return reply(true, `Lottery: ${cnt} jogadores receberam prêmios aleatórios (1-${maxAmount.toLocaleString('pt-BR')}).`);
      }
      // --- Quick Kits ---
      case 'starter': {
        giveCoins(actor, target.id, 1000, reasonBase);
        try { addItemToInventory(actor, target.id, '1', 1, reasonBase); } catch {}
        return reply(true, `Kit iniciante dado a ${target.username}.`);
      }
      case 'veteran': {
        giveCoins(actor, target.id, 10000, reasonBase);
        giveTokens(actor, target.id, 10, reasonBase);
        for (let i = 1; i <= 5; i++) {
          try { addItemToInventory(actor, target.id, String(i), 1, reasonBase); } catch {}
        }
        return reply(true, `Kit veterano dado a ${target.username}.`);
      }
      case 'pro': {
        giveCoins(actor, target.id, 50000, reasonBase);
        giveTokens(actor, target.id, 50, reasonBase);
        for (let i = 1; i <= 10; i++) {
          try { addItemToInventory(actor, target.id, String(i), 1, reasonBase); } catch {}
        }
        return reply(true, `Kit profissional dado a ${target.username}.`);
      }
      case 'legend': {
        giveCoins(actor, target.id, 200000, reasonBase);
        giveTokens(actor, target.id, 100, reasonBase);
        for (let i = 1; i <= 15; i++) {
          try { addItemToInventory(actor, target.id, String(i), 1, reasonBase); } catch {}
        }
        return reply(true, `Kit lenda dado a ${target.username}.`);
      }
      case 'vip': {
        giveCoins(actor, target.id, 500000, reasonBase);
        giveTokens(actor, target.id, 200, reasonBase);
        maxStats(actor, target.id, reasonBase);
        return reply(true, `Kit VIP dado a ${target.username}.`);
      }
      case 'wipeday': {
        setCoins(actor, target.id, 0, reasonBase);
        setTokens(actor, target.id, 10, reasonBase);
        return reply(true, `${target.username} teve moedas zeradas e recebeu 10 tokens.`);
      }
      case 'birthday': {
        giveCoins(actor, target.id, 10000, reasonBase);
        giveTokens(actor, target.id, 10, reasonBase);
        return reply(true, `Kit aniversário dado a ${target.username}.`);
      }
      case 'christmas': {
        giveCoins(actor, target.id, 50000, reasonBase);
        giveTokens(actor, target.id, 25, reasonBase);
        return reply(true, `Kit natal dado a ${target.username}.`);
      }
      case 'newyear': {
        giveCoins(actor, target.id, 25000, reasonBase);
        giveTokens(actor, target.id, 15, reasonBase);
        return reply(true, `Kit ano novo dado a ${target.username}.`);
      }
      case 'anniversary': {
        giveCoins(actor, target.id, 100000, reasonBase);
        giveTokens(actor, target.id, 50, reasonBase);
        return reply(true, `Kit aniversário do jogo dado a ${target.username}.`);
      }
      // --- Moderation Extended ---
      case 'ipban': {
        banUser(actor, target.id, reasonBase);
        logAdminAction(actor.id, target.id, 'IP_BAN', { via: 'chat-command', reason: reasonBase }, true);
        return reply(true, `${target.username} banido (IP).`);
      }
      case 'ipunban': {
        unbanUser(actor, target.id, reasonBase);
        logAdminAction(actor.id, target.id, 'IP_UNBAN', { via: 'chat-command', reason: reasonBase }, true);
        return reply(true, `${target.username} desbanido (IP).`);
      }
      case 'blacklist': {
        banUser(actor, target.id, reasonBase);
        logAdminAction(actor.id, target.id, 'BLACKLIST', { via: 'chat-command', reason: reasonBase }, true);
        return reply(true, `${target.username} adicionado à lista negra.`);
      }
      case 'whitelist': {
        unbanUser(actor, target.id, reasonBase);
        logAdminAction(actor.id, target.id, 'WHITELIST', { via: 'chat-command', reason: reasonBase }, true);
        return reply(true, `${target.username} removido da lista negra.`);
      }
      case 'chatban': {
        logAdminAction(actor.id, target.id, 'CHAT_BAN', { via: 'chat-command', reason: reasonBase }, true);
        return reply(true, `${target.username} banido do chat.`);
      }
      case 'chatunban': {
        logAdminAction(actor.id, target.id, 'CHAT_UNBAN', { via: 'chat-command', reason: reasonBase }, true);
        return reply(true, `${target.username} desbanido do chat.`);
      }
      case 'kickall': {
        let cnt = 0;
        const adminRoles = new Set(['admin', 'head_admin', 'co_king', 'king']);
        for (const client of wss.clients) {
          if (client.readyState === 1 && client.chatUser && client.chatUser.id && !adminRoles.has(client.chatUser.role)) {
            revokeTargetSessions(client.chatUser.id);
            cnt++;
          }
        }
        logAdminAction(actor.id, null, 'KICK_ALL', { count: cnt, via: 'chat-command' }, true);
        return reply(true, `${cnt} jogadores kickados.`);
      }
      case 'banall': {
        let cnt = 0;
        const adminRoles = new Set(['admin', 'head_admin', 'co_king', 'king']);
        for (const client of wss.clients) {
          if (client.readyState === 1 && client.chatUser && client.chatUser.id && !adminRoles.has(client.chatUser.role)) {
            banUser(actor, client.chatUser.id, 'banall');
            cnt++;
          }
        }
        logAdminAction(actor.id, null, 'BAN_ALL', { count: cnt, via: 'chat-command' }, true);
        return reply(true, `${cnt} jogadores banidos.`);
      }
      case 'pardon': {
        unbanUser(actor, target.id, reasonBase);
        return reply(true, `${target.username} perdoado e desbanido.`);
      }
      case 'history': {
        const targetLogs = listLogs({ targetUserId: target.id, limit: 20 });
        if (!targetLogs.length) return reply(true, `Nenhum histórico para ${target.username}.`);
        const logList = targetLogs.map(l => `${l.action} (${new Date(l.created_at).toLocaleDateString('pt-BR')})`).join(', ');
        return reply(true, `Histórico de ${target.username}: ${logList}`);
      }
      // --- Game Tools ---
      case 'giveall': {
        const amount = numArg(0, 1, 1e12);
        if (!amount) return reply(false, 'Quantidade inválida.');
        let cnt = 0;
        for (const client of wss.clients) {
          if (client.readyState === 1 && client.chatUser && client.chatUser.id) {
            giveCoins(actor, client.chatUser.id, amount, reasonBase);
            giveTokens(actor, client.chatUser.id, amount, reasonBase);
            cnt++;
          }
        }
        return reply(true, `+${amount} moedas e tokens para ${cnt} jogadores.`);
      }
      default:
        return reply(false, 'Comando não implementado.');
    }
  } catch (err) {
    return reply(false, err.message || 'Falha ao executar comando.');
  }
}

import { ROLE_RANK as ROLE_RANK_MAP } from './validation.js';
function ROLE_RANK_CHECK(targetRole, actorRole) {
  if (actorRole === 'king') return false;
  return (ROLE_RANK_MAP[targetRole] ?? 0) >= (ROLE_RANK_MAP[actorRole] ?? 0);
}

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function generateRoomCode() {
  let code;
  do {
    code = '';
    for (let i = 0; i < 4; i++) code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  } while ([...rooms.values()].some(r => r.code === code));
  return code;
}

class GameRoom {
  constructor() {
    this.id = roomIdCounter++;
    this.code = generateRoomCode();
    this.players = new Map();
    this.host = null;
    this.started = false;
    this.animalCount = 20;
    this.kills = {};
  }

  addPlayer(ws, name) {
    const isFirst = this.players.size === 0;
    this.players.set(ws, {
      name,
      position: { x: 0, y: 1.7, z: 0 },
      rotation: 0,
      kills: 0,
      country: ws.country || null
    });
    this.kills[name] = 0;
    if (isFirst || !this.host || !this.players.has(this.host)) {
      this.host = ws;
    }
    this.broadcastLobby();
  }

  removePlayer(ws) {
    const wasHost = this.host === ws;
    this.players.delete(ws);
    if (wasHost) {
      const next = this.players.keys().next();
      this.host = next.done ? null : next.value;
      if (!next.done && !this.started) {
        this.broadcast({ type: 'chat', data: { name: '[SERVIDOR]', color: '#a78bfa', message: 'O host saiu. Novo host: ' + this.players.get(this.host).name, ts: Date.now() } });
      }
    }
    this.broadcastLobby();
    if (this.players.size === 0) {
      rooms.delete(this.id);
    }
  }

  isHost(ws) {
    return this.host === ws;
  }

  broadcastLobby() {
    const playerList = Array.from(this.players.values()).map(p => ({
      name: p.name,
      kills: p.kills || 0,
      country: p.country || null
    }));
    const hostName = this.host && this.players.get(this.host) ? this.players.get(this.host).name : '';
    for (const [socket] of this.players) {
      if (socket.readyState !== 1) continue;
      socket.send(JSON.stringify({
        type: 'lobby',
        code: this.code,
        hostName,
        players: playerList,
        maxPlayers: 6,
        started: this.started,
        youAreHost: this.isHost(socket)
      }));
    }
  }

  startGame(data, ws) {
    if (!this.isHost(ws)) return false;
    this.started = true;
    const d = data || {};
    this.broadcast({
      type: 'gameStart',
      data: {
        map: d.map || null,
        gameMode: d.gameMode || 'normal',
        animalCount: d.animalCount || this.animalCount,
        bots: ['UmLegalGaucho', 'Bot_Mineiro', 'Bot_Paulista', 'Bot_Carioca', 'Bot_Baiano']
      }
    });
    return true;
  }

  handleChat(ws, data) {
    const name = String((data && data.name) || 'Anon').trim().slice(0, 30);
    const color = String((data && data.color) || '#ffffff').slice(0, 20);
    const message = String((data && data.message) || '').trim().slice(0, 150);
    if (!message) return;
    this.broadcast({ type: 'chat', data: { name, color, message, ts: Date.now() } });
  }

  handleKill(ws, targetId) {
    const player = this.players.get(ws);
    if (player) {
      player.kills++;
      this.kills[player.name] = player.kills;
      this.broadcast({ type: 'kill', data: { player: player.name, targetId } });
    }
  }

  handlePosition(ws, position, rotation) {
    const player = this.players.get(ws);
    if (player) {
      player.position = position;
      player.rotation = rotation;
      const state = {};
      state[player.name] = { position: player.position, rotation: player.rotation };
      for (const [socket] of this.players) {
        if (socket !== ws && socket.readyState === 1) {
          socket.send(JSON.stringify({ type: 'stateUpdate', state }));
        }
      }
    }
  }

  broadcast(msg) {
    const data = JSON.stringify(msg);
    for (const [socket] of this.players) {
      if (socket.readyState === 1) {
        socket.send(data);
      }
    }
  }
}

function findRoomByCode(code) {
  const wanted = String(code || '').trim().toUpperCase();
  for (const [, room] of rooms) {
    if (room.code === wanted) return room;
  }
  return null;
}

function sendNotFound(res) {
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not found');
}

function getStaticFilePath(pathname) {
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(pathname.split('?')[0]);
  } catch {
    return null;
  }

  const requestPath = decodedPath === '/' ? '/index.html' : decodedPath;
  const normalizedPath = normalize(requestPath).replace(/^[/\\]+/, '');
  const filePath = resolve(join(DIST_DIR, normalizedPath));
  const rel = relative(DIST_DIR, filePath);

  if (rel.startsWith('..') || rel === '..' || filePath === DIST_DIR) {
    return null;
  }

  return filePath;
}

async function serveStatic(res, pathname) {
  const filePath = getStaticFilePath(pathname);
  if (!filePath) {
    sendNotFound(res);
    return;
  }

  const ext = extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext];
  if (!contentType) {
    sendNotFound(res);
    return;
  }

  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) {
      sendNotFound(res);
      return;
    }

    const body = await readFile(filePath);
    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': body.length,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable'
    });
    res.end(body);
  } catch {
    sendNotFound(res);
  }
}

async function serveAdmin(req, res, pathname) {
  let file;
  if (pathname === '/login' || pathname === '/admin/login') file = 'login.html';
  else if (pathname === '/app.js' || pathname === '/admin/app.js') file = 'app.js';
  else if (pathname === '/admin.css' || pathname === '/admin/admin.css') file = 'admin.css';
  else if (pathname === '/' || pathname === '/index.html' || pathname === '/admin' || pathname === '/admin/') file = 'index.html';
  else { sendNotFound(res); return; }
  try {
    const body = await readFile(join(ADMIN_DIR, file));
    res.writeHead(200, {
      'Content-Type': file.endsWith('.js') ? 'text/javascript; charset=utf-8'
        : file.endsWith('.css') ? 'text/css; charset=utf-8'
        : 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache',
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff'
    });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
}

const server = createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD' && !req.url.startsWith('/api/')) {
    res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Method not allowed');
    return;
  }

  let pathname = '/';
  try {
    pathname = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`).pathname;
  } catch {}

  if (pathname.startsWith('/api/')) {
    handleApi(req, res, pathname, new URL(req.url, 'http://x').searchParams);
    return;
  }

  // Painel administrativo no sub-subdominio dedicado (ex.: admin.m.zanona.com.br).
  if (isAdminHost(req)) {
    serveAdmin(req, res, pathname);
    return;
  }

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    serveAdmin(req, res, pathname);
    return;
  }

  serveStatic(res, pathname);
});

const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (req, socket, head) => {
  let pathname;
  try {
    pathname = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`).pathname;
  } catch {
    socket.destroy();
    return;
  }

  if (pathname !== '/ws') {
    socket.destroy();
    return;
  }

  const fakeReq = { headers: req.headers };
  attachSession(fakeReq);

  wss.handleUpgrade(req, socket, head, (ws) => {
    ws.chatUser = fakeReq.user || null;
    // País via Cloudflare em produção; nunca expõe o IP bruto.
    const cf = req.headers['cf-ipcountry'];
    if (typeof cf === 'string' && /^[A-Za-z]{2}$/.test(cf)) {
      ws.country = cf.toUpperCase();
    } else {
      const lang = String(req.headers['accept-language'] || '').match(/[a-z]{2}-([A-Z]{2})/);
      ws.country = lang ? lang[1] : null;
    }
    wss.emit('connection', ws, req);
  });
});

wss.on('connection', (ws) => {
  let currentRoom = null;

  const chatName = sanitizeChatText(ws.chatUser?.displayName || ws.chatUser?.username || '', 24);
  globalChatClients.set(ws, {
    name: chatName || null,
    role: ws.chatUser?.role || null,
    userId: ws.chatUser?.id ?? null
  });
  ws.send(JSON.stringify({ type: 'globalChatHistory', data: [...globalChatHistory] }));

  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    switch (msg.type) {
      case 'createLobby': {
        if (currentRoom) currentRoom.removePlayer(ws);
        const room = new GameRoom();
        rooms.set(room.id, room);
        currentRoom = room;
        room.addPlayer(ws, String(msg.name || 'Anon').slice(0, 12));
        ws.send(JSON.stringify({ type: 'lobbyCreated', code: room.code }));
        break;
      }
      case 'joinLobby': {
        if (currentRoom) currentRoom.removePlayer(ws);
        const room = findRoomByCode(msg.code);
        if (!room) {
          ws.send(JSON.stringify({ type: 'lobbyError', message: 'Lobby nao encontrado. Confira o codigo.' }));
          currentRoom = null;
          break;
        }
        if (room.started) {
          ws.send(JSON.stringify({ type: 'lobbyError', message: 'Essa partida ja comecou.' }));
          break;
        }
        if (room.players.size >= 6) {
          ws.send(JSON.stringify({ type: 'lobbyError', message: 'Lobby cheio (6/6).' }));
          break;
        }
        currentRoom = room;
        room.addPlayer(ws, String(msg.name || 'Anon').slice(0, 12));
        break;
      }
      case 'startGame': {
        if (!currentRoom) break;
        const ok = currentRoom.startGame(msg, ws);
        if (!ok) ws.send(JSON.stringify({ type: 'lobbyError', message: 'Apenas o host pode iniciar a partida.' }));
        break;
      }
      case 'leaveLobby':
        if (currentRoom) currentRoom.removePlayer(ws);
        currentRoom = null;
        break;
      case 'position':
        if (currentRoom) currentRoom.handlePosition(ws, msg.position, msg.rotation);
        break;
      case 'kill':
        if (currentRoom) currentRoom.handleKill(ws, msg.targetId);
        break;
      case 'chat':
        if (currentRoom) currentRoom.handleChat(ws, msg);
        break;
      case 'globalChat':
        handleGlobalChat(ws, msg);
        break;
      case 'listCommands':
        ws.send(JSON.stringify({ type: 'commandList', data: commandsForUser(ws.chatUser) }));
        break;
      case 'command':
        handleChatCommand(ws, msg);
        break;
      case 'setChatName': {
        const client = globalChatClients.get(ws);
        if (client && !client.userId) {
          client.name = sanitizeChatText(msg.name, 12) || 'Anon';
        }
        break;
      }
      case 'ping':
        ws.send(JSON.stringify({ type: 'pong', t: msg.t }));
        break;
      case 'testMode':
        ws.send(JSON.stringify({ type: 'testModeAck', ok: true }));
        break;
    }
  });

  ws.on('close', () => {
    globalChatClients.delete(ws);
    if (currentRoom) currentRoom.removePlayer(ws);
  });
});

server.listen(PORT, HOST, () => {
  const address = server.address();
  const actualPort = typeof address === 'object' && address ? address.port : PORT;
  console.log(`CapiQuake server running on http://localhost:${actualPort}`);
  console.log(`CapiQuake WebSocket available on ws://localhost:${actualPort}/ws`);

  const lanIps = Object.values(networkInterfaces())
    .flat()
    .filter(i => i && i.family === 'IPv4' && !i.internal)
    .map(i => i.address);
  if (lanIps.length) {
    console.log('Jogar na mesma rede (LAN): http://' + lanIps[0] + ':' + actualPort);
  }
});
