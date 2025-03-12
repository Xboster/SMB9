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
        this.ship.spawn(this.shipSpawnPoint.x, this.shipSpawnPoint.y);

        // blasts ------------------------------------------------------------------
        this.blasts = [];
        for (let i = 0; i < 128; i++) {
            const blast = new Blast(this, 0, 0, "blast", {
                isSensor: true,
            });

            blast.setCollisionCategory(this.blastCollisionCategory);
            blast.setCollidesWith([
                this.alienCollisionCategory,
                this.asteroidCollisionCategory,
            ]);

            this.blasts.push(blast);

            blast.preFX.addGlow(0xffff00, 1, 0, false);
        }

        this.input.keyboard.on("keydown-SPACE", () => {
            const blast = this.blasts.find((blast) => !blast.active);
            if (this.ship.active && blast) {
                blast.fire(this.ship.x, this.ship.y, this.ship.rotation, 10);
                this.sound.play("sfx-shoot");
            }
        });

        // aliens ------------------------------------------------------------------
        this.aliens = [];
        for (let i = 0; i < 128; i++) {
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

            alien.preFX.addGlow(0x00ff00, 1, 0, false);

            alien.setCollisionCategory(this.alienCollisionCategory);
            alien.setCollidesWith([
                this.shipCollisionCategory,
                this.blastCollisionCategory,
            ]);

            this.aliens.push(alien);
        }

        // aliens ------------------------------------------------------------------
        this.alienSwarm = [];
        for (let i = 0; i < 128; i++) {
            const smallAlien = new Alien(this, 0, 0, "alien", {
                isSensor: true,
                shape: {
                    type: "rectangle",
                    width: 11,
                    height: 9,
                },
                chamfer: {
                    radius: [4, 4, 4, 4],
                },
            }).setOrigin(0.5, 0.5);

            smallAlien.anims.play("idle");

            smallAlien.preFX.addGlow(0x00ff00, 1, 0, false);

            smallAlien.setCollisionCategory(this.alienCollisionCategory);
            smallAlien.setCollidesWith([
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

            if (pointer.leftButtonDown()) {
                const asteroid = this.asteroids.find(
                    (asteroid) => !asteroid.active
                );
                if (asteroid) {
                    asteroid.spawn(x, y, (Math.PI * 2) / 4, 3);
                }
            }
            if (pointer.rightButtonDown()) {
                const alien = this.aliens.find((alien) => !alien.active);
                if (alien) {
                    alien.spawn(x, y, (Math.PI * 2) / 4, 3);
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

        // asteroid random spawn
        if (this.ship.active && this.lastSpawned > this.spawnInterval + 200) {
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
            }
        }
        this.lastSpawned += delta;

        if (
            !this.ship.active &&
            !this.asteroids.find((asteroid) => asteroid.active) &&
            !this.aliens.find((alien) => alien.active)
        ) {
            // respawn ship
            for (let i = this.lives.length - 1; i >= 0; i--) {
                if (this.lives[i].visible) {
                    console.log("HAS " + i + " LIVES LEFT");
                    this.lives[i].setVisible(false);

                    this.ship.respawn(
                        this.shipSpawnPoint.x,
                        this.shipSpawnPoint.y
                    );

                    break;
                }
                if (i == 0) {
                    console.log("game over");
                }
            }
        }

        this.scoreTxt
            .setText("score:" + this.score)
            .setCharacterTint(6, -1, true, "0xFFFFFF");
    }
}
