import { GameObjects } from "phaser";
import { Entity, Grid } from "../classes/Grid";
import { TILE_WIDTH } from "../config";
import { getRandomInt } from "../utils";

enum Command {
    Halt,
    Left,
    Right,
    Up,
    Down,
}

interface QueuedCommand {
    command: Command;
    queuedAt: number;
}

const PING_MULTIPLIER = 1000;
// only tick once every n * 1000ms
const TICK_LENGTH = 1 * 1000;

export class GameScene extends Phaser.Scene {
    /** Commands that are ready to execute */
    private readyCommands: Command[] = [];
    /** Commands that were queued by the player, but not ready yet (due to ping) */
    private queuedCommands: QueuedCommand[] = [];
    private drone: Phaser.GameObjects.Image;
    private map: Grid;
    private currentPingValue = 0;
    private levelDepth = 0;
    private lastExecutedCommand: Command;

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

    preload(): void {
        // TODO sprite sheet!
        this.load.image("drone", "assets/drone_1.png");
        this.load.image("ground", "assets/ground_2.png");
        this.load.image("wall", "assets/ground_1.png");
        this.load.image("portal", "assets/portal_1.png");
    }

    create(): void {
        //TODO
        const countX = this.width / TILE_WIDTH;
        const countY = this.height / TILE_WIDTH;

        this.map = new Grid(countX, countY);

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

                if (contents === Entity.Wall) {
                    walls.push(img);
                }
            }
        }

        this.drone = this.add.image(
            this.map.playerStart.x * TILE_WIDTH,
            this.map.playerStart.y * TILE_WIDTH,
            "drone"
        );
        this.drone.setOrigin(0, 0);
        this.physics.add.existing(this.drone);

        const portal = this.add.image(
            this.map.portal.x * TILE_WIDTH,
            this.map.portal.y * TILE_WIDTH,
            "portal"
        );
        portal.setOrigin(0, 0);

        this.setPing();
        this.setupInputListeners();

        this.physics.world.checkCollision.up = true;
        this.physics.world.checkCollision.down = true;
        this.physics.world.checkCollision.left = true;
        this.physics.world.checkCollision.right = true;

        (this.drone.body as Phaser.Physics.Arcade.Body)
            .setCollideWorldBounds(true)
            .setBounce(1, 1);

        this.physics.add.collider(
            this.drone,
            walls,
            this.collideWall.bind(this)
        );
        this.physics.add.collider(
            this.drone,
            portal,
            this.collideWall.bind(this)
        );
    }

    update(time: number): void {
        const tickDelta = time - this.lastTickAt;
        if (tickDelta >= TICK_LENGTH) {
            this.lastTickAt = time;
            this.doTick(time);
        }
    }

    private setPing() {
        // ping min is (multiplier * depth / 2) + 100
        // ping max is (multiplier * depth) + 100
        const halfPing = (PING_MULTIPLIER * this.levelDepth) / 2;

        this.currentPingValue =
            halfPing + getRandomInt(halfPing) + getRandomInt(100);
    }

    private doTick(time: number) {
        this.setPing();
        this.updateUi();

        // move items from the received queue to the ready queue as they mature
        for (let i = this.queuedCommands.length - 1; i >= 0; i--) {
            const currentItem = this.queuedCommands[i];
            if (currentItem.queuedAt <= time) {
                this.queuedCommands.splice(i, 1);
                this.readyCommands.push(currentItem.command);
            }
        }

        if (this.readyCommands.length) {
            this.lastExecutedCommand = this.readyCommands.shift();
        }

        this.updatePlayer(this.lastExecutedCommand);
    }

    private updatePlayer(command: Command) {
        const body = this.drone.body as Phaser.Physics.Arcade.Body;
        body.setVelocity(0, 0);
        switch (command) {
            case Command.Up:
                body.setVelocityY(-TILE_WIDTH);
                break;
            case Command.Down:
                body.setVelocityY(TILE_WIDTH);
                break;
            case Command.Left:
                body.setVelocityX(-TILE_WIDTH);
                break;
            case Command.Right:
                body.setVelocityX(TILE_WIDTH);
                break;
            default:
                return;
        }
    }

    private updateUi() {
        // TODO update external UI
        console.clear();
        console.table({
            ping: this.currentPingValue,
            queue: this.queuedCommands.reduce(
                (p, n) => `${p},${Command[n.command]}:${n.queuedAt}`,
                ""
            ),
            commands: this.readyCommands.reduce((p, n) => `${p},${n}`, ""),
        });
    }

    private setupInputListeners() {
        // TODO accept input from buttons clicks / network only!
        const cursorKeys = this.input.keyboard.createCursorKeys();

        const listener = (command: Command) => {
            const q = this.queuedCommands;
            return function (this: Phaser.Input.Keyboard.Key) {
                q.push({
                    command: command,
                    queuedAt: this.timeDown,
                });
            };
        };

        cursorKeys.up.on("down", listener(Command.Up));
        cursorKeys.down.on("down", listener(Command.Down));
        cursorKeys.left.on("down", listener(Command.Left));
        cursorKeys.right.on("down", listener(Command.Right));
        cursorKeys.space.on("down", listener(Command.Halt));
    }

    private collideWall() {
        (this.drone.body as Phaser.Physics.Arcade.Body).setVelocity(0);
    }

    private getEntityImage(entity: Entity) {
        switch (entity) {
            case Entity.Wall:
                return "wall";
            default:
                return "ground";
        }
    }
}
