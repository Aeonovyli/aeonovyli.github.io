---
layout: default
title: Sudoku
---

<div id="game-wrap">
    <div id="status">Sudoku</div>
    <div id="board"></div>
    <div class="sudoku-controls-row">
        <div class="btn-item-wrap">
            <button class="flat-btn" onclick="undoMove()" aria-label="Undo">
                <svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
            </button>
            <div class="btn-label">Undo</div>
        </div>
        <div class="btn-item-wrap">
            <button class="flat-btn" onclick="eraseCell()" aria-label="Erase">
                <svg viewBox="0 0 24 24"><path d="M20 20H4"></path><path d="M18 12l-5-5L4 16v4h4l9-9z"></path></svg>
            </button>
            <div class="btn-label">Erase</div>
        </div>
        <div class="btn-item-wrap">
            <button id="notes-btn" class="flat-btn" onclick="toggleNotes()" aria-label="Notes">
                <svg viewBox="0 0 24 24"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            </button>
            <span id="notes-badge" class="badge-pill badge-off">OFF</span>
            <div class="btn-label">Notes</div>
        </div>
        <div class="btn-item-wrap">
            <button class="flat-btn" onclick="useHint()" aria-label="Hint">
                <svg viewBox="0 0 24 24"><path d="M9 21h6"></path><path d="M9 18h6"></path><path d="M10 15H14C17 15 19 13 19 10C19 6.5 16 4 12 4C8 4 5 6.5 5 10C5 13 7 15 10 15Z"></path></svg>
            </button>
            <span id="hint-badge" class="badge-pill badge-count">3</span>
            <div class="btn-label">Hint</div>
        </div>
    </div>
    <div class="input-pad">
        <div class="pad-btn-wrap" id="pad-w-1"><div class="pad-dot"></div><button data-num="1">1</button></div>
        <div class="pad-btn-wrap" id="pad-w-2"><div class="pad-dot"></div><button data-num="2">2</button></div>
        <div class="pad-btn-wrap" id="pad-w-3"><div class="pad-dot"></div><button data-num="3">3</button></div>
        <div class="pad-btn-wrap" id="pad-w-4"><div class="pad-dot"></div><button data-num="4">4</button></div>
        <div class="pad-btn-wrap" id="pad-w-5"><div class="pad-dot"></div><button data-num="5">5</button></div>
        <div class="pad-btn-wrap" id="pad-w-6"><div class="pad-dot"></div><button data-num="6">6</button></div>
        <div class="pad-btn-wrap" id="pad-w-7"><div class="pad-dot"></div><button data-num="7">7</button></div>
        <div class="pad-btn-wrap" id="pad-w-8"><div class="pad-dot"></div><button data-num="8">8</button></div>
        <div class="pad-btn-wrap" id="pad-w-9"><div class="pad-dot"></div><button data-num="9">9</button></div>
    </div>
    <div class="new-game-container">
        <button class="new-game-btn" onclick="generateNewGame()">New Game</button>
    </div>
</div>

