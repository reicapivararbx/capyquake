import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'; // RoomEnvironment gives PBR materials neutral image-based light.

const NIGHT_SKY = 0x070a18;
const NIGHT_FOG_NEAR = 25;
const NIGHT_FOG_FAR = 95;
const NIGHT_TRANSITION_S = 30;

export class Renderer {
  constructor(theme) {
    const skyColor = theme ? (theme.sky || theme.fog) : 0x4a6a8a;
    const ambientColor = theme ? theme.ambient : 0x666666;

    this.daySky = new THREE.Color(skyColor);
    this.nightSky = new THREE.Color(NIGHT_SKY);
    this.dayAmbient = new THREE.Color(ambientColor);
    this.nightFactor = 0;

    this.scene = new THREE.Scene();
    this.scene.background = this.daySky.clone();
    this.scene.fog = new THREE.Fog(this.daySky.clone(), 40, 140);

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
    this.dayEnvIntensity = 0.55;
    this.scene.environmentIntensity = this.dayEnvIntensity; // Keep IBL subtle so directional light still provides contrast.
    pmrem.dispose(); // Release temporary PMREM resources after the one-time bake.

    this.domElement = this.renderer.domElement;

    this.setupLighting(ambientColor);
    this.handleResize();
  }

  setupLighting(ambientColor) {
    this.ambientLight = new THREE.AmbientLight(ambientColor, 0.8); // Lower ambient because RoomEnvironment now supplies broad PBR fill.
    this.scene.add(this.ambientLight);

    this.sunLight = new THREE.DirectionalLight(0xffffff, 0.7);
    this.sunLight.position.set(30, 50, 20);
    this.sunLight.castShadow = true;
    this.scene.add(this.sunLight);

    this.fillLight = new THREE.DirectionalLight(0x886644, 0.3);
    this.fillLight.position.set(-20, 30, -10);
    this.scene.add(this.fillLight);
  }

  setNightFactor(t) {
    const clamped = Math.max(0, Math.min(1, Number(t) || 0));
    if (clamped === this.nightFactor) return;
    this.nightFactor = clamped;

    this.scene.background.copy(this.daySky).lerp(this.nightSky, clamped);
    this.scene.fog.color.copy(this.scene.background);
    this.scene.fog.near = 40 + (NIGHT_FOG_NEAR - 40) * clamped;
    this.scene.fog.far = 140 + (NIGHT_FOG_FAR - 140) * clamped;

    this.ambientLight.intensity = 0.8 - 0.55 * clamped;
    this.sunLight.intensity = 0.7 - 0.55 * clamped;
    this.sunLight.color.setHSL(0.12 - 0.06 * clamped, 0.25 + 0.45 * clamped, 1 - 0.2 * clamped);
    this.fillLight.intensity = 0.3 - 0.22 * clamped;
    this.scene.environmentIntensity = this.dayEnvIntensity * (1 - 0.75 * clamped);
  }

  getNightFactor() {
    return this.nightFactor;
  }

  static get NIGHT_TRANSITION_S() {
    return NIGHT_TRANSITION_S;
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
