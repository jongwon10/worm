var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var box = 20;
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;
var snake = [];
snake[0] = { x: 10 * box, y: 10 * box };
var food = { x: Math.floor(Math.random() * ((canvasWidth - box) / box)) * box, 
             y: Math.floor(Math.random() * ((canvasWidth - box) / box)) * box };
var score = 0;
var d;
var speed = 125;
var speeds = 0.9;
var gameOver = false;

var snakeImg = document.getElementById('snakeImg');
var foodImg = document.getElementById('foodImg');


var bestScore = parseInt(localStorage.getItem('bestScore')) || 0;

if (bestScore === null) {
    bestScore = 0;
} else {
    bestScore = parseInt(bestScore);
}

if (score > bestScore) {
    bestScore = score;
    localStorage.setItem('bestScore', bestScore);
}

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

function gameSpeed() {
    speed *= speeds;
}

$(document).on("click", "#sBtn", function() {
    console.log("sBtn click");
    $("#sBtn").css("display", "none");
    $("#nPopup").css("display", "block");
});

function resetGame() {
    // 게임 변수 초기화
    
    snake = [];
    snake[0] = { x: 10 * box, y: 10 * box };
    food = { x: Math.floor(Math.random() * ((canvasWidth - box) / box)) * box, 
             y: Math.floor(Math.random() * ((canvasWidth - box) / box)) * box };
    score = 0;
    d = undefined;
    speed = 125;
    speeds = 0.9;
    gameOver = false;

    // 게임 타이머 리셋 및 재시작
    clearInterval(game);
    game = setInterval(draw, speed);

    // 게임 종료 팝업 숨기기
    $("#goPopup").css("display", "none");
}

function startGame() {
    console.log("startGame");
    var popup = document.getElementById('nPopup');
    popup.style.display = 'none';

    // 게임 리셋 함수 호출
    resetGame();
}

function draw() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    for (var i = 0; i < snake.length; i++) {
        ctx.drawImage(snakeImg, snake[0].x, snake[0].y, box, box);
        ctx.fillStyle = 'burlywood'; // snake의 색상으로 설정
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.drawImage(foodImg, food.x, food.y, box, box);

    var snakeX = snake[0].x;
    var snakeY = snake[0].y;

    if (d === 'LEFT') snakeX -= box;
    if (d === 'UP') snakeY -= box;
    if (d === 'RIGHT') snakeX += box;
    if (d === 'DOWN') snakeY += box;

    if (snakeX == food.x && snakeY == food.y) {
        score += 10;
        food = { 
            x: Math.floor(Math.random() * ((canvasWidth - box) / box)) * box, 
            y: Math.floor(Math.random() * ((canvasHeight - box) / box)) * box 
        };

        var eatSound = document.getElementById('eatSound');
        eatSound.play();

        gameSpeed();
        clearInterval(game);
        game = setInterval(draw, speed);
    } else {
        snake.pop();
    }

    var newHead = { x: snakeX, y: snakeY };

    if (snakeX < 0 || snakeX >= canvasWidth || snakeY < 0 || snakeY >= canvasHeight) {
        endGame();
        console.log("Game over - Hit wall!");
        
        return;
    }

    if (collision(newHead, snake)) {
        endGame();
        console.log("Game over - Hit itself!");
        
        return;
    }

    snake.unshift(newHead);

    var scoreDisplay = document.getElementById("score");
    if(scoreDisplay) {
        scoreDisplay.innerText = 'Score: ' + score;
    } else {
        console.error("Score display element not found.");
    }

    var bestScoreDisplay = document.getElementById("bestScore");
    if(bestScoreDisplay) {
        bestScoreDisplay.innerText = 'Best Score: ' + bestScore;
    } else {
        console.error("Best score display element not found.");
    }
}

function endGame() {
    clearInterval(game);
    console.log("GameOver!");

    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('bestScore', bestScore);
    }

    $("#final-score").text("Final Score: " + score);
    $("#best-score").text("Best Score: " + bestScore);
    $("#goPopup").css("display", "block");

    $(document).on("click", "#rBtn", function() {
        console.log("rBtn click");

        resetGame();
        $("#goPopup").css("display", "none");
        $("#nPopup").css("display", "block");
    });

    $(document).on("click", "#nBtn", function() {
        console.log("nBtn click");
        
        location.reload();
    }); 
}

$(document).on("click", "#cBtn", function() {
    console.log("cBtn");

    $("#ePopup").css("display", "block");

    $("#okBtn").on("click", function() {
        console.log("okBtn click");

        location.reload();
    });

    $("#noBtn").on("click", function() {
        console.log("noBtn click");

        $("#ePopup").css("display", "none");
        $("#nPopup").css("display", "block");

        $("#noBtn").on("click", function() {
            $("#goPopup").css("display", "none");

            resetGame();
            console.log("no 재시작");
        });
    });
});


var game = setInterval(draw, speed);
