import type { GameScene } from "../scenes/GameScene";
import { MoveableEntity } from "./MoveableEntity";

export class Drone extends MoveableEntity {
    constructor(scene: GameScene) {
        super(scene, 0, 0, "drone");
    }
}
