class Credits extends Phaser.Scene {
    constructor() {
        super("creditsScene");
    }
    init() {}
    preload() {}
    create() {
        this.input.keyboard.on("keydown-ONE", () => {
            this.scene.start("menuScene");
        });
        this.input.keyboard.on("keydown-TWO", () => {
            this.scene.start("playScene");
        });
        this.input.keyboard.on("keydown-THREE", () => {
            this.scene.start("scoresScene");
        });
        this.input.keyboard.on("keydown-FOUR", () => {
            this.scene.start("creditsScene");
        });
    }
    update() {}
}
