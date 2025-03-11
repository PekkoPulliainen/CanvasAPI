import {
  context,
  dogIdle,
  canvas,
  deadDucks,
  startGame,
  gameStarted,
  dog,
} from "./script.js";

export class Dog {
  constructor(x, y, speed, spriteSheet) {
    this.lastFrameTime = Date.now();
    this.spriteSheet = spriteSheet;
    this.spriteWidth = 69;
    this.spriteHeight = 69;
    this.dogLocation = canvas.height * 0.15;
    this.bushLocationY = canvas.width / 2;
    this.bushlocationX = canvas.height * 0.05;

    this.x = x;
    this.y = y;
    this.dx = speed;

    this.frameIndex = 1;
    this.frameCount = 5;
    this.frameInterval = 15;
    this.frameCounter = 0;
    this.spriteSheetY = 0;
    this.laughFrames = 2;
    this.laughFrameIndex = 0;
    this.laughFrameInterval = 25;

    this.idleFrameIndex = 0;
    this.idleFrameCount = 2;
    this.idleFrameInterval = 100;
    this.idleFrameCounter = 0;
    this.idleCycles = 0;
    this.maxIdleCycles = 2;
    this.visible = true;

    this.bushFrames = 6;
    this.bushFrameIndex = 0;
    this.bushFrameInterval = 50;
    this.bushFrameCounter = 0;

    this.startBush = false;
    this.bushReached = false;
    this.isWalking = false;
    this.walkDirection = "left";
    this.dogNuuh = 0;
    this.captured = false;
    this.captured2 = false;
    this.showdog = "none";
    this.isLaughing = false;
    this.laughDuration = 1500;
    this.laughStartTime = 0;
    this.dogduck = new Image();
    this.dogduck.src = "./CANVASAPI_UI/dogduck1.png";
    this.dogduck2 = new Image();
    this.dogduck2.src = "./CANVASAPI_UI/dogduck2.png";
    this.dogLaugh = new Image();
    this.dogLaugh.src = "./CANVASAPI_UI/doglaugh1.png";
    this.dogLaugh2 = new Image();
    this.dogLaugh2.src = "./CANVASAPI_UI/doglaugh2.png";
    this.dogHunt = new Image();
    this.dogHunt.src = "./CANVASAPI_UI/dogwalk.png";
    this.dogJump = new Image();
    this.dogJump.src = "./CANVASAPI_UI/dogjump1.png";
    this.dogJump2 = new Image();
    this.dogJump2.src = "./CANVASAPI_UI/dogjump2.png";
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
    } else if (this.dx > 0) {
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

  drawBush() {
    let bushImage =
      this.bushFrameIndex === 0
        ? this.dogHunt
        : this.bushFrameIndex === 1
        ? this.dogJump
        : this.dogJump2;
    if (this.dx > 0) {
      context.drawImage(bushImage, 0, 0, 69, 69, this.x, this.y, 230, 230);
    } else if (this.dx < 0) {
      context.save();
      context.scale(-1, 1);
      context.drawImage(bushImage, 0, 0, 69, 69, this.x, this.y, 230, 230);
    }
    const now = Date.now();
    if (now - this.lastFrameTime >= 1500) {
      this.lastFrameTime = now;
      this.bushFrameIndex = (this.bushFrameIndex + 1) % this.bushFrames;
    }
  }

  /* drawIdle() {
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
  } */

  drawLaugh() {
    let laughImage =
      this.laughFrameIndex === 0 ? this.dogLaugh : this.dogLaugh2;
    context.drawImage(
      laughImage,
      0,
      0,
      50,
      50,
      this.x,
      this.y - this.dogLocation,
      200,
      200
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
      if (this.frameIndex === 0) this.frameIndex = 1;
    }
    this.draw();
  }

  /* updateIdle() {
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
  } */

  updateshowdog() {
    if (this.showdog === "none") return;
    if (deadDucks.length > 0 && this.captured) return;
    if (this.showdog === "plus") {
      if (this.y > canvas.height * 0.75) {
        this.y -= 1;
      }
      this.frameCounter++;
    } else {
      this.frameCounter--;
      this.y += 1;
    }
    if (this.captured)
      context.drawImage(
        this.dogduck,
        0, // spriteSheetX
        0, // spriteSheetY
        50, // spriteWidth
        50, // spriteHeight
        this.x, // dx: Draws the image at 'this.x' on the canvas
        this.y - this.dogLocation, // dy: Draws the image at 'this.y' on the canvas
        200, // dWidth: Width of the drawn image
        200 // dHeight: Height of the drawn image
      );
    else if (this.captured2)
      context.drawImage(
        this.dogduck2,
        0,
        0,
        66,
        66,
        this.x,
        this.y - this.dogLocation,
        230,
        230
      );
    else this.drawLaugh();

    if (this.frameCounter > 90) {
      this.showdog = "minus";
    }
    if (this.frameCounter == 0) {
      this.showdog = "none";
      this.captured = false;
      this.captured2 = false;
    }

    if (this.isWalking) {
      this.x -= 2;
      if (this.x <= 0) {
        this.isWalking = false;
        this.x = 0;
      }
    }
  }
  triggerLaugh() {
    this.laughFrameIndex = 0;
    this.frameCounter = 0;
    this.isLaughing = true;
    this.laughStartTime = Date.now();
  }
  updateLaugh() {
    if (!this.isLaughing) return;

    let currentTime = Date.now();
    if (currentTime - this.laughStartTime >= this.laughDuration) {
      this.isLaughing = false; // Stop laughing after the duration
      return;
    }

    this.frameCounter++;
    if (this.frameCounter >= this.laughFrameInterval) {
      this.frameCounter = 0;
      this.laughFrameIndex = (this.laughFrameIndex + 1) % this.laughFrames;
    }
    this.drawLaugh();
  }

  startWalking() {
    this.isWalking = true;
  }

  updateWalking() {
    if (!this.isWalking) return;

    if (this.frameIndex !== 0 && this.frameIndex !== 1 && this.startBush)
      this.x += this.dx;
    else if (!this.startBush) this.x += this.dx;

    const leftBoundary = canvas.width * 0.05; // 5% of canvas width
    const rightBoundary = canvas.width * 0.85; // 85% of canvas width

    if (this.x <= leftBoundary) {
      this.isWalking = true;
      this.x = leftBoundary;
      this.dx *= -1;
      this.startBush = true;
      console.log("Boundary reached");
    } else if (this.x >= rightBoundary) {
      this.isWalking = true;
      this.x = rightBoundary;
      this.dx *= -1;
      this.startBush = true;
      console.log("Boundary reached");
    }

    // Compute the dog's center x-coordinate.
    const dogCenterX = this.x + (this.spriteWidth * 4) / 2;

    // Compute the canvas center.
    const canvasCenterX = canvas.width / 2;

    // Define a threshold as a percentage of the canvas width (e.g., 5%).
    const threshold = canvas.width * 0.05;

    if (this.startBush === true) {
      if (Math.abs(dogCenterX - canvasCenterX) < threshold) {
        console.log("Dog reached center");
        this.startBush = false;
        this.isWalking = false;
        this.bushReached = true;
      }
      this.frameCounter++;
      if (this.frameCounter >= this.frameInterval) {
        this.frameCounter = 0;
        this.frameIndex = (this.frameIndex + 1) % this.frameCount;
        if (this.frameIndex === 2 && this.dogNuuh > 0) {
          this.frameIndex = 0;
          this.dogNuuh -= 1;
        }
        if (this.frameIndex === 4) {
          this.dogNuuh += 1;
        }
      }
    } else {
      this.frameCounter++;
      if (this.frameCounter >= this.frameInterval) {
        this.frameCounter = 0;
        this.frameIndex = (this.frameIndex + 1) % this.frameCount;
        if (this.frameIndex === 0) this.frameIndex = 1;
      }
    }

    this.draw();
  }

  triggerBush() {
    startGame();
  }
}
