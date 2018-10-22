// import * as config from './globalConfig.json';
const fs = require('fs');

export default gConfig = function () {
   
    return {
        appSettings: {
            width: config.appWidth,
            height: config.appHeight
        },
        simSettings: {
            width: config.simBorderSize,
            height: config.simBorderSize,
            cellSize: config.cellSize / 8,
            resolution: ~~(config.simBorderSize / config.cellSize),

            speedCap: config.cellSize
        }
    }
}

