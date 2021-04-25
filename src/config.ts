import { GameOverScene } from "./scenes/GameOverScene";
import { GameScene } from "./scenes/GameScene";

export const TILE_WIDTH = 16;
// only tick once every n seconds
export const TICK_LENGTH_MS = 0.5 * 1000;

export const gameConfig: Phaser.Types.Core.GameConfig = {
    title: "Sample",

    type: Phaser.AUTO,

    pixelArt: true,

    scale: {
        width: 512,
        height: 512,
        mode: Phaser.Scale.NONE,
    },

    physics: {
        default: "arcade",
        arcade: {
            debug: false,
        },
    },

    parent: "js-game-container",
    backgroundColor: "#ffffff",
    autoFocus: true,
    scene: [GameScene, GameOverScene],
};
