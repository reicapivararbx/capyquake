export class HUD {
  constructor() {
    this.hudEl = document.getElementById('hud');
    this.killCountEl = document.getElementById('kill-count');
    this.capyCountEl = document.getElementById('animal-count');
    this.messageEl = document.getElementById('message');
    this.healthBar = document.getElementById('health-bar');
    this.healthText = document.getElementById('health-text');
    this.damageFlash = document.getElementById('damage-flash');
    this.killFeed = document.getElementById('kill-feed');
    this.interactPrompt = document.getElementById('interact-prompt');
    this.timerEl = document.getElementById('match-timer');
    this.staminaBar = document.getElementById('stamina-bar');
    this.bossBarContainer = document.getElementById('boss-bar-container');
    this.bossBar = document.getElementById('boss-bar');
    this.bossBarLabel = document.getElementById('boss-bar-label');
    this.tokensEl = document.getElementById('tokens-display');
    this.moneyEl = document.getElementById('money-display');
    this.armorEl = document.getElementById('armor-display');
    this.crosshairEl = document.getElementById('crosshair');
    this.crosshairDefaultDisplay = this.crosshairEl ? this.crosshairEl.style.display : '';
    this.weaponDisplayEl = document.getElementById('weapon-display');
    this.messageTimeout = null;
    this.flashTimeout = null;
  }

  show() {
    this.hudEl.style.display = 'block';
    if (document.body.dataset.device === 'mobile') {
      this.adaptForMobile();
    }
  }

  adaptForMobile() {
    // Scale down HUD elements for smaller screens
    if (this.healthBar) {
      this.healthBar.style.height = '8px';
    }
    if (this.healthText) {
      this.healthText.style.fontSize = '10px';
    }
    if (this.staminaBar) {
      this.staminaBar.style.height = '6px';
    }
    if (this.killCountEl) {
      this.killCountEl.style.fontSize = '12px';
    }
    if (this.capyCountEl) {
      this.capyCountEl.style.fontSize = '12px';
    }
    if (this.timerEl) {
      this.timerEl.style.fontSize = '12px';
    }
    if (this.messageEl) {
      this.messageEl.style.fontSize = '14px';
    }
    if (this.killFeed) {
      this.killFeed.style.fontSize = '10px';
    }
    if (this.tokensEl) {
      this.tokensEl.style.fontSize = '10px';
    }
    if (this.moneyEl) {
      this.moneyEl.style.fontSize = '10px';
    }
    if (this.armorEl) {
      this.armorEl.style.fontSize = '10px';
    }
    if (this.bossBarLabel) {
      this.bossBarLabel.style.fontSize = '12px';
    }
    // Hide crosshair on mobile (touch aiming handles this differently)
    this.setCrosshairVisible(false);
  }

  hide() {
    this.hudEl.style.display = 'none';
  }

  updateKills(count) {
    this.killCountEl.textContent = count;
  }

  updateRemaining(count) {
    this.capyCountEl.textContent = count;
  }

  updateHealth(current, max) {
    const pct = Math.max(0, (current / max) * 100);
    this.healthBar.style.width = pct + '%';
    this.healthText.textContent = 'VIDA: ' + Math.ceil(current);
    if (pct < 25) {
      this.healthBar.style.background = 'linear-gradient(90deg, #880000, #aa0000)';
    } else if (pct < 50) {
      this.healthBar.style.background = 'linear-gradient(90deg, #aa4400, #cc2200)';
    } else {
      this.healthBar.style.background = 'linear-gradient(90deg, #cc0000, #ff2200)';
    }
  }

  showDamageFlash() {
    this.damageFlash.style.opacity = '1';
    if (this.flashTimeout) clearTimeout(this.flashTimeout);
    this.flashTimeout = setTimeout(() => {
      this.damageFlash.style.opacity = '0';
    }, 200);
  }

  addKillEntry(killer, victim) {
    const entry = document.createElement('div');
    entry.className = 'kill-entry';
    const killerSpan = document.createElement('span');
    killerSpan.className = 'killer';
    killerSpan.textContent = killer;
    const victimSpan = document.createElement('span');
    victimSpan.className = 'victim';
    victimSpan.textContent = victim;
    entry.appendChild(killerSpan);
    entry.append(' matou ');
    entry.appendChild(victimSpan);
    this.killFeed.appendChild(entry);

    while (this.killFeed.children.length > 6) {
      this.killFeed.removeChild(this.killFeed.firstChild);
    }

    setTimeout(() => {
      if (entry.parentNode) entry.parentNode.removeChild(entry);
    }, 4000);
  }

  showMessage(text) {
    this.messageEl.textContent = text;
    this.messageEl.style.opacity = '1';
    if (this.messageTimeout) clearTimeout(this.messageTimeout);
    this.messageTimeout = setTimeout(() => {
      this.messageEl.style.opacity = '0';
    }, 1500);
  }

  showCooldownMessage(text) {
    this.showMessage(text);
  }

  setCrosshairVisible(visible) {
    if (!this.crosshairEl) return;
    this.crosshairEl.style.display = visible ? this.crosshairDefaultDisplay : 'none';
  }

  setWeaponName(name) {
    if (this.weaponDisplayEl) this.weaponDisplayEl.textContent = name;
  }

  updateStamina(current, max) {
    if (!this.staminaBar) return;
    const pct = Math.max(0, (current / max) * 100);
    this.staminaBar.style.width = pct + '%';
    if (pct < 20) {
      this.staminaBar.style.background = 'linear-gradient(90deg, #663333, #aa4444)';
    } else {
      this.staminaBar.style.background = 'linear-gradient(90deg, #2266cc, #44aaff)';
    }
  }

  updateTimer(seconds) {
    if (!this.timerEl) return;
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    this.timerEl.textContent = m + ':' + (s < 10 ? '0' : '') + s;
    if (seconds < 60) {
      this.timerEl.style.color = '#ff4444';
    } else {
      this.timerEl.style.color = '#ffcc66';
    }
  }

  showBossMessage(text) {
    this.messageEl.textContent = text;
    this.messageEl.style.opacity = '1';
    this.messageEl.style.color = '#ff2222';
    this.messageEl.style.fontSize = '36px';
    if (this.messageTimeout) clearTimeout(this.messageTimeout);
    this.messageTimeout = setTimeout(() => {
      this.messageEl.style.opacity = '0';
      this.messageEl.style.color = '';
      this.messageEl.style.fontSize = '';
    }, 3000);
  }

  showInteractPrompt() {
    if (this.interactPrompt) this.interactPrompt.style.opacity = '1';
  }

  hideInteractPrompt() {
    if (this.interactPrompt) this.interactPrompt.style.opacity = '0';
  }

  showBossBar() {
    if (this.bossBarContainer) this.bossBarContainer.style.display = 'block';
    if (this.bossBarLabel) this.bossBarLabel.style.display = 'block';
  }

  updateBossHealth(current, max) {
    if (!this.bossBar || !this.bossBarLabel) return;
    const pct = Math.max(0, (current / max) * 100);
    this.bossBar.style.width = pct + '%';
    this.bossBarLabel.textContent = 'Chefe Final | HP ' + Math.ceil(current);
  }

  hideBossBar() {
    if (this.bossBarContainer) this.bossBarContainer.style.display = 'none';
    if (this.bossBarLabel) this.bossBarLabel.style.display = 'none';
  }

  updateResources(tokens, money, armor) {
    if (this.tokensEl) this.tokensEl.textContent = 'TOKENS: ' + tokens;
    if (this.moneyEl) this.moneyEl.textContent = 'R$: ' + money;
    if (this.armorEl) this.armorEl.textContent = 'ARMADURA: ' + armor;
  }

  updateHotbar(inventory, currentIndex, WEAPONS) {
    let bar = document.getElementById('hotbar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'hotbar';
      bar.style.cssText = 'position:fixed;bottom:10px;left:50%;transform:translateX(-50%);display:flex;gap:6px;z-index:40;font-family:sans-serif;';
      document.body.appendChild(bar);
    }
    bar.innerHTML = '';
    for (let i = 0; i < inventory.length; i++) {
      const def = WEAPONS[inventory[i]];
      const slot = document.createElement('div');
      slot.style.cssText = 'min-width:48px;padding:4px 8px;border:2px solid ' + (i === currentIndex ? '#ffdd00' : '#555') + ';background:rgba(0,0,0,0.6);color:#fff;border-radius:4px;text-align:center;font-size:11px;';
      slot.innerHTML = '<div>' + (i + 1) + '</div><div>' + (def ? (def.name || inventory[i]) : inventory[i]) + '</div>';
      bar.appendChild(slot);
    }
  }
}
