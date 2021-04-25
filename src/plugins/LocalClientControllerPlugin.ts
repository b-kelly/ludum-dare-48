import { Command } from "../utils";
import { ClientData, ClientControllerPlugin } from "./ClientControllerPlugin";

export class LocalClientControllerPlugin extends ClientControllerPlugin {
    start(): void {
        super.start();
        document
            .querySelector("#js-up-btn")
            .addEventListener("click", () => this.emit(Command.Up));
        document
            .querySelector("#js-down-btn")
            .addEventListener("click", () => this.emit(Command.Down));
        document
            .querySelector("#js-left-btn")
            .addEventListener("click", () => this.emit(Command.Left));
        document
            .querySelector("#js-right-btn")
            .addEventListener("click", () => this.emit(Command.Right));
        document
            .querySelector("#js-halt-btn")
            .addEventListener("click", () => this.emit(Command.Halt));
    }

    destroy(): void {
        // TODO proper destroy that removes the event listeners?
        super.destroy();
    }

    updateClientData(data: ClientData): void {
        document.querySelector("#js-ping").textContent = data.signalIsBlocked
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
    }
}
