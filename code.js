'use strict';

const buildMatrix = (cols, rows) => {
  const matrix = new Array();
  let id = 1;

  for (let y = 0; y < rows; y++){
    const row = new Array();
    for (let x = 0; x < cols; x++)
      row.push({
          id: id++,
          visible: false,
          left: false,
          right: false,
          flag: false,
          mine: false,
          mineCount: 0,
          poten: false,
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

const cellById = (matrix, id) => {
  for (let y = 0;y < matrix.length; y++){
    for (let x = 0; x < matrix[y].length; x++){
      if (matrix[y][x].id === id) return matrix[y][x];
    }
  }
  return false;
}

const matrixHTML = matrix => {
  const gameDiv = document.createElement('div');
  gameDiv.classList.add('minesweeper');

  for (let y = 0; y < matrix.length; y++) {
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('row');
    for (let x = 0; x < matrix[y].length; x++){
      const cell = matrix[y][x];
      const imgDiv = document.createElement('img');
      imgDiv.draggable = false;
      imgDiv.oncontextmenu = () => false;
      imgDiv.setAttribute('cellid', cell.id);
      rowDiv.append(imgDiv);
      if (cell.flag) imgDiv.src = './img/flag.png';
      else if (cell.poten) imgDiv.src = './img/poten.png';
      else if (!cell.visible) imgDiv.src = './img/facingDown.png';
      else if (cell.mine) imgDiv.src = './img/bomb.png';
      else imgDiv.src = `./img/${cell.mineCount}.png`;
    }
    gameDiv.append(rowDiv);
  }
  
  return gameDiv;
}

const forEach = (matrix, handler) => {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++){
      handler(matrix[y][x]);
    }
  }
}

const openSpread = (matrix, x, y) => {
  const cell = findCell(matrix, x, y);
  if (cell.mineCount || cell.mine || cell.flag) return;
  
  forEach(matrix, x => x._mark = false);
  
  cell._mark = true;
  let flag = true;
  while(flag){
    flag = false;
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[y].length; x++){
        const cell = matrix[y][x];
        if(!cell._mark || cell.mineCount) continue;
        const cells = aroundCells(matrix, x, y);
        for (const cell of cells) {
          if (cell._mark) continue;
          if (!cell.mine || !cell.flag) {
            cell._mark = true;
            flag = true;
          }
        }
      }
    }
  }
  forEach(matrix, x => {
      if (x._mark) x.visible = true;
      delete x._mark
    });

}

const win = (matrix) => {
  const flags = [];
  const mines = [];
  forEach(matrix, cell => {
    if (cell.flag) flags.push(cell);
    if (cell.mine) mines.push(cell);
  });
  if (flags.length !== mines.length) return false;
  for (const cell of mines) {
    if (!cell.flag) return false;
  }

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++){
      const cell = matrix[y][x];
      if (!cell.mine && !cell.visible) return false;
    }
  }

  return true;
}

const lose = (matrix) => {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++){
      const cell = matrix[y][x];
      if (cell.mine && cell.visible) return true;
    }
  }
  return false;
}