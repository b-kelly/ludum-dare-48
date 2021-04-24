export class GameOverScene extends Phaser.Scene {
    private score = 0;

    constructor() {
        super({ key: "GameOver" });
    }

    init(data: { score: number }): void {
        this.score = data.score || 0;
    }

    create(): void {
        this.cameras.main.setBackgroundColor(0x000000);
        this.add.text(0, 0, `Game Over\nYour score: ${this.score}`);
    }
}
