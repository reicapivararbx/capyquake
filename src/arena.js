import * as THREE from 'three';

const CELL_SIZE = 4;
const ARENA_COLS = 130;
const ARENA_ROWS = 130;

function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function generateOpenMap(seed) {
  const rng = seededRandom(seed);
  const map = [];
  for (let r = 0; r < ARENA_ROWS; r++) {
    const row = [];
    for (let c = 0; c < ARENA_COLS; c++) {
      if (r === 0 || r === ARENA_ROWS - 1 || c === 0 || c === ARENA_COLS - 1) {
        row.push(0);
      } else {
        row.push(1);
      }
    }
    map.push(row);
  }

  const zones = [];
  const zoneCount = 12;
  const minDist = 8;

  for (let i = 0; i < zoneCount; i++) {
    let attempts = 0;
    while (attempts < 50) {
      const cr = Math.floor(rng() * (ARENA_ROWS - 12)) + 6;
      const cc = Math.floor(rng() * (ARENA_COLS - 12)) + 6;
      let tooClose = false;
      for (const z of zones) {
        const dr = cr - z.r;
        const dc = cc - z.c;
        if (Math.sqrt(dr * dr + dc * dc) < minDist) {
          tooClose = true;
          break;
        }
      }
      if (!tooClose) {
        zones.push({ r: cr, c: cc, id: i });
        break;
      }
      attempts++;
    }
  }

  const zoneRadius = 4;
  for (const zone of zones) {
    for (let dr = -zoneRadius; dr <= zoneRadius; dr++) {
      for (let dc = -zoneRadius; dc <= zoneRadius; dc++) {
        if (dr * dr + dc * dc <= zoneRadius * zoneRadius) {
          const r = zone.r + dr;
          const c = zone.c + dc;
          if (r > 0 && r < ARENA_ROWS - 1 && c > 0 && c < ARENA_COLS - 1) {
            map[r][c] = zone.id + 3;
          }
        }
      }
    }
  }

  return map;
}

export class Arena {
  constructor(scene, theme) {
    this.scene = scene;
    this.rooms = {};
    this.activatedRooms = new Set();
    this.roomActivationCallbacks = [];
    this.doors = [];

    this.theme = theme || {
      floor: 0x2d2d28, light: 0xff6622, fog: 0x0a0a0a, ambient: 0x444444, seed: 1000, terrain: 'ruins', sky: 0x2a2a3a
    };

    this.rng = seededRandom(this.theme.seed || 1000);
    this.map = generateOpenMap(this.theme.seed || 1000);

    this.buildGround();
    this.buildBoundary();
    this.buildTerrain();
    this.findRooms();
  }

  getMapWidth() { return ARENA_COLS * CELL_SIZE; }
  getMapHeight() { return ARENA_ROWS * CELL_SIZE; }

  worldToGrid(x, z) {
    const col = Math.floor(x / CELL_SIZE);
    const row = Math.floor(z / CELL_SIZE);
    return { row, col };
  }

  isWall(x, z) {
    const { row, col } = this.worldToGrid(x, z);
    if (row < 0 || row >= ARENA_ROWS || col < 0 || col >= ARENA_COLS) return true;
    return this.map[row][col] === 0;
  }

  isPassable(x, z) {
    return !this.isWall(x, z);
  }

  onRoomActivation(cb) {
    this.roomActivationCallbacks.push(cb);
  }

  findRooms() {
    for (let r = 0; r < ARENA_ROWS; r++) {
      for (let c = 0; c < ARENA_COLS; c++) {
        const cell = this.map[r][c];
        if (cell >= 3) {
          const roomId = cell - 3;
          if (!this.rooms[roomId]) this.rooms[roomId] = [];
          this.rooms[roomId].push({
            x: c * CELL_SIZE + CELL_SIZE / 2,
            z: r * CELL_SIZE + CELL_SIZE / 2
          });
        }
      }
    }
  }

  getRoomSpawnPoints(roomId) {
    return this.rooms[roomId] || [];
  }

  getRandomSpawnInRoom(roomId) {
    const pts = this.rooms[roomId];
    if (!pts || pts.length === 0) return { x: 10, z: 10 };
    return pts[Math.floor(Math.random() * pts.length)];
  }

  getRandomSpawnPoint() {
    const allPts = Object.values(this.rooms).flat();
    if (allPts.length === 0) return { x: 10, z: 10 };
    return allPts[Math.floor(Math.random() * allPts.length)];
  }

  getPlayerStart() {
    const cx = Math.floor(ARENA_COLS / 2) * CELL_SIZE + CELL_SIZE / 2;
    const cz = Math.floor(ARENA_ROWS / 2) * CELL_SIZE + CELL_SIZE / 2;
    return { x: cx, z: cz };
  }

  updateDoors(playerPos) {
    if (this.activatedRooms.size < Object.keys(this.rooms).length) {
      for (const roomId of Object.keys(this.rooms).map(Number)) {
        if (this.activatedRooms.has(roomId)) continue;
        const pts = this.rooms[roomId];
        for (const pt of pts) {
          const dx = playerPos.x - pt.x;
          const dz = playerPos.z - pt.z;
          if (Math.sqrt(dx * dx + dz * dz) < 20) {
            this.activatedRooms.add(roomId);
            for (const cb of this.roomActivationCallbacks) {
              cb(roomId);
            }
            break;
          }
        }
      }
    }
  }

  isRoomActive(roomId) {
    return this.activatedRooms.has(roomId);
  }

  getRoomIds() {
    return Object.keys(this.rooms).map(Number);
  }

  buildGround() {
    const w = ARENA_COLS * CELL_SIZE;
    const h = ARENA_ROWS * CELL_SIZE;
    const groundGeo = new THREE.PlaneGeometry(w, h);
    const groundMat = new THREE.MeshLambertMaterial({ color: this.theme.floor });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(w / 2, 0, h / 2);
    ground.receiveShadow = true;
    this.scene.add(ground);

    const gridMat = new THREE.MeshLambertMaterial({ color: this.theme.floor + 0x080808, transparent: true, opacity: 0.3 });
    for (let i = 0; i < 20; i++) {
      const sx = 2 + this.rng() * (w - 4);
      const sz = 2 + this.rng() * (h - 4);
      const size = 3 + this.rng() * 8;
      const patchGeo = new THREE.PlaneGeometry(size, size);
      const patch = new THREE.Mesh(patchGeo, gridMat);
      patch.rotation.x = -Math.PI / 2;
      patch.rotation.z = this.rng() * Math.PI;
      patch.position.set(sx, 0.01, sz);
      this.scene.add(patch);
    }
  }

  buildBoundary() {
    const w = ARENA_COLS * CELL_SIZE;
    const h = ARENA_ROWS * CELL_SIZE;
    const wallH = 3;
    const wallMat = new THREE.MeshLambertMaterial({ color: this.theme.floor - 0x0a0a0a, transparent: true, opacity: 0.7 });

    const sides = [
      { pos: [w / 2, wallH / 2, 0], size: [w, wallH, 1] },
      { pos: [w / 2, wallH / 2, h], size: [w, wallH, 1] },
      { pos: [0, wallH / 2, h / 2], size: [1, wallH, h] },
      { pos: [w, wallH / 2, h / 2], size: [1, wallH, h] },
    ];

    for (const s of sides) {
      const geo = new THREE.BoxGeometry(...s.size);
      const mesh = new THREE.Mesh(geo, wallMat);
      mesh.position.set(...s.pos);
      this.scene.add(mesh);
    }
  }

