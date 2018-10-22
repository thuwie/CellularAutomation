import forEachInMatrix from './util';
import gConfig from './configReader';

//Aliases
let Application = PIXI.Application,
    Container = PIXI.Container,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite,
    Graphics = PIXI.Graphics;


// const cellSize = 2;
// const borderSize = 256;
// const resolution = ~~(borderSize / cellSize);
// const cap = 2;
const vectors = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
let stableCellsMatrix = new Array(gConfig.simSettings.resolution);
let futureCellsMatrix = new Array(gConfig.simSettings.resolution);
let state: any, sim: any, counter: number = 0;

let app = new Application({
        width: gConfig.appSettings.width,
        height: gConfig.appSettings.height,
        antialias: false,
        backgroundColor: 0xFFFFFF,
        transparent: false,
        resolution: 1
    }
);


PIXI.loader
    .add("assets/gfx/images/dot.png")
    .load(setup);

function setup(): void {
    sim = new Container();

    document.getElementById("display").appendChild(app.view);
    let button = new Graphics();
    button.beginFill(0xFF0000);
    button.drawRect(0, 0, 50, 50);
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
    for (let i = 0; i < gConfig.simSettings.resolution; i++) {
        stableCellsMatrix[i] = [];
        futureCellsMatrix[i] = [];
        for (let j = 0; j < gConfig.simSettings.resolution; j++) {
            stableCellsMatrix[i][j] = { status: (Math.random() >= 0.5), neighbors: 0 };
            futureCellsMatrix[i][j] = { neighbors: 0 };
        }
    }

    formCellsSequense();
    initializeGraphic();

    calculateNeighbors();
    state = stopSim;
    app.ticker.add((delta: any) => actionLoop(delta));
}

function actionLoop(delta: any) {
    counter++;
    if (counter === gConfig.simSettings.speedCap){
        counter = 0;
        state(delta);
    }
}

function onButtonDown(): void {
    state = state === simulate ? stopSim : simulate;
}

function stopSim(delta: any) {
}

function simulate(delta: any) {
    forEachInMatrix(stableCellsMatrix, (stableCellObject: any, row: number, column: number) => {
        let futureCellObject = stableCellObject;
        if (futureCellObject.status) {
            //If it's alive
            (futureCellObject.neighbors < 2 || futureCellObject.neighbors > 3)
                ? futureCellObject.status = false
                : futureCellObject.status = true;
        } else {
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


function calculateNeighbors(): void {
    forEachInMatrix(stableCellsMatrix, (cellObject: any, row: number, column: number) => {
        cellObject.neighbors = checkCell(stableCellsMatrix, row, column);
    });
}

function checkCell(array: any[], x: number, y: number) {
    let count = 0;
    vectors.forEach(vector => {
        const checkPosX = x + vector[0];
        const checkPosY = y + vector[1];

        if ((checkPosX >= 0 && checkPosY >= 0)
            && (checkPosX < gConfig.simSettings.resolution && checkPosY < gConfig.simSettings.resolution)
            && array[checkPosX][checkPosY].status
        ) {
            count++;
        }
    });
    return count;
}

// function checkCell2(array, x, y) {
//     if (y + 1 < resolution) {
//         // exchangeData(array[x][y], array[x + 1][y + i - 1]);
//         if (array[x][y].status) array[x][y + 1].neighbors++;
//         if (array[x][y + 1].status) array[x][y].neighbors++;
//     }
//     for (let i = 0; i < 3; i++) {
//         if (x + 1 < resolution && y + i - 1 < resolution && y + i - 1 >= 0) {
//             // exchangeData(array[x][y], array[x + 1][y + i - 1]);
//             if (array[x][y].status) array[x + 1][y + i - 1].neighbors++;
//             if (array[x + 1][y + i - 1].status) array[x][y].neighbors++;
//         }
//     }
// }
//
// function exchangeData(obj, obj1) {
//     if (obj.status) obj1.neighbors++;
//     if (obj1.status) obj.neighbors++;
// }

function formCell(cell: any, row: number, column: number) {
    cell.x = column * gConfig.simSettings.cellSize;
    cell.y = row * gConfig.simSettings.cellSize;
    return cell;
}

function createCell(cell: any) {
    const dotSprite = new Sprite(resources["assets/gfx/images/dot.png"].texture);
    dotSprite.scale.set(gConfig.simSettings.cellSize, gConfig.simSettings.cellSize);
    dotSprite.position.set(cell.x, cell.y);
    dotSprite.visible = cell.status;
    cell.graphics = dotSprite;
    return cell;
}

function formCellsSequense(): void {
    forEachInMatrix(stableCellsMatrix, (cellObject: any, row: number, column: number) => {
        formCell(cellObject, row, column);
        createCell(cellObject);
    })
}

function initializeGraphic(): void {
    forEachInMatrix(stableCellsMatrix, (cellObject: any) => {
        sim.addChild(cellObject.graphics);
    });
}

function changeVisibleStatus(): void {
    forEachInMatrix(stableCellsMatrix, (cellObject: any) => {
        cellObject.graphics.visible = cellObject.status;
    })
}
