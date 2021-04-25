import type { GameScene } from "../scenes/GameScene";
import { Command } from "../utils";
import { MoveableEntity } from "./MoveableEntity";

export class Drone extends MoveableEntity {
    constructor(scene: GameScene) {
        super(scene, 0, 0, "drone");
    }

    protected playAnimation(command: Command): void {
        let animation: string;
        switch (command) {
            case Command.Up:
                animation = "drone_up";
                break;
            case Command.Down:
                animation = "drone_down";
                break;
            case Command.Left:
                animation = "drone_left";
                break;
            case Command.Right:
                animation = "drone_right";
                break;
            default:
                animation = "drone_idle";
        }

        this.anims.play(animation, true);
    }
}