  buildTerrain() {
    const terrain = this.theme.terrain || 'ruins';
    const w = ARENA_COLS * CELL_SIZE;
    const h = ARENA_ROWS * CELL_SIZE;

    switch (terrain) {
      case 'forest': this.buildForest(w, h); break;
      case 'desert': this.buildDesert(w, h); break;
      case 'snow': this.buildSnow(w, h); break;
      case 'ruins': this.buildRuins(w, h); break;
      case 'crystal': this.buildCrystal(w, h); break;
      case 'volcanic': this.buildVolcanic(w, h); break;
      case 'swamp': this.buildSwamp(w, h); break;
      case 'canyon': this.buildCanyon(w, h); break;
      case 'village': this.buildVillage(w, h); break;
      case 'tech': this.buildTech(w, h); break;
      case 'cave': this.buildCave(w, h); break;
      case 'arena': this.buildArenaDecor(w, h); break;
      case 'cloud': this.buildCloud(w, h); break;
      case 'pirate': this.buildPirate(w, h); break;
      case 'castle': this.buildCastle(w, h); break;
      case 'temple': this.buildTemple(w, h); break;
      case 'cemetery': this.buildCemetery(w, h); break;
      case 'underwater': this.buildUnderwater(w, h); break;
      case 'palace': this.buildPalace(w, h); break;
      case 'dark': this.buildDark(w, h); break;
      case 'alien': this.buildAlien(w, h); break;
      case 'jungle': this.buildJungle(w, h); break;
      case 'bamboo': this.buildBamboo(w, h); break;
      case 'mine': this.buildMine(w, h); break;
      case 'lab': this.buildLab(w, h); break;
      case 'fortress': this.buildFortress(w, h); break;
      case 'dragon': this.buildDragon(w, h); break;
      default: this.buildRuins(w, h); break;
    }

    this.buildLights(w, h);
  }

  buildLights(w, h) {
    const count = 12 + Math.floor(this.rng() * 6);
    for (let i = 0; i < count; i++) {
      const x = 10 + this.rng() * (w - 20);
      const z = 10 + this.rng() * (h - 20);
      const light = new THREE.PointLight(this.theme.light, 1.5, 30);
      light.position.set(x, 4, z);
      this.scene.add(light);
    }

    const sun = new THREE.DirectionalLight(this.theme.light, 0.8);
    sun.position.set(w / 2, 30, h / 3);
    sun.castShadow = true;
    this.scene.add(sun);
  }

  buildForest(w, h) {
    const treeCount = 60 + Math.floor(this.rng() * 30);
    for (let i = 0; i < treeCount; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createTree(x, z);
    }
    for (let i = 0; i < 30; i++) {
      const x = 4 + this.rng() * (w - 8);
      const z = 4 + this.rng() * (h - 8);
      this.createBush(x, z);
    }
    for (let i = 0; i < 15; i++) {
      const x = 4 + this.rng() * (w - 8);
      const z = 4 + this.rng() * (h - 8);
      this.createRock(x, z, 0.5 + this.rng() * 1.0);
    }
  }

  buildDesert(w, h) {
    for (let i = 0; i < 25; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createRock(x, z, 1 + this.rng() * 2.5);
    }
    for (let i = 0; i < 15; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createCactus(x, z);
    }
    for (let i = 0; i < 8; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createDune(x, z);
    }
  }

  buildSnow(w, h) {
    for (let i = 0; i < 30; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createPineTree(x, z);
    }
    for (let i = 0; i < 20; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createRock(x, z, 0.8 + this.rng() * 1.5, 0xaabbcc);
    }
    for (let i = 0; i < 10; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createSnowMound(x, z);
    }
  }

  buildRuins(w, h) {
    for (let i = 0; i < 20; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createBrokenPillar(x, z);
    }
    for (let i = 0; i < 15; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createRock(x, z, 0.5 + this.rng() * 1.5, 0x5a5a4a);
    }
    for (let i = 0; i < 10; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createRuinWall(x, z);
    }
  }

  buildCrystal(w, h) {
    for (let i = 0; i < 40; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createCrystal(x, z);
    }
    for (let i = 0; i < 15; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createRock(x, z, 1 + this.rng() * 2, 0x3a3a5a);
    }
  }

  buildVolcanic(w, h) {
    for (let i = 0; i < 20; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createRock(x, z, 1.5 + this.rng() * 3, 0x2a1a1a);
    }
    for (let i = 0; i < 12; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createLavaPool(x, z);
    }
  }

  buildSwamp(w, h) {
    for (let i = 0; i < 25; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createDeadTree(x, z);
    }
    for (let i = 0; i < 20; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createSwampPool(x, z);
    }
    for (let i = 0; i < 15; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createBush(x, z, 0x3a5a2a);
    }
  }

  buildCanyon(w, h) {
    for (let i = 0; i < 30; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createRock(x, z, 2 + this.rng() * 4, 0x6a4a3a);
    }
    for (let i = 0; i < 10; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createArch(x, z);
    }
  }

  buildVillage(w, h) {
    for (let i = 0; i < 15; i++) {
      const x = 10 + this.rng() * (w - 20);
      const z = 10 + this.rng() * (h - 20);
      this.createHouse(x, z);
    }
    for (let i = 0; i < 20; i++) {
      const x = 4 + this.rng() * (w - 8);
      const z = 4 + this.rng() * (h - 8);
      this.createTree(x, z);
    }
  }

  buildTech(w, h) {
    for (let i = 0; i < 20; i++) {
      const x = 10 + this.rng() * (w - 20);
      const z = 10 + this.rng() * (h - 20);
      this.createTechPillar(x, z);
    }
    for (let i = 0; i < 10; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createTechPanel(x, z);
    }
  }

  buildCave(w, h) {
    for (let i = 0; i < 30; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createRock(x, z, 1 + this.rng() * 3, 0x3a3a2a);
    }
    for (let i = 0; i < 15; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createStalagmite(x, z);
    }
  }

