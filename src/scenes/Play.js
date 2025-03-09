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
        // console.log(data.backgroundY);
        // TEXT
        this.add
            .bitmapText(
                game.config.width / 2, // x
                game.config.height / 2, // y
                "VCROSDMono", // key
                "in Play Scene", // text
                21, // size
                1 // align
            )
            .setOrigin(0.5)
            // .setDropShadow(1, 2, "0xFF0000", 123)
            .setCharacterTint(0, -1, true, "0xff0000");
        // SCENE CHANGER
        this.input.keyboard.on("keydown-ONE", () => {
            this.scene.start("menuScene");
        });
        this.input.keyboard.on("keydown-TWO", () => {
            this.scene.start("playScene");
        });
        this.input.keyboard.on("keydown-THREE", () => {
            this.scene.start("scoresScene");
        });
        this.input.keyboard.on("keydown-FOUR", () => {
            this.scene.start("creditsScene");
        });

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
        this.asteroidsCollisionCategory = this.matter.world.nextCategory();

        // add ship ------------------------------------------------------------------
        this.ship = this.matter.add.sprite(
            game.config.width / 2,
            (game.config.height / 20) * 19,
            "ship"
        );

        this.ship
            .setPolygon(32, 3, {
                restitution: 0.1,
                wrapBounds: wrapBounds,
            })
            .setOrigin(0.41, 0.5);
        this.ship.body.angle = Math.PI;
        this.ship.setAngle(-90);
        this.ship.setFrictionAir(0.1);
        this.ship.setMass(25);
        this.ship.setFixedRotation();
        this.ship.setAngularVelocity(0);
        // blasts ------------------------------------------------------------------
        this.blasts = [];
        for (let i = 0; i < 64; i++) {
            const blast = new Blast(this.matter.world, 0, 0, "blast", {
                wrapBounds,
            });

            blast.setCollisionCategory(this.blastCollisionCategory);
            blast.setCollidesWith([
                this.enemiesCollisionCategory,
                this.asteroidsCollisionCategory,
            ]);
            blast.setOnCollide(this.blastVsEnemy);

            this.blasts.push(blast);
        }

        this.input.keyboard.on("keydown-SPACE", () => {
            this.sound.play("sfx-shoot");

            const blast = this.blasts.find((blast) => !blast.active);
            if (blast) {
                blast.fire(this.ship.x, this.ship.y, this.ship.rotation, 10);
            }
        });

        this.timeSinceMove = 0;
    }
    update(time, delta) {
        // background movement
        this.timeSinceMove += delta;
        if (this.timeSinceMove > 10) {
            this.background.tilePositionY -= 1;
            this.timeSinceMove = 0;
            console.log(this.background.tilePositionY);
        }

        // ship movement
        if (keys.W.isDown) {
            this.ship.thrust(0.01);
            // console.log(this.ship.angle);
        }
        if (keys.S.isDown) {
            this.ship.thrust(-0.01);
            // console.log(this.ship.angle);
        }
        if (keys.A.isDown) {
            this.ship.thrustLeft(0.01);
        }
        if (keys.D.isDown) {
            this.ship.thrustRight(0.01);
        }

        if (keys.Q.isDown) {
            this.ship.setAngularVelocity(-0.1);
        } else if (keys.E.isDown) {
            this.ship.setAngularVelocity(0.1);
        }
    }
}
