//Aliases
let Application = PIXI.Application,
    Container = PIXI.Container,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite,
    Graphics = PIXI.Graphics,
    Rectangle = PIXI.Rectangle;


const cellContainer = new PIXI.Container();
const cellsMatrix = [];
const cellSize = 8;
const borderSize = 128;
const vectors = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

let app = new Application({
        width: borderSize,
        height: borderSize,
        antialias: true,
        backgroundColor: 0xFFFFFF,
        transparent: false,
        resolution: 1
    }
);

let state;

setup();

function setup() {
    document.getElementById("display").appendChild(app.view);

    for (let i = 0; i < borderSize / cellSize; i++) {
        cellsMatrix[i] = [];
        for (let j = 0; j < borderSize / cellSize; j++) {
            cellsMatrix[i][j] = { status: (Math.random() >= 0.5) };
        }
    }

    formCellsSequense(cellsMatrix);
    drawObjects();

    forEachInMatrix(cellsMatrix, (cellObject, row, column) => {
        console.log(`Pos ${row},${column}. C: `, checkCell(cellsMatrix, row, column));
    });

    state = simulate;

    app.ticker.add(delta => actionLoop(delta));
}
function actionLoop(delta) {
    state(delta);
}
function simulate(delta) {

}


function checkCell(array, x, y) {
    let count = 0;
    vectors.forEach(vector => {
        const checkPosX = x + vector[0];
        const checkPosY = y + vector[1];
        if ((checkPosX >= 0 && checkPosY >= 0)
            && (checkPosX < borderSize / cellSize && checkPosY < borderSize / cellSize)
            && array[checkPosX][checkPosY].status
        ) {
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
    let rect = new Graphics();
    rect.beginFill(cell.status ? 0x000000 : 0xffffff);
    rect.drawRect(cell.x, cell.y, cellSize, cellSize);
    rect.endFill();
    cell.graphics = rect;
    return cell;
}

function formCellsSequense(cellsMatrix) {
    forEachInMatrix(cellsMatrix, (cellObject, row, column) => {
        formCell(cellObject, row, column);
        createCell(cellObject);
    })
}

function drawObjects() {
    forEachInMatrix(cellsMatrix, (cellObject)=> {
        app.stage.addChild(cellObject.graphics);
    });
}

function forEachInMatrix(matrix, callback) {
    matrix.forEach((matrixArray, row) => {
        matrixArray.forEach((matrixArrayObject, column) => {
            callback(matrixArrayObject, row, column);
        });
    });
}



