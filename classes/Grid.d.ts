export declare enum TileType {
    Ground = 0,
    Wall = 1,
    PlayerStart = 2
}
export declare enum EnemyType {
    MajorEnemy = 0,
    MinorEnemy = 1
}
export declare class Grid {
    contents: TileType[][];
    readonly playerStart: {
        x: number;
        y: number;
    };
    readonly portal: {
        x: number;
        y: number;
    };
    readonly enemies: {
        type: EnemyType;
        x: number;
        y: number;
    }[];
    readonly color: {
        fg: number;
        bg: number;
    };
    private height;
    private width;
    private difficulty;
    constructor(width: number, height: number, difficulty: number);
    private generate;
}
