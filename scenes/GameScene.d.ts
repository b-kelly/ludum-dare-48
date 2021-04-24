import { Drone } from "../classes/Drone";
export declare class GameScene extends Phaser.Scene {
    /** Commands that are ready to execute */
    private readyCommands;
    /** Commands that were queued by the player, but not ready yet (due to ping) */
    private queuedCommands;
    /** The command that is currently being executed */
    private lastExecutedCommand;
    drone: Drone;
    private enemies;
    private map;
    private currentPingValue;
    private levelDepth;
    private lastTickAt;
    private get width();
    private get height();
    constructor();
    init(data: {
        levelDepth: number;
    }): void;
    preload(): void;
    create(): void;
    update(time: number): void;
    getCellAtCoords(x: number, y: number): {
        x: number;
        y: number;
    };
    private setPing;
    private setQueuedInputTimes;
    private doTick;
    private updateUi;
    private setupInputListeners;
    private collideWall;
    private collidePortal;
    private collideEnemy;
    private zoomCameraOnPlayer;
    private debugMode;
    private setupDebugUi;
    private getEntityImage;
}
