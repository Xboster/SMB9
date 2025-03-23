class InputPanel extends Phaser.Scene {
    constructor() {
        super({ key: "InputPanel", active: false });
        this.chars = [
            "A",
            "B",
            "C",
            "D",
            "E",
            "F",
            "G",
            "H",
            "I",
            "J",
            "K",
            "L",
            "M",
            "N",
            "O",
            "P",
            "Q",
            "R",
            "S",
            "T",
            "U",
            "V",
            "W",
            "X",
            "Y",
            "Z",
            " ",
        ];
        this.keys = [];
    }
    create() {
        this.chars.forEach((char, index) => {
            this.keys.push(
                this.add
                    .bitmapText(
                        game.config.width / 10 + (index % 9) * 42 + 10, // x
                        (game.config.height / 10) * 7 +
                            Math.floor(index / 9) * 42, // y
                        "VCROSDMono", // key
                        char != " " ? char : "_", // text
                        42, // size
                        1 // align
                    )
                    .setCharacterTint(0, -1, true, "0xFFFFFF")
                    .setInteractive({ useHandCursor: true })
                    .on("pointerover", (pointer) => {})
                    .on("pointerdown", (pointer) => {})
                    .on("pointerup", (pointer) => {
                        this.events.emit("keyPressed", char);
                    })
            );
        });
        this.keys.push(
            this.add
                .bitmapText(
                    (game.config.width / 10) * 6.5, // x
                    (game.config.height / 10) * 7 + 42, // y
                    "VCROSDMono", // key
                    "[ENTER]",
                    42, // size
                    1 // align
                )
                .setCharacterTint(0, -1, true, "0xFFFFFF")
                .setInteractive({ useHandCursor: true })
                .on("pointerover", (pointer) => {})
                .on("pointerdown", (pointer) => {})
                .on("pointerup", (pointer) => {
                    this.events.emit("keyPressed", "enter");
                })
        );
        this.keys.push(
            this.add
                .bitmapText(
                    (game.config.width / 10) * 6.5, // x
                    (game.config.height / 10) * 7, // y
                    "VCROSDMono", // key
                    "[DELETE]",
                    42, // size
                    1 // align
                )
                .setCharacterTint(0, -1, true, "0xFFFFFF")
                .setInteractive({ useHandCursor: true })
                .on("pointerover", (pointer) => {})
                .on("pointerdown", (pointer) => {})
                .on("pointerup", (pointer) => {
                    this.events.emit("keyPressed", "delete");
                })
        );
    }
    destroy() {
        this.keys.destroy();
        this.chars.destroy();
    }
}
