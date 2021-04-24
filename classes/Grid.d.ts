export declare enum Entity {
    Ground = 0,
    Wall = 1,
    PlayerStart = 2
}
export declare class Grid {
    contents: Entity[][];
    readonly playerStart: {
        x: number;
        y: number;
    };
    readonly portal: {
        x: number;
        y: number;
    };
    readonly color: {
        fg: number;
        bg: number;
    };
    private height;
    private width;
    constructor(width: number, height: number);
    private generate;
}
