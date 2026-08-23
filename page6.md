---
layout: default
title: Flash | Aeonovyli's personal website
---

# Flash scoresheet

Flash is a 2-6 player dice rolling game. There are not teams; each player is given six colored dice, while six 'chips', 1-6 are placed in the center. On the count of three, all players roll their dice until their dice match the combo set for that round. Winner of last round chooses a combo that hasn't been used.

<style>
    .flash-wrapper { 
        background: transparent; 
        padding: 15px; 
        border-radius: 8px; 
        font-family: 'Cormorant Garamond', serif; 
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

    th, td { 
        border: 2px solid #ffd700; 
        padding: 0;
        text-align: center; 
        height: 50px; 
        color: #ffd700; 
    }
    
    input { 
        width: 100%; 
        height: 100%;
        border: none; 
        text-align: center; 
        font-size: 1.3rem; 
        outline: none !important; 
        background: transparent !important; 
        color: #ffd700; 
        font-family: inherit;
        box-shadow: none !important;
        -webkit-tap-highlight-color: transparent;
        display: block;
    }
    
    input:focus { 
        outline: none !important; 
        background: transparent !important; 
    }

    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button { display: none; }

    .name-input { 
        font-weight: bold; 
        text-transform: uppercase; 
    }

    .category-col { 
        text-align: left; 
        font-weight: bold; 
        width: 135px; 
        padding-left: 10px; 
    }
    
    .total-row { font-weight: bold; font-size: 1.3rem; }
    
    .btn-reset { 
        margin-top: 15px; padding: 12px; background: transparent; 
        color: #ffd700; border: 2px solid #ffd700; 
        cursor: pointer; width: 100%; font-weight: bold; border-radius: 4px;
        text-transform: uppercase;
        font-family: 'MedievalSharp', cursive;
    }
</style>

<div class="flash-wrapper">
    <table>
        <thead>
            <tr>
                <th>Category/Names</th>
                <th><input type="text" class="name-input" oninput="updateCount()"></th>
                <th><input type="text" class="name-input" oninput="updateCount()"></th>
                <th><input type="text" class="name-input" oninput="updateCount()"></th>
                <th><input type="text" class="name-input" oninput="updateCount()"></th>
                <th><input type="text" class="name-input" oninput="updateCount()"></th>
                <th><input type="text" class="name-input" oninput="updateCount()"></th>
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
                <td class="category-col">TOTAL</td>
                <td id="t0">0</td><td id="t1">0</td><td id="t2">0</td><td id="t3">0</td><td id="t4">0</td><td id="t5">0</td>
            </tr>
        </tfoot>
    </table>
    <button class="btn-reset" onclick="confirm('Clear board?') && window.location.reload()">Reload Page</button>
</div>

<script>
let pLimit = 0;

function updateCount() {
    const inputs = document.querySelectorAll('.name-input');
    pLimit = Array.from(inputs).filter(i => i.value.trim() !== "").length;
    document.querySelectorAll('#scoresheet input[type="number"]').forEach(i => val(i, true));
}

function val(el, isRefresh = false) {
    let v = parseInt(el.value);
    if (isNaN(v)) return calc();
    
    if (v > pLimit) el.value = pLimit;
    if (v <= 0) el.value = ""; 

    if (!isRefresh && el.value !== "") {
        let rowInputs = el.closest('tr').querySelectorAll('input[type="number"]');
        let isDuplicate = false;
        rowInputs.forEach(input => {
            if (input !== el && input.value === el.value) {
                isDuplicate = true;
            }
        });
        
        if (isDuplicate) {
            alert("Someone already claimed " + el.value + " for this combo!");
            el.value = "";
        }
    }
    
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

<nav class="nav">
<a href="/">Home</a>
<a href="/page1">Interests</a>
<a href="/page2">Contact me</a>
<a href="/page3">Profiles</a>
<a href="/page4">Eiriaoloth</a>
<a href="https://bz-next.github.io/mapviewer6/mapviewer.html">BZFlag map editor</a>
<a href="/page7">BZFlag</a>
<a href="/page8">Chess</a>
<a href="/page9">Sudoku</a>
<a href="/page10">Newsletter</a>
<a href="/page11">Keep android open</a>
</nav>
