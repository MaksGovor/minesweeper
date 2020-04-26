'use strict';

const buildMatrix = (cols, rows) => {
  const matrix = new Array();
  let id = 1;

  for (let y = 0; y < rows; y++){
    const row = new Array();
    for (let x = 0; x < cols; x++)
      row.push({
          id: id++,
          flag: false,
          mine: false,
          mineCount: 0,
          x,
          y,
      });
    matrix.push(row);
  }
  
  return matrix;
}


const randomClearCell = matrix => {
  const cells = new Array();
  for (let y = 0;y < matrix.length; y++) {
    for (let x = 0;x < matrix[y].length; x++){
      const cell = matrix[y][x];
      if (!cell.mine) cells.push(cell);
    }
  }

  const index = Math.floor(Math.random() * cells.length);
  return cells[index];
}

const randomMine = matrix => {
  const cell = randomClearCell(matrix);
  if (cell) cell.mine = true;
  const cells = aroundCells (matrix, cell.x, cell.y);
  
  for (const cell of cells) cell.mineCount++;
}

const findCell = (matrix, x, y) => !matrix[y] || !matrix[y][x] ? false : matrix[y][x];

const aroundCells = (matrix, x, y) => {
  const cells = [];
  for (let dx = -1; dx <= 1; dx++){
    for (let dy = -1; dy <= 1; dy++){
      if (dx === 0 && dy === 0) continue;
      const cell = findCell(matrix, x + dx, y + dy);
      if (cell) cells.push(cell);
    }
  }
  return cells;
}
