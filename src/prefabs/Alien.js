class Alien extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, texture, options) {
        super(scene.matter.world, x, y, texture, null, options);

        this.lifespan = 0;

        this.setFriction(0);
        this.setFrictionAir(0);
        this.setFixedRotation();
        this.setActive(false);
        this.setVisible(false);

        this.scene.add.existing(this);

        this.scene.matter.world.remove(this.body, true);

        this.scene.matter.world.on("collisionstart", this.onCollision, this);
    }

    spawn(x, y, angle = 0, speed = 0, lifespan = 50000) {
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

            this.setVelocityX(speed * Math.cos(angle) + dx * -5);
            this.setVelocityY(speed * Math.sin(angle) + dy * -5);
        } else {
            this.setVelocityX(speed * Math.cos(angle));
            this.setVelocityY(speed * Math.sin(angle));
        }

        this.lifespan = lifespan;
    }
    despawn() {
        this.setData("swarm", false);
        this.setData("mother", false);
        this.setActive(false);
        this.setVisible(false);
        this.world.remove(this.body, true);
    }

    moveTo(x = 0, y = 0, speed = 0) {
        this.setSensor(true);
        this.scene.tweens.add({
            targets: this,
            x: x,
            y: y,
            angle: 0,
            duration: 500,
            ease: "Linear",
            onComplete: () => {
                this.setVelocity(0);
                this.setAngularVelocity(0);
            },
        });
    }

    seek(x, y, speed = 0) {
        let dx = x - this.x;
        let dy = y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0.1) {
            dx /= distance;
            dy /= distance;

            this.setVelocity(dx * 2 * speed, dy * speed);
        } else {
            this.setVelocityX(0);
            this.setVelocityY(0);
        }
    }

    onCollision(event) {
        event.pairs.forEach((pair) => {
            if (pair.bodyA === this.body || pair.bodyB === this.body) {
                const otherBody =
                    pair.bodyA === this.body ? pair.bodyB : pair.bodyA;

                if (
                    otherBody.collisionFilter.category ===
                    this.scene.blastCollisionCategory
                ) {
                    // update score
                    if (this.data.values["mother"]) {
                        this.scene.score += 1250;
                        // split mother
                        this.split();
                    } else {
                        this.scene.score += 500;
                    }

                    this.scene.sound.setVolume(0.7).play("sfx-explosion2");
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

        this.lifespan -= delta;

        if (this.lifespan <= 0) {
            this.despawn();
        }

        if (this.y - this.height > game.config.height) {
            this.despawn();
        }
    }
}
