import { GameScene } from "../scenes/GameScene";
import { getRandomInt } from "../utils";
import { EnemyType } from "./Grid";
import { Command, MoveableEntity } from "./MoveableEntity";

export class Enemy extends MoveableEntity {
    readonly enemyType: EnemyType;
    declare scene: GameScene;

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
        const dronePos = this.scene.drone.currentCell();
        const pos = this.currentCell();

        let command: Command;

        if (pos.x < dronePos.x) {
            command = Command.Right;
        } else if (pos.x > dronePos.x) {
            command = Command.Left;
        } else if (pos.y < dronePos.y) {
            command = Command.Down;
        } else if (pos.y > dronePos.y) {
            command = Command.Up;
        }

        this.processCommand(command);
    }

    private processRandomMovement() {
        const commands = Object.keys(Command);
        const index = getRandomInt(commands.length - 1);
        this.processCommand(Command[commands[index] as keyof typeof Command]);
    }
}
