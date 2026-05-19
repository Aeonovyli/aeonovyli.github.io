---
layout: default
title: Sudoku
---

<div class="sudoku-wrapper-box">
  <div id="sudoku-grid" class="sudoku-grid-board"></div>
  
  <div class="sudoku-action-row">
    <button onclick="undoMove()">Undo</button>
    <button onclick="eraseCell()">Erase</button>
    <button onclick="generateNewGame()">New Game</button>
  </div>

  <div class="sudoku-input-pad">
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

<style>
  .sudoku-wrapper-box {
    max-width: 450px;
    margin: 20px auto;
    background-color: rgba(34, 34, 34, 0.9);
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
    border: 3px solid #ffd700;
    user-select: none;
    -webkit-user-select: none;
  }
  .sudoku-grid-board {
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    border-top: 3px solid #ffd700;
    border-left: 3px solid #ffd700;
    border-right: 3px solid #ffd700;
    border-bottom: 3px solid #ffd700;
    margin-bottom: 25px;
    background-color: #141414;
    gap: 0;
  }
  .sudoku-cell {
    width: 100%;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.6rem;
    font-family: 'Cormorant Garamond', serif !important;
    box-sizing: border-box;
    background-color: #141414;
    color: #00f0ff;
    text-shadow: 0 0 8px #00f0ff;
    cursor: pointer;
    transition: background-color 0.15s;
    border-right: 1px solid #ffd700;
    border-bottom: 1px solid #ffd700;
  }

  .sudoku-grid-board > :nth-child(9n) { border-right: none; }
  .sudoku-grid-board > :nth-child(n+73) { border-bottom: none; }

  .sudoku-grid-board > :nth-child(3n):not(:nth-child(9n)) { border-right: 3px solid #ffd700; }
  .sudoku-grid-board > :nth-child(n+19):nth-child(-n+27),
  .sudoku-grid-board > :nth-child(n+46):nth-child(-n+54) { border-bottom: 3px solid #ffd700; }

  .sudoku-cell.clue {
    color: #ffd700;
    font-weight: bold;
    text-shadow: 1px 1px 4px #ff4500;
    background-color: rgba(45, 45, 45, 0.4);
  }
  
  .sudoku-cell.selected {
    background-color: rgba(255, 215, 0, 0.35) !important;
  }
  .sudoku-cell.highlight-cross {
    background-color: rgba(0, 240, 255, 0.12);
  }
  .sudoku-cell.highlight-match {
    background-color: rgba(0, 240, 255, 0.3);
  }
  .sudoku-cell.mistake {
    color: #ff4500 !important;
    text-shadow: 0 0 8px #ff4500, 1px 1px 2px #000 !important;
  }

  .sudoku-action-row {
    display: flex;
    justify-content: space-around;
    margin-bottom: 25px;
  }
  .sudoku-action-row button {
    background: none;
    border: 1px solid #ffd700;
    color: #ffd700;
    padding: 5px 15px;
    border-radius: 4px;
    font-family: 'Cormorant Garamond', serif;
    font-size: 1rem;
    text-shadow: 1px 1px 4px #ff4500;
    cursor: pointer;
    transition: all 0.3s;
  }
  .sudoku-action-row button:hover {
    background-color: rgba(255, 215, 0, 0.2);
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  }
  .sudoku-input-pad {
    display: flex;
    justify-content: space-between;
  }
  .sudoku-input-pad button {
    background: none;
    border: none;
    color: #00f0ff;
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.5rem;
    text-shadow: 0 0 8px #00f0ff;
    cursor: pointer;
    flex: 1;
    padding: 5px 0;
    transition: transform 0.1s;
  }
  .sudoku-input-pad button:active {
    transform: scale(0.85);
    color: #ff944d;
  }
</style>

{% raw %}
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
    
    const gridElement = document.getElementById('sudoku-grid');
    gridElement.innerHTML = '';
    selectedCell = null;
    moveHistory = [];
    
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const cell = document.createElement('div');
        cell.className = 'sudoku-cell';
        cell.dataset.row = r;
        cell.dataset.col = c;
        
        if (puzzleLayout[r][c] !== 0) {
          cell.innerText = puzzleLayout[r][c];
          cell.classList.add('clue');
        } else {
          cell.innerText = '';
        }
        
        cell.addEventListener('click', function() {
          selectCell(this);
        });
        
        gridElement.appendChild(cell);
      }
    }
  }

  function selectCell(cell) {
    if (selectedCell) selectedCell.classList.remove('selected');
    selectedCell = cell;
    selectedCell.classList.add('selected');
    
    applyVisualHighlights();
  }

  function applyVisualHighlights() {
    const cells = document.querySelectorAll('.sudoku-cell');
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
