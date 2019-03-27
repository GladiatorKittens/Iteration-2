class Altar extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, health) {
        super(scene, x, y, "Altar", 0, {});
        this.id = "Altar";
        this.health = this.max_health = health;
        this.label = "Altar";      
    }
    update() {
        //changes the frame of the altar based on how much hp the player has remaining
        if (this.health >= this.max_health * 0.9) {            
            this.setTexture("Altar", 0);
        } else if (this.health >= this.max_health * 0.75) {
            this.setTexture("Altar", 1);
        } else if (this.health >= this.max_health * 0.5) {
            this.setTexture("Altar", 2);
        } else if (this.health >= this.max_health * 0.25) {
            this.setTexture("Altar", 3);
        } else {
            this.setTexture("Altar", 4);
        }
    }
    take_damage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            this.scene.health_text.setText("health: " + this.health);
            this.setTexture(3);
            this.scene.input.enabled = false;
            this.scene.scene.pause();
        }
    }
}