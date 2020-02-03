const maxSize = 64;
const boardSize = 550;
const board = document.querySelector('.board');
board.style.cssText = setSquareSize(boardSize);
board.style.backgroundColor = 'rgba(0,0,0,.5)';

const buttons = document.querySelector('.buttons');
const resetBtn = document.querySelector('button.reset');
const rainbowBtn = document.querySelector('button.rainbow');

let penIsDown = false;
buttons.style.width = `${boardSize}px`;
resetBtn.addEventListener('click', resetSquares);
rainbowBtn.addEventListener('click', setRainbow);
addSquares(16);

// FUNCTIONS //

function addSquares(numSquares) {
	const size = boardSize / numSquares;
	
	for (let i = 0; i < numSquares; i++) {
		const row = document.createElement('div');
		row.classList.add('row');
		
		for (let j = 0; j < numSquares; j++) {
			const square = createSquare(numSquares)
			row.appendChild(square);
		}
		
		board.appendChild(row);
	}
}

function createSquare(numSquares) {
	const square = document.createElement('div');
	const size = boardSize / numSquares;
	
	square.classList.add('square');
	square.style.cssText = setSquareSize(size);
	square.style.backgroundColor = 'rgba(0,0,0,.5)';
	square.addEventListener('click', changePenStatus);
	square.addEventListener('mouseover', changeColor);
	
	return square;
}

function changePenStatus(event) {
	penIsDown = !penIsDown;
	if (penIsDown) paintSquare(event.target);
}

function resetSquares() {
	const response = prompt('How many squares (MIN = 1, MAX = 64)?');
	const squares = Number(response);
	
	if (!Number.isNaN(squares) && (1 <= squares && squares <= maxSize)) {
		[...board.children].forEach(child => board.removeChild(child));
		penIsDown = false;
		addSquares(squares);
	}
}

function setRainbow(event) {
	if (event.target.getAttribute('data-rainbow')) {
		event.target.removeAttribute('data-rainbow');
	} else {
		event.target.setAttribute('data-rainbow', 'yes');
	}
}

function changeColor(event) {
	event.stopPropagation();
	if (penIsDown) paintSquare(event.target);
}

function paintSquare(square) {
	if (rainbowBtn.getAttribute('data-rainbow')) {		
		square.style.backgroundColor = randomColor();
	} else {
		square.style.backgroundColor = '#fff';
	}
}

function randomColor() {
	const red = randomNumber(255);
	const green = randomNumber(255);
	const blue = randomNumber(255);

	return `rgb(${red},${green},${blue})`;
}

function setSquareSize(size) {
	return `width: ${size}px;height: ${size}px;flex: 1 1 ${size}px`;
}

function randomNumber(n) {
	return Math.floor(Math.random() * (n + 1));
}