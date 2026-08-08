import * as THREE from 'three';

export class Renderer {
  constructor(theme) {
    const skyColor = theme ? (theme.sky || theme.fog) : 0x4a6a8a;
    const ambientColor = theme ? theme.ambient : 0x666666;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(skyColor);
    this.scene.fog = new THREE.Fog(skyColor, 40, 140);

    this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 200);
    this.camera.position.set(0, 1.7, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: false });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(1);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.BasicShadowMap;
    document.body.appendChild(this.renderer.domElement);

    this.domElement = this.renderer.domElement;

    this.setupLighting(ambientColor);
    this.handleResize();
  }

  setupLighting(ambientColor) {
    const ambient = new THREE.AmbientLight(ambientColor, 1.4);
    this.scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xffffff, 0.7);
    sun.position.set(30, 50, 20);
    sun.castShadow = true;
    this.scene.add(sun);

    const fill = new THREE.DirectionalLight(0x886644, 0.3);
    fill.position.set(-20, 30, -10);
    this.scene.add(fill);
  }

  handleResize() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    document.body.removeChild(this.renderer.domElement);
    this.renderer.dispose();
  }
}
