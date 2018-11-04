"use strict";
var canvas = document.createElement('canvas');
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
canvas.style.position = "absolute";
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");
canvas.addEventListener('click', handleClick);

var drawings = new Array();
var readyToFade = new Array();

/* TODO make it so that it's a different canvas for each click so that you can clear it when calling fadeOut() */

function handleClick() {
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
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    const colorVal = count / radius * initialBarLength * 255;
    ctx.strokeStyle="rgb(" + colorVal + ", " + colorVal + ", " + colorVal + ")";
    const path = {
        x0: x0,
        y0: y0,
        x1: x1,
        y1: y1,
        strokeColor: ctx.strokeStyle
    };
    drawings[clickNumber].push(path);
    ctx.globalAlpha = 1;
    ctx.stroke();

    if (count <= 1) {
        readyToFade[clickNumber]++;
        if (readyToFade[clickNumber] == density * degree) {
            fadeOut(clickNumber, 0.9);
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
    for (let j = 0; j < drawing.length; j++) {
        let path = drawing[j];
        ctx.beginPath();
        ctx.moveTo(path.x0, path.y0);
        ctx.lineTo(path.x1, path.y1);
        ctx.strokeStyle = path.strokeColor;
        ctx.globalAlpha = i;
        ctx.stroke();
    }
    if (alpha > 0.0) {
        setTimeout(fadeOut, 500, clickNumber, alpha - 0.1);
    }
}