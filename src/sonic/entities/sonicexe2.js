import k from "../kaplayCtx";

export function makeSonicexe2(pos){
    return k.add([
        k.sprite("sonicexechase", {anim: "chase"}),
        k.area({shape: new k.Rect(k.vec2(-5, 0), 32, 32)}),
        k.scale(4),
        k.anchor("center"),
        k.pos(pos),
        k.offscreen(),
        k.animate(),
        "exe",
        {z: 11}
    ]);
}