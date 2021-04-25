import type { GameScene } from "../scenes/GameScene";
import { Command } from "../utils";
export declare abstract class MoveableEntity extends Phaser.GameObjects.Sprite {
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
    protected abstract playAnimation(command: Command): void;
}
