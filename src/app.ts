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
const cellSize = 30;
const borderSize = 90;
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

document.getElementById("display").appendChild(app.view);


for (let i = 0; i < borderSize / cellSize; i++) {
    cellsMatrix[i] = [];
    for (let j = 0; j < borderSize / cellSize; j++) {
        cellsMatrix[i][j] = { status: (Math.random() >= 0.5) };
    }
}

formCellsSequense(cellsMatrix);
drawObjects();

cellsMatrix.forEach((cellSubArray, row) => {
    cellSubArray.forEach((cellValue, column) => {
        console.log(`Pos ${row},${column}. C: `, checkCell(cellsMatrix, row, column));
    });
});

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
    let cellsSequence = [];
    cellsMatrix.forEach((cellSubArray, row) => {
        cellSubArray.forEach((cellObject, column) => {
            formCell(cellObject, row, column);
            createCell(cellObject);

        });
    });
    return cellsSequence;
}

function drawObjects() {
    cellsMatrix.forEach((cellSubArray) => {
        cellSubArray.forEach((cellObject) => {
            app.stage.addChild(cellObject.graphics);
        });
    });
}



