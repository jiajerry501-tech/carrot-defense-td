class Tower {
    constructor(type, col, row) {
        this.type = type;
        this.col = col;
        this.row = row;
        this.level = 1;
        this.maxLevel = 3;
        this.baseCfg = TOWER_CONFIGS[type];
        this.alive = true;

        this.target = null;
        this.fireTimer = 0;
        this.laserTarget = null;
        this.totalInvestment = this.baseCfg.levels[0].cost;

        // Center position
        this.cx = col * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2;
        this.cy = row * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2;

        // Current stats
        this._applyLevel();

        // Visual
        this.container = new PIXI.Container();
        this.container.x = this.cx;
        this.container.y = this.cy;

        this.bodyGfx = new PIXI.Graphics();
        this.rangeGfx = new PIXI.Graphics();
        this.rangeGfx.visible = false;
        this.container.addChild(this.bodyGfx);
        this.container.addChild(this.rangeGfx);

        // Laser beam graphics (only for laser)
        if (type === 'laser') {
            this.beamGfx = new PIXI.Graphics();
            this.container.addChild(this.beamGfx);
        }

        this._draw();
    }

    _applyLevel() {
        const cfg = this.baseCfg.levels[this.level - 1];
        this.damage = cfg.damage;
        this.range = cfg.range;
        this.fireRate = cfg.fireRate;
        this.slowAmount = cfg.slowAmount || 0;
        this.slowDuration = cfg.slowDuration || 0;
        this.splash = cfg.splash || 0;
    }

    upgrade() {
        if (this.level >= this.maxLevel) return false;
        const cost = this.baseCfg.levels[this.level].cost;
        this.level++;
        this.totalInvestment += cost;
        this._applyLevel();
        this._draw();
        return true;
    }

    getUpgradeCost() {
        if (this.level >= this.maxLevel) return 0;
        return this.baseCfg.levels[this.level].cost;
    }

    getSellPrice() {
        return Math.floor(this.totalInvestment * 0.6);
    }

    getStats() {
        const cfg = this.baseCfg.levels[this.level - 1];
        const stats = [
            `等级: ${this.level}/${this.maxLevel}`,
            `伤害: ${cfg.damage === 0 ? '减速' : cfg.damage}`,
            `射程: ${cfg.range}`,
        ];
        if (cfg.splash) stats.push(`溅射: ${cfg.splash}`);
        if (cfg.slowAmount) stats.push(`减速: ${Math.round(cfg.slowAmount * 100)}%`);
        return stats;
    }

    findTarget(enemies) {
        let best = null;
        let bestProgress = -1;

        for (const enemy of enemies) {
            if (!enemy.alive) continue;
            const dx = enemy.container.x - this.cx;
            const dy = enemy.container.y - this.cy;
            if (Math.sqrt(dx * dx + dy * dy) <= this.range && enemy.progress > bestProgress) {
                best = enemy;
                bestProgress = enemy.progress;
            }
        }
        return best;
    }

    isInRange(enemy) {
        if (!enemy.alive) return false;
        const dx = enemy.container.x - this.cx;
        const dy = enemy.container.y - this.cy;
        return Math.sqrt(dx * dx + dy * dy) <= this.range;
    }

    /**
     * @param {number} dt
     * @param {Enemy[]} enemies
     * @returns {object|null} projectile info or laser hit info
     */
    update(dt, enemies) {
        if (this.type === 'laser') {
            return this._updateLaser(dt, enemies);
        }
        return this._updateProjectile(dt, enemies);
    }

    _updateProjectile(dt, enemies) {
        this.fireTimer -= dt;
        if (this.fireTimer > 0) return null;

        const target = this.findTarget(enemies);
        if (!target) return null;

        this.fireTimer = 1 / this.fireRate;

        const pType = this.type === 'ice' ? 'ice'
            : this.type === 'bomber' ? 'bomb'
            : 'bullet';

        const extra = {};
        if (this.type === 'ice') {
            extra.slowAmount = this.slowAmount;
            extra.slowDuration = this.slowDuration;
        }
        if (this.type === 'bomber') {
            extra.splash = this.splash;
            extra.damage = this.damage;
        }

        return {
            type: pType,
            startX: this.cx,
            startY: this.cy,
            target,
            damage: this.damage,
            speed: pType === 'bomb' ? 200 : 400,
            ...extra,
        };
    }

    _updateLaser(dt, enemies) {
        this.target = this.findTarget(enemies);

        if (this.target && this.isInRange(this.target)) {
            this.target.takeDamage(this.damage * dt);

            // Draw beam
            this.beamGfx.clear();
            this.beamGfx.lineStyle(3, 0xff4444, 0.7);
            this.beamGfx.moveTo(0, 0);
            const tx = this.target.container.x - this.cx;
            const ty = this.target.container.y - this.cy;
            this.beamGfx.lineTo(tx, ty);
            this.beamGfx.lineStyle(0);

            return { type: 'laserHit', target: this.target };
        }

        // No target - clear beam
        if (this.beamGfx) this.beamGfx.clear();
        return null;
    }

    showRange(show) {
        this.rangeGfx.visible = show;
    }

    _draw() {
        const g = this.bodyGfx;
        g.clear();

        const cfg = this.baseCfg;
        const size = cfg.baseSize + (this.level - 1) * 3;
        const color = cfg.colors[this.level - 1];

        // Base platform
        g.beginFill(0x555555, 0.8);
        g.drawRoundedRect(-28, -28, 56, 56, 6);
        g.endFill();

        // Tower body
        g.beginFill(color);
        g.drawCircle(0, 0, size);
        g.endFill();

        g.lineStyle(2, 0xffffff, 0.3);
        g.drawCircle(0, 0, size);
        g.lineStyle(0);

        // Level stars
        for (let i = 0; i < this.level; i++) {
            const dotX = -(this.level - 1) * 5 + i * 10;
            g.beginFill(0xffffff, 0.9);
            g.drawStar(dotX, size + 8, 4, 4, 2); // using drawStar if available
            g.endFill();
        }

        // Range circle
        const rg = this.rangeGfx;
        rg.clear();
        rg.beginFill(0xffffff, 0.08);
        rg.lineStyle(1, 0xffffff, 0.2);
        rg.drawCircle(0, 0, this.range);
        rg.lineStyle(0);
        rg.endFill();
    }
}

