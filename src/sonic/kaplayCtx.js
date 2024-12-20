import kaplay from "kaplay";

const k = kaplay({
    width: 3640,
    height: 1520,
    letterbox: true,
    background: [0, 0, 0],
    global: false,
    touchToMouse: true,
    buttons : {
        jump: {
            keyboard: ["space"],
            mouse: "left",
        },
    },
    debug: true,
    debugKey: "k",
});




export default k;