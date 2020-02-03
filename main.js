// Board //
const minSquares = 1;
const maxSquares = 64;
const defaultSquares = 16;
const boardSize = 550;
const boardColor = 'rgba(0,0,0,.5)';
const board = document.querySelector('.board');
board.style.cssText = setSquareSize(boardSize);
board.style.backgroundColor = boardColor;

// Buttons //
const buttons = document.querySelector('.buttons');
const resetBtn = document.querySelector('button.reset');
const rainbowBtn = document.querySelector('button.rainbow');
buttons.style.width = `${boardSize}px`;
resetBtn.addEventListener('click', resetSquares);
rainbowBtn.addEventListener('click', setRainbow);

// Initialization //
const defaultPenColor = '#fff';
let penIsDown = false;
addSquares(defaultSquares);


// FUNCTIONS //

function addSquares(numSquares) {
	const size = boardSize / numSquares;
	
	for (let i = 0; i < numSquares; i++) {
		const row = document.createElement('div');
		row.classList.add('row');
		
		for (let j = 0; j < numSquares; j++) {
			const square = createSquare(size, numSquares)
			row.appendChild(square);
		}
		
		board.appendChild(row);
	}
}

function createSquare(size, numSquares) {
	const square = document.createElement('div');
	
	square.classList.add('square');
	square.style.cssText = setSquareSize(size);
	square.style.backgroundColor = boardColor;
	square.addEventListener('click', changePenStatus);
	square.addEventListener('mouseover', handleHover);
	
	return square;
}

function changePenStatus(event) {
	penIsDown = !penIsDown;
	if (penIsDown) paintSquare(event.target);
}

function resetSquares() {
	const message = 'How many squares (MIN = 1, MAX = 64, DEFAULT = 16)?'
	const response = prompt(message);

	if (response !== null) {
		let squares = Number(response);
		
		if (Number.isNaN(squares) || (squares < minSquares || squares > maxSquares)) {
			squares = 16;
		}
		
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

function handleHover(event) {
	if (penIsDown) paintSquare(event.target);
}

function paintSquare(square) {
	if (rainbowBtn.getAttribute('data-rainbow')) {		
		square.style.backgroundColor = generateRandomColor();
	} else {
		square.style.backgroundColor = defaultPenColor;
	}
}

function generateRandomColor() {
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