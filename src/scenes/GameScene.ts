import { GameObjects } from "phaser";
import { MoveableEntity } from "../classes/MoveableEntity";
import { TileType, Grid, EnemyType } from "../classes/Grid";
import { TICK_LENGTH_MS, TILE_WIDTH } from "../config";
import { Command, getRandomInt } from "../utils";
import { Drone } from "../classes/Drone";
import { Enemy } from "../classes/Enemy";
import { CommandEmitterPlugin } from "../plugins/CommandEmitterPlugin";

interface QueuedCommand {
    command: Command;
    executeAfter: number;
}

const PING_MULTIPLIER = 1000;
// static blocks the signal for n ticks
const STATIC_SIGNAL_BLOCK_LENGTH = 5;

export class GameScene extends Phaser.Scene {
    /** Commands that are ready to execute */
    private readyCommands: Command[];
    /** Commands that were queued by the player, but not ready yet (due to ping) */
    private queuedCommands: QueuedCommand[];
    /** The command that is currently being executed */
    private lastExecutedCommand: Command;

    drone: Drone;
    private enemies: Enemy[];

    private map: Grid;

    private currentPingValue = 0;
    private levelDepth = 0;
    private signalBlockedCount = 0;

    private lastTickAt = 0;
    private signalBlockedTexture: Phaser.GameObjects.RenderTexture;

    private get width() {
        return this.physics.world.bounds.width;
    }
    private get height() {
        return this.physics.world.bounds.height;
    }
    private get signalIsBlocked() {
        return this.signalBlockedCount > 0;
    }

    constructor() {
        super({ key: "Game" });
    }

    init(data: { levelDepth: number }): void {
        this.levelDepth = data.levelDepth || 0;
    }

    preload(): void {
        // TODO sprite sheet!
        this.load.image("drone", "assets/drone_1.png");
        this.load.image("portal", "assets/portal_1.png");
        this.load.image(TileType[TileType.Ground], "assets/ground_2.png");
        this.load.image(TileType[TileType.Wall], "assets/ground_1.png");
        this.load.image(TileType[TileType.Static], "assets/static_1.png");
        this.load.image(EnemyType[EnemyType.MajorEnemy], "assets/enemy_1.png");
        this.load.image(EnemyType[EnemyType.MinorEnemy], "assets/enemy_2.png");
    }

    create(): void {
        this.readyCommands = [];
        this.queuedCommands = [];

        //TODO
        const countX = this.width / TILE_WIDTH;
        const countY = this.height / TILE_WIDTH;

        /** DRAW MAP */

        this.map = new Grid(countX, countY, this.levelDepth);

        const bgColor = this.map.color.bg;
        const fgColor = this.map.color.fg;

        this.cameras.main.setBackgroundColor(bgColor);

        const walls: GameObjects.GameObject[] = [];
        const statics: GameObjects.GameObject[] = [];

        for (let i = 0; i < countX; i++) {
            for (let j = 0; j < countY; j++) {
                const x = i * TILE_WIDTH;
                const y = j * TILE_WIDTH;
                const contents = this.map.contents[i][j];
                const img = this.add.image(x, y, TileType[contents]);
                img.setOrigin(0, 0);
                img.setTint(fgColor);
                this.physics.add.existing(img);
                (img.body as Phaser.Physics.Arcade.Body).setImmovable(true);

                if (contents === TileType.Wall) {
                    walls.push(img);
                } else if (contents === TileType.Static) {
                    statics.push(img);
                }
            }
        }

        /** ADD DRONE + PORTAL */

        this.drone = new Drone(this);
        this.add.existing(this.drone);
        this.drone.moveToCell(this.map.playerStart.x, this.map.playerStart.y);

        const portal = this.add.image(
            this.map.portal.x * TILE_WIDTH,
            this.map.portal.y * TILE_WIDTH,
            "portal"
        );
        portal.setOrigin(0, 0);
        this.physics.add.existing(portal);

        /** ADD ENEMIES */
        this.enemies = [];
        this.map.enemies.forEach((e) => {
            const enemy = new Enemy(this, e.type);
            this.add.existing(enemy);
            enemy.moveToCell(e.x, e.y);
            this.enemies.push(enemy);
        });

        /** SIGNAL BLOCKED OVERLAY */
        this.signalBlockedTexture = this.add
            .renderTexture(0, 0, this.width, this.height)
            .setVisible(false);
        this.signalBlockedTexture.fill(0x000000).draw(
            this.make.text(
                {
                    x: this.width / 2,
                    y: this.height / 2,
                    origin: 0.5,
                    text: "SIGNAL LOST\nReconnecting...",
                    style: {
                        align: "center",
                    },
                },
                false
            )
        );

        /** INIT INTERNAL PROPERTIES */

        this.setPing();
        this.setupInputListeners();
        this.setupDebugUi();
        this.updateSignalBlockStatus();

        /** PHYSICS */

        this.physics.world.setBounds(0, 0, this.width, this.height);
        this.physics.world.setBoundsCollision();
        // TODO This is causing weird collision issues even when not touching the bounds
        // this.physics.world.on(
        //     "worldbounds",
        //     this.collideWall.bind(this, this.drone)
        // );

        this.physics.add.overlap(
            this.drone,
            walls,
            this.collideWall.bind(this)
        );
        this.physics.add.overlap(
            this.drone,
            portal,
            this.collidePortal.bind(this)
        );
        this.physics.add.overlap(
            this.drone,
            this.enemies,
            this.collideEnemy.bind(this)
        );
        this.physics.add.overlap(
            this.drone,
            statics,
            this.collideStatic.bind(this)
        );

        /** CAMERA */
        this.zoomCameraOnPlayer();
    }

