class Blast extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setCollideWorldBounds(false);
    }
}
