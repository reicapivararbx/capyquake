import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

process.env.CAPYQUAKE_DB_PATH = join(mkdtempSync(join(tmpdir(), 'cq-test-')), 'test.db');

const { createUser, authenticate, getUserById, giveCoins, setCoins, giveTokens,
  giveXp, setXp, setLevel, levelUp, addItemToInventory, removeItemFromInventory,
  getInventory, getFullAccount, reportMatch, resetPlayer } = await import('../server/services.js');
const { applyXp, xpNeededForLevel } = await import('../server/xplevel.js');
const { ApiError } = await import('../server/validation.js');
const { hashPassword, verifyPassword } = await import('../server/passwords.js');

let owner;
beforeEach(() => {
  if (!owner) {
    owner = createUser({ username: 'owner_t', password: 'SenhaForte!1' });
    const { db } = null ?? {};
    void db;
  }
});

const actorOf = () => ({ ...getUserById(owner.id) });

function player(name) {
  return createUser({ username: name, password: 'SenhaForte!1' });
}

test('hash de senha nunca guarda texto puro e verifica corretamente', () => {
  const h = hashPassword('MinhaSenh@123');
  assert.ok(!h.includes('MinhaSenh@123'));
  assert.equal(h.startsWith('scrypt:'), true);
  assert.equal(verifyPassword('MinhaSenh@123', h), true);
  assert.equal(verifyPassword('errada', h), false);
});

test('registro cria user+profile+capybara e valida username', async () => {
  const u = player('joao_valido');
  const acc = getFullAccount(u.id);
  assert.equal(acc.profile.level, 1);
  assert.equal(acc.profile.coins, 0);
  assert.equal(acc.capybara.name, 'Capy');
  assert.equal(acc.capybara.health, 100);
  assert.throws(() => player('x'), { code: 'INVALID_USERNAME' });
  assert.throws(() => createUser({ username: 'nome com espaço', password: 'SenhaForte!1' }), { code: 'INVALID_USERNAME' });
  assert.throws(() => player('joao_valido'), { code: 'USERNAME_TAKEN' });
  assert.throws(() => createUser({ username: 'curto_ok', password: 'curta' }), { code: 'INVALID_PASSWORD' });
});

test('authenticate valida senha e retorna sem hash', async () => {
  player('maria_auth');
  const u = authenticate('maria_auth', 'SenhaForte!1');
  assert.equal(u.username, 'maria_auth');
  assert.equal(u.password_hash, undefined);
  assert.equal(u.passwordHash, undefined);
  assert.throws(() => authenticate('maria_auth', 'errada'), { code: 'UNAUTHORIZED' });
});

test('give/set coins com transacoes e clamp', async () => {
  const alvo = player('eco1');
  const actor = actorOf();
  giveCoins(actor, alvo.id, 500, 'bonus');
  const r = giveCoins(actor, alvo.id, -200, 'penalidade');
  assert.deepEqual(r, { before: 500, after: 300 });
  const zeroed = giveCoins(actor, alvo.id, -999999, 'estouro');
  assert.equal(zeroed.after, 0);
  assert.throws(() => giveCoins(actor, alvo.id, Number.NaN, 'x'), { code: 'INVALID_AMOUNT' });
  setCoins(actor, alvo.id, 42, 'ajuste');
  assert.equal(getFullAccount(alvo.id).profile.coins, 42);
  giveTokens(actor, alvo.id, 7, 'tk');
  assert.equal(getFullAccount(alvo.id).profile.tokens, 7);
});

test('xp segue formula oficial level*100 com cap 100', () => {
  assert.equal(xpNeededForLevel(1), 100);
  let r = applyXp(1, 0, 250);
  assert.deepEqual({ level: r.level, xp: r.xp }, { level: 2, xp: 150 });
  r = applyXp(99, 9900, 10 ** 9);
  assert.equal(r.level, 100);
  assert.ok(r.xp <= xpNeededForLevel(99));
});

test('giveXp aplica level up real', async () => {
  const alvo = player('xper');
  const actor = actorOf();
  const r = giveXp(actor, alvo.id, 350, 'teste');
  assert.equal(r.leveledUp, true);
  assert.equal(r.level, 3);
  assert.equal(r.xp, 50);
  assert.throws(() => giveXp(actor, alvo.id, Number.NaN), { code: 'INVALID_XP' });
});

test('setXp/setLevel/levelUp validam e persistem', async () => {
  const alvo = player('lvler');
  const actor = actorOf();
  setXp(actor, alvo.id, 150, 'r');
  let p = getFullAccount(alvo.id).profile;
  assert.equal(p.level, 2); assert.equal(p.xp, 50);
  setLevel(actor, alvo.id, 55, 'r');
  p = getFullAccount(alvo.id).profile;
  assert.equal(p.level, 55);
  assert.throws(() => setLevel(actor, alvo.id, 101, 'r'), { code: 'INVALID_LEVEL' });
  levelUp(actor, alvo.id, 3, 'r');
  assert.equal(getFullAccount(alvo.id).profile.level, 58);
});

test('inventario valida item, quantidade e nunca fica negativo', async () => {
  const alvo = player('inv1');
  const actor = actorOf();
  addItemToInventory(actor, alvo.id, 'minigun', 2, 'r');
  addItemToInventory(actor, alvo.id, 'minigun', 3, 'r');
  let inv = getInventory(alvo.id);
  assert.equal(inv[0].quantity, 5);
  assert.throws(() => removeItemFromInventory(actor, alvo.id, 'minigun', 6, 'r'), /Possui apenas 5/);
  const r = removeItemFromInventory(actor, alvo.id, 'minigun', 5, 'r');
  assert.equal(r.remaining, 0);
  assert.equal(getInventory(alvo.id).length, 0);
  assert.throws(() => addItemToInventory(actor, alvo.id, 'item-fantasma', 1, 'r'), { code: 'INVALID_ITEM' });
  assert.throws(() => addItemToInventory(actor, alvo.id, 'minigun', 0, 'r'), { code: 'INVALID_QUANTITY' });
});

test('reportMatch limita ganhos absurdos do cliente', async () => {
  const alvo = player('rep1');
  const r = reportMatch(alvo.id, {
    moneyEarned: 10 ** 15, tokensEarned: 10 ** 12, xpEarned: 10 ** 14,
    kills: 10 ** 9, damageDealt: 10 ** 18, playTimeSeconds: 10 ** 6, won: true
  });
  assert.ok(r.coins <= 5e12);
  assert.ok(r.applied.kills <= 2e6);
  const acc = getFullAccount(alvo.id);
  assert.equal(acc.profile.matches, 1);
});

test('reset exige confirmacao por username e zera escopos', async () => {
  const alvo = player('reset1');
  const actor = actorOf();
  giveCoins(actor, alvo.id, 1000, 'r');
  addItemToInventory(actor, alvo.id, 'ak47', 1, 'r');
  giveXp(actor, alvo.id, 1000, 'r');
  assert.throws(() => resetPlayer(actor, alvo.id, ['coins'], 'ERRADO', 'r'), /não corresponde/);
  resetPlayer(actor, alvo.id, ['all'], alvo.username, 'r');
  const acc = getFullAccount(alvo.id);
  assert.equal(acc.profile.coins, 0);
  assert.equal(acc.profile.level, 1);
  assert.equal(acc.inventory.length, 0);
});