// PixiJS 7 Graphics doesn't have drawStar natively, add a helper
// We'll draw stars as small circles instead for level indicators
// Override the _draw method to use simple dots
Tower.prototype._draw = function() {
    const g = this.bodyGfx;
    g.clear();

    const cfg = this.baseCfg;
    const size = cfg.baseSize + (this.level - 1) * 3;
    const color = cfg.colors[this.level - 1];

    // Base platform
    g.beginFill(0x555555, 0.8);
    g.drawRoundedRect(-28, -28, 56, 56, 6);
    g.endFill();

    // Tower body
    g.beginFill(color);
    g.drawCircle(0, 0, size);
    g.endFill();

    g.lineStyle(2, 0xffffff, 0.25);
    g.drawCircle(0, 0, size);
    g.lineStyle(0);

    // Level dots
    for (let i = 0; i < this.level; i++) {
        const dotX = -(this.level - 1) * 5 + i * 10;
        g.beginFill(0xffdd44, 0.9);
        g.drawCircle(dotX, size + 8, 2.5);
        g.endFill();
    }

    // Range circle
    const rg = this.rangeGfx;
    rg.clear();
    rg.beginFill(0xffffff, 0.06);
    rg.lineStyle(1, 0xffffff, 0.2);
    rg.drawCircle(0, 0, this.range);
    rg.lineStyle(0);
    rg.endFill();
};
