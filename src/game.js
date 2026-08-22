import * as THREE from 'three';
import { Renderer } from './renderer.js';
import { Player } from './player.js';
import { Arena } from './arena.js';
import { Animal } from './animals.js';
import { Weapon, WEAPONS, rollAmmo } from './weapon.js';
import { HUD } from './hud.js';
import { Bot } from './bot.js';
import { Celebration } from './celebration.js';
import { Audio } from './audio.js';
import { keyMatches } from './keybindings.js';
import { Chest } from './chest.js';
import { Boss, MiniBoss } from './boss.js';

import { ACHIEVEMENTS } from './achievements-data.js';
import { getGameMode } from './game-modes.js';

window.__ACHIEVEMENTS_DATA = ACHIEVEMENTS;

const MATCH_DURATION = 600;

export class Game {
  static readBalance(key) {
    const raw = localStorage.getItem(key);
    const value = Number.parseInt(raw, 10);
    return (raw !== null && Number.isSafeInteger(value) && value >= 0) ? value : 0;
  }

  constructor(options) {
    this.mode = options.mode;
    this.network = options.network || null;
    this.botCount = options.botCount || 0;
    this.animalCount = options.animalCount || 50;
    this.map = options.map || null;
    this.running = false;
    this.targets = [];
    this.bots = [];
    this.chests = [];
    this.scores = {};
    this.playerName = options.playerName || 'Jogador';
    this.scores[this.playerName] = 0;
    this.playerHealth = 200;
    this.playerMaxHealth = 200;
    this.playerDead = false;
    this.killedByBoss = false;
    this.tokens = Game.readBalance('capiquake_tokens');
    this.money = Game.readBalance('capiquake_money');
    this.armor = 0;
    this.maxArmor = 100;
    this.shopPurchases = options.shopPurchases || {};
    this.pickups = [];
    this.nearChest = null;
    this.timeRemaining = MATCH_DURATION;
    this.speedBoost = false;
    this.speedBoostTimer = 0;
    this.invincible = false;
    this.invincibleTimer = 0;
    this.inventoryOpen = false;
    this.inventorySelected = -1;
    this.boss = null;
    this.bossActive = false;
    this.networkPlayers = [];
    this.remotePlayers = {};
    this._lastPosSend = 0;
    
    // Kill economy
    this.damageDealt = {};
    
    // Armor & abilities
    this.armorType = 'leather';
    this.playerMaxHealth = 200;
    this.rebirthLevel = Game.readBalance('capiquake_rebirth') || 0;
    this.rebirthMultiplier = 1 + (this.rebirthLevel * 0.5);
    
    // Enchantments
    this.enchantFire = false;
    this.enchantIce = false;
    this.enchantLightning = false;
    this.currentEnchant = null;
    
    // Skins
    this.skinVoid = false;
    this.skinFlame = false;
    this.skinSteam = false;
    this.weaponSkinVoid = false;
    this.weaponSkinGold = false;
    this.weaponSkinCryogenic = false;
    
    // Levels/Xp/Rebirth
    this.level = 1;
    this.xp = 0;
    
    // Abilities cooldowns
    this.voidCooldown = 0;
    this.voidActive = false;
    this.voidTimer = 0;
    this.voidExplosionCooldown = 0;
    this.fartCooldown = 0;
    this.teleportCooldown = 0;
    this.speedRushCooldown = 0;
    
    // Fart cloud visual
    this.fartCloud = null;
    
    // Drops
    this.nearPickup = null;
    
    // Waves
    this.wave = 1;
    
    // Pause
    this.paused = false;
    
    // Admin/test mode
    this.adminMode = false;
    this.infiniteAmmo = false;
    
    // Revive system
    this.reviveCount = (this.shopPurchases.revive || 0);
    this.usedRevives = 0;
    
    this.achievements = new Set((() => {
      const raw = localStorage.getItem('capiquake_achievements');
      if (!raw) return [];
      try { return JSON.parse(raw); } catch (e) { return []; }
    })());
    this.loadAchievementProgress();
    
    // Death screen elements (dynamically created)
    this.deathScreenEl = null;
    this.adminPanelEl = null;
    this.waveDisplayEl = null;
    this.waveDisplayCreated = false;

    this.drops = [];
    this.reviveCooldown = 0;
    this.baseSpeedMultiplier = 1;
    this.hasVoidAbility = false;
    this.speedRushTimer = 0;
    this.iceSlows = [];
    this.fartCloudTimer = 0;
    this.fartCooldownRemaining = 0;
    this._lastHotbarIndex = -1;
    this._lastHotbarLen = -1;
    this.stats = null;
    this.purchaseFlags = {};
    this.gameModeId = options.gameMode || 'normal';
    this.modeCfg = getGameMode(this.gameModeId).apply || {};
  }

  start() {
    this.renderer = new Renderer(this.map);
    this.scene = this.renderer.scene;
    this.camera = this.renderer.camera;

    this.arena = new Arena(this.scene, this.map);
    this.scene.add(this.camera);
    const isMobile = document.body.dataset.device === 'mobile';
    this.player = new Player(this.camera, this.renderer.domElement, this.scene, this.arena, isMobile);
    this.localPlayerMesh = this.createLocalPlayerMesh();
    this.localPlayerMesh.visible = false;
    this.scene.add(this.localPlayerMesh);
    this.player.onCameraToggle = (thirdPerson) => {
      if (this.hud) this.hud.showMessage(thirdPerson ? 'CÂMERA: 3ª PESSOA' : 'CÂMERA: 1ª PESSOA');
    };
    this.weapon = new Weapon(this.scene, this.camera, this.arena);
    this.hud = new HUD();

    this.gameStartTime = Date.now();

    this.stats = {
      kills: 0,
      deaths: 0,
      moneyEarned: 0,
      tokensEarned: 0,
      waves: 1,
      bosses: 0,
      minibosses: 0,
      weaponsOwned: 0,
      armorsOwned: this.shopPurchases.armorType ? 1 : (this.shopPurchases.armor ? 1 : 0),
      revivesUsed: 0,
      rebirths: this.rebirthLevel,
      level: 1,
      damageDealt: 0,
      matchesPlayed: 0,
      matchesWon: 0,
      matchesLost: 0,
      headshots: 0,
      dropsCollected: 0,
      meleeKills: 0,
      moneySpent: 0,
      killStreak: 0,
      emptyShots: 0,
      survivalTime: 0,
      perfectWaves: 0,
      maxBossDamage: 0,
      bossSoloKills: 0,
      earlyDeaths: 0,
      poorWaves: 0,
      deathStreak: 0,
      brokeEnds: 0,
      zeroDmgMatches: 0,
      idleTime: 0,
      speedBoostsUsed: 0
    };

    if (this.shopPurchases.minigun) {
      this.weapon.addWeapon('minigun', 0);
    }
    if (this.shopPurchases.ak47) {
      this.weapon.addWeapon('ak47', 30);
    }
    if (this.shopPurchases.cajado_fogo) {
      this.weapon.addWeapon('cajado_fogo', 50);
    }
    if (this.shopPurchases.bazuca) {
      this.weapon.addWeapon('bazuca', this.shopPurchases.ammoBazuca || 100);
    }
    if (this.shopPurchases.april_fools) {
      this.weapon.addWeapon('april_fools', 999);
    }
    if (this.shopPurchases.chicken_gun) {
      this.weapon.addWeapon('chicken_gun', this.shopPurchases.ammoChicken || 10);
    }
    if (this.shopPurchases.sniper) {
      this.weapon.addWeapon('sniper', this.shopPurchases.ammoSniper || 10);
    }
    if (this.mode === 'test') {
      // Modo teste: todas as armas liberadas
      this.weapon.addWeapon('minigun', 999);
      this.weapon.addWeapon('ak47', 999);
      this.weapon.addWeapon('cajado_fogo', 999);
      this.weapon.addWeapon('bazuca', 999);
      this.weapon.addWeapon('april_fools', 999);
      this.weapon.addWeapon('chicken_gun', 999);
      this.weapon.addWeapon('sniper', 999);
      this.infiniteAmmo = true;
    }
    if (this.shopPurchases.armor) {
      this.armor = this.shopPurchases.armor;
    }
    if (this.shopPurchases.armorType) {
      this.armorType = this.shopPurchases.armorType;
      if (this.armorType === 'leather') {
        this.playerMaxHealth += 20;
      } else if (this.armorType === 'gold') {
        this.playerMaxHealth += 30;
      } else if (this.armorType === 'iron') {
        this.playerMaxHealth += 50;
      } else if (this.armorType === 'diamond') {
        this.playerMaxHealth += 100;
        this.speedBoost = true;
        this.speedBoostTimer = 60;
        this.baseSpeedMultiplier = 1.5;
        this.player.setSpeedMultiplier(1.5);
      } else if (this.armorType === 'void') {
        this.playerMaxHealth += 500;
        this.hasVoidAbility = true;
      }
    }
    if (this.shopPurchases.extraLife) {
      this.playerMaxHealth += this.shopPurchases.extraLife * 50;
    }
    if (this.shopPurchases.speedBoost) {
      this.speedBoost = true;
      this.speedBoostTimer = 60;
      this.baseSpeedMultiplier = 1.5;
      this.player.setSpeedMultiplier(1.5);
    }
    if (this.shopPurchases.healthBoost) {
      this.playerMaxHealth += 100;
    }
    if (this.rebirthLevel >= 1) {
      this.playerMaxHealth *= Math.pow(2, this.rebirthLevel);
    }
    this.playerHealth = this.playerMaxHealth;

    this.enchantFire = !!this.shopPurchases.enchantFire;
    this.enchantIce = !!this.shopPurchases.enchantIce;
    this.enchantLightning = !!this.shopPurchases.enchantLightning;
    if (this.enchantFire) this.currentEnchant = 'fire';
    else if (this.enchantIce) this.currentEnchant = 'ice';
    else if (this.enchantLightning) this.currentEnchant = 'lightning';

    this.skinVoid = !!this.shopPurchases.skinVoid;
    this.skinFlame = !!this.shopPurchases.skinFlame;
    this.skinSteam = !!this.shopPurchases.skinSteam;
    this.weaponSkinVoid = !!this.shopPurchases.weaponSkinVoid;
    this.weaponSkinGold = !!this.shopPurchases.weaponSkinGold;
    this.weaponSkinCryogenic = !!this.shopPurchases.weaponSkinCryogenic;

    if (this.shopPurchases.revive) {
      this.reviveCount = this.shopPurchases.revive;
    }
    if (this.shopPurchases.armorHpTotal) {
      this.playerMaxHealth += this.shopPurchases.armorHpTotal;
    }
    if (this.shopPurchases.weapons) {
      for (const [slug, enabled] of Object.entries(this.shopPurchases.weapons)) {
        if (!enabled || !WEAPONS[slug]) continue;
        if (this.weapon.inventory.includes(slug)) continue;
        const def = WEAPONS[slug];
        const startingAmmo = def.type === 'melee' ? 0 : 50;
        this.weapon.addWeapon(slug, startingAmmo);
      }
      this.stats.weaponsOwned = this.weapon.inventory.length;
    }
    if (this.shopPurchases.ammoReserve) {
      for (const [slug, amount] of Object.entries(this.shopPurchases.ammoReserve)) {
        if (this.weapon.inventory.includes(slug)) {
          this.weapon.addAmmo(slug, amount);
        }
      }
    }
    if (this.shopPurchases.flags) {
      this.purchaseFlags = this.shopPurchases.flags;
    }
    if (this.shopPurchases.voidArmor || this.shopPurchases.voidExplosion) {
      this.hasVoidAbility = true;
    }

    this.applyModeEffects();
    this.applySkinVisuals();

    const start = this.arena.getPlayerStart();
    this.camera.position.set(start.x, 1.7, start.z);

    this.spawnAnimals();
    this.spawnBots();
    this.spawnPickups();
    this.spawnChests();

    this.hud.show();
    this.hud.updateRemaining(this.getHostileTargets().length);
    this.updateAnimalHighlight();
    this.hud.updateHealth(this.playerHealth, this.playerMaxHealth);
    this.hud.updateResources(this.tokens, this.money, this.armor);
    this.hud.updateTimer(this.timeRemaining);
    if (this.hud.updateLevel) this.hud.updateLevel(this.level, this.xp);
    this.weapon.updateDisplay();
    this.weapon.updateInventoryDisplay();
    this.updateHotbar();
    this.stats.weaponsOwned = this.weapon.inventory.length;
    this.usedReviveThisMatch = false;
    if (localStorage.getItem('capiquake_revive_infinity') === '1') {
      this.reviveCount = Infinity;
    }
    if (!this.stats.modePlays) this.stats.modePlays = {};
    this.stats.modePlays[this.gameModeId] = (this.stats.modePlays[this.gameModeId] || 0) + 1;

    this.createWaveDisplay();
    this.updateWaveDisplay();
    this.checkAchievements();
    this.running = true;
    this.lastTime = performance.now();
    this.animate();

    this.player.onShoot(() => this.handleShoot());
    this.setupInteraction();

    if (this.mode === 'multiplayer') {
      const chatEl = document.getElementById('chat');
      if (chatEl) chatEl.style.display = 'block';
    }

    if (this.mode === 'multiplayer' && this.network) {
      this.setupNetwork();
    }
  }

