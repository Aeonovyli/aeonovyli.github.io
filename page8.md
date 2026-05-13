---
layout: default
title: Chess
---

<div id="chess-container" style="all: initial; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; font-family: 'Times New Roman', serif; background: transparent;">

<style>
    #chess-container * { box-sizing: border-box; }
    #status-msg { color: #ffcc00; margin-bottom: 15px; font-size: 24px; text-transform: uppercase; letter-spacing: 3px; text-align: center; font-family: 'Times New Roman', serif; }
    #board-grid { display: grid; grid-template-columns: repeat(8, 50px); grid-template-rows: repeat(8, 50px); width: 400px; height: 400px; border: 3px solid #ffcc00; box-shadow: 0 0 15px rgba(255, 204, 0, 0.4); background: #000; }
    .sq { width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; font-size: 38px; cursor: pointer; user-select: none; position: relative; }
    .dark-sq { background-color: rgba(255, 204, 0, 0.1); background-image: linear-gradient(45deg, #ffcc00 0.5px, transparent 0.5px), linear-gradient(-45deg, #ffcc00 0.5px, transparent 0.5px); background-size: 6px 6px; }
    .p-white { color: #ffcc00; filter: drop-shadow(0 0 1px #000); }
    .p-black { position: relative; color: transparent; text-shadow: 0 0 0 #ffcc00; }
    .p-black::after { content: attr(data-icon); position: absolute; left: 0; top: 0; color: #ffcc00; background-image: linear-gradient(0deg, #ffcc00 1px, transparent 1px), linear-gradient(90deg, #ffcc00 1px, transparent 1px); background-size: 3px 3px; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
    .selected-sq { background-color: rgba(255, 255, 255, 0.3) !important; }
    .hint::before { content: ""; position: absolute; width: 12px; height: 12px; background: rgba(255, 204, 0, 0.4); border-radius: 50%; z-index: 10; }
    .reload-btn { margin-top: 30px; background: none; border: none; color: #ffcc00; font-family: 'Times New Roman', serif; font-style: italic; font-size: 24px; letter-spacing: 4px; cursor: pointer; text-transform: uppercase; }
</style>

<div id="status-msg">White to Move</div>
<div id="board-grid"></div>
<button class="reload-btn" onclick="location.reload()">RELOAD PAGE</button>

<!-- CORRECTED: Loads the actual chess.js bundle library from a CDN -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.min.js"></script>

<script>
(function() {
    const boardEl = document.getElementById('board-grid');
    const statusEl = document.getElementById('status-msg');
    const game = new Chess();
    let selectedSq = null;

    const icons = {
        'p': '♟', 'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚',
        'P': '♙', 'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔'
    };

    function render() {
        boardEl.innerHTML = '';
        const board = game.board();
        const moves = selectedSq ? game.moves({ square: selectedSq, verbose: true }) : [];

        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const sq = document.createElement('div');
                const coord = String.fromCharCode(97 + c) + (8 - r);
                sq.className = 'sq' + ((r + c) % 2 ? ' dark-sq' : '');
                
                if (selectedSq === coord) sq.classList.add('selected-sq');
                if (moves.some(m => m.to === coord)) sq.classList.add('hint');

                const piece = board[r][c];
                if (piece) {
                    const type = piece.color === 'w' ? piece.type.toUpperCase() : piece.type.toLowerCase();
                    sq.textContent = icons[type];
                    sq.classList.add(piece.color === 'w' ? 'p-white' : 'p-black');
                    sq.setAttribute('data-icon', icons[type]);
                }

                sq.onclick = () => {
                    if (selectedSq === coord) {
                        selectedSq = null;
                    } else if (selectedSq) {
                        const move = game.move({ from: selectedSq, to: coord, promotion: 'q' });
                        if (move) {
                            selectedSq = null;
                        } else {
                            const p = game.get(coord);
                            if (p && p.color === game.turn()) selectedSq = coord;
                        }
                    } else {
                        const p = game.get(coord);
                        if (p && p.color === game.turn()) selectedSq = coord;
                    }
                    updateStatus();
                    render();
                };
                boardEl.appendChild(sq);
            }
        }
    }

    function updateStatus() {
        let txt = (game.turn() === 'w' ? 'White' : 'Black') + ' to Move';
        if (game.in_checkmate()) txt = 'CHECKMATE - ' + (game.turn() === 'w' ? 'Black' : 'White') + ' Wins';
        else if (game.in_draw()) txt = 'DRAW GAME';
        else if (game.in_check()) txt += ' (CHECK)';
        statusEl.innerText = txt;
    }

    render();
})();
</script>
</div>
