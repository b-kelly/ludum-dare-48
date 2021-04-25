import "./index.css";
import * as Phaser from "phaser";
import { gameConfig } from "./config";
import { ClientControllerPlugin } from "./plugins/ClientControllerPlugin";
import { LocalClientControllerPlugin } from "./plugins/LocalClientControllerPlugin";
import Peer from "peerjs";
import { WebRtcClientControllerPlugin } from "./plugins/WebRtcClientControllerPlugin";
import QRCode from "qrcode";
import { setInstruction } from "./utils";

document
    .querySelector("#js-instructions")
    .addEventListener("click", function (e) {
        if (!(e.target as HTMLElement).classList.contains("js-proceed")) {
            return;
        }

        e.stopPropagation();
        e.preventDefault();

        const next = (e.target as HTMLElement).dataset.next;

        if (!next) {
            setInstruction(null);
            return;
        } else if (next === "mode:split") {
            startConnection();
        } else if (next === "mode:solo") {
            document
                .querySelector(".js-ui-container")
                .classList.remove("d-none");
            startGame(LocalClientControllerPlugin);
        } else {
            setInstruction(next);
        }
    });

function startConnection() {
    setInstruction("connecting");

    const peer = new Peer(null);
    peer.on("open", (id) => {
        console.log("Connected with id: " + id);
        const link =
            new URL("./join.html", document.location.href).toString() +
            `?id=${encodeURIComponent(id)}`;
        document.querySelector("#js-connect-link").setAttribute("href", link);
        void QRCode.toDataURL(link).then((v) => {
            document.querySelector(
                "#js-qr-container"
            ).innerHTML = `<img src="${v}" />`;
        });
    });

    // wait for the remote connection before starting the game
    peer.on("connection", (connection) => {
        startGame(WebRtcClientControllerPlugin, { connection });
    });
}

function startGame(plugin: typeof ClientControllerPlugin, data?: unknown) {
    setInstruction(null);
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