  setupInteraction() {
    this._keyHandler = (e) => {
      if (keyMatches('key-pickup', e.code) && this.nearChest && !this.playerDead && !this.inventoryOpen && !this.paused) {
        const loot = this.nearChest.open();
        if (loot) {
          this.weapon.addWeapon(loot.weaponId, loot.ammo);
          const name = WEAPONS[loot.weaponId].name;
          const ammoText = loot.ammo === Infinity ? 'INF' : loot.ammo;
          this.hud.showMessage(`${name} +${ammoText} balas!`);
          this.hud.hideInteractPrompt();
          this.nearChest = null;
          this.updateHotbar();
        }
      }
      if (keyMatches('key-pickup', e.code) && this.nearPickup && !this.playerDead && !this.inventoryOpen && !this.paused) {
        this.collectNearPickup();
      }
      if (keyMatches('key-drop', e.code) && !this.playerDead && !this.inventoryOpen && !this.paused) {
        this.dropCurrentWeapon();
      }
      if (keyMatches('key-void', e.code) && !this.playerDead && !this.inventoryOpen && !this.paused) {
        this.useVoidAbility();
      }
      if (keyMatches('key-fart', e.code) && !this.playerDead && !this.inventoryOpen && !this.paused) {
        this.useFartAbility();
      }
      if (keyMatches('key-grenade', e.code) && !this.playerDead && !this.inventoryOpen && !this.paused) {
        this.useTeleport();
      }
      if (keyMatches('key-speedrush', e.code) && !this.playerDead && !this.inventoryOpen && !this.paused) {
        this.useSpeedRush();
      }
      if ((e.code === 'KeyP' || keyMatches('key-pause', e.code)) && (this.mode === 'singleplayer' || this.mode === 'test')) {
        this.togglePause();
      }
      if (e.code.startsWith('Digit') && !this.playerDead && !this.inventoryOpen && !this.paused) {
        const idx = parseInt(e.code.slice(5), 10) - 1;
        this.selectWeaponIndex(idx);
      }
      if (e.code === 'F8' && this.mode === 'test') {
        this.toggleAdminPanel();
      }
      if (e.code === 'Escape' || keyMatches('key-inventory', e.code)) {
        this.toggleInventoryScreen();
      }
    };
    document.addEventListener('keydown', this._keyHandler);
  }

  dropCurrentWeapon() {
    const dropped = this.weapon.dropCurrentWeapon();
    if (dropped) {
      const name = WEAPONS[dropped].name;
      this.hud.showMessage(`${name} DESCARTADA!`);
    }
  }

  selectWeaponIndex(idx) {
    if (!this.weapon || !this.weapon.inventory || idx < 0 || idx >= this.weapon.inventory.length) return;
    if (this.weapon.currentIndex === idx) return;
    this.weapon.currentIndex = idx;
    this.weapon.currentWeapon = this.weapon.inventory[idx];
    this.weapon.buildCurrentModel();
    this.weapon.updateHitbox();
    this.weapon.updateDisplay();
    this.weapon.updateInventoryDisplay();
    this.updateHotbar();
  }

  toggleInventoryScreen() {
    this.inventoryOpen = !this.inventoryOpen;
    const el = document.getElementById('inventory-screen');
    if (!el) return;

    if (this.inventoryOpen) {
      this.player.unlock();
      el.style.display = 'flex';
      this.renderInventoryScreen();
    } else {
      el.style.display = 'none';
      this.inventorySelected = -1;
      this.player.lock();
    }
  }

  renderInventoryScreen() {
    const el = document.getElementById('inventory-screen');
    if (!el) return;
    const list = el.querySelector('.inv-list');
    if (!list) return;
    list.innerHTML = '';

    this.weapon.inventory.forEach((id, i) => {
      const w = WEAPONS[id];
      const item = document.createElement('div');
      item.className = 'inv-item' + (i === this.inventorySelected ? ' selected' : '') + (i === this.weapon.currentIndex ? ' active' : '');
      let text = `[${i + 1}] ${w.name} (DMG:${w.damage})`;
      if (w.type !== 'melee') {
        const a = this.weapon.getAmmo(id);
        text += ` | ${a === Infinity ? 'INF' : a} balas`;
      }
      item.textContent = text;
      item.addEventListener('click', () => {
        if (this.inventorySelected === -1) {
          this.inventorySelected = i;
        } else {
          this.weapon.swapWeapons(this.inventorySelected, i);
          this.inventorySelected = -1;
        }
        this.renderInventoryScreen();
      });
      list.appendChild(item);
    });
  }

  updateAnimalHighlight() {
    const alive = this.getHostileTargets();
    const low = alive.length <= 15 && alive.length > 0;
    for (const t of this.targets) {
      if (!t || !t.mesh || !t.alive) continue;
      if (low && !t._redHighlight) {
        t._redHighlight = true;
        t.mesh.traverse((c) => {
          if (c.isMesh && c.material && c.material.emissive) {
            if (c.material.userData.origEmissive === undefined) {
              c.material.userData.origEmissive = c.material.emissive.getHex();
            }
            c.material.emissive.setHex(0xff2222);
          }
        });
      } else if (!low && t._redHighlight) {
        t._redHighlight = false;
        t.mesh.traverse((c) => {
          if (c.isMesh && c.material && c.material.emissive && c.material.userData.origEmissive !== undefined) {
            c.material.emissive.setHex(c.material.userData.origEmissive);
            delete c.material.userData.origEmissive;
          }
        });
      }
    }
  }

  applyModeEffects() {
    const cfg = this.modeCfg || {};
    if (cfg.speedMul && this.player) {
      const base = this.player.moveSpeed || 15;
      this.player.moveSpeed = base * cfg.speedMul;
    }
    if (cfg.gravity && this.player) this.player.gravity = cfg.gravity;
    if (cfg.jumpMul && this.player) this.player.jumpSpeed = (this.player.jumpSpeed || 9) * cfg.jumpMul;
    if (cfg.infiniteStamina && this.player) this.player.infiniteStamina = true;
    if (cfg.reverseControls && this.player) this.player.reverseControls = true;
    if (cfg.playerHp) {
      this.playerMaxHealth = cfg.playerHp;
      this.playerHealth = this.playerMaxHealth;
    } else if (cfg.playerHpMul) {
      this.playerMaxHealth = Math.round(200 * cfg.playerHpMul);
      this.playerHealth = this.playerMaxHealth;
    }
  }

  applyModeToAnimal(animal) {
    const cfg = this.modeCfg || {};
    if (cfg.scale) {
      animal.mesh.scale.multiplyScalar(cfg.scale);
      animal.hitRadius = (animal.hitRadius || 1) * cfg.scale;
      animal.hitHeight = (animal.hitHeight || 0.5) * cfg.scale;
      if (animal.visualState && animal.visualState.meshes) {
        for (const part of animal.visualState.meshes) {
          part.baseScale.multiplyScalar(cfg.scale);
        }
      }
    }
    if (cfg.hpMul) animal.health *= cfg.hpMul;
    if (cfg.animalSpeedMul) {
      animal.speed *= cfg.animalSpeedMul;
      animal.chaseSpeed *= cfg.animalSpeedMul;
    }
    if (cfg.oneShotAnimals) animal.health = 1;
    if (cfg.invisible) {
      animal.mesh.traverse((child) => {
        if (child.isMesh && child.material && !child.material.userData.wasMeshBasicMaterial) {
          child.material.transparent = true;
          child.material.opacity = 0.12;
        }
      });
    }
  }

