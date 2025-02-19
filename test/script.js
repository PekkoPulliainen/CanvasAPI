let lastMouseX;
let lastMouseY;

window.onload = () => {
  let scoreCount = 0;
  let scoreLabel = document.getElementById("scoreLabel");
  scoreLabel.innerText = scoreCount;

  let canvas = document.getElementById("gameCanvas");
  let context = canvas.getContext("2d");


  // Esimerkki
  const ankkagif = new Image();
  ankkagif.src = "ankka.gif";
  const laukaus = new Audio("laukaus.mp3");
  laukaus.volume = 0.3;
  // 
  
  let duckX = 750;
  let duckY = 300;
  let duckWidth = 100;
  let duckHeight = 100;

  ankkagif.onload = function() {
    context.drawImage(ankkagif, duckX, duckY, duckWidth, duckHeight);
  };

  canvas.addEventListener("click", (event) => {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    console.log("Shot at: ", x, y);

    if (isDuckClicked(x, y, duckX, duckY, duckWidth, duckHeight)) {
      scoreCount += 100;
      scoreLabel.innerText = scoreCount;
      context.drawImage(ankkagif, duckX, duckY, duckWidth, duckHeight);
      laukaus.play();
    }
  });
};

function isDuckClicked(x, y, duckX, duckY, duckWidth, duckHeight) {
  return (
    x >= duckX &&
    x <= duckX + duckWidth &&
    y >= duckY &&
    y <= duckY + duckHeight
  );
}


