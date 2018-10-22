export default function forEachInMatrix(matrix: any[], callback: any): any {
    matrix.forEach((matrixArray: any[], row: number) => {
        matrixArray.forEach((matrixArrayObject: any, column: number) => {
            callback(matrixArrayObject, row, column);
        });
    });
}

