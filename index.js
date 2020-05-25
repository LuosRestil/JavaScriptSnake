// set up canvas
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

// set box dimensions
const boxSize = 32;

// load images
const ground = new Image();
ground.src = "assets/img/ground.png";
const foodImg = new Image();
foodImg.src = "assets/img/food.png";

// load audio files
const eat = new Audio();
const dead = new Audio();
eat.src = "assets/audio/eat.mp3";
dead.src = "assets/audio/dead.mp3";

// create snake
let snake = [];
snake[0] = {
  x: 9 * boxSize,
  y: 10 * boxSize,
};

let food;

function generateFood() {
  let validLoc = false;
  while (!validLoc) {
    validLoc = true;
    spawnLoc = {
      x: Math.floor(Math.random() * 17 + 1) * boxSize,
      y: Math.floor(Math.random() * 15 + 3) * boxSize,
    };
    for (let i = 0; i < snake.length; i++) {
      if (snake[i].x == spawnLoc.x && snake[i].y == spawnLoc.y) {
        validLoc = false;
        console.log("food spawn failed");
      }
    }
  }
  food = spawnLoc;
}

// create food
generateFood();

// create score
let score = 0;
let highScore = 0;

function setDirection(event) {
  if (event.keyCode == 37 && direction != "RIGHT") {
    direction = "LEFT";
  } else if (event.keyCode == 38 && direction != "DOWN") {
    direction = "UP";
  } else if (event.keyCode == 39 && direction != "LEFT") {
    direction = "RIGHT";
  } else if (event.keyCode == 40 && direction != "UP") {
    direction = "DOWN";
  }
}

// check collision with snake body
function collision(head, body) {
  for (let i = 1; i < body.length; i++) {
    if (head.x == body[i].x && head.y == body[i].y) {
      return true;
    }
  }
  return false;
}

// control the snake
let direction;
document.addEventListener("keydown", setDirection);

// draw everything to canvas
function draw() {
  // ground
  context.drawImage(ground, 0, 0);
  // snake
  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      context.fillStyle = "green";
      context.fillRect(snake[i].x, snake[i].y, boxSize, boxSize);
      context.fillStyle = "white";
      context.strokeStyle = "black";
      // eyes: arc(x, y, r, sAngle, eAngle);
      let eyeRadius = 7;
      let leftEyeOffsetX = eyeRadius + 1;
      let rightEyeOffsetX = boxSize - eyeRadius - 1;
      let eyeOffsetY = eyeRadius + 1;
      // left eye
      context.beginPath();
      context.arc(
        snake[i].x + leftEyeOffsetX,
        snake[i].y + eyeOffsetY,
        7,
        0,
        2 * Math.PI
      );
      context.closePath();
      context.fill();
      context.stroke();
      //right eye
      context.beginPath();
      context.arc(
        snake[i].x + rightEyeOffsetX,
        snake[i].y + eyeOffsetY,
        7,
        0,
        2 * Math.PI
      );
      context.closePath();
      context.fill();
      context.stroke();

      // pupils
      let pupilTravelDistance = 3;
      let directionOffsetX = 0;
      let directionOffsetY = 0;
      switch (direction) {
        case "RIGHT":
          directionOffsetX += pupilTravelDistance;
          break;
        case "LEFT":
          directionOffsetX -= pupilTravelDistance;
          break;
        case "UP":
          directionOffsetY -= pupilTravelDistance;
          break;
        case "DOWN":
          directionOffsetY += pupilTravelDistance;
          break;
        default:
          break;
      }

      context.fillStyle = "black";
      // left pupil
      context.beginPath();
      context.arc(
        snake[i].x + leftEyeOffsetX + directionOffsetX,
        snake[i].y + eyeOffsetY + directionOffsetY,
        3,
        0,
        2 * Math.PI
      );
      context.closePath();
      context.fill();

      // right pupil
      context.beginPath();
      context.arc(
        snake[i].x + rightEyeOffsetX + directionOffsetX,
        snake[i].y + eyeOffsetY + directionOffsetY,
        3,
        0,
        2 * Math.PI
      );
      context.closePath();
      context.fill();
    } else {
      context.fillStyle = "white";
      context.fillRect(snake[i].x, snake[i].y, boxSize, boxSize);
      context.strokeStyle = "green";
      context.strokeRect(snake[i].x, snake[i].y, boxSize, boxSize);
    }
  }
  // food
  context.drawImage(foodImg, food.x, food.y);

  // old head position
  let headX = snake[0].x;
  let headY = snake[0].y;

  // game over
  if (
    headX < boxSize ||
    headX > 17 * boxSize ||
    headY < boxSize * 3 ||
    headY > 17 * boxSize ||
    collision(snake[0], snake)
  ) {
    dead.play();
    // update high score
    if (score > highScore) {
      highScore = score;
    }
    // reset
    snake = [];
    snake[0] = {
      x: 9 * boxSize,
      y: 10 * boxSize,
    };
    generateFood();

    direction = null;
    score = 0;
    return;
  }

  // which direction
  switch (direction) {
    case "LEFT":
      headX -= boxSize;
      break;
    case "RIGHT":
      headX += boxSize;
      break;
    case "UP":
      headY -= boxSize;
      break;
    case "DOWN":
      headY += boxSize;
  }

  // add new head
  let newHead = { x: headX, y: headY };
  snake.unshift(newHead);

  // if snake eats food
  if (headX == food.x && headY == food.y) {
    eat.play();
    score++;
    // generate new food
    generateFood();
    // don't remove tail
  } else {
    // remove tail
    snake.pop();
  }

  // text
  context.fillStyle = "white";
  context.font = "45px Courier";
  context.fillText(score, 80, 50);
  context.font = "30px Courier";
  context.fillText("High Score: " + highScore, 325, 45);
}

// call draw function every 100ms
let game = setInterval(draw, 100);
