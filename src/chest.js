import * as THREE from 'three';
import { WEAPONS, rollAmmo } from './weapon.js';
import { Audio } from './audio.js';

const NON_LOOTABLE = new Set(['bastao', 'pistola', 'ak47', 'minigun', 'brick', 'clone_gun']);
const LOOTABLE_WEAPONS = Object.keys(WEAPONS).filter(id => !NON_LOOTABLE.has(id));

export class Chest {
  constructor(scene, x, z) {
    this.scene = scene;
    this.x = x;
    this.z = z;
    this.opened = false;
    this.weaponId = LOOTABLE_WEAPONS[Math.floor(Math.random() * LOOTABLE_WEAPONS.length)];
    this.ammoCount = rollAmmo();
    this.mesh = this.buildMesh();
    this.mesh.position.set(x, 0.4, z);
    this.scene.add(this.mesh);
  }

  buildMesh() {
    const group = new THREE.Group();

    const bodyGeo = new THREE.BoxGeometry(0.8, 0.5, 0.6);
    const bodyMat = new THREE.MeshLambertMaterial({ color: 0x5a3a1a });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    group.add(body);

    const lidGeo = new THREE.BoxGeometry(0.84, 0.15, 0.64);
    const lid = new THREE.Mesh(lidGeo, bodyMat);
    lid.position.y = 0.32;
    group.add(lid);

    const bandMat = new THREE.MeshLambertMaterial({ color: 0x3a3a3a });
    for (let i = -1; i <= 1; i += 2) {
      const band = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.06, 0.04), bandMat);
      band.position.set(0, 0, i * 0.2);
      group.add(band);
      const bandTop = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.04, 0.04), bandMat);
      bandTop.position.set(0, 0.32, i * 0.22);
      group.add(bandTop);
    }

    const lockGeo = new THREE.BoxGeometry(0.1, 0.12, 0.05);
    const lockMat = new THREE.MeshLambertMaterial({ color: 0xccaa44 });
    const lock = new THREE.Mesh(lockGeo, lockMat);
    lock.position.set(0, 0.15, 0.33);
    group.add(lock);

    const glowGeo = new THREE.SphereGeometry(0.6, 8, 6);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xffcc44,
      transparent: true,
      opacity: 0.08
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.position.y = 0.3;
    group.add(glow);

    return group;
  }

  open() {
    if (this.opened) return null;
    this.opened = true;
    Audio.chestOpen();
    this.scene.remove(this.mesh);
    return { weaponId: this.weaponId, ammo: this.ammoCount };
  }

  getDistanceTo(playerPos) {
    const dx = playerPos.x - this.x;
    const dz = playerPos.z - this.z;
    return Math.sqrt(dx * dx + dz * dz);
  }

  update(time) {
    if (this.opened) return;
    this.mesh.position.y = 0.4 + Math.sin(time * 0.003) * 0.1;
    this.mesh.rotation.y += 0.005;
  }
}
