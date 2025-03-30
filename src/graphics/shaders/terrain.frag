export class AttitudeIndicator {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
    }

    update(pitch, roll) {
        this.ctx.save();
        this.ctx.translate(this.centerX, this.centerY);
        this.ctx.rotate(roll);

        // Draw sky and ground
        this.ctx.fillStyle = '#0066cc';
        this.ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height/2);
        this.ctx.fillStyle = '#654321';
        this.ctx.fillRect(-this.width/2, 0, this.width, this.height/2);

        // Draw horizon line
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(-this.width/2, 0);
        this.ctx.lineTo(this.width/2, 0);
        this.ctx.stroke();

        // Draw pitch ladder
        const pitchLineSpacing = 10;
        for(let i = -30; i <= 30; i += 10) {
            const y = -i * pitchLineSpacing;
            this.ctx.beginPath();
            this.ctx.moveTo(-30, y);
            this.ctx.lineTo(30, y);
            this.ctx.stroke();
        }

        // Draw aircraft reference
        this.ctx.fillStyle = 'yellow';
        this.ctx.beginPath();
        this.ctx.moveTo(-15, 0);
        this.ctx.lineTo(0, -5);
        this.ctx.lineTo(15, 0);
        this.ctx.fill();

        this.ctx.restore();
    }
}
