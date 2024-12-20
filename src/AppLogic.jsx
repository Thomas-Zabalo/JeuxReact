export default class AppLogic {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;

        this.init = this.init.bind(this);
        this.resizeCanvas = this.resizeCanvas.bind(this);
        this.startGame = this.startGame.bind(this);
        this.createEnemies = this.createEnemies.bind(this);
        this.drawStartScreen = this.drawStartScreen.bind(this);
        this.gameLoop = this.gameLoop.bind(this);

        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.body.style.overflow = "hidden";
        this.canvas.style.display = "block";

        this.isMobile = window.innerWidth < 600;

        // Zone "try" adaptée selon mobile ou non
        this.tryZone = this.isMobile
            ? {x: 0, y: 0, width: this.canvas.width, height: 100, color: "green"}
            : {x: 0, y: 0, width: 100, height: this.canvas.height, color: "green"};

        this.resizeCanvas();
        window.addEventListener("resize", this.resizeCanvas);

        this.fieldImage = new Image();
        this.fieldImage.src = "field.png";

        this.goalpostImage = new Image();
        this.goalpostImage.src = this.isMobile
            ? "assets/potovertical.png"
            : "assets/goalpost.png";

        this.goalPosts = this.isMobile
            ? [{x: this.canvas.width / 2 - 75, y: -45, width: 150, height: 150}]
            : [{x: this.canvas.width - 100, y: this.canvas.height / 2, width: 150, height: 150}];

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
            img.src = process.env.PUBLIC_URL + `/assets/runner_sprite${i + 1}.png`;
            this.player.frames.push(img);
        }

        this.enemyFrames = [];
        const enemyFrameCount = 24;
        for (let i = 0; i < enemyFrameCount; i++) {
            const img = new Image();
            img.src = process.env.PUBLIC_URL + `/assets/mechant_${i}.png`;
            this.enemyFrames.push(img);
        }

        this.enemies = [];
        this.keys = {};
        this.gameOver = false;
        this.gameStarted = false;
        this.score = 0;
        this.enemySpawnInterval = null;
        this.lastTime = 0;

        this.joystick = {
            isActive: false,
            startX: 0,
            startY: 0,
            deltaX: 0,
            deltaY: 0,
        };

        this.startSound = new Audio(process.env.PUBLIC_URL + "/assets/start_game.mp3");
        this.startSound.volume = 0.5;
        this.startSound.load();

        this.backgroundMusic = new Audio(
            process.env.PUBLIC_URL + "/assets/background_music.mp3"
        );
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.3;
        this.backgroundMusic.load();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.isMobile = window.innerWidth < 600;

        if (this.isMobile) {
            this.tryZone = {
                x: 0,
                y: 0,
                width: this.canvas.width,
                height: 100,
                color: "green",
            };
        } else {
            this.tryZone = {
                x: this.canvas.width - 100,
                y: 0,
                width: 100,
                height: this.canvas.height,
                color: "green",
            };
        }
    }

    init() {
        // Initialise les contrôles selon mobile ou desktop
        if (this.isMobile) {
            this.createStartButton();
            this.initJoystick(); // Initialisation du joystick sur mobile
        } else {
            document.addEventListener("keydown", (e) => {
                this.keys[e.key.toLowerCase()] = true;
                if (!this.gameStarted && e.key === "Enter") this.startGame();
                if (this.gameOver && e.key === "r") {
                    this.resetAll();
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    this.drawStartScreen();
                    this.startSound.currentTime = 0;
                    this.startSound.play().catch((err) => console.warn("Lecture bloquée.", err));
                }
            });

            document.addEventListener("keyup", (e) => {
                this.keys[e.key.toLowerCase()] = false;
            });
        }

        this.drawStartScreen();
    }

    createStartButton() {
        const existingButton = document.getElementById("start-button");
        if (existingButton) return;

        const startButton = document.createElement("button");
        startButton.id = "start-button";
        startButton.innerText = "Démarrer";
        startButton.style.position = "absolute";
        startButton.style.top = "50%";
        startButton.style.left = "50%";
        startButton.style.transform = "translate(-50%, -50%)";
        startButton.style.padding = "15px 30px";
        startButton.style.fontSize = "20px";
        startButton.style.backgroundColor = "#4CAF50";
        startButton.style.color = "white";
        startButton.style.border = "none";
        startButton.style.borderRadius = "5px";
        startButton.style.cursor = "pointer";
        startButton.style.zIndex = "1000";
        startButton.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";

        document.body.appendChild(startButton);

        startButton.addEventListener("click", () => {
            this.startGame();
            startButton.remove();
        });
    }

    initJoystick() {
        // Activation des événements tactiles
        this.canvas.addEventListener("touchstart", (e) => {
            const touch = e.touches[0];
            this.joystick.isActive = true;
            this.joystick.startX = touch.clientX;
            this.joystick.startY = touch.clientY;
        });

        this.canvas.addEventListener("touchmove", (e) => {
            if (!this.joystick.isActive) return;
            const touch = e.touches[0];
            this.joystick.deltaX = touch.clientX - this.joystick.startX;
            this.joystick.deltaY = touch.clientY - this.joystick.startY;
        });

        this.canvas.addEventListener("touchend", () => {
            this.joystick.isActive = false;
            this.joystick.deltaX = 0;
            this.joystick.deltaY = 0;
        });
    }

    startGame() {
        this.gameStarted = true;
        this.resetGame();
        this.setupSpawnInterval();

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawField();
        this.drawTryZone();
        this.drawPlayer();

        // On lance la musique de fond même sur mobile car l'utilisateur a cliqué
        this.backgroundMusic.currentTime = 0;
        this.backgroundMusic.play().catch(err => console.warn("Lecture musique fond bloquée sur mobile:", err));

        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }


    createReturnButton() {
        // Vérifiez si un bouton existe déjà
        const existingButton = document.getElementById("return-button");
        if (existingButton) return;

        // Crée le bouton "Retour"
        const returnButton = document.createElement("button");
        returnButton.id = "return-button";
        returnButton.innerText = "Retour";
        returnButton.style.position = "absolute";
        returnButton.style.top = "70%";
        returnButton.style.left = "50%";
        returnButton.style.transform = "translate(-50%, -50%)";
        returnButton.style.padding = "10px 20px";
        returnButton.style.fontSize = "18px";
        returnButton.style.backgroundColor = "#FF5722";
        returnButton.style.color = "white";
        returnButton.style.border = "none";
        returnButton.style.borderRadius = "5px";
        returnButton.style.cursor = "pointer";
        returnButton.style.zIndex = "1000";
        returnButton.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";

        document.body.appendChild(returnButton);

        // Ajouter l'événement de clic pour retourner au menu principal
        returnButton.addEventListener("click", () => {
            this.resetAll(); // Réinitialise le jeu
            returnButton.remove(); // Supprime le bouton après utilisation
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.drawStartScreen(); // Revient à l'écran de démarrage
        });
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
                return {enemySpeedBase: 2, spawnInterval: 2000, enemiesPerSpawn: 1};
            case "Intermédiaire":
                return {enemySpeedBase: 3, spawnInterval: 1700, enemiesPerSpawn: 2};
            case "Difficile":
                return {enemySpeedBase: 4, spawnInterval: 1200, enemiesPerSpawn: 3};
            default:
                return {enemySpeedBase: 2, spawnInterval: 2000, enemiesPerSpawn: 1};
        }
    }


    setupSpawnInterval() {
        if (this.enemySpawnInterval) clearInterval(this.enemySpawnInterval);
        const {spawnInterval} = this.getDifficultyParameters();
        this.enemySpawnInterval = setInterval(() => this.createEnemies(), spawnInterval);
    }

    resetGame() {
        this.enemies.length = 0;
        this.gameOver = false;
        this.player.color = "blue";

        if (this.isMobile) {
            this.player.x = 100;
            this.player.y = this.canvas.height - this.player.height;
        } else {
            this.player.x = 100;
            this.player.y = this.canvas.height / 2;
        }

        this.player.vx = 0;
        this.player.vy = 0;
    }

    resetAll() {
        this.score = 0;
        this.resetGame();
        this.gameOver = false;
        this.gameStarted = false;
        this.enemies = [];

        // Supprime le bouton "Retour" s'il existe
        const returnButton = document.getElementById("return-button");
        if (returnButton) returnButton.remove();

        // Réaffiche le bouton "Démarrer" sur mobile
        if (this.isMobile) {
            this.createStartButton();
        }

        // Arrêter la musique de fond lorsque l'on revient au menu
        this.backgroundMusic.pause();
        this.backgroundMusic.currentTime = 0;

        if (!this.isMobile) {
            this.startSound.currentTime = 0;
            this.startSound.play().catch(err => console.warn("Lecture bloquée.", err));
        }
    }


    updatePlayer(deltaTime) {
        const {player, keys, joystick, canvas} = this;
        let ax = 0;
        let ay = 0;

        // Contrôles tactiles (joystick)
        if (joystick.isActive) {
            ax = joystick.deltaX / 50; // Divise pour réduire la sensibilité
            ay = joystick.deltaY / 50;
        } else {
            // Contrôles clavier
            if (keys["z"] || keys["arrowup"]) ay = -0.5;
            if (keys["s"] || keys["arrowdown"]) ay = 0.5;
            if (keys["q"] || keys["arrowleft"]) ax = -0.5;
            if (keys["d"] || keys["arrowright"]) ax = 0.5;
        }

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
        if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;

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
        const {enemiesPerSpawn, enemySpeedBase} = this.getDifficultyParameters();

        for (let i = 0; i < enemiesPerSpawn; i++) {
            let enemy;
            if (this.isMobile) {
                enemy = {
                    x: Math.random() * this.canvas.width,
                    y: 0,
                    width: 80,
                    height: 80,
                    color: "red",
                    speed: enemySpeedBase + Math.random(),
                    frames: this.enemyFrames,
                    currentFrame: 0,
                    frameCount: 24,
                    facingRight: false,
                };
            } else {
                enemy = {
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
            }
            this.enemies.push(enemy);
        }
    }

    updateEnemies(deltaTime) {
        const {player, enemies} = this;
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

            if (enemy.x + enemy.width < 0 || enemy.x > this.canvas.width || enemy.y > this.canvas.height) {
                enemies.splice(i, 1);
                continue;
            }

            // Collision rectangulaire
            const rectCollision = (
                player.x < enemy.x + enemy.width &&
                player.x + player.width > enemy.x &&
                player.y < enemy.y + enemy.height &&
                player.y + player.height > enemy.y
            );

            if (rectCollision) {
                // Joueur en rouge pour signaler le danger
                rectCollisionOccurred = true;
            }

            // Collision circulaire plus précise
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
                // Collision circulaire détectée: Game Over immédiat
                this.gameOver = true;
                clearInterval(this.enemySpawnInterval);
                break;
            }
        }

        if (!this.gameOver) {
            // Si collision rectangulaire, on affiche le rouge, sinon bleu
            player.color = rectCollisionOccurred ? "red" : "blue";
        }
    }

    checkWin() {
        const {player, tryZone} = this;

        if (this.isMobile) {
            if (
                player.y <= tryZone.height &&
                player.x + player.width >= tryZone.x &&
                player.x <= tryZone.x + tryZone.width
            ) {
                this.score++;
                this.resetGame();
                this.setupSpawnInterval();
            }
        } else {
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
    }

    drawPlayer() {
        const {ctx, player} = this;
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
        const {ctx, canvas} = this;
        if (!this.fieldPattern) {
            const grassImage = new Image();
            grassImage.src = process.env.PUBLIC_URL + "/assets/grass.png";
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
        const {ctx, enemies} = this;
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
        const {ctx, tryZone} = this;
        ctx.fillStyle = tryZone.color;
        ctx.fillRect(tryZone.x, tryZone.y, tryZone.width, tryZone.height);

        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        ctx.beginPath();

        if (this.isMobile) {
            ctx.moveTo(0, tryZone.height);
            ctx.lineTo(this.canvas.width, tryZone.height);
        } else {
            ctx.moveTo(tryZone.x, 0);
            ctx.lineTo(tryZone.x, this.canvas.height);
        }

        ctx.stroke();
    }

    drawGoalPosts() {
        const {ctx} = this;
        this.goalPosts.forEach((post) => {
            ctx.drawImage(this.goalpostImage, post.x, post.y, post.width, post.height);
        });
    }

    drawScore() {
        const {ctx, score} = this;

        ctx.fillStyle = "white";
        ctx.font = "bold 28px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.shadowColor = "black";
        ctx.shadowBlur = 3;

        if (this.isMobile) {
            ctx.fillText(`Score : ${score}`, this.canvas.width / 2, this.tryZone.height + 10);
        } else {
            ctx.textAlign = "left";
            ctx.fillText(`Score : ${score}`, 40, 10);
        }

        const level = this.getLevel();
        let levelColor;

        switch (level) {
            case "Facile":
                levelColor = "#87d9ff";
                break;
            case "Intermédiaire":
                levelColor = "#FF9800";
                break;
            case "Difficile":
                levelColor = "#F44336";
                break;
            default:
                levelColor = "#9E9E9E";
        }

        const levelText = `Niveau : ${level}`;
        ctx.font = "bold 24px Arial";
        ctx.fillStyle = levelColor;
        ctx.globalAlpha = 0.8;
        const levelTextWidth = ctx.measureText(levelText).width;

        if (this.isMobile) {
            const rectX = (this.canvas.width - levelTextWidth - 20) / 2;
            const rectY = this.tryZone.height + 50;
            ctx.fillRect(rectX, rectY, levelTextWidth + 20, 40);
            ctx.globalAlpha = 1;
            ctx.fillStyle = "white";
            ctx.shadowColor = "transparent";
            ctx.textAlign = "center";
            ctx.fillText(levelText, this.canvas.width / 2, rectY + 10);
        } else {
            ctx.globalAlpha = 0.8;
            ctx.textAlign = "left";
            const rectX = 10;
            const rectY = 50;
            ctx.fillRect(rectX, rectY, levelTextWidth + 20, 40);
            ctx.globalAlpha = 1;
            ctx.fillStyle = "white";
            ctx.shadowColor = "transparent";
            ctx.fillText(levelText, rectX + 10, rectY + 10);
        }
    }

    drawStartScreen() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const {ctx, canvas} = this;
        const backgroundImage = new Image();
        backgroundImage.src = process.env.PUBLIC_URL + "/assets/stade.png";

        backgroundImage.onload = () => {
            ctx.globalAlpha = 0.5;
            ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = 1;

            if (!this.isMobile) {
                this.drawPopup(); // Affiche uniquement le popup pour desktop
            }
        };
    }


    drawPopup() {
        const {ctx, canvas} = this;

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
        const { ctx, canvas, isMobile } = this;
        const backgroundImage2 = new Image();
        backgroundImage2.src = process.env.PUBLIC_URL + "/assets/gameover.gif";

        backgroundImage2.onload = () => {
            // Dessin de l'image de fond
            ctx.drawImage(backgroundImage2, 0, 0, canvas.width, canvas.height);

            // Overlay semi-transparent
            ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "white";
            ctx.font = "20px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            if (isMobile) {
                // Sur mobile : bouton retour, pas de popup
                this.createReturnButton();
            } else {
                // Sur desktop : afficher la popup immédiatement
                this.drawPopup2();
            }
        };
    }

    drawPopup2() {
        const { ctx, canvas } = this;

        const popupWidth = 400;
        const popupHeight = 200;
        const popupX = (canvas.width - popupWidth) / 2;
        const popupY = (canvas.height - popupHeight) / 2;
        const borderRadius = 50;

        // Fond de la popup
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
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

        // Bordure de la popup
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Texte dans la popup
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.textAlign = "center";

        // Texte principal (pas de "Game Over!", juste les instructions)
        ctx.font = "21px 'Roboto', sans-serif";
        ctx.fillText("Appuyez sur 'R' pour rejouer", canvas.width / 2, popupY + (popupHeight / 2) - 10);
    }

    gameLoop(timestamp) {
        if (!this.lastTime) this.lastTime = timestamp;
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawField();
        if (this.gameOver) {
            this.drawGameOver();
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
            return;
        }
        this.initJoystick();

        this.updatePlayer(deltaTime);
        this.updateEnemies(deltaTime);
        this.checkWin();

        this.drawTryZone();
        this.drawPlayer();
        this.drawEnemies();
        this.drawScore();
        this.drawGoalPosts();

        requestAnimationFrame((ts) => this.gameLoop(ts));
    }
}
  