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
bestScoreElement.innerText = "Best Score: " + bestScore;

// 시작 버튼
$(document).on("click", "#startBtn", function() {
    console.log("startBtn click");
    $("#startPopup").css("display", "none");
    $("#noticePopup").css("display", "block");
});

// 게임 설명내의 시작 버튼
$(document).on("click", "#gameStartBtn", function() {
    console.log("gameStartBtn click");
    $("#noticePopup").css("display", "none");

    startGame(isFirstGame);
    isFirstGame = false;

    initGame();
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
    
    
    // restartBtn.onclick = function() {
    //     restartPopup.style.display = "none";  
    //     noticePopup.style.display = "flex";

    //     gameStartBtn.onclick = function() {
    //         // 게임 재시작 알림 팝업을 숨깁니다.
    //         noticePopup.style.display = "none";
            
    //         // 게임을 재시작합니다.
    //         gameRestart();
    //         console.log("재시작");
    //     };
    // };

    $(document).on("click", "#restartBtn", function() {
        $("#restartPopup").css("display", "none");
        $("#noticePopup").css("display", "block");

        $(document).on("click", "#gameStartBtn", function() {
            $("#noticPopup").css("display", "none");

            gameRestart();
            console.log("wotlwkr");
        });
    });


    $(document).on("click", "#nextBtn", function() {
        $("#endPopup").css("display", "block");
        $("#restartPopup").css("display", "none");

        $(document).on("click", "#okBtn", function() {
            location.reload();
        });
    });

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

// 음식 랜덤 생성
var changeFoodPosition = function() {
   
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

// 방향키
function changeDirection(e) {
    e = e || window.event;
    var keyCode = e.keyCode || e.which;

    if (keyCode === 38 && velocityY != 1) { // 화살표 위 키
        velocityX = 0;
        velocityY = -1;
    } else if (keyCode === 40 && velocityY != -1) { // 화살표 아래 키
        velocityX = 0;
        velocityY = 1;
    } else if (keyCode === 37 && velocityX != 1) { // 화살표 왼쪽 키
        velocityX = -1;
        velocityY = 0;
    } else if (keyCode === 39 && velocityX != -1) { // 화살표 오른쪽 키
        velocityX = 1;
        velocityY = 0;
    }
}

// 방향키 리스너
if (document.addEventListener) {
    document.addEventListener("keydown", changeDirection);
} else if (document.attachEvent) {
    // IE11
    document.attachEvent("onkeydown", changeDirection);
};

// 먹이를 먹을 때마다 속도가 올라감
var ingameSpeed = function() {
    speed *= speeds;
}

var initGame = function() {
    if (gameOver) return handleGameOver();
    
    var htmlMarkup = '';

    // 먹이 추가
    htmlMarkup += '<div class="food" style="top: ' + (foodY * 25) + 'px; left: ' + (foodX * 25) + 'px;"></div>';

    // 지렁이가 먹이를 먹었을 때
    if (snakeX === foodX && snakeY === foodY) {
        changeFoodPosition();
        snakeBody.push([foodX, foodY]); // 먹이를 먹을 때 인덱스를 따라간다
        score += 10; // 10점씩 올라감
        ingameSpeed();
        
        bestScore = score >= bestScore ? score : bestScore;
        localStorage.setItem("best-score", bestScore);
        scoreElement.innerText = "Score: " + score;
        bestScoreElement.innerText = "Best Score: " + bestScore;
    }

    // 게임 루프 간격 설정
    if (setIntervalId) clearInterval(setIntervalId);
    setIntervalId = setInterval(initGame, speed);

    // 몸통 이동
    for (var i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY]; // 처음 시작할 때의 위치

    // 지렁이 머리 업데이트
    snakeX += velocityX;
    snakeY += velocityY;

    // 벽에 부딪히면 게임 종료
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
        console.log("게임 벽");
    }

    // 게임 화면에 지렁이 그리기
    for (var i = 0; i < snakeBody.length; i++) {
        // 먹이를 먹으면 몸이 길어진다
        htmlMarkup += '<div class="head" style="top: ' + (snakeBody[i][1] * 25) + 'px; left: ' + (snakeBody[i][0] * 25) + 'px;"></div>';

        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
            console.log("게임", gameOver);
        }
    }
    playBoard.innerHTML = htmlMarkup;
}

window.addEventListener('load', function() {
    initGame();
});

changeFoodPosition();