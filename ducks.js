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
    this.spriteSheet = spriteSheet;
    this.spriteWidth = 40;
    this.spriteHeight = 40;
    this.spriteSheetY = 146 + count * this.spriteHeight;
    this.x = x;
    this.y = y;
    this.speed = speed + 5;
    this.diagonal = true;
    this.duckTargetX = this.getRandomTargetX();
    this.duckTargetY = this.getRandomTargetY();
    console.log("speed: " + this.speed);
    this.frameCount = 3;
    this.frameInterval = 8;
    this.frameCounter = 0;
    this.deadDelayCounter = 0;
    this.frameIndex = Math.floor(Math.random() * 4);
    this.duckLanded = false;

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
      this.changeSpeed();
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
    if (this.diagonal) {
      this.speed = 7 + Math.random() * 3;
    } else {
      this.speed = 9 + Math.random() * 4;
    }
  }

  updateDeads() {
    if (this.deadDelayCounter < 20) {
      this.deadDelayCounter++;
      this.drawDead(0);
    } else {
      this.drawDead(this.frameIndex);
      this.y += this.speed;
      this.frameCounter++;
      if (this.frameCounter >= 5) {
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
