class Scores extends Phaser.Scene {
    constructor() {
        super("scoresScene");
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

        this.scrollPos = 0;

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
        // BOTTOM TEXT
        this.add
            .bitmapText(
                game.config.width / 2, // x
                (game.config.height / 8) * 7, // y
                "VCROSDMono", // key
                "USE W/S OR UP/DOWN TO SCROLL UP AND DOWN\nPRESS SPACE TO GO BACK", // text
                21, // size
                1 // align
            )
            .setOrigin(0.5)
            // .setDropShadow(1, 2, "0xFF0000", 123)
            .setCharacterTint(0, -1, true, "0xFFFFFF");

        this.scores = this.loadFile();

        this.sortedScores = Array.from(this.scores.entries()).sort(
            (a, b) => b[1] - a[1]
        );
        // this.sortedMap = new Map(this.sortedScores);

        // this.saveFile(this.sortedMap);
        // console.log(this.sortedScores);

        const scoreArea = this.add
            .rectangle(
                0,
                game.config.height / 5,
                720,
                (game.config.height / 10) * 6,
                0xffffff
            )
            .setOrigin(0, 0)
            .setVisible(false);

        const mask = scoreArea.createBitmapMask();

        // SCORES
        this.scoresText = this.add.group();
        this.sortedScores.forEach((nameScore, index) => {
            // RANK
            this.scoresText.add(
                this.add
                    .bitmapText(
                        game.config.width / 8 + 3, // x
                        (game.config.height / 8) * 2 + index * 48, // y
                        "VCROSDMono", // key
                        index + 1, // text
                        21, // size
                        2 // align
                    )
                    .setOrigin(1, 0)
                    .setCharacterTint(0, -1, true, "0xFFFFFF")
            );
            // SUFFIX
            this.scoresText.add(
                this.add
                    .bitmapText(
                        game.config.width / 8 + 2, // x
                        (game.config.height / 8) * 2 + index * 48 + 1, // y
                        "VCROSDMono", // key
                        this.getSuffix(index + 1), // text
                        21 / 2, // size
                        0 // align
                    )
                    .setCharacterTint(0, -1, true, "0xFFFFFF")
            );
            // NAME
            this.scoresText.add(
                this.add
                    .bitmapText(
                        game.config.width / 8 + 24, // x
                        (game.config.height / 8) * 2 + index * 48, // y
                        "VCROSDMono", // key
                        nameScore[0], // text
                        21, // size
                        0 // align
                    )
                    .setCharacterTint(0, -1, true, "0xFFFFFF")
            );
            // SCORE
            this.scoresText.add(
                this.add
                    .bitmapText(
                        (game.config.width / 8) * 7, // x
                        (game.config.height / 8) * 2 + index * 48, // y
                        "VCROSDMono", // key
                        nameScore[1], // text
                        21, // size
                        3 // align
                    )
                    .setOrigin(1, 0)
                    .setCharacterTint(0, -1, true, "0xFFFFFF")
            );
        });
        this.scoresText.getChildren().forEach((text) => {
            text.setMask(mask);
        });

        cursors = this.input.keyboard.createCursorKeys();
        keys = this.input.keyboard.addKeys({
            W: Phaser.Input.Keyboard.KeyCodes.W,
            S: Phaser.Input.Keyboard.KeyCodes.S,
            SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
        });
    }
    update(time, delta) {
        this.timeSinceMove += delta;
        if (this.timeSinceMove > 10) {
            this.background.tilePositionY -= 1;
            this.timeSinceMove = 0;
        }
        if (Phaser.Input.Keyboard.JustDown(keys.SPACE)) {
            this.scene.start("menuScene", {
                backgroundY: this.background.tilePositionY,
            });
        }

        if ((keys.W.isDown || cursors.up.isDown) && this.scrollPos > 0) {
            this.scoresText.getChildren().forEach((text) => {
                text.y += 2;
            });
            this.scrollPos -= 2;
        }
        if (
            (keys.S.isDown || cursors.down.isDown) &&
            this.scrollPos < this.sortedScores.length * 48 - 6 * 48
        ) {
            this.scoresText.getChildren().forEach((text) => {
                text.y -= 2;
            });
            this.scrollPos += 2;
        }
    }

    saveFile(file) {
        localStorage.setItem(
            "scores",
            JSON.stringify(Object.fromEntries(file))
        );
    }
    loadFile() {
        return new Map(
            Object.entries(JSON.parse(localStorage.getItem("scores")))
        );
    }

    getSuffix(rank) {
        let suffix = "th";

        if (rank % 10 === 1 && rank % 100 !== 11) {
            suffix = "st";
        } else if (rank % 10 === 2 && rank % 100 !== 12) {
            suffix = "nd";
        } else if (rank % 10 === 3 && rank % 100 !== 13) {
            suffix = "rd";
        }

        return suffix.toUpperCase();
    }
}
