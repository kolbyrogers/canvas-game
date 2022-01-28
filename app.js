var myGamePiece, enemy, instructions, score;
var enemies = [];
var bullets = [];
var powerups = [];
var addTimes = [];
var addTimesCount = 0;
var powerupCount = 0;
var enemiesDefeated = 0;
var spacePressCount = 0;
var movementPressCount = 0;
var startTime = 0;
var timeRemaining = 30;
var machineGun = false;

function startGame() {
  myGamePiece = new component(
    32,
    32,
    "img/tank.png",
    myGameArea.canvas.width * 1.5,
    myGameArea.canvas.height * 2.25,
    "image"
  );
  enemy = new component(
    32,
    32,
    "img/enemy.png",
    myGameArea.canvas.width * 1.5,
    myGameArea.canvas.height,
    "image"
  );
  enemies.push(enemy);
  score = new component("20px", "sans-serif", "black", 20, 40, "text");
  accuracy = new component("20px", "sans-serif", "black", 140, 40, "text");
  instructions = new component("28px", "sans-serif", "black", 315, 255, "text");
  wasdInstruction = new component(
    "28px",
    "sans-serif",
    "black",
    335,
    420,
    "text"
  );
  timer = new component("20px", "sans-serif", "black", 775, 40, "text");
  gameOver = new component("20px", "sans-serif", "black", 392, 250, "text");
  restartInstructions = new component(
    "20px",
    "sans-serif",
    "black",
    366,
    350,
    "text"
  );
  finalScore = new component("20px", "sans-serif", "black", 377, 300, "text");
  myGameArea.start();
}
function precise(x) {
  return Number.parseFloat(x).toPrecision(2);
}
var myGameArea = {
  canvas: document.createElement("canvas"),
  start: function () {
    this.canvas.width = 900;
    this.canvas.height = 600;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 20);
    window.addEventListener("keyup", (event) => {
      if (event.code === "Space") {
        spacePressCount++;
        myGamePiece.shoot();
      }
    });
    window.addEventListener("keydown", function (e) {
      e.preventDefault();
      myGameArea.keys = myGameArea.keys || [];
      myGameArea.keys[e.keyCode] = e.type == "keydown";
    });
    window.addEventListener("keyup", function (e) {
      myGameArea.keys[e.keyCode] = e.type == "keydown";
    });
  },
  stop: function () {
    clearInterval(this.interval);
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
};

