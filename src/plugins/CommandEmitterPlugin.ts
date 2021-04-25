import { Command } from "../utils";

export abstract class CommandEmitterPlugin extends Phaser.Plugins.BasePlugin {
    private callbacks: Map<Command, () => void>;

    constructor(pluginManager: Phaser.Plugins.PluginManager) {
        super(pluginManager);
    }

    start(): void {
        this.callbacks = new Map<Command, () => void>();
    }

    destroy(): void {
        super.destroy();
        this.callbacks = null;
    }

    on(command: Command, callback: () => void): void {
        this.callbacks.set(command, callback);
    }

    protected emit(command: Command): void {
        const callback = this.callbacks.get(command);

        if (callback) {
            callback();
        }
    }
}