<script>
  let fullSolution = [];
  let puzzleLayout = [];
  let selectedCell = null;
  let activeNumberTool = null;
  let moveHistory = [];
  let notesMode = false;
  let hintsLeft = 3;
  let gameActive = true;
  let pressTimer = null;
  let longPressed = false;
  
  let cellNotes = Array.from({ length: 81 }, () => Array(10).fill(false));

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

  function checkToolVanishCondition(num) {
    let correctCount = 0;
    const squares = document.querySelectorAll('.square');
    squares.forEach(s => {
        const val = s.querySelector('.cell-value').innerText;
        const r = parseInt(s.dataset.row);
        const c = parseInt(s.dataset.col);
        if (parseInt(val) === num && num === fullSolution[r][c]) {
            correctCount++;
        }
    });
    if (correctCount === 9) {
        if (activeNumberTool === num) {
            clearActiveNumberTool();
        }
    }
  }

  function generateNewGame() {
    createRandomPuzzle();
    
    const boardEl = document.getElementById('board');
    boardEl.className = ''; 
    boardEl.innerHTML = '';
    selectedCell = null;
    moveHistory = [];
    cellNotes = Array.from({ length: 81 }, () => Array(10).fill(false));
    hintsLeft = 3;
    gameActive = true;
    document.getElementById('hint-badge').innerText = hintsLeft;
    clearActiveNumberTool();
    
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const cell = document.createElement('div');
        cell.className = 'square';
        cell.dataset.row = r;
        cell.dataset.col = c;
        cell.dataset.index = (r * 9) + c;
        
        const valDiv = document.createElement('div');
        valDiv.className = 'cell-value';
        cell.appendChild(valDiv);
        
        if (puzzleLayout[r][c] !== 0) {
          valDiv.innerText = puzzleLayout[r][c];
          cell.classList.add('clue');
        }
        
        cell.addEventListener('click', function(e) {
          if (!gameActive) return;
          clickSquareAction(this);
        });
        
        boardEl.appendChild(cell);
      }
    }
    document.getElementById('status').innerText = "Sudoku";
  }

  function handlePadStart(num) {
    if (!gameActive) return;
    longPressed = false;
    pressTimer = setTimeout(() => {
      longPressed = true;
      toggleNumberTool(num);
    }, 2000);
  }

  function handlePadEnd(num) {
    clearTimeout(pressTimer);
    if (!gameActive) return;
    if (!longPressed) {
      if (selectedCell && !selectedCell.classList.contains('clue')) {
        executeCellInput(selectedCell, num);
      }
    }
  }

  function toggleNumberTool(num) {
    let correctCount = 0;
    const squares = document.querySelectorAll('.square');
    squares.forEach(s => {
        const val = s.querySelector('.cell-value').innerText;
        const r = parseInt(s.dataset.row);
        const c = parseInt(s.dataset.col);
        if (parseInt(val) === num && num === fullSolution[r][c]) {
            correctCount++;
        }
    });
    if (correctCount === 9) return;

    document.querySelectorAll('.pad-btn-wrap').forEach(w => w.classList.remove('tool-active'));
    if (selectedCell) {
        selectedCell.classList.remove('selected');
        selectedCell = null;
    }
    if (activeNumberTool === num) {
        activeNumberTool = null;
    } else {
        activeNumberTool = num;
        document.getElementById('pad-w-' + num).classList.add('tool-active');
    }
    applyVisualHighlights();
  }

  function clearActiveNumberTool() {
    activeNumberTool = null;
    document.querySelectorAll('.pad-btn-wrap').forEach(w => w.classList.remove('tool-active'));
  }

  function clickSquareAction(cell) {
    if (activeNumberTool !== null) {
        if (cell.classList.contains('clue')) return;
        executeCellInput(cell, activeNumberTool);
    } else {
        if (selectedCell) selectedCell.classList.remove('selected');
        selectedCell = cell;
        selectedCell.classList.add('selected');
        applyVisualHighlights();
    }
  }

  function applyVisualHighlights() {
    const cells = document.querySelectorAll('.square');
    cells.forEach(c => c.classList.remove('highlight-cross', 'highlight-match'));

    let checkCell = selectedCell;
    let targetVal = checkCell ? checkCell.querySelector('.cell-value').innerText : "";

    if (activeNumberTool !== null) {
        targetVal = activeNumberTool.toString();
        checkCell = null;
    }

    if (!checkCell && targetVal === "") return;

    let targetRow = checkCell ? parseInt(checkCell.dataset.row) : -1;
    let targetCol = checkCell ? parseInt(checkCell.dataset.col) : -1;
    let targetBlockRow = checkCell ? Math.floor(targetRow / 3) : -1;
    let targetBlockCol = checkCell ? Math.floor(targetCol / 3) : -1;

    cells.forEach(c => {
      const r = parseInt(c.dataset.row);
      const col = parseInt(c.dataset.col);
      const blockRow = Math.floor(r / 3);
      const blockCol = Math.floor(col / 3);
      const valDiv = c.querySelector('.cell-value');

      if (checkCell) {
          if (r === targetRow || col === targetCol || (blockRow === targetBlockRow && blockCol === targetBlockCol)) {
            if (c !== checkCell) c.classList.add('highlight-cross');
          }
      }

      if (targetVal !== '' && valDiv && valDiv.innerText === targetVal && c !== checkCell) {
        c.classList.add('highlight-match');
      }
    });
  }

  function renderCellNotes(cell, idx) {
    const valDiv = cell.querySelector('.cell-value');
    valDiv.innerText = '';
    
    let notesGrid = cell.querySelector('.notes-grid');
    if (!notesGrid) {
        notesGrid = document.createElement('div');
        notesGrid.className = 'notes-grid';
        cell.appendChild(notesGrid);
    }
    notesGrid.innerHTML = '';
    
    for (let i = 1; i <= 9; i++) {
        const digitDiv = document.createElement('div');
        digitDiv.className = 'note-digit';
        digitDiv.innerText = cellNotes[idx][i] ? i : '';
        notesGrid.appendChild(digitDiv);
    }
  }

  function clearCellNotesDisplay(cell) {
      const notesGrid = cell.querySelector('.notes-grid');
      if (notesGrid) notesGrid.remove();
  }

  function clearConflictingNotes(row, col, num) {
    const blockRow = Math.floor(row / 3) * 3;
    const blockCol = Math.floor(col / 3) * 3;
    const cells = document.querySelectorAll('.square');

    cells.forEach(c => {
      const r = parseInt(c.dataset.row);
      const oCol = parseInt(c.dataset.col);
      const bR = Math.floor(r / 3) * 3;
      const bC = Math.floor(oCol / 3) * 3;
      const idx = parseInt(c.dataset.index);

      if (r === row || oCol === col || (bR === blockRow && bC === blockCol)) {
        if (cellNotes[idx][num]) {
          cellNotes[idx][num] = false;
          if (c.querySelector('.cell-value').innerText === '') {
            renderCellNotes(c, idx);
          }
        }
      }
    });
  }

  function executeCellInput(cell, num) {
    const idx = parseInt(cell.dataset.index);
    const valDiv = cell.querySelector('.cell-value');
    
    if (notesMode) {
        if (valDiv.innerText !== '') return; 
        
        moveHistory.push({
            type: 'note',
            index: idx,
            prevNotes: [...cellNotes[idx]]
        });
        
        cellNotes[idx][num] = !cellNotes[idx][num]; 
        renderCellNotes(cell, idx);
        return;
    }
    
    clearCellNotesDisplay(cell);
    
    moveHistory.push({
      type: 'value',
      cell: cell,
      index: idx,
      prevValue: valDiv.innerText,
      prevMistake: cell.classList.contains('mistake'),
      prevNotes: [...cellNotes[idx]]
    });
    
    valDiv.innerText = num;
    cellNotes[idx] = Array(10).fill(false);
    
    const r = parseInt(cell.dataset.row);
    const c = parseInt(cell.dataset.col);
    if (num !== fullSolution[r][c]) {
      cell.classList.add('mistake');
    } else {
      cell.classList.remove('mistake');
      clearConflictingNotes(r, c, num);
      checkToolVanishCondition(num);
      checkWinCondition();
    }
    applyVisualHighlights();
  }

  function undoMove() {
    if (!gameActive || moveHistory.length === 0) return;
    const lastMove = moveHistory.pop();
    
    if (lastMove.type === 'note') {
        cellNotes[lastMove.index] = lastMove.prevNotes;
        const cell = document.querySelector(`[data-index='${lastMove.index}']`);
        renderCellNotes(cell, lastMove.index);
    } else if (lastMove.type === 'value') {
        lastMove.cell.querySelector('.cell-value').innerText = lastMove.prevValue;
        cellNotes[lastMove.index] = lastMove.prevNotes;
        if (lastMove.prevMistake) {
          lastMove.cell.classList.add('mistake');
        } else {
          lastMove.cell.classList.remove('mistake');
        }
        if (lastMove.prevValue === '') {
            let hasNotes = lastMove.prevNotes.some(n => n === true);
            if (hasNotes) renderCellNotes(lastMove.cell, lastMove.index);
        }
    } else if (lastMove.type === 'erase') {
        lastMove.cell.querySelector('.cell-value').innerText = lastMove.prevValue;
        if (lastMove.prevMistake) lastMove.cell.classList.add('mistake');
        cellNotes[lastMove.index] = lastMove.prevNotes;
        
        if (lastMove.prevValue === '') {
            renderCellNotes(lastMove.cell, lastMove.index);
        } else {
            clearCellNotesDisplay(lastMove.cell);
        }
    }
    applyVisualHighlights();
  }

  function eraseCell() {
    if (!gameActive || !selectedCell || selectedCell.classList.contains('clue')) return;
    const idx = parseInt(selectedCell.dataset.index);
    const valDiv = selectedCell.querySelector('.cell-value');
    
    moveHistory.push({
        type: 'erase',
        cell: selectedCell,
        index: idx,
        prevValue: valDiv.innerText,
        prevMistake: selectedCell.classList.contains('mistake'),
        prevNotes: [...cellNotes[idx]]
    });
    
    valDiv.innerText = '';
    selectedCell.classList.remove('mistake');
    cellNotes[idx] = Array(10).fill(false);
    clearCellNotesDisplay(selectedCell);
    applyVisualHighlights();
  }

  function toggleNotes() {
      if (!gameActive) return;
      notesMode = !notesMode;
      const btn = document.getElementById('notes-btn');
      const badge = document.getElementById('notes-badge');
      
      if (notesMode) {
          btn.classList.add('active-toggle');
          badge.innerText = "ON";
          badge.className = "badge-pill badge-on";
      } else {
          btn.classList.remove('active-toggle');
          badge.innerText = "OFF";
          badge.className = "badge-pill badge-off";
      }
  }

  function useHint() {
      if (!gameActive || !selectedCell || selectedCell.classList.contains('clue')) return;
      if (hintsLeft <= 0) {
          document.getElementById('status').innerText = "Out of hints!";
          return;
      }
      
      const r = parseInt(selectedCell.dataset.row);
      const c = parseInt(selectedCell.dataset.col);
      
      const notesState = notesMode;
      notesMode = false; 
      executeCellInput(selectedCell, fullSolution[r][c]);
      notesMode = notesState;
      
      hintsLeft--;
      document.getElementById('hint-badge').innerText = hintsLeft;
  }

  function checkWinCondition() {
    const cells = document.querySelectorAll('.square');
    let won = true;
    cells.forEach(c => {
      const r = parseInt(c.dataset.row);
      const col = parseInt(c.dataset.col);
      const innerVal = c.querySelector('.cell-value').innerText;
      if (innerVal === '' || parseInt(innerVal) !== fullSolution[r][col]) {
        won = false;
      }
    });
    
    if (won) {
      gameActive = false; 
      if (selectedCell) selectedCell.classList.remove('selected');
      clearActiveNumberTool();
      cells.forEach(c => c.classList.remove('highlight-cross', 'highlight-match'));
      document.getElementById('board').classList.add('game-won');
      document.getElementById('status').innerText = "VICTORY — Puzzle Solved!";
    }
  }

  function bindPadEvents() {
    for (let i = 1; i <= 9; i++) {
      const btn = document.querySelector(`.input-pad button[data-num="${i}"]`);
      if (btn) {
        btn.addEventListener('mousedown', () => handlePadStart(i));
        btn.addEventListener('touchstart', (e) => {
          e.preventDefault();
          handlePadStart(i);
        });
        
        btn.addEventListener('mouseup', () => handlePadEnd(i));
        btn.addEventListener('mouseleave', () => clearTimeout(pressTimer));
        btn.addEventListener('touchend', () => handlePadEnd(i));
      }
    }
  }

  document.addEventListener('keydown', (e) => {
    if (!gameActive) return;
    if (e.key >= '1' && e.key <= '9') {
      const val = parseInt(e.key);
      if (selectedCell) {
          executeCellInput(selectedCell, val);
      }
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      eraseCell();
    }
  });

  generateNewGame();
  bindPadEvents();
</script>

