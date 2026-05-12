---
layout: default
title: Chess Game
---

<div id="chess-app-container" style="background:#0a0a0a; color:#ffcc00; padding:20px; font-family:'Times New Roman',serif; display:flex; flex-direction:column; align-items:center;">
    <link rel="stylesheet" href="https://cloudflare.com">
    <style>
        #board { width: 400px; max-width: 90vw; }
        .board-border { border: 3px solid #ffcc00; padding: 15px; background: #000; box-shadow: 0 0 15px rgba(255,204,0,0.3); }
        /* Dark Squares: 45° Crosshatch */
        .black-3c85d {
            background-color: rgba(255, 204, 0, 0.05) !important;
            background-image: linear-gradient(45deg, #ffcc00 0.5px, transparent 0.5px), linear-gradient(-45deg, #ffcc00 0.5px, transparent 0.5px) !important;
            background-size: 8px 8px !important;
        }
        .white-1e1d7 { background-color: transparent !important; }
        .notation-322f9 { color: #ffcc00 !important; font-weight: bold; }
        /* Black Piece: 90° Crosshatch Overlay */
        .b-piece-wrap { position: relative; width: 100%; height: 100%; }
        .b-piece-grid {
            background-image: linear-gradient(0deg, #ffcc00 1px, transparent 1px), linear-gradient(90deg, #ffcc00 1px, transparent 1px);
            background-size: 4px 4px;
            -webkit-mask-size: contain; mask-size: contain;
            -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
            width: 100%; height: 100%; position: absolute; top: 0; left: 0;
        }
        .status-box { margin-bottom: 15px; font-size: 1.2rem; text-transform: uppercase; letter-spacing: 2px; }
        .reload-text { margin-top: 25px; color: #ffcc00; font-style: italic; cursor: pointer; text-transform: uppercase; letter-spacing: 3px; font-size: 1.4rem; border: none; background: none; }
    </style>
    <div class="status-box" id="game-status">White to move</div>
    <div class="board-border">
        <div id="board"></div>
    </div>
    <button class="reload-text" onclick="location.reload()">RELOAD PAGE</button>
    <script src="https://jquery.com"></script>
    <script src="https://cloudflare.com"></script>
    <script src="https://cloudflare.com"></script>
    <script>
        $(function() {
            var game = new Chess();
            var statusEl = $('#game-status');
            function onDragStart (source, piece) {
                if (game.game_over()) return false;
                if ((game.turn() === 'w' && piece.search(/^b/) !== -1) || (game.turn() === 'b' && piece.search(/^w/) !== -1)) return false;
            }
            function onDrop (source, target) {
                var move = game.move({ from: source, to: target, promotion: 'q' });
                if (move === null) return 'snapback';
                updateStatus();
            }
            function updateStatus () {
                var status = (game.turn() === 'w' ? 'White' : 'Black') + ' to move';
                if (game.in_checkmate()) status = 'Checkmate! ' + (game.turn() === 'w' ? 'Black' : 'White') + ' wins.';
                else if (game.in_draw()) status = 'Draw Game';
                else if (game.in_check()) status += ' (CHECK)';
                statusEl.html(status);
            }
            var board = Chessboard('board', {
                draggable: true,
                position: 'start',
                onDragStart: onDragStart,
                onDrop: onDrop,
                onSnapEnd: function() { board.position(game.fen()) },
                pieceTheme: function(p) {
                    var u = 'https://chessboardjs.com' + p + '.png';
                    if (p.indexOf('b') === 0) {
                        return '<div class="b-piece-wrap"><img src="'+u+'" style="opacity:0.1;width:100%"><div class="b-piece-grid" style="-webkit-mask-image:url('+u+');mask-image:url('+u+')"></div></div>';
                    }
                    return '<img src="' + u + '" style="width:100%; filter: brightness(1.2);">';
                }
            });
            updateStatus();
        });
    </script>
</div>
