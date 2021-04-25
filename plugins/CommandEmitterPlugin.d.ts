import { Command } from "../utils";
export interface ClientData {
    currentPing: number;
    lastExecutedCommand: Command;
    readyCommands: Command[];
    queuedCommands: Command[];
    signalIsBlocked: boolean;
}
export declare abstract class CommandEmitterPlugin extends Phaser.Plugins.BasePlugin {
    private callbacks;
    constructor(pluginManager: Phaser.Plugins.PluginManager);
    start(): void;
    destroy(): void;
    on(command: Command, callback: () => void): void;
    abstract updateClientData(data: ClientData): void;
    protected emit(command: Command): void;
}
