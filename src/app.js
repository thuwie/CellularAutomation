//Aliases
var Application = PIXI.Application, Container = PIXI.Container, resources = PIXI.loader.resources, TextureCache = PIXI.utils.TextureCache, Sprite = PIXI.Sprite, Graphics = PIXI.Graphics, Rectangle = PIXI.Rectangle;
var stableCellsMatrix = [], futureCellsMatrix = [];
var cellSize = 4;
var borderSize = 256;
var vectors = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
var app = new Application({
    width: borderSize,
    height: borderSize,
    antialias: true,
    backgroundColor: 0xFFFFFF,
    transparent: false,
    resolution: 1
});
var state;
setup();
function setup() {
    document.getElementById("display").appendChild(app.view);
    for (var i = 0; i < borderSize / cellSize; i++) {
        stableCellsMatrix[i] = [];
        futureCellsMatrix[i] = [];
        for (var j = 0; j < borderSize / cellSize; j++) {
            stableCellsMatrix[i][j] = { status: (Math.random() >= 0.5) };
            futureCellsMatrix[i][j] = {};
        }
    }
    formCellsSequense();
    drawObjects();
    calculateNeighbors();
    state = simulate;
    app.ticker.add(function (delta) { return actionLoop(delta); });
}
function actionLoop(delta) {
    state(delta);
}
function simulate(delta) {
    forEachInMatrix(stableCellsMatrix, function (stableCellObject, row, column) {
        var futureCellObject = stableCellObject;
        if (futureCellObject.status) {
            //If it's alive
            (futureCellObject.neighbors < 2 || futureCellObject.neighbors > 3)
                ? futureCellObject.status = false
                : futureCellObject.status = true;
        }
        else {
            //If it's dead
            (futureCellObject.neighbors === 3)
                ? futureCellObject.status = true
                : futureCellObject.status = false;
        }
        futureCellsMatrix[row][column] = futureCellObject;
    });
    stableCellsMatrix = futureCellsMatrix;
    formCellsSequense();
    drawObjects();
    calculateNeighbors();
}
function calculateNeighbors() {
    forEachInMatrix(stableCellsMatrix, function (cellObject, row, column) {
        cellObject.neighbors = checkCell(stableCellsMatrix, row, column);
    });
}
function checkCell(array, x, y) {
    var count = 0;
    vectors.forEach(function (vector) {
        var checkPosX = x + vector[0];
        var checkPosY = y + vector[1];
        if ((checkPosX >= 0 && checkPosY >= 0)
            && (checkPosX < borderSize / cellSize && checkPosY < borderSize / cellSize)
            && array[checkPosX][checkPosY].status) {
            count++;
        }
    });
    return count;
}
function formCell(cell, row, column) {
    cell.x = column * cellSize;
    cell.y = row * cellSize;
    return cell;
}
function createCell(cell) {
    var rect = new Graphics();
    rect.beginFill(cell.status ? 0x000000 : 0xffffff);
    rect.drawRect(cell.x, cell.y, cellSize, cellSize);
    rect.endFill();
    cell.graphics = rect;
    return cell;
}
function formCellsSequense() {
    forEachInMatrix(stableCellsMatrix, function (cellObject, row, column) {
        formCell(cellObject, row, column);
        createCell(cellObject);
    });
}
function drawObjects() {
    forEachInMatrix(stableCellsMatrix, function (cellObject) {
        app.stage.addChild(cellObject.graphics);
    });
}
function forEachInMatrix(matrix, callback) {
    matrix.forEach(function (matrixArray, row) {
        matrixArray.forEach(function (matrixArrayObject, column) {
            callback(matrixArrayObject, row, column);
        });
    });
}
