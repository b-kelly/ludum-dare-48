import { Command } from "../utils";
import { CommandEmitterPlugin } from "./CommandEmitterPlugin";

export class LocalCommandEmitterPlugin extends CommandEmitterPlugin {
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
}
