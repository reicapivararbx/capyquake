import * as THREE from 'three';

export class Bot {
  constructor(scene, name, targets, arena) {
    this.scene = scene;
    this.name = name;
    this.arena = arena;
    const sp = arena ? arena.getRandomSpawnPoint() : { x: 0, z: 0 };
    this.position = new THREE.Vector3(sp.x, 0, sp.z);
    this.velocity = new THREE.Vector3();
    this.speed = 4 + Math.random() * 2;
    this.shootCooldown = 0;
    this.shootInterval = 4 + Math.random() * 3;
    this.target = null;
    this.accuracy = 0.3 + Math.random() * 0.2;
    this.health = 200;
    this.alive = true;
    this.sellTimer = 0;
    this.sellInterval = 15;
    this.droppedItems = [];

    this.mesh = this.createMesh();
    this.mesh.position.copy(this.position);
    scene.add(this.mesh);
  }

  createMesh() {
    if (this.name === 'Bot_Carioca') return this.createCariocaMesh();
    const group = new THREE.Group();

    const bodyGeo = new THREE.BoxGeometry(0.6, 1.4, 0.4);
    const bodyMat = new THREE.MeshLambertMaterial({ color: 0x446644 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.9;
    body.castShadow = true;
    group.add(body);

    const headGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const headMat = new THREE.MeshLambertMaterial({ color: 0xccaa88 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.8;
    head.castShadow = true;
    group.add(head);

    const gunGeo = new THREE.BoxGeometry(0.08, 0.08, 0.6);
    const gunMat = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const gun = new THREE.Mesh(gunGeo, gunMat);
    gun.position.set(0.4, 1.1, -0.2);
    group.add(gun);

    return group;
  }

  createCariocaMesh() {
    const group = new THREE.Group();

    const bodyGeo = new THREE.BoxGeometry(0.6, 1.4, 0.4);
    const stripeMat1 = new THREE.MeshLambertMaterial({ color: 0xcc0000 });
    const stripeMat2 = new THREE.MeshLambertMaterial({ color: 0x111111 });
    const body = new THREE.Mesh(bodyGeo, stripeMat1);
    body.position.y = 0.9;
    body.castShadow = true;
    group.add(body);
    const stripe1 = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.28, 0.2), stripeMat2);
    stripe1.position.set(0, 0.7, 0.11);
    group.add(stripe1);
    const stripe2 = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.28, 0.2), stripeMat2);
    stripe2.position.set(0, 1.1, 0.11);
    group.add(stripe2);

    const headGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const headMat = new THREE.MeshLambertMaterial({ color: 0xccaa88 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.8;
    head.castShadow = true;
    group.add(head);

    const hairGeo = new THREE.BoxGeometry(0.44, 0.15, 0.44);
    const hairMat = new THREE.MeshLambertMaterial({ color: 0xf5e642 });
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.y = 2.05;
    group.add(hair);

    const glassMat = new THREE.MeshLambertMaterial({ color: 0xff6600, transparent: true, opacity: 0.7 });
    const lensGeo = new THREE.BoxGeometry(0.18, 0.08, 0.05);
    const lensL = new THREE.Mesh(lensGeo, glassMat);
    lensL.position.set(-0.1, 1.82, 0.22);
    group.add(lensL);
    const lensR = new THREE.Mesh(lensGeo, glassMat);
    lensR.position.set(0.1, 1.82, 0.22);
    group.add(lensR);
    const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.03, 0.05), glassMat);
    bridge.position.set(0, 1.82, 0.22);
    group.add(bridge);

    const gunGeo = new THREE.BoxGeometry(0.08, 0.08, 0.6);
    const gunMat = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const gun = new THREE.Mesh(gunGeo, gunMat);
    gun.position.set(0.4, 1.1, -0.2);
    group.add(gun);

    return group;
  }

  update(delta, targets) {
    if (!this.alive) return null;
    this.shootCooldown -= delta;

    if (this.name === 'Bot_Carioca') {
      this.sellTimer += delta;
      if (this.sellTimer >= this.sellInterval) {
        this.sellTimer = 0;
        this.dropSaleItem();
      }
    }

    const aliveTargets = targets.filter(c => c.alive && !c.isProtectedAlly);
    if (aliveTargets.length === 0) return null;

    // Find nearest target
    let nearest = null;
    let nearestDist = Infinity;
    for (const c of aliveTargets) {
      const d = this.position.distanceTo(c.mesh.position);
      if (d < nearestDist) {
        nearestDist = d;
        nearest = c;
      }
    }

    this.target = nearest;

    if (nearest) {
      // Move toward target
      const dir = nearest.mesh.position.clone().sub(this.position);
      dir.y = 0;
      dir.normalize();

      const nextX = this.position.x + dir.x * this.speed * delta;
      const nextZ = this.position.z + dir.z * this.speed * delta;

      if (!this.arena || this.arena.isPassable(nextX, nextZ)) {
        this.position.x = nextX;
        this.position.z = nextZ;
      }
      this.position.y = 0;

      this.mesh.position.copy(this.position);
      this.mesh.rotation.y = Math.atan2(dir.x, dir.z);

      // Shoot when close enough
      if (nearestDist < 10 && this.shootCooldown <= 0) {
        this.shootCooldown = this.shootInterval;
        if (Math.random() < this.accuracy) {
          return nearest;
        }
      }
    }

    return null;
  }

  dropSaleItem() {
    const types = ['ammo', 'medkit', 'ammo', 'ammo', 'medkit'];
    const type = types[Math.floor(Math.random() * types.length)];
    const offset = new THREE.Vector3((Math.random() - 0.5) * 2, 0, (Math.random() - 0.5) * 2);
    const pos = this.position.clone().add(offset);
    const group = new THREE.Group();
    const boxGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const boxMat = new THREE.MeshLambertMaterial({ color: type === 'ammo' ? 0x44cc44 : 0xcc4444 });
    const box = new THREE.Mesh(boxGeo, boxMat);
    group.add(box);
    const signGeo = new THREE.BoxGeometry(0.15, 0.2, 0.02);
    const signMat = new THREE.MeshLambertMaterial({ color: 0xffdd00 });
    const sign = new THREE.Mesh(signGeo, signMat);
    sign.position.set(0, 0.25, 0.21);
    group.add(sign);
    group.position.set(pos.x, 0.5, pos.z);
    this.scene.add(group);
    this.droppedItems.push({ mesh: group, position: pos, type, collected: false });
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
    this.scene.remove(this.mesh);
  }

  destroy() {
    this.scene.remove(this.mesh);
  }
}
