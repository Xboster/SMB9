class MyText extends Phaser.GameObjects.BitmapText {
    constructor(scene, x, y, key, text, size, align) {
        super(scene, x, y, key, text, size, align);
        // ...
        this.add.existing(this);
    }
    // ...

    // preUpdate(time, delta) {}
}
