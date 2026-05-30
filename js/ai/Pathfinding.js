class Pathfinding {
    constructor(mapData) {
        this.mapData = mapData;
    }

    /**
     * A* pathfinding from start to end on the grid.
     * @param {number} sc - Start column
     * @param {number} sr - Start row
     * @param {number} ec - End column
     * @param {number} er - End row
     * @param {Array<{col:number,row:number}>} blocked - Tiles blocked by towers
     * @returns {Array<{col:number,row:number}>|null} Path as array of grid coords, or null
     */
    findPath(sc, sr, ec, er, blocked = []) {
        const grid = this.mapData.grid;
        const rows = grid.length;
        const cols = grid[0].length;
        const blockedSet = new Set(blocked.map(t => `${t.col},${t.row}`));

        const key = (c, r) => `${c},${r}`;
        const open = [];
        const closed = new Set();
        const cameFrom = new Map();
        const gScore = new Map();
        const fScore = new Map();

        const sk = key(sc, sr);
        gScore.set(sk, 0);
        fScore.set(sk, this._heuristic(sc, sr, ec, er));
        open.push({ col: sc, row: sr, f: fScore.get(sk) });

        while (open.length > 0) {
            // Sort by fScore (lowest first)
            open.sort((a, b) => a.f - b.f);
            const current = open.shift();
            const ck = key(current.col, current.row);

            if (current.col === ec && current.row === er) {
                return this._reconstructPath(cameFrom, current);
            }

            closed.add(ck);

            // 4-directional neighbors
            const neighbors = [
                { col: current.col - 1, row: current.row, cost: 1 },
                { col: current.col + 1, row: current.row, cost: 1 },
                { col: current.col, row: current.row - 1, cost: 1 },
                { col: current.col, row: current.row + 1, cost: 1 },
            ];

            for (const n of neighbors) {
                const nk = key(n.col, n.row);
                if (closed.has(nk)) continue;

                // Bounds check
                if (n.col < 0 || n.col >= cols || n.row < 0 || n.row >= rows) continue;

                const tile = this.mapData.getTile(n.col, n.row);
                // Out of bounds or unbuildable
                if (tile === -1 || tile === CONFIG.TILE_UNBUILDABLE) continue;
                // Only walkable on path or buildable tiles
                if (tile !== CONFIG.TILE_PATH &&
                    tile !== CONFIG.TILE_BUILDABLE &&
                    tile !== CONFIG.TILE_GRASS) continue;

                // Check if blocked by tower
                if (blockedSet.has(nk)) continue;

                const tentG = (gScore.get(ck) ?? Infinity) + n.cost;

                if (tentG < (gScore.get(nk) ?? Infinity)) {
                    cameFrom.set(nk, current);
                    gScore.set(nk, tentG);
                    const f = tentG + this._heuristic(n.col, n.row, ec, er);
                    fScore.set(nk, f);

                    if (!open.some(o => o.col === n.col && o.row === n.row)) {
                        open.push({ col: n.col, row: n.row, f });
                    }
                }
            }
        }

        return null; // No path found
    }

    _heuristic(c1, r1, c2, r2) {
        // Manhattan distance
        return Math.abs(c1 - c2) + Math.abs(r1 - r2);
    }

    _reconstructPath(cameFrom, current) {
        const path = [];
        let node = current;
        const key = (c, r) => `${c},${r}`;

        while (node) {
            path.unshift({ col: node.col, row: node.row });
            node = cameFrom.get(key(node.col, node.row)) || null;
        }

        return path;
    }
}
