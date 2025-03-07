import {
  context,
  ducksAlive,
  deadDucks,
  spriteSheet,
  canvas,
} from "./script.js";

import { DUCK_WIDTH, DUCK_HEIGHT } from "./constants.js";

export class Duck {
  constructor(x, y, count, speed) {
    // Initializes the Duck class with the x-coordinate, y-coordinate, count, and speed parameters.
    this.spriteSheet = spriteSheet; // Initializes the sprite sheet for the duck.
    this.spriteWidth = 40; // Sets the width of the duck's sprite.
    this.spriteHeight = 40; // Sets the height of the duck's sprite.
    this.spriteSheetY = 146 + count * this.spriteHeight; // Sets the y-coordinate of the duck's sprite sheet.
    this.x = x; // Initializes the x-coordinate of the duck.
    this.y = y; // Initializes the y coordinate of the duck.
    this.speed = speed + 5; // Initializes the speed of the duck.
    this.diagonal = true; // Initializes the diagonal property to true, indicating the duck is moving diagonally.
    this.duckTargetX = this.getRandomTargetX(); // Sets a random target x-coordinate for the duck to move towards.
    this.duckTargetY = this.getRandomTargetY(); // Sets a random target y-coordinate for the duck to move towards.
    console.log("speed: " + this.speed); // Logs the speed of the duck to the console for debugging purposes.
    this.frameCount = 3; // Sets the number of frames for the duck's animation.
    this.frameInterval = 8; // Sets the interval between frames for the duck's animation.
    this.frameCounter = 0; // Initializes the frame counter to 0.
    this.deadDelayCounter = 0; // Initializes the dead delay counter to 0.
    this.frameIndex = Math.floor(Math.random() * 4); // Randomly selects a starting frame index for the duck's animation.

    this.draw(); 
  }

  getRandomTargetX() {
    let targetX;
    do {
      targetX = Math.random() * (canvas.width - DUCK_WIDTH);
    } while (Math.abs(targetX - this.x) < DUCK_WIDTH * 2);
    return targetX;
  }

  getRandomTargetY() {
    let targetY;
    do {
      targetY = Math.random() * (canvas.height - DUCK_HEIGHT - 100);
    } while (Math.abs(targetY - this.y) < DUCK_HEIGHT * 2);
    return targetY;
  }

  draw() {
    let spriteSheetX = this.frameIndex * this.spriteWidth;
    let spriteSheetY = this.spriteSheetY;

    if (this.x > this.duckTargetX) {
      if (!this.diagonal) {
        context.translate(this.x + DUCK_WIDTH, this.y);
        context.scale(-1, 1);
        context.drawImage(
          this.spriteSheet,
          spriteSheetX,
          spriteSheetY,
          this.spriteWidth,
          this.spriteHeight,
          0,
          0,
          DUCK_WIDTH,
          DUCK_HEIGHT
        );
      } else {
        context.translate(this.x + DUCK_WIDTH, this.y);
        context.scale(-1, 1);
        context.drawImage(
          this.spriteSheet,
          this.spriteWidth * 3 + spriteSheetX,
          spriteSheetY,
          this.spriteWidth,
          this.spriteHeight,
          0,
          0,
          DUCK_WIDTH,
          DUCK_HEIGHT
        );
        context.restore();
      }
      context.setTransform(1, 0, 0, 1, 0, 0);
    } else {
      if (!this.diagonal) {
        context.drawImage(
          this.spriteSheet,
          spriteSheetX,
          spriteSheetY,
          this.spriteWidth,
          this.spriteHeight,
          this.x,
          this.y,
          DUCK_WIDTH,
          DUCK_HEIGHT
        );
      } else {
        context.drawImage(
          this.spriteSheet,
          this.spriteWidth * 3 + spriteSheetX,
          spriteSheetY,
          this.spriteWidth,
          this.spriteHeight,
          this.x,
          this.y,
          DUCK_WIDTH,
          DUCK_HEIGHT
        );
      }
    }
  }

  update() {
    let dx = this.duckTargetX - this.x;
    let dy = this.duckTargetY - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.speed) {
      this.x = this.duckTargetX;
      this.y = this.duckTargetY;
      this.duckTargetX = this.getRandomTargetX();
      this.duckTargetY = this.getRandomTargetY();
    } else {
      this.x += (dx / distance) * this.speed;
      this.y += (dy / distance) * this.speed;
    }

    let horizontalMovement = Math.abs(dx); 
    let verticalMovement = Math.abs(dy); 

    this.diagonal = verticalMovement > horizontalMovement * 0.4;


    this.frameCounter++;
    if (this.frameCounter >= this.frameInterval) {
      this.frameCounter = 0;
      this.frameIndex = (this.frameIndex + 1) % this.frameCount;
    }

    this.draw();
  }

  changeSpeed() {
    this.speed = 5 + Math.random() * 4;
    console.log("new speed: " + this.speed);
  }

  updateDeads() {
    if (this.deadDelayCounter < 70) {
      this.deadDelayCounter++;
      this.drawDead(0);
    } else {
      this.drawDead(this.frameIndex);
      this.y += this.speed;
      this.frameCounter++;
      if (this.frameCounter >= 10) {
        this.frameCounter = 0;
        this.frameIndex = 1 + (this.frameIndex % 4);
      }
      if (this.y >= canvas.height) {
        const index = deadDucks.indexOf(this);
        if (index > -1) {
          deadDucks.splice(index, 1);
        }
      }
    }
  }

  drawDead(frameIndex) {
    let spriteSheetX = this.spriteWidth * 6 + frameIndex * this.spriteWidth;
    context.drawImage(
      this.spriteSheet,
      spriteSheetX + 2,
      this.spriteSheetY,
      this.spriteWidth - 6,
      this.spriteHeight,
      this.x,
      this.y,
      DUCK_WIDTH,
      DUCK_HEIGHT
    );
  }
}
