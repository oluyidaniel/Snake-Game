const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const box = 20;

let snake = [{ x: 9 * box, y: 10 * box }];
let food = randomFood();
let score = 0;
let d;
let game; 

// Auth check
const currentUser = localStorage.getItem("currentUser");
if (!currentUser) {
  window.location.href = "index.html"; // back to login/signup
}

// Load user data (store each user separately)
let userData = JSON.parse(localStorage.getItem(currentUser)) || { highScore: 0 };

// Welcome card
document.getElementById("welcomeMessage").innerText =
  "Welcome, " + (userData.name || currentUser) + " to Bite or Die 🎮";
document.getElementById("highScore").innerText = userData.highScore || 0;

// Close welcome card
document.getElementById("closeWelcome").addEventListener("click", () => {
  document.getElementById("welcomeCard").classList.add("hidden");
  startGame();
});

// Random food position
function randomFood() {
  return {
    x: Math.floor(Math.random() * 19) * box,
    y: Math.floor(Math.random() * 19) * box
  };
}

// Key control
document.addEventListener("keydown", direction);
function direction(event) {
  if (event.keyCode == 37 && d != "RIGHT") d = "LEFT";
  else if (event.keyCode == 38 && d != "DOWN") d = "UP";
  else if (event.keyCode == 39 && d != "LEFT") d = "RIGHT";
  else if (event.keyCode == 40 && d != "UP") d = "DOWN";
}

// Game loop
function draw() {
  ctx.clearRect(0, 0, 400, 400);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "lime" : "white";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // Draw food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  // Snake movement
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (d == "LEFT") snakeX -= box;
  if (d == "UP") snakeY -= box;
  if (d == "RIGHT") snakeX += box;
  if (d == "DOWN") snakeY += box;

  // Eating food
  if (snakeX == food.x && snakeY == food.y) {
    score++;
    food = randomFood();
  } else {
    snake.pop();
  }

  let newHead = { x: snakeX, y: snakeY };

  // Game over
  if (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX >= 400 ||
    snakeY >= 400 ||
    collision(newHead, snake)
  ) {
    saveHighScore();
    clearInterval(game);
    showGameOver();
    return;
  }

  snake.unshift(newHead);
  document.getElementById("score").innerText = score;
}

// Collision check
function collision(head, array) {
  return array.some(segment => head.x === segment.x && head.y === segment.y);
}

// Save high score
function saveHighScore() {
  if (score > (userData.highScore || 0)) {
    userData.highScore = score;
    localStorage.setItem(currentUser, JSON.stringify(userData));
  }
}

// Show game over card
function showGameOver() {
  document.getElementById("finalScore").innerText = score;
  document.getElementById("finalHighScore").innerText = userData.highScore;
  document.getElementById("gameOverCard").classList.remove("hidden");
}

// Continue button
function continueGame() {
  score = 0;
  snake = [{ x: 9 * box, y: 10 * box }];
  food = randomFood();
  d = null;
  document.getElementById("score").innerText = 0;
  document.getElementById("gameOverCard").classList.add("hidden");
  startGame();
}

// Logout
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

// Start game loop
function startGame() {
  game = setInterval(draw, 100);
}
