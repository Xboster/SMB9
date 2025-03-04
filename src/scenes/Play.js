class Play extends Phaser.Scene {
    constructor() {
        super("playScene");

        this.eventEmitter = new Phaser.Events.EventEmitter();
    }
    init() {}
    preload() {
        this.load.path = "./assets/img/";
        this.load.spritesheet("ship", "ship.png", {
            frameWidth: 16,
            frameHeight: 16,
        });

        // this.load.image("tilesetImage", "tileset.png");
        // this.load.tilemapTiledJSON("tilemapJSON", "overworld.json");
        // }
    }
    create() {
        this.add
            .bitmapText(
                game.config.width / 2, // x
                game.config.height / 2, // y
                "VCROSDMono", // key
                "in Play Scene", // text
                21, // size
                1 // align
            )
            .setOrigin(0.5);
        // .setDropShadow(1, 2, "0xFF0000", 123)
        // .setCharacterTint(0, -1, true, "0xff0000");

        this.input.keyboard.on("keydown-ONE", () => {
            this.scene.start("menuScene");
        });
        this.input.keyboard.on("keydown-TWO", () => {
            this.scene.start("playScene");
        });
        this.input.keyboard.on("keydown-THREE", () => {
            this.scene.start("scoresScene");
        });
        this.input.keyboard.on("keydown-FOUR", () => {
            this.scene.start("creditsScene");
        });

        // world bounds
        this.physics.world.setBounds(
            16,
            0,
            game.config.width - 16 * 2,
            game.config.height
        );

        // add ship
        this.ship = this.physics.add
            .sprite(
                game.config.width / 2,
                (game.config.height / 10) * 9,
                "ship",
                0
            )
            .setScale(3)
            .setSize(6, 16);
        this.ship.setCollideWorldBounds();
        // input
        // this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys({
            W: Phaser.Input.Keyboard.KeyCodes.W,
            A: Phaser.Input.Keyboard.KeyCodes.A,
            S: Phaser.Input.Keyboard.KeyCodes.S,
            D: Phaser.Input.Keyboard.KeyCodes.D,
            Q: Phaser.Input.Keyboard.KeyCodes.Q,
            E: Phaser.Input.Keyboard.KeyCodes.E,
        });
    }
    update(time, delta) {
        // ship movement
        // left/right
        this.direction = new Phaser.Math.Vector2(0);
        if (this.keys.A.isDown) {
            this.direction.x = -1;
        } else if (this.keys.D.isDown) {
            this.direction.x = 1;
        }
        // up/down
        // if (this.cursors.up.isDown) {
        //     this.direction.y = -1;
        // } else if (this.cursors.down.isDown) {
        //     this.direction.y = 1;
        // }
        // turn
        if (this.keys.Q.isDown) {
            this.ship.angle = this.ship.angle - 1;
        } else if (this.keys.E.isDown) {
            this.ship.angle = this.ship.angle + 1;
        }

        this.direction.normalize();
        this.ship.setVelocity(300 * this.direction.x, 300 * this.direction.y);
    }
}
