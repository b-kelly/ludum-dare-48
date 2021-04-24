import type { GameScene } from "../scenes/GameScene";
export declare enum Command {
    Halt = 0,
    Left = 1,
    Right = 2,
    Up = 3,
    Down = 4
}
export declare abstract class MoveableEntity extends Phaser.GameObjects.Image {
    body: Phaser.Physics.Arcade.Body;
    scene: GameScene;
    constructor(scene: GameScene, x: number, y: number, texture: string, frame?: string | number);
    moveToCell(x: number, y: number): void;
    centerOnCurrentCell(): void;
    currentCell(): {
        x: number;
        y: number;
    };
    processCommand(command: Command): void;
}
