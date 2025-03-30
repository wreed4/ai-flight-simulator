import * as THREE from 'three';

export class Renderer {
    constructor() {
        console.log("Creating renderer");

        // Create scene and camera
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,  // Field of view
            window.innerWidth / window.innerHeight,  // Aspect ratio
            0.1,  // Near clipping plane
            20000  // Far clipping plane
        );

        // Create WebGL renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x87CEEB); // Sky blue background
        this.renderer.shadowMap.enabled = true;

        // Add to DOM
        if (document.body) {
            document.body.appendChild(this.renderer.domElement);
            console.log("Added renderer to DOM");
        } else {
            window.addEventListener('DOMContentLoaded', () => {
                document.body.appendChild(this.renderer.domElement);
                console.log("Added renderer to DOM after DOMContentLoaded");
            });
        }

        // Set up window resize handler
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    init() {
        console.log("Renderer initialized");
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    render(scene) {
        // Render the scene with our camera
        this.renderer.render(scene || this.scene, this.camera);
    }
}