    update(time: number): void {
        this.setQueuedInputTimes(time);
        const tickDelta = time - this.lastTickAt;
        if (tickDelta >= TICK_LENGTH_MS) {
            this.lastTickAt = time;
            this.doTick(time);
        }
    }

    getCellAtCoords(x: number, y: number): { x: number; y: number } {
        return {
            x: Math.floor(x / TILE_WIDTH),
            y: Math.floor(y / TILE_WIDTH),
        };
    }

    private setPing() {
        // ping min is (multiplier * depth / 2) + 100
        // ping max is (multiplier * depth) + 100
        const halfPing = (PING_MULTIPLIER * this.levelDepth) / 2;

        this.currentPingValue =
            halfPing + getRandomInt(halfPing) + getRandomInt(100);
    }

    private setQueuedInputTimes(time: number) {
        this.queuedCommands
            .filter((q) => q.executeAfter === 0)
            .forEach((q) => (q.executeAfter = time + this.currentPingValue));
    }

    private doTick(time: number) {
        this.setPing();

        // move items from the received queue to the ready queue as they mature
        while (this.queuedCommands.length) {
            const currentItem = this.queuedCommands[0];
            // if the first item on the queue isn't mature, nothing is
            if (currentItem.executeAfter > time) {
                break;
            }

            this.readyCommands.push(currentItem.command);
            this.queuedCommands.shift();
        }

        if (this.readyCommands.length) {
            this.lastExecutedCommand = this.readyCommands.shift();
        }

        this.updateSignalBlockStatus();
        this.updateUi();

        this.drone.processCommand(this.lastExecutedCommand);
        this.enemies.forEach((e) => e.process());
    }

    private updateSignalBlockStatus() {
        this.signalBlockedCount -= 1;
        const textureIsVisible = this.signalBlockedTexture.visible;

        if (this.signalIsBlocked && !textureIsVisible) {
            this.signalBlockedTexture.setVisible(true);
            this.resetCameraZoom();
        } else if (!this.signalIsBlocked && textureIsVisible) {
            // if the signal isn't blocked, there's nothing to do
            this.signalBlockedCount = 0;
            this.zoomCameraOnPlayer();
            this.signalBlockedTexture.setVisible(false);
        }
    }

    private updateUi() {
        const plugin = this.plugins.get(
            CommandEmitterPlugin.name,
            true
        ) as CommandEmitterPlugin;

        plugin.updateClientData({
            currentPing: this.currentPingValue,
            signalIsBlocked: this.signalIsBlocked,
            readyCommands: this.readyCommands,
            queuedCommands: this.queuedCommands.map((c) => c.command),
            lastExecutedCommand: this.lastExecutedCommand,
        });
    }

    private setupInputListeners() {
        const plugin = this.plugins.get(
            CommandEmitterPlugin.name,
            true
        ) as CommandEmitterPlugin;

        // add a listener for each command type
        Object.keys(Command).forEach((c) => {
            const command = Command[c as keyof typeof Command];
            plugin.on(command, () => {
                if (this.signalIsBlocked) {
                    return;
                }
                this.queuedCommands.push({
                    command: command,
                    executeAfter: 0,
                });
            });
        });
    }

    private collideWall(entity: MoveableEntity) {
        this.lastExecutedCommand = Command.Halt;
        entity.processCommand(Command.Halt);
    }

    private collideStatic() {
        this.signalBlockedCount = STATIC_SIGNAL_BLOCK_LENGTH;

        // if the drone is stuck in the static, game over
        if (this.lastExecutedCommand === Command.Halt) {
            this.transitionToGameOver("Missing in action");
        }
    }

    private collidePortal() {
        this.scene.start("Game", { levelDepth: this.levelDepth + 1 });
    }

    private collideEnemy() {
        this.transitionToGameOver("Destroyed by hostile life");
    }

    private transitionToGameOver(reason: string) {
        this.scene.start("GameOver", {
            reason: reason,
            score: this.levelDepth + 1,
        });
    }

    private zoomCameraOnPlayer() {
        this.cameras.main.startFollow(
            this.drone,
            false,
            1,
            1,
            TILE_WIDTH / 2,
            TILE_WIDTH / 2
        );
        this.cameras.main.setZoom(this.width / TILE_WIDTH / 10);
    }

    private resetCameraZoom() {
        this.cameras.main.setZoom(1, 1);
        this.cameras.main.stopFollow();
        this.cameras.main.setScroll(0, 0);
    }

    private debugMode = false;
    private setupDebugUi() {
        document
            .querySelector("#js-debugmode")
            .addEventListener("click", (e) => {
                e.preventDefault();

                this.debugMode = !this.debugMode;

                if (this.debugMode) {
                    this.resetCameraZoom();
                } else {
                    this.zoomCameraOnPlayer();
                }
            });
    }
}
