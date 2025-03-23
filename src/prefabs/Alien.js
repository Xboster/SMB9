class Alien extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, texture, options) {
        super(scene.matter.world, x, y, texture, null, options);

        this.lifespan = 0;

        this.setFriction(0);
        this.setFrictionAir(0);
        this.setFixedRotation();
        this.setActive(false);
        this.setVisible(false);

        this.idle = 0;

        this.scene.add.existing(this);

        this.scene.matter.world.remove(this.body, true);

        this.scene.matter.world.on("collisionstart", this.onCollision, this);
    }

    spawn(x, y, angle = 0, speed = 0, lifespan = -1) {
        this.scene.matter.world.add(this.body);

        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);

        if (this.data.values["swarm"]) {
            let dx = this.scene.ship.x - this.x;
            let dy = this.scene.ship.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0) {
                dx /= distance;
                dy /= distance;
            }

            this.setVelocityX(speed * Math.cos(angle) + dx * -3);
            this.setVelocityY(speed * Math.sin(angle) + dy * -3);
        } else {
            this.setVelocityX(speed * Math.cos(angle));
            this.setVelocityY(speed * Math.sin(angle));
        }

        this.lifespan = lifespan;
    }
    despawn() {
        this.scene.add
            .particles(this.x, this.y, "green", {
                lifespan: 250,
                speed: { min: 50, max: 150 },
                scale: { start: 1, end: 0 },
                emitting: false,
            })
            .explode(32);
        this.setData("swarm", false);
        this.setData("mother", false);
        this.setActive(false);
        this.setVisible(false);
        this.world.remove(this.body, true);
    }

    moveTo(x = 0, y = 0, speed = 0) {
        let distance = Phaser.Math.Distance.Between(this.x, this.y, x, y);
        if (speed > 0) {
            this.setSensor(true);
            this.scene.tweens.add({
                targets: this,
                x: x,
                y: y,
                angle: 0,
                duration: (distance / speed) * 1000,
                ease: "Linear",
                // onComplete: () => {
                //     // this.setVelocity(0);
                //     // this.setAngularVelocity(0);
                //     // this.setPosition(x, y);
                // },
            });
        }
    }

    moveXY(x, y, speed) {
        let distance = Phaser.Math.Distance.Between(
            this.x,
            this.y,
            this.x + x,
            this.y + y
        );
        if (speed > 0 && distance > 0 && this.idle <= 0) {
            this.setSensor(true);
            this.scene.tweens.add({
                targets: this,
                x: this.x + x,
                y: this.y + y,
                angle: 0,
                duration: (distance / speed) * 1000,
                ease: "Linear",
                // onComplete: () => {
                //     this.setVelocity(0);
                //     this.setAngularVelocity(0);
                //     this.setPosition(this.x + x, this.y + y);
                // },
            });
        }
    }

    onCollision(event) {
        event.pairs.forEach((pair) => {
            if (pair.bodyA === this.body || pair.bodyB === this.body) {
                const otherBody =
                    pair.bodyA === this.body ? pair.bodyB : pair.bodyA;

                if (
                    otherBody.collisionFilter.category ===
                        this.scene.blastCollisionCategory ||
                    otherBody.collisionFilter.category ===
                        this.scene.laserCollisionCategory
                ) {
                    // update score
                    if (this.data.values["mother"]) {
                        this.scene.score += 1250;
                        // split mother
                        this.split();
                    } else {
                        this.scene.score += 500;
                    }
                    if (
                        otherBody.collisionFilter.category ===
                        this.scene.blastCollisionCategory
                    ) {
                        this.scene.sound.setVolume(0.7).play("sfx-explosion2");
                    }
                    this.despawn();
                }
            }
        });
    }

    split() {
        if (this.scene.motherGroup) {
            this.scene.motherGroup.remove(this);
        }
        // get 14 aliens to spread
        const swarmAliens = this.scene.alienSwarm
            .filter(
                (alien) =>
                    !alien.active &&
                    !alien.data.values["mother"] &&
                    !alien.data.values["swarm"]
            )
            .slice(0, 14);
        swarmAliens.forEach((alien, index) => {
            alien.setScale(0.5);
            alien.setFrictionAir(0.1);
            alien.setData("swarm", true);
            alien.setData("mother", false);
            if (index < 1) {
                alien.spawn(
                    this.x, // pos x
                    this.y, // pos y
                    ((Math.PI * 2) / 1) * index, // direction
                    0 // speed
                );
            } else if (index < 5) {
                alien.spawn(
                    this.x, // pos x
                    this.y, // pos y
                    ((Math.PI * 2) / 4) * index, // direction
                    3 // speed
                );
            } else if (index < 15) {
                alien.spawn(
                    this.x, // pos x
                    this.y, // pos y
                    ((Math.PI * 2) / 9) * index, // direction
                    6 // speed
                );
            }
            return;
        });
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (this.lifespan > 0) {
            this.lifespan -= delta;
        }

        if (this.scene.ship.active) {
            this.idle -= delta;
        }

        if (this.lifespan <= 0 && this.lifespan != -1) {
            this.despawn();
        }

        if (this.y - this.height > game.config.height) {
            this.despawn();
        }
    }
}
