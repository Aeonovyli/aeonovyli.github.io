---
layout: default
title: Chess
---

<!-- BARE BONES CONTAINER WITH CLASSIC VISIBILITY -->
<div id="chess-container" style="display: flex; flex-direction: column; align-items: center; padding: 20px; font-family: sans-serif; background: #fff; color: #000;">

<style>
    #status-msg { margin-bottom: 15px; font-size: 20px; font-weight: bold; }
    
    /* STANDARD 8X8 GRID BOARD CHESS LAYOUT */
    #board-grid { display: grid; grid-template-columns: repeat(8, 45px); grid-template-rows: repeat(8, 45px); border: 2px solid #333; }
    
    .sq { width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; font-size: 32px; cursor: pointer; user-select: none; }
    
    /* TRADITIONAL HIGH CONTRAST SQUARES */
    .light-sq { background-color: #f0d9b5; }
    .dark-sq { background-color: #b58863; }
    
    /* FALLBACK SYSTEM TEXT PIECE SHADOWS */
    .p-white { color: #fff; filter: drop-shadow(0px 0px 2px #000); }
    .p-black { color: #000; filter: drop-shadow(0px 0px 1px #fff); }
    
    .selected-sq { background-color: #7b61ff !important; }
    .hint { background-color: #33b5e5 !important; opacity: 0.8; }
    .reload-btn { margin-top: 20px; padding: 10px 20px; font-size: 16px; cursor: pointer; }
</style>

<div id="status-msg">White to Move</div>
<div id="board-grid"></div>
<button class="reload-btn" onclick="location.reload()">Reset Game</button>

<!-- CORRECTED BUNDLE SOURCE: Pulls active game logic rules into the window -->
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
                
                // Alternate board colors
                sq.className = 'sq ' + ((r + c) % 2 ? 'dark-sq' : 'light-sq');
                
                if (selectedSq === coord) sq.classList.add('selected-sq');
                if (moves.some(m => m.to === coord)) sq.classList.add('hint');

                const piece = board[r][c];
                if (piece) {
                    const type = piece.color === 'w' ? piece.type.toUpperCase() : piece.type.toLowerCase();
                    sq.textContent = icons[type];
                    sq.classList.add(piece.color === 'w' ? 'p-white' : 'p-black');
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
