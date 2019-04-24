class EnemyBaseClass extends Phaser.Physics.Arcade.Sprite {
    constructor(x, y, health, damage, scene, texture, value) {
        super(scene, x, y, texture, 0);
        this.health = health;
        this.damage = damage;
        this.pi = 0;
        this.value = value;
        this.fast = false;
        this.modifier();
    }
    update() {
        super.update();
        if (this.active === false) {
            this.x = 0;
            this.y = 0;
        } else if (this.pi < this.scene.path.length) {
            this.x = this.scene.path[this.pi].x;
            this.y = this.scene.path[this.pi].y;
            this.pi++;
            if (this.fast) {
                this.pi++;
            }
        }

    }
    attack() {
        if (this.active === true) {
            this.scene.altar.take_damage(this.damage);
        } else {
            this.x = 0;
            this.y = 0;
        }
    }
    take_damage(monster_damage) {
        this.health -= monster_damage;
        if (this.health <= 0) {
            this.setActive(false);
            this.setVisible(false);
            this.scene.blood += this.value;
        }
    }
    modifier() {
        var modified_likelyhood = enemy_modified(global_wave_num);
        var modified = Math.random();
        if (modified <= (1 / modified_likelyhood)) {
            modified = Math.floor(modified * 4) + 1;
            switch (modified) {
                case 1:     //health
                    console.log("health");
                    this.health += 4;
                    break;
                case 2:     //speed
                    console.log("speed");
                    this.fast = true;
                    break;
                case 3:     //damage
                    console.log("damage");
                    this.damage += 2;
                    break;
                case 4:     //value aka worth
                    console.log("value");
                    this.value += 2;
                    break;
                default:
                    console.log("oops! something went wrong :(");
                    console.log("modified: " + modified + " likelyhood: " + modified_likelyhood);
                    break;
            }
        }
    }
}