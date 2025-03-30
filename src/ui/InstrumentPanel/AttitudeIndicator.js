export class {
  init() {
    this.soundEffects = {
      engineIdle: new Audio("assets/sounds/engine-idle.mp3"),
      engineFull: new Audio("assets/sounds/engine-full.mp3"),
      wind: new Audio("assets/sounds/wind.mp3"),
      touchdown: new Audio("assets/sounds/touchdown.mp3"),
      stall: new Audio("assets/sounds/stall.mp3"),
      crash: new Audio("assets/sounds/crash.mp3"),
      switch: new Audio("assets/sounds/switch.mp3"),
    };

    Object.values(this.soundEffects).forEach((sound) => {
      sound.load();
      sound.loop = true;
    });
  },

  play(soundName, options = {}) {
    const sound = this.soundEffects[soundName];
    if (sound) {
      sound.volume = options.volume || 1;
      sound.playbackRate = options.playbackRate || 1;
      sound.play();
    }
  },

  stop(soundName) {
    const sound = this.soundEffects[soundName];
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  },

  setVolume(soundName, volume) {
    const sound = this.soundEffects[soundName];
    if (sound) {
      sound.volume = Math.max(0, Math.min(1, volume));
    }
  },

  setPlaybackRate(soundName, rate) {
    const sound = this.soundEffects[soundName];
    if (sound) {
      sound.playbackRate = rate;
    }
  },
};
