export class ParticleSystem {
  constructor() {
    this.particles = [];
    this.maxParticles = 1000;
    this.emitters = new Map();
  }

  createEmitter(config) {
    const emitter = {
      position: config.position || { x: 0, y: 0, z: 0 },
      rate: config.rate || 10,
      lifetime: config.lifetime || 1,
      velocity: config.velocity || { x: 0, y: 1, z: 0 },
      size: config.size || 1,
      color: config.color || "#ffffff",
      opacity: config.opacity || 1,
      lastEmit: 0,
    };
    this.emitters.set(config.id, emitter);
  }

  emit(emitterId, time) {
    const emitter = this.emitters.get(emitterId);
    if (!emitter) return;

    if (time - emitter.lastEmit > 1000 / emitter.rate) {
      if (this.particles.length >= this.maxParticles) {
        this.particles.shift();
      }

      this.particles.push({
        position: { ...emitter.position },
        velocity: { ...emitter.velocity },
        size: emitter.size,
        color: emitter.color,
        opacity: emitter.opacity,
        lifetime: emitter.lifetime,
        age: 0,
      });

      emitter.lastEmit = time;
    }
  }

  update(deltaTime) {
    this.particles = this.particles.filter((particle) => {
      particle.age += deltaTime;
      if (particle.age >= particle.lifetime) return false;

      particle.position.x += particle.velocity.x * deltaTime;
      particle.position.y += particle.velocity.y * deltaTime;
      particle.position.z += particle.velocity.z * deltaTime;

      particle.opacity = 1 - particle.age / particle.lifetime;

      return true;
    });
  }

  render(renderer) {
    this.particles.forEach((particle) => {
      renderer.drawParticle(
        particle.position,
        particle.size,
        particle.color,
        particle.opacity,
      );
    });
  }
}
