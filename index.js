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
let speed = 10;
let score = 0;
let lastPaintTime = 0;
let snake = new LinkedList(13, 15);
let snakeArr = snake.toArray(); 
let food = { x: 6, y: 7 };
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) return;
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(arr) {
    for (let i = 1; i < arr.length; i++) {
        if (arr[i].x === arr[0].x && arr[i].y === arr[0].y) return true;
    }
    if (arr[0].x >= 18 || arr[0].x <= 0 || arr[0].y >= 18 || arr[0].y <= 0) return true;
    return false;
}

function gameEngine() {
    snakeArr = snake.toArray(); 

    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        inputDir = { x: 0, y: 0 };
        alert("Game Over. Press any key to play again!");
        snake = new LinkedList(13, 15);
        snakeArr = snake.toArray();
        musicSound.play();
        score = 0;
    }

    let head = snake.getHead();

    if (head.x === food.x && head.y === food.y) {
        foodSound.play();
        score++;
        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
        }
        scoreBox.innerHTML = "Score: " + score;

        snake.addHead(head.x + inputDir.x, head.y + inputDir.y); 
        food = {
            x: Math.round(2 + 14 * Math.random()),
            y: Math.round(2 + 14 * Math.random())
        };
    } else {
        snake.addHead(head.x + inputDir.x, head.y + inputDir.y);
        snake.removeTail();
    }

    snakeArr = snake.toArray(); 
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        snakeElement.classList.add(index === 0 ? 'head' : 'snake');
        board.appendChild(snakeElement);
    });

    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

musicSound.play();
let hiscore = localStorage.getItem("hiscore");
let hiscoreval = hiscore ? JSON.parse(hiscore) : 0;
if (!hiscore) localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
scoreBox.innerHTML = "Score: " + score;

window.requestAnimationFrame(main);
window.addEventListener('keydown', e => {
    moveSound.play();
    switch (e.key) {
        case "ArrowUp":
            inputDir = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            inputDir = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            inputDir = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            inputDir = { x: 1, y: 0 };
            break;
    }
});