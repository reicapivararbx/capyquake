import * as THREE from 'three';
import { Audio } from './audio.js';

let animalId = 0;

// Categorias visuais usadas para dar materiais e movimentos diferentes a cada bicho.
const FLYING_TYPES = new Set([
  'tucano', 'arara', 'harpia', 'urubu', 'gaviao', 'coruja', 'aguia',
  'falcao', 'pelicano', 'flamingo', 'condor', 'grifo', 'fenix',
  'pegasus', 'anjo'
]);

const AQUATIC_TYPES = new Set([
  'pirarucu', 'boto', 'piranha', 'tubarao', 'kraken', 'iara'
]);

const SCALED_TYPES = new Set([
  'jacare', 'sucuri', 'tatu', 'tartaruga', 'cobracoral', 'cascavel',
  'jiboia', 'boiuna', 'crocodilo', 'dragao_komodo', 'dinossauro',
  'basilisco', 'hidra'
]);

const FURRED_TYPES = new Set([
  'anta', 'queixada', 'onca', 'loboguara', 'micoleao', 'tamandua',
  'preguica', 'sagui', 'gamba', 'paca', 'cutia', 'veado',
  'jaguatirica', 'caititu', 'bugio', 'macacoaranha', 'quati', 'cervo',
  'urso', 'leao', 'tigre', 'elefante', 'gorila', 'rinoceronte',
  'hipopotamo', 'lobo', 'raposa', 'coiote', 'hiena', 'leopardo',
  'pantera', 'bufalo', 'bisonte', 'javali', 'alce', 'rena', 'camelo',
  'girafa', 'zebra', 'gnu', 'antilope', 'gazela', 'canguru', 'koala',
  'ornitorrinco', 'wombat', 'diabo_tasmania', 'panda', 'urso_polar',
  'morsa', 'foca'
]);

const DORSAL_RIDGE_TYPES = new Set([
  'jacare', 'crocodilo', 'dragao_komodo', 'dinossauro', 'basilisco'
]);

export class Animal {
  constructor(scene, x, z, type, arena) {
    this.scene = scene;
    this.arena = arena;
    this.id = animalId++;
    this.type = type;
    this.alive = true;
    this.config = Animal.TYPES[type];
    this.speed = this.config.speed * (0.8 + Math.random() * 0.4);
    this.chaseSpeed = this.config.chaseSpeed || this.speed * 2;
    this.wanderTimer = 0;
    this.wanderDir = new THREE.Vector3(Math.random() - 0.5, 0, Math.random() - 0.5).normalize();
    this.chasing = false;
    this.points = this.config.points;
    this.health = this.config.health;
    this.attackDamage = this.config.attackDamage;
    this.attackRange = this.config.attackRange || 2.5;
    this.attackCooldown = 0;
    this.detectionRange = this.config.detectionRange || 16;
    this.hitRadius = this.config.hitRadius || 1.0;
    this.hitHeight = this.config.hitHeight || 0.5;
    this.isProtectedAlly = false;
    this.dropMoney = 0;
    this.dropTokens = 0;

    this.mesh = this.config.createMesh();
    this.animationTime = Math.random() * Math.PI * 2;
    this.visualState = this.prepareRealisticMesh();
    this.mesh.position.set(x, 0, z);
    scene.add(this.mesh);
  }

