import "./index.css";
import * as Phaser from "phaser";
import { gameConfig } from "./config";
import { ClientControllerPlugin } from "./plugins/ClientControllerPlugin";
import { LocalClientControllerPlugin } from "./plugins/LocalClientControllerPlugin";
import Peer from "peerjs";
import { WebRtcClientControllerPlugin } from "./plugins/WebRtcClientControllerPlugin";
import QRCode from "qrcode";

document.querySelector("#js-play-single-btn").addEventListener("click", () => {
    document.querySelector(".js-ui-container").classList.remove("d-none");
    startGame(LocalClientControllerPlugin);
});

document.querySelector("#js-play-split-btn").addEventListener("click", () => {
    document.querySelector(".js-step-1-container").classList.add("d-none");
    document
        .querySelector(".js-step-connect-container")
        .classList.remove("d-none");
    const status = document.querySelector("#js-status");

    console.log("opening connection");
    const peer = new Peer(null);
    peer.on("open", (id) => {
        console.log("Connected with id: " + id);
        const link =
            new URL("./join.html", document.location.href).toString() +
            `?id=${encodeURIComponent(id)}`;
        QRCode.toDataURL(link).then((v) => {
            status.innerHTML = `Open <a href="${link}">this link</a> in your mobile browser or scan this QR code <img src="${v}" />`;
        });
    });
    peer.on("connection", (connection) => {
        console.log("peer connected");
        startGame(WebRtcClientControllerPlugin, { connection });
    });
});

function startGame(plugin: typeof ClientControllerPlugin, data?: unknown) {
    document.querySelector(".js-step-1-container").classList.add("d-none");
    document
        .querySelector(".js-step-connect-container")
        .classList.add("d-none");
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
