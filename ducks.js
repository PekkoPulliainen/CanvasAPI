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
    this.hitWall = false;
    console.log("speed: " + this.speed);
    this.dx = Math.random() < 0.5 ? 1 : -1;
    this.dy = (Math.random() - 0.5) * 0.2;
    this.dy = 1;
    this.frameIndex = 0;
    this.frameCount = 3;
    this.frameInterval = 8;
    this.frameCounter = 0;
    this.directionChangeCounter = 0;
    this.directionChangeInterval = 700;
    this.deadDelayCounter = 0;
    this.speedChangeCounter = 0;
    this.speedChangeInterval = 300;

    this.draw();
  }

  draw() {
    let spriteSheetX = this.frameIndex * this.spriteWidth;
    let spriteSheetY = this.spriteSheetY;

    if (this.dx !== 0 && Math.abs(this.dy) > 0.1) {
      this.diagonal = true;
    } else {
      this.diagonal = false;
    }

    if (this.dx < 0) {
      if (this.diagonal === false) {
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
      }
      context.setTransform(1, 0, 0, 1, 0, 0);
    } else {
      if (this.diagonal === false) {
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
    this.hitWall = false;

    if (this.x < 0) {
      this.dx = Math.abs(this.dx); // Move right
      this.x = 1; // Adjust position
      this.hitWall = true;
    } else if (this.x + DUCK_WIDTH > canvas.width) {
      this.dx = -Math.abs(this.dx); // Move left
      this.x = canvas.width - DUCK_WIDTH - 1; // Adjust position
      this.hitWall = true;
    }

    if (this.y < 0) {
      this.dy = Math.abs(this.dy); // Move down
      this.y = 1; // Adjust position
      this.hitWall = true;
    } else if (this.y + DUCK_HEIGHT > canvas.height - 90) {
      this.dy = -Math.abs(this.dy); // Move up
      this.y = canvas.height - DUCK_HEIGHT - 91; // Adjust position
      this.hitWall = true;
    }

    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;

    this.frameCounter++;
    if (this.frameCounter >= this.frameInterval) {
      this.frameCounter = 0;
      this.frameIndex = (this.frameIndex + 1) % this.frameCount;
    }
    if (ducksAlive > 0) {
      this.directionChangeCounter++;
    }
    if (
      this.directionChangeCounter >= this.directionChangeInterval ||
      this.hitWall
    ) {
      this.directionChangeCounter = 0;
      this.changeDirection();
    }

    if (ducksAlive > 0) {
      this.speedChangeCounter++;
    }
    if (this.speedChangeCounter >= this.speedChangeInterval) {
      this.speedChangeCounter = 0;
      this.changeSpeed();
    }

    this.draw();
  }

  changeSpeed() {
    this.speed = 7 + Math.random() * 4;
    console.log("new speed: " + this.speed);
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
