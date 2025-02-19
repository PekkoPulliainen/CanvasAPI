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

let gameStarted = false;

window.onload = () => {
  let scoreCount = 0;

  let duckX = 750;
  let duckY = 300;
  let duckWidth = 100;
  let duckHeight = 100;

  let duckClick = false;

  // Start Game -nappulan klikkaus
  document.getElementById("startGameButton").addEventListener("click", () => {
    gameStarted = true;
    document.getElementById("startGameDiv").style.display = "none";
  })

  // Start Game -nappulan klikkaus
  document.getElementById("restartButton").addEventListener("click", () => {
    gameStarted = true;
    document.getElementById("restartDiv").style.display = "none";
  })

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
    let x = Math.round(Math.random() * (canvas.width - duckWidth));
    let y = Math.round(Math.random() * (canvas.height - duckHeight));
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
    if (this.x + duckWidth > canvas.width) {
      this.dx = -1;
    }

    if (this.y < 0) {
      this.dy = 1;
    }
    if (this.y + duckHeight > canvas.height) {
      this.dy = -1;
    }
// change direction randomly



this.x += this.dx * this.speed;
this.y += this.dy * this.speed;

this.frameCounter++;
if (this.frameCounter >= this.frameInterval) {
      if (Math.random() > 0.9) this.dx *= -1
      if (Math.random() > 0.9) this.dy *= -1
      this.frameCounter = 0;
      this.frameIndex = (this.frameIndex + 1) % this.frameCount;
    }
    this.draw();
  }
}

let animateFrame = function () {
  requestAnimationFrame(animateFrame);
  context.clearRect(0, 0, canvas.width, canvas.height);
  ducks.forEach((element) => {
    element.update();
  });
  context.drawImage(background, 0, 50, window.innerWidth, window.innerHeight);
};

canvas.addEventListener("click", (event) => {
  let rect = canvas.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;

  console.log("Shot at: ", x, y);

   
  for (let i = 0; i < ducks.length; i++) {
    if (isDuckClicked(x, y, ducks[i])) {
      ducks.splice(i, 1);

      let scoreCount = parseInt(
        document.getElementById("scoreLabel").innerText
      );
      scoreCount += 100;
      document.getElementById("scoreLabel").innerText = scoreCount;

      break;
    }
  }
});
