var myGamePiece, enemy, score;
var enemies = [];
var bullets = [];
var enemiesDefeated = 0;

function startGame() {
  myGamePiece = new component(32, 32, "img/tank.png", 450, 300, "image");
  enemy = new component(
    32,
    32,
    "img/enemy.png",
    30 + Math.random() * (900 - 60),
    30 + Math.random() * (600 - 60),
    "image"
  );
  enemies.push(enemy);
  score = new component("24px", "sans-serif", "black", 20, 40, "text");
  myGameArea.start();
}

var myGameArea = {
  canvas: document.createElement("canvas"),
  start: function () {
    this.canvas.width = 900;
    this.canvas.height = 600;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.frameNo = 0;
    this.interval = setInterval(updateGameArea, 20);
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
  this.life = 0;
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
    var bullet = new component(5, 5, "black", this.x, this.y);

    bullet.x = myGamePiece.x;
    bullet.y = myGamePiece.y;
    bullet.angle += this.angle;

    bullet.speed = 5;
    bullets.push(bullet);
  };
  this.clear = function () {
    this.height = 0;
    this.x = 2000;
  };
}
function addEnemy() {
  enemy = new component(
    32,
    32,
    "img/enemy.png",
    30 + Math.random() * (900 - 60),
    30 + Math.random() * (600 - 60),
    "image"
  );
  enemies.push(enemy);
}
function updateGameArea() {
  enemies.forEach((enemy) => {
    bullets.forEach((bullet) => {
      if (bullet.collideWith(enemy)) {
        enemiesDefeated++;
        enemy.x = 30 + Math.random() * (900 - 60);
        enemy.y = 30 + Math.random() * (600 - 60);
        bullet.clear();
        if (enemiesDefeated % 5 == 0) {
          addEnemy();
        }
      }
    });
  });
  myGameArea.clear();
  myGamePiece.moveAngle = 0;
  myGamePiece.speed = 0;
  if (myGameArea.keys && myGameArea.keys[65]) {
    myGamePiece.moveAngle = -3;
  }
  if (myGameArea.keys && myGameArea.keys[68]) {
    myGamePiece.moveAngle = 3;
  }
  if (myGameArea.keys && myGameArea.keys[87]) {
    myGamePiece.speed = 3;
  }
  if (myGameArea.keys && myGameArea.keys[83]) {
    myGamePiece.speed = -3;
  }
  if (myGameArea.keys && myGameArea.keys[32]) {
    myGamePiece.shoot();
  }
  score.text = "SCORE: " + enemiesDefeated;
  score.update();
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
}
