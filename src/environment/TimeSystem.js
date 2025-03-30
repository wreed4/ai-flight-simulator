export class TimeSystem {
    constructor() {
        this.time = 0;
        this.dayLength = 1200; // 20 minutes per day
    }

    init() {
        // Initialize time system
    }

    update(deltaTime) {
        this.time += deltaTime;
        if (this.time > this.dayLength) {
            this.time -= this.dayLength;
        }
    }

    getDayNightRatio() {
        return Math.sin((this.time / this.dayLength) * Math.PI);
    }
}
