---
layout: default
title: Flash
---

##### Flash is a 2-6 player dice rolling game. There are not teams; each player is given six colored dice, while six 'chips', 1-6 are placed in the center. On the count of three, all players roll their dice until their dice match the combo set for that round. Winner of last round chooses a combo that hasn't been used.

<style>
    .flash-wrapper { 
        background: #00000000; 
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
        background: #00000000;
    }

    th, td { 
        border: 2px solid #ffd700; 
        padding: 8px; 
        text-align: center; 
        height: 45px; 
        color: #ffd700; 
    }
    
    input { 
        width: 100%; 
        height: 100%;
        border: none; 
        text-align: center; 
        font-size: 1.2rem; 
        outline: none !important; 
        background: #00000000 !important; 
        color: #ffd700; 
        box-shadow: none !important;
        -webkit-tap-highlight-color: transparent;
    }
    
    input:focus { 
        outline: none !important; 
        background: #00000000 !important; 
    }

    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button { display: none; }

    .name-input { font-weight: bold; text-transform: uppercase; }
    .name-input::placeholder { color: #ffd700; opacity: 0.7; }

    .category-col { text-align: left; font-weight: bold; width: 135px; }
    .total-row { font-weight: bold; font-size: 1.3rem; }
    
    .btn-reset { 
        margin-top: 15px; padding: 12px; background: transparent; 
        color: #ffd700; border: 2px solid #ffd700; 
        cursor: pointer; width: 100%; font-weight: bold; border-radius: 4px;
        text-transform: uppercase;
    }
</style>

<div class="flash-wrapper">
    <table>
        <thead>
            <tr>
                <th>Category</th>
                <th><input type="text" placeholder="NAME" class="name-input" oninput="updateCount()"></th>
                <th><input type="text" placeholder="NAME" class="name-input" oninput="updateCount()"></th>
                <th><input type="text" placeholder="NAME" class="name-input" oninput="updateCount()"></th>
                <th><input type="text" placeholder="NAME" class="name-input" oninput="updateCount()"></th>
                <th><input type="text" placeholder="NAME" class="name-input" oninput="updateCount()"></th>
                <th><input type="text" placeholder="NAME" class="name-input" oninput="updateCount()"></th>
            </tr>
        </thead>
        <tbody id="scoresheet">
            <tr><td class="category-col">6 Kind</td><td><input type="number" oninput="val(this)"></td><td><input type="number" oninput="val(this)"></td><td><input type="number" oninput="val(this)"></td><td><input type="number" oninput="val(this)"></td><td><input type="number" oninput="val(this)"></td><td><input type="number" oninput="val(this)"></td></tr>
            <tr><td class="category-col">3 Pair</td><td><input type="number" oninput="val(this)"></td><td><input type="number" oninput="val(this)"></td><td><input type="number" oninput="val(this)"></td><td><input type="number" oninput="val(this)"></td><td><input type="number" oninput="val(this)"></td><td><input type="number" oninput="val(this)"></td></tr>
            <tr><td class="category-col">Even</td><td><input type="number" oninput="val(this)"></td><td><input type="number" oninput="val(this)"></td><td><input type="number" oninput="val(this)"></td><td><input type="number" oninput="val(this)"></td><td><input type="number" oninput="val(this)"></td><td><input type="number" oninput="val(this)"></td></tr>
            <tr><td class="category-col">4 Kind + Pair</td><td><input type="number" oninput="val(this)"></td><td><input type="number" oninput="val(this)"></td><td><input type="number" oninput="val(this)"></td><td><input type="number" oninput="val(this)"></td><td><input type="number" oninput="val(this)"></td><td><input type="number" oninput="val(this)"></td></tr>
            <tr><td class="category-col">Odds</td><td><input type="number" oninput="val(this)"></td><td><input type="number" oninput="val(this)"></td><td><input type="number" oninput="val(this)"></td><td><input type="number" oninput="val(this)"></td><td><input type="number" oninput="val(this)"></td><td><input type="number" oninput="val(this)"></td></tr>
            <tr><td class="category-col">Two 3-Kind</td><td><input type="number" oninput="val(this)"></td><td><input type="number" oninput="val(this)"></td><td><input type="number" oninput="val(this)"></td><td><input type="number" oninput="val(this)"></td><td><input type="number" oninput="val(this)"></td><td><input type="number" oninput="val(this)"></td></tr>
            <tr><td class="category-col">Straight</td><td><input type="number" oninput="val(this)"></td><td><input type="number" oninput="val(this)"></td><td><input type="number" oninput="val(this)"></td><td><input type="number" oninput="val(this)"></td><td><input type="number" oninput="val(this)"></td><td><input type="number" oninput="val(this)"></td></tr>
            <tr><td class="category-col">Flash</td><td><input type="number" oninput="val(this)"></td><td><input type="number" oninput="val(this)"></td><td><input type="number" oninput="val(this)"></td><td><input type="number" oninput="val(this)"></td><td><input type="number" oninput="val(this)"></td><td><input type="number" oninput="val(this)"></td></tr>
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
let pLimit = 0;

function updateCount() {
    const inputs = document.querySelectorAll('.name-input');
    // Start at 0, every typed name adds 1
    pLimit = Array.from(inputs).filter(i => i.value.trim() !== "").length;
    // Re-check all boxes against new limit
    document.querySelectorAll('#scoresheet input').forEach(i => val(i));
}

function val(el) {
    let v = parseInt(el.value);
    // If no names are typed, pLimit is 0, so no number can be entered
    if (isNaN(v)) return calc();
    if (v > pLimit) el.value = pLimit;
    if (v < 0) el.value = 0;
    calc();
}

function calc() {
    for (let c = 0; c < 6; c++) {
        let s = 0;
        document.querySelectorAll('#scoresheet tr').forEach(r => {
            let v = parseInt(r.cells[c+1].querySelector('input').value);
            if (!isNaN(v)) s += v;
        });
        document.getElementById('t' + c).innerText = s;
    }
}
</script>
