const container = document.querySelector('.container');

createSquares(16);

function createSquares(numSquares) {
	let squares = [];
	for (let i = 0; i < numSquares; i++) {
		for (let j = 0; j < numSquares; j++) {
			const num = (numSquares * i + j) + 1;
			const square = createSquare(num, numSquares);
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
	const red = randomNumber(255);
	const green = randomNumber(255);
	const blue = randomNumber(255);

	return `rgba(${red},${green},${blue})`;
}

function randomNumber(n) {
	return Math.random() * (n + 1);
}