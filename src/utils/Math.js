export class AudioEngine {
  constructor() {
    this.context = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.context.createGain();
    this.masterGain.connect(this.context.destination);

    this.sounds = new Map();
    this.sources = new Map();
  }

  async loadSound(name, url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
    this.sounds.set(name, audioBuffer);
  }

  play(name, options = {}) {
    const sound = this.sounds.get(name);
    if (!sound) return;

    const source = this.context.createBufferSource();
    source.buffer = sound;

    const gainNode = this.context.createGain();
    gainNode.gain.value = options.volume || 1;

    source.connect(gainNode);
    gainNode.connect(this.masterGain);

    source.loop = options.loop || false;
    source.start(0);

    this.sources.set(name, source);
    return source;
  }

  stop(name) {
    const source = this.sources.get(name);
    if (source) {
      source.stop();
      this.sources.delete(name);
    }
  }

  setVolume(volume) {
    this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
  }

  update(deltaTime) {
    // Update audio parameters based on aircraft state
    this.sources.forEach((source, name) => {
      if (name === "engine") {
        // Modify pitch based on engine RPM
        source.playbackRate.value =
          0.5 + aircraft.engine.rpm / aircraft.engine.maxRPM;
      }
    });
  }

  dispose() {
    this.sources.forEach((source) => source.stop());
    this.sources.clear();
    this.sounds.clear();
    this.context.close();
  }
}
