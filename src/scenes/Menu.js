class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }
    init() {
        this.saveFile();
    }
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
        // asteroids ------------------------------------------------------------------
        this.asteroids = [];
        for (let i = 0; i < 64; i++) {
            const asteroid = new Asteroid(this, 0, 0, "asteroid", {
                isSensor: true,
            });
            asteroid.setInteractive({ useHandCursor: true });
            asteroid.on("pointerdown", () => {
                asteroid.anims.play("idle");
                asteroid.preFX.clear();
                asteroid.preFX.addGlow(0x00ff00, 1, 0, false);
            });
            this.asteroids.push(asteroid);
        }
        this.lastSpawned = 0;
        this.spawnInterval = 500;

        this.option = ["PLAY ", "SCORES ", "CREDITS "];
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

        this.playTxt.setInteractive({ useHandCursor: true });
        this.scoresTxt.setInteractive({ useHandCursor: true });
        this.creditsTxt.setInteractive({ useHandCursor: true });

        cursors = this.input.keyboard.createCursorKeys();
        keys = this.input.keyboard.addKeys({
            W: Phaser.Input.Keyboard.KeyCodes.W,
            S: Phaser.Input.Keyboard.KeyCodes.S,
            SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
        });

        this.menuSelection = 0;
        this.buttonPressed = false;
        this.sfxSelect = this.sound.add("sfx-select");
    }
    update(time, delta) {
        this.timeSinceMove += delta;
        if (this.timeSinceMove > 10) {
            this.background.tilePositionY -= 1;
            this.timeSinceMove = 0;
        }

        if (
            Phaser.Input.Keyboard.JustDown(keys.W) ||
            Phaser.Input.Keyboard.JustDown(cursors.up)
        ) {
            if (this.menuSelection > 0) {
                this.menuSelection -= 1;
                this.sfxSelect.play();
            }
        }
        if (
            Phaser.Input.Keyboard.JustDown(keys.S) ||
            Phaser.Input.Keyboard.JustDown(cursors.down)
        ) {
            if (this.menuSelection < this.option.length - 1) {
                this.menuSelection += 1;
                this.sfxSelect.play();
            }
        }

        this.playTxt.on("pointerover", () => {
            if (this.menuSelection != 0) {
                this.sfxSelect.play();
            }
            this.menuSelection = 0;
        });

        this.scoresTxt.on("pointerover", () => {
            if (this.menuSelection != 1) {
                this.sfxSelect.play();
            }
            this.menuSelection = 1;
        });

        this.creditsTxt.on("pointerover", () => {
            if (this.menuSelection != 2) {
                this.sfxSelect.play();
            }
            this.menuSelection = 2;
        });

        this.playTxt.on("pointerdown", () => {
            this.buttonPressed = true;
        });

        this.scoresTxt.on("pointerdown", () => {
            this.buttonPressed = true;
        });

        this.creditsTxt.on("pointerdown", () => {
            this.buttonPressed = true;
        });

        if (this.menuSelection == 0) {
            this.playTxt.setText(">PLAY");
        } else {
            this.playTxt.setText(" PLAY");
        }
        if (this.menuSelection == 1) {
            this.scoresTxt.setText(">SCORES");
        } else {
            this.scoresTxt.setText(" SCORES");
        }
        if (this.menuSelection == 2) {
            this.creditsTxt.setText(">CREDITS");
        } else {
            this.creditsTxt.setText(" CREDITS");
        }

        if (Phaser.Input.Keyboard.JustDown(keys.SPACE) || this.buttonPressed) {
            this.sound.play("sfx-select2");
            if (this.menuSelection == 0) {
                this.scene.start("playScene", {
                    backgroundY: this.background.tilePositionY,
                });
            }
            if (this.menuSelection == 1) {
                this.scene.start("scoresScene", {
                    backgroundY: this.background.tilePositionY,
                });
            }
            if (this.menuSelection == 2) {
                this.scene.start("creditsScene", {
                    backgroundY: this.background.tilePositionY,
                });
            }
        }

        if (this.lastSpawned > this.spawnInterval) {
            const asteroid = this.asteroids.find(
                (asteroid) => !asteroid.active
            );
            if (asteroid) {
                asteroid.spawn(
                    asteroid.width / 2 +
                        Math.random() * (game.config.width - asteroid.width),
                    -100,
                    (Math.PI * 2) / 4,
                    3
                );
                this.lastSpawned = 0;
                asteroid.setTexture("asteroid");
                asteroid.stop();
                asteroid.preFX.clear();
            }
        }
        this.lastSpawned += delta;
    }
    saveFile() {
        var file = {
            LEON: 149300,
            COCO: 225000,
            WILT: 215000,
            FRANKIE: 205000,
            HERRIMAN: 200000,
            "MADAME FOSTER": 150000,
            "STINKY THE BAD AT VIDEO GAMES GUY": 123000,
            EDUARDO: 121000,
            BLOO: 91000,
            MAC: 90000,
        };
        if (!localStorage.getItem("scores")) {
            localStorage.setItem("scores", JSON.stringify(file));
            localStorage.setItem("completedTutorial", false);
        }
    }
    loadFile() {
        var file = JSON.parse(localStorage.getItem("scores"));
        this.scene.score = file.score;
        this.scene.visits = file.visits;
    }

    updateFile(score) {
        var file = JSON.parse(localStorage.getItem("scores"));
        console.log(file);
        file.push({
            names: name,
            scores: score,
        });
        localStorage.setItem("scores", JSON.stringify(file));
    }
}
