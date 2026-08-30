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
            this.wordList = ["ship", "star", "laser", "fleet", "orbit", "pulse", "blast", "target", "vector", "warp", "alien", "droid", "system", "grid", "flux", "zone", "nova", "cyber", "quantum", "matrix", "logic"];
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
        this.ctx.moveTo(cx, cy
