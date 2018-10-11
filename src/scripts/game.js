"use strict";
exports.__esModule = true;
function forEachInMatrix(matrix, callback) {
    matrix.forEach(function (matrixArray, row) {
        matrixArray.forEach(function (matrixArrayObject, column) {
            callback(matrixArrayObject, row, column);
        });
    });
}
exports["default"] = forEachInMatrix;
