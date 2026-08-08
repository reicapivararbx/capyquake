async (page) => {
  const results = {};
  const browser = (typeof globalThis !== 'undefined' && globalThis.browser) || page.context().browser();

  async function setupTab(name) {
    const ctx = await browser.newContext();
    const p = await ctx.newPage();
    const errs = [];
    const frames = [];
    p.on('pageerror', e => errs.push(String(e)));
    p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    p.on('websocket', ws => {
      ws.on('framereceived', ({ payload }) => {
        try { frames.push(String(payload)); } catch (e) {}
      });
      ws.on('framesent', ({ payload }) => {
        try { frames.push('>>' + String(payload)); } catch (e) {}
      });
    });
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
    return { ctx, page: p, errs, frames };
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

  // Coleta por 6s
  await p1.page.waitForTimeout(6000);
  await p2.page.waitForTimeout(6000);

  // Parseia frames recebidos: stateUpdate -> chaves
  function parseKeys(frames) {
    const keys = new Set();
    const counts = { stateUpdate: 0, gameStart: 0, joinSent: 0, positionSent: 0 };
    for (const f of frames) {
      try {
        if (f.startsWith('>>')) {
          const m = JSON.parse(f.slice(2));
          if (m.type === 'join') counts.joinSent++;
          if (m.type === 'position') counts.positionSent++;
          continue;
        }
        const m = JSON.parse(f);
        if (m.type === 'stateUpdate' && m.state) {
          counts.stateUpdate++;
          Object.keys(m.state).forEach(k => keys.add(k));
        }
        if (m.type === 'gameStart') counts.gameStart++;
      } catch (e) {}
    }
    return { keys: Array.from(keys), counts };
  }

  const p1Parsed = parseKeys(p1.frames);
  const p2Parsed = parseKeys(p2.frames);
  results.p1Keys = p1Parsed.keys;
  results.p2Keys = p2Parsed.keys;
  results.p1Counts = p1Parsed.counts;
  results.p2Counts = p2Parsed.counts;
  results.p1SeesTeste2 = p1Parsed.keys.includes('Teste2');
  results.p2SeesTeste1 = p2Parsed.keys.includes('Teste1');

  await p1.page.screenshot({ path: '/tmp/opencode/def-tab1.png' });
  await p2.page.screenshot({ path: '/tmp/opencode/def-tab2.png' });

  results.p1Errors = p1.errs;
  results.p2Errors = p2.errs;

  await p1.ctx.close().catch(() => {});
  await p2.ctx.close().catch(() => {});

  return JSON.stringify(results, null, 2);
}
