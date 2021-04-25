import { ClientControllerPlugin, ClientUiData } from "./ClientControllerPlugin";
import Peer from "peerjs";
import { Command } from "../utils";
export interface CommandData {
    type: "command";
    command: Command;
}
export declare class WebRtcClientControllerPlugin extends ClientControllerPlugin {
    private connection;
    init(data: {
        connection: Peer.DataConnection;
    }): void;
    start(): void;
    destroy(): void;
    updateClientData(data: ClientUiData): void;
}
