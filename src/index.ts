import "./index.css";
import * as Phaser from "phaser";
import { gameConfig } from "./config";
import { CommandEmitterPlugin } from "./plugins/CommandEmitterPlugin";
import { LocalCommandEmitterPlugin } from "./plugins/LocalCommandEmitterPlugin";

document.querySelector("#js-play-single-btn").addEventListener("click", () => {
    startGame(LocalCommandEmitterPlugin);
});

function startGame(plugin: typeof CommandEmitterPlugin) {
    document.querySelector(".js-step-1-container").classList.add("d-none");
    document.querySelector(".js-step-2-container").classList.remove("d-none");

    gameConfig.plugins = {
        global: [
            {
                key: CommandEmitterPlugin.name,
                plugin: plugin,
                start: true,
            },
        ],
    };

    new Phaser.Game(gameConfig);
}
