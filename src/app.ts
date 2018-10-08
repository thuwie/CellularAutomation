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
const cellArray = [];
const cellSize = 8;
const borderSize = 128;

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


for (let i = 0; i < 4; i++) {
    cellArray[i] = [];
    for (let j = 0; j < 4; j++) {
        cellArray[i][j] = (Math.random() >= 0.5);
    }
}

cellArray.forEach((cellSubArray, row) => {
    cellSubArray.forEach((cellValue, column) => {
        //console.log(createCell(cellValue, row, column));
        console.log(row, column);
        app.stage.addChild(drawCell(createCell(cellValue, row, column)));
    });
});

console.log(cellArray);

function createCell(cell, row, column) {
    return {
        status: cell,
        x: column * cellSize,
        y: row * cellSize
    };
}

function drawCell(cell) {
    const rect = new Graphics();
    rect.drawRect(cell.x, cell.y, cellSize, cellSize);
    rect.beginFill(cell.status ? 0x000000 : 0xFFFFFF);
    return rect;
}


// app.stage.addChild(Grid);