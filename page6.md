---
layout: default
title: Flash
---

##### Flash is a 2-6 player dice rolling game. There are not teams; each player is given six colored dice, while six 'chips', 1-6 are placed in the center. On the count of three, all players roll their dice until their dice match the combo set for that round. Winner of last round chooses a combo that hasn't been used.

<style>
    .score-container { background: #1a1a1a; padding: 2rem; border-radius: 12px; color: white; max-width: 450px; margin: 20px auto; border: 1px solid #333; }
    .score-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; background: #2d2d2d; padding: 1rem; border-radius: 8px; }
    .team-info { flex-grow: 1; }
    .team-name { font-size: 1.1rem; font-weight: bold; border-bottom: 1px dashed #555; padding-bottom: 2px; }
    .score-val { font-size: 2.5rem; font-weight: 800; color: #3b82f6; margin: 10px 0; }
    .btn-group { display: flex; gap: 8px; }
    button { padding: 10px 15px; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; }
    .plus { background: #10b981; color: white; }
    .minus { background: #ef4444; color: white; }
    .reset-btn { width: 100%; background: #4b5563; color: white; padding: 12px; margin-top: 10px; }
</style>

<div class="score-container">
    <div class="score-row">
        <div class="team-info">
            <div class="team-name" contenteditable="true">HOME TEAM</div>
            <div class="score-val" id="h-score">0</div>
        </div>
        <div class="btn-group">
            <button class="minus" onclick="change('h', -1)">-</button>
            <button class="plus" onclick="change('h', 1)">+</button>
        </div>
    </div>

    <div class="score-row">
        <div class="team-info">
            <div class="team-name" contenteditable="true">AWAY TEAM</div>
            <div class="score-val" id="a-score">0</div>
        </div>
        <div class="btn-group">
            <button class="minus" onclick="change('a', -1)">-</button>
            <button class="plus" onclick="change('a', 1)">+</button>
        </div>
    </div>

    <button class="reset-btn" onclick="resetAll()">RESET MATCH</button>
</div>

<script>
    let matchData = JSON.parse(localStorage.getItem('silverstone-val')) || { h: 0, a: 0 };

    function refresh() {
        document.getElementById('h-score').innerText = matchData.h;
        document.getElementById('a-score').innerText = matchData.a;
        localStorage.setItem('silverstone-val', JSON.stringify(matchData));
    }

    function change(side, n) {
        matchData[side] = Math.max(0, matchData[side] + n);
        refresh();
    }

    function resetAll() {
        if(confirm("Start new match?")) {
            matchData = { h: 0, a: 0 };
            refresh();
        }
    }
    refresh();
</script>
