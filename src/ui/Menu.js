export class {
  init() {
    this.model = null;
    this.textureLoader = new THREE.TextureLoader();
    this.gltfLoader = new THREE.GLTFLoader();
    this.audioLoader = new THREE.AudioLoader();
    this.loadingManager = new THREE.LoadingManager();
    this.assets = {
      models: {},
      textures: {},
      audio: {},
      shaders: {},
    };
  },

  async loadModel(name, path) {
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        path,
        (gltf) => {
          this.assets.models[name] = gltf;
          resolve(gltf);
        },
        null,
        reject,
      );
    });
  },

  async loadTexture(name, path) {
    return new Promise((resolve, reject) => {
      this.textureLoader.load(
        path,
        (texture) => {
          this.assets.textures[name] = texture;
          resolve(texture);
        },
        null,
        reject,
      );
    });
  },

  async loadAudio(name, path) {
    return new Promise((resolve, reject) => {
      this.audioLoader.load(
        path,
        (buffer) => {
          this.assets.audio[name] = buffer;
          resolve(buffer);
        },
        null,
        reject,
      );
    });
  },

  async loadShader(name, vertPath, fragPath) {
    const [vertexShader, fragmentShader] = await Promise.all([
      fetch(vertPath).then((r) => r.text()),
      fetch(fragPath).then((r) => r.text()),
    ]);

    this.assets.shaders[name] = {
      vertexShader,
      fragmentShader,
    };
  },

  getModel(name) {
    return this.assets.models[name];
  },

  getTexture(name) {
    return this.assets.textures[name];
  },

  getAudio(name) {
    return this.assets.audio[name];
  },

  getShader(name) {
    return this.assets.shaders[name];
  },
};
