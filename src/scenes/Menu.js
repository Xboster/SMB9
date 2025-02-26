class Menu extends Phaser.Scene {
    constructor() {
        super("MenuScene");
    }
    init() {}
    preload() {}
    create() {
        // width: 720,
        // height: 540,
        this.scale.setGameSize(720, 540);

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

        // menuConfig.backgroundColor = "#00FF00";
        // menuConfig.color = "#000";
        this.add
            .text(
                game.config.width / 2,
                game.config.height / 4,
                "Super Mega Blasteroids 9",
                menuConfig
            )
            .setOrigin(0.5);
        this.add
            .text(
                game.config.width / 2,
                game.config.height / 3,
                "made by Leon Ng",
                menuConfig
            )
            .setOrigin(0.5);

        this.add
            .text(
                game.config.width / 2,
                (game.config.height * 2) / 3,
                "Press any key\nto play",
                menuConfig
            )
            .setOrigin(0.5);
        (menuConfig.color = "#222222"),
            this.add
                .text(
                    game.config.width / 2,
                    (game.config.height * 5) / 6,
                    "Press d key for\ndebug mode",
                    menuConfig
                )
                .setOrigin(0.5);

        this.input.keyboard.on("keydown", () => {
            this.scene.start("playScene");
        });
    }
    update() {}
}
