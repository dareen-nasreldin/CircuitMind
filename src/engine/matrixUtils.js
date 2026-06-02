// Gaussian elimination with partial pivoting — no external library
// Solves the system A·x = b, returns solution vector x
export function gaussianElimination(A, b) {
  const n = b.length;

  // Build augmented matrix [A | b] as independent copy
  const M = A.map((row, i) => [...row, b[i]]);

  for (let col = 0; col < n; col++) {
    // Partial pivot: find row with largest absolute value in this column
    let maxRow = col;
    let maxVal = Math.abs(M[col][col]);
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(M[row][col]) > maxVal) {
        maxVal = Math.abs(M[row][col]);
        maxRow = row;
      }
    }

    // Swap pivot row to current position
    [M[col], M[maxRow]] = [M[maxRow], M[col]];

    // Near-zero pivot → degenerate/singular row, skip elimination
    if (Math.abs(M[col][col]) < 1e-12) continue;

    // Eliminate all rows below the pivot
    for (let row = col + 1; row < n; row++) {
      const factor = M[row][col] / M[col][col];
      for (let k = col; k <= n; k++) {
        M[row][k] -= factor * M[col][k];
      }
    }
  }

  // Back-substitution
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    if (Math.abs(M[i][i]) < 1e-12) {
      x[i] = 0;
      continue;
    }
    let sum = M[i][n];
    for (let j = i + 1; j < n; j++) {
      sum -= M[i][j] * x[j];
    }
    x[i] = sum / M[i][i];
  }

  return x;
}

// Build a size×size zero matrix
export function buildMatrix(size) {
  return Array.from({ length: size }, () => new Array(size).fill(0));
}
