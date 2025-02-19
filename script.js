let lastMouseX;
let lastMouseY;
let duckWidth = 250;
let duckHeight = 250;

let canvas = document.getElementById("gameCanvas");
let context = canvas.getContext("2d");

let duckes = [];

const laukaus = new Audio("./CANVASAPI_UI/laukaus.mp3");
laukaus.volume = 0.3;

window.onload = () => {
  let scoreCount = 0;
  let scoreLabel = document.getElementById("scoreLabel");
  scoreLabel.innerText = scoreCount;

  // Esimerkki
  const ankkagif = new Image();
  ankkagif.src = "./CANVASAPI_UI/ankka.gif";
  //

  let duckX = 750;
  let duckY = 300;
  let duckWidth = 100;
  let duckHeight = 100;

  let duckClick = false;

  ankkagif.onload = function () {
    if (!duckClick)
      context.drawImage(ankkagif, duckX, duckY, duckWidth, duckHeight);
  };

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
      scoreLabel.innerText = scoreCount;
      context.clearRect(duckX, duckY, duckWidth, duckHeight);
      duckClick = true;
      laukaus.currentTime = 0;
      laukaus.play();
    }
  });
  for (var i = 0; i < 4; i++) {
    var x = Math.random() * window.innerWidth;
    var y = Math.random() * window.innerHeight;
    var duck = new Duck(x, y, 1);
    duckes.push(duck);
  }
  updateDuckes();
};

function isDuckClicked(x, y, duckX, duckY, duckWidth, duckHeight) {
  laukaus.play();
  return (
    x >= duckX &&
    x <= duckX + duckWidth &&
    y >= duckY &&
    y <= duckY + duckHeight
  );
}

class Duck {
  constructor(x, y, speed) {
    this.image = new Image();
    this.image.src = "./CANVASAPI_UI/ankka.gif";

    this.x = x;
    this.y = y;
    this.speed = speed;
    this.dx = Math.random() < 0.5 ? 1 : -1;
    this.dy = Math.random() < 0.5 ? 1 : -1;
    this.draw();
  }
  draw() {
    context.beginPath();

    context.drawImage(this.image, this.x, this.y);
    context.stroke();
    context.closePath();
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
    // console.log(this.y, this.x);
    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;

    this.draw();
  }
}

let updateDuckes = function () {
  requestAnimationFrame(updateDuckes);
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  duckes.forEach((element) => {
    element.update();
  });
};
