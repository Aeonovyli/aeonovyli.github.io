const SHIP_PATHS = {
    fighter: "M20,0 L0,40 L20,35 L40,40 Z",
    capital: "M20,0 L0,30 L10,50 L20,45 L30,50 L40,30 Z M15,15 L25,15 L25,25 L15,25 Z"
};

class Starfield {
    constructor(w, h) {
        this.stars = [];
        this.width = w;
        this.height = h;
        this.init();
    }
    init() {
        this.stars = [];
        for (let i = 0; i < 300; i++) {
            this.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                z: Math.random() * 2 + 0.5,
                s: Math.random() * 1.5 + 0.5
            });
        }
    }
    update(mult) {
        this.stars.forEach(star => {
            star.y += (star.z * 0.5) * mult;
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
            ctx.arc(star.x, star.y, star.s, 0, Math.PI * 2);
            ctx.fill();
        });
    }
    resize(w, h) {
        this.width = w;
        this.height = h;
        this.init();
    }
}

class Particle {
    constructor(x, y, c) {
        this.x = x; this.y = y; this.c = c;
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
        ctx.fillStyle = this.c;
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
        this.color = parent ? "#00ffcc" : `hsl(${Math.random() * 60 + 320}, 100%, 60%)`;
        this.isCapital = word.length >= 5;
        this.size = this.isCapital ? 30 + (word.length * 1.5) : 20;
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
        const glow = this.isCapital ? 25 : 15;
        ctx.shadowBlur = glow;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.size / 20, this.size / 20);
        
