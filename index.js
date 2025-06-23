class Node {
    constructor(x, y) {
    this.x = x;
    this.y = y;
    this.next = null;
    }
}

class LinkedList {
    constructor(x, y) {
    this.head = new Node(x, y);
    this.tail = this.head;
    this.length = 1;
    }

    addHead(x, y) {
    const newNode = new Node(x, y);
    newNode.next = this.head;
    this.head = newNode;
    this.length++;
    }

    removeTail() {
    if (this.length === 1) return;
    let temp = this.head;
    while (temp.next && temp.next !== this.tail) {
        temp = temp.next;
    }
    temp.next = null;
    this.tail = temp;
    this.length--;
    }

    toArray() {
    let temp = this.head;
    const arr = [];
    while (temp) {
        arr.push({ x: temp.x, y: temp.y });
        temp = temp.next;
    }
    return arr;
    }

    getHead() {
    return { x: this.head.x, y: this.head.y };
    }
}

let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('./music/food.mp3');
const gameOverSound = new Audio('./music/gameover.mp3');
const moveSound = new Audio('./music/move.mp3');
const musicSound = new Audio('./music/music.mp3');
let score = 0;
let lastPaintTime = 0;
let speed = 10;
let gameRunning = false;
let musicPlaying = true;

let snake = new LinkedList(13, 15);
let snakeArr = snake.toArray();
let food = { x: 6, y: 7 };

function main(ctime) {
    if (!gameRunning) return;
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) return;
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(arr) {
    for (let i = 1; i < arr.length; i++) {
    if (arr[i].x === arr[0].x && arr[i].y === arr[0].y) return true;
    }
    return arr[0].x >= 18 || arr[0].x <= 0 || arr[0].y >= 18 || arr[0].y <= 0;
}

function gameEngine() {
  snakeArr = snake.toArray();

  if (isCollide(snakeArr)) {
    gameOverSound.play();
    musicSound.pause();
    inputDir = { x: 0, y: 0 };
    alert("Game Over. Press any key to play again!");
    updateLeaderboard(score);
    snake = new LinkedList(13, 15);
    snakeArr = snake.toArray();
    score = 0;
    speed = 10; 
    document.getElementById("scoreBox").textContent = score;
    if (musicPlaying) musicSound.play();
    return;
  }

  const head = snake.getHead();

  if (head.x === food.x && head.y === food.y) {
    foodSound.play();
    score++;

    if (score > hiscoreval) {
      hiscoreval = score;
      localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
      document.getElementById("hiscoreBox").textContent = hiscoreval;
    }

    document.getElementById("scoreBox").textContent = score;

    snake.addHead(head.x + inputDir.x, head.y + inputDir.y);

    food = {
      x: Math.floor(Math.random() * 16 + 1),
      y: Math.floor(Math.random() * 16 + 1)
    };

    if (speed < 25) {
      speed += 0.5;
    }
  } else {
    snake.addHead(head.x + inputDir.x, head.y + inputDir.y);
    snake.removeTail();
  }

  
  snakeArr = snake.toArray();
  const board = document.getElementById("board");
  board.innerHTML = "";
  snakeArr.forEach((e, index) => {
    let snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = e.y;
    snakeElement.style.gridColumnStart = e.x;
    snakeElement.classList.add(index === 0 ? "head" : "snake");
    board.appendChild(snakeElement);
  });

  // Draw food
  const foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");
  board.appendChild(foodElement);
}


// Local Storage
let hiscore = localStorage.getItem("hiscore");
let hiscoreval = hiscore ? JSON.parse(hiscore) : 0;
document.getElementById("hiscoreBox").textContent = hiscoreval;

function updateLeaderboard(newScore) {
    let board = JSON.parse(localStorage.getItem("leaderboard") || "[]");
    board.push(newScore);
    board.sort((a, b) => b - a);
    board = board.slice(0, 5);
    localStorage.setItem("leaderboard", JSON.stringify(board));
    renderLeaderboard();
}

function renderLeaderboard() {
    const board = JSON.parse(localStorage.getItem("leaderboard") || "[]");
    const container = document.getElementById("leaderboard");
    container.innerHTML = "";
    board.forEach(score => {
    const li = document.createElement("li");
    li.textContent = score + " pts";
    container.appendChild(li);
    });
}

renderLeaderboard();

// Controls
window.addEventListener("keydown", e => {
    moveSound.play();
    switch (e.key) {
    case "ArrowUp": inputDir = { x: 0, y: -1 }; break;
    case "ArrowDown": inputDir = { x: 0, y: 1 }; break;
    case "ArrowLeft": inputDir = { x: -1, y: 0 }; break;
    case "ArrowRight": inputDir = { x: 1, y: 0 }; break;
    }
});

function toggleMusic() {
    musicPlaying = !musicPlaying;
    const btn = document.getElementById("musicBtn");
    if (musicPlaying) {
    musicSound.play();
    btn.textContent = "🔈 Music: ON";
    } else {
    musicSound.pause();
    btn.textContent = "🔇 Music: OFF";
    }
}

function startGame() {
    if (!gameRunning) {
    gameRunning = true;
    if (musicPlaying) musicSound.play();
    window.requestAnimationFrame(main);
    }
}

function quitGame() {
    gameRunning = false;
    inputDir = { x: 0, y: 0 };
    musicSound.pause();
}

function clearStorage() {
    localStorage.clear();
    score = 0;
    hiscoreval = 0;
    document.getElementById("scoreBox").textContent = 0;
    document.getElementById("hiscoreBox").textContent = 0;
    renderLeaderboard();
    alert("Local storage cleared!");
}

// Difficulty setup
function setDifficulty(level) {
    const speedMap = {
    easy: 5,
    medium: 10,
    hard: 17
    };
    speed = speedMap[level];
    document.getElementById("difficultySelect").style.display = "none";
}
