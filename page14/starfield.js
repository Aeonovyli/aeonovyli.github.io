class Starfield {
    constructor(canvasWidth, canvasHeight) {
        this.stars = [];
        this.width = canvasWidth;
        this.height = canvasHeight;
        this.init();
    }

    init() {
        this.stars = [];
        const count = 300;
        for (let i = 0; i < count; i++) {
            this.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                z: Math.random() * 2 + 0.5,
                size: Math.random() * 1.5 + 0.5
            });
        }
    }

    update(speedMultiplier) {
        this.stars.forEach(star => {
            star.y += (star.z * 0.5) * speedMultiplier;
            if (star.y > this.height) {
                star.y = -10;
                star.x = Math.random() * this.width;
            }
        });
    }

    draw(ctx) {
        this.stars.forEach(star => {
            const alpha = star.z / 2.5;
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    resize(w, h) {
        this.width = w;
        this.height = h;
        this.init();
    }
}
