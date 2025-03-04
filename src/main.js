// Leon Ng
//  Make the Fake: Super Mega Blasteroids 9

const config = {
    type: Phaser.AUTO,
    scale: {
        // mode: Phaser.Scale.FIT,
        // autoCenter: Phaser.Scale.CENTER_BOTH,
        // zoom: 1,
        width: 720,
        height: 540,
    },
    render: {
        pixelArt: true,
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: true,
        },
    },
    backgroundColor: "#4444aa",
    scene: [Load, Menu, Play, Scores, Credits],
};

const game = new Phaser.Game(config);
