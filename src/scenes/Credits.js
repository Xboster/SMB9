class Credits extends Phaser.Scene {
    constructor() {
        super("creditsScene");
    }
    init() {}
    preload() {}
    create() {
        this.add
            .bitmapText(
                game.config.width / 2, // x
                game.config.height / 2, // y
                "VCROSDMono", // key
                "in Credits Scene", // text
                21, // size
                1 // align
            )
            .setOrigin(0.5)
            // .setDropShadow(1, 2, "0xFF0000", 123)
            .setCharacterTint(0, -1, true, "0xff0000");
        this.input.keyboard.on("keydown-SPACE", () => {
            this.scene.start("menuScene");
        });
    }
    update() {}
}
