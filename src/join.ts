import "./index.css";
import Peer from "peerjs";
import { Command } from "./utils";
import type { CommandData } from "./plugins/WebRtcClientControllerPlugin";
import type { ClientUiData } from "./plugins/ClientControllerPlugin";

let conn: Peer.DataConnection;

const statusEl = document.querySelector("#js-status");

const query = new URLSearchParams(window.location.search);
const id = query.get("id");

if (id) {
    startConnection(id);
} else {
    document
        .querySelector("#js-rtc-form")
        .addEventListener("submit", function (e) {
            e.stopPropagation();
            e.preventDefault();
            const data = new FormData(this);
            const connectionId = data.get("connectionId").toString();
            console.log("connecting to: " + connectionId);

            startConnection(connectionId);
        });
}

function startConnection(id: string) {
    document.querySelector("#js-rtc-form").classList.add("d-none");
    statusEl.textContent = "Connecting...";
    const peer = new Peer(null);
    peer.on("open", () => {
        conn = peer.connect(id, {
            reliable: true,
        });
        conn.on("open", () => {
            console.log("connected to destination!");
            statusEl.textContent = "";
            document
                .querySelector(".js-ui-container")
                .classList.remove("d-none");
        });
        conn.on("data", (data: ClientUiData) => {
            document.querySelector(
                "#js-ping"
            ).textContent = data.signalIsBlocked
                ? "SIGNAL LOST"
                : `Ping: ${data.currentPing}`;

            document.querySelector("#js-queued").textContent =
                "Sent: " +
                data.queuedCommands.reduce((p, n) => `${p},${Command[n]}`, "");

            document.querySelector("#js-ready").textContent =
                "Received: " +
                data.readyCommands.reduce((p, n) => `${p},${Command[n]}`, "");

            document.querySelector("#js-executing").textContent = `Executing: ${
                Command[data.lastExecutedCommand] || Command[Command.Halt]
            }`;
        });
    });
}

function sendCommand(command: Command) {
    const data: CommandData = {
        type: "command",
        command: command,
    };
    conn.send(data);
}

document
    .querySelector("#js-up-btn")
    .addEventListener("click", () => sendCommand(Command.Up));
document
    .querySelector("#js-down-btn")
    .addEventListener("click", () => sendCommand(Command.Down));
document
    .querySelector("#js-left-btn")
    .addEventListener("click", () => sendCommand(Command.Left));
document
    .querySelector("#js-right-btn")
    .addEventListener("click", () => sendCommand(Command.Right));
document
    .querySelector("#js-halt-btn")
    .addEventListener("click", () => sendCommand(Command.Halt));
