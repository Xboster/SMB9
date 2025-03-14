class Laser extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, texture, options) {
        super(scene.matter.world, x, y, texture, null, options);

        this.setFriction(0);
        this.setFrictionAir(0);
        this.setFixedRotation();
        this.setActive(false);
        this.setVisible(false);

        this.laser = [];
        for (let i = 0; i < 8; i++) {
            this.laser.push(
                this.scene.add
                    .sprite(this.x, this.y, "laser", 8, {
                        isSensor: true,
                    })
                    .setAngle(-90)
            );
        }

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

        this.anims.play("charge");
    }
    fire() {
        for (let i = 0; i < 8; i++) {
            let dx = this.x - this.laser[i].x;
            let dy = this.y - this.laser[i].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0) {
                dx /= distance;
                dy /= distance;
            }
            this.laser[i].setPosition(
                this.x + 64 * i * Math.cos(this.rotation),
                this.y + 64 * i * Math.sin(this.rotation)
            );
            this.laser[i].setRotation(this.rotation);
        }

        console.log("laser");
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
            this.charged = false;
            this.firing = false;

            this.setActive(false);
            this.setVisible(false);
            this.world.remove(this.body, true);
        }
    }
}
