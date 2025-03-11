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
                left: true,
                right: true,
                top: true,
                bottom: true,
            },

            // debug: {
            //     // showAxes: true,
            //     showAngleIndicator: true,
            //     showBody: true,
            // },
        },
    },
    backgroundColor: "#4444aa",
    scene: [Load, Menu, Play, Scores, Credits],
    fps: {
        min: 30,
        target: 60,
        limit: 60,
        // forceSetTimeOut: true,
    },
};

const game = new Phaser.Game(config);

// input
let keys, cursors;

// background
let tilePOS = 0;
