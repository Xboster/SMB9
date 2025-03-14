class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    init() {}
    preload() {}
    create(data) {
        this.score = 0;
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

        // world bounds ------------------------------------------------------------------
        // this.matter.world.setBounds(
        //     0,
        //     0,
        //     game.config.width,
        //     game.config.height
        // );

        // collisions
        this.alienCollisionCategory = this.matter.world.nextCategory();
        this.asteroidCollisionCategory = this.matter.world.nextCategory();
        this.blastCollisionCategory = this.matter.world.nextCategory();
        this.shipCollisionCategory = this.matter.world.nextCategory();

        // add ship ------------------------------------------------------------------
        this.shipSpawnPoint = new Phaser.Math.Vector2(
            game.config.width / 2,
            (game.config.height / 20) * 19
        );
        this.ship = new Ship(this, 0, 0, "ship");

        this.ship.setCollisionCategory(this.shipCollisionCategory);
        // this.ship.setCollidesWith([]);
        this.ship.spawn(this.shipSpawnPoint.x, this.shipSpawnPoint.y);
        // add laser
        this.laser = new Laser(this, 0, 0, "Laser", {
            isSensor: true,
        });

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
                // this.blastCollisionCategory,
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

        // spawn asteroid on click
        this.input.on("pointerdown", (pointer) => {
            const x = pointer.x;
            const y = pointer.y;
            // console.log(`Clicked at: x=${x}, y=${y}`);

            // if (pointer.leftButtonDown()) {
            //     const asteroid = this.asteroids.find(
            //         (asteroid) => !asteroid.active
            //     );
            //     if (asteroid) {
            //         asteroid.spawn(x, y, (Math.PI * 2) / 4, 3);
            //     }
            // }

            // normal alien
            // if (pointer.rightButtonDown()) {
            //     const alien = this.aliens.find((alien) => !alien.active);
            //     if (alien) {
            //         alien.spawn(x, y, (Math.PI * 2) / 4, 3);
            //     }
            // }

            // splitting alien
            // if (pointer.rightButtonDown()) {
            //     const smallAlien = this.alienSwarm.find(
            //         (smallAlien) => !smallAlien.active
            //     );
            //     if (smallAlien) {
            //         smallAlien.spawn(x, y, (Math.PI * 2) / 4, 3);
            //     }
            // }

            if (pointer.rightButtonDown()) {
                // console.log(this.textures.getFrame("laser", 1));
                this.laser.charge(this.ship.x, this.ship.y, this.ship.rotation);
            }

            // move to
            if (pointer.leftButtonDown()) {
                console.log("x: " + x + "y: " + y);
                const smallAlien = this.alienSwarm.filter(
                    (alien) => alien.active && alien.data.values["swarm"]
                );
                if (smallAlien) {
                    smallAlien.forEach((alien) => {
                        alien.seek(x, y, 5);
                    });
                }
            }
        });

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
        for (let i = 1; i < 3; i++) {
            this.lives.push(
                this.add
                    .image(game.config.width - 20 * i, 20, "ship")
                    .setAngle(-90)
                    .setScale(1 / 3)
                    .setTint(0xff0000)
            );
        }

        this.lastSpawned = 0;
        this.spawnInterval = 500;
        this.asteroidsSpawned = 499;
        this.swarmSpawned = false;
        this.swarmActive = false;
        this.gamePhase = 1;
        this.inSwarm = [];
        this.swarmUnite = false;
        this.points = [];
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
            cellHeight: 12,
            x: game.config.width / 2 - (12 * 16) / 2 - 8,
            y: game.config.height / 2 - (12 * 12) / 2 - 100,
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
        console.log(total);
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
        // if (keys.SPACE.isDown) {
        //     const blast = this.blasts.find((blast) => !blast.active);
        //     if (this.ship.active && blast) {
        //         blast.fire(this.ship.x, this.ship.y, this.ship.rotation, 32);
        //         this.sound.play("sfx-shoot");
        //     }
        // }

        // PHASE 1: random asteroid spawn
        if (
            this.gamePhase == 1 &&
            this.ship.active &&
            this.lastSpawned > this.spawnInterval + 100 &&
            this.asteroidsSpawned < 500
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
                console.log(this.asteroidsSpawned);
            }
            // next phase
            if (this.asteroidsSpawned >= 500) {
                this.gamePhase++;
            }
        }
        this.lastSpawned += delta;

        // PHASE 2: alien circle
        if (
            this.gamePhase == 2 &&
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
                this.ship.setCollisionCategory();

                this.gamePhase = 3;
            }
        }

        // PHASE 3: SPAWN MEGA BOSS
        if (this.gamePhase == 3) {
            console.log("PHASE 3");
            if (!this.swarmUnite) {
                this.time.delayedCall(1000, () => {
                    this.inSwarm = this.alienSwarm.filter(
                        (alien) => alien.data.values["swarm"]
                    );
                    this.waypoints = this.points.filter(
                        (point) => point.active
                    );
                    this.inSwarm.forEach((alien) => {
                        let waypoint;
                        do {
                            waypoint =
                                this.waypoints[
                                    Math.floor(
                                        Math.random() * this.waypoints.length
                                    )
                                ];
                        } while (!waypoint.active);

                        if (waypoint) {
                            waypoint.setActive(false);
                            alien.moveTo(waypoint.x, waypoint.y);
                        }
                    });
                    this.time.delayedCall(200, () => {
                        this.ship.setCollisionCategory(
                            this.shipCollisionCategory
                        );
                    });
                    this.gamePhase = 4;
                    this.waypoints.forEach((point) => {
                        point.setActive(true);
                    });
                });
                this.swarmUnite = true;
            }
        }

        if (this.gamePhase == 4) {
            this.inSwarm = this.alienSwarm.filter(
                (alien) => alien.data.values["swarm"]
            );

            if (this.ship.active) {
                this.swarmUnite = false;
                this.inSwarm.forEach((alien) => {
                    alien.seek(this.ship.x, this.ship.y, 2);
                });
            }
            if (!this.swarmUnite && !this.ship.active) {
                this.inSwarm = this.alienSwarm.filter(
                    (alien) => alien.data.values["swarm"]
                );
                this.waypoints = this.points.filter((point) => point.active);
                this.inSwarm.forEach((alien) => {
                    let waypoint;
                    do {
                        waypoint =
                            this.waypoints[
                                Math.floor(
                                    Math.random() * this.waypoints.length
                                )
                            ];
                    } while (!waypoint.active);

                    if (waypoint) {
                        waypoint.setActive(false);
                        alien.moveTo(waypoint.x, waypoint.y);
                    }
                });
                this.waypoints.forEach((point) => {
                    point.setActive(true);
                });
                this.swarmUnite = true;
            }
            if (this.inSwarm.length == 0) {
                console.log(this.inSwarm);
                this.gamePhase = 5;
            }
        }
        // respawn ship
        if (
            !this.ship.active &&
            !this.asteroids.find((asteroid) => asteroid.active) &&
            !this.aliens.find((alien) => alien.active)
        ) {
            if (this.ship.lives > 0) {
                this.ship.lives -= 1;
                console.log("HAS " + this.ship.lives + " LIVES LEFT");
                this.lives[this.ship.lives].setVisible(false);
                this.ship.spawn(this.shipSpawnPoint.x, this.shipSpawnPoint.y);
            }
            if (this.ship.lives == 0) {
                console.log("game over");
            }
        }

        this.scoreTxt
            .setText("score:" + this.score)
            .setCharacterTint(6, -1, true, "0xFFFFFF");
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

        // console.log(motherGroup);
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
}
