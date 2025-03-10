class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
        // this.eventEmitter = new Phaser.Events.EventEmitter();
    }
    init() {
        this.fixed = true;
    }
    preload() {}
    create(data) {
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
        // input ------------------------------------------------------------------
        // this.cursors = this.input.keyboard.createCursorKeys();
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
        // this.matter.world.wrap(this.ship, 5);

        const wrapBounds = {
            min: { x: 0, y: 0 },
            max: { x: game.config.width, y: game.config.height },
        };
        // collisions
        this.enemiesCollisionCategory = this.matter.world.nextCategory();
        this.shipCollisionCategory = this.matter.world.nextCategory();
        this.blastCollisionCategory = this.matter.world.nextCategory();
        this.asteroidCollisionCategory = this.matter.world.nextCategory();

        // add ship ------------------------------------------------------------------
        this.ship = new Ship(this.matter.world, 0, 0, "ship", {})
            .setPolygon(24, 3, {
                isSensor: true,
                restitution: 0.5,
                wrapBounds: wrapBounds,
            })
            .setOrigin(0.41, 0.5);

        this.ship.setCollisionCategory(this.shipCollisionCategory);
        this.ship.setCollidesWith([
            this.asteroidCollisionCategory,
            this.enemiesCollisionCategory,
        ]);

        this.ship.spawn(game.config.width / 2, (game.config.height / 20) * 19);

        // blasts ------------------------------------------------------------------
        this.blasts = [];
        for (let i = 0; i < 64; i++) {
            const blast = new Blast(this.matter.world, 0, 0, "blast", {
                isSensor: true,
                wrapBounds: wrapBounds,
            });

            blast.setCollisionCategory(this.blastCollisionCategory);
            blast.setCollidesWith([
                this.enemiesCollisionCategory,
                this.asteroidCollisionCategory,
            ]);

            this.blasts.push(blast);
        }

        this.input.keyboard.on("keydown-SPACE", () => {
            const blast = this.blasts.find((blast) => !blast.active);
            if (this.ship.active && blast) {
                blast.fire(this.ship.x, this.ship.y, this.ship.rotation, 10);
                this.sound.play("sfx-shoot");
            }
        });
        // asteroids ------------------------------------------------------------------
        this.asteroids = [];
        for (let i = 0; i < 512; i++) {
            const asteroid = new Asteroid(this.matter.world, 0, 0, "asteroid", {
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

            const asteroid = this.asteroids.find(
                (asteroid) => !asteroid.active
            );
            if (asteroid) {
                asteroid.spawn(x, y, (Math.PI * 2) / 4, 3);
            }
        });
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
    }
}
