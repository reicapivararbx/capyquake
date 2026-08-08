async (page) => {
  const results = { steps: [], diag: {} };
  const browser = (typeof globalThis !== 'undefined' && globalThis.browser) || page.context().browser();

  async function domState(p) {
    return await p.evaluate(() => {
      const g = (id) => {
        const el = document.getElementById(id);
        if (!el) return 'MISSING';
        const cs = getComputedStyle(el);
        return cs.display + (el.hidden ? '/hidden' : '');
      };
      return {
        menu: g('menu'), lobby: g('lobby'), mapVote: g('map-vote'),
        shop: g('shop'), tutorial: g('tutorial'), hud: g('hud'),
        tutorialDone: localStorage.getItem('capiquake_tutorial_done'),
        startBtnDisplay: (() => {
          const el = document.getElementById('btn-start-game');
          if (!el) return 'MISSING';
          return getComputedStyle(el).display;
        })(),
      };
    });
  }

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
    await p.waitForTimeout(1000);
    const skip = p.locator('#btn-skip-tutorial');
    if (await skip.count() && await skip.isVisible().catch(() => false)) {
      await skip.click();
      await p.waitForTimeout(300);
    }
    await p.click('#btn-multiplayer');
    await p.waitForSelector('#lobby', { state: 'visible', timeout: 10000 });
    await p.fill('#lobby-player-name', name);
    return { ctx, page: p, errs, frames, name };
  }

  const p1 = await setupTab('Teste1');
  results.steps.push('setup p1 ok');
  const p2 = await setupTab('Teste2');
  results.steps.push('setup p2 ok');

  // Diagnóstico intermediário: ambos os lobbies devem estar visíveis
  results.diag.afterSetup = {
    p1: await domState(p1.page),
    p2: await domState(p2.page),
    p1FrameCount: p1.frames.length,
    p2FrameCount: p2.frames.length,
    p2Frames: p2.frames.slice(0, 20),
  };

  // click start com try/catch separado para saber QUAL falha
  try {
    await p1.page.click('#btn-start-game', { timeout: 8000 });
    results.steps.push('p1 start click ok');
  } catch (e) {
    results.steps.push('p1 start click FAIL: ' + e.message.split('\n')[0]);
    results.diag.p1StartFail = await domState(p1.page);
    results.diag.p1Frames = p1.frames.slice(-30);
  }
  await p1.page.waitForTimeout(500);
  results.diag.afterP1Start = {
    p1: await domState(p1.page),
    p2: await domState(p2.page),
  };

  try {
    await p2.page.click('#btn-start-game', { timeout: 8000 });
    results.steps.push('p2 start click ok');
  } catch (e) {
    results.steps.push('p2 start click FAIL: ' + e.message.split('\n')[0]);
    results.diag.p2StartFail = await domState(p2.page);
    results.diag.p2Frames = p2.frames.slice(-40);
    results.diag.p1FramesAtP2Fail = p1.frames.slice(-20);
  }

  // se ambos clicaram start, seguem fluxo normal
  try {
    await p1.page.waitForSelector('#map-vote', { state: 'visible', timeout: 5000 });
    results.steps.push('p1 map-vote visible');
    await p2.page.waitForSelector('#map-vote', { state: 'visible', timeout: 5000 });
    results.steps.push('p2 map-vote visible');

    await p1.page.click('.map-card >> nth=0');
    await p1.page.waitForSelector('#hud', { state: 'visible', timeout: 10000 });
    results.steps.push('p1 hud visible');
    await p2.page.waitForSelector('#hud', { state: 'visible', timeout: 10000 });
    results.steps.push('p2 hud visible');

    await p1.page.waitForTimeout(6000);

    results.diag.finalDom = { p1: await domState(p1.page), p2: await domState(p2.page) };
    await p1.page.screenshot({ path: '/tmp/opencode/def-tab1.png' });
    await p2.page.screenshot({ path: '/tmp/opencode/def-tab2.png' });
  } catch (e) {
    results.steps.push('FLOW FAIL: ' + e.message.split('\n')[0]);
    results.diag.flowFailDom = { p1: await domState(p1.page), p2: await domState(p2.page) };
    results.diag.p1FramesTail = p1.frames.slice(-30);
    results.diag.p2FramesTail = p2.frames.slice(-30);
    await p1.page.screenshot({ path: '/tmp/opencode/fail-tab1.png' }).catch(() => {});
    await p2.page.screenshot({ path: '/tmp/opencode/fail-tab2.png' }).catch(() => {});
  }

  function parseKeys(frames) {
    const keys = new Set();
    const counts = { stateUpdate: 0, gameStart: 0, joinSent: 0, positionSent: 0, players: 0 };
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
        if (m.type === 'players') counts.players++;
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
  results.p1Errors = p1.errs;
  results.p2Errors = p2.errs;

  await p1.ctx.close().catch(() => {});
  await p2.ctx.close().catch(() => {});

  return JSON.stringify(results, null, 2);
}
