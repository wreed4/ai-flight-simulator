export class InputManager {
    constructor() {
        console.log("Input manager created");
        this.keys = {};
        this.previousKeys = {};
        this.keyDownHandlers = {};
        this.keyUpHandlers = {};

        // Bind methods
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);

        // Set up event listeners
        this.setupEventListeners();
    }

    init() {
        console.log("Input manager initialized");
    }

    setupEventListeners() {
        window.addEventListener("keydown", this.handleKeyDown);
        window.addEventListener("keyup", this.handleKeyUp);
        console.log("Input event listeners set up");
    }

    handleKeyDown(event) {
        this.keys[event.code] = true;

        // Run specific key down handlers if registered
        if (this.keyDownHandlers[event.code]) {
            this.keyDownHandlers[event.code](event);
        }

        // Prevent default for navigation keys
        if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(event.code)) {
            event.preventDefault();
        }
    }

    handleKeyUp(event) {
        this.keys[event.code] = false;

        // Run specific key up handlers if registered
        if (this.keyUpHandlers[event.code]) {
            this.keyUpHandlers[event.code](event);
        }
    }

    registerKeyDownHandler(keyCode, handler) {
        this.keyDownHandlers[keyCode] = handler;
    }

    registerKeyUpHandler(keyCode, handler) {
        this.keyUpHandlers[keyCode] = handler;
    }

    isKeyPressed(keyCode) {
        return !!this.keys[keyCode];
    }

    wasKeyPressed(keyCode) {
        return !!this.previousKeys[keyCode];
    }

    keyJustPressed(keyCode) {
        return this.isKeyPressed(keyCode) && !this.wasKeyPressed(keyCode);
    }

    update() {
        // Store current key state for next frame comparison
        this.previousKeys = {...this.keys};
    }

    cleanUp() {
        window.removeEventListener("keydown", this.handleKeyDown);
        window.removeEventListener("keyup", this.handleKeyUp);
    }
}
