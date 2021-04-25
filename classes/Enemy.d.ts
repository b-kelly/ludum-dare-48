import { GameScene } from "../scenes/GameScene";
import { EnemyType } from "./Grid";
import { MoveableEntity } from "./MoveableEntity";
export declare class Enemy extends MoveableEntity {
    readonly enemyType: EnemyType;
    scene: GameScene;
    constructor(scene: GameScene, enemyType: EnemyType);
    process(): void;
    private processHomeOnPlayer;
    private processRandomMovement;
    protected playAnimation(): void;
}
