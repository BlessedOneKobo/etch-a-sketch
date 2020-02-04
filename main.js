// Board //
const minCells = 1;
const maxCells = 64;
const defaultNumCells = 16;
const boardSize = 550;
const board = document.querySelector('.board');

// Buttons //
const buttons = document.querySelector('.buttons');
const resetBtn = document.querySelector('button.reset');
const rainbowBtn = document.querySelector('button.rainbow');
resetBtn.addEventListener('click', resetCells);
rainbowBtn.addEventListener('click', setRainbow);

// Initialization //
const defaultPenColor = '#000';
let penIsDown = false;
addCells(defaultNumCells);


// FUNCTIONS //

function addCells(numCells) {
  const cellSize = boardSize / numCells;
  
  for (let i = 0; i < numCells; i++) {
    const row = document.createElement('div');
    row.classList.add('row');
    
    for (let j = 0; j < numCells; j++) {
      const cell = createCell(cellSize, numCells)
      row.appendChild(cell);
    }
    
    board.appendChild(row);
  }
}

function createCell(cellSize, numCells) {
  const cell = document.createElement('div');
  
  cell.classList.add('cell');
  cell.style.cssText = setCellSize(cellSize);
  cell.addEventListener('click', changePenStatus);
  cell.addEventListener('mouseover', handleHover);
  
  return cell;
}

function changePenStatus(event) {
  penIsDown = !penIsDown;
  if (penIsDown) paintCell(event.target);
}

function resetCells() {
  const message = 'How many cells per line (MIN = 1, MAX = 64)?'
  const response = prompt(message);

  if (response !== null) {
    let cells = Number(response);
    
    // If user enters no input or invalid input, set number of cells to
    // the current configuration
    if (Number.isNaN(cells) || (cells < minCells || cells > maxCells)) {
      // Calculate the size of any of the current cells in pixels
      const currentCell = document.querySelector('.cell');
      const currentCellSize = Number(currentCell.style.width.match(/\d+/)[0]);

      cells = Math.floor(boardSize / currentCellSize);
    }

    // Re-Initialization
    rainbowBtn.removeAttribute('data-rainbow');
    [...board.children].forEach(child => board.removeChild(child));
    penIsDown = false;
    addCells(cells);
  }
}

function setRainbow(event) {
  if (event.target.getAttribute('data-rainbow')) {
    event.target.removeAttribute('data-rainbow');
  } else {
    event.target.setAttribute('data-rainbow', 'yes');
  }
}

function handleHover(event) {
  if (penIsDown) paintCell(event.target);
}

function paintCell(cell) {
  if (rainbowBtn.getAttribute('data-rainbow')) {
    cell.style.backgroundColor = generateRandomColor();
    cell.setAttribute('data-color', 'random');
  } else {
    cell.style.backgroundColor = defaultPenColor;
    cell.setAttribute('data-color', 'default')
  }
}

function generateRandomColor() {
  const red = randomNumber(255);
  const green = randomNumber(255);
  const blue = randomNumber(255);

  return `rgb(${red},${green},${blue})`;
}

function setCellSize(size) {
  return `width: ${size}px;height: ${size}px;flex: 1 1 ${size}px`;
}

function randomNumber(n) {
  return Math.floor(Math.random() * (n + 1));
}