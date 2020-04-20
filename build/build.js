var drawSquare = function (point, side) {
    push();
    rectMode(CENTER);
    rect(point.x, point.y, side, side);
    rectMode(CORNER);
    pop();
};
var drawSquares = function (point, side, step, minSize, direction) {
    if (side < minSize) {
        drawSquare(point, minSize);
        return;
    }
    push();
    drawSquare(point, side);
    drawSquares(point.add(direction), side - step, step, minSize, direction);
    pop();
};
var setup = function () {
    createCanvas(windowWidth, windowHeight);
    colorMode(HSL, 255);
    var c = color(map(214, 0, 360, 0, 255), 255, map(30, 0, 100, 0, 255));
    background(c);
    stroke(255);
    strokeWeight(2);
    noFill();
    var squareSide = width / 15;
    var rowCount = floor(height / squareSide) / 1.5;
    var columnCount = floor(width / squareSide) / 1.5;
    push();
    translate(width / 6 + squareSide / 2, height / 6 + squareSide / 2);
    for (var i = 0; i < rowCount; i++) {
        for (var j = 0; j < columnCount; j++) {
            var point_1 = new Vector2D(j * squareSide, i * squareSide);
            var side = squareSide;
            var step = side / 4;
            var minSize = 5;
            var direction = new Vector2D(random(-20, 20), random(-20, 20)).scale(step / (side - minSize));
            drawSquares(point_1, side, step, minSize, direction);
        }
    }
    pop();
};
var draw = function () { };
var Vector2D = (function () {
    function Vector2D(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector2D.prototype.add = function (another) {
        return new Vector2D(this.x + another.x, this.y + another.y);
    };
    Vector2D.prototype.scale = function (factor) {
        return new Vector2D(this.x * factor, this.y * factor);
    };
    return Vector2D;
}());
var w = 1;
var cells;
var generation = 0;
var ruleset = [0, 0, 0, 1, 1, 1, 1, 0];
function rules(a, b, c) {
    if (a == 1 && b == 1 && c == 1)
        return ruleset[0];
    if (a == 1 && b == 1 && c == 0)
        return ruleset[1];
    if (a == 1 && b == 0 && c == 1)
        return ruleset[2];
    if (a == 1 && b == 0 && c == 0)
        return ruleset[3];
    if (a == 0 && b == 1 && c == 1)
        return ruleset[4];
    if (a == 0 && b == 1 && c == 0)
        return ruleset[5];
    if (a == 0 && b == 0 && c == 1)
        return ruleset[6];
    if (a == 0 && b == 0 && c == 0)
        return ruleset[7];
    return 0;
}
function generate() {
    var nextgen = Array(cells.length);
    for (var i = 1; i < cells.length - 1; i++) {
        var left = cells[i - 1];
        var me = cells[i];
        var right = cells[i + 1];
        nextgen[i] = rules(left, me, right);
    }
    cells = nextgen;
    generation++;
}
var leftX;
var rightX;
var topY;
var bottomY;
var resolution;
var numColumns;
var numRows;
function inRange(x, y, matrix) {
    return 0 <= x && x < matrix.length && 0 <= y && y < matrix[0].length;
}
function drawLine(x, y, spacing, length, grid) {
    beginShape();
    for (var i = 0; i < length; i++) {
        var xOffset = x - leftX;
        var yOffset = y - topY;
        var columnIndex = floor(xOffset / resolution);
        var rowIndex = floor(yOffset / resolution);
        if (!inRange(rowIndex, columnIndex, grid))
            continue;
        stroke(random([0, 180]), 200, 255);
        vertex(x, y);
        var gridAngle = grid[rowIndex][columnIndex];
        var xStep = spacing * cos(gridAngle);
        var yStep = spacing * sin(gridAngle);
        x = x + xStep;
        y = y + yStep;
    }
    endShape();
}
var drawRectangle = function () {
};
var polarToCartesian = function (r, angle) {
    return new Vector2D(r * cos(angle), r * sin(angle));
};
var cartesianToPolar = function (x, y) {
    return { angle: atan2(y, x), r: sqrt(x * x + y * y) };
};
var drawSpiral = function (x, y, radius, velocity, angularVelocity, r, angle) {
    if (r === void 0) { r = 0; }
    if (angle === void 0) { angle = 0; }
    var av = map(angularVelocity, 0, 1, 0, PI * 2);
    beginShape();
    while (r < radius) {
        var point_2 = polarToCartesian(r, angle);
        curveVertex(x + point_2.x, y + point_2.y);
        angle += av;
        r += velocity;
    }
    endShape();
};
var drawArc = function (x, y, r, theta, alpha, length) {
    beginShape();
    while (length > 0) {
        var point_3 = polarToCartesian(r, theta);
        curveVertex(x + point_3.x, y + point_3.y);
        theta += alpha;
        length--;
    }
    endShape();
};
var drawDisc = function (center, lineCount) {
    for (var i = 0; i < lineCount; i++) {
        var theta = random(PI * 2);
        var alpha_1 = 0.01;
        var radius = random(lineCount * 2);
        var length_1 = random(degrees(PI * 2));
        drawArc(center.x, center.y, radius, theta, alpha_1, length_1);
    }
};
//# sourceMappingURL=build.js.map