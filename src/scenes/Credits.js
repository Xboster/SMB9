class Credits extends Phaser.Scene {
    constructor() {
        super("creditsScene");
    }
    init() {}
    preload() {}
    create(data) {
        this.input.mouse.disableContextMenu();

        this.background = this.add
            .tileSprite(0, 0, 1024, 1024, "background")
            .setOrigin(0);
        this.timeSinceMove = 0;
        if (data.backgroundY) {
            this.background.tilePositionY = data.backgroundY;
        }

        // TITLE
        this.add
            .bitmapText(
                game.config.width / 2, // x
                game.config.height / 5, // y
                "VCROSDMono", // key
                "SUPER MEGA\nBLASTEROIDS 9", // text
                63, // size
                1 // align
            )
            .setOrigin(0.5)
            // .setDropShadow(1, 2, "0xFF0000", 123)
            .setCharacterTint(0, -1, true, "0xFFFFFF");

        // Credits
        this.add
            .bitmapText(
                game.config.width / 2, // x
                game.config.height / 2, // y
                "VCROSDMono", // key
                "DIRECTED BY\nLEON NG", // text
                21, // size
                1 // align
            )
            .setOrigin(0.5)
            // .setDropShadow(1, 2, "0xFF0000", 123)
            .setCharacterTint(0, -1, true, "0x00FF00")
            .setCharacterTint(11, -1, true, "0xFFFFFF");

        this.add
            .bitmapText(
                game.config.width / 2, // x
                (game.config.height / 8) * 5, // y
                "VCROSDMono", // key
                "PROGRAMMING AND GRAPHICS\nLEON NG", // text
                21, // size
                1 // align
            )
            .setOrigin(0.5)
            // .setDropShadow(1, 2, "0xFF0000", 123)
            .setCharacterTint(0, -1, true, "0x00FF00")
            .setCharacterTint(24, -1, true, "0xFFFFFF");
        // RETURN TEXT
        this.add
            .bitmapText(
                game.config.width / 2, // x
                (game.config.height / 8) * 7, // y
                "VCROSDMono", // key
                "PRESS SPACE TO GO BACK", // text
                21, // size
                1 // align
            )
            .setOrigin(0.5)
            // .setDropShadow(1, 2, "0xFF0000", 123)
            .setCharacterTint(0, -1, true, "0xFFFFFF");

        this.input.keyboard.on("keydown-SPACE", () => {
            this.scene.start("menuScene", {
                backgroundY: this.background.tilePositionY,
            });
        });
    }
    update(time, delta) {
        this.timeSinceMove += delta;
        if (this.timeSinceMove > 10) {
            this.background.tilePositionY -= 1;
            this.timeSinceMove = 0;
        }
    }
}
