import { getRandomMaps } from './maps.js';
import { SHOP_SECTIONS, SHOP_ITEM_MAP } from './shop-data.js';

export class Menu {
  constructor() {
    this.menuEl = document.getElementById('menu');
    this.lobbyEl = document.getElementById('lobby');
    this.mapVoteEl = document.getElementById('map-vote');
    this.shopEl = document.getElementById('shop');
    this.btnSingle = document.getElementById('btn-singleplayer');
    this.btnMulti = document.getElementById('btn-multiplayer');
    this.btnStart = document.getElementById('btn-start-game');
    this.btnBack = document.getElementById('btn-back-menu');
    this.playersList = document.getElementById('players-list');
    this.mapOptionsEl = document.getElementById('map-options');
    this.selectedMap = null;
    this._mapVoteCallback = null;
    this._shopCallback = null;
    this.shopPurchases = {};
    this.ownedItems = new Set();
    this.reviveCount = 0;
    this.readBalances();
    this.setupShop();
  }

  getPlayerName() {
    const input = document.getElementById('player-name');
    return input.value.trim() || 'Jogador';
  }

  onSingleplayer(cb) {
    this.btnSingle.addEventListener('click', () => {
      const name = this.getPlayerName();
      this.hide();
      this.showMapVote((map) => {
        this.loadPurchases();
        this.readBalances();
        this.shopPurchases = this.buildPurchases();
        cb(name, map, this.shopPurchases);
      });
    });
  }

  onMultiplayer(cb) {
    this.btnMulti.addEventListener('click', cb);
  }

  onStartGame(cb) {
    this.btnStart.addEventListener('click', cb);
  }

  onBackToMenu(cb) {
    this.btnBack.addEventListener('click', cb);
  }

  show() {
    this.menuEl.style.display = 'flex';
  }

  hide() {
    this.menuEl.style.display = 'none';
  }

