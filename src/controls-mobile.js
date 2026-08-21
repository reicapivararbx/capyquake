export class MobileControls {
  constructor(player) {
    this.player = player;
    this.container = null;
    this.joystick = null;
    this.joystickKnob = null;
    this.attackBtn = null;
    this.jumpBtn = null;
    this.sprintBtn = null;
    this.abilityBtn = null;
    
    this.joystickActive = false;
    this.joystickTouchId = null;
    this.cameraTouchId = null;
    this.lastCameraX = 0;
    this.lastCameraY = 0;
    
    this.createUI();
    this.setupListeners();
  }
  
  createUI() {
    // Create container div with id="mobile-controls"
    // Position: fixed, bottom: 0, left: 0, right: 0, height: 200px, z-index: 100
    // pointer-events: none on container, auto on children
    this.container = document.createElement('div');
    this.container.id = 'mobile-controls';
    this.container.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 240px;
      z-index: 100;
      pointer-events: none;
    `;
    
    // Left side: Virtual joystick (120x120px circle)
    //   - Outer circle: semi-transparent black background, border-radius: 50%
    //   - Inner knob: 50x50px, darker, border-radius: 50%
    //   - Position: absolute, bottom: 40px, left: 40px
    this.joystick = document.createElement('div');
    this.joystick.id = 'mobile-joystick';
    this.joystick.style.cssText = `
      position: absolute;
      bottom: 40px;
      left: 40px;
      width: 120px;
      height: 120px;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 50%;
      pointer-events: auto;
      touch-action: none;
    `;
    
    this.joystickKnob = document.createElement('div');
    this.joystickKnob.id = 'mobile-joystick-knob';
    this.joystickKnob.style.cssText = `
      position: absolute;
      top: 35px;
      left: 35px;
      width: 50px;
      height: 50px;
      background: rgba(0, 0, 0, 0.8);
      border-radius: 50%;
      pointer-events: none;
      transition: transform 0.1s ease-out;
    `;
    
    this.joystick.appendChild(this.joystickKnob);
    this.container.appendChild(this.joystick);
    
    // Right side: Action buttons
    //   - Attack button (red, 60x60px) — id="mobile-attack"
    //   - Jump button (blue, 60x60px) — id="mobile-jump"
    //   - Sprint button (yellow, 50x50px) — id="mobile-sprint"
    //   - Ability button (purple, 50x50px) — id="mobile-ability"
    //   - Position: absolute, bottom: 40px, right: 20px
    //   - Layout: attack top-right, jump below attack, sprint left of jump, ability left of sprint
    
    // Shared button styles
    const btnStyle = `
      position: absolute;
      border-radius: 50%;
      font-size: 12px;
      color: white;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: auto;
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
    `;
    
    // Attack button (red, 60x60px) — id="mobile-attack" — top-right
    this.attackBtn = document.createElement('button');
    this.attackBtn.id = 'mobile-attack';
    this.attackBtn.className = 'mobile-btn';
    this.attackBtn.textContent = 'ATK';
    this.attackBtn.style.cssText = btnStyle + `
      bottom: 100px;
      right: 20px;
      width: 60px;
      height: 60px;
      background: rgba(220, 20, 60, 0.8);
      border: 2px solid rgba(255, 255, 255, 0.3);
    `;
    
    // Jump button (blue, 60x60px) — id="mobile-jump" — below attack
    this.jumpBtn = document.createElement('button');
    this.jumpBtn.id = 'mobile-jump';
    this.jumpBtn.className = 'mobile-btn';
    this.jumpBtn.textContent = 'JUMP';
    this.jumpBtn.style.cssText = btnStyle + `
      bottom: 30px;
      right: 20px;
      width: 60px;
      height: 60px;
      background: rgba(30, 144, 255, 0.8);
      border: 2px solid rgba(255, 255, 255, 0.3);
    `;
    
    // Sprint button (yellow, 50x50px) — id="mobile-sprint" — left of jump
    this.sprintBtn = document.createElement('button');
    this.sprintBtn.id = 'mobile-sprint';
    this.sprintBtn.className = 'mobile-btn';
    this.sprintBtn.textContent = 'SPR';
    this.sprintBtn.style.cssText = btnStyle + `
      bottom: 30px;
      right: 90px;
      width: 50px;
      height: 50px;
      background: rgba(255, 215, 0, 0.8);
      border: 2px solid rgba(255, 255, 255, 0.3);
    `;
    
    // Ability button (purple, 50x50px) — id="mobile-ability" — left of sprint
    this.abilityBtn = document.createElement('button');
    this.abilityBtn.id = 'mobile-ability';
    this.abilityBtn.className = 'mobile-btn';
    this.abilityBtn.textContent = 'ABL';
    this.abilityBtn.style.cssText = btnStyle + `
      bottom: 30px;
      right: 150px;
      width: 50px;
      height: 50px;
      background: rgba(138, 43, 226, 0.8);
      border: 2px solid rgba(255, 255, 255, 0.3);
    `;
    
    const toggleStyle = `
      position: absolute;
      width: 44px;
      height: 44px;
      background: rgba(40, 40, 60, 0.85);
      border: 2px solid rgba(255, 255, 255, 0.35);
      border-radius: 10px;
      color: #fff;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: auto;
      touch-action: manipulation;
      user-select: none;
      -webkit-user-select: none;
    `;

    this.camBtn = document.createElement('button');
    this.camBtn.id = 'mobile-cam';
    this.camBtn.className = 'mobile-btn';
    this.camBtn.textContent = '📷';
    this.camBtn.style.cssText = toggleStyle + `
      bottom: 185px;
      right: 20px;
    `;
    this.camBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (this.player && typeof this.player.toggleCamera === 'function') {
        this.player.toggleCamera();
      }
    }, { passive: false });

    this.invBtn = document.createElement('button');
    this.invBtn.id = 'mobile-inv';
    this.invBtn.className = 'mobile-btn';
    this.invBtn.textContent = '🎒';
    this.invBtn.style.cssText = toggleStyle + `
      bottom: 185px;
      right: 74px;
    `;
    this.invBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const game = window.__game;
      if (game && typeof game.toggleInventoryScreen === 'function') {
        game.toggleInventoryScreen();
      }
    }, { passive: false });

    this.container.appendChild(this.attackBtn);
    this.container.appendChild(this.jumpBtn);
    this.container.appendChild(this.sprintBtn);
    this.container.appendChild(this.abilityBtn);
    this.container.appendChild(this.camBtn);
    this.container.appendChild(this.invBtn);

    document.body.appendChild(this.container);
  }
  
  setupListeners() {
    // Joystick touch events (on the joystick outer element):
    //   touchstart: record touchId, joystickActive = true
    //   touchmove: calculate delta from center, normalize to -1..1
    //     Set player.keys.forward/backward/left/right based on delta
    //     Move knob visually
    //   touchend: reset joystick, set all keys to false
    
    const joystickRect = this.joystick.getBoundingClientRect();
    const centerX = 60; // center of 120px joystick
    const centerY = 60;
    const maxRadius = 60;
    
    this.joystick.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.changedTouches[0];
      this.joystickActive = true;
      this.joystickTouchId = touch.identifier;
    }, { passive: false });
    
    this.joystick.addEventListener('touchmove', (e) => {
      e.preventDefault();
      for (const touch of e.changedTouches) {
        if (touch.identifier !== this.joystickTouchId) continue;
        
        const rect = this.joystick.getBoundingClientRect();
        const x = touch.clientX - rect.left - centerX;
        const y = touch.clientY - rect.top - centerY;
        
        const distance = Math.sqrt(x * x + y * y);
        const clampedDistance = Math.min(distance, maxRadius);
        const angle = Math.atan2(y, x);
        
        const knobX = Math.cos(angle) * clampedDistance;
        const knobY = Math.sin(angle) * clampedDistance;
        
        // Move knob visually
        this.joystickKnob.style.transform = `translate(${knobX}px, ${knobY}px)`;
        
        // Normalize to -1..1
        const normX = knobX / maxRadius;
        const normY = knobY / maxRadius;
        
        // Set player keys based on delta
        // Y axis: forward/backward (negative Y = forward)
        // X axis: left/right (negative X = left)
        const threshold = 0.15;
        
        this.player.keys.forward = normY < -threshold;
        this.player.keys.backward = normY > threshold;
        this.player.keys.left = normX < -threshold;
        this.player.keys.right = normX > threshold;
      }
    }, { passive: false });
    
    const handleJoystickEnd = (e) => {
      for (const touch of e.changedTouches) {
        if (touch.identifier === this.joystickTouchId) {
          this.joystickActive = false;
          this.joystickTouchId = null;
          this.joystickKnob.style.transform = 'translate(0px, 0px)';
          this.player.keys.forward = false;
          this.player.keys.backward = false;
          this.player.keys.left = false;
          this.player.keys.right = false;
          break;
        }
      }
    };
    
    this.joystick.addEventListener('touchend', handleJoystickEnd, { passive: false });
    this.joystick.addEventListener('touchcancel', handleJoystickEnd, { passive: false });
    
    // Camera touch events (on the right side of screen, NOT on buttons):
    //   touchstart: record touchId, lastCameraX/Y
    //   touchmove: calculate delta from last position
    //     Call player.rotateCamera(deltaX, deltaY) — this method will be added to player.js
    //     Update lastCameraX/Y
    
    const handleCameraTouchStart = (e) => {
      // Only handle touches on the right side of screen (not on buttons)
      const touch = e.changedTouches[0];
      const x = touch.clientX;
      const width = window.innerWidth;
      
      // Only activate if touch is on right half of screen and not on a button
      if (x > width / 2) {
        const target = document.elementFromPoint(x, touch.clientY);
        // Check if target is one of our buttons
        if (target && (target.id === 'mobile-attack' || target.id === 'mobile-jump' || 
            target.id === 'mobile-sprint' || target.id === 'mobile-ability' ||
            target.closest('.mobile-btn'))) {
          return;
        }
        this.cameraTouchId = touch.identifier;
        this.lastCameraX = touch.clientX;
        this.lastCameraY = touch.clientY;
      }
    };
    
    const handleCameraTouchMove = (e) => {
      for (const touch of e.changedTouches) {
        if (touch.identifier !== this.cameraTouchId) continue;
        
        const deltaX = touch.clientX - this.lastCameraX;
        const deltaY = touch.clientY - this.lastCameraY;
        
        // Call player.rotateCamera(deltaX, deltaY) — this method will be added to player.js
        if (this.player.rotateCamera) {
          this.player.rotateCamera(deltaX, deltaY);
        }
        
        this.lastCameraX = touch.clientX;
        this.lastCameraY = touch.clientY;
      }
    };
    
    const handleCameraTouchEnd = (e) => {
      for (const touch of e.changedTouches) {
        if (touch.identifier === this.cameraTouchId) {
          this.cameraTouchId = null;
          break;
        }
      }
    };
    
    document.addEventListener('touchstart', handleCameraTouchStart, { passive: false });
    document.addEventListener('touchmove', handleCameraTouchMove, { passive: false });
    document.addEventListener('touchend', handleCameraTouchEnd, { passive: false });
    document.addEventListener('touchcancel', handleCameraTouchEnd, { passive: false });
    
    this._cameraTouchHandlers = {
      start: handleCameraTouchStart,
      move: handleCameraTouchMove,
      end: handleCameraTouchEnd
    };
    
    // Attack button:
    //   touchstart: player.mouseHeld = true, trigger shootCallbacks
    //   touchend: player.mouseHeld = false
    
    this.attackBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.player.mouseHeld = true;
      this.player.shootCallbacks.forEach(cb => cb());
    }, { passive: false });
    
    this.attackBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.player.mouseHeld = false;
    }, { passive: false });
    
    this.attackBtn.addEventListener('touchcancel', (e) => {
      e.preventDefault();
      this.player.mouseHeld = false;
    }, { passive: false });
    
    // Jump button:
    //   touchstart: player.keys.jump = true
    //   touchend: player.keys.jump = false
    
    this.jumpBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.player.keys.jump = true;
    }, { passive: false });
    
    this.jumpBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.player.keys.jump = false;
    }, { passive: false });
    
    this.jumpBtn.addEventListener('touchcancel', (e) => {
      e.preventDefault();
      this.player.keys.jump = false;
    }, { passive: false });
    
    // Sprint button:
    //   touchstart: player.keys.sprint = true
    //   touchend: player.keys.sprint = false
    
    this.sprintBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.player.keys.sprint = true;
    }, { passive: false });
    
    this.sprintBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.player.keys.sprint = false;
    }, { passive: false });
    
    this.sprintBtn.addEventListener('touchcancel', (e) => {
      e.preventDefault();
      this.player.keys.sprint = false;
    }, { passive: false });
    
    // Ability button:
    //   touchstart: dispatch keyboard event for 'KeyF' (void ability)
    //   This reuses existing game.js key handling
    
    this.abilityBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const event = new KeyboardEvent('keydown', { code: 'KeyF', key: 'F' });
      document.dispatchEvent(event);
    }, { passive: false });
  }
  
  destroy() {
    // Remove container from DOM
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    
    // Remove camera event listeners
    if (this._cameraTouchHandlers) {
      document.removeEventListener('touchstart', this._cameraTouchHandlers.start, { passive: false });
      document.removeEventListener('touchmove', this._cameraTouchHandlers.move, { passive: false });
      document.removeEventListener('touchend', this._cameraTouchHandlers.end, { passive: false });
      document.removeEventListener('touchcancel', this._cameraTouchHandlers.end, { passive: false });
    }
    
    // Clean up references
    this.container = null;
    this.joystick = null;
    this.joystickKnob = null;
    this.attackBtn = null;
    this.jumpBtn = null;
    this.sprintBtn = null;
    this.abilityBtn = null;
  }
}