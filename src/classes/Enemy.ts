import { GameScene } from "../scenes/GameScene";
import { getRandomInt } from "../utils";
import { EnemyType } from "./Grid";
import { Command, MoveableEntity } from "./MoveableEntity";

export class Enemy extends MoveableEntity {
    readonly enemyType: EnemyType;

    constructor(scene: GameScene, enemyType: EnemyType) {
        super(scene, 0, 0, EnemyType[enemyType]);
        this.enemyType = enemyType;
    }

    process(): void {
        if (this.enemyType === EnemyType.MajorEnemy) {
            this.processHomeOnPlayer();
        } else {
            this.processRandomMovement();
        }
    }

    private processHomeOnPlayer() {
        //TODO
    }

    private processRandomMovement() {
        const commands = Object.keys(Command);
        const index = getRandomInt(commands.length - 1);
        this.processCommand(Command[commands[index] as keyof typeof Command]);
    }
}
