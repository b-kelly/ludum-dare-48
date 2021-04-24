import { TICK_LENGTH_MS, TILE_WIDTH } from "../config";
import type { GameScene } from "../scenes/GameScene";

export enum Command {
    Halt,
    Left,
    Right,
    Up,
    Down,
}

export abstract class MoveableEntity extends Phaser.GameObjects.Image {
    declare body: Phaser.Physics.Arcade.Body;
    declare scene: GameScene;

    constructor(
        scene: GameScene,
        x: number,
        y: number,
        texture: string,
        frame?: string | number
    ) {
        super(scene, x, y, texture, frame);

        this.setOrigin(0, 0);
        scene.physics.add.existing(this);

        this.body
            .setCollideWorldBounds(true)
            .setBounce(0, 0)
            // HACK: adjust the entity bounds so the corners don't collide with the walls
            .setSize(TILE_WIDTH - 2, TILE_WIDTH - 2, true);

        this.body.onWorldBounds = true;
    }

    moveToCell(x: number, y: number): void {
        const coords = {
            x: TILE_WIDTH * x,
            y: TILE_WIDTH * y,
        };

        this.setPosition(coords.x, coords.y);
    }

    centerOnCurrentCell(): void {
        const cell = this.currentCell();
        this.moveToCell(cell.x, cell.y);
    }

    currentCell(): { x: number; y: number } {
        const pos = this.getCenter();
        return this.scene.getCellAtCoords(pos.x, pos.y);
    }

    processCommand(command: Command): void {
        const body = this.body;
        const velocity = TILE_WIDTH / (TICK_LENGTH_MS / 1000);
        this.centerOnCurrentCell();

        // update the direction
        switch (command) {
            case Command.Up:
                body.setVelocity(0, -velocity);
                break;
            case Command.Down:
                body.setVelocity(0, velocity);
                break;
            case Command.Left:
                body.setVelocity(-velocity, 0);
                break;
            case Command.Right:
                body.setVelocity(velocity, 0);
                break;
            default:
                body.setVelocity(0, 0);
        }
    }
}
