let lastMouseX;
let lastMouseY;

window.onload = () => {
  let scoreCount = 0;
  let scoreLabel = document.getElementById("scoreLabel");
  scoreLabel.innerText = scoreCount;

  let canvas = document.getElementById("gameCanvas");
  let context = canvas.getContext("2d");

  canvas.addEventListener("click", (event) => {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    console.log("Shot at: ", x, y);

    if (isDuckClicked(x, y)) {
      scoreCount += 100;
      scoreLabel.innerText = scoreCount;
    }
  });
};

function isDuckClicked(x, y) {
  let duckX = 100;
  let duckY = 100;
  let duckWidth = 50;
  let duckHeight = 50;

  return (
    x >= duckX &&
    x <= duckX + duckWidth &&
    y >= duckY &&
    y <= duckY + duckHeight
  );
}
