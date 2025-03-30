export class AircraftPhysics {
    constructor(aircraft) {
        this.aircraft = aircraft;
        this.gravity = 9.81;
        this.airDensity = 1.225;
        this.dragCoefficient = 0.027;
        this.controlResponseRate = 1.5; // How quickly the aircraft responds to controls
    }

    setupAerodynamics() {
        this.liftCurve = [];
        for (let angle = -20; angle <= 20; angle++) {
            this.liftCurve[angle] = this.calculateLiftCoefficient(angle);
        }
    }

    getLiftCoefficient(angleOfAttack) {
        return 0.11 * angleOfAttack;
    }

    calculateLift(airspeed, angleOfAttack, airDensity) {
        const wingArea = this.aircraft.specs.wingArea;
        const liftCoefficient = this.getLiftCoefficient(angleOfAttack);
        return 0.5 * airDensity * Math.pow(airspeed, 2) * wingArea * liftCoefficient;
    }

    calculateDrag(airspeed, angleOfAttack, airDensity) {
        const frontalArea = this.aircraft.specs.wingArea * Math.abs(Math.sin(angleOfAttack));
        return 0.5 * airDensity * Math.pow(airspeed, 2) * frontalArea * this.dragCoefficient;
    }

    processControls(deltaTime, inputManager) {
        // Apply flight controls based on input
        if (inputManager) {
            // Handle W/S for throttle and pitch
            if (inputManager.isKeyPressed('KeyW')) {
                this.aircraft.throttle = Math.min(1.0, this.aircraft.throttle + 0.01);
                this.aircraft.rotation.pitch += 0.01 * this.controlResponseRate * deltaTime;
            }

            if (inputManager.isKeyPressed('KeyS')) {
                this.aircraft.throttle = Math.max(0.1, this.aircraft.throttle - 0.01);
                this.aircraft.rotation.pitch -= 0.01 * this.controlResponseRate * deltaTime;
            }

            // Handle A/D for roll and yaw
            if (inputManager.isKeyPressed('KeyA')) {
                this.aircraft.rotation.roll -= 0.02 * this.controlResponseRate * deltaTime;
                this.aircraft.rotation.yaw -= 0.01 * this.controlResponseRate * deltaTime;
            }

            if (inputManager.isKeyPressed('KeyD')) {
                this.aircraft.rotation.roll += 0.02 * this.controlResponseRate * deltaTime;
                this.aircraft.rotation.yaw += 0.01 * this.controlResponseRate * deltaTime;
            }

            // Arrow keys for fine control
            if (inputManager.isKeyPressed('ArrowUp')) {
                this.aircraft.rotation.pitch += 0.01 * this.controlResponseRate * deltaTime;
            }

            if (inputManager.isKeyPressed('ArrowDown')) {
                this.aircraft.rotation.pitch -= 0.01 * this.controlResponseRate * deltaTime;
            }

            if (inputManager.isKeyPressed('ArrowLeft')) {
                this.aircraft.rotation.yaw -= 0.01 * this.controlResponseRate * deltaTime;
            }

            if (inputManager.isKeyPressed('ArrowRight')) {
                this.aircraft.rotation.yaw += 0.01 * this.controlResponseRate * deltaTime;
            }
        }

        // Apply natural stabilization/damping
        this.aircraft.rotation.roll *= 0.98;

        // Limit pitch and roll to prevent flipping
        this.aircraft.rotation.pitch = Math.max(-Math.PI/4, Math.min(Math.PI/4, this.aircraft.rotation.pitch));
        this.aircraft.rotation.roll = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.aircraft.rotation.roll));
    }

    update(deltaTime, inputManager) {
        // Process flight controls
        this.processControls(deltaTime, inputManager);

        // Calculate aerodynamic forces
        const airspeed = Math.sqrt(
            Math.pow(this.aircraft.velocity.x, 2) +
            Math.pow(this.aircraft.velocity.y, 2) +
            Math.pow(this.aircraft.velocity.z, 2)
        );

        const lift = this.calculateLift(
            airspeed,
            this.aircraft.rotation.pitch,
            this.airDensity
        );

        const drag = this.calculateDrag(
            airspeed,
            this.aircraft.rotation.pitch,
            this.airDensity
        );

        // Calculate thrust based on throttle
        const thrust = this.aircraft.throttle * 20000; // Max thrust of 20000N

        // Apply forces
        this.aircraft.applyForce({
            x: 0,
            y: lift - this.aircraft.specs.mass * this.gravity,
            z: thrust - drag
        });

        // Apply rotation to velocity (convert to world space)
        const speed = this.aircraft.throttle * this.aircraft.specs.maxSpeed;
        this.aircraft.velocity.x = Math.sin(this.aircraft.rotation.yaw) * Math.cos(this.aircraft.rotation.pitch) * speed;
        this.aircraft.velocity.y = Math.sin(this.aircraft.rotation.pitch) * speed;
        this.aircraft.velocity.z = Math.cos(this.aircraft.rotation.yaw) * Math.cos(this.aircraft.rotation.pitch) * speed;

        // Update position
        this.aircraft.position.x += this.aircraft.velocity.x * deltaTime;
        this.aircraft.position.y += this.aircraft.velocity.y * deltaTime;
        this.aircraft.position.z += this.aircraft.velocity.z * deltaTime;

        // Ensure we don't go below ground level (simple terrain collision)
        if (this.aircraft.position.y < 10) {
            this.aircraft.position.y = 10;
            this.aircraft.velocity.y = 0;
        }
    }
}
