export class {
  state: {
    particleSystems: [],
    maxParticles: 10000,
    particleTypes: {
      smoke: {
        size: 1,
        color: "#666666",
        lifetime: 3,
        velocity: { x: 0, y: 0.5, z: 0 },
        acceleration: { x: 0, y: 0.1, z: 0 },
        opacity: 0.5,
        fadeRate: 0.1,
      },
      fire: {
        size: 2,
        color: "#ff4400",
        lifetime: 1,
        velocity: { x: 0, y: 2, z: 0 },
        acceleration: { x: 0, y: 0.5, z: 0 },
        opacity: 0.8,
        fadeRate: 0.2,
      },
      clouds: {
        size: 50,
        color: "#ffffff",
        lifetime: 30,
        velocity: { x: 0.1, y: 0, z: 0 },
        acceleration: { x: 0, y: 0, z: 0 },
        opacity: 0.3,
        fadeRate: 0.01,
      },
    },

    addParticleSystem(type, position) {
      this.particleSystems.push({
        type: type,
        position: position,
        particles: [],
      });
    },

    update(deltaTime) {
      this.particleSystems.forEach((system) => {
        // Update existing particles
        system.particles = system.particles.filter((particle) => {
          particle.lifetime -= deltaTime;
          particle.position.x += particle.velocity.x * deltaTime;
          particle.position.y += particle.velocity.y * deltaTime;
          particle.position.z += particle.velocity.z * deltaTime;
          particle.velocity.x += particle.acceleration.x * deltaTime;
          particle.velocity.y += particle.acceleration.y * deltaTime;
          particle.velocity.z += particle.acceleration.z * deltaTime;
          particle.opacity -= particle.fadeRate * deltaTime;
          return particle.lifetime > 0;
        });

        // Generate new particles
        if (system.particles.length < this.maxParticles) {
          const type = this.particleTypes[system.type];
          system.particles.push({
            position: { ...system.position },
            velocity: { ...type.velocity },
            acceleration: { ...type.acceleration },
            size: type.size,
            color: type.color,
            lifetime: type.lifetime,
            opacity: type.opacity,
            fadeRate: type.fadeRate,
          });
        }
      });
    },

    render(renderer) {
      this.particleSystems.forEach((system) => {
        system.particles.forEach((particle) => {
          renderer.drawParticle(
            particle.position,
            particle.size,
            particle.color,
            particle.opacity,
          );
        });
      });
    },
  },
};
