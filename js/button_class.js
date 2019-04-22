class Button {
    constructor(x, y, image_path, on_click_function, scene) {
        this.x = x;
        this.y = y;

        this.image_path = image_path;
        this.on_click_function = on_click_function;
        this.scene = scene;
        this.image = this.scene.add.image(this.x, this.y, this.image_path);
        this.image.setInteractive();
        this.image.on("pointerdown", this.on_click_function, this.scene);
    }
}

class SpriteButton extends Phaser.Physics.Arcade.Sprite {
    constructor(x, y, sprite_path, on_click_function, scene) {
        super(scene, x, y, sprite_path, 0);
        this.sprite_path = sprite_path;
        this.on_click_function = on_click_function;
        this.pressed = false;
        this.setInteractive();
        this.on("pointerdown", this.on_click_function, this.scene);
    }
    update() {
        if (this.pressed === true) {
            this.setTexture(this.sprite_path, 1);
        } else {
            this.setTexture(this.sprite_path, 0);
        }
    }
}

class UpgradeButton extends Phaser.Physics.Arcade.Image {
    constructor(x, y, image_path, scene) {
        super(scene, x, y, image_path);
        this.image_path = image_path;
        this.setInteractive();
        this.on("pointerdown", this.upgrade, this);       
        this.upgrade_cost = upgrade_cost_calc(this.scene.tentacle_level);
    }
    upgrade() {
        if (this.scene.blood >= this.upgrade_cost) {
            this.scene.blood -= this.upgrade_cost;
            this.scene.tentacle_level += 1;
            
            this.scene.tentacles.children.iterate(function (child) {
                child.attack_damage += 1;
                child.cooldown_length = 3000 - (this.scene.tentacle_level * 100);
            }, this)
        }
    }
    update() {
        this.upgrade_cost = upgrade_cost_calc(this.scene.tentacle_level);
        this.scene.upgrade_text.setText(":" + this.upgrade_cost);
    }
}

const pause_play_states = {
    PLAYING: "0",
    PAUSED: "1",
    STOPPED: "2"
}

class PausePlayButton extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "pause_play_button", 0);
        this.setInteractive();
        this.on("pointerdown", this.on_click_function, this.scene);
        this.play_state = pause_play_states.STOPPED;
    }
    on_click_function() {
        switch (this.pause_button.play_state) {
            case pause_play_states.PLAYING:
                //this.pause_button.play_state = pause_play_states.PAUSED;
                this.scene.pause();
                this.scene.launch("Pause")
                break;
            case pause_play_states.PAUSED:
                this.pause_button.play_state = pause_play_states.PLAYING;
                break;
            case pause_play_states.STOPPED:
                this.pause_button.play_state = pause_play_states.PLAYING;
                this.pause_button.scene.game_started = true;
                break;
        };
        this.pause_button.setFrame(0)
    }
    update() {
        if (this.play_state === pause_play_states.PAUSED) {
            this.setFrame(0)
        } else if (this.play_state === pause_play_states.PLAYING) {
            this.setFrame(1)
        } else if (this.play_state === pause_play_states.STOPPED) {
            this.setFrame(2)
        } else {
            this.setFrame(3)
        };
    }
}

