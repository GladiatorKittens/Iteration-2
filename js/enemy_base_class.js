class EnemyBaseClass extends Phaser.Physics.Arcade.Sprite {
    constructor(x, y, health, damage, scene, texture) {
        super(scene, x, y, texture, 0);
        this.health = health;
        this.damage = damage;
        this.pi = 0;
    }
    update() {
        super.update();
        if (this.isActive === false) {
            this.x = 0;
            this.y = 0;
        } else if (this.pi < this.scene.path.length) {
            this.x = this.scene.path[this.pi].x;
            this.y = this.scene.path[this.pi].y;
            this.pi++;
        }

    }
    attack() {
        if (this.isActive === true) {
            this.scene.altar.take_damage(this.damage);
        }
    }
    take_damage(monster_damage) {
        this.health -= monster_damage;
        if (this.health <= 0) {
            this.setActive(false);
            this.setVisible(false);
        }
    }
    die() {

    }
}