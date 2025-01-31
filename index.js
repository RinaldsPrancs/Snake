function drawCells() {
  ctx.fillStyle = "#483b3b";
  let posX = 0;
  let posY = 0;
  for (let i = 0; i < cells; i++) {
    for (let j = 0; j < cells; j++) {
      ctx.fillRect(posX, posY, cellSize - 2, cellSize - 2);
      posX += cellSize;
    }
    posY += cellSize;
    posX = 0;
  }
}

class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  append(data) {
    const newNode = new Node(data);
    if (!this.head) {
      this.head = newNode;
    } else {
      let current = this.head;
      while (current.next !== null) {
        current = current.next;
      }
      current.next = newNode;
    }
  }

  prepend(data) {
    const newNode = new Node(data);
    newNode.next = this.head;
    this.head = newNode;
  }

  delete(data) {
    if (!this.head) {
      return;
    }
    if (this.head.data === data) {
      this.head = this.head.next;
      return;
    }
    let current = this.head;
    while (current.next !== null) {
      if (current.next.data === data) {
        current.next = current.next.next;
        return;
      }
      current = current.next;
    }
  }

  getTail() {
    let current = this.head;
    while (current.next !== null) {
      current = current.next;
    }
    return current.data;
  }

  getHead() {
    return this.head.data;
  }

  print() {
    let current = this.head;
    const elements = [];
    while (current !== null) {
      elements.push(current.data);
      current = current.next;
    }
    return elements;
  }

  print2() {
    let current = this.head;
    const elements = [];
    while (current !== null) {
      elements.push([
        Math.floor(current.data[0] / cellSize),
        Math.floor(current.data[1] / cellSize),
      ]);
      current = current.next;
    }
    return elements;
  }
}

const cells = 17;
const cellSize = canvas.width / cells; // bcs its a square

function drawApple(x, y) {
  ctx.fillStyle = "#ff0000";
  ctx.fillRect(x * cellSize + 1, y * cellSize + 1, cellSize - 4, cellSize - 4);
}

function moveSnake(direction) {
  ctx.fillStyle = "#00ff00";
  let head = snake.getHead();
  switch (direction) {
    case "a":
      snake.prepend([head[0] - cellSize, head[1]]);
      break;
    case "s":
      snake.prepend([head[0], head[1] + cellSize]);
      break;
    case "w":
      snake.prepend([head[0], head[1] - cellSize]);
      break;
    case "d":
      snake.prepend([head[0] + cellSize, head[1]]);
      break;
    default:
      break;
  }

  head = snake.getHead();

  ctx.fillRect(head[0] + 1, head[1] + 1, cellSize - 4, cellSize - 4);
  let tail = snake.getTail();
  ctx.fillStyle = "#483b3b";
  ctx.fillRect(tail[0], tail[1], cellSize - 2, cellSize - 2);
  snake.delete(tail);
}

function drawSnake() {
  let arr = snake.print();
  let posX, posY;
  for (let i = 0; i < arr.length; i++) {
    posX = arr[i][0];
    posY = arr[i][1];

    ctx.fillStyle = "#00ff00";
    ctx.fillRect(posX + 1, posY + 1, cellSize - 4, cellSize - 4);
  }
}

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false,
  w: false,
  s: false,
  a: false,
  d: false,
};

let madeMove;
document.addEventListener("keydown", function (event) {
  if (event.key in keys) {
    keys[event.key] = true;
    if ((keys.a && direction != "d") || (keys.ArrowLeft && direction != "d")) {
      if (madeMove) {
        direction = "a";
        madeMove = false;
      }
    } else if (
      (keys.s && direction != "w") ||
      (keys.ArrowDown && direction != "w")
    ) {
      if (madeMove) {
        direction = "s";
        madeMove = false;
      }
    } else if (
      (keys.w && direction != "s") ||
      (keys.ArrowUp && direction != "s")
    ) {
      if (madeMove) {
        direction = "w";
        madeMove = false;
      }
    } else if (
      (keys.d && direction != "a") ||
      (keys.ArrowRight && direction != "a")
    ) {
      if (madeMove) {
        direction = "d";
        madeMove = false;
      }
    }
  }
});

document.addEventListener("keyup", function (event) {
  if (event.key in keys) {
    keys[event.key] = false;
  }
});

const ctx = canvas.getContext("2d");
const snake = new LinkedList();
snake.append([2 * cellSize, 8 * cellSize]);
snake.append([1 * cellSize, 8 * cellSize]);
snake.append([0 * cellSize, 8 * cellSize]);

function generateAppleCoords(bigArr) {
  let coords = [
    Math.floor(Math.random() * cells),
    Math.floor(Math.random() * cells),
  ];
  let exists = bigArr.some(
    (subArray) =>
      subArray.length === coords.length &&
      subArray.every((val, index) => val === coords[index])
  );

  if (exists) {
    return generateAppleCoords(bigArr);
  }

  return coords;
}
drawCells();
let apple = { x: 0, y: 0 };
drawApple(apple.x, apple.y);
drawSnake();
let direction = "d";
let head;
let grow = false;
let tail;

function selfEat() {
  head = snake.getHead();
  const arr = snake.print();
  for (let i = 1; i < arr.length; i++) {
    if (
      Math.round(arr[i][0]) == Math.round(head[0]) &&
      Math.round(arr[i][1]) == Math.round(head[1])
    ) {
      return true;
    }
  }
  return false;
}

let score = 0;
const scoreText = document.getElementById("score");
scoreText.textContent = score;

function gameLoop() {
  moveSnake(direction);

  if (
    selfEat() ||
    snake.getHead()[0] > cells * cellSize ||
    snake.getHead()[1] > cells * cellSize ||
    snake.getHead()[0] < -1 ||
    snake.getHead()[1] < -1
  ) {
    console.log(snake.getHead()[0]);
    console.log(snake.getHead()[1]);
    clearInterval(gameInterval);
    const heading = document.getElementById("hiddenHeading");
    heading.style.display = "block";
    const heading2 = document.getElementById("hiddenHeading2");
    heading2.style.display = "block";
    return 1;
  }
  if (grow) {
    snake.append(tail[0], tail[1]);
    grow = false;
  }
  head = snake.getHead();
  if (
    Math.round(head[0]) == Math.round(apple.x * cellSize) &&
    Math.round(head[1]) == Math.round(apple.y * cellSize)
  ) {
    grow = true;
    tail = snake.getTail();
    let bigArr = snake.print2();
    appCoords = generateAppleCoords(bigArr);
    apple.x = appCoords[0];
    apple.y = appCoords[1];
    score += 1;
    scoreText.textContent = score;
    drawApple(apple.x, apple.y);
  }
  madeMove = true;
}

let gameInterval = setInterval(gameLoop, 250);
gameLoop();
