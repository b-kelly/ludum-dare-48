import "./index.css";
import * as Phaser from "phaser";
import { GameScene } from "./scenes/GameScene";

const gameConfig: Phaser.Types.Core.GameConfig = {
    title: "Sample",

    type: Phaser.AUTO,

    scale: {
        width: 800,
        height: 600,
        mode: Phaser.Scale.FIT,
    },

    physics: {
        default: "arcade",
        arcade: {
            debug: true,
        },
    },

    parent: "js-game-container",
    backgroundColor: "#000000",
    autoFocus: true,
    scene: GameScene,
};

export const game = new Phaser.Game(gameConfig);
