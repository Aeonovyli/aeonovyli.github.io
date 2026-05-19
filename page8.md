---
layout: default
title: Sudoku
---

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
    grid-template-columns: repeat(9, min(9.5vw, 55px));
    grid-template-rows: repeat(9, min(9.5vw, 55px));
    border: 3px solid #ffd700;
    box-shadow: 0 0 25px rgba(0, 240, 255, 0.4);
    background: #141414; 
    border-radius: 4px;
    overflow: hidden;
    position: relative;
    gap: 0;
}

.square {
    width: min(9.5vw, 55px);
    height: min(9.5vw, 55px);
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    cursor: pointer;
    user-select: none;
    font-family: 'Cormorant Garamond', serif !important;
    font-size: 1.6rem;
    color: #00f0ff;
    text-shadow: 0 0 8px #00f0ff;
    background-color: #141414;
    border-right: 1px solid rgba(255, 215, 0, 0.3);
    border-bottom: 1px solid rgba(255, 215, 0, 0.3);
}

/* Clear outer bounds overlapping container frames */
#board > :nth-child(9n) { border-right: none; }
#board > :nth-child(n+73) { border-bottom: none; }

/* Thick internal 3x3 box separator grids */
#board > :nth-child(3n):not(:nth-child(9n)) { border-right: 3px solid #ffd700; }
#board > :nth-child(n+19):nth-child(-n+27),
#board > :nth-child(n+46):nth-child(-n+54) { border-bottom: 3px solid #ffd700; }

.clue {
    color: #ffd700;
    font-weight: bold;
    text-shadow: 1px 1px 4px #ff4500;
    background-color: rgba(45, 45, 45, 0.4);
}

.selected {
    background: rgba(255, 215, 0, 0.25) !important;
    box-shadow: inset 0 0 12px #ffd700;
}

.highlight-cross {
    background-color: rgba(0, 240, 255, 0.08);
}

.highlight-match {
    background-color: rgba(0, 240, 255, 0.25);
}

.mistake {
    color: #ff4500 !important;
    text-shadow: 0 0 8px #ff4500, 1px 1px 2px #000 !important;
}

.controls-row {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 20px;
    width: 100%;
    max-width: 450px;
}

.input-pad {
    display: flex;
    justify-content: space-between;
    width: 100%;
    max-width: 450px;
    margin-top: 20px;
}

.input-pad button {
    background: none;
    border: none;
    color: #00f0ff;
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.3rem;
    text-shadow: 0 0 8px #00f0ff;
    cursor: pointer;
    flex: 1;
    padding: 5px 0;
    transition: transform 0.1s;
}

.input-pad button:active {
    transform: scale(0.85);
    color: #ff944d;
}

.action-btn {
    background-color: rgba(255, 215, 0, 0.1);
    color: #ffd700;
    border: 2px solid #ffd700;
    padding: 8px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1em;
    text-shadow: 1px 1px 4px #ff4500, 0 0 8px #00f0ff;
    transition: all 0.3s ease;
}

.action-btn:hover {
    background-color: rgba(255, 215, 0, 0.2);
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.6);
}
</style>

<div id="game-wrap">
    <div id="status">Sudoku</div>
    <div id="board"></div>
    
    <div class="controls-row">
        <button class="action-btn" onclick="undoMove()">Undo</button>
        <button class="action-btn" onclick="eraseCell()">Erase</button>
        <button class="action-btn" onclick="generateNewGame()">New Game</button>
    </div>

    <div class="input-pad">
        <button onclick="inputNumber(1)">1</button>
        <button onclick="inputNumber(2)">2</button>
        <button onclick="inputNumber(3)">3</button>
        <button onclick="inputNumber(4)">4</button>
        <button onclick="inputNumber(5)">5</button>
        <button onclick="inputNumber(6)">6</button>
        <button onclick="inputNumber(7)">7</button>
        <button onclick="inputNumber(8)">8</button>
        <button onclick="inputNumber(9)">9</button>
    </div>
</div>