  spawnChests() {
    const map = this.arena.map;
    const rows = map.length;
    const cols = map[0].length;
    const spots = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (map[r][c] >= 3 || map[r][c] === 1) {
          spots.push({ r, c });
        }
      }
    }

    for (let i = spots.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [spots[i], spots[j]] = [spots[j], spots[i]];
    }

    const count = Math.min(14, spots.length);
    for (let i = 0; i < count; i++) {
      const cell = spots[i];
      const x = cell.c * 4 + 2;
      const z = cell.r * 4 + 2;
      this.chests.push(new Chest(this.scene, x, z));
    }
  }

  spawnAnimals() {
    const roomIds = this.arena.getRoomIds();
    const animalsPerRoom = Math.ceil(this.animalCount / roomIds.length);

    const animalTypes = [
      'jacare', 'tucano', 'anta', 'queixada', 'arara', 'sucuri',
      'onca', 'loboguara', 'micoleao', 'tamandua', 'tatu', 'preguica',
      'pirarucu', 'boto', 'harpia', 'sagui', 'gamba', 'paca',
      'cutia', 'veado', 'jaguatirica', 'piranha', 'caititu', 'bugio',
      'coruja', 'urubu', 'gaviao', 'tartaruga', 'cobracoral', 'cascavel',
      'jiboia', 'sapo', 'perereca', 'macacoaranha', 'quati', 'cervo',
      'urso', 'leao', 'tigre', 'elefante', 'gorila', 'rinoceronte',
      'hipopotamo', 'crocodilo', 'tubarao', 'aguia', 'falcao', 'lobo',
      'raposa', 'coiote', 'hiena', 'leopardo', 'pantera', 'bufalo',
      'bisonte', 'javali', 'alce', 'rena', 'camelo', 'girafa',
      'zebra', 'gnu', 'antilope', 'gazela', 'canguru', 'koala',
      'ornitorrinco', 'wombat', 'diabo_tasmania', 'dragao_komodo', 'panda', 'urso_polar',
      'morsa', 'foca', 'pinguim', 'pelicano', 'flamingo', 'condor',
      'grifo', 'fenix', 'basilisco', 'quimera', 'minotauro', 'ciclope',
      'hidra', 'cerberus', 'kraken', 'golem', 'troll', 'ogro',
      'vampiro', 'zumbi', 'esqueleto', 'demonio', 'anjo', 'centauro',
      'pegasus', 'unicornio', 'manticora', 'lobisomem'
    ];

    for (const roomId of roomIds) {
      const count = Math.min(animalsPerRoom, 4);
      for (let i = 0; i < count; i++) {
        const type = animalTypes[(roomId + i) % animalTypes.length];
        const sp = this.arena.getRandomSpawnInRoom(roomId);
        const animal = new Animal(this.scene, sp.x, sp.z, type, this.arena);
        this.applyModeToAnimal(animal);
        animal.dormant = true;
        animal.roomId = roomId;
        this.targets.push(animal);
      }
    }

    this.arena.onRoomActivation((roomId) => {
      let count = 0;
      for (const t of this.targets) {
        if (t.roomId === roomId && t.dormant) {
          t.dormant = false;
          count++;
        }
      }
      if (count > 0) {
        this.hud.showMessage(`SALA ABERTA! ${count} animais!`);
      }
    });
  }

  spawnBots() {
    if (this.mode !== 'singleplayer') return;
    const botNames = [
      'Bot_Gaucho', 'Bot_Mineiro', 'Bot_Paulista', 'Bot_Carioca',
      'Bot_Baiano', 'Bot_Nordestino', 'Bot_Paranaense', 'Bot_Goiano',
      'Bot_Capixaba', 'Bot_Matogrossense', 'Bot_Amazonense', 'Bot_Brasiliense',
      'Bot_Cearense', 'Bot_Pernambucano', 'Bot_Gauchao', 'Bot_Sertanejo',
      'Bot_Pantaneiro', 'Bot_Candango', 'Bot_Manauara', 'Bot_Potiguar',
      'Bot_Maranhense', 'Bot_Paraense', 'Bot_Sergipano', 'Bot_Piauiense'
    ];
    for (let i = 0; i < this.botCount; i++) {
      const name = botNames[i] || `Bot_${i}`;
      const bot = new Bot(this.scene, name, this.targets, this.arena);
      this.bots.push(bot);
      this.scores[name] = 0;
    }
  }

  spawnPickups() {
    const map = this.arena.map;
    const rows = map.length;
    const cols = map[0].length;
    const corridors = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (map[r][c] === 1) corridors.push({ r, c });
      }
    }

    for (let i = corridors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [corridors[i], corridors[j]] = [corridors[j], corridors[i]];
    }

    let idx = 0;
    for (let i = 0; i < 3 && idx < corridors.length; i++, idx++) {
      const cell = corridors[idx];
      const x = cell.c * 4 + 2;
      const z = cell.r * 4 + 2;
      this.pickups.push(this.createMedkit(x, z));
    }
    for (let i = 0; i < 5 && idx < corridors.length; i++, idx++) {
      const cell = corridors[idx];
      const x = cell.c * 4 + 2;
      const z = cell.r * 4 + 2;
      this.pickups.push(this.createBandaid(x, z));
    }
    const potionTypes = ['green', 'red', 'blue', 'blue', 'black', 'black', 'green', 'red', 'turquoise', 'turquoise', 'brown', 'brown', 'gray', 'gray'];
    for (let i = 0; i < potionTypes.length && idx < corridors.length; i++, idx++) {
      const cell = corridors[idx];
      const x = cell.c * 4 + 2;
      const z = cell.r * 4 + 2;
      this.pickups.push(this.createPotion(x, z, potionTypes[i]));
    }
    for (let i = 0; i < 4 && idx < corridors.length; i++, idx++) {
      const cell = corridors[idx];
      const x = cell.c * 4 + 2;
      const z = cell.r * 4 + 2;
      this.pickups.push(this.createBoost(x, z));
    }

    const roomCells = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (map[r][c] >= 3) roomCells.push({ r, c });
      }
    }
    for (let i = roomCells.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [roomCells[i], roomCells[j]] = [roomCells[j], roomCells[i]];
    }
    for (let i = 0; i < 10 && i < roomCells.length; i++) {
      const cell = roomCells[i];
      const x = cell.c * 4 + 2;
      const z = cell.r * 4 + 2;
      this.pickups.push(this.createAmmoPickup(x, z));
    }
  }

  createMedkit(x, z) {
    const group = new THREE.Group();
    const boxGeo = new THREE.BoxGeometry(0.6, 0.4, 0.6);
    const boxMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const box = new THREE.Mesh(boxGeo, boxMat);
    group.add(box);

    const crossH = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.42, 0.1),
      new THREE.MeshBasicMaterial({ color: 0xcc0000 })
    );
    crossH.position.z = 0.31;
    group.add(crossH);
    const crossV = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.42, 0.35),
      new THREE.MeshBasicMaterial({ color: 0xcc0000 })
    );
    crossV.position.z = 0.31;
    group.add(crossV);

    group.position.set(x, 0.6, z);
    this.scene.add(group);
    return { mesh: group, x, z, type: 'medkit', collected: false };
  }

  createBandaid(x, z) {
    const group = new THREE.Group();
    const boxGeo = new THREE.BoxGeometry(0.4, 0.12, 0.25);
    const boxMat = new THREE.MeshLambertMaterial({ color: 0xddbb88 });
    const box = new THREE.Mesh(boxGeo, boxMat);
    group.add(box);

    const strip = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.13, 0.12),
      new THREE.MeshLambertMaterial({ color: 0xaa8855 })
    );
    group.add(strip);

    group.position.set(x, 0.5, z);
    this.scene.add(group);
    return { mesh: group, x, z, type: 'bandaid', collected: false };
  }

  createBoost(x, z) {
    const group = new THREE.Group();
    const bootMat = new THREE.MeshLambertMaterial({ color: 0x5a3a2a });
    for (let i = -1; i <= 1; i += 2) {
      const sole = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.06, 0.3), bootMat);
      sole.position.set(i * 0.12, 0, 0);
      group.add(sole);
      const shaft = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.2, 0.2), bootMat);
      shaft.position.set(i * 0.12, 0.12, -0.02);
      group.add(shaft);
    }
    const wingMat = new THREE.MeshBasicMaterial({ color: 0xffcc44, transparent: true, opacity: 0.7 });
    const wing = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.12, 0.15), wingMat);
    wing.position.set(0.25, 0.15, 0);
    wing.rotation.z = 0.3;
    group.add(wing);
    const wing2 = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.12, 0.15), wingMat);
    wing2.position.set(-0.25, 0.15, 0);
    wing2.rotation.z = -0.3;
    group.add(wing2);

    group.position.set(x, 0.5, z);
    this.scene.add(group);
    return { mesh: group, x, z, type: 'boost', collected: false };
  }

  createAmmoPickup(x, z) {
    const group = new THREE.Group();
    const boxGeo = new THREE.BoxGeometry(0.4, 0.3, 0.3);
    const boxMat = new THREE.MeshLambertMaterial({ color: 0x8a7a2a });
    const box = new THREE.Mesh(boxGeo, boxMat);
    group.add(box);
    const label = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.15, 0.32),
      new THREE.MeshBasicMaterial({ color: 0xccaa44 })
    );
    label.position.y = 0.05;
    group.add(label);
    const bullet = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.12, 5),
      new THREE.MeshLambertMaterial({ color: 0xdddd66 })
    );
    bullet.position.set(0, 0.08, 0.16);
    bullet.rotation.x = Math.PI / 2;
    group.add(bullet);

    group.position.set(x, 0.5, z);
    this.scene.add(group);
    return { mesh: group, x, z, type: 'ammo', ammoCount: rollAmmo(), collected: false };
  }

  createPotion(x, z, potionColor) {
    const group = new THREE.Group();

    const colors = {
      green: { glass: 0x225522, liquid: 0x44ff44 },
      red: { glass: 0x552222, liquid: 0xff4444 },
      blue: { glass: 0x222255, liquid: 0x4488ff },
      black: { glass: 0x1a1a1a, liquid: 0x333333 },
      turquoise: { glass: 0x225555, liquid: 0x44ffee },
      brown: { glass: 0x443322, liquid: 0xaa7744 },
      gray: { glass: 0x333333, liquid: 0xcccccc }
    };
    const c = colors[potionColor];

    const bottleGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.4, 6);
    const bottleMat = new THREE.MeshLambertMaterial({
      color: c.glass,
      transparent: true,
      opacity: 0.7
    });
    const bottle = new THREE.Mesh(bottleGeo, bottleMat);
    group.add(bottle);

    const neckGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.15, 6);
    const neck = new THREE.Mesh(neckGeo, bottleMat);
    neck.position.y = 0.27;
    group.add(neck);

    const corkGeo = new THREE.SphereGeometry(0.07, 5, 4);
    const corkMat = new THREE.MeshLambertMaterial({ color: 0x6a4a2a });
    const cork = new THREE.Mesh(corkGeo, corkMat);
    cork.position.y = 0.37;
    group.add(cork);

    const liquidGeo = new THREE.CylinderGeometry(0.1, 0.13, 0.3, 6);
    const liquidMat = new THREE.MeshBasicMaterial({
      color: c.liquid,
      transparent: true,
      opacity: 0.5
    });
    const liquid = new THREE.Mesh(liquidGeo, liquidMat);
    liquid.position.y = -0.03;
    group.add(liquid);

    group.position.set(x, 0.55, z);
    this.scene.add(group);
    return { mesh: group, x, z, type: 'potion', potionColor, collected: false };
  }

  checkPickups() {
    const pos = this.player.getPosition();
    for (const pickup of this.pickups) {
      if (pickup.collected) continue;
      const dx = pos.x - pickup.x;
      const dz = pos.z - pickup.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < 2.0) {
        if (pickup.type === 'medkit' && this.playerHealth >= this.playerMaxHealth) continue;
        if (pickup.type === 'bandaid' && this.playerHealth >= this.playerMaxHealth) continue;

        pickup.collected = true;
        this.scene.remove(pickup.mesh);

        if (pickup.type === 'medkit') {
          this.playerHealth = this.playerMaxHealth;
          this.hud.showMessage('KIT MEDICO! Vida cheia!');
        } else if (pickup.type === 'bandaid') {
          this.playerHealth = Math.min(this.playerMaxHealth, this.playerHealth + this.playerMaxHealth * 0.1);
          this.hud.showMessage('BANDAID! +10% vida');
        } else if (pickup.type === 'boost') {
          this.speedBoost = true;
          this.speedBoostTimer = 30;
          this.player.setSpeedMultiplier(1.6);
          this.hud.showMessage('BOOST! Velocidade aumentada!');
        } else if (pickup.type === 'potion') {
          this.applyPotion(pickup.potionColor);
        } else if (pickup.type === 'ammo') {
          this.weapon.addAmmo(null, pickup.ammoCount);
          const text = pickup.ammoCount === Infinity ? 'INF' : pickup.ammoCount;
          this.hud.showMessage(`MUNIÇãO! +${text} balas!`);
          this.weapon.updateDisplay();
        }
        this.hud.updateHealth(this.playerHealth, this.playerMaxHealth);
      }
    }
  }

  applyPlayerDamage(dmg) {
    if (this.mode === 'test') return false; // modo teste: HP infinito
    if (this.armor > 0) {
      const armorAbsorb = Math.min(this.armor, dmg * 0.6);
      this.armor -= armorAbsorb;
      dmg -= armorAbsorb;
      this.hud.updateResources(this.tokens, this.money, Math.floor(this.armor));
    }
    this.playerHealth -= dmg;
    this.hud.updateHealth(this.playerHealth, this.playerMaxHealth);
    this.hud.showDamageFlash();
    Audio.playerHurt();
    return this.playerHealth <= 0;
  }

  applyPotion(color) {
    switch (color) {
      case 'green': {
        const dmg = this.playerMaxHealth * 0.3;
        this.playerHealth -= dmg;
        this.hud.showDamageFlash();
        Audio.playerHurt();
        this.hud.showMessage('VENENO! -30% vida!');
        if (this.playerHealth <= 0) {
          this.playerHealth = 0;
          this.playerDead = true;
          this.stats.deaths = (this.stats.deaths || 0) + 1;
          this.stats.deathStreak = (this.stats.deathStreak || 0) + 1;
          this.stats.killStreak = 0;
          this.checkAchievements();
          this.hud.updateHealth(0, this.playerMaxHealth);
          this.hud.addKillEntry('VENENO', this.playerName);
          this.hud.showMessage('ENVENENADO!');
          this.showDeathScreen();
        }
        break;
      }
      case 'red':
        this.playerHealth += this.playerMaxHealth * 0.5;
        this.hud.showMessage('Poção VERMELHA! +50% vida extra!');
        break;
      case 'blue':
        this.playerHealth = Math.min(this.playerMaxHealth, this.playerHealth + this.playerMaxHealth * 0.3);
        this.hud.showMessage('POCAO AZUL! +30% vida!');
        break;
      case 'black':
        this.playerHealth = Math.min(this.playerMaxHealth, this.playerHealth + this.playerMaxHealth * 0.15);
        this.hud.showMessage('POCAO PRETA! +15% vida!');
        break;
      case 'turquoise':
        this.playerHealth += 100;
        this.hud.showMessage('POCAO TURQUESA! +100 vida extra!');
        break;
      case 'brown':
        this.speedBoost = true;
        this.speedBoostTimer = 20;
        this.player.setSpeedMultiplier(1.5);
        this.hud.showMessage('POCAO MARROM! + Velocidade!');
        break;
      case 'gray':
        this.invincible = true;
        this.invincibleTimer = 30;
        this.hud.showMessage('POCAO CINZA! Invencivel 30s!');
        break;
    }
  }

  checkChests() {
    const pos = this.player.getPosition();
    let closest = null;
    let closestDist = Infinity;

    for (const chest of this.chests) {
      if (chest.opened) continue;
      const dist = chest.getDistanceTo(pos);
      if (dist < 2.5 && dist < closestDist) {
        closest = chest;
        closestDist = dist;
      }
    }

    if (closest && closest !== this.nearChest) {
      this.nearChest = closest;
      this.hud.showInteractPrompt();
    } else if (!closest && this.nearChest) {
      this.nearChest = null;
      this.hud.hideInteractPrompt();
    }
  }

  checkBotSales() {
    const pos = this.player.getPosition();
    for (const bot of this.bots) {
      for (const item of bot.droppedItems) {
        if (item.collected) continue;
        const dx = pos.x - item.position.x;
        const dz = pos.z - item.position.z;
        if (dx * dx + dz * dz < 4) {
          item.collected = true;
          this.scene.remove(item.mesh);
          if (item.type === 'ammo') {
            this.weapon.addAmmo(null, 10);
            this.hud.showMessage('Comprou municao do Carioca!');
          } else {
            this.playerHealth = Math.min(this.playerMaxHealth, this.playerHealth + 50);
            this.hud.showMessage('Comprou kit do Carioca!');
          }
          this.weapon.updateDisplay();
          this.hud.updateHealth(this.playerHealth, this.playerMaxHealth);
        }
      }
    }
  }

  setupNetwork() {
    this.network.onStateUpdate((state) => {
      this.networkPlayers.length = 0;
      for (const key of Object.keys(state || {})) {
        const entry = state[key];
        if (entry && entry.position) {
          this.networkPlayers.push(entry.position);
          this.updateRemotePlayer(key, entry);
        }
      }
    });
    this.network.onKill((data) => {
      if (!data || !data.player) return;
      if (data.player === this.playerName) return; // kill local já tratado pelo resolveKill
      this.scores[data.player] = (this.scores[data.player] || 0) + 1;
      this.hud.addKillEntry(data.player, 'ANIMAL');
    });
    this.network.sendJoin(this.playerName);
  }

  updateRemotePlayer(name, entry) {
    let rp = this.remotePlayers[name];
    if (!rp) {
      rp = {
        mesh: this.createRemotePlayerMesh(),
        position: new THREE.Vector3(),
        rotationY: 0,
        lastSeen: performance.now(),
      };
      this.remotePlayers[name] = rp;
      this.scene.add(rp.mesh);
    }
    rp.position.set(entry.position.x, entry.position.y, entry.position.z);
    const rot = entry.rotation;
    if (rot && typeof rot === 'object' && typeof rot.y === 'number') rp.rotationY = rot.y;
    rp.lastSeen = performance.now();
  }

  createRemotePlayerMesh() {
    const group = new THREE.Group();
    const bodyGeo = new THREE.BoxGeometry(0.6, 1.4, 0.4);
    const bodyMat = new THREE.MeshLambertMaterial({ color: 0x3366cc });
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

  createLocalPlayerMesh() {
    const group = new THREE.Group();
    const bodyGeo = new THREE.BoxGeometry(0.6, 1.4, 0.4);
    const bodyMat = new THREE.MeshLambertMaterial({ color: 0x8a5a2b });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.9;
    body.castShadow = true;
    group.add(body);

    const headGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const headMat = new THREE.MeshLambertMaterial({ color: 0xa06c35 });
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

  updateLocalPlayerMesh() {
    if (!this.localPlayerMesh) return;
    const tp = this.player.isThirdPerson();
    this.localPlayerMesh.visible = tp;
    if (!tp) return;
    const pos = this.player.getPosition();
    this.localPlayerMesh.position.set(pos.x, pos.y - 1.7, pos.z);
    this.localPlayerMesh.rotation.y = this.player.euler.y;
  }

  isHostileTarget(target) {
    return !!target && !target.isProtectedAlly;
  }

  getHostileTargets() {
    return this.targets.filter(t => t && t.alive && !t.isProtectedAlly);
  }

  getCombatTargets() {
    const hostile = this.getHostileTargets();
    return (this.boss && this.boss.alive) ? [...hostile, this.boss] : hostile;
  }

  handleShoot() {
    if (this.playerDead || this.inventoryOpen || this.paused) return;
    const allTargets = this.getCombatTargets();
    const hit = this.weapon.fire(allTargets);
    if (this.infiniteAmmo && this.weapon.currentWeapon !== 'minigun') {
      this.weapon.addAmmo(this.weapon.currentWeapon, 1);
      this.weapon.updateDisplay();
      this.weapon.updateInventoryDisplay();
    }
    if (hit) {
      const damage = this.weapon.getDamage();
      this.registerDamage(hit, damage);
      const killed = hit.takeDamage(damage);
      if (this.enchantIce && !killed && hit.alive) this.applyIceSlow(hit);

      if (hit === this.boss) {
        this.hud.updateBossHealth(this.boss.health, this.boss.maxHealth);
        if (killed) {
          if (this.resolveBossKill(hit)) this.endGame();
        }
        return;
      }

      if (killed) {
        this.resolveKill(hit, this.playerName);
        if (this.mode === 'multiplayer' && this.network) {
          this.network.sendKill(hit.id);
        }
      }
    }
  }

  processBoltHits() {
    while (this.weapon.pendingHits.length > 0) {
      const entry = this.weapon.pendingHits.shift();
      const hit = entry.target;
      const damage = entry.damage;
      if (!hit.alive || !this.isHostileTarget(hit)) continue;
      this.registerDamage(hit, damage);
      const killed = hit.takeDamage(damage);
      if (this.enchantIce && !killed && hit.alive) this.applyIceSlow(hit);

      if (hit === this.boss) {
        this.hud.updateBossHealth(this.boss.health, this.boss.maxHealth);
        if (killed) {
          if (this.resolveBossKill(hit)) this.endGame();
        }
        continue;
      }

      if (killed) {
        this.resolveKill(hit, this.playerName);
      }
    }
  }

  handleBotKill(bot, target) {
    if (!this.isHostileTarget(target)) return;
    target.die();
    if (this.weapon.pendingHits.some(h => h.target === target)) {
      this.weapon.pendingHits = this.weapon.pendingHits.filter(h => h.target !== target);
    }
    this.resolveKill(target, bot.name);
  }

  registerDamage(hit, damage) {
    if (!hit || !this.isHostileTarget(hit)) return;
    if (!hit.damageDealers) hit.damageDealers = {};
    hit.damageDealers[this.playerName] = (hit.damageDealers[this.playerName] || 0) + damage;
    this.damageDealt[this.playerName] = (this.damageDealt[this.playerName] || 0) + damage;
    this.stats.damageDealt = (this.stats.damageDealt || 0) + damage;
  }

  getTopDamageDealer(hit) {
    const dealers = hit && hit.damageDealers;
    if (!dealers) return null;
    let topDealer = null;
    let topDamage = 0;
    for (const [dealer, damage] of Object.entries(dealers)) {
      if (damage > topDamage) {
        topDealer = dealer;
        topDamage = damage;
      }
    }
    return topDealer;
  }

  getMoneyMultiplier() {
    return 1 + this.rebirthLevel;
  }

  getTokenMultiplier() {
    return 1 + (this.rebirthLevel * 0.5);
  }

  getXpMultiplier() {
    return 1 + this.rebirthLevel;
  }

  saveBalance() {
    if (this.mode === 'test') return;
    localStorage.setItem('capiquake_money', this.money);
    localStorage.setItem('capiquake_tokens', this.tokens);
  }

  saveStats() {
    if (this.mode === 'test') return;
    localStorage.setItem('capiquake_stats', JSON.stringify(this.stats || {}));
  }

  resolveKill(hit, killerName) {
    const creditedName = this.getTopDamageDealer(hit) || killerName;
    const points = hit.points || 1;
    this.scores[creditedName] = (this.scores[creditedName] || 0) + points;
    if (creditedName === this.playerName) {
      this.hud.updateKills(this.scores[this.playerName]);
    }
    const name = hit.config ? hit.config.name : 'ANIMAL';
    if (creditedName === this.playerName) {
      const m = this.getMoneyMultiplier();
      const t = this.getTokenMultiplier();
      const dropMoney = Math.round((hit.getDropMoney ? hit.getDropMoney() : (hit.dropMoney || 0)) * m);
      const dropTokens = Math.round((hit.getDropTokens ? hit.getDropTokens() : (hit.dropTokens || 0)) * t);
      this.money += dropMoney;
      this.tokens += dropTokens;
      this.saveBalance();
      this.hud.updateResources(this.tokens, this.money, this.armor);
      if (dropMoney > 0) this.hud.showMessage(`+$${dropMoney}`);
      if (dropTokens > 0) this.hud.showMessage(`+${dropTokens} TOKENS`);
      if (dropMoney > 0 || dropTokens > 0) {
        this.createCoinPickup(hit.mesh ? hit.mesh.position : null, dropMoney, dropTokens, true);
      }
      this.stats.kills = (this.stats.kills || 0) + 1;
      this.stats.killStreak = (this.stats.killStreak || 0) + 1;
      this.stats.deathStreak = 0;
      if (this.modeCfg && this.modeCfg.lifesteal) {
        this.playerHealth = Math.min(this.playerMaxHealth, this.playerHealth + this.modeCfg.lifesteal);
        this.hud.updateHealth(this.playerHealth, this.playerMaxHealth);
      }
      if (this.modeCfg && this.modeCfg.moneyMul) {
        dropMoney *= this.modeCfg.moneyMul;
      }
      if (this.modeCfg && this.modeCfg.tokenPerKill) {
        this.tokens += this.modeCfg.tokenPerKill;
        this.saveBalance();
        this.hud.updateResources(this.tokens, this.money, this.armor);
      }
      this.stats.moneyEarned = (this.stats.moneyEarned || 0) + dropMoney;
      this.stats.tokensEarned = (this.stats.tokensEarned || 0) + dropTokens;
      this.addXp(points * 10);
      this.checkAchievements();
      if (this.modeCfg && this.modeCfg.horde && !this.bossActive) {
        setTimeout(() => {
          if (!this.running || this.playerDead || this._gameEnded) return;
          const roomIds = this.arena.getRoomIds();
          const roomId = roomIds[Math.floor(Math.random() * roomIds.length)];
          const sp = this.arena.getRandomSpawnInRoom ? this.arena.getRandomSpawnInRoom(roomId) : null;
          if (!sp) return;
          const types = ['jacare', 'tucano', 'anta', 'queixada', 'arara', 'onca', 'loboguara', 'piranha', 'cascavel', 'lobo', 'zumbi', 'esqueleto'];
          const type = types[Math.floor(Math.random() * types.length)];
          const animal = new Animal(this.scene, sp.x, sp.z, type, this.arena);
          this.applyModeToAnimal(animal);
          this.targets.push(animal);
          this.hud.updateRemaining(this.getHostileTargets().length);
          this.updateAnimalHighlight();
        }, 700);
      }
    }
    this.hud.showMessage(`${name} ABATIDA! +${points}`);
    this.hud.addKillEntry(creditedName, name);
    const alive = this.getHostileTargets();
    this.hud.updateRemaining(alive.length);
    if (alive.length === 0 && !this.bossActive && !this.playerDead) {
      this.nextWave();
    }
  }

  resolveBossKill(hit) {
    this.hud.hideBossBar();
    if (hit.isMiniBoss) {
      this.stats.minibosses = (this.stats.minibosses || 0) + 1;
      this.tokens += 5;
      this.money += 200;
      this.saveBalance();
      this.hud.updateResources(this.tokens, this.money, this.armor);
      this.hud.showMessage('MINI BOSS DERROTADO! +5 TOKENS!');
      this.hud.addKillEntry(this.getTopDamageDealer(hit) || this.playerName, 'MINI BOSS');
      this.scores[this.playerName] += hit.points || 50;
      this.hud.updateKills(this.scores[this.playerName]);
      this.addXp((hit.points || 50) * 10);
      this.boss = null;
      this.bossActive = false;
      this.checkAchievements();
      const alive = this.getHostileTargets();
      this.hud.updateRemaining(alive.length);
      if (alive.length === 0 && !this.playerDead) this.nextWave();
      return false;
    }
    if (hit.isWaveBoss) {
      this.stats.bosses = (this.stats.bosses || 0) + 1;
      this.tokens += 10;
      this.money += 500;
      this.saveBalance();
      this.hud.updateResources(this.tokens, this.money, this.armor);
      this.hud.showMessage('CHEFE DA ONDA DERROTADO! +10 TOKENS!');
      this.hud.addKillEntry(this.getTopDamageDealer(hit) || this.playerName, 'GOVERNO FEDERAL');
      this.scores[this.playerName] += hit.points || 100;
      this.hud.updateKills(this.scores[this.playerName]);
      this.addXp((hit.points || 100) * 10);
      this.boss = null;
      this.bossActive = false;
      this.checkAchievements();
      const alive2 = this.getHostileTargets();
      this.hud.updateRemaining(alive2.length);
      if (alive2.length === 0 && !this.playerDead) this.nextWave();
      return false;
    }
    this.hud.showMessage('GOVERNO FEDERAL DERROTADO! +10 TOKENS!');
    this.hud.addKillEntry(this.getTopDamageDealer(hit) || this.playerName, 'GOVERNO FEDERAL');
    this.scores[this.playerName] += hit.points || 0;
    this.hud.updateKills(this.scores[this.playerName]);
    this.tokens += 10;
    this.saveBalance();
    this.hud.updateResources(this.tokens, this.money, this.armor);
    this.stats.bosses = (this.stats.bosses || 0) + 1;
    this.checkAchievements();
    return true;
  }

  applyIceSlow(hit) {
    if (!hit || typeof hit.speed !== 'number' || hit._iceSlowTimer) return;
    hit._iceSlowTimer = 5;
    hit.speed *= 0.5;
  }

  useVoidAbility() {
    if (!this.hasVoidAbility) return;
    if (this.voidExplosionCooldown > 0) {
      this.hud.showCooldownMessage(`Espere! Faltam ${Math.ceil(this.voidExplosionCooldown)} segundos.`);
      return;
    }
    if (this.voidActive) {
      this.hud.showCooldownMessage('Habilidade Void ja esta ativa!');
      return;
    }
    if (this.shopPurchases.voidExplosion) {
      this.voidExplosionCooldown = 30;
      const pos = this.player.getPosition();
      const targets = this.getCombatTargets().slice();
      for (const target of targets) {
        if (!target.alive) continue;
        const tp = target.mesh.position;
        const dist = Math.sqrt((tp.x - pos.x) * (tp.x - pos.x) + (tp.z - pos.z) * (tp.z - pos.z));
        if (dist <= 10) {
          const damage = 200;
          this.registerDamage(target, damage);
          const killed = target.takeDamage(damage);
          if (killed) {
            if (target === this.boss) {
              if (this.resolveBossKill(target)) this.endGame();
            } else {
              this.resolveKill(target, this.playerName);
            }
          }
        }
      }
      this.hud.showMessage('EXPLOSAO VOID! 200 de dano em area!');
      return;
    }
    if (this.voidCooldown > 0) {
      this.hud.showCooldownMessage(`Espere! Faltam ${Math.ceil(this.voidCooldown)} segundos.`);
      return;
    }
    this.voidActive = true;
    this.voidTimer = 15;
    this.voidCooldown = 30;
    this.hud.showMessage('HABILIDADE VOID ATIVADA! 15s de invencibilidade!');
  }

  useFartAbility() {
    if (this.fartCooldown > 0) {
      this.hud.showCooldownMessage(`Espere! Faltam ${Math.ceil(this.fartCooldown)} segundos.`);
      return;
    }
    this.fartCooldown = 20;
    const pos = this.player.getPosition();
    const group = new THREE.Group();
    const cloud = new THREE.Mesh(
      new THREE.SphereGeometry(1.2, 10, 8),
      new THREE.MeshBasicMaterial({ color: 0x44cc44, transparent: true, opacity: 0.6 })
    );
    group.add(cloud);
    group.position.set(pos.x, pos.y + 0.5, pos.z);
    this.scene.add(group);
    this.fartCloud = group;
    this.fartCloudTimer = 2;
    const targets = this.getCombatTargets().slice();
    for (const target of targets) {
      if (!target.alive) continue;
      const tp = target.mesh.position;
      const dist = Math.sqrt((tp.x - pos.x) * (tp.x - pos.x) + (tp.z - pos.z) * (tp.z - pos.z));
      if (dist <= 8) {
        const damage = 5;
        this.registerDamage(target, damage);
        const killed = target.takeDamage(damage);
        target.fleeTimer = 10;
        target.chasing = false;
        if (killed) {
          if (target === this.boss) {
            if (this.resolveBossKill(target)) this.endGame();
          } else {
            this.resolveKill(target, this.playerName);
          }
        }
      }
    }
    this.hud.showMessage('PEIDO! +5 dano nos bixos');
  }

  useTeleport() {
    if (!this.shopPurchases.teleport) return;
    if (this.teleportCooldown > 0) {
      this.hud.showCooldownMessage(`Espere ai, amigão! Bah... Faltam ${Math.ceil(this.teleportCooldown)} segundos pra tu usar dnv...`);
      return;
    }
    this.teleportCooldown = 15;
    const candidates = [];
    for (const roomId of this.arena.getRoomIds()) {
      for (const pt of this.arena.getRoomSpawnPoints(roomId)) {
        if (this.arena.isPassable(pt.x, pt.z)) candidates.push(pt);
      }
    }
    if (candidates.length === 0) {
      this.hud.showCooldownMessage('Nenhum ponto de teleporte encontrado!');
      return;
    }
    const spot = candidates[Math.floor(Math.random() * candidates.length)];
    this.camera.position.set(spot.x, 1.7, spot.z);
    this.hud.showMessage('TELEPORTE!');
  }

  useSpeedRush() {
    if (!this.shopPurchases.speedRush) return;
    if (this.speedRushTimer > 0) {
      this.hud.showCooldownMessage(`Espere! Faltam ${Math.ceil(this.speedRushTimer)} segundos.`);
      return;
    }
    if (this.speedRushCooldown > 0) {
      this.hud.showCooldownMessage(`Espere! Faltam ${Math.ceil(this.speedRushCooldown)} segundos.`);
      return;
    }
    this.speedRushTimer = 10;
    this.speedRushCooldown = 45;
    this.player.setSpeedMultiplier(2.0);
    this.hud.showMessage('SPEED RUSH! 200% velocidade por 10s!');
  }

  showDeathScreen() {
    document.getElementById('achievements-screen').style.display = 'none';
    const notifEl = document.getElementById('achievement-notification');
    if (notifEl) notifEl.classList.remove('show');

    const el = document.getElementById('death-screen');
    if (!el) return;
    el.style.display = 'flex';
    this.deathScreenEl = el;

    const remaining = Math.max(0, this.reviveCount - this.usedRevives);
    const countEl = document.getElementById('revive-count');
    if (countEl) countEl.textContent = 'REVIVES DISPONÍVEIS: ' + remaining;
    const priceEl = document.getElementById('revive-price');
    if (priceEl) priceEl.textContent = remaining > 0 ? 'USE SEU REVIVE' : 'PREÇO DO REVIVE: $5750';

    const btnRevive = document.getElementById('btn-revive');
    if (btnRevive) {
      btnRevive.disabled = this.reviveCooldown > 0;
      btnRevive.textContent = remaining > 0 ? 'REVIVER (GRÁTIS)' : 'REVIVER ($5750)';
      btnRevive.onclick = () => this.revivePlayer();
    }
    const btnShop = document.getElementById('btn-death-shop');
    if (btnShop) btnShop.onclick = () => this.toggleDeathShop();
    const btnMenu = document.getElementById('btn-death-menu');
    if (btnMenu) btnMenu.onclick = () => this.returnToMenu();
  }

  hideDeathScreen() {
    const el = document.getElementById('death-screen');
    if (el) el.style.display = 'none';
  }

  revivePlayer() {
    const remaining = Math.max(0, this.reviveCount - this.usedRevives);
    if (this.reviveCooldown > 0) {
      this.hud.showCooldownMessage(`Espere! Faltam ${Math.ceil(this.reviveCooldown)} segundos.`);
      return;
    }
    if (this.mode === 'multiplayer' && remaining <= 0) {
      this.hud.showCooldownMessage('Multiplayer: apenas revives comprados!');
      return;
    }
    if (remaining > 0) {
      this.usedRevives++;
      this.stats.revivesUsed = (this.stats.revivesUsed || 0) + 1;
      this.checkAchievements();
      this.performRevive();
      return;
    }
    if (this.money >= 5750) {
      this.money -= 5750;
      this.saveBalance();
      this.hud.updateResources(this.tokens, this.money, this.armor);
      this.performRevive();
      return;
    }
    this.hud.showCooldownMessage('Tas tolo eh? tas Sem dinheiro pra reviver...');
  }

  performRevive() {
    this.hideDeathScreen();
    this.usedReviveThisMatch = true;
    const start = this.arena.getPlayerStart();
    this.camera.position.set(start.x, 1.7, start.z);
    this.playerDead = false;
    this.killedByBoss = false;
    this.playerHealth = this.playerMaxHealth;
    this.stats.deathStreak = 0;
    this.stats.killStreak = 0;
    this.reviveCooldown = 300;
    if (this.player) {
      this.player.velocity.set(0, 0, 0);
      this.player.keys = { forward: false, backward: false, left: false, right: false, jump: false, sprint: false };
      this.player.mouseHeld = false;
      if (this.player.isMobile && this.player.cameraAnchor) {
        this.player.cameraAnchor.set(start.x, 1.7, start.z);
        this.player.playerPos.set(start.x, 1.7, start.z);
      }
    }
    this.hud.updateHealth(this.playerHealth, this.playerMaxHealth);
    this.hud.showMessage('REVIVEU! Vida cheia!');
    const btn = document.getElementById('btn-revive');
    if (btn) btn.disabled = true;
  }

  toggleDeathShop() {
    const shop = document.getElementById('death-shop');
    if (!shop) return;
    const visible = shop.style.display !== 'none';
    shop.style.display = visible ? 'none' : 'block';
    if (!visible) this.populateDeathShop(shop);
  }

  populateDeathShop(shop) {
    shop.innerHTML = '';
    const buyLife = document.createElement('button');
    buyLife.textContent = 'Vida Extra (+50 HP) - $1000 ou 1 token';
    buyLife.style.cssText = 'margin:4px;padding:6px 12px;';
    buyLife.onclick = () => {
      if (this.money >= 1000) {
        this.money -= 1000;
        this.saveBalance();
      } else if (this.tokens >= 1) {
        this.tokens -= 1;
        this.saveBalance();
      } else {
        this.hud.showCooldownMessage('TU TA SEM GRANA E TOKENS CARA, VAI TRABALHAR!');
        return;
      }
      this.playerMaxHealth += 50;
      this.playerHealth = this.playerMaxHealth;
      this.hud.updateHealth(this.playerHealth, this.playerMaxHealth);
      this.hud.updateResources(this.tokens, this.money, this.armor);
      this.hud.showMessage('VIDA EXTRA! +50 HP');
    };
    const buyRevive = document.createElement('button');
    buyRevive.textContent = 'Reviver (1 token)';
    buyRevive.style.cssText = 'margin:4px;padding:6px 12px;';
    buyRevive.onclick = () => {
      if (this.tokens >= 1) {
        this.tokens -= 1;
        this.saveBalance();
        this.reviveCount++;
        this.hud.updateResources(this.tokens, this.money, this.armor);
        const countEl = document.getElementById('revive-count');
        if (countEl) countEl.textContent = Math.max(0, this.reviveCount - this.usedRevives);
        this.hud.showMessage('REVIVE COMPRADO!');
      } else {
        this.hud.showCooldownMessage('Sem tokens! :(');
      }
    };
    shop.appendChild(buyLife);
    shop.appendChild(buyRevive);
  }

  returnToMenu() {
    this.hideDeathScreen();
    this.endGame();
    this.destroy();
    if (typeof window !== 'undefined' && typeof window.returnToMainMenu === 'function') {
      window.returnToMainMenu();
    } else {
      location.reload();
    }
  }

  nextWave() {
    if (this.playerDead || this.bossActive) return;
    this.wave++;
    this.stats.waves = this.wave;
    this.addXp(50 + this.wave * 10);
    this.updateWaveDisplay();
    this.hud.showMessage(`WAVE ${this.wave}`);
    this.checkAchievements();
    if ((this.modeCfg && this.modeCfg.bossRush) || this.wave % 10 === 0) {
      this.spawnWaveBoss();
    } else if (this.wave % 5 === 0) {
      this.spawnMiniBoss();
      this.spawnWaveAnimals();
    } else {
      this.spawnWaveAnimals();
    }
  }

  spawnWaveAnimals() {
    const alive = this.getHostileTargets().length;
    const cap = 40 + this.wave * 2;
    const toSpawn = Math.max(1, Math.min(8 + this.wave, cap - alive));
    const types = ['jacare', 'tucano', 'anta', 'queixada', 'arara', 'sucuri', 'onca', 'loboguara', 'piranha', 'cascavel', 'tigre', 'leao', 'lobo', 'zumbi', 'esqueleto', 'demonio', 'golem', 'ogro', 'troll'];
    const roomIds = this.arena.getRoomIds();
    for (let i = 0; i < toSpawn; i++) {
      const roomId = roomIds[Math.floor(Math.random() * roomIds.length)];
      const sp = this.arena.getRandomSpawnInRoom(roomId);
      const type = types[Math.floor(Math.random() * types.length)];
      const animal = new Animal(this.scene, sp.x, sp.z, type, this.arena);
      this.applyModeToAnimal(animal);
      animal.dormant = false;
      animal.roomId = roomId;
      if (typeof animal.maxHealth === 'number') {
        animal.maxHealth = Math.round(animal.maxHealth * (1 + this.wave * 0.1));
        animal.health = animal.maxHealth;
      }
      if (typeof animal.attackDamage === 'number') {
        animal.attackDamage *= (1 + this.wave * 0.05);
      }
      this.targets.push(animal);
    }
  }

  spawnMiniBoss() {
    const spawn = this.pickBossSpawn();
    if (!spawn) return;
    this.bossActive = true;
    this.hud.showBossMessage('ANÃO VEI! O MINI GOVERNO APARECEU! ');
    this.hud.showBossBar();
    this.boss = new MiniBoss(this.scene, spawn.x, spawn.z, this.arena);
    this.boss.isMiniBoss = true;
    this.hud.updateBossHealth(this.boss.health || 500, this.boss.maxHealth || 500);
  }

  spawnWaveBoss() {
    const rows = this.arena.map.length;
    const cols = this.arena.map[0].length;
    const r = Math.floor(rows / 2);
    const c = Math.floor(cols / 2);
    const x = c * 4 + 2;
    const z = r * 4 + 2;
    this.bossActive = true;
    this.hud.showBossMessage('ANÃO VEI! O GOVERNO DA ONDA APARECEU!');
    this.hud.showBossBar();
    this.boss = new Boss(this.scene, x, z, this.arena);
    this.boss.isWaveBoss = true;
    this.hud.updateBossHealth(this.boss.health || 1000, this.boss.maxHealth || 1000);
  }

  createWaveDisplay() {
    if (this.waveDisplayCreated) return;
    const statsEl = document.getElementById('stats');
    this.waveDisplayEl = document.createElement('div');
    this.waveDisplayEl.id = 'wave-display';
    this.waveDisplayEl.style.cssText = 'color:#ffcc66;font-size:14px;margin-top:4px;';
    if (statsEl) statsEl.appendChild(this.waveDisplayEl);
    else {
      this.waveDisplayEl.style.cssText += 'position:absolute;top:10px;right:10px;z-index:50;';
      document.body.appendChild(this.waveDisplayEl);
    }
    this.waveDisplayCreated = true;
  }

  updateWaveDisplay() {
    if (!this.waveDisplayCreated) this.createWaveDisplay();
    if (this.waveDisplayEl) this.waveDisplayEl.textContent = `ONDA ${this.wave}`;
  }

  createCoinPickup(pos, money, tokens, granted) {
    const group = new THREE.Group();
    const coin = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.3, 0.3),
      new THREE.MeshLambertMaterial({ color: 0xffdd00 })
    );
    group.add(coin);
    const gx = pos ? pos.x : this.player.getPosition().x;
    const gz = pos ? pos.z : this.player.getPosition().z;
    group.position.set(gx, 1, gz);
    this.scene.add(group);
    this.drops.push({ mesh: group, x: gx, z: gz, type: 'drops', money, tokens, granted: !!granted, collected: false });
  }

  checkDrops() {
    const pos = this.player.getPosition();
    let nearest = null;
    let nearestDist = Infinity;
    for (const drop of this.drops) {
      if (drop.collected) continue;
      const dx = pos.x - drop.x;
      const dz = pos.z - drop.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < nearestDist) {
        nearest = drop;
        nearestDist = dist;
      }
      if (dist < 2.0) {
        drop.collected = true;
        this.scene.remove(drop.mesh);
        if (drop.granted) continue;
        this.money += drop.money;
        this.tokens += drop.tokens;
        this.saveBalance();
        this.hud.updateResources(this.tokens, this.money, this.armor);
        if (drop.money > 0) this.hud.showMessage(`+$${drop.money}`);
        if (drop.tokens > 0) this.hud.showMessage(`+${drop.tokens} TOKENS`);
      }
    }
    if (nearest && nearestDist < 2.0 && nearest !== this.nearPickup) {
      this.nearPickup = nearest;
      this.hud.showInteractPrompt();
    } else if (!nearest || nearestDist >= 2.0) {
      if (this.nearPickup) this.hud.hideInteractPrompt();
      this.nearPickup = null;
    }
  }

  collectNearPickup() {
    if (!this.nearPickup || this.nearPickup.collected) return;
    const drop = this.nearPickup;
    drop.collected = true;
    this.scene.remove(drop.mesh);
    if (!drop.granted) {
      this.money += drop.money;
      this.tokens += drop.tokens;
      this.saveBalance();
      this.hud.updateResources(this.tokens, this.money, this.armor);
      if (drop.money > 0) this.hud.showMessage(`+$${drop.money}`);
      if (drop.tokens > 0) this.hud.showMessage(`+${drop.tokens} TOKENS`);
    }
    this.nearPickup = null;
    this.hud.hideInteractPrompt();
  }

  applySkinVisuals() {
    if (!this.weapon || !this.weapon.weaponGroup) return;
    let color = null;
    if (this.skinVoid) color = 0x8844ff;
    else if (this.skinFlame) color = 0xff5522;
    else if (this.skinSteam) color = 0xaabbcc;
    if (color !== null) {
      this.weapon.weaponGroup.traverse(node => {
        if (node.isMesh && node.material) {
          if (Array.isArray(node.material)) node.material.forEach(m => { if (m.color) m.color.setHex(color); });
          else if (node.material.color) node.material.color.setHex(color);
        }
      });
    }
    const cross = document.getElementById('crosshair');
    if (cross) {
      if (this.skinVoid) cross.style.borderColor = '#8844ff';
      else if (this.skinFlame) cross.style.borderColor = '#ff5522';
      else if (this.skinSteam) cross.style.borderColor = '#aabbcc';
    }
  }

  updateHotbar() {
    if (!this.hud || typeof this.hud.updateHotbar !== 'function') return;
    const inv = this.weapon.inventory;
    if (this._lastHotbarIndex === this.weapon.currentIndex && this._lastHotbarLen === inv.length) return;
    this._lastHotbarIndex = this.weapon.currentIndex;
    this._lastHotbarLen = inv.length;
    this.hud.updateHotbar(inv, this.weapon.currentIndex, WEAPONS);
  }

  addChatMessage(name, color, message) {
    const container = document.getElementById('chat-messages');
    if (!container) return;
    const entry = document.createElement('div');
    entry.className = 'chat-entry';
    const nameSpan = document.createElement('span');
    nameSpan.style.color = color || '#ffffff';
    nameSpan.textContent = name + ': ';
    entry.appendChild(nameSpan);
    entry.append(message);
    container.appendChild(entry);
    while (container.children.length > 30) {
      container.removeChild(container.firstChild);
    }
    const chatEl = document.getElementById('chat');
    if (chatEl && this.mode === 'multiplayer') chatEl.style.display = 'block';
  }

  togglePause() {
    this.paused = !this.paused;
    let overlay = document.getElementById('pause-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'pause-overlay';
      overlay.style.cssText = 'position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,0.6);z-index:900;color:#fff;font-size:48px;font-family:sans-serif;pointer-events:none;';
      overlay.textContent = 'PAUSADO';
      document.body.appendChild(overlay);
    }
    overlay.style.display = this.paused ? 'flex' : 'none';
    if (this.paused) {
      this.player.unlock();
    } else {
      this.player.lock();
    }
  }

  setupAdminPanel() {
    const panel = document.getElementById('admin-panel');
    if (!panel) return;
    if (!this._adminSelected) this._adminSelected = {};
    this.buildAdminList('admin-animal-list', Object.keys(Animal.TYPES || {}), 'animal', this._adminSelected.animal);
    this.buildAdminList('admin-boss-list', ['GOVERNO FEDERAL', 'MINI BOSS'], 'boss', this._adminSelected.boss);
    this.buildAdminList('admin-weapon-list', Object.keys(WEAPONS), 'weapon', this._adminSelected.weapon);
    const btnCreate = document.getElementById('btn-create-animals');
    if (btnCreate) btnCreate.onclick = () => this.adminCreateAnimals();
    const btnBosses = document.getElementById('btn-create-bosses');
    if (btnBosses) btnBosses.onclick = () => this.adminCreateBosses();
    const btnWeapon = document.getElementById('btn-give-weapon');
    if (btnWeapon) btnWeapon.onclick = () => this.adminGiveWeapon();
    const btnAmmo = document.getElementById('btn-inf-ammo');
    if (btnAmmo) btnAmmo.onclick = () => this.adminToggleAmmo();
    const btnClose = document.getElementById('btn-admin-close');
    if (btnClose) btnClose.onclick = () => this.toggleAdminPanel(false);
  }

  buildAdminList(listId, values, kind, selectedValue) {
    const list = document.getElementById(listId);
    if (!list) return;
    list.innerHTML = '';
    values.forEach((value) => {
      const item = document.createElement('div');
      item.textContent = value;
      item.className = value === selectedValue ? 'selected' : '';
      item.onclick = () => {
        this._adminSelected[kind] = value;
        for (const child of list.children) child.className = child === item ? 'selected' : '';
      };
      list.appendChild(item);
    });
    if (!this._adminSelected[kind] && values.length > 0) {
      this._adminSelected[kind] = values[0];
      if (list.children[0]) list.children[0].className = 'selected';
    }
  }

  toggleAdminPanel(force) {
    if (this.mode !== 'test') return;
    this.adminMode = force !== undefined ? force : !this.adminMode;
    const panel = document.getElementById('admin-panel');
    if (!panel) return;
    panel.style.display = this.adminMode ? 'block' : 'none';
    if (this.adminMode) {
      this.setupAdminPanel();
      this.updateAdminAmmoText();
    }
  }

  adminCreateAnimals() {
    const countInput = document.getElementById('admin-animal-count');
    const count = Math.max(1, parseInt(countInput.value, 10) || 1);
    const type = this._adminSelected && this._adminSelected.animal
      ? this._adminSelected.animal
      : Object.keys(Animal.TYPES || {})[0];
    const roomIds = this.arena.getRoomIds();
    for (let i = 0; i < count; i++) {
      const roomId = roomIds[Math.floor(Math.random() * roomIds.length)];
      const sp = this.arena.getRandomSpawnInRoom(roomId);
      const animal = new Animal(this.scene, sp.x, sp.z, type, this.arena);
      this.applyModeToAnimal(animal);
      animal.dormant = false;
      this.targets.push(animal);
    }
    this.hud.updateRemaining(this.getHostileTargets().length);
    this.updateAnimalHighlight();
  }

  adminCreateBosses() {
    const countInput = document.getElementById('admin-boss-count');
    const count = Math.max(1, parseInt(countInput.value, 10) || 1);
    const type = this._adminSelected && this._adminSelected.boss
      ? this._adminSelected.boss
      : 'GOVERNO FEDERAL';
    for (let i = 0; i < count; i++) {
      const spawn = this.pickBossSpawn();
      if (!spawn) break;
      if (type === 'MINI BOSS') {
        this.bossActive = true;
        this.boss = new MiniBoss(this.scene, spawn.x, spawn.z, this.arena);
        this.boss.isMiniBoss = true;
      } else {
        this.bossActive = true;
        this.boss = new Boss(this.scene, spawn.x, spawn.z, this.arena);
      }
    }
    this.hud.showBossBar();
    if (this.boss) this.hud.updateBossHealth(this.boss.health || 1000, this.boss.maxHealth || 1000);
  }

  adminGiveWeapon() {
    const weaponId = this._adminSelected && this._adminSelected.weapon
      ? this._adminSelected.weapon
      : Object.keys(WEAPONS)[0];
    this.weapon.addWeapon(weaponId, 999);
    this.weapon.updateDisplay();
    this.weapon.updateInventoryDisplay();
    this.updateHotbar();
    this.stats.weaponsOwned = this.weapon.inventory.length;
    this.checkAchievements();
  }

  adminToggleAmmo() {
    this.infiniteAmmo = !this.infiniteAmmo;
    this.updateAdminAmmoText();
  }

  updateAdminAmmoText() {
    const btn = document.getElementById('btn-inf-ammo');
    if (btn) btn.textContent = 'INFINITA: ' + (this.infiniteAmmo ? 'TRUE' : 'FALSE');
  }

  addXp(amount) {
    this.xp += Math.round(amount * this.getXpMultiplier());
    let leveled = false;
    while (this.level < 100 && this.xp >= this.level * 100) {
      this.xp -= this.level * 100;
      this.level++;
      leveled = true;
    }
    if (this.level >= 100) this.xp = Math.min(this.xp, 99 * 100);
    if (this.hud && this.hud.updateLevel) this.hud.updateLevel(this.level, this.xp);
    if (leveled) {
      this.setLevel(this.level);
      this.checkAchievements();
    }
  }

  setLevel(newLevel) {
    this.level = newLevel;
    this.stats.level = newLevel;
    if (this.mode !== 'test') {
      const best = Number.parseInt(localStorage.getItem('capiquake_best_level'), 10) || 1;
      if (newLevel > best) localStorage.setItem('capiquake_best_level', String(newLevel));
    }
    if (this.hud && this.hud.updateLevel) this.hud.updateLevel(this.level, this.xp);
    this.hud.showMessage(`NIVEL ${this.level}!`);
  }

  tryRebirth() {
    if (this.mode === 'test') return; // modo teste: sem rebirth persistente
    if (this.level >= 100 && this.tokens >= 10000 && this.money >= 1000000) {
      this.rebirthLevel++;
      localStorage.setItem('capiquake_rebirth', this.rebirthLevel);
      const rt = (Number.parseInt(localStorage.getItem('capiquake_rt'), 10) || 0) + 1;
      localStorage.setItem('capiquake_rt', String(rt));
      this.level = 1;
      this.xp = 0;
      this.tokens = 0;
      this.money = 0;
      localStorage.setItem('capiquake_tokens', '0');
      localStorage.setItem('capiquake_money', '0');
      this.playerMaxHealth = 200 * Math.pow(2, this.rebirthLevel);
      this.stats.rebirths = this.rebirthLevel;
      this.checkAchievements();
      this.hud.showMessage(`REBIRTH! Dinheiro x${this.getMoneyMultiplier()}, Tokens x${this.getTokenMultiplier()}, XP x${this.getXpMultiplier()}, HP x${Math.pow(2, this.rebirthLevel)}!`);
    }
  }

  loadAchievementProgress() {
    try {
      const raw = localStorage.getItem('capiquake_achievement_progress');
      this.achievementProgress = raw ? JSON.parse(raw) : {};
    } catch (e) {
      this.achievementProgress = {};
    }
  }

  saveAchievementProgress() {
    localStorage.setItem('capiquake_achievement_progress', JSON.stringify(this.achievementProgress));
  }

  getStatValue(stat) {
    if (stat === 'level') return this.level || 0;
    if (stat === 'weaponsOwned') return this.weapon ? this.weapon.inventory.length : 0;
    return (this.stats && this.stats[stat]) || 0;
  }

  formatAchievementReward(reward) {
    if (!reward) return '';
    const parts = [];
    if (reward.money) parts.push('+R$' + reward.money.toLocaleString('pt-BR'));
    if (reward.tokens) parts.push('+' + reward.tokens + ' token' + (reward.tokens > 1 ? 's' : ''));
    return parts.join(' | ');
  }

  showAchievementNotification(def, rewardText) {
    const notif = document.getElementById('achievement-notification');
    const nameEl = document.getElementById('achievement-notif-name');
    if (!notif || !nameEl) return;
    let text = def.name + (def.rarity ? ' [' + def.rarity + ']' : '');
    if (rewardText) text += ' — ' + rewardText;
    nameEl.textContent = text;
    notif.classList.add('show');
    clearTimeout(this._achNotifTimeout);
    this._achNotifTimeout = setTimeout(() => notif.classList.remove('show'), 4500);
  }

  unlockAchievement(id) {
    if (this.mode === 'test') return;
    if (this.achievements.has(id)) return;
    const def = ACHIEVEMENTS.find(a => a.id === id);
    if (!def) return;
    this.achievements.add(id);
    localStorage.setItem('capiquake_achievements', JSON.stringify([...this.achievements]));
    if (id === 'revive_inf_5') {
      this.reviveCount = Infinity;
      localStorage.setItem('capiquake_revive_infinity', '1');
      this.hud.showMessage('REVIVE INFINITO DESBLOQUEADO!');
    }
    if (def.reward) {
      if (def.reward.money) this.money += def.reward.money;
      if (def.reward.tokens) this.tokens += def.reward.tokens;
      this.saveBalance();
      if (this.hud) this.hud.updateResources(this.tokens, this.money, this.armor);
    }
    this.showAchievementNotification(def, this.formatAchievementReward(def.reward));
  }

  checkAchievements() {
    for (const def of ACHIEVEMENTS) {
      if (this.achievements.has(def.id)) continue;

      if (def.type === 'instant' && typeof def.test === 'function') {
        if (def.test(this)) {
          this.unlockAchievement(def.id);
        }
      } else if (def.type === 'cumulative' && def.stat && def.target) {
        const current = this.getStatValue(def.stat);
        this.achievementProgress[def.id] = current;
        if (current >= def.target) {
          this.unlockAchievement(def.id);
        }
      }
    }
    this.saveAchievementProgress();
  }

  pickBossSpawn() {
    const MIN_SAFE_DIST = 25;
    const MIN_SAFE_DIST_SQ = MIN_SAFE_DIST * MIN_SAFE_DIST;

    const players = [];
    if (this.player) {
      const p = this.player.getPosition();
      players.push({ x: p.x, z: p.z });
    }
    for (const np of this.networkPlayers) {
      players.push({ x: np.x, z: np.z });
    }

    const candidates = [];
    for (const roomId of this.arena.getRoomIds()) {
      for (const pt of this.arena.getRoomSpawnPoints(roomId)) {
        if (this.arena.isPassable(pt.x, pt.z)) {
          candidates.push(pt);
        }
      }
    }
    if (candidates.length === 0) return null;

    let farthest = null;
    let farthestDistSq = -Infinity;
    let farthestSafe = null;
    let farthestSafeDistSq = -Infinity;

    for (const c of candidates) {
      let minDistSq = Infinity;
      for (const pl of players) {
        const dx = c.x - pl.x;
        const dz = c.z - pl.z;
        const sq = dx * dx + dz * dz;
        if (sq < minDistSq) minDistSq = sq;
      }

      if (minDistSq >= MIN_SAFE_DIST_SQ && minDistSq > farthestSafeDistSq) {
        farthestSafeDistSq = minDistSq;
        farthestSafe = c;
      }
      if (minDistSq > farthestDistSq) {
        farthestDistSq = minDistSq;
        farthest = c;
      }
    }

    return farthestSafe || farthest;
  }

