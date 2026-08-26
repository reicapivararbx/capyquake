import * as THREE from 'three';
import { Audio } from './audio.js';
import { keyMatches } from './keybindings.js';

export const WEAPONS = {
  bastao: { name: 'BASTAO', damage: 12, type: 'melee', range: 4.0, cooldown: 0.3 },
  pistola: { name: 'PISTOLA', damage: 20, type: 'hitscan', range: 40, cooldown: 0.12 },
  adaga: { name: 'ADAGA', damage: 10, type: 'melee', range: 3.0, cooldown: 0.18 },
  funda: { name: 'FUNDA', damage: 8, type: 'ranged', range: 50, cooldown: 0.5 },
  chicote: { name: 'CHICOTE', damage: 9, type: 'melee', range: 5.5, cooldown: 0.35 },
  bumerangue: { name: 'BUMERANGUE', damage: 11, type: 'ranged', range: 30, cooldown: 0.6 },
  clava: { name: 'CLAVA', damage: 13, type: 'melee', range: 3.5, cooldown: 0.4 },
  florete: { name: 'FLORETE', damage: 14, type: 'melee', range: 4.5, cooldown: 0.22 },
  arco: { name: 'ARCO', damage: 15, type: 'ranged', range: 70, cooldown: 0.6 },
  lanca: { name: 'LANCA', damage: 16, type: 'melee', range: 6.0, cooldown: 0.45 },
  rapieira: { name: 'RAPIEIRA', damage: 16, type: 'melee', range: 4.5, cooldown: 0.2 },
  sabre: { name: 'SABRE', damage: 17, type: 'melee', range: 4.0, cooldown: 0.28 },
  espada: { name: 'ESPADA', damage: 18, type: 'melee', range: 4.0, cooldown: 0.3 },
  tridente: { name: 'TRIDENTE', damage: 19, type: 'melee', range: 5.5, cooldown: 0.4 },
  besta: { name: 'BESTA', damage: 20, type: 'ranged', range: 80, cooldown: 0.8 },
  maca: { name: 'MACA', damage: 22, type: 'melee', range: 3.5, cooldown: 0.5 },
  machado: { name: 'MACHADO DE BATALHA', damage: 24, type: 'melee', range: 3.5, cooldown: 0.55 },
  alabarda: { name: 'ALABARDA', damage: 25, type: 'melee', range: 6.0, cooldown: 0.6 },
  martelo: { name: 'MARTELO DE GUERRA', damage: 26, type: 'melee', range: 3.5, cooldown: 0.65 },
  ak47: { name: 'AK-47', damage: 30, type: 'hitscan', range: 60, cooldown: 0.4 },
  minigun: {
        name: 'MINIGUN', damage: 1000, type: 'hitscan', range: 80, cooldown: 0.03,
    precoMoney: 10000000, precoTokens: 500, precoRodadaMoney: 1000000
  },
  cajado_fogo: {
    name: 'CAJADO DE FOGO', damage: 25, type: 'hitscan', range: 30, cooldown: 2.3,
    precoMoney: 25000, precoTokens: 25
  },
  bazuca: {
    name: 'BAZUCA', damage: 100, type: 'projectile', range: 80, cooldown: 11, ammoType: 'bazuca',
    precoMoney: 100000000, precoTokens: 10000, precoRodadaMoney: 1000000, preco5RodadasTokens: 500
  },
  april_fools: {
    name: 'APRIL FOOLS GUN', damage: 0.5, type: 'projectile', range: 50, cooldown: 20,
    descricao: 'OMG, IS THAT THE BEST GUN IN THE GAME?! LOL *-*',
    precoMoney: 500000, precoTokens: 500
  },
  chicken_gun: {
    name: 'CHICKEN GUN', damage: 5, type: 'projectile', range: 60, cooldown: 5, ammoType: 'chicken',
    precoMoney: 490, precoTokens: 490, preco3RodadasMoney: 24500, preco3RodadasTokens: 24
  },
  sniper: {
    name: 'SNIPER', damage: 120, type: 'hitscan', range: 150, cooldown: 2.0, ammoType: 'sniper',
    precoMoney: 50000, precoTokens: 50
  },
  brick: {
    name: 'BRICK', damage: 85, type: 'projectile', range: 45, cooldown: 15,
    descricao: 'Tijolo arremessável. Dano 80-90. Não lootável.',
    precoMoney: 15, naoLootavel: true
  },
  clone_gun: {
    name: 'CLONE GUN', damage: 0, type: 'clone', range: 0, cooldown: 20,
    descricao: 'Cria um clone de você. Máx 5 simultâneos.',
    naoLootavel: true
  },
};

export function rollAmmo() {
  const r = Math.random() * 1000;
  if (r < 1) return Infinity;
  if (r < 10) return 1000;
  if (r < 250) return 20;
  if (r < 500) return 15;
  return 10;
}

export class Weapon {
  constructor(scene, camera, arena) {
    this.scene = scene;
    this.camera = camera;
    this.arena = arena;
    this.raycaster = new THREE.Raycaster();
    this.cooldown = 0;
    this.recoil = 0;
    this.projectiles = [];
    this.pendingHits = [];
    this.explosions = [];
    this.mouseHeld = false;
    this.zoomed = false;
    this._lastTargets = [];

    this.inventory = ['bastao', 'pistola'];
    this.currentIndex = 0;
    this.currentWeapon = 'bastao';

    this.ammo = 30;
    this.onCloneFire = null;
    this.isInfinite = null;

    this.weaponGroup = new THREE.Group();
    this.camera.add(this.weaponGroup);

    this.hitboxMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.15, wireframe: false })
    );
    this.hitboxWire = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1)),
      new THREE.LineBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.4 })
    );
    this.hitboxMesh.visible = false;
    this.hitboxWire.visible = false;
    this.camera.add(this.hitboxMesh);
    this.camera.add(this.hitboxWire);
    this.hitboxTimer = 0;
    this.updateHitbox();

    this.buildCurrentModel();
    this.setupInput();
    this.updateDisplay();
  }

  setupInput() {
    document.addEventListener('keydown', (e) => {
      if (e.code === 'KeyR') this.cycleWeapon();
      if (keyMatches('key-sniper', e.code) && this.currentWeapon === 'sniper') {
        this.toggleZoom();
      }
    });
    document.addEventListener('wheel', (e) => {
      if (e.deltaY > 0) this.cycleWeapon(1);
      else this.cycleWeapon(-1);
    });
    document.addEventListener('mousedown', (e) => {
      if (e.button === 0) this.mouseHeld = true;
    });
    document.addEventListener('mouseup', (e) => {
      if (e.button === 0) this.mouseHeld = false;
    });
  }

  toggleZoom() {
    this.zoomed = !this.zoomed;
    if (this.zoomed) this.camera.fov = 15;
    else this.camera.fov = 75;
    this.camera.updateProjectionMatrix();
  }

  addWeapon(weaponId, ammoCount) {
    if (!this.inventory.includes(weaponId)) {
      this.inventory.push(weaponId);
    }
    if (ammoCount && ammoCount !== Infinity) {
      this.ammo += ammoCount + (typeof this.extraAmmo === 'function' ? this.extraAmmo() : 0);
    }
    this.updateInventoryDisplay();
  }

  addAmmo(weaponId, amount) {
    if (amount && amount !== Infinity) {
      this.ammo += amount + (typeof this.extraAmmo === 'function' ? this.extraAmmo() : 0);
    } else {
      this.ammo += amount;
    }
  }

  getAmmo(weaponId) {
    const w = WEAPONS[weaponId];
    if (!w || w.type === 'melee') return Infinity;
    return this.ammo;
  }

  getCurrentAmmo() {
    return this.getAmmo(this.currentWeapon);
  }

  swapWeapons(indexA, indexB) {
    if (indexA < 0 || indexB < 0 || indexA >= this.inventory.length || indexB >= this.inventory.length) return;
    [this.inventory[indexA], this.inventory[indexB]] = [this.inventory[indexB], this.inventory[indexA]];
    if (this.currentIndex === indexA) this.currentIndex = indexB;
    else if (this.currentIndex === indexB) this.currentIndex = indexA;
    this.currentWeapon = this.inventory[this.currentIndex];
    this.updateDisplay();
  }

  cycleWeapon(dir = 1) {
    if (this.inventory.length <= 1) return;
    this.currentIndex = (this.currentIndex + dir + this.inventory.length) % this.inventory.length;
    this.currentWeapon = this.inventory[this.currentIndex];
    this.buildCurrentModel();
    this.updateHitbox();
    this.updateDisplay();
  }

  dropCurrentWeapon() {
    if (this.inventory.length <= 1) return null;
    const dropped = this.currentWeapon;
    this.inventory.splice(this.currentIndex, 1);
    this.currentIndex = this.currentIndex % this.inventory.length;
    this.currentWeapon = this.inventory[this.currentIndex];
    this.buildCurrentModel();
    this.updateHitbox();
    this.updateDisplay();
    this.updateInventoryDisplay();
    return dropped;
  }

  updateDisplay() {
    const w = WEAPONS[this.currentWeapon];
    const display = document.getElementById('weapon-display');
    if (display) {
      let text = w.name + (w.damage > 0 ? ' (DMG:' + w.damage + ')' : '');
      if (w.type !== 'melee' && w.type !== 'clone') {
        text += ' | ' + (this.currentWeapon === 'minigun' ? 'INF' : this.ammo);
      }
      if (w.type === 'clone') text += ' | CLONES: ' + (window.__game ? window.__game.clones.length + '/5' : '0/5');
      display.textContent = text;
    }
    this.updateInventoryDisplay();
  }

  updateInventoryDisplay() {
    const el = document.getElementById('inventory-display');
    if (!el) return;
    el.innerHTML = this.inventory.map((id, i) => {
      const w = WEAPONS[id];
      const marker = i === this.currentIndex ? '> ' : '  ';
      let line = marker + w.name;
      if (w.type !== 'melee' && w.type !== 'clone') {
        line += ' [' + (id === 'minigun' ? 'INF' : this.ammo) + ']';
      }
      return line;
    }).join('<br>');
  }

  updateHitbox() {
    const w = WEAPONS[this.currentWeapon];
    const range = Math.min(w.range, 8);
    const width = w.type === 'melee' ? 1.5 : 0.6;
    const height = w.type === 'melee' ? 1.5 : 0.6;
    this.hitboxMesh.scale.set(width, height, range);
    this.hitboxMesh.position.set(0, 0, -range / 2);
    this.hitboxWire.scale.set(width, height, range);
    this.hitboxWire.position.set(0, 0, -range / 2);
  }

  showHitbox() {
    this.hitboxMesh.visible = true;
    this.hitboxWire.visible = true;
    this.hitboxTimer = 0.2;
  }

  buildCurrentModel() {
    while (this.weaponGroup.children.length > 0) {
      this.weaponGroup.remove(this.weaponGroup.children[0]);
    }
    const model = this.createWeaponModel(this.currentWeapon);
    this.weaponGroup.add(model);
  }

  createWeaponModel(id) {
    const group = new THREE.Group();
    const w = WEAPONS[id];

    if (w.type === 'ranged' || w.type === 'hitscan' || w.type === 'projectile') {
      return this.createRangedModel(id, group);
    }
    return this.createMeleeModel(id, group);
  }

  createMeleeModel(id, group) {
    const mat1 = new THREE.MeshLambertMaterial({ color: 0x888888 });
    const mat2 = new THREE.MeshLambertMaterial({ color: 0x4a3018 });
    const mat3 = new THREE.MeshLambertMaterial({ color: 0xaaaacc });
    const darkMat = new THREE.MeshLambertMaterial({ color: 0x28231e });
    const leatherMat = new THREE.MeshLambertMaterial({ color: 0x6c4224 });
    const brassMat = new THREE.MeshLambertMaterial({ color: 0xb88b35 });

    switch (id) {
      case 'bastao': {
        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 1.6, 6), mat2);
        shaft.position.set(0.35, -0.15, -0.5);
        shaft.rotation.x = Math.PI / 2 + 0.15;
        group.add(shaft);
        const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.046, 0.34, 6), leatherMat);
        grip.position.set(0.35, -0.15, -0.02);
        grip.rotation.x = Math.PI / 2 + 0.15;
        group.add(grip);
        const cap = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.12, 6), brassMat);
        cap.position.set(0.35, -0.03, -1.3);
        cap.rotation.x = Math.PI / 2;
        group.add(cap);
        break;
      }
      case 'adaga': {
        const blade = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.022, 0.32, 8), mat3);
        blade.position.set(0.3, -0.2, -0.45);
        blade.rotation.x = Math.PI / 2;
        group.add(blade);
        const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.015, 0.22, 5), leatherMat);
        handle.position.set(0.3, -0.2, -0.18);
        group.add(handle);
        const guard = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.008, 4, 8), brassMat);
        guard.position.set(0.3, -0.2, -0.02);
        guard.rotation.x = Math.PI / 2;
        group.add(guard);
        const tip = new THREE.Mesh(new THREE.ConeGeometry(0.028, 0.1, 4), mat3);
        tip.position.set(0.3, -0.2, -0.62);
        tip.rotation.x = Math.PI / 2;
        group.add(tip);
        const pommel = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 4), brassMat);
        pommel.position.set(0.3, -0.2, -0.08);
        group.add(pommel);
        break;
      }
      case 'clava': {
        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 1.0, 5), mat2);
        shaft.position.set(0.32, -0.15, -0.4);
        shaft.rotation.x = Math.PI / 2 + 0.1;
        group.add(shaft);
        const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.28, 6), leatherMat);
        grip.position.set(0.32, -0.15, -0.02);
        grip.rotation.x = Math.PI / 2 + 0.1;
        group.add(grip);
        const head = new THREE.Mesh(new THREE.IcosahedronGeometry(0.12, 0), darkMat);
        head.position.set(0.32, -0.12, -0.95);
        group.add(head);
        for (const x of [-0.075, 0.075]) {
          const stud = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.06, 4), brassMat);
          stud.position.set(0.32 + x, -0.12, -1.03);
          stud.rotation.x = Math.PI / 2;
          group.add(stud);
        }
        break;
      }
      case 'florete': {
        const blade = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.9, 4), mat3);
        blade.rotation.x = Math.PI / 2;
        blade.position.set(0.3, -0.22, -0.65);
        group.add(blade);
        const tip = new THREE.Mesh(new THREE.ConeGeometry(0.022, 0.13, 4), mat3);
        tip.position.set(0.3, -0.22, -1.165);
        tip.rotation.x = Math.PI / 2;
        group.add(tip);
        const guard = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 4), mat1);
        guard.position.set(0.3, -0.22, -0.18);
        guard.scale.set(1, 0.3, 1);
        group.add(guard);
        const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.18, 5), leatherMat);
        handle.position.set(0.3, -0.22, -0.05);
        handle.rotation.x = Math.PI / 2;
        group.add(handle);
        const pommel = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 4), brassMat);
        pommel.position.set(0.3, -0.22, 0.06);
        group.add(pommel);
        break;
      }
      case 'lanca': {
        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 2.0, 5), mat2);
        shaft.position.set(0.32, -0.15, -0.7);
        shaft.rotation.x = Math.PI / 2 + 0.1;
        group.add(shaft);
        const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.037, 0.034, 0.36, 6), leatherMat);
        grip.position.set(0.32, -0.15, -0.02);
        grip.rotation.x = Math.PI / 2 + 0.1;
        group.add(grip);
        const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.043, 0.043, 0.09, 6), brassMat);
        collar.position.set(0.32, -0.06, -1.54);
        collar.rotation.x = Math.PI / 2;
        group.add(collar);
        const tip = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.2, 4), mat3);
        tip.position.set(0.32, -0.08, -1.7);
        tip.rotation.x = Math.PI / 2;
        group.add(tip);
        break;
      }
      case 'rapieira': {
        const blade = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.85, 4), mat3);
        blade.rotation.x = Math.PI / 2;
        blade.position.set(0.3, -0.22, -0.6);
        group.add(blade);
        const tip = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.12, 4), mat3);
        tip.position.set(0.3, -0.22, -1.085);
        tip.rotation.x = Math.PI / 2;
        group.add(tip);
        const guard = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.01, 4, 8), brassMat);
        guard.rotation.z = Math.PI / 2;
        guard.position.set(0.3, -0.22, -0.15);
        group.add(guard);
        const guardRing = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.009, 4, 8), mat1);
        guardRing.position.set(0.3, -0.22, -0.12);
        group.add(guardRing);
        const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.2, 5), leatherMat);
        handle.position.set(0.3, -0.22, -0.02);
        handle.rotation.x = Math.PI / 2;
        group.add(handle);
        const pommel = new THREE.Mesh(new THREE.SphereGeometry(0.032, 6, 4), brassMat);
        pommel.position.set(0.3, -0.22, 0.1);
        group.add(pommel);
        break;
      }
      case 'sabre': {
        const blade = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.012, 0.6, 6), mat3);
        blade.position.set(0.3, -0.22, -0.55);
        blade.rotation.x = Math.PI / 2;
        group.add(blade);
        const tip = new THREE.Mesh(new THREE.ConeGeometry(0.032, 0.12, 4), mat3);
        tip.position.set(0.3, -0.22, -0.95);
        tip.rotation.x = Math.PI / 2;
        group.add(tip);
        const guard = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.03, 0.04, 6), brassMat);
        guard.position.set(0.3, -0.18, -0.1);
        guard.rotation.z = Math.PI / 2;
        group.add(guard);
        const knuckleGuard = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.008, 4, 8, Math.PI), mat1);
        knuckleGuard.position.set(0.3, -0.17, -0.08);
        knuckleGuard.rotation.z = Math.PI;
        group.add(knuckleGuard);
        const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.16, 5), leatherMat);
        handle.position.set(0.3, -0.22, -0.04);
        handle.rotation.x = Math.PI / 2;
        group.add(handle);
        const pommel = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 4), brassMat);
        pommel.position.set(0.3, -0.22, 0.09);
        group.add(pommel);
        break;
      }
      case 'espada': {
        const blade = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.008, 0.68, 6), mat3);
        blade.position.set(0.3, -0.22, -0.6);
        blade.rotation.x = Math.PI / 2;
        group.add(blade);
        const fuller = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.004, 0.35, 6), mat1);
        fuller.position.set(0.3, -0.22, -0.52);
        fuller.rotation.x = Math.PI / 2;
        group.add(fuller);
        const tip = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.12, 4), mat3);
        tip.position.set(0.3, -0.22, -1.0);
        tip.rotation.x = Math.PI / 2;
        group.add(tip);
        const guard = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.035, 0.03, 6), brassMat);
        guard.position.set(0.3, -0.18, -0.12);
        guard.rotation.z = Math.PI / 2;
        group.add(guard);
        const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.18, 5), leatherMat);
        handle.position.set(0.3, -0.22, -0.015);
        handle.rotation.x = Math.PI / 2;
        group.add(handle);
        const pommel = new THREE.Mesh(new THREE.IcosahedronGeometry(0.03, 0), brassMat);
        pommel.position.set(0.3, -0.22, 0.12);
        group.add(pommel);
        break;
      }
      case 'tridente': {
        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.8, 5), mat2);
        shaft.position.set(0.32, -0.15, -0.6);
        shaft.rotation.x = Math.PI / 2 + 0.1;
        group.add(shaft);
        const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.034, 0.32, 5), leatherMat);
        grip.position.set(0.32, -0.16, -0.02);
        grip.rotation.x = Math.PI / 2 + 0.1;
        group.add(grip);
        const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.07, 5), brassMat);
        collar.position.set(0.32, -0.08, -1.36);
        collar.rotation.x = Math.PI / 2 + 0.1;
        group.add(collar);
        const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.22, 6), brassMat);
        crown.position.set(0.32, -0.08, -1.43);
        crown.rotation.x = Math.PI / 2;
        group.add(crown);
        for (let i = -1; i <= 1; i++) {
          const prong = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.16, 4), mat3);
          prong.position.set(0.32 + i * 0.07, -0.08, -1.58);
          prong.rotation.x = Math.PI / 2;
          if (i !== 0) prong.rotation.z = i * 0.16;
          group.add(prong);
        }
        const buttCap = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.08, 5), brassMat);
        buttCap.position.set(0.32, -0.15, 0.33);
        buttCap.rotation.x = -Math.PI / 2 + 0.1;
        group.add(buttCap);
        break;
      }
      case 'machado': {
        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.0, 5), mat2);
        shaft.position.set(0.32, -0.15, -0.4);
        shaft.rotation.x = Math.PI / 2 + 0.1;
        group.add(shaft);
        const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.32, 5), leatherMat);
        grip.position.set(0.32, -0.16, -0.02);
        grip.rotation.x = Math.PI / 2 + 0.1;
        group.add(grip);
        const blade = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, 0.25, 4), mat1);
        blade.position.set(0.4, -0.1, -0.9);
        blade.scale.set(1.2, 1, 1);
        blade.rotation.z = -0.16;
        group.add(blade);
        const socket = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.16, 5), brassMat);
        socket.position.set(0.32, -0.1, -0.9);
        socket.rotation.z = Math.PI / 2;
        group.add(socket);
        const beard = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.12, 4), mat1);
        beard.position.set(0.45, -0.13, -0.95);
        beard.rotation.z = -Math.PI / 2;
        group.add(beard);
        const pommel = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 4), brassMat);
        pommel.position.set(0.32, -0.15, 0.15);
        group.add(pommel);
        break;
      }
      case 'alabarda': {
        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 2.0, 5), mat2);
        shaft.position.set(0.32, -0.15, -0.7);
        shaft.rotation.x = Math.PI / 2 + 0.1;
        group.add(shaft);
        const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.034, 0.34, 5), leatherMat);
        grip.position.set(0.32, -0.16, -0.02);
        grip.rotation.x = Math.PI / 2 + 0.1;
        group.add(grip);
        const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.047, 0.047, 0.08, 5), brassMat);
        collar.position.set(0.32, -0.08, -1.45);
        collar.rotation.x = Math.PI / 2 + 0.1;
        group.add(collar);
        const axe = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.28, 4), mat1);
        axe.position.set(0.39, -0.1, -0.9);
        axe.scale.set(1.3, 1.2, 1.1);
        axe.rotation.z = -0.15;
        group.add(axe);
        const hook = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.15, 4), darkMat);
        hook.position.set(0.22, -0.06, -1.6);
        hook.rotation.z = Math.PI / 2;
        group.add(hook);
        const tip = new THREE.Mesh(new THREE.ConeGeometry(0.028, 0.15, 4), mat3);
        tip.position.set(0.32, -0.03, -1.82);
        tip.rotation.x = Math.PI / 2;
        group.add(tip);
        const buttCap = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.1, 5), brassMat);
        buttCap.position.set(0.32, -0.15, 0.33);
        buttCap.rotation.x = -Math.PI / 2 + 0.1;
        group.add(buttCap);
        break;
      }
      case 'martelo': {
        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.9, 5), mat2);
        shaft.position.set(0.32, -0.15, -0.35);
        shaft.rotation.x = Math.PI / 2 + 0.1;
        group.add(shaft);
        const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.047, 0.047, 0.32, 5), leatherMat);
        grip.position.set(0.32, -0.16, -0.01);
        grip.rotation.x = Math.PI / 2 + 0.1;
        group.add(grip);
        const head = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.12, 4), darkMat);
        head.position.set(0.32, -0.1, -0.88);
        head.rotation.x = Math.PI / 4;
        group.add(head);
        for (const x of [-0.105, 0.105]) {
          const face = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.04, 5), mat1);
          face.position.set(0.32 + x, -0.1, -0.85);
          face.rotation.z = Math.PI / 2;
          group.add(face);
        }
        const band = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.08, 5), brassMat);
        band.position.set(0.32, -0.12, -0.7);
        band.rotation.x = Math.PI / 2 + 0.1;
        group.add(band);
        const pommel = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 4), brassMat);
        pommel.position.set(0.32, -0.15, 0.16);
        group.add(pommel);
        break;
      }
      case 'chicote': {
        const whipLeather = new THREE.MeshLambertMaterial({ color: 0x5e3218 });
        const whipDark = new THREE.MeshLambertMaterial({ color: 0x3a1f0d });
        const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.024, 0.24, 7), whipDark);
        handle.position.set(0.3, -0.22, -0.08);
        handle.rotation.x = Math.PI / 2 + 0.12;
        group.add(handle);
        for (let i = 0; i < 4; i++) {
          const wrap = new THREE.Mesh(new THREE.TorusGeometry(0.02, 0.006, 4, 8), whipLeather);
          wrap.position.set(0.3, -0.215 + i * 0.004, -0.02 - i * 0.05);
          wrap.rotation.x = Math.PI / 2 + 0.12;
          group.add(wrap);
        }
        const whipPommel = new THREE.Mesh(new THREE.SphereGeometry(0.028, 6, 4), brassMat);
        whipPommel.position.set(0.3, -0.235, 0.05);
        group.add(whipPommel);
        const lashPoints = [
          [0, -0.01, -0.26, 0], [0.03, -0.03, -0.44, 0.25],
          [-0.02, -0.07, -0.62, -0.2], [0.05, -0.13, -0.78, 0.35],
          [-0.04, -0.2, -0.9, -0.3]
        ];
        for (const [dx, dy, z, tilt] of lashPoints) {
          const seg = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.011, 0.2, 5), whipLeather);
          seg.position.set(0.3 + dx, -0.22 + dy, z);
          seg.rotation.x = Math.PI / 2 + tilt * 0.4;
          seg.rotation.z = tilt;
          group.add(seg);
        }
        const cracker = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.002, 0.14, 4),
          new THREE.MeshBasicMaterial({ color: 0xe8dcc0 }));
        cracker.position.set(0.26, -0.42, -1.0);
        cracker.rotation.z = 0.6;
        group.add(cracker);
        break;
      }
      case 'maca': {
        const maceShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.034, 0.85, 6), mat2);
        maceShaft.position.set(0.32, -0.15, -0.36);
        maceShaft.rotation.x = Math.PI / 2 + 0.1;
        group.add(maceShaft);
        const gripWrap = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.3, 6), leatherMat);
        gripWrap.position.set(0.32, -0.16, 0.0);
        gripWrap.rotation.x = Math.PI / 2 + 0.1;
        group.add(gripWrap);
        const collar = new THREE.Mesh(new THREE.TorusGeometry(0.038, 0.009, 4, 8), brassMat);
        collar.position.set(0.32, -0.135, -0.68);
        collar.rotation.x = Math.PI / 2 + 0.1;
        group.add(collar);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), darkMat);
        head.scale.set(1, 1.25, 1);
        head.position.set(0.32, -0.09, -0.88);
        group.add(head);
        for (let i = 0; i < 3; i++) {
          const spike = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.06, 5), brassMat);
          const a = (i / 3) * Math.PI * 2;
          spike.position.set(
            0.32 + Math.cos(a) * 0.085,
            -0.09 + Math.sin(a) * 0.105,
            -0.88
          );
          spike.rotation.z = -Math.cos(a) * 1.2;
          spike.rotation.x = Math.sin(a) * 1.2 + Math.PI / 2;
          group.add(spike);
        }
        const capRing = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.012, 5, 10), mat1);
        capRing.position.set(0.32, -0.09, -0.88);
        group.add(capRing);
        break;
      }
      default: {
        this.buildCatalogModel(id, w, group, { mat1, mat2, darkMat, leatherMat, brassMat });
      }
    }
    return group;
  }

  hashWeaponHue(id) {
    let h = 0;
    for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 360;
    return h;
  }

  weaponCategory(w) {
    const n = (w.name || '').toLowerCase();
    if (/sniper|awp|kar98|m24|barrett|dragunov/.test(n) || w.range >= 100) return 'sniper';
    if (/escopeta|shotgun|spas|m870|double barrel|aa-12|s12k/.test(n)) return 'shotgun';
    if (/smg|uzi|mp5|p90|vector/.test(n) || (w.cooldown || 1) <= 0.1) return 'smg';
    if (/pistol|glock|eagle|golden gun|hand cannon/.test(n)) return 'pistol';
    if (/rocket|bazuca|launcher|grenade|mini rocket/.test(n) || w.type === 'projectile') return 'launcher';
    if (/railgun|plasma|laser|energy|void|thunder|ice gun|hyper|lightning|cannon/.test(n)) return 'energy';
    if (/crossbow|besta|bow/.test(n)) return 'bow';
    if (/flamethrower|flame|fogo/.test(n)) return 'special';
    return 'rifle';
  }

  buildCatalogModel(id, w, group, mats) {
    const cat = this.weaponCategory(w);
    const hue = this.hashWeaponHue(id);
    const accent = new THREE.MeshLambertMaterial({ color: new THREE.Color().setHSL(hue / 360, 0.75, 0.5) });
    const glow = new THREE.MeshBasicMaterial({ color: new THREE.Color().setHSL(hue / 360, 0.9, 0.65) });
    const bodyMat = new THREE.MeshLambertMaterial({ color: new THREE.Color().setHSL(hue / 360, 0.25, 0.22) });
    const metal = mats.mat1;
    const dark = mats.darkMat;
    const wood = mats.mat2;
    const X = 0.3;

    const box = (wd, ht, dp, mat, px, py, pz, rx = 0) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(wd, ht, dp), mat);
      m.position.set(px, py, pz);
      m.rotation.x = rx;
      group.add(m);
      return m;
    };
    const tube = (r1, r2, len, mat, px, py, pz) => {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, len, 8), mat);
      m.position.set(px, py, pz);
      m.rotation.x = Math.PI / 2;
      group.add(m);
      return m;
    };

    if (cat === 'pistol') {
      box(0.07, 0.09, 0.3, bodyMat, X, -0.2, -0.28);
      tube(0.02, 0.02, 0.24, metal, X, -0.19, -0.52);
      box(0.06, 0.16, 0.08, dark, X, -0.3, -0.12, 0.25);
      box(0.05, 0.03, 0.06, accent, X, -0.13, -0.4);
    } else if (cat === 'smg') {
      box(0.08, 0.11, 0.42, bodyMat, X, -0.2, -0.34);
      tube(0.022, 0.022, 0.2, metal, X, -0.18, -0.62);
      box(0.05, 0.22, 0.07, accent, X, -0.33, -0.36);
      box(0.06, 0.14, 0.09, dark, X, -0.28, -0.08, 0.2);
      box(0.05, 0.05, 0.16, dark, X, -0.17, 0.06);
    } else if (cat === 'rifle') {
      box(0.08, 0.12, 0.55, bodyMat, X, -0.2, -0.38);
      tube(0.024, 0.024, 0.34, metal, X, -0.18, -0.78);
      box(0.05, 0.24, 0.08, accent, X, -0.34, -0.34);
      box(0.07, 0.13, 0.2, wood, X, -0.22, 0.02, 0.12);
      box(0.03, 0.05, 0.03, dark, X, -0.1, -0.9);
      box(0.05, 0.04, 0.1, dark, X, -0.11, -0.28);
    } else if (cat === 'shotgun') {
      tube(0.045, 0.045, 0.7, bodyMat, X, -0.18, -0.55);
      tube(0.03, 0.03, 0.55, metal, X, -0.13, -0.58);
      box(0.07, 0.1, 0.26, wood, X, -0.22, 0.0, 0.15);
      box(0.06, 0.06, 0.16, accent, X, -0.13, -0.5);
      box(0.07, 0.12, 0.1, dark, X, -0.24, -0.85);
    } else if (cat === 'sniper') {
      box(0.07, 0.11, 0.6, bodyMat, X, -0.2, -0.42);
      tube(0.022, 0.018, 0.55, metal, X, -0.18, -0.95);
      tube(0.035, 0.035, 0.22, dark, X, -0.08, -0.4);
      tube(0.04, 0.04, 0.03, glow, X, -0.08, -0.52);
      box(0.05, 0.2, 0.07, dark, X, -0.32, -0.3);
      box(0.07, 0.14, 0.22, wood, X, -0.24, 0.04, 0.18);
    } else if (cat === 'launcher') {
      tube(0.07, 0.07, 0.72, bodyMat, X, -0.18, -0.5);
      tube(0.085, 0.07, 0.1, accent, X, -0.18, -0.88);
      tube(0.05, 0.05, 0.08, dark, X, -0.18, -0.1);
      box(0.05, 0.16, 0.07, dark, X, -0.3, -0.3, 0.2);
      box(0.04, 0.04, 0.12, metal, X, -0.05, -0.35);
    } else if (cat === 'energy') {
      box(0.09, 0.13, 0.48, bodyMat, X, -0.2, -0.36);
      tube(0.028, 0.01, 0.3, glow, X, -0.18, -0.72);
      tube(0.05, 0.05, 0.05, glow, X, -0.18, -0.3);
      tube(0.05, 0.05, 0.05, glow, X, -0.18, -0.44);
      box(0.06, 0.18, 0.08, dark, X, -0.32, -0.16, 0.2);
      box(0.1, 0.03, 0.14, accent, X, -0.11, -0.3);
    } else if (cat === 'bow') {
      const limb = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.02, 6, 12, Math.PI), wood);
      limb.position.set(X, -0.2, -0.45);
      limb.rotation.y = Math.PI / 2;
      group.add(limb);
      const stringLine = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.56, 4), mats.stringMat || mats.leatherMat);
      stringLine.position.set(X, -0.2, -0.45);
      group.add(stringLine);
      tube(0.015, 0.015, 0.4, metal, X, -0.2, -0.3);
      box(0.05, 0.1, 0.08, accent, X, -0.24, -0.45);
    } else if (cat === 'special') {
      box(0.1, 0.14, 0.5, bodyMat, X, -0.2, -0.36);
      tube(0.05, 0.035, 0.4, metal, X, -0.18, -0.68);
      const tank = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), accent);
      tank.position.set(X, -0.12, -0.05);
      group.add(tank);
      const flameTip = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.1, 6), glow);
      flameTip.position.set(X, -0.18, -0.92);
      flameTip.rotation.x = -Math.PI / 2;
      group.add(flameTip);
      box(0.06, 0.16, 0.08, dark, X, -0.31, -0.2, 0.22);
    } else {
      box(0.08, 0.12, 0.5, bodyMat, X, -0.2, -0.36);
      tube(0.024, 0.024, 0.3, metal, X, -0.18, -0.72);
      box(0.05, 0.2, 0.08, accent, X, -0.32, -0.3);
      box(0.07, 0.13, 0.18, wood, X, -0.22, 0.02, 0.12);
    }
    return group;
  }

  createRangedModel(id, group) {
    const mat1 = new THREE.MeshLambertMaterial({ color: 0x888888 });
    const mat2 = new THREE.MeshLambertMaterial({ color: 0x4a3018 });
    const darkMat = new THREE.MeshLambertMaterial({ color: 0x28231e });
    const leatherMat = new THREE.MeshLambertMaterial({ color: 0x6c4224 });
    const brassMat = new THREE.MeshLambertMaterial({ color: 0xb88b35 });
    const stringMat = new THREE.MeshLambertMaterial({ color: 0xccccaa });

  switch (id) {
  case 'pistola': {
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.045, 0.34, 8),
      darkMat
    );
    body.position.set(0.3, -0.22, -0.32);
    body.rotation.x = Math.PI / 2;
    group.add(body);

    const barrel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.024, 0.024, 0.32, 8),
      mat1
    );
    barrel.position.set(0.3, -0.2, -0.62);
    barrel.rotation.x = Math.PI / 2;
    group.add(barrel);

    const muzzle = new THREE.Mesh(
      new THREE.ConeGeometry(0.06, 0.03, 6),
      brassMat
    );
    muzzle.position.set(0.3, -0.2, -0.8);
    muzzle.rotation.x = -Math.PI / 2;
    group.add(muzzle);

    const hammer = new THREE.Mesh(
      new THREE.SphereGeometry(0.022, 6, 4),
      mat1
    );
    hammer.position.set(0.3, -0.16, -0.12);
    group.add(hammer);

    const sight = new THREE.Mesh(
      new THREE.CylinderGeometry(0.018, 0.025, 0.07, 4),
      brassMat
    );
    sight.position.set(0.3, -0.16, -0.5);
    group.add(sight);

    const grip = new THREE.Mesh(
      new THREE.CylinderGeometry(0.018, 0.032, 0.14, 6),
      leatherMat
    );
    grip.position.set(0.3, -0.33, -0.16);
    grip.rotation.x = 0.3;
    group.add(grip);

    const triggerGuard = new THREE.Mesh(
      new THREE.TorusGeometry(0.04, 0.009, 4, 6, Math.PI),
      brassMat
    );
    triggerGuard.position.set(0.3, -0.29, -0.28);
    triggerGuard.rotation.y = Math.PI / 2;
    group.add(triggerGuard);

    break;
  }
      case 'funda': {
        const pouch = new THREE.Mesh(new THREE.IcosahedronGeometry(0.075, 1), leatherMat);
        pouch.position.set(0.3, -0.22, -0.4);
        group.add(pouch);
        const collar = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.009, 4, 8), brassMat);
        collar.position.set(0.3, -0.22, -0.34);
        collar.rotation.x = Math.PI / 2;
        group.add(collar);
        const rope1 = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.5, 4), stringMat);
        rope1.position.set(0.3, -0.22, -0.15);
        rope1.rotation.x = Math.PI / 2;
        group.add(rope1);
        const rope2 = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.46, 4), stringMat);
        rope2.position.set(0.3, -0.22, -0.38);
        rope2.rotation.z = Math.PI / 2;
        group.add(rope2);
        const knot = new THREE.Mesh(new THREE.SphereGeometry(0.025, 5, 4), brassMat);
        knot.position.set(0.3, -0.22, 0.1);
        group.add(knot);
        break;
      }
      case 'bumerangue': {
        const arm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.028, 0.38, 4), mat2);
        arm1.position.set(0.3, -0.22, -0.45);
        arm1.rotation.y = 0.42;
        group.add(arm1);
        const arm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.028, 0.38, 4), mat2);
        arm2.position.set(0.3, -0.22, -0.45);
        arm2.rotation.y = -0.42;
        group.add(arm2);
        const center = new THREE.Mesh(new THREE.SphereGeometry(0.045, 5, 4), brassMat);
        center.position.set(0.3, -0.22, -0.45);
        group.add(center);
        for (const angle of [0.42, -0.42]) {
          const edge = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.018, 0.26, 4), darkMat);
          edge.position.set(0.3, -0.21, -0.48);
          edge.rotation.y = angle;
          group.add(edge);
        }
        break;
      }
      case 'arco': {
        const bow = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.02, 4, 10, Math.PI), mat2);
        bow.position.set(0.3, -0.22, -0.5);
        bow.rotation.y = Math.PI / 2;
        group.add(bow);
        const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.16, 5), leatherMat);
        grip.position.set(0.3, -0.22, -0.5);
        grip.rotation.x = Math.PI / 2;
        group.add(grip);
        const string = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.55, 4), stringMat);
        string.position.set(0.3, -0.22, -0.5);
        group.add(string);
        const arrow = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.52, 4), mat2);
        arrow.position.set(0.3, -0.22, -0.62);
        arrow.rotation.x = Math.PI / 2;
        group.add(arrow);
        const arrowhead = new THREE.Mesh(new THREE.ConeGeometry(0.026, 0.1, 4), mat1);
        arrowhead.position.set(0.3, -0.22, -0.93);
        arrowhead.rotation.x = Math.PI / 2;
        group.add(arrowhead);
        for (const x of [-0.022, 0.022]) {
          const fletching = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.07, 4), brassMat);
          fletching.position.set(0.3 + x, -0.22, -0.36);
          group.add(fletching);
        }
        break;
      }
      case 'besta': {
const stock = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.55, 6), mat2);
        stock.position.set(0.3, -0.28, -0.3);
        group.add(stock);
        const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.02, 0.6, 4), darkMat);
        rail.position.set(0.3, -0.22, -0.38);
        group.add(rail);
        const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.56, 4), mat2);
        bolt.position.set(0.3, -0.19, -0.57);
        bolt.rotation.x = Math.PI / 2;
        group.add(bolt);
        const boltHead = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.09, 4), mat1);
        boltHead.position.set(0.3, -0.19, -0.91);
        boltHead.rotation.x = Math.PI / 2;
        group.add(boltHead);
        const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.015, 0.4, 4), mat2);
        armL.position.set(0.08, -0.24, -0.67);
        armL.rotation.z = 0.2;
        group.add(armL);
        const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.015, 0.4, 4), mat2);
        armR.position.set(0.52, -0.24, -0.67);
        armR.rotation.z = -0.2;
        group.add(armR);
        const bowString = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.43, 4), stringMat);
        bowString.position.set(0.3, -0.24, -0.68);
        bowString.rotation.z = Math.PI / 2;
        group.add(bowString);
        const stirrup = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.008, 4, 6, Math.PI), mat1);
        stirrup.position.set(0.3, -0.24, -0.83);
        stirrup.rotation.y = Math.PI / 2;
        group.add(stirrup);
        const trigger = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.05, 4), brassMat);
        trigger.position.set(0.3, -0.35, -0.14);
        trigger.rotation.x = -0.25;
        group.add(trigger);
        break;
      }
      case 'ak47': {
        const bodyMat = new THREE.MeshLambertMaterial({ color: 0x20201e });
        const steelMat = new THREE.MeshLambertMaterial({ color: 0x3d4043 });
        const woodMat = new THREE.MeshLambertMaterial({ color: 0x5a3a20 });
const receiver = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.045, 0.52, 6), bodyMat);
        receiver.position.set(0.3, -0.22, -0.36);
        group.add(receiver);
        const receiverLower = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 0.4, 6), steelMat);
        receiverLower.position.set(0.3, -0.25, -0.32);
        group.add(receiverLower);
        const dustCover = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.03, 0.36, 6), steelMat);
        dustCover.position.set(0.3, -0.17, -0.38);
        group.add(dustCover);
        const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8), steelMat);
        barrel.position.set(0.3, -0.2, -0.74);
        barrel.rotation.x = Math.PI / 2;
        group.add(barrel);
        const barrelStart = new THREE.Mesh(new THREE.CylinderGeometry(0.023, 0.02, 0.07, 8), bodyMat);
        barrelStart.position.set(0.3, -0.2, -0.51);
        barrelStart.rotation.x = Math.PI / 2;
        group.add(barrelStart);
        const gasTube = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.34, 8), steelMat);
        gasTube.position.set(0.3, -0.155, -0.66);
        gasTube.rotation.x = Math.PI / 2;
        group.add(gasTube);
        const gasBlock = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.07, 8), bodyMat);
        gasBlock.position.set(0.3, -0.155, -0.86);
        group.add(gasBlock);
        const frontSight = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.025, 0.045, 4), bodyMat);
        frontSight.position.set(0.3, -0.14, -0.9);
        group.add(frontSight);
        const muzzleBrake = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.09, 8), bodyMat);
        muzzleBrake.position.set(0.3, -0.2, -1.02);
        muzzleBrake.rotation.x = Math.PI / 2;
        group.add(muzzleBrake);
        const mag = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.24, 6), steelMat);
        mag.position.set(0.3, -0.4, -0.3);
        mag.rotation.x = 0.35;
        group.add(mag);
        const magPlate = new THREE.Mesh(new THREE.CylinderGeometry(0.0275, 0.0175, 0.1, 6), bodyMat);
        magPlate.position.set(0.3, -0.53, -0.22);
        magPlate.rotation.x = 0.35;
        group.add(magPlate);
        const handguard = new THREE.Mesh(new THREE.CylinderGeometry(0.0275, 0.03, 0.24, 6), woodMat);
        handguard.position.set(0.3, -0.19, -0.56);
        group.add(handguard);
        const handguardBottom = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.0175, 0.22, 6), woodMat);
        handguardBottom.position.set(0.3, -0.23, -0.55);
        group.add(handguardBottom);
        const stock = new THREE.Mesh(new THREE.CylinderGeometry(0.0275, 0.045, 0.3, 6), woodMat);
        stock.position.set(0.3, -0.24, -0.02);
        stock.rotation.x = -0.08;
        group.add(stock);
        const stockButt = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.0525, 0.06, 6), woodMat);
        stockButt.position.set(0.3, -0.24, 0.14);
        stockButt.rotation.x = -0.08;
        group.add(stockButt);
        const buttPlate = new THREE.Mesh(new THREE.CylinderGeometry(0.0375, 0.0575, 0.02, 6), bodyMat);
        buttPlate.position.set(0.3, -0.24, 0.18);
        buttPlate.rotation.x = -0.08;
        group.add(buttPlate);
        const triggerGuard = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.006, 4, 6, Math.PI), steelMat);
        triggerGuard.position.set(0.3, -0.3, -0.27);
        triggerGuard.rotation.y = Math.PI / 2;
        group.add(triggerGuard);
        const rearSight = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.045, 4), bodyMat);
        rearSight.position.set(0.3, -0.16, -0.5);
        group.add(rearSight);
        const chargingHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.0175, 0.01, 0.07, 6), steelMat);
        chargingHandle.position.set(0.33, -0.2, -0.42);
        group.add(chargingHandle);
        break;
      }
      case 'minigun': {
        const bodyMat = new THREE.MeshLambertMaterial({ color: 0x1c1c1e });
        const steelMat = new THREE.MeshLambertMaterial({ color: 0x3a3d40 });
        const gunmetalMat = new THREE.MeshLambertMaterial({ color: 0x55585c });
        const housing = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.095, 0.5, 12), bodyMat);
        housing.position.set(0.3, -0.22, -0.38);
        housing.rotation.x = Math.PI / 2;
        group.add(housing);
        for (const z of [-0.6, -0.72, -0.84]) {
          const ring = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.01, 6, 12), brassMat);
          ring.position.set(0.3, -0.22, z);
          ring.rotation.x = Math.PI / 2;
          group.add(ring);
        }
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2;
          const brl = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.72, 8), steelMat);
          brl.position.set(0.3 + Math.cos(a) * 0.058, -0.22 + Math.sin(a) * 0.058, -0.78);
          brl.rotation.x = Math.PI / 2;
          group.add(brl);
          const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.02, 0.05, 8), gunmetalMat);
          tip.position.set(0.3 + Math.cos(a) * 0.058, -0.22 + Math.sin(a) * 0.058, -1.13);
          tip.rotation.x = Math.PI / 2;
          group.add(tip);
        }
        const core = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.78, 8), brassMat);
        core.position.set(0.3, -0.22, -0.78);
        core.rotation.x = Math.PI / 2;
        group.add(core);
        const receiver = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.065, 0.24, 6), bodyMat);
        receiver.position.set(0.3, -0.22, -0.04);
        group.add(receiver);
        const receiverTop = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.24, 6), steelMat);
        receiverTop.position.set(0.3, -0.14, -0.04);
        group.add(receiverTop);
        const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.09, 10), gunmetalMat);
        motor.position.set(0.3, -0.22, 0.1);
        motor.rotation.x = Math.PI / 2;
        group.add(motor);
        const motorRing = new THREE.Mesh(new THREE.TorusGeometry(0.078, 0.008, 5, 10), brassMat);
        motorRing.position.set(0.3, -0.22, 0.05);
        motorRing.rotation.x = Math.PI / 2;
        group.add(motorRing);
        for (let i = 0; i < 8; i++) {
          const link = new THREE.Mesh(new THREE.CylinderGeometry(0.0175, 0.009, 0.05, 4), brassMat);
          link.position.set(0.3 + 0.055 * (i + 0.5), -0.13, -0.24 - Math.sin(i * 0.5) * 0.02);
          link.rotation.z = -0.5;
          group.add(link);
        }
        const beltBox = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, 0.14, 6), bodyMat);
        beltBox.position.set(0.42, -0.13, -0.2);
        beltBox.rotation.z = 0.35;
        group.add(beltBox);
        const ammoRound = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.06, 5), brassMat);
        ammoRound.position.set(0.47, -0.08, -0.2);
        ammoRound.rotation.z = 0.35;
        group.add(ammoRound);
        const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.085, 0.06, 6), leatherMat);
        grip.position.set(0.3, -0.37, -0.13);
        grip.rotation.x = 0.18;
        group.add(grip);
        for (const [gy, gz] of [[-0.32, -0.13], [-0.28, -0.12]]) {
          const wrap = new THREE.Mesh(new THREE.TorusGeometry(0.037, 0.007, 4, 8), brassMat);
          wrap.position.set(0.3, gy, gz);
          wrap.rotation.x = 0.18;
          wrap.rotation.z = Math.PI / 2;
          group.add(wrap);
        }
        const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.06, 0.04, 6), bodyMat);
        handle.position.set(0.3, -0.33, -0.55);
        handle.rotation.x = 0.15;
        group.add(handle);
        const carry = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.045, 0.22, 6), bodyMat);
        carry.position.set(0.3, -0.13, -0.32);
        group.add(carry);
        break;
      }
      case 'cajado_fogo': {
        const staff = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.038, 1.4, 6), mat2);
        staff.position.set(0.3, -0.15, -0.5);
        staff.rotation.x = Math.PI / 2 + 0.1;
        group.add(staff);
        const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.04, 0.3, 6), leatherMat);
        grip.position.set(0.3, -0.16, -0.02);
        grip.rotation.x = Math.PI / 2 + 0.1;
        group.add(grip);
        const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.07, 6), brassMat);
        collar.position.set(0.3, -0.09, -1.22);
        collar.rotation.x = Math.PI / 2 + 0.1;
        group.add(collar);
        const orbMat = new THREE.MeshStandardMaterial({ color: 0xffaa33, emissive: 0xff5500, emissiveIntensity: 1.6 });
        const orb = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), orbMat);
        orb.position.set(0.3, -0.07, -1.35);
        group.add(orb);
        const inner = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffeebb }));
        inner.position.set(0.3, -0.07, -1.35);
        group.add(inner);
        for (let i = 0; i < 4; i++) {
          const a = (i / 4) * Math.PI * 2;
          const flame = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.12, 5), new THREE.MeshBasicMaterial({ color: 0xff8800, transparent: true, opacity: 0.8 }));
          flame.position.set(0.3 + Math.cos(a) * 0.05, -0.07 + Math.sin(a) * 0.05, -1.35);
          flame.rotation.z = Math.PI / 2 + a;
          group.add(flame);
        }
        break;
      }
      case 'bazuca': {
        const tubeMat = new THREE.MeshLambertMaterial({ color: 0x2f2f2f });
        const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.95, 10), tubeMat);
        tube.position.set(0.3, -0.2, -0.6);
        tube.rotation.x = Math.PI / 2;
        group.add(tube);
        const muzzle = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.07, 0.12, 10), darkMat);
        muzzle.position.set(0.3, -0.2, -1.1);
        muzzle.rotation.x = Math.PI / 2;
        group.add(muzzle);
        const rear = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.16, 8), darkMat);
        rear.position.set(0.3, -0.2, -0.12);
        rear.rotation.x = Math.PI / 2;
        group.add(rear);
        const rocketBody = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.5, 8), mat1);
        rocketBody.position.set(0.3, -0.2, -0.75);
        rocketBody.rotation.x = Math.PI / 2;
        group.add(rocketBody);
        const rocketNose = new THREE.Mesh(new THREE.ConeGeometry(0.032, 0.16, 8), brassMat);
        rocketNose.position.set(0.3, -0.2, -1.03);
        rocketNose.rotation.x = Math.PI / 2;
        group.add(rocketNose);
        const warhead = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.1, 8), new THREE.MeshLambertMaterial({ color: 0xc0392b }));
        warhead.position.set(0.3, -0.2, -0.9);
        warhead.rotation.x = Math.PI / 2;
        group.add(warhead);
        const sight = new THREE.Mesh(new THREE.SphereGeometry(0.022, 6, 4), brassMat);
        sight.scale.set(0.9, 1.4, 1.1);
        sight.position.set(0.3, -0.12, -0.7);
        group.add(sight);
        const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.026, 0.12, 6), leatherMat);
        grip.position.set(0.3, -0.32, -0.42);
        grip.rotation.x = 0.25;
        group.add(grip);
        const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.13, 6), mat2);
        handle.position.set(0.3, -0.32, -0.15);
        handle.rotation.x = 0.2;
        group.add(handle);
        break;
      }
      case 'april_fools': {
        const goldMat = new THREE.MeshLambertMaterial({ color: 0xffd700 });
        const brightGold = new THREE.MeshLambertMaterial({ color: 0xffe55a });
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.03, 0.22, 8), goldMat);
        body.rotation.x = Math.PI / 2;
        body.position.set(0.3, -0.2, -0.3);
        group.add(body);
        const slide = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.024, 0.3, 8), brightGold);
        slide.rotation.x = Math.PI / 2;
        slide.position.set(0.3, -0.165, -0.38);
        group.add(slide);
        const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.22, 6), brightGold);
        barrel.position.set(0.3, -0.185, -0.65);
        barrel.rotation.x = Math.PI / 2;
        group.add(barrel);
        const muzzle = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.05, 6), goldMat);
        muzzle.position.set(0.3, -0.185, -0.79);
        muzzle.rotation.x = Math.PI / 2;
        group.add(muzzle);
        const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.028, 0.13, 6), goldMat);
        grip.position.set(0.3, -0.3, -0.16);
        grip.rotation.x = 0.3;
        group.add(grip);
        const hammer = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 4), brightGold);
        hammer.scale.set(1.6, 1.3, 1.3);
        hammer.position.set(0.3, -0.155, -0.12);
        group.add(hammer);
        const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.018, 0), brightGold);
        star.position.set(0.3, -0.17, -0.42);
        group.add(star);
        break;
      }
      case 'chicken_gun': {
        const chickenMat = new THREE.MeshLambertMaterial({ color: 0xf7e04b });
        const beakMat = new THREE.MeshLambertMaterial({ color: 0xff8c1a });
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.038, 0.3, 8), darkMat);
        body.rotation.x = Math.PI / 2;
        body.position.set(0.3, -0.2, -0.32);
        group.add(body);
        const chickenBody = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 8), chickenMat);
        chickenBody.position.set(0.3, -0.16, -0.6);
        chickenBody.scale.set(1, 0.85, 1.4);
        group.add(chickenBody);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 6), chickenMat);
        head.position.set(0.3, -0.11, -0.78);
        group.add(head);
        const comb = new THREE.Mesh(new THREE.SphereGeometry(0.018, 5, 4), new THREE.MeshLambertMaterial({ color: 0xd92626 }));
        comb.position.set(0.3, -0.055, -0.8);
        comb.scale.set(1, 0.6, 1);
        group.add(comb);
        const beak = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.07, 4), beakMat);
        beak.position.set(0.3, -0.11, -0.84);
        beak.rotation.x = Math.PI / 2;
        group.add(beak);
        const wattle = new THREE.Mesh(new THREE.SphereGeometry(0.012, 5, 4), beakMat);
        wattle.position.set(0.3, -0.16, -0.79);
        group.add(wattle);
        const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.3, 6), darkMat);
        barrel.position.set(0.3, -0.2, -0.85);
        barrel.rotation.x = Math.PI / 2;
        group.add(barrel);
        const wing = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 5), chickenMat);
        wing.position.set(0.34, -0.16, -0.6);
        wing.scale.set(0.7, 1, 1.2);
        group.add(wing);
        const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.13, 6), leatherMat);
        grip.position.set(0.3, -0.33, -0.16);
        grip.rotation.x = 0.3;
        group.add(grip);
        break;
      }
      case 'clone_gun': {
        const shellMat = new THREE.MeshLambertMaterial({ color: 0x1f2a44 });
        const glowMat = new THREE.MeshBasicMaterial({ color: 0x64ffda });
        const chromeMat = new THREE.MeshLambertMaterial({ color: 0x9aa7c7 });

        const body = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.13, 0.42), shellMat);
        body.position.set(0.3, -0.2, -0.32);
        group.add(body);

        const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.038, 0.3, 10), chromeMat);
        barrel.rotation.x = Math.PI / 2;
        barrel.position.set(0.3, -0.19, -0.62);
        group.add(barrel);

        const emitter = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.012, 6, 14), glowMat);
        emitter.position.set(0.3, -0.19, -0.78);
        group.add(emitter);

        const coreOrb = new THREE.Mesh(new THREE.SphereGeometry(0.032, 10, 8),
          new THREE.MeshStandardMaterial({ color: 0x64ffda, emissive: 0x18e0b8, emissiveIntensity: 2 }));
        coreOrb.position.set(0.3, -0.19, -0.78);
        group.add(coreOrb);

        const dnaHelix = new THREE.Group();
        for (let i = 0; i < 6; i++) {
          const node = new THREE.Mesh(new THREE.SphereGeometry(0.009, 5, 4), glowMat);
          const a = i * Math.PI / 3;
          node.position.set(Math.cos(a) * 0.02, -0.07 + i * 0.028, -0.16);
          dnaHelix.add(node);
        }
        group.add(dnaHelix);

        const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.14, 8), new THREE.MeshLambertMaterial({
          color: 0x64ffda, transparent: true, opacity: 0.45
        }));
        tank.rotation.z = Math.PI / 2;
        tank.position.set(0.3, -0.11, -0.28);
        group.add(tank);

        const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.026, 0.14, 6), shellMat);
        grip.position.set(0.3, -0.31, -0.17);
        grip.rotation.x = 0.28;
        group.add(grip);
        break;
      }
      case 'sniper': {
        const scopeMat = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
        const stock = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.052, 0.55, 8), mat2);
        stock.rotation.x = Math.PI / 2;
        stock.position.set(0.3, -0.26, -0.18);
        group.add(stock);
        const butt = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.16, 8), leatherMat);
        butt.rotation.x = Math.PI / 2;
        butt.position.set(0.3, -0.26, 0.14);
        group.add(butt);
        const receiver = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.043, 0.5, 8), darkMat);
        receiver.rotation.x = Math.PI / 2;
        receiver.position.set(0.3, -0.22, -0.55);
        group.add(receiver);
        const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.9, 8), mat1);
        barrel.position.set(0.3, -0.205, -1.0);
        barrel.rotation.x = Math.PI / 2;
        group.add(barrel);
        const muzzleBrake = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.08, 8), darkMat);
        muzzleBrake.position.set(0.3, -0.205, -1.45);
        muzzleBrake.rotation.x = Math.PI / 2;
        group.add(muzzleBrake);
        const scopeTube = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.34, 10), scopeMat);
        scopeTube.position.set(0.3, -0.14, -0.62);
        scopeTube.rotation.x = Math.PI / 2;
        group.add(scopeTube);
        const scopeFront = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.032, 0.07, 10), darkMat);
        scopeFront.position.set(0.3, -0.14, -0.46);
        scopeFront.rotation.x = Math.PI / 2;
        group.add(scopeFront);
        const scopeRear = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.032, 0.07, 10), darkMat);
        scopeRear.position.set(0.3, -0.14, -0.79);
        scopeRear.rotation.x = Math.PI / 2;
        group.add(scopeRear);
        const lensMat = new THREE.MeshBasicMaterial({ color: 0x88ccff });
        const lensFront = new THREE.Mesh(new THREE.CircleGeometry(0.028, 10), lensMat);
        lensFront.position.set(0.3, -0.14, -0.43);
        lensFront.rotation.y = Math.PI / 2;
        group.add(lensFront);
        const lensRear = new THREE.Mesh(new THREE.CircleGeometry(0.028, 10), lensMat);
        lensRear.position.set(0.3, -0.14, -0.82);
        lensRear.rotation.y = -Math.PI / 2;
        group.add(lensRear);
        const mount = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.016, 0.1, 6), darkMat);
        mount.rotation.x = Math.PI / 2;
        mount.position.set(0.3, -0.18, -0.62);
        group.add(mount);
        const mag = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.022, 0.14, 6), mat1);
        mag.position.set(0.3, -0.33, -0.55);
        mag.rotation.x = 0.12;
        group.add(mag);
        const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.028, 0.13, 6), leatherMat);
        grip.position.set(0.3, -0.33, -0.3);
        grip.rotation.x = 0.25;
        group.add(grip);
        const bipod = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.1, 6), darkMat);
        bipod.position.set(0.3, -0.33, -1.0);
        group.add(bipod);
        break;
      }
      case 'brick': {
        const brickMat = new THREE.MeshLambertMaterial({ color: 0x9c4a2f });
        const held = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.13, 0.12), brickMat);
        held.position.set(0.3, -0.24, -0.5);
        held.rotation.z = 0.15;
        held.castShadow = true;
        group.add(held);
        const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.265, 0.032, 0.125),
          new THREE.MeshLambertMaterial({ color: 0x7a3823 }));
        stripe.position.set(0.3, -0.24, -0.5);
        stripe.rotation.z = 0.15;
        group.add(stripe);
        const chip = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.03, 0.04),
          new THREE.MeshLambertMaterial({ color: 0xb85c3a }));
        chip.position.set(0.24, -0.19, -0.46);
        group.add(chip);
        break;
      }
      default: {
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 8), mat2);
        body.rotation.x = Math.PI / 2;
        body.position.set(0.3, -0.22, -0.4);
        group.add(body);
        const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.18, 6), mat1);
        barrel.position.set(0.3, -0.22, -0.75);
        barrel.rotation.x = Math.PI / 2;
        group.add(barrel);
      }
    }
    return group;
  }

  fire(targets) {
    if (this.cooldown > 0) return null;
    const w = WEAPONS[this.currentWeapon];
    this._lastTargets = targets || [];

    if (w.type === 'clone') {
      this.cooldown = w.cooldown;
      this.recoil = 1;
      Audio.crossbowShoot();
      if (typeof this.onCloneFire === 'function') this.onCloneFire();
      return null;
    }

    if (w.type !== 'melee' && this.currentWeapon !== 'minigun') {
      if (this.ammo <= 0) return null;
      this.ammo--;
      if (this.currentWeapon === 'brick' && this.ammo <= 0 && !(typeof this.isInfinite === 'function' && this.isInfinite())) {
        this.consumeBrick();
      }
    }

    this.cooldown = w.cooldown;
    this.recoil = 1;
    this.showHitbox();
    this.raycaster.far = w.range;

    if (w.type === 'melee') {
      Audio.knifeSlash();
      return this.meleeHit(targets, w.range);
    }

    if (w.type === 'hitscan') {
      Audio.gunshot();
      this.updateDisplay();
      const firstHit = this.hitscanHit(targets, w.range);
      if (this.currentWeapon === 'minigun') {
        const secondHit = this.hitscanHit(targets, w.range);
        if (secondHit) {
          this.pendingHits.push({ target: secondHit, damage: w.damage });
        }
      }
      return firstHit;
    }

    Audio.crossbowShoot();
    this.spawnProjectile(targets);
    this.updateDisplay();
    return null;
  }

  consumeBrick() {
    const idx = this.inventory.indexOf('brick');
    if (idx === -1) return;
    this.inventory.splice(idx, 1);
    if (this.currentIndex >= this.inventory.length) this.currentIndex = 0;
    this.currentWeapon = this.inventory[this.currentIndex] || 'bastao';
    this.buildCurrentModel();
    this.updateHitbox();
    this.updateDisplay();
    this.updateInventoryDisplay();
  }

  setInfiniteAmmo(v) { this.infiniteAmmo = v; }

  getDamage() {
    return WEAPONS[this.currentWeapon].damage;
  }

  meleeHit(targets, range) {
    const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
    this.raycaster.set(this.camera.position, dir);
    this.raycaster.far = range;

    const alive = targets.filter(t => t.alive);
    const meshes = [];
    alive.forEach(t => t.mesh.traverse(child => {
      if (child.isMesh) meshes.push(child);
    }));

    const intersects = this.raycaster.intersectObjects(meshes);
    if (intersects.length > 0) {
      const hitMesh = intersects[0].object;
      return alive.find(t => {
        let found = false;
        t.mesh.traverse(child => { if (child === hitMesh) found = true; });
        return found;
      }) || null;
    }
    return null;
  }

  hitscanHit(targets, range) {
    const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
    this.raycaster.set(this.camera.position, dir);
    this.raycaster.far = range;

    const alive = targets.filter(t => t.alive);
    const meshes = [];
    alive.forEach(t => t.mesh.traverse(child => {
      if (child.isMesh) meshes.push(child);
    }));

    const intersects = this.raycaster.intersectObjects(meshes);
    if (intersects.length > 0) {
      const hitMesh = intersects[0].object;
      return alive.find(t => {
        let found = false;
        t.mesh.traverse(child => { if (child === hitMesh) found = true; });
        return found;
      }) || null;
    }
    return null;
  }

  spawnProjectile(targets) {
    const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
    const pos = this.camera.position.clone();
    const w = WEAPONS[this.currentWeapon];

    const projGroup = new THREE.Group();
    let speed = 55;
    let damage = w.damage;

    if (this.currentWeapon === 'bazuca') {
      const rocketMat = new THREE.MeshLambertMaterial({ color: 0x6b8e23 });
      const rocketBody = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.4, 8), rocketMat);
      rocketBody.rotation.x = Math.PI / 2;
      projGroup.add(rocketBody);

      const noseMat = new THREE.MeshLambertMaterial({ color: 0x8b0000 });
      const nose = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.18, 8), noseMat);
      nose.position.z = -0.29;
      nose.rotation.x = -Math.PI / 2;
      projGroup.add(nose);

      for (let i = 0; i < 4; i++) {
        const fin = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.09, 4), noseMat);
        fin.rotation.x = Math.PI / 2;
        fin.position.z = 0.15;
        fin.rotation.z = (i / 4) * Math.PI * 2;
        projGroup.add(fin);
      }
      speed = 45;
    } else if (this.currentWeapon === 'chicken_gun') {
      const chickMat = new THREE.MeshLambertMaterial({ color: 0xf7e04b });
      const chickBody = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 6), chickMat);
      chickBody.scale.set(1, 0.85, 1.3);
      projGroup.add(chickBody);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 6), chickMat);
      head.position.set(0, 0.035, -0.1);
      projGroup.add(head);

      const beakMat = new THREE.MeshLambertMaterial({ color: 0xff8c1a });
      const beak = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.06, 4), beakMat);
      beak.position.set(0, 0.035, -0.15);
      beak.rotation.x = Math.PI / 2;
      projGroup.add(beak);

      speed = 50;
      damage = Math.floor(5 + Math.random() * 76);
    } else {
      const shaftGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.5, 4);
      const shaftMat = new THREE.MeshLambertMaterial({ color: 0x4a3018 });
      const shaft = new THREE.Mesh(shaftGeo, shaftMat);
      shaft.rotation.x = Math.PI / 2;
      projGroup.add(shaft);

      const tipGeo = new THREE.ConeGeometry(0.025, 0.08, 4);
      const tipMat = new THREE.MeshLambertMaterial({ color: 0x888888 });
      const tip = new THREE.Mesh(tipGeo, tipMat);
      tip.position.z = -0.3;
      tip.rotation.x = -Math.PI / 2;
      projGroup.add(tip);
    }

    projGroup.position.copy(pos);
    projGroup.lookAt(pos.clone().add(dir));
    this.scene.add(projGroup);

    this.projectiles.push({
      mesh: projGroup,
      direction: dir,
      speed,
      distance: 0,
      maxDistance: w.range,
      damage,
      targets,
      weapon: this.currentWeapon
    });
  }

  createExplosion(position, targets) {
    const boomMat = new THREE.MeshBasicMaterial({ color: 0xff6600, transparent: true, opacity: 1 });
    const boom = new THREE.Mesh(new THREE.SphereGeometry(0.6, 10, 8), boomMat);
    boom.position.copy(position);
    this.scene.add(boom);

    this.explosions.push({
      mesh: boom,
      age: 0,
      maxAge: 0.5,
      targets
    });

    const radius = 6;
    const alive = targets.filter(t => t.alive);
    for (const t of alive) {
      const dx = position.x - t.mesh.position.x;
      const dz = position.z - t.mesh.position.z;
      const dy = position.y - (t.mesh.position.y + (t.hitHeight || 0.5));
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist <= radius) {
        this.pendingHits.push({ target: t, damage: 100 });
      }
    }
  }

  update(delta) {
    if (this.cooldown > 0) this.cooldown -= delta;
    if (this.recoil > 0) {
      this.recoil -= delta * 6;
      if (this.recoil < 0) this.recoil = 0;
    }

    if (this.mouseHeld && this.currentWeapon === 'cajado_fogo' && this.cooldown <= 0) {
      this.fire(this._lastTargets);
    }

    for (let i = this.explosions.length - 1; i >= 0; i--) {
      const ex = this.explosions[i];
      ex.age += delta;
      const t = ex.age / ex.maxAge;
      ex.mesh.scale.setScalar(1 + t * 3);
      ex.mesh.material.opacity = 1 - t;
      if (ex.age >= ex.maxAge) {
        this.scene.remove(ex.mesh);
        this.explosions.splice(i, 1);
      }
    }

    const w = WEAPONS[this.currentWeapon];
    if (w.type === 'melee') {
      this.weaponGroup.rotation.x = -this.recoil * 1.0;
      this.weaponGroup.rotation.z = this.recoil * 0.3;
      this.weaponGroup.position.z = -this.recoil * 0.15;
      this.weaponGroup.position.y = this.recoil * 0.05;
    } else {
      this.weaponGroup.position.z = this.recoil * 0.08;
      this.weaponGroup.rotation.x = -this.recoil * 0.08;
      this.weaponGroup.rotation.z = 0;
      this.weaponGroup.position.y = 0;
    }

    if (this.hitboxTimer > 0) {
      this.hitboxTimer -= delta;
      if (this.hitboxTimer <= 0) {
        this.hitboxMesh.visible = false;
        this.hitboxWire.visible = false;
      }
    }

    const time = performance.now() * 0.001;
    this.weaponGroup.position.x = Math.sin(time * 2) * 0.004;
    this.weaponGroup.position.y += Math.sin(time * 3) * 0.002;

    this.updateProjectiles(delta);
  }

  updateProjectiles(delta) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i];
      const move = proj.speed * delta;
      proj.mesh.position.addScaledVector(proj.direction, move);
      proj.distance += move;

      const explode = () => {
        if (proj.weapon === 'bazuca') {
          this.createExplosion(proj.mesh.position, proj.targets);
        }
        this.scene.remove(proj.mesh);
        this.projectiles.splice(i, 1);
      };

      if (proj.distance >= proj.maxDistance) {
        explode();
        continue;
      }

      if (this.arena && !this.arena.isPassable(proj.mesh.position.x, proj.mesh.position.z)) {
        explode();
        continue;
      }

      const alive = proj.targets.filter(t => t.alive);
      let hitTarget = null;
      for (const t of alive) {
        const dx = proj.mesh.position.x - t.mesh.position.x;
        const dz = proj.mesh.position.z - t.mesh.position.z;
        const hitH = t.hitHeight || 0.5;
        const dy = proj.mesh.position.y - (t.mesh.position.y + hitH);
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const radius = t.hitRadius || 1.0;
        if (dist < radius) {
          hitTarget = t;
          break;
        }
      }

      if (hitTarget) {
        if (proj.weapon === 'bazuca') {
          explode();
    } else if (this.currentWeapon === 'april_fools') {
      const bladeMat = new THREE.MeshLambertMaterial({ color: 0xd8dde4 });
      const handleMat = new THREE.MeshLambertMaterial({ color: 0x2b2b2b });
      const guardMat = new THREE.MeshLambertMaterial({ color: 0xffd700 });

      const blade = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.34, 4), bladeMat);
      blade.scale.set(0.5, 1, 1);
      blade.rotation.x = -Math.PI / 2;
      blade.position.z = -0.26;
      projGroup.add(blade);

      const spine = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.05, 0.3), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      spine.position.z = -0.24;
      projGroup.add(spine);

      const guard = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.02, 0.02), guardMat);
      projGroup.add(guard);

      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.016, 0.12, 6), handleMat);
      handle.rotation.x = Math.PI / 2;
      handle.position.z = 0.08;
      projGroup.add(handle);

      const pommel = new THREE.Mesh(new THREE.SphereGeometry(0.017, 6, 4), guardMat);
      pommel.position.z = 0.15;
      projGroup.add(pommel);

      speed = 62;
    } else if (this.currentWeapon === 'brick') {
      const brickMat = new THREE.MeshLambertMaterial({ color: 0x9c4a2f });
      const brickBody = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.11, 0.1), brickMat);
      brickBody.castShadow = true;
      projGroup.add(brickBody);
      const edgeMat = new THREE.MeshLambertMaterial({ color: 0x7a3823 });
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.225, 0.028, 0.105), edgeMat);
      projGroup.add(stripe);
      speed = 40;
      damage = Math.floor(80 + Math.random() * 11);
    } else {
          this.scene.remove(proj.mesh);
          this.projectiles.splice(i, 1);
          this.pendingHits.push({ target: hitTarget, damage: proj.damage });
        }
      }
    }
  }

  getWeaponName() {
    return WEAPONS[this.currentWeapon].name;
  }
}
