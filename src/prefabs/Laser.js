class Laser extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, texture, options) {
        super(scene.matter.world, x, y, texture, null, options);
        this.setActive(false);
        this.setVisible(false);

        this.line = new Phaser.Geom.Line(0, 0, 0, 0);

        this.length = 16;

        this.segments = this.scene.add.group();
        for (let i = 0; i < this.length; i++) {
            this.segments.add(
                this.scene.matter.add
                    .sprite(0, 0, "laser", 8, {
                        isSensor: true,
                        shape: {
                            type: "rectangle",
                            width: 64,
                            height: 32,
                        },
                    })
                    .setCollisionCategory(this.scene.laserCollisionCategory)
                    .setActive(false)
                    .setVisible(false)
            );
        }

        this.charging = false;
        this.charged = false;
        this.firing = false;

        this.scene.add.existing(this);

        this.scene.matter.world.remove(this.body, true);

        this.scene.matter.world.on("collisionstart", this.onCollision, this);
    }
    stop() {
        this.charged = false;
        this.firing = false;

        this.setActive(false);
        this.setVisible(false);
        this.world.remove(this.body, true);

        this.segments.getChildren().forEach((segment) => {
            segment.setActive(false);
            segment.setVisible(false);
            segment.world.remove(segment.body, true);
        });
    }
    charge() {
        if (!this.charging) {
            this.charging = true;
            this.setActive(true);
            this.setVisible(true);
            this.scene.matter.world.add(this.body);

            this.anims.play("charge");
            this.on("animationcomplete", () => {
                this.charged = true;
            });
        }
    }
    fire() {
        if (this.charged && this.firing) {
            this.setCollisionCategory(this.scene.laserCollisionCategory);
            this.anims.play("fire");
            this.setRotation(this.scene.ship.rotation);
            this.line = new Phaser.Geom.Line(
                this.x + 64 * Math.cos(this.scene.ship.rotation),
                this.y + 64 * Math.sin(this.scene.ship.rotation),
                this.x +
                    64 * Math.cos(this.scene.ship.rotation) * this.length +
                    1 * 0.99,
                this.y +
                    64 * Math.sin(this.scene.ship.rotation) * this.length +
                    1 * 0.99
            );
            Phaser.Actions.PlaceOnLine(this.segments.getChildren(), this.line);
            this.segments.getChildren().forEach((segment) => {
                segment.setRotation(this.rotation);
                segment.setActive(true);
                segment.setVisible(true);
            });

            this.firing = true;
        }
    }

    onCollision(event) {
        // event.pairs.forEach((pair) => {
        //     if (pair.bodyA === this.body || pair.bodyB === this.body) {
        //         const otherBody =
        //             pair.bodyA === this.body ? pair.bodyB : pair.bodyA;
        //         if (
        //             otherBody.collisionFilter.category ===
        //                 this.scene.asteroidCollisionCategory ||
        //             otherBody.collisionFilter.category ===
        //                 this.scene.alienCollisionCategory
        //         ) {
        //             this.setActive(false);
        //             this.setVisible(false);
        //             this.world.remove(this.body, true);
        //         }
        //     }
        // });
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.scene.ship.active) {
            this.setPosition(
                this.scene.ship.x + 32 * Math.cos(this.scene.ship.rotation),
                this.scene.ship.y + 32 * Math.sin(this.scene.ship.rotation)
            );
            this.setRotation(this.scene.ship.rotation);
        } else {
            this.stop();
        }
        if (this.firing) {
            this.fire();
        }
    }
}
