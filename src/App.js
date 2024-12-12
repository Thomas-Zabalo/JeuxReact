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
      width: 80, // Taille affichée
      height: 80,
      speed: 5,
      vx: 0,
      vy: 0,
      maxSpeed: 5,
      friction: 0.9,
      color: "blue", // Couleur de secours
      frames: [], // Tableau pour stocker les 23 images
      frameIndex: 0, // Frame actuelle
      frameCount: 23, // Nombre total d'images
    };
    // Charger les 23 images
    for (let i = 0; i < 22; i++) {
      const img = new Image();
      img.src = process.env.PUBLICURL + `./Assets/runner_sprite${i + 1}.png`; // Nom des fichiers
      img.onload = () => console.log(`Image ${i + 1} chargée`);
      img.onerror = () => console.error(`Erreur de chargement pour runner${i + 1}.png`);
      this.player.frames.push(img);
    }


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

  drawPlayer(deltaTime) {
    const { ctx, player } = this;

    // Passer à la frame suivante
    player.frameIndex += 10 * (deltaTime / 1000); // Ajuste la vitesse d'animation
    if (player.frameIndex >= player.frameCount) {
      player.frameIndex = 0; // Recommence à la première image
    }

    const frame = player.frames[Math.floor(player.frameIndex)]; // Obtenir la frame courante

    // Vérifier si la frame existe et est chargée
    if (frame && frame.complete && frame.naturalWidth !== 0) {
      ctx.drawImage(frame, player.x, player.y, player.width, player.height);
    } else {
      // Si l'image est manquante ou non chargée, dessiner un rectangle en secours
      ctx.fillStyle = player.color;
      ctx.fillRect(player.x, player.y, player.width, player.height);
    }
  }

  drawField() {
    const { ctx, canvas } = this;
    if (!this.fieldPattern) {
      const grassImage = new Image();
      grassImage.src = process.env.PUBLIC_URL + "/Assets/grass.png"; // Assure un chemin correct
      grassImage.onload = () => {
        this.fieldPattern = ctx.createPattern(grassImage, "repeat");
        this.drawField(); // Redessine après chargement
      };
      return;
    }
    ctx.fillStyle = this.fieldPattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
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
    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText(`Score: ${score}`, 10, 30);
  }

  drawStartScreen() {
    const { ctx } = this;
    ctx.backgroundImage = process.env.PUBLIC_URL + "/Assets/stade.png";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Appuyez sur 'Entrée' pour commencer", this.canvas.width / 2 - 180, this.canvas.height / 2);

    ctx.font = "20px Arial";
    ctx.fillText("Contrôles : Z = haut, S = bas, Q = gauche, D = droite", this.canvas.width / 2 - 180, this.canvas.height / 2 + 40);
    ctx.fillText("But : Atteindre la zone verte sans toucher les ennemis", this.canvas.width / 2 - 180, this.canvas.height / 2 + 70);
  }

  drawGameOver() {
    const { ctx } = this;
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over!", this.canvas.width / 2 - 90, this.canvas.height / 2);

    ctx.font = "20px Arial";
    ctx.fillText("Appuyez sur 'R' pour recommencer", this.canvas.width / 2 - 130, this.canvas.height / 2 + 40);
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
    this.updateEnemies();
    this.checkWin();

    this.drawTryZone();
    this.drawPlayer(deltaTime); // Passe deltaTime pour gérer l'animation
    this.drawEnemies();
    this.drawScore();
    requestAnimationFrame((ts) => this.gameLoop(ts));
  }


}

const app = new App();
app.init();
