export default class App {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");

    // Le canvas prend la taille de la fenêtre
    this.resizeCanvas();
    window.addEventListener("resize", () => this.resizeCanvas());

    this.fieldImage = new Image();
    this.fieldImage.src = "field.png"; // Mettre l'image du terrain si disponible

    // Joueur
    this.player = {
      x: 100,
      y: this.canvas.height / 2,
      width: 40,
      height: 40,
      speed: 5,
      vx: 0,
      vy: 0,
      maxSpeed: 5,
      friction: 0.90,
      color: "blue",
      sprite: new Image(),
      frame: 0,
      frameCount: 4,
      frameWidth: 40,
      frameHeight: 40,
    };
    this.player.sprite.src = "player_sprite.png"; // Remplacez par votre sprite

    this.enemies = [];

    // Zone d'essai
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

    // Interval spawn
    this.enemySpawnInterval = null;
    this.lastTime = 0;
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
        this.startGame();
      }
    });

    document.addEventListener("keyup", (e) => (this.keys[e.key] = false));
    this.drawStartScreen();
  }

  getLevel() {
    // Nouveau barème : <5 = Facile, 5-9 = Intermédiaire, >=10 = Difficile
    if (this.score < 5) return "Facile";
    else if (this.score < 10) return "Intermédiaire";
    else return "Difficile";
  }

  getDifficultyParameters() {
    const level = this.getLevel();
    switch (level) {
      case "Facile":
        return {
          enemySpeedBase: 2,
          spawnInterval: 2000,
          enemiesPerSpawn: 1,
        };
      case "Intermédiaire":
        return {
          enemySpeedBase: 3,
          spawnInterval: 1700,
          enemiesPerSpawn: 2,
        };
      case "Difficile":
        return {
          enemySpeedBase: 4,
          spawnInterval: 1200,
          enemiesPerSpawn: 3,
        };
      default:
        return {
          enemySpeedBase: 2,
          spawnInterval: 2000,
          enemiesPerSpawn: 1,
        };
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
  }

  resetAll() {
    this.score = 0;
    this.resetGame();
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

    // collisions bords
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height)
      player.y = canvas.height - player.height;

    // animation joueur
    if (Math.abs(player.vx) > 0.1 || Math.abs(player.vy) > 0.1) {
      player.frame += 10 * (deltaTime / 1000);
      if (player.frame >= player.frameCount) player.frame = 0;
    } else {
      player.frame = 0;
    }
  }

  createEnemies() {
    const { enemiesPerSpawn, enemySpeedBase } = this.getDifficultyParameters();
    for (let i = 0; i < enemiesPerSpawn; i++) {
      const enemy = {
        x: this.canvas.width,
        y: Math.random() * (this.canvas.height - 40),
        width: 40,
        height: 40,
        color: "red",
        speed: enemySpeedBase + Math.random(),
        sprite: new Image(),
      };
      enemy.sprite.src = "enemy_sprite.png";
      this.enemies.push(enemy);
    }
  }

  updateEnemies() {
    const { player, enemies } = this;
    enemies.forEach((enemy, index) => {
      const dx = player.x - enemy.x;
      const dy = player.y - enemy.y;
      const angle = Math.atan2(dy, dx);

      enemy.x += Math.cos(angle) * enemy.speed;
      enemy.y += Math.sin(angle) * enemy.speed;

      if (enemy.x + enemy.width < 0) {
        enemies.splice(index, 1);
      }

      if (
          player.x < enemy.x + enemy.width &&
          player.x + player.width > enemy.x &&
          player.y < enemy.y + enemy.height &&
          player.y + player.height > enemy.y
      ) {
        this.gameOver = true;
        clearInterval(this.enemySpawnInterval);
      }
    });
  }

  checkWin() {
    const { player, tryZone } = this;
    if (
        player.x + player.width >= tryZone.x &&
        player.y >= tryZone.y &&
        player.y + player.height <= tryZone.y + tryZone.height
    ) {
      this.score++;
      // Le niveau a peut-être changé, donc on met à jour la difficulté
      this.resetGame();
      this.setupSpawnInterval();
    }
  }

  drawPlayer() {
    const { ctx, player } = this;
    const sx = Math.floor(player.frame) * player.frameWidth;
    const sy = 0;
    if (player.sprite.complete && player.sprite.width > 0) {
      ctx.drawImage(
          player.sprite,
          sx,
          sy,
          player.frameWidth,
          player.frameHeight,
          player.x,
          player.y,
          player.width,
          player.height
      );
    } else {
      ctx.fillStyle = player.color;
      ctx.fillRect(player.x, player.y, player.width, player.height);
    }
  }

  drawEnemies() {
    const { ctx, enemies } = this;
    enemies.forEach((enemy) => {
      if (enemy.sprite.complete && enemy.sprite.width > 0) {
        ctx.drawImage(
            enemy.sprite,
            0,
            0,
            40,
            40,
            enemy.x,
            enemy.y,
            enemy.width,
            enemy.height
        );
      } else {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
      }
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
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 20);
    const level = this.getLevel();
    ctx.fillText(`Niveau: ${level}`, 10, 50);
  }

  drawField() {
    const { ctx, canvas, fieldImage } = this;
    if (fieldImage.complete && fieldImage.width > 0) {
      ctx.drawImage(fieldImage, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = "#2e7d32";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      for (let i = 0; i < canvas.width; i += 100) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
    }
  }

  drawStartScreen() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawField();
    this.ctx.fillStyle = "black";
    this.ctx.font = "30px Arial";
    this.ctx.fillText(
        "Appuyez sur Enter pour commencer",
        this.canvas.width / 2 - 180,
        this.canvas.height / 2
    );
  }

  drawGameOverScreen() {
    this.ctx.fillStyle = "rgba(0,0,0,0.5)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "white";
    this.ctx.font = "30px Arial";
    this.ctx.fillText(
        "Game Over!",
        this.canvas.width / 2 - 70,
        this.canvas.height / 2
    );
    this.ctx.font = "20px Arial";
    this.ctx.fillText(
        "Appuyez sur 'r' pour rejouer",
        this.canvas.width / 2 - 100,
        this.canvas.height / 2 + 40
    );
  }

  gameLoop(timestamp) {
    if (!this.lastTime) this.lastTime = timestamp;
    const deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;

    if (this.gameOver) {
      this.drawGameOverScreen();
      return;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawField();

    this.updatePlayer(deltaTime);
    this.updateEnemies();
    this.checkWin();

    this.drawTryZone();
    this.drawPlayer();
    this.drawEnemies();
    this.drawScore();

    requestAnimationFrame((ts) => this.gameLoop(ts));
  }
}
