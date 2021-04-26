import { Drone } from "../classes/Drone";
export declare class GameScene extends Phaser.Scene {
    /** Commands that are ready to execute */
    private readyCommands;
    /** Commands that were queued by the player, but not ready yet (due to ping) */
    private queuedCommands;
    /** The command that is currently being executed */
    private lastExecutedCommand;
    drone: Drone;
    private portal;
    private enemies;
    private map;
    private currentPingValue;
    private levelDepth;
    private signalBlockedCount;
    private lastTickAt;
    private signalBlockedTexture;
    private get width();
    private get height();
    private get signalIsBlocked();
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
    private createAnimations;
    private setPing;
    private setQueuedInputTimes;
    private doTick;
    private updatePortalDetector;
    private updateSignalBlockStatus;
    private updateUi;
    private setupInputListeners;
    private collideWall;
    private collideStatic;
    private collidePortal;
    private collideEnemy;
    private transitionToGameOver;
    private zoomCameraOnPlayer;
    private resetCameraZoom;
    private debugMode;
    private setupDebugUi;
}
