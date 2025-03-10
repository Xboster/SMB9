class Blast extends Phaser.Physics.Matter.Sprite {
    constructor(world, x, y, texture, options) {
        super(world, x, y, texture, null, options);

        this.setFriction(0);
        this.setFrictionAir(0);
        this.setFixedRotation();
        this.setActive(false);
        this.setVisible(false);

        this.scene.add.existing(this);

        this.world.remove(this.body, true);

        this.world.on("collisionstart", this.onCollision, this);
    }

    fire(x, y, angle, speed) {
        this.world.add(this.body);

        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);

        this.setRotation(angle);
        this.setVelocityX(speed * Math.cos(angle));
        this.setVelocityY(speed * Math.sin(angle));

        this.lifespan = 800;
    }

    onCollision(event) {
        event.pairs.forEach((pair) => {
            if (pair.bodyA === this.body || pair.bodyB === this.body) {
                const otherBody =
                    pair.bodyA === this.body ? pair.bodyB : pair.bodyA;

                if (
                    otherBody.collisionFilter.category ===
                    this.scene.asteroidCollisionCategory
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

        this.lifespan -= delta;

        if (this.lifespan <= 0) {
            this.setActive(false);
            this.setVisible(false);
            this.world.remove(this.body, true);
        }
    }
}
