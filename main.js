const container = document.querySelector('.container');

const resetBtn = document.createElement('button');
resetBtn.classList.add('reset');
resetBtn.textContent = 'Reset';
resetBtn.addEventListener('click', resetSquares);
document.body.insertBefore(resetBtn, container);

addSquares(16);

// FUNCTIONS //

function addSquares(numSquares) {
	let squares = [];
	for (let i = 0; i < numSquares; i++) {
		for (let j = 0; j < numSquares; j++) {
			const square = createSquare(numSquares);
			container.appendChild(square);
		}
	}
}

function createSquare(numSquares) {
	const square = document.createElement('div');
	
	square.style.backgroundColor = '#000';
	square.style.cursor = 'default';
	square.classList.add('square');
	square.addEventListener('mouseover', changeColor)
	
	return square;
}

function resetSquares() {
	const squares = container.children;
	[...squares].forEach(square => square.style.backgroundColor = '#000');
}

function changeColor(event) {
	event.target.style.backgroundColor = '#fff';
}

function randomColor() {
	return `rgba(${randomColor(255)},${randomColor(255)},${randomColor(255)})`;
}

function randomNumber(n) {
	return Math.random() * (n + 1);
}