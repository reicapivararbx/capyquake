import * as THREE from 'three';
import { Audio } from './audio.js';

export class Player {
  constructor(camera, domElement, scene, arena) {
    this.camera = camera;
    this.domElement = domElement;
    this.scene = scene;
    this.arena = arena;
    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();
    this.moveSpeed = 15;
    this.jumpSpeed = 9;
    this.gravity = 22;
    this.onGround = true;
    this.locked = false;
    this.shootCallbacks = [];

    // Logical player position (the game.js reads this via getPosition()).
    // game.js sets camera.position AFTER constructing the Player, so we sync
    // from the camera on the first update()/_applyCameraTransform() call.
    this.thirdPerson = false;
    this.playerPos = camera.position.clone();
    this.cameraAnchor = this.playerPos;
    this.playerPosInitialized = false;
    this.worldUp = new THREE.Vector3(0, 1, 0);

    this.keys = { forward: false, backward: false, left: false, right: false, jump: false, sprint: false };
    this.mouseHeld = false;

    this.euler = new THREE.Euler(0, 0, 0, 'YXZ');
    this.sensitivity = 0.002;
    this.speedMultiplier = 1.0;
    this.stamina = 100;
    this.maxStamina = 100;
    this.staminaDrain = 20;
    this.staminaRegen = 12;
    this.exhausted = false;
    this.pantTimer = 0;

    this.setupControls();
  }

  setupControls() {
    this.domElement.addEventListener('click', () => {
      if (!this.locked) {
        this.domElement.requestPointerLock();
      }
    });

    document.addEventListener('pointerlockchange', () => {
      this.locked = document.pointerLockElement === this.domElement;
    });

    document.addEventListener('mousemove', (e) => {
      if (!this.locked) return;
      this.euler.setFromQuaternion(this.camera.quaternion);
      this.euler.y -= e.movementX * this.sensitivity;
      this.euler.x -= e.movementY * this.sensitivity;
      this.euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.euler.x));
      this.camera.quaternion.setFromEuler(this.euler);
    });

    document.addEventListener('keydown', (e) => {
      this.setKey(e.code, true);
    });

    document.addEventListener('keyup', (e) => {
      this.setKey(e.code, false);
    });

    document.addEventListener('keydown', (e) => {
      if (e.code === 'F3') {
        e.preventDefault();
        this.toggleCamera();
      }
    });

    document.addEventListener('mousedown', (e) => {
      if (!this.locked) return;
      if (e.button === 0) {
        this.mouseHeld = true;
        this.shootCallbacks.forEach(cb => cb());
      }
    });

    document.addEventListener('mouseup', (e) => {
      if (e.button === 0) {
        this.mouseHeld = false;
      }
    });
  }

  setKey(code, state) {
    switch (code) {
      case 'KeyW': this.keys.forward = state; break;
      case 'KeyS': this.keys.backward = state; break;
      case 'KeyA': this.keys.left = state; break;
      case 'KeyD': this.keys.right = state; break;
      case 'Space': this.keys.jump = state; break;
      case 'ShiftLeft': case 'ShiftRight': this.keys.sprint = state; break;
    }
  }

  onShoot(cb) {
    this.shootCallbacks.push(cb);
  }

  update(delta) {
    if (!this.playerPosInitialized) {
      this.playerPos.copy(this.camera.position);
      this.playerPosInitialized = true;
    }
    if (!this.locked) return;

    this.direction.set(0, 0, 0);
    if (this.keys.forward) this.direction.z -= 1;
    if (this.keys.backward) this.direction.z += 1;
    if (this.keys.left) this.direction.x -= 1;
    if (this.keys.right) this.direction.x += 1;
    this.direction.normalize();

    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
    forward.y = 0;
    forward.normalize();
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion);
    right.y = 0;
    right.normalize();

    const isSprinting = this.keys.sprint && this.stamina > 0 && !this.exhausted && this.direction.length() > 0;

    if (isSprinting) {
      this.stamina -= this.staminaDrain * delta;
      if (this.stamina <= 0) {
        this.stamina = 0;
        this.exhausted = true;
      }
    } else {
      this.stamina += this.staminaRegen * delta;
      if (this.stamina >= this.maxStamina) {
        this.stamina = this.maxStamina;
      }
      if (this.exhausted && this.stamina > 30) {
        this.exhausted = false;
      }
    }

    if (this.exhausted) {
      this.pantTimer -= delta;
      if (this.pantTimer <= 0) {
        this.pantTimer = 1.5;
        Audio.panting();
      }
    }

    const speed = this.moveSpeed * (isSprinting ? 1.7 : 1.0);
    const wishX = (forward.x * -this.direction.z + right.x * this.direction.x) * speed;
    const wishZ = (forward.z * -this.direction.z + right.z * this.direction.x) * speed;

    this.velocity.x = wishX;
    this.velocity.z = wishZ;

    if (this.keys.jump && this.onGround) {
      this.velocity.y = this.jumpSpeed;
      this.onGround = false;
    }

    this.velocity.y -= this.gravity * delta;

    const radius = 0.4;
    const newX = this.playerPos.x + this.velocity.x * delta;
    const newZ = this.playerPos.z + this.velocity.z * delta;

    if (this.arena && this.arena.isPassable) {
      if (this.arena.isPassable(newX + radius, this.playerPos.z) &&
          this.arena.isPassable(newX - radius, this.playerPos.z)) {
        this.playerPos.x = newX;
      }
      if (this.arena.isPassable(this.playerPos.x, newZ + radius) &&
          this.arena.isPassable(this.playerPos.x, newZ - radius)) {
        this.playerPos.z = newZ;
      }
    } else {
      this.playerPos.x = newX;
      this.playerPos.z = newZ;
    }

    this.playerPos.y += this.velocity.y * delta;

    if (this.playerPos.y <= 1.7) {
      this.playerPos.y = 1.7;
      this.velocity.y = 0;
      this.onGround = true;
    }

    this._applyCameraTransform();
  }

  _applyCameraTransform() {
    if (!this.playerPosInitialized) {
      this.playerPos.copy(this.camera.position);
      this.playerPosInitialized = true;
    }
    if (this.thirdPerson) {
      this.euler.setFromQuaternion(this.camera.quaternion);
      const offset = new THREE.Vector3(0, 0.5, 3)
        .applyAxisAngle(this.worldUp, this.euler.y);
      this.camera.position.copy(this.playerPos).add(offset);
    } else {
      this.camera.position.copy(this.playerPos);
    }
  }

  toggleCamera() {
    this.thirdPerson = !this.thirdPerson;
    this._applyCameraTransform();
    return this.thirdPerson;
  }

  isThirdPerson() {
    return this.thirdPerson;
  }

  getPosition() {
    return this.playerPos.clone();
  }

  setSpeedMultiplier(mult) {
    this.speedMultiplier = mult;
    this.moveSpeed = 12,5 * mult;
  }

  lock() {
    this.domElement.requestPointerLock();
  }

  unlock() {
    if (document.pointerLockElement) {
      document.exitPointerLock();
    }
  }
}
