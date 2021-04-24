export declare class GameScene extends Phaser.Scene {
    /** Commands that are ready to execute */
    private readyCommands;
    /** Commands that were queued by the player, but not ready yet (due to ping) */
    private queuedCommands;
    private drone;
    private map;
    private currentPingValue;
    private levelDepth;
    private lastExecutedCommand;
    private lastTickAt;
    private get width();
    private get height();
    constructor();
    preload(): void;
    create(): void;
    update(time: number): void;
    private setPing;
    private setQueuedInputTimes;
    private doTick;
    private updatePlayer;
    private moveDroneToCell;
    private centerDroneOnCurrentCell;
    private updateUi;
    private setupInputListeners;
    private collideWall;
    private getCellAtCoords;
    private getEntityImage;
}
