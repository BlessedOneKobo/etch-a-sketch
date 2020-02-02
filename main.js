const container = document.querySelector('.container');

addSquares(16);

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

function changeColor(event) {
	event.target.style.backgroundColor = '#fff';
}

function randomColor() {
	return `rgba(${randomColor(255)},${randomColor(255)},${randomColor(255)})`;
}

function randomNumber(n) {
	return Math.random() * (n + 1);
}