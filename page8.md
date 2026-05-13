---
layout: default
title: Chess
---

<style>
body {
    margin: 0;
    padding: 0;
    background: #111;
    color: white;
    font-family: Arial, sans-serif;
}

#game-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px 10px;
}

#status {
    font-size: 28px;
    margin-bottom: 20px;
    font-weight: bold;
    text-align: center;
}

#board {
    display: grid;
    grid-template-columns: repeat(8, min(11vw, 70px));
    grid-template-rows: repeat(8, min(11vw, 70px));
    border: 4px solid #222;
    box-shadow: 0 0 20px rgba(0,0,0,0.5);
}

.square {
    width: min(11vw, 70px);
    height: min(11vw, 70px);

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: min(8vw, 48px);
    cursor: pointer;
    user-select: none;
}

.light {
    background: #f0d9b5;
}

.dark {
    background: #b58863;
}

.selected {
    background: #6fa8dc !important;
}

.move {
    background: #93c47d !important;
}

.white-piece {
    color: white;
    text-shadow:
        0 0 2px black,
        0 0 4px black;
}

.black-piece {
    color: black;
    text-shadow:
        0 0 2px white;
}

button {
    margin-top: 25px;
    padding: 12px 24px;
    font-size: 18px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    background: #444;
    color: white;
}

button:hover {
    background: #666;
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
        document.getElementById("status").innerText =
            "Failed to load chess engine.";
        return;
    }

    const game = new Chess();

    const boardEl = document.getElementById("board");
    const statusEl = document.getElementById("status");
    const resetBtn = document.getElementById("resetBtn");

    let selected = null;

    const pieces = {
        p: "♟",
        r: "♜",
        n: "♞",
        b: "♝",
        q: "♛",
        k: "♚",

        P: "♙",
        R: "♖",
        N: "♘",
        B: "♗",
        Q: "♕",
        K: "♔"
    };

    function squareName(row, col) {
        return "abcdefgh"[col] + (8 - row);
    }

    function updateStatus() {

        let text =
            (game.turn() === "w"
                ? "White"
                : "Black") + " to move";

        if (game.in_checkmate()) {
            text =
                "CHECKMATE — " +
                (game.turn() === "w"
                    ? "Black"
                    : "White") +
                " wins";
        }

        else if (game.in_draw()) {
            text = "Draw";
        }

        else if (game.in_check()) {
            text += " — CHECK";
        }

        statusEl.innerText = text;
    }

    function renderBoard() {

        boardEl.innerHTML = "";

        const board = game.board();

        let legalMoves = [];

        if (selected) {
            legalMoves =
                game.moves({
                    square: selected,
                    verbose: true
                });
        }

        for (let row = 0; row < 8; row++) {

            for (let col = 0; col < 8; col++) {

                const square =
                    document.createElement("div");

                const coord =
                    squareName(row, col);

                square.classList.add("square");

                if ((row + col) % 2 === 0) {
                    square.classList.add("light");
                } else {
                    square.classList.add("dark");
                }

                if (coord === selected) {
                    square.classList.add("selected");
                }

                if (
                    legalMoves.some(
                        move => move.to === coord
                    )
                ) {
                    square.classList.add("move");
                }

                const piece = board[row][col];

                if (piece) {

                    const symbol =
                        piece.color === "w"
                            ? pieces[piece.type.toUpperCase()]
                            : pieces[piece.type];

                    square.textContent = symbol;

                    square.classList.add(
                        piece.color === "w"
                            ? "white-piece"
                            : "black-piece"
                    );
                }

                square.addEventListener(
                    "click",
                    () => clickSquare(coord)
                );

                boardEl.appendChild(square);
            }
        }

        updateStatus();
    }

    function clickSquare(coord) {

        const clickedPiece =
            game.get(coord);

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

            if (
                clickedPiece &&
                clickedPiece.color === game.turn()
            ) {
                selected = coord;
            } else {
                selected = null;
            }
        }

        else {

            if (
                clickedPiece &&
                clickedPiece.color === game.turn()
            ) {
                selected = coord;
            }
        }

        renderBoard();
    }

    resetBtn.addEventListener(
        "click",
        () => {
            game.reset();
            selected = null;
            renderBoard();
        }
    );

    renderBoard();
});
</script>
