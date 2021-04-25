/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */

import Peer from "peerjs";

document.querySelector("#js-rtc-form").addEventListener("submit", function (e) {
    e.stopPropagation();
    e.preventDefault();
    const data = new FormData(this);
    const connectionId = data.get("connectionId").toString();
    console.log("connecting to: " + connectionId);

    const peer = new Peer(null, {
        debug: 2,
        host: "peerjs-server.centralus.azurecontainer.io",
        port: 9000,
        path: "/myapp",
    });
    const conn = peer.connect("bkelly-ldjam48");
    conn.on("open", () => {
        console.log("connected to destination!");
        conn.send("hi!");
    });
    conn.on("error", (data) => {
        console.log("Error", data);
    });
});
