let matrix = null;
let running = false;

document
  .querySelector('button')
  .addEventListener('click', () => init(10, 10, 10))


const init = (col, row, mines) => {
  matrix = buildMatrix(col, row);
  running = true;
  for (let i = 0; i < mines; i++) {
    randomMine(matrix);
  };

  updateData();
}

const updateData = () => {
  if (!running) return;

  if (lose(matrix)) {
    forEach(matrix, x => {
      if(x.mine){
        x.visible = true;
      } 
    })
    alert('LOSE');
    running = false;
  }
  else if (win(matrix)){
    alert('WIN');
    running = false;
  }

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

init(10, 10, 10);
