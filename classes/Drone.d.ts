import type { GameScene } from "../scenes/GameScene";
import { Command } from "../utils";
import { MoveableEntity } from "./MoveableEntity";
export declare class Drone extends MoveableEntity {
    constructor(scene: GameScene);
    protected playAnimation(command: Command): void;
}
