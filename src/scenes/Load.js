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
        this.load.bitmapFont("VCROSDMono", "VCROSDMono.png", "VCROSDMono.xml");
    }
    create() {
        this.scale.setGameSize(720, 540);

        this.add
            .bitmapText(
                game.config.width / 2, // x
                game.config.height / 4, // y
                "VCROSDMono", // key
                "SUPER MEGA\nBLASTEROIDS 9", // text
                63, // size
                1 // align
            )
            .setOrigin(0.5);

        this.add
            .bitmapText(
                game.config.width / 2, // x
                (game.config.height / 3) * 2, // y
                "VCROSDMono", // key
                "LOADING...", // text
                42, // size
                1 // align
            )
            .setOrigin(0.5);
    }
    update() {
        this.time.delayedCall(300, () => {
            this.scene.start("menuScene");
        });
    }
}
