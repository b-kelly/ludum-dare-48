import { ClientControllerPlugin, ClientUiData } from "./ClientControllerPlugin";
import Peer from "peerjs";
import { Command } from "../utils";

export interface CommandData {
    type: "command";
    command: Command;
}

export class WebRtcClientControllerPlugin extends ClientControllerPlugin {
    private connection: Peer.DataConnection;

    init(data: { connection: Peer.DataConnection }): void {
        this.connection = data.connection;
        this.connection.on("data", (data: CommandData) => {
            if (data.type === "command") {
                this.emit(data.command);
            }
        });
    }

    start(): void {
        super.start();
    }

    destroy(): void {
        // TODO proper destroy that removes the event listeners?
        super.destroy();
    }

    updateClientData(data: ClientUiData): void {
        this.connection.send(data);
    }
}
