export class {
  init() {
    this.loadedAssets = {};
    this.assetQueue = [];
    this.loadingPromises = [];
  },

  loadTexture(path) {
    return new Promise((resolve, reject) => {
      const texture = new THREE.TextureLoader().load(
        path,
        resolve,
        undefined,
        reject,
      );
    });
  },

  loadModel(path) {
    return new Promise((resolve, reject) => {
      const loader = new THREE.GLTFLoader();
      loader.load(
        path,
        (gltf) => {
          resolve(gltf.scene);
        },
        undefined,
        reject,
      );
    });
  },

  async loadAssets(assetManifest) {
    for (const [key, path] of Object.entries(assetManifest)) {
      const extension = path.split(".").pop().toLowerCase();

      if (["jpg", "png", "webp"].includes(extension)) {
        this.loadingPromises.push(
          this.loadTexture(path).then((texture) => {
            this.loadedAssets[key] = texture;
          }),
        );
      } else if (["gltf", "glb"].includes(extension)) {
        this.loadingPromises.push(
          this.loadModel(path).then((model) => {
            this.loadedAssets[key] = model;
          }),
        );
      }
    }

    await Promise.all(this.loadingPromises);
    return this.loadedAssets;
  },

  getAsset(key) {
    return this.loadedAssets[key];
  },

  dispose() {
    Object.values(this.loadedAssets).forEach((asset) => {
      if (asset.dispose) {
        asset.dispose();
      }
    });
    this.loadedAssets = {};
    this.loadingPromises = [];
  },
};
