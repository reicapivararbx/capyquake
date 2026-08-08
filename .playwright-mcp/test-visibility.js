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

  async function injectPointerLock(p) {
    return await p.evaluate(() => {
      const canvas = document.querySelector('body > canvas')
        || Array.from(document.querySelectorAll('canvas')).find(c => c.id !== 'fire-canvas');
      if (!canvas) return 'NO_CANVAS';
      Object.defineProperty(document, 'pointerLockElement', {
        configurable: true,
        get: () => canvas,
      });
      document.dispatchEvent(new Event('pointerlockchange'));
      return 'INJECTED canvas=' + (canvas.id || '(renderer)');
    });
  }

  const p1 = await setupTab('Vis1');
  const p2 = await setupTab('Vis2');
  results.steps.push('setup both ok');

  await p1.page.click('#btn-start-game', { timeout: 8000 });
  await p1.page.waitForTimeout(500);
  await p2.page.click('#btn-start-game', { timeout: 8000 });
  results.steps.push('start clicks ok');

  await p1.page.waitForSelector('#map-vote', { state: 'visible', timeout: 5000 });
  await p2.page.waitForSelector('#map-vote', { state: 'visible', timeout: 5000 });
  results.steps.push('map-vote visible both');

  await p1.page.click('.map-card >> nth=0');
  await p1.page.waitForSelector('#hud', { state: 'visible', timeout: 10000 });
  await p2.page.waitForSelector('#hud', { state: 'visible', timeout: 10000 });
  results.steps.push('hud visible both');

  await p1.page.waitForTimeout(2000);
  results.diag.lock = {
    p1: await injectPointerLock(p1.page),
    p2: await injectPointerLock(p2.page),
  };

  // Movimento curto: p1 'w' (frente), p2 's' (trás) por 0.8s -> ~12u cada, ~24u de separação
  await p1.page.keyboard.down('w');
  await p2.page.keyboard.down('s');
  await p1.page.waitForTimeout(800);
  await p1.page.keyboard.up('w');
  await p2.page.keyboard.up('s');
  await p1.page.waitForTimeout(600);
  results.steps.push('movement 0.8s done');

  function lastState(frames, selfKey, otherKey) {
    let selfPos = null, selfYaw = null, otherPos = null, otherYaw = null;
    for (const f of frames) {
      try {
        if (f.startsWith('>>')) {
          const m = JSON.parse(f.slice(2));
          if (m.type === 'position' && m.position) {
            selfPos = { x: m.position.x, z: m.position.z };
            if (m.rotation && typeof m.rotation.y === 'number') selfYaw = m.rotation.y;
          }
          continue;
        }
        const m = JSON.parse(f);
        if (m.type === 'stateUpdate' && m.state && m.state[otherKey]) {
          const o = m.state[otherKey];
          otherPos = o && o.position ? { x: o.position.x, z: o.position.z } : null;
          otherYaw = o && o.rotation && typeof o.rotation.y === 'number' ? o.rotation.y : null;
        }
      } catch (e) {}
    }
    return { selfPos, selfYaw, otherPos, otherYaw };
  }

  const s1 = lastState(p1.frames, 'Vis1', 'Vis2');
  const s2 = lastState(p2.frames, 'Vis2', 'Vis1');
  results.diag.lastState = { p1: s1, p2: s2 };

  // Mira as câmeras uma na outra.
  // Forward da câmera com yaw theta (three.js, sem pitch): (-sin theta, 0, -cos theta).
  // Para p1 olhar para p2: (-sin t1, -cos t1) ∝ (dx, dz)  =>  t1 = atan2(-dx, -dz).
  // O handler de mousemove faz euler.y -= movementX * sens, logo:
  // movementX = (yawAtual - tAlvo) / sens, normalizado para [-PI, PI].
  function aimMovementX(from, to, currentYaw, sens) {
    const dx = to.x - from.x;
    const dz = to.z - from.z;
    const targetYaw = Math.atan2(-dx, -dz);
    let delta = currentYaw - targetYaw;
    delta = ((delta + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;
    return delta / sens;
  }

  const SENS = 0.002;
  const aimResults = { p1: null, p2: null };
  if (s1.selfPos && s1.otherPos && typeof s1.selfYaw === 'number') {
    aimResults.p1 = aimMovementX(s1.selfPos, s1.otherPos, s1.selfYaw, SENS);
    await p1.page.evaluate((mx) => {
      document.dispatchEvent(new MouseEvent('mousemove', { movementX: mx, movementY: 0 }));
    }, aimResults.p1);
    results.steps.push('p1 camera aimed at p2');
  } else {
    results.steps.push('p1 aim SKIPPED (missing data)');
  }
  if (s2.selfPos && s2.otherPos && typeof s2.selfYaw === 'number') {
    aimResults.p2 = aimMovementX(s2.selfPos, s2.otherPos, s2.selfYaw, SENS);
    await p2.page.evaluate((mx) => {
      document.dispatchEvent(new MouseEvent('mousemove', { movementX: mx, movementY: 0 }));
    }, aimResults.p2);
    results.steps.push('p2 camera aimed at p1');
  } else {
    results.steps.push('p2 aim SKIPPED (missing data)');
  }
  results.diag.aim = aimResults;

  await p1.page.waitForTimeout(1500);

  results.diag.finalDom = { p1: await domState(p1.page), p2: await domState(p2.page) };
  await p1.page.screenshot({ path: '/tmp/opencode/def-vis-tab1.png' });
  await p2.page.screenshot({ path: '/tmp/opencode/def-vis-tab2.png' });
  results.steps.push('screenshots saved');

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

  function otherPlayerTrace(frames, otherKey) {
    const trace = [];
    for (const f of frames) {
      if (f.startsWith('>>')) continue;
      try {
        const m = JSON.parse(f);
        if (m.type === 'stateUpdate' && m.state && m.state[otherKey]) {
          const o = m.state[otherKey];
          if (o && o.position) {
            trace.push({ t: trace.length, x: Math.round(o.position.x * 10) / 10, z: Math.round(o.position.z * 10) / 10 });
          }
        }
      } catch (e) {}
    }
    return trace;
  }

  const p1Trace = positionTrace(p1.frames);
  const p2Trace = positionTrace(p2.frames);
  const p1SeesOther = otherPlayerTrace(p1.frames, 'Vis2');
  const p2SeesOther = otherPlayerTrace(p2.frames, 'Vis1');

  function summarize(trace) {
    if (trace.length === 0) return { count: 0 };
    const idxs = [0, Math.floor(trace.length / 4), Math.floor(trace.length / 2), Math.floor(3 * trace.length / 4), trace.length - 1];
    return { count: trace.length, samples: idxs.map(i => trace[i]) };
  }

  function moved(trace) {
    if (trace.length < 5) return false;
    const first = trace[0];
    const last = trace[trace.length - 1];
    return Math.abs(last.x - first.x) > 1 || Math.abs(last.z - first.z) > 1;
  }

  results.p1Moved = moved(p1Trace);
  results.p2Moved = moved(p2Trace);
  results.p1SawOtherMoving = moved(p1SeesOther);
  results.p2SawOtherMoving = moved(p2SeesOther);
  results.p1Positions = summarize(p1Trace);
  results.p2Positions = summarize(p2Trace);
  results.p1SeesOtherTrace = summarize(p1SeesOther);
  results.p2SeesOtherTrace = summarize(p2SeesOther);
  results.separation = (() => {
    if (!s1.selfPos || !s2.selfPos) return null;
    const dx = s1.selfPos.x - s2.selfPos.x;
    const dz = s1.selfPos.z - s2.selfPos.z;
    return Math.round(Math.sqrt(dx * dx + dz * dz) * 10) / 10;
  })();
  results.p1Errors = p1.errs;
  results.p2Errors = p2.errs;

  await p1.ctx.close().catch(() => {});
  await p2.ctx.close().catch(() => {});

  return JSON.stringify(results, null, 2);
}
