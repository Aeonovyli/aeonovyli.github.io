---
layout: default
title: Flash
---

##### Flash is a 2-6 player dice rolling game. There are not teams; each player is given six colored dice, while six 'chips', 1-6 are placed in the center. On the count of three, all players roll their dice until their dice match the combo set for that round. Winner of last round chooses a combo that hasn't been used.

<style>
    /* Makes the entire container transparent to show your site background */
    .flash-wrapper { 
        background: transparent; 
        padding: 15px; 
        border-radius: 8px; 
        font-family: sans-serif; 
        overflow-x: auto; 
        max-width: 900px; 
        margin: auto; 
    }

    table { 
        width: 100%; 
        border-collapse: collapse; 
        min-width: 600px; 
        background: transparent;
    }

    /* Sets the outline color to Gold (#ffd700) */
    th, td { 
        border: 2px solid #ffd700; 
        padding: 8px; 
        text-align: center; 
        height: 40px; 
        color: #ffd700; /* Makes text match the gold theme */
    }
    
    input { 
        width: 100%; 
        height: 100%;
        border: none; 
        text-align: center; 
        font-size: 1.1rem; 
        outline: none !important; 
        background: transparent !important; 
        color: inherit; /* Matches the gold border */
        box-shadow: none !important;
        -webkit-tap-highlight-color: transparent;
    }
    
    input:focus { 
        outline: none !important; 
        background-color: transparent !important; 
    }

    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button { display: none; }

    .category-col { text-align: left; font-weight: bold; width: 130px; }
    .name-input { font-weight: bold; text-transform: uppercase; color: #ffd700; }
    .name-input::placeholder { color: rgba(255, 215, 0, 0.5); }
    .total-row { font-weight: bold; font-size: 1.2rem; }
    
    .btn-reset { 
        margin-top: 15px; padding: 12px; background: transparent; 
        color: #ffd700; border: 2px solid #ffd700; 
        cursor: pointer; width: 100%; font-weight: bold; border-radius: 4px;
    }
</style>

<div class="flash-wrapper">
    <table>
        <thead>
            <tr id="name-row">
                <th>Category</th>
                <th><input type="text" placeholder="NAME" class="name-input" oninput="updatePlayerCount()"></th>
                <th><input type="text" placeholder="NAME" class="name-input" oninput="updatePlayerCount()"></th>
                <th><input type="text" placeholder="NAME" class="name-input" oninput="updatePlayerCount()"></th>
                <th><input type="text" placeholder="NAME" class="name-input" oninput="updatePlayerCount()"></th>
                <th><input type="text" placeholder="NAME" class="name-input" oninput="updatePlayerCount()"></th>
                <th><input type="text" placeholder="NAME" class="name-input" oninput="updatePlayerCount()"></th>
            </tr>
        </thead>
        <tbody id="scoresheet">
            <tr><td class="category-col">6 Kind</td><td><input type="number" oninput="validate(this)"></td><td><input type="number" oninput="validate(this)"></td><td><input type="number" oninput="validate(this)"></td><td><input type="number" oninput="validate(this)"></td><td><input type="number" oninput="validate(this)"></td><td><input type="number" oninput="validate(this)"></td></tr>
            <tr><td class="category-col">3 Pair</td><td><input type="number" oninput="validate(this)"></td><td><input type="number" oninput="validate(this)"></td><td><input type="number" oninput="validate(this)"></td><td><input type="number" oninput="validate(this)"></td><td><input type="number" oninput="validate(this)"></td><td><input type="number" oninput="validate(this)"></td></tr>
            <tr><td class="category-col">Even</td><td><input type="number" oninput="validate(this)"></td><td><input type="number" oninput="validate(this)"></td><td><input type="number" oninput="validate(this)"></td><td><input type="number" oninput="validate(this)"></td><td><input type="number" oninput="validate(this)"></td><td><input type="number" oninput="validate(this)"></td></tr>
            <tr><td class="category-col">4 Kind + Pair</td><td><input type="number" oninput="validate(this)"></td><td><input type="number" oninput="validate(this)"></td><td><input type="number" oninput="validate(this)"></td><td><input type="number" oninput="validate(this)"></td><td><input type="number" oninput="validate(this)"></td><td><input type="number" oninput="validate(this)"></td></tr>
            <tr><td class="category-col">Odds</td><td><input type="number" oninput="validate(this)"></td><td><input type="number" oninput="validate(this)"></td><td><input type="number" oninput="validate(this)"></td><td><input type="number" oninput="validate(this)"></td><td><input type="number" oninput="validate(this)"></td><td><input type="number" oninput="validate(this)"></td></tr>
            <tr><td class="category-col">Two 3-Kind</td><td><input type="number" oninput="validate(this)"></td><td><input type="number" oninput="validate(this)"></td><td><input type="number" oninput="validate(this)"></td><td><input type="number" oninput="validate(this)"></td><td><input type="number" oninput="validate(this)"></td><td><input type="number" oninput="validate(this)"></td></tr>
            <tr><td class="category-col">Straight</td><td><input type="number" oninput="validate(this)"></td><td><input type="number" oninput="validate(this)"></td><td><input type="number" oninput="validate(this)"></td><td><input type="number" oninput="validate(this)"></td><td><input type="number" oninput="calc()"></td><td><input type="number" oninput="validate(this)"></td></tr>
            <tr><td class="category-col">Flash</td><td><input type="number" oninput="validate(this)"></td><td><input type="number" oninput="validate(this)"></td><td><input type="number" oninput="validate(this)"></td><td><input type="number" oninput="validate(this)"></td><td><input type="number" oninput="validate(this)"></td><td><input type="number" oninput="validate(this)"></td></tr>
        </tbody>
        <tfoot>
            <tr class="total-row">
                <td>TOTAL</td>
                <td id="t0">0</td><td id="t1">0</td><td id="t2">0</td><td id="t3">0</td><td id="t4">0</td><td id="t5">0</td>
            </tr>
        </tfoot>
    </table>
    <button class="btn-reset" onclick="confirm('Clear board?') && window.location.reload()">New Game</button>
</div>

<script>
let playerCount = 0;

function updatePlayerCount() {
    const nameInputs = document.querySelectorAll('.name-input');
    playerCount = Array.from(nameInputs).filter(input => input.value.trim() !== "").length;
    // Recalculate everything in case player count decreased below an existing score
    const allScores = document.querySelectorAll('#scoresheet input[type="number"]');
    allScores.forEach(input => validate(input));
}

function validate(el) {
    const val = parseInt(el.value);
    if (val > playerCount) {
        el.value = playerCount; // Auto-corrects to max allowed
    } else if (val < 0) {
        el.value = 0;
    }
    calc();
}

function calc() {
    for (let col = 0; col < 6; col++) {
        let sum = 0;
        let rows = document.querySelectorAll('#scoresheet tr');
        rows.forEach(row => {
            let val = parseInt(row.cells[col+1].querySelector('input').value);
            if (!isNaN(val)) sum += val;
        });
        document.getElementById('t' + col).innerText = sum;
    }
}
</script>
