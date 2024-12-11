export default class App {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");

    this.canvas.width = 800; // Canvas width
    this.canvas.height = 600; // Canvas height

    this.player = {
      x: 100,
      y: this.canvas.height / 2,
      width: 40,
      height: 40,
      color: "blue",
      speed: 5,
    };

    this.enemies = [];
    this.enemySpeed = 3;

    this.tryZone = {
      x: this.canvas.width - 50,
      y: 0,
      width: 50,
      height: this.canvas.height,
      color: "green",
    };

    this.keys = {}; // Tracks key presses
    this.gameOver = false;
    this.score = 0;
  }

  // Initialize Game
  init() {
    document.addEventListener("keydown", (e) => (this.keys[e.key] = true));
    document.addEventListener("keyup", (e) => (this.keys[e.key] = false));

    setInterval(() => this.createEnemy(), 2000);
    this.resetGame();
    this.gameLoop();
  }

  updatePlayer() {
    const { player, keys, canvas } = this;
    if (keys["z"] && player.y > 0) player.y -= player.speed;
    if (keys["s"] && player.y + player.height < canvas.height) player.y += player.speed;
    if (keys["q"] && player.x > 0) player.x -= player.speed;
    if (keys["d"] && player.x + player.width < canvas.width) player.x += player.speed;
  }

  createEnemy() {
    const enemy = {
      x: this.canvas.width,
      y: Math.random() * (this.canvas.height - 40),
      width: 40,
      height: 40,
      color: "red",
    };
    this.enemies.push(enemy);
  }

  updateEnemies() {
    this.enemies.forEach((enemy, index) => {
      enemy.x -= this.enemySpeed;
      if (enemy.x + enemy.width < 0) {
        this.enemies.splice(index, 1);
      }
      if (
          this.player.x < enemy.x + enemy.width &&
          this.player.x + this.player.width > enemy.x &&
          this.player.y < enemy.y + enemy.height &&
          this.player.y + this.player.height > enemy.y
      ) {
        this.gameOver = true;
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
      this.resetGame();
    }
  }

  resetGame() {
    this.player.x = 100;
    this.player.y = this.canvas.height / 2;
    this.enemies.length = 0;
  }

  drawPlayer() {
    const { ctx, player } = this;
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
  }

  drawEnemies() {
    const { ctx, enemies } = this;
    enemies.forEach((enemy) => {
      ctx.fillStyle = enemy.color;
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
  }

  drawTryZone() {
    const { ctx, tryZone } = this;
    ctx.fillStyle = tryZone.color;
    ctx.fillRect(tryZone.x, tryZone.y, tryZone.width, tryZone.height);
  }

  drawScore() {
    const { ctx, score } = this;
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 20);
  }

  gameLoop() {
    if (this.gameOver) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = "black";
      this.ctx.font = "30px Arial";
      this.ctx.fillText("Game Over!", this.canvas.width / 2 - 80, this.canvas.height / 2);
      return;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.updatePlayer();
    this.updateEnemies();
    this.checkWin();

    this.drawPlayer();
    this.drawEnemies();
    this.drawTryZone();
    this.drawScore();

    requestAnimationFrame(() => this.gameLoop());
  }
}
