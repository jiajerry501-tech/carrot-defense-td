const MAP_DATA = {
    // 15 cols × 10 rows grid
    // 0=grass, 1=path, 2=buildable, 3=unbuildable
    grid: [
        [1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2],
    ],

    pathWaypoints: [
        { x: -32, y: 32 },
        { x: 352, y: 32 },
        { x: 352, y: 224 },
        { x: 672, y: 224 },
        { x: 672, y: 416 },
        { x: 352, y: 416 },
        { x: 352, y: 608 },
        { x: 672, y: 608 },
    ],

    getTile(col, row) {
        if (row < 0 || row >= this.grid.length || col < 0 || col >= this.grid[0].length) {
            return -1;
        }
        return this.grid[row][col];
    },

    isBuildable(col, row) {
        return this.getTile(col, row) === CONFIG.TILE_BUILDABLE;
    },

    isPath(col, row) {
        return this.getTile(col, row) === CONFIG.TILE_PATH;
    },

    pixelToGrid(px, py) {
        return {
            col: Math.floor(px / CONFIG.TILE_SIZE),
            row: Math.floor(py / CONFIG.TILE_SIZE),
        };
    },

    gridToPixel(col, row) {
        return {
            x: col * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2,
            y: row * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2,
        };
    },
};
