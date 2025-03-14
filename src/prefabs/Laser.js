class Laser extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, texture, options) {
        super(scene.matter.world, x, y, texture, null, options);

        this.setFriction(0);
        this.setFrictionAir(0);
        this.setFixedRotation();
        this.setActive(false);
        this.setVisible(false);

        this.charged = false;
        this.firing = false;

        this.scene.add.existing(this);

        this.scene.matter.world.remove(this.body, true);

        this.scene.matter.world.on("collisionstart", this.onCollision, this);
    }

    charge(x, y, angle) {
        this.scene.matter.world.add(this.body);
        this.setActive(true);
        this.setVisible(true);

        this.scene.laser.anims.play("charge");

        this.scene.add.tileSprite(this.x, this.y, 64, 512, "laser");
    }
    fire() {}

    onCollision(event) {
        event.pairs.forEach((pair) => {
            if (pair.bodyA === this.body || pair.bodyB === this.body) {
                const otherBody =
                    pair.bodyA === this.body ? pair.bodyB : pair.bodyA;

                if (
                    otherBody.collisionFilter.category ===
                        this.scene.asteroidCollisionCategory ||
                    otherBody.collisionFilter.category ===
                        this.scene.alienCollisionCategory
                ) {
                    this.setActive(false);
                    this.setVisible(false);
                    this.world.remove(this.body, true);
                }
            }
        });
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
            this.charged = false;
            this.firing = false;

            this.setActive(false);
            this.setVisible(false);
            this.world.remove(this.body, true);
        }
    }
}
