import * as THREE from 'three';
import { Physics } from './Physics';
import { Aircraft } from '../aircraft/Aircraft';
import { Environment } from '../environment/Environment';
import { Renderer } from '../graphics/Renderer';
import { InputManager } from './InputManager';
import { AudioEngine } from '../audio/AudioEngine';

export class Engine {
    constructor() {
        console.log("Engine initializing");

        // Create components
        this.physics = new Physics();
        this.renderer = new Renderer();
        this.input = new InputManager();
        this.audio = new AudioEngine();
        this.environment = new Environment();

        // Create scene
        this.scene = new THREE.Scene();

        // Game state
        this.aircraft = null;
        this.lastTime = 0;
        this.deltaTime = 0;
        this.isRunning = false;
        this.isPaused = false;
        this.gameOver = false;

        // Camera settings
        this.cameraDistance = 50;
        this.cameraHeight = 15;
        this.cameraLag = 0.1;  // How much the camera lags behind aircraft movements (0-1)
        this.cameraPosition = new THREE.Vector3(0, 20, 50);
        this.cameraTarget = new THREE.Vector3(0, 0, 0);

        // Effects
        this.explosionEffect = null;

        // Environment objects
        this.trees = [];
        this.mountains = null;

        // Bind methods
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.gameLoop = this.gameLoop.bind(this);
    }

    init() {
        console.log("Engine init called");

        // Initialize subsystems
        this.physics.init();
        this.renderer.init();
        this.input.init();
        this.audio.init();
        this.environment.init();

        // Register pause handler
        this.input.registerKeyDownHandler('Space', () => {
            if (!this.gameOver) {
                this.isPaused = !this.isPaused;
                console.log("Game " + (this.isPaused ? "paused" : "resumed"));
            }
        });

        // Create and set up the aircraft
        this.aircraft = new Aircraft();
        this.scene.add(this.aircraft.getMesh());

        // Add environment elements to scene
        this.setupEnvironment();

        // Set up lighting
        this.setupLighting();

        // Set up a simple ground plane
        this.setupGround();

        // Configure camera
        this.setupCamera();

        console.log("Engine initialization complete");
    }

    setupEnvironment() {
        // Set scene background/fog
        this.scene.background = new THREE.Color(0x87CEEB); // Sky blue
        this.scene.fog = new THREE.Fog(0x87CEEB, 500, 5000); // Stronger fog for depth perception

        // Add visual features to enhance depth perception
        this.addDepthCues();
    }

    addDepthCues() {
        // Add grid for better ground visualization
        const gridHelper = new THREE.GridHelper(2000, 50, 0x000000, 0x444444);
        this.scene.add(gridHelper);

        // Add distant mountains
        this.addDistantMountains();

        // Add trees and other objects
        this.addRandomTrees();
    }

    addDistantMountains() {
        // Create mountain range geometry
        const mountainGeometry = new THREE.BufferGeometry();
        const mountainVertices = [];
        const mountainColors = [];

        for (let i = 0; i < 40; i++) {
            const angle = (i / 40) * Math.PI * 2;
            const radius = 3000 + Math.random() * 1000;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const height = 200 + Math.random() * 800;

            // Each mountain is a triangle
            mountainVertices.push(
                x - 300, 0, z,
                x, height, z,
                x + 300, 0, z
            );

            // Mountain colors (varying grays)
            const shade = 0.3 + Math.random() * 0.2;
            mountainColors.push(
                shade * 0.8, shade * 0.8, shade,
                shade + 0.1, shade + 0.1, shade + 0.2,
                shade * 0.8, shade * 0.8, shade
            );
        }

        mountainGeometry.setAttribute('position', new THREE.Float32BufferAttribute(mountainVertices, 3));
        mountainGeometry.setAttribute('color', new THREE.Float32BufferAttribute(mountainColors, 3));
        mountainGeometry.computeVertexNormals();

        const mountainMaterial = new THREE.MeshLambertMaterial({
            vertexColors: true,
            flatShading: true
        });

        this.mountains = new THREE.Mesh(mountainGeometry, mountainMaterial);
        this.scene.add(this.mountains);
    }

