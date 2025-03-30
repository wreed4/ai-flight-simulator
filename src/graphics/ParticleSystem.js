export class InputManager {
  constructor() {
    this.keys = {};
    this.mousePosition = { x: 0, y: 0 };
    this.mouseDelta = { x: 0, y: 0 };
    this.mouseButtons = {};

    this.setupEventListeners();
  }

  setupEventListeners() {
    document.addEventListener("keydown", (e) => this.onKeyDown(e));
    document.addEventListener("keyup", (e) => this.onKeyUp(e));
    document.addEventListener("mousemove", (e) => this.onMouseMove(e));
    document.addEventListener("mousedown", (e) => this.onMouseDown(e));
    document.addEventListener("mouseup", (e) => this.onMouseUp(e));
  }

  onKeyDown(event) {
    this.keys[event.code] = true;
  }

  onKeyUp(event) {
    this.keys[event.code] = false;
  }

  onMouseMove(event) {
    this.mouseDelta.x = event.movementX;
    this.mouseDelta.y = event.movementY;
    this.mousePosition.x = event.clientX;
    this.mousePosition.y = event.clientY;
  }

  onMouseDown(event) {
    this.mouseButtons[event.button] = true;
  }

  onMouseUp(event) {
    this.mouseButtons[event.button] = false;
  }

  isKeyPressed(keyCode) {
    return !!this.keys[keyCode];
  }

  isMouseButtonPressed(button) {
    return !!this.mouseButtons[button];
  }

  update() {
    // Reset delta values
    this.mouseDelta.x = 0;
    this.mouseDelta.y = 0;
  }

  dispose() {
    document.removeEventListener("keydown", this.onKeyDown);
    document.removeEventListener("keyup", this.onKeyUp);
    document.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("mousedown", this.onMouseDown);
    document.removeEventListener("mouseup", this.onMouseUp);
  }
}
