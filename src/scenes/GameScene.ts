import { GameObjects } from "phaser";
import { Command, MoveableEntity } from "../classes/MoveableEntity";
import { TileType, Grid, EnemyType } from "../classes/Grid";
import { TILE_WIDTH } from "../config";
import { getRandomInt } from "../utils";
import { Drone } from "../classes/Drone";
import { Enemy } from "../classes/Enemy";

interface QueuedCommand {
    command: Command;
    executeAfter: number;
}

const PING_MULTIPLIER = 1000;
// only tick once every n * 1000ms
const TICK_LENGTH = 1 * 1000;

export class GameScene extends Phaser.Scene {
    /** Commands that are ready to execute */
    private readyCommands: Command[] = [];
    /** Commands that were queued by the player, but not ready yet (due to ping) */
    private queuedCommands: QueuedCommand[] = [];
    /** The command that is currently being executed */
    private lastExecutedCommand: Command;

    private drone: Drone;
    private enemies: Enemy[] = [];

    private map: Grid;

    private currentPingValue = 0;
    private levelDepth = 0;

    private lastTickAt = 0;

    private get width() {
        return this.physics.world.bounds.width;
    }
    private get height() {
        return this.physics.world.bounds.height;
    }

    constructor() {
        super({ key: "GameScene" });
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
        this.load.image(EnemyType[EnemyType.MajorEnemy], "assets/enemy_1.png");
        this.load.image(EnemyType[EnemyType.MinorEnemy], "assets/enemy_2.png");
    }

    create(): void {
        //TODO
        const countX = this.width / TILE_WIDTH;
        const countY = this.height / TILE_WIDTH;

        /** DRAW MAP */

        this.map = new Grid(countX, countY, this.levelDepth);

        const bgColor = this.map.color.bg;
        const fgColor = this.map.color.fg;

        this.cameras.main.setBackgroundColor(bgColor);

        const walls: GameObjects.GameObject[] = [];

        for (let i = 0; i < countX; i++) {
            for (let j = 0; j < countY; j++) {
                const x = i * TILE_WIDTH;
                const y = j * TILE_WIDTH;
                const contents = this.map.contents[i][j];
                const img = this.add.image(x, y, this.getEntityImage(contents));
                img.setOrigin(0, 0);
                img.setTint(fgColor);
                this.physics.add.existing(img);
                (img.body as Phaser.Physics.Arcade.Body).setImmovable(true);

                if (contents === TileType.Wall) {
                    walls.push(img);
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
        this.map.enemies.forEach((e) => {
            const enemy = new Enemy(this, e.type);
            this.add.existing(enemy);
            enemy.moveToCell(e.x, e.y);
            this.enemies.push(enemy);
        });

        /** INIT INTERNAL PROPERTIES */

        this.setPing();
        this.setupInputListeners();
        this.setupDebugUi();

        /** PHYSICS */

        this.physics.world.checkCollision.up = true;
        this.physics.world.checkCollision.down = true;
        this.physics.world.checkCollision.left = true;
        this.physics.world.checkCollision.right = true;

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

        /** CAMERA */
        this.zoomCameraOnPlayer();
    }

    update(time: number): void {
        this.setQueuedInputTimes(time);
        const tickDelta = time - this.lastTickAt;
        if (tickDelta >= TICK_LENGTH) {
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
        this.drone.centerOnCurrentCell();
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

        this.updateUi();

        this.drone.processCommand(this.lastExecutedCommand);
        this.enemies.forEach((e) => e.process());
    }

    private updateUi() {
        // TODO update external UI
        // TODO cache elements
        document.querySelector(
            "#js-ping"
        ).textContent = `Ping: ${this.currentPingValue}`;
        document.querySelector("#js-queued").textContent =
            "Sent: " +
            this.queuedCommands.reduce(
                (p, n) => `${p},${Command[n.command]}`,
                ""
            );
        document.querySelector("#js-ready").textContent =
            "Received: " +
            this.readyCommands.reduce((p, n) => `${p},${Command[n]}`, "");
        document.querySelector("#js-executing").textContent = `Executing: ${
            Command[this.lastExecutedCommand] || Command[Command.Halt]
        }`;
    }

    private setupInputListeners() {
        // TODO accept input from buttons clicks / network only!
        const listener = (command: Command) => {
            const q = this.queuedCommands;
            return function (e: Event) {
                e.preventDefault();
                e.stopPropagation();
                q.push({
                    command: command,
                    executeAfter: 0,
                });
            };
        };

        document
            .querySelector("#js-up-btn")
            .addEventListener("click", listener(Command.Up));
        document
            .querySelector("#js-down-btn")
            .addEventListener("click", listener(Command.Down));
        document
            .querySelector("#js-left-btn")
            .addEventListener("click", listener(Command.Left));
        document
            .querySelector("#js-right-btn")
            .addEventListener("click", listener(Command.Right));
        document
            .querySelector("#js-halt-btn")
            .addEventListener("click", listener(Command.Halt));
    }

    private collideWall(entity: MoveableEntity) {
        this.lastExecutedCommand = Command.Halt;
        this.drone.processCommand(Command.Halt);
        // pin the player to the current cell so we don't get stuck
        entity.centerOnCurrentCell();
    }

    private collidePortal() {
        this.scene.restart({ levelDepth: this.levelDepth + 1 });
    }

    //private collideHazard() {}

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

    private debugMode = false;
    private setupDebugUi() {
        document
            .querySelector("#js-debugmode")
            .addEventListener("click", (e) => {
                e.preventDefault();

                this.debugMode = !this.debugMode;

                if (this.debugMode) {
                    this.cameras.main.setZoom(1, 1);
                    this.cameras.main.stopFollow();
                    this.cameras.main.setScroll(0, 0);
                } else {
                    this.zoomCameraOnPlayer();
                }
            });
    }

    private getEntityImage(entity: TileType) {
        switch (entity) {
            case TileType.Wall:
                return TileType[TileType.Wall];
            default:
                return TileType[TileType.Ground];
        }
    }
}
