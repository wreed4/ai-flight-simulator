// src/ui/InstrumentPanel/AirspeedIndicator.js, Altimeter.js, AttitudeIndicator.js
export class AirspeedIndicator {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.airspeed = 0;
        this.maxSpeed = 200;
    }

    update(speed) {
        this.airspeed = speed;
        this.render();
    }

    render() {
        // Draw airspeed indicator
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw dial
        this.ctx.beginPath();
        this.ctx.arc(100, 100, 80, 0, Math.PI * 2);
        this.ctx.stroke();

        // Draw needle
        const angle = (this.airspeed / this.maxSpeed) * Math.PI * 1.5 - Math.PI * 0.75;
        this.ctx.beginPath();
        this.ctx.moveTo(100, 100);
        this.ctx.lineTo(
            100 + Math.cos(angle) * 70,
            100 + Math.sin(angle) * 70
        );
        this.ctx.stroke();
    }
}

export class Altimeter {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.altitude = 0;
    }

    update(altitude) {
        this.altitude = altitude;
        this.render();
    }

    render() {
        // Draw altimeter
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw thousands needle
        const thousandsAngle = (this.altitude / 10000) * Math.PI * 2;
        this.ctx.beginPath();
        this.ctx.moveTo(100, 100);
        this.ctx.lineTo(
            100 + Math.cos(thousandsAngle) * 60,
            100 + Math.sin(thousandsAngle) * 60
        );
        this.ctx.stroke();

        // Draw hundreds needle
        const hundredsAngle = ((this.altitude % 1000) / 1000) * Math.PI * 2;
        this.ctx.beginPath();
        this.ctx.moveTo(100, 100);
        this.ctx.lineTo(
            100 + Math.cos(hundredsAngle) * 40,
            100 + Math.sin(hundredsAngle) * 40
        );
        this.ctx.stroke();
    }
}

export class AttitudeIndicator {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.pitch = 0;
        this.roll = 0;
    }

    update(pitch, roll) {
        this.pitch = pitch;
        this.roll = roll;
        this.render();
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();

        // Translate to center and rotate for roll
        this.ctx.translate(100, 100);
        this.ctx.rotate(this.roll);

        // Draw sky and ground
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(-100, -100 - this.pitch * 2, 200, 100);
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(-100, 0 - this.pitch * 2, 200, 100);

        // Draw horizon line
        this.ctx.strokeStyle = 'white';
        this.ctx.beginPath();
        this.ctx.moveTo(-100, 0 - this.pitch * 2);
        this.ctx.lineTo(100, 0 - this.pitch * 2);
        this.ctx.stroke();

        this.ctx.restore();
    }
}
