class StartScreen extends Phaser.Scene {
    constructor() {
        super("StartScreen");
        this.tutorial_visible = false;
    }
    preload() {
        this.load.image("start_button", "assets/art/Buttons/start_button.png");
        this.load.image("tutorial_button", "assets/art/Buttons/tutorial_button.png")
        this.load.image("tutorial", "assets/other/rsz_tutorial.png");
    }
    create() {
        var start_button = new Button(450, 250, "start_button", function () { this.scene.start("Level_1") }, this);
        //this.tutorial_image
        var tutorial_button = new Button(450, 350, "tutorial_button", function () {
            this.tutorial.image.setActive(true);
            this.tutorial.image.setVisible(true);
            this.tutorial_visible = true;
        }, this);

        this.tutorial = new Button(480, 272, "tutorial", function () {
            this.tutorial.image.setActive(false);
            this.tutorial.image.setVisible(false);
            this.tutorial_visible = false;
        }, this);
        this.tutorial.image.setActive(false);
        this.tutorial.image.setVisible(false);
    }
    update() {
        
    }
}
class GameOver extends Phaser.Scene {
    constructor() {
        super("GameOver");
    }
    preload() {
        this.load.image("start_button", "assets/art/Buttons/start_button.png");
    }
    create() {
        this.game_over_text = this.add.text(100, 100, "Thanks for playing!", { fontSize: "64px", fill: "#fff" });
        this.new_game_text = this.add.text(100, 200, " To play another refresh the page.", { fontSize: "32px", fill: "#fff" });
    }
    update() {

    }
}