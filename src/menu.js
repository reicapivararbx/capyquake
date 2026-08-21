import { getRandomMaps } from './maps.js';

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

  setupShop() {
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

    this.shopEl.querySelectorAll('.shop-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.dataset.item;
        if (this.isOwned(item)) return;
        const cost = Number.parseInt(btn.dataset.cost, 10);
        const currency = btn.dataset.currency;
        this.readBalances();

        if (!Number.isSafeInteger(cost) || cost <= 0) return;
        if (currency === 'money' && (this.money === null || this.money < cost)) return;
        if (currency === 'tokens' && (this.tokens === null || this.tokens < cost)) return;

        if (currency === 'money') {
          this.money -= cost;
          localStorage.setItem('capiquake_money', this.money);
        } else if (currency === 'tokens') {
          this.tokens -= cost;
          localStorage.setItem('capiquake_tokens', this.tokens);
        } else {
          return;
        }

        if (item === 'revive') {
          this.reviveCount = Math.min(this.reviveCount + 1, 3);
        } else {
          this.ownedItems.add(item);
        }
        this.savePurchases();
        this.shopPurchases = this.buildPurchases();
        btn.classList.toggle('bought', this.isOwned(item));
        this.updateShopBalance();
        this.updateShopCart();
      });
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
    this.playersList.replaceChildren();
    players.forEach(p => {
      const entry = document.createElement('div');
      entry.className = 'player-entry';
      entry.textContent = p.name;
      this.playersList.appendChild(entry);
    });
  }
}
