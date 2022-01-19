// game parameters

let frameSize = 500;
let snakeSize = 50;
let snakeSpeed = 160;
let frameWall = frameSize - snakeSize;
let frame = document.querySelector('.frame');
let skip = false;
let skipCount = 0;
let forwardSkip = [];
let randomNum = 0;

// setting initial positions of snake

let initial = 300;

for (let i = 0; i < 3; i++) {
	document.querySelectorAll('.snakeParts')[i].style.top = initial + 'px';
	document.querySelectorAll('.snakeParts')[i].style.left = '50px';
	initial += snakeSize;
}

let apple = document.querySelector('.apple');

apple.style.top = '100px';
apple.style.left = '200px';


let snakeDirection = ['u', 'u', 'u'];
let actions = [];
let isGameOver = false;

// setting function call on every tick

function moveByTick() {

	let snake = document.querySelectorAll('.snakeParts');

// changing direction of snake

	for (let i = 0; i < actions.length; i++) {
		let item = actions[i];
		snakeDirection[item[1]++] = item[0];
		if (snake.length == item[1]) {
			actions.shift()
			i--;
		}
	} 


// moving every part of snake
	snake.forEach((item, index) => {
		if (isGameOver) return;

		let sD = snakeDirection[index];
		let num;

		if (sD == 'd' || sD == 'r') num = snakeSize;
		else num = -snakeSize;

		let posX = parseInt(item.style.left);
		let posY = parseInt(item.style.top);

		if (sD == 'u' || sD == 'd') {

			if (index == 0) {
				if (crashCheck(posX, posY, snake)) return;
			}

			posY += num;
			item.style.top = posY + 'px';
		}
		else {

			if (index == 0) {
				if (crashCheck(posX, posY, snake)) return;
			}

			posX += num;
			item.style.left = posX + 'px';
		}

		// skip count when apple was easted

	if (skip) {
		let s = +((posY / 50).toString() + (posX / 50).toString());
		if ( s < randomNum ) {
			skipCount++;
		} else {
			forwardSkip.push(index);
		}

		if (index == snake.length - 1) {
			appleSpawn(snake);
		}
	}


		isKeySpam = false;
	});
}

let move = setInterval(moveByTick, snakeSpeed);

function crashCheck(posX, posY, snake) {

	let x = posX;
	let y = posY;
	for (let i = 4; i < snake.length; i++) {
		if (parseInt(snake[i].style.left) == posX && parseInt(snake[i].style.top) == posY) {
		alert('game over');
		clearInterval(move);
		isGameOver = true;
		return true;
		}
	}
// move = setTimeout(moveByTick, snakeSpeed);
	switch (snakeDirection[0]) {
		case 'u':
			posY -= snakeSize;
		break;
		case 'd':
			posY += snakeSize;
		break;
		case 'l':
			posX -= snakeSize;
		break;
		case 'r':
			posX += snakeSize;
		break;
	}
	if (posX > frameWall || posX < 0 || posY > frameWall || posY < 0) {
		alert('game over');
		clearInterval(move);
		isGameOver = true;
		return true;
	}
	appleEated(posX, posY, snake);
	return false;
}


let opposite = {
	37: 'r',
	38: 'd',
	39: 'l',
	40: 'u'
};

let isKeySpam = false;

// listening for key press

document.addEventListener('keydown', (e) => {
	let key = e.keyCode;
//forbidding snake to turn back

	if (snakeDirection[0] == opposite[key]) return;

	if (key == 32) {
		clearInterval(move)
	} else {
		isKeySpam = true;

		switch(key) {
			case 37:
				actions.push(['l', 0]);
			break;
			case 38:
				actions.push(['u', 0]);
			break;
			case 39:
				actions.push(['r', 0]);
			break;
			case 40:
				actions.push(['d', 0]);
			break;
		}
	}
})

// food system

function appleEated(posX, posY, snake) {
	if ( parseInt(apple.style.left) == posX && parseInt(apple.style.top) == posY) {
		snakeGrow(snake)
		randomNum = Math.floor(Math.random() * (100 - snake.length));
		skip = true;
	}
}

// snake growth

function snakeGrow(snake) {

	let tailIndex = snake.length - 1
	let snakeTail = snake[tailIndex];
	let posX = parseInt(snakeTail.style.left);
	let posY = parseInt(snakeTail.style.top);
	snakeDirection.push(snakeDirection[tailIndex]);

	let div = document.createElement('div');
	div.className = 'snakeParts';
	div.style.top = posY + 'px';
	div.style.left = posX + 'px';
	frame.appendChild(div);

}
// apple spawner

function appleSpawn(snake) {
	let pos = randomNum + skipCount;
	forwardSkip.unshift(0);
	skipCount = 0;
	skip = false;

	let posX = (pos % 10) * 50;
	let posY = Math.floor(pos / 10) * 50;

	for (let i = 0; i < forwardSkip.length; i++) {
		if ( parseInt(snake[forwardSkip[i]].style.left) == posX &&
			 parseInt(snake[forwardSkip[i]].style.top) == posY ) {
			let s = posX;
			posX += 50;
			forwardSkip.splice(i, 1);
			i = 0;
		}

		if (posX == 500) {
			posX = 0;
			posY += 50;
		}
	}

	forwardSkip = [];

	apple.style.left = posX + 'px';
	apple.style.top = posY + 'px';
}