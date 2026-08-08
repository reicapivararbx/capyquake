import * as THREE from 'three';
import { Audio } from './audio.js';

export class Boss {
  constructor(scene, x, z, arena, bossConfig = {}) {
    this.scene = scene;
    this.arena = arena;
    this.alive = true;
    this.health = bossConfig.health !== undefined ? bossConfig.health : 1000;
    this.maxHealth = bossConfig.maxHealth !== undefined ? bossConfig.maxHealth : 1000;
    this.speed = bossConfig.speed !== undefined ? bossConfig.speed : 10;
    this.chaseSpeed = bossConfig.chaseSpeed !== undefined ? bossConfig.chaseSpeed : 10;
    this.attackDamage = bossConfig.attackDamage !== undefined ? bossConfig.attackDamage : 20;
    this.attackRange = bossConfig.attackRange !== undefined ? bossConfig.attackRange : 12;
    this.attackCooldown = 0;
    this.shootCooldown = 1.5;
    this.meleeRange = 4;
    this.meleeCooldown = 0;
    this.meleeRate = 2.0;
    this.detectionRange = 50;
    this.chasing = true;
    this.wanderDir = new THREE.Vector3(0, 0, 1);
    this.projectiles = [];
    this.minions = [];
    this.minionTimer = 30;
    this.points = bossConfig.points !== undefined ? bossConfig.points : 10;
    this.hitRadius = 3.0;
    this.hitHeight = 2.5;

    this.mesh = this.createMesh();
    this.mesh.position.set(x, 0, z);
    scene.add(this.mesh);

    this.speechTimer = 5;
    this.speechBubble = null;
    this.speechVisible = false;
    this.speeches = [
      'Pague seus impostos!',
      'Taxa de respiro!',
      'ICMS ativado!',
      'Imposto sobre imposto!',
      'Nota fiscal, por favor!',
      'Contribuinte detectado!',
      'Aliquota maxima!',
      'Voce deve ao governo!',
      'Tributo obrigatorio!',
      'Multa por atraso!',
      'Declaracao pendente!',
      'Sonegador identificado!',
    ];
  }

