class Ship extends Phaser.Physics.Matter.Sprite {
    constructor(world, x, y, texture, options) {
        super(world, x, y, texture, null, options);

        this.scene.add.existing(this);

        this.world.remove(this.body, true);

        this.world.on("collisionstart", this.onCollision, this);
    }

    spawn(x, y) {
        this.world.add(this.body);

        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);

        this.body.angle = Math.PI;
        this.setAngle(-90);
        this.setFrictionAir(0.1);
        this.setMass(10);
        this.setFixedRotation();
        this.setAngularVelocity(0);
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
                    this.scene.sound.setVolume(0.5).play("sfx-explosion1");
                    this.setActive(false);
                    this.setVisible(false);
                    this.world.remove(this.body, true);
                }
            }
        });
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        // ship movement
        if (keys.W.isDown) {
            this.thrust(0.01);
            // console.log(this.angle);
        }
        if (keys.S.isDown) {
            this.thrust(-0.01);
            // console.log(this.angle);
        }
        if (keys.A.isDown) {
            this.thrustLeft(0.01);
        }
        if (keys.D.isDown) {
            this.thrustRight(0.01);
        }

        if (keys.Q.isDown) {
            this.setAngularVelocity(-0.05);
        } else if (keys.E.isDown) {
            this.setAngularVelocity(0.05);
        }
    }
}
