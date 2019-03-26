class LevelClass extends Phaser.Scene {
    constructor(id, blood, max_enemies) {
        super(id);
        this.id = id;
        this.max_enemies = max_enemies;
        this.x_array = this.y_array = [];
        this.blood = 400000;
    }
    preload() {
        this.load.spritesheet("Altar", "assets/art/Altar/altar_spritesheet.png", { frameWidth: 23, frameHeight: 23, margin: 1 });
        this.load.spritesheet("pause_play_button", "assets/art/Buttons/pause_play.png", { frameWidth: 32, frameHeight: 32, margin: 1 });
        this.load.spritesheet("tentacle", "assets/art/Tentacle/tentacle_spritesheet.png", { frameWidth: 32, frameHeight: 32, margin: 1 });

        this.load.image("tilesheet", "assets/level design/tilesheet.png");
        this.load.tilemapTiledJSON(this.id, ("assets/level design/" + this.id + ".json"));

        this.load.image("blank_button", "assets/art/Buttons/confirm.png");
        this.load.image('troop_button', 'assets/art/Buttons/troop_button.png');
        this.load.image("troop_background", "assets/art/UI/troop_menu_background.png");
    }
    create(altar_health) {
        //load in anims if level 1
        if (this.id == "Level_1") { create_anims.call(this); }
        //load in map values
        this.create_tilemap();
        this.load_path_values();
        //load in altar
        this.altar = new Altar(this, this.altar_x, this.altar_y, altar_health);
        this.add.existing(this.altar);
        this.altar.setScale(2, 2);   
        //create the pause button
        this.pause_button = new PausePlayButton(this, 50, 500); //as the pause button uses a spritesheet, it cant use the button class
        this.pause_button.setScale(2, 2);
        this.add.existing(this.pause_button);
        //creates the button the player can use to summon a tentacle
        this.tentacle_button = new Button(132, 500, "blank_button", this.summon_tentacle, this)
        this.tentacle_button.image.setScale(2, 2);
        

        this.tentacles = this.physics.add.group();
        console.log(this.tentacles)
        
    }
    create_tilemap() {
        this.map = this.make.tilemap({ key: this.id });
        this.tileset = this.map.addTilesetImage("tilesheet", "tilesheet", 32, 32, 0, 1);
        this.map.createStaticLayer("bg", this.tileset, 0, 0);
    }
    load_path_values() {
        this.map.findObject("objects", function (object) {
            if (object.type === "path") {
                this.x_array.push(object.x);
                this.y_array.push(object.y);
            }
        }, this)
        this.map.findObject("objects", function (object) {
            if (object.type === "Altar") {
                this.altar_x = object.x;
                this.altar_y = object.y;
            }
        }, this)
    }
    update() {
        this.altar.update();
        this.pause_button.update();
        
    }
    summon_tentacle(object, scene) {
        var summon_cost = purchase_cost_calc(this.tentacles.children.size + 1);
        if (summon_cost < this.blood) {
            this.blood -= summon_cost;
            var tentacle = new TentacleClass(3, object.x, object.y, this);
            tentacle.setScale(2, 2);
            //I need to create the hit area of the tentacle
            this.tentacles.add(tentacle);
            console.log(this.tentacles)
        }
    }
}
