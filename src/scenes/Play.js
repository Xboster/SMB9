class Play extends Phaser.Scene {
    constructor() {
        super("playScene");

        this.eventEmitter = new Phaser.Events.EventEmitter();
    }
    init() {}
    preload() {}
    create() {
        // start text
        let menuConfig = {
            fontFamily: "Courier New",
            fontSize: "16px",
            // backgroundColor: "#00FF00",
            color: "#FFFFFF",
            align: "center",
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0,
        };

        this.add
            .text(
                game.config.width / 2,
                game.config.height / 2,
                "in Play Scene",
                menuConfig
            )
            .setOrigin(0.5);
    }
    update(time, delta) {}
}
