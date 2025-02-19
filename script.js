let lastMouseX;
let lastMouseY;
let duckWidth = 120;
let duckHeight = 110;

let canvas = document.getElementById("gameCanvas");
let context = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let sheetWidth = 644;
let sheetHeight = 294;

let ducks = [];
const background = new Image();
background.src = "./CANVASAPI_UI/background-update.png";

const spriteSheet = new Image();
spriteSheet.src = "./CANVASAPI_UI/sprites-remake.png";

canvas.style.backgroundColor = "rgb(88, 159, 241)";

const bulletAudio = new Audio("./CANVASAPI_UI/laukaus.mp3");
bulletAudio.volume = 0.05;

window.onload = () => {
  let scoreCount = 0;

  let duckX = 750;
  let duckY = 300;
  let duckWidth = 100;
  let duckHeight = 100;

  let duckClick = false;

  canvas.addEventListener("click", (event) => {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    console.log("Shot at: ", x, y);

    if (
      !duckClick &&
      isDuckClicked(x, y, duckX, duckY, duckWidth, duckHeight)
    ) {
      scoreCount += 100;
      context.clearRect(duckX, duckY, duckWidth, duckHeight);
      duckClick = true;
      bulletAudio.currentTime = 0;
      bulletAudio.play();
    }
  });
  for (let i = 0; i < 4; i++) {
    let x = Math.random() * window.innerWidth;
    let y = Math.random() * window.innerHeight;
    let duck = new Duck(x, y, 1);
    ducks.push(duck);
  }
  animateFrame();
};

function isDuckClicked(x, y, duckX, duckY, duckWidth, duckHeight) {
  bulletAudio.play();
  return (
    x >= duckX &&
    x <= duckX + duckWidth &&
    y >= duckY &&
    y <= duckY + duckHeight
  );
}

class Duck {
  constructor(x, y, speed) {
    this.spriteSheet = spriteSheet;
    this.spriteWidth = 40.5;
    this.spriteHeight = 35;

    this.x = x;
    this.y = y;
    this.speed = speed;
    this.dx = Math.random() < 0.5 ? 1 : -1;
    this.dy = Math.random() < 0.5 ? 1 : -1;
    this.frameIndex = 0;
    this.frameCount = 3;
    this.frameInterval = 20;
    this.frameCounter = 0;
    this.draw();
  }

  draw() {
    context.drawImage(
      this.spriteSheet,
      this.frameIndex * this.spriteWidth + 3,
      127,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      duckWidth,
      duckHeight
    );
  }

  update() {
    if (this.x < 0) {
      this.dx = 1;
    }
    if (this.x + duckWidth > window.innerWidth) {
      this.dx = -1;
    }

    if (this.y < 0) {
      this.dy = 1;
    }
    if (this.y + duckHeight > window.innerHeight) {
      this.dy = -1;
    }

    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;

    this.frameCounter++;
    if (this.frameCounter >= this.frameInterval) {
      this.frameCounter = 0;
      this.frameIndex = (this.frameIndex + 1) % this.frameCount;
    }
    this.draw();
  }
}

let animateFrame = function () {
  requestAnimationFrame(animateFrame);
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ducks.forEach((element) => {
    element.update();
  });
  context.drawImage(background, 0, 50, window.innerWidth, window.innerHeight);
};
