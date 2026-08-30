class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8;
        this.life = 1.0;
        this.decay = Math.random() * 0.03 + 0.02;
        this.size = Math.random() * 3 + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
        this.size *= 0.95;
    }

    draw(ctx) {
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }
}

class Ship {
    constructor(word, parent = null, speedMult = 1.0) {
        this.word = word;
        this.parent = parent;
        this.x = parent ? parent.x : Math.random() * (window.innerWidth - 100) + 50;
        this.y = parent ? parent.y + 40 : -50;
        this.hp = word.length;
        this.maxHp = word.length;
        this.marked = false;
        this.color = parent ? '#00ffcc' : `hsl(${Math.random() * 60 + 320}, 100%, 60%)`;
        this.isCapital = word.length >= 5;
        this.size = this.isCapital ? 25 + (word.length * 2) : 15;
        this.speed = (parent ? 2.5 : 0.8) + (Math.random() * 0.4);
        if (!parent) this.speed *= speedMult;
        this.spawnTimer = 0;
        this.spawned = false;
    }

    update(dt, speedMult) {
        if (!this.parent) {
            this.y += this.speed * (dt / 16) * speedMult;
        }
        if (this.y > window.innerHeight - 80 && !this.parent) {
            this.marked = true;
            return 'hit';
        }
        if (this.isCapital && !this.parent && !this.spawned) {
            this.spawnTimer += dt;
            if (this.spawnTimer > 3000 && this.hp > 2) {
                this.spawned = true;
                return 'spawn';
            }
        }
        return null;
    }

    draw(ctx) {
        const glow = this.isCapital ? 20 : 10;
        ctx.shadowBlur = glow;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;

        if (this.isCapital) {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y - this.size);
            ctx.lineTo(this.x - this.size, this.y + this.size);
            ctx.lineTo(this.x + this.size, this.y + this.size);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.font = `bold ${14 + (this.word.length * 2)}px Courier New`;
            ctx.textAlign = 'center';
            ctx.fillText(this.word, this.x, this.y + 5);
        } else {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - 10, this.y + 20);
            ctx.lineTo(this.x + 10, this.y + 20);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 14px Courier New';
            ctx.textAlign = 'center';
            ctx.fillText(this.word, this.x, this.y - 5);
        }
        ctx.shadowBlur = 0;
    }
}
