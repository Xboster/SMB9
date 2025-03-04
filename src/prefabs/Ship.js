class Ship extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setCollideWorldBounds(true);

        // initialize state machine managing Slug (initial state, possible states, state args[])
        this.shipFSM = new StateMachine(
            "idle",
            {
                idle: new IdleState(),
                move: new MoveState(),
            },
            [scene, this]
        ); // pass these as arguments to maintain scene/object context in the FSM
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
