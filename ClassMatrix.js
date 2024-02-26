//General Matrix class for all matrix operations
//VERSION 1
//ON VERSION 2 SOLVING EQUATIONS WILL BE ADDED
class Matrix {
  constructor(matrices) {
    //object which contains matrix inputs
    this.matrices = matrices;
  }

  // type validators (not private)

  checkIfRotation(matrix) {
    matrix = matrix || this.matrices.matrix;

    //check if it is a valid matrix
    if (this.#checkIfValid() === "Input is not a matrix!")
      throw new Error("Input is not a valid matrix");

    //determinant must be 1
    const result = this.matrixDet(matrix);
    return result === 1
      ? "Input is a rotation matrix"
      : "Input is not a rotation matrix";
  }

  checkIfReflection(matrix) {
    matrix = matrix || this.matrices.matrix;

    //check if it is a valid matrix
    if (this.#checkIfValid() === "Input is not a matrix!")
      throw new Error("Input is not a valid matrix");

    //determinant must be -1
    const result = this.matrixDet(matrix);
    return result === -1
      ? "Input is a rotation matrix"
      : "Input is not a rotation matrix";
  }

  checkIfOrthogonal(matrix) {
    matrix = matrix || this.matrices.matrix;

    //check if it is a valid matrix
    if (this.#checkIfValid() === "Input is not a matrix!")
      throw new Error("Input is not a valid matrix");

    //orthogonal matrices are square matrices
    if (this.checkIfSquare() === "Not a square matrix!")
      throw new Error("Orthogonal matrices must be square matrices");

    //transpose of the matrix
    const flipped = this.#helperTranspose(matrix);

    // MM^T === I ? orthogonal : not orthogonal
    const multiplicationByTranspose = this.#multiplicate2Matrices(
      matrix,
      flipped
    );

    if (this.checkIfUnit(multiplicationByTranspose))
      return "Input is an orthogonal matrix";
    else return "Input is not an orthogonal matrix";
  }

  //check if a matrix is symmetric
  checkIfSymmetric(matrix) {
    matrix = matrix || this.matrices.matrix;

    //check if it is a valid matrix
    if (this.#checkIfValid() === "Input is not a matrix!")
      throw new Error("Input is not a valid matrix");

    //symmetric matrices are square matrices
    if (this.checkIfSquare() === "Not a square matrix!")
      throw new Error("Symmetric matrices must be square matrices");

    //transpose of the matrix
    const flipped = this.#helperTranspose(matrix);

    //check if matrix and flipper are equal
    if (this.#checkIfEqual(matrix, flipped) === "Matrices are equal")
      return "Input is a symmetric matrix";
    else return "Input is not a symmetric matrix";
  }

  checkIfRowMatrix(matrix) {
    matrix = matrix || this.matrices.matrix;

    if (matrix.length === 1) {
      console.log("Input is a row matrix!");
      return true;
    } else {
      console.error("Input is not a row matrix");
      return false;
    }
  }

  checkIfColumnMatrix(matrix) {
    matrix = matrix || this.matrices.matrix;
    //if includes false not a column matrix
    const results = [];

    matrix.forEach((el) => {
      if (el.length !== 1) results.push(false);
    });

    if (!results.includes(false)) {
      console.log("Input is a column matrix");
      return true;
    } else {
      console.error("Input is not a column matrix");
      return false;
    }
  }

  checkIfZeroMatrix(matrix) {
    matrix = matrix || this.matrices.matrix;

    //if includes false not a column matrix
    const results = [];

    matrix.forEach((el) => {
      el.forEach((e) => {
        if (e !== 0) results.push(false);
      });
    });

    if (!results.includes(false)) {
      console.log("Input is a zero matrix");
      return true;
    } else {
      console.error("Input is not a zero matrix");
      return false;
    }
  }

  //check if the matrix is unit matrix
  checkIfUnit(matrix) {
    matrix = matrix || this.matrices.matrix;

    //arr to store all checks (if arr.includes(false) not a unit matrix)
    const results = [];

    if (!matrix)
      throw new Error(
        "Invalid Input! (correct input example --> matrix : [2d matrix array])"
      );

    //check if it is a valid matrix
    if (this.#checkIfValid() === "Input is not a matrix!")
      throw new Error("Input is not a valid matrix");

    //unit matrices are square matrices
    if (this.checkIfSquare() === "Not a square matrix!")
      throw new Error("Unit matrices must be square matrices");

    /**
     * Unit Matrix
     * elements in top-left / bottom-right diagonal are 1s, rest is 0
     * example (4th order)
        [
          [1, 0, 0, 0],
          [0, 1, 0, 0],
          [0, 0, 1, 0],
          [0, 0, 0, 1],
        ]

     */

    //when i === j e must be 1
    matrix.forEach((el, i) => {
      el.forEach((e, j) => {
        //unit matrix
        if (i === j && e === 1) {
          results.push(true);
        }
        //not a unit matrix
        if (i === j && e !== 1) {
          results.push(false);
        }
        if (i !== j && e !== 0) {
          results.push(false);
        }
      });
    });

    if (!results.includes(false)) {
      console.log("Unit matrix");
      return true;
    }

    if (results.includes(false)) {
      console.error("Not a unit matrix");
      return false;
    }
  }

  //to calc determinant matrix must be a square matrxi
  checkIfSquare(matrix) {
    //the entry must be an object with one element with the key "matrix"
    matrix = matrix || this.matrices;

    //check for invalid entries
    if (!matrix)
      throw new Error(
        "Invalid input! (Valid input: {matrix : (your matrix as 2d array)})"
      );

    if (this.#checkIfValid() === "Input is not a matrix!")
      throw new Error("Input is not a valid matrix");

    //check if all elements have the same length with matrix
    return matrix
      .map((el, _, arr) => (el.length === arr.length ? true : false))
      .reduce((_, __, ___, arr) =>
        arr.includes(false) ? "Not a square matrix!" : "Square matrix!"
      );
  }

  //helpers and validators are privite methods

  //validators ////////////////////////////////////////////////////////////////////////
  //check if two matrices are equal
  #checkIfEqual(matrixA, matrixB) {
    //results (if elements in A and B are in the same position but not equal, if shapes are different push false)
    const results = [];

    if (
      this.#checkIfSameShapes({ matrixA, matrixB }) ===
      "Matrices are in different shapes!"
    )
      results.push(false);

    //loop over the matrcies to check elements
    matrixA.forEach((elem, i) => {
      elem.forEach((el, j) => {
        if (matrixB[i][j] !== el) results.push(false);
      });
    });

    return results.includes(false)
      ? "Matrices are not equal"
      : "Matrices are equal";
  }

  //check if it is a valid matrix
  #checkIfValid() {
    // all inner arrays must have the same length
    const results = [];

    const { matrix } = this.matrices;

    if (!matrix)
      throw new Error(
        "Invalid input! (Valid input: {matrix : (your matrix as 2d array)})"
      );

    matrix.reduce((acc, el) => {
      if (acc.length === el.length) {
        results.push(true);
        return el;
      } else {
        results.push(false);
        return el;
      }
    });

    return results[0] ? "Input is a valid matrix!" : "Input is not a matrix!";
  }

  //for other operations two matrices must be in same structure
  #checkIfSameShapes(matrices) {
    //a valid entry must be an object filled with 2d matrix arrays with arbitrary keys
    matrices = matrices || Object.values(this.matrices);
    //array to store the results of different conditions
    const results = [];

    if (!matrices.length)
      throw new Error(
        "Invalid input! (Valid input: {A:[[1],[2]], B:[[3],[4],[5]]})"
      );

    //check if main arrays have the same lengths
    results.push(
      matrices.map((el) => el.length).reduce((_, el, i, arr) => el - arr[i - 1])
        ? false
        : true
    );

    //check if inner arrays have the same lengths
    results.push(
      matrices
        .map((el) => el.map((e) => e.length))
        .flat()
        .reduce((_, el, i, arr) => el - arr[i - 1])
        ? false
        : true
    );

    //return the result
    return results.includes(false)
      ? "Matrices are in different shapes!"
      : "Matrices have the same shape!";
  }

  #validate2MatricesForMultiplication(matrixA, matrixB) {
    // if any matrix = mxn
    const nB = matrixB.length;
    const mA = matrixA[0].length;

    return nB === mA;
  }

  #checkIfAbleForMultiplication(nextMatrices) {
    //recursive method
    /**
     * How to check?
     * A: mxn ([[1,2,3],[4,5,6])] ---> 3x2
     * B: pxq ([1,2],[3,4],[5,6]) ----> 2x3
     * condition n === p
     * if condition AxB : mxq
     * esle AxB: undefined
     */

    // a * b * c * d * ... ---> (a * b) *c
    const matrices = nextMatrices || Object.values(this.matrices);

    const [first, second, ...rest] = matrices;

    //recursion completed without an error
    if (rest.length === 0) return true;

    if (matrices.length < 2) {
      console.error("You need atleast 2 matrices for multiplication");
      return undefined;
    }

    //compare the first matrix with the next one
    if (!this.#validate2MatricesForMultiplication(first, second)) {
      console.error("matrices can not be multiplied");
      return undefined;
    }

    //calc the shape of the result of tho two compared
    const multiplicationOfFirstTwo = this.#multiplicate2Matrices(first, second);

    //compare the result with the next matrix
    if (
      !this.#validate2MatricesForMultiplication(
        multiplicationOfFirstTwo,
        rest[0]
      )
    ) {
      console.error("matrices can not be multiplied");
      return undefined;
    }

    //and so on and so forth
    return this.#checkIfAbleForMultiplication(rest);
  }

