import * as THREE from 'three';

export class Aircraft {
    constructor() {
        console.log("Creating aircraft");

        // Position and orientation
        this.position = new THREE.Vector3(0, 150, 0);
        this.rotation = new THREE.Euler(0, 0, 0, 'ZYX');
        this.velocity = new THREE.Vector3(0, 0, 50); // Start with forward speed

        // Aircraft properties
        this.throttle = 0.5;
        this.speed = 100;
        this.maxSpeed = 200;
        this.minSpeed = 50;
        this.turnRate = 0.6;  // Degrees per second

        // Control states
        this.pitchInput = 0;
        this.rollInput = 0;
        this.yawInput = 0;
        this.throttleInput = 0;

        // Crash state
        this.isCrashed = false;

        // Debug for controls
        this.lastControlsDebug = Date.now();

        // Create the visual model
        this.createMesh();
    }

    createMesh() {
        // Create aircraft group
        this.mesh = new THREE.Group();

        // Create a simple aircraft shape with a more distinct front/back
        // Fuselage
        const fuselageGeometry = new THREE.CylinderGeometry(2, 3, 20, 8);
        fuselageGeometry.rotateX(Math.PI / 2); // Orient along z-axis
        const fuselageMaterial = new THREE.MeshPhongMaterial({ color: 0xC0C0C0 });
        const fuselage = new THREE.Mesh(fuselageGeometry, fuselageMaterial);
        fuselage.position.z = 0;
        this.mesh.add(fuselage);

        // Cockpit (to clearly indicate front)
        const cockpitGeometry = new THREE.SphereGeometry(2.5, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2);
        cockpitGeometry.rotateX(Math.PI / 2);
        const cockpitMaterial = new THREE.MeshPhongMaterial({ color: 0x333333, transparent: true, opacity: 0.7 });
        const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
        cockpit.position.z = 8; // Place at front
        this.mesh.add(cockpit);

        // Wings
        const wingGeometry = new THREE.BoxGeometry(30, 1, 5);
        const wingMaterial = new THREE.MeshPhongMaterial({ color: 0x909090 });
        const wings = new THREE.Mesh(wingGeometry, wingMaterial);
        wings.position.y = 0;
        this.mesh.add(wings);

        // Tail
        const tailGeometry = new THREE.BoxGeometry(10, 1, 3);
        const tailMaterial = new THREE.MeshPhongMaterial({ color: 0x909090 });
        const tail = new THREE.Mesh(tailGeometry, tailMaterial);
        tail.position.z = -8;
        tail.position.y = 2;
        this.mesh.add(tail);

        // Vertical stabilizer
        const vStabGeometry = new THREE.BoxGeometry(1, 6, 4);
        const vStabMaterial = new THREE.MeshPhongMaterial({ color: 0x909090 });
        const vStab = new THREE.Mesh(vStabGeometry, vStabMaterial);
        vStab.position.z = -8;
        vStab.position.y = 4;
        this.mesh.add(vStab);

        // Add nose cone to make direction clearer
        const noseGeometry = new THREE.ConeGeometry(2, 4, 8);
        noseGeometry.rotateX(-Math.PI / 2); // Point forward
        const noseMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        const nose = new THREE.Mesh(noseGeometry, noseMaterial);
        nose.position.z = 10;
        this.mesh.add(nose);

        // The entire aircraft model is facing the +Z direction
        // This matches the camera and makes controls more intuitive

        console.log("Aircraft mesh created");
    }

    createExplosion() {
        // Create explosion particle system with more particles and larger size
        const particleCount = 1000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        // Create particles with random positions, colors, and sizes
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;

            // Random position in sphere
            const radius = Math.random() * 30;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;

            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);

