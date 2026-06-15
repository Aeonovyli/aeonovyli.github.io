/*
    This file is part of Magnum.

    Copyright © 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019,
                2020, 2021, 2022, 2023 Vladimír Vondruš <mosra@centrum.cz>
    Copyright © 2020 Pablo Escobar <mail@rvrs.in>

    Permission is hereby granted, free of charge, to any person obtaining a
    copy of this software and associated documentation files (the "Software"),
    to deal in the Software without restriction, including without limitation
    the rights to use, copy, modify, merge, publish, distribute, sublicense,
    and/or sell copies of the Software, and to permit persons to whom the
    Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included
    in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
    THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
    DEALINGS IN THE SOFTWARE.
*/

"use strict"; /* it summons the Cthulhu in a proper way, they say */

/* Remap macOS Command+key to Ctrl+key so the Emscripten/WASM module receives
   standard shortcut events (copy, paste, cut, undo, select-all, etc.) on Mac.
   Installed on both the canvas and the document so it fires regardless of
   which element has focus. */
function installMacOSKeyRemap(canvas) {
    function remapMetaKey(e) {
        if (!e.metaKey) return;
        /* Let the browser handle Command+Tab, Command+Space, etc. */
        const passThrough = ['Tab', 'Space', ' '];
        if (passThrough.indexOf(e.key) !== -1) return;

        e.stopImmediatePropagation();
        e.preventDefault();

        const remapped = new KeyboardEvent(e.type, {
            key: e.key,
            code: e.code,
            keyCode: e.keyCode,
            which: e.which,
            ctrlKey: true,
            altKey: e.altKey,
            shiftKey: e.shiftKey,
            metaKey: false,
            bubbles: e.bubbles,
            cancelable: e.cancelable,
            composed: e.composed
        });

        (e.target || canvas).dispatchEvent(remapped);
    }

    canvas.addEventListener('keydown', remapMetaKey, true);
    canvas.addEventListener('keyup',   remapMetaKey, true);
    document.addEventListener('keydown', remapMetaKey, true);
    document.addEventListener('keyup',   remapMetaKey, true);

    /* Also forward browser paste events (Command+V triggers a native 'paste'
       event on macOS; synthesise an equivalent Ctrl+V so the WASM editor
       picks it up even if it only listens for keydown). */
    function forwardPaste(e) {
        const pasteKey = new KeyboardEvent('keydown', {
            key: 'v',
            code: 'KeyV',
            keyCode: 86,
            which: 86,
            ctrlKey: true,
            altKey: false,
            shiftKey: false,
            metaKey: false,
            bubbles: true,
            cancelable: true
        });
        canvas.dispatchEvent(pasteKey);
    }

    canvas.addEventListener('paste', forwardPaste, true);
    document.addEventListener('paste', forwardPaste, true);
}

function createMagnumModule(init) {
    /* Take the Emscripten-supplied Module object as a base */
    const module = Object.assign({}, Module);

    /* Update it with our things */
    Object.assign(module, {
        preRun: [],
        postRun: [],

        arguments: [],

        printErr: function(_message) {
            console.error(Array.prototype.slice.call(arguments).join(' '));
        },

        print: function(_message) {
            console.log(Array.prototype.slice.call(arguments).join(' '));
        },

        onAbort: function() {
            module.canvas.style.opacity = 0.333;
            module.canvas.style.zIndex = -1;
            module.setStatus("Oops :(");
            module.setStatusDescription("The app crashed. Refresh the page or check the browser console for details.");
        },

        canvas: document.getElementById('canvas'),
        status: document.getElementById('status'),
        statusDescription: document.getElementById('status-description'),

        setStatus: function(message) {
            /* Emscripten calls setStatus("") after a timeout even if the app
               aborts. That would erase the crash message, so don't allow that */
            if(module.status && module.status.innerHTML != "Oops :(")
                module.status.innerHTML = message;
        },

        setStatusDescription: function(message) {
            if(module.statusDescription)
                module.statusDescription.innerHTML = message;
        },

        totalDependencies: 0,

        monitorRunDependencies: function(left) {
            this.totalDependencies = Math.max(this.totalDependencies, left);

            if(left) {
                module.setStatus('Downloading...');
                module.setStatusDescription((this.totalDependencies - left) + ' / ' + this.totalDependencies);
            } else {
                module.setStatus('Download complete');
                module.setStatusDescription('');
            }
        }
    });

    /* Install macOS Command→Ctrl key remapping once the canvas is available */
    module.postRun.push(function() {
        installMacOSKeyRemap(module.canvas);
    });

    /* Parse arguments, e.g. /app/?foo=bar&fizz&buzz=3 goes to the app as
       ['--foo', 'bar', '--fizz', '--buzz', '3'] */
    const args = decodeURIComponent(window.location.search.substr(1)).trim().split('&');
    for(let i = 0; i != args.length; ++i) {
        let j = args[i].indexOf('=');
        /* Key + value */
        if(j != -1) {
            module.arguments.push('--' + args[i].substring(0, j));
            module.arguments.push(args[i].substring(j + 1));

        /* Just key */
        } else module.arguments.push('--' + args[i]);
    }

    /* Let the user-supplied object overwrite all the above */
    Object.assign(module, init);

    /* We can do this here because at this point `module.status` should be correct */
    module.setStatus("Downloading...");

    return module;
}

/* Default global Module object */
var Module = createMagnumModule();

/* UMD export */
if(typeof exports === 'object' && typeof module === 'object') /* CommonJS/Node */
    module.exports = createMagnumModule;
else if(typeof define === 'function' && define['amd']) /* AMD */
    define([], function() { return createMagnumModule; });
else if(typeof exports === 'object') /* CommonJS strict */
    exports["createMagnumModule"] = createMagnumModule;
