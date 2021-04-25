import { Command } from "../utils";
export interface ClientUiData {
    currentPing: number;
    lastExecutedCommand: Command;
    readyCommands: Command[];
    queuedCommands: Command[];
    signalIsBlocked: boolean;
}
export declare abstract class ClientControllerPlugin extends Phaser.Plugins.BasePlugin {
    private callbacks;
    constructor(pluginManager: Phaser.Plugins.PluginManager);
    start(): void;
    destroy(): void;
    on(command: Command, callback: () => void): void;
    abstract updateClientData(data: ClientUiData): void;
    protected emit(command: Command): void;
}
