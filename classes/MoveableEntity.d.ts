import { Command, GameScene } from "../scenes/GameScene";
export declare abstract class MoveableEntity extends Phaser.GameObjects.Image {
    body: Phaser.Physics.Arcade.Body;
    scene: GameScene;
    constructor(scene: GameScene, x: number, y: number, texture: string, frame?: string | number);
    moveToCell(x: number, y: number): void;
    centerOnCurrentCell(): void;
    processCommand(command: Command): void;
}
