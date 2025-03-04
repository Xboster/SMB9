class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }
    init() {}
    preload() {
        this.load.path = "./assets/";
        // Load Sprites

        // Load Sounds
        // this.load.audio("backgroundMusic", "song.wav");

        // Load Font
        this.load.bitmapFont(
            "VCROSDMono",
            "font/VCROSDMono.png",
            "font/VCROSDMono.xml"
        );
        this.load.image("background", "img/stars.png");
    }
    create() {
        // this.scale.setGameSize(720, 540);

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
    }
    update() {
        this.time.delayedCall(30, () => {
            this.scene.start("menuScene");
        });
        this.background.tilePositionY -= 0;
    }
}
