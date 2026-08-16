import * as THREE from 'three';

export class Celebration {
  static show(scores, playerDied, playerName, killedByBoss) {
    const celebEl = document.getElementById('celebration');
    celebEl.style.display = 'flex';

    const titleEl = celebEl.querySelector('h1');
    const subtitleEl = celebEl.querySelector('.churrasco-text');

    if (playerDied && killedByBoss) {
      titleEl.textContent = 'SONEGADOR!';
      subtitleEl.textContent = 'Voce não pagou seus impostos e o governo te viu sonegar!';
      celebEl.querySelector('#btn-play-again').textContent = 'Pagar as multas e recomecar';
    } else if (playerDied) {
      titleEl.textContent = 'PRESO!';
      subtitleEl.textContent = 'Você e seus amigos cometeram muitos crimes e foram pegos pelo IBAMA!';
      celebEl.querySelector('#btn-play-again').textContent = 'Pagar as multas e recomecar';
    } else {
      titleEl.textContent = 'PRESOS!';
      subtitleEl.textContent = 'Os animais foram capturados! Justica foi feita!';
      celebEl.querySelector('#btn-play-again').textContent = 'Jogar novamente';
    }

    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);

    const canvas = document.getElementById('fire-canvas');
    canvas.width = 900;
    canvas.height = 550;
    canvas.style.width = '900px';
    canvas.style.height = '550px';
    canvas.style.borderRadius = '4px';

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(900, 550);
    renderer.shadowMap.enabled = true;
    renderer.setClearColor(0x87CEEB);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x4a5a6a);

    const camera = new THREE.PerspectiveCamera(55, 900 / 550, 0.1, 80);
    camera.position.set(6, 4, 10);
    camera.lookAt(0, 1.5, 0);

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xffffee, 0.8);
    sun.position.set(10, 15, 8);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    scene.add(sun);

    const ceilLight = new THREE.PointLight(0xffcc88, 0.6, 15);
    ceilLight.position.set(0, 4, 0);
    scene.add(ceilLight);

    const groundGeo = new THREE.PlaneGeometry(30, 30);
    const groundMat = new THREE.MeshLambertMaterial({ color: 0x555550 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const backWallGeo = new THREE.BoxGeometry(16, 5, 0.3);
    const wallMat = new THREE.MeshLambertMaterial({ color: 0x6a6a60 });
    const backWall = new THREE.Mesh(backWallGeo, wallMat);
    backWall.position.set(0, 2.5, -3);
    backWall.castShadow = true;
    scene.add(backWall);

    const sideWall1 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 5, 8), wallMat);
    sideWall1.position.set(-8, 2.5, 1);
    scene.add(sideWall1);
    const sideWall2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 5, 8), wallMat);
    sideWall2.position.set(8, 2.5, 1);
    scene.add(sideWall2);

    let jumpers = [];
    if (playerDied && killedByBoss) {
      jumpers = Celebration.buildBossLoseScene(scene, sorted);
    } else if (playerDied) {
      jumpers = Celebration.buildLoseScene(scene, sorted);
    } else {
      jumpers = Celebration.buildJailScene(scene, sorted);
    }

    let time = 0;
    let animFrame;

    function animate() {
      animFrame = requestAnimationFrame(animate);
      time += 0.01;

      camera.position.x = Math.sin(time * 0.15) * 8;
      camera.position.z = 8 + Math.cos(time * 0.15) * 3;
      camera.position.y = 3.5 + Math.sin(time * 0.1) * 0.5;
      camera.lookAt(0, 1.5, 0);

      for (let i = 0; i < jumpers.length; i++) {
        const j = jumpers[i];
        j.position.y = j.userData.baseY + Math.abs(Math.sin((time * 8) + i * 1.5)) * 0.5;
      }

      renderer.render(scene, camera);
    }

    animate();

    const scoreboard = document.getElementById('final-scoreboard');
    scoreboard.replaceChildren();
    sorted.forEach(([name, score], i) => {
      const entry = document.createElement('div');
      entry.className = 'score-entry' + (i === 0 ? ' winner' : '');
      const nameSpan = document.createElement('span');
      nameSpan.className = 'name';
      nameSpan.textContent = (i === 0 ? '>>> ' : `${i + 1}. `) + name;
      const scoreSpan = document.createElement('span');
      scoreSpan.className = 'score';
      scoreSpan.textContent = score + ' pts';
      entry.appendChild(nameSpan);
      entry.appendChild(scoreSpan);
      scoreboard.appendChild(entry);
    });

    const btn = document.getElementById('btn-play-again');
    btn.addEventListener('click', () => {
      cancelAnimationFrame(animFrame);
      renderer.dispose();
    }, { once: true });
  }

  static buildJailScene(scene, sorted) {
    const barMat = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const frameMat = new THREE.MeshLambertMaterial({ color: 0x444444 });

    Celebration.buildCell(scene, -4, 0, barMat, frameMat);
    Celebration.buildCell(scene, 0, 0, barMat, frameMat);
    Celebration.buildCell(scene, 4, 0, barMat, frameMat);

    for (let i = 0; i < 3; i++) {
      const animal = Celebration.createAnimal();
      animal.position.set(-4 + (i - 1) * 0.9, 0, -1.5 + i * 0.3);
      scene.add(animal);
    }

    const animalTypes = [
      { color: 0x2a5a2a, name: 'jacare' },
      { color: 0x44aa44, name: 'tucano' },
      { color: 0x6a5a4a, name: 'anta' },
    ];

    const jacare = Celebration.createJacare();
    jacare.position.set(0, 0, -1.5);
    scene.add(jacare);

    const tucano = Celebration.createTucano();
    tucano.position.set(0.6, 0, -1);
    scene.add(tucano);

    const anta = Celebration.createAnta();
    anta.position.set(4, 0, -1.5);
    scene.add(anta);

    const sucuri = Celebration.createSucuri();
    sucuri.position.set(4.5, 0, -0.8);
    scene.add(sucuri);

    for (let i = 0; i < 3; i++) {
      const signGeo = new THREE.PlaneGeometry(1.2, 0.4);
      const signCanvas = document.createElement('canvas');
      signCanvas.width = 128;
      signCanvas.height = 48;
      const ctx = signCanvas.getContext('2d');
      ctx.fillStyle = '#dddddd';
      ctx.fillRect(0, 0, 128, 48);
      ctx.fillStyle = '#222222';
      ctx.font = 'bold 14px Courier New';
      ctx.textAlign = 'center';
      const labels = ['ANIMAIS', 'JACARE/TUCANO', 'ANTA/SUCURI'];
      ctx.fillText(labels[i], 64, 30);
      const signTex = new THREE.CanvasTexture(signCanvas);
      const signMat = new THREE.MeshBasicMaterial({ map: signTex });
      const sign = new THREE.Mesh(signGeo, signMat);
      sign.position.set(-4 + i * 4, 3.8, -2.4);
      scene.add(sign);
    }

    const playerColors = [0x446644, 0x664444, 0x444466, 0x666644];
    const jumpers = [];
    sorted.forEach(([name, score], i) => {
      const player = Celebration.createPlayerModel(name, score, i, playerColors[i % 4], i === 0);
      const angle = -0.8 + (i / Math.max(sorted.length - 1, 1)) * 1.6;
      const radius = 5.5;
      player.position.set(Math.sin(angle) * radius, 0, 3 + Math.cos(angle) * 2);
      player.userData.baseY = 0;
      player.lookAt(0, 1.5, 0);
      scene.add(player);
      jumpers.push(player);
    });
    return jumpers;
  }

  static buildLoseScene(scene, sorted) {
    const barMat = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const frameMat = new THREE.MeshLambertMaterial({ color: 0x444444 });

    const cellCount = Math.min(sorted.length, 3);
    const cellPositions = cellCount === 1 ? [0] : cellCount === 2 ? [-3, 3] : [-4, 0, 4];

    for (let i = 0; i < cellCount; i++) {
      Celebration.buildCell(scene, cellPositions[i], 0, barMat, frameMat);
    }

    const playerColors = [0x446644, 0x664444, 0x444466, 0x666644];
    sorted.forEach(([name, score], i) => {
      const cellIdx = i % cellCount;
      const offsetX = (i >= cellCount) ? (i - cellCount) * 0.6 - 0.3 : 0;

      const player = new THREE.Group();
      const bodyGeo = new THREE.BoxGeometry(0.5, 1.0, 0.35);
      const bodyMat = new THREE.MeshLambertMaterial({ color: playerColors[i % 4] });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.position.y = 1.0;
      player.add(body);

      const headGeo = new THREE.BoxGeometry(0.35, 0.35, 0.35);
      const headMat = new THREE.MeshLambertMaterial({ color: 0xddbb88 });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.y = 1.7;
      player.add(head);

      const legGeo = new THREE.BoxGeometry(0.18, 0.5, 0.2);
      const legMat = new THREE.MeshLambertMaterial({ color: 0x333344 });
      const legL = new THREE.Mesh(legGeo, legMat);
      legL.position.set(-0.15, 0.25, 0);
      player.add(legL);
      const legR = new THREE.Mesh(legGeo, legMat);
      legR.position.set(0.15, 0.25, 0);
      player.add(legR);

      const labelCanvas = document.createElement('canvas');
      labelCanvas.width = 256;
      labelCanvas.height = 48;
      const lCtx = labelCanvas.getContext('2d');
      lCtx.font = 'bold 24px Courier New';
      lCtx.fillStyle = '#ff4444';
      lCtx.textAlign = 'center';
      lCtx.fillText(name, 128, 30);
      const labelTex = new THREE.CanvasTexture(labelCanvas);
      const labelMat = new THREE.SpriteMaterial({ map: labelTex });
      const label = new THREE.Sprite(labelMat);
      label.position.y = 2.3;
      label.scale.set(1.4, 0.35, 1);
      player.add(label);

      player.position.set(cellPositions[cellIdx] + offsetX, 0, -1.5);
      scene.add(player);
    });

    for (let i = 0; i < cellCount; i++) {
      const signGeo = new THREE.PlaneGeometry(1.2, 0.4);
      const signCanvas = document.createElement('canvas');
      signCanvas.width = 128;
      signCanvas.height = 48;
      const ctx = signCanvas.getContext('2d');
      ctx.fillStyle = '#dddddd';
      ctx.fillRect(0, 0, 128, 48);
      ctx.fillStyle = '#aa0000';
      ctx.font = 'bold 14px Courier New';
      ctx.textAlign = 'center';
      ctx.fillText('PRESO', 64, 30);
      const signTex = new THREE.CanvasTexture(signCanvas);
      const signMat = new THREE.MeshBasicMaterial({ map: signTex });
      const sign = new THREE.Mesh(signGeo, signMat);
      sign.position.set(cellPositions[i], 3.8, -2.4);
      scene.add(sign);
    }

    const hatColors = [0x2222aa, 0x22aa22, 0xaa2222, 0xaaaa22, 0xaa22aa, 0x22aaaa];
    const jumpers = [];
    for (let i = 0; i < 4; i++) {
      const animal = Celebration.createAnimal();
      const angle = -0.8 + (i / 3) * 1.6;
      const radius = 5;
      animal.position.set(Math.sin(angle) * radius, 0, 3 + Math.cos(angle) * 2);
      animal.userData.baseY = 0;
      animal.lookAt(0, 0.8, 0);
      const hatGeo = new THREE.ConeGeometry(0.2, 0.3, 6);
      const hatMat = new THREE.MeshLambertMaterial({ color: hatColors[i] });
      const hat = new THREE.Mesh(hatGeo, hatMat);
      hat.position.set(0, 1.5, 0.3);
      animal.add(hat);
      scene.add(animal);
      jumpers.push(animal);
    }

    const jacare = Celebration.createJacare();
    jacare.position.set(-3, 0, 4.5);
    jacare.userData.baseY = 0;
    jacare.lookAt(0, 0.4, 0);
    scene.add(jacare);
    jumpers.push(jacare);

    const tucano = Celebration.createTucano();
    tucano.position.set(3.5, 0, 4);
    tucano.userData.baseY = 0;
    scene.add(tucano);
    jumpers.push(tucano);

    const anta = Celebration.createAnta();
    anta.position.set(-5, 0, 3);
    anta.userData.baseY = 0;
    anta.lookAt(0, 0.8, 0);
    scene.add(anta);
    jumpers.push(anta);

    return jumpers;
  }

  static buildBossLoseScene(scene, sorted) {
    const barMat = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const frameMat = new THREE.MeshLambertMaterial({ color: 0x444444 });

    Celebration.buildCell(scene, 0, 0, barMat, frameMat);

    const playerColors = [0x446644, 0x664444, 0x444466, 0x666644];
    sorted.forEach(([name, score], i) => {
      const player = new THREE.Group();
      const bodyGeo = new THREE.BoxGeometry(0.5, 1.0, 0.35);
      const bodyMat = new THREE.MeshLambertMaterial({ color: playerColors[i % 4] });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.position.y = 1.0;
      player.add(body);
      const headGeo = new THREE.BoxGeometry(0.35, 0.35, 0.35);
      const headMat = new THREE.MeshLambertMaterial({ color: 0xddbb88 });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.y = 1.7;
      player.add(head);
      const legGeo = new THREE.BoxGeometry(0.18, 0.5, 0.2);
      const legMat = new THREE.MeshLambertMaterial({ color: 0x333344 });
      const legL = new THREE.Mesh(legGeo, legMat);
      legL.position.set(-0.15, 0.25, 0);
      player.add(legL);
      const legR = new THREE.Mesh(legGeo, legMat);
      legR.position.set(0.15, 0.25, 0);
      player.add(legR);
      const labelCanvas = document.createElement('canvas');
      labelCanvas.width = 256;
      labelCanvas.height = 48;
      const lCtx = labelCanvas.getContext('2d');
      lCtx.font = 'bold 24px Courier New';
      lCtx.fillStyle = '#ff4444';
      lCtx.textAlign = 'center';
      lCtx.fillText(name, 128, 30);
      const labelTex = new THREE.CanvasTexture(labelCanvas);
      const labelMat = new THREE.SpriteMaterial({ map: labelTex });
      const label = new THREE.Sprite(labelMat);
      label.position.y = 2.3;
      label.scale.set(1.4, 0.35, 1);
      player.add(label);
      const offsetX = (i - (sorted.length - 1) / 2) * 0.8;
      player.position.set(offsetX, 0, -1.5);
      scene.add(player);
    });

    const signGeo = new THREE.PlaneGeometry(1.8, 0.5);
    const signCanvas = document.createElement('canvas');
    signCanvas.width = 192;
    signCanvas.height = 48;
    const sCtx = signCanvas.getContext('2d');
    sCtx.fillStyle = '#dddddd';
    sCtx.fillRect(0, 0, 192, 48);
    sCtx.fillStyle = '#aa0000';
    sCtx.font = 'bold 14px Courier New';
    sCtx.textAlign = 'center';
    sCtx.fillText('SONEGADOR', 96, 30);
    const signTex = new THREE.CanvasTexture(signCanvas);
    const signMeshMat = new THREE.MeshBasicMaterial({ map: signTex });
    const sign = new THREE.Mesh(signGeo, signMeshMat);
    sign.position.set(0, 3.8, -2.4);
    scene.add(sign);

    const boss = new THREE.Group();
    const suitMat = new THREE.MeshLambertMaterial({ color: 0x1a1a3a });
    const bossBody = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.8, 0.7), suitMat);
    bossBody.position.y = 2.0;
    bossBody.castShadow = true;
    boss.add(bossBody);
    const bossHeadMat = new THREE.MeshLambertMaterial({ color: 0xddbb88 });
    const bossHead = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.6), bossHeadMat);
    bossHead.position.y = 3.2;
    boss.add(bossHead);
    const tieMat = new THREE.MeshLambertMaterial({ color: 0xcc0000 });
    const tie = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.8, 0.08), tieMat);
    tie.position.set(0, 2.2, 0.4);
    boss.add(tie);
    const hatMat = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
    const hatBase = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.08, 8), hatMat);
    hatBase.position.y = 3.55;
    boss.add(hatBase);
    const hatTop = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.4, 8), hatMat);
    hatTop.position.y = 3.8;
    boss.add(hatTop);
    const armMat = new THREE.MeshLambertMaterial({ color: 0x1a1a3a });
    const armL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.2, 0.3), armMat);
    armL.position.set(-0.8, 2.0, 0);
    boss.add(armL);
    const armR = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.2, 0.3), armMat);
    armR.position.set(0.8, 2.0, 0);
    boss.add(armR);
    const legBossMat = new THREE.MeshLambertMaterial({ color: 0x1a1a2a });
    const legBL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.9, 0.35), legBossMat);
    legBL.position.set(-0.3, 0.45, 0);
    boss.add(legBL);
    const legBR = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.9, 0.35), legBossMat);
    legBR.position.set(0.3, 0.45, 0);
    boss.add(legBR);

    const bubbleCanvas = document.createElement('canvas');
    bubbleCanvas.width = 320;
    bubbleCanvas.height = 80;
    const bCtx = bubbleCanvas.getContext('2d');
    bCtx.fillStyle = '#ffffff';
    bCtx.beginPath();
    bCtx.roundRect(4, 4, 312, 56, 12);
    bCtx.fill();
    bCtx.strokeStyle = '#333333';
    bCtx.lineWidth = 2;
    bCtx.beginPath();
    bCtx.roundRect(4, 4, 312, 56, 12);
    bCtx.stroke();
    bCtx.beginPath();
    bCtx.moveTo(140, 60);
    bCtx.lineTo(150, 78);
    bCtx.lineTo(160, 60);
    bCtx.fillStyle = '#ffffff';
    bCtx.fill();
    bCtx.fillStyle = '#222222';
    bCtx.font = 'bold 15px Courier New';
    bCtx.textAlign = 'center';
    bCtx.fillText('vc n deveria ter sonegado...', 160, 38);
    const bubbleTex = new THREE.CanvasTexture(bubbleCanvas);
    const bubbleMat = new THREE.SpriteMaterial({ map: bubbleTex });
    const bubble = new THREE.Sprite(bubbleMat);
    bubble.position.y = 4.8;
    bubble.scale.set(3.5, 0.9, 1);
    boss.add(bubble);

    boss.position.set(4, 0, 3);
    boss.userData.baseY = 0;
    boss.lookAt(0, 1.5, 0);
    scene.add(boss);
    return [boss];
  }

  static buildCell(scene, x, z, barMat, frameMat) {
    const cellW = 3.2;
    const cellH = 4;
    const cellD = 3;

    const topBar = new THREE.Mesh(new THREE.BoxGeometry(cellW, 0.15, 0.15), frameMat);
    topBar.position.set(x, cellH, z - 2.5 + cellD / 2);
    scene.add(topBar);

    const bottomBar = new THREE.Mesh(new THREE.BoxGeometry(cellW, 0.15, 0.15), frameMat);
    bottomBar.position.set(x, 0.1, z - 2.5 + cellD / 2);
    scene.add(bottomBar);

    const barCount = 8;
    const spacing = cellW / (barCount + 1);
    for (let i = 1; i <= barCount; i++) {
      const bar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, cellH, 6),
        barMat
      );
      bar.position.set(x - cellW / 2 + i * spacing, cellH / 2, z - 2.5 + cellD / 2);
      bar.castShadow = true;
      scene.add(bar);
    }

    const leftBar = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, cellH, 6), frameMat);
    leftBar.position.set(x - cellW / 2, cellH / 2, z - 2.5 + cellD / 2);
    scene.add(leftBar);

    const rightBar = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, cellH, 6), frameMat);
    rightBar.position.set(x + cellW / 2, cellH / 2, z - 2.5 + cellD / 2);
    scene.add(rightBar);
  }

  static createAnimal() {
    const group = new THREE.Group();
    const bodyMat = new THREE.MeshLambertMaterial({ color: 0x8B6914 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 1.0), bodyMat);
    body.position.y = 0.7;
    body.castShadow = true;
    group.add(body);

    const headMat = new THREE.MeshLambertMaterial({ color: 0x9B7924 });
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.35, 0.45), headMat);
    head.position.set(0, 1.0, 0.45);
    group.add(head);

    const noseMat = new THREE.MeshLambertMaterial({ color: 0x5a3a10 });
    const nose = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.1, 0.1), noseMat);
    nose.position.set(0, 0.9, 0.7);
    group.add(nose);

    const legGeo = new THREE.BoxGeometry(0.12, 0.4, 0.12);
    const legMat = new THREE.MeshLambertMaterial({ color: 0x6B5910 });
    [[-0.2, 0.2, -0.3], [0.2, 0.2, -0.3], [-0.2, 0.2, 0.2], [0.2, 0.2, 0.2]].forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(lx, ly, lz);
      group.add(leg);
    });

    return group;
  }

  static createJacare() {
    const group = new THREE.Group();
    const bodyMat = new THREE.MeshLambertMaterial({ color: 0x2a5a2a });
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 1.5), bodyMat);
    body.position.y = 0.4;
    group.add(body);
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.2, 0.6), bodyMat);
    head.position.set(0, 0.45, 0.9);
    group.add(head);
    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.15, 0.8), bodyMat);
    tail.position.set(0, 0.35, -1.0);
    group.add(tail);
    return group;
  }

  static createTucano() {
    const group = new THREE.Group();
    const bodyMat = new THREE.MeshLambertMaterial({ color: 0x111111 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.35, 0.5), bodyMat);
    body.position.y = 0.8;
    group.add(body);
    const beakMat = new THREE.MeshLambertMaterial({ color: 0xff8800 });
    const beak = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.4), beakMat);
    beak.position.set(0, 0.85, 0.45);
    group.add(beak);
    const legMat = new THREE.MeshLambertMaterial({ color: 0x444444 });
    const leg1 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.4, 0.04), legMat);
    leg1.position.set(-0.08, 0.4, 0);
    group.add(leg1);
    const leg2 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.4, 0.04), legMat);
    leg2.position.set(0.08, 0.4, 0);
    group.add(leg2);
    return group;
  }

  static createAnta() {
    const group = new THREE.Group();
    const bodyMat = new THREE.MeshLambertMaterial({ color: 0x5a4a3a });
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.6, 1.2), bodyMat);
    body.position.y = 0.8;
    group.add(body);
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.5), bodyMat);
    head.position.set(0, 1.0, 0.7);
    group.add(head);
    const snout = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.15, 0.3), bodyMat);
    snout.position.set(0, 0.9, 1.0);
    group.add(snout);
    const legGeo = new THREE.BoxGeometry(0.15, 0.5, 0.15);
    const legMat = new THREE.MeshLambertMaterial({ color: 0x4a3a2a });
    [[-0.25, 0.25, -0.4], [0.25, 0.25, -0.4], [-0.25, 0.25, 0.3], [0.25, 0.25, 0.3]].forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(lx, ly, lz);
      group.add(leg);
    });
    return group;
  }

  static createSucuri() {
    const group = new THREE.Group();
    const bodyMat = new THREE.MeshLambertMaterial({ color: 0x3a5a2a });
    for (let i = 0; i < 8; i++) {
      const segment = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 5, 4),
        bodyMat
      );
      segment.position.set(Math.sin(i * 0.5) * 0.3, 0.15, i * 0.2 - 0.7);
      segment.scale.set(1, 0.7, 1);
      group.add(segment);
    }
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.1, 0.2), bodyMat);
    head.position.set(Math.sin(4) * 0.3, 0.2, 0.9);
    group.add(head);
    return group;
  }

  static createPlayerModel(name, score, index, color, isWinner) {
    const player = new THREE.Group();

    const bodyGeo = new THREE.BoxGeometry(0.5, 1.2, 0.35);
    const bodyMat = new THREE.MeshLambertMaterial({ color });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.2;
    body.castShadow = true;
    player.add(body);

    const headGeo = new THREE.BoxGeometry(0.35, 0.35, 0.35);
    const headMat = new THREE.MeshLambertMaterial({ color: 0xddbb88 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 2.0;
    head.castShadow = true;
    player.add(head);

    const armGeo = new THREE.BoxGeometry(0.15, 0.7, 0.15);
    const armMat = new THREE.MeshLambertMaterial({ color });
    const armL = new THREE.Mesh(armGeo, armMat);
    armL.position.set(-0.4, 1.6, 0);
    armL.rotation.z = 0.5 + Math.random() * 0.5;
    player.add(armL);
    const armR = new THREE.Mesh(armGeo, armMat);
    armR.position.set(0.4, 1.6, 0);
    armR.rotation.z = -(0.5 + Math.random() * 0.5);
    player.add(armR);

    const legGeo = new THREE.BoxGeometry(0.18, 0.7, 0.2);
    const legMat = new THREE.MeshLambertMaterial({ color: 0x333344 });
    const legL = new THREE.Mesh(legGeo, legMat);
    legL.position.set(-0.15, 0.35, 0);
    player.add(legL);
    const legR = new THREE.Mesh(legGeo, legMat);
    legR.position.set(0.15, 0.35, 0);
    player.add(legR);

    if (isWinner) {
      const hatGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.3, 6);
      const hatMat = new THREE.MeshLambertMaterial({ color: 0xffcc00 });
      const hat = new THREE.Mesh(hatGeo, hatMat);
      hat.position.y = 2.3;
      player.add(hat);
    }

    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 256;
    labelCanvas.height = 64;
    const lCtx = labelCanvas.getContext('2d');
    lCtx.font = 'bold 28px Courier New';
    lCtx.fillStyle = isWinner ? '#ffcc00' : '#ffffff';
    lCtx.textAlign = 'center';
    lCtx.fillText(name, 128, 28);
    lCtx.font = '20px Courier New';
    lCtx.fillStyle = '#88cc44';
    lCtx.fillText(`${score} pts`, 128, 52);
    const labelTex = new THREE.CanvasTexture(labelCanvas);
    const labelMat = new THREE.SpriteMaterial({ map: labelTex });
    const label = new THREE.Sprite(labelMat);
    label.position.y = 2.7;
    label.scale.set(1.5, 0.4, 1);
    player.add(label);

    return player;
  }
}
