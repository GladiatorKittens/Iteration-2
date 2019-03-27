class MonsterBaseClass extends Phaser.Physics.Arcade.Sprite {
    constructor(cooldown_length, attack, x, y, texture, scene) {
        super(scene, x, y, texture, 0);
        this.level = 1;
        this.upgrade_cost = upgrade_cost_calc(this.level);
        this.last_attack_time = 0;
        this.cooldown_length = cooldown_length;
        this.attack_damage = attack;
    };
    update() { }
    attack_cooldown_calc() {
        var time = new Date();
        time = time.getTime();
        //check if the attack is on cooldown
        var time_diff = time - this.last_attack_time;
        if (time_diff > this.cooldown_length) {
            this.last_attack_time = time;
            return true;
            //attack goes in here
        } else {
            return false;
        }
    }
}

class TentacleClass extends MonsterBaseClass {
    constructor(cooldown_length, x, y, scene) {
        super(cooldown_length, 5, x, y, "tentacle", scene);
        this.range = 3;
        this.isStatic = true;
        this.is_attacking = false;
    }
    update() {
        super.update();
        if (this.is_attacking == false) {
            this.anims.play("idle", true);
        }//TODO - return to idle
    }
    attack(enemy) {
        var attack_possible = this.attack_cooldown_calc();
        if (attack_possible) {
            this.is_attacking = true;
            enemy.take_damage(this.attack_damage);
            this.sprite.anims.play("tentacle_attack", false);
            this.reset = this.scene.time.addEvent({
                delay: 1000,
                callback: this.reset_timer,
            });
        }
    }
    reset_timer() {
        this.is_attacking = false;
    }
}
