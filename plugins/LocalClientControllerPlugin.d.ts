import { ClientUiData, ClientControllerPlugin } from "./ClientControllerPlugin";
export declare class LocalClientControllerPlugin extends ClientControllerPlugin {
    start(): void;
    destroy(): void;
    updateClientData(data: ClientUiData): void;
}
