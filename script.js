let lastMouseX;
let lastMouseY;
let duckWidth = 155;
let duckHeight = 140;
let scoreCount = 0;
let diagonal = false;
let horizontal = false;
let mirrored;

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
const spriteSheetMirrored = new Image();
spriteSheetMirrored.src = "./CANVASAPI_UI/sprites-remake-mirror.png";

canvas.style.backgroundColor = "rgb(88, 159, 241)";

const bulletAudio = new Audio("./CANVASAPI_UI/laukaus.mp3");
bulletAudio.volume = 0.05;

window.onload = () => {
  for (let i = 0; i < 4; i++) {
    let x = Math.random() * (canvas.width - duckWidth);
    let y = Math.random() * (canvas.height - duckHeight);
    let duck = new Duck(x, y, 2);
    ducks.push(duck);
  }
  animateFrame();
};

function isDuckClicked(x, y, duck) {
  bulletAudio.play();
  return (
    x >= duck.x &&
    x <= duck.x + duckWidth &&
    y >= duck.y &&
    y <= duck.y + duckHeight
  );
}

class Duck {
  constructor(x, y, speed) {
    this.spriteSheet = spriteSheet;
    this.spriteSheetMirrored = spriteSheetMirrored;
    this.spriteWidth = 40.5;
    this.spriteHeight = 35;

    this.x = x;
    this.y = y;
    this.speed = speed;
    this.dx = Math.random() < 0.5 ? 1 : -1;
    this.dy = (Math.random() - 0.5) * 0.2;
    this.frameIndex = 0;
    this.frameCount = 3;
    this.frameInterval = 40;
    this.frameCounter = 0;
    this.directionChangeCounter = 0;
    this.directionChangeInterval = 700;
    this.diagonalSpriteRow = 125;
    this.horizontalSpriteRow = 162;
    this.draw();
  }

  draw() {
    let spriteSheetX = this.frameIndex * this.spriteWidth;
    let spriteSheetY = 127;

    if (this.dx !== 0 && Math.abs(this.dy) > 0.1) {
      diagonal = true;
    } else {
      diagonal = false;
    }

    if (this.dx < 0) {
      context.translate(this.x + duckWidth, this.y);
      context.scale(-1, 1);
      context.drawImage(
        this.spriteSheet,
        spriteSheetX + 3,
        spriteSheetY,
        this.spriteWidth,
        this.spriteHeight,
        this.x,
        this.y,
        duckWidth,
        duckHeight
      );
      context.setTransform(1, 0, 0, 1, 0, 0);
    } else {
      if (diagonal === false) {
        context.drawImage(
          this.spriteSheet,
          spriteSheetX + 3,
          spriteSheetY,
          this.spriteWidth,
          this.spriteHeight,
          this.x,
          this.y,
          duckWidth,
          duckHeight
        );
      } else if (diagonal === true && this.frameIndex === 0) {
        context.drawImage(
          this.spriteSheet,
          spriteSheetX + 129,
          spriteSheetY,
          this.spriteWidth - 3,
          this.spriteHeight,
          this.x,
          this.y,
          duckWidth,
          duckHeight
        );
      } else if (diagonal === true && this.frameIndex === 1) {
        context.drawImage(
          this.spriteSheet,
          spriteSheetX + 125.8,
          spriteSheetY,
          this.spriteWidth - 3,
          this.spriteHeight,
          this.x,
          this.y,
          duckWidth,
          duckHeight
        );
      } else {
        context.drawImage(
          this.spriteSheet,
          spriteSheetX + 120.1,
          spriteSheetY + 2,
          this.spriteWidth - 3.8,
          this.spriteHeight,
          this.x,
          this.y,
          duckWidth,
          duckHeight
        );
      }
    }
  }

  update() {
    let hitWall = false;

    if (this.x < 0 || this.x + duckWidth > canvas.width) {
      this.dx *= -1;
      hitWall = true;
    }
    if (this.y < 0 || this.y + duckHeight > canvas.height) {
      this.dy *= -1;
      hitWall = true;
    }

    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;

    this.frameCounter++;
    if (this.frameCounter >= this.frameInterval) {
      this.frameCounter = 0;
      this.frameIndex = (this.frameIndex + 1) % this.frameCount;
    }

    this.directionChangeCounter++;
    if (
      this.directionChangeCounter >= this.directionChangeInterval ||
      hitWall
    ) {
      this.directionChangeCounter = 0;
      this.changeDirection();
    }
    this.draw();
  }

  changeDirection() {
    if (Math.random() < 0.67) {
      this.dx = Math.random() < 0.5 ? 1 : -1;
      this.dy = Math.random() < 0.5 ? 1 : -1;
    } else {
      this.dx = Math.random() < 0.5 ? 1 : -1;
      this.dy = (Math.random() - 0.5) * 0.2;
    }
  }
}

let animateFrame = function () {
  requestAnimationFrame(animateFrame);
  context.clearRect(0, 0, canvas.width, canvas.height);
  ducks.forEach((element) => {
    element.update();
    context.imageSmoothingEnabled = false;
  });
  context.drawImage(background, 0, 50, window.innerWidth, window.innerHeight);
  context.font = "50px Arial";
  context.fillStyle = "White";
  context.fillText(scoreCount, 2300, 150);
};

canvas.addEventListener("click", (event) => {
  let rect = canvas.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;

  console.log("Shot at: ", x, y);

  for (let i = 0; i < ducks.length; i++) {
    if (isDuckClicked(x, y, ducks[i])) {
      ducks.splice(i, 1);

      scoreCount += 100;
      bulletAudio.currentTime = 0;
      bulletAudio.play();

      break;
    }
  }
});
