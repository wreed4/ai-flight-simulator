export class {
  init() {
    this.models = {};
    this.textures = {};
    this.sounds = {};
  },

  loadModel(name, path) {
    return new Promise((resolve, reject) => {
      const loader = new THREE.GLTFLoader();
      loader.load(
        path,
        (model) => {
          this.models[name] = model;
          resolve(model);
        },
        undefined,
        (error) => reject(error),
      );
    });
  },

  loadTexture(name, path) {
    return new Promise((resolve, reject) => {
      const loader = new THREE.TextureLoader();
      loader.load(
        path,
        (texture) => {
          this.textures[name] = texture;
          resolve(texture);
        },
        undefined,
        (error) => reject(error),
      );
    });
  },

  loadSound(name, path) {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.src = path;
      audio.addEventListener("canplaythrough", () => {
        this.sounds[name] = audio;
        resolve(audio);
      });
      audio.addEventListener("error", (error) => reject(error));
    });
  },

  getModel(name) {
    return this.models[name];
  },

  getTexture(name) {
    return this.textures[name];
  },

  getSound(name) {
    return this.sounds[name];
  },

  dispose() {
    Object.values(this.models).forEach((model) => model.dispose());
    Object.values(this.textures).forEach((texture) => texture.dispose());
    Object.values(this.sounds).forEach((sound) => sound.pause());

    this.models = {};
    this.textures = {};
    this.sounds = {};
  },
};
