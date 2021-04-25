import { ClientData, CommandEmitterPlugin } from "./CommandEmitterPlugin";
export declare class LocalCommandEmitterPlugin extends CommandEmitterPlugin {
    start(): void;
    destroy(): void;
    updateClientData(data: ClientData): void;
}
