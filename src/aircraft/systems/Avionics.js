export class InputManager {
  constructor() {
    this.keys = {};
    this.mousePosition = { x: 0, y: 0 };
    this.mouseDelta = { x: 0, y: 0 };
    this.mouseButtons = {};

    this.setupEventListeners();
  }

  setupEventListeners() {
    document.addEventListener("keydown", (e) => (this.keys[e.code] = true));
    document.addEventListener("keyup", (e) => (this.keys[e.code] = false));

    document.addEventListener("mousemove", (e) => {
      this.mouseDelta.x = e.movementX;
      this.mouseDelta.y = e.movementY;
      this.mousePosition.x = e.clientX;
      this.mousePosition.y = e.clientY;
    });

    document.addEventListener(
      "mousedown",
      (e) => (this.mouseButtons[e.button] = true),
    );
    document.addEventListener(
      "mouseup",
      (e) => (this.mouseButtons[e.button] = false),
    );
  }

  isKeyPressed(keyCode) {
    return !!this.keys[keyCode];
  }

  isMouseButtonPressed(button) {
    return !!this.mouseButtons[button];
  }

  getMouseDelta() {
    const delta = { ...this.mouseDelta };
    this.mouseDelta = { x: 0, y: 0 };
    return delta;
  }

  update() {
    // Reset one-frame state changes
    this.mouseDelta = { x: 0, y: 0 };
  }

  dispose() {
    // Clean up event listeners if needed
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("keyup", this.handleKeyUp);
    document.removeEventListener("mousemove", this.handleMouseMove);
    document.removeEventListener("mousedown", this.handleMouseDown);
    document.removeEventListener("mouseup", this.handleMouseUp);
  }
}
