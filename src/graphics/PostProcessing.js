class FlightSimulator {
  constructor() {
    this.physics = new Physics();
    this.renderer = new Renderer();
    this.input = new InputManager();
    this.audio = new AudioEngine();
    this.environment = new Environment();
    this.aircraft = new Aircraft();

    this.lastTime = 0;
    this.deltaTime = 0;
    this.isRunning = false;
  }

  init() {
    this.physics.init();
    this.renderer.init();
    this.input.init();
    this.audio.init();
    this.environment.init();
    this.aircraft.init();
  }

  start() {
    this.isRunning = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  gameLoop(timestamp) {
    if (!this.isRunning) return;

    this.deltaTime = (timestamp - this.lastTime) / 1000;
    this.update(this.deltaTime);
    this.render();
    this.lastTime = timestamp;

    requestAnimationFrame(this.gameLoop.bind(this));
  }

  update(deltaTime) {
    this.input.update();
    this.physics.update(deltaTime);
    this.aircraft.update(deltaTime);
    this.environment.update(deltaTime);
    this.audio.update(deltaTime);
  }

  render() {
    this.renderer.render();
  }
}