    addRandomTrees() {
        // Add many trees throughout the landscape
        for (let i = 0; i < 1000; i++) {
            const distance = Math.random() * 1500;
            const angle = Math.random() * Math.PI * 2;

            const x = Math.cos(angle) * distance;
            const z = Math.sin(angle) * distance;

            // Create tree
            const treeHeight = 10 + Math.random() * 40;

            // Tree trunk
            const trunkGeometry = new THREE.CylinderGeometry(1, 2, treeHeight * 0.4, 6);
            const trunkMaterial = new THREE.MeshLambertMaterial({color: 0x8B4513}); // Brown
            const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
            trunk.position.set(x, treeHeight * 0.2, z);

            // Tree foliage
            const foliageGeometry = new THREE.ConeGeometry(treeHeight * 0.2, treeHeight * 0.8, 8);
            const foliageMaterial = new THREE.MeshLambertMaterial({color: 0x228B22}); // Forest green
            const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
            foliage.position.set(x, treeHeight * 0.6, z);

            this.trees.push({trunk, foliage});
            this.scene.add(trunk);
            this.scene.add(foliage);
        }

        // Add some larger rocks/boulders too
        for (let i = 0; i < 200; i++) {
            const distance = Math.random() * 1500;
            const angle = Math.random() * Math.PI * 2;

            const x = Math.cos(angle) * distance;
            const z = Math.sin(angle) * distance;

            // Create rock
            const rockSize = 5 + Math.random() * 15;
            const rockGeometry = new THREE.DodecahedronGeometry(rockSize, 1);
            const rockMaterial = new THREE.MeshLambertMaterial({color: 0x808080}); // Gray
            const rock = new THREE.Mesh(rockGeometry, rockMaterial);

            // Slightly randomize rock orientation
            rock.rotation.x = Math.random() * Math.PI;
            rock.rotation.y = Math.random() * Math.PI;
            rock.rotation.z = Math.random() * Math.PI;

            rock.position.set(x, rockSize * 0.5, z);
            this.scene.add(rock);
        }
    }

    setupLighting() {
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0x666666);
        this.scene.add(ambientLight);

        // Add directional light (sun)
        const sunLight = new THREE.DirectionalLight(0xFFFFFF, 1);
        sunLight.position.set(500, 1000, -500);
        sunLight.castShadow = true;

        // Configure shadow properties
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.near = 500;
        sunLight.shadow.camera.far = 4000;
        sunLight.shadow.camera.left = -1000;
        sunLight.shadow.camera.right = 1000;
        sunLight.shadow.camera.top = 1000;
        sunLight.shadow.camera.bottom = -1000;

        this.scene.add(sunLight);