  buildArenaDecor(w, h) {
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const radius = Math.min(w, h) * 0.4;
      const x = w / 2 + Math.cos(angle) * radius;
      const z = h / 2 + Math.sin(angle) * radius;
      this.createBrokenPillar(x, z);
    }
    for (let i = 0; i < 10; i++) {
      const x = 10 + this.rng() * (w - 20);
      const z = 10 + this.rng() * (h - 20);
      this.createRock(x, z, 0.5 + this.rng() * 1.0, 0x5a4a3a);
    }
  }

  buildCloud(w, h) {
    for (let i = 0; i < 30; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createCloudPillar(x, z);
    }
    for (let i = 0; i < 20; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createFloatingRock(x, z);
    }
  }

  // --- Decoration Builders ---

  createTree(x, z) {
    const group = new THREE.Group();
    const trunkH = 3 + this.rng() * 2;
    const trunkGeo = new THREE.CylinderGeometry(0.2, 0.35, trunkH, 6);
    const trunkMat = new THREE.MeshLambertMaterial({ color: 0x4a3018 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = trunkH / 2;
    trunk.castShadow = true;
    group.add(trunk);

    const foliageH = 2 + this.rng() * 2;
    const foliageGeo = new THREE.SphereGeometry(1.5 + this.rng(), 6, 5);
    const foliageMat = new THREE.MeshLambertMaterial({ color: 0x2a6a1a + Math.floor(this.rng() * 0x101000) });
    const foliage = new THREE.Mesh(foliageGeo, foliageMat);
    foliage.position.y = trunkH + foliageH * 0.3;
    foliage.scale.y = foliageH / 2;
    foliage.castShadow = true;
    group.add(foliage);

    group.position.set(x, 0, z);
    this.scene.add(group);
  }

  createPineTree(x, z) {
    const group = new THREE.Group();
    const trunkH = 2 + this.rng() * 1.5;
    const trunkGeo = new THREE.CylinderGeometry(0.15, 0.25, trunkH, 5);
    const trunkMat = new THREE.MeshLambertMaterial({ color: 0x3a2010 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = trunkH / 2;
    group.add(trunk);

    for (let i = 0; i < 3; i++) {
      const coneH = 2 - i * 0.4;
      const coneR = 1.5 - i * 0.3;
      const coneGeo = new THREE.ConeGeometry(coneR, coneH, 6);
      const coneMat = new THREE.MeshLambertMaterial({ color: 0x1a4a2a });
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.y = trunkH + i * 1.2 + coneH / 2;
      cone.castShadow = true;
      group.add(cone);
    }

    group.position.set(x, 0, z);
    this.scene.add(group);
  }

  createBush(x, z, color) {
    const bushGeo = new THREE.SphereGeometry(0.6 + this.rng() * 0.4, 5, 4);
    const bushMat = new THREE.MeshLambertMaterial({ color: color || 0x2a5a1a });
    const bush = new THREE.Mesh(bushGeo, bushMat);
    bush.position.set(x, 0.4, z);
    bush.scale.y = 0.7;
    bush.castShadow = true;
    this.scene.add(bush);
  }

  createRock(x, z, size, color) {
    const rockGeo = new THREE.DodecahedronGeometry(size || 1, 0);
    const rockMat = new THREE.MeshLambertMaterial({ color: color || 0x5a5a5a });
    const rock = new THREE.Mesh(rockGeo, rockMat);
    rock.position.set(x, size * 0.4, z);
    rock.rotation.set(this.rng() * 0.5, this.rng() * Math.PI, this.rng() * 0.3);
    rock.scale.y = 0.6 + this.rng() * 0.4;
    rock.castShadow = true;
    this.scene.add(rock);
  }

  createCactus(x, z) {
    const group = new THREE.Group();
    const h = 2 + this.rng() * 2;
    const bodyGeo = new THREE.CylinderGeometry(0.25, 0.3, h, 8);
    const bodyMat = new THREE.MeshLambertMaterial({ color: 0x2a6a2a });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = h / 2;
    group.add(body);

    if (this.rng() > 0.4) {
      const armH = 1 + this.rng();
      const armGeo = new THREE.CylinderGeometry(0.15, 0.18, armH, 6);
      const arm = new THREE.Mesh(armGeo, bodyMat);
      arm.position.set(0.4, h * 0.5, 0);
      arm.rotation.z = -0.8;
      group.add(arm);
    }

    group.position.set(x, 0, z);
    this.scene.add(group);
  }

  createDune(x, z) {
    const size = 4 + this.rng() * 6;
    const duneGeo = new THREE.SphereGeometry(size, 8, 6);
    const duneMat = new THREE.MeshLambertMaterial({ color: 0x9a8a5a });
    const dune = new THREE.Mesh(duneGeo, duneMat);
    dune.position.set(x, -size * 0.6, z);
    dune.scale.y = 0.3;
    this.scene.add(dune);
  }

  createBrokenPillar(x, z) {
    const h = 2 + this.rng() * 4;
    const pillarGeo = new THREE.CylinderGeometry(0.4, 0.5, h, 8);
    const pillarMat = new THREE.MeshLambertMaterial({ color: 0x6a6a5a });
    const pillar = new THREE.Mesh(pillarGeo, pillarMat);
    pillar.position.set(x, h / 2, z);
    pillar.castShadow = true;
    this.scene.add(pillar);

    const baseGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.3, 8);
    const base = new THREE.Mesh(baseGeo, pillarMat);
    base.position.set(x, 0.15, z);
    this.scene.add(base);
  }

  createRuinWall(x, z) {
    const w = 3 + this.rng() * 4;
    const h = 1.5 + this.rng() * 2.5;
    const wallGeo = new THREE.BoxGeometry(w, h, 0.6);
    const wallMat = new THREE.MeshLambertMaterial({ color: 0x5a5a4a });
    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.position.set(x, h / 2, z);
    wall.rotation.y = this.rng() * Math.PI;
    wall.castShadow = true;
    this.scene.add(wall);
  }

  createCrystal(x, z) {
    const h = 1 + this.rng() * 3;
    const crystalGeo = new THREE.ConeGeometry(0.3 + this.rng() * 0.4, h, 5);
    const hue = this.rng();
    const color = new THREE.Color().setHSL(hue, 0.7, 0.5);
    const crystalMat = new THREE.MeshPhongMaterial({ color, emissive: color, emissiveIntensity: 0.3, transparent: true, opacity: 0.8 });
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    crystal.position.set(x, h / 2, z);
    crystal.rotation.set(this.rng() * 0.3, 0, this.rng() * 0.3);
    this.scene.add(crystal);

    const glow = new THREE.PointLight(color, 0.5, 8);
    glow.position.set(x, h, z);
    this.scene.add(glow);
  }

  createLavaPool(x, z) {
    const size = 2 + this.rng() * 3;
    const poolGeo = new THREE.CircleGeometry(size, 8);
    const poolMat = new THREE.MeshBasicMaterial({ color: 0xff4400 });
    const pool = new THREE.Mesh(poolGeo, poolMat);
    pool.rotation.x = -Math.PI / 2;
    pool.position.set(x, 0.02, z);
    this.scene.add(pool);

    const glow = new THREE.PointLight(0xff4400, 1, 12);
    glow.position.set(x, 1, z);
    this.scene.add(glow);
  }

  createDeadTree(x, z) {
    const group = new THREE.Group();
    const h = 3 + this.rng() * 2;
    const trunkGeo = new THREE.CylinderGeometry(0.1, 0.3, h, 5);
    const trunkMat = new THREE.MeshLambertMaterial({ color: 0x3a2a1a });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = h / 2;
    trunk.rotation.z = (this.rng() - 0.5) * 0.3;
    trunk.castShadow = true;
    group.add(trunk);

    for (let i = 0; i < 3; i++) {
      const branchGeo = new THREE.CylinderGeometry(0.03, 0.06, 1 + this.rng());
      const branch = new THREE.Mesh(branchGeo, trunkMat);
      branch.position.set((this.rng() - 0.5) * 0.5, h * (0.5 + this.rng() * 0.4), 0);
      branch.rotation.z = (this.rng() - 0.5) * 1.2;
      group.add(branch);
    }

    group.position.set(x, 0, z);
    this.scene.add(group);
  }

  createSwampPool(x, z) {
    const size = 1.5 + this.rng() * 2.5;
    const poolGeo = new THREE.CircleGeometry(size, 8);
    const poolMat = new THREE.MeshLambertMaterial({ color: 0x2a3a1a, transparent: true, opacity: 0.8 });
    const pool = new THREE.Mesh(poolGeo, poolMat);
    pool.rotation.x = -Math.PI / 2;
    pool.position.set(x, 0.02, z);
    this.scene.add(pool);
  }

  createArch(x, z) {
    const group = new THREE.Group();
    const h = 5 + this.rng() * 3;
    const pillarMat = new THREE.MeshLambertMaterial({ color: 0x6a4a3a });

    const leftGeo = new THREE.BoxGeometry(0.8, h, 0.8);
    const left = new THREE.Mesh(leftGeo, pillarMat);
    left.position.set(-2, h / 2, 0);
    group.add(left);

    const rightGeo = new THREE.BoxGeometry(0.8, h, 0.8);
    const right = new THREE.Mesh(rightGeo, pillarMat);
    right.position.set(2, h / 2, 0);
    group.add(right);

    const topGeo = new THREE.BoxGeometry(5, 0.8, 0.8);
    const top = new THREE.Mesh(topGeo, pillarMat);
    top.position.set(0, h, 0);
    group.add(top);

    group.position.set(x, 0, z);
    group.rotation.y = this.rng() * Math.PI;
    this.scene.add(group);
  }

  createHouse(x, z) {
    const group = new THREE.Group();
    const w = 3 + this.rng() * 2;
    const h = 2.5 + this.rng() * 1.5;
    const d = 3 + this.rng() * 2;

    const wallMat = new THREE.MeshLambertMaterial({ color: 0x8a7a5a });
    const wallGeo = new THREE.BoxGeometry(w, h, d);
    const walls = new THREE.Mesh(wallGeo, wallMat);
    walls.position.y = h / 2;
    walls.castShadow = true;
    group.add(walls);

    const roofMat = new THREE.MeshLambertMaterial({ color: 0x6a2a1a });
    const roofGeo = new THREE.ConeGeometry(Math.max(w, d) * 0.7, 2, 4);
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = h + 1;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    group.add(roof);

    group.position.set(x, 0, z);
    group.rotation.y = this.rng() * Math.PI * 2;
    this.scene.add(group);
  }

  createTechPillar(x, z) {
    const h = 4 + this.rng() * 4;
    const pillarGeo = new THREE.BoxGeometry(0.6, h, 0.6);
    const pillarMat = new THREE.MeshPhongMaterial({ color: 0x2a3a4a, emissive: 0x112233, emissiveIntensity: 0.2 });
    const pillar = new THREE.Mesh(pillarGeo, pillarMat);
    pillar.position.set(x, h / 2, z);
    pillar.castShadow = true;
    this.scene.add(pillar);

    const ringGeo = new THREE.TorusGeometry(0.5, 0.05, 6, 8);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00ccff });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(x, h * 0.7, z);
    ring.rotation.x = Math.PI / 2;
    this.scene.add(ring);
  }

  createTechPanel(x, z) {
    const panelGeo = new THREE.BoxGeometry(2 + this.rng() * 2, 1.5, 0.1);
    const panelMat = new THREE.MeshPhongMaterial({ color: 0x1a2a3a, emissive: 0x004466, emissiveIntensity: 0.4 });
    const panel = new THREE.Mesh(panelGeo, panelMat);
    panel.position.set(x, 1.5, z);
    panel.rotation.y = this.rng() * Math.PI;
    this.scene.add(panel);
  }

  createStalagmite(x, z) {
    const h = 2 + this.rng() * 4;
    const geo = new THREE.ConeGeometry(0.4 + this.rng() * 0.5, h, 6);
    const mat = new THREE.MeshLambertMaterial({ color: 0x4a4a3a });
    const stalag = new THREE.Mesh(geo, mat);
    stalag.position.set(x, h / 2, z);
    stalag.castShadow = true;
    this.scene.add(stalag);
  }

  createSnowMound(x, z) {
    const size = 2 + this.rng() * 3;
    const geo = new THREE.SphereGeometry(size, 6, 5);
    const mat = new THREE.MeshLambertMaterial({ color: 0xddddee });
    const mound = new THREE.Mesh(geo, mat);
    mound.position.set(x, -size * 0.5, z);
    mound.scale.y = 0.4;
    this.scene.add(mound);
  }

  createCloudPillar(x, z) {
    const h = 3 + this.rng() * 5;
    const geo = new THREE.CylinderGeometry(0.5, 0.8, h, 8);
    const mat = new THREE.MeshLambertMaterial({ color: 0xbbbbcc });
    const pillar = new THREE.Mesh(geo, mat);
    pillar.position.set(x, h / 2, z);
    pillar.castShadow = true;
    this.scene.add(pillar);
  }

  createFloatingRock(x, z) {
    const size = 1 + this.rng() * 2;
    const geo = new THREE.DodecahedronGeometry(size, 0);
    const mat = new THREE.MeshLambertMaterial({ color: 0x8a8a9a });
    const rock = new THREE.Mesh(geo, mat);
    rock.position.set(x, 3 + this.rng() * 4, z);
    rock.rotation.set(this.rng(), this.rng(), this.rng());
    rock.castShadow = true;
    this.scene.add(rock);
  }

  buildPirate(w, h) {
    for (let i = 0; i < 5; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createShip(x, z);
    }
    for (let i = 0; i < 12; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createDock(x, z);
    }
    for (let i = 0; i < 20; i++) {
      const x = 6 + this.rng() * (w - 12);
      const z = 6 + this.rng() * (h - 12);
      this.createBarrel(x, z);
    }
    for (let i = 0; i < 8; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createWaterPool(x, z);
    }
    for (let i = 0; i < 6; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createCrate(x, z);
    }
  }

  createShip(x, z) {
    const group = new THREE.Group();
    const hullMat = new THREE.MeshLambertMaterial({ color: 0x5a3a1a });
    const hull = new THREE.Mesh(new THREE.BoxGeometry(3, 2, 8), hullMat);
    hull.position.y = 1.5;
    hull.castShadow = true;
    group.add(hull);
    const mastMat = new THREE.MeshLambertMaterial({ color: 0x4a3018 });
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 7, 6), mastMat);
    mast.position.y = 5.5;
    group.add(mast);
    const sailMat = new THREE.MeshLambertMaterial({ color: 0xeeeecc, side: THREE.DoubleSide });
    const sail = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 3), sailMat);
    sail.position.set(0, 5, 0.3);
    group.add(sail);
    const flagMat = new THREE.MeshBasicMaterial({ color: 0x111111, side: THREE.DoubleSide });
    const flag = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.7), flagMat);
    flag.position.set(0, 8.5, 0);
    group.add(flag);
    group.position.set(x, 0, z);
    group.rotation.y = this.rng() * Math.PI * 2;
    this.scene.add(group);
  }

  createDock(x, z) {
    const group = new THREE.Group();
    const plankMat = new THREE.MeshLambertMaterial({ color: 0x6a5030 });
    const plank = new THREE.Mesh(new THREE.BoxGeometry(4, 0.2, 2), plankMat);
    plank.position.y = 0.5;
    group.add(plank);
    const postMat = new THREE.MeshLambertMaterial({ color: 0x4a3018 });
    const post1 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 1.5, 5), postMat);
    post1.position.set(-1.8, 0.3, 0);
    group.add(post1);
    const post2 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 1.5, 5), postMat);
    post2.position.set(1.8, 0.3, 0);
    group.add(post2);
    group.position.set(x, 0, z);
    group.rotation.y = this.rng() * Math.PI;
    this.scene.add(group);
  }

  createBarrel(x, z) {
    const barrelMat = new THREE.MeshLambertMaterial({ color: 0x6a4a2a });
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1, 8), barrelMat);
    barrel.position.set(x, 0.5, z);
    barrel.castShadow = true;
    this.scene.add(barrel);
    const ringMat = new THREE.MeshLambertMaterial({ color: 0x3a3a3a });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.03, 4, 8), ringMat);
    ring.position.set(x, 0.8, z);
    ring.rotation.x = Math.PI / 2;
    this.scene.add(ring);
  }

  createWaterPool(x, z) {
    const size = 3 + this.rng() * 4;
    const poolGeo = new THREE.CircleGeometry(size, 10);
    const poolMat = new THREE.MeshPhongMaterial({ color: 0x2266aa, transparent: true, opacity: 0.6 });
    const pool = new THREE.Mesh(poolGeo, poolMat);
    pool.rotation.x = -Math.PI / 2;
    pool.position.set(x, 0.02, z);
    this.scene.add(pool);
  }

  createCrate(x, z) {
    const mat = new THREE.MeshLambertMaterial({ color: 0x7a6a3a });
    const crate = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2), mat);
    crate.position.set(x, 0.6, z);
    crate.rotation.y = this.rng() * 0.5;
    crate.castShadow = true;
    this.scene.add(crate);
  }

  buildCastle(w, h) {
    for (let i = 0; i < 8; i++) {
      const x = 10 + this.rng() * (w - 20);
      const z = 10 + this.rng() * (h - 20);
      this.createTower(x, z);
    }
    for (let i = 0; i < 12; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createCastleWall(x, z);
    }
    for (let i = 0; i < 10; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createRock(x, z, 0.5 + this.rng() * 1.5, 0x4a4a4a);
    }
  }

  createTower(x, z) {
    const group = new THREE.Group();
    const h = 6 + this.rng() * 4;
    const mat = new THREE.MeshLambertMaterial({ color: 0x5a5a5a });
    const body = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.8, h, 8), mat);
    body.position.y = h / 2;
    body.castShadow = true;
    group.add(body);
    const topMat = new THREE.MeshLambertMaterial({ color: 0x4a4a4a });
    const top = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.5, 0.6, 8), topMat);
    top.position.y = h + 0.3;
    group.add(top);
    const roofMat = new THREE.MeshLambertMaterial({ color: 0x3a1a1a });
    const roof = new THREE.Mesh(new THREE.ConeGeometry(1.6, 2.5, 8), roofMat);
    roof.position.y = h + 1.8;
    group.add(roof);
    group.position.set(x, 0, z);
    this.scene.add(group);
  }

  createCastleWall(x, z) {
    const len = 5 + this.rng() * 6;
    const h = 3 + this.rng() * 2;
    const mat = new THREE.MeshLambertMaterial({ color: 0x5a5a5a });
    const wall = new THREE.Mesh(new THREE.BoxGeometry(len, h, 1), mat);
    wall.position.set(x, h / 2, z);
    wall.rotation.y = this.rng() * Math.PI;
    wall.castShadow = true;
    this.scene.add(wall);
    for (let i = 0; i < 4; i++) {
      const merlon = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 1), mat);
      merlon.position.set(x + (i - 1.5) * 1.5, h + 0.4, z);
      this.scene.add(merlon);
    }
  }

  buildTemple(w, h) {
    for (let i = 0; i < 20; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createTemplePillar(x, z);
    }
    for (let i = 0; i < 6; i++) {
      const x = 10 + this.rng() * (w - 20);
      const z = 10 + this.rng() * (h - 20);
      this.createAltar(x, z);
    }
    for (let i = 0; i < 8; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createStatue(x, z);
    }
  }

  createTemplePillar(x, z) {
    const h = 5 + this.rng() * 3;
    const mat = new THREE.MeshLambertMaterial({ color: 0x8a8a6a });
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, h, 10), mat);
    pillar.position.set(x, h / 2, z);
    pillar.castShadow = true;
    this.scene.add(pillar);
    const capMat = new THREE.MeshLambertMaterial({ color: 0x9a9a7a });
    const cap = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.4, 1.4), capMat);
    cap.position.set(x, h + 0.2, z);
    this.scene.add(cap);
  }

  createAltar(x, z) {
    const group = new THREE.Group();
    const mat = new THREE.MeshLambertMaterial({ color: 0x7a7a6a });
    const base = new THREE.Mesh(new THREE.BoxGeometry(3, 0.5, 2), mat);
    base.position.y = 0.25;
    group.add(base);
    const top = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.3, 1.5), mat);
    top.position.y = 0.65;
    group.add(top);
    const glow = new THREE.PointLight(0xffdd44, 0.8, 8);
    glow.position.y = 1.5;
    group.add(glow);
    group.position.set(x, 0, z);
    this.scene.add(group);
  }

  createStatue(x, z) {
    const group = new THREE.Group();
    const mat = new THREE.MeshLambertMaterial({ color: 0x6a6a5a });
    const base = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.6, 1.2), mat);
    base.position.y = 0.3;
    group.add(base);
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.6, 2, 0.5), mat);
    body.position.y = 1.6;
    group.add(body);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.35, 6, 5), mat);
    head.position.y = 2.95;
    group.add(head);
    group.position.set(x, 0, z);
    this.scene.add(group);
  }

  buildCemetery(w, h) {
    for (let i = 0; i < 35; i++) {
      const x = 6 + this.rng() * (w - 12);
      const z = 6 + this.rng() * (h - 12);
      this.createTombstone(x, z);
    }
    for (let i = 0; i < 15; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createDeadTree(x, z);
    }
    for (let i = 0; i < 5; i++) {
      const x = 10 + this.rng() * (w - 20);
      const z = 10 + this.rng() * (h - 20);
      this.createCrypt(x, z);
    }
  }

  createTombstone(x, z) {
    const mat = new THREE.MeshLambertMaterial({ color: 0x5a5a5a });
    const h = 1 + this.rng() * 0.8;
    const stone = new THREE.Mesh(new THREE.BoxGeometry(0.6, h, 0.15), mat);
    stone.position.set(x, h / 2, z);
    stone.rotation.z = (this.rng() - 0.5) * 0.2;
    stone.castShadow = true;
    this.scene.add(stone);
    if (this.rng() > 0.5) {
      const cross = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.1, 0.1), mat);
      cross.position.set(x, h + 0.1, z);
      this.scene.add(cross);
    }
  }

  createCrypt(x, z) {
    const group = new THREE.Group();
    const mat = new THREE.MeshLambertMaterial({ color: 0x4a4a4a });
    const base = new THREE.Mesh(new THREE.BoxGeometry(3, 1.5, 3), mat);
    base.position.y = 0.75;
    base.castShadow = true;
    group.add(base);
    const roofMat = new THREE.MeshLambertMaterial({ color: 0x3a3a3a });
    const roof = new THREE.Mesh(new THREE.ConeGeometry(2.5, 1.5, 4), roofMat);
    roof.position.y = 2.25;
    roof.rotation.y = Math.PI / 4;
    group.add(roof);
    group.position.set(x, 0, z);
    this.scene.add(group);
  }

  buildUnderwater(w, h) {
    for (let i = 0; i < 30; i++) {
      const x = 6 + this.rng() * (w - 12);
      const z = 6 + this.rng() * (h - 12);
      this.createCoral(x, z);
    }
    for (let i = 0; i < 20; i++) {
      const x = 6 + this.rng() * (w - 12);
      const z = 6 + this.rng() * (h - 12);
      this.createSeaweed(x, z);
    }
    for (let i = 0; i < 10; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createRuinWall(x, z);
    }
    for (let i = 0; i < 15; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createBubbleColumn(x, z);
    }
  }

  createCoral(x, z) {
    const colors = [0xff4466, 0xff8844, 0xffaa22, 0xaa44ff, 0x44aaff];
    const color = colors[Math.floor(this.rng() * colors.length)];
    const h = 1 + this.rng() * 2;
    const geo = new THREE.ConeGeometry(0.3 + this.rng() * 0.5, h, 5 + Math.floor(this.rng() * 4));
    const mat = new THREE.MeshLambertMaterial({ color });
    const coral = new THREE.Mesh(geo, mat);
    coral.position.set(x, h / 2, z);
    coral.castShadow = true;
    this.scene.add(coral);
  }

  createSeaweed(x, z) {
    const group = new THREE.Group();
    const mat = new THREE.MeshLambertMaterial({ color: 0x2a6a3a });
    const count = 2 + Math.floor(this.rng() * 3);
    for (let i = 0; i < count; i++) {
      const h = 2 + this.rng() * 3;
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.1, h, 0.3), mat);
      blade.position.set((this.rng() - 0.5) * 0.5, h / 2, (this.rng() - 0.5) * 0.5);
      blade.rotation.z = (this.rng() - 0.5) * 0.3;
      group.add(blade);
    }
    group.position.set(x, 0, z);
    this.scene.add(group);
  }

  createBubbleColumn(x, z) {
    const mat = new THREE.MeshBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0.4 });
    for (let i = 0; i < 5; i++) {
      const size = 0.1 + this.rng() * 0.2;
      const bubble = new THREE.Mesh(new THREE.SphereGeometry(size, 5, 4), mat);
      bubble.position.set(x + (this.rng() - 0.5) * 0.5, 1 + i * 1.2 + this.rng(), z + (this.rng() - 0.5) * 0.5);
      this.scene.add(bubble);
    }
  }

  buildPalace(w, h) {
    for (let i = 0; i < 20; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createMarblePillar(x, z);
    }
    for (let i = 0; i < 6; i++) {
      const x = 10 + this.rng() * (w - 20);
      const z = 10 + this.rng() * (h - 20);
      this.createFountain(x, z);
    }
    for (let i = 0; i < 10; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createGardenBush(x, z);
    }
    for (let i = 0; i < 5; i++) {
      const x = 10 + this.rng() * (w - 20);
      const z = 10 + this.rng() * (h - 20);
      this.createBanner(x, z);
    }
  }

  createMarblePillar(x, z) {
    const h = 5 + this.rng() * 3;
    const mat = new THREE.MeshPhongMaterial({ color: 0xeeeedd });
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, h, 10), mat);
    pillar.position.set(x, h / 2, z);
    pillar.castShadow = true;
    this.scene.add(pillar);
    const goldMat = new THREE.MeshPhongMaterial({ color: 0xddaa22, emissive: 0x442200, emissiveIntensity: 0.2 });
    const cap = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.3, 1.2), goldMat);
    cap.position.set(x, h + 0.15, z);
    this.scene.add(cap);
  }

  createFountain(x, z) {
    const group = new THREE.Group();
    const mat = new THREE.MeshLambertMaterial({ color: 0xccccbb });
    const basin = new THREE.Mesh(new THREE.CylinderGeometry(2, 2.2, 0.8, 12), mat);
    basin.position.y = 0.4;
    group.add(basin);
    const center = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 2, 8), mat);
    center.position.y = 1.4;
    group.add(center);
    const waterMat = new THREE.MeshPhongMaterial({ color: 0x4488cc, transparent: true, opacity: 0.5 });
    const water = new THREE.Mesh(new THREE.CircleGeometry(1.8, 10), waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.y = 0.7;
    group.add(water);
    group.position.set(x, 0, z);
    this.scene.add(group);
  }

  createGardenBush(x, z) {
    const mat = new THREE.MeshLambertMaterial({ color: 0x2a6a2a });
    const bush = new THREE.Mesh(new THREE.SphereGeometry(1 + this.rng() * 0.5, 6, 5), mat);
    bush.position.set(x, 0.8, z);
    bush.scale.set(1.2, 0.8, 1.2);
    bush.castShadow = true;
    this.scene.add(bush);
    if (this.rng() > 0.5) {
      const flowerMat = new THREE.MeshBasicMaterial({ color: 0xff4488 });
      for (let i = 0; i < 3; i++) {
        const flower = new THREE.Mesh(new THREE.SphereGeometry(0.1, 4, 3), flowerMat);
        flower.position.set(x + (this.rng() - 0.5) * 0.8, 1.2, z + (this.rng() - 0.5) * 0.8);
        this.scene.add(flower);
      }
    }
  }

  createBanner(x, z) {
    const group = new THREE.Group();
    const poleMat = new THREE.MeshLambertMaterial({ color: 0xddaa22 });
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 5, 6), poleMat);
    pole.position.y = 2.5;
    group.add(pole);
    const colors = [0xcc0000, 0x0044aa, 0x6a0088];
    const bannerMat = new THREE.MeshLambertMaterial({ color: colors[Math.floor(this.rng() * colors.length)], side: THREE.DoubleSide });
    const banner = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 2), bannerMat);
    banner.position.set(0.7, 3.8, 0);
    group.add(banner);
    group.position.set(x, 0, z);
    this.scene.add(group);
  }

  buildDark(w, h) {
    for (let i = 0; i < 25; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createDarkSpire(x, z);
    }
    for (let i = 0; i < 10; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createPortal(x, z);
    }
    for (let i = 0; i < 15; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createFloatingRock(x, z);
    }
  }

  createDarkSpire(x, z) {
    const h = 4 + this.rng() * 6;
    const mat = new THREE.MeshLambertMaterial({ color: 0x1a1a2a });
    const spire = new THREE.Mesh(new THREE.ConeGeometry(0.5 + this.rng() * 0.5, h, 5), mat);
    spire.position.set(x, h / 2, z);
    spire.castShadow = true;
    this.scene.add(spire);
    const glow = new THREE.PointLight(0x6622aa, 0.5, 6);
    glow.position.set(x, h, z);
    this.scene.add(glow);
  }

  createPortal(x, z) {
    const mat = new THREE.MeshBasicMaterial({ color: 0x6622cc, transparent: true, opacity: 0.6 });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.2, 8, 12), mat);
    ring.position.set(x, 2.5, z);
    ring.rotation.x = Math.PI / 2 * this.rng();
    this.scene.add(ring);
    const glow = new THREE.PointLight(0x8844ff, 1, 10);
    glow.position.set(x, 2.5, z);
    this.scene.add(glow);
  }

  buildAlien(w, h) {
    for (let i = 0; i < 25; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createAlienPlant(x, z);
    }
    for (let i = 0; i < 12; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createAlienStructure(x, z);
    }
    for (let i = 0; i < 8; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createGlowPool(x, z);
    }
  }

  createAlienPlant(x, z) {
    const group = new THREE.Group();
    const hue = this.rng();
    const color = new THREE.Color().setHSL(hue, 0.8, 0.4);
    const mat = new THREE.MeshPhongMaterial({ color, emissive: color, emissiveIntensity: 0.2 });
    const h = 2 + this.rng() * 3;
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.15, h, 5), mat);
    stem.position.y = h / 2;
    group.add(stem);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.4 + this.rng() * 0.3, 6, 5), mat);
    bulb.position.y = h;
    group.add(bulb);
    group.position.set(x, 0, z);
    this.scene.add(group);
  }

  createAlienStructure(x, z) {
    const group = new THREE.Group();
    const mat = new THREE.MeshPhongMaterial({ color: 0x2a4a3a, emissive: 0x113322, emissiveIntensity: 0.3 });
    const h = 3 + this.rng() * 4;
    const shape = Math.floor(this.rng() * 3);
    let geo;
    if (shape === 0) geo = new THREE.OctahedronGeometry(1.5 + this.rng());
    else if (shape === 1) geo = new THREE.TetrahedronGeometry(1.5 + this.rng());
    else geo = new THREE.IcosahedronGeometry(1 + this.rng());
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.y = h / 2;
    mesh.rotation.set(this.rng(), this.rng(), this.rng());
    group.add(mesh);
    group.position.set(x, 0, z);
    this.scene.add(group);
  }

  createGlowPool(x, z) {
    const size = 2 + this.rng() * 3;
    const hue = this.rng();
    const color = new THREE.Color().setHSL(hue, 0.9, 0.4);
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.5 });
    const pool = new THREE.Mesh(new THREE.CircleGeometry(size, 8), mat);
    pool.rotation.x = -Math.PI / 2;
    pool.position.set(x, 0.03, z);
    this.scene.add(pool);
    const glow = new THREE.PointLight(color, 0.8, 10);
    glow.position.set(x, 0.5, z);
    this.scene.add(glow);
  }

  buildJungle(w, h) {
    const treeCount = 50 + Math.floor(this.rng() * 30);
    for (let i = 0; i < treeCount; i++) {
      const x = 6 + this.rng() * (w - 12);
      const z = 6 + this.rng() * (h - 12);
      this.createJungleTree(x, z);
    }
    for (let i = 0; i < 25; i++) {
      const x = 4 + this.rng() * (w - 8);
      const z = 4 + this.rng() * (h - 8);
      this.createBush(x, z, 0x1a5a0a);
    }
    for (let i = 0; i < 15; i++) {
      const x = 6 + this.rng() * (w - 12);
      const z = 6 + this.rng() * (h - 12);
      this.createVine(x, z);
    }
  }

  createJungleTree(x, z) {
    const group = new THREE.Group();
    const trunkH = 5 + this.rng() * 4;
    const trunkMat = new THREE.MeshLambertMaterial({ color: 0x3a2a10 });
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.5, trunkH, 6), trunkMat);
    trunk.position.y = trunkH / 2;
    trunk.castShadow = true;
    group.add(trunk);
    const foliageMat = new THREE.MeshLambertMaterial({ color: 0x0a5a0a });
    for (let i = 0; i < 3; i++) {
      const r = 2 + this.rng() * 1.5;
      const foliage = new THREE.Mesh(new THREE.SphereGeometry(r, 6, 5), foliageMat);
      foliage.position.set((this.rng() - 0.5) * 2, trunkH + this.rng() * 2, (this.rng() - 0.5) * 2);
      foliage.castShadow = true;
      group.add(foliage);
    }
    group.position.set(x, 0, z);
    this.scene.add(group);
  }

  createVine(x, z) {
    const mat = new THREE.MeshLambertMaterial({ color: 0x2a5a1a });
    const h = 4 + this.rng() * 5;
    const vine = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, h, 4), mat);
    vine.position.set(x, h / 2 + 2, z);
    vine.rotation.z = (this.rng() - 0.5) * 0.3;
    this.scene.add(vine);
  }

  buildBamboo(w, h) {
    const count = 80 + Math.floor(this.rng() * 40);
    for (let i = 0; i < count; i++) {
      const x = 6 + this.rng() * (w - 12);
      const z = 6 + this.rng() * (h - 12);
      this.createBamboo(x, z);
    }
    for (let i = 0; i < 10; i++) {
      const x = 6 + this.rng() * (w - 12);
      const z = 6 + this.rng() * (h - 12);
      this.createRock(x, z, 0.8 + this.rng() * 1.5, 0x6a6a6a);
    }
    for (let i = 0; i < 5; i++) {
      const x = 10 + this.rng() * (w - 20);
      const z = 10 + this.rng() * (h - 20);
      this.createWaterPool(x, z);
    }
  }

  createBamboo(x, z) {
    const h = 5 + this.rng() * 5;
    const mat = new THREE.MeshLambertMaterial({ color: 0x4a8a2a });
    const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, h, 6), mat);
    stalk.position.set(x, h / 2, z);
    stalk.castShadow = true;
    this.scene.add(stalk);
    const leafMat = new THREE.MeshLambertMaterial({ color: 0x3a7a1a });
    for (let i = 0; i < 2; i++) {
      const leaf = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.2), leafMat);
      leaf.position.set(x + (this.rng() - 0.5) * 0.4, h * 0.7 + i * 1.5, z);
      leaf.rotation.z = (this.rng() - 0.5) * 0.8;
      this.scene.add(leaf);
    }
  }

  buildMine(w, h) {
    for (let i = 0; i < 15; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createMineSupport(x, z);
    }
    for (let i = 0; i < 10; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createMineCart(x, z);
    }
    for (let i = 0; i < 20; i++) {
      const x = 6 + this.rng() * (w - 12);
      const z = 6 + this.rng() * (h - 12);
      this.createRock(x, z, 0.5 + this.rng() * 2, 0x3a3a2a);
    }
    for (let i = 0; i < 15; i++) {
      const x = 6 + this.rng() * (w - 12);
      const z = 6 + this.rng() * (h - 12);
      this.createStalagmite(x, z);
    }
  }

  createMineSupport(x, z) {
    const group = new THREE.Group();
    const mat = new THREE.MeshLambertMaterial({ color: 0x5a4020 });
    const left = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.5, 0.3), mat);
    left.position.set(-1.5, 1.75, 0);
    group.add(left);
    const right = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.5, 0.3), mat);
    right.position.set(1.5, 1.75, 0);
    group.add(right);
    const top = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.3, 0.3), mat);
    top.position.set(0, 3.5, 0);
    group.add(top);
    group.position.set(x, 0, z);
    group.rotation.y = this.rng() * Math.PI;
    this.scene.add(group);
  }

  createMineCart(x, z) {
    const group = new THREE.Group();
    const mat = new THREE.MeshLambertMaterial({ color: 0x4a4a4a });
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.6, 1.8), mat);
    body.position.y = 0.6;
    group.add(body);
    const wheelMat = new THREE.MeshLambertMaterial({ color: 0x3a3a3a });
    [[-0.5, 0.2, -0.7], [0.5, 0.2, -0.7], [-0.5, 0.2, 0.7], [0.5, 0.2, 0.7]].forEach(([wx, wy, wz]) => {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.1, 8), wheelMat);
      wheel.position.set(wx, wy, wz);
      wheel.rotation.z = Math.PI / 2;
      group.add(wheel);
    });
    const rockMat = new THREE.MeshLambertMaterial({ color: 0x5a5a3a });
    for (let i = 0; i < 3; i++) {
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.2, 0), rockMat);
      rock.position.set((this.rng() - 0.5) * 0.6, 1, (this.rng() - 0.5) * 0.8);
      group.add(rock);
    }
    group.position.set(x, 0, z);
    group.rotation.y = this.rng() * Math.PI;
    this.scene.add(group);
  }

  buildLab(w, h) {
    for (let i = 0; i < 15; i++) {
      const x = 10 + this.rng() * (w - 20);
      const z = 10 + this.rng() * (h - 20);
      this.createLabTable(x, z);
    }
    for (let i = 0; i < 10; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createTechPillar(x, z);
    }
    for (let i = 0; i < 8; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createTank(x, z);
    }
    for (let i = 0; i < 10; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createTechPanel(x, z);
    }
  }

  createLabTable(x, z) {
    const group = new THREE.Group();
    const mat = new THREE.MeshLambertMaterial({ color: 0x6a6a7a });
    const top = new THREE.Mesh(new THREE.BoxGeometry(2, 0.1, 1.2), mat);
    top.position.y = 1;
    group.add(top);
    const legMat = new THREE.MeshLambertMaterial({ color: 0x4a4a5a });
    [[-0.8, 0.5, -0.5], [0.8, 0.5, -0.5], [-0.8, 0.5, 0.5], [0.8, 0.5, 0.5]].forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1, 0.1), legMat);
      leg.position.set(lx, ly, lz);
      group.add(leg);
    });
    const beakerMat = new THREE.MeshPhongMaterial({ color: 0x44ff88, transparent: true, opacity: 0.5 });
    const beaker = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.4, 6), beakerMat);
    beaker.position.set(0, 1.25, 0);
    group.add(beaker);
    group.position.set(x, 0, z);
    group.rotation.y = this.rng() * Math.PI;
    this.scene.add(group);
  }

  createTank(x, z) {
    const group = new THREE.Group();
    const glassMat = new THREE.MeshPhongMaterial({ color: 0x44aaaa, transparent: true, opacity: 0.3 });
    const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 3, 10), glassMat);
    tank.position.y = 1.5;
    group.add(tank);
    const liquidMat = new THREE.MeshBasicMaterial({ color: 0x22ff66, transparent: true, opacity: 0.4 });
    const liquid = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 2, 10), liquidMat);
    liquid.position.y = 1.2;
    group.add(liquid);
    const glow = new THREE.PointLight(0x22ff66, 0.5, 6);
    glow.position.y = 1.5;
    group.add(glow);
    group.position.set(x, 0, z);
    this.scene.add(group);
  }

  buildFortress(w, h) {
    for (let i = 0; i < 8; i++) {
      const x = 10 + this.rng() * (w - 20);
      const z = 10 + this.rng() * (h - 20);
      this.createIceTower(x, z);
    }
    for (let i = 0; i < 10; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createIceWall(x, z);
    }
    for (let i = 0; i < 15; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createSnowMound(x, z);
    }
  }

  createIceTower(x, z) {
    const group = new THREE.Group();
    const h = 6 + this.rng() * 4;
    const mat = new THREE.MeshPhongMaterial({ color: 0x88bbdd, transparent: true, opacity: 0.8 });
    const body = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.5, h, 8), mat);
    body.position.y = h / 2;
    body.castShadow = true;
    group.add(body);
    const topMat = new THREE.MeshPhongMaterial({ color: 0xaaddff, transparent: true, opacity: 0.7 });
    const top = new THREE.Mesh(new THREE.ConeGeometry(1.3, 2, 6), topMat);
    top.position.y = h + 1;
    group.add(top);
    group.position.set(x, 0, z);
    this.scene.add(group);
  }

  createIceWall(x, z) {
    const len = 4 + this.rng() * 5;
    const h = 2.5 + this.rng() * 2;
    const mat = new THREE.MeshPhongMaterial({ color: 0x7aaabb, transparent: true, opacity: 0.7 });
    const wall = new THREE.Mesh(new THREE.BoxGeometry(len, h, 0.8), mat);
    wall.position.set(x, h / 2, z);
    wall.rotation.y = this.rng() * Math.PI;
    wall.castShadow = true;
    this.scene.add(wall);
  }

  buildDragon(w, h) {
    for (let i = 0; i < 8; i++) {
      const x = 10 + this.rng() * (w - 20);
      const z = 10 + this.rng() * (h - 20);
      this.createDragonBones(x, z);
    }
    for (let i = 0; i < 10; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createLavaPool(x, z);
    }
    for (let i = 0; i < 15; i++) {
      const x = 8 + this.rng() * (w - 16);
      const z = 8 + this.rng() * (h - 16);
      this.createRock(x, z, 1.5 + this.rng() * 3, 0x3a2a1a);
    }
    for (let i = 0; i < 6; i++) {
      const x = 10 + this.rng() * (w - 20);
      const z = 10 + this.rng() * (h - 20);
      this.createNest(x, z);
    }
  }

  createDragonBones(x, z) {
    const group = new THREE.Group();
    const boneMat = new THREE.MeshLambertMaterial({ color: 0xddddbb });
    const spineLen = 4 + this.rng() * 4;
    const spine = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.15, spineLen, 5), boneMat);
    spine.rotation.z = Math.PI / 2;
    spine.position.y = 1;
    group.add(spine);
    for (let i = 0; i < 5; i++) {
      const rib = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.04, 1.5 + this.rng()), boneMat);
      rib.position.set((i - 2) * 0.8, 1, 0);
      rib.rotation.z = Math.PI / 2 + (this.rng() - 0.5) * 0.5;
      group.add(rib);
    }
    const skull = new THREE.Mesh(new THREE.BoxGeometry(1, 0.6, 1.2), boneMat);
    skull.position.set(spineLen / 2, 1, 0);
    group.add(skull);
    group.position.set(x, 0, z);
    group.rotation.y = this.rng() * Math.PI * 2;
    this.scene.add(group);
  }

  createNest(x, z) {
    const group = new THREE.Group();
    const mat = new THREE.MeshLambertMaterial({ color: 0x4a3a1a });
    const nest = new THREE.Mesh(new THREE.CylinderGeometry(2, 2.5, 0.8, 8), mat);
    nest.position.y = 0.4;
    group.add(nest);
    const eggMat = new THREE.MeshLambertMaterial({ color: 0xddcc99 });
    for (let i = 0; i < 3; i++) {
      const egg = new THREE.Mesh(new THREE.SphereGeometry(0.3, 6, 5), eggMat);
      egg.position.set((this.rng() - 0.5) * 1.2, 0.9, (this.rng() - 0.5) * 1.2);
      egg.scale.y = 1.3;
      group.add(egg);
    }
    group.position.set(x, 0, z);
    this.scene.add(group);
  }
}

export { CELL_SIZE };
