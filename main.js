const matrix = buildMatrix(40, 40);

for (let i = 0; i < 140; i++) {
  randomMine(matrix);
};

const updateData = () => {
  const gameDiv = matrixHTML(matrix);
  const appDiv = document.querySelector('#app');
  appDiv.innerHTML = '';
  appDiv.append(gameDiv); 
  appDiv
    .querySelectorAll('img')
    .forEach(img => {
      img.addEventListener('mousedown', mousedownHandler);
      img.addEventListener('mouseup', mouseupHandler);
      img.addEventListener('mouseleave', mouseleaveHandler);

    })
}

updateData();

function mousedownHandler (event) {
  const {cell, left, right} = getInfo(event);
  if (left) cell.left = true;
  if (right) cell.right = true;
  if (cell.right && cell.left) {
    bothHandler(cell);
  }

  updateData();
};


function mouseupHandler (event) {
  const {cell, left, right} = getInfo(event);
  const both = cell.right && cell.left && (left || right);
  const leftClick = !both && cell.left && left;
  const rightClick = !both && cell.right && right;
  
  if (both) forEach(matrix, x => x.poten = false)
  if (left) cell.left = false;
  if (right) cell.right = false;
  if (leftClick) leftHandler(cell);
  else if (rightClick) rightHandler(cell);

  updateData();
};

function mouseleaveHandler (event) {
  const info = getInfo(event);
  info.cell.left = false;
  info.cell.rigth = false;

  updateData();
}

const getInfo = event => {
  const id = event.target.getAttribute('cellid');
  return {
    left: event.which === 1,
    right: event.which === 3,
    cell: cellById(matrix, parseInt(id)),
  }
}

function leftHandler (cell) {
  if (cell.visible || cell.flag) return;
  cell.visible = true;

  if (!cell.mine && !cell.mineCount) {
    openSpread(matrix, cell.x, cell.y);
  }
};

function rightHandler (cell) {
  if (!cell.visible) cell.flag = !cell.flag;

};

function bothHandler (cell) {
  if (!cell.visible || !cell.mineCount) return;
  const cells = aroundCells(matrix, cell.x, cell.y);
  const flags = cells.filter(x => x.flag).length;
  
  if (flags === cell.mineCount)
    cells
      .filter(x => !x.flag && !x.visible)
      .forEach(cell => { 
          cell.visible = true;
          openSpread(matrix, cell.x, cell.y);
        })
  else cells.filter(x => !x.flag && !x.visible).forEach(cell => cell.poten = true)
};
