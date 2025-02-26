class Load extends Phaser.Scene {
    constructor() {
        super("LoadScene");
    }
    init() {}
    preload() {
        this.load.path = "./assets/";
        // Load Sprites
        this.load.spritesheet("slug", "slug.png", {
            frameWidth: 8,
            frameHeight: 8,
        });

        // Load Sounds
        this.load.audio("backgroundMusic", "song.wav");
    }
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
                (game.config.height * 2) / 3,
                "Loading...",
                menuConfig
            )
            .setOrigin(0.5);
        this.scene.start("menuScene");
    }
    update() {}
}
