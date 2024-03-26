var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var box = 20;
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;
var snake = [];
snake[0] = { x: 10 * box, y: 10 * box };
var food = { x: (Math.floor(Math.random() * ((canvasWidth - 2 * box) / box)) + 1) * box,
             y: (Math.floor(Math.random() * ((canvasHeight - 2 * box) / box)) + 1) * box };
var score = 0;
var normalScore = 0;
var hardScore = 0;
var d;
var speed;
var speeds = 0.9;
var gameOver = false;
var savedState = null;
var gameStarted = false;
var specialFood = { x: 0, y: 0, active: false };
var bombFood = { x: 0, y: 0, active: false };
var bombFood2 = { x: 0, y: 0, active: false };
var bombFood3 = { x: 0, y: 0, active: false };
var foodEatenCount = 0;
var count = 3;
var countdownInterval;

var snakeImg = document.getElementById('snakeImg');
var foodImg = document.getElementById('foodImg');
var specialFoodImg = document.getElementById('specialFoodImg');
var bombFoodImg = document.getElementById('bombFoodImg');
var backgroundMusic = document.getElementById('gameBgm');
backgroundMusic.volume = 0.3;

var eatSound = document.getElementById('eatSound');
var specialSound = document.getElementById('specialSound');
var bombSound = document.getElementById('bombSound');

var bestScore = parseInt(localStorage.getItem('bestScore')) || 0;

var currentMode;

function switchMode(mode) {
    currentMode = mode;
    if (mode == 'normalMode') {
        speed = 300;
    } else if (mode == 'hardMode') {
        speed = 200;
    }

    if (!gameStarted) {
        clearInterval(game);
        game = setInterval(draw, speed);
    }
}

if (bestScore === null) {
    bestScore = 0;
} else {
    bestScore = parseInt(bestScore);
}

document.addEventListener('keydown', direction);

