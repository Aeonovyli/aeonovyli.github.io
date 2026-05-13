---
layout: default
title: Chess
---

<style>
/* Game Container Styling matching .highlighted-section & .message-box */
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

/* Header Text Matching h1, h2, h3 */
#status {
    font-family: 'MedievalSharp', cursive, serif;
    font-size: 28px;
    margin-bottom: 20px;
    font-weight: bold;
    text-align: center;
    color: #ffd700;
    text-shadow: 1px 1px 4px #ff4500, 0 0 8px #00f0ff;
    transition: all 0.3s ease-in-out;
}

/* Chess Board Container */
#board {
    display: grid;
    grid-template-columns: repeat(8, min(11vw, 65px));
    grid-template-rows: repeat(8, min(11vw, 65px));
    border: 3px solid #ffd700;
    box-shadow: 0 0 15px rgba(0, 240, 255, 0.4);
    background-color: rgba(20, 20, 20, 0.9);
    border-radius: 4px;
    overflow: hidden;
}

/* Individual Board Squares */
.square {
    width: min(11vw, 65px);
    height: min(11vw, 65px);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: min(8vw, 44px);
    cursor: pointer;
    user-select: none;
    transition: background-color 0.2s ease, box-shadow 0.2s ease;
}

/* Board Squares Color Palette */
.light {
    background: rgba(235, 215, 180, 0.15); /* Soft translucent gold tint */
}

.dark {
    background: rgba(20, 20, 20, 0.85); /* Deep dark medieval contrast */
}

/* Game Interaction Overlays */
.selected {
    background: rgba(0, 240, 255, 0.35) !important; /* Cyan Glow Magic Layer */
    box-shadow: inset 0 0 10px #00f0ff;
}

.move {
    background: rgba(255, 148, 77, 0.3) !important; /* Orange Destination Layer */
    box-shadow: inset 0 0 8px #ff944d;
}

/* Chess Pieces Text Styling */
.white-piece {
    color: #ffd700 !important; /* Pure Gold Pieces */
    text-shadow: 0 0 4px #ff4500, 0 0 8px #ff4500;
}

.black-piece {
    color: #00f0ff !important; /* Cyan Ghostly Pieces */
    text-shadow: 0 0 4px #00f0ff, 0 0 8px rgba(0, 240, 255, 0.6);
}

/* Control Buttons Matching .submit-btn & Animations */
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

#resetBtn:hover, #resetBtn:focus {
    outline: none;
    background-color: rgba(255, 215, 0, 0.2);
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.6);
    color: #fff3a0;
    text-shadow: 2px 2px 6px #ff6347, 0 0 14px #87cefa, 0 0 20px #00f0ff;
}

#resetBtn:active {
    animation: clickGlow 0.6s ease-in-out 1;
}
</style>

<div id="game-wrap">
    <div id="status">Loading Engine...</div>
    <div id="board"></div>
    <button id="resetBtn">Reset Match</button>
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
        let text = (game.turn() === "w" ? "Gold" : "Cyan") + " to move";

        if (game.in_checkmate()) {
            text = "CHECKMATE — " + (game.turn() === "w" ? "Cyan" : "Gold") + " Victory";
        } else if (game.in_draw()) {
            text = "Stalemate — Draw";
        } else if (game.in_check()) {
            text += " — Under Check";
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
