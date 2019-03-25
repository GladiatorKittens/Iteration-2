class Altar extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, health) {
        super(x, y, "Altar", 0);
        this.id = "Altar";
        this.health = this.max_health = health;
        this.label = "Altar";
        this.scene = scene;
    }
    update() {
        //changes the frame of the altar based on how much hp the player has remaining
        if (this.health >= this.max_health * 0.9) {
            this.setTexture(0);
        } else if (this.health >= this.max_health * 0.75) {
            this.setTexture(1);
        } else if (this.health >= this.max_health * 0.5) {
            this.setTexture(2);
        } else if (this.health >= this.max_health * 0.25) {
            this.setTexture(3);
        } else {
            this.setTexture(4);
        }
    }
    take_damage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            this.scene.health_text.setText("health: " + this.health);
            this.setTexture(4);
            this.scene.input.enabled = false;
            this.scene.matter.pause();
            this.scene.scene.pause();
        }
    }
}