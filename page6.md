---
layout: default
title: Flash
---

##### Flash is a 2-6 player dice rolling game. There are not teams; each player is given six colored dice, while six 'chips', 1-6 are placed in the center. On the count of three, all players roll their dice until their dice match the combo set for that round. Winner of last round chooses a combo that hasn't been used.

<style>
    .flash-wrapper { background: #fff; padding: 15px; border-radius: 8px; font-family: sans-serif; overflow-x: auto; border: 2px solid #000; max-width: 900px; margin: auto; }
    table { width: 100%; border-collapse: collapse; min-width: 600px; }
    th, td { border: 1px solid #000; padding: 8px; text-align: center; height: 40px; }
    
    /* This removes the yellow/blue box and the outline entirely */
    input { 
        width: 100%; 
        height: 100%;
        border: none; 
        text-align: center; 
        font-size: 1.1rem; 
        outline: none !important; 
        background: transparent !important; 
        box-shadow: none !important;
        -webkit-tap-highlight-color: transparent; /* Fix for iPad/iPhone taps */
    }
    
    /* Specifically target focus state to prevent background changes */
    input:focus { 
        outline: none !important; 
        background-color: transparent !important; 
    }

    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button { display: none; }

    .category-col { text-align: left; font-weight: bold; width: 130px; background: #fafafa; }
    .name-input { font-weight: bold; text-transform: uppercase; }
    .total-row { font-weight: bold; font-size: 1.2rem; }
    
    .btn-reset { 
        margin-top: 15px; padding: 12px; background: #333; color: white; border: none; 
        cursor: pointer; width: 100%; font-weight: bold; border-radius: 4px;
    }
</style>

<div class="flash-wrapper">
    <table>
        <thead>
            <tr>
                <th>Category</th>
                <th><input type="text" placeholder="NAME" class="name-input"></th>
                <th><input type="text" placeholder="NAME" class="name-input"></th>
                <th><input type="text" placeholder="NAME" class="name-input"></th>
                <th><input type="text" placeholder="NAME" class="name-input"></th>
                <th><input type="text" placeholder="NAME" class="name-input"></th>
                <th><input type="text" placeholder="NAME" class="name-input"></th>
            </tr>
        </thead>
        <tbody id="scoresheet">
            <tr><td class="category-col">6 Kind</td><td><input type="number" oninput="calc()"></td><td><input type="number" oninput="calc()"></td><td><input type="number" oninput="calc()"></td><td><input type="number" oninput="calc()"></td><td><input type="number" oninput="calc()"></td><td><input type="number" oninput="calc()"></td></tr>
            <tr><td class="category-col">3 Pair</td><td><input type="number" oninput="calc()"></td><td><input type="number" oninput="calc()"></td><td><input type="number" oninput="calc()"></td><td><input type="number" oninput="calc()"></td><td><input type="number" oninput="calc()"></td><td><input type="number" oninput="calc()"></td></tr>
            <tr><td class="category-col">Even</td><td><input type="number" oninput="calc()"></td><td><input type="number" oninput="calc()"></td><td><input type="number" oninput="calc()"></td><td><input type="number" oninput="calc()"></td><td><input type="number" oninput="calc()"></td><td><input type="number" oninput="calc()"></td></tr>
            <tr><td class="category-col">4 Kind + Pair</td><td><input type="number" oninput="calc()"></td><td><input type="number" oninput="calc()"></td><td><input type="number" oninput="calc()"></td><td><input type="number" oninput="calc()"></td><td><input type="number" oninput="calc()"></td><td><input type="number" oninput="calc()"></td></tr>
            <tr><td class="category-col">Odds</td><td><input type="number" oninput="calc()"></td><td><input type="number" oninput="calc()"></td><td><input type="number" oninput="calc()"></td><td><input type="number" oninput="calc()"></td><td><input type="number" oninput="calc()"></td><td><input type="number" oninput="calc()"></td></tr>
            <tr><td class="category-col">Two 3-Kind</td><td><input type="number" oninput="calc()"></td><td><input type="number" oninput="calc()"></td><td><input type="number" oninput="calc()"></td><td><input type="number" oninput="calc()"></td><td><input type="number" oninput="calc()"></td><td><input type="number" oninput="calc()"></td></tr>
            <tr><td class="category-col">Straight</td><td><input type="number" oninput="calc()"></td><td><input type="number" oninput="calc()"></td><td><input type="number" oninput="calc()"></td><td><input type="number" oninput="calc()"></td><td><input type="number" oninput="calc()"></td><td><input type="number" oninput="calc()"></td></tr>
            <tr><td class="category-col">Flash</td><td><input type="number" oninput="calc()"></td><td><input type="number" oninput="calc()"></td><td><input type="number" oninput="calc()"></td><td><input type="number" oninput="calc()"></td><td><input type="number" oninput="calc()"></td><td><input type="number" oninput="calc()"></td></tr>
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
