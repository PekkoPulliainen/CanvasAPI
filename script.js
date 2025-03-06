import { Duck } from "./ducks.js";
import { Dog } from "./dog.js";
import { DUCK_WIDTH, DUCK_HEIGHT } from "./constants.js";

export let lastMouseX;
export let lastMouseY;
export let scoreCount = 0;
export let mirrored;
export let duckCount = 2;
export let ducksAlive = 0;
export let color = 0;
export let hasShot = false;
export let isPaused = false;

export let canvas = document.getElementById("gameCanvas");
export let context = canvas.getContext("2d");

let SHOT_COOLDOWN_INTERVAL = 100;
let SHOT_COOLDOWN_COUNTER = 0;
let DUCK_SPAWN_INTERVAL = 100;
let DUCK_SPAWN_COUNTER = 0;
let FLASH_DURATION = 10;

let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;

function resizeCanvas() {
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  canvas.width = canvasWidth * window.devicePixelRatio;
  canvas.height = canvasHeight * window.devicePixelRatio;
  context.scale(window.devicePixelRatio, window.devicePixelRatio);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

export const ducks = [];
export const deadDucks = [];

export let dog;

const Score = document.getElementById("Score");

export const dogIdle = new Image();
dogIdle.src = "./CANVASAPI_UI/dogidle.png";

const bulletImage = new Image();
bulletImage.src = "./CANVASAPI_UI/bullet.png";

let bullets = 10;
let bulletText = "Amount of bullets " + 10;

const background2 = new Image();
background2.src = "./CANVASAPI_UI/background-new-3.png";

const background = new Image();
background.src = "./CANVASAPI_UI/background-new-2-6.png";

export const spriteSheet = new Image();
spriteSheet.src = "./CANVASAPI_UI/sprites-remake.png";
const spriteSheetMirrored = new Image();
spriteSheetMirrored.src = "./CANVASAPI_UI/sprites-remake-mirrored.png";

const target = {
  spriteTargetImage: new Image(),
  spriteTargetImageRed: new Image(),
};
target.spriteTargetImage.src = "./CANVASAPI_UI/target.png";
target.spriteTargetImageRed.src = "./CANVASAPI_UI/targetRed.png";

canvas.style.backgroundColor = "rgb(51, 117, 192)";

const bulletAudio = new Audio("./CANVASAPI_UI/laukaus.mp3");
bulletAudio.volume = 0.05;

let gameStarted = false;

window.onload = () => {
  resizeCanvas();

  // Start Game -nappulan klikkaus
  document.getElementById("startGameButton").addEventListener("click", () => {
    canvas.style.cursor = "none";

    gameStarted = true;
    document.getElementById("startGameDiv").style.display = "none";
    startDuckSpawnCounter();
  });

  // Restart -nappulan klikkaus
  document.getElementById("restartButton").addEventListener("click", () => {
    gameStarted = true;
    document.getElementById("gameOverDiv").style.display = "none";
    startDuckSpawnCounter();
  });

  context.drawImage(background, 0, 0, window.innerWidth, window.innerHeight);
  context.drawImage(background2, 0, 0, window.innerWidth, window.innerHeight);

  dog = new Dog(100, canvasHeight * 0.71, 2, spriteSheet);

  animateFrame();
};

function isDuckClicked(x, y, duck) {
  bulletAudio.play();
  return (
    x >= duck.x &&
    x <= duck.x + DUCK_WIDTH &&
    y >= duck.y &&
    y <= duck.y + DUCK_HEIGHT
  );
}

function startShotCooldownCounter() {
  console.log("reloading...");
  SHOT_COOLDOWN_INTERVAL = setInterval(() => {
    if (isPaused) return;
    SHOT_COOLDOWN_COUNTER++;
    if (SHOT_COOLDOWN_COUNTER === 25) {
      hasShot = false;
      clearInterval(SHOT_COOLDOWN_INTERVAL);
      SHOT_COOLDOWN_COUNTER = 0;
    }
  }, 100);
}

function startDuckSpawnCounter() {
  console.log("next round in 3.5 seconds...");
  DUCK_SPAWN_INTERVAL = setInterval(() => {
    if (isPaused) return;
    DUCK_SPAWN_COUNTER++;
    if (DUCK_SPAWN_COUNTER >= 35) {
      clearInterval(DUCK_SPAWN_INTERVAL);
      DUCK_SPAWN_COUNTER = 0;
      duckSpawn();
    }
  }, 100);
}

function duckSpawn() {
  duckCount += 200; // Increase duck count by 5 for each round
  for (let i = 0; i < duckCount; i++) {
    let x = canvasWidth / 2 - DUCK_WIDTH / 2;
    let y = canvasHeight - DUCK_HEIGHT - 150;
    let duck = new Duck(x, y, color, 1);
    color += 1;
    if (i % 3 == 0) {
      color = 0;
    }
    ducksAlive = duckCount;
    ducks.push(duck);
  }
}

let animateFrame = function () {
  if (isPaused) return;

  requestAnimationFrame(animateFrame);
  context.imageSmoothingEnabled = false;
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  context.drawImage(background2, 0, 0, window.innerWidth, window.innerHeight);
  if (ducksAlive > 0) {
    ducks.forEach((element) => {
      element.update();
    });
  }
  deadDucks.forEach((element) => {
    element.updateDeads();
  });

  context.drawImage(background, 0, 110, window.innerWidth, window.innerHeight);
  context.font = "38px Arial";
  context.fillStyle = "White";
  context.textAlign = "right";
  context.fillText(scoreCount, canvasWidth - 20, 40);
  context.fillText(bulletText, canvasWidth * 0.2, canvasHeight * 0.05);

  for (let i = 1; i <= bullets; i++) {
    context.drawImage(
      bulletImage,
      canvasWidth * 0.2 + 50 + 10 * i,
      canvasHeight * 0.03
    );
  }

  if (!gameStarted) {
    dog.update();
  } else {
    dog.updateIdle();
    dog.updateshowdog();
  }
  let targetedDucks = [];
  if (gameStarted) {
    targetedDucks = ducks.filter(
      (Duck) =>
        target.x + 123 >= Duck.x &&
        target.x + 123 <= Duck.x + DUCK_WIDTH &&
        target.y + 123 >= Duck.y &&
        target.y + 123 <= Duck.y + DUCK_HEIGHT
    );
  }

  if (targetedDucks.length > 0) {
    context.drawImage(target.spriteTargetImageRed, target.x, target.y, 90, 90);
  } else {
    context.drawImage(target.spriteTargetImage, target.x, target.y, 90, 90);
  }

  if (bullets > 0) {
    if (hasShot && SHOT_COOLDOWN_COUNTER === 0) {
      if (FLASH_DURATION > 0) {
        context.fillStyle = "rgba(255, 255, 255," + FLASH_DURATION / 10 + ")";
        context.fillRect(0, 0, canvasWidth, canvasHeight);
        FLASH_DURATION--;
      } else {
        FLASH_DURATION = 10;
      }
    }
  }
};
canvas.addEventListener("mousemove", (event) => {
  if (isPaused) return;
  if (!gameStarted) return;

  let rect = canvas.getBoundingClientRect();
  target.x = (event.clientX - rect.left) * (canvas.width / rect.width) - 45;
  target.y = (event.clientY - rect.top) * (canvas.height / rect.height) - 45;
});

canvas.addEventListener("click", (event) => {
  if (isPaused) return;
  if (!gameStarted) return;
  if (ducksAlive === 0) return;
  if (hasShot) return;
  if (bullets === 0) return;
  let rect = canvas.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;
  let doubleKill = false;
  let twoWithOne = 0;

  console.log("Shot at: ", x, y);
  bullets -= 1;
  bulletText = "Amount of bullets " + bullets;

  console.log(bullets);
  hasShot = true;

  startShotCooldownCounter();
  var duckshuted = false;
  for (let i = ducks.length - 1; i >= 0; i--) {
    // loop backwards to avoid skipping ducks
    if (isDuckClicked(x, y, ducks[i])) {
      twoWithOne += 1;
      duckshuted = true;
      ducks[i].frameCounter = 0;
      ducks[i].frameIndex = 0;
      console.log(ducks[i]);
      deadDucks.push(ducks[i]);
      ducks.splice(i, 1);
      scoreCount += 100;
      bulletAudio.currentTime = 0;
      bulletAudio.play();
      ducksAlive -= 1;
    }
    if (twoWithOne > 1) {
      doubleKill = true;
    }
  }

  if (ducksAlive === 0) {
    startDuckSpawnCounter();
    bullets = 10;
    bulletText = "Amount of bullets " + bullets;
  }

  if (!duckshuted && dog.showdog === "none") {
    dog.showdog = "plus";
    dog.y = canvas.height * 0.71 + 60;
    dog.x = x;
    dog.frameIndex = 0;
    dog.frameCounter = 0;
  }
  if (duckshuted && dog.showdog === "none") {
    dog.showdog = "plus";
    if (!doubleKill) dog.captured = true;
    else dog.captured2 = true;
    dog.y = canvas.height * 0.71 + 60;
    dog.x = x;
    dog.frameIndex = 0;
    dog.frameCounter = 0;
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "p" || event.key === "P") {
    if (isPaused) {
      isPaused = false;
      animateFrame();
    } else {
      isPaused = true;
    }
    console.log("pause status: " + isPaused);
  }
});
