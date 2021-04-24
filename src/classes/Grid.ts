import { getRandomInt } from "../utils";

export enum TileType {
    Ground,
    Wall,
    PlayerStart,
}

export enum EnemyType {
    MajorEnemy,
    MinorEnemy,
}

export class Grid {
    contents: TileType[][] = [];
    readonly playerStart: { x: number; y: number };
    readonly portal: { x: number; y: number };
    readonly enemies: { type: EnemyType; x: number; y: number }[] = [];

    readonly color: { fg: number; bg: number };

    private height: number;
    private width: number;
    private difficulty: number;

    constructor(width: number, height: number, difficulty: number) {
        this.height = height;
        this.width = width;
        this.difficulty = difficulty;

        this.playerStart = {
            x: getRandomInt(this.width),
            y: getRandomInt(this.height),
        };

        // TODO actually generate random portal coords, with a min distance from player
        this.portal = {
            x: this.width - this.playerStart.x - 1,
            y: this.height - this.playerStart.y - 1,
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

                this.contents[i][j] = isWall ? TileType.Wall : TileType.Ground;
            }
        }

        // ensure that both the portal and player squares are ground
        this.contents[this.playerStart.x][this.playerStart.y] = TileType.Ground;
        this.contents[this.portal.x][this.portal.y] = TileType.Ground;

        // slap some enemies onto the map
        // TODO intelligently place these as they can currently overlap with walls and eachother...
        const minorEnemyCount = this.difficulty * 3 || 3;
        const majorEnemyCount = Math.ceil(this.difficulty / 2);

        for (let i = 0; i < minorEnemyCount; i++) {
            if (i < majorEnemyCount) {
                this.enemies.push({
                    type: EnemyType.MajorEnemy,
                    x: getRandomInt(this.width - 1),
                    y: getRandomInt(this.height - 1),
                });
            }

            this.enemies.push({
                type: EnemyType.MinorEnemy,
                x: getRandomInt(this.width - 1),
                y: getRandomInt(this.height - 1),
            });
        }
    }
}
