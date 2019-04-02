var config = {
    type: Phaser.AUTO,
    width: 960,
    height: 544,
    pixelArt: true,
    backgroundColor: "#3C0344",
    physics: {
        default: "arcade",
        arcade: {
            gravity: {
                x: 0,
                y: 0
            }//,
            //debug: true
        }
    },
        //scale: {
    //    mode: Phaser.Scale.ScaleModes.RESIZE,
    //},
    scene: [StartScreen, Level_1, Pause] //add levels as necessary
}

var game = new Phaser.Game(config);
var music = {};
function upgrade_cost_calc(x) {
    //x is the level being upgraded to, y is cost
    //function is (x-10)(7/10y) = -1 * 8^2
    //function is a rectangular hyperbola - has an asymtope at 10
    if (x === 10) {
        return "maxed";
    } else {
        y = Math.round(-640 / (7 * (x - 10)));
    }
    return y;
}
function purchase_cost_calc(x) {
    //x is the troop number, y is the cost of the  troop
    //function is y = 9 x ^ (1/2)
    var y = Math.round(Math.sqrt(x) * 9);
    return y;
}
function snap_to_grid(x) {
    if (x % 32 >= 16) {
        x = (Math.ceil(x / 32)) * 32;
    } else if (x % 32 > 0) {
        x = Math.floor(x / 32) * 32;
    }
    return x;
}

function create_anims() {
    const anims = this.anims;
    anims.create({
        key: "idle",
        frames: anims.generateFrameNumbers("tentacle", { start: 0, end: 2 }),
        frameRate: 2,
        yoyo: true,
        repeat: -1
    });
    anims.create({
        key: "tentacle_attack",
        frames: anims.generateFrameNumbers("tentacle", { start: 2, end: 6 }),
        frameRate: 8,
        yoyo: true
    });
}
function load_music() {   
    music.tentacle_attack = this.sound.add("tentacle_attackSFX");
}