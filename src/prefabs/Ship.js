class Ship extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, texture, options) {
        super(scene.matter.world, x, y, texture, null, options);

        this.setActive(false);
        this.setVisible(false);

        this.setPolygon(28, 3);
        this.setOrigin(0.41, 0.5);
        this.body.angle = Math.PI;
        this.setRotation(-Math.PI / 2);
        this.fixed = true;

        this.lives = 2;
        this.isCharging = false;
        this.chargeStartTime = 0;
        this.chargeAmount = 0;
        this.maxChargeTime = 1000; // 1 second for full charge

        this.scene.add.existing(this);

        this.scene.matter.world.remove(this.body, true);

        this.scene.matter.world.on("collisionstart", this.onCollision, this);
    }

    spawn(x, y) {
        this.scene.matter.world.add(this.body);

        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);

        this.fixed = true;
        this.setRotation(-Math.PI / 2);

        this.setFriction(0);
        this.setFrictionAir(0.1);
        this.setMass(5);
        this.setFixedRotation();
        this.setVelocity(0, 0);
        this.setAngularVelocity(0);
    }

    moveTo(x, y) {
        this.scene.tweens.add({
            targets: this,
            x: x,
            y: y,
            duration: 500,
            ease: "Linear",
        });
    }

    rotateTo(angle) {
        this.scene.tweens.add({
            targets: this,
            angle: angle,
            duration: 500,
            onComplete: () => {
                this.setAngularVelocity(0);
            },
        });
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

    fireProjectile() {
        if (this.chargeAmount < 1) {
            // Quick tap: basic projectile

            const blast = new Blast(this.scene, 0, 0, "blast", {
                isSensor: true,
            });

            blast.setCollisionCategory(this.scene.blastCollisionCategory);
            blast.setCollidesWith([
                this.scene.alienCollisionCategory,
                this.scene.asteroidCollisionCategory,
            ]);

            blast.preFX.addGlow(0xffff00, 1, 0, false);

            if (this.active && blast) {
                blast.fire(this.x, this.y, this.rotation, 10);
                this.scene.sound.play("sfx-shoot");
            }
        } else {
            console.log("MEGALASER");
            this.scene.laser.fire();
        }
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

        // if (keys.Q.isDown) {
        //     this.setAngularVelocity(-0.05);
        // } else if (keys.E.isDown) {
        //     this.setAngularVelocity(0.05);
        // }

        if (Phaser.Input.Keyboard.JustDown(keys.SPACE)) {
            console.log("CHARGING");
            this.isCharging = true;
            this.chargeStartTime = this.scene.time.now;
            this.chargeAmount = 0;
        }
        if (this.isCharging && keys.SPACE.isDown) {
            // Calculate charge amount (0 to 1)
            this.chargeAmount = Math.min(
                (this.scene.time.now - this.chargeStartTime) /
                    this.maxChargeTime,
                1
            );
            this.scene.laser.charge(this.x, this.y, this.rotation);
            console.log(this.chargeAmount);
        }
        if (this.isCharging && Phaser.Input.Keyboard.JustUp(keys.SPACE)) {
            this.fireProjectile();
            this.isCharging = false;
            console.log(this.isCharging);
        }
    }
}
