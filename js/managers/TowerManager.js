class TowerManager {
    constructor(game) {
        this.game = game;
        this.towers = [];
        this.projectiles = [];
        this.container = new PIXI.Container();
        this.projContainer = new PIXI.Container();
        this.selectedType = null;
    }

    canPlace(col, row) {
        if (!this.game.mapData.isBuildable(col, row)) return false;
        return !this.towers.some(t => t.col === col && t.row === row);
    }

    placeTower(type, col, row) {
        if (!this.canPlace(col, row)) return false;
        const cost = TOWER_CONFIGS[type].levels[0].cost;
        if (this.game.gold < cost) return false;
        this.game.gold -= cost;
        const tower = new Tower(type, col, row);
        this.towers.push(tower);
        this.container.addChild(tower.container);
        return true;
    }

    upgradeTower(tower) {
        const cost = tower.getUpgradeCost();
        if (cost === 0 || this.game.gold < cost) return false;
        this.game.gold -= cost;
        tower.upgrade();
        return true;
    }

    sellTower(tower) {
        const price = tower.getSellPrice();
        this.game.gold += price;
        this.container.removeChild(tower.container);
        tower.container.destroy({ children: true });
        const idx = this.towers.indexOf(tower);
        if (idx !== -1) this.towers.splice(idx, 1);
        return true;
    }

    getBlockedTiles() {
        return this.towers.map(t => ({ col: t.col, row: t.row }));
    }

    /**
     * @param {number} dt
     * @param {Enemy[]} enemies
     * @param {AudioManager} audio
     * @param {ParticleManager} particles
     * @param {Camera} camera
     */
    update(dt, enemies, audio, particles, camera) {
        // Update towers
        for (const tower of this.towers) {
            if (!tower.alive) continue;
            const result = tower.update(dt, enemies);
            if (result && result.type) {
                if (result.type === 'laserHit') {
                    audio && audio.play('laser');
                    continue;
                }
                const proj = new Projectile(result);
                this.projectiles.push(proj);
                this.projContainer.addChild(proj.gfx);
                audio && audio.play('shoot');
            }
        }

        // Update projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const proj = this.projectiles[i];
            const hit = proj.update(dt, enemies);

            if (hit || !proj.alive) {
                this.projContainer.removeChild(proj.gfx);
                proj.gfx.destroy();
                if (proj.trailGfx) {
                    this.projContainer.removeChild(proj.trailGfx);
                    proj.trailGfx.destroy();
                }
                this.projectiles.splice(i, 1);

                // Hit effects
                if (hit && hit.type !== 'miss' && particles) {
                    const hx = proj.x, hy = proj.y;
                    switch (hit.type) {
                        case 'hit':
                            particles.burst(hx, hy, 0xffff00, 5, 60, 0.25, 2);
                            audio && audio.play('hit');
                            break;
                        case 'ice':
                            particles.burst(hx, hy, 0x88ddff, 10, 80, 0.5, 3);
                            audio && audio.play('ice');
                            break;
                        case 'bomb':
                            particles.burst(hx, hy, 0xff6600, 20, 180, 0.4, 5);
                            if (camera) camera.shake(8, 0.3);
                            audio && audio.play('explode');
                            break;
                    }
                }
            }
        }
    }

    clear() {
        for (const tower of this.towers) {
            this.container.removeChild(tower.container);
            tower.container.destroy({ children: true });
        }
        for (const proj of this.projectiles) {
            this.projContainer.removeChild(proj.gfx);
            proj.gfx.destroy();
        }
        this.towers = [];
        this.projectiles = [];
    }
}
