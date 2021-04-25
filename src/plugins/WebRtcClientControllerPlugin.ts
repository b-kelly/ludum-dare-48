import { ClientControllerPlugin } from "./ClientControllerPlugin";
//import Peer from "peerjs";

export class WebRtcClientControllerPlugin extends ClientControllerPlugin {
    // init(data: { connection: Peer }): void {
    //     const peer = new Peer("bkelly-ldjam48");
    //     peer.on("data", () => {
    //         console.log("peer connected!");
    //     });
    // }

    start(): void {
        super.start();
    }

    destroy(): void {
        // TODO proper destroy that removes the event listeners?
        super.destroy();
    }

    updateClientData(): void {
        // TODO
    }
}
