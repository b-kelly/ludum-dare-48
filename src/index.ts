import "./index.css";
import * as Phaser from "phaser";
import { gameConfig } from "./config";
import { ClientControllerPlugin } from "./plugins/ClientControllerPlugin";
import { LocalClientControllerPlugin } from "./plugins/LocalClientControllerPlugin";
import Peer from "peerjs";

document.querySelector("#js-play-single-btn").addEventListener("click", () => {
    startGame(LocalClientControllerPlugin);
});

document.querySelector("#js-play-split-btn").addEventListener("click", () => {
    console.log("opening connection");
    const peer = new Peer("bkelly-ldjam48", {
        debug: 2,
        host: "localhost", // "peerjs-server.centralus.azurecontainer.io",
        port: 9000,
        path: "/myapp",
    });
    peer.on("connection", (conn) => {
        console.log("peer connected");
        conn.on("data", (data) => {
            // Will print 'hi!'
            console.log(data);
        });
        conn.on("open", () => {
            conn.send("hello!");
        });
        conn.on("error", (data) => {
            console.log("Error", data);
        });
    });
});

function startGame(plugin: typeof ClientControllerPlugin, data?: unknown) {
    document.querySelector(".js-step-1-container").classList.add("d-none");
    document.querySelector(".js-step-2-container").classList.remove("d-none");

    gameConfig.plugins = {
        global: [
            {
                key: ClientControllerPlugin.name,
                plugin: plugin,
                start: true,
                data: data,
            },
        ],
    };

    new Phaser.Game(gameConfig);
}
