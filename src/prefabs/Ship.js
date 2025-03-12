class Ship extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, texture, options) {
        super(scene.matter.world, x, y, texture, null, options);

        this.setActive(false);
        this.setVisible(false);

        this.fixed = true;

        this.setPolygon(28, 3);
        this.setOrigin(0.41, 0.5);
        this.body.angle = Math.PI;
        this.setRotation(-Math.PI / 2);

        this.scene.add.existing(this);

        this.scene.matter.world.remove(this.body, true);

        this.scene.matter.world.on("collisionstart", this.onCollision, this);
    }

    spawn(x, y) {
        this.scene.matter.world.add(this.body);

        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);

        this.setFriction(0);
        this.setFrictionAir(0.1);
        this.setMass(5);
        this.setFixedRotation();
        this.setVelocity(0, 0);
        this.setAngularVelocity(0);
    }

    moveTo(x, y, speed) {
        let dx = x - this.x;
        let dy = y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0.1) {
            dx /= distance;
            dy /= distance;

            this.setVelocity(
                dx + this.body.velocity.x,
                dy + this.body.velocity.y
            );
        } else {
            this.setVelocityX(0);
            this.setVelocityY(0);
        }
    }

    respawn(x, y) {
        this.scene.matter.world.add(this.body);

        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);

        this.setFriction(0);
        this.setFrictionAir(0.1);
        this.setMass(5);
        this.setFixedRotation();
        this.setVelocity(0, 0);
        this.setAngularVelocity(0);
    }

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
        if (keys.W.isDown || cursors.up.isDown) {
            this.thrust(0.01);
            // console.log(this.angle);
        }
        if (keys.S.isDown || cursors.down.isDown) {
            this.thrust(-0.01);
            // console.log(this.angle);
        }
        if (keys.A.isDown || cursors.left.isDown) {
            if (this.fixed) {
                this.thrustLeft(0.01);
            } else {
                this.setAngularVelocity(-0.05);
            }
        }
        if (keys.D.isDown || cursors.right.isDown) {
            if (this.fixed) {
                this.thrustRight(0.01);
            } else {
                this.setAngularVelocity(0.05);
            }
        }

        // if (keys.Q.isDown || cursors.left.isDown) {
        //     this.setAngularVelocity(-0.05);
        // } else if (keys.E.isDown || cursors.right.isDown) {
        //     this.setAngularVelocity(0.05);
        // }
    }
}
