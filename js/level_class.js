class LevelClass extends Phaser.Scene {
    constructor(id, blood, max_enemies) {
        super(id);
        this.id = id;
        this.max_enemies = max_enemies;
        this.x_array = this.y_array = [];
        this.blood = 400000;
    }
    preload() {
        this.load.spritesheet("Altar", "assets/art/Altar/altar_spritesheet.png", { frameWidth: 23, frameHeight: 23, spacing: 1 });
        this.load.spritesheet("pause_play_button", "assets/art/Buttons/pause_play.png", { frameWidth: 32, frameHeight: 32, spacing: 1 });
        this.load.spritesheet("tentacle", "assets/art/Tentacle/tentacle_spritesheet.png", { frameWidth: 32, frameHeight: 32, spacing: 1 });
        this.load.spritesheet("summon_button", "assets/art/Buttons/confirm_sheet.png", { frameWidth: 32, frameHeight: 32, spacing: 1 });

        this.load.image("tilesheet", "assets/level design/tilesheet.png");
        this.load.tilemapTiledJSON(this.id, ("assets/level design/" + this.id + ".json"));

        this.load.image("blank_button", "assets/art/Buttons/confirm.png");
        this.load.image('troop_button', 'assets/art/Buttons/troop_button.png');
        this.load.image("troop_background", "assets/art/UI/troop_menu_background.png");
        this.load.image("blood_icon", "assets/art/UI/blood_icon.png");
        this.load.image("health_icon", "assets/art/UI/health_icon.png");
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
        //text placements
        this.blood_text = this.add.text(820, 490, ": ", { fontSize: "32px", fill: "#fff" });
        this.blood_icon = this.add.image(800, 510, "blood_icon");

        this.health_text = this.add.text(670, 490, ": ", { fontSize: "32px", fill: "#fff" });
        this.health_icon = this.add.image(650, 510, "health_icon");
        //create the pause button
        this.pause_button = new PausePlayButton(this, 50, 500); //as the pause button uses a spritesheet, it cant use the button class
        this.pause_button.setScale(2, 2);
        this.add.existing(this.pause_button);
        //creates the button the player can use to summon a tentacle
        this.tentacle_button = new SpriteButton(132, 500, "summon_button", this.summon_tentacle, this);
        this.tentacle_button.setScale(2, 2);
        this.add.existing(this.tentacle_button);

        this.temp_tentacle = new TentacleClass(0, 0, 0, this);
        this.temp_tentacle.setInteractive();
        this.temp_tentacle.setActive(false);
        this.add.existing(this.temp_tentacle);
        this.temp_tentacle.setScale(2, 2);
        this.temp_tentacle.setVisible(false);
        this.input.setDraggable(this.temp_tentacle);

        this.input.on("drag", function (pointer, object, drag_x, drag_y) {
            object.x = drag_x;
            object.y = drag_y;
        })

        this.tentacles = this.physics.add.group();        
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
        this.tentacles.children.iterate(function (child) {
            child.update();
        });
        this.temp_tentacle.update();
        this.blood_text.setText(":" + this.blood);
        this.health_text.setText(":" + this.altar.health);
        this.tentacle_button.update();
    }
    summon_tentacle(object, scene) {
        var summon_cost = purchase_cost_calc(this.tentacles.children.size + 1);

        if (this.tentacle_button.pressed === false && summon_cost < this.blood) {
            this.temp_tentacle.x = this.tentacle_button.x + 64;
            this.temp_tentacle.y = this.tentacle_button.y;
            
            this.temp_tentacle.setActive(true);
            this.temp_tentacle.setVisible(true);
            this.tentacle_button.pressed = true;

            //this.tentacle_button.setTexture(new frame);

        } else if (this.tentacle_button.pressed === true) {
            this.blood -= summon_cost;
            //snap tentacle to grid
            this.temp_tentacle.x = snap_to_grid(this.temp_tentacle.x);
            this.temp_tentacle.y = snap_to_grid(this.temp_tentacle.y);
            //summon in an set up the new tentacle
            var tentacle = new TentacleClass(3, this.temp_tentacle.x, this.temp_tentacle.y, this);
            tentacle.setScale(2, 2);
            tentacle.width = 64;
            tentacle.height = 64;
            this.add.existing(tentacle);
            //I need to create the hit area of the tentacle
            this.tentacles.add(tentacle);
            this.tentacle_button.pressed = false;
            //reset the tentacle summon button
            //this.tentacle_button.setTexture(original frame); //need to change the button type
            this.temp_tentacle.setActive(false);
            this.temp_tentacle.setVisible(false);
        } else {
            //do nothing
        }
    }
}
