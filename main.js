const matrix = buildMatrix(10, 10);

for (let i = 0; i < 10; i++) {
  randomMine(matrix);
}

console.log(matrix);