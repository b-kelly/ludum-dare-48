import { getRandomInt } from "../utils";

export enum Entity {
    Ground,
    Wall,
    PlayerStart,
}

export class Grid {
    contents: Entity[][] = [];
    readonly playerStart: { x: number; y: number };
    readonly color: { fg: number; bg: number };

    private height: number;
    private width: number;

    constructor(width: number, height: number) {
        this.height = height;
        this.width = width;

        this.playerStart = {
            x: getRandomInt(this.width),
            y: getRandomInt(this.height),
        };

        const fgColor = getRandomInt(0xffffff);
        this.color = {
            fg: fgColor,
            bg: fgColor ^ 0xffffff,
        };

        this.generate();
    }

    private generate() {
        // TODO actually smart generate the map

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                if (!this.contents[i]) {
                    this.contents[i] = [];
                }

                // 10% chance to be a wall
                const isWall = getRandomInt(100) % 10 === 0;

                this.contents[i][j] = isWall ? Entity.Wall : Entity.Ground;
            }
        }
    }
}
