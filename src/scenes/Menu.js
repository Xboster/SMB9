class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }
    init() {}
    preload() {}
    create() {
        // width: 720,
        // height: 540,
        // this.scale.setGameSize(720, 540);

        this.background = this.add
            .tileSprite(0, 0, 1024, 1024, "background")
            .setOrigin(0);

        var option = ["Play", "Scores", "Credits"];
        // TITLE
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
            // .setDropShadow(1, 2, "0xFF0000", 123)
            .setCharacterTint(0, -1, true, "0xFFFFFF");

        // PLAY
        this.add
            .bitmapText(
                game.config.width / 3 + 21, // x
                (game.config.height / 10) * 6, // y
                "VCROSDMono", // key
                option[0], // text
                42 // size
            )
            .setCharacterTint(0, -1, true, "0xFFFFFF");

        // SCORES
        this.add
            .bitmapText(
                game.config.width / 3 + 21, // x
                (game.config.height / 10) * 7, // y
                "VCROSDMono", // key
                option[1], // text
                42 // size
            )
            .setCharacterTint(0, -1, true, "0xFFFFFF");

        // CREDITS
        this.add
            .bitmapText(
                game.config.width / 3 + 21, // x
                (game.config.height / 10) * 8, // y
                "VCROSDMono", // key
                option[2], // text
                42 // size
            )
            .setCharacterTint(0, -1, true, "0xFFFFFF");

        this.input.keyboard.on("keydown-ONE", () => {
            this.scene.start("menuScene");
        });
        this.input.keyboard.on("keydown-TWO", () => {
            this.scene.start("playScene", {backgroundY: this.background.tilePositionY});
        });
        this.input.keyboard.on("keydown-THREE", () => {
            this.scene.start("scoresScene");
        });
        this.input.keyboard.on("keydown-FOUR", () => {
            this.scene.start("creditsScene");
        });

        // this.input.keyboard.on("keydown-SPACE", () => {
        //     // this.scene.start("creditsScene");
        //     this.sound.play("sfx-shoot");
        // });
        this.timeSinceMove = 0;
    }
    update(time, delta) {
        this.timeSinceMove += delta;
        if (this.timeSinceMove > 10) {
            this.background.tilePositionY -= 1;
            this.timeSinceMove = 0;
            console.log(this.background.tilePositionY);
        }
    }
}
