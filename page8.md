---
layout: default
title: Chess
---

# Chess

Everyone knows chess, even if they don't know how to play it. Try this.

<style>
#game-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 25px;
    margin: 20px auto;
    max-width: 600px;
    background: transparent;
}

#status {
    font-family: 'MedievalSharp', cursive, serif;
    font-size: 28px;
    margin-bottom: 20px;
    font-weight: bold;
    text-align: center;
    color: #ffd700;
    text-shadow: 1px 1px 4px #ff4500, 0 0 8px #00f0ff;
}

#board {
    display: grid;
    grid-template-columns: repeat(8, min(11vw, 65px));
    grid-template-rows: repeat(8, min(11vw, 65px));
    border: 3px solid #ffd700;
    box-shadow: 0 0 25px rgba(0, 240, 255, 0.4);
    background: transparent; 
    border-radius: 4px;
    overflow: hidden;
    position: relative; 
}

.square {
    width: min(11vw, 65px);
    height: min(11vw, 65px);
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    cursor: pointer;
    user-select: none;
}

.light {
    background: transparent !important;
    border: 1px solid rgba(255, 215, 0, 0.6);
}

.dark {
    border: 1px solid rgba(255, 215, 0, 0.6);
    background: repeating-linear-gradient(
        135deg,
        transparent,
        transparent 8px,
        rgba(255, 215, 0, 0.4) 8px,
        rgba(255, 215, 0, 0.4) 10px
    );
}

.selected {
    background: rgba(0, 240, 255, 0.25) !important;
    box-shadow: inset 0 0 12px #00f0ff;
}

.move {
    background: rgba(255, 148, 77, 0.2) !important;
    box-shadow: inset 0 0 10px #ff944d;
}

/* Slide animation performance rules */
.piece-container {
    width: 80%;
    height: 80%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    pointer-events: none;
}

.piece-container.gliding {
    transition: transform 0.35s cubic-bezier(0.25, 1, 0.5, 1);
    z-index: 10;
}

.square svg {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 0 2px rgba(0,0,0,0.5));
}

#resetBtn {
    margin-top: 25px;
    background-color: rgba(255, 215, 0, 0.1);
    color: #ffd700;
    border: 2px solid #ffd700;
    padding: 10px 24px;
    border-radius: 4px;
    cursor: pointer;
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1em;
    text-shadow: 1px 1px 4px #ff4500, 0 0 8px #00f0ff;
    transition: all 0.3s ease;
}

#resetBtn:hover {
    background-color: rgba(255, 215, 0, 0.2);
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.6);
}
</style>

<svg style="display:none;">
  <defs>
    <pattern id="pieceHatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="6" stroke="#00f0ff" stroke-width="1.5" />
    </pattern>
  </defs>
</svg>

<div id="game-wrap">
    <div id="status">Loading...</div>
    <div id="board"></div>
    <button id="resetBtn">Reset Game</button>
</div>

<!-- Corrected engine script source -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.min.js"></script>

