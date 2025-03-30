export class {
  // Audio system configuration
  config: {
    masterVolume: 1.0,
    channels: {
      engine: { volume: 0.8, maxSources: 4 },
      environment: { volume: 0.6, maxSources: 8 },
      effects: { volume: 0.7, maxSources: 16 },
      ui: { volume: 0.5, maxSources: 4 },
    },
  },

  // Sound source management
  sources: new Map(),

  // Initialize audio context and main gain node
  init() {
    this.context = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.context.createGain();
    this.masterGain.connect(this.context.destination);
    this.setMasterVolume(this.config.masterVolume);
  },

  // Load and decode audio file
  async loadSound(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return this.context.decodeAudioData(arrayBuffer);
  },

  // Create and manage sound source
  createSource(buffer, options = {}) {
    const source = this.context.createBufferSource();
    source.buffer = buffer;

    const gainNode = this.context.createGain();
    source.connect(gainNode);
    gainNode.connect(this.masterGain);

    return { source, gainNode };
  },

  // Set master volume
  setMasterVolume(value) {
    this.config.masterVolume = Math.max(0, Math.min(1, value));
    this.masterGain.gain.value = this.config.masterVolume;
  },

  // Play sound with options
  play(buffer, options = {}) {
    const { source, gainNode } = this.createSource(buffer, options);
    source.start(0);
    return { source, gainNode };
  },

  // Stop all sounds
  stopAll() {
    this.sources.forEach((source) => source.stop());
    this.sources.clear();
  },

  // Clean up resources
  dispose() {
    this.stopAll();
    this.context.close();
  },
};