function direction(event) {
    if (!$("#ePopup").is(":visible")) {
        if (gameStarted) {
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
    }
}

function collision(head, array) {
    if (array.length === 0) {
        return false;
    }

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

$("#normalBtn").on("click", function () {
    switchMode('normalMode');

    $("#normalBtn").css("display", "none");
    $("#hardBtn").css("display", "none");
    $("#nPopup").css("display", "block");
});

$("#hardBtn").on("click", function () {
    switchMode('hardMode');

    $("#normalBtn").css("display", "none");
    $("#hardBtn").css("display", "none");
    $("#nPopup").css("display", "block");
    $("#cBtn").off("click", cBtnClick);
});

$("#cBtn1").on("click", function () {
    $("#normalBtn").css("display", "block");
    $("#hardBtn").css("display", "block");
    $("#nPopup").css("display", "none");
    $("#cBtn").off("click", cBtnClick);
});

function startGame() {
    console.log("startGame");
    var popup = document.getElementById('nPopup');
    popup.style.display = 'none';

    backgroundMusic.play();

    resetGame();

    gameStarted = true;
}

function resetGame() {
    snake = [];
    snake[0] = { x: 10 * box, y: 10 * box };
    score = 0;
    normalScore = 0;
    hardScore = 0;
    d = undefined;
    speed;
    speeds = 0.9;
    gameOver = false;
    gameStarted = false;
    specialFood = { x: 0, y: 0, active: false };
    bombFood = { x: 0, y: 0, active: false };
    foodEatenCount = 0;
    clearInterval(countdownInterval);
    count = 3;
    // localStorage.removeItem('bestScore');

    clearInterval(game);

    if (currentMode == 'normalMode') {
        speed = 300;
    } else if (currentMode == 'hardMode') {
        speed = 200;
    }

    game = setInterval(draw, speed);

    $("#goPopup").css("display", "none");

    $("#cBtn").off("click", cBtnClick);
    $("#cBtn").on("click", cBtnClick);
    $(document).off("keydown", direction);
}

function draw() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    for (var i = 0; i < snake.length; i++) {
        ctx.drawImage(snakeImg, snake[0].x, snake[0].y, box, box);
        ctx.fillStyle = 'burlywood';
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
        normalScore += 10;
        hardScore += 10;
        foodEatenCount++;
        
        food = { x: (Math.floor(Math.random() * ((canvasWidth - 2 * box) / box)) + 1) * box,
                 y: (Math.floor(Math.random() * ((canvasHeight - 2 * box) / box)) + 1) * box };
        
        eatSound.play();

        if (specialFood.active) {
            specialFood.active = false;
        }

        if(foodEatenCount % 5 == 0) {
            specialFood.x = Math.floor((Math.random() * ((canvasWidth - 2 * box) / box)) + 1) * box;
            specialFood.y = Math.floor((Math.random() * ((canvasHeight - 2 * box) / box)) + 1) * box;
            specialFood.active = true;
        }
        
        if  (currentMode === 'hardMode' && bombFood.active) {
            bombFood.active = false;
        }

        if (currentMode === 'hardMode') {
            bombFood.x = Math.floor((Math.random() * ((canvasWidth - 2 * box) / box)) + 1) * box;
            bombFood.y = Math.floor((Math.random() * ((canvasHeight - 2 * box) / box)) + 1) * box;
            bombFood.active = true;
            console.log('1');

            bombFood2.x = Math.floor((Math.random() * ((canvasWidth - 2 * box) / box)) + 1) * box;
            bombFood2.y = Math.floor((Math.random() * ((canvasHeight - 2 * box) / box)) + 1) * box;
            bombFood2.active = true;
            console.log('2');

            bombFood3.x = Math.floor((Math.random() * ((canvasWidth - 2 * box) / box)) + 1) * box;
            bombFood3.y = Math.floor((Math.random() * ((canvasHeight - 2 * box) / box)) + 1) * box;
            bombFood3.active = true;
            console.log('3');
        }

        gameSpeed();
        clearInterval(game);
        game = setInterval(draw, speed);
    } else {
        snake.pop();
    }

    if(specialFood.active) {
        ctx.drawImage(specialFoodImg, specialFood.x, specialFood.y, box, box);
    }

    if(specialFood.active && snakeX == specialFood.x && snakeY == specialFood.y) {
        specialFood.active = false;
        
        var lengthToReduce = 2;
        if(snake.length > lengthToReduce) {
            for(let i = 0; i < lengthToReduce; i++) {
                snake.pop();
            }
        } else {
            // 뱀의 길이가 줄어들 길이보다 작거나 같은 경우, 뱀의 길이를 1로 설정
            while(snake.length > 1) {
                snake.pop();
            }
        }
        specialSound.play();
    }

    if (currentMode === 'hardMode') {
        // 폭탄 음식 그리기
        if (bombFood.active) {
            ctx.drawImage(bombFoodImg, bombFood.x, bombFood.y, box, box);
            ctx.drawImage(bombFoodImg, bombFood2.x, bombFood2.y, box, box);
            ctx.drawImage(bombFoodImg, bombFood3.x, bombFood3.y, box, box);
        }   

        // 폭탄 음식을 먹었을 때
        if (bombFood.active && snakeX === bombFood.x && snakeY === bombFood.y) {
            // 폭탄 음식을 먹었을 때의 동작 추가
            console.log('1번음식');
            endGame(); // 게임 종료

            // 폭탄 음식 화면에서 사라지게 하기
            bombFood.active = false;
            bombSound.play();
        }

        if (bombFood2.active && snakeX === bombFood2.x && snakeY === bombFood2.y) {
            // 폭탄 음식을 먹었을 때의 동작 추가
            console.log('2번음식');
            endGame(); // 게임 종료

            // 폭탄 음식 화면에서 사라지게 하기
            bombFood2.active = false;
            bombSound.play();
        }

        if (bombFood3.active && snakeX === bombFood3.x && snakeY === bombFood3.y) {
            // 폭탄 음식을 먹었을 때의 동작 추가
            console.log('3번음식');
            endGame(); // 게임 종료

            // 폭탄 음식 화면에서 사라지게 하기
            bombFood3.active = false;
            bombSound.play();
        }
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
        if (currentMode === 'normalMode') {
            scoreDisplay.innerText = 'Normal Score: ' + normalScore;
        } else if (currentMode ==='hardMode') {
            scoreDisplay.innerText = 'Hard Score: ' + hardScore;
        }
        
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

    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;

    if (currentMode === 'normalMode') {
        $("#normal-final-score").text("Normal Score: " + normalScore);
    } else if (currentMode === 'hardMode') {
        $("#hard-final-score").text("Hard Score: " + hardScore);
    }

    if ((currentMode === 'normalMode' && normalScore > bestScore) ||
        (currentMode === 'hardMode' && hardScore > bestScore)) {
        bestScore = (currentMode === 'normalMode') ? normalScore : hardScore;
        localStorage.setItem('bestScore', bestScore);
    }

    $("#best-score").text("Best Score: " + bestScore);
    $("#goPopup").css("display", "block");

    $("#cBtn").off("click");


    $(document).on("click", "#rBtn", function() {
        console.log("rBtn click");

        resetGame();
        $("#goPopup").css("display", "none");
        $("#nPopup").css("display", "block");
        $("#cBtn").off("click", cBtnClick);
    });

    $(document).on("click", "#nBtn", function() {
        console.log("nBtn click");
        
        location.reload();
    }); 
}

function pauseGame() {
    clearInterval(game);

    if (!gameOver) {
        savedState = {
            snake: JSON.parse(JSON.stringify(snake)),
            food: { x: food.x, y: food.y },
            score: score
        };
    }
    
    $(document).on("keydown", function(e) {
        e.preventDefault()
    });

    backgroundMusic.pause();

    count = 3;
}

function resumeGame() {
    count = 3;

    if (savedState) {
        snake = JSON.parse(JSON.stringify(savedState.snake));
        food = { x: savedState.food.x, y: savedState.food.y };
        score = savedState.score;
        game = setInterval(draw, speed);
        savedState = null;
    }

    backgroundMusic.play();
}

function cBtnClick() {
    console.log("cBtn clicked");

    pauseGame();
    $("#ePopup").css("display", "block");

    $("#okBtn").on("click", function() {
        console.log("okBtn click");

        location.reload();
    });

    $("#noBtn").on("click", function() {
        console.log("noBtn click");

        $("#ePopup").css("display", "none");
        $("#goPopup").css("display", "none");
        $("#countdownOverlay").css("display", "block");

        $("#countdownText").text("3");

        clearInterval(countdownInterval);
        countdownInterval = setInterval(function() {
            if(count > 1){
                // DOM이 완전히 로드된 후에 countdownText를 선택하여 텍스트를 설정
                count -= 1;
                $("#countdownText").text(count);
            } else {
                $("#countdownOverlay").css("display", "none");
                resumeGame();
                console.log("Game resumed");
                clearInterval(countdownInterval);
                count = 3;
            }
        }, 1000);
    });
}

var game = setInterval(draw, speed);