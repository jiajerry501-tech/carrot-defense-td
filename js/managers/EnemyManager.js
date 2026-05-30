class EnemyManager {
    /**
     * @param {PathManager} pathManager
     * @param {object} callbacks
     * @param {function} callbacks.onEnemyReachEnd - Called when an enemy reaches path end
     * @param {function} callbacks.onEnemyDeath - Called when an enemy is killed
     */
    constructor(pathManager, callbacks = {}) {
        this.pathManager = pathManager;
        this.onEnemyReachEnd = callbacks.onEnemyReachEnd || (() => {});
        this.onEnemyDeath = callbacks.onEnemyDeath || (() => {});

        /** @type {Enemy[]} */
        this.enemies = [];
        this.container = new PIXI.Container();
    }

    /**
     * @param {string} type - Enemy type key
     * @returns {Enemy}
     */
    spawnEnemy(type) {
        const enemy = new Enemy(type, this.pathManager);
        this.enemies.push(enemy);
        this.container.addChild(enemy.container);
        return enemy;
    }

    /** @param {number} dt - Delta time in seconds */
    update(dt) {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];

            if (!enemy.alive) {
                if (enemy.reachedEnd) {
                    this.onEnemyReachEnd(enemy);
                } else {
                    this.onEnemyDeath(enemy);
                }
                this.container.removeChild(enemy.container);
                // Destroy PixiJS graphics
                enemy.bodyGfx.destroy();
                enemy.hpBarGfx.destroy();
                enemy.container.destroy();
                this.enemies.splice(i, 1);
                continue;
            }

            enemy.update(dt);
        }
    }

    /** @returns {number} Number of alive enemies */
    getAliveCount() {
        return this.enemies.length;
    }

    /** Remove all enemies */
    clear() {
        for (const enemy of this.enemies) {
            this.container.removeChild(enemy.container);
            enemy.bodyGfx.destroy();
            enemy.hpBarGfx.destroy();
            enemy.container.destroy();
        }
        this.enemies = [];
    }
}
