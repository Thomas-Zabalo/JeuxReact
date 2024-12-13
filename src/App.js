export default class App {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");

    this.resizeCanvas();
    window.addEventListener("resize", () => this.resizeCanvas());

    this.fieldImage = new Image();
    this.fieldImage.src = "field.png";

    this.player = {
      x: 100,
      y: this.canvas.height / 2,
      width: 80,
      height: 80,
      speed: 5,
      vx: 0,
      vy: 0,
      maxSpeed: 5,
      friction: 0.9,
      color: "blue",
      frames: [],
      currentFrame: 0,
      frameCount: 22,
      facingRight: true,
    };

    for (let i = 0; i < this.player.frameCount; i++) {
      const img = new Image();
      img.src = process.env.PUBLIC_URL + `/Assets/runner_sprite${i + 1}.png`;
      this.player.frames.push(img);
    }

    this.enemyFrames = [];
    const enemyFrameCount = 24;
    for (let i = 0; i < enemyFrameCount; i++) {
      const img = new Image();
      img.src = process.env.PUBLIC_URL + `/Assets/mechant_${i}.png`;
      this.enemyFrames.push(img);
    }

    this.enemies = [];

    this.tryZone = {
      x: this.canvas.width - 100,
      y: 0,
      width: 100,
      height: this.canvas.height,
      color: "green",
    };

    this.keys = {};

    this.gameOver = false;
    this.gameStarted = false;
    this.score = 0;

    this.enemySpawnInterval = null;
    this.lastTime = 0;

    this.startSound = new Audio(process.env.PUBLIC_URL + '/Assets/start_game.mp3');
    this.startSound.volume = 0.5;
    this.startSound.load();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    if (this.tryZone) {
      this.tryZone.x = this.canvas.width - 100;
      this.tryZone.height = this.canvas.height;
    }
  }

  init() {
    document.addEventListener("keydown", (e) => {
      this.keys[e.key] = true;
      if (!this.gameStarted && e.key === "Enter") {
        this.startGame();
      }
      if (this.gameOver && e.key === "r") {
        this.resetAll();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawStartScreen();
        this.startSound.currentTime = 0;
        this.startSound.play().catch(err => console.warn("Lecture du son bloquée.", err));
      }
    });

    document.addEventListener("keyup", (e) => (this.keys[e.key] = false));

    this.drawStartScreen();
    this.startSound.currentTime = 0;
    this.startSound.play().catch(err => console.warn("Lecture du son bloquée.", err));
  }

  getLevel() {
    if (this.score < 5) return "Facile";
    else if (this.score < 10) return "Intermédiaire";
    else return "Difficile";
  }

  getDifficultyParameters() {
    const level = this.getLevel();
    switch (level) {
      case "Facile":
        return { enemySpeedBase: 2, spawnInterval: 2000, enemiesPerSpawn: 1 };
      case "Intermédiaire":
        return { enemySpeedBase: 3, spawnInterval: 1700, enemiesPerSpawn: 2 };
      case "Difficile":
        return { enemySpeedBase: 4, spawnInterval: 1200, enemiesPerSpawn: 3 };
      default:
        return { enemySpeedBase: 2, spawnInterval: 2000, enemiesPerSpawn: 1 };
    }
  }

  startGame() {
    this.gameStarted = true;
    this.resetGame();
    this.setupSpawnInterval();
    requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
  }

  setupSpawnInterval() {
    if (this.enemySpawnInterval) clearInterval(this.enemySpawnInterval);
    const { spawnInterval } = this.getDifficultyParameters();
    this.enemySpawnInterval = setInterval(() => this.createEnemies(), spawnInterval);
  }

  resetGame() {
    this.player.x = 100;
    this.player.y = this.canvas.height / 2;
    this.player.vx = 0;
    this.player.vy = 0;
    this.enemies.length = 0;
    this.gameOver = false;
    this.player.color = "blue";
  }

  resetAll() {
    this.score = 0;
    this.resetGame();
    this.gameOver = false;
    this.gameStarted = false;
    this.enemies = [];
    this.startSound.currentTime = 0;
    this.startSound.play().catch(err => console.warn("Lecture du son bloquée.", err));
  }

  updatePlayer(deltaTime) {
    const { player, keys, canvas } = this;

    let ax = 0;
    let ay = 0;

    if (keys["z"]) ay = -0.5;
    if (keys["s"]) ay = 0.5;
    if (keys["q"]) ax = -0.5;
    if (keys["d"]) ax = 0.5;

    player.vx += ax;
    player.vy += ay;

    if (player.vx > player.maxSpeed) player.vx = player.maxSpeed;
    if (player.vx < -player.maxSpeed) player.vx = -player.maxSpeed;
    if (player.vy > player.maxSpeed) player.vy = player.maxSpeed;
    if (player.vy < -player.maxSpeed) player.vy = -player.maxSpeed;

    player.vx *= player.friction;
    player.vy *= player.friction;

    player.x += player.vx;
    player.y += player.vy;

    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height)
      player.y = canvas.height - player.height;

    if (player.vx > 0) {
      player.facingRight = true;
    } else if (player.vx < 0) {
      player.facingRight = false;
    }

    if (Math.abs(player.vx) > 0.1 || Math.abs(player.vy) > 0.1) {
      player.currentFrame += 10 * (deltaTime / 1000);
      if (player.currentFrame >= player.frameCount) player.currentFrame = 0;
    } else {
      player.currentFrame = 0;
    }
  }

  createEnemies() {
    const { enemiesPerSpawn, enemySpeedBase } = this.getDifficultyParameters();
    for (let i = 0; i < enemiesPerSpawn; i++) {
      const enemy = {
        x: this.canvas.width,
        y: Math.random() * (this.canvas.height - 80),
        width: 80,
        height: 80,
        color: "red",
        speed: enemySpeedBase + Math.random(),
        frames: this.enemyFrames,
        currentFrame: 0,
        frameCount: 24,
        facingRight: false,
      };
      this.enemies.push(enemy);
    }
  }

  updateEnemies(deltaTime) {
    const { player, enemies } = this;
    let rectCollisionOccurred = false;

    for (let i = enemies.length - 1; i >= 0; i--) {
      const enemy = enemies[i];

      const dx = player.x - enemy.x;
      const dy = player.y - enemy.y;
      const angle = Math.atan2(dy, dx);

      enemy.x += Math.cos(angle) * enemy.speed;
      enemy.y += Math.sin(angle) * enemy.speed;

      enemy.facingRight = dx > 0;

      enemy.currentFrame += 10 * (deltaTime / 1000);
      if (enemy.currentFrame >= enemy.frameCount) enemy.currentFrame = 0;

      if (enemy.x + enemy.width < 0) {
        enemies.splice(i, 1);
        continue;
      }

      const rectCollision = (
          player.x < enemy.x + enemy.width &&
          player.x + player.width > enemy.x &&
          player.y < enemy.y + enemy.height &&
          player.y + player.height > enemy.y
      );

      if (rectCollision) {
        rectCollisionOccurred = true;
      }

      const playerCenterX = player.x + player.width / 2;
      const playerCenterY = player.y + player.height / 2;
      const enemyCenterX = enemy.x + enemy.width / 2;
      const enemyCenterY = enemy.y + enemy.height / 2;

      const distX = playerCenterX - enemyCenterX;
      const distY = playerCenterY - enemyCenterY;
      const distance = Math.sqrt(distX * distX + distY * distY);

      const playerRadius = (player.width / 2) * 0.4;
      const enemyRadius = (enemy.width / 2) * 0.4;

      if (distance < playerRadius + enemyRadius) {
        this.gameOver = true;
        clearInterval(this.enemySpawnInterval);
        break;
      }
    }

    if (!this.gameOver) {
      if (rectCollisionOccurred) {
        player.color = "red";
      } else {
        player.color = "blue";
      }
    }
  }

  checkWin() {
    const { player, tryZone } = this;
    if (
        player.x + player.width >= tryZone.x &&
        player.y >= tryZone.y &&
        player.y + player.height <= tryZone.y + tryZone.height
    ) {
      this.score++;
      this.resetGame();
      this.setupSpawnInterval();
    }
  }

  drawPlayer() {
    const { ctx, player } = this;
    const frameIndex = Math.floor(player.currentFrame);
    const frame = player.frames[frameIndex];

    ctx.save();
    if (!player.facingRight) {
      ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
      ctx.scale(-1, 1);
      if (frame && frame.complete && frame.naturalWidth !== 0) {
        ctx.drawImage(frame, -player.width / 2, -player.height / 2, player.width, player.height);
      } else {
        ctx.fillStyle = player.color;
        ctx.fillRect(-player.width / 2, -player.height / 2, player.width, player.height);
      }
    } else {
      if (frame && frame.complete && frame.naturalWidth !== 0) {
        ctx.drawImage(frame, player.x, player.y, player.width, player.height);
      } else {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);
      }
    }
    ctx.restore();

    if (player.color === "red") {
      ctx.save();
      ctx.fillStyle = "rgba(255,0,0,0.3)";
      ctx.fillRect(player.x, player.y, player.width, player.height);
      ctx.restore();
    }
  }

  drawField() {
    const { ctx, canvas } = this;
    if (!this.fieldPattern) {
      const grassImage = new Image();
      grassImage.src = process.env.PUBLIC_URL + "/Assets/grass.png";
      grassImage.onload = () => {
        this.fieldPattern = ctx.createPattern(grassImage, "repeat");
        this.drawField();
      };
      return;
    }
    ctx.fillStyle = this.fieldPattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  drawEnemies() {
    const { ctx, enemies } = this;
    enemies.forEach((enemy) => {
      const frameIndex = Math.floor(enemy.currentFrame);
      const frame = enemy.frames[frameIndex];

      ctx.save();
      if (!enemy.facingRight) {
        if (frame && frame.complete && frame.width > 0) {
          ctx.drawImage(frame, enemy.x, enemy.y, enemy.width, enemy.height);
        } else {
          ctx.fillStyle = enemy.color;
          ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        }
      } else {
        ctx.translate(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
        ctx.scale(-1, 1);
        if (frame && frame.complete && frame.width > 0) {
          ctx.drawImage(frame, -enemy.width / 2, -enemy.height / 2, enemy.width, enemy.height);
        } else {
          ctx.fillStyle = enemy.color;
          ctx.fillRect(-enemy.width / 2, -enemy.height / 2, enemy.width, enemy.height);
        }
      }
      ctx.restore();
    });
  }

  drawTryZone() {
    const { ctx, tryZone } = this;
    ctx.fillStyle = tryZone.color;
    ctx.fillRect(tryZone.x, tryZone.y, tryZone.width, tryZone.height);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(tryZone.x, 0);
    ctx.lineTo(tryZone.x, this.canvas.height);
    ctx.stroke();
  }

  drawScore() {
    const { ctx, score } = this;
    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText(`Score: ${score}`, 10, 30);
    const level = this.getLevel();
    ctx.fillText(`Niveau: ${level}`, 10, 50);
  }

  drawStartScreen() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const { ctx, canvas } = this;
    const backgroundImage = new Image();
    backgroundImage.src = process.env.PUBLIC_URL + "/Assets/stade.png";

    backgroundImage.onload = () => {
      ctx.globalAlpha = 0.5;
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;

      this.drawPopup();
    };
  }

  drawPopup() {
    const { ctx, canvas } = this;

    const popupWidth = 400;
    const popupHeight = 200;
    const popupX = (canvas.width - popupWidth) / 2;
    const popupY = (canvas.height - popupHeight) / 2;
    const borderRadius = 50;

    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.beginPath();
    ctx.moveTo(popupX + borderRadius, popupY);
    ctx.lineTo(popupX + popupWidth - borderRadius, popupY);
    ctx.quadraticCurveTo(popupX + popupWidth, popupY, popupX + popupWidth, popupY + borderRadius);
    ctx.lineTo(popupX + popupWidth, popupY + popupHeight - borderRadius);
    ctx.quadraticCurveTo(popupX + popupWidth, popupY + popupHeight, popupX + popupWidth - borderRadius, popupY + popupHeight);
    ctx.lineTo(popupX + borderRadius, popupY + popupHeight);
    ctx.quadraticCurveTo(popupX, popupY + popupHeight, popupX, popupY + popupHeight - borderRadius);
    ctx.lineTo(popupX, popupY + borderRadius);
    ctx.quadraticCurveTo(popupX, popupY, popupX + borderRadius, popupY);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.textAlign = "center";

    ctx.font = "21px 'Roboto', sans-serif";
    ctx.fillText("Appuyez sur ENTRÉE pour commencer", canvas.width / 2, popupY + (popupHeight / 2) - 30);

    ctx.font = "15px 'Roboto', sans-serif";
    ctx.fillText("Contrôles : Z = haut, S = bas, Q = gauche, D = droite", canvas.width / 2, popupY + (popupHeight / 2) + 10);
    ctx.fillText("But : Atteindre la zone verte sans toucher les ennemis", canvas.width / 2, popupY + (popupHeight / 2) + 40);
  }

  drawGameOver() {
    const { ctx } = this;
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over!", this.canvas.width / 2 - 90, this.canvas.height / 2);

    ctx.font = "20px Arial";
    ctx.fillText(
        "Appuyez sur 'R' pour revenir au menu",
        this.canvas.width / 2 - 130,
        this.canvas.height / 2 + 40
    );
  }

  gameLoop(timestamp) {
    if (!this.lastTime) this.lastTime = timestamp;
    const deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;

    if (this.gameOver) {
      this.drawGameOver();
      return;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawField();

    this.updatePlayer(deltaTime);
    this.updateEnemies(deltaTime);
    this.checkWin();

    this.drawTryZone();
    this.drawPlayer();
    this.drawEnemies();
    this.drawScore();
    requestAnimationFrame((ts) => this.gameLoop(ts));
  }
}

const app = new App();
app.init();

// Écouter DOMContentLoaded (au lieu de load) pour rejouer le son après chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  app.ctx.clearRect(0, 0, app.canvas.width, app.canvas.height);
  app.drawStartScreen();
  app.startSound.currentTime = 0;
  app.startSound.play().catch(err => console.warn("Lecture du son bloquée.", err));
});
