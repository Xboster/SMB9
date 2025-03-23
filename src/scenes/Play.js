class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    init() {}
    preload() {}
    create(data) {
        this.input.mouse.disableContextMenu();
        // background
        this.background = this.add
            .tileSprite(0, 0, 1024, 1024, "background")
            .setOrigin(0, 0);
        this.background.tilePositionY = data.backgroundY;
        this.timeSinceMove = 0;

        // input ------------------------------------------------------------------
        cursors = this.input.keyboard.createCursorKeys();
        keys = this.input.keyboard.addKeys({
            W: Phaser.Input.Keyboard.KeyCodes.W,
            A: Phaser.Input.Keyboard.KeyCodes.A,
            S: Phaser.Input.Keyboard.KeyCodes.S,
            D: Phaser.Input.Keyboard.KeyCodes.D,
            Q: Phaser.Input.Keyboard.KeyCodes.Q,
            E: Phaser.Input.Keyboard.KeyCodes.E,
            SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
        });

        // collisions
        this.alienCollisionCategory = this.matter.world.nextCategory();
        this.asteroidCollisionCategory = this.matter.world.nextCategory();
        this.blastCollisionCategory = this.matter.world.nextCategory();
        this.shipCollisionCategory = this.matter.world.nextCategory();
        this.laserCollisionCategory = this.matter.world.nextCategory();

        // add ship ------------------------------------------------------------------
        this.shipSpawnPoint = new Phaser.Math.Vector2(
            game.config.width / 2,
            (game.config.height / 20) * 19
        );
        this.ship = new Ship(this, 0, 0, "ship");
        this.ship.anims.play("shipOn");
        this.ship.setCollisionCategory(this.shipCollisionCategory);
        // this.ship.setCollidesWith([]);
        this.ship.spawn(this.shipSpawnPoint.x, this.shipSpawnPoint.y);
        // add laser

        // basic aliens ------------------------------------------------------------------
        this.aliens = [];
        for (let i = 0; i < 256; i++) {
            const alien = new Alien(this, 0, 0, "alien", {
                isSensor: true,
                shape: {
                    type: "rectangle",
                    width: 22,
                    height: 18,
                },
                chamfer: {
                    radius: [8, 8, 0, 0],
                },
            }).setOrigin(0.5, 0.5);

            alien.anims.play("idle");
            alien.setDataEnabled();
            alien.setData("mother", false);
            alien.setData("swarm", false);
            alien.preFX.addGlow(0x00ff00, 1, 0, false);

            alien.setCollisionCategory(this.alienCollisionCategory);
            alien.setCollidesWith([
                this.shipCollisionCategory,
                this.laserCollisionCategory,
            ]);

            this.aliens.push(alien);
        }

        // alien Swarm ------------------------------------------------------------------
        this.alienSwarm = [];
        for (let i = 0; i < 256; i++) {
            const smallAlien = new Alien(this, 0, 0, "alien", {
                isSensor: true,
                shape: {
                    type: "rectangle",
                    width: 22,
                    height: 18,
                },
                chamfer: {
                    radius: [8, 8, 0, 0],
                },
            }).setOrigin(0.5, 0.5);

            smallAlien.anims.play("idle");

            smallAlien.setDataEnabled();
            smallAlien.setData("mother", false);
            smallAlien.setData("swarm", false);
            smallAlien.preFX.addGlow(0x00ff00, 1, 0, false);

            smallAlien.setCollisionCategory(this.alienCollisionCategory);
            smallAlien.setCollidesWith([
                this.alienCollisionCategory,
                this.shipCollisionCategory,
                this.blastCollisionCategory,
                this.laserCollisionCategory,
            ]);

            this.alienSwarm.push(smallAlien);
        }

        // asteroids ------------------------------------------------------------------
        this.asteroids = [];
        for (let i = 0; i < 256; i++) {
            const asteroid = new Asteroid(this, 0, 0, "asteroid", {
                isSensor: true,
                shape: {
                    type: "polygon",
                    radius: 14,
                    sides: 6,
                },
            });

            asteroid.setCollisionCategory(this.asteroidCollisionCategory);
            asteroid.setCollidesWith([
                this.shipCollisionCategory,
                this.blastCollisionCategory,
            ]);

            this.asteroids.push(asteroid);
        }

        // UI TEXT
        this.scoreTxt = this.add
            .bitmapText(
                20, // x
                10, // y
                "VCROSDMono", // key
                "score: ", // text
                21, // size
                1 // align
            )
            .setOrigin(0)
            // .setDropShadow(1, 2, "0xFF0000", 123)
            .setCharacterTint(0, -1, true, "0x00ff00");

        // UI Lives
        this.lives = [];
        for (let i = 1; i <= this.ship.lives; i++) {
            this.lives.push(
                this.add
                    .image(game.config.width - 20 * i, 20, "ship", 3)
                    .setAngle(-90)
                    .setScale(1 / 3)
                    .setTint(0xff0000)
            );
        }
        this.tutorialText = this.add
            .bitmapText(
                game.config.width / 2, // x
                game.config.height / 4, // y
                "VCROSDMono", // key
                "USE WASD OR\nARROW KEYS TO MOVE", // text
                42, // size
                1 // align
            )
            .setOrigin(0.5)
            .setCharacterTint(0, -1, true, "0xFFFFFF");

        this.score = 0;
        this.lastSpawned = 0;
        this.spawnInterval = 500;
        this.asteroidsSpawned = 0;
        this.swarmSpawned = false;
        this.swarmActive = false;
        this.gamePhase = 0;
        this.inSwarm = [];
        this.swarmUnite = false;
        this.points = [];
        // tutorial
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
        this.doneMovement = false;
        this.tap = false;
        this.hold = false;
        // // god mode
        // this.godmode = false;

        // this.input.keyboard.on("keydown-G", () => {
        //     this.godmode = !this.godmode;
        //     if (this.godmode) {
        //         this.physics.world.createDebugGraphic();
        //     } else {
        //         this.physics.world.clearDebugGraphic();
        //     }
        // });

        // create points
        for (let i = 0; i < 12; i++) {
            for (let j = 0; j < 12; j++) {
                let point = this.matter.add
                    .image(300, 300)
                    .setCircle(5, { isSensor: true });
                this.points.push(point);
            }
        }
        Phaser.Actions.GridAlign(this.points, {
            width: 12,
            height: 12,
            cellWidth: 15,
            cellHeight: 13,
            x: game.config.width / 2 - (12 * 16) / 2 - 16 / 2,
            y: game.config.height / 2 - (12 * 12) / 2 - 150,
        });
        this.removePoints = [
            [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
            [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
            [1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
            [0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0],
            [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0],
            [0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0],
            [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        ];
        // delete points
        let total = 0;
        this.removePoints.forEach((row, rowIndex) => {
            row.forEach((element, colIndex) => {
                if (element == 1) {
                    if (this.points[rowIndex * 12 + colIndex]) {
                        this.points[rowIndex * 12 + colIndex].setSensor(false);
                        this.points[rowIndex * 12 + colIndex].destroy();
                    }
                }
                if (element == 0) {
                    total++;
                }
            });
        });
        // console.log(total);
    }
    update(time, delta) {
        // console.log("FPS:", this.game.loop.actualFps);
        // console.log("Delta:", this.game.loop.delta);

        // background scrolling
        this.timeSinceMove += delta;
        if (this.timeSinceMove > 10) {
            this.background.tilePositionY -= 1;
            this.timeSinceMove = 0;
        }

        // TEST;
        // if (keys.SPACE.isDown && this.godmode) {
        //     this.ship.fireProjectile();
        //     this.ship.isCharging = false;
        // }

        // PHASE 0: Tutorial
        if (this.gamePhase == 0) {
            if (!this.doneMovement) {
                if (this.sys.game.device.input.touch) {
                    this.tutorialText
                        .setText("TAP AND DRAG TO MOVE")
                        .setOrigin(0.5)
                        .setCharacterTint(0, -1, true, "0xFFFFFF");
                } else {
                    this.tutorialText
                        .setText("USE WASD/ARROW KEYS\nOR DRAG TO MOVE")
                        .setOrigin(0.5)
                        .setCharacterTint(0, -1, true, "0xFFFFFF");
                }
            }

            if (
                Phaser.Input.Keyboard.JustDown(keys.W) ||
                Phaser.Input.Keyboard.JustDown(cursors.up)
            ) {
                this.up = true;
            }
            if (
                Phaser.Input.Keyboard.JustDown(keys.A) ||
                Phaser.Input.Keyboard.JustDown(cursors.left)
            ) {
                this.left = true;
            }
            if (
                Phaser.Input.Keyboard.JustDown(keys.S) ||
                Phaser.Input.Keyboard.JustDown(cursors.down)
            ) {
                this.down = true;
            }
            if (
                Phaser.Input.Keyboard.JustDown(keys.D) ||
                Phaser.Input.Keyboard.JustDown(cursors.right)
            ) {
                this.right = true;
            }

            if (
                this.up &&
                this.down &&
                this.left &&
                this.right &&
                !this.doneMovement
            ) {
                this.doneMovement = true;
                this.tap = false;
                this.hold = false;

                if (this.sys.game.device.input.touch) {
                    this.tutorialText
                        .setText(
                            "TAP TO SHOOT\nHOLD TO CHARGE LASER\nLET GO TO FIRE LASER"
                        )
                        .setCharacterTint(0, -1, true, "0xFFFFFF");
                } else {
                    this.tutorialText
                        .setText(
                            "CLICK OR SPACE TO SHOOT\nHOLD TO CHARGE LASER\nLET GO TO FIRE LASER"
                        )
                        .setCharacterTint(0, -1, true, "0xFFFFFF");
                }
            }
            // do not play tutorial if completed before
            if (
                (this.tap && this.hold && this.doneMovement) ||
                JSON.parse(localStorage.getItem("completedTutorial"))
            ) {
                localStorage.setItem("completedTutorial", true);
                this.tutorialText.destroy();
                this.gamePhase = 1;
            }
        }

        // PHASE 1: random asteroid spawn
        if (
            this.gamePhase == 1 &&
            this.ship.active &&
            this.lastSpawned > this.spawnInterval + 200 &&
            this.asteroidsSpawned < 250
        ) {
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
                if (this.spawnInterval > 0) this.spawnInterval -= 10;
                this.asteroidsSpawned += 1;
                // console.log(this.asteroidsSpawned);
            }
            // next phase
            if (this.asteroidsSpawned >= 250) {
                this.gamePhase = 2;
            }
        }
        this.lastSpawned += delta;

        // PHASE 2: alien circle
        if (
            this.gamePhase == 2 &&
            this.ship.active &&
            !this.asteroids.find((asteroid) => asteroid.active) &&
            !this.aliens.find((alien) => alien.active)
        ) {
            if (this.swarmSpawned && !this.swarmActive) {
                this.ship.moveTo(game.config.width / 2, game.config.height / 2);
            }
            // spawn the circle
            if (!this.swarmSpawned) {
                this.time.delayedCall(2000, () => {
                    this.ship.fixed = false;
                    this.circleSwarm(this.ship.x, this.ship.y);
                    this.swarmActive = true;
                });
                this.swarmSpawned = true;
            }

            // disable vetrical movement
            this.ship.verticalMovementEnabled = false;
            this.ship.anims.play("shipOff");

            // when all swarm parents dead
            if (
                this.swarmSpawned &&
                this.swarmActive &&
                !this.alienSwarm.find((alien) => alien.data.values["mother"])
            ) {
                // move ship to start
                this.ship.fixed = true;
                this.ship.moveTo(this.shipSpawnPoint.x, this.shipSpawnPoint.y);
                this.ship.rotateTo(-90);

                this.gamePhase = 3;
            }
        }

        // PHASE 3: SPAWN BIG EVIL BLASTER THING AT THE END THAT YOURE SUPPOSED TO BLAST
        if (this.gamePhase == 3) {
            this.uniteSwarm();
            this.sound.play("sfx-swarm");
            this.gamePhase = 4;
        }
        // PHASE 4: MEGA BOSS
        if (this.gamePhase == 4) {
            this.inSwarm = this.alienSwarm.filter(
                (alien) => alien.data.values["swarm"]
            );

            let totalX = 0;
            let totalY = 0;

            this.inSwarm.forEach((alien) => {
                totalX += alien.x;
                totalY += alien.y;
            });

            this.centerX = totalX / this.inSwarm.length;
            this.centerY = totalY / this.inSwarm.length;

            if (this.ship.active) {
                this.inSwarm.forEach((alien) => {
                    if (this.centerX < this.ship.x - 10) {
                        // move right
                        alien.moveXY(10, 4, 200);
                    } else if (this.centerX > this.ship.x + 10) {
                        // move left
                        alien.moveXY(-10, 4, 200);
                    } else {
                        alien.moveXY(0, 4, 100);
                    }

                    if (alien.y > 470) {
                        alien.moveTo(this.ship.x, this.ship.y, 100);
                    }
                });
            }

            if (!this.ship.active) {
                this.uniteSwarm();
            }

            if (this.inSwarm.length == 0) {
                this.gamePhase = 5;
            }
        }

        // respawn ship when asteroids/aliens leave
        if (
            !this.ship.active &&
            !this.asteroids.find((asteroid) => asteroid.active) &&
            !this.aliens.find((alien) => alien.active) &&
            !this.ship.respawnDelay <= 0
        ) {
            // respawn ship
            if (this.ship.lives > 0) {
                console.log("LIVES REMAINING: " + this.ship.lives);
                this.lives[this.ship.lives - 1].setVisible(false);
                this.ship.spawn(this.shipSpawnPoint.x, this.shipSpawnPoint.y);
            }
        }
        if (this.ship.respawnDelay > 0) {
            this.ship.respawnDelay -= delta;
        }

        // GAME OVER
        if (this.gamePhase <= 4 && this.ship.lives == 0 && !this.ship.active) {
            console.log("GAME OVER");
            this.gamePhase = 5;
        }
        // update score text
        this.scoreTxt
            .setText("score:" + this.score)
            .setCharacterTint(6, -1, true, "0xFFFFFF");

        // PHASE 5: GAME COMPLETE
        if (this.gamePhase == 5) {
            this.gameEnd();
            this.gamePhase = 6;
        }
        // ENTER SCORE
        if (this.gamePhase == 7) {
            this.enterScore();
            this.gamePhase = 8;
        }
        if (this.gamePhase == 9) {
            this.pressToRestart();
        }
    }

    // show score
    gameEnd() {
        this.endTxt = this.add
            .bitmapText(
                game.config.width / 2, // x
                game.config.height / 3, // y
                "VCROSDMono", // key
                "", // text
                105, // size
                1 // align
            )
            .setOrigin(0.5, 0.5)
            // .setDropShadow(1, 2, "0xFF0000", 123)
            .setCharacterTint(0, -1, true, "0xFFFFFF");

        if (this.ship.lives == 0 && !this.ship.active) {
            this.endTxt
                .setText("GAME\nOVER")
                .setCharacterTint(0, -1, true, "0xFFFFFF");
        } else {
            this.endTxt
                .setText("LEVEL\nCOMPLETE")
                .setCharacterTint(0, -1, true, "0xFFFFFF");
        }

        this.sound.play("sfx-complete");

        this.tweens.add({
            targets: this.endTxt,
            duration: 200,
            delay: 1000,
            alpha: 0,
            ease: "Sine.easeInOut",
            onComplete: () => {
                this.time.delayedCall(200, () => {
                    this.displayScore();
                });
            },
        });
    }

    displayScore() {
        const scoreText = this.add
            .bitmapText(
                game.config.width / 2, // x
                game.config.height / 4, // y
                "VCROSDMono",
                "SCORE",
                63
            )
            .setOrigin(0.5, 0.5)
            .setCharacterTint(0, -1, true, "0xFFFFFF");
        const numberText = this.add
            .bitmapText(
                game.config.width / 2, // x
                (game.config.height / 5) * 2, // y
                "VCROSDMono",
                0,
                105
            )
            .setOrigin(0.5, 0.5)
            .setCharacterTint(0, -1, true, "0xFFFFFF");
        this.sound.play("sfx-complete");

        this.scoreCounter = this.tweens.addCounter({
            from: 0,
            to: this.score,
            duration: (this.score / 1000) * 100,
            delay: 1000,
            ease: "Sine.easeOut",
            onUpdate: () => {
                numberText
                    .setText([Math.floor(this.scoreCounter.getValue())])
                    .setCharacterTint(0, -1, true, "0xFFFFFF");
            },

            onComplete: () => {
                this.gamePhase = 7;
            },
        });
    }
    enterScore() {
        var textPrompt = this.add
            .bitmapText(
                game.config.width / 5,
                (game.config.height / 5) * 3,
                "VCROSDMono",
                "ENTER NAME:\nPRESS [ENTER] TO SUBMIT SCORE",
                21,
                0
            )
            .setOrigin(0, 0.5)
            .setCharacterTint(0, -1, true, "0xFFFFFF");

        var textEntry = this.add
            .bitmapText(
                game.config.width / 3 + 47,
                (game.config.height / 5) * 3 - 21,
                "VCROSDMono",
                "",
                21,
                0
            )
            .setCharacterTint(0, -1, true, "0xFFFFFF");
        var textEntryCursor = this.add
            .bitmapText(
                game.config.width / 3 + 42,
                (game.config.height / 5) * 3 - 21,
                "VCROSDMono",
                "|",
                21,
                0
            )
            .setCharacterTint(0, -1, true, "0xFFFFFF");
        this.cursorblink = this.time.addEvent({
            delay: 500,
            callback: () => {
                if (textEntryCursor.alpha == 0) {
                    textEntryCursor.setAlpha(255);
                } else {
                    textEntryCursor.setAlpha(0);
                }
            },
            loop: true,
        });

        this.scene.launch("InputPanel");
        this.scene.get("InputPanel").events.on("keyPressed", (key) => {
            if (key === "delete" && textEntry.text.length > 0) {
                textEntry.text = textEntry.text.substr(
                    0,
                    textEntry.text.length - 1
                );
            } else if (/^[A-Z\s]+$/.test(key)) {
                if (this.gamePhase == 8 && textEntry.text.length <= 32) {
                    textEntry.text += key;
                }
            }
            if (key === "enter") {
                textPrompt
                    .setText("ENTER NAME:\nTAP ANYWHERE TO RETURN TO MENU")
                    .setCharacterTint(0, -1, true, "0xFFFFFF");
                this.updateFile(textEntry.text, this.score);

                this.scene.stop("InputPanel");
                this.scene.get("InputPanel").events.off("keyPressed");
                textEntryCursor.setVisible(false);
                this.cursorblink.loop = false;
                this.gamePhase = 9;
            }

            textEntry.setCharacterTint(0, -1, true, "0xFFFFFF");
            textEntryCursor.text = " ".repeat(textEntry.text.length) + "|";
            textEntryCursor.setCharacterTint(0, -1, true, "0xFFFFFF");
        });

        this.input.keyboard.on("keydown", (event) => {
            if (event.keyCode === 8 && textEntry.text.length > 0) {
                textEntry.text = textEntry.text.substr(
                    0,
                    textEntry.text.length - 1
                );
            } else if (
                event.keyCode === 32 ||
                (event.keyCode >= 48 && event.keyCode < 90)
            ) {
                if (this.gamePhase == 8 && textEntry.text.length <= 32) {
                    textEntry.text += event.key.toUpperCase();
                }
                textEntry.setCharacterTint(0, -1, true, "0xFFFFFF");
            }
            // submit score on [ENTER]
            if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.ENTER) {
                textPrompt
                    .setText("ENTER NAME:\nPRESS [SPACE] TO RETURN TO MENU")
                    .setCharacterTint(0, -1, true, "0xFFFFFF");
                this.updateFile(textEntry.text, this.score);
                this.scene.stop("InputPanel");
                this.scene.get("InputPanel").events.off("keyPressed");
                textEntryCursor.setVisible(false);
                this.cursorblink.loop = false;
                this.gamePhase = 9;
            }
            textEntryCursor.text = " ".repeat(textEntry.text.length) + "|";
            textEntryCursor.setCharacterTint(0, -1, true, "0xFFFFFF");
        });
    }
    pressToRestart() {
        if (keys.SPACE.isDown || this.input.activePointer.isDown) {
            this.scene.start("menuScene", {
                backgroundY: this.background.tilePositionY,
            });
        }
    }

    circleSwarm(x, y) {
        this.motherGroup = this.add.group();
        this.circle = new Phaser.Geom.Circle(x, y, 128);

        if (this.swarmCircle) {
            this.swarmCircle.stop();
        }
        const motherAliens = this.alienSwarm
            .filter((alien) => !alien.active && !alien.data.values["swarm"])
            .slice(0, 8);
        if (motherAliens) {
            motherAliens.forEach((alien) => {
                alien.setData("mother", true);
                alien.spawn(0, 0);
                alien.setScale(1);
            });
            if (this.motherGroup) {
                this.motherGroup.clear();
                this.motherGroup.addMultiple(motherAliens);
            }
        }

        Phaser.Actions.PlaceOnCircle(
            this.motherGroup.getChildren(),
            this.circle
        );

        this.swarmCircle = this.tweens.add({
            targets: this.circle,
            radius: 25,
            duration: 8000,
            yoyo: true,
            repeat: -1,
            onUpdate: () => {
                Phaser.Actions.RotateAroundDistance(
                    this.motherGroup.getChildren(),
                    { x: x, y: y },
                    0.02,
                    this.circle.radius
                );
            },
        });
    }

    uniteSwarm() {
        if (!this.swarmUnite) {
            this.swarmUnite = true;
            this.inSwarm = this.alienSwarm.filter(
                (alien) => alien.data.values["swarm"]
            );
            this.waypoints = this.points.filter((point) => point.active);
            this.inSwarm.forEach((alien) => {
                let waypoint;
                do {
                    waypoint =
                        this.waypoints[
                            Math.floor(Math.random() * this.waypoints.length)
                        ];
                } while (!waypoint.active);

                if (waypoint) {
                    waypoint.setActive(false);
                    alien.moveTo(waypoint.x, waypoint.y, 200);
                }
                alien.idle = 2000;
            });

            this.waypoints.forEach((point) => {
                point.setActive(true);
            });
            this.time.delayedCall(5000, () => {
                this.swarmUnite = false;
            });
        }
    }

    updateFile(name, score) {
        var file = new Map(
            Object.entries(JSON.parse(localStorage.getItem("scores")))
        );
        // only update score if higher or new name
        if (file.get(name) < score || !file.get(name)) {
            file.set(name, score);
        }

        localStorage.setItem(
            "scores",
            JSON.stringify(Object.fromEntries(file))
        );
    }
}
