"use strict";
exports.__esModule = true;
//Aliases
var game_1 = require("./util");
var Application = PIXI.Application, Container = PIXI.Container, resources = PIXI.loader.resources, TextureCache = PIXI.utils.TextureCache, Sprite = PIXI.Sprite, Graphics = PIXI.Graphics, Rectangle = PIXI.Rectangle;
var cellSize = 4;
var borderSize = 512;
var resolution = ~~(borderSize / cellSize);
var vectors = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
var stableCellsMatrix = new Array(resolution);
var futureCellsMatrix = new Array(resolution);
var state, sim;
var app = new Application({
    width: borderSize,
    height: borderSize + 50,
    antialias: true,
    backgroundColor: 0xFFFFFF,
    transparent: false,
    resolution: 1
});
PIXI.loader
    .add("images/dot.png")
    .load(setup);
function setup() {
    sim = new Container();
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
    initializeGraphic();
    calculateNeighbors();
    state = stopSim;
    app.ticker.speed = 0.1;
    app.ticker.add(function (delta) { return actionLoop(delta); });
}
function actionLoop(delta) {
    state(delta);
}
function onButtonDown() {
    state = state === simulate ? stopSim : simulate;
}
function stopSim(delta) {
}
function simulate(delta) {
    game_1["default"](stableCellsMatrix, function (stableCellObject, row, column) {
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
    changeVisibleStatus();
    calculateNeighbors();
}
function calculateNeighbors() {
    game_1["default"](stableCellsMatrix, function (cellObject, row, column) {
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
    var dotSprite = new Sprite(resources["images/dot.png"].texture);
    dotSprite.scale.set(cellSize, cellSize);
    dotSprite.position.set(cell.x, cell.y);
    dotSprite.visible = cell.status;
    cell.graphics = dotSprite;
    return cell;
}
function formCellsSequense() {
    game_1["default"](stableCellsMatrix, function (cellObject, row, column) {
        formCell(cellObject, row, column);
        createCell(cellObject);
    });
}
function initializeGraphic() {
    game_1["default"](stableCellsMatrix, function (cellObject) {
        sim.addChild(cellObject.graphics);
    });
}
function changeVisibleStatus() {
    game_1["default"](stableCellsMatrix, function (cellObject) {
        cellObject.graphics.visible = cellObject.status;
    });
}
//
// function forEachInMatrix(matrix, callback) {
//     matrix.forEach((matrixArray, row) => {
//         matrixArray.forEach((matrixArrayObject, column) => {
//             callback(matrixArrayObject, row, column);
//         });
//     });
// }
