import "./index.css";
import * as Phaser from "phaser";
import { gameConfig } from "./config";
import { CommandEmitterPlugin } from "./plugins/CommandEmitterPlugin";
import { LocalCommandEmitterPlugin } from "./plugins/LocalCommandEmitterPlugin";

gameConfig.plugins = {
    global: [
        {
            key: CommandEmitterPlugin.name,
            plugin: LocalCommandEmitterPlugin,
            start: true,
        },
    ],
};

new Phaser.Game(gameConfig);