  showMapVote(callback) {
    this._mapVoteCallback = callback;
    this.selectedMap = null;
    this.mapVoteEl.style.display = 'flex';
    if (this.lobbyEl) this.lobbyEl.style.display = 'none';
    this.mapOptionsEl.innerHTML = '';

    const maps = getRandomMaps(3);
    maps.forEach((map, i) => {
      const card = document.createElement('div');
      card.className = 'map-card';

      const preview = document.createElement('div');
      preview.className = 'map-preview';
      preview.style.background = `linear-gradient(135deg, #${map.sky.toString(16).padStart(6,'0')}, #${map.floor.toString(16).padStart(6,'0')})`;
      card.appendChild(preview);

      const name = document.createElement('div');
      name.className = 'map-name';
      name.textContent = map.name;
      card.appendChild(name);

      card.addEventListener('click', () => {
        this.mapOptionsEl.querySelectorAll('.map-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.selectedMap = map;
        setTimeout(() => {
          this.hideMapVote();
          if (this._mapVoteCallback) this._mapVoteCallback(map);
        }, 500);
      });

      this.mapOptionsEl.appendChild(card);
    });
  }

  hideMapVote() {
    this.mapVoteEl.style.display = 'none';
  }

  showShop(callback) {
    this._shopCallback = callback;
    this.loadPurchases();
    this.readBalances();
    this.updateShopBalance();
    this.shopEl.style.display = 'flex';
    this.shopEl.querySelectorAll('.shop-item').forEach(btn => {
      btn.classList.toggle('bought', this.isOwned(btn.dataset.item));
    });
    this.updateShopCart();
  }

  hideShop() {
    this.shopEl.style.display = 'none';
  }

  showStandaloneShop(callback) {
    this._shopCallback = callback || null;
    this.loadPurchases();
    this.readBalances();
    this.updateShopBalance();
    const btnClose = document.getElementById('btn-start-game-shop');
    if (btnClose) btnClose.textContent = this._shopCallback ? 'INICIAR PARTIDA' : 'FECHAR';
    this.shopEl.style.display = 'flex';
    this.shopEl.querySelectorAll('.shop-item').forEach(btn => {
      btn.classList.toggle('bought', this.isOwned(btn.dataset.item));
    });
    this.updateShopCart();
  }

  hideStandaloneShop() {
    this.shopEl.style.display = 'none';
  }

  closeShopAndReturn() {
    this.shopPurchases = this.buildPurchases();
    this.hideShop();
    if (this._shopCallback) {
      const cb = this._shopCallback;
      this._shopCallback = null;
      cb(this.shopPurchases);
    } else if (typeof window !== 'undefined' && typeof window.returnToMainMenu === 'function') {
      const prev = window.__shopPreviousScreen || 'menu';
      this.hideStandaloneShop();
      if (prev === 'menu') {
        window.returnToMainMenu();
      } else if (prev === 'singleplayer' || prev === 'multiplayer') {
        if (window.__game && typeof window.__game.resumeFromShop === 'function') {
          window.__game.resumeFromShop();
        } else if (document.getElementById('hud')) {
          document.getElementById('hud').style.display = 'block';
        }
        if (window.__game) window.__game.running = true;
      }
    }
  }

  renderShopSections() {
    const container = document.getElementById('shop-sections');
    if (!container || container.childElementCount) return;
    for (const section of SHOP_SECTIONS) {
      const sec = document.createElement('div');
      sec.className = 'shop-section';
      const h3 = document.createElement('h3');
      h3.innerHTML = `<span class="sec-icon">${section.icon}</span>${section.title}<span class="sec-cur ${section.currency === 'money' ? 'money-cur' : 'token-cur'}">${section.currency === 'money' ? 'R$' : '🪙'}</span>`;
      sec.appendChild(h3);
      const grid = document.createElement('div');
      grid.className = 'shop-items';
      for (const it of section.items) {
        const btn = document.createElement('button');
        btn.className = 'shop-item';
        btn.dataset.item = it.item;
        btn.dataset.cost = it.cost;
        btn.dataset.currency = it.currency;
        if (it.purchasable === false) {
          btn.classList.add('bought', 'locked');
          btn.title = 'Item não comprável — em breve';
        } else {
          btn.title = `${it.name} - ${it.desc}`;
        }
        btn.innerHTML = `<span class="si-icon">${it.icon}</span>` +
          `<span class="si-info"><span class="si-name">${it.name}</span><span class="si-desc">${it.desc}</span></span>` +
          `<span class="si-price ${it.currency === 'money' ? 'money-cur' : 'token-cur'}">${it.currency === 'money' ? 'R$ ' + it.cost.toLocaleString('pt-BR') : it.cost + ' 🪙'}</span>`;
        grid.appendChild(btn);
      }
      sec.appendChild(grid);
      container.appendChild(sec);
    }
    document.getElementById('btn-convert-token-money').addEventListener('click', () => {
      this.readBalances();
      if (this.tokens < 1) {
        this.showConvertError('Você precisa de pelo menos 1 token para trocar.');
        return;
      }
      this.tokens -= 1;
      this.money += 1000;
      localStorage.setItem('capiquake_tokens', String(this.tokens));
      localStorage.setItem('capiquake_money', String(this.money));
      this.clearConvertError();
      this.updateShopBalance();
    });

    this.shopEl.querySelectorAll('.shop-item').forEach(btn => {
      btn.addEventListener('click', () => this.handleShopItemClick(btn));
    });
  }

  handleShopItemClick(btn) {
    const item = btn.dataset.item;
    const def = SHOP_ITEM_MAP[item];
    if ((def && def.purchasable === false) || btn.classList.contains('locked')) return;
    const isConsumable = !!(def && def.grant && def.grant.type === 'revive');
    if (!isConsumable && this.isOwned(item)) return;
    const cost = Number.parseInt(btn.dataset.cost, 10);
    const currency = btn.dataset.currency;
    this.readBalances();
    if (!Number.isSafeInteger(cost) || cost <= 0) return;
    if (currency === 'money' && this.money < cost) {
      this.updateShopCart();
      document.getElementById('shop-cart').textContent = 'Dinheiro insuficiente!';
      return;
    }
    if (currency === 'tokens' && this.tokens < cost) {
      document.getElementById('shop-cart').textContent = 'Tokens insuficientes!';
      return;
    }
    if (currency === 'money') {
      this.money -= cost;
      localStorage.setItem('capiquake_money', this.money);
    } else {
      this.tokens -= cost;
      localStorage.setItem('capiquake_tokens', this.tokens);
    }
    if (!isConsumable) this.ownedItems.add(item);
    this.savePurchases();
    this.shopPurchases = this.buildPurchases();
    btn.classList.add('bought');
    setTimeout(() => { if (isConsumable) btn.classList.remove('bought'); }, 600);
    this.updateShopBalance();
    this.updateShopCart();
  }

  setupShop() {
    this.renderShopSections();
    document.getElementById('btn-close-shop-top').addEventListener('click', () => {
      this.closeShopAndReturn();
    });
    document.getElementById('btn-convert-tokens').addEventListener('click', () => {
      this.readBalances();

      if (!Number.isSafeInteger(this.money) || this.money < 1000) {
        this.showConvertError('Você precisa de $1.000 para comprar 1 token.');
        return;
      }

      const newMoney = this.money - 1000;
      const newTokens = this.tokens + 1;
      this.money = newMoney;
      this.tokens = newTokens;
      localStorage.setItem('capiquake_money', newMoney);
      localStorage.setItem('capiquake_tokens', newTokens);
      this.clearConvertError();
      this.updateShopBalance();
    });


    document.getElementById('btn-start-game-shop').addEventListener('click', () => {
      this.shopPurchases = this.buildPurchases();
      this.hideShop();
      if (this._shopCallback) {
        this._shopCallback(this.shopPurchases);
        this._shopCallback = null;
      } else if (typeof window !== 'undefined' && typeof window.returnToMainMenu === 'function') {
        const prev = window.__shopPreviousScreen || 'menu';
        this.hideStandaloneShop();
        if (prev === 'menu') {
          this.show();
        }
      }
    });
  }

  loadPurchases() {
    this.ownedItems = new Set();
    this.reviveCount = 0;
    try {
      const raw = JSON.parse(localStorage.getItem('capiquake_purchases') || '{}');
      if (Array.isArray(raw.items)) {
        this.ownedItems = new Set(raw.items.filter(id => typeof id === 'string'));
      }
      if (Number.isSafeInteger(raw.revive) && raw.revive > 0) {
        this.reviveCount = Math.min(raw.revive, 3);
      }
    } catch (err) {
      this.ownedItems = new Set();
      this.reviveCount = 0;
    }
    this.shopPurchases = this.buildPurchases();
  }

  savePurchases() {
    try {
      localStorage.setItem('capiquake_purchases', JSON.stringify({
        items: Array.from(this.ownedItems),
        revive: this.reviveCount,
      }));
    } catch (err) {
      // storage unavailable — purchases are per-session only
    }
  }

  isOwned(item) {
    if (item === 'revive') return this.reviveCount >= 3;
    return this.ownedItems.has(item);
  }

  buildPurchases() {
    const p = {};
    for (const id of this.ownedItems) {
      this.applyItem(p, id);
    }
    if (this.reviveCount > 0) p.revive = this.reviveCount;
    return p;
  }

  applyItem(p, id) {
    const def = SHOP_ITEM_MAP[id];
    if (def && def.grant) {
      const g = def.grant;
      if (g.type === 'weapon') { p.weapons = p.weapons || {}; p.weapons[g.id] = true; return; }
      if (g.type === 'armorHp') { p.armorHpTotal = (p.armorHpTotal || 0) + g.hp; return; }
      if (g.type === 'ammo') {
        p.ammoReserve = p.ammoReserve || {};
        p.ammoReserve[g.weapon] = (p.ammoReserve[g.weapon] || 0) + g.amount;
        return;
      }
      if (g.type === 'revive') { this.reviveCount = Math.min(this.reviveCount + g.count, 99); return; }
      if (g.type === 'flag') { p.flags = p.flags || {}; p.flags[g.key] = true; return; }
    }
    switch (id) {
      case 'minigun': p.weapons = p.weapons || {}; p.weapons.minigun = true; break;
      case 'ak47': p.weapons = p.weapons || {}; p.weapons.ak47 = true; break;
      case 'armor25': p.armor = (p.armor || 0) + 25; break;
      case 'armor50': p.armor = (p.armor || 0) + 50; break;
      case 'speedBoost': p.speedBoost = true; break;
      case 'healthBoost': p.healthBoost = true; break;
      case 'ammo-bazuca': p.ammoBazuca = 100; break;
      case 'ammo-chicken': p.ammoChicken = 10; break;
      case 'ammo-sniper': p.ammoSniper = 10; break;
      case 'armor-leather': p.armorType = 'leather'; break;
      case 'armor-gold': p.armorType = 'gold'; break;
      case 'armor-iron': p.armorType = 'iron'; break;
      case 'armor-diamond': p.armorType = 'diamond'; break;
      case 'armor-void': p.armorType = 'void'; break;
      case 'void-explosion': p.voidExplosion = true; break;
      case 'teleport': p.teleport = true; break;
      case 'speed-rush': p.speedRush = true; break;
      case 'enchant-fire': p.enchantFire = true; break;
      case 'enchant-ice': p.enchantIce = true; break;
      case 'enchant-lightning': p.enchantLightning = true; break;
      case 'skin-void': p.skinVoid = true; break;
      case 'skin-flame': p.skinFlame = true; break;
      case 'skin-steam': p.skinSteam = true; break;
      case 'weapon-skin-void': p.weaponSkinVoid = true; break;
      case 'weapon-skin-gold': p.weaponSkinGold = true; break;
      case 'weapon-skin-cryogenic': p.weaponSkinCryogenic = true; break;
      default: break;
    }
  }

  updateShopCart() {
    const cart = document.getElementById('shop-cart');
    if (!cart) return;
    const keys = Object.keys(this.shopPurchases);
    cart.textContent = keys.length > 0 ? 'Comprado: ' + keys.join(', ') : '';
  }

  readBalances() {
    this.tokens = this.readBalance('capiquake_tokens');
    this.money = this.readBalance('capiquake_money');
  }

  readBalance(key) {
    const raw = localStorage.getItem(key);
    const value = Number.parseInt(raw, 10);
    return (raw !== null && Number.isSafeInteger(value) && value >= 0) ? value : 0;
  }

  showConvertError(message) {
    const el = document.getElementById('shop-convert-error');
    if (el) {
      el.textContent = message;
      el.hidden = false;
    }
  }

  clearConvertError() {
    const el = document.getElementById('shop-convert-error');
    if (el) el.hidden = true;
  }

  updateShopBalance() {
    document.getElementById('shop-tokens').textContent = 'TOKENS: ' + this.tokens;
    document.getElementById('shop-money').textContent = 'R$: ' + this.money;
  }

  showLobby() {
    this.menuEl.style.display = 'none';
    this.lobbyEl.style.display = 'flex';
  }

  hideLobby() {
    this.lobbyEl.style.display = 'none';
  }

  updatePlayersList(players) {
    const MAX_PLAYERS = 6;
    const list = this.playersList;
    if (!list) return;
    list.replaceChildren();
    const countEl = document.getElementById('lobby-count');
    const names = (players || []).map(p => p.name || 'Jogador');
    if (countEl) countEl.textContent = `${names.length}/${MAX_PLAYERS}`;
    for (let i = 0; i < MAX_PLAYERS; i++) {
      const slot = document.createElement('div');
      slot.className = 'player-slot';
      const avatar = document.createElement('span');
      avatar.className = 'slot-avatar';
      const name = document.createElement('span');
      name.className = 'slot-name';
      if (names[i]) {
        slot.classList.add('filled');
        avatar.style.background = players[i].color || '#7c3aed';
        avatar.textContent = names[i].charAt(0).toUpperCase();
        name.textContent = names[i];
      } else {
        avatar.textContent = '?';
        name.textContent = 'Aguardando...';
      }
      slot.appendChild(avatar);
      slot.appendChild(name);
      list.appendChild(slot);
    }
  }
}
