export default class App {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");

    this.canvas.width = 800; // Canvas width
    this.canvas.height = 600; // Canvas height

    // Chargement d'une image de terrain (optionnel)
    // Placez une image de terrain de rugby dans votre public/ ou un sprite
    this.fieldImage = new Image();
    this.fieldImage.src = "field.png"; // À remplacer par votre image réelle

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
      // sprite joueur (optionnel)
      sprite: new Image(),
      frame: 0,
      frameCount: 4, // Suppose que l'on a 4 frames pour animer le joueur
      frameWidth: 40,
      frameHeight: 40,
    };
    this.player.sprite.src = "player_sprite.png"; // Remplacez par votre sprite

    // Adversaires
    this.enemies = [];
    this.enemyBaseSpeed = 2; // La vitesse de base des adversaires évoluera selon le score

    // Zone d'essai
    this.tryZone = {
      x: this.canvas.width - 100,
      y: 0,
      width: 100,
      height: this.canvas.height,
      color: "green",
    };

    // Contrôles
    this.keys = {}; // Tracks key presses

    // Jeu
    this.gameOver = false;
    this.score = 0;
    this.gameStarted = false; // Pour un écran de démarrage

    // Timers
    this.enemySpawnInterval = null;
    this.lastTime = 0;
  }

  // Initialize Game
  init() {
    document.addEventListener("keydown", (e) => {
      this.keys[e.key] = true;
      // Si le jeu n'a pas commencé et que l'on appuie sur "Enter"
      if (!this.gameStarted && e.key === "Enter") {
        this.startGame();
      }
      // Si Game Over, on peut redémarrer en appuyant sur "r"
      if (this.gameOver && e.key === "r") {
        this.resetAll();
        this.startGame();
      }
    });

    document.addEventListener("keyup", (e) => (this.keys[e.key] = false));

    this.drawStartScreen();
  }

  startGame() {
    this.gameStarted = true;
    this.resetGame();
    this.enemySpawnInterval = setInterval(() => this.createEnemy(), 2000);
    requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
  }

  // Remise à zéro du jeu sans effacer le score
  resetGame() {
    this.player.x = 100;
    this.player.y = this.canvas.height / 2;
    this.player.vx = 0;
    this.player.vy = 0;
    this.enemies.length = 0;
    this.gameOver = false;
  }

  // Remet tout à zéro, y compris score
  resetAll() {
    this.score = 0;
    this.enemyBaseSpeed = 2;
    this.resetGame();
  }

  updatePlayer(deltaTime) {
    const { player, keys, canvas } = this;

    // Contrôles (accélération)
    let ax = 0;
    let ay = 0;

    if (keys["z"]) ay = -0.5;
    if (keys["s"]) ay = 0.5;
    if (keys["q"]) ax = -0.5;
    if (keys["d"]) ax = 0.5;

    // Mise à jour de la vélocité
    player.vx += ax;
    player.vy += ay;

    // Limitation de vitesse
    if (player.vx > player.maxSpeed) player.vx = player.maxSpeed;
    if (player.vx < -player.maxSpeed) player.vx = -player.maxSpeed;
    if (player.vy > player.maxSpeed) player.vy = player.maxSpeed;
    if (player.vy < -player.maxSpeed) player.vy = -player.maxSpeed;

    // Appliquer la friction
    player.vx *= player.friction;
    player.vy *= player.friction;

    // Mise à jour de la position
    player.x += player.vx;
    player.y += player.vy;

    // Collisions avec les bords
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height)
      player.y = canvas.height - player.height;

    // Mise à jour de l'animation du joueur
    // Si le joueur bouge, on change de frame
    if (Math.abs(player.vx) > 0.1 || Math.abs(player.vy) > 0.1) {
      player.frame += 10 * (deltaTime / 1000); // Vitesse de l'animation
      if (player.frame >= player.frameCount) player.frame = 0;
    } else {
      player.frame = 0; // Position de repos
    }
  }

  createEnemy() {
    const enemy = {
      x: this.canvas.width,
      y: Math.random() * (this.canvas.height - 40),
      width: 40,
      height: 40,
      color: "red",
      speed: this.enemyBaseSpeed + Math.random(), // vitesse légèrement aléatoire
      // Optionnel : sprite adversaire
      sprite: new Image(),
    };
    enemy.sprite.src = "enemy_sprite.png"; // Remplacez par votre sprite
    this.enemies.push(enemy);
  }

  updateEnemies() {
    const { player, enemies } = this;
    enemies.forEach((enemy, index) => {
      // L'adversaire se déplace vers le joueur : il calcule une direction
      const dx = player.x - enemy.x;
      const dy = player.y - enemy.y;
      const angle = Math.atan2(dy, dx);

      enemy.x += Math.cos(angle) * enemy.speed;
      enemy.y += Math.sin(angle) * enemy.speed;

      // Si l'ennemi sort du côté gauche (rarement, vu qu'il poursuit)
      if (enemy.x + enemy.width < 0) {
        enemies.splice(index, 1);
      }

      // Collision avec le joueur
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
      // Augmenter la difficulté
      this.enemyBaseSpeed += 0.5;
      this.resetGame();
    }
  }

  drawPlayer() {
    const { ctx, player } = this;

    // Si vous avez un sprite
    // On découpe le sprite en fonction de la frame
    // Suppose que le sprite est une bande horizontale de 4 frames
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
      // Si le sprite n'est pas chargé, on dessine un carré
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

    // On dessine une ligne d'essai
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
  }

  drawField() {
    const { ctx, canvas, fieldImage } = this;
    if (fieldImage.complete && fieldImage.width > 0) {
      ctx.drawImage(fieldImage, 0, 0, canvas.width, canvas.height);
    } else {
      // Si pas d'image, on colore en vert et on trace des lignes de rugby
      ctx.fillStyle = "#2e7d32";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Lignes de terrain (tous les 100 px)
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
    this.ctx.fillText("Appuyez sur Enter pour commencer", this.canvas.width / 2 - 180, this.canvas.height / 2);
  }

  drawGameOverScreen() {
    this.ctx.fillStyle = "rgba(0,0,0,0.5)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "white";
    this.ctx.font = "30px Arial";
    this.ctx.fillText("Game Over!", this.canvas.width / 2 - 70, this.canvas.height / 2);
    this.ctx.font = "20px Arial";
    this.ctx.fillText("Appuyez sur 'r' pour rejouer", this.canvas.width / 2 - 100, this.canvas.height / 2 + 40);
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
