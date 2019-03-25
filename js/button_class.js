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