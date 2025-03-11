class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    init() {
        this.fixed = true;
    }
    preload() {}
    create(data) {
        this.input.mouse.disableContextMenu();
        // background
        this.background = this.add
            .tileSprite(0, 0, 1024, 1024, "background")
            .setOrigin(0, 0);
        this.background.tilePositionY = data.backgroundY;
        this.timeSinceMove = 0;
        // console.log(data.backgroundY);
        // UI TEXT

        this.add
            .bitmapText(
                20, // x
                10, // y
                "VCROSDMono", // key
                "score:_______", // text
                21, // size
                1 // align
            )
            .setOrigin(0)
            // .setDropShadow(1, 2, "0xFF0000", 123)
            .setCharacterTint(0, -1, true, "0x00ff00");

        // UI Lives
        this.add
            .image(game.config.width - 20, 20, "ship")
            .setAngle(-90)
            .setScale(1 / 3)
            .setTint(0xff0000);

        this.add
            .image(game.config.width - 40, 20, "ship")
            .setAngle(-90)
            .setScale(1 / 3)
            .setTint(0xff0000);

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
        this.ship = new Ship(this, 0, 0, "ship", {})
            .setPolygon(28, 3)
            .setOrigin(0.41, 0.5);

        this.ship.setCollisionCategory(this.shipCollisionCategory);
        this.ship.spawn(game.config.width / 2, (game.config.height / 20) * 19);

        // blasts ------------------------------------------------------------------
        this.blasts = [];
        for (let i = 0; i < 512; i++) {
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
        for (let i = 0; i < 512; i++) {
            const alien = new Alien(this, 0, 0, "alien", {
                isSensor: true,
                shape: {
                    type: "rectangle",
                    width: 24,
                    height: 20,
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
                // this.blastCollisionCategory,
            ]);

            this.aliens.push(alien);
        }
        // asteroids ------------------------------------------------------------------
        this.asteroids = [];
        for (let i = 0; i < 512; i++) {
            const asteroid = new Asteroid(this, 0, 0, "asteroid", {
                isSensor: true,
                shape: {
                    type: "polygon",
                    radius: 16,
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

        if (!this.ship.active) {
            if (keys.SPACE.isDown) {
                this.matter.world.resetCollisionIDs();
                this.scene.start("menuScene");
            }
        }
    }
}