  //helpers ////////////////////////////////////////////////////////////
  //helper function to interchange rows and columns
  #helperTranspose(matrix) {
    const flipped = [];
    for (let i = 0; i < matrix.length; i++) {
      //i: 0,1,2
      for (let j = 0; j < matrix[i].length; j++) {
        flipped.push([]);
        //j:0,1
        for (let k = 0; k < matrix.length; k++) {
          //k:0,1,2
          flipped[j].push(matrix[k][j]);
        }
      }
      return flipped;
    }
  }

  //helper function to multiplicate 2 matrices (for check and main multiplication methods)
  #multiplicate2Matrices(matrixA, matrixB) {
    //replace columns with rows, rows with columns for matrixB
    const flippedB = this.#helperTranspose(matrixB);
    //single result element
    let result = 0;
    //result of multiplication
    const multiplication = [];
    // This function will only be used if the conditions for multiplication are already met
    /*example
    const A = [
      [1, 2, 3],
      [4, 5, 6],
    ];

    const B = [
      [1, 2],
      [3, 4],
      [5, 6],
    ];

    const R = [
      [x, y],
      [z, t],
    ];

    x = 1*1 + 2*3 + 3*5
    y = 1*2 + 2*4 + 3*6
    z = 4*1 + 5*3 + 6*5
    t = 4*2 + 5*4 + 6*6

    const R = [
      [22, 28],
      [49, 64],
    ];
    */

    //loop over one of the entries
    for (let i = 0; i < matrixA.length; i++) {
      //to give the multiplication the right shape
      multiplication.push([]);
      //loop over the array again to calculate all rows and collums
      for (let j = 0; j < matrixA.length; j++) {
        //loop over the inner arrays and calculate the single result
        //order of indexes are important!
        for (let k = 0; k < matrixA[j].length; k++) {
          if (flippedB[j]) result += matrixA[i][k] * flippedB[j][k];
        }
        //push to result to arr
        if (result) multiplication[i].push(result);
        //reset result
        result = 0;
      }
    }

    return multiplication;
  }

  //helper functions for determinant calculation (#)
  #helperFilter(i, a, b, c) {
    //given 3 numbers and a controller (i) return the numbers that are not equal to i
    return i === a ? [b, c] : i === b ? [a, c] : [a, b];
  }

  #calcBase(arrX, arrY) {
    //2nd order matrix, determinant calculation formula
    return arrX[0] * arrY[1] - arrX[1] * arrY[0];
  }

  #calcBaseDet(matrix) {
    return this.#calcBase(matrix[0], matrix[1]);
  }

  #calcThirdOrderDet(matrix) {
    //create new base arrays
    const [expanded, ...rest] = matrix;

    /*
FOR EXPANDED at 0 --> cBD [[5,6],[8,9]]  (REST 01, REST 02), (REST 11, REST 12) 12 12
FOR EXPANDED at 1 --> cBD [[4,6],[7,9]]  (REST 00, REST 02), (REST 10, REST 12) 02 02
FOR EXPANDED at 2 --> cBD [[4,5],[7,8]]  (REST 00, REST 01), (REST 10, REST 11) 01 01
   */

    //var to decide first position
    let firstPosition = true; //if true fp = 0, else fp = 1 depending on j
    let sign = true; //if true sign = 1, else sign = -1 depending on i
    let determinat = 0;

    //loop over the expanded
    for (let i = 0; i < expanded.length; i++) {
      //create the 2nd order matrix array from the rest based on i
      const base2ndOrderArr = [];
      for (let j = 0; j < rest.length; j++) {
        const [position1, position2] = this.#helperFilter(i, 0, 1, 2);

        firstPosition
          ? base2ndOrderArr.push([rest[0][position1], rest[0][position2]])
          : base2ndOrderArr.push([rest[1][position1], rest[1][position2]]);

        firstPosition = !firstPosition; // 0 1 0 1 0 1 ...
      }

      determinat += sign
        ? expanded[i] * this.#calcBaseDet(base2ndOrderArr)
        : expanded[i] * this.#calcBaseDet(base2ndOrderArr) * -1;

      sign = !sign; // + - + - + - ...
      base2ndOrderArr.length = 0;
    }

    return determinat;
  }

  // Operations ////////////////////////////////////////////////

  // inverse of a matrix
  calcInverse(matrix) {
    matrix = matrix || this.matrices.matrix;

    if (this.#checkIfValid(matrix) === "Input is not a matrix!")
      throw new Error("Input matrix is not valid!");

    // if orthogonal return transpose
    if (this.checkIfOrthogonal(matrix) === "Input is an orthogonal matrix")
      return this.#helperTranspose(matrix);

    //calculate the determinant
    const determinant = this.matrixDet(matrix);

    //flip
    const flipped = this.#helperTranspose(matrix);

    //determinant * flipped
    return this.multiplicationByNumber(determinant, flipped);
  }

  //scalar multiplication (this may be a helper function for later if user wants to duplicate a determinant with matrix)
  multiplicationByNumber(number, matrix) {
    matrix = matrix || this.matrices.matrices;

    if (this.#checkIfValid(matrix) === "Input is not a matrix!")
      throw new Error("Input matrix is not valid!");

    return matrix.map((elem) => elem.map((el) => el * number));
  }

  //matrix multiplication
  matricesMultiplication(nextMatrices) {
    //first time from user (nextMatrices = result of first two + rest)
    const matrices = nextMatrices || Object.values(this.matrices);

    if (!this.#checkIfAbleForMultiplication()) {
      console.error("Matrices do not match the conditions for multiplication");
      return undefined;
    }

    const [first, second, ...rest] = matrices;

    //base multiplication
    if (rest.length === 0) return this.#multiplicate2Matrices(first, second);

    const result = this.#multiplicate2Matrices(first, second);

    //next matrices
    return this.matricesMultiplication([result, ...rest]);
  }

  //matrix Addition
  matricesAddition() {
    const matrices = Object.values(this.matrices);

    //check if matrices can be added
    if (this.#checkIfSameShapes() === "Matrices are in different shapes!") {
      console.error(
        "Matrices are in different shapes! Operation result is undefined."
      );
      return undefined;
    }

    //Addition

    //result = [[sum00, sum01, sum02],[sum10, sum11, sum12]] (for sameShapeMatrices use example from below)
    //res00 = matrices[0][0][0] + matrices[1][0][0] + matrices[2][0][0] + matrices[3][0][0]
    //res01 = matrices[0][0][1] + matrices[1][0][1] + matrices[2][0][1] + matrices[3][0][1]
    //res02 = matrices[0][0][2] + matrices[1][0][2] + matrices[2][0][2] + matrices[3][0][2]
    //res10 = matrices[0][1][0] + matrices[1][1][0] + matrices[2][1][0] + matrices[3][1][0]
    //res11 = matrices[0][1][1] + matrices[1][1][1] + matrices[2][1][1] + matrices[3][1][1]
    //res12 = matrices[0][1][2] + matrices[1][1][2] + matrices[2][1][2] + matrices[3][1][2]

    return matrices.reduce((acc, elem) =>
      acc.map((el, j) => el.map((e, k) => e + elem[j][k]))
    );
  }

  matricesSubtraction() {
    const matrices = Object.values(this.matrices);

    //check if matrices can be subtracted
    if (this.#checkIfSameShapes() === "Matrices are in different shapes!") {
      console.error(
        "Matrices are in different shapes! Operation result is undefined."
      );
      return undefined;
    }

    //Subtraction
    // a - b - c - d .... (first matrix - (sum of the rest))
    return matrices.reduce((acc, elem) =>
      acc.map((el, j) => el.map((e, k) => e - elem[j][k]))
    );
  }

  //main determinant method
  matrixDet(nextMatrix, order, memo) {
    if (this.checkIfSquare() === "Not a square matrix!") {
      console.error("Not a square matrix, determinant is undefined");
      return undefined;
    }

    const matrix = nextMatrix || this.matrices.matrix;

    order = matrix.length;
    //top level rest
    const [expanded, ...rest] = matrix;

    //base condition
    if (order === 3) return this.#calcThirdOrderDet(matrix);

    if (!matrix)
      throw new Error(
        "Invalid input! (Valid input: {matrix : (your matrix as 2d array)})"
      );

    //for recursion, this will be the next entry
    memo = memo || {};

    //recursively loop over matrix (using reduce method) and calculate the smaller determinats
    matrix.reduce((acc, _, i) => {
      //filter over the rest, get te inner matrices
      acc = rest.map((el) => el.filter((_, j) => i !== j));
      //assign low level matrices to memo
      memo[acc] = acc;
      //if acc exists, use the acc in memo
      if (memo[acc]) return memo[acc];
    }, []);

    //recursion
    return Object.values(memo).reduce((acc, el, i) => {
      const sign = i % 2 === 0 ? expanded[i] : expanded[i] * -1;

      return sign * this.matrixDet(el, el.length) + acc;
    }, 0);
  }
}

//Example Uses
//valid matrix
const validMatrix = new Matrix({
  matrix: [
    [1, 2, 3],
    [4, 5, 6],
  ],
});

//invalid matrix
const invalidMatrix = new Matrix({
  matrix: [
    [12, 3],
    [4, 5, 6],
  ],
});

//Invalid determinant example
const invalidDeterminant = new Matrix({
  matrix: [
    [5, 7, -9],
    [2, 9, 12],
  ],
});

//invalidDeterminant.matrixDet(); //undefined

//Valid determinant example
const validDeterminant = new Matrix({
  matrix: [
    [5, 3, 7, 8, 9, 4],
    [-1, 3, -7, 2, 5, -6],
    [1, 5, -2, 9, 1, 4],
    [7, -6, 5, 3, -4, 2],
    [9, -4, -7, 8, 1, 2],
    [-6, 2, -4, 2, 3, -1],
  ],
});

//validDeterminant.matrixDet(); //result

//check if given matrices have the same shape examples
const sameShapeMatrices = new Matrix({
  A: [
    [1, 2, 3],
    [4, 3, 7],
  ],

  B: [
    [7, 8, 9],
    [-1, -2, -3],
  ],

  C: [
    [5, 4, 2],
    [4, -3, -7],
  ],
  D: [
    [1, -1, -2],
    [-1, -4, -8],
  ],
});

//sameShapeMatrices.matricesAddition(); //result
//sameShapeMatrices.matricesSubtraction(); //result

const notSameShapeMatrices = new Matrix({
  A: [
    [1, 2, 3],
    [3, 4, 5],
    [1, 2, 3],
  ],
  B: [
    [1, 2],
    [3, 4],
    [1, 4],
  ],
});
//notSameShapeMatrices.#checkIfSameShapes(); //matrices are in different shapes
//notSameShapeMatrices.matricesAddition(); //undefined
//notSameShapeMatrices.matricesSubtraction(); //undefined

//multiplication tests
const multiplicationArray = new Matrix({
  A: [
    [1, 2, 3],
    [3, 4, 5],
    [6, 7, 8],
  ],
  B: [
    [1, 2],
    [3, 4],
    [1, 4],
  ],
  C: [
    [7, 5, 2],
    [14, 1, 9],
  ],
  D: [
    [-5, -1],
    [3, -13],
    [-6, 12],
  ],
});

const infitineSolutions = new Matrix({
  equation: {
    augmented: [
      [1, 1, 1, 3],
      [2, -1, 1, 5],
      [3, 0, 2, 8],
    ],
    coefficents: ["x", "y", "z"],
  },
});

const infitineSolutions1 = new Matrix({
  equation: {
    augmented: [
      [1, 2, 0, 0, 7],
      [0, 3, 4, 0, 8],
      [0, 0, 5, 6, 9],
    ],
    coefficents: ["x1", "x2", "x3", "x4"],
  },
});

const infitineSolutions2 = new Matrix({
  equation: {
    augmented: [
      [-2, 6, -4, -28],
      [-1, 3, -1, -8],
      [5, -15, 10, 70],
      [1, -3, 0, 2],
    ],
    coefficents: ["x", "y", "z"],
  },
});

//console.log("----INFINITE 0 ---------");
console.log(infitineSolutions.solveEquation());
//console.log("---INFINITE 1 ----------");
console.log(infitineSolutions1.solveEquation());
//console.log("---INFINITE 2 ----------");
console.log(infitineSolutions2.solveEquation());
