// set window.requestAnimationFrame
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
            window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

function drawLine(x1, y1, x2, y2) {
    context.beginPath(); // Start the path
    context.moveTo(x1, y1); // Set the path origin
    context.lineTo(x2, y2); // Set the path destination
    context.closePath(); // Close the path
    context.stroke(); // Outline the path
}

function drawCircle(x, y, radius) {
    context.beginPath(); // Start the path
    context.arc(x, y, radius, 0, Math.PI*2, false); // Draw a circle
    context.closePath(); // Close the path
    context.fill(); // Fill the path
}

function clearCanvas() {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
}

function randomValue(start, end) {
    return start + Math.random() * (end - start);
}

$(function() {
    gameInit();
});

var canvasId = 'canvas'

var canvas = null;
var context = null;
var canvasWidth = null;
var canvasHeight = null;

var centerX = null;
var centerY = null;

var lastTime = 0;

var dots = [];

function gameInit() {
    // init canvas
    canvas = $('#' + canvasId);
    context = canvas.get(0).getContext('2d');
    canvasWidth = $('#' + canvasId).attr('width');
    canvasHeight = $('#' + canvasId).attr('height');
    centerX = canvasWidth / 2;
    centerY = canvasHeight / 2;

    // init dots
    var numberOfDots = Math.round(randomValue(7, 10));

    for (var i = 0; i < numberOfDots; i++) {
        var dot = {
            angle: randomValue(0, 360),
            radius: randomValue(canvasWidth * 0.2, canvasWidth * 0.4),
            angleVelocity: i % 2 === 1 ? randomValue(0.1, 0.3) : randomValue(-0.1, -0.3),
            x: function() {
                return this.radius * Math.cos(this.angle);
            },
            y: function() {
                return this.radius * Math.sin(this.angle);
            }
        };

        if (dot.angleVelocity === 0) {
            dot.angleVelocity = 0.5;
        }
        dots.push(dot);
    }

    // start gameLoop
    window.requestAnimationFrame(gameLoop);
}

function gameLoop(time) {
    if (lastTime == 0) {
        lastTime = time;
    }
    var dt = time - lastTime;
    lastTime = time;

    window.requestAnimationFrame(gameLoop);

    // debug
    //console.log('loop, time: ', time);
    //console.log('loop, lastTime: ', self.lastTime);
    //console.log('loop, dt: ', dt);
    //var fps = dt == 0 ? 0 : Math.round(1 / (dt / 1000));
    //console.log('loop, fps: ', fps);
    //$('#fps').text('fps: ' + fps);

    if (dt != 0) {
        gameUpdate(dt);

        gameDraw();
    }
}

function gameUpdate(dt) {
    dots.forEach(function(dot) {
        dot.angle += dot.angleVelocity * dt / 1000;
    });
}

function gameDraw() {
    clearCanvas();

    dots.forEach(function(dot) {
        drawCircle(dot.x() + centerX, dot.y() + centerY, 3);
    });

    /*dots.forEach(function(dot1) {
        dots.forEach(function(dot2) {
            drawLine(
                dot1.x() + centerX, dot1.y() + centerY,
                dot2.x() + centerX, dot2.y() + centerY
            );
        });
    });*/

    for (var i = 0; i < dots.length - 2; i++) {
        var dot1 = dots[i];
        var dot2 = dots[i + 1];
        var dot3 = dots[i + 2];

        drawLine(dot1.x() + centerX, dot1.y() + centerY, dot2.x() + centerX, dot2.y() + centerY);
        drawLine(dot2.x() + centerX, dot2.y() + centerY, dot3.x() + centerX, dot3.y() + centerY);
        drawLine(dot3.x() + centerX, dot3.y() + centerY, dot1.x() + centerX, dot1.y() + centerY);
    }



    /*drawLine(10, 10, 40, 30);
    drawCircle(40, 30, 3);*/
}