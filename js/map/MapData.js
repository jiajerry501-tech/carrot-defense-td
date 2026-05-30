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

    // Path waypoints in pixel coordinate
    pathWaypoints: [
        { x: -32, y: 32 },     // entry (off-screen left, row 0)
        { x: 352, y: 32 },     // col 5, row 0 - turn down
        { x: 352, y: 224 },    // col 5, row 3 - turn right
        { x: 672, y: 224 },    // col 10, row 3 - turn down
        { x: 672, y: 416 },    // col 10, row 6 - turn left
        { x: 352, y: 416 },    // col 5, row 6 - turn down
        { x: 352, y: 608 },    // col 5, row 9 - turn right
        { x: 608, y: 608 },    // col 9, row 9 - exit
        { x: 672, y: 608 },    // exit (off-screen right, row 9)
    ],

    entryCol: 0,
    entryRow: 0,
    exitCol: 10,
    exitRow: 9,

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
