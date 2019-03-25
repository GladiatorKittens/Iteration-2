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
        //TODO - pause and resume game
        switch (this.pause_button.play_state) {
            case pause_play_states.PLAYING:
                this.pause_button.play_state = pause_play_states.PAUSED;
                break;
            case pause_play_states.PAUSED:
                this.pause_button.play_state = pause_play_states.PLAYING;
                break;
            case pause_play_states.STOPPED:
                this.pause_button.play_state = pause_play_states.PLAYING;
                this.pause_button.scene.game_started = true;
                break;
        };      
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

