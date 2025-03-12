class Asteroid extends Phaser.Physics.Matter.Sprite {
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

    spawn(x, y, angle, speed, lifespan = 5000) {
        this.scene.matter.world.add(this.body);

        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);

        this.setVelocityX(speed * Math.cos(angle));
        this.setVelocityY(speed * Math.sin(angle));

        this.lifespan = lifespan;
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
                    // spawn alien on asteroid
                    const alien = this.scene.aliens.find(
                        (alien) => !alien.active
                    );
                    if (alien) {
                        alien.spawn(this.x, this.y, (Math.PI * 2) / 4, 3);
                    }

                    // hide and remove asteroid
                    this.scene.sound.setVolume(0.7).play("sfx-explosion2");
                    this.setActive(false);
                    this.setVisible(false);
                    this.world.remove(this.body, false);
                    // update score
                    this.scene.score += 150;
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
    }
}