spawnBoss() {
     const spawn = this.pickBossSpawn();
     if (!spawn) {
       this.bossActive = false;
       return;
     }
 
     this.bossActive = true;
     this.hud.showBossMessage('CHEFAO A VISTA!!!');
     this.hud.showBossBar();
     this.hud.updateBossHealth(1000, 1000);
 
     this.boss = new Boss(this.scene, spawn.x, spawn.z, this.arena);
   }

endGame() {
  if (this._gameEnded) return;
  this._gameEnded = true;
  this.running = false;
  this.player.unlock();
  this.hud.hideBossBar();
  this.hud.hide();
  const el = document.getElementById('inventory-screen');
  if (el) el.style.display = 'none';

  // Cleanup all entities
  for (const t of this.targets) {
    if (t.mesh) this.scene.remove(t.mesh);
  }
  if (this.boss) {
    if (this.boss.mesh) this.scene.remove(this.boss.mesh);
    for (const p of this.boss.projectiles) {
      this.scene.remove(p.mesh);
      if (p.trail) this.scene.remove(p.trail);
    }
    for (const m of this.boss.minions) {
      if (m.mesh) this.scene.remove(m.mesh);
      for (const p of m.projectiles) {
        this.scene.remove(p.mesh);
      }
    }
  }
  this.renderer.render();

  this.stats.matchesPlayed = (this.stats.matchesPlayed || 0) + 1;

  if (this.mode !== 'test') {
    try {
      const board = JSON.parse(localStorage.getItem('capiquake_leaderboard') || '[]');
      board.push({
        name: this.playerName,
        kills: this.stats.kills || 0,
        wave: this.wave || 1,
        mode: this.gameModeId || 'normal',
        won: !this.playerDead,
        date: Date.now()
      });
      board.sort((x, y) => y.kills - x.kills);
      localStorage.setItem('capiquake_leaderboard', JSON.stringify(board.slice(0, 10)));
    } catch (e) { /* ignore */ }
  }

  if (this.playerDead) {
    this.stats.matchesLost = (this.stats.matchesLost || 0) + 1;
  } else {
    this.stats.matchesWon = (this.stats.matchesWon || 0) + 1;
    if (this.usedReviveThisMatch) {
      this.stats.reviveWins = (this.stats.reviveWins || 0) + 1;
      this.checkAchievements();
    }
  }
  this.stats.survivalTime = Math.floor((Date.now() - this.gameStartTime) / 1000);
  this.saveStats();

  if (this.playerDead) {
    Audio.loseMusic();
  } else {
    Audio.winMusic();
    if (this.level >= 100 && this.tokens >= 10000 && this.money >= 1000000) {
      this.showRebirthOffer();
    }
  }
  Celebration.show(this.scores, this.playerDead, this.playerName, this.killedByBoss);
}

  showRebirthOffer() {
    let el = document.getElementById('rebirth-offer');
    if (!el) {
      el = document.createElement('div');
      el.id = 'rebirth-offer';
      el.style.cssText = 'position:fixed;bottom:60px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.85);border:2px solid #ffcc00;color:#fff;padding:16px 24px;border-radius:8px;z-index:1200;text-align:center;font-family:sans-serif;';
      el.innerHTML = '<h3 style="margin:0 0 8px;color:#ffcc00;">REBIRTH DISPONIVEL!</h3>' +
        '<p style="margin:0 0 12px;">Nivel 100+ com recursos suficientes. Reinicie com bonus permanentes!</p>' +
        '<button id="btn-rebirth" style="margin:4px;padding:8px 16px;">REBIRTH (+1)</button>' +
        '<button id="btn-rebirth-skip" style="margin:4px;padding:8px 16px;">Agora nao</button>';
      document.body.appendChild(el);
    }
    el.style.display = 'block';
    const btn = document.getElementById('btn-rebirth');
    if (btn) btn.onclick = () => {
      this.rebirthLevel++;
      if (this.mode !== 'test') {
        localStorage.setItem('capiquake_rebirth', this.rebirthLevel);
        const rtNow = (Number.parseInt(localStorage.getItem('capiquake_rt'), 10) || 0) + 1;
        localStorage.setItem('capiquake_rt', String(rtNow));
      }
      this.tokens = 0;
      this.money = 0;
      this.saveBalance();
      this.stats.rebirths = this.rebirthLevel;
      this.saveStats();
      this.hud.updateResources(0, 0, this.armor);
      if (el) el.style.display = 'none';
    };
    const skip = document.getElementById('btn-rebirth-skip');
    if (skip) skip.onclick = () => {
      if (el) el.style.display = 'none';
    };
  }

  updateBuffs(delta) {
    if (this.speedBoost) {
      this.speedBoostTimer -= delta;
      if (this.speedBoostTimer <= 0) {
        this.speedBoost = false;
        this.player.setSpeedMultiplier(1.0);
      }
    }
    if (this.modeCfg && this.modeCfg.regen && !this.playerDead && this.playerHealth < this.playerMaxHealth) {
      this.playerHealth = Math.min(this.playerMaxHealth, this.playerHealth + this.modeCfg.regen * delta);
      this.hud.updateHealth(this.playerHealth, this.playerMaxHealth);
    }
    if (this.invincible) {
      this.invincibleTimer -= delta;
      if (this.invincibleTimer <= 0) {
        this.invincible = false;
        this.hud.showMessage('Invencibilidade acabou!');
      }
    }
  }

  updateCooldowns(delta) {
    if (this.voidCooldown > 0) this.voidCooldown = Math.max(0, this.voidCooldown - delta);
    if (this.voidExplosionCooldown > 0) this.voidExplosionCooldown = Math.max(0, this.voidExplosionCooldown - delta);
    if (this.fartCooldown > 0) this.fartCooldown = Math.max(0, this.fartCooldown - delta);
    if (this.teleportCooldown > 0) this.teleportCooldown = Math.max(0, this.teleportCooldown - delta);
    if (this.speedRushCooldown > 0) this.speedRushCooldown = Math.max(0, this.speedRushCooldown - delta);
    if (this.reviveCooldown > 0) this.reviveCooldown = Math.max(0, this.reviveCooldown - delta);
    if (this.reviveCooldown <= 0) {
      const btn = document.getElementById('btn-revive');
      if (btn) btn.disabled = false;
    }
  }

  updateVoidAbility(delta) {
    if (!this.voidActive) return;
    this.voidTimer -= delta;
    if (this.voidTimer <= 0) {
      this.voidActive = false;
      this.hud.showMessage('Bah Tche Cabou a habilidade void...!');
    }
  }

  updateFartCloud(delta) {
    if (!this.fartCloud) return;
    this.fartCloudTimer -= delta;
    this.fartCloud.position.y += delta * 1.5;
    this.fartCloud.scale.multiplyScalar(1 + delta * 2);
    const targets = this.getCombatTargets().slice();
    for (const target of targets) {
      if (!target.alive) continue;
      const tp = target.mesh.position;
      const dist = Math.sqrt((tp.x - this.fartCloud.position.x) * (tp.x - this.fartCloud.position.x) + (tp.z - this.fartCloud.position.z) * (tp.z - this.fartCloud.position.z));
      if (dist < 3.5) {
        const damage = 1 * delta * 5;
        this.registerDamage(target, damage);
        const killed = target.takeDamage(damage);
        if (killed) {
          if (target === this.boss) {
            if (this.resolveBossKill(target)) this.endGame();
          } else {
            this.resolveKill(target, this.playerName);
          }
        }
      }
    }
    if (this.fartCloudTimer <= 0) {
      this.scene.remove(this.fartCloud);
      this.fartCloud = null;
    }
  }

  updateSpeedRush(delta) {
    if (this.speedRushTimer <= 0) return;
    this.speedRushTimer -= delta;
    if (this.speedRushTimer <= 0) {
      this.player.setSpeedMultiplier(this.baseSpeedMultiplier > 1 ? this.baseSpeedMultiplier : 1.0);
      this.hud.showMessage('Speed Rush acabou!');
    }
  }

  updateIceSlows(delta) {
    for (const target of this.targets.concat(this.boss ? [this.boss] : [])) {
      if (!target._iceSlowTimer) continue;
      target._iceSlowTimer -= delta;
      if (target._iceSlowTimer <= 0) {
        target._iceSlowTimer = 0;
        target.speed *= 2;
      }
    }
  }

  animate() {
    if (!this.running) return;
    requestAnimationFrame(() => this.animate());
    if (this.paused) return;

    const now = performance.now();
    const delta = (now - this.lastTime) / 1000;
    this.lastTime = now;

    if (this.mode !== 'test') {
      this.timeRemaining -= delta;
      if (this.timeRemaining <= 0) {
        this.timeRemaining = 0;
        this.endGame();
        return;
      }
      this.hud.updateTimer(this.timeRemaining);
    }

    this.updateCooldowns(delta);
    this.updateVoidAbility(delta);
    this.updateFartCloud(delta);
    this.updateSpeedRush(delta);
    this.updateIceSlows(delta);
    this.checkDrops();
    this.updateHotbar();

    this.updateLocalPlayerMesh();
    if (!this.playerDead && !this.inventoryOpen) {
      this.player.update(delta);
      this.hud.updateStamina(this.player.stamina, this.player.maxStamina);
      this.weapon.update(delta);
      this.processBoltHits();
      if (this.player.mouseHeld && this.weapon.currentWeapon === 'minigun') {
        this.handleShoot();
      }
      if (this.mode === 'multiplayer' && this.network && this.network.connected) {
        if (now - this._lastPosSend > 100) {
          this._lastPosSend = now;
          this.network.sendPosition(this.player.getPosition(), { y: this.player.euler.y });
        }
      }
    }
    this.updateBuffs(delta);
    this.arena.updateDoors(this.player.getPosition());

    for (const pickup of this.pickups) {
      if (pickup.collected) continue;
      const baseY = pickup.type === 'medkit' ? 0.6 : pickup.type === 'boost' ? 0.5 : pickup.type === 'potion' ? 0.55 : 0.5;
      pickup.mesh.position.y = baseY + Math.sin(now * 0.003) * 0.15;
      pickup.mesh.rotation.y += delta * 2;
    }

    for (const chest of this.chests) {
      chest.update(now);
    }

    if (!this.playerDead && !this.inventoryOpen) {
      this.checkPickups();
      this.checkChests();
      this.checkBotSales();
    }

    for (const target of this.targets) {
      if ((target.alive || target.dying) && !target.dormant) {
        const dmg = target.update(delta, this.player.getPosition());
        if (dmg && !this.playerDead) {
          if (this.invincible) continue;
          const dead = this.applyPlayerDamage(dmg);
          if (dead) {
            this.playerHealth = 0;
            this.playerDead = true;
            this.stats.deaths = (this.stats.deaths || 0) + 1;
            this.stats.deathStreak = (this.stats.deathStreak || 0) + 1;
            this.stats.killStreak = 0;
            this.checkAchievements();
            this.hud.updateHealth(0, this.playerMaxHealth);
            const killerName = target.config ? target.config.name : 'ANIMAL';
            this.hud.addKillEntry(killerName, this.playerName);
            this.hud.showMessage('CARA... TU MORREU!!');
            this.showDeathScreen();
          }
        }
      }
    }

    if (this.boss && this.boss.alive && !this.playerDead) {
      this.boss.update(delta, this.player.getPosition());
      const bossDmg = this.boss.getHitDamage();
      if (bossDmg > 0 && !this.invincible) {
        const dead = this.applyPlayerDamage(bossDmg);
        if (dead) {
          this.playerHealth = 0;
          this.playerDead = true;
          this.killedByBoss = true;
          this.stats.deaths = (this.stats.deaths || 0) + 1;
          this.stats.deathStreak = (this.stats.deathStreak || 0) + 1;
          this.stats.killStreak = 0;
          this.checkAchievements();
          this.hud.updateHealth(0, this.playerMaxHealth);
          this.hud.addKillEntry('GOVERNO FEDERAL', this.playerName);
          this.hud.showMessage('CARA... TU MORREU!!');
          this.showDeathScreen();
        }
      }
      this.hud.updateBossHealth(this.boss.health, this.boss.maxHealth);
    }

    for (const bot of this.bots) {
      if (!bot.alive) continue;
      const killed = bot.update(delta, this.targets);
      if (killed) {
        this.handleBotKill(bot, killed);
      }
      for (const target of this.targets) {
        if (!target.alive || target.dormant) continue;
        const d = target.mesh.position.distanceTo(bot.position);
        if (d < target.attackRange) {
          bot.takeDamage(target.attackDamage * delta);
        }
      }
      if (this.boss && this.boss.alive) {
        const db = this.boss.mesh.position.distanceTo(bot.position);
        if (db < 4) {
          bot.takeDamage(20 * delta);
        }
      }
    }

    if (this.mode === 'multiplayer') {
      for (const name of Object.keys(this.remotePlayers)) {
        const rp = this.remotePlayers[name];
        if (now - rp.lastSeen > 3000) {
          this.scene.remove(rp.mesh);
          delete this.remotePlayers[name];
          continue;
        }
        rp.mesh.position.set(rp.position.x, rp.position.y - 1.7, rp.position.z);
        rp.mesh.rotation.y = rp.rotationY;
      }
    }

    this.renderer.render();
  }

destroy() {
  if (this._destroyed) return;
  this._destroyed = true;
  this.running = false;
  this.player.unlock();
  this.renderer.destroy();
  this.hud.hide();
  if (this._keyHandler) this._keyHandler = null;
  
  if (this.player) {
    this.player.destroy?.();
    this.player = null;
  }
  
  if (this.scene) {
    this.scene.traverse(node => {
      node.geometry?.dispose();
      node.material?.dispose();
      node.texture?.dispose();
    });
    this.scene.clear();
  }
  
  if (this._animationId) cancelAnimationFrame(this._animationId);
}
}