  static TYPES = {
    jacare: {
      name: 'Jacaré',
      speed: 1.5,
      chaseSpeed: 5,
      points: 3,
      health: 60,
      attackDamage: 15,
      attackRange: 3,
      detectionRange: 14,
      createMesh() {
        const group = new THREE.Group();
        const bodyMat = new THREE.MeshLambertMaterial({ color: 0x3a4a2a });
        const darkMat = new THREE.MeshLambertMaterial({ color: 0x2a3a1a });
        const bellyMat = new THREE.MeshLambertMaterial({ color: 0x7a8a5a });
        const headMat = new THREE.MeshLambertMaterial({ color: 0x4a5a3a });
        const toothMat = new THREE.MeshLambertMaterial({ color: 0xeeeeee });
        for (let i = 0; i < 5; i++) {
          const r = 0.28 - i * 0.03;
          const seg = new THREE.Mesh(new THREE.SphereGeometry(r, 8, 6), i % 2 === 0 ? bodyMat : darkMat);
          seg.scale.set(1, 0.6, 1.15);
          seg.position.set(0, 0.32, -0.8 + i * 0.42);
          seg.castShadow = true;
          group.add(seg);
        }
        const belly = new THREE.Mesh(new THREE.SphereGeometry(0.24, 8, 4), bellyMat);
        belly.scale.set(0.9, 0.5, 1.6);
        belly.position.set(0, 0.16, 0.1);
        group.add(belly);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.45, 0.28, 0.6), headMat);
        head.position.set(0, 0.32, 1.15);
        head.castShadow = true;
        group.add(head);
        const snout = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.22, 0.8), headMat);
        snout.position.set(0, 0.3, 1.7);
        group.add(snout);
        const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.12, 0.7), darkMat);
        jaw.position.set(0, 0.22, 1.55);
        group.add(jaw);
        for (let i = -1; i <= 1; i += 2) {
          const tooth = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.09, 4), toothMat);
          tooth.position.set(i * 0.12, 0.28, 1.85);
          group.add(tooth);
        }
        // Eyes
        const eyeGeo = new THREE.SphereGeometry(0.06, 4, 4);
        const eyeMat = new THREE.MeshLambertMaterial({ color: 0xffff00 });
        const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
        eyeL.position.set(-0.22, 0.48, 1.3);
        group.add(eyeL);
        const eyeR = eyeL.clone();
        eyeR.position.set(0.22, 0.48, 1.3);
        group.add(eyeR);
        for (let i = 0; i < 4; i++) {
          const bump = new THREE.Mesh(new THREE.SphereGeometry(0.06, 4, 3), darkMat);
          bump.position.set(0, 0.52, 0.3 + i * 0.35);
          bump.scale.set(1, 0.8, 0.7);
          group.add(bump);
        }
        for (let i = 0; i < 4; i++) {
          const tr = 0.16 - i * 0.03;
          const tailSeg = new THREE.Mesh(new THREE.SphereGeometry(tr, 6, 4), i % 2 === 0 ? bodyMat : darkMat);
          tailSeg.scale.set(1, 0.8, 1.4);
          tailSeg.position.set(0, 0.24, -1.9 - i * 0.3);
          group.add(tailSeg);
        }
        const legGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.22, 6);
        const legMat = new THREE.MeshLambertMaterial({ color: 0x2a3a1a });
        [[-0.32, 0.11, 0.75], [0.32, 0.11, 0.75], [-0.32, 0.11, -0.5], [0.32, 0.11, -0.5]].forEach(([lx, ly, lz]) => {
          const leg = new THREE.Mesh(legGeo, legMat);
          leg.position.set(lx, ly, lz);
          group.add(leg);
        });
        return group;
      }
    },

    tucano: {
      name: 'Tucano',
      speed: 3,
      chaseSpeed: 8,
      points: 5,
      health: 20,
      attackDamage: 8,
      attackRange: 2,
      detectionRange: 20,
      createMesh() {
        const group = new THREE.Group();
        const darkMat = new THREE.MeshLambertMaterial({ color: 0x141414 });
        const midMat = new THREE.MeshLambertMaterial({ color: 0x2a2a2a });
        const chestMat = new THREE.MeshLambertMaterial({ color: 0xffdd33 });
        const beakMat = new THREE.MeshLambertMaterial({ color: 0xff8800 });
        const tipMat = new THREE.MeshLambertMaterial({ color: 0xcc0000 });
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.32, 8, 6).scale(1, 1.05, 1.3), darkMat);
        body.position.y = 3.5;
        body.castShadow = true;
        group.add(body);
        const chest = new THREE.Mesh(new THREE.SphereGeometry(0.22, 6, 5), chestMat);
        chest.position.set(0, 3.4, 0.2);
        group.add(chest);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.17, 6, 5), darkMat);
        head.position.set(0, 3.7, 0.5);
        group.add(head);
        const patch = new THREE.Mesh(new THREE.SphereGeometry(0.08, 5, 4), new THREE.MeshLambertMaterial({ color: 0xffdd44 }));
        patch.scale.set(1, 0.8, 0.6);
        patch.position.set(0, 3.75, 0.62);
        group.add(patch);
        const beak = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.55, 6).rotateX(Math.PI / 2), beakMat);
        beak.position.set(0, 3.7, 0.8);
        group.add(beak);
        const beak2 = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.35, 6).rotateX(Math.PI / 2), beakMat);
        beak2.position.set(0, 3.7, 1.1);
        group.add(beak2);
        const tip = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.2, 6).rotateX(Math.PI / 2), tipMat);
        tip.position.set(0, 3.7, 1.35);
        group.add(tip);
        const eyeWhite = new THREE.Mesh(new THREE.SphereGeometry(0.05, 4, 4), new THREE.MeshLambertMaterial({ color: 0xffffff }));
        eyeWhite.position.set(-0.13, 3.78, 0.6);
        group.add(eyeWhite);
        const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.025, 4, 3), new THREE.MeshLambertMaterial({ color: 0x000000 }));
        pupil.position.set(-0.13, 3.78, 0.66);
        group.add(pupil);
        const eyeR = eyeWhite.clone();
        eyeR.position.set(0.13, 3.78, 0.6);
        group.add(eyeR);
        const pupilR = pupil.clone();
        pupilR.position.set(0.13, 3.78, 0.66);
        group.add(pupilR);
        const wingGeo = new THREE.SphereGeometry(0.5, 8, 6).scale(0.75, 0.06, 0.4);
        const wingL = new THREE.Mesh(wingGeo, midMat);
        wingL.position.set(-0.42, 3.5, 0);
        group.add(wingL);
        const wingR = wingL.clone();
        wingR.position.set(0.42, 3.5, 0);
        group.add(wingR);
        const tipWGeo = new THREE.SphereGeometry(0.5, 8, 6).scale(0.3, 0.05, 0.3);
        const tipW = new THREE.Mesh(tipWGeo, darkMat);
        tipW.position.set(-0.62, 3.5, 0);
        group.add(tipW);
        const tipW2 = tipW.clone();
        tipW2.position.set(0.62, 3.5, 0);
        group.add(tipW2);
        const tail = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.12, 0.06, 0.5), tipMat);
        tail.position.set(0, 3.45, -0.55);
        group.add(tail);
        return group;
      }
    },

    anta: {
      name: 'Anta',
      speed: 2,
      chaseSpeed: 6,
      points: 2,
      health: 80,
      attackDamage: 10,
      attackRange: 3,
      detectionRange: 12,
      createMesh() {
        const group = new THREE.Group();
        // Large body
        const bodyGeo = new THREE.SphereGeometry(0.5, 8, 6).scale(1.4, 1.2, 2.5);
        const bodyMat = new THREE.MeshLambertMaterial({ color: 0x4a3a2a });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 1.0;
        body.castShadow = true;
        group.add(body);
        // Head
        const headGeo = new THREE.SphereGeometry(0.5, 8, 6).scale(0.7, 0.7, 1);
        const headMat = new THREE.MeshLambertMaterial({ color: 0x5a4a3a });
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.set(0, 1.2, 1.5);
        head.castShadow = true;
        group.add(head);
        // Trunk/proboscis
        const trunkGeo = new THREE.CylinderGeometry(0.12, 0.08, 0.6, 5);
        const trunkMat = new THREE.MeshLambertMaterial({ color: 0x5a4a3a });
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.set(0, 1.1, 2.1);
        trunk.rotation.x = Math.PI / 4;
        group.add(trunk);
        // Ears
        const earGeo = new THREE.SphereGeometry(0.15, 4, 4);
        const earMat = new THREE.MeshLambertMaterial({ color: 0x4a3a2a });
        const earL = new THREE.Mesh(earGeo, earMat);
        earL.position.set(-0.35, 1.6, 1.3);
        group.add(earL);
        const earR = earL.clone();
        earR.position.set(0.35, 1.6, 1.3);
        group.add(earR);
        // Legs
        const legGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.7, 6);
        const legMat = new THREE.MeshLambertMaterial({ color: 0x3a2a1a });
        [[-0.45, 0.35, -0.8], [0.45, 0.35, -0.8], [-0.45, 0.35, 0.8], [0.45, 0.35, 0.8]].forEach(([lx, ly, lz]) => {
          const leg = new THREE.Mesh(legGeo, legMat);
          leg.position.set(lx, ly, lz);
          leg.castShadow = true;
          group.add(leg);
        });
        return group;
      }
    },

    queixada: {
      name: 'Queixada',
      speed: 3,
      chaseSpeed: 8,
      points: 2,
      health: 35,
      attackDamage: 12,
      attackRange: 2.5,
      detectionRange: 15,
      createMesh() {
        const group = new THREE.Group();
        // Body - pig-like
        const bodyGeo = new THREE.SphereGeometry(0.5, 8, 6).scale(0.8, 0.6, 1.4);
        const bodyMat = new THREE.MeshLambertMaterial({ color: 0x2a2a2a });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 0.5;
        body.castShadow = true;
        group.add(body);
        // Head
        const headGeo = new THREE.SphereGeometry(0.5, 8, 6).scale(0.5, 0.5, 0.6);
        const headMat = new THREE.MeshLambertMaterial({ color: 0x3a3a3a });
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.set(0, 0.55, 0.9);
        head.castShadow = true;
        group.add(head);
        // White jaw stripe
        const jawGeo = new THREE.SphereGeometry(0.5, 8, 6).scale(0.35, 0.15, 0.3);
        const jawMat = new THREE.MeshLambertMaterial({ color: 0xcccccc });
        const jaw = new THREE.Mesh(jawGeo, jawMat);
        jaw.position.set(0, 0.4, 1.1);
        group.add(jaw);
        // Snout
        const snoutGeo = new THREE.SphereGeometry(0.5, 8, 6).scale(0.25, 0.2, 0.2);
        const snoutMat = new THREE.MeshLambertMaterial({ color: 0x553333 });
        const snout = new THREE.Mesh(snoutGeo, snoutMat);
        snout.position.set(0, 0.5, 1.25);
        group.add(snout);
        // Legs
        const legGeo = new THREE.CylinderGeometry(0.075, 0.075, 0.35, 6);
        const legMat = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
        [[-0.25, 0.17, -0.4], [0.25, 0.17, -0.4], [-0.25, 0.17, 0.4], [0.25, 0.17, 0.4]].forEach(([lx, ly, lz]) => {
          const leg = new THREE.Mesh(legGeo, legMat);
          leg.position.set(lx, ly, lz);
          group.add(leg);
        });
        return group;
      }
    },

    arara: {
      name: 'Arara',
      speed: 4,
      chaseSpeed: 10,
      points: 4,
      health: 15,
      attackDamage: 6,
      attackRange: 2,
      detectionRange: 22,
      createMesh() {
        const group = new THREE.Group();
        // Body
        const bodyGeo = new THREE.SphereGeometry(0.25, 6, 5);
        const bodyMat = new THREE.MeshLambertMaterial({ color: 0x0044cc });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 4;
        body.castShadow = true;
        group.add(body);
        // Head
        const headGeo = new THREE.SphereGeometry(0.15, 5, 4);
        const headMat = new THREE.MeshLambertMaterial({ color: 0x0044cc });
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.set(0, 4.2, 0.2);
        group.add(head);
        // Beak
        const beakGeo = new THREE.ConeGeometry(0.08, 0.2, 4);
        const beakMat = new THREE.MeshLambertMaterial({ color: 0x222222 });
        const beak = new THREE.Mesh(beakGeo, beakMat);
        beak.position.set(0, 4.15, 0.35);
        beak.rotation.x = Math.PI / 2;
        group.add(beak);
        // Face patch (white/yellow)
        const faceGeo = new THREE.SphereGeometry(0.5, 8, 6).scale(0.2, 0.1, 0.05);
        const faceMat = new THREE.MeshLambertMaterial({ color: 0xffffcc });
        const face = new THREE.Mesh(faceGeo, faceMat);
        face.position.set(0, 4.2, 0.32);
        group.add(face);
        // Wings (spread)
        const wingGeo = new THREE.SphereGeometry(0.5, 8, 6).scale(1.2, 0.04, 0.4);
        const wingMatL = new THREE.MeshLambertMaterial({ color: 0x0044cc });
        const wingL = new THREE.Mesh(wingGeo, wingMatL);
        wingL.position.set(-0.7, 4, 0);
        group.add(wingL);
        const wingR = wingL.clone();
        wingR.position.set(0.7, 4, 0);
        group.add(wingR);
        // Wing tips (yellow)
        const tipGeo = new THREE.SphereGeometry(0.5, 8, 6).scale(0.4, 0.03, 0.3);
        const tipMat = new THREE.MeshLambertMaterial({ color: 0xffcc00 });
        const tipL = new THREE.Mesh(tipGeo, tipMat);
        tipL.position.set(-1.2, 4, 0);
        group.add(tipL);
        const tipR = tipL.clone();
        tipR.position.set(1.2, 4, 0);
        group.add(tipR);
        // Long tail
        const tailGeo = new THREE.SphereGeometry(0.5, 8, 6).scale(0.08, 0.03, 1);
        const tailMat = new THREE.MeshLambertMaterial({ color: 0xcc0000 });
        const tail = new THREE.Mesh(tailGeo, tailMat);
        tail.position.set(0, 3.9, -0.7);
        group.add(tail);
        return group;
      }
    },

    sucuri: {
      name: 'Sucuri',
      speed: 1.5,
      chaseSpeed: 4,
      points: 6,
      health: 100,
      attackDamage: 20,
      attackRange: 3,
      detectionRange: 10,
      createMesh() {
        const group = new THREE.Group();
        const segCount = 10;
        const segMat = new THREE.MeshLambertMaterial({ color: 0x2a4a1a });
        const segMatDark = new THREE.MeshLambertMaterial({ color: 0x1a3a0a });
        for (let i = 0; i < segCount; i++) {
          const radius = 0.15 - i * 0.008;
          const segGeo = new THREE.SphereGeometry(radius, 5, 4);
          const mat = i % 2 === 0 ? segMat : segMatDark;
          const seg = new THREE.Mesh(segGeo, mat);
          seg.position.set(Math.sin(i * 0.5) * 0.3, 0.15, -i * 0.28);
          seg.scale.set(1, 0.7, 1.3);
          group.add(seg);
        }
        const headGeo = new THREE.SphereGeometry(0.5, 8, 6).scale(0.2, 0.12, 0.3);
        const headMat = new THREE.MeshLambertMaterial({ color: 0x3a5a2a });
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.set(0, 0.15, 0.3);
        group.add(head);
        const eyeGeo = new THREE.SphereGeometry(0.04, 4, 4);
        const eyeMat = new THREE.MeshLambertMaterial({ color: 0xaaaa00 });
        const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
        eyeL.position.set(-0.08, 0.22, 0.35);
        group.add(eyeL);
        const eyeR = eyeL.clone();
        eyeR.position.set(0.08, 0.22, 0.35);
        group.add(eyeR);
        return group;
      }
    },

    onca: {
      name: 'Onca-Pintada', speed: 4, chaseSpeed: 12, points: 8, health: 120,
      attackDamage: 25, attackRange: 3, detectionRange: 20,
      hitRadius: 1.6, hitHeight: 0.8,
      createMesh() {
        const g = new THREE.Group();
        const furMat = new THREE.MeshLambertMaterial({ color: 0xcc9933 });
        const darkMat = new THREE.MeshLambertMaterial({ color: 0x8a5a1a });
        const bellyMat = new THREE.MeshLambertMaterial({ color: 0xf0e0b0 });
        const spotMat = new THREE.MeshLambertMaterial({ color: 0x3a2a0a });
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.9, 0.75, 1.3), furMat);
        body.position.y = 0.8; body.castShadow = true; g.add(body);
        const rear = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.75, 0.7, 0.6), darkMat);
        rear.position.set(0, 0.8, -0.75); g.add(rear);
        const belly = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.7, 0.3, 1), bellyMat);
        belly.position.set(0, 0.5, 0.1); g.add(belly);
        const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.35, 8), furMat);
        neck.position.set(0, 1.05, 0.85); neck.rotation.x = 0.3; g.add(neck);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.55, 0.5, 0.55), furMat);
        head.position.set(0, 1.15, 1.15); g.add(head);
        const snout = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.32, 0.22, 0.3), furMat);
        snout.position.set(0, 1.05, 1.5); g.add(snout);
        const nose = new THREE.Mesh(new THREE.SphereGeometry(0.05, 4, 3), new THREE.MeshLambertMaterial({ color: 0x1a0a0a }));
        nose.position.set(0, 1.05, 1.68); g.add(nose);
        const earGeo = new THREE.ConeGeometry(0.07, 0.14, 4);
        const earL = new THREE.Mesh(earGeo, darkMat);
        earL.position.set(-0.25, 1.5, 1.15); g.add(earL);
        const earR = earL.clone();
        earR.position.set(0.25, 1.5, 1.15); g.add(earR);
        const eyeGeo = new THREE.SphereGeometry(0.05, 4, 4);
        const eyeMat = new THREE.MeshLambertMaterial({ color: 0xffff44 });
        const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
        eyeL.position.set(-0.24, 1.3, 1.45); g.add(eyeL);
        const eyeR = eyeL.clone();
        eyeR.position.set(0.24, 1.3, 1.45); g.add(eyeR);
        const spotPos = [[0.15, 0.95, 0.1], [0.35, 0.9, -0.2], [-0.2, 0.85, 0.3], [-0.35, 0.95, -0.3], [0.25, 1.0, -0.5], [-0.1, 0.9, -0.55]];
        for (const [sx, sy, sz] of spotPos) {
          const spot = new THREE.Mesh(new THREE.SphereGeometry(0.06, 4, 3), spotMat);
          spot.scale.set(1, 0.7, 1);
          spot.position.set(sx, sy, sz);
          g.add(spot);
        }
        const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.04, 1.1, 6), furMat);
        tail.position.set(0, 0.85, -1.35); tail.rotation.x = 0.3; g.add(tail);
        const ring1 = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.012, 4, 6), spotMat);
        ring1.position.set(0, 0.72, -1.55); ring1.rotation.x = Math.PI / 2; g.add(ring1);
        const ring2 = ring1.clone();
        ring2.position.set(0, 0.6, -1.75); g.add(ring2);
        const tailTip = new THREE.Mesh(new THREE.SphereGeometry(0.06, 4, 3), darkMat);
        tailTip.position.set(0, 0.55, -1.85); g.add(tailTip);
        const legGeo = new THREE.CylinderGeometry(0.11, 0.09, 0.6, 6);
        const legMat = new THREE.MeshLambertMaterial({ color: 0xbb8822 });
        [[-0.3, 0.3, -0.6], [0.3, 0.3, -0.6], [-0.3, 0.3, 0.5], [0.3, 0.3, 0.5]].forEach(p => {
          const l = new THREE.Mesh(legGeo, legMat);
          l.position.set(...p);
          l.castShadow = true;
          g.add(l);
        });
        return g;
      }
    },

    dinossauro: {
      name: 'Dinossauro', speed: 8, chaseSpeed: 14, points: 4, health: 180,
      attackDamage: 12, attackRange: 3.5, detectionRange: 18,
      hitRadius: 2.2, hitHeight: 2.1,
      createMesh() {
        const g = new THREE.Group();
        g.scale.setScalar(1.6);
        const greenMat = new THREE.MeshLambertMaterial({ color: 0x1e4d2b });
        const darkMat = new THREE.MeshLambertMaterial({ color: 0x14351e });
        const bellyMat = new THREE.MeshLambertMaterial({ color: 0x3f7d4a });
        const toothMat = new THREE.MeshLambertMaterial({ color: 0xeeeeee });
        const hips = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(1.1, 0.9, 1), greenMat);
        hips.position.y = 1.1; hips.castShadow = true; g.add(hips);
        const chest = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.95, 0.95, 0.9), greenMat);
        chest.position.set(0, 1.35, 0.9); chest.castShadow = true; g.add(chest);
        const belly = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.85, 0.4, 1.4), bellyMat);
        belly.position.set(0, 0.85, 0.4); g.add(belly);
        const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.42, 0.9, 8), greenMat);
        neck.position.set(0, 2.0, 1.2); neck.rotation.x = -0.5; g.add(neck);
        const neck2 = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.3, 0.6, 8), darkMat);
        neck2.position.set(0, 2.55, 1.55); neck2.rotation.x = -0.35; g.add(neck2);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.45, 0.38, 0.6), greenMat);
        head.position.set(0, 2.85, 1.9); g.add(head);
        const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.25, 0.8), darkMat);
        jaw.position.set(0, 2.6, 2.1); g.add(jaw);
        for (let i = -2; i <= 2; i++) {
          const tooth = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.14, 4), toothMat);
          tooth.position.set(i * 0.1, 2.55, 2.3);
          tooth.rotation.x = Math.PI;
          g.add(tooth);
        }
        for (let i = -1; i <= 1; i++) {
          const t2 = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.12, 4), toothMat);
          t2.position.set(i * 0.1, 2.68, 2.28);
          g.add(t2);
        }
        const eyeGeo = new THREE.SphereGeometry(0.06, 4, 4);
        const eyeMat = new THREE.MeshLambertMaterial({ color: 0xffcc00 });
        const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
        eyeL.position.set(-0.22, 2.95, 2.15); g.add(eyeL);
        const eyeR = eyeL.clone();
        eyeR.position.set(0.22, 2.95, 2.15); g.add(eyeR);
        const nostril = new THREE.Mesh(new THREE.SphereGeometry(0.05, 4, 3), darkMat);
        nostril.position.set(0, 2.8, 2.45); g.add(nostril);
        const spikeMat = new THREE.MeshLambertMaterial({ color: 0x2a6b3a });
        for (let i = 0; i < 6; i++) {
          const spike = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.35, 4), spikeMat);
          spike.position.set(0, 1.55 + i * 0.12, -0.3 + i * 0.38);
          g.add(spike);
        }
        for (let i = 0; i < 6; i++) {
          const tr = 0.34 - i * 0.045;
          const tailSeg = new THREE.Mesh(new THREE.SphereGeometry(tr, 6, 4), i % 2 === 0 ? greenMat : darkMat);
          tailSeg.scale.set(1, 0.8, 1.4);
          tailSeg.position.set(0, 0.95 - i * 0.06, -1.1 - i * 0.34);
          g.add(tailSeg);
        }
        const tailTip = new THREE.Mesh(new THREE.SphereGeometry(0.08, 5, 4), darkMat);
        tailTip.position.set(0, 0.6, -3.2); g.add(tailTip);
        const legGeo = new THREE.CylinderGeometry(0.22, 0.16, 0.9, 7);
        const legMat = new THREE.MeshLambertMaterial({ color: 0x14351e });
        const clawMat = new THREE.MeshLambertMaterial({ color: 0xd8d0b8 });
        const clawGeo = new THREE.ConeGeometry(0.05, 0.16, 4);
        [[-0.45, 0.45, 0.65], [0.45, 0.45, 0.65], [-0.45, 0.45, -0.6], [0.45, 0.45, -0.6]].forEach(([lx, ly, lz]) => {
          const leg = new THREE.Mesh(legGeo, legMat);
          leg.position.set(lx, ly, lz);
          leg.castShadow = true;
          g.add(leg);
          for (let c = -1; c <= 1; c += 2) {
            const claw = new THREE.Mesh(clawGeo, clawMat);
            claw.position.set(lx + c * 0.1, 0.06, lz);
            claw.rotation.x = Math.PI;
            g.add(claw);
          }
        });
        const armGeo = new THREE.CylinderGeometry(0.07, 0.06, 0.4, 5);
        const armL = new THREE.Mesh(armGeo, darkMat);
        armL.position.set(-0.35, 1.5, 1.2); armL.rotation.z = 0.5; g.add(armL);
        const armR = armL.clone();
        armR.position.set(0.35, 1.5, 1.2); armR.rotation.z = -0.5; g.add(armR);
        return g;
      }
    },

    loboguara: {
      name: 'Lobo-Guara', speed: 5, chaseSpeed: 11, points: 6, health: 70,
      attackDamage: 15, attackRange: 2.5, detectionRange: 22,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.6, 0.6, 1.4), new THREE.MeshLambertMaterial({ color: 0xaa4400 }));
        body.position.y = 1.2; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.4, 0.4, 0.5), new THREE.MeshLambertMaterial({ color: 0xaa4400 }));
        head.position.set(0, 1.4, 0.8); g.add(head);
        const snout = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.3, 6).rotateX(Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0x222222 }));
        snout.position.set(0, 1.3, 1.1); g.add(snout);
        const legGeo = new THREE.CylinderGeometry(0.06, 0.06, 1, 6);
        const legMat = new THREE.MeshLambertMaterial({ color: 0x111111 });
        [[-0.2,0.5,-0.4],[0.2,0.5,-0.4],[-0.2,0.5,0.4],[0.2,0.5,0.4]].forEach(p => { const l = new THREE.Mesh(legGeo, legMat); l.position.set(...p); g.add(l); });
        return g;
      }
    },

    micoleao: {
      name: 'Mico-Leao', speed: 5, chaseSpeed: 9, points: 4, health: 20,
      attackDamage: 6, attackRange: 2, detectionRange: 18,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.25, 0.25, 0.5), new THREE.MeshLambertMaterial({ color: 0xff8800 }));
        body.position.y = 0.8; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.15, 5, 4), new THREE.MeshLambertMaterial({ color: 0xffaa22 }));
        head.position.set(0, 0.95, 0.3); g.add(head);
        const mane = new THREE.Mesh(new THREE.SphereGeometry(0.2, 5, 4), new THREE.MeshLambertMaterial({ color: 0xffcc44 }));
        mane.position.set(0, 0.95, 0.3); mane.scale.set(1.3, 1.3, 0.8); g.add(mane);
        const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.02, 0.6, 4), new THREE.MeshLambertMaterial({ color: 0xff8800 }));
        tail.position.set(0, 0.9, -0.5); tail.rotation.x = -0.5; g.add(tail);
        return g;
      }
    },

    tamandua: {
      name: 'Tamandua', speed: 1.5, chaseSpeed: 4, points: 3, health: 90,
      attackDamage: 18, attackRange: 3.5, detectionRange: 10,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.8, 0.7, 2), new THREE.MeshLambertMaterial({ color: 0x3a3a3a }));
        body.position.y = 0.8; body.castShadow = true; g.add(body);
        const stripe = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.82, 0.4, 0.8), new THREE.MeshLambertMaterial({ color: 0xeeeeee }));
        stripe.position.set(0, 0.8, 0.3); g.add(stripe);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.3, 0.3, 1), new THREE.MeshLambertMaterial({ color: 0x3a3a3a }));
        head.position.set(0, 0.9, 1.5); g.add(head);
        const tail = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.5, 0.6, 1.5), new THREE.MeshLambertMaterial({ color: 0x3a3a3a }));
        tail.position.set(0, 1.0, -1.5); g.add(tail);
        return g;
      }
    },

    tatu: {
      name: 'Tatu-Bola', speed: 2, chaseSpeed: 5, points: 2, health: 60,
      attackDamage: 8, attackRange: 2, detectionRange: 10,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6), new THREE.MeshLambertMaterial({ color: 0x6a5a4a }));
        body.position.y = 0.5; body.scale.set(1, 0.7, 1.3); body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.25, 0.2, 0.3), new THREE.MeshLambertMaterial({ color: 0x5a4a3a }));
        head.position.set(0, 0.4, 0.7); g.add(head);
        const legGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.25, 6);
        const legMat = new THREE.MeshLambertMaterial({ color: 0x4a3a2a });
        [[-0.25,0.12,-0.3],[0.25,0.12,-0.3],[-0.25,0.12,0.3],[0.25,0.12,0.3]].forEach(p => { g.add(new THREE.Mesh(legGeo, legMat).translateX(p[0]).translateY(p[1]).translateZ(p[2])); });
        return g;
      }
    },

    preguica: {
      name: 'Preguica', speed: 0.5, chaseSpeed: 1.5, points: 1, health: 40,
      attackDamage: 4, attackRange: 2, detectionRange: 6,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.5, 0.4, 0.7), new THREE.MeshLambertMaterial({ color: 0x6a5a3a }));
        body.position.y = 1.5; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 5, 4), new THREE.MeshLambertMaterial({ color: 0x7a6a4a }));
        head.position.set(0, 1.7, 0.35); g.add(head);
        const armGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.7, 6);
        const armMat = new THREE.MeshLambertMaterial({ color: 0x5a4a2a });
        const armL = new THREE.Mesh(armGeo, armMat); armL.position.set(-0.3, 1.2, 0); g.add(armL);
        const armR = new THREE.Mesh(armGeo, armMat); armR.position.set(0.3, 1.2, 0); g.add(armR);
        return g;
      }
    },

    pirarucu: {
      name: 'Pirarucu', speed: 2, chaseSpeed: 6, points: 5, health: 80,
      attackDamage: 12, attackRange: 3, detectionRange: 14,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.5, 0.8, 2.5), new THREE.MeshLambertMaterial({ color: 0x4a5a4a }));
        body.position.y = 0.5; body.castShadow = true; g.add(body);
        const tail = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.05, 0.6, 0.5), new THREE.MeshLambertMaterial({ color: 0x6a3a2a }));
        tail.position.set(0, 0.5, -1.4); g.add(tail);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.4, 0.5, 0.5), new THREE.MeshLambertMaterial({ color: 0x3a4a3a }));
        head.position.set(0, 0.5, 1.4); g.add(head);
        return g;
      }
    },

    boto: {
      name: 'Boto-Rosa', speed: 3, chaseSpeed: 7, points: 4, health: 60,
      attackDamage: 10, attackRange: 2.5, detectionRange: 16,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.6, 0.5, 2), new THREE.MeshLambertMaterial({ color: 0xdd8899 }));
        body.position.y = 0.5; body.castShadow = true; g.add(body);
        const snout = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.7, 6).rotateX(Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0xcc7788 }));
        snout.position.set(0, 0.5, 1.2); g.add(snout);
        const fin = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.05, 0.4, 0.4), new THREE.MeshLambertMaterial({ color: 0xcc7788 }));
        fin.position.set(0, 0.9, 0); g.add(fin);
        const tail = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.6, 0.05, 0.3), new THREE.MeshLambertMaterial({ color: 0xdd8899 }));
        tail.position.set(0, 0.5, -1.2); g.add(tail);
        return g;
      }
    },

    harpia: {
      name: 'Harpia', speed: 4, chaseSpeed: 12, points: 7, health: 50,
      attackDamage: 20, attackRange: 3, detectionRange: 25,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.5, 0.4, 0.7), new THREE.MeshLambertMaterial({ color: 0x444444 }));
        body.position.y = 4; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 5, 4), new THREE.MeshLambertMaterial({ color: 0xeeeeee }));
        head.position.set(0, 4.3, 0.3); g.add(head);
        const beak = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.15, 4), new THREE.MeshLambertMaterial({ color: 0x222222 }));
        beak.position.set(0, 4.25, 0.5); beak.rotation.x = Math.PI/2; g.add(beak);
        const wingGeo = new THREE.SphereGeometry(0.5, 8, 6).scale(1.8, 0.05, 0.5);
        const wingMat = new THREE.MeshLambertMaterial({ color: 0x333333 });
        const wL = new THREE.Mesh(wingGeo, wingMat); wL.position.set(-1, 4, 0); g.add(wL);
        const wR = new THREE.Mesh(wingGeo, wingMat); wR.position.set(1, 4, 0); g.add(wR);
        const crest = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.3, 0.2, 0.05), new THREE.MeshLambertMaterial({ color: 0x333333 }));
        crest.position.set(0, 4.5, 0.2); g.add(crest);
        return g;
      }
    },

    sagui: {
      name: 'Sagui', speed: 5, chaseSpeed: 9, points: 3, health: 15,
      attackDamage: 5, attackRange: 2, detectionRange: 16,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.2, 0.2, 0.35), new THREE.MeshLambertMaterial({ color: 0x4a4a4a }));
        body.position.y = 0.7; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 5, 4), new THREE.MeshLambertMaterial({ color: 0x5a5a5a }));
        head.position.set(0, 0.85, 0.2); g.add(head);
        const earMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
        const earL = new THREE.Mesh(new THREE.SphereGeometry(0.06, 4, 3), earMat); earL.position.set(-0.12, 0.95, 0.2); g.add(earL);
        const earR = earL.clone(); earR.position.set(0.12, 0.95, 0.2); g.add(earR);
        const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.015, 0.5, 4), new THREE.MeshLambertMaterial({ color: 0x3a3a3a }));
        tail.position.set(0, 0.7, -0.4); tail.rotation.x = -0.5; g.add(tail);
        return g;
      }
    },

    gamba: {
      name: 'Gamba', speed: 2.5, chaseSpeed: 5, points: 1, health: 25,
      attackDamage: 4, attackRange: 2, detectionRange: 10,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.35, 0.3, 0.7), new THREE.MeshLambertMaterial({ color: 0x555555 }));
        body.position.y = 0.4; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.25, 0.2, 0.3), new THREE.MeshLambertMaterial({ color: 0xcccccc }));
        head.position.set(0, 0.45, 0.45); g.add(head);
        const nose = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.08, 6).rotateX(Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0xff6688 }));
        nose.position.set(0, 0.42, 0.62); g.add(nose);
        const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.02, 0.7, 4), new THREE.MeshLambertMaterial({ color: 0xddcccc }));
        tail.position.set(0, 0.35, -0.6); tail.rotation.x = 0.3; g.add(tail);
        return g;
      }
    },

    paca: {
      name: 'Paca', speed: 3, chaseSpeed: 7, points: 2, health: 35,
      attackDamage: 7, attackRange: 2, detectionRange: 12,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.5, 0.4, 0.9), new THREE.MeshLambertMaterial({ color: 0x6a4a2a }));
        body.position.y = 0.4; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.35, 0.3, 0.35), new THREE.MeshLambertMaterial({ color: 0x7a5a3a }));
        head.position.set(0, 0.45, 0.55); g.add(head);
        for (let i = 0; i < 4; i++) {
          const dot = new THREE.Mesh(new THREE.SphereGeometry(0.04, 4, 3), new THREE.MeshLambertMaterial({ color: 0xddddcc }));
          dot.position.set((Math.random()-0.5)*0.4, 0.45, (Math.random()-0.5)*0.6); g.add(dot);
        }
        return g;
      }
    },

    cutia: {
      name: 'Cutia', speed: 4, chaseSpeed: 9, points: 2, health: 25,
      attackDamage: 5, attackRange: 2, detectionRange: 14,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.3, 0.3, 0.6), new THREE.MeshLambertMaterial({ color: 0x8a5a2a }));
        body.position.y = 0.35; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.2, 0.2, 0.25), new THREE.MeshLambertMaterial({ color: 0x9a6a3a }));
        head.position.set(0, 0.4, 0.4); g.add(head);
        const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.25, 6);
        const legMat = new THREE.MeshLambertMaterial({ color: 0x6a4a1a });
        [[-0.1,0.12,-0.2],[0.1,0.12,-0.2],[-0.1,0.12,0.15],[0.1,0.12,0.15]].forEach(p => { g.add(new THREE.Mesh(legGeo, legMat).translateX(p[0]).translateY(p[1]).translateZ(p[2])); });
        return g;
      }
    },

    veado: {
      name: 'Veado-Campeiro', speed: 5, chaseSpeed: 10, points: 3, health: 45,
      attackDamage: 10, attackRange: 2.5, detectionRange: 20,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.6, 0.6, 1.4), new THREE.MeshLambertMaterial({ color: 0x9a7a4a }));
        body.position.y = 1.0; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.3, 0.35, 0.4), new THREE.MeshLambertMaterial({ color: 0xaa8a5a }));
        head.position.set(0, 1.4, 0.8); g.add(head);
        const antler = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.4, 4), new THREE.MeshLambertMaterial({ color: 0x5a4a3a }));
        antler.position.set(-0.1, 1.7, 0.8); antler.rotation.z = 0.3; g.add(antler);
        const antlerR = antler.clone(); antlerR.position.set(0.1, 1.7, 0.8); antlerR.rotation.z = -0.3; g.add(antlerR);
        const legGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 6);
        const legMat = new THREE.MeshLambertMaterial({ color: 0x7a5a3a });
        [[-0.2,0.4,-0.4],[0.2,0.4,-0.4],[-0.2,0.4,0.4],[0.2,0.4,0.4]].forEach(p => { g.add(new THREE.Mesh(legGeo, legMat).translateX(p[0]).translateY(p[1]).translateZ(p[2])); });
        return g;
      }
    },

    jaguatirica: {
      name: 'Jaguatirica', speed: 4.5, chaseSpeed: 11, points: 5, health: 55,
      attackDamage: 14, attackRange: 2.5, detectionRange: 18,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.5, 0.45, 1.2), new THREE.MeshLambertMaterial({ color: 0xbb8833 }));
        body.position.y = 0.6; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.35, 0.3, 0.35), new THREE.MeshLambertMaterial({ color: 0xcc9944 }));
        head.position.set(0, 0.75, 0.7); g.add(head);
        const legGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.45, 6);
        const legMat = new THREE.MeshLambertMaterial({ color: 0xaa7722 });
        [[-0.18,0.22,-0.35],[0.18,0.22,-0.35],[-0.18,0.22,0.35],[0.18,0.22,0.35]].forEach(p => { g.add(new THREE.Mesh(legGeo, legMat).translateX(p[0]).translateY(p[1]).translateZ(p[2])); });
        const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.03, 0.8, 4), new THREE.MeshLambertMaterial({ color: 0xbb8833 }));
        tail.position.set(0, 0.6, -0.9); tail.rotation.x = 0.3; g.add(tail);
        return g;
      }
    },

    piranha: {
      name: 'Piranha', speed: 4, chaseSpeed: 10, points: 2, health: 10,
      attackDamage: 8, attackRange: 2, detectionRange: 14,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.15, 0.3, 0.4), new THREE.MeshLambertMaterial({ color: 0x4a5a6a }));
        body.position.y = 0.4; g.add(body);
        const belly = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.14, 0.12, 0.25), new THREE.MeshLambertMaterial({ color: 0xcc3333 }));
        belly.position.set(0, 0.3, 0); g.add(belly);
        const jaw = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.1, 0.08, 0.1), new THREE.MeshLambertMaterial({ color: 0xeeeeee }));
        jaw.position.set(0, 0.35, 0.22); g.add(jaw);
        return g;
      }
    },

    caititu: {
      name: 'Caititu', speed: 3, chaseSpeed: 7, points: 2, health: 40,
      attackDamage: 10, attackRange: 2.5, detectionRange: 13,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.6, 0.5, 1), new THREE.MeshLambertMaterial({ color: 0x3a3a3a }));
        body.position.y = 0.5; body.castShadow = true; g.add(body);
        const collar = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.62, 0.15, 0.2), new THREE.MeshLambertMaterial({ color: 0xccccaa }));
        collar.position.set(0, 0.6, 0.3); g.add(collar);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.4, 0.35, 0.4), new THREE.MeshLambertMaterial({ color: 0x4a4a4a }));
        head.position.set(0, 0.55, 0.65); g.add(head);
        const snout = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.2, 0.15, 0.15), new THREE.MeshLambertMaterial({ color: 0x553333 }));
        snout.position.set(0, 0.45, 0.85); g.add(snout);
        return g;
      }
    },

    bugio: {
      name: 'Bugio', speed: 2.5, chaseSpeed: 6, points: 3, health: 45,
      attackDamage: 8, attackRange: 2.5, detectionRange: 14,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.4, 0.4, 0.6), new THREE.MeshLambertMaterial({ color: 0x2a1a0a }));
        body.position.y = 0.9; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 5, 4), new THREE.MeshLambertMaterial({ color: 0x3a2a1a }));
        head.position.set(0, 1.15, 0.3); g.add(head);
        const beard = new THREE.Mesh(new THREE.SphereGeometry(0.12, 4, 3), new THREE.MeshLambertMaterial({ color: 0x1a0a00 }));
        beard.position.set(0, 1.0, 0.4); g.add(beard);
        const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.02, 0.8, 4), new THREE.MeshLambertMaterial({ color: 0x2a1a0a }));
        tail.position.set(0, 0.8, -0.5); tail.rotation.x = -0.8; g.add(tail);
        return g;
      }
    },

    coruja: {
      name: 'Coruja', speed: 2, chaseSpeed: 5, points: 2, health: 20,
      attackDamage: 6, attackRange: 2, detectionRange: 20,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.3, 0.35, 0.3), new THREE.MeshLambertMaterial({ color: 0x8a7a5a }));
        body.position.y = 0.4; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 5, 4), new THREE.MeshLambertMaterial({ color: 0x9a8a6a }));
        head.position.set(0, 0.7, 0.05); g.add(head);
        const eyeGeo = new THREE.SphereGeometry(0.06, 4, 4);
        const eyeMat = new THREE.MeshLambertMaterial({ color: 0xffff00 });
        const eL = new THREE.Mesh(eyeGeo, eyeMat); eL.position.set(-0.08, 0.72, 0.15); g.add(eL);
        const eR = eL.clone(); eR.position.set(0.08, 0.72, 0.15); g.add(eR);
        return g;
      }
    },

    urubu: {
      name: 'Urubu-Rei', speed: 3, chaseSpeed: 8, points: 3, health: 30,
      attackDamage: 8, attackRange: 2.5, detectionRange: 22,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.4, 0.3, 0.5), new THREE.MeshLambertMaterial({ color: 0x111111 }));
        body.position.y = 3.5; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.14, 5, 4), new THREE.MeshLambertMaterial({ color: 0xff6600 }));
        head.position.set(0, 3.7, 0.25); g.add(head);
        const wingGeo = new THREE.SphereGeometry(0.5, 8, 6).scale(1.4, 0.04, 0.4);
        const wingMat = new THREE.MeshLambertMaterial({ color: 0x222222 });
        g.add(new THREE.Mesh(wingGeo, wingMat).translateY(3.5));
        return g;
      }
    },

    gaviao: {
      name: 'Gaviao-Real', speed: 4.5, chaseSpeed: 12, points: 6, health: 40,
      attackDamage: 16, attackRange: 3, detectionRange: 25,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.35, 0.3, 0.5), new THREE.MeshLambertMaterial({ color: 0x555555 }));
        body.position.y = 4.2; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.15, 5, 4), new THREE.MeshLambertMaterial({ color: 0xeeeeee }));
        head.position.set(0, 4.45, 0.2); g.add(head);
        const beak = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.12, 4), new THREE.MeshLambertMaterial({ color: 0x333333 }));
        beak.position.set(0, 4.4, 0.35); beak.rotation.x = Math.PI/2; g.add(beak);
        const wingGeo = new THREE.SphereGeometry(0.5, 8, 6).scale(1.6, 0.04, 0.4);
        g.add(new THREE.Mesh(wingGeo, new THREE.MeshLambertMaterial({ color: 0x444444 })).translateY(4.2));
        return g;
      }
    },

    tartaruga: {
      name: 'Tartaruga', speed: 0.8, chaseSpeed: 2, points: 1, health: 100,
      attackDamage: 4, attackRange: 2, detectionRange: 8,
      createMesh() {
        const g = new THREE.Group();
        const shell = new THREE.Mesh(new THREE.SphereGeometry(0.5, 6, 5), new THREE.MeshLambertMaterial({ color: 0x4a5a3a }));
        shell.position.y = 0.35; shell.scale.y = 0.5; shell.castShadow = true; g.add(shell);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.15, 0.12, 0.25), new THREE.MeshLambertMaterial({ color: 0x5a6a4a }));
        head.position.set(0, 0.3, 0.55); g.add(head);
        const legGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.08, 6);
        const legMat = new THREE.MeshLambertMaterial({ color: 0x5a6a4a });
        [[-0.35,0.1,0.2],[0.35,0.1,0.2],[-0.35,0.1,-0.2],[0.35,0.1,-0.2]].forEach(p => { g.add(new THREE.Mesh(legGeo, legMat).translateX(p[0]).translateY(p[1]).translateZ(p[2])); });
        return g;
      }
    },

    cobracoral: {
      name: 'Cobra-Coral', speed: 2.5, chaseSpeed: 6, points: 4, health: 15,
      attackDamage: 25, attackRange: 2, detectionRange: 8,
      createMesh() {
        const g = new THREE.Group();
        const colors = [0xff0000, 0x111111, 0xffff00, 0x111111];
        for (let i = 0; i < 8; i++) {
          const seg = new THREE.Mesh(new THREE.SphereGeometry(0.08, 5, 4), new THREE.MeshLambertMaterial({ color: colors[i % 4] }));
          seg.position.set(Math.sin(i * 0.4) * 0.15, 0.08, -i * 0.2);
          seg.scale.set(1, 0.7, 1.2);
          g.add(seg);
        }
        return g;
      }
    },

    cascavel: {
      name: 'Cascavel', speed: 2, chaseSpeed: 5, points: 4, health: 25,
      attackDamage: 20, attackRange: 2.5, detectionRange: 10,
      createMesh() {
        const g = new THREE.Group();
        const segMat = new THREE.MeshLambertMaterial({ color: 0x6a5a3a });
        for (let i = 0; i < 7; i++) {
          const seg = new THREE.Mesh(new THREE.SphereGeometry(0.1, 5, 4), segMat);
          seg.position.set(Math.sin(i * 0.5) * 0.2, 0.1, -i * 0.22);
          seg.scale.set(1, 0.6, 1.2);
          g.add(seg);
        }
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.15, 0.08, 0.2), new THREE.MeshLambertMaterial({ color: 0x7a6a4a }));
        head.position.set(0, 0.1, 0.2); g.add(head);
        const rattle = new THREE.Mesh(new THREE.SphereGeometry(0.06, 4, 3), new THREE.MeshLambertMaterial({ color: 0xaaaa66 }));
        rattle.position.set(Math.sin(3.5)*0.2, 0.1, -7*0.22); g.add(rattle);
        return g;
      }
    },

    jiboia: {
      name: 'Jiboia', speed: 1.5, chaseSpeed: 4, points: 5, health: 80,
      attackDamage: 16, attackRange: 3, detectionRange: 10,
      createMesh() {
        const g = new THREE.Group();
        const segMat = new THREE.MeshLambertMaterial({ color: 0x6a4a3a });
        const segMat2 = new THREE.MeshLambertMaterial({ color: 0x8a6a4a });
        for (let i = 0; i < 12; i++) {
          const seg = new THREE.Mesh(new THREE.SphereGeometry(0.12 - i*0.005, 5, 4), i%2===0 ? segMat : segMat2);
          seg.position.set(Math.sin(i * 0.4) * 0.25, 0.12, -i * 0.25);
          seg.scale.set(1, 0.6, 1.2);
          g.add(seg);
        }
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.18, 0.1, 0.25), new THREE.MeshLambertMaterial({ color: 0x5a3a2a }));
        head.position.set(0, 0.12, 0.25); g.add(head);
        return g;
      }
    },

    sapo: {
      name: 'Sapo-Cururu', speed: 1.5, chaseSpeed: 4, points: 1, health: 20,
      attackDamage: 3, attackRange: 2, detectionRange: 8,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.25, 6, 5), new THREE.MeshLambertMaterial({ color: 0x4a5a2a }));
        body.position.y = 0.2; body.scale.set(1, 0.7, 1.1); g.add(body);
        const eyeGeo = new THREE.SphereGeometry(0.06, 4, 4);
        const eyeMat = new THREE.MeshLambertMaterial({ color: 0xaaaa00 });
        const eL = new THREE.Mesh(eyeGeo, eyeMat); eL.position.set(-0.12, 0.35, 0.15); g.add(eL);
        const eR = eL.clone(); eR.position.set(0.12, 0.35, 0.15); g.add(eR);
        const legGeo = new THREE.CylinderGeometry(0.075, 0.075, 0.06, 6);
        const legMat = new THREE.MeshLambertMaterial({ color: 0x3a4a1a });
        g.add(new THREE.Mesh(legGeo, legMat).translateX(-0.2).translateY(0.05).translateZ(-0.15));
        g.add(new THREE.Mesh(legGeo, legMat).translateX(0.2).translateY(0.05).translateZ(-0.15));
        return g;
      }
    },

    perereca: {
      name: 'Perereca', speed: 4, chaseSpeed: 8, points: 1, health: 10,
      attackDamage: 2, attackRange: 2, detectionRange: 10,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.15, 5, 4), new THREE.MeshLambertMaterial({ color: 0x22aa22 }));
        body.position.y = 0.15; g.add(body);
        const eyeGeo = new THREE.SphereGeometry(0.05, 4, 3);
        const eyeMat = new THREE.MeshLambertMaterial({ color: 0xff0000 });
        const eL = new THREE.Mesh(eyeGeo, eyeMat); eL.position.set(-0.08, 0.25, 0.08); g.add(eL);
        const eR = eL.clone(); eR.position.set(0.08, 0.25, 0.08); g.add(eR);
        return g;
      }
    },

    macacoaranha: {
      name: 'Macaco-Aranha', speed: 4, chaseSpeed: 9, points: 3, health: 35,
      attackDamage: 8, attackRange: 2.5, detectionRange: 16,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.35, 0.35, 0.5), new THREE.MeshLambertMaterial({ color: 0x2a2a2a }));
        body.position.y = 1.0; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.17, 5, 4), new THREE.MeshLambertMaterial({ color: 0x3a3a3a }));
        head.position.set(0, 1.25, 0.25); g.add(head);
        const armGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.7, 4);
        const armMat = new THREE.MeshLambertMaterial({ color: 0x2a2a2a });
        const aL = new THREE.Mesh(armGeo, armMat); aL.position.set(-0.25, 0.8, 0); aL.rotation.z = 0.5; g.add(aL);
        const aR = new THREE.Mesh(armGeo, armMat); aR.position.set(0.25, 0.8, 0); aR.rotation.z = -0.5; g.add(aR);
        const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.02, 1.0, 4), new THREE.MeshLambertMaterial({ color: 0x2a2a2a }));
        tail.position.set(0, 1.0, -0.5); tail.rotation.x = -1.0; g.add(tail);
        return g;
      }
    },

    quati: {
      name: 'Quati', speed: 3.5, chaseSpeed: 7, points: 2, health: 30,
      attackDamage: 7, attackRange: 2, detectionRange: 14,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.3, 0.25, 0.7), new THREE.MeshLambertMaterial({ color: 0x6a4a2a }));
        body.position.y = 0.4; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.2, 0.18, 0.25), new THREE.MeshLambertMaterial({ color: 0x7a5a3a }));
        head.position.set(0, 0.45, 0.45); g.add(head);
        const nose = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.15, 6).rotateX(Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0x333333 }));
        nose.position.set(0, 0.43, 0.6); g.add(nose);
        const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.03, 0.8, 4), new THREE.MeshLambertMaterial({ color: 0x6a4a2a }));
        tail.position.set(0, 0.6, -0.5); tail.rotation.x = -1.0; g.add(tail);
        return g;
      }
    },

    cervo: {
      name: 'Cervo-do-Pantanal', speed: 4, chaseSpeed: 9, points: 4, health: 70,
      attackDamage: 12, attackRange: 3, detectionRange: 18,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.8, 0.7, 1.6), new THREE.MeshLambertMaterial({ color: 0x7a5a3a }));
        body.position.y = 1.1; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.4, 0.4, 0.5), new THREE.MeshLambertMaterial({ color: 0x8a6a4a }));
        head.position.set(0, 1.5, 0.9); g.add(head);
        const antlerMat = new THREE.MeshLambertMaterial({ color: 0x5a4a3a });
        for (let side = -1; side <= 1; side += 2) {
          const a1 = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.5, 4), antlerMat);
          a1.position.set(side*0.15, 1.85, 0.9); a1.rotation.z = side*0.4; g.add(a1);
          const a2 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.3, 4), antlerMat);
          a2.position.set(side*0.25, 2.0, 0.9); a2.rotation.z = side*0.8; g.add(a2);
        }
        const legGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.9, 6);
        const legMat = new THREE.MeshLambertMaterial({ color: 0x5a3a2a });
        [[-0.28,0.45,-0.5],[0.28,0.45,-0.5],[-0.28,0.45,0.5],[0.28,0.45,0.5]].forEach(p => { g.add(new THREE.Mesh(legGeo, legMat).translateX(p[0]).translateY(p[1]).translateZ(p[2])); });
        return g;
      }
    },

    iara: {
      name: 'Iara', speed: 3, chaseSpeed: 7, points: 5, health: 50,
      attackDamage: 12, attackRange: 3, detectionRange: 15,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.4, 0.5, 0.8), new THREE.MeshLambertMaterial({ color: 0x44aa88 }));
        body.position.y = 0.5; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 5, 4), new THREE.MeshLambertMaterial({ color: 0x66ccaa }));
        head.position.set(0, 0.85, 0.3); g.add(head);
        const tail = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.5, 0.1, 0.5), new THREE.MeshLambertMaterial({ color: 0x33aa77 }));
        tail.position.set(0, 0.3, -0.6); g.add(tail);
        const hair = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.35, 0.3, 0.2), new THREE.MeshLambertMaterial({ color: 0x1a4a1a }));
        hair.position.set(0, 1.0, 0.2); g.add(hair);
        return g;
      }
    },

    saci: {
      name: 'Saci', speed: 6, chaseSpeed: 13, points: 7, health: 30,
      attackDamage: 10, attackRange: 2.5, detectionRange: 20,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.3, 0.6, 0.25), new THREE.MeshLambertMaterial({ color: 0x3a2a1a }));
        body.position.y = 1.0; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 5, 4), new THREE.MeshLambertMaterial({ color: 0x4a3a2a }));
        head.position.set(0, 1.5, 0); g.add(head);
        const hat = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.3, 6), new THREE.MeshLambertMaterial({ color: 0xcc0000 }));
        hat.position.set(0, 1.8, 0); g.add(hat);
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.7, 6), new THREE.MeshLambertMaterial({ color: 0x3a2a1a }));
        leg.position.set(0, 0.35, 0); g.add(leg);
        const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.2, 4), new THREE.MeshLambertMaterial({ color: 0x5a3a1a }));
        pipe.position.set(0.15, 1.4, 0.12); pipe.rotation.z = -0.5; g.add(pipe);
        return g;
      }
    },

    curupira: {
      name: 'Curupira', speed: 5, chaseSpeed: 11, points: 6, health: 65,
      attackDamage: 14, attackRange: 3, detectionRange: 18,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.4, 0.7, 0.3), new THREE.MeshLambertMaterial({ color: 0x5a3a1a }));
        body.position.y = 0.9; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 5, 4), new THREE.MeshLambertMaterial({ color: 0x6a4a2a }));
        head.position.set(0, 1.5, 0); g.add(head);
        const hair = new THREE.Mesh(new THREE.SphereGeometry(0.25, 5, 4), new THREE.MeshLambertMaterial({ color: 0xff3300 }));
        hair.position.set(0, 1.6, -0.05); hair.scale.y = 1.3; g.add(hair);
        const legGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.5, 6);
        const legMat = new THREE.MeshLambertMaterial({ color: 0x5a3a1a });
        const lL = new THREE.Mesh(legGeo, legMat); lL.position.set(-0.12, 0.25, 0); g.add(lL);
        const lR = new THREE.Mesh(legGeo, legMat); lR.position.set(0.12, 0.25, 0); g.add(lR);
        return g;
      }
    },

    boiuna: {
      name: 'Boiuna', speed: 2, chaseSpeed: 5, points: 8, health: 130,
      attackDamage: 22, attackRange: 3.5, detectionRange: 12,
      createMesh() {
        const g = new THREE.Group();
        const segMat = new THREE.MeshLambertMaterial({ color: 0x1a1a2a });
        for (let i = 0; i < 14; i++) {
          const r = 0.2 - i * 0.008;
          const seg = new THREE.Mesh(new THREE.SphereGeometry(r, 5, 4), segMat);
          seg.position.set(Math.sin(i * 0.4) * 0.4, 0.2, -i * 0.3);
          seg.scale.set(1, 0.7, 1.3);
          g.add(seg);
        }
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.3, 0.2, 0.4), new THREE.MeshLambertMaterial({ color: 0x2a2a3a }));
        head.position.set(0, 0.25, 0.4); g.add(head);
        const eyeGeo = new THREE.SphereGeometry(0.06, 4, 3);
        const eyeMat = new THREE.MeshLambertMaterial({ color: 0xff4400 });
        g.add(new THREE.Mesh(eyeGeo, eyeMat).translateX(-0.1).translateY(0.35).translateZ(0.5));
        g.add(new THREE.Mesh(eyeGeo, eyeMat).translateX(0.1).translateY(0.35).translateZ(0.5));
        return g;
      }
    },

    mapinguari: {
      name: 'Mapinguari', speed: 2, chaseSpeed: 5, points: 9, health: 150,
      attackDamage: 28, attackRange: 3.5, detectionRange: 14,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(1.2, 1.8, 0.9), new THREE.MeshLambertMaterial({ color: 0x4a3a1a }));
        body.position.y = 1.5; body.castShadow = true; g.add(body);
        const fur = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(1.3, 1, 1), new THREE.MeshLambertMaterial({ color: 0x3a2a0a }));
        fur.position.y = 2.0; g.add(fur);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.4, 5, 4), new THREE.MeshLambertMaterial({ color: 0x5a4a2a }));
        head.position.set(0, 2.8, 0.2); g.add(head);
        const eye = new THREE.Mesh(new THREE.SphereGeometry(0.08, 4, 3), new THREE.MeshLambertMaterial({ color: 0xff0000 }));
        eye.position.set(0, 2.9, 0.5); g.add(eye);
        const legGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.8, 6);
        const legMat = new THREE.MeshLambertMaterial({ color: 0x3a2a0a });
        g.add(new THREE.Mesh(legGeo, legMat).translateX(-0.35).translateY(0.4));
        g.add(new THREE.Mesh(legGeo, legMat).translateX(0.35).translateY(0.4));
        return g;
      }
    },

    lobisomem: {
      name: 'Lobisomem', speed: 5, chaseSpeed: 13, points: 8, health: 100,
      attackDamage: 22, attackRange: 3, detectionRange: 22,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.7, 1, 0.5), new THREE.MeshLambertMaterial({ color: 0x3a3a3a }));
        body.position.y = 1.3; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.4, 0.4, 0.5), new THREE.MeshLambertMaterial({ color: 0x4a4a4a }));
        head.position.set(0, 2.0, 0.2); g.add(head);
        const snout = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.3, 6).rotateX(Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0x3a3a3a }));
        snout.position.set(0, 1.9, 0.5); g.add(snout);
        const earGeo = new THREE.ConeGeometry(0.08, 0.2, 4);
        const earMat = new THREE.MeshLambertMaterial({ color: 0x4a4a4a });
        g.add(new THREE.Mesh(earGeo, earMat).translateX(-0.15).translateY(2.3).translateZ(0.1));
        g.add(new THREE.Mesh(earGeo, earMat).translateX(0.15).translateY(2.3).translateZ(0.1));
        const legGeo = new THREE.CylinderGeometry(0.075, 0.075, 0.9, 6);
        const legMat = new THREE.MeshLambertMaterial({ color: 0x3a3a3a });
        [[-0.2,0.45,0],[0.2,0.45,0]].forEach(p => { g.add(new THREE.Mesh(legGeo, legMat).translateX(p[0]).translateY(p[1]).translateZ(p[2])); });
        const armGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.7, 6);
        g.add(new THREE.Mesh(armGeo, legMat).translateX(-0.45).translateY(1.2));
        g.add(new THREE.Mesh(armGeo, legMat).translateX(0.45).translateY(1.2));
        return g;
      }
    },

    urso: {
      name: 'Urso', speed: 7, chaseSpeed: 14, points: 5, health: 220,
      attackDamage: 14, attackRange: 3, detectionRange: 18,
      hitRadius: 1.6, hitHeight: 1.0,
      createMesh() {
        const g = new THREE.Group();
        const furMat = new THREE.MeshLambertMaterial({ color: 0x3a1f05 });
        const darkMat = new THREE.MeshLambertMaterial({ color: 0x2a1503 });
        const lightMat = new THREE.MeshLambertMaterial({ color: 0x5a3a1a });
        const torso = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(1.25, 1.0, 1.15), furMat);
        torso.position.y = 1.1; torso.castShadow = true; g.add(torso);
        const hump = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.8, 0.55, 0.9), furMat);
        hump.position.set(0, 1.55, -0.35); g.add(hump);
        const chest = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.85, 0.8, 0.8), furMat);
        chest.position.set(0, 1.15, 0.6); chest.castShadow = true; g.add(chest);
        const belly = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.8, 0.4, 0.9), lightMat);
        belly.position.set(0, 0.75, 0.1); g.add(belly);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.55, 0.5, 0.55), furMat);
        head.position.set(0, 1.75, 1.0); g.add(head);
        const muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.3, 0.24, 0.3), lightMat);
        muzzle.position.set(0, 1.65, 1.38); g.add(muzzle);
        const nose = new THREE.Mesh(new THREE.SphereGeometry(0.07, 5, 4), new THREE.MeshLambertMaterial({ color: 0x0a0505 }));
        nose.position.set(0, 1.68, 1.56); g.add(nose);
        const eyeGeo = new THREE.SphereGeometry(0.055, 4, 4);
        const eyeMat = new THREE.MeshLambertMaterial({ color: 0x220000 });
        const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
        eyeL.position.set(-0.26, 1.88, 1.18); g.add(eyeL);
        const eyeR = eyeL.clone();
        eyeR.position.set(0.26, 1.88, 1.18); g.add(eyeR);
        const earGeo = new THREE.SphereGeometry(0.12, 5, 4);
        const earL = new THREE.Mesh(earGeo, darkMat);
        earL.position.set(-0.32, 2.2, 0.95); g.add(earL);
        const earR = earL.clone();
        earR.position.set(0.32, 2.2, 0.95); g.add(earR);
        const legGeo = new THREE.CylinderGeometry(0.24, 0.2, 0.85, 7);
        const legMat = new THREE.MeshLambertMaterial({ color: 0x2a1503 });
        const clawGeo = new THREE.ConeGeometry(0.045, 0.15, 4);
        const clawMat = new THREE.MeshLambertMaterial({ color: 0xe8e0cc });
        [[-0.45, 0.42, 0.55], [0.45, 0.42, 0.55], [-0.5, 0.42, -0.5], [0.5, 0.42, -0.5]].forEach(p => {
          const l = new THREE.Mesh(legGeo, legMat);
          l.position.set(...p);
          l.castShadow = true;
          g.add(l);
          for (let c = -1; c <= 1; c += 2) {
            const claw = new THREE.Mesh(clawGeo, clawMat);
            claw.position.set(p[0] + c * 0.14, 0.06, p[2]);
            claw.rotation.x = Math.PI;
            g.add(claw);
          }
        });
        const tail = new THREE.Mesh(new THREE.SphereGeometry(0.13, 5, 4), darkMat);
        tail.position.set(0, 1.05, -0.95); g.add(tail);
        return g;
      }
    },

    leao: {
      name: 'Leão', speed: 5, chaseSpeed: 12, points: 7, health: 100,
      attackDamage: 20, attackRange: 3, detectionRange: 20,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.7, 0.6, 1.2), new THREE.MeshLambertMaterial({ color: 0xc8a030 }));
        body.position.y = 0.9; body.castShadow = true; g.add(body);
        const mane = new THREE.Mesh(new THREE.SphereGeometry(0.45, 6, 5), new THREE.MeshLambertMaterial({ color: 0x8b4513 }));
        mane.position.set(0, 1.3, 0.4); g.add(mane);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 6, 5), new THREE.MeshLambertMaterial({ color: 0xc8a030 }));
        head.position.set(0, 1.3, 0.6); g.add(head);
        const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.8, 4), new THREE.MeshLambertMaterial({ color: 0xc8a030 }));
        tail.position.set(0, 0.9, -0.9); tail.rotation.x = 0.5; g.add(tail);
        const legGeo = new THREE.CylinderGeometry(0.075, 0.075, 0.5, 6);
        const legMat = new THREE.MeshLambertMaterial({ color: 0xb08020 });
        [[-0.25,0.35,0.4],[0.25,0.35,0.4],[-0.25,0.35,-0.4],[0.25,0.35,-0.4]].forEach(p => { g.add(new THREE.Mesh(legGeo, legMat).translateX(p[0]).translateY(p[1]).translateZ(p[2])); });
        return g;
      }
    },

    tigre: {
      name: 'Tigre', speed: 5, chaseSpeed: 13, points: 7, health: 100,
      attackDamage: 22, attackRange: 3, detectionRange: 20,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.6, 0.55, 1.3), new THREE.MeshLambertMaterial({ color: 0xe07010 }));
        body.position.y = 0.9; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 6, 5), new THREE.MeshLambertMaterial({ color: 0xe07010 }));
        head.position.set(0, 1.2, 0.6); g.add(head);
        const stripe1 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.62, 0.08, 0.1), new THREE.MeshLambertMaterial({ color: 0x1a1a1a }));
        stripe1.position.set(0, 1.0, 0.2); g.add(stripe1);
        const stripe2 = stripe1.clone(); stripe2.position.z = -0.1; g.add(stripe2);
        const stripe3 = stripe1.clone(); stripe3.position.z = -0.4; g.add(stripe3);
        const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.03, 0.9, 4), new THREE.MeshLambertMaterial({ color: 0xe07010 }));
        tail.position.set(0, 0.9, -0.9); tail.rotation.x = 0.6; g.add(tail);
        const legGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.5, 6);
        const legMat = new THREE.MeshLambertMaterial({ color: 0xc06000 });
        [[-0.2,0.35,0.4],[0.2,0.35,0.4],[-0.2,0.35,-0.4],[0.2,0.35,-0.4]].forEach(p => { g.add(new THREE.Mesh(legGeo, legMat).translateX(p[0]).translateY(p[1]).translateZ(p[2])); });
        return g;
      }
    },

    elefante: {
      name: 'Elefante', speed: 2, chaseSpeed: 5, points: 8, health: 200,
      attackDamage: 25, attackRange: 4, detectionRange: 14,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(1.4, 1.2, 1.8), new THREE.MeshLambertMaterial({ color: 0x7a7a7a }));
        body.position.y = 1.5; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 6, 5), new THREE.MeshLambertMaterial({ color: 0x8a8a8a }));
        head.position.set(0, 2.0, 0.9); g.add(head);
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.06, 1.0, 5), new THREE.MeshLambertMaterial({ color: 0x7a7a7a }));
        trunk.position.set(0, 1.4, 1.3); trunk.rotation.x = 0.3; g.add(trunk);
        const earGeo = new THREE.SphereGeometry(0.5, 8, 6).scale(0.05, 0.6, 0.5);
        const earMat = new THREE.MeshLambertMaterial({ color: 0x6a6a6a });
        g.add(new THREE.Mesh(earGeo, earMat).translateX(-0.55).translateY(2.0).translateZ(0.7));
        g.add(new THREE.Mesh(earGeo, earMat).translateX(0.55).translateY(2.0).translateZ(0.7));
        const legGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.0, 6);
        const legMat = new THREE.MeshLambertMaterial({ color: 0x6a6a6a });
        [[-0.45,0.5,0.5],[0.45,0.5,0.5],[-0.45,0.5,-0.5],[0.45,0.5,-0.5]].forEach(p => { g.add(new THREE.Mesh(legGeo, legMat).translateX(p[0]).translateY(p[1]).translateZ(p[2])); });
        return g;
      }
    },

    gorila: {
      name: 'Gorila', speed: 3, chaseSpeed: 7, points: 7, health: 140,
      attackDamage: 22, attackRange: 3, detectionRange: 16,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(1, 1, 0.8), new THREE.MeshLambertMaterial({ color: 0x2a2a2a }));
        body.position.y = 1.3; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.35, 6, 5), new THREE.MeshLambertMaterial({ color: 0x2a2a2a }));
        head.position.set(0, 2.1, 0.1); g.add(head);
        const face = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.25, 0.2, 0.1), new THREE.MeshLambertMaterial({ color: 0x1a1a1a }));
        face.position.set(0, 2.0, 0.35); g.add(face);
        const armGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.9, 6);
        const armMat = new THREE.MeshLambertMaterial({ color: 0x2a2a2a });
        g.add(new THREE.Mesh(armGeo, armMat).translateX(-0.6).translateY(1.0));
        g.add(new THREE.Mesh(armGeo, armMat).translateX(0.6).translateY(1.0));
        const legGeo = new THREE.CylinderGeometry(0.125, 0.125, 0.6, 6);
        [[-0.3,0.3,0],[0.3,0.3,0]].forEach(p => { g.add(new THREE.Mesh(legGeo, armMat).translateX(p[0]).translateY(p[1]).translateZ(p[2])); });
        return g;
      }
    },

    rinoceronte: {
      name: 'Rinoceronte', speed: 3, chaseSpeed: 8, points: 7, health: 180,
      attackDamage: 24, attackRange: 3.5, detectionRange: 12,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(1, 0.9, 1.6), new THREE.MeshLambertMaterial({ color: 0x6a6a6a }));
        body.position.y = 1.1; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.5, 0.5, 0.6), new THREE.MeshLambertMaterial({ color: 0x6a6a6a }));
        head.position.set(0, 1.2, 1.0); g.add(head);
        const horn = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.4, 5), new THREE.MeshLambertMaterial({ color: 0xccccaa }));
        horn.position.set(0, 1.6, 1.2); g.add(horn);
        const legGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.7, 6);
        const legMat = new THREE.MeshLambertMaterial({ color: 0x5a5a5a });
        [[-0.35,0.35,0.5],[0.35,0.35,0.5],[-0.35,0.35,-0.5],[0.35,0.35,-0.5]].forEach(p => { g.add(new THREE.Mesh(legGeo, legMat).translateX(p[0]).translateY(p[1]).translateZ(p[2])); });
        return g;
      }
    },

    hipopotamo: {
      name: 'Hipopótamo', speed: 2, chaseSpeed: 6, points: 7, health: 180,
      attackDamage: 22, attackRange: 3.5, detectionRange: 12,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(1.2, 0.9, 1.5), new THREE.MeshLambertMaterial({ color: 0x6a5a6a }));
        body.position.y = 1.0; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.6, 0.5, 0.7), new THREE.MeshLambertMaterial({ color: 0x7a6a7a }));
        head.position.set(0, 1.1, 0.9); g.add(head);
        const mouth = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.5, 0.3, 0.3), new THREE.MeshLambertMaterial({ color: 0x9a6a7a }));
        mouth.position.set(0, 0.9, 1.2); g.add(mouth);
        const legGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.6, 6);
        const legMat = new THREE.MeshLambertMaterial({ color: 0x5a4a5a });
        [[-0.4,0.3,0.4],[0.4,0.3,0.4],[-0.4,0.3,-0.4],[0.4,0.3,-0.4]].forEach(p => { g.add(new THREE.Mesh(legGeo, legMat).translateX(p[0]).translateY(p[1]).translateZ(p[2])); });
        return g;
      }
    },

    crocodilo: {
      name: 'Crocodilo', speed: 2, chaseSpeed: 7, points: 6, health: 100,
      attackDamage: 20, attackRange: 3.5, detectionRange: 14,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.6, 0.35, 2), new THREE.MeshLambertMaterial({ color: 0x3a5a2a }));
        body.position.y = 0.3; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.4, 0.25, 0.9), new THREE.MeshLambertMaterial({ color: 0x4a6a3a }));
        head.position.set(0, 0.3, 1.3); g.add(head);
        const tail = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.3, 0.2, 1.2), new THREE.MeshLambertMaterial({ color: 0x3a5a2a }));
        tail.position.set(0, 0.25, -1.5); g.add(tail);
        const legGeo = new THREE.CylinderGeometry(0.075, 0.075, 0.2, 6);
        const legMat = new THREE.MeshLambertMaterial({ color: 0x2a4a1a });
        [[-0.3,0.1,0.6],[0.3,0.1,0.6],[-0.3,0.1,-0.4],[0.3,0.1,-0.4]].forEach(p => { g.add(new THREE.Mesh(legGeo, legMat).translateX(p[0]).translateY(p[1]).translateZ(p[2])); });
        return g;
      }
    },

    tubarao: {
      name: 'Tubarão', speed: 4, chaseSpeed: 10, points: 7, health: 100,
      attackDamage: 22, attackRange: 3, detectionRange: 22,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.5, 0.4, 1.8), new THREE.MeshLambertMaterial({ color: 0x4a5a6a }));
        body.position.y = 0.5; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.6, 5), new THREE.MeshLambertMaterial({ color: 0x5a6a7a }));
        head.position.set(0, 0.5, 1.1); head.rotation.x = -Math.PI/2; g.add(head);
        const fin = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.05, 0.4, 0.3), new THREE.MeshLambertMaterial({ color: 0x4a5a6a }));
        fin.position.set(0, 0.9, 0); g.add(fin);
        const tailFin = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.05, 0.35, 0.25), new THREE.MeshLambertMaterial({ color: 0x4a5a6a }));
        tailFin.position.set(0, 0.7, -0.9); g.add(tailFin);
        return g;
      }
    },

    aguia: {
      name: 'Águia', speed: 5, chaseSpeed: 12, points: 6, health: 50,
      attackDamage: 14, attackRange: 3, detectionRange: 24,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.3, 0.25, 0.6), new THREE.MeshLambertMaterial({ color: 0x3a2a1a }));
        body.position.y = 3.5; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.15, 5, 4), new THREE.MeshLambertMaterial({ color: 0xffffff }));
        head.position.set(0, 3.7, 0.3); g.add(head);
        const beak = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.15, 4), new THREE.MeshLambertMaterial({ color: 0xddaa00 }));
        beak.position.set(0, 3.65, 0.45); beak.rotation.x = -Math.PI/2; g.add(beak);
        const wingGeo = new THREE.SphereGeometry(0.5, 8, 6).scale(0.8, 0.05, 0.4);
        const wingMat = new THREE.MeshLambertMaterial({ color: 0x3a2a1a });
        g.add(new THREE.Mesh(wingGeo, wingMat).translateX(-0.5).translateY(3.5));
        g.add(new THREE.Mesh(wingGeo, wingMat).translateX(0.5).translateY(3.5));
        return g;
      }
    },

    falcao: {
      name: 'Falcão', speed: 6, chaseSpeed: 14, points: 6, health: 40,
      attackDamage: 12, attackRange: 2.5, detectionRange: 26,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.2, 0.2, 0.5), new THREE.MeshLambertMaterial({ color: 0x5a4a3a }));
        body.position.y = 3.5; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 5, 4), new THREE.MeshLambertMaterial({ color: 0x4a3a2a }));
        head.position.set(0, 3.65, 0.25); g.add(head);
        const beak = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.1, 4), new THREE.MeshLambertMaterial({ color: 0x333333 }));
        beak.position.set(0, 3.6, 0.38); beak.rotation.x = -Math.PI/2; g.add(beak);
        const wingGeo = new THREE.SphereGeometry(0.5, 8, 6).scale(0.7, 0.04, 0.3);
        const wingMat = new THREE.MeshLambertMaterial({ color: 0x5a4a3a });
        g.add(new THREE.Mesh(wingGeo, wingMat).translateX(-0.45).translateY(3.5));
        g.add(new THREE.Mesh(wingGeo, wingMat).translateX(0.45).translateY(3.5));
        return g;
      }
    },

    lobo: {
      name: 'Lobo', speed: 11, chaseSpeed: 16, points: 3, health: 120,
      attackDamage: 10, attackRange: 2.5, detectionRange: 24,
      hitRadius: 1.3, hitHeight: 0.8,
      createMesh() {
        const g = new THREE.Group();
        const grayMat = new THREE.MeshLambertMaterial({ color: 0x8a9096 });
        const darkMat = new THREE.MeshLambertMaterial({ color: 0x565c62 });
        const bellyMat = new THREE.MeshLambertMaterial({ color: 0xd8dde2 });
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.55, 0.5, 0.95), grayMat);
        body.position.y = 0.75; body.castShadow = true; g.add(body);
        const chest = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.4, 0.35, 0.5), bellyMat);
        chest.position.set(0, 0.7, 0.55); g.add(chest);
        const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.17, 0.3, 6), grayMat);
        neck.position.set(0, 1.0, 0.6); neck.rotation.x = 0.2; g.add(neck);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.4, 0.33, 0.45), grayMat);
        head.position.set(0, 1.15, 0.85); g.add(head);
        const snout = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.2, 0.16, 0.35), grayMat);
        snout.position.set(0, 1.05, 1.25); g.add(snout);
        const nose = new THREE.Mesh(new THREE.SphereGeometry(0.04, 4, 3), new THREE.MeshLambertMaterial({ color: 0x101010 }));
        nose.position.set(0, 1.06, 1.44); g.add(nose);
        const eyeGeo = new THREE.SphereGeometry(0.045, 4, 4);
        const eyeMat = new THREE.MeshLambertMaterial({ color: 0xffdd33 });
        const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
        eyeL.position.set(-0.18, 1.26, 1.05); g.add(eyeL);
        const eyeR = eyeL.clone();
        eyeR.position.set(0.18, 1.26, 1.05); g.add(eyeR);
        const earGeo = new THREE.ConeGeometry(0.07, 0.22, 4);
        const earL = new THREE.Mesh(earGeo, darkMat);
        earL.position.set(-0.14, 1.45, 0.85); g.add(earL);
        const earR = earL.clone();
        earR.position.set(0.14, 1.45, 0.85); g.add(earR);
        const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.05, 0.7, 6), darkMat);
        tail.position.set(0, 0.85, -0.9); tail.rotation.x = -0.5; g.add(tail);
        const tailTip = new THREE.Mesh(new THREE.SphereGeometry(0.09, 5, 4), darkMat);
        tailTip.position.set(0, 0.6, -1.25); g.add(tailTip);
        const legGeo = new THREE.CylinderGeometry(0.06, 0.05, 0.55, 5);
        const legMat = new THREE.MeshLambertMaterial({ color: 0x565c62 });
        [[-0.18, 0.28, 0.4], [0.18, 0.28, 0.4], [-0.18, 0.28, -0.35], [0.18, 0.28, -0.35]].forEach(p => {
          const l = new THREE.Mesh(legGeo, legMat);
          l.position.set(...p);
          l.castShadow = true;
          g.add(l);
        });
        return g;
      }
    },

    raposa: {
      name: 'Raposa', speed: 5, chaseSpeed: 11, points: 4, health: 40,
      attackDamage: 8, attackRange: 2, detectionRange: 18,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.3, 0.3, 0.7), new THREE.MeshLambertMaterial({ color: 0xd06010 }));
        body.position.y = 0.6; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.25, 0.22, 0.3), new THREE.MeshLambertMaterial({ color: 0xd06010 }));
        head.position.set(0, 0.75, 0.45); g.add(head);
        const nose = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.1, 6).rotateX(Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0x111111 }));
        nose.position.set(0, 0.72, 0.62); g.add(nose);
        const tail = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.15, 0.15, 0.5), new THREE.MeshLambertMaterial({ color: 0xffffff }));
        tail.position.set(0, 0.7, -0.6); g.add(tail);
        const earGeo = new THREE.ConeGeometry(0.05, 0.15, 4);
        const earMat = new THREE.MeshLambertMaterial({ color: 0xd06010 });
        g.add(new THREE.Mesh(earGeo, earMat).translateX(-0.08).translateY(0.95).translateZ(0.4));
        g.add(new THREE.Mesh(earGeo, earMat).translateX(0.08).translateY(0.95).translateZ(0.4));
        return g;
      }
    },

    coiote: {
      name: 'Coiote', speed: 5, chaseSpeed: 10, points: 4, health: 50,
      attackDamage: 10, attackRange: 2.5, detectionRange: 18,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.35, 0.35, 0.8), new THREE.MeshLambertMaterial({ color: 0x8a7a5a }));
        body.position.y = 0.65; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.25, 0.25, 0.3), new THREE.MeshLambertMaterial({ color: 0x9a8a6a }));
        head.position.set(0, 0.8, 0.5); g.add(head);
        const snout = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.18, 6).rotateX(Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0x7a6a4a }));
        snout.position.set(0, 0.75, 0.68); g.add(snout);
        const earGeo = new THREE.ConeGeometry(0.05, 0.14, 4);
        const earMat = new THREE.MeshLambertMaterial({ color: 0x9a8a6a });
        g.add(new THREE.Mesh(earGeo, earMat).translateX(-0.09).translateY(1.0).translateZ(0.45));
        g.add(new THREE.Mesh(earGeo, earMat).translateX(0.09).translateY(1.0).translateZ(0.45));
        const legGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.35, 6);
        const legMat = new THREE.MeshLambertMaterial({ color: 0x7a6a4a });
        [[-0.12,0.28,0.25],[0.12,0.28,0.25],[-0.12,0.28,-0.25],[0.12,0.28,-0.25]].forEach(p => { g.add(new THREE.Mesh(legGeo, legMat).translateX(p[0]).translateY(p[1]).translateZ(p[2])); });
        return g;
      }
    },

    hiena: {
      name: 'Hiena', speed: 4, chaseSpeed: 10, points: 5, health: 70,
      attackDamage: 14, attackRange: 2.5, detectionRange: 18,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.4, 0.4, 0.9), new THREE.MeshLambertMaterial({ color: 0x8a7a4a }));
        body.position.y = 0.75; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.3, 0.28, 0.35), new THREE.MeshLambertMaterial({ color: 0x7a6a3a }));
        head.position.set(0, 0.9, 0.5); g.add(head);
        const mane = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.15, 0.2, 0.5), new THREE.MeshLambertMaterial({ color: 0x3a3a2a }));
        mane.position.set(0, 1.0, 0.1); g.add(mane);
        const earGeo = new THREE.SphereGeometry(0.06, 4, 3);
        const earMat = new THREE.MeshLambertMaterial({ color: 0x3a3a2a });
        g.add(new THREE.Mesh(earGeo, earMat).translateX(-0.12).translateY(1.1).translateZ(0.5));
        g.add(new THREE.Mesh(earGeo, earMat).translateX(0.12).translateY(1.1).translateZ(0.5));
        const legGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.4, 6);
        const legMat = new THREE.MeshLambertMaterial({ color: 0x6a5a3a });
        [[-0.13,0.3,0.3],[0.13,0.3,0.3],[-0.13,0.3,-0.3],[0.13,0.3,-0.3]].forEach(p => { g.add(new THREE.Mesh(legGeo, legMat).translateX(p[0]).translateY(p[1]).translateZ(p[2])); });
        return g;
      }
    },

    leopardo: {
      name: 'Leopardo', speed: 5, chaseSpeed: 12, points: 6, health: 80,
      attackDamage: 16, attackRange: 2.5, detectionRange: 20,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.4, 0.35, 1), new THREE.MeshLambertMaterial({ color: 0xd0a030 }));
        body.position.y = 0.75; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 5, 4), new THREE.MeshLambertMaterial({ color: 0xd0a030 }));
        head.position.set(0, 0.9, 0.5); g.add(head);
        const spot1 = new THREE.Mesh(new THREE.SphereGeometry(0.04, 3, 3), new THREE.MeshLambertMaterial({ color: 0x2a2a0a }));
        spot1.position.set(0.15, 0.8, 0.2); g.add(spot1);
        const spot2 = spot1.clone(); spot2.position.set(-0.1, 0.85, -0.1); g.add(spot2);
        const spot3 = spot1.clone(); spot3.position.set(0.1, 0.8, -0.3); g.add(spot3);
        const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.03, 0.8, 4), new THREE.MeshLambertMaterial({ color: 0xd0a030 }));
        tail.position.set(0, 0.8, -0.8); tail.rotation.x = 0.4; g.add(tail);
        const legGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.4, 6);
        const legMat = new THREE.MeshLambertMaterial({ color: 0xb08020 });
        [[-0.13,0.3,0.3],[0.13,0.3,0.3],[-0.13,0.3,-0.3],[0.13,0.3,-0.3]].forEach(p => { g.add(new THREE.Mesh(legGeo, legMat).translateX(p[0]).translateY(p[1]).translateZ(p[2])); });
        return g;
      }
    },

    pantera: {
      name: 'Pantera', speed: 5, chaseSpeed: 13, points: 6, health: 80,
      attackDamage: 18, attackRange: 2.5, detectionRange: 20,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.4, 0.35, 1), new THREE.MeshLambertMaterial({ color: 0x1a1a1a }));
        body.position.y = 0.75; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 5, 4), new THREE.MeshLambertMaterial({ color: 0x1a1a1a }));
        head.position.set(0, 0.9, 0.5); g.add(head);
        const eyeGeo = new THREE.SphereGeometry(0.03, 3, 3);
        const eyeMat = new THREE.MeshLambertMaterial({ color: 0x44ff44 });
        g.add(new THREE.Mesh(eyeGeo, eyeMat).translateX(-0.08).translateY(0.93).translateZ(0.65));
        g.add(new THREE.Mesh(eyeGeo, eyeMat).translateX(0.08).translateY(0.93).translateZ(0.65));
        const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.03, 0.9, 4), new THREE.MeshLambertMaterial({ color: 0x1a1a1a }));
        tail.position.set(0, 0.8, -0.8); tail.rotation.x = 0.5; g.add(tail);
        const legGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.4, 6);
        const legMat = new THREE.MeshLambertMaterial({ color: 0x0a0a0a });
        [[-0.13,0.3,0.3],[0.13,0.3,0.3],[-0.13,0.3,-0.3],[0.13,0.3,-0.3]].forEach(p => { g.add(new THREE.Mesh(legGeo, legMat).translateX(p[0]).translateY(p[1]).translateZ(p[2])); });
        return g;
      }
    },

    bufalo: {
      name: 'Búfalo', speed: 3, chaseSpeed: 8, points: 6, health: 150,
      attackDamage: 20, attackRange: 3.5, detectionRange: 14,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(1, 0.8, 1.4), new THREE.MeshLambertMaterial({ color: 0x2a2a2a }));
        body.position.y = 1.1; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.5, 0.5, 0.5), new THREE.MeshLambertMaterial({ color: 0x2a2a2a }));
        head.position.set(0, 1.2, 0.8); g.add(head);
        const hornGeo = new THREE.CylinderGeometry(0.04, 0.03, 0.4, 4);
        const hornMat = new THREE.MeshLambertMaterial({ color: 0x8a8a6a });
        g.add(new THREE.Mesh(hornGeo, hornMat).translateX(-0.3).translateY(1.5).translateZ(0.8).rotateZ(0.4));
        g.add(new THREE.Mesh(hornGeo, hornMat).translateX(0.3).translateY(1.5).translateZ(0.8).rotateZ(-0.4));
        const legGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.7, 5);
        const legMat = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
        [[-0.35,0.35,0.4],[0.35,0.35,0.4],[-0.35,0.35,-0.4],[0.35,0.35,-0.4]].forEach(p => { g.add(new THREE.Mesh(legGeo, legMat).translateX(p[0]).translateY(p[1]).translateZ(p[2])); });
        return g;
      }
    },

    bisonte: {
      name: 'Bisonte', speed: 3, chaseSpeed: 8, points: 6, health: 160,
      attackDamage: 20, attackRange: 3.5, detectionRange: 14,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(1, 0.9, 1.4), new THREE.MeshLambertMaterial({ color: 0x3a2a1a }));
        body.position.y = 1.2; body.castShadow = true; g.add(body);
        const hump = new THREE.Mesh(new THREE.SphereGeometry(0.4, 5, 4), new THREE.MeshLambertMaterial({ color: 0x4a3a2a }));
        hump.position.set(0, 1.8, 0.3); g.add(hump);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.5, 0.5, 0.4), new THREE.MeshLambertMaterial({ color: 0x3a2a1a }));
        head.position.set(0, 1.1, 0.8); g.add(head);
        const hornGeo = new THREE.ConeGeometry(0.04, 0.2, 4);
        const hornMat = new THREE.MeshLambertMaterial({ color: 0x8a8a6a });
        g.add(new THREE.Mesh(hornGeo, hornMat).translateX(-0.25).translateY(1.4).translateZ(0.8));
        g.add(new THREE.Mesh(hornGeo, hornMat).translateX(0.25).translateY(1.4).translateZ(0.8));
        const legGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.7, 5);
        const legMat = new THREE.MeshLambertMaterial({ color: 0x2a1a0a });
        [[-0.35,0.35,0.4],[0.35,0.35,0.4],[-0.35,0.35,-0.4],[0.35,0.35,-0.4]].forEach(p => { g.add(new THREE.Mesh(legGeo, legMat).translateX(p[0]).translateY(p[1]).translateZ(p[2])); });
        return g;
      }
    },

    javali: {
      name: 'Javali', speed: 4, chaseSpeed: 9, points: 5, health: 80,
      attackDamage: 14, attackRange: 2.5, detectionRange: 14,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.5, 0.45, 0.9), new THREE.MeshLambertMaterial({ color: 0x4a3a2a }));
        body.position.y = 0.6; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.35, 0.35, 0.4), new THREE.MeshLambertMaterial({ color: 0x5a4a3a }));
        head.position.set(0, 0.65, 0.55); g.add(head);
        const tuskGeo = new THREE.ConeGeometry(0.02, 0.12, 3);
        const tuskMat = new THREE.MeshLambertMaterial({ color: 0xeeeecc });
        g.add(new THREE.Mesh(tuskGeo, tuskMat).translateX(-0.12).translateY(0.55).translateZ(0.75));
        g.add(new THREE.Mesh(tuskGeo, tuskMat).translateX(0.12).translateY(0.55).translateZ(0.75));
        const legGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 6);
        const legMat = new THREE.MeshLambertMaterial({ color: 0x3a2a1a });
        [[-0.15,0.2,0.25],[0.15,0.2,0.25],[-0.15,0.2,-0.25],[0.15,0.2,-0.25]].forEach(p => { g.add(new THREE.Mesh(legGeo, legMat).translateX(p[0]).translateY(p[1]).translateZ(p[2])); });
        return g;
      }
    },

    alce: {
      name: 'Alce', speed: 3, chaseSpeed: 8, points: 6, health: 130,
      attackDamage: 16, attackRange: 3.5, detectionRange: 16,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.7, 0.7, 1.2), new THREE.MeshLambertMaterial({ color: 0x4a3a1a }));
        body.position.y = 1.3; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.3, 0.4, 0.35), new THREE.MeshLambertMaterial({ color: 0x5a4a2a }));
        head.position.set(0, 1.9, 0.5); g.add(head);
        const antlerGeo = new THREE.SphereGeometry(0.5, 8, 6).scale(0.5, 0.05, 0.3);
        const antlerMat = new THREE.MeshLambertMaterial({ color: 0x8a7a4a });
        g.add(new THREE.Mesh(antlerGeo, antlerMat).translateX(-0.2).translateY(2.2).translateZ(0.5));
        g.add(new THREE.Mesh(antlerGeo, antlerMat).translateX(0.2).translateY(2.2).translateZ(0.5));
        const legGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.9, 5);
        const legMat = new THREE.MeshLambertMaterial({ color: 0x3a2a0a });
        [[-0.25,0.45,0.35],[0.25,0.45,0.35],[-0.25,0.45,-0.35],[0.25,0.45,-0.35]].forEach(p => { g.add(new THREE.Mesh(legGeo, legMat).translateX(p[0]).translateY(p[1]).translateZ(p[2])); });
        return g;
      }
    },

    rena: {
      name: 'Rena', speed: 4, chaseSpeed: 9, points: 5, health: 100,
      attackDamage: 12, attackRange: 3, detectionRange: 16,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.5, 0.5, 1), new THREE.MeshLambertMaterial({ color: 0x6a4a2a }));
        body.position.y = 1.1; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.25, 0.3, 0.3), new THREE.MeshLambertMaterial({ color: 0x7a5a3a }));
        head.position.set(0, 1.5, 0.4); g.add(head);
        const antlerGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.35, 4);
        const antlerMat = new THREE.MeshLambertMaterial({ color: 0x9a8a5a });
        g.add(new THREE.Mesh(antlerGeo, antlerMat).translateX(-0.12).translateY(1.8).translateZ(0.4));
        g.add(new THREE.Mesh(antlerGeo, antlerMat).translateX(0.12).translateY(1.8).translateZ(0.4));
        const legGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.7, 5);
        const legMat = new THREE.MeshLambertMaterial({ color: 0x5a3a1a });
        [[-0.18,0.4,0.3],[0.18,0.4,0.3],[-0.18,0.4,-0.3],[0.18,0.4,-0.3]].forEach(p => { g.add(new THREE.Mesh(legGeo, legMat).translateX(p[0]).translateY(p[1]).translateZ(p[2])); });
        return g;
      }
    },

    camelo: {
      name: 'Camelo', speed: 3, chaseSpeed: 7, points: 5, health: 120,
      attackDamage: 12, attackRange: 3, detectionRange: 14,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.6, 0.6, 1.2), new THREE.MeshLambertMaterial({ color: 0xc8a060 }));
        body.position.y = 1.5; body.castShadow = true; g.add(body);
        const hump = new THREE.Mesh(new THREE.SphereGeometry(0.25, 5, 4), new THREE.MeshLambertMaterial({ color: 0xb89050 }));
        hump.position.set(0, 2.0, 0); g.add(hump);
        const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.7, 5), new THREE.MeshLambertMaterial({ color: 0xc8a060 }));
        neck.position.set(0, 2.0, 0.5); neck.rotation.x = -0.4; g.add(neck);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.2, 0.2, 0.3), new THREE.MeshLambertMaterial({ color: 0xc8a060 }));
        head.position.set(0, 2.4, 0.7); g.add(head);
        const legGeo = new THREE.CylinderGeometry(0.07, 0.07, 1.0, 5);
        const legMat = new THREE.MeshLambertMaterial({ color: 0xb08040 });
        [[-0.2,0.6,0.35],[0.2,0.6,0.35],[-0.2,0.6,-0.35],[0.2,0.6,-0.35]].forEach(p => { g.add(new THREE.Mesh(legGeo, legMat).translateX(p[0]).translateY(p[1]).translateZ(p[2])); });
        return g;
      }
    },

    girafa: {
      name: 'Girafa', speed: 3, chaseSpeed: 8, points: 6, health: 130,
      attackDamage: 14, attackRange: 4, detectionRange: 18,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.6, 0.5, 1), new THREE.MeshLambertMaterial({ color: 0xd0a040 }));
        body.position.y = 1.8; body.castShadow = true; g.add(body);
        const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 1.2, 5), new THREE.MeshLambertMaterial({ color: 0xd0a040 }));
        neck.position.set(0, 2.8, 0.3); g.add(neck);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.2, 0.2, 0.3), new THREE.MeshLambertMaterial({ color: 0xd0a040 }));
        head.position.set(0, 3.5, 0.3); g.add(head);
        const hornGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.15, 4);
        const hornMat = new THREE.MeshLambertMaterial({ color: 0x8a6a2a });
        g.add(new THREE.Mesh(hornGeo, hornMat).translateX(-0.06).translateY(3.7).translateZ(0.3));
        g.add(new THREE.Mesh(hornGeo, hornMat).translateX(0.06).translateY(3.7).translateZ(0.3));
        const legGeo = new THREE.CylinderGeometry(0.07, 0.07, 1.2, 5);
        const legMat = new THREE.MeshLambertMaterial({ color: 0xb08030 });
        [[-0.2,0.7,0.3],[0.2,0.7,0.3],[-0.2,0.7,-0.3],[0.2,0.7,-0.3]].forEach(p => { g.add(new THREE.Mesh(legGeo, legMat).translateX(p[0]).translateY(p[1]).translateZ(p[2])); });
        return g;
      }
    },

    zebra: {
      name: 'Zebra', speed: 4, chaseSpeed: 10, points: 4, health: 70,
      attackDamage: 10, attackRange: 2.5, detectionRange: 18,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.5, 0.45, 1), new THREE.MeshLambertMaterial({ color: 0xffffff }));
        body.position.y = 1.0; body.castShadow = true; g.add(body);
        const stripe1 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.52, 0.08, 0.1), new THREE.MeshLambertMaterial({ color: 0x111111 }));
        stripe1.position.set(0, 1.1, 0.3); g.add(stripe1);
        const stripe2 = stripe1.clone(); stripe2.position.z = 0; g.add(stripe2);
        const stripe3 = stripe1.clone(); stripe3.position.z = -0.3; g.add(stripe3);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.2, 0.25, 0.3), new THREE.MeshLambertMaterial({ color: 0xffffff }));
        head.position.set(0, 1.3, 0.55); g.add(head);
        const legGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.6, 5);
        const legMat = new THREE.MeshLambertMaterial({ color: 0xeeeeee });
        [[-0.18,0.4,0.3],[0.18,0.4,0.3],[-0.18,0.4,-0.3],[0.18,0.4,-0.3]].forEach(p => { g.add(new THREE.Mesh(legGeo, legMat).translateX(p[0]).translateY(p[1]).translateZ(p[2])); });
        return g;
      }
    },

    gnu: {
      name: 'Gnu', speed: 4, chaseSpeed: 9, points: 5, health: 90,
      attackDamage: 14, attackRange: 3, detectionRange: 14,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.6, 0.55, 1.1), new THREE.MeshLambertMaterial({ color: 0x3a3a3a }));
        body.position.y = 1.0; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.3, 0.35, 0.35), new THREE.MeshLambertMaterial({ color: 0x3a3a3a }));
        head.position.set(0, 1.1, 0.6); g.add(head);
        const hornGeo = new THREE.CylinderGeometry(0.03, 0.02, 0.25, 4);
        const hornMat = new THREE.MeshLambertMaterial({ color: 0x6a6a4a });
        g.add(new THREE.Mesh(hornGeo, hornMat).translateX(-0.12).translateY(1.4).translateZ(0.6).rotateZ(0.3));
        g.add(new THREE.Mesh(hornGeo, hornMat).translateX(0.12).translateY(1.4).translateZ(0.6).rotateZ(-0.3));
        const beard = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.1, 0.15, 0.08), new THREE.MeshLambertMaterial({ color: 0x2a2a2a }));
        beard.position.set(0, 0.9, 0.7); g.add(beard);
        const legGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.6, 5);
        const legMat = new THREE.MeshLambertMaterial({ color: 0x2a2a2a });
        [[-0.2,0.35,0.35],[0.2,0.35,0.35],[-0.2,0.35,-0.35],[0.2,0.35,-0.35]].forEach(p => { g.add(new THREE.Mesh(legGeo, legMat).translateX(p[0]).translateY(p[1]).translateZ(p[2])); });
        return g;
      }
    },

    antilope: {
      name: 'Antílope', speed: 5, chaseSpeed: 12, points: 4, health: 60,
      attackDamage: 8, attackRange: 2.5, detectionRange: 20,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.4, 0.4, 0.9), new THREE.MeshLambertMaterial({ color: 0xb08040 }));
        body.position.y = 1.0; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.2, 0.22, 0.25), new THREE.MeshLambertMaterial({ color: 0xb08040 }));
        head.position.set(0, 1.3, 0.45); g.add(head);
        const hornGeo = new THREE.CylinderGeometry(0.02, 0.015, 0.35, 4);
        const hornMat = new THREE.MeshLambertMaterial({ color: 0x4a4a3a });
        g.add(new THREE.Mesh(hornGeo, hornMat).translateX(-0.06).translateY(1.6).translateZ(0.45));
        g.add(new THREE.Mesh(hornGeo, hornMat).translateX(0.06).translateY(1.6).translateZ(0.45));
        const legGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.6, 5);
        const legMat = new THREE.MeshLambertMaterial({ color: 0x906030 });
        [[-0.13,0.4,0.25],[0.13,0.4,0.25],[-0.13,0.4,-0.25],[0.13,0.4,-0.25]].forEach(p => { g.add(new THREE.Mesh(legGeo, legMat).translateX(p[0]).translateY(p[1]).translateZ(p[2])); });
        return g;
      }
    },

    gazela: {
      name: 'Gazela', speed: 6, chaseSpeed: 14, points: 4, health: 40,
      attackDamage: 6, attackRange: 2, detectionRange: 22,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.35, 0.35, 0.8), new THREE.MeshLambertMaterial({ color: 0xc8a060 }));
        body.position.y = 0.9; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.18, 0.2, 0.22), new THREE.MeshLambertMaterial({ color: 0xc8a060 }));
        head.position.set(0, 1.2, 0.4); g.add(head);
        const hornGeo = new THREE.CylinderGeometry(0.015, 0.01, 0.3, 4);
        const hornMat = new THREE.MeshLambertMaterial({ color: 0x3a3a2a });
        g.add(new THREE.Mesh(hornGeo, hornMat).translateX(-0.05).translateY(1.45).translateZ(0.4));
        g.add(new THREE.Mesh(hornGeo, hornMat).translateX(0.05).translateY(1.45).translateZ(0.4));
        const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.55, 5);
        const legMat = new THREE.MeshLambertMaterial({ color: 0xa88040 });
        [[-0.1,0.35,0.25],[0.1,0.35,0.25],[-0.1,0.35,-0.25],[0.1,0.35,-0.25]].forEach(p => { g.add(new THREE.Mesh(legGeo, legMat).translateX(p[0]).translateY(p[1]).translateZ(p[2])); });
        return g;
      }
    },

    canguru: {
      name: 'Canguru', speed: 4, chaseSpeed: 10, points: 5, health: 80,
      attackDamage: 14, attackRange: 3, detectionRange: 16,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.5, 0.7, 0.5), new THREE.MeshLambertMaterial({ color: 0x8a6040 }));
        body.position.y = 1.2; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 5, 4), new THREE.MeshLambertMaterial({ color: 0x9a7050 }));
        head.position.set(0, 1.8, 0.1); g.add(head);
        const earGeo = new THREE.ConeGeometry(0.05, 0.18, 4);
        const earMat = new THREE.MeshLambertMaterial({ color: 0x9a7050 });
        g.add(new THREE.Mesh(earGeo, earMat).translateX(-0.1).translateY(2.05).translateZ(0.1));
        g.add(new THREE.Mesh(earGeo, earMat).translateX(0.1).translateY(2.05).translateZ(0.1));
        const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.04, 0.8, 5), new THREE.MeshLambertMaterial({ color: 0x8a6040 }));
        tail.position.set(0, 0.8, -0.5); tail.rotation.x = 0.8; g.add(tail);
        const legGeo = new THREE.CylinderGeometry(0.075, 0.075, 0.5, 6);
        const legMat = new THREE.MeshLambertMaterial({ color: 0x7a5030 });
        g.add(new THREE.Mesh(legGeo, legMat).translateX(-0.15).translateY(0.5));
        g.add(new THREE.Mesh(legGeo, legMat).translateX(0.15).translateY(0.5));
        return g;
      }
    },

    koala: {
      name: 'Koala', speed: 2, chaseSpeed: 4, points: 3, health: 35,
      attackDamage: 5, attackRange: 2, detectionRange: 10,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.3, 6, 5), new THREE.MeshLambertMaterial({ color: 0x7a7a7a }));
        body.position.y = 0.6; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 6, 5), new THREE.MeshLambertMaterial({ color: 0x7a7a7a }));
        head.position.set(0, 1.0, 0.1); g.add(head);
        const earGeo = new THREE.SphereGeometry(0.1, 5, 4);
        const earMat = new THREE.MeshLambertMaterial({ color: 0x9a9a9a });
        g.add(new THREE.Mesh(earGeo, earMat).translateX(-0.18).translateY(1.15));
        g.add(new THREE.Mesh(earGeo, earMat).translateX(0.18).translateY(1.15));
        const nose = new THREE.Mesh(new THREE.SphereGeometry(0.06, 4, 3), new THREE.MeshLambertMaterial({ color: 0x1a1a1a }));
        nose.position.set(0, 0.95, 0.25); g.add(nose);
        return g;
      }
    },

    ornitorrinco: {
      name: 'Ornitorrinco', speed: 3, chaseSpeed: 6, points: 4, health: 50,
      attackDamage: 8, attackRange: 2, detectionRange: 12,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.35, 0.25, 0.8), new THREE.MeshLambertMaterial({ color: 0x5a3a1a }));
        body.position.y = 0.3; body.castShadow = true; g.add(body);
        const bill = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.25, 0.06, 0.3), new THREE.MeshLambertMaterial({ color: 0x4a4a2a }));
        bill.position.set(0, 0.28, 0.55); g.add(bill);
        const tail = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.25, 0.06, 0.35), new THREE.MeshLambertMaterial({ color: 0x5a3a1a }));
        tail.position.set(0, 0.25, -0.55); g.add(tail);
        const legGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.08, 6);
        const legMat = new THREE.MeshLambertMaterial({ color: 0x4a4a2a });
        [[-0.15,0.1,0.2],[0.15,0.1,0.2],[-0.15,0.1,-0.2],[0.15,0.1,-0.2]].forEach(p => { g.add(new THREE.Mesh(legGeo, legMat).translateX(p[0]).translateY(p[1]).translateZ(p[2])); });
        return g;
      }
    },

    wombat: {
      name: 'Wombat', speed: 3, chaseSpeed: 5, points: 3, health: 50,
      attackDamage: 6, attackRange: 2, detectionRange: 10,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.4, 0.3, 0.6), new THREE.MeshLambertMaterial({ color: 0x5a4a3a }));
        body.position.y = 0.35; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 5, 4), new THREE.MeshLambertMaterial({ color: 0x5a4a3a }));
        head.position.set(0, 0.5, 0.3); g.add(head);
        const nose = new THREE.Mesh(new THREE.SphereGeometry(0.05, 3, 3), new THREE.MeshLambertMaterial({ color: 0x2a1a0a }));
        nose.position.set(0, 0.47, 0.45); g.add(nose);
        const legGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.15, 6);
        const legMat = new THREE.MeshLambertMaterial({ color: 0x4a3a2a });
        [[-0.13,0.1,0.15],[0.13,0.1,0.15],[-0.13,0.1,-0.15],[0.13,0.1,-0.15]].forEach(p => { g.add(new THREE.Mesh(legGeo, legMat).translateX(p[0]).translateY(p[1]).translateZ(p[2])); });
        return g;
      }
    },

    diabo_tasmania: {
      name: 'Diabo da Tasmânia', speed: 5, chaseSpeed: 10, points: 5, health: 60,
      attackDamage: 12, attackRange: 2, detectionRange: 14,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.35, 0.3, 0.5), new THREE.MeshLambertMaterial({ color: 0x1a1a1a }));
        body.position.y = 0.4; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 5, 4), new THREE.MeshLambertMaterial({ color: 0x1a1a1a }));
        head.position.set(0, 0.55, 0.25); g.add(head);
        const mouth = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.15, 0.08, 0.1), new THREE.MeshLambertMaterial({ color: 0xaa2020 }));
        mouth.position.set(0, 0.48, 0.4); g.add(mouth);
        const earGeo = new THREE.ConeGeometry(0.05, 0.1, 4);
        const earMat = new THREE.MeshLambertMaterial({ color: 0xaa3030 });
        g.add(new THREE.Mesh(earGeo, earMat).translateX(-0.1).translateY(0.72).translateZ(0.2));
        g.add(new THREE.Mesh(earGeo, earMat).translateX(0.1).translateY(0.72).translateZ(0.2));
        return g;
      }
    },

    dragao_komodo: {
      name: 'Dragão de Komodo', speed: 3, chaseSpeed: 7, points: 6, health: 100,
      attackDamage: 18, attackRange: 3, detectionRange: 14,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.5, 0.3, 1.4), new THREE.MeshLambertMaterial({ color: 0x4a5a3a }));
        body.position.y = 0.35; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.25, 0.2, 0.4), new THREE.MeshLambertMaterial({ color: 0x5a6a4a }));
        head.position.set(0, 0.35, 0.8); g.add(head);
        const tongue = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.03, 0.02, 0.15), new THREE.MeshLambertMaterial({ color: 0xdd3030 }));
        tongue.position.set(0, 0.32, 1.05); g.add(tongue);
        const tail = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.2, 0.15, 0.8), new THREE.MeshLambertMaterial({ color: 0x4a5a3a }));
        tail.position.set(0, 0.3, -1.0); g.add(tail);
        const legGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.18, 6);
        const legMat = new THREE.MeshLambertMaterial({ color: 0x3a4a2a });
        [[-0.25,0.12,0.4],[0.25,0.12,0.4],[-0.25,0.12,-0.3],[0.25,0.12,-0.3]].forEach(p => { g.add(new THREE.Mesh(legGeo, legMat).translateX(p[0]).translateY(p[1]).translateZ(p[2])); });
        return g;
      }
    },

    panda: {
      name: 'Panda', speed: 2, chaseSpeed: 5, points: 5, health: 100,
      attackDamage: 14, attackRange: 3, detectionRange: 12,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.7, 0.7, 0.8), new THREE.MeshLambertMaterial({ color: 0xffffff }));
        body.position.y = 0.9; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 6, 5), new THREE.MeshLambertMaterial({ color: 0xffffff }));
        head.position.set(0, 1.5, 0.2); g.add(head);
        const eyePatchGeo = new THREE.SphereGeometry(0.08, 4, 3);
        const eyePatchMat = new THREE.MeshLambertMaterial({ color: 0x111111 });
        g.add(new THREE.Mesh(eyePatchGeo, eyePatchMat).translateX(-0.12).translateY(1.55).translateZ(0.4));
        g.add(new THREE.Mesh(eyePatchGeo, eyePatchMat).translateX(0.12).translateY(1.55).translateZ(0.4));
        const legGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.5, 5);
        const legMat = new THREE.MeshLambertMaterial({ color: 0x111111 });
        [[-0.22,0.35,0.2],[0.22,0.35,0.2],[-0.22,0.35,-0.2],[0.22,0.35,-0.2]].forEach(p => { g.add(new THREE.Mesh(legGeo, legMat).translateX(p[0]).translateY(p[1]).translateZ(p[2])); });
        return g;
      }
    },

    urso_polar: {
      name: 'Urso Polar', speed: 3, chaseSpeed: 7, points: 7, health: 150,
      attackDamage: 20, attackRange: 3.5, detectionRange: 16,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(1, 0.9, 1.3), new THREE.MeshLambertMaterial({ color: 0xf0f0e8 }));
        body.position.y = 1.1; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.35, 6, 5), new THREE.MeshLambertMaterial({ color: 0xf0f0e8 }));
        head.position.set(0, 1.6, 0.5); g.add(head);
        const nose = new THREE.Mesh(new THREE.SphereGeometry(0.06, 4, 3), new THREE.MeshLambertMaterial({ color: 0x1a1a1a }));
        nose.position.set(0, 1.55, 0.82); g.add(nose);
        const earGeo = new THREE.SphereGeometry(0.08, 4, 3);
        const earMat = new THREE.MeshLambertMaterial({ color: 0xe0e0d8 });
        g.add(new THREE.Mesh(earGeo, earMat).translateX(-0.2).translateY(1.9).translateZ(0.4));
        g.add(new THREE.Mesh(earGeo, earMat).translateX(0.2).translateY(1.9).translateZ(0.4));
        const legGeo = new THREE.CylinderGeometry(0.125, 0.125, 0.6, 6);
        const legMat = new THREE.MeshLambertMaterial({ color: 0xe0e0d8 });
        [[-0.3,0.35,0.35],[0.3,0.35,0.35],[-0.3,0.35,-0.35],[0.3,0.35,-0.35]].forEach(p => { g.add(new THREE.Mesh(legGeo, legMat).translateX(p[0]).translateY(p[1]).translateZ(p[2])); });
        return g;
      }
    },

    morsa: {
      name: 'Morsa', speed: 2, chaseSpeed: 4, points: 5, health: 120,
      attackDamage: 14, attackRange: 3, detectionRange: 12,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.8, 0.6, 1.2), new THREE.MeshLambertMaterial({ color: 0x7a5a4a }));
        body.position.y = 0.5; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 6, 5), new THREE.MeshLambertMaterial({ color: 0x8a6a5a }));
        head.position.set(0, 0.8, 0.5); g.add(head);
        const tuskGeo = new THREE.CylinderGeometry(0.03, 0.02, 0.3, 4);
        const tuskMat = new THREE.MeshLambertMaterial({ color: 0xeeeecc });
        g.add(new THREE.Mesh(tuskGeo, tuskMat).translateX(-0.1).translateY(0.5).translateZ(0.7));
        g.add(new THREE.Mesh(tuskGeo, tuskMat).translateX(0.1).translateY(0.5).translateZ(0.7));
        const flipGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.06, 6);
        const flipMat = new THREE.MeshLambertMaterial({ color: 0x5a3a2a });
        g.add(new THREE.Mesh(flipGeo, flipMat).translateX(-0.4).translateY(0.2).translateZ(0.2));
        g.add(new THREE.Mesh(flipGeo, flipMat).translateX(0.4).translateY(0.2).translateZ(0.2));
        return g;
      }
    },

    foca: {
      name: 'Foca', speed: 3, chaseSpeed: 6, points: 3, health: 40,
      attackDamage: 6, attackRange: 2, detectionRange: 12,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.4, 0.3, 0.9), new THREE.MeshLambertMaterial({ color: 0x6a6a7a }));
        body.position.y = 0.3; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 5, 4), new THREE.MeshLambertMaterial({ color: 0x7a7a8a }));
        head.position.set(0, 0.4, 0.45); g.add(head);
        const nose = new THREE.Mesh(new THREE.SphereGeometry(0.04, 3, 3), new THREE.MeshLambertMaterial({ color: 0x1a1a1a }));
        nose.position.set(0, 0.4, 0.6); g.add(nose);
        const flipGeo = new THREE.CylinderGeometry(0.075, 0.075, 0.04, 6);
        const flipMat = new THREE.MeshLambertMaterial({ color: 0x5a5a6a });
        g.add(new THREE.Mesh(flipGeo, flipMat).translateX(-0.25).translateY(0.18).translateZ(0.1));
        g.add(new THREE.Mesh(flipGeo, flipMat).translateX(0.25).translateY(0.18).translateZ(0.1));
        return g;
      }
    },

    pinguim: {
      name: 'Pinguim', speed: 2, chaseSpeed: 4, points: 3, health: 35,
      attackDamage: 4, attackRange: 2, detectionRange: 10,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.3, 0.5, 0.25), new THREE.MeshLambertMaterial({ color: 0x1a1a1a }));
        body.position.y = 0.5; body.castShadow = true; g.add(body);
        const belly = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.2, 0.35, 0.1), new THREE.MeshLambertMaterial({ color: 0xffffff }));
        belly.position.set(0, 0.5, 0.1); g.add(belly);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.14, 5, 4), new THREE.MeshLambertMaterial({ color: 0x1a1a1a }));
        head.position.set(0, 0.9, 0); g.add(head);
        const beak = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.1, 4), new THREE.MeshLambertMaterial({ color: 0xdd8800 }));
        beak.position.set(0, 0.85, 0.15); beak.rotation.x = -Math.PI/2; g.add(beak);
        const wingGeo = new THREE.SphereGeometry(0.5, 8, 6).scale(0.06, 0.3, 0.12);
        const wingMat = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
        g.add(new THREE.Mesh(wingGeo, wingMat).translateX(-0.2).translateY(0.5));
        g.add(new THREE.Mesh(wingGeo, wingMat).translateX(0.2).translateY(0.5));
        return g;
      }
    },

    pelicano: {
      name: 'Pelicano', speed: 3, chaseSpeed: 7, points: 4, health: 45,
      attackDamage: 8, attackRange: 3, detectionRange: 16,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.35, 0.3, 0.5), new THREE.MeshLambertMaterial({ color: 0xffffff }));
        body.position.y = 0.8; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.14, 5, 4), new THREE.MeshLambertMaterial({ color: 0xffffff }));
        head.position.set(0, 1.1, 0.2); g.add(head);
        const beak = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.4, 6).rotateX(Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0xdd8800 }));
        beak.position.set(0, 1.0, 0.45); g.add(beak);
        const pouch = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.08, 0.08, 0.2), new THREE.MeshLambertMaterial({ color: 0xddaa40 }));
        pouch.position.set(0, 0.92, 0.45); g.add(pouch);
        const wingGeo = new THREE.SphereGeometry(0.5, 8, 6).scale(0.6, 0.04, 0.3);
        const wingMat = new THREE.MeshLambertMaterial({ color: 0xeeeeee });
        g.add(new THREE.Mesh(wingGeo, wingMat).translateX(-0.4).translateY(0.85));
        g.add(new THREE.Mesh(wingGeo, wingMat).translateX(0.4).translateY(0.85));
        return g;
      }
    },

    flamingo: {
      name: 'Flamingo', speed: 3, chaseSpeed: 6, points: 4, health: 40,
      attackDamage: 6, attackRange: 2.5, detectionRange: 16,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.2, 5, 4), new THREE.MeshLambertMaterial({ color: 0xff6688 }));
        body.position.y = 1.2; body.castShadow = true; g.add(body);
        const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.6, 5), new THREE.MeshLambertMaterial({ color: 0xff6688 }));
        neck.position.set(0, 1.7, 0.05); g.add(neck);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.1, 5, 4), new THREE.MeshLambertMaterial({ color: 0xff6688 }));
        head.position.set(0, 2.1, 0.05); g.add(head);
        const beak = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.12, 4), new THREE.MeshLambertMaterial({ color: 0x1a1a1a }));
        beak.position.set(0, 2.05, 0.15); beak.rotation.x = -Math.PI/2; g.add(beak);
        const legGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.8, 4);
        const legMat = new THREE.MeshLambertMaterial({ color: 0xff6688 });
        g.add(new THREE.Mesh(legGeo, legMat).translateX(-0.06).translateY(0.5));
        g.add(new THREE.Mesh(legGeo, legMat).translateX(0.06).translateY(0.5));
        return g;
      }
    },

    condor: {
      name: 'Condor', speed: 4, chaseSpeed: 9, points: 6, health: 60,
      attackDamage: 12, attackRange: 3, detectionRange: 24,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.35, 0.3, 0.6), new THREE.MeshLambertMaterial({ color: 0x1a1a1a }));
        body.position.y = 3.5; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 5, 4), new THREE.MeshLambertMaterial({ color: 0xaa3030 }));
        head.position.set(0, 3.7, 0.25); g.add(head);
        const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.13, 0.08, 6), new THREE.MeshLambertMaterial({ color: 0xffffff }));
        collar.position.set(0, 3.55, 0.2); g.add(collar);
        const wingGeo = new THREE.SphereGeometry(0.5, 8, 6).scale(1, 0.05, 0.4);
        const wingMat = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
        g.add(new THREE.Mesh(wingGeo, wingMat).translateX(-0.6).translateY(3.5));
        g.add(new THREE.Mesh(wingGeo, wingMat).translateX(0.6).translateY(3.5));
        return g;
      }
    },

    grifo: {
      name: 'Grifo', speed: 4, chaseSpeed: 11, points: 8, health: 140,
      attackDamage: 22, attackRange: 3.5, detectionRange: 24,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.7, 0.6, 1.2), new THREE.MeshLambertMaterial({ color: 0xc8a040 }));
        body.position.y = 3.5; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.25, 5, 4), new THREE.MeshLambertMaterial({ color: 0xffffff }));
        head.position.set(0, 4.0, 0.5); g.add(head);
        const beak = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.2, 4), new THREE.MeshLambertMaterial({ color: 0xddaa00 }));
        beak.position.set(0, 3.95, 0.72); beak.rotation.x = -Math.PI/2; g.add(beak);
        const wingGeo = new THREE.SphereGeometry(0.5, 8, 6).scale(1.2, 0.06, 0.5);
        const wingMat = new THREE.MeshLambertMaterial({ color: 0xc8a040 });
        g.add(new THREE.Mesh(wingGeo, wingMat).translateX(-0.7).translateY(3.6));
        g.add(new THREE.Mesh(wingGeo, wingMat).translateX(0.7).translateY(3.6));
        const legGeo = new THREE.CylinderGeometry(0.075, 0.075, 0.5, 6);
        const legMat = new THREE.MeshLambertMaterial({ color: 0xc8a040 });
        g.add(new THREE.Mesh(legGeo, legMat).translateX(-0.2).translateY(2.95));
        g.add(new THREE.Mesh(legGeo, legMat).translateX(0.2).translateY(2.95));
        return g;
      }
    },

    fenix: {
      name: 'Fênix', speed: 5, chaseSpeed: 12, points: 9, health: 120,
      attackDamage: 20, attackRange: 3, detectionRange: 26,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.4, 0.35, 0.7), new THREE.MeshLambertMaterial({ color: 0xff4400 }));
        body.position.y = 3.5; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 5, 4), new THREE.MeshLambertMaterial({ color: 0xffcc00 }));
        head.position.set(0, 3.8, 0.3); g.add(head);
        const crest = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.2, 4), new THREE.MeshLambertMaterial({ color: 0xff0000 }));
        crest.position.set(0, 4.0, 0.2); g.add(crest);
        const wingGeo = new THREE.SphereGeometry(0.5, 8, 6).scale(0.9, 0.05, 0.4);
        const wingMat = new THREE.MeshLambertMaterial({ color: 0xff6600 });
        g.add(new THREE.Mesh(wingGeo, wingMat).translateX(-0.5).translateY(3.5));
        g.add(new THREE.Mesh(wingGeo, wingMat).translateX(0.5).translateY(3.5));
        const tail = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.2, 0.1, 0.6), new THREE.MeshLambertMaterial({ color: 0xff2200 }));
        tail.position.set(0, 3.4, -0.6); g.add(tail);
        return g;
      }
    },

    basilisco: {
      name: 'Basilisco', speed: 3, chaseSpeed: 8, points: 8, health: 120,
      attackDamage: 20, attackRange: 4, detectionRange: 18,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.5, 0.4, 1.4), new THREE.MeshLambertMaterial({ color: 0x2a5a2a }));
        body.position.y = 0.5; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.3, 0.3, 0.35), new THREE.MeshLambertMaterial({ color: 0x3a6a3a }));
        head.position.set(0, 0.6, 0.8); g.add(head);
        const crest = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.25, 4), new THREE.MeshLambertMaterial({ color: 0xaa2020 }));
        crest.position.set(0, 0.9, 0.75); g.add(crest);
        const eyeGeo = new THREE.SphereGeometry(0.05, 4, 3);
        const eyeMat = new THREE.MeshLambertMaterial({ color: 0xffff00 });
        g.add(new THREE.Mesh(eyeGeo, eyeMat).translateX(-0.12).translateY(0.65).translateZ(0.95));
        g.add(new THREE.Mesh(eyeGeo, eyeMat).translateX(0.12).translateY(0.65).translateZ(0.95));
        const tail = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.2, 0.2, 0.8), new THREE.MeshLambertMaterial({ color: 0x2a5a2a }));
        tail.position.set(0, 0.4, -1.0); g.add(tail);
        return g;
      }
    },

    quimera: {
      name: 'Quimera', speed: 4, chaseSpeed: 10, points: 9, health: 160,
      attackDamage: 24, attackRange: 3.5, detectionRange: 20,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.7, 0.6, 1.2), new THREE.MeshLambertMaterial({ color: 0x8a5a2a }));
        body.position.y = 1.0; body.castShadow = true; g.add(body);
        const headLion = new THREE.Mesh(new THREE.SphereGeometry(0.25, 5, 4), new THREE.MeshLambertMaterial({ color: 0xc8a030 }));
        headLion.position.set(0, 1.5, 0.5); g.add(headLion);
        const headGoat = new THREE.Mesh(new THREE.SphereGeometry(0.15, 5, 4), new THREE.MeshLambertMaterial({ color: 0x7a7a7a }));
        headGoat.position.set(0, 1.7, 0); g.add(headGoat);
        const hornGeo = new THREE.ConeGeometry(0.03, 0.15, 4);
        const hornMat = new THREE.MeshLambertMaterial({ color: 0x4a4a3a });
        g.add(new THREE.Mesh(hornGeo, hornMat).translateX(-0.06).translateY(1.9));
        g.add(new THREE.Mesh(hornGeo, hornMat).translateX(0.06).translateY(1.9));
        const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.03, 0.8, 5), new THREE.MeshLambertMaterial({ color: 0x2a5a2a }));
        tail.position.set(0, 0.9, -0.8); tail.rotation.x = 0.5; g.add(tail);
        const legGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.5, 6);
        const legMat = new THREE.MeshLambertMaterial({ color: 0x7a4a1a });
        [[-0.25,0.35,0.35],[0.25,0.35,0.35],[-0.25,0.35,-0.35],[0.25,0.35,-0.35]].forEach(p => { g.add(new THREE.Mesh(legGeo, legMat).translateX(p[0]).translateY(p[1]).translateZ(p[2])); });
        return g;
      }
    },

    minotauro: {
      name: 'Minotauro', speed: 3, chaseSpeed: 8, points: 8, health: 160,
      attackDamage: 24, attackRange: 3.5, detectionRange: 16,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.8, 1, 0.6), new THREE.MeshLambertMaterial({ color: 0x5a3a1a }));
        body.position.y = 1.4; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.45, 0.4, 0.4), new THREE.MeshLambertMaterial({ color: 0x4a2a0a }));
        head.position.set(0, 2.2, 0.1); g.add(head);
        const hornGeo = new THREE.ConeGeometry(0.05, 0.3, 4);
        const hornMat = new THREE.MeshLambertMaterial({ color: 0xccccaa });
        g.add(new THREE.Mesh(hornGeo, hornMat).translateX(-0.2).translateY(2.5).rotateZ(0.3));
        g.add(new THREE.Mesh(hornGeo, hornMat).translateX(0.2).translateY(2.5).rotateZ(-0.3));
        const armGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 6);
        const armMat = new THREE.MeshLambertMaterial({ color: 0x5a3a1a });
        g.add(new THREE.Mesh(armGeo, armMat).translateX(-0.5).translateY(1.3));
        g.add(new THREE.Mesh(armGeo, armMat).translateX(0.5).translateY(1.3));
        const legGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 6);
        [[-0.25,0.4,0],[0.25,0.4,0]].forEach(p => { g.add(new THREE.Mesh(legGeo, armMat).translateX(p[0]).translateY(p[1]).translateZ(p[2])); });
        return g;
      }
    },

    ciclope: {
      name: 'Ciclope', speed: 2, chaseSpeed: 6, points: 8, health: 180,
      attackDamage: 26, attackRange: 4, detectionRange: 14,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(1, 1.4, 0.7), new THREE.MeshLambertMaterial({ color: 0x6a5a4a }));
        body.position.y = 1.6; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.4, 6, 5), new THREE.MeshLambertMaterial({ color: 0x7a6a5a }));
        head.position.set(0, 2.7, 0); g.add(head);
        const eye = new THREE.Mesh(new THREE.SphereGeometry(0.15, 5, 4), new THREE.MeshLambertMaterial({ color: 0xff4444 }));
        eye.position.set(0, 2.75, 0.35); g.add(eye);
        const armGeo = new THREE.CylinderGeometry(0.125, 0.125, 1, 6);
        const armMat = new THREE.MeshLambertMaterial({ color: 0x6a5a4a });
        g.add(new THREE.Mesh(armGeo, armMat).translateX(-0.6).translateY(1.5));
        g.add(new THREE.Mesh(armGeo, armMat).translateX(0.6).translateY(1.5));
        const legGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.9, 6);
        [[-0.3,0.45,0],[0.3,0.45,0]].forEach(p => { g.add(new THREE.Mesh(legGeo, armMat).translateX(p[0]).translateY(p[1]).translateZ(p[2])); });
        return g;
      }
    },

    hidra: {
      name: 'Hidra', speed: 3, chaseSpeed: 7, points: 9, health: 180,
      attackDamage: 22, attackRange: 4, detectionRange: 18,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.8, 0.6, 1), new THREE.MeshLambertMaterial({ color: 0x2a4a2a }));
        body.position.y = 0.7; body.castShadow = true; g.add(body);
        const neckGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.7, 5);
        const neckMat = new THREE.MeshLambertMaterial({ color: 0x3a5a3a });
        g.add(new THREE.Mesh(neckGeo, neckMat).translateX(-0.2).translateY(1.3).translateZ(0.3).rotateZ(0.2));
        g.add(new THREE.Mesh(neckGeo, neckMat).translateY(1.4).translateZ(0.3));
        g.add(new THREE.Mesh(neckGeo, neckMat).translateX(0.2).translateY(1.3).translateZ(0.3).rotateZ(-0.2));
        const headGeo = new THREE.SphereGeometry(0.12, 5, 4);
        const headMat = new THREE.MeshLambertMaterial({ color: 0x4a6a4a });
        g.add(new THREE.Mesh(headGeo, headMat).translateX(-0.3).translateY(1.7).translateZ(0.4));
        g.add(new THREE.Mesh(headGeo, headMat).translateY(1.8).translateZ(0.4));
        g.add(new THREE.Mesh(headGeo, headMat).translateX(0.3).translateY(1.7).translateZ(0.4));
        return g;
      }
    },

    cerberus: {
      name: 'Cerberus', speed: 4, chaseSpeed: 10, points: 9, health: 160,
      attackDamage: 24, attackRange: 3.5, detectionRange: 20,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.7, 0.6, 1), new THREE.MeshLambertMaterial({ color: 0x2a1a1a }));
        body.position.y = 0.9; body.castShadow = true; g.add(body);
        const headGeo = new THREE.SphereGeometry(0.2, 5, 4);
        const headMat = new THREE.MeshLambertMaterial({ color: 0x3a2a2a });
        g.add(new THREE.Mesh(headGeo, headMat).translateX(-0.25).translateY(1.3).translateZ(0.4));
        g.add(new THREE.Mesh(headGeo, headMat).translateY(1.4).translateZ(0.5));
        g.add(new THREE.Mesh(headGeo, headMat).translateX(0.25).translateY(1.3).translateZ(0.4));
        const eyeGeo = new THREE.SphereGeometry(0.04, 3, 3);
        const eyeMat = new THREE.MeshLambertMaterial({ color: 0xff2200 });
        g.add(new THREE.Mesh(eyeGeo, eyeMat).translateX(-0.25).translateY(1.35).translateZ(0.58));
        g.add(new THREE.Mesh(eyeGeo, eyeMat).translateY(1.45).translateZ(0.68));
        g.add(new THREE.Mesh(eyeGeo, eyeMat).translateX(0.25).translateY(1.35).translateZ(0.58));
        const legGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.5, 6);
        const legMat = new THREE.MeshLambertMaterial({ color: 0x2a1a1a });
        [[-0.2,0.35,0.3],[0.2,0.35,0.3],[-0.2,0.35,-0.3],[0.2,0.35,-0.3]].forEach(p => { g.add(new THREE.Mesh(legGeo, legMat).translateX(p[0]).translateY(p[1]).translateZ(p[2])); });
        return g;
      }
    },

    kraken: {
      name: 'Kraken', speed: 2, chaseSpeed: 6, points: 9, health: 200,
      attackDamage: 26, attackRange: 5, detectionRange: 16,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 6, 5), new THREE.MeshLambertMaterial({ color: 0x3a2a4a }));
        body.position.y = 0.8; body.castShadow = true; g.add(body);
        const eyeGeo = new THREE.SphereGeometry(0.1, 4, 3);
        const eyeMat = new THREE.MeshLambertMaterial({ color: 0xffff00 });
        g.add(new THREE.Mesh(eyeGeo, eyeMat).translateX(-0.2).translateY(0.9).translateZ(0.4));
        g.add(new THREE.Mesh(eyeGeo, eyeMat).translateX(0.2).translateY(0.9).translateZ(0.4));
        const tentGeo = new THREE.CylinderGeometry(0.06, 0.03, 0.8, 5);
        const tentMat = new THREE.MeshLambertMaterial({ color: 0x4a3a5a });
        g.add(new THREE.Mesh(tentGeo, tentMat).translateX(-0.3).translateY(0.2).rotateZ(0.3));
        g.add(new THREE.Mesh(tentGeo, tentMat).translateX(0.3).translateY(0.2).rotateZ(-0.3));
        g.add(new THREE.Mesh(tentGeo, tentMat).translateX(-0.15).translateY(0.15).translateZ(0.2).rotateZ(0.15));
        g.add(new THREE.Mesh(tentGeo, tentMat).translateX(0.15).translateY(0.15).translateZ(0.2).rotateZ(-0.15));
        return g;
      }
    },

    golem: {
      name: 'Golem', speed: 2, chaseSpeed: 4, points: 8, health: 200,
      attackDamage: 28, attackRange: 3.5, detectionRange: 10,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(1, 1.2, 0.7), new THREE.MeshLambertMaterial({ color: 0x6a6a5a }));
        body.position.y = 1.4; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.5, 0.4, 0.4), new THREE.MeshLambertMaterial({ color: 0x7a7a6a }));
        head.position.set(0, 2.3, 0); g.add(head);
        const eyeGeo = new THREE.SphereGeometry(0.06, 4, 3);
        const eyeMat = new THREE.MeshLambertMaterial({ color: 0x44ff44 });
        g.add(new THREE.Mesh(eyeGeo, eyeMat).translateX(-0.12).translateY(2.35).translateZ(0.2));
        g.add(new THREE.Mesh(eyeGeo, eyeMat).translateX(0.12).translateY(2.35).translateZ(0.2));
        const armGeo = new THREE.CylinderGeometry(0.15, 0.15, 1, 6);
        const armMat = new THREE.MeshLambertMaterial({ color: 0x5a5a4a });
        g.add(new THREE.Mesh(armGeo, armMat).translateX(-0.7).translateY(1.3));
        g.add(new THREE.Mesh(armGeo, armMat).translateX(0.7).translateY(1.3));
        const legGeo = new THREE.CylinderGeometry(0.175, 0.175, 0.8, 6);
        [[-0.3,0.4,0],[0.3,0.4,0]].forEach(p => { g.add(new THREE.Mesh(legGeo, armMat).translateX(p[0]).translateY(p[1]).translateZ(p[2])); });
        return g;
      }
    },

    troll: {
      name: 'Troll', speed: 3, chaseSpeed: 6, points: 7, health: 140,
      attackDamage: 20, attackRange: 3.5, detectionRange: 14,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.7, 1, 0.5), new THREE.MeshLambertMaterial({ color: 0x4a6a3a }));
        body.position.y = 1.3; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 5, 4), new THREE.MeshLambertMaterial({ color: 0x5a7a4a }));
        head.position.set(0, 2.1, 0); g.add(head);
        const nose = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.15, 4), new THREE.MeshLambertMaterial({ color: 0x4a6a3a }));
        nose.position.set(0, 2.0, 0.3); nose.rotation.x = -Math.PI/2; g.add(nose);
        const armGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.9, 6);
        const armMat = new THREE.MeshLambertMaterial({ color: 0x4a6a3a });
        g.add(new THREE.Mesh(armGeo, armMat).translateX(-0.5).translateY(1.2));
        g.add(new THREE.Mesh(armGeo, armMat).translateX(0.5).translateY(1.2));
        const legGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.7, 6);
        [[-0.2,0.4,0],[0.2,0.4,0]].forEach(p => { g.add(new THREE.Mesh(legGeo, armMat).translateX(p[0]).translateY(p[1]).translateZ(p[2])); });
        return g;
      }
    },

    ogro: {
      name: 'Ogro', speed: 2, chaseSpeed: 5, points: 7, health: 160,
      attackDamage: 22, attackRange: 4, detectionRange: 12,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.9, 1.1, 0.6), new THREE.MeshLambertMaterial({ color: 0x5a7a3a }));
        body.position.y = 1.4; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 5, 4), new THREE.MeshLambertMaterial({ color: 0x6a8a4a }));
        head.position.set(0, 2.2, 0); g.add(head);
        const mouth = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.2, 0.1, 0.1), new THREE.MeshLambertMaterial({ color: 0x3a1a1a }));
        mouth.position.set(0, 2.1, 0.28); g.add(mouth);
        const armGeo = new THREE.CylinderGeometry(0.125, 0.125, 0.9, 6);
        const armMat = new THREE.MeshLambertMaterial({ color: 0x5a7a3a });
        g.add(new THREE.Mesh(armGeo, armMat).translateX(-0.6).translateY(1.3));
        g.add(new THREE.Mesh(armGeo, armMat).translateX(0.6).translateY(1.3));
        const legGeo = new THREE.CylinderGeometry(0.125, 0.125, 0.8, 6);
        [[-0.25,0.4,0],[0.25,0.4,0]].forEach(p => { g.add(new THREE.Mesh(legGeo, armMat).translateX(p[0]).translateY(p[1]).translateZ(p[2])); });
        return g;
      }
    },

    vampiro: {
      name: 'Vampiro', speed: 5, chaseSpeed: 12, points: 7, health: 90,
      attackDamage: 18, attackRange: 2.5, detectionRange: 22,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.5, 0.9, 0.3), new THREE.MeshLambertMaterial({ color: 0x1a1a2a }));
        body.position.y = 1.2; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 5, 4), new THREE.MeshLambertMaterial({ color: 0xd0d0d0 }));
        head.position.set(0, 1.9, 0); g.add(head);
        const cape = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.7, 0.8, 0.1), new THREE.MeshLambertMaterial({ color: 0x3a0a0a }));
        cape.position.set(0, 1.2, -0.2); g.add(cape);
        const eyeGeo = new THREE.SphereGeometry(0.03, 3, 3);
        const eyeMat = new THREE.MeshLambertMaterial({ color: 0xff0000 });
        g.add(new THREE.Mesh(eyeGeo, eyeMat).translateX(-0.07).translateY(1.93).translateZ(0.18));
        g.add(new THREE.Mesh(eyeGeo, eyeMat).translateX(0.07).translateY(1.93).translateZ(0.18));
        const legGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.7, 6);
        const legMat = new THREE.MeshLambertMaterial({ color: 0x1a1a2a });
        g.add(new THREE.Mesh(legGeo, legMat).translateX(-0.12).translateY(0.5));
        g.add(new THREE.Mesh(legGeo, legMat).translateX(0.12).translateY(0.5));
        return g;
      }
    },

    zumbi: {
      name: 'Zumbi', speed: 2, chaseSpeed: 5, points: 5, health: 80,
      attackDamage: 14, attackRange: 2.5, detectionRange: 12,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.4, 0.8, 0.3), new THREE.MeshLambertMaterial({ color: 0x4a5a3a }));
        body.position.y = 1.1; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 5, 4), new THREE.MeshLambertMaterial({ color: 0x5a6a4a }));
        head.position.set(0, 1.7, 0); g.add(head);
        const armGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.6, 6);
        const armMat = new THREE.MeshLambertMaterial({ color: 0x4a5a3a });
        g.add(new THREE.Mesh(armGeo, armMat).translateX(-0.3).translateY(1.1).translateZ(0.15));
        g.add(new THREE.Mesh(armGeo, armMat).translateX(0.3).translateY(1.1).translateZ(0.15));
        const legGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.6, 6);
        g.add(new THREE.Mesh(legGeo, armMat).translateX(-0.12).translateY(0.4));
        g.add(new THREE.Mesh(legGeo, armMat).translateX(0.12).translateY(0.4));
        return g;
      }
    },

    esqueleto: {
      name: 'Esqueleto', speed: 4, chaseSpeed: 8, points: 5, health: 50,
      attackDamage: 12, attackRange: 2.5, detectionRange: 16,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.3, 0.7, 0.2), new THREE.MeshLambertMaterial({ color: 0xe8e8d8 }));
        body.position.y = 1.1; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 5, 4), new THREE.MeshLambertMaterial({ color: 0xe8e8d8 }));
        head.position.set(0, 1.7, 0); g.add(head);
        const eyeGeo = new THREE.SphereGeometry(0.04, 3, 3);
        const eyeMat = new THREE.MeshLambertMaterial({ color: 0x111111 });
        g.add(new THREE.Mesh(eyeGeo, eyeMat).translateX(-0.06).translateY(1.72).translateZ(0.14));
        g.add(new THREE.Mesh(eyeGeo, eyeMat).translateX(0.06).translateY(1.72).translateZ(0.14));
        const armGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.5, 6);
        const boneMat = new THREE.MeshLambertMaterial({ color: 0xe8e8d8 });
        g.add(new THREE.Mesh(armGeo, boneMat).translateX(-0.22).translateY(1.0));
        g.add(new THREE.Mesh(armGeo, boneMat).translateX(0.22).translateY(1.0));
        const legGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.6, 6);
        g.add(new THREE.Mesh(legGeo, boneMat).translateX(-0.08).translateY(0.4));
        g.add(new THREE.Mesh(legGeo, boneMat).translateX(0.08).translateY(0.4));
        return g;
      }
    },

    demonio: {
      name: 'Demônio', speed: 4, chaseSpeed: 11, points: 9, health: 140,
      attackDamage: 24, attackRange: 3, detectionRange: 20,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.6, 0.9, 0.4), new THREE.MeshLambertMaterial({ color: 0x8a1a1a }));
        body.position.y = 1.3; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.25, 5, 4), new THREE.MeshLambertMaterial({ color: 0xaa2a2a }));
        head.position.set(0, 2.0, 0); g.add(head);
        const hornGeo = new THREE.ConeGeometry(0.04, 0.25, 4);
        const hornMat = new THREE.MeshLambertMaterial({ color: 0x2a2a2a });
        g.add(new THREE.Mesh(hornGeo, hornMat).translateX(-0.12).translateY(2.3));
        g.add(new THREE.Mesh(hornGeo, hornMat).translateX(0.12).translateY(2.3));
        const wingGeo = new THREE.SphereGeometry(0.5, 8, 6).scale(0.5, 0.4, 0.05);
        const wingMat = new THREE.MeshLambertMaterial({ color: 0x4a0a0a });
        g.add(new THREE.Mesh(wingGeo, wingMat).translateX(-0.5).translateY(1.5).translateZ(-0.2));
        g.add(new THREE.Mesh(wingGeo, wingMat).translateX(0.5).translateY(1.5).translateZ(-0.2));
        const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.02, 0.6, 4), new THREE.MeshLambertMaterial({ color: 0x8a1a1a }));
        tail.position.set(0, 1.0, -0.3); tail.rotation.x = 0.5; g.add(tail);
        return g;
      }
    },

    anjo: {
      name: 'Anjo', speed: 4, chaseSpeed: 10, points: 8, health: 100,
      attackDamage: 16, attackRange: 3.5, detectionRange: 22,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.4, 0.9, 0.3), new THREE.MeshLambertMaterial({ color: 0xffffff }));
        body.position.y = 3.5; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 6, 5), new THREE.MeshLambertMaterial({ color: 0xffeedd }));
        head.position.set(0, 4.2, 0); g.add(head);
        const halo = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.04, 8), new THREE.MeshLambertMaterial({ color: 0xffdd44 }));
        halo.position.set(0, 4.5, 0); g.add(halo);
        const wingGeo = new THREE.SphereGeometry(0.5, 8, 6).scale(0.6, 0.6, 0.05);
        const wingMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
        g.add(new THREE.Mesh(wingGeo, wingMat).translateX(-0.5).translateY(3.7).translateZ(-0.15));
        g.add(new THREE.Mesh(wingGeo, wingMat).translateX(0.5).translateY(3.7).translateZ(-0.15));
        return g;
      }
    },

    centauro: {
      name: 'Centauro', speed: 5, chaseSpeed: 11, points: 8, health: 130,
      attackDamage: 20, attackRange: 3.5, detectionRange: 18,
      createMesh() {
        const g = new THREE.Group();
        const horseBody = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.6, 0.5, 1.2), new THREE.MeshLambertMaterial({ color: 0x7a5a3a }));
        horseBody.position.y = 1.0; horseBody.castShadow = true; g.add(horseBody);
        const torso = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.4, 0.7, 0.3), new THREE.MeshLambertMaterial({ color: 0xc8a080 }));
        torso.position.set(0, 1.7, 0.4); g.add(torso);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 5, 4), new THREE.MeshLambertMaterial({ color: 0xc8a080 }));
        head.position.set(0, 2.2, 0.4); g.add(head);
        const legGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.7, 5);
        const legMat = new THREE.MeshLambertMaterial({ color: 0x6a4a2a });
        [[-0.2,0.35,0.35],[0.2,0.35,0.35],[-0.2,0.35,-0.35],[0.2,0.35,-0.35]].forEach(p => { g.add(new THREE.Mesh(legGeo, legMat).translateX(p[0]).translateY(p[1]).translateZ(p[2])); });
        return g;
      }
    },

    pegasus: {
      name: 'Pégasus', speed: 5, chaseSpeed: 13, points: 8, health: 110,
      attackDamage: 16, attackRange: 3, detectionRange: 24,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.5, 0.45, 1), new THREE.MeshLambertMaterial({ color: 0xffffff }));
        body.position.y = 3.5; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.25, 0.3, 0.3), new THREE.MeshLambertMaterial({ color: 0xffffff }));
        head.position.set(0, 3.9, 0.5); g.add(head);
        const wingGeo = new THREE.SphereGeometry(0.5, 8, 6).scale(0.9, 0.06, 0.5);
        const wingMat = new THREE.MeshLambertMaterial({ color: 0xeeeeee });
        g.add(new THREE.Mesh(wingGeo, wingMat).translateX(-0.6).translateY(3.7));
        g.add(new THREE.Mesh(wingGeo, wingMat).translateX(0.6).translateY(3.7));
        const legGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 5);
        const legMat = new THREE.MeshLambertMaterial({ color: 0xeeeeee });
        [[-0.15,3.0,0.3],[0.15,3.0,0.3],[-0.15,3.0,-0.3],[0.15,3.0,-0.3]].forEach(p => { g.add(new THREE.Mesh(legGeo, legMat).translateX(p[0]).translateY(p[1]).translateZ(p[2])); });
        return g;
      }
    },

    unicornio: {
      name: 'Unicórnio', speed: 5, chaseSpeed: 12, points: 8, health: 110,
      attackDamage: 18, attackRange: 3, detectionRange: 20,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.5, 0.45, 1), new THREE.MeshLambertMaterial({ color: 0xffffff }));
        body.position.y = 1.0; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.25, 0.3, 0.3), new THREE.MeshLambertMaterial({ color: 0xffffff }));
        head.position.set(0, 1.4, 0.5); g.add(head);
        const horn = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.35, 5), new THREE.MeshLambertMaterial({ color: 0xffdd44 }));
        horn.position.set(0, 1.8, 0.55); g.add(horn);
        const mane = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.1, 0.3, 0.4), new THREE.MeshLambertMaterial({ color: 0xdd88ff }));
        mane.position.set(0, 1.4, 0.2); g.add(mane);
        const legGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.6, 5);
        const legMat = new THREE.MeshLambertMaterial({ color: 0xeeeeee });
        [[-0.15,0.4,0.3],[0.15,0.4,0.3],[-0.15,0.4,-0.3],[0.15,0.4,-0.3]].forEach(p => { g.add(new THREE.Mesh(legGeo, legMat).translateX(p[0]).translateY(p[1]).translateZ(p[2])); });
        return g;
      }
    },

    manticora: {
      name: 'Manticora', speed: 4, chaseSpeed: 10, points: 9, health: 150,
      attackDamage: 22, attackRange: 3.5, detectionRange: 20,
      createMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6).scale(0.7, 0.55, 1.2), new THREE.MeshLambertMaterial({ color: 0xc85030 }));
        body.position.y = 1.0; body.castShadow = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 5, 4), new THREE.MeshLambertMaterial({ color: 0xc8a080 }));
        head.position.set(0, 1.4, 0.5); g.add(head);
        const mane = new THREE.Mesh(new THREE.SphereGeometry(0.35, 5, 4), new THREE.MeshLambertMaterial({ color: 0x8a3010 }));
        mane.position.set(0, 1.4, 0.4); g.add(mane);
        const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.04, 0.9, 5), new THREE.MeshLambertMaterial({ color: 0xc85030 }));
        tail.position.set(0, 1.0, -0.9); tail.rotation.x = 0.4; g.add(tail);
        const tailTip = new THREE.Mesh(new THREE.SphereGeometry(0.1, 4, 3), new THREE.MeshLambertMaterial({ color: 0x4a2a1a }));
        tailTip.position.set(0, 1.2, -1.3); g.add(tailTip);
        const legGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.5, 6);
        const legMat = new THREE.MeshLambertMaterial({ color: 0xb04020 });
        [[-0.25,0.35,0.35],[0.25,0.35,0.35],[-0.25,0.35,-0.35],[0.25,0.35,-0.35]].forEach(p => { g.add(new THREE.Mesh(legGeo, legMat).translateX(p[0]).translateY(p[1]).translateZ(p[2])); });
        return g;
      }
    }
  };

  getSurfaceSettings() {
    if (AQUATIC_TYPES.has(this.type)) {
      return { roughness: 0.32, clearcoat: 0.7, clearcoatRoughness: 0.22 };
    }
    if (SCALED_TYPES.has(this.type)) {
      return { roughness: 0.52, clearcoat: 0.32, clearcoatRoughness: 0.38 };
    }
    if (FURRED_TYPES.has(this.type)) {
      return { roughness: 0.92, clearcoat: 0, clearcoatRoughness: 1 };
    }
    if (FLYING_TYPES.has(this.type)) {
      return { roughness: 0.76, clearcoat: 0.04, clearcoatRoughness: 0.8 };
    }
    return { roughness: 0.78, clearcoat: 0.05, clearcoatRoughness: 0.75 };
  }

  createRealisticMaterial(oldMaterial, surface, materialCache) {
    if (!oldMaterial) return oldMaterial;
    if (oldMaterial.userData?.isRealisticAnimalMaterial) return oldMaterial;
    if (materialCache.has(oldMaterial.uuid)) return materialCache.get(oldMaterial.uuid);

    const color = oldMaterial.color?.clone() || new THREE.Color(0xffffff);
    const common = {
      color,
      map: oldMaterial.map || null,
      alphaMap: oldMaterial.alphaMap || null,
      aoMap: oldMaterial.aoMap || null,
      normalMap: oldMaterial.normalMap || null,
      roughnessMap: oldMaterial.roughnessMap || null,
      metalnessMap: oldMaterial.metalnessMap || null,
      transparent: oldMaterial.transparent,
      opacity: oldMaterial.opacity,
      alphaTest: oldMaterial.alphaTest,
      side: oldMaterial.side,
      depthTest: oldMaterial.depthTest,
      depthWrite: oldMaterial.depthWrite,
      vertexColors: oldMaterial.vertexColors,
      roughness: surface.roughness,
      metalness: 0.01
    };

    const shouldUseClearcoat = AQUATIC_TYPES.has(this.type) || SCALED_TYPES.has(this.type);
    const material = shouldUseClearcoat
      ? new THREE.MeshPhysicalMaterial({
          ...common,
          clearcoat: surface.clearcoat,
          clearcoatRoughness: surface.clearcoatRoughness
        })
      : new THREE.MeshStandardMaterial(common);

    // Partes que eram MeshBasic continuam ligeiramente emissivas, como olhos e magia.
    if (oldMaterial.isMeshBasicMaterial) {
      material.emissive.copy(color).multiplyScalar(0.16);
      material.emissiveIntensity = 0.5;
    } else if (oldMaterial.emissive) {
      material.emissive.copy(oldMaterial.emissive);
      material.emissiveIntensity = oldMaterial.emissiveIntensity ?? 1;
    }

    material.name = `${oldMaterial.name || 'animal'}-realistic`;
    material.userData.isRealisticAnimalMaterial = true;
    material.needsUpdate = true;
    materialCache.set(oldMaterial.uuid, material);
    return material;
  }

  prepareRealisticMesh() {
    const surface = this.getSurfaceSettings();
    const materialCache = new Map();
    const meshes = [];

    this.mesh.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(this.mesh);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    this.mesh.traverse((child) => {
      if (!child.isMesh) return;

      child.castShadow = true;
      child.receiveShadow = true;

      if (child.geometry) {
        child.geometry.computeVertexNormals();
        child.geometry.normalizeNormals();
        child.geometry.computeBoundingBox();
      }

      child.material = Array.isArray(child.material)
        ? child.material.map((mat) => this.createRealisticMaterial(mat, surface, materialCache))
        : this.createRealisticMaterial(child.material, surface, materialCache);

      const geometrySize = new THREE.Vector3();
      child.geometry?.boundingBox?.getSize(geometrySize);
      geometrySize.set(
        Math.abs(geometrySize.x * child.scale.x),
        Math.abs(geometrySize.y * child.scale.y),
        Math.abs(geometrySize.z * child.scale.z)
      );

      const worldPosition = new THREE.Vector3();
      child.getWorldPosition(worldPosition);
      const localPosition = this.mesh.worldToLocal(worldPosition.clone());
      const volume = Math.max(0.000001, geometrySize.x * geometrySize.y * geometrySize.z);

      meshes.push({
        mesh: child,
        size: geometrySize,
        position: localPosition,
        volume,
        baseRotation: child.rotation.clone(),
        baseScale: child.scale.clone()
      });
    });

    const body = [...meshes].sort((a, b) => b.volume - a.volume)[0] || null;
    const head = meshes
      .filter((part) =>
        part !== body &&
        part.position.z > center.z + size.z * 0.1 &&
        part.position.y > box.min.y + size.y * 0.32
      )
      .sort((a, b) => b.volume - a.volume)[0] || null;

    const wings = FLYING_TYPES.has(this.type)
      ? meshes.filter((part) =>
          part !== body &&
          part.position.y > center.y - size.y * 0.22 &&
          part.position.z > center.z - size.z * 0.48 &&
          (
            Math.abs(part.position.x - center.x) > size.x * 0.18 ||
            part.size.x > part.size.y * 2.2
          )
        )
      : [];

    const legs = FLYING_TYPES.has(this.type)
      ? []
      : meshes.filter((part) =>
          part !== body &&
          part !== head &&
          part.position.y < center.y &&
          Math.abs(part.position.x - center.x) > size.x * 0.045 &&
          part.size.y > part.size.x * 1.25 &&
          Math.abs(part.position.z - center.z) < size.z * 0.48
        );

    const tails = meshes
      .filter((part) =>
        part !== body &&
        part !== head &&
        !wings.includes(part) &&
        !legs.includes(part) &&
        part.position.z < center.z - size.z * 0.2 &&
        Math.abs(part.position.x - center.x) < size.x * 0.38
      )
      .sort((a, b) => b.position.z - a.position.z);

    const state = { box, size, center, meshes, body, head, wings, legs, tails };
    this.addRealisticGroundShadow(state);
    this.addDorsalRidges(state, surface);
    return state;
  }

  addRealisticGroundShadow(state) {
    if (FLYING_TYPES.has(this.type) || AQUATIC_TYPES.has(this.type)) return;

    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(1, 32),
      new THREE.MeshBasicMaterial({
        color: 0x050505,
        transparent: true,
        opacity: 0.2,
        depthWrite: false,
        side: THREE.DoubleSide
      })
    );
    shadow.name = 'animal-contact-shadow';
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.set(state.center.x, state.box.min.y + 0.012, state.center.z);
    shadow.scale.set(
      Math.max(0.12, state.size.x * 0.5),
      Math.max(0.18, state.size.z * 0.43),
      1
    );
    shadow.castShadow = false;
    shadow.receiveShadow = false;
    shadow.renderOrder = -1;
    this.mesh.add(shadow);
  }

  addDorsalRidges(state, surface) {
    if (!DORSAL_RIDGE_TYPES.has(this.type)) return;

    const count = this.type === 'dinossauro' ? 7 : 5;
    const scale = Math.max(0.025, Math.min(state.size.x, state.size.y) * 0.075);
    const ridgeMat = new THREE.MeshPhysicalMaterial({
      color: 0x26351d,
      roughness: surface.roughness,
      clearcoat: surface.clearcoat,
      clearcoatRoughness: surface.clearcoatRoughness
    });

    for (let i = 0; i < count; i++) {
      const ridge = new THREE.Mesh(
        new THREE.ConeGeometry(scale * 0.7, scale * (1.35 - i * 0.08), 6),
        ridgeMat
      );
      ridge.name = 'dorsal-ridge';
      ridge.position.set(
        state.center.x,
        state.box.max.y + scale * 0.34,
        state.center.z + state.size.z * (0.25 - (i / Math.max(1, count - 1)) * 0.55)
      );
      ridge.castShadow = true;
      this.mesh.add(ridge);
    }
  }

  animateRealisticMesh(delta, movementSpeed) {
    const state = this.visualState;
    if (!state) return;

    const pace = THREE.MathUtils.clamp(movementSpeed / 3, 0.55, 3.4);
    const urgency = this.chasing ? 1.5 : 1;
    this.animationTime += delta * pace * urgency;

    const breath = Math.sin(this.animationTime * 2.1) * 0.014;
    if (state.body) {
      const { mesh, baseScale, baseRotation } = state.body;
      mesh.scale.set(
        baseScale.x * (1 - breath * 0.3),
        baseScale.y * (1 + breath),
        baseScale.z * (1 + breath * 0.45)
      );
      mesh.rotation.z = baseRotation.z;

      if (AQUATIC_TYPES.has(this.type)) {
        mesh.rotation.z += Math.sin(this.animationTime * 2.5) * 0.035;
      }
    }

    if (state.head) {
      state.head.mesh.rotation.x =
        state.head.baseRotation.x + Math.sin(this.animationTime * 1.7) * 0.028;
      state.head.mesh.rotation.y =
        state.head.baseRotation.y + Math.sin(this.animationTime * 1.15) * 0.018;
    }

    const gait = this.animationTime * 5.2;
    const legAmplitude = this.chasing ? 0.52 : 0.25;
    state.legs.forEach((part) => {
      const side = part.position.x >= state.center.x ? 1 : -1;
      const front = part.position.z >= state.center.z ? 1 : -1;
      const phase = side * front > 0 ? 0 : Math.PI;
      part.mesh.rotation.x = part.baseRotation.x + Math.sin(gait + phase) * legAmplitude;
    });

    state.tails.forEach((part, index) => {
      const amount = 0.035 + index * 0.025;
      part.mesh.rotation.y =
        part.baseRotation.y + Math.sin(this.animationTime * 2.4 - index * 0.45) * amount;
    });

    state.wings.forEach((part) => {
      const side = part.position.x >= state.center.x ? 1 : -1;
      const flap = 0.2 + Math.sin(this.animationTime * 7.2) * 0.3;
      part.mesh.rotation.z = part.baseRotation.z - side * flap;
    });
  }

  update(delta, playerPos) {
    if (!this.alive) return null;

    this.attackCooldown -= delta;
    const pos = this.mesh.position;
    const distToPlayer = pos.distanceTo(playerPos);

    if (distToPlayer < this.detectionRange) {
      this.chasing = true;
      const chaseDir = playerPos.clone().sub(pos).normalize();
      chaseDir.y = 0;
      this.wanderDir.copy(chaseDir);
    } else {
      this.chasing = false;
    }

    if (!this.chasing) {
      this.wanderTimer -= delta;
      if (this.wanderTimer <= 0) {
        this.wanderDir.set(Math.random() - 0.5, 0, Math.random() - 0.5).normalize();
        this.wanderTimer = 2 + Math.random() * 3;
      }
    }

    const speed = this.chasing ? this.chaseSpeed : this.speed;
    const nextX = pos.x + this.wanderDir.x * speed * delta;
    const nextZ = pos.z + this.wanderDir.z * speed * delta;

    if (this.arena && !this.arena.isPassable(nextX, nextZ)) {
      this.wanderDir.negate();
      this.wanderTimer = 0;
    } else {
      pos.x = nextX;
      pos.z = nextZ;
    }

    const angle = Math.atan2(this.wanderDir.x, this.wanderDir.z);
    this.mesh.rotation.y = angle;

    if (FLYING_TYPES.has(this.type)) {
      this.mesh.position.y = 2 + Math.sin(this.animationTime * 2.6) * 0.28;
    } else if (AQUATIC_TYPES.has(this.type)) {
      this.mesh.position.y = 0.28 + Math.sin(this.animationTime * 2.2) * 0.1;
    } else {
      this.mesh.position.y = Math.max(0, Math.sin(this.animationTime * 4.2) * 0.022);
    }

    this.animateRealisticMesh(delta, speed);

    if (distToPlayer < this.attackRange && this.attackCooldown <= 0) {
      this.attackCooldown = 6.0;
      this.spawnAttackHitbox();
      return this.attackDamage;
    }
    return null;
  }

  spawnAttackHitbox() {
    const pos = this.mesh.position.clone();
    const dir = new THREE.Vector3(
      Math.sin(this.mesh.rotation.y),
      0,
      Math.cos(this.mesh.rotation.y)
    );
    pos.add(dir.multiplyScalar(1.2));
    pos.y += 0.8;
    const geo = new THREE.SphereGeometry(0.6, 6, 4);
    const mat = new THREE.MeshBasicMaterial({ color: 0xff2200, transparent: true, opacity: 0.5 });
    const hitbox = new THREE.Mesh(geo, mat);
    hitbox.position.copy(pos);
    this.scene.add(hitbox);
    setTimeout(() => {
      this.scene.remove(hitbox);
      geo.dispose();
      mat.dispose();
    }, 300);
  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.die();
      return true;
    }
    this.spawnBloodSmall();
    return false;
  }

  die() {
    this.alive = false;
    Audio.animalScream();
    this.spawnBlood();
    this.dropMoney = 81 + Math.floor(Math.random() * 233);
    this.dropTokens = Math.random() < 0.02 ? 1 + Math.floor(Math.random() * 5) : 0;
    const deathPos = this.mesh.position.clone();
    const deathRot = this.mesh.rotation.y;
    this.mesh.scale.set(1, 0.1, 1);
    this.mesh.position.y = 0;
    setTimeout(() => {
      this.scene.remove(this.mesh);
      this.spawnSkeleton(deathPos, deathRot);
      this.spawnBBQ(deathPos);
    }, 1000);
  }

  getDropMoney() {
    const value = this.dropMoney;
    this.dropMoney = 0;
    return value;
  }

  getDropTokens() {
    const value = this.dropTokens;
    this.dropTokens = 0;
    return value;
  }

  spawnBBQ(pos) {
    const grill = new THREE.Group();
    const matIron = new THREE.MeshLambertMaterial({ color: 0x222222 });
    const matWood = new THREE.MeshLambertMaterial({ color: 0x6a4020 });
    const matCoal = new THREE.MeshBasicMaterial({ color: 0xff4400 });
    const matRoast = new THREE.MeshLambertMaterial({ color: 0x8a5a2a });
    const brazier = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.3, 0.35, 10, 1, true), matIron);
    brazier.position.y = 0.18;
    grill.add(brazier);
    const coals = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.06, 10), matCoal);
    coals.position.y = 0.35;
    grill.add(coals);
    for (let i = 0; i < 3; i++) {
      const log = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.7, 5), matWood);
      log.rotation.z = Math.PI / 2;
      log.rotation.y = (i * Math.PI) / 3;
      log.position.y = 0.1;
      grill.add(log);
    }
    const skewer = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.4, 5).rotateZ(Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0x999999 }));
    skewer.position.y = 0.75;
    grill.add(skewer);
    const roast = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 6).scale(1, 0.85, 1.3), matRoast);
    roast.position.y = 0.75;
    grill.add(roast);
    const roastHead = new THREE.Mesh(new THREE.SphereGeometry(0.13, 6, 5), matRoast);
    roastHead.position.set(0, 0.75, 0.42);
    grill.add(roastHead);
    const legRoast = new THREE.CylinderGeometry(0.035, 0.035, 0.3, 4);
    const legRR = new THREE.Mesh(legRoast, matRoast);
    legRR.position.set(0.2, 0.6, 0.1);
    legRR.rotation.z = 0.5;
    grill.add(legRR);
    const legRL = legRR.clone();
    legRL.position.set(-0.2, 0.6, 0.1);
    legRL.rotation.z = -0.5;
    grill.add(legRL);
    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.4, 6), new THREE.MeshBasicMaterial({ color: 0xff8800, transparent: true, opacity: 0.7 }));
    flame.position.y = 0.55;
    grill.add(flame);
    grill.position.set(pos.x, 0, pos.z);
    this.scene.add(grill);
    const embers = [];
    for (let i = 0; i < 12; i++) {
      const ember = new THREE.Mesh(new THREE.SphereGeometry(0.02, 3, 2), new THREE.MeshBasicMaterial({ color: 0xff5500, transparent: true }));
      ember.position.copy(grill.position).add(new THREE.Vector3((Math.random() - 0.5) * 0.4, 0.4 + Math.random() * 0.4, (Math.random() - 0.5) * 0.4));
      this.scene.add(ember);
      embers.push({ mesh: ember, vel: new THREE.Vector3((Math.random() - 0.5) * 1.2, 1.2 + Math.random() * 1.5, (Math.random() - 0.5) * 1.2), life: 0 });
    }
    const maxEmberLife = 1.6;
    const animateEmbers = () => {
      let alive = false;
      const dt = 0.016;
      for (const e of embers) {
        if (e.life >= maxEmberLife) continue;
        alive = true;
        e.life += dt;
        e.vel.y += 0.4 * dt;
        e.mesh.position.x += e.vel.x * dt;
        e.mesh.position.y += e.vel.y * dt;
        e.mesh.position.z += e.vel.z * dt;
        e.mesh.material.opacity = Math.max(0, 1 - e.life / maxEmberLife);
      }
      if (alive) requestAnimationFrame(animateEmbers);
      else for (const e of embers) { this.scene.remove(e.mesh); e.mesh.geometry.dispose(); e.mesh.material.dispose(); }
    };
    requestAnimationFrame(animateEmbers);
    setTimeout(() => {
      this.scene.remove(grill);
      grill.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      });
    }, 6000);
  }

  spawnSkeleton(pos, rot) {
    const skel = new THREE.Group();
    const boneMat = new THREE.MeshLambertMaterial({ color: 0xddddbb });
    const ribMat = new THREE.MeshLambertMaterial({ color: 0xccccaa });

    const large = ['jacare', 'anta', 'sucuri', 'onca', 'dinossauro', 'urso', 'pirarucu', 'jiboia', 'mapinguari', 'lobisomem'].includes(this.type);
    const small = ['tucano', 'arara', 'harpia', 'urubu', 'gaviao', 'coruja', 'sagui', 'micoleao'].includes(this.type);
    const scale = large ? 1.4 : small ? 0.5 : 1.0;

    const spine = new THREE.Mesh(new THREE.CylinderGeometry(0.03 * scale, 0.03 * scale, 1.2 * scale, 4), boneMat);
    spine.rotation.z = Math.PI / 2;
    skel.add(spine);

    const skull = new THREE.Mesh(new THREE.SphereGeometry(0.14 * scale, 5, 4), boneMat);
    skull.position.set(0, 0, 0.7 * scale);
    skull.scale.y = 0.6;
    skel.add(skull);

    const ribCount = large ? 5 : small ? 2 : 3;
    for (let i = 0; i < ribCount; i++) {
      const rib = new THREE.Mesh(new THREE.CylinderGeometry(0.012 * scale, 0.012 * scale, 0.4 * scale, 4), ribMat);
      rib.position.set(0, 0, -0.2 * scale + i * 0.25 * scale);
      rib.rotation.z = Math.PI / 2;
      rib.rotation.y = 0.3;
      skel.add(rib);
    }

    if (!small) {
      const legBone = new THREE.CylinderGeometry(0.015 * scale, 0.015 * scale, 0.35 * scale, 4);
      [[-0.25, 0, -0.3], [0.25, 0, -0.3], [-0.25, 0, 0.3], [0.25, 0, 0.3]].forEach(([lx, ly, lz]) => {
        const leg = new THREE.Mesh(legBone, boneMat);
        leg.position.set(lx * scale, ly, lz * scale);
        leg.rotation.z = Math.PI / 2 + (Math.random() - 0.5) * 0.5;
        skel.add(leg);
      });
    }

    skel.position.set(pos.x, 0.05, pos.z);
    skel.rotation.y = rot;
    this.scene.add(skel);
  }

  spawnBloodSmall() {
    const pos = this.mesh.position.clone();
    pos.y += 0.5;
    const bloodParticles = [];
    for (let i = 0; i < 8; i++) {
      const size = 0.05 + Math.random() * 0.08;
      const geo = new THREE.SphereGeometry(size / 2, 4, 3);
      const shade = 0.3 + Math.random() * 0.4;
      const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(shade, 0, 0) });
      const particle = new THREE.Mesh(geo, mat);
      particle.position.copy(pos);
      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 5,
        Math.random() * 4 + 1,
        (Math.random() - 0.5) * 5
      );
      this.scene.add(particle);
      bloodParticles.push({ mesh: particle, vel, life: 0 });
    }
    const gravity = 15;
    const maxLife = 0.8;
    const animateBlood = () => {
      let alive = false;
      const dt = 0.016;
      for (const p of bloodParticles) {
        if (p.life >= maxLife) continue;
        alive = true;
        p.life += dt;
        p.vel.y -= gravity * dt;
        p.mesh.position.x += p.vel.x * dt;
        p.mesh.position.y += p.vel.y * dt;
        p.mesh.position.z += p.vel.z * dt;
        if (p.mesh.position.y < 0.02) { p.mesh.position.y = 0.02; p.vel.y = 0; }
        p.mesh.material.opacity = 1 - p.life / maxLife;
        p.mesh.material.transparent = true;
      }
      if (alive) requestAnimationFrame(animateBlood);
      else for (const p of bloodParticles) { this.scene.remove(p.mesh); p.mesh.geometry.dispose(); p.mesh.material.dispose(); }
    };
    requestAnimationFrame(animateBlood);
  }

  spawnBlood() {
    const pos = this.mesh.position.clone();
    pos.y += 0.5;
    const particleCount = 15;
    const bloodParticles = [];

    for (let i = 0; i < particleCount; i++) {
      const size = 0.06 + Math.random() * 0.1;
      const geo = new THREE.SphereGeometry(size / 2, 4, 3);
      const shade = 0.3 + Math.random() * 0.4;
      const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(shade, 0, 0) });
      const particle = new THREE.Mesh(geo, mat);
      particle.position.copy(pos);
      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 6,
        Math.random() * 5 + 1,
        (Math.random() - 0.5) * 6
      );
      this.scene.add(particle);
      bloodParticles.push({ mesh: particle, vel, life: 0 });
    }

    const gravity = 15;
    const maxLife = 1.2;
    const animateBlood = () => {
      let alive = false;
      const dt = 0.016;
      for (const p of bloodParticles) {
        if (p.life >= maxLife) continue;
        alive = true;
        p.life += dt;
        p.vel.y -= gravity * dt;
        p.mesh.position.x += p.vel.x * dt;
        p.mesh.position.y += p.vel.y * dt;
        p.mesh.position.z += p.vel.z * dt;
        if (p.mesh.position.y < 0.02) {
          p.mesh.position.y = 0.02;
          p.vel.y = 0;
          p.vel.x *= 0.5;
          p.vel.z *= 0.5;
        }
        p.mesh.material.opacity = 1 - p.life / maxLife;
        p.mesh.material.transparent = true;
      }
      if (alive) {
        requestAnimationFrame(animateBlood);
      } else {
        for (const p of bloodParticles) {
          this.scene.remove(p.mesh);
          p.mesh.geometry.dispose();
          p.mesh.material.dispose();
        }
      }
    };
    requestAnimationFrame(animateBlood);
  }
}