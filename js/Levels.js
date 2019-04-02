class Level_1 extends LevelClass {
    constructor() {
        super("Level_1", 35);
        this.wave_properties = [
            new WaveProperties(2500, 2, 1, 1),
            new WaveProperties(2000, 5, 1, 1.2),
            new WaveProperties(1500, 25, 1.1, 1.3)];
        
    }
    preload() { super.preload(); }
    create() {super.create(100);}
    update() { super.update();}
}
class WaveProperties {
    constructor(spawn_speed, total_enemies, health_modifier, damage_modifier) {
        this.spawn_speed = spawn_speed;
        this.total_enemies = total_enemies;
        this.health_modifier = health_modifier;
        this.damage_modifier = damage_modifier;
    }
}
class Pause extends Phaser.Scene {
    constructor() {
        super("Pause")
    }
    preload() {
        //this.load.image("pause_image", "assets/level design/pause_image.png");
    }
    create() {
        this.input.once('pointerdown', function () {
            this.scene.resume('Level_1');
        }, this);
    }
    update() {

    }
}