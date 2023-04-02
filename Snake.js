const playBoard= document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 10;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let setIntervalId;
let score = 0;

// getting high score from the local storage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerHTML = `High Score: ${score}`;

const changeFoodPostion = () => {
    // passing a random 0 - 30 values as food position
    foodX = Math.floor(Math.random() *30)+ 1;
    foodY = Math.floor(Math.random() *30)+ 1;
}

const handleGameOver = () => {
    //clearing the timer and reloding the page on the game over
    clearInterval(setIntervalId);
    alert('Game Over! press OK to reply...')
    location.reload();
}
const changeDirection = (e) =>{
    // changing velocity value based on key press
    if(e.key === "ArrowUp" && velocityY != 1){
        velocityX = 0;
        velocityY = -1;
    }else if(e.key === "ArrowDown"&& velocityY != -1){
        velocityX = 0;
        velocityY = 1;
    }else if(e.key === "ArrowLeft"&& velocityX != 1){
        velocityX = -1;
        velocityY = 0;
    }else if(e.key === "ArrowRight"&& velocityX != -1){
        velocityX = 1;
        velocityY = 0;
    }
}

controls.forEach(key => {
    //calling changedirection on each key click and passing key dataset value as an object
    key.addEventListener("click", () => changeDirection({ key: key.dataset.key }));
})

const initGame = () => {
    if(gameOver) return handleGameOver();
    let foodMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
    let headMarkup = `<div class="head" style="grid-area: ${snakeY} / ${snakeX}"></div>`;
        // checking if the snake hit the food
    if(snakeX === foodX && snakeY === foodY){
        changeFoodPostion();
        snakeBody.push([foodX, foodY]);//pushing food position to snake body array
        score++;//increment score by 1


        highScore = score >= highScore ? score: highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `score: ${score}`;
        highScoreElement.innerHTML = `High Score: ${score}`;
    }

    for( let i = snakeBody.length -1; i > 0; i--){
      // shifing forward the values of the elements in the snake body by one 
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY]; //setting first element of snake body to current snake position
    
    // updating the snake's headposition bassed on the current velocity
    snakeX += velocityX;
    snakeY += velocityY;

    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30){
        gameOver = true;
    }

    //checking if the snake's head is out of wall, if so setting gameover to true
    for(let i = 0; i < snakeBody.length; i++){
        // adding a div for each part of the snake's body 
        htmlMarkup = `<div class='food' style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        //checking if the snake head hit the body,if so set gameover to true
        if(i !== 0 && snakeBody[0][1] === snakeBody[i][1] &&  snakeBody[0][1] === snakeBody[i][0]){
           gameOver = true; 
        }
    }


    
    playBoard.innerHTML = foodMarkup + headMarkup;
}
changeFoodPostion();
initGame();
setIntervalId= setInterval(initGame, 125);
document.addEventListener("keydown" , changeDirection);