export class InputManager {
  constructor() {
    this.keys = {};
    this.mouse = {
      x: 0,
      y: 0,
      buttons: {},
    };
    this.gamepad = null;

    this.setupEventListeners();
  }

  setupEventListeners() {
    window.addEventListener("keydown", (e) => {
      this.keys[e.code] = true;
    });

    window.addEventListener("keyup", (e) => {
      this.keys[e.code] = false;
    });

    window.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener("mousedown", (e) => {
      this.mouse.buttons[e.button] = true;
    });

    window.addEventListener("mouseup", (e) => {
      this.mouse.buttons[e.button] = false;
    });

    window.addEventListener("gamepadconnected", (e) => {
      this.gamepad = e.gamepad;
    });
  }

  isKeyPressed(keyCode) {
    return !!this.keys[keyCode];
  }

  isMouseButtonPressed(button) {
    return !!this.mouse.buttons[button];
  }

  getMousePosition() {
    return { x: this.mouse.x, y: this.mouse.y };
  }

  getGamepadState() {
    return navigator.getGamepads()[this.gamepad?.index];
  }

  update() {
    // Update gamepad state if connected
    if (this.gamepad) {
      this.gamepad = this.getGamepadState();
    }
  }
}
