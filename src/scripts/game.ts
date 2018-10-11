export default function forEachInMatrix(matrix, callback) {
    matrix.forEach((matrixArray, row) => {
        matrixArray.forEach((matrixArrayObject, column) => {
            callback(matrixArrayObject, row, column);
        });
    });
}

