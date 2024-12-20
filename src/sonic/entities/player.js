import k from "../kaplayCtx";

const SPEED = 2500;
const JUMP_FORCE = 2000;
const MAX_SPEED = 5000;

export function makeplayer(){
    const player =k.add([
        k.sprite("sonic"),
        k.scale(4),
        k.area({scale: 0.7}),
        k.anchor("center"),
        k.pos(500,k.height()),
        k.body(),
        { speed: SPEED, maxSpeed: MAX_SPEED, z: 10 },
        "player"
      ]);

player.onGround(() => {
    if (!k.isKeyDown("left") && !k.isKeyDown("right")) {
        player.play("idle2");
    }
    else {
        player.play("jump");
    }
  });
  
  player.onKeyPress("space", () => {
    if (player.isGrounded()){
      player.jump(JUMP_FORCE),
      player.play("jump")
      k.play("jump", {volume: 0.5});
    }
  });
  
  player.onKeyDown("left", ()=>{
    player.move(-player.speed, 0);
    player.flipX = true;
  
    if (player.isGrounded() && player.curAnim() !== "run") {
      player.play("run");
  }

  });
  
  player.onKeyDown("right", ()=>{
    player.move(player.speed, 0);
    player.flipX = false;
  
    if (player.isGrounded() && player.curAnim() !== "run") {
      player.play("run");
  }
  });
  
  ["left", "right"].forEach((key) => {
    k.onKeyRelease(key, () => {
        if (player.isGrounded() 
          && !k.isKeyDown("left") 
        && !k.isKeyDown("right") 
        && !k.isKeyPressed("space")) {
            player.play("idle2");
        }
    });
  });

  const getInfo = () =>
    `
  Anim: ${player.curAnim()}
  Frame: ${player.frame}
  `.trim();
  
  // Add some text to show the current animation
  const label = k.add([
    k.text(getInfo(), { size: 100 }),
    k.color(0, 0, 0),
    k.pos(500,k.height()),
    {z:10},
  ]);
  
  label.onUpdate(() => {
    label.text = getInfo();
  });


player.onUpdate(() => {

    if (player.speed > MAX_SPEED) {
        player.speed = MAX_SPEED;
    }

    k.camPos(player.worldPos());
});

player.onPhysicsResolve(() => {
    k.camPos(player.worldPos());
});


  //   k.onFixedUpdate(() => {
  //     console.log(`Vitesse actuelle : ${player.speed}`);
  // });

  player.isPropelled = false;
  k.onUpdate(() => {
    if (!player.isGrounded()) {
      player.isPropelled = false;
    }
  });


  return player
};
