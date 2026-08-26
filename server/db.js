import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { env } from './env.js';

mkdirSync(dirname(env.dbPath), { recursive: true });
export const db = new DatabaseSync(env.dbPath);
db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA foreign_keys = ON');

const MIGRATIONS = [
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE COLLATE NOCASE,
    display_name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'citizen',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','suspended','banned')),
    suspended_until INTEGER,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    last_login_at INTEGER
  );
  CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);`,
  `CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at INTEGER NOT NULL,
    expires_at INTEGER NOT NULL,
    revoked_at INTEGER
  );
  CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
  CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);`,
  `CREATE TABLE IF NOT EXISTS game_profiles (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    coins INTEGER NOT NULL DEFAULT 0 CHECK (coins >= 0),
    tokens INTEGER NOT NULL DEFAULT 0 CHECK (tokens >= 0),
    xp INTEGER NOT NULL DEFAULT 0 CHECK (xp >= 0),
    level INTEGER NOT NULL DEFAULT 1 CHECK (level >= 1 AND level <= 100),
    rebirths INTEGER NOT NULL DEFAULT 0,
    play_time INTEGER NOT NULL DEFAULT 0,
    kills INTEGER NOT NULL DEFAULT 0,
    damage_dealt INTEGER NOT NULL DEFAULT 0,
    matches INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS capybaras (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL DEFAULT 'Capy',
    health INTEGER NOT NULL DEFAULT 100 CHECK (health BETWEEN 0 AND 100),
    energy INTEGER NOT NULL DEFAULT 100 CHECK (energy BETWEEN 0 AND 100),
    hunger INTEGER NOT NULL DEFAULT 100 CHECK (hunger BETWEEN 0 AND 100),
    happiness INTEGER NOT NULL DEFAULT 100 CHECK (happiness BETWEEN 0 AND 100),
    updated_at INTEGER NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS inventory (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_id TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    updated_at INTEGER NOT NULL,
    PRIMARY KEY (user_id, item_id)
  );
  CREATE INDEX IF NOT EXISTS idx_inventory_user ON inventory(user_id);`,
  `CREATE TABLE IF NOT EXISTS currency_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('EARN','SPEND','ADMIN_GIVE','ADMIN_REMOVE','ADMIN_SET','REFUND','REWARD')),
    currency TEXT NOT NULL DEFAULT 'coins' CHECK (currency IN ('coins','tokens')),
    amount INTEGER NOT NULL,
    balance_before INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    reason TEXT,
    created_by TEXT,
    created_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_tx_user ON currency_transactions(user_id);
  CREATE INDEX IF NOT EXISTS idx_tx_created ON currency_transactions(created_at);`,
  `CREATE TABLE IF NOT EXISTS admin_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    actor_user_id INTEGER,
    target_user_id INTEGER,
    action TEXT NOT NULL,
    metadata TEXT,
    success INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_logs_actor ON admin_logs(actor_user_id);
  CREATE INDEX IF NOT EXISTS idx_logs_target ON admin_logs(target_user_id);
  CREATE INDEX IF NOT EXISTS idx_logs_action ON admin_logs(action);
  CREATE INDEX IF NOT EXISTS idx_logs_created ON admin_logs(created_at);`,
  // Migração dos cargos Capyquake: remove o CHECK antigo (player/moderator/admin/owner)
  // reconstruindo a tabela e convertendo os roles legados. Preserva todas as contas.
  'REBUILD_USERS_ROLES'
];

function rebuildUsersRolesTable() {
  const legacyMap = `
    CASE role
      WHEN 'owner' THEN 'king'
      WHEN 'admin' THEN 'head_admin'
      WHEN 'moderator' THEN 'developer'
      WHEN 'player' THEN 'citizen'
      ELSE role
    END`;
  // fora de transacao: PRAGMA foreign_keys nao muda dentro de uma
  db.exec('PRAGMA foreign_keys = OFF');
  db.exec('BEGIN IMMEDIATE');
  try {
    db.exec(`CREATE TABLE users_new (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE COLLATE NOCASE,
      display_name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'citizen',
      status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','suspended','banned')),
      suspended_until INTEGER,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      last_login_at INTEGER
    )`);
    db.exec(`INSERT INTO users_new
      SELECT id, username, display_name, password_hash, ${legacyMap}, status, suspended_until, created_at, updated_at, last_login_at
      FROM users`);
    db.exec('DROP TABLE users');
    db.exec('ALTER TABLE users_new RENAME TO users');
    db.exec('CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)');
    db.exec('COMMIT');
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }
  db.exec('PRAGMA foreign_keys = ON');
}

// Migracao de rebuild precisa rodar FORA da transacao principal (PRAGMA foreign_keys).
function runMigrations() {
  const row = db.prepare(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='_migrations'"
  ).get();
  if (!row) db.exec('CREATE TABLE _migrations (id INTEGER PRIMARY KEY, applied_at INTEGER)');
  const applied = new Set(db.prepare('SELECT id FROM _migrations').all().map(r => r.id));

  const pending = MIGRATIONS.map((sql, i) => ({ sql, i })).filter(m => !applied.has(m.i));

  // Rebuild só se users existe com CHECK legado; em banco novo a migration 0 já cria o schema atual.
  for (const m of pending) {
    if (m.sql === 'REBUILD_USERS_ROLES') {
      const usersExists = db.prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='users'"
      ).get();
      if (!usersExists) continue;
      const hasLegacyCheck = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='users'")
        .get().sql.includes("role IN ('player','moderator','admin','owner')");
      if (!hasLegacyCheck) continue;
      rebuildUsersRolesTable();
      db.prepare('INSERT INTO _migrations (id, applied_at) VALUES (?, ?)').run(m.i, Date.now());
    }
  }

  db.exec('BEGIN IMMEDIATE');
  try {
    for (const m of pending) {
      if (m.sql === 'REBUILD_USERS_ROLES') continue;
      db.exec(m.sql);
      db.prepare('INSERT INTO _migrations (id, applied_at) VALUES (?, ?)').run(m.i, Date.now());
    }
    db.exec('COMMIT');
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }
}

runMigrations();

setInterval(() => {
  db.prepare('DELETE FROM sessions WHERE expires_at < ? OR revoked_at IS NOT NULL AND revoked_at < ?')
    .run(Date.now(), Date.now() - 86400000);
}, 3600000).unref();
