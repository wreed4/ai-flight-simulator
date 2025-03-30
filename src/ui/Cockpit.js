export class {
  init() {
    this.sounds = new Map();
    this.audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    this.masterGain = this.audioContext.createGain();
    this.masterGain.connect(this.audioContext.destination);
  },

  loadSound(name, url) {
    return fetch(url)
      .then((response) => response.arrayBuffer())
      .then((buffer) => this.audioContext.decodeAudioData(buffer))
      .then((decodedData) => {
        this.sounds.set(name, decodedData);
      });
  },

  playSound(name, options = {}) {
    const sound = this.sounds.get(name);
    if (!sound) return;

    const source = this.audioContext.createBufferSource();
    source.buffer = sound;

    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = options.volume || 1;

    source.connect(gainNode);
    gainNode.connect(this.masterGain);

    source.loop = options.loop || false;
    source.start(0);

    return source;
  },

  setVolume(volume) {
    this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
  },

  suspend() {
    this.audioContext.suspend();
  },

  resume() {
    this.audioContext.resume();
  },
};