        // Add hemisphere light for better environment lighting
        const hemiLight = new THREE.HemisphereLight(0x87CEEB, 0x006400, 0.5);
        this.scene.add(hemiLight);
    }

    setupGround() {
        // Create a large ground plane
        const groundGeometry = new THREE.PlaneGeometry(10000, 10000, 128, 128);

        // Add some height variation to ground
        const vertices = groundGeometry.attributes.position.array;
        for (let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i];
            const z = vertices[i + 2];

            if (Math.sqrt(x * x + z * z) > 500) {
                vertices[i + 1] = Math.sin(x / 200) * Math.cos(z / 200) * 50;
            }
        }

        groundGeometry.computeVertexNormals();

        // Create terrain texture
        const textureSize = 512;
        const data = new Uint8Array(textureSize * textureSize * 3);

        for (let i = 0; i < textureSize; i++) {
            for (let j = 0; j < textureSize; j++) {
                const idx = (i * textureSize + j) * 3;

                // Base green color
                data[idx] = 30 + Math.random() * 20;     // R
                data[idx + 1] = 100 + Math.random() * 40; // G
                data[idx + 2] = 30 + Math.random() * 20;  // B

                // Add some texture variation
                if (Math.random() > 0.95) {
                    data[idx] += 40;
                    data[idx + 1] += 40;
                    data[idx + 2] += 10;
                }
            }
        }

        // Use RGBAFormat instead of RGBFormat (which is deprecated)
        const groundTexture = new THREE.DataTexture(data, textureSize, textureSize, THREE.RGBAFormat);
        groundTexture.wrapS = THREE.RepeatWrapping;
        groundTexture.wrapT = THREE.RepeatWrapping;
        groundTexture.repeat.set(10, 10);
        groundTexture.needsUpdate = true;

        const groundMaterial = new THREE.MeshStandardMaterial({
            map: groundTexture,
            roughness: 0.8,
            metalness: 0.2
        });

        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2; // Rotate to be horizontal
        ground.position.y = 0;
        ground.receiveShadow = true;
        this.scene.add(ground);
    }

    setupCamera() {
        // Initialize camera behind aircraft
        if (this.aircraft && this.renderer && this.renderer.camera) {
            this.renderer.camera.position.set(0, 20, 50);
            this.renderer.camera.lookAt(0, 0, 0);

            // Initialize camera target
            this.cameraTarget.copy(this.aircraft.position);
        }
    }

    handleKeyPress(event) {
        // Already handled by InputManager
    }

    showGameOverScreen() {
        // Create game over overlay
        const gameOverDiv = document.createElement('div');
        gameOverDiv.id = 'game-over';
        gameOverDiv.style.position = 'fixed';
        gameOverDiv.style.top = '0';
        gameOverDiv.style.left = '0';
        gameOverDiv.style.width = '100%';
        gameOverDiv.style.height = '100%';
        gameOverDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        gameOverDiv.style.color = 'white';
        gameOverDiv.style.display = 'flex';
        gameOverDiv.style.flexDirection = 'column';
        gameOverDiv.style.justifyContent = 'center';
        gameOverDiv.style.alignItems = 'center';
        gameOverDiv.style.zIndex = '2000';
        gameOverDiv.style.fontFamily = 'Arial, sans-serif';

        const title = document.createElement('h1');
        title.textContent = 'CRASH!';
        title.style.fontSize = '4rem';
        title.style.color = '#ff4444';
        title.style.margin = '0 0 20px 0';
        title.style.textShadow = '0 0 10px #ff0000';

        const message = document.createElement('p');
        message.textContent = 'Your aircraft has crashed.';
        message.style.fontSize = '1.5rem';
        message.style.margin = '0 0 30px 0';

        const restartButton = document.createElement('button');
        restartButton.textContent = 'Try Again';
        restartButton.style.backgroundColor = '#4CAF50';
        restartButton.style.color = 'white';
        restartButton.style.border = 'none';
        restartButton.style.padding = '15px 30px';
        restartButton.style.fontSize = '1.2rem';
        restartButton.style.borderRadius = '5px';
        restartButton.style.cursor = 'pointer';

        restartButton.addEventListener('click', () => {
            document.body.removeChild(gameOverDiv);
            window.location.reload();
        });

        gameOverDiv.appendChild(title);
        gameOverDiv.appendChild(message);
        gameOverDiv.appendChild(restartButton);

        document.body.appendChild(gameOverDiv);
    }

    start() {
        console.log("Engine starting game loop");
        this.isRunning = true;
        this.lastTime = performance.now();
        requestAnimationFrame(this.gameLoop);
    }

    gameLoop(timestamp) {
        if (!this.isRunning) return;

        // Calculate delta time in seconds
        this.deltaTime = Math.min(0.1, (timestamp - this.lastTime) / 1000);
        this.lastTime = timestamp;

        // Update only if not paused
        if (!this.isPaused) {
            this.update(this.deltaTime);
        }

        // Always render
        this.render();

        // Continue the loop
        requestAnimationFrame(this.gameLoop);
    }

    update(deltaTime) {
        // Process input
        this.input.update();

        // Update aircraft
        if (this.aircraft) {
            // Check for crash
            if (!this.gameOver && this.aircraft.checkGroundCollision(0)) {
                this.handleCrash();
            }

            this.aircraft.update(deltaTime, this.input);
            this.updateCameraPosition(deltaTime);
        }

        // Update explosion effect if active
        if (this.explosionEffect) {
            const isActive = this.explosionEffect.update();
            if (!isActive) {
                // Remove all explosion elements from scene
                if (this.explosionEffect.getElements) {
                    this.explosionEffect.getElements().forEach(element => {
                        this.scene.remove(element);
                    });
                } else if (this.explosionEffect.mesh) {
                    this.scene.remove(this.explosionEffect.mesh);
                }
                this.explosionEffect = null;
            }
        }

        // Update other systems
        this.physics.update(deltaTime);
        this.environment.update(deltaTime);
        this.audio.update(deltaTime);

        // Update HUD
        this.updateHUD();
    }

    handleCrash() {
        console.log("Handling crash!");
        this.gameOver = true;

        // Create explosion
        this.explosionEffect = this.aircraft.createExplosion();

        // Add all explosion elements to scene
        if (this.explosionEffect.getElements) {
            this.explosionEffect.getElements().forEach(element => {
                this.scene.add(element);
            });
        } else if (this.explosionEffect.mesh) {
            this.scene.add(this.explosionEffect.mesh);
        }

        // Hide aircraft mesh
        if (this.aircraft.mesh) {
            this.aircraft.mesh.visible = false;
        }

        // Show game over screen after a delay
        setTimeout(() => {
            this.showGameOverScreen();
        }, 2000);
    }

    updateCameraPosition(deltaTime) {
        if (!this.aircraft || !this.renderer || !this.renderer.camera) return;

        // Direction the aircraft is facing (forward vector)
        const aircraftDirection = new THREE.Vector3(0, 0, -1);
        aircraftDirection.applyEuler(this.aircraft.rotation);
        aircraftDirection.normalize();

        // Calculate ideal camera position: directly behind aircraft
        const idealPosition = new THREE.Vector3();
        idealPosition.copy(this.aircraft.position);

        // Move back by the camera distance
        idealPosition.add(aircraftDirection.multiplyScalar(-this.cameraDistance));

        // Add height
        idealPosition.y += this.cameraHeight;

        // Smooth camera motion with lerp
        this.cameraPosition.lerp(idealPosition, 1 - Math.pow(this.cameraLag, deltaTime * 60));

        // Set camera position
        this.renderer.camera.position.copy(this.cameraPosition);

        // Target position is always the aircraft
        this.cameraTarget.lerp(this.aircraft.position, 1 - Math.pow(this.cameraLag, deltaTime * 60));

        // Look at target
        this.renderer.camera.lookAt(this.cameraTarget);
    }

    updateHUD() {
        if (!this.aircraft) return;

        const hudElement = document.getElementById('hud');
        if (hudElement) {
            const info = this.aircraft.getInfo();

            // Format vertical speed
            const vSpeedFormatted = Math.abs(info.verticalSpeed) < 10
                ? "0"
                : (info.verticalSpeed > 0
                    ? "+" + Math.round(info.verticalSpeed)
                    : Math.round(info.verticalSpeed));

            hudElement.innerHTML = `
                <div>
                    <strong>Speed:</strong> ${Math.round(info.speed)} knots<br>
                    <strong>Altitude:</strong> ${Math.round(info.altitude)} feet<br>
                    <strong>V/S:</strong> ${vSpeedFormatted} ft/min<br>
                    <strong>Throttle:</strong> ${Math.round(info.throttle * 100)}%<br>
                    <strong>Pitch:</strong> ${Math.round(info.pitch)}°<br>
                    <strong>Roll:</strong> ${Math.round(info.roll)}°<br>
                    <strong>Heading:</strong> ${Math.round((info.yaw + 180) % 360)}°<br>
                    ${this.isPaused ? '<br><strong style="color: red">PAUSED</strong>' : ''}
                    ${info.isCrashed ? '<br><strong style="color: red">CRASHED!</strong>' : ''}
                </div>
                <div style="margin-top: 20px">
                    <strong>Controls:</strong><br>
                    W/S or ↑/↓: Pitch<br>
                    A/D: Roll<br>
                    ←/→: Yaw<br>
                    Shift/Ctrl: Throttle<br>
                    Space: Pause
                </div>
            `;
        }
    }

    render() {
        // Render the scene
        if (this.renderer) {
            this.renderer.render(this.scene);
        }
    }
}
