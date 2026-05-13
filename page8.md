---
layout: default
title: Chess
---

<style>
/* Game Container Layout */
#game-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 25px;
    margin: 20px auto;
    max-width: 600px;
    background-color: rgba(34, 34, 34, 0.85);
    border-radius: 8px;
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
    border: 1px solid rgba(0, 240, 255, 0.3);
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
}

.square {
    width: min(11vw, 65px);
    height: min(11vw, 65px);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: min(9vw, 52px);
    font-weight: bold;
    cursor: pointer;
    user-select: none;
    box-sizing: border-box;
}

/* Light Squares: Only outlines like a scoresheet */
.light {
    background: transparent;
    border: 1px solid rgba(255, 215, 0, 0.2);
}

/* Dark Squares: Crosshatched with theme colors from top-left to bottom-right */
.dark {
    border: 1px solid rgba(255, 215, 0, 0.2);
    background: repeating-linear-gradient(
        135deg,
        rgba(20, 20, 20, 0.7) 0px,
        rgba(20, 20, 20, 0.7) 6px,
        rgba(255, 69, 0, 0.4) 7px,
        rgba(0, 240, 255, 0.4) 8px,
        rgba(20, 20, 20, 0.7) 9px,
        rgba(20, 20, 20, 0.7) 14px
    );
}

/* Selection Overlays */
.selected {
    background: rgba(0, 240, 255, 0.3) !important;
    box-shadow: inset 0 0 12px #00f0ff;
}

.move {
    background: rgba(255, 148, 77, 0.25) !important;
    box-shadow: inset 0 0 10px #ff944d;
}

/* White Pieces: Colored Gold Outlines Only */
.white-piece {
    color: transparent !important;
    background: none;
    -webkit-text-stroke: 1.5px #ffd700;
    filter: drop-shadow(0 0 3px #ff4500);
}

/* Black Pieces: Crosshatched from top-right to bottom-left using Cyan lines */
.black-piece {
    color: transparent !important;
    background: repeating-linear-gradient(
        45deg,
        #00f0ff 0px,
        #00f0ff 1.5px,
        rgba(20, 20, 20, 0.3) 2px,
        rgba(20, 20, 20, 0.3) 5px
    );
    -webkit-background-clip: text;
    background-clip: text;
    filter: drop-shadow(0 0 2px rgba(0, 240, 255, 0.8));
}

/* Button UI */
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

<div id="game-wrap">
    <div id="status">Loading...</div>
    <div id="board"></div>
    <button id="resetBtn">Reset Game</button>
</div>

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

    const pieces = {
        p: "♟", r: "♜", n: "♞", b: "♝", q: "♛", k: "♚",
        P: "♙", R: "♖", N: "♘", B: "♗", Q: "♕", K: "♔"
    };

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

                if ((row + col) % 2 === 0) {
                    square.classList.add("light");
                } else {
                    square.classList.add("dark");
                }

                if (coord === selected) {
                    square.classList.add("selected");
                }

                if (legalMoves.some(move => move.to === coord)) {
                    square.classList.add("move");
                }

                const piece = board[row][col];

                if (piece) {
                    const symbol = piece.color === "w" ? pieces[piece.type.toUpperCase()] : pieces[piece.type];
                    square.textContent = symbol;
                    square.classList.add(piece.color === "w" ? "white-piece" : "black-piece");
                }

                square.addEventListener("click", () => clickSquare(coord));
                boardEl.appendChild(square);
            }
        }
        updateStatus();
    }

    function clickSquare(coord) {
        const clickedPiece = game.get(coord);

        if (selected) {
            const move = game.move({
                from: selected,
                to: coord,
                promotion: "q"
            });

            if (move) {
                selected = null;
                renderBoard();
                return;
            }

            if (clickedPiece && clickedPiece.color === game.turn()) {
                selected = coord;
            } else {
                selected = null;
            }
        } else {
            if (clickedPiece && clickedPiece.color === game.turn()) {
                selected = coord;
            }
        }
        renderBoard();
    }

    resetBtn.addEventListener("click", () => {
        game.reset();
        selected = null;
        renderBoard();
    });

    renderBoard();
});
</script>
