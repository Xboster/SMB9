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
        default: "matter",
        matter: {
            plugins: {
                wrap: true,
            },
            gravity: {
                x: 0,
                y: 0,
            },
            setBounds: {
                x: 0,
                y: 0,
                width: 720,
                height: 540,
                thickness: 64,
                left: false,
                right: false,
                top: false,
                bottom: false,
            },

            debug: {
                showAxes: true,
                showAngleIndicator: true,
                showBody: true,
            },
        },
    },
    backgroundColor: "#4444aa",
    scene: [Load, Menu, Play, Scores, Credits],
    fps: {
        min: 30,
        target: 60,
        forceSetTimeOut: true,
    },
};

const game = new Phaser.Game(config);

// input
let keys, keyLEFT, keyRIGHT;

// background
let tilePOS = 0;
