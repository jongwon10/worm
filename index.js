var playBoard = document.querySelector(".play-board");
var scoreElement = document.querySelector(".score");
var bestScoreElement = document.querySelector(".best-score");
var startPopup = document.getElementById("startPopup");
var startBtn = document.getElementById("startBtn");
var noticePopup = document.getElementById("noticePopup");
var gameStartBtn = document.getElementById("gameStartBtn");
var restartPopup = document.getElementById("restartPopup");
var restartBtn = document.getElementById("restartBtn");
var nextBtn = document.getElementById("nextBtn");
var endPopup = document.getElementById("endPopup");
var okBtn = document.getElementById("okBtn");
var noBtn = document.getElementById("noBtn");

var gameOver = false;
var foodX, foodY;
var snakeX = 15, snakeY = 10;
var snakeBody = [];
var velocityX = 0, velocityY = 0;
var setIntervalId;
var score = 0;
var speed = 100;
var speeds = 0.9;
var isFirstGame = true;



// 저장된 로컬호스트의 높은 점수를 나타냄.
var bestScore = localStorage.getItem("best-score") || 0;
bestScoreElement.innerText = `Best Score: ${bestScore}`;

startBtn.addEventListener('click', function() {
    startPopup.style.display = "none";
    noticePopup.style.display = "flex";
});

gameStartBtn.addEventListener('click', function() {
    document.getElementById('noticePopup').style.display = "none";
    startGame(isFirstGame);
    isFirstGame = false;
    console.log("게임 시작");
});

var startGame = function(isFirstGame) {
    if(setIntervalId) clearInterval(setIntervalId);
    
    if (isFirstGame) {
        resetGame();
        setIntervalId = setInterval(initGame, speed);
        console.log("처음 게임 시작");
    } else {
        // setIntervalId = setInterval(initGame, speed);
        console.log("게임 재시작");
    }
}

// 게임 종료
var handleGameOver = function() {
    
    document.getElementById("score").innerText = "Score: " + score;
    document.getElementById("best-score").innerText = "Best Score: " + bestScore;

    restartPopup.style.display = "flex";
    console.log("게임종료1111");

    clearInterval(setIntervalId);
    
    // let restartBtn = document.getElementById('restartBtn');
    restartBtn.onclick = function() {
        restartPopup.style.display = "none";
        
       // let noticePopup = document.getElementById('noticePopup');
        noticePopup.style.display = "flex";

        // let gameStartBtn = document.getElementById('gameStartBtn');
        gameStartBtn.onclick = function() {
            // 게임 재시작 알림 팝업을 숨깁니다.
            noticePopup.style.display = "none";
            
            // 게임을 재시작합니다.
            gameRestart();
            console.log("재시작");
        };
    };

    
    nextBtn.onclick = function() {
        
        endPopup.style.display = 'block';   
        restartPopup.style.display = 'none';
        
        okBtn.onclick = function() {
            location.reload();
        };
    };

    noBtn.onclick = function() {

    noticePopup.style.display = "flex";
    endPopup.style.display = "none";

        gameStartBtn.onclick = function() {
            // 게임 재시작 알림 팝업을 숨깁니다.
            noticePopup.style.display = "none";
            
            // 게임을 재시작합니다.
            gameRestart();
            ingameSpeed();
            console.log("재시작");
        }
    }
}

// 게임 재시작
var gameRestart = function() {
    if(setIntervalId) clearInterval(setIntervalId);
    restartPopup.style.display = "none";
    // const popupContent = document.querySelector(".popup-content");
    // popupContent.style.display = "none";
    
    resetGame();
    startGame(false);
    setIntervalId = setInterval(initGame, speed);
};

// 게임 재시작 시 초기화
var resetGame = function() {
    
    snakeX = 15;
    snakeY = 10;
    velocityX = 0;
    velocityY = 0;
    snakeBody = [[snakeX, snakeY]];
    changeFoodPosition();
    score = 0;
    scoreElement.innerText = "Score: " + score;
    bestScore = localStorage.getItem("best-score") || 0;
    bestScoreElement.innerText = "Best Score: " + bestScore;
    gameOver = false;
    speed = 100;
    speeds = 0.9;

    // htmlMarkup 초기화
    var htmlMarkup = '<div class="food" style="grid-area: ' + foodY + ' / ' + foodX + ';"></div>';
    htmlMarkup += '<div class="head" style="grid-area: ' + snakeY + ' / ' + snakeX + '"></div>';
    playBoard.innerHTML = htmlMarkup;

    // 지렁이가 벽에 부딪히면 게임 종료
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY >30) {
        gameOver = true;
    }

    for (var i = 0; i < snakeBody.length; i++) {
        // 먹이를 먹으면 몸이 길어진다
        htmlMarkup += '<div class="head" style="grid-area: ' + snakeBody[i][1] + ' / ' + snakeBody[i][0] + '"></div>';

        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
};

var changeFoodPosition = function() {
    // 랜덤으로 0 - 30 사이에 음식이 나타난다
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

// 방향키
function changeDirection(e) {
    // 방향키를 누르면 한 칸 이동하는 이벤트 함수
    if(e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if(e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if(e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if(e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

// 방향키 리스너
if (document.addEventListener) {
    document.addEventListener("keydown", changeDirection);
} else if (document.attachEvent) {
    // IE11
    document.attachEvent("onkeydown", function(e) {
        e = e || window.event;
        changeDirection(e);
    });
};


// 먹이를 먹을 때마다 속도가 올라감
var ingameSpeed = function() {
    speed *= speeds;
}

var initGame = function() {
        
    if (gameOver) return handleGameOver();
    
    var htmlMarkup = '<div class="food" style="grid-area: ' + foodY + ' / ' + foodX + ';"></div>';

    // 지렁이가 먹이를 먹었을 때
    if (snakeX === foodX && snakeY === foodY) {
        changeFoodPosition();
        snakeBody.push([foodX, foodY]); // 먹이를 먹을 때 인덱스를 따라간다
        score += 10; // 10점씩 올라감
        // setIntervalId = setInterval(initGame, speed);

        ingameSpeed();
        
        bestScore = score >= bestScore ? score: bestScore;
        localStorage.setItem("best-score", bestScore);
        scoreElement.innerText = "Score: " + score;
        bestScoreElement.innerText = "Best Score: " + bestScore;
    }

    if(setIntervalId) clearInterval(setIntervalId);
    setIntervalId = setInterval(initGame, speed);

    for (var i = snakeBody.length - 1; i > 0; i--) {
        // 몸통의 요소 값을 하나씩 앞으로 이동
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY]; // 처음 시작할 때의 위치

    // 지렁이 머리 업데이트
    snakeX += velocityX;
    snakeY += velocityY;

    // 지렁이가 벽에 부딪히면 게임 종료
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY >30) {
        gameOver = true;
    }

    for (var i = 0; i < snakeBody.length; i++) {
        // 먹이를 먹으면 몸이 길어진다
        htmlMarkup += '<div class="head" style="grid-area: ' + snakeBody[i][1] + ' / ' + snakeBody[i][0] + '"></div>';

        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
            console.log("게임", gameOver);
        }
    }
    playBoard.innerHTML = htmlMarkup;
}

changeFoodPosition();
