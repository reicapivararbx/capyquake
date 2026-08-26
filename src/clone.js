import * as THREE from 'three';
import { WEAPONS } from './weapon.js';
import { EntityLabel } from './entity-label.js';

export const CLONE_MAX = 5;
export const CLONE_LIFETIME_S = 45;

let cloneCounter = 0;

export class PlayerClone {
  constructor(scene, ownerName, spawnPos, arena, opts = {}) {
    this.scene = scene;
    this.arena = arena;
    this.isClone = true;
    cloneCounter += 1;
    this.cloneNumber = cloneCounter;
    this.id = `clone_${ownerName}_${this.cloneNumber}`;
    this.name = `CLONE ${this.cloneNumber}`;

    let h = 0;
    for (let i = 0; i < ownerName.length; i++) h = (h * 31 + ownerName.charCodeAt(i)) % 360;
    this.color = new THREE.Color().setHSL(h / 360, 0.55, 0.45);

    this.position = spawnPos.clone();
    this.position.y = 0;
    this.speed = 4.2;

    // O clone nasce com a mesma vida do player e passa a ter vida própria.
    this.maxHealth = Math.max(50, Math.round(opts.maxHealth || 200));
    this.health = Math.max(1, Math.round(opts.currentHealth ?? this.maxHealth));

    this.weaponId = opts.weaponId || 'pistola';
    this.infiniteAmmo = !!opts.infiniteAmmo;
    this.damageMultiplier = opts.damageMultiplier || 1;

    this.shootCooldown = 1;
    this.accuracy = 0.75;
    this.alive = true;
    this.isProtectedAlly = true;
    this.hitRadius = 0.7;
    this.hitHeight = 0.9;
    this.age = 0;
    this.lifetime = CLONE_LIFETIME_S;
    this.target = null;
    this.pendingShotDamage = 0;

    this.label = new EntityLabel({
      title: `🧬 ${this.name}`,
      color: '#64ffda',
      accentBorder: '#64ffda55'
    });
    this.refreshLabel();

    this.mesh = this.createMesh();
    this.mesh.position.copy(this.position);
    scene.add(this.mesh);
  }

  createMesh() {
    const group = new THREE.Group();

    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 1.4, 0.4),
      new THREE.MeshLambertMaterial({ color: this.color })
    );
    body.position.y = 0.9;
    body.castShadow = true;
    group.add(body);

    const head = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.4, 0.4),
      new THREE.MeshLambertMaterial({ color: 0xccaa88 })
    );
    head.position.y = 1.8;
    head.castShadow = true;
    group.add(head);

    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x64ffda });
    for (const x of [-0.09, 0.09]) {
      const eye = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.05, 0.02), eyeMat);
      eye.position.set(x, 1.84, 0.21);
      group.add(eye);
    }

    this.gunMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.08, 0.6),
      new THREE.MeshLambertMaterial({ color: 0x333333 })
    );
    this.gunMesh.position.set(0.4, 1.1, -0.2);
    group.add(this.gunMesh);

    return group;
  }

  refreshLabel() {
    if (!this.label) return;
    const wName = WEAPONS[this.weaponId]?.name || this.weaponId;
    this.label.setName(`🧬 ${this.name}`);
    this.label.setWeapon((this.infiniteAmmo ? '♾️ ' : '🔫 ') + wName);
    this.label.setHp(this.health, this.maxHealth);
  }

  // Espelha o player: arma atual, munição infinita e multiplicador de dano.
  syncPlayer(weaponId, infiniteAmmo, damageMultiplier) {
    this.infiniteAmmo = !!infiniteAmmo;
    this.damageMultiplier = damageMultiplier || 1;
    if (weaponId && weaponId !== this.weaponId && WEAPONS[weaponId]) {
      this.weaponId = weaponId;
    }
    this.refreshLabel();
  }

  currentFireInterval() {
    const wDef = WEAPONS[this.weaponId];
    let base = Math.min(Math.max((wDef?.cooldown ?? 3) * 6, 0.7), 4);
    if (this.infiniteAmmo) base *= 0.45;
    return base;
  }

  getShotDamage() {
    return this.pendingShotDamage;
  }

  update(delta, hostiles, playerPos) {
    if (!this.alive) return null;
    this.age += delta;
    if (this.age >= this.lifetime) {
      this.expire();
      return null;
    }
    this.label.setHp(this.health, this.maxHealth);

    this.shootCooldown -= delta;

    let nearest = null;
    let nearestDist = Infinity;
    for (const c of hostiles) {
      if (!c.alive || c.isProtectedAlly) continue;
      const d = this.position.distanceTo(c.mesh.position);
      if (d < nearestDist) {
        nearestDist = d;
        nearest = c;
      }
    }
    this.target = nearest;

    const anchor = nearest && nearestDist < 18 ? nearest.mesh.position : playerPos;
    const dir = anchor.clone().sub(this.position);
    dir.y = 0;
    const dist = dir.length();
    if (dist > 4) {
      dir.normalize();
      const nextX = this.position.x + dir.x * this.speed * delta;
      const nextZ = this.position.z + dir.z * this.speed * delta;
      if (!this.arena || this.arena.isPassable(nextX, nextZ)) {
        this.position.x = nextX;
        this.position.z = nextZ;
      }
    }

    this.mesh.position.copy(this.position);
    if (nearest) {
      const look = nearest.mesh.position.clone().sub(this.position);
      this.mesh.rotation.y = Math.atan2(look.x, look.z);
    } else if (dir.lengthSq() > 0.0001) {
      this.mesh.rotation.y = Math.atan2(dir.x, dir.z);
    }

    if (nearest && nearestDist < 14 && this.shootCooldown <= 0) {
      this.shootCooldown = this.currentFireInterval();
      if (Math.random() < this.accuracy) {
        const wDef = WEAPONS[this.weaponId];
        this.pendingShotDamage = Math.max(3, Math.round((wDef?.damage || 8) * this.damageMultiplier));
        this.spawnTracer(nearest.mesh.position);
        return nearest;
      }
    }
    return null;
  }

  spawnTracer(targetPos) {
    const from = this.position.clone().add(new THREE.Vector3(0.35, 1.2, 0));
    const to = targetPos.clone();
    const geo = new THREE.BufferGeometry().setFromPoints([from, to]);
    const line = new THREE.Line(geo, new THREE.LineBasicMaterial({
      color: 0x64ffda, transparent: true, opacity: 0.8
    }));
    this.scene.add(line);
    setTimeout(() => this.scene.remove(line), 90);
  }

  updateLabel(camera, canvasW, canvasH) {
    if (!this.alive || !this.label) return;
    this.label.update(
      { x: this.position.x, y: (this.mesh?.position?.y || 0) + 2.35, z: this.position.z },
      camera, canvasW, canvasH
    );
  }

  takeDamage(amount) {
    if (!this.alive) return false;
    this.health -= amount;
    if (Math.random() < 0.15) this.refreshLabel();
    if (this.health <= 0) {
      this.expire();
      return true;
    }
    return false;
  }

  expire() {
    if (!this.alive) return;
    this.alive = false;
    if (this.label) { this.label.destroy(); this.label = null; }
    this.scene.remove(this.mesh);
  }

  destroy() {
    this.alive = false;
    if (this.label) { this.label.destroy(); this.label = null; }
    this.scene.remove(this.mesh);
  }
}
