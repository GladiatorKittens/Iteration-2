class LevelClass extends Phaser.Scene {
    constructor(id, blood) {
        super(id);
        this.id = id;
        this.x_array = [];
        this.y_array = [];
        this.blood = 4000;
        this.enemies_spawned = 0;
        this.path = [];
        this.wave_properties = [];    
        this.wave_no = 0;
        this.wave_started = false;
    }
    preload() {
        this.load.spritesheet("Altar", "assets/art/Altar/altar_spritesheet.png", { frameWidth: 23, frameHeight: 23, spacing: 1 });
        this.load.spritesheet("pause_play_button", "assets/art/Buttons/pause_play.png", { frameWidth: 32, frameHeight: 32, spacing: 1 });
        this.load.spritesheet("tentacle", "assets/art/Tentacle/tentacle_spritesheet.png", { frameWidth: 32, frameHeight: 32, spacing: 1 });
        this.load.spritesheet("summon_button", "assets/art/Buttons/confirm_sheet.png", { frameWidth: 32, frameHeight: 32, spacing: 1 });
        this.load.spritesheet("farmer", "assets/art/Enemies/farmer.png", { frameWidth: 32, frameHeight: 32, spacing: 1 });

        this.load.image("tilesheet", "assets/level design/tilesheet.png");
        this.load.tilemapTiledJSON(this.id, ("assets/level design/" + this.id + ".json"));

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
        this.create_path();
        //load in altar
        this.altar = new Altar(this, this.altar_x, this.altar_y, altar_health);
        this.add.existing(this.altar);
        this.altar.setScale(2, 2);
        //text placements
        this.blood_text = this.add.text(820, 490, ": ", { fontSize: "32px", fill: "#fff" });
        this.blood_icon = this.add.image(800, 510, "blood_icon");
        //text icons to indicate what they represent
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
        //creates a temporary tentacle that the player uses to place their tentacles
        this.temp_tentacle = new TentacleClass(3000, 0, 0, this);
        this.temp_tentacle.setInteractive();
        this.temp_tentacle.setActive(false);
        this.add.existing(this.temp_tentacle);
        this.temp_tentacle.setScale(2, 2);
        this.temp_tentacle.setVisible(false);
        this.input.setDraggable(this.temp_tentacle);    //allows the tentacle to be dragged about
        
        this.input.on("drag", function (pointer, object, drag_x, drag_y) {
            object.x = snap_to_grid(drag_x);
            object.y = snap_to_grid(drag_y);
        })
        //creates all the needed physics groups and sets up any needed overlap functions
        this.tentacles = this.physics.add.group();      
        this.enemies = this.physics.add.group();
        this.hit_radii = this.physics.add.group();
        this.physics.add.overlap(this.hit_radii, this.enemies, this.damage_enemy);

        //wave system set-up
        this.no_of_waves = this.wave_properties.length;
        this.wave_text = this.add.text(400, 30, "Wave ", { fontSize: "64px", fill: "#8b0000" });
        this.wave_text.setText("Wave " + (this.wave_no + 1));
        this.current_wave = this.wave_properties[this.wave_no];

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
    create_path() {
        var path = [];
        var temp = 1 / 960;
        for (var i = 0; i <= 1; i += temp) {
            var px = Phaser.Math.Interpolation.CatmullRom(this.x_array, i);
            var py = Phaser.Math.Interpolation.CatmullRom(this.y_array, i);
            this.path.push({ x: px, y: py });
        }
        console.log(this.path)
    }
    update() {
        this.altar.update();
        this.pause_button.update();
        this.tentacles.children.iterate(function (child) {
            child.update();
        });

        if (this.enemies.getFirstAlive() === null && this.enemies.getLength() != 0 && this.current_wave.total_enemies <= this.enemies.getLength()) {
            //wave is completed
            this.enemies.clear(true, true);
            this.tentacles.children.iterate(function (child) {
                child.anims.stop();
                child.anims.play("idle", true);
            })
            this.enemies_spawned = 0;
            this.pause_button.play_state = pause_play_states.STOPPED;
            if (this.wave_no === this.no_of_waves) {
                //level complete! TODO - fix and add end screen
                this.wave_text.setText("You Win!")     
            } else {
                this.wave_no++;
                this.current_wave = this.wave_properties[this.wave_no];
                this.wave_text.setText("Wave " + (this.wave_no + 1))
            }
            this.wave_text.setVisible(true);

        } else if (this.game_started === true) {
            this.spawn_enemy = this.time.addEvent({
                delay: this.current_wave.spawn_speed,
                callback: this.spawn_enemies,
                callbackScope: this,
                repeat: this.current_wave.total_enemies
            });
            this.wave_text.setVisible(false);
            this.game_started = false; //prevents this if statement from running more than once per wave
        } else {
            this.enemies.children.iterate(function (child) {
                child.update();
                if (child.pi >= this.path.length) {
                    child.attack(this.altar);
                    child.setActive(false);
                    child.setVisible(false);
                }
            }, this);
        }

        this.temp_tentacle.update();
        this.blood_text.setText(":" + this.blood);
        this.health_text.setText(":" + this.altar.health);
        this.tentacle_button.update();

    }

    damage_enemy(hit_radius, enemy) {
        if (enemy.active === true) {
            hit_radius.tentacle.attack(enemy);
        }        
    }
    spawn_enemies() {
        if (this.enemies_spawned <= this.current_wave.total_enemies) {
            var new_enemy = new EnemyBaseClass(this.path[0].x, this.path[1].y, 1 * this.current_wave.health_modifier, 15 * this.current_wave.damage_modifier, this, "farmer", 2);
            this.add.existing(new_enemy);
            this.enemies.add(new_enemy);
            this.enemies_spawned++;
        }
    }
    summon_tentacle(object, scene) {
        var summon_cost = purchase_cost_calc(this.tentacles.children.size + 1);

        if (this.tentacle_button.pressed === false && summon_cost < this.blood) {
            this.temp_tentacle.x = this.tentacle_button.x + 64;
            this.temp_tentacle.y = this.tentacle_button.y;
            
            this.temp_tentacle.setActive(true);
            this.temp_tentacle.setVisible(true);
            this.tentacle_button.pressed = true;

        } else if (this.tentacle_button.pressed === true) {
            this.blood -= summon_cost;
            //I need to create the hit area of the tentacle
            var hit_box = this.physics.add.image(this.temp_tentacle.x - 47.5, this.temp_tentacle.y - 47.5, "hit_box");
            hit_box.setCircle(32 * 2);
            
            //summon in an set up the new tentacle
            var tentacle = new TentacleClass(3000, this.temp_tentacle.x, this.temp_tentacle.y, this);
            tentacle.setScale(2, 2);
            tentacle.width = 64;
            tentacle.height = 64;
            hit_box.tentacle = tentacle;
            this.add.existing(tentacle);

            //adds to the groups
            this.hit_radii.add(hit_box);
            this.tentacles.add(tentacle);           

            //reset the tentacle summon button
            this.tentacle_button.pressed = false;
            this.temp_tentacle.setActive(false);
            this.temp_tentacle.setVisible(false);
        } else {
            //do nothing
        }
    }
}
