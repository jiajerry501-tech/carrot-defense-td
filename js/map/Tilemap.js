class Tilemap {
    constructor(mapData) {
        this.mapData = mapData;

        // 4 rendering layers (order matters: ground → path → deco → overlay)
        this.groundLayer = new PIXI.Container();
        this.pathLayer = new PIXI.Container();
        this.decoLayer = new PIXI.Container();
        this.overlayLayer = new PIXI.Container();

        this.container = new PIXI.Container();
        this.container.addChild(this.groundLayer);
        this.container.addChild(this.pathLayer);
        this.container.addChild(this.decoLayer);
        this.container.addChild(this.overlayLayer);

        this.draw();
    }

    draw() {
        const { TILE_SIZE, MAP_COLS, MAP_ROWS } = CONFIG;
        const { grid } = this.mapData;

        // Create a single graphics object per layer for performance
        const groundGfx = new PIXI.Graphics();
        const pathGfx = new PIXI.Graphics();

        for (let row = 0; row < MAP_ROWS; row++) {
            for (let col = 0; col < MAP_COLS; col++) {
                const tile = grid[row][col];
                const x = col * TILE_SIZE;
                const y = row * TILE_SIZE;

                if (tile === CONFIG.TILE_GRASS) {
                    groundGfx.beginFill(CONFIG.COLOR_GRASS);
                    groundGfx.drawRect(x, y, TILE_SIZE, TILE_SIZE);
                    groundGfx.endFill();
                } else if (tile === CONFIG.TILE_BUILDABLE) {
                    groundGfx.beginFill(CONFIG.COLOR_BUILDABLE);
                    groundGfx.drawRect(x, y, TILE_SIZE, TILE_SIZE);
                    groundGfx.endFill();
                } else if (tile === CONFIG.TILE_UNBUILDABLE) {
                    groundGfx.beginFill(CONFIG.COLOR_UNBUILDABLE);
                    groundGfx.drawRect(x, y, TILE_SIZE, TILE_SIZE);
                    groundGfx.endFill();
                } else if (tile === CONFIG.TILE_PATH) {
                    pathGfx.beginFill(CONFIG.COLOR_PATH);
                    pathGfx.lineStyle(1, CONFIG.COLOR_PATH_BORDER, 0.4);
                    pathGfx.drawRect(x, y, TILE_SIZE, TILE_SIZE);
                    pathGfx.lineStyle(0);
                    pathGfx.endFill();
                }
            }
        }

        this.groundLayer.addChild(groundGfx);
        this.pathLayer.addChild(pathGfx);

        // Grid overlay lines
        const gridGfx = new PIXI.Graphics();
        gridGfx.lineStyle(1, CONFIG.COLOR_GRID_LINE, 0.06);
        for (let row = 0; row <= MAP_ROWS; row++) {
            gridGfx.moveTo(0, row * TILE_SIZE);
            gridGfx.lineTo(MAP_COLS * TILE_SIZE, row * TILE_SIZE);
        }
        for (let col = 0; col <= MAP_COLS; col++) {
            gridGfx.moveTo(col * TILE_SIZE, 0);
            gridGfx.lineTo(col * TILE_SIZE, MAP_ROWS * TILE_SIZE);
        }
        this.overlayLayer.addChild(gridGfx);
    }
}
