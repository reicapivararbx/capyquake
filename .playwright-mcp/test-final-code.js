async (page) => {
  const results = {};
  const browser = (typeof globalThis !== 'undefined' && globalThis.browser) || page.context().browser();

  async function setupTab(name) {
    const ctx = await browser.newContext();
    await ctx.addInitScript(() => {
      const orig = WebSocket.prototype.addEventListener;
      window.__stateKeys = new Set();
      window.__stateCount = 0;
      WebSocket.prototype.addEventListener = function (type, cb, opts) {
        if (type === 'message' && !this.__capiquakeHooked) {
          this.__capiquakeHooked = true;
          const wrapped = (ev) => {
            try {
              const txt = typeof ev.data === 'string' ? ev.data : new TextDecoder().decode(ev.data);
              const m = JSON.parse(txt);
              if (m.type === 'stateUpdate' && m.state) {
                Object.keys(m.state).forEach(k => window.__stateKeys.add(k));
                window.__stateCount++;
              }
            } catch (e) {}
            cb.call(this, ev);
          };
          return orig.call(this, type, wrapped, opts);
        }
        return orig.call(this, type, cb, opts);
      };
    });
    const p = await ctx.newPage();
    const errs = [];
    p.on('pageerror', e => errs.push(String(e)));
    p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    await p.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await p.waitForTimeout(800);
    const skip = p.locator('#btn-skip-tutorial');
    if (await skip.count() && await skip.isVisible().catch(() => false)) {
      await skip.click();
      await p.waitForTimeout(300);
    }
    await p.click('#btn-multiplayer');
    await p.waitForSelector('#lobby', { state: 'visible', timeout: 10000 });
    await p.fill('#lobby-player-name', name);
    return { ctx, page: p, errs };
  }

  const p1 = await setupTab('Teste1');
  const p2 = await setupTab('Teste2');

  // AMBOS clicam "Iniciar Partida" -> sendJoin(nome) registra o nome no servidor
  await p1.page.click('#btn-start-game');
  await p2.page.click('#btn-start-game');
  await p1.page.waitForSelector('#map-vote', { state: 'visible', timeout: 5000 });
  await p2.page.waitForSelector('#map-vote', { state: 'visible', timeout: 5000 });

  // Host (p1) escolhe o mapa -> broadcast gameStart para todos na sala
  await p1.page.click('.map-card >> nth=0');
  await p1.page.waitForSelector('#hud', { state: 'visible', timeout: 10000 });
  await p2.page.waitForSelector('#hud', { state: 'visible', timeout: 10000 });
  results.bothGamesStarted = true;

  // Coleta por 5s
  await p1.page.waitForTimeout(5000);
  await p2.page.waitForTimeout(5000);

  results.p1Keys = await p1.page.evaluate(() => Array.from(window.__stateKeys));
  results.p2Keys = await p2.page.evaluate(() => Array.from(window.__stateKeys));
  results.p1StateCount = await p1.page.evaluate(() => window.__stateCount);
  results.p2StateCount = await p2.page.evaluate(() => window.__stateCount);
  results.p1SeesTeste2 = results.p1Keys.includes('Teste2');
  results.p2SeesTeste1 = results.p2Keys.includes('Teste1');

  await p1.page.screenshot({ path: '/tmp/opencode/final-tab1.png' });
  await p2.page.screenshot({ path: '/tmp/opencode/final-tab2.png' });

  results.p1Errors = p1.errs;
  results.p2Errors = p2.errs;

  await p1.ctx.close().catch(() => {});
  await p2.ctx.close().catch(() => {});

  return JSON.stringify(results, null, 2);
}