<script>
  let fullSolution = [];
  let puzzleLayout = [];
  let selectedCell = null;
  let moveHistory = [];

  function isValid(board, r, c, val) {
    for (let i = 0; i < 9; i++) {
      if (board[r][i] === val || board[i][c] === val) return false;
    }
    let br = Math.floor(r / 3) * 3;
    let bc = Math.floor(c / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[br + i][bc + j] === val) return false;
      }
    }
    return true;
  }

  function fillBoard(board) {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === 0) {
          let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
          for (let num of numbers) {
            if (isValid(board, r, c, num)) {
              board[r][c] = num;
              if (fillBoard(board)) return true;
              board[r][c] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  function createRandomPuzzle() {
    let board = Array.from({ length: 9 }, () => Array(9).fill(0));
    fillBoard(board);
    fullSolution = board.map(row => [...row]);

    let attempts = 45;
    while (attempts > 0) {
      let r = Math.floor(Math.random() * 9);
      let c = Math.floor(Math.random() * 9);
      if (board[r][c] !== 0) {
        board[r][c] = 0;
        attempts--;
      }
    }
    puzzleLayout = board;
  }

  function generateNewGame() {
    createRandomPuzzle();
    
    const boardEl = document.getElementById('board');
    boardEl.innerHTML = '';
    selectedCell = null;
    moveHistory = [];
    
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const cell = document.createElement('div');
        cell.className = 'square';
        cell.dataset.row = r;
        cell.dataset.col = c;
        
        if (puzzleLayout[r][c] !== 0) {
          cell.innerText = puzzleLayout[r][c];
          cell.classList.add('clue');
        }
        
        cell.addEventListener('click', function() {
          selectCell(this);
        });
        
        boardEl.appendChild(cell);
      }
    }
    document.getElementById('status').innerText = "Sudoku";
  }

  function selectCell(cell) {
    if (selectedCell) selectedCell.classList.remove('selected');
    selectedCell = cell;
    selectedCell.classList.add('selected');
    
    applyVisualHighlights();
  }

  function applyVisualHighlights() {
    const cells = document.querySelectorAll('.square');
    cells.forEach(c => {
      c.classList.remove('highlight-cross', 'highlight-match');
    });

    if (!selectedCell) return;

    const targetRow = parseInt(selectedCell.dataset.row);
    const targetCol = parseInt(selectedCell.dataset.col);
    const targetVal = selectedCell.innerText;
    const targetBlockRow = Math.floor(targetRow / 3);
    const targetBlockCol = Math.floor(targetCol / 3);

    cells.forEach(c => {
      const r = parseInt(c.dataset.row);
      const col = parseInt(c.dataset.col);
      const blockRow = Math.floor(r / 3);
      const blockCol = Math.floor(col / 3);

      if (r === targetRow || col === targetCol || (blockRow === targetBlockRow && blockCol === targetBlockCol)) {
        if (c !== selectedCell) {
          c.classList.add('highlight-cross');
        }
      }

      if (targetVal !== '' && c.innerText === targetVal && c !== selectedCell) {
        c.classList.add('highlight-match');
      }
    });
  }

  function inputNumber(num) {
    if (!selectedCell || selectedCell.classList.contains('clue')) return;
    
    moveHistory.push({
      cell: selectedCell,
      prevValue: selectedCell.innerText,
      prevMistake: selectedCell.classList.contains('mistake')
    });
    
    selectedCell.innerText = num;
    
    const r = parseInt(selectedCell.dataset.row);
    const c = parseInt(selectedCell.dataset.col);
    if (num !== fullSolution[r][c]) {
      selectedCell.classList.add('mistake');
    } else {
      selectedCell.classList.remove('mistake');
      checkWinCondition();
    }

    applyVisualHighlights();
  }

  function eraseCell() {
    if (!selectedCell || selectedCell.classList.contains('clue')) return;
    
    moveHistory.push({
      cell: selectedCell,
      prevValue: selectedCell.innerText,
      prevMistake: selectedCell.classList.contains('mistake')
    });
    
    selectedCell.innerText = '';
    selectedCell.classList.remove('mistake');
    applyVisualHighlights();
  }

  function undoMove() {
    if (moveHistory.length === 0) return;
    const lastMove = moveHistory.pop();
    lastMove.cell.innerText = lastMove.prevValue;
    
    if (lastMove.prevMistake) {
      lastMove.cell.classList.add('mistake');
    } else {
      lastMove.cell.classList.remove('mistake');
    }
    
    selectCell(lastMove.cell);
  }

  function checkWinCondition() {
    const cells = document.querySelectorAll('.square');
    let won = true;
    cells.forEach(c => {
      const r = parseInt(c.dataset.row);
      const col = parseInt(c.dataset.col);
      if (parseInt(c.innerText) !== fullSolution[r][col]) {
        won = false;
      }
    });
    if (won) {
      document.getElementById('status').innerText = "VICTORY — Puzzle Solved!";
    }
  }

  document.addEventListener('keydown', (e) => {
    if (!selectedCell) return;
    if (e.key >= '1' && e.key <= '9') {
      inputNumber(parseInt(e.key));
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      eraseCell();
    }
  });

  generateNewGame();
</script>
