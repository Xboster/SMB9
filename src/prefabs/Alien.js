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

    spawn(
        x,
        y,
        angle = 0,
        speed = 0,
        inertia = { x: 0, y: 0 },
        lifespan = 5000
    ) {
        this.scene.matter.world.add(this.body);

        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);

        this.setVelocityX(speed * Math.cos(angle) + inertia.x);
        this.setVelocityY(speed * Math.sin(angle) + inertia.y);

        this.lifespan = lifespan;
    }

    // moveTo(x = 0, y = 0, speed = 0, inertia = { x: 0, y: 0 }) {
    //     let dx = x - this.x;
    //     let dy = y - this.y;
    //     let distance = Math.sqrt(dx * dx + dy * dy);

    //     if (distance > 0) {
    //         dx /= distance;
    //         dy /= distance;

    //         this.setVelocity(dx * speed + inertia.x, dy * speed + inertia.y);
    //     } else {
    //         // this.setVelocity(0, 0);
    //     }
    // }

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
                    } else {
                        this.scene.score += 500;
                    }
                    // spawn alien swarm
                    if (this.data.values["mother"]) {
                        for (let i = 1; i <= 8; i++) {
                            const smallAlien = this.scene.alienSwarm.find(
                                (smallAlien) =>
                                    !smallAlien.active &&
                                    !smallAlien.data.values["mother"]
                            );
                            if (smallAlien) {
                                smallAlien.spawn(
                                    this.x, // pos x
                                    this.y, // pos y
                                    ((Math.PI * 2) / 8) * i, // direction
                                    3, // speed
                                    this.body.velocity
                                );
                                smallAlien.setScale(0.5);
                                smallAlien.setFrictionAir(0.1);
                                smallAlien.setData("mother", false);
                            }
                        }
                    }

                    console.log(this);
                    this.scene.sound.setVolume(0.7).play("sfx-explosion2");
                    this.setActive(false);
                    this.setVisible(false);
                    this.world.remove(this.body, false);
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

        if (this.y - this.height > game.config.height) {
            this.setActive(false);
            this.setVisible(false);
            this.world.remove(this.body, true);
        }
        // this.moveTo(this.target.x, this.target.y, 1);
    }
}
