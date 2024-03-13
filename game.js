var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var box = 20;
var canvasSize = 400;

var snake = [];
snake[0] = { x: 10 * box, y: 10 * box };

var food = { x: Math.floor(Math.random() * (canvasSize / box)) * box, y: Math.floor(Math.random() * (canvasSize / box)) * box };

var score = 0;

var d;

document.addEventListener('keydown', direction);

function direction(event) {
    if (event.keyCode == 37 && d !== 'RIGHT') {
        d = 'LEFT';
    } else if (event.keyCode == 38 && d !== 'DOWN') {
        d = 'UP';
    } else if (event.keyCode == 39 && d !== 'LEFT') {
        d = 'RIGHT';
    } else if (event.keyCode == 40 && d !== 'UP') {
        d = 'DOWN';
    }
}

function collision(head, array) {
    for (var i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

function draw() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    for (var i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? 'green' : 'white';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);

        ctx.strokeStyle = 'black';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    var snakeX = snake[0].x;
    var snakeY = snake[0].y;

    if (d === 'LEFT') snakeX -= box;
    if (d === 'UP') snakeY -= box;
    if (d === 'RIGHT') snakeX += box;
    if (d === 'DOWN') snakeY += box;

    if (snakeX == food.x && snakeY == food.y) {
        score++;
        food = { x: Math.floor(Math.random() * (canvasSize / box)) * box, y: Math.floor(Math.random() * (canvasSize / box)) * box };
    } else {
        snake.pop();
    }

    var newHead = { x: snakeX, y: snakeY };

    if (snakeX < 0 || snakeX >= canvasSize || snakeY < 0 || snakeY >= canvasSize || collision(newHead, snake)) {
        clearInterval(game);
    }

    snake.unshift(newHead);

    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
}

var game = setInterval(draw, 100);