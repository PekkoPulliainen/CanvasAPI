let lastMouseX;
let lastMouseY;
let duckWidth = 200;
let duckHeight = 200;

let canvas = document.getElementById("gameCanvas");
let context = canvas.getContext("2d");

let duckes = [];

const laukaus = new Audio("./CANVASAPI_UI/laukaus.mp3");
laukaus.volume = 0.2;

window.onload = () => {
  let scoreCount = 0;
  let scoreLabel = document.getElementById("scoreLabel");
  scoreLabel.innerText = scoreCount;

  for (var i = 0; i < 4; i++) {
    var x = Math.random() * (canvas.width - duckWidth);  
    var y = Math.random() * (canvas.height - duckHeight);  
    var duck = new Duck(x, y, 2);  
    duckes.push(duck);
  }

  updateDuckes();
};

function isDuckClicked(x, y, duck) {
  return (
    x >= duck.x &&
    x <= duck.x + duckWidth &&
    y >= duck.y &&
    y <= duck.y + duckHeight
  );
}

class Duck {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.dx = Math.random() < 0.5 ? 1 : -1;
    this.dy = Math.random() < 0.5 ? 1 : -1;

    this.image = new Image();
    this.image.src = "./CANVASAPI_UI/ankka.gif"; 
    this.image.onload = () => {
      this.draw();
    };
  }

  draw() {
    context.beginPath();
    context.drawImage(this.image, this.x, this.y, duckWidth, duckHeight); 
    context.stroke();
    context.closePath();
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

    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;

    this.draw();
  }
}

let updateDuckes = function () {
  requestAnimationFrame(updateDuckes);
  context.clearRect(0, 0, canvas.width, canvas.height);  
  duckes.forEach((element) => {
    element.update();
  });
};

canvas.addEventListener("click", (event) => {
  let rect = canvas.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;

  console.log("Shot at: ", x, y);

  for (let i = 0; i < duckes.length; i++) {
    if (isDuckClicked(x, y, duckes[i])) {
      duckes.splice(i, 1); 

      let scoreCount = parseInt(document.getElementById("scoreLabel").innerText);
      scoreCount += 100;
      document.getElementById("scoreLabel").innerText = scoreCount;

      laukaus.currentTime = 0;
      laukaus.play();

      break;  
    }
  }
});

