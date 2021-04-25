export enum Command {
    Halt,
    Left,
    Right,
    Up,
    Down,
}

export function getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
}