  createMesh() {
    const group = new THREE.Group();

    const bodyMat = new THREE.MeshLambertMaterial({ color: 0x1a1a3a });
    const body = new THREE.Mesh(new THREE.BoxGeometry(2, 2.5, 1.2), bodyMat);
    body.position.y = 2.5;
    body.castShadow = true;
    group.add(body);

    const headMat = new THREE.MeshLambertMaterial({ color: 0xddbb88 });
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), headMat);
    head.position.y = 4.2;
    head.castShadow = true;
    group.add(head);

    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const eyeGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-0.18, 4.3, 0.42);
    group.add(eyeL);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(0.18, 4.3, 0.42);
    group.add(eyeR);

    const tieMat = new THREE.MeshLambertMaterial({ color: 0xcc0000 });
    const tie = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.2, 0.1), tieMat);
    tie.position.set(0, 2.8, 0.65);
    group.add(tie);

    const chestMat = new THREE.MeshLambertMaterial({ color: 0xd4af37 });
    const chestPlate = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.5, 0.08), chestMat);
    chestPlate.position.set(0, 2.8, 0.59);
    group.add(chestPlate);

    const hatMat = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
    const hatBase = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.1, 8), hatMat);
    hatBase.position.y = 4.7;
    group.add(hatBase);
    const hatTop = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.5, 8), hatMat);
    hatTop.position.y = 5.0;
    group.add(hatTop);

    const armMat = new THREE.MeshLambertMaterial({ color: 0x1a1a3a });
    const armL = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.8, 0.4), armMat);
    armL.position.set(-1.3, 2.5, 0);
    group.add(armL);
    const armR = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.8, 0.4), armMat);
    armR.position.set(1.3, 2.5, 0);
    group.add(armR);

    const fistL = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), armMat);
    fistL.position.set(-1.3, 1.35, 0);
    group.add(fistL);
    const fistR = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), armMat);
    fistR.position.set(1.3, 1.35, 0);
    group.add(fistR);

    const legMat = new THREE.MeshLambertMaterial({ color: 0x1a1a2a });
    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.2, 0.5), legMat);
    legL.position.set(-0.4, 0.6, 0);
    group.add(legL);
    const legR = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.2, 0.5), legMat);
    legR.position.set(0.4, 0.6, 0);
    group.add(legR);

    const briefMat = new THREE.MeshLambertMaterial({ color: 0x3a2a1a });
    const brief = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.3), briefMat);
    brief.position.set(1.5, 1.6, 0);
    group.add(brief);

    const signCanvas = document.createElement('canvas');
    signCanvas.width = 256;
    signCanvas.height = 64;
    const ctx = signCanvas.getContext('2d');
    ctx.fillStyle = '#ffcc00';
    ctx.font = 'bold 22px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('GOVERNO FEDERAL', 128, 40);
    const signTex = new THREE.CanvasTexture(signCanvas);
    const signMat = new THREE.SpriteMaterial({ map: signTex });
    const sign = new THREE.Sprite(signMat);
    sign.position.y = 5.8;
    sign.scale.set(3, 0.8, 1);
    group.add(sign);

    return group;
  }

  update(delta, playerPos) {
    if (!this.alive) return null;

    this.attackCooldown -= delta;
    this.speechTimer -= delta;

    if (this.speechTimer <= 0) {
      this.showSpeechBubble();
      this.speechTimer = 10;
    }

    if (this.speechBubble) {
      this.speechBubbleLife -= delta;
      if (this.speechBubbleLife <= 0) {
        this.mesh.remove(this.speechBubble);
        this.speechBubble = null;
      }
    }

    this.minionTimer -= delta;
    if (this.minionTimer <= 0) {
      this.minionTimer = 30;
      this.spawnMinions(3);
    }

    for (const m of this.minions) {
      if (!m.alive) continue;
      const mDmg = m.update(delta, playerPos);
      if (mDmg > 0) {
        this.lastHitDamage = (this.lastHitDamage || 0) + mDmg;
      }
    }

    const pos = this.mesh.position;
    const distToPlayer = pos.distanceTo(playerPos);

    const chaseDir = playerPos.clone().sub(pos).normalize();
    chaseDir.y = 0;
    this.wanderDir.copy(chaseDir);

    const speed = this.chaseSpeed;
    const nextX = pos.x + this.wanderDir.x * speed * delta;
    const nextZ = pos.z + this.wanderDir.z * speed * delta;

    if (this.arena && !this.arena.isPassable(nextX, nextZ)) {
      this.wanderDir.negate();
    } else {
      pos.x = nextX;
      pos.z = nextZ;
    }

    const angle = Math.atan2(this.wanderDir.x, this.wanderDir.z);
    this.mesh.rotation.y = angle;
    this.mesh.position.y = Math.sin(performance.now() * 0.003) * 0.1;

    this.updateProjectiles(delta, playerPos);
    this.meleeCooldown -= delta;

    if (distToPlayer < this.meleeRange && this.meleeCooldown <= 0) {
      this.meleeCooldown = this.meleeRate;
      this.lastHitDamage = this.attackDamage;
      this.spawnMeleeHitbox(playerPos);
    } else if (distToPlayer < this.attackRange && this.attackCooldown <= 0) {
      this.attackCooldown = this.shootCooldown;
      this.fireProjectile(playerPos);
    }

    return null;
  }

  fireProjectile(playerPos) {
    const pos = this.mesh.position.clone();
    pos.y = 2.5;
    const dir = playerPos.clone().sub(pos).normalize();

    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 128, 64);
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 3;
    ctx.strokeRect(2, 2, 124, 60);
    ctx.fillStyle = '#cc0000';
    ctx.font = 'bold 18px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('IMPOSTO', 64, 38);
    const tex = new THREE.CanvasTexture(canvas);

    const projGeo = new THREE.PlaneGeometry(1.0, 0.5);
    const projMat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide });
    const proj = new THREE.Mesh(projGeo, projMat);
    proj.position.copy(pos);
    this.scene.add(proj);

    const trailGeo = new THREE.PlaneGeometry(0.4, 0.2);
    const trailMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4, side: THREE.DoubleSide });
    const trail = new THREE.Mesh(trailGeo, trailMat);
    trail.position.copy(pos);
    this.scene.add(trail);

    this.projectiles.push({
      mesh: proj,
      trail,
      dir,
      speed: 18,
      life: 3
    });

    Audio.gunshot();
  }

  updateProjectiles(delta, playerPos) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.mesh.position.add(p.dir.clone().multiplyScalar(p.speed * delta));
      p.mesh.rotation.z += delta * 3;
      p.trail.position.copy(p.mesh.position).add(p.dir.clone().multiplyScalar(-0.5));
      p.trail.rotation.z = p.mesh.rotation.z;
      p.life -= delta;

      const dist = p.mesh.position.distanceTo(playerPos);
      if (dist < 1.2) {
        this.scene.remove(p.mesh);
        this.scene.remove(p.trail);
        this.projectiles.splice(i, 1);
        this.lastHitDamage = this.attackDamage;
        return;
      }

      if (p.life <= 0) {
        this.scene.remove(p.mesh);
        this.scene.remove(p.trail);
        this.projectiles.splice(i, 1);
      }
    }
    this.lastHitDamage = 0;
  }

  getHitDamage() {
    const d = this.lastHitDamage || 0;
    this.lastHitDamage = 0;
    return d;
  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.die();
      return true;
    }
    this.flashDamage();
    return false;
  }

  flashDamage() {
    this.mesh.children.forEach(c => {
      if (c.material) {
        const orig = c.material.color.getHex();
        c.material.color.setHex(0xff0000);
        setTimeout(() => c.material.color.setHex(orig), 100);
      }
    });
  }

  spawnMinions(count) {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
      const dist = 5 + Math.random() * 3;
      const mx = this.mesh.position.x + Math.cos(angle) * dist;
      const mz = this.mesh.position.z + Math.sin(angle) * dist;
      const minion = new Minion(this.scene, mx, mz, this.arena);
      this.minions.push(minion);
    }
  }

  spawnMeleeHitbox(playerPos) {
    const pos = this.mesh.position.clone();
    const dir = playerPos.clone().sub(pos).normalize();
    pos.add(dir.multiplyScalar(2.5));
    pos.y = 1.5;
    const geo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const mat = new THREE.MeshBasicMaterial({ color: 0xff4400, transparent: true, opacity: 0.4 });
    const hitbox = new THREE.Mesh(geo, mat);
    hitbox.position.copy(pos);
    this.scene.add(hitbox);
    setTimeout(() => {
      this.scene.remove(hitbox);
      geo.dispose();
      mat.dispose();
    }, 300);
  }

  showSpeechBubble() {
    if (this.speechBubble) {
      this.mesh.remove(this.speechBubble);
    }
    const text = this.speeches[Math.floor(Math.random() * this.speeches.length)];
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 80;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(4, 4, 248, 60, 12);
    ctx.fill();
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(4, 4, 248, 60, 12);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(120, 64);
    ctx.lineTo(128, 78);
    ctx.lineTo(136, 64);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.fillStyle = '#222222';
    ctx.font = 'bold 16px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText(text, 128, 42);
    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: tex });
    const sprite = new THREE.Sprite(mat);
    sprite.position.y = 7.0;
    sprite.scale.set(4, 1.2, 1);
    this.mesh.add(sprite);
    this.speechBubble = sprite;
    this.speechBubbleLife = 5;
  }

  die() {
    this.alive = false;
    if (this.speechBubble) {
      this.mesh.remove(this.speechBubble);
      this.speechBubble = null;
    }
    for (const p of this.projectiles) {
      this.scene.remove(p.mesh);
      this.scene.remove(p.trail);
    }
    this.projectiles = [];
    for (const m of this.minions) {
      if (m.alive) m.die();
    }
    this.minions = [];
    this.scene.remove(this.mesh);
  }
}

