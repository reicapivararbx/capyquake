async (page) => {
  const results = { steps: [], diag: {} };
  const browser = (typeof globalThis !== 'undefined' && globalThis.browser) || page.context().browser();
  const T0 = Date.now();
  const step = (label) => results.steps.push(`${((Date.now() - T0) / 1000).toFixed(1)}s ${label}`);

  async function setupTab(name) {
    const ctx = await browser.newContext();
    const p = await ctx.newPage();
    const errs = [];
    const frames = [];
    p.on('pageerror', e => errs.push(String(e)));
    p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    p.on('websocket', ws => {
      ws.on('framereceived', ({ payload }) => { try { frames.push(String(payload)); } catch (e) {} });
      ws.on('framesent', ({ payload }) => { try { frames.push('>>' + String(payload)); } catch (e) {} });
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

  // PROBE DECISIVO: lê estado da cena E pixels reais do framebuffer WebGL
  async function decisiveProbe(p) {
    return await p.evaluate(async () => {
      const THREE = await import('/node_modules/.vite/deps/three.js');
      const g = window.__game;
      if (!g) return { game: 'MISSING' };
      const cam = g.camera || (g.renderer && g.renderer.camera);
      const wgl = g.renderer && g.renderer.renderer; // THREE.WebGLRenderer
      const gl = wgl ? wgl.getContext() : null;
      const out = {
        mode: g.mode,
        playerName: g.playerName || null,
        camPos: cam ? [cam.position.x, cam.position.y, cam.position.z].map(n => Math.round(n * 100) / 100) : null,
        camQuat: cam ? cam.quaternion.toArray().map(n => Math.round(n * 10000) / 10000) : null,
        locked: g.player ? g.player.locked : null,
        thirdPerson: g.player ? g.player.thirdPerson : null,
        sceneChildCount: g.scene ? g.scene.children.length : null,
        rendererInfo: wgl ? { calls: wgl.info.render.calls, triangles: wgl.info.render.triangles } : null,
        glContext: !!gl,
        canvases: Array.from(document.querySelectorAll('canvas')).map(c => ({ id: c.id, w: c.width, h: c.height, cls: c.className })),
        remotePlayers: {},
      };
      if (g.remotePlayers) {
        for (const key of Object.keys(g.remotePlayers)) {
          const rp = g.remotePlayers[key];
          const wp = new THREE.Vector3();
          rp.mesh.getWorldPosition(wp);
          const camToMesh = wp.clone().sub(cam.position);
          const dist = camToMesh.length();
          const v = wp.clone().project(cam);
          const sx = Math.round((v.x + 1) / 2 * window.innerWidth);
          const sy = Math.round((1 - v.y) / 2 * window.innerHeight);
          const entry = {
            rpPos: [rp.position.x, rp.position.y, rp.position.z].map(n => Math.round(n * 100) / 100),
            meshWorld: [wp.x, wp.y, wp.z].map(n => Math.round(n * 100) / 100),
            inScene: g.scene ? g.scene.children.includes(rp.mesh) : null,
            visible: rp.mesh.visible,
            lastSeenAge: Math.round(performance.now() - rp.lastSeen),
            distToCam: Math.round(dist * 100) / 100,
            ndc: [Math.round(v.x * 1000) / 1000, Math.round(v.y * 1000) / 1000, Math.round(v.z * 1000) / 1000],
            screenPos: [sx, sy],
            frustumCulled: rp.mesh.children.map(c => ({ t: c.type, fc: c.frustumCulled })),
            materials: rp.mesh.children.map(c => c.material ? {
              type: c.material.type,
              color: c.material.color ? '#' + c.material.color.getHexString() : null,
              transparent: c.material.transparent,
              opacity: c.material.opacity,
              visible: c.material.visible !== false,
            } : null),
          };
          // FORÇA um render agora e lê pixels do framebuffer (sem overlay DOM)
          if (gl && wgl && cam) {
            // conta chamadas antes
            const callsBefore = wgl.info.render.calls;
            wgl.render(g.scene, cam); // render síncrono
            const callsAfter = wgl.info.render.calls;
            // varre uma região 41x41 ao redor da projeção do mesh
            const R = 20;
            const halfW = Math.min(sx, 10); // janela real limitada p/ não ler fora
            const xs = Math.max(0, sx - R), ys = Math.max(0, sy - R);
            const w = Math.min(2 * R + 1, window.innerWidth - xs);
            const h = Math.min(2 * R + 1, window.innerHeight - ys);
            const px = new Uint8Array(w * h * 4);
            gl.readPixels(xs, window.innerHeight - ys - h, w, h, gl.RGBA, gl.UNSIGNED_BYTE, px);
            let blue = 0, orange = 0, any = 0;
            const samples = [];
            for (let i = 0; i < w * h; i++) {
              const r = px[i * 4], gg = px[i * 4 + 1], b = px[i * 4 + 2];
              if (b > r + 40 && b > gg + 40) blue++;
              if (r > 180 && gg > 60 && gg < 140 && b < 80) orange++;
              any++;
            }
            // pixel do centro exato da tela (onde o crosshair DOM fica — framebuffer não tem DOM)
            const cx = Math.floor(window.innerWidth / 2), cy = Math.floor(window.innerHeight / 2);
            const cpx = new Uint8Array(4);
            gl.readPixels(cx, window.innerHeight - cy, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, cpx);
            entry.framebuffer = {
              callsBefore, callsAfter,
              region: { xs, ys, w, h },
              bluePx: blue, orangePx: orange,
              centerPixel: [cpx[0], cpx[1], cpx[2], cpx[3]],
              sampled: samples.slice(0, 8),
            };
          }
          out.remotePlayers[key] = entry;
        }
      }
      return out;
    });
  }

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

  function positionTrace(frames) {
    const trace = [];
    for (const f of frames) {
      if (!f.startsWith('>>')) continue;
      try {
        const m = JSON.parse(f.slice(2));
        if (m.type === 'position' && m.position) trace.push({ x: m.position.x, z: m.position.z });
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
        if (m.type === 'stateUpdate' && m.state && m.state[otherKey] && m.state[otherKey].position) {
          trace.push({ x: m.state[otherKey].position.x, z: m.state[otherKey].position.z });
        }
      } catch (e) {}
    }
    return trace;
  }
  function moved(trace) {
    if (trace.length < 5) return false;
    const first = trace[0], last = trace[trace.length - 1];
    return Math.abs(last.x - first.x) > 1 || Math.abs(last.z - first.z) > 1;
  }

  const p1 = await setupTab('Dec1');
  const p2 = await setupTab('Dec2');
  step('setup both ok');

  await p1.page.click('#btn-start-game', { timeout: 8000 });
  await p1.page.waitForTimeout(500);
  await p2.page.click('#btn-start-game', { timeout: 8000 });
  step('start clicks ok');

  await p1.page.waitForSelector('#map-vote', { state: 'visible', timeout: 10000 });
  await p2.page.waitForSelector('#map-vote', { state: 'visible', timeout: 10000 });
  results.diag.mapCardNames = await p1.page.evaluate(() => {
    return Array.from(document.querySelectorAll('.map-card .map-name')).map(el => el.textContent);
  });
  await p1.page.click('.map-card >> nth=0');
  await p1.page.waitForSelector('#hud', { state: 'visible', timeout: 30000 });
  await p2.page.waitForSelector('#hud', { state: 'visible', timeout: 30000 });
  step('hud visible both');

  await p1.page.waitForTimeout(2000);
  results.diag.lock = {
    p1: await injectPointerLock(p1.page),
    p2: await injectPointerLock(p2.page),
  };

  await p1.page.keyboard.down('w');
  await p2.page.keyboard.down('s');
  await p1.page.waitForTimeout(800);
  await p1.page.keyboard.up('w');
  await p2.page.keyboard.up('s');
  await p1.page.waitForTimeout(600);
  step('movement done');

  const s1 = lastState(p1.frames, 'Dec1', 'Dec2');
  const s2 = lastState(p2.frames, 'Dec2', 'Dec1');
  results.diag.lastState = { p1: s1, p2: s2 };

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
    step('p1 camera aimed at p2');
  }
  if (s2.selfPos && s2.otherPos && typeof s2.selfYaw === 'number') {
    aimResults.p2 = aimMovementX(s2.selfPos, s2.otherPos, s2.selfYaw, SENS);
    await p2.page.evaluate((mx) => {
      document.dispatchEvent(new MouseEvent('mousemove', { movementX: mx, movementY: 0 }));
    }, aimResults.p2);
    step('p2 camera aimed at p1');
  }
  results.diag.aim = aimResults;

  // PEQUENO delay p/ o render pegar o aim, mas BEM abaixo do timeout de 3s
  await p1.page.waitForTimeout(1200);

  // PROBE + SCREENSHOT IMEDIATOS (estado == momento da imagem)
  results.diag.probe = { p1: await decisiveProbe(p1.page), p2: await decisiveProbe(p2.page) };
  await p1.page.screenshot({ path: '/tmp/opencode/decisive-tab1.png' });
  await p2.page.screenshot({ path: '/tmp/opencode/decisive-tab2.png' });
  step('probe + screenshots saved');

  results.p1Moved = moved(positionTrace(p1.frames));
  results.p2Moved = moved(positionTrace(p2.frames));
  results.p1SawOtherMoving = moved(otherPlayerTrace(p1.frames, 'Dec2'));
  results.p2SawOtherMoving = moved(otherPlayerTrace(p2.frames, 'Dec1'));
  results.p1Errors = p1.errs;
  results.p2Errors = p2.errs;

  await p1.ctx.close().catch(() => {});
  await p2.ctx.close().catch(() => {});

  return JSON.stringify(results, null, 2);
}
