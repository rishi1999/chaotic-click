"use strict";
var layers = new Array();
var layerContexts = new Array();
var drawings = new Array();
var readyToFade = new Array();

function initializeCanvas() {
    var canvas = document.createElement('canvas');
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    canvas.style.position = "absolute";
    document.body.appendChild(canvas);
    var ctx = canvas.getContext("2d");
    canvas.addEventListener('click', handleClick, {once: true});

    layers.push(canvas);
    layerContexts.push(ctx);
}

initializeCanvas();

function handleClick() {
    initializeCanvas();

    const canvas = layers[drawings.length];

    let mouseX;
    let mouseY;
    const bounds = canvas.getBoundingClientRect();

    mouseX = event.pageX - bounds.left - scrollX;
    mouseY = event.pageY - bounds.top - scrollY;

    mouseX *= canvas.width / bounds.width;
    mouseY *= canvas.height / bounds.height;

    createClickDesign(drawings.length, mouseX, mouseY);
}

var degree = 20, density = 1, initialBarLength = 1, barIncrement = 0.03, radius = 1000, patternLength = 1, turnLimit = Math.PI;

function createClickDesign(clickNumber, mouseX, mouseY) {
    drawings.push(new Array());
    readyToFade[clickNumber] = 0;
    for (let i = 0; i < density; i++) {
        for (let j = 0; j < degree; j++) {
            generate(clickNumber, mouseX, mouseY, mouseX + Math.cos(i*2*Math.PI/degree) * initialBarLength, mouseY + Math.sin(i*2*Math.PI/degree) * initialBarLength, 0, Math.floor(Math.random() * 2 + 1), Math.floor(radius / initialBarLength), initialBarLength);
        }
    }
}

function generate(clickNumber, x0, y0, x1, y1, patternCount, lastDir, count, barLength) {
    layerContexts[clickNumber].beginPath();
    layerContexts[clickNumber].moveTo(x0, y0);
    layerContexts[clickNumber].lineTo(x1, y1);
    const colorVal = count / radius * initialBarLength * 255;
    layerContexts[clickNumber].strokeStyle="rgb(" + colorVal + ", " + 0 + ", " + 0 + ")";
    const path = {
        x0: x0,
        y0: y0,
        x1: x1,
        y1: y1,
        strokeColor: layerContexts[clickNumber].strokeStyle
    };
    drawings[clickNumber].push(path);
    layerContexts[clickNumber].globalAlpha = 1;
    layerContexts[clickNumber].stroke();

    if (count <= 1) {
        readyToFade[clickNumber]++;
        if (readyToFade[clickNumber] == density * degree) {
            fadeOut(clickNumber, 0.98);
        }
    } else {
        let dir;
        if (patternCount < patternLength) {
            dir = lastDir;
        } else {
            dir = Math.floor(Math.random() * 2) + 1;
            patternCount = 0;
        }

        let angle = Math.atan2(y1 - y0, x1 - x0);
        const angleDelta = Math.random() * turnLimit;
        if (dir == 1) {
            angle += angleDelta;
        } else {
            angle -= angleDelta;
        }
        const x2 = x1 + (barLength + barIncrement) * Math.cos(angle);
        const y2 = y1 + (barLength + barIncrement) * Math.sin(angle);

        setTimeout(generate, 2, clickNumber, x1, y1, x2, y2, patternCount + 1, dir, count - 1, barLength + barIncrement);
    }
}

function fadeOut(clickNumber, alpha) {
    const drawing = drawings[clickNumber];
    layerContexts[clickNumber].clearRect(0, 0, layers[clickNumber].width, layers[clickNumber].height);
    for (let j = 0; j < drawing.length; j++) {
        let path = drawing[j];
        layerContexts[clickNumber].beginPath();
        layerContexts[clickNumber].moveTo(path.x0, path.y0);
        layerContexts[clickNumber].lineTo(path.x1, path.y1);
        layerContexts[clickNumber].strokeStyle = path.strokeColor;
        layerContexts[clickNumber].globalAlpha = Math.max(0, alpha);
        layerContexts[clickNumber].stroke();
    }
    if (alpha > 0) {
        setTimeout(fadeOut, 40, clickNumber, alpha - 0.02);
    }
}