import { TILE_WIDTH } from "../config";
import { Command, GameScene } from "../scenes/GameScene";

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
            // HACK: adjust the drone bounds so the corners don't collide with the walls
            .setSize(TILE_WIDTH - 1, TILE_WIDTH - 1, true);
    }

    moveToCell(x: number, y: number): void {
        const coords = {
            x: TILE_WIDTH * x,
            y: TILE_WIDTH * y,
        };

        this.setPosition(coords.x, coords.y);
    }

    centerOnCurrentCell(): void {
        const pos = this.getCenter();
        const cell = this.scene.getCellAtCoords(pos.x, pos.y);
        this.moveToCell(cell.x, cell.y);
    }

    processCommand(command: Command): void {
        const body = this.body;

        // update the direction
        switch (command) {
            case Command.Up:
                body.setVelocity(0, -TILE_WIDTH);
                break;
            case Command.Down:
                body.setVelocity(0, TILE_WIDTH);
                break;
            case Command.Left:
                body.setVelocity(-TILE_WIDTH, 0);
                break;
            case Command.Right:
                body.setVelocity(TILE_WIDTH, 0);
                break;
            default:
                body.setVelocity(0, 0);
        }
    }
}
