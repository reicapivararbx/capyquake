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

  // Injeta pointer lock fake: document.pointerLockElement -> canvas, dispara pointerlockchange.
  // O handler em player.js define this.locked = true, destravando o update() (movimento).
  async function injectPointerLock(p) {
    return await p.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return 'NO_CANVAS';
      Object.defineProperty(document, 'pointerLockElement', {
        configurable: true,
        get: () => canvas,
      });
      document.dispatchEvent(new Event('pointerlockchange'));
      return 'INJECTED';
    });
  }

  const p1 = await setupTab('Move1');
  results.steps.push('setup p1 ok');
  const p2 = await setupTab('Move2');
  results.steps.push('setup p2 ok');

  results.diag.afterSetup = {
    p1: await domState(p1.page),
    p2: await domState(p2.page),
  };

  // Fluxo de início de partida (mesmo do teste v2)
  try {
    await p1.page.click('#btn-start-game', { timeout: 8000 });
    results.steps.push('p1 start click ok');
  } catch (e) {
    results.steps.push('p1 start click FAIL: ' + e.message.split('\n')[0]);
  }
  await p1.page.waitForTimeout(500);
  try {
    await p2.page.click('#btn-start-game', { timeout: 8000 });
    results.steps.push('p2 start click ok');
  } catch (e) {
    results.steps.push('p2 start click FAIL: ' + e.message.split('\n')[0]);
  }

  try {
    await p1.page.waitForSelector('#map-vote', { state: 'visible', timeout: 5000 });
    await p2.page.waitForSelector('#map-vote', { state: 'visible', timeout: 5000 });
    results.steps.push('map-vote visible both');

    await p1.page.click('.map-card >> nth=0');
    await p1.page.waitForSelector('#hud', { state: 'visible', timeout: 10000 });
    await p2.page.waitForSelector('#hud', { state: 'visible', timeout: 10000 });
    results.steps.push('hud visible both');

    // Aguarda sincronização inicial (positions começam a trafegar)
    await p1.page.waitForTimeout(2500);
    results.diag.hudDom = { p1: await domState(p1.page), p2: await domState(p2.page) };

    // Destrava movimento nos dois
    results.diag.lock = {
      p1: await injectPointerLock(p1.page),
      p2: await injectPointerLock(p2.page),
    };

    // Ponto de partida: posições no frame de position antes de andar
    const snapBefore = await p1.page.evaluate(() => {
      return (window.__lastPositions = null) !== null ? null : null; // noop guard
    });

    // Move: p1 para frente (-z), p2 para trás (+z) -> se afastam no eixo z
    await p1.page.keyboard.down('w');
    await p2.page.keyboard.down('s');
    await p1.page.waitForTimeout(4000);
    await p1.page.keyboard.up('w');
    await p2.page.keyboard.up('s');
    results.steps.push('movement 4s ok');

    // Gira a câmera do p1 em 180° (olha para +z, na direção do p2 que andou para trás).
    // euler.y -= movementX * sensitivity  =>  180° = PI rad => movementX ~= 1571
    await p1.page.evaluate(() => {
      document.dispatchEvent(new MouseEvent('mousemove', { movementX: 1571, movementY: 0 }));
    });
    results.steps.push('p1 camera rotated 180deg');
    await p1.page.waitForTimeout(1500);

    results.diag.finalDom = { p1: await domState(p1.page), p2: await domState(p2.page) };
    await p1.page.screenshot({ path: '/tmp/opencode/def-move-tab1.png' });
    await p2.page.screenshot({ path: '/tmp/opencode/def-move-tab2.png' });
    results.steps.push('screenshots saved');
  } catch (e) {
    results.steps.push('FLOW FAIL: ' + e.message.split('\n')[0]);
    results.diag.flowFailDom = { p1: await domState(p1.page), p2: await domState(p2.page) };
    await p1.page.screenshot({ path: '/tmp/opencode/fail-move-tab1.png' }).catch(() => {});
    await p2.page.screenshot({ path: '/tmp/opencode/fail-move-tab2.png' }).catch(() => {});
  }

  // Prova de movimento: extrai as posições enviadas por cada jogador ao longo do tempo
  function positionTrace(frames) {
    const trace = [];
    for (const f of frames) {
      if (!f.startsWith('>>')) continue;
      try {
        const m = JSON.parse(f.slice(2));
        if (m.type === 'position' && m.position) {
          trace.push({ t: trace.length, x: Math.round(m.position.x * 10) / 10, z: Math.round(m.position.z * 10) / 10 });
        }
      } catch (e) {}
    }
    return trace;
  }

  function stateUpdateTrace(frames) {
    const trace = [];
    for (const f of frames) {
      if (f.startsWith('>>')) continue;
      try {
        const m = JSON.parse(f);
        if (m.type === 'stateUpdate' && m.state) {
          const entry = trace.length;
          const row = { t: entry };
          for (const [k, v] of Object.entries(m.state)) {
            if (v && typeof v.x === 'number') {
              row[k] = { x: Math.round(v.x * 10) / 10, z: Math.round(v.z * 10) / 10 };
            }
          }
          trace.push(row);
        }
      } catch (e) {}
    }
    return trace;
  }

  const p1Trace = positionTrace(p1.frames);
  const p2Trace = positionTrace(p2.frames);

  // Amostragem: primeira, última e algumas intermediárias da trace
  function summarize(trace, label) {
    if (trace.length === 0) return { label, count: 0 };
    const idxs = [0, Math.floor(trace.length / 4), Math.floor(trace.length / 2), Math.floor(3 * trace.length / 4), trace.length - 1];
    return {
      label,
      count: trace.length,
      samples: idxs.map(i => trace[i]),
    };
  }

  results.p1Positions = summarize(p1Trace, 'p1 (Move1) sent positions');
  results.p2Positions = summarize(p2Trace, 'p2 (Move2) sent positions');
  results.p1StateUpdate = stateUpdateTrace(p1.frames);
  results.p2StateUpdate = stateUpdateTrace(p2.frames);

  // Verdict de movimento: a posição z (ou x) enviada mudou além de 1 unidade entre o primeiro e o último frame
  function moved(trace) {
    if (trace.length < 5) return false;
    const first = trace[0];
    const last = trace[trace.length - 1];
    return Math.abs(last.x - first.x) > 1 || Math.abs(last.z - first.z) > 1;
  }
  results.p1Moved = moved(p1Trace);
  results.p2Moved = moved(p2Trace);

  results.p1Errors = p1.errs;
  results.p2Errors = p2.errs;

  await p1.ctx.close().catch(() => {});
  await p2.ctx.close().catch(() => {});

  return JSON.stringify(results, null, 2);
}
