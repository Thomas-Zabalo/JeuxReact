import k from "../kaplayCtx";

export function makefish(pos){
    return k.add([
        k.sprite("fish", {anim: "fishing"}),
        k.area({shape: new k.Rect(k.vec2(-5, 0), 32, 32)}),
        k.scale(4),
        k.anchor("center"),
        k.pos(pos),
        k.offscreen(),
        k.animate(),
        "enemyfish",
        {z: 10}
    ]);
}
