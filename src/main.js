// Leon Ng
//  Make the Fake: Super Mega Blasteroids 9

// +5 Your game uses at least five of Phaser's major components
// which may include: physics systems, cameras, particle effects, text objects,
// the animation manager, the tween manager, timers, tilemaps, pipeline FX, etc.
//
// physics systems: matter
// particle effects: for asteroids and aliens when they are hit
// text objects: bitmap font text (VCR_OSD_MONO_1)
// animation manager: ship rocket, laser, alien idle
// tween manager: for moving aliens / ship
// timers: delayed calls
// pipeline FX: alien green glow

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        zoom: 1,
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
    },
};

const game = new Phaser.Game(config);

// input
let keys, cursors;