        ctx.beginPath();
        const pathData = this.isCapital ? SHIP_PATHS.capital : SHIP_PATHS.fighter;
        const parts = pathData.split(' ');
        ctx.moveTo(parseFloat(parts[1]), parseFloat(parts[2]));
        for (let i = 3; i < parts.length; i += 3) {
            const cmd = parts[i];
            const x = parseFloat(parts[i+1]);
            const y = parseFloat(parts[i+2]);
            if (cmd === 'L') ctx.lineTo(x, y);
            else if (cmd === 'M') ctx.moveTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${12 + (this.word.length * 1.5)}px Courier New`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.word, 0, 0);
        
        ctx.restore();
        ctx.shadowBlur = 0;
    }
}

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.uiScore = document.getElementById('score-val');
        this.uiLives = document.getElementById('lives-val');
        this.uiWave = document.getElementById('wave-val');
        this.uiInput = document.getElementById('input-display');
        this.uiGameOver = document.getElementById('game-over-screen');
        this.uiFinalScore = document.getElementById('final-score');
        this.uiScoreBoard = document.getElementById('score-board');
        this.restartBtn = document.getElementById('restart-btn');

        this.starfield = new Starfield(this.canvas.width, this.canvas.height);
        this.ships = [];
        this.particles = [];
        this.score = 0;
        this.lives = 3;
        this.wave = 1;
        this.speedMult = 1.0;
        this.spawnTimer = 0;
        this.running = false;
        this.lastTime = 0;
        this.wordList = [];
        this.laserTimer = 0;
        this.laserTarget = null;

        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.restartBtn.addEventListener('click', () => this.start());
        window.addEventListener('keydown', (e) => this.handleInput(e));
        
        this.fetchWords();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.starfield.resize(this.canvas.width, this.canvas.height);
    }

    async fetchWords() {
        const wordSet = new Set();
        const fetchWord = async (url) => {
            try {
                const r = await fetch(url);
                const t = await r.text();
                const matches = t.match(/[a-z]{3,15}/g) || [];
                matches.forEach(m => {
                    if (!m.includes('x') && !wordSet.has(m)) wordSet.add(m);
                });
            } catch (e) {
                console.log('Fetch failed, using fallback');
            }
        };

        const promises = [
            fetchWord('https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt'),
            fetchWord('https://raw.githubusercontent.com/first20hours/google-10000-english/master/20k.txt')
        ];

        await Promise.all(promises);
        this.wordList = Array.from(wordSet);
        if (this.wordList.length === 0) {
            this.wordList = ["ship", "star", "laser", "fleet", "orbit", "pulse", "blast", "target", "vector", "warp", "alien", "droid", "system", "grid", "flux", "zone", "nova", "cyber", "quantum", "matrix", "logic", "power", "energy", "shield", "armor", "battle", "combat", "attack", "defend", "destroy", "engage", "launch", "missile", "radar", "sonar", "sensor", "scan", "lock", "track", "guide", "aim", "fire", "boom", "crash", "burn", "fury", "storm", "wind", "cloud", "rain", "snow", "ice", "heat", "cold", "dark", "light", "bright", "dim", "glow", "shine", "spark", "flash", "beam", "ray"];
        }
        this.start();
    }

    start() {
        this.ships = [];
        this.particles = [];
        this.score = 0;
        this.lives = 3;
        this.wave = 1;
        this.speedMult = 1.0;
        this.spawnTimer = 0;
        this.running = true;
        this.uiGameOver.style.display = 'none';
        this.uiScoreBoard.style.display = 'block';
        this.uiScore.innerText = '0';
        this.uiLives.innerText = '3';
        this.uiWave.innerText = '1';
        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.loop(t));
    }

    endGame() {
        this.running = false;
        this.uiGameOver.style.display = 'block';
        this.uiScoreBoard.style.display = 'none';
        this.uiFinalScore.innerText = this.score;
    }

    boom(x, y, color) {
        for (let i = 0; i < 20; i++) {
            this.particles.push(new Particle(x, y, color));
        }
    }

    shoot(x1, y1, x2, y2) {
        this.ctx.strokeStyle = '#00ffcc';
        this.ctx.lineWidth = 3;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = '#00ffcc';
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;
    }

    handleInput(e) {
        if (!this.running) return;
        const k = e.key.toUpperCase();
        let target = null;
        let minDist = Infinity;

        this.ships.forEach(ship => {
            if (ship.hp > 0) {
                const idx = ship.word.length - ship.hp;
                if (ship.word[idx] === k) {
                    const dist = Math.abs(ship.y - (this.canvas.height - 100));
                    if (dist < minDist) {
                        minDist = dist;
                        target = ship;
                    }
                }
            }
        });

        if (target) {
            target.hp--;
            const typed = target.word.substring(0, target.word.length - target.hp);
            this.uiInput.innerText = typed + '_';
            this.laserTarget = target;
            this.laserTimer = 5;

            if (target.hp <= 0) {
                target.marked = true;
                this.boom(target.x, target.y, target.color);
                this.score += target.word.length;
                this.uiScore.innerText = this.score;
                if (this.score > this.wave * 100) {
                    this.wave++;
                    this.speedMult += 0.1;
                    this.uiWave.innerText = this.wave;
                }
            }
        }
    }

    drawPlayer() {
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height - 60;
        this.ctx.fillStyle = '#00ffcc';
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = '#00ffcc';
        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy - 15);
        this.ctx.lineTo(cx - 15, cy + 15);
        this.ctx.lineTo(cx + 15, cy + 15);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.shadowBlur = 0;

        if (this.laserTimer > 0 && this.laserTarget && !this.laserTarget.marked) {
            this.shoot(cx, cy, this.laserTarget.x, this.laserTarget.y);
            this.laserTimer--;
        }
    }

    loop(now) {
        if (!this.running) return;
        const dt = now - this.lastTime;
        this.lastTime = now;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.starfield.update(this.speedMult);
        this.starfield.draw(this.ctx);

        this.spawnTimer += dt;
        const spawnRate = Math.max(800, 2000 - this.wave * 100);
        if (this.spawnTimer > spawnRate) {
            const w = this.wordList[Math.floor(Math.random() * this.wordList.length)];
            this.ships.push(new Ship(w, null, this.speedMult));
            this.spawnTimer = 0;
        }

        let newShips = [];
        this.ships.forEach(ship => {
            const action = ship.update(dt, this.speedMult);
            if (action === 'spawn') {
                const subW = this.wordList[Math.floor(Math.random() * this.wordList.length)];
                newShips.push(new Ship(subW, ship, this.speedMult));
            }
        });
        this.ships.push(...newShips);

        this.ships.forEach(ship => ship.draw(this.ctx));
        this.ships = this.ships.filter(s => !s.marked);

        this.particles.forEach((p, i) => {
            p.update();
            p.draw(this.ctx);
            if (p.life <= 0) this.particles.splice(i, 1);
        });

        this.drawPlayer();

        requestAnimationFrame((t) => this.loop(t));
    }
}

const game = new Game();