            // Colors: red/orange/yellow gradient
            const colorType = Math.random();
            if (colorType < 0.6) {
                // Orange/red
                colors[i3] = Math.random() * 0.3 + 0.7; // 0.7-1.0 (red)
                colors[i3 + 1] = Math.random() * 0.5;   // 0.0-0.5 (green)
                colors[i3 + 2] = 0.0;                   // 0.0 (blue)
            } else if (colorType < 0.9) {
                // Yellow
                colors[i3] = Math.random() * 0.2 + 0.8;   // 0.8-1.0 (red)
                colors[i3 + 1] = Math.random() * 0.2 + 0.8; // 0.8-1.0 (green)
                colors[i3 + 2] = 0.0;                     // 0.0 (blue)
            } else {
                // Smoke (gray)
                const gray = Math.random() * 0.5 + 0.2;
                colors[i3] = gray;
                colors[i3 + 1] = gray;
                colors[i3 + 2] = gray;
            }

            // Particle sizes (varying)
            sizes[i] = Math.random() * 8 + 2;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
            size: 3,
            vertexColors: true,
            transparent: true,
            opacity: 1.0,
            sizeAttenuation: true
        });

        const explosion = new THREE.Points(geometry, material);
        explosion.position.copy(this.position);

        // Add a point light at explosion location
        const light = new THREE.PointLight(0xff5500, 5, 100);
        light.position.copy(this.position);

        // Add a flare halo
        const flareGeometry = new THREE.SphereGeometry(10, 32, 32);
        const flareMaterial = new THREE.MeshBasicMaterial({
            color: 0xff7700,
            transparent: true,
            opacity: 0.7
        });

        const flare = new THREE.Mesh(flareGeometry, flareMaterial);
        flare.position.copy(this.position);

        return {
            mesh: explosion,
            light: light,
            flare: flare,
            createdAt: Date.now(),
            update: function() {
                const age = (Date.now() - this.createdAt) / 1000;

                // Expand the explosion
                const scale = 1 + age * 2;
                this.mesh.scale.set(scale, scale, scale);

                // Fade out
                this.mesh.material.opacity = Math.max(0, 1.5 - age);

                // Light intensity fades faster
                if (this.light.intensity > 0) {
                    this.light.intensity = Math.max(0, 5 - age * 5);
                }

                // Flare shrinks and fades
                if (this.flare.material.opacity > 0) {
                    this.flare.material.opacity = Math.max(0, 0.7 - age);
                    const flareScale = Math.max(1, 4 - age * 3);
                    this.flare.scale.set(flareScale, flareScale, flareScale);
                }

                // Return true if still active
                return this.mesh.material.opacity > 0;
            },
            getElements: function() {
                return [this.mesh, this.light, this.flare];
            }
        };
    }

    handleInput(inputManager, deltaTime) {
        if (this.isCrashed) return;

        // Reset control inputs
        this.pitchInput = 0;
        this.rollInput = 0;
        this.yawInput = 0;
        this.throttleInput = 0;

        if (!inputManager) return;

        // Process pitch control (W/S keys and Up/Down arrows)
        if (inputManager.isKeyPressed('KeyW') || inputManager.isKeyPressed('ArrowUp')) {
            this.pitchInput -= 1; // Nose up is negative pitch in this coordinate system
        }

        if (inputManager.isKeyPressed('KeyS') || inputManager.isKeyPressed('ArrowDown')) {
            this.pitchInput += 1; // Nose down is positive pitch
        }

        // Process roll control (A/D keys)
        if (inputManager.isKeyPressed('KeyA')) {
            this.rollInput += 1; // Roll left
            this.yawInput -= 0.5; // Coordinated turn
        }

        if (inputManager.isKeyPressed('KeyD')) {
            this.rollInput -= 1; // Roll right
            this.yawInput += 0.5; // Coordinated turn
        }

        // Process yaw control (Left/Right arrows)
        if (inputManager.isKeyPressed('ArrowLeft')) {
            this.yawInput -= 1;
        }

        if (inputManager.isKeyPressed('ArrowRight')) {
            this.yawInput += 1;
        }

        // Process throttle (Shift/Control keys)
        if (inputManager.isKeyPressed('ShiftLeft') || inputManager.isKeyPressed('ShiftRight')) {
            this.throttleInput += 1;
        }

        if (inputManager.isKeyPressed('ControlLeft') || inputManager.isKeyPressed('ControlRight')) {
            this.throttleInput -= 1;
        }
    }

    checkGroundCollision(groundHeight = 0) {
        if (this.isCrashed) return false;

        // Check if we've hit the ground
        if (this.position.y < groundHeight + 10) {
            const impactVelocity = Math.abs(this.velocity.y);

            // Only crash if coming down with significant speed
            if (impactVelocity > 10) {
                console.log("CRASH! Impact velocity:", impactVelocity);
                this.isCrashed = true;
                return true;
            } else {
                // Bounce slightly
                this.position.y = groundHeight + 10;
                this.velocity.y = Math.abs(this.velocity.y) * 0.3; // Bounce with 30% of impact velocity
                return false;
            }
        }
        return false;
    }

    update(deltaTime, inputManager) {
        if (this.isCrashed) {
            // If crashed, just apply gravity
            this.velocity.y -= 9.8 * deltaTime;
            this.position.add(this.velocity.clone().multiplyScalar(deltaTime));

            // Update the mesh
            if (this.mesh) {
                this.mesh.position.copy(this.position);
                // Add random rotation for crash effect
                this.mesh.rotation.x += Math.random() * 0.1;
                this.mesh.rotation.z += Math.random() * 0.1;
            }
            return;
        }

        // Handle player input
        this.handleInput(inputManager, deltaTime);

        // Apply control inputs with appropriate rates and limits
        const pitchRate = 0.8 * deltaTime;
        const rollRate = 1.2 * deltaTime;
        const yawRate = 0.5 * deltaTime;
        const throttleRate = 0.2 * deltaTime;

        // Update rotation based on inputs
        this.rotation.x += this.pitchInput * pitchRate;
        this.rotation.z += this.rollInput * rollRate;
        this.rotation.y += this.yawInput * yawRate;

        // Apply limits
        this.rotation.x = Math.max(-Math.PI/4, Math.min(Math.PI/4, this.rotation.x)); // Limit pitch
        this.rotation.z = Math.max(-Math.PI/3, Math.min(Math.PI/3, this.rotation.z)); // Limit roll

        // Apply natural centering for roll (tends to return to level)
        this.rotation.z *= 0.98;

        // Update throttle
        this.throttle += this.throttleInput * throttleRate;
        this.throttle = Math.max(0.1, Math.min(1.0, this.throttle));

        // Calculate speed based on throttle
        this.speed = this.minSpeed + (this.maxSpeed - this.minSpeed) * this.throttle;

        // Calculate velocity vector based on orientation and speed
        const direction = new THREE.Vector3(0, 0, 1);
        direction.applyEuler(this.rotation);
        direction.normalize();

        this.velocity.copy(direction).multiplyScalar(this.speed);

        // Apply gravity - stronger effect than before
        this.velocity.y -= 9.8 * deltaTime * 2;

        // Update position
        const positionDelta = this.velocity.clone().multiplyScalar(deltaTime);
        this.position.add(positionDelta);

        // Update the visual model
        if (this.mesh) {
            this.mesh.position.copy(this.position);
            this.mesh.rotation.copy(this.rotation);
        }
    }

    getMesh() {
        return this.mesh;
    }

    getInfo() {
        return {
            speed: this.speed,
            verticalSpeed: this.velocity.y * 60, // Convert to feet per minute
            altitude: this.position.y,
            throttle: this.throttle,
            pitch: this.rotation.x * 180 / Math.PI,
            roll: this.rotation.z * 180 / Math.PI,
            yaw: this.rotation.y * 180 / Math.PI,
            isCrashed: this.isCrashed
        };
    }
}
