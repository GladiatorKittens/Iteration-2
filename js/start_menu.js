class StartScreen extends Phaser.Scene {
    constructor() {
        super("StartScreen");
        this.id = "StartScreen";
    }
    preload() {
        this.load.image("start_button", "assets/art/Buttons/start_button.png");
    }
    create() {
        var start_button = new Button(450, 250, "start_button", function () { this.scene.start("Level_1")}, this);
    }
}