<script>
window.addEventListener("load", () => {
    if (typeof Chess === "undefined") {
        document.getElementById("status").innerText = "Failed to load chess engine.";
        return;
    }

    const game = new Chess();
    const boardEl = document.getElementById("board");
    const statusEl = document.getElementById("status");
    const resetBtn = document.getElementById("resetBtn");

    let selected = null;
    let isAnimating = false;

    const paths = {
        p: "M22,9C22,11.2 20.2,13 18,13C16.8,13 15.7,12.5 15,11.6L12,18H32L29,11.6C28.3,12.5 27.2,13 26,13C23.8,13 22,11.2 22,9M12,36H32V38H12V36M14,20H30V34H14V20Z",
        r: "M12,9H16V13H20V9H24V13H28V9H32V17H12V9M14,20H30V34H14V20M12,36H32V38H12V36Z",
        n: "M33,26.5C33,26.5 35,22.5 31,18C27,13.5 22,13.5 22,13.5C22,13.5 21.5,9.5 17,9.5C12.5,9.5 11,14 11,14C11,14 7.5,16.5 9.5,23C11.5,29.5 16,33 16,33L12,36H32L30,31C30,31 33,29.5 33,26.5Z",
        b: "M22,9C22,9 15,14 15,22C15,27 18,34 18,34H26C26,34 29,27 29,22C29,14 22,9 22,9M12,36H32V38H12V36Z",
        q: "M12,14L16,26L22,11L28,26L32,14L30,34H14L12,14M12,36H32V38H12V36Z",
        k: "M12,18L16,14L22,18L28,14L32,18L30,34H14L12,18M22,6V11M19.5,8.5H24.5M12,36H32V38H12V36Z"
    };

    function getPieceSVG(type, color) {
        const pathData = paths[type.toLowerCase()];
        const isWhite = (color === 'w');
        const fill = isWhite ? "none" : "url(#pieceHatch)";
        const stroke = isWhite ? "#ffd700" : "rgba(0, 240, 255, 0.4)";
        const strokeWidth = isWhite ? "2" : "1.5";

        return `<div class="piece-container"><svg viewBox="0 0 44 44">
            <path d="${pathData}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round" stroke-linecap="round"/>
        </svg></div>`;
    }

    function squareName(row, col) {
        return "abcdefgh"[col] + (8 - row);
    }

    function updateStatus() {
        let text = (game.turn() === "w" ? "White" : "Black") + " to move";
        if (game.in_checkmate()) {
            text = "CHECKMATE — " + (game.turn() === "w" ? "Black" : "White") + " wins";
        } else if (game.in_draw()) {
            text = "Draw";
        } else if (game.in_check()) {
            text += " — CHECK";
        }
        statusEl.innerText = text;
    }

    function renderBoard() {
        boardEl.innerHTML = "";
        const board = game.board();
        let legalMoves = [];

        if (selected) {
            legalMoves = game.moves({ square: selected, verbose: true });
        }

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement("div");
                const coord = squareName(row, col);

                square.classList.add("square");
                square.id = "sq-" + coord;
                square.classList.add((row + col) % 2 === 0 ? "light" : "dark");

                if (coord === selected) square.classList.add("selected");
                if (legalMoves.some(move => move.to === coord)) square.classList.add("move");

                const piece = board[row][col];
                if (piece) {
                    square.innerHTML = getPieceSVG(piece.type, piece.color);
                }

                square.addEventListener("click", () => clickSquare(coord));
                boardEl.appendChild(square);
            }
        }
        updateStatus();
    }

    function animateGlide(fromCoord, toCoord, callback) {
        isAnimating = true;
        const fromSq = document.getElementById("sq-" + fromCoord);
        const piece = fromSq.querySelector(".piece-container");

        if (!piece) {
            callback();
            return;
        }

        const toSq = document.getElementById("sq-" + toCoord);
        const fromRect = fromSq.getBoundingClientRect();
        const toRect = toSq.getBoundingClientRect();

        const deltaX = toRect.left - fromRect.left;
        const deltaY = toRect.top - fromRect.top;

        piece.classList.add("gliding");
        piece.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

        piece.addEventListener("transitionend", () => {
            piece.classList.remove("gliding");
            piece.style.transform = "";
            isAnimating = false;
            callback();
        }, { once: true });
    }

    function clickSquare(coord) {
        if (isAnimating) return; 

        const clickedPiece = game.get(coord);

        if (selected) {
            const currentSelected = selected; 
            const move = game.move({ from: currentSelected, to: coord, promotion: "q" });
            
            if (move) {
                game.undo(); 
                selected = null;
                
                animateGlide(currentSelected, coord, () => {
                    game.move({ from: currentSelected, to: coord, promotion: "q" }); 
                    renderBoard();
                });
                return;
            }
            selected = (clickedPiece && clickedPiece.color === game.turn()) ? coord : null;
        } else {
            if (clickedPiece && clickedPiece.color === game.turn()) selected = coord;
        }
        renderBoard();
    }

    resetBtn.addEventListener("click", () => {
        isAnimating = false;
        game.reset();
        selected = null;
        renderBoard();
    });

    renderBoard();
});
</script>

<nav class="nav">
<a href="/">Home</a>
<a href="/page2">Contact me</a>
<a href="/page3">Profiles</a>
<a href="/page4">Eiriaoloth</a>
<a href="/page5">Games</a>
<a href="/page6">Flash</a>
<a href="/page7">BZFlag</a>
<a href="/page9">Sudoku</a>
<a href="/page10">Newsletter</a>
</nav>
