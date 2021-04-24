import { GameOverScene } from "./scenes/GameOverScene";
import { GameScene } from "./scenes/GameScene";

export const TILE_WIDTH = 16;

export const gameConfig: Phaser.Types.Core.GameConfig = {
    title: "Sample",

    type: Phaser.AUTO,

    scale: {
        width: 512,
        height: 512,
        mode: Phaser.Scale.FIT,
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
