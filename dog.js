import { context, dogIdle, canvas } from "./script.js";

export class Dog {
  constructor(x, y, speed, spriteSheet) {
    this.spriteSheet = spriteSheet;
    this.spriteWidth = 69;
    this.spriteHeight = 69;

    this.x = x;
    this.y = y;
    this.dx = speed;

    this.frameIndex = 0;
    this.frameCount = 5;
    this.frameInterval = 10;
    this.frameCounter = 0;
    this.spriteSheetY = 0;

    this.idleFrameIndex = 0;
    this.idleFrameCount = 2;
    this.idleFrameInterval = 10;
    this.idleFrameCounter = 0;
    this.idleCycles = 0;
    this.maxIdleCycles = 2;
    this.visible = true;
  }

  draw() {
    let spriteSheetX = this.frameIndex * this.spriteWidth;
    if (this.dx < 0) {
      context.save();
      context.translate(this.x + this.spriteWidth * 3, this.y);
      context.scale(-1, 1);
      context.drawImage(
        this.spriteSheet,
        spriteSheetX,
        this.spriteSheetY,
        this.spriteWidth,
        this.spriteHeight,
        0,
        0,
        this.spriteWidth * 4,
        this.spriteHeight * 4
      );
      context.restore();
    } else {
      context.drawImage(
        this.spriteSheet,
        spriteSheetX,
        this.spriteSheetY,
        this.spriteWidth,
        this.spriteHeight,
        this.x,
        this.y,
        this.spriteWidth * 4,
        this.spriteHeight * 4
      );
    }
  }

  drawIdle() {
    if (!this.visible) return;

    let frameWidth = this.spriteWidth;
    let sx = this.idleFrameIndex * frameWidth;
    let sy = 0;

    context.drawImage(
      dogIdle,
      sx,
      sy,
      frameWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.spriteWidth * 3,
      this.spriteHeight * 3
    );
  }

  update() {
    if (this.x <= 0 || this.x + this.spriteWidth * 4 >= canvas.width) {
      this.dx *= -1;
    }
    this.x += this.dx;
    this.frameCounter++;
    if (this.frameCounter >= this.frameInterval) {
      this.frameCounter = 0;
      this.frameIndex = (this.frameIndex + 1) % this.frameCount;
    }
    this.draw();
  }

  updateIdle() {
    if (!this.visible) return;
    this.idleFrameCounter++;
    if (this.idleFrameCounter >= this.idleFrameInterval) {
      this.idleFrameCounter = 0;
      this.idleFrameIndex++;
      if (this.idleFrameIndex >= this.idleFrameCount) {
        this.idleFrameIndex = 0;
        this.idleCycles++;
        if (this.idleCycles >= this.maxIdleCycles) {
          this.visible = false;
        }
      }
    }
    this.drawIdle();
  }
}
