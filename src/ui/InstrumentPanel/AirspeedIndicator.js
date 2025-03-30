export class SoundEffects {
  constructor() {
    this.audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    this.sounds = {
      engine: null,
      wind: null,
      stall: null,
      landing: null,
      collision: null,
    };
    this.gainNodes = {};
    this.loadSounds();
  }

  async loadSounds() {
    const soundFiles = {
      engine: "/assets/sounds/engine.mp3",
      wind: "/assets/sounds/wind.mp3",
      stall: "/assets/sounds/stall.mp3",
      landing: "/assets/sounds/landing.mp3",
      collision: "/assets/sounds/collision.mp3",
    };

    for (const [name, path] of Object.entries(soundFiles)) {
      const response = await fetch(path);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.sounds[name] = audioBuffer;

      // Create gain node for volume control
      this.gainNodes[name] = this.audioContext.createGain();
      this.gainNodes[name].connect(this.audioContext.destination);
    }
  }

  play(soundName, options = {}) {
    const source = this.audioContext.createBufferSource();
    source.buffer = this.sounds[soundName];

    // Connect through gain node
    source.connect(this.gainNodes[soundName]);

    // Apply options
    if (options.loop) source.loop = true;
    if (options.volume) this.gainNodes[soundName].gain.value = options.volume;
    if (options.pitch) source.playbackRate.value = options.pitch;

    source.start(0);
    return source;
  }

  updateEngineSound(rpm, throttle) {
    if (this.gainNodes.engine) {
      this.gainNodes.engine.gain.value = 0.3 + throttle * 0.7;
      const pitch = 0.5 + rpm / 2700;
      // Update engine pitch based on RPM
      this.play("engine", { pitch, loop: true });
    }
  }

  updateWindSound(airspeed) {
    if (this.gainNodes.wind) {
      const volume = Math.min(airspeed / 200, 1) * 0.5;
      this.gainNodes.wind.gain.value = volume;
    }
  }

  playStallWarning() {
    this.play("stall", { volume: 0.8 });
  }

  playLandingSound(impact) {
    const volume = Math.min(impact / 10, 1);
    this.play("landing", { volume });
  }

  playCollisionSound(impact) {
    const volume = Math.min(impact / 20, 1);
    this.play("collision", { volume });
  }
}
