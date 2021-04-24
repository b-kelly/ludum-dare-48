import { Entity, Grid } from "../classes/Grid";
import { TILE_WIDTH } from "../config";

export class GameScene extends Phaser.Scene {
    private get width() {
        return this.physics.world.bounds.width;
    }
    private get height() {
        return this.physics.world.bounds.height;
    }

    constructor() {
        super({ key: "GameScene" });
    }

    preload(): void {
        // TODO sprite sheet!
        this.load.image("drone", "assets/drone_2.png");
        this.load.image("ground", "assets/ground_2.png");
        this.load.image("wall", "assets/ground_1.png");
    }

    create(): void {
        //TODO
        const countX = this.width / TILE_WIDTH;
        const countY = this.height / TILE_WIDTH;

        const map = new Grid(countX, countY);

        const bgColor = map.color.bg;
        const fgColor = map.color.fg;

        this.cameras.main.setBackgroundColor(bgColor);

        for (let i = 0; i < countX; i++) {
            for (let j = 0; j < countY; j++) {
                const x = i * TILE_WIDTH;
                const y = j * TILE_WIDTH;
                const img = this.add.image(
                    x,
                    y,
                    this.getEntityImage(map.contents[i][j])
                );
                img.setOrigin(0, 0);
                img.setTint(fgColor);
            }
        }

        const drone = this.add.image(
            map.playerStart.x * TILE_WIDTH,
            map.playerStart.y * TILE_WIDTH,
            "drone"
        );
        drone.setOrigin(0, 0);
    }

    private getEntityImage(entity: Entity) {
        switch (entity) {
            case Entity.Wall:
                return "wall";
            default:
                return "ground";
        }
    }
}
