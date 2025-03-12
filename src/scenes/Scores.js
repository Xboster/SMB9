class Scores extends Phaser.Scene {
    constructor() {
        super("scoresScene");
    }
    init() {}
    preload() {}
    create(data) {
        this.input.mouse.disableContextMenu();

        this.scores = ["1", "2", "3"];

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
                game.config.height / 8, // y
                "VCROSDMono", // key
                "HIGH SCORES", // text
                63, // size
                1 // align
            )
            .setOrigin(0.5)
            // .setDropShadow(1, 2, "0xFF0000", 123)
            .setCharacterTint(0, -1, true, "0xFFFFFF");
        // SCORES
        this.add
            .bitmapText(
                game.config.width / 8, // x
                (game.config.height / 8) * 2, // y
                "VCROSDMono", // key
                "1", // text
                42, // size
                1 // align
            )
            .setOrigin(0.5)
            // .setDropShadow(1, 2, "0xFF0000", 123)
            .setCharacterTint(0, -1, true, "0xFFFFFF");
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
