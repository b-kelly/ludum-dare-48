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

export function setInstruction(key: string): void {
    document
        .querySelectorAll<HTMLElement>("#js-instructions [data-text]")
        .forEach((el) => {
            el.classList.toggle("d-none", el.dataset.text !== key);
        });
}