export class MiniBoss extends Boss {
  constructor(scene, x, z, arena) {
    super(scene, x, z, arena, {
      health: 500,
      maxHealth: 500,
      speed: 10,
      chaseSpeed: 10,
      attackDamage: 12,
      points: 5,
      attackRange: 10
    });
    this.mesh.scale.setScalar(0.7);
  }
}

class Minion {
  constructor(scene, x, z, arena) {
    this.scene = scene;
    this.arena = arena;
    this.alive = true;
    this.health = 100;
    this.speed = 10;
    this.attackDamage = 10;
    this.attackRange = 8;
    this.meleeRange = 3;
    this.shootCooldown = 0;
    this.shootRate = 2.5;
    this.meleeCooldown = 0;
    this.meleeRate = 2.5;
    this.hitRadius = 1.0;
    this.hitHeight = 1.5;
    this.projectiles = [];

    this.mesh = this.createMesh();
    this.mesh.position.set(x, 0, z);
    scene.add(this.mesh);
  }

  createMesh() {
    const group = new THREE.Group();
    const suitMat = new THREE.MeshLambertMaterial({ color: 0x2a2a4a });
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.2, 0.5), suitMat);
    body.position.y = 1.3;
    body.castShadow = true;
    group.add(body);
    const headMat = new THREE.MeshLambertMaterial({ color: 0xddbb88 });
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), headMat);
    head.position.y = 2.2;
    group.add(head);
    const tieMat = new THREE.MeshLambertMaterial({ color: 0xcc0000 });
    const tie = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.5, 0.05), tieMat);
    tie.position.set(0, 1.5, 0.28);
    group.add(tie);
    const legMat = new THREE.MeshLambertMaterial({ color: 0x2a2a3a });
    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.7, 0.2), legMat);
    legL.position.set(-0.15, 0.35, 0);
    group.add(legL);
    const legR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.7, 0.2), legMat);
    legR.position.set(0.15, 0.35, 0);
    group.add(legR);

    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 128;
    labelCanvas.height = 32;
    const ctx = labelCanvas.getContext('2d');
    ctx.fillStyle = '#ffcc00';
    ctx.font = 'bold 14px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('FISCAL', 64, 22);
    const labelTex = new THREE.CanvasTexture(labelCanvas);
    const labelMat = new THREE.SpriteMaterial({ map: labelTex });
    const label = new THREE.Sprite(labelMat);
    label.position.y = 2.8;
    label.scale.set(1.5, 0.4, 1);
    group.add(label);

    return group;
  }

  update(delta, playerPos) {
    if (!this.alive) return 0;

    this.shootCooldown -= delta;
    this.meleeCooldown -= delta;

    const pos = this.mesh.position;
    const distToPlayer = pos.distanceTo(playerPos);

    const dir = playerPos.clone().sub(pos).normalize();
    dir.y = 0;

    const nextX = pos.x + dir.x * this.speed * delta;
    const nextZ = pos.z + dir.z * this.speed * delta;

    if (this.arena && !this.arena.isPassable(nextX, nextZ)) {
      // blocked
    } else {
      pos.x = nextX;
      pos.z = nextZ;
    }

    const angle = Math.atan2(dir.x, dir.z);
    this.mesh.rotation.y = angle;

    this.updateProjectiles(delta, playerPos);

    let dmg = 0;
    if (distToPlayer < this.meleeRange && this.meleeCooldown <= 0) {
      this.meleeCooldown = this.meleeRate;
      dmg = this.attackDamage;
      this.spawnMeleeHitbox(playerPos);
    } else if (distToPlayer < this.attackRange && this.shootCooldown <= 0) {
      this.shootCooldown = this.shootRate;
      this.fireProjectile(playerPos);
    }

    return dmg;
  }

  fireProjectile(playerPos) {
    const pos = this.mesh.position.clone();
    pos.y = 1.5;
    const dir = playerPos.clone().sub(pos).normalize();

    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 64, 32);
    ctx.fillStyle = '#cc0000';
    ctx.font = 'bold 10px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('TAXA', 32, 22);
    const tex = new THREE.CanvasTexture(canvas);

    const projGeo = new THREE.PlaneGeometry(0.6, 0.3);
    const projMat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide });
    const proj = new THREE.Mesh(projGeo, projMat);
    proj.position.copy(pos);
    this.scene.add(proj);

    this.projectiles.push({ mesh: proj, dir, speed: 14, life: 2.5 });
  }

  updateProjectiles(delta, playerPos) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.mesh.position.add(p.dir.clone().multiplyScalar(p.speed * delta));
      p.mesh.rotation.z += delta * 4;
      p.life -= delta;

      const dist = p.mesh.position.distanceTo(playerPos);
      if (dist < 1.2) {
        this.scene.remove(p.mesh);
        this.projectiles.splice(i, 1);
        this.lastHitDamage = this.attackDamage;
        return;
      }

      if (p.life <= 0) {
        this.scene.remove(p.mesh);
        this.projectiles.splice(i, 1);
      }
    }
  }

  spawnMeleeHitbox(playerPos) {
    const pos = this.mesh.position.clone();
    const dir = playerPos.clone().sub(pos).normalize();
    pos.add(dir.multiplyScalar(1.5));
    pos.y = 1.2;
    const geo = new THREE.BoxGeometry(1, 1, 1);
    const mat = new THREE.MeshBasicMaterial({ color: 0xff6600, transparent: true, opacity: 0.35 });
    const hitbox = new THREE.Mesh(geo, mat);
    hitbox.position.copy(pos);
    this.scene.add(hitbox);
    setTimeout(() => {
      this.scene.remove(hitbox);
      geo.dispose();
      mat.dispose();
    }, 250);
  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.die();
      return true;
    }
    return false;
  }

  die() {
    this.alive = false;
    for (const p of this.projectiles) {
      this.scene.remove(p.mesh);
    }
    this.projectiles = [];
    this.scene.remove(this.mesh);
  }
}
