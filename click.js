var canvas = document.createElement('canvas');
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
canvas.style.position = "absolute";
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");
canvas.addEventListener('click', handleClick);

function handleClick() {
    let mouseX;
    let mouseY;
    const bounds = canvas.getBoundingClientRect();

    mouseX = event.pageX - bounds.left - scrollX;
    mouseY = event.pageY - bounds.top - scrollY;

    mouseX *= canvas.width / bounds.width; 
    mouseY *= canvas.height / bounds.height;

    createClickDesign(mouseX, mouseY);
}

var degree = 20, density = 1, initialBarLength = 1, barIncrement = 0.03, radius = 1000, patternLength = 1, turnLimit = Math.PI;

function createClickDesign(mouseX, mouseY) {
    for (let i = 0; i < density; i++) {
        for (let j = 0; j < degree; j++) {
            generate(mouseX, mouseY, mouseX + Math.cos(i*2*Math.PI/degree) * initialBarLength, mouseY + Math.sin(i*2*Math.PI/degree) * initialBarLength, 0, Math.floor(Math.random() * 2 + 1), Math.floor(radius / initialBarLength), initialBarLength);
        }
    }
    
}

function generate(x0, y0, x1, y1, patternCount, lastDir, count, barLength) {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    const colorVal = count/radius*initialBarLength*255;
    ctx.strokeStyle="rgb(" + colorVal + ", " + colorVal + ", " + colorVal + ")";
    ctx.stroke();

    if (count <= 0) {
        return;
    }

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

    setTimeout(generate, 2, x1, y1, x2, y2, patternCount + 1, dir, count - 1, barLength + barIncrement);
}