import { Duck } from "./ducks.js";
import { Dog } from "./dog.js";
import { DUCK_WIDTH, DUCK_HEIGHT, leaderboardKey } from "./constants.js";

export let lastMouseX;
export let lastMouseY;
export let scoreCount = 0;
export let mirrored;
export let duckCount = 2;
export let ducksAlive = 0;
export let color = 0;
export let hasShot = false;
export let isPaused = false;
export let gameStarted = false;
export let levelStarted = false;

export let canvas = document.getElementById("gameCanvas");
export let context = canvas.getContext("2d");

let SHOT_COOLDOWN_INTERVAL = 100;
let SHOT_COOLDOWN_COUNTER = 0;
let DUCK_SPAWN_INTERVAL = 100;
let DUCK_SPAWN_COUNTER = 0;
let FLASH_DURATION = 10;

let animationStartInterval = 100;
let animationStartCounter = 0;

let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;

let gameOver = false;

//let playerName = document.getElementById("playerName")

function resizeCanvas() {
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  canvas.width = canvasWidth * window.devicePixelRatio;
  canvas.height = canvasHeight * window.devicePixelRatio;
  context.scale(window.devicePixelRatio, window.devicePixelRatio);
}

function getLeaderboard() {
  return JSON.parse(localStorage.getItem(leaderboardKey)) || [];
}

function updateLeaderboard(playerName, score) {
  let leaderboard = getLeaderboard();
  leaderboard.push({ name: playerName, score: score });
  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard = leaderboard.slice(0, 5); // Keep top 5 scores
  localStorage.setItem(leaderboardKey, JSON.stringify(leaderboard));
  renderLeaderboard();
}

function renderLeaderboard() {
  const leaderboard = getLeaderboard();
  const container = document.getElementById("leaderboardContainer");

  if (!container) {
    console.error("Leaderboard container not found!");
    return; // Prevent the error
  }

  container.innerHTML = "<h3>Top 5 Players</h3>";
  leaderboard.forEach((entry, index) => {
    const row = document.createElement("div");
    row.classList.add("leaderboard-row");
    row.innerHTML = `<span class='rank'>${index + 1}.</span> 
                       <span class='name'>${entry.name}</span> 
                       <span class='score'>${entry.score}</span>`;
    container.appendChild(row);
  });
}

function handleGameOver() {
  document.getElementById("finalScore").textContent = scoreCount;
  document.getElementById("gameOverDiv").style.display = "block";
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

const quack1 = new Audio("./CANVASAPI_UI/Quack2.m4a");
const quack2 = new Audio("./CANVASAPI_UI/Quack4000.m4a");
const quack3 = new Audio("./CANVASAPI_UI/Quack3.m4a");

const quackSounds = [quack1, quack2, quack3];

let bullets = 0;
let bulletText = "Amount of bullets: " + bullets;

let reloadText = "reloading...";

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

window.onload = () => {
  resizeCanvas();
  //document.getElementById("gameOverDiv").style.display = "block";

  renderLeaderboard();

  // Start Game -nappulan klikkaus
  document.getElementById("startGameButton").addEventListener("click", () => {
    canvas.style.cursor = "none";
    levelStarted = true;
    document.getElementById("startGameDiv").style.display = "none";
    dog.startWalking();
  });

  // Restart -nappulan klikkaus
  document.getElementById("restartButton").addEventListener("click", () => {
    const playerName =
      document.getElementById("playerNameInput").value.trim() || "Anonymous";
    updateLeaderboard(playerName, scoreCount);
    window.location.reload();
  });

  context.drawImage(background, 0, 0, window.innerWidth, window.innerHeight);
  context.drawImage(background2, 0, 0, window.innerWidth, window.innerHeight);

  dog = new Dog(100, canvasHeight * 0.71, 2, spriteSheet);

  animateFrame();
};

export function startGame() {
  levelStarted = false;
  gameStarted = true;
  startDuckSpawnCounter();
}

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
    if (SHOT_COOLDOWN_COUNTER === 20) {
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
  resizeCanvas();

  duckCount += 3;
  bullets = Math.round(duckCount / 1.5) + 3;
  if (duckCount > 20) {
    bullets = Math.round(bullets / 1.3);
  }
  bulletText = "Amount of bullets: " + bullets;

  for (let i = 0; i < duckCount; i++) {
    let x = canvasWidth / 2 - DUCK_WIDTH / 2;
    let y = canvasHeight - DUCK_HEIGHT - canvasHeight * 0.15;
    let duck = new Duck(x, y, color, 1);
    color += 1;
    if (i % 3 == 0) {
      color = 0;
    }
    ducksAlive = duckCount;
    ducks.push(duck);
  }
}

function playRandomQuack() {
  if (isPaused) return;
  if (gameOver) return;

  let randomValue = Math.random() * 100;
  let selectedQuack;

  if (randomValue < 1) {
    selectedQuack = quack3;
  } else if (randomValue < 50) {
    selectedQuack = quack2;
  } else {
    selectedQuack = quack1;
  }
  if (ducksAlive > 0) selectedQuack.play();
}

setInterval(playRandomQuack, 2000);

let animateFrame = function () {
  if (isPaused) return;

  requestAnimationFrame(animateFrame);
  context.imageSmoothingEnabled = false;
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  context.globalCompositeOperation = "source-over";

  context.drawImage(background2, 0, 0, canvasWidth, canvasHeight);
  if (ducksAlive > 0) {
    ducks.forEach((element) => {
      element.update();
    });
  }
  deadDucks.forEach((element) => {
    element.updateDeads();
  });

  if (gameStarted) {
    dog.updateshowdog();
    dog.updateLaugh();
  }

  context.drawImage(background, 0, 110, canvasWidth, canvasHeight);
  context.font = "2.375rem Arial"; /* 38px */
  context.fillStyle = "White";
  context.textAlign = "right";
  context.fillText(
    "Score: " + scoreCount,
    canvasWidth * 0.8,
    canvasHeight * 0.06
  );
  context.fillText(bulletText, canvasWidth * 0.22, canvasHeight * 0.06);
  if (SHOT_COOLDOWN_COUNTER > 0)
    context.fillText(reloadText, canvasWidth * 0.5, canvasHeight * 0.06);

  for (let i = 1; i <= bullets; i++) {
    context.drawImage(
      bulletImage,
      canvasWidth * 0.2 + 50 + 10 * i,
      canvasHeight * 0.03
    );
  }

  if (levelStarted || !gameStarted) dog.updateWalking();
  if (!gameStarted && !levelStarted) {
    dog.update();
  }
  if (dog.bushReached === true) dog.drawBush();

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

  if (bullets <= 0) {
    return;
  }

  let rect = canvas.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;
  let doubleKill = false;
  let twoWithOne = 0;

  console.log("Shot at: ", x, y);
  let newBullet = Math.round(Math.random() * 10);
  console.log("new bullet? " + newBullet);
  if (newBullet === 1) {
    let bullets2 = bullets - 1;
    bulletText = "Amount of bullets: " + bullets2 + " + 1";
  } else {
    bullets -= 1;
    bulletText = "Amount of bullets: " + bullets;
  }

  console.log(bullets);
  hasShot = true;

  startShotCooldownCounter();
  let duckshuted = false;
  for (let i = ducks.length - 1; i >= 0; i--) {
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
      scoreCount += 300;
    }
  }

  if (bullets === 0 && ducksAlive > 0) {
    gameOver = true;
    handleGameOver();
    //document.getElementById("finalScore").textContent = scoreCount;
    //document.getElementById("gameOverDiv").style.display = "block";
    //document.getElementById("restartButton").onclick = function () {
    //window.location.reload();
    //};
  }

  if (ducksAlive === 0) {
    startDuckSpawnCounter();
    bulletText = "Amount of bullets: " + bullets;
  }

  if (
    !duckshuted &&
    dog.showdog === "none" &&
    !dog.isLaughing &&
    !dog.captured &&
    !dog.captured2
  ) {
    // Reset previous states
    dog.captured = false;
    dog.captured2 = false;
    dog.isLaughing = false;

    dog.showdog = "plus";

    // Make sure Y is set correctly ONCE
    if (dog.y === undefined || dog.y !== canvas.height * 0.9) {
      dog.y = canvas.height * 0.9;
    }

    dog.x = x;
    dog.frameIndex = 0;
    dog.frameCounter = 0;

    dog.triggerLaugh();
  }

  if (
    duckshuted &&
    dog.showdog === "none" &&
    !dog.isLaughing &&
    !dog.captured &&
    !dog.captured2
  ) {
    while (animationStartCounter < animationStartInterval)
      animationStartCounter++;
    if (animationStartCounter >= animationStartInterval) {
      // Reset previous states
      dog.isLaughing = false;

      dog.showdog = "plus";
      if (!doubleKill) {
        dog.captured = true;
      } else {
        dog.captured2 = true;
      }

      // Ensure Y stays correct
      if (dog.y === undefined || dog.y !== canvas.height * 0.9) {
        dog.y = canvas.height * 0.9;
      }

      dog.x = x;
      dog.frameIndex = 0;
      dog.frameCounter = 0;
    }
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

document.addEventListener("keydown", function (event) {
  if (
    (event.ctrlKey || event.metaKey) &&
    (event.key === "+" || event.key === "-" || event.key === "0")
  ) {
    event.preventDefault();
  }
});
