import * as THREE from 'three';

export class EntityLabel {
  constructor({ title, color = '#64ffda', accentBorder = '#64ffda55' }) {
    this.wrap = document.createElement('div');
    this.wrap.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;overflow:hidden;pointer-events:none;z-index:40;';
    this.el = document.createElement('div');
    this.el.style.cssText = [
      'position:absolute', 'transform:translate(-50%,-100%)',
      'background:rgba(12,10,22,.88)', 'border:1px solid ' + accentBorder,
      'border-radius:8px', 'padding:3px 9px', 'white-space:nowrap', 'pointer-events:none',
      "font:700 10px 'Segoe UI',system-ui,sans-serif", 'color:' + color,
      'display:flex', 'flex-direction:column', 'gap:2px', 'align-items:center'
    ].join(';');

    this.nameEl = document.createElement('span');
    this.nameEl.textContent = title;

    this.hpTrack = document.createElement('span');
    this.hpTrack.style.cssText = 'width:64px;height:5px;border-radius:999px;background:#ffffff22;overflow:hidden;display:block;';
    this.hpFill = document.createElement('i');
    this.hpFill.style.cssText = 'display:block;height:100%;width:100%;background:linear-gradient(90deg,#4ade80,#a3e635);border-radius:999px;';
    this.hpTrack.appendChild(this.hpFill);

    this.weaponEl = document.createElement('span');
    this.weaponEl.style.cssText = 'font-size:9px;color:#9aa0b4;font-weight:600;';

    this.el.append(this.nameEl, this.hpTrack, this.weaponEl);
    this.wrap.appendChild(this.el);
    document.body.appendChild(this.wrap);
    this._v = new THREE.Vector3();
  }

  setName(text) {
    if (this.nameEl.textContent !== text) this.nameEl.textContent = text;
  }

  setWeapon(text) {
    if (this.weaponEl.textContent !== text) this.weaponEl.textContent = text;
  }

  setHp(cur, max) {
    const pct = Math.max(0, Math.min(1, max > 0 ? cur / max : 0));
    this.hpFill.style.width = (pct * 100).toFixed(1) + '%';
    this.hpFill.style.background = pct > 0.5
      ? 'linear-gradient(90deg,#4ade80,#a3e635)'
      : pct > 0.25 ? 'linear-gradient(90deg,#fbbf24,#f59e0b)'
      : 'linear-gradient(90deg,#f87171,#dc2626)';
  }

  update(worldPos, camera, canvasW, canvasH) {
    if (!this._v) return;
    this._v.set(worldPos.x, worldPos.y, worldPos.z).project(camera);
    if (this._v.z > 1) {
      this.el.style.display = 'none';
      return;
    }
    this.el.style.display = 'flex';
    this.el.style.left = ((this._v.x * 0.5 + 0.5) * canvasW) + 'px';
    this.el.style.top = ((-this._v.y * 0.5 + 0.5) * canvasH) + 'px';
  }

  destroy() {
    this.wrap.remove();
  }
}
