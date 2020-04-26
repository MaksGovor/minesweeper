const matrix = buildMatrix(10, 10);

for (let i = 0; i < 10; i++) {
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

};


function mouseupHandler (event) {
  const {cell, left, right} = getInfo(event);
  const both = cell.right && cell.left && (left || right);
  const leftClick = !both && cell.left && left;
  const rightClick = !both && cell.right && right;

  if (left) cell.left = false;
  if (right) cell.right = false;
  if (leftClick) leftHandler(cell);
  else if (rightClick) rightHandler(cell);

};

function mouseleaveHandler (event) {
  const info = getInfo(event);
  info.cell.left = false;
  info.cell.rigth = false;
}

const getInfo = event => {
  const id = event.target.getAttribute('cellid');
  return {
    left: event.which === 1,
    right: event.which === 3,
    cell: cellById(matrix, parseInt(id)),
  }
}

function leftHandler () {
  console.log('left');
};

function rightHandler () {
  console.log('right');
};

function bothHandler () {
  console.log('both')
};
