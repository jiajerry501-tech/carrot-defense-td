class WaveManager {
    /**
     * @param {Array} waves - Wave configuration array
     * @param {EnemyManager} enemyManager
     * @param {object} callbacks
     */
    constructor(waves, enemyManager, callbacks = {}) {
        this.waves = waves;
        this.enemyManager = enemyManager;
        this.onWaveStart = callbacks.onWaveStart || (() => {});
        this.onWaveComplete = callbacks.onWaveComplete || (() => {});
        this.onAllComplete = callbacks.onAllComplete || (() => {});

        this.currentWaveIndex = 0;
        this.spawnQueue = [];
        this.spawnIndex = 0;
        this.waveElapsed = 0;
        this.waveActive = false;
        this.waveDelay = 3; // seconds between waves
        this.waveDelayTimer = 0;
        this.allComplete = false;
    }

    /** Start the wave system (call when game begins) */
    start() {
        this.waveDelayTimer = 2; // initial delay before first wave
        this.allComplete = false;
        this.currentWaveIndex = 0;
    }

    /** @param {number} dt - Delta time in seconds */
    update(dt) {
        if (this.allComplete) return;

        if (!this.waveActive) {
            this.waveDelayTimer += dt;
            if (this.waveDelayTimer >= this.waveDelay) {
                this.waveDelayTimer = 0;
                this._startNextWave();
            }
            return;
        }

        this.waveElapsed += dt;

        // Spawn enemies based on elapsed time
        while (
            this.spawnIndex < this.spawnQueue.length &&
            this.waveElapsed >= this.spawnQueue[this.spawnIndex].delay
        ) {
            this.enemyManager.spawnEnemy(this.spawnQueue[this.spawnIndex].type);
            this.spawnIndex++;
        }

        // Check wave completion (all spawned and all dead/reached end)
        if (
            this.spawnIndex >= this.spawnQueue.length &&
            this.enemyManager.getAliveCount() === 0
        ) {
            this.waveActive = false;
            const completedIndex = this.currentWaveIndex;
            this.onWaveComplete(completedIndex);

            if (this.currentWaveIndex >= this.waves.length) {
                this.allComplete = true;
                this.onAllComplete();
            }
        }
    }

    _startNextWave() {
        if (this.currentWaveIndex >= this.waves.length) {
            if (this.enemyManager.getAliveCount() === 0) {
                this.allComplete = true;
                this.onAllComplete();
            }
            return;
        }

        const wave = this.waves[this.currentWaveIndex];
        this.spawnQueue = [];

        // Build spawn queue from wave groups
        wave.enemies.forEach((group) => {
            for (let i = 0; i < group.count; i++) {
                this.spawnQueue.push({
                    type: group.type,
                    delay: i * (group.interval || 1.0),
                });
            }
        });

        this.spawnQueue.sort((a, b) => a.delay - b.delay);

        this.waveActive = true;
        this.waveElapsed = 0;
        this.spawnIndex = 0;
        this.currentWaveIndex++;

        this.onWaveStart(this.currentWaveIndex);
    }

    /** @returns {number} */
    getCurrentWave() {
        return this.currentWaveIndex;
    }

    /** @returns {number} */
    getTotalWaves() {
        return this.waves.length;
    }

    /** @returns {boolean} */
    isAllComplete() {
        return this.allComplete;
    }
}
