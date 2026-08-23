# CapiQuake — Sistema de Usuários, Economia e Admin

## Arquitetura

```
Jogo (Vite/vanilla JS) ──► API Node.js (server/index.js)
   │                            ├─ /api/auth/*      registro/login/logout (cookie HttpOnly)
   │                            ├─ /api/users/me    perfil completo
   │                            ├─ /api/game/*      report de partida e capivara
   │                            └─ /api/admin/*     painel (role+permission no backend)
   ├─ SQLite (node:sqlite, WAL) em $CAPYQUAKE_DB_PATH
   └─ WebSocket /ws (multiplayer, inalterado)
```

## Banco (migrations automáticas em server/db.js)

`users` · `sessions` · `game_profiles` · `capybaras` · `inventory` · `currency_transactions` · `admin_logs`

- Senha: **scrypt** com salt (nunca texto puro).
- Sessões: token aleatório de 32B, cookie `cq_session` HttpOnly/SameSite=Lax (+Secure atrás do nginx).
- XP/Level: fórmula oficial do jogo (`level*100`, cap 100) duplicada em `server/xplevel.js`.

## Roles & Permissões

`player < moderator < admin < owner`. Permissões granulares (`economy.give`, `users.ban`,
`roles.manage`…) verificadas SEMPRE no backend (server/api.js). Owner vem de env na inicialização.

## Painel Admin

- `/admin/login` — por usuário+senha OU pelo código administrativo (403 genérico em erro).
- `/admin` — dashboard real, busca de players, detalhes (conta/jogo/capivara/inventário/
  transações/logs), game tools (give/set coins·xp·level·item, level-up, max stats, heal,
  reset com confirmação por username, give-all), moderação (ban/suspend/unban), gestão de roles
  (só owner; sem auto-elevação) e audit logs filtráveis.
- Atalho secreto no jogo: digitar **admin** revela o botão do painel.

## Segurança

Rate limit (login/código/registro) · idempotency-key em mutações · transações atômicas
(BEGIN IMMEDIATE) · validação de todos os inputs com limites · clamps anti-abuso no report
de partida · secrets somente via `.env` (`cp .env.example .env`) · audit log sem segredos.

## Testes

```
node --test tests/*.test.mjs   # 11 testes: serviços + HTTP/segurança ponta a ponta
npm run build                  # build Vite
node scripts/generate-items.mjs # regenera server/items.json a partir da loja
```

## Deploy (VM)

Node >= 22.5 (24 LTS recomendado) por causa do `node:sqlite`.
`pm2 start server/index.js --name capyquake` · nginx :80/:443 → proxy 127.0.0.1:8080 (WS incluso).
