import { getRandomInt } from "../utils";

export enum EntityType {
    Ground,
    Wall,
    PlayerStart,
}

export class Grid {
    contents: EntityType[][] = [];
    readonly playerStart: { x: number; y: number };
    readonly portal: { x: number; y: number };
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

        // TODO actually generate random portal coords, with a min distance from player
        this.portal = {
            x: this.width - this.playerStart.x,
            y: this.height - this.playerStart.y,
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

                this.contents[i][j] = isWall
                    ? EntityType.Wall
                    : EntityType.Ground;
            }
        }

        // ensure that both the portal and player squares are ground
        this.contents[this.playerStart.x][this.playerStart.y] =
            EntityType.Ground;
        this.contents[this.portal.x][this.portal.y] = EntityType.Ground;
    }
}
