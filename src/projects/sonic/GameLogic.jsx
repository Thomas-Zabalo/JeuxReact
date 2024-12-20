import { makeplayer } from "./entities/player";
import k from "./kaplayCtx";
import mainMenu from "./scenes/mainMenu";
import { makefish } from "./entities/fish";
import { makeMotobug } from "./entities/motobug";
import { makeplatformsaut } from "./entities/plateformdesaut";

export default function GameLogic() {

  k.scene("mainGame", () => {

    k.loadSprite("chemical-bg", process.env.PUBLIC_URL + "/assets/sonic/graphics/chemical-bg.png");
    k.loadSprite("platforms", process.env.PUBLIC_URL + "/assets/sonic/graphics/platformstwo.PNG");
    k.loadSprite("platforms3", process.env.PUBLIC_URL + "/assets/sonic/graphics/60.png");
    k.loadSprite("platforms2", process.env.PUBLIC_URL + "/assets/sonic/graphics/59.png");
    k.loadSprite("platforms11", process.env.PUBLIC_URL + "/assets/sonic/graphics/33.png");
    k.loadSprite("platforms12", process.env.PUBLIC_URL + "/assets/sonic/graphics/36.png");
    k.loadSprite("platforms13", process.env.PUBLIC_URL + "/assets/sonic/graphics/37.png");
    k.loadSprite("platforms14", process.env.PUBLIC_URL + "/assets/sonic/graphics/38.png");
    k.loadSprite("platforms15", process.env.PUBLIC_URL + "/assets/sonic/graphics/39.png");
    k.loadSprite("platforms16", process.env.PUBLIC_URL + "/assets/sonic/graphics/41.png");
    k.loadSprite("platforms17", process.env.PUBLIC_URL + "/assets/sonic/graphics/42.png");
    k.loadSprite("platforms18", process.env.PUBLIC_URL + "/assets/sonic/graphics/3.png");
    k.loadSprite("platforms19", process.env.PUBLIC_URL + "/assets/sonic/graphics/4.png");
    k.loadSprite("platforms20", process.env.PUBLIC_URL + "/assets/sonic/graphics/5.png");
    k.loadSprite("platforms21", process.env.PUBLIC_URL + "/assets/sonic/graphics/7.png");
    k.loadSprite("platforms22", process.env.PUBLIC_URL + "/assets/sonic/graphics/2.png");


    k.loadSprite("platforms4", process.env.PUBLIC_URL + "/assets/sonic/graphics/bg-61.png")
    k.loadSprite("platforms5", process.env.PUBLIC_URL + "/assets/sonic/graphics/bg-62.png")
    k.loadSprite("platforms6", process.env.PUBLIC_URL + "/assets/sonic/graphics/bg-63.png")
    k.loadSprite("platforms7", process.env.PUBLIC_URL + "/assets/sonic/graphics/bg-64.png")
    k.loadSprite("platforms8", process.env.PUBLIC_URL + "/assets/sonic/graphics/bg-65.png")
    k.loadSprite("platforms9", process.env.PUBLIC_URL + "/assets/sonic/graphics/bg-66.png")
    k.loadSprite("platforms10", process.env.PUBLIC_URL + "/assets/sonic/graphics/bg-67.png")

    k.loadSprite("sonic", process.env.PUBLIC_URL + "/assets/sonic/graphics/sonic.png", {
      sliceX: 16,
      sliceY: 6,
      anims: {

        idle: {
          from: 0, to: 4, loop: false, speed: 10
        },

        idle2: {
          from: 5, to: 10, loop: true, speed: 10
        },
        run: {
          from: 32, to: 39, loop: true, speed: 10
        },

        crouch: {
          from: 16, to: 20, loop: false, speed: 10
        },

        crouchspeed: {
          from: 48, to: 63, loop: true, speed: 10
        },
        crouchrun: {
          from: 64, to: 79, loop: true, speed: 10
        },
        jump: {
          from: 80, to: 95, loop: true, speed: 120
        },
      },
    });

    k.loadSprite("ring", process.env.PUBLIC_URL + "/assets/sonic/graphics/ring.png", {
      sliceX: 16,
      SliceY: 1,
      anims: {
        spin: {
          from: 0, to: 15, loop: true, speed: 30
        },
      },
    });
    k.loadSprite("motobug", process.env.PUBLIC_URL + "/assets/sonic/graphics/motobug.png", {
      sliceX: 5,
      SliceY: 1,
      anims: {
        run: {
          from: 0, to: 4, loop: true, speed: 8
        },
      },
    });
    k.loadSprite("fish", process.env.PUBLIC_URL + "/assets/sonic/graphics/fish.png", {
      sliceX: 1,
      anims: {
        fishing: {
          from: 0, to: 0, loop: true, speed: 8
        },
      },
    });
    k.loadSprite("platformsaut", process.env.PUBLIC_URL + "/assets/sonic/graphics/S2RSC.png", {
      sliceX: 1,
      anims: {
        sauter: {
          from: 0, to: 0, loop: true, speed: 8
        },
      },
    });





    k.loadFont("mania", "fonts/mania.ttf");

    k.loadSound("destroy", process.env.PUBLIC_URL + "/assets/sonic/sounds/sonic-spindash.mp3");
    k.loadSound("hurt", process.env.PUBLIC_URL + "/assets/sonic/sounds/sonic-spindash.mp3");
    k.loadSound("hyper-ring", process.env.PUBLIC_URL + "/assets/sonic/sounds/sonic-spindash.mp3");
    k.loadSound("jump", process.env.PUBLIC_URL + "/assets/sonic/sounds/sonic-spindash.mp3");
    k.loadSound("ring", process.env.PUBLIC_URL + "/assets/sonic/sounds/sonic-spindash.mp3");
    k.loadSound("city", process.env.PUBLIC_URL + "/assets/sonic/sounds/sonic-spindash.mp3");
    k.loadSound("speed", process.env.PUBLIC_URL + "/assets/sonic/sounds/sonic-spindash.mp3");
    k.loadSound("exe", process.env.PUBLIC_URL + "/assets/sonic/sounds/sonic-exe-laugh.mp3");
    k.loadSound("crunch", process.env.PUBLIC_URL + "/assets/sonic/sounds/crunch.mp3");
    k.loadSound("AHHHH", process.env.PUBLIC_URL + "/assets/sonic/sounds/AHHHH.mp3");
    k.loadSound("bounce", process.env.PUBLIC_URL + "/assets/sonic/sounds/bounce.mp3");
    k.loadSound("musicsad", process.env.PUBLIC_URL + "/assets/sonic/sounds/sadmusic.mp3");
    makeplayer();

    k.setGravity(2500)


    const bgPieceWidth = 1920;

    const bgPiecesData = [
      { sprite: "platforms4", posX: 0 },
      { sprite: "platforms5", posX: bgPieceWidth * 0.333 },
      { sprite: "platforms6", posX: bgPieceWidth * 0.666 },
      { sprite: "platforms7", posX: bgPieceWidth * 0.999 },
      { sprite: "platforms8", posX: bgPieceWidth * 1.332 },
      { sprite: "platforms9", posX: bgPieceWidth * 1.665 },
      { sprite: "platforms10", posX: bgPieceWidth * 1.998 },
      { sprite: "platforms5", posX: bgPieceWidth * 2.331 },
      { sprite: "platforms6", posX: bgPieceWidth * 2.664 },
      { sprite: "platforms7", posX: bgPieceWidth * 2.997 },
      { sprite: "platforms8", posX: bgPieceWidth * 3.330 },
      { sprite: "platforms9", posX: bgPieceWidth * 3.663 },
      { sprite: "platforms10", posX: bgPieceWidth * 3.996 },
    ];


    function createBgPieces() {
      return bgPiecesData.map((bg, index) =>
        k.add([k.sprite(bg.sprite),
        k.pos(bg.posX + index * bgPieceWidth, 0),
        k.scale(10),
        k.opacity(0.8),
        k.area()
        ]),
        k.add([
          k.rect(k.width() * 10, k.height() + 900), // Rectangle couvrant tout l'écran
          k.pos(0, 0),                   // Positionné au coin supérieur gauche
          k.color(120, 200, 255),        // Couleur bleu ciel (valeurs ajustables)
          { z: -1 }                      // S'assurer que ce fond est derrière tout
        ])
      );

    }




    let bgPieces = createBgPieces();


    k.onUpdate(() => {

      if (bgPieces[0].pos.x < -bgPieceWidth) {

        bgPieces.forEach((bg, index) => {
          bg.moveTo(bgPieceWidth * (index + bgPieces.length), 0);
        });

        bgPieces = createBgPieces();
      }
    });










    k.add([
      k.sprite("platforms2"),
      k.pos(0, k.height() - 705),
      k.area({
        shape: new k.Polygon([
          k.vec2(5, 135),
          k.vec2(60, 15),
          k.vec2(60, 250),
          k.vec2(5, 250),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);

    k.add([
      k.sprite("platforms2"),
      k.pos(0, k.height() - 705),
      k.area({
        shape: new k.Polygon([
          k.vec2(60, 145),
          k.vec2(250, 135),
          k.vec2(60, 250),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);






    k.add([
      k.sprite("platforms2"),
      k.pos(1500, k.height() - 705),
      k.area({
        shape: new k.Polygon([
          k.vec2(5, 135),
          k.vec2(60, 145),
          k.vec2(60, 250),
          k.vec2(5, 250),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);

    k.add([
      k.sprite("platforms2"),
      k.pos(1500, k.height() - 705),
      k.area({
        shape: new k.Polygon([
          k.vec2(60, 145),
          k.vec2(250, 135),
          k.vec2(60, 250),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);

    k.add([
      k.sprite("platforms3"),
      k.pos(3000, k.height() - 1100),
      k.area({
        shape: new k.Polygon([
          k.vec2(5, 200),
          k.vec2(250, 200),
          k.vec2(60, 250),
          k.vec2(5, 250),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);

    k.add([
      k.sprite("platforms3"),
      k.pos(4500, k.height() - 1100),
      k.area({
        shape: new k.Polygon([
          k.vec2(5, 200),
          k.vec2(250, 200),
          k.vec2(60, 250),
          k.vec2(5, 250),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);
    k.add([
      k.sprite("platforms3"),
      k.pos(6500, k.height() - 1500),
      k.area({
        shape: new k.Polygon([
          k.vec2(5, 200),
          k.vec2(250, 200),
          k.vec2(60, 250),
          k.vec2(5, 250),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);

    const slowingPlatform = k.add([
      k.sprite("platforms3"),
      k.pos(8000, k.height() - 1500),
      k.area({
        shape: new k.Polygon([
          k.vec2(5, 200),
          k.vec2(250, 200),
          k.vec2(60, 250),
          k.vec2(5, 250),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 },
      "SPEEDPlatform"
    ]);

    k.onCollide("SPEEDPlatform", "player", (_, player) => {
      if (player.speed && !player.isBoosted) {
        player.isBoosted = true;
        const originalSpeed = player.speed;


        player.speed = Math.min(player.speed * 2, player.maxSpeed);
        k.play("speed", { volume: 0.5 });

        k.wait(4, () => {
          player.speed = originalSpeed;
          player.isBoosted = false;
        });
      }
    });


    k.add([
      k.sprite("platforms18"),
      k.pos(500, k.height() - 1500),
      k.area({
        shape: new k.Polygon([
          k.vec2(38, 130),
          k.vec2(218, 130),
          k.vec2(218, 100),
          k.vec2(38, 100),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      "passthroughPlatform",
      { z: 1 }
    ]);

    k.add([
      k.sprite("platforms18"),
      k.pos(500, k.height() - 1500),
      k.area({
        shape: new k.Polygon([
          k.vec2(0, 200),
          k.vec2(255, 200),
          k.vec2(255, 255),
          k.vec2(0, 255),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);


    k.add([
      k.sprite("platforms3"),
      k.pos(9500, k.height() - 1500),
      k.area({
        shape: new k.Polygon([
          k.vec2(5, 200),
          k.vec2(250, 200),
          k.vec2(60, 250),
          k.vec2(5, 250),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);
    k.add([
      k.sprite("platforms3"),
      k.pos(11000, k.height() - 1500),
      k.area({
        shape: new k.Polygon([
          k.vec2(5, 200),
          k.vec2(250, 200),
          k.vec2(60, 250),
          k.vec2(5, 250),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);

    k.add([
      k.sprite("platforms22"),
      k.pos(12500, k.height() - 1100),
      k.area({
        shape: new k.Polygon([
          k.vec2(0, 135),
          k.vec2(0, 255),
          k.vec2(130, 255),
          k.vec2(130, 165),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);

    k.add([
      k.sprite("platforms22"),
      k.pos(12500, k.height() - 1100),
      k.area({
        shape: new k.Polygon([
          k.vec2(130, 255),
          k.vec2(130, 165),
          k.vec2(255, 210),
          k.vec2(255, 255),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);

    k.add([
      k.sprite("platforms3"),
      k.pos(14000, k.height() - 1100),
      k.area({
        shape: new k.Polygon([
          k.vec2(5, 200),
          k.vec2(250, 200),
          k.vec2(60, 250),
          k.vec2(5, 250),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);
    k.add([
      k.sprite("platforms3"),
      k.pos(15500, k.height() - 1100),
      k.area({
        shape: new k.Polygon([
          k.vec2(5, 200),
          k.vec2(250, 200),
          k.vec2(60, 250),
          k.vec2(5, 250),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);

    k.add([
      k.sprite("platforms19"),
      k.pos(17000, k.height() - 1100),
      k.area({
        shape: new k.Polygon([
          k.vec2(130, 100),
          k.vec2(200, 100),
          k.vec2(200, 255),
          k.vec2(130, 255),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);

    k.add([
      k.sprite("platforms19"),
      k.pos(17000, k.height() - 1100),
      k.area({
        shape: new k.Polygon([
          k.vec2(5, 130),
          k.vec2(125, 130),
          k.vec2(125, 255),
          k.vec2(5, 255),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);

    k.add([
      k.sprite("platforms19"),
      k.pos(17000, k.height() - 1100),
      k.area({
        shape: new k.Polygon([
          k.vec2(195, 70),
          k.vec2(255, 70),
          k.vec2(255, 255),
          k.vec2(195, 255),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);

    k.add([
      k.sprite("platforms3"),
      k.pos(18500, k.height() - 1875),
      k.area({
        shape: new k.Polygon([
          k.vec2(5, 200),
          k.vec2(250, 200),
          k.vec2(60, 250),
          k.vec2(5, 250),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);

    k.add([
      k.sprite("platforms16"),
      k.pos(20000, k.height() - 1115),
      k.area({
        shape: new k.Polygon([
          k.vec2(0, 250),
          k.vec2(0, 75),
          k.vec2(120, 100),
          k.vec2(120, 250),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);

    k.add([
      k.sprite("platforms16"),
      k.pos(20000, k.height() - 1115),
      k.area({
        shape: new k.Polygon([
          k.vec2(120, 100),
          k.vec2(120, 250),
          k.vec2(255, 250),
          k.vec2(255, 140),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);


    k.add([
      k.sprite("platforms13"),
      k.pos(21500, k.height() - 1090),
      k.area({
        shape: new k.Polygon([
          k.vec2(5, 135),
          k.vec2(75, 135),
          k.vec2(250, 230),
          k.vec2(5, 250),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);

    k.add([
      k.sprite("platforms13"),
      k.pos(21500, k.height() - 1090),
      k.area({
        shape: new k.Polygon([
          k.vec2(210, 210),
          k.vec2(250, 210),
          k.vec2(250, 260),
          k.vec2(5, 250),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);

    k.add([
      k.sprite("platforms13"),
      k.pos(21500, k.height() - 1090),
      k.area({
        shape: new k.Polygon([
          k.vec2(5, 0),
          k.vec2(60, 0),
          k.vec2(60, 100),
          k.vec2(5, 100),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);


    k.add([
      k.sprite("platforms12"),
      k.pos(21495, k.height() - 2300),
      k.area({
        shape: new k.Polygon([
          k.vec2(5, 148),
          k.vec2(60, 148),
          k.vec2(60, 250),
          k.vec2(5, 250),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);

    k.add([
      k.sprite("platforms14"),
      k.pos(24000, k.height() - 1090),
      k.area({
        shape: new k.Polygon([
          k.vec2(180, 142),
          k.vec2(255, 142),
          k.vec2(255, 250),
          k.vec2(-20, 230),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);

    k.add([
      k.sprite("platforms14"),
      k.pos(24000, k.height() - 1090),
      k.area({
        shape: new k.Polygon([
          k.vec2(0, 205),
          k.vec2(50, 195),
          k.vec2(50, 250),
          k.vec2(0, 250),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);

    k.add([
      k.sprite("platforms14"),
      k.pos(24000, k.height() - 1090),
      k.area({
        shape: new k.Polygon([
          k.vec2(195, 3),
          k.vec2(255, 3),
          k.vec2(255, 80),
          k.vec2(195, 80),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);

    k.add([
      k.sprite("platforms2"),
      k.pos(25500, k.height() - 1065),
      k.area({
        shape: new k.Polygon([
          k.vec2(5, 135),
          k.vec2(60, 145),
          k.vec2(60, 250),
          k.vec2(5, 250),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);

    k.add([
      k.sprite("platforms2"),
      k.pos(25500, k.height() - 1065),
      k.area({
        shape: new k.Polygon([
          k.vec2(60, 145),
          k.vec2(250, 135),
          k.vec2(60, 250),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);

    k.add([
      k.sprite("platforms11"),
      k.pos(24000, k.height() - 2500),
      k.area({
        shape: new k.Polygon([
          k.vec2(200, 200),
          k.vec2(250, 200),
          k.vec2(250, 250),
          k.vec2(200, 250),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);

    k.add([
      k.sprite("platforms3"),
      k.pos(27000, k.height() - 1450),
      k.area({
        shape: new k.Polygon([
          k.vec2(5, 200),
          k.vec2(250, 200),
          k.vec2(60, 250),
          k.vec2(5, 250),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 },
      "SPEEDPlatform"
    ]);

    k.add([
      k.sprite("platforms3"),
      k.pos(28500, k.height() - 1450),
      k.area({
        shape: new k.Polygon([
          k.vec2(5, 200),
          k.vec2(250, 200),
          k.vec2(60, 250),
          k.vec2(5, 250),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);
    k.add([
      k.sprite("platforms3"),
      k.pos(30000, k.height() - 1450),
      k.area({
        shape: new k.Polygon([
          k.vec2(5, 200),
          k.vec2(250, 200),
          k.vec2(60, 250),
          k.vec2(5, 250),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 },
      "SPEEDPlatform"
    ]);

    k.add([
      k.sprite("platforms21"),
      k.pos(31500, k.height() - 1450),
      k.area({
        shape: new k.Polygon([
          k.vec2(0, 195),
          k.vec2(0, 255),
          k.vec2(130, 255),
          k.vec2(130, 195),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 },
    ])

    k.add([
      k.sprite("platforms21"),
      k.pos(31500, k.height() - 1450),
      k.area({
        shape: new k.Polygon([
          k.vec2(70, 195),
          k.vec2(70, 255),
          k.vec2(120, 255),
          k.vec2(125, 135),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 },
      "rampPlatform"
    ]);



    k.add([
      k.sprite("platforms21"),
      k.pos(31500, k.height() - 1450),
      k.area({
        shape: new k.Polygon([
          k.vec2(125, 135),
          k.vec2(125, 255),
          k.vec2(255, 255),
          k.vec2(255, 135),
        ])
      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 },
    ]);

    //code de propulsion vers le haut :3

    k.onCollide("rampPlatform", "player", (_, player) => {
      if (player.isGrounded() && player.speed > 0) {
        const horizontalBoost = player.speed * 1.2;
        const verticalBoost = Math.min(player.speed * 1.4, 2000);

        player.jump(verticalBoost);
        player.move(player.flipX ? -horizontalBoost : horizontalBoost, 0);
        player.play("jump");
        k.play("jump", { volume: 0.5 });
      }
    });


    k.add([
      k.sprite("platforms3"),
      k.pos(38000, k.height() - 0),
      k.area({
        shape: new k.Polygon([
          k.vec2(5, 200),
          k.vec2(250, 200),
          k.vec2(60, 250),
          k.vec2(5, 250),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);
    k.add([
      k.sprite("platforms3"),
      k.pos(39500, k.height() - 0),
      k.area({
        shape: new k.Polygon([
          k.vec2(5, 200),
          k.vec2(250, 200),
          k.vec2(60, 250),
          k.vec2(5, 250),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);






    k.add([
      k.sprite("platforms17"),
      k.pos(40000, k.height() - 1500),
      k.area({
        shape: new k.Polygon([
          k.vec2(115, 95),
          k.vec2(115, 250),
          k.vec2(255, 250),
          k.vec2(255, 140),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);

    k.add([
      k.sprite("platforms17"),
      k.pos(40000, k.height() - 1500),
      k.area({
        shape: new k.Polygon([
          k.vec2(35, 110),
          k.vec2(35, 125),
          k.vec2(115, 125),
          k.vec2(115, 95),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);

    k.add([
      k.sprite("platforms17"),
      k.pos(40000, k.height() - 1500),
      k.area({
        shape: new k.Polygon([
          k.vec2(0, 205),
          k.vec2(0, 255),
          k.vec2(115, 255),
          k.vec2(115, 240),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);

    k.add([
      k.sprite("platforms22"),
      k.pos(41500, k.height() - 1500),
      k.area({
        shape: new k.Polygon([
          k.vec2(0, 135),
          k.vec2(0, 255),
          k.vec2(130, 255),
          k.vec2(130, 165),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);

    k.add([
      k.sprite("platforms22"),
      k.pos(41500, k.height() - 1500),
      k.area({
        shape: new k.Polygon([
          k.vec2(130, 255),
          k.vec2(130, 165),
          k.vec2(255, 210),
          k.vec2(255, 255),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);

    k.add([
      k.sprite("platforms3"),
      k.pos(43000, k.height() - 1500),
      k.area({
        shape: new k.Polygon([
          k.vec2(5, 200),
          k.vec2(250, 200),
          k.vec2(60, 250),
          k.vec2(5, 250),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);

    k.add([
      k.sprite("platforms3"),
      k.pos(44500, k.height() - 1500),
      k.area({
        shape: new k.Polygon([
          k.vec2(5, 200),
          k.vec2(250, 200),
          k.vec2(60, 250),
          k.vec2(5, 250),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 },
      "laugh"
    ]);



    k.onCollide("laugh", "player", (_, player) => {
      if (player.speed && !player.isBoosted) {
        player.isBoosted = true;
        const originalSpeed = player.speed;


        player.speed = Math.min(player.speed * 0.5, player.maxSpeed);
        k.play("exe", { volume: 0.5 });

        k.wait(4, () => {
          player.speed = originalSpeed;
          player.isBoosted = false;
        });
      }
    });

    k.add([
      k.sprite("platforms3"),
      k.pos(46000, k.height() - 1500),
      k.area({
        shape: new k.Polygon([
          k.vec2(5, 200),
          k.vec2(250, 200),
          k.vec2(60, 250),
          k.vec2(5, 250),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);



    k.add([
      k.sprite("platforms19"),
      k.pos(47500, k.height() - 1500),
      k.area({
        shape: new k.Polygon([
          k.vec2(130, 100),
          k.vec2(200, 100),
          k.vec2(200, 255),
          k.vec2(130, 255),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);

    k.add([
      k.sprite("platforms19"),
      k.pos(47500, k.height() - 1500),
      k.area({
        shape: new k.Polygon([
          k.vec2(5, 130),
          k.vec2(125, 130),
          k.vec2(125, 255),
          k.vec2(5, 255),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);

    k.add([
      k.sprite("platforms19"),
      k.pos(47500, k.height() - 1500),
      k.area({
        shape: new k.Polygon([
          k.vec2(195, 70),
          k.vec2(255, 70),
          k.vec2(255, 255),
          k.vec2(195, 255),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);

    k.add([
      k.sprite("platforms20"),
      k.pos(49000, k.height() - 1500),
      k.area({
        shape: new k.Polygon([
          k.vec2(68, 20),
          k.vec2(255, 20),
          k.vec2(255, 255),
          k.vec2(68, 255),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 },
      "laugh"
    ]);

    k.add([
      k.sprite("platforms20"),
      k.pos(49000, k.height() - 1500),
      k.area({
        shape: new k.Polygon([
          k.vec2(4, 70),
          k.vec2(63, 70),
          k.vec2(63, 255),
          k.vec2(4, 255),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 },
      "laugh"
    ]);

    k.add([
      k.sprite("platforms3"),
      k.pos(50500, k.height() - 2550),
      k.area({
        shape: new k.Polygon([
          k.vec2(5, 200),
          k.vec2(250, 200),
          k.vec2(60, 250),
          k.vec2(5, 250),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);
    k.add([
      k.sprite("platforms3"),
      k.pos(52000, k.height() - 2550),
      k.area({
        shape: new k.Polygon([
          k.vec2(5, 200),
          k.vec2(250, 200),
          k.vec2(60, 250),
          k.vec2(5, 250),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);

    k.add([
      k.sprite("platforms3"),
      k.pos(53500, k.height() - 2550),
      k.area({
        shape: new k.Polygon([
          k.vec2(5, 200),
          k.vec2(250, 200),
          k.vec2(60, 250),
          k.vec2(5, 250),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);


    k.add([
      k.sprite("platforms18"),
      k.pos(55000, k.height() - 2550),
      k.area({
        shape: new k.Polygon([
          k.vec2(38, 130),
          k.vec2(218, 130),
          k.vec2(218, 100),
          k.vec2(38, 100),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      "passthroughPlatform",
      { z: 1 }
    ]);

    k.add([
      k.sprite("platforms18"),
      k.pos(55000, k.height() - 2550),
      k.area({
        shape: new k.Polygon([
          k.vec2(0, 200),
          k.vec2(255, 200),
          k.vec2(255, 255),
          k.vec2(0, 255),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);

    k.add([
      k.sprite("platforms3"),
      k.pos(565000, k.height() - 2550),
      k.area({
        shape: new k.Polygon([
          k.vec2(5, 200),
          k.vec2(250, 200),
          k.vec2(60, 250),
          k.vec2(5, 250),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);

    k.add([
      k.sprite("platforms18"),
      k.pos(58000, k.height() - 2550),
      k.area({
        shape: new k.Polygon([
          k.vec2(38, 130),
          k.vec2(218, 130),
          k.vec2(218, 100),
          k.vec2(38, 100),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);

    k.add([
      k.sprite("platforms18"),
      k.pos(58000, k.height() - 2550),
      k.area({
        shape: new k.Polygon([
          k.vec2(0, 200),
          k.vec2(255, 200),
          k.vec2(255, 255),
          k.vec2(0, 255),
        ])

      }),
      k.scale(6),
      k.body({ isStatic: true }),
      { z: 1 }
    ]);

    k.onCollide("passthroughPlatform", "player", (_, player) => {
      if (player.speed && !player.isBoosted) {
        player.isBoosted = true;
        const originalSpeed = player.speed;

        // Réduire temporairement la vitesse
        player.speed = Math.min(player.speed * 0.5, player.maxSpeed);
        k.play("musicsad", { volume: 0.5 });

        // Restaurer la vitesse après 4 secondes
        k.wait(4, () => {
          player.speed = originalSpeed;
          player.isBoosted = false;
        });

        // Déplacement manuel de la caméra
        player.manualCamera = true;
        const targetX = k.getCamPos().x + 500; // Déplacer de 500 pixels à droite

        // Déplacer la caméra
        k.wait(0, () => {
          k.setCamPos(targetX, k.getCamPos().y); // Déplace uniquement sur l'axe X
        });

        // Restaurer le suivi automatique de la caméra après 5 secondes
        k.wait(5, () => {
          player.manualCamera = false;
        });
      }
    });








    //motobug logique

    k.onCollide("enemy", "player", (enemy, player) => {
      if (!player.isGrounded()) {
        k.play("destroy", { volume: 0.5 });
        k.play("hyper-ring", { volume: 0.5 });
        k.destroy(enemy);
        player.jump(player.jumpforce);
        player.play("jump");
      }
      k.play("hurt", { volume: 0.5 })

      // k.go("gameover");
    });



    let motobugs = [];
    let positionOccupee = [];

    const spawnMotoBug = () => {

      const positions = [
        k.vec2(1950, 1080),
        k.vec2(2950, 1080),
        k.vec2(3950, 1080),
        k.vec2(4950, 1080),
        k.vec2(5950, 1080),

        k.vec2(8950, 680),
        k.vec2(9950, 680),
        k.vec2(10450, 680),
        k.vec2(12450, 680),
        k.vec2(15450, 1080),

        k.vec2(20050, 250),
        k.vec2(25450, 680),
        k.vec2(28450, 670),
      ];


      const availablePositions = positions.filter(position =>
        !positionOccupee.some(posoccupee =>
          posoccupee.x === position.x && posoccupee.y === position.y
        )
      );

      if (availablePositions.length === 0) return;


      const position = availablePositions[k.randi(0, availablePositions.length - 1)];

      const motobug = makeMotobug(position);
      motobugs.push(motobug);
      positionOccupee.push(position);

      motobug.animate("pos", [k.vec2(position.x, position.y + 500), k.vec2(position.x - 200, position.y + 500)], {
        duration: 2,
        direction: "ping-pong",
      });

      motobug.onExitScreen(() => {
        if (motobug.pos.x < 0) {
          k.destroy(motobug);
          motobugs = motobugs.filter(m => m !== motobug);
          positionOccupee = positionOccupee.filter(pos =>
            pos.x !== position.x || pos.y !== position.y
          );
        }
      });

      const waitTime = k.rand(0.1, 0.2);
      k.wait(waitTime, spawnMotoBug);
    };

    spawnMotoBug();


    //fish logique

    k.onCollide("enemyfish", "player", (_, player) => {
      if (!player.isGrounded()) {
        k.play("crunch", { volume: 0.5 })
      }
      k.play("crunch", { volume: 0.5 })

      // k.go("gameover");
    });



    let fishs = [];
    let poissonOccupee = [];

    const spawnPoisson = () => {

      const positions = [
        k.vec2(6300, 1580),
        k.vec2(23200, 1580),
        k.vec2(23800, 1580),
        k.vec2(39000, 2500),
        k.vec2(6300, 1580),

      ];


      const availablePositions = positions.filter(position =>
        !poissonOccupee.some(poisoccupee =>
          poisoccupee.x === position.x && poisoccupee.y === position.y
        )
      );

      if (availablePositions.length === 0) return;


      const position = availablePositions[k.randi(0, availablePositions.length - 1)];

      const fish = makefish(position);
      fishs.push(fish);
      poissonOccupee.push(position);

      fish.animate("pos", [k.vec2(position.x, position.y - 1500), k.vec2(position.x, position.y + 2000)], {
        duration: 1.5,
        direction: "ping-pong",
      });

      fish.onExitScreen(() => {
        if (fish.pos.x < 0) {
          k.destroy(fish);
          fishs = fishs.filter(m => m !== fish);
          poissonOccupee = poissonOccupee.filter(pos =>
            pos.x !== position.x || pos.y !== position.y
          );
        }
      });

      const waitTime = k.rand(0.1, 0.2);
      k.wait(waitTime, spawnPoisson);
    };

    spawnPoisson();



    let platformssaut = [];
    let platformOccupee = [];

    const spawnPlatformsaut = () => {

      const positions = [
        k.vec2(39000, 2650),

      ];


      const availablePositions = positions.filter(position =>
        !platformOccupee.some(platformoccupee =>
          platformoccupee.x === position.x && platformoccupee.y === position.y
        )
      );

      if (availablePositions.length === 0) return;


      const position = availablePositions[k.randi(0, availablePositions.length - 1)];

      const platformdesaut = makeplatformsaut(position);
      platformssaut.push(platformdesaut);
      platformOccupee.push(position);

      platformdesaut.animate("pos", [k.vec2(position.x, position.y), k.vec2(position.x, position.y)], {
        duration: 1.5,
        direction: "ping-pong",
      });

      platformdesaut.onExitScreen(() => {
        if (platformdesaut.pos.x < 0) {
          k.destroy(platformdesaut);
          platformssaut = platformssaut.filter(m => m !== platformdesaut);
          platformOccupee = platformOccupee.filter(pos =>
            pos.x !== position.x || pos.y !== position.y
          );
        }
      });

      const waitTime = k.rand(0.1, 0.2);
      k.wait(waitTime, spawnPlatformsaut);
    };

    spawnPlatformsaut();


    k.onCollide("saut", "player", (_, player) => {
      if (!player.isGrounded()) {
        player.jump(player.jumpforce * 2);
        k.play("bounce", { volume: 0.5 })
      }

    });

  });


  k.go("mainGame");

  k.scene("main-menu", mainMenu);

}