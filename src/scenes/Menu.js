class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }
    init() {}
    preload() {}
    create(data) {
        this.input.mouse.disableContextMenu();
        // width: 720,
        // height: 540,
        // this.scale.setGameSize(720, 540);

        this.background = this.add
            .tileSprite(0, 0, 1024, 1024, "background")
            .setOrigin(0);
        if (data.backgroundY) {
            this.background.tilePositionY = data.backgroundY;
        }

        this.option = ["Play ", "Scores ", "Credits "];
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
        this.playTxt = this.add
            .bitmapText(
                game.config.width / 3 + 21, // x
                (game.config.height / 10) * 6, // y
                "VCROSDMono", // key
                this.option[0], // text
                42 // size
            )
            .setCharacterTint(0, -1, true, "0xFFFFFF");

        // SCORES
        this.scoresTxt = this.add
            .bitmapText(
                game.config.width / 3 + 21, // x
                (game.config.height / 10) * 7, // y
                "VCROSDMono", // key
                this.option[1], // text
                42 // size
            )
            .setCharacterTint(0, -1, true, "0xFFFFFF");

        // CREDITS
        this.creditsTxt = this.add
            .bitmapText(
                game.config.width / 3 + 21, // x
                (game.config.height / 10) * 8, // y
                "VCROSDMono", // key
                this.option[2], // text
                42 // size
            )
            .setCharacterTint(0, -1, true, "0xFFFFFF");

        keys = this.input.keyboard.addKeys({
            W: Phaser.Input.Keyboard.KeyCodes.W,
            S: Phaser.Input.Keyboard.KeyCodes.S,
            SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
        });

        this.timeSinceMove = 0;
        this.menuSelection = 0;
    }
    update(time, delta) {
        this.timeSinceMove += delta;
        if (this.timeSinceMove > 10) {
            this.background.tilePositionY -= 1;
            this.timeSinceMove = 0;
            // console.log(this.background.tilePositionY);
        }

        // this.playTxt = this.option[0];
        // this.scoresTxt = this.option[1];
        // this.creditsTxt = this.option[2];

        if (Phaser.Input.Keyboard.JustDown(keys.W)) {
            if (this.menuSelection > 0) {
                this.menuSelection -= 1;
                // console.log(this.option[this.menuSelection]);
            }
        }
        if (Phaser.Input.Keyboard.JustDown(keys.S)) {
            if (this.menuSelection < this.option.length - 1) {
                this.menuSelection += 1;
                // console.log(this.option[this.menuSelection]);
            }
        }
        if (this.menuSelection == 0) {
            this.playTxt.setText(">Play");
        } else {
            this.playTxt.setText(" Play");
        }
        if (this.menuSelection == 1) {
            this.scoresTxt.setText(">Scores");
        } else {
            this.scoresTxt.setText(" Scores");
        }
        if (this.menuSelection == 2) {
            this.creditsTxt.setText(">Credits");
        } else {
            this.creditsTxt.setText(" Credits");
        }

        if (Phaser.Input.Keyboard.JustDown(keys.SPACE)) {
            if (this.menuSelection == 0) {
                this.scene.start("playScene", {
                    backgroundY: this.background.tilePositionY,
                });
            }
            if (this.menuSelection == 1) {
                this.scene.start("scoresScene");
            }
            if (this.menuSelection == 2) {
                this.scene.start("creditsScene");
            }
        }
    }
}
