const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const masterGain = audioCtx.createGain();
masterGain.connect(audioCtx.destination);
const sfxGain = audioCtx.createGain();
sfxGain.connect(masterGain);

export class Audio {
  static master() {
    return sfxGain;
  }

  static setMasterVolume(v) {
    masterGain.gain.value = Math.max(0, Math.min(1, v));
  }

  static setSfxVolume(v) {
    sfxGain.gain.value = Math.max(0, Math.min(1, v));
  }

  static resume() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
  }

  static animalDeath() {
    Audio.resume();
    // Squeal sound: fast frequency sweep down with distortion
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const distortion = audioCtx.createWaveShaper();

    distortion.curve = Audio.makeDistortionCurve(200);

    osc.connect(distortion);
    distortion.connect(gain);
    gain.connect(Audio.master());

    const now = audioCtx.currentTime;
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);

    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    osc.start(now);
    osc.stop(now + 0.4);

    // Second layer: noise burst
    const bufferSize = audioCtx.sampleRate * 0.2;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.3, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    noise.connect(noiseGain);
    noiseGain.connect(audioCtx.destination);
    noise.start(now);
  }

  static gunshot() {
    Audio.resume();
    const now = audioCtx.currentTime;

    // Impact noise
    const bufferSize = audioCtx.sampleRate * 0.15;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.1));
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    noise.connect(gain);
    gain.connect(Audio.master());
    noise.start(now);

    // Low thump
    const osc = audioCtx.createOscillator();
    const oscGain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.1);
    oscGain.gain.setValueAtTime(0.4, now);
    oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc.connect(oscGain);
    oscGain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  static bambooHit() {
    Audio.resume();
    const now = audioCtx.currentTime;

    // Woody thwack - low thump
    const osc = audioCtx.createOscillator();
    const oscGain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.08);
    oscGain.gain.setValueAtTime(0.5, now);
    oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc.connect(oscGain);
    oscGain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.1);

    // Mid resonance (bamboo hollow sound)
    const osc2 = audioCtx.createOscillator();
    const osc2Gain = audioCtx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(800, now);
    osc2.frequency.exponentialRampToValueAtTime(400, now + 0.15);
    osc2Gain.gain.setValueAtTime(0.25, now);
    osc2Gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    osc2.connect(osc2Gain);
    osc2Gain.connect(audioCtx.destination);
    osc2.start(now);
    osc2.stop(now + 0.15);

    // Impact noise
    const bufferSize = audioCtx.sampleRate * 0.06;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.15));
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    const nGain = audioCtx.createGain();
    nGain.gain.setValueAtTime(0.3, now);
    nGain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
    noise.connect(nGain);
    nGain.connect(audioCtx.destination);
    noise.start(now);
  }

  static knifeSlash() {
    Audio.resume();
    const now = audioCtx.currentTime;

    // Fast whoosh
    const bufferSize = audioCtx.sampleRate * 0.12;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const env = Math.sin((i / bufferSize) * Math.PI);
      data[i] = (Math.random() * 2 - 1) * env;
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(2000, now);
    filter.frequency.linearRampToValueAtTime(6000, now + 0.1);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(Audio.master());
    noise.start(now);
  }

  static makeDistortionCurve(amount) {
    const samples = 44100;
    const curve = new Float32Array(samples);
    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1;
      curve[i] = ((Math.PI + amount) * x) / (Math.PI + amount * Math.abs(x));
    }
    return curve;
  }

  static animalScream() {
    Audio.resume();
    const now = audioCtx.currentTime;

    // Layer 1: High-pitched shriek
    const shriek = audioCtx.createOscillator();
    const shriekGain = audioCtx.createGain();
    const dist = audioCtx.createWaveShaper();
    dist.curve = Audio.makeDistortionCurve(400);
    shriek.type = 'sawtooth';
    shriek.frequency.setValueAtTime(1200, now);
    shriek.frequency.exponentialRampToValueAtTime(2000, now + 0.1);
    shriek.frequency.exponentialRampToValueAtTime(600, now + 0.5);
    shriek.frequency.exponentialRampToValueAtTime(200, now + 0.8);
    shriekGain.gain.setValueAtTime(0.8, now);
    shriekGain.gain.linearRampToValueAtTime(0.9, now + 0.1);
    shriekGain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
    shriek.connect(dist);
    dist.connect(shriekGain);
    shriekGain.connect(audioCtx.destination);
    shriek.start(now);
    shriek.stop(now + 0.8);

    // Layer 2: Low growl
    const growl = audioCtx.createOscillator();
    const growlGain = audioCtx.createGain();
    growl.type = 'square';
    growl.frequency.setValueAtTime(80, now);
    growl.frequency.linearRampToValueAtTime(50, now + 0.6);
    growlGain.gain.setValueAtTime(0.4, now);
    growlGain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
    growl.connect(growlGain);
    growlGain.connect(audioCtx.destination);
    growl.start(now);
    growl.stop(now + 0.6);

    // Layer 3: Noise burst
    const bufferSize = audioCtx.sampleRate * 0.4;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize) * 0.8;
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.5, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    noise.connect(noiseGain);
    noiseGain.connect(audioCtx.destination);
    noise.start(now);

    // Layer 4: Second shriek (offset for chorus effect)
    const shriek2 = audioCtx.createOscillator();
    const shriek2Gain = audioCtx.createGain();
    shriek2.type = 'sawtooth';
    shriek2.frequency.setValueAtTime(1400, now + 0.05);
    shriek2.frequency.exponentialRampToValueAtTime(800, now + 0.5);
    shriek2.frequency.exponentialRampToValueAtTime(150, now + 0.8);
    shriek2Gain.gain.setValueAtTime(0.6, now + 0.05);
    shriek2Gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);
    shriek2.connect(shriek2Gain);
    shriek2Gain.connect(audioCtx.destination);
    shriek2.start(now + 0.05);
    shriek2.stop(now + 0.8);
  }

  static crossbowShoot() {
    Audio.resume();
    const now = audioCtx.currentTime;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.2);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc.connect(gain);
    gain.connect(Audio.master());
    osc.start(now);
    osc.stop(now + 0.2);

    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1200, now);
    osc2.frequency.exponentialRampToValueAtTime(300, now + 0.15);
    gain2.gain.setValueAtTime(0.2, now);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.start(now);
    osc2.stop(now + 0.15);
  }

  static chestOpen() {
    Audio.resume();
    const now = audioCtx.currentTime;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.15);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc.connect(gain);
    gain.connect(Audio.master());
    osc.start(now);
    osc.stop(now + 0.2);

    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(2000, now + 0.1);
    osc2.frequency.exponentialRampToValueAtTime(4000, now + 0.15);
    gain2.gain.setValueAtTime(0.15, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.2);
  }

  static playerHurt() {
    Audio.resume();
    const now = audioCtx.currentTime;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    osc.connect(gain);
    gain.connect(Audio.master());
    osc.start(now);
    osc.stop(now + 0.15);

    const bufferSize = audioCtx.sampleRate * 0.1;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    const nGain = audioCtx.createGain();
    nGain.gain.setValueAtTime(0.3, now);
    nGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    noise.connect(nGain);
    nGain.connect(audioCtx.destination);
    noise.start(now);
  }

  static panting() {
    Audio.resume();
    const now = audioCtx.currentTime;

    const bufferSize = audioCtx.sampleRate * 0.3;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const env = Math.sin((i / bufferSize) * Math.PI);
      data[i] = (Math.random() * 2 - 1) * env;
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, now);
    filter.Q.setValueAtTime(2, now);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(Audio.master());
    noise.start(now);
  }

  static winMusic() {
    Audio.resume();
    const now = audioCtx.currentTime;
    const notes = [523, 659, 784, 1047, 1319, 1568];
    notes.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + i * 0.15);
      gain.gain.setValueAtTime(0.2, now + i * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.4);
      osc.connect(gain);
      gain.connect(Audio.master());
      osc.start(now + i * 0.15);
      osc.stop(now + i * 0.15 + 0.4);
    });
    const bass = audioCtx.createOscillator();
    const bassGain = audioCtx.createGain();
    bass.type = 'sine';
    bass.frequency.setValueAtTime(262, now);
    bass.frequency.setValueAtTime(330, now + 0.5);
    bass.frequency.setValueAtTime(392, now + 0.8);
    bassGain.gain.setValueAtTime(0.3, now);
    bassGain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);
    bass.connect(bassGain);
    bassGain.connect(audioCtx.destination);
    bass.start(now);
    bass.stop(now + 1.2);
  }

  static loseMusic() {
    Audio.resume();
    const now = audioCtx.currentTime;
    const notes = [440, 392, 349, 311, 262, 220];
    notes.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.3);
      gain.gain.setValueAtTime(0.2, now + i * 0.3);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.3 + 0.5);
      osc.connect(gain);
      gain.connect(Audio.master());
      osc.start(now + i * 0.3);
      osc.stop(now + i * 0.3 + 0.5);
    });
    const drone = audioCtx.createOscillator();
    const droneGain = audioCtx.createGain();
    drone.type = 'sawtooth';
    drone.frequency.setValueAtTime(110, now);
    drone.frequency.exponentialRampToValueAtTime(80, now + 2.0);
    droneGain.gain.setValueAtTime(0.15, now);
    droneGain.gain.exponentialRampToValueAtTime(0.01, now + 2.0);
    drone.connect(droneGain);
    droneGain.connect(audioCtx.destination);
    drone.start(now);
    drone.stop(now + 2.0);
  }
}
