import * as THREE from 'three';

export class Terrain {
    constructor() {
        this.geometry = null;
        this.material = null;
        this.mesh = null;
        this.size = 1000;
        this.resolution = 128;
        this.heightMap = [];
    }

    init() {
        this.generateHeightMap();
        this.createTerrainMesh();
    }

    generateHeightMap() {
        this.heightMap = new Array(this.resolution);
        for (let x = 0; x < this.resolution; x++) {
            this.heightMap[x] = new Array(this.resolution);
            for (let z = 0; z < this.resolution; z++) {
                const nx = x / this.resolution - 0.5;
                const nz = z / this.resolution - 0.5;

                this.heightMap[x][z] =
                    Math.sin(nx * 5) * Math.cos(nz * 5) * 50 +
                    Math.sin(nx * 15) * Math.cos(nz * 15) * 20;
            }
        }
    }

    createTerrainMesh() {
        this.geometry = new THREE.PlaneGeometry(
            this.size,
            this.size,
            this.resolution - 1,
            this.resolution - 1
        );

        // Apply height map to geometry
        const vertices = this.geometry.attributes.position.array;
        for (let i = 0, j = 0; i < vertices.length; i += 3, j++) {
            const x = Math.floor(j % this.resolution);
            const z = Math.floor(j / this.resolution);
            if (x < this.resolution && z < this.resolution) {
                vertices[i + 1] = this.heightMap[x][z];
            }
        }

        this.geometry.computeVertexNormals();

        this.material = new THREE.MeshStandardMaterial({
            color: 0x3d5e3a,
            roughness: 0.8,
            metalness: 0.2,
            flatShading: false
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.receiveShadow = true;
    }

    update(deltaTime) {
        // Dynamic terrain updates if needed
    }

    getMesh() {
        return this.mesh;
    }

    getHeight(x, z) {
        // Convert world coordinates to heightmap coordinates
        const nx = Math.floor((x / this.size + 0.5) * this.resolution);
        const nz = Math.floor((z / this.size + 0.5) * this.resolution);

        if (nx >= 0 && nx < this.resolution && nz >= 0 && nz < this.resolution) {
            return this.heightMap[nx][nz];
        }
        return 0;
    }
}