function component(width, height, color, x, y, type) {
  this.type = type;
  this.width = width;
  this.height = height;
  this.speed = 0;
  this.angle = 0;
  this.moveAngle = 0;
  this.x = x;
  this.y = y;
  this.bullets = [];
  this.update = function () {
    ctx = myGameArea.context;
    if (this.type == "text") {
      ctx.font = this.width + " " + this.height;
      ctx.fillStyle = color;
      ctx.fillText(this.text, this.x, this.y);
    }
    if (this.type == "image") {
      this.image = new Image();
      this.image.src = color;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.drawImage(this.image, this.width - 48, this.height - 48);
      ctx.restore();
    } else {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.fillStyle = color;
      ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
      ctx.restore();
    }
  };
  this.newPos = function () {
    this.angle += (this.moveAngle * Math.PI) / 180;
    this.x += this.speed * Math.sin(this.angle);
    this.y -= this.speed * Math.cos(this.angle);
  };
  this.collideWith = function (otherObj) {
    var mLeft = this.x;
    var mRight = this.x + this.width;
    var mTop = this.y;
    var mBottom = this.y + this.height;
    var oLeft = otherObj.x;
    var oRight = otherObj.x + otherObj.width;
    var oTop = otherObj.y;
    var oBottom = otherObj.y + otherObj.height;
    var collision = true;
    if (mBottom < oTop || mTop > oBottom || mRight < oLeft || mLeft > oRight) {
      collision = false;
    }
    return collision;
  };
  this.shoot = function () {
    var bullet = new component(5, 5, "black", this.x + 1000, this.y + 1000);

    bullet.x = myGamePiece.x;
    bullet.y = myGamePiece.y;
    bullet.angle += this.angle;

    bullet.speed = 9;
    bullets.push(bullet);
  };
  this.clear = function () {
    this.height = 0;
    this.x = 20000;
  };
}
function addEnemy() {
  enemy = new component(
    32,
    32,
    "img/enemy.png",
    30 + Math.random() * (800 - 60),
    30 + Math.random() * (500 - 60),
    "image"
  );
  enemies.push(enemy);
}
function addPowerup() {
  powerup = new component(
    32,
    32,
    "img/powerup.png",
    30 + Math.random() * (900 - 60),
    30 + Math.random() * (600 - 60),
    "image"
  );
  powerups.push(powerup);
}
function addTime() {
  time = new component(
    32,
    32,
    "img/addTime.png",
    30 + Math.random() * (900 - 60),
    30 + Math.random() * (600 - 60),
    "image"
  );
  addTimes.push(time);
}
function updateGameArea() {
  powerups.forEach((powerup) => {
    if (myGamePiece.collideWith(powerup)) {
      timeRemaining += 5;
      machineGun = true;
      powerup.clear();
    }
  });

  myGameArea.clear();
  if (
    Math.round(timeRemaining - (new Date() - startTime) / 1000) <= 0 &&
    spacePressCount > 0
  ) {
    if (myGameArea.keys && myGameArea.keys[82]) {
      window.location.reload();
    }
    gameOver.text = "Game Over";
    gameOver.update();
    restartInstructions.text = "Press R to restart";
    restartInstructions.update();
    finalScore.text =
      "Final Score: " +
      precise(
        enemiesDefeated *
          (1 + Math.round((enemiesDefeated / spacePressCount) * 100) / 100)
      );
    finalScore.update();
    return;
  }
  myGamePiece.moveAngle = 0;
  myGamePiece.speed = 0;
  if (machineGun) {
    if (myGameArea.keys && myGameArea.keys[32]) {
      myGamePiece.shoot();
    }
  }
  if (myGameArea.keys && myGameArea.keys[65]) {
    myGamePiece.moveAngle = -3;
    movementPressCount = 1;
  }
  if (myGameArea.keys && myGameArea.keys[68]) {
    myGamePiece.moveAngle = 3;
    movementPressCount = 1;
  }
  if (myGameArea.keys && myGameArea.keys[87]) {
    myGamePiece.speed = 3;
    movementPressCount = 1;
  }
  if (myGameArea.keys && myGameArea.keys[83]) {
    myGamePiece.speed = -2;
    movementPressCount = 1;
  }
  if (spacePressCount == 0) {
    instructions.text = "Press Space to Shoot";
    instructions.update();
    startTime = new Date();
  }
  if (movementPressCount == 0 && spacePressCount > 0) {
    wasdInstruction.text = "Use WASD to move";
    wasdInstruction.update();
  }
  if (spacePressCount != 0) {
    score.text = "SCORE: " + enemiesDefeated;
    score.update();
    accuracy.text =
      "ACCURACY: " +
      Math.round((enemiesDefeated / spacePressCount) * 100) / 100;
    accuracy.update();

    timer.text =
      "TIME: " + Math.round(timeRemaining - (new Date() - startTime) / 1000);
    timer.update();
  }
  myGamePiece.newPos();
  myGamePiece.update();
  bullets.forEach((bullet) => {
    bullet.newPos();
    bullet.update();
  });
  enemies.forEach((enemy) => {
    enemy.newPos();
    enemy.update();
  });
  addTimes.forEach((powerup) => {
    powerup.newPos();
    powerup.update();
    if (myGamePiece.collideWith(powerup)) {
      timeRemaining += 5;
      powerup.clear();
    }
  });
  powerups.forEach((powerup) => {
    powerup.newPos();
    powerup.update();
    if (myGamePiece.collideWith(powerup)) {
      machineGun = true;
      powerup.clear();
    }
  });
  enemies.forEach((enemy) => {
    if (myGamePiece.collideWith(enemy)) {
      enemiesDefeated--;
      enemy.x = 30 + Math.random() * (800 - 60);
      enemy.y = 30 + Math.random() * (500 - 60);
    }
    bullets.forEach((bullet) => {
      if (bullet.collideWith(enemy)) {
        enemiesDefeated++;
        enemy.x = 30 + Math.random() * (800 - 60);
        enemy.y = 30 + Math.random() * (500 - 60);
        bullet.clear();
        if (machineGun == false) {
          if (enemiesDefeated % 5 == 0) {
            addEnemy();
          }
          if (enemiesDefeated % 7 == 0) {
            addPowerup();
            powerupCount++;
          }
          if (enemiesDefeated % 4 == 0) {
            addTime();
            addTimesCount++;
          }
        } else {
          if (enemiesDefeated % 15 == 0) {
            addEnemy();
          }
          if (enemiesDefeated % 10 == 0) {
            addTime();
            addTimesCount++;
          }
          if (enemiesDefeated % 30 == 0) {
            machineGun = false;
          }
        }
      }
    });
  });
}
