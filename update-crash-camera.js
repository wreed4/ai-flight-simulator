const fs = require('fs');

// Read the Engine.js file
let engineJS = fs.readFileSync('src/core/Engine.js', 'utf8');

// Find the handleCrash method
const handleCrashRegex = /(handleCrash\(\) \{[^]*?)(\/\/ Show game over screen)/;

// Insert camera zoom out code
const zoomOutCode = `
        // Set camera to a fixed position with a wider view of the crash
        this.explosionCameraTarget = new THREE.Vector3().copy(this.aircraft.position);

        // Save current camera position for smooth transition
        this.preExplosionCameraPos = new THREE.Vector3().copy(this.renderer.camera.position);

        // Calculate a position that's higher and further back
        const distanceMultiplier = 2.5;  // Zoom out factor
        const idealCameraPos = new THREE.Vector3();
        idealCameraPos.copy(this.aircraft.position);

        // Move up and back
        idealCameraPos.y += this.cameraHeight * 3;
        idealCameraPos.z -= this.cameraDistance * distanceMultiplier;
        idealCameraPos.x -= this.cameraDistance * 0.5;

        this.explosionCameraPos = idealCameraPos;

        // Transition will be handled in updateCameraPosition
        this.cameraTransitionStart = Date.now();
        this.cameraTransitionDuration = 1500;  // 1.5 seconds to zoom out

        $2`;

const updatedHandleCrash = engineJS.replace(handleCrashRegex, "$1" + zoomOutCode + "$2");

// Now modify updateCameraPosition method to handle the explosion camera
const updateCameraRegex = /(updateCameraPosition\(deltaTime\) \{[^]*?)(if \(!this\.aircraft[^]*?)([^]*?\})/s;

const explosionCameraCode = `
        // For explosion, use a special camera position
        if (this.gameOver && this.explosionCameraPos) {
            // Calculate transition progress
            const elapsed = Date.now() - this.cameraTransitionStart;
            const progress = Math.min(1, elapsed / this.cameraTransitionDuration);

            // Smooth easing function
            const easeOutQuad = (t) => t * (2 - t);
            const easedProgress = easeOutQuad(progress);

            // Interpolate between pre-explosion position and explosion view position
            const cameraPos = new THREE.Vector3();
            cameraPos.lerpVectors(this.preExplosionCameraPos, this.explosionCameraPos, easedProgress);

            // Set camera position
            this.renderer.camera.position.copy(cameraPos);

            // Look at the explosion
            this.renderer.camera.lookAt(this.explosionCameraTarget);

            return;
        }

        $2`;

const updatedCameraMethod = updatedHandleCrash.replace(updateCameraRegex, "$1" + explosionCameraCode + "$3");

// Write the updated file
fs.writeFileSync('src/core/Engine.js', updatedCameraMethod, 'utf8');
console.log('Updated Engine.js with explosion camera behavior');
