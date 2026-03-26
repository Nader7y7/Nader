const board = document.getElementById('board');
const ctx = board.getContext('2d');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('highScore');
const statusEl = document.getElementById('status');
const startBtn = document.getElementById('startBtn');

const tileSize = 21;
const tilesCount = board.width / tileSize;
const speed = 110;

let snake;
let food;
let direction;
let pendingDirection;
let score;
let highScore = Number(localStorage.getItem('snakeHighScore') || 0);
let loopId = null;

highScoreEl.textContent = highScore;

function randomPoint() {
  return {
    x: Math.floor(Math.random() * tilesCount),
    y: Math.floor(Math.random() * tilesCount),
  };
}

function spawnFood() {
  let candidate = randomPoint();
  while (snake.some((part) => part.x === candidate.x && part.y === candidate.y)) {
    candidate = randomPoint();
  }
  return candidate;
}

function resetGame() {
  snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ];
  direction = { x: 1, y: 0 };
  pendingDirection = direction;
  food = spawnFood();
  score = 0;
  scoreEl.textContent = score;
  statusEl.textContent = 'اللعبة بدأت!';
  statusEl.classList.remove('danger');
  draw();
}

function drawCell(x, y, color, radius = 3) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x * tileSize + 1, y * tileSize + 1, tileSize - 2, tileSize - 2, radius);
  ctx.fill();
}

function draw() {
  ctx.clearRect(0, 0, board.width, board.height);

  drawCell(food.x, food.y, '#ff8c42', 8);
  snake.forEach((part, index) => {
    const color = index === 0 ? '#47e57b' : '#35bb63';
    drawCell(part.x, part.y, color, index === 0 ? 6 : 4);
  });
}

function setDirection(newDirection) {
  const isReverse =
    newDirection.x === -direction.x && newDirection.y === -direction.y;

  if (!isReverse) {
    pendingDirection = newDirection;
  }
}

function keyToDirection(key) {
  const map = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
    w: { x: 0, y: -1 },
    s: { x: 0, y: 1 },
    a: { x: -1, y: 0 },
    d: { x: 1, y: 0 },
  };

  return map[key] || null;
}

function tick() {
  direction = pendingDirection;

  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y,
  };

  const hitWall =
    head.x < 0 || head.x >= tilesCount || head.y < 0 || head.y >= tilesCount;
  const hitSelf = snake.some((part) => part.x === head.x && part.y === head.y);

  if (hitWall || hitSelf) {
    clearInterval(loopId);
    loopId = null;
    statusEl.textContent = 'انتهت اللعبة! اضغط على إعادة التشغيل.';
    statusEl.classList.add('danger');
    return;
  }

  snake.unshift(head);

  const ateFood = head.x === food.x && head.y === food.y;
  if (ateFood) {
    score += 10;
    scoreEl.textContent = score;
    food = spawnFood();

    if (score > highScore) {
      highScore = score;
      localStorage.setItem('snakeHighScore', String(highScore));
      highScoreEl.textContent = highScore;
    }
  } else {
    snake.pop();
  }

  draw();
}

startBtn.addEventListener('click', () => {
  resetGame();

  if (loopId) {
    clearInterval(loopId);
  }

  loopId = setInterval(tick, speed);
});

window.addEventListener('keydown', (event) => {
  const newDirection = keyToDirection(event.key);
  if (!newDirection) {
    return;
  }
  event.preventDefault();

  if (!loopId) {
    startBtn.click();
  }

  setDirection(newDirection);
});

resetGame();
