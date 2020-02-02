const maxSize = 64;
const containerSize = 550;
const container = document.querySelector('.container');
container.style.cssText = setSquareSize(containerSize);
container.style.backgroundColor = 'rgba(0,0,0,.5)';

const buttons = document.querySelector('.buttons');
const resetBtn = document.querySelector('button.reset');
const rainbowBtn = document.querySelector('button.rainbow');

buttons.style.width = `${containerSize}px`;
resetBtn.addEventListener('click', resetSquares);
rainbowBtn.addEventListener('click', setRainbow);
addSquares(16);

// FUNCTIONS //

function addSquares(numSquares) {
	const size = containerSize / numSquares;
	
	for (let i = 0; i < numSquares; i++) {
		const row = document.createElement('div');
		row.classList.add('row');
		
		for (let j = 0; j < numSquares; j++) {
			const square = createSquare(numSquares)
			row.appendChild(square);
		}
		
		container.appendChild(row);
	}
}

function createSquare(numSquares) {
	const square = document.createElement('div');
	const size = containerSize / numSquares;
	
	square.classList.add('square');
	square.style.cssText = setSquareSize(size);
	square.style.backgroundColor = 'rgba(0,0,0,.5)';
	square.addEventListener('mouseover', changeColor);
	
	return square;
}

function resetSquares() {
	const response = prompt('How many squares (MIN = 1, MAX = 64)?');
	const squares = Number(response);
	
	if (!Number.isNaN(squares) && (1 <= squares && squares <= maxSize)) {
		[...container.children].forEach(child => container.removeChild(child));
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
	if (rainbowBtn.getAttribute('data-rainbow')) {		
		event.target.style.backgroundColor = randomColor();
	} else {
		event.target.style.backgroundColor = '#fff';
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