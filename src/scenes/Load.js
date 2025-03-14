class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }
    init() {}
    preload() {
        // Load Audio
        this.load.path = "./assets/audio/";
        // this.load.audio("backgroundMusic", "song.wav");
        this.load.audio("sfx-shoot", "Laser_shoot 42.wav");
        this.load.audio("sfx-explosion1", "Explosion 2.wav");
        this.load.audio("sfx-explosion2", "Explosion 2(3).wav");
        this.load.audio("sfx-explosion3", "Explosion 2(2).wav");

        // Load Fonts
        this.load.path = "./assets/font/";
        this.load.bitmapFont("VCROSDMono", "VCROSDMono.png", "VCROSDMono.xml");

        // Load Images
        this.load.path = "./assets/img/";

        this.load.spritesheet("ship", "ship.png", {
            frameWidth: 48,
            frameHeight: 48,
        });
        this.load.spritesheet("alien", "alien.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet("laser", "laser.png", {
            frameWidth: 64,
            frameHeight: 64,
        });

        this.load.image("asteroid", "asteroid.png");
        this.load.image("blast", "blast.png");
        this.load.image("background", "stars.png");
    }
    create() {
        this.background = this.add
            .tileSprite(0, 0, 1024, 1024, "background")
            .setOrigin(0, 0);

        this.add
            .bitmapText(
                game.config.width / 2, // x
                game.config.height / 4, // y
                "VCROSDMono", // key
                "SUPER MEGA\nBLASTEROIDS 9", // text
                63, // size
                1 // align
            )
            .setOrigin(0.5)
            .setCharacterTint(0, -1, true, "0xFFFFFF");

        this.add
            .bitmapText(
                game.config.width / 2, // x
                (game.config.height / 3) * 2, // y
                "VCROSDMono", // key
                "LOADING...", // text
                42, // size
                1 // align
            )
            .setOrigin(0.5)
            .setCharacterTint(0, -1, true, "0xFFFFFF");

        this.anims.create({
            key: "idle",
            frames: this.anims.generateFrameNumbers("alien", {
                start: 0,
                end: 1,
            }),
            frameRate: 10,
            repeat: -1,
        });
        this.chargeLaser = this.anims.create({
            key: "charge",
            frames: this.anims.generateFrameNumbers("laser", {
                start: 0,
                end: 6,
            }),
            frameRate: 10,
            repeat: 0,
        });
        this.fireLaser = this.anims.create({
            key: "fire",
            frames: this.anims.generateFrameNumbers("laser", {
                start: 6,
                end: 8,
            }),
            frameRate: 10,
            repeat: 0,
        });
    }
    update() {
        this.time.delayedCall(300, () => {
            this.scene.start("menuScene");
        });
        // this.background.tilePositionY -= 1;
    }
}
