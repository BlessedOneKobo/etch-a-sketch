const maxSize = 64;
const containerWidth = 580;
const containerHeight = 580;
const container = document.querySelector('.container');
container.style.cssText = setStyleBox(containerWidth, containerHeight);
container.style.backgroundColor = '#fff';

const buttons = document.querySelector('.buttons');
const resetBtn = document.querySelector('button.reset');
const rainbowBtn = document.querySelector('button.rainbow');

buttons.style.width = `${containerWidth}px`;
resetBtn.addEventListener('click', resetSquares);
rainbowBtn.addEventListener('click', setRainbow);
addSquares(16);

// FUNCTIONS //

function addSquares(numSquares) {
	const width = containerWidth / numSquares;
	const height = containerHeight / numSquares;
	let squares = [];
	
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
	const width = 1 / numSquares * containerWidth;
	const height = 1 / numSquares * containerHeight;
	
	square.classList.add('square');
	square.style.cssText = setStyleBox(width, height);
	square.style.backgroundColor = '#fff';
	square.style.cursor = 'default';
	square.addEventListener('mouseover', changeColor)
	
	return square;
}

function resetSquares() {
	const response = prompt('How many squares?');
	const numSquares = Number(response);
	
	if (!Number.isNaN(numSquares) && (1 <= numSquares && numSquares <= maxSize)) {
		const squares = container.children;
		[...squares].forEach(square => container.removeChild(square));
		addSquares(numSquares);
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
	if (rainbowBtn.getAttribute('data-rainbow')) {		
		event.target.style.backgroundColor = randomColor();
	} else {
		event.target.style.backgroundColor = '#000';
	}
}

function randomColor() {
	const red = randomNumber(255).toString(16);
	const green = randomNumber(255).toString(16);
	const blue = randomNumber(255).toString(16);

	return `#${red}${green}${blue}`;
}

function setStyleBox(width, height) {
	return `width: ${width}px;height: ${height}px;flex: 1 1 ${width}px`;
}

function randomNumber(n) {
	return Math.floor(Math.random() * (n + 1));
}