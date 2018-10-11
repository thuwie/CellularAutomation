//Aliases
var Application = PIXI.Application, Container = PIXI.Container, resources = PIXI.loader.resources, TextureCache = PIXI.utils.TextureCache, Sprite = PIXI.Sprite, Graphics = PIXI.Graphics, Rectangle = PIXI.Rectangle;
var cellSize = 4;
var borderSize = 256;
var resolution = ~~(borderSize / cellSize);
var stableCellsMatrix = new Array(resolution);
var futureCellsMatrix = new Array(resolution);
// let futureCellsMatrix = new Array(resolution);
var vectors = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
var app = new Application({
    width: borderSize,
    height: borderSize + 50,
    antialias: false,
    backgroundColor: 0xFFFFFF,
    transparent: false,
    resolution: 1
});
var state;
var sim = new Container();
setup();
function setup() {
    document.getElementById("display").appendChild(app.view);
    var button = new Graphics();
    button.beginFill(0xFF0000);
    button.drawRect(0, 0, borderSize, 50);
    button.endFill();
    button.buttonMode = true;
    button.x = 0;
    button.y = 0;
    button.interactive = true;
    button.buttonMode = true;
    button
        .on('pointerdown', onButtonDown);
    sim.position.set(0, 50);
    app.stage.addChild(button);
    app.stage.addChild(sim);
    for (var i = 0; i < borderSize / cellSize; i++) {
        stableCellsMatrix[i] = [];
        futureCellsMatrix[i] = [];
        for (var j = 0; j < borderSize / cellSize; j++) {
            stableCellsMatrix[i][j] = { status: (Math.random() >= 0.5), neighbors: 0 };
            futureCellsMatrix[i][j] = { neighbors: 0 };
        }
    }
    formCellsSequense();
    drawObjects();
    calculateNeighbors();
    state = stopSim;
    // app.ticker.minFPS = 10;
    app.ticker.add(function (delta) { return actionLoop(delta); });
}
function actionLoop(delta) {
    state(delta);
}
function onButtonDown() {
    this.isdown = true;
    console.log('xyp9x');
    console.log(state);
    state = state === simulate ? stopSim : simulate;
}
function stopSim(delta) {
    // app.ticker.stop();
}
function simulate(delta) {
    // app.ticker.start();
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
            && (checkPosX < resolution && checkPosY < resolution)
            && array[checkPosX][checkPosY].status) {
            count++;
        }
    });
    return count;
}
function checkCell2(array, x, y) {
    if (y + 1 < resolution) {
        // exchangeData(array[x][y], array[x + 1][y + i - 1]);
        if (array[x][y].status)
            array[x][y + 1].neighbors++;
        if (array[x][y + 1].status)
            array[x][y].neighbors++;
    }
    for (var i = 0; i < 3; i++) {
        if (x + 1 < resolution && y + i - 1 < resolution && y + i - 1 >= 0) {
            // exchangeData(array[x][y], array[x + 1][y + i - 1]);
            if (array[x][y].status)
                array[x + 1][y + i - 1].neighbors++;
            if (array[x + 1][y + i - 1].status)
                array[x][y].neighbors++;
        }
    }
}
function exchangeData(obj, obj1) {
    if (obj.status)
        obj1.neighbors++;
    if (obj1.status)
        obj.neighbors++;
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
        sim.addChild(cellObject.graphics);
    });
}
function forEachInMatrix(matrix, callback) {
    matrix.forEach(function (matrixArray, row) {
        matrixArray.forEach(function (matrixArrayObject, column) {
            callback(matrixArrayObject, row, column);
        });
    });
}
