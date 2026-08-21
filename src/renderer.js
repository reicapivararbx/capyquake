import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'; // RoomEnvironment gives PBR materials neutral image-based light.

export class Renderer {
  constructor(theme) {
    const skyColor = theme ? (theme.sky || theme.fog) : 0x4a6a8a;
    const ambientColor = theme ? theme.ambient : 0x666666;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(skyColor);
    this.scene.fog = new THREE.Fog(skyColor, 40, 140);

    this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 200);
    this.camera.position.set(0, 1.7, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true }); // MSAA removes hard jaggies on animal silhouettes.
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap DPR so cinematic clarity does not explode GPU cost.
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Softer shadow filtering adds natural PBR contact.
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping; // Filmic curve keeps highlights rich instead of flat.
    this.renderer.toneMappingExposure = 1.1; // Slight lift balances ACES without washing out fog.
    this.renderer.outputColorSpace = THREE.SRGBColorSpace; // Explicit sRGB output matches modern Three color management.
    document.body.appendChild(this.renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(this.renderer); // PMREM prefilters the room light for rough PBR materials.
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture; // Room IBL gives MeshStandard/Physical materials usable reflections.
    this.scene.environment = envTexture; // Environment lighting prevents physical materials from rendering flat.
    this.scene.environmentIntensity = 0.55; // Keep IBL subtle so directional light still provides contrast.
    pmrem.dispose(); // Release temporary PMREM resources after the one-time bake.

    this.domElement = this.renderer.domElement;

    this.setupLighting(ambientColor);
    this.handleResize();
  }

  setupLighting(ambientColor) {
    const ambient = new THREE.AmbientLight(ambientColor, 0.8); // Lower ambient because RoomEnvironment now supplies broad PBR fill.
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
