class Ship extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, key) {
        super(scene, x, y, key);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.setScale(3);
        this.setSize(6, 16);


        

        this.direction = new Phaser.Math.Vector2(0);

        // // initialize state machine managing Slug (initial state, possible states, state args[])
        // this.shipFSM = new StateMachine(
        //     "idle",
        //     {
        //         idle: new IdleState(),
        //         move: new MoveState(),
        //     },
        //     [scene, this]
        // ); // pass these as arguments to maintain scene/object context in the FSM
    }

    update() {
        // ship movement
        // left/right
        if (keys.A.isDown) {
            this.direction.x = -1;
        } else if (keys.D.isDown) {
            this.direction.x = 1;
        } else {
            this.direction.x = 0;
        }
        // up/down
        // if (this.cursors.up.isDown) {
        //     this.direction.y = -1;
        // } else if (this.cursors.down.isDown) {
        //     this.direction.y = 1;
        // }
        // turn
        if (keys.Q.isDown) {
            this.ship.angle = this.ship.angle - 1;
        } else if (keys.E.isDown) {
            this.ship.angle = this.ship.angle + 1;
        }
        if (Phaser.Input.Keyboard.JustDown(keys.SPACE)) {
            console.log("shoot");
        }
        this.direction.normalize();
        this.setVelocity(300 * this.direction.x, 300 * this.direction.y);
    }
}

class IdleState extends State {
    enter(scene, ship) {}
    execute(scene, ship) {}
}

class MoveState extends State {
    enter(scene, ship) {}
    execute(scene, ship) {}
}
