class Enemy {
    /**
     * @param {string} type - Enemy type key from ENEMY_TYPES
     * @param {PathManager} pathManager
     */
    constructor(type, pathManager) {
        const cfg = ENEMY_TYPES[type];
        if (!cfg) throw new Error(`Unknown enemy type: ${type}`);

        this.type = type;
        this.config = cfg;
        this.maxHp = cfg.hp;
        this.hp = cfg.hp;
        this.baseSpeed = cfg.speed;
        this.reward = cfg.reward;
        this.size = cfg.size;

        this.pathManager = pathManager;
        this.progress = 0;
        this.alive = true;
        this.reachedEnd = false;

        // Slow effect
        this.slowAmount = 0;
        this.slowTimer = 0;

        // Render
        this.container = new PIXI.Container();
        this.bodyGfx = new PIXI.Graphics();
        this.hpBarGfx = new PIXI.Graphics();
        this.container.addChild(this.bodyGfx);
        this.container.addChild(this.hpBarGfx);

        this._drawBody();
        this._drawHpBar();
        this._updatePosition();
    }

    /**
     * @param {number} dt - Delta time in seconds
     * @returns {boolean} false if enemy should be removed
     */
    update(dt) {
        if (!this.alive) return false;

        // Slow decay
        if (this.slowTimer > 0) {
            this.slowTimer -= dt;
            if (this.slowTimer <= 0) {
                this.slowTimer = 0;
                this.slowAmount = 0;
                this._drawBody(); // revert visual
            }
        }

        const effectiveSpeed = this.baseSpeed * (1 - this.slowAmount);
        const moveAmount = (effectiveSpeed * dt) / this.pathManager.getTotalLength();
        this.progress += moveAmount;

        if (this.progress >= 1) {
            this.progress = 1;
            this.alive = false;
            this.reachedEnd = true;
            return false;
        }

        this._updatePosition();
        return true;
    }

    /**
     * @param {number} amount
     * @returns {boolean} true if died
     */
    takeDamage(amount) {
        if (!this.alive) return false;
        this.hp -= amount;
        if (this.hp <= 0) {
            this.hp = 0;
            this.alive = false;
            this.reachedEnd = false;
            return true;
        }
        this._drawHpBar();
        return false;
    }

    /** Apply slow effect */
    applySlow(amount, duration) {
        this.slowAmount = Math.max(this.slowAmount, amount);
        this.slowTimer = Math.max(this.slowTimer, duration);
        this._drawBody(); // blue tint when slowed
    }

    distanceTo(x, y) {
        return Math.sqrt(
            (this.container.x - x) ** 2 + (this.container.y - y) ** 2
        );
    }

    _drawBody() {
        const g = this.bodyGfx;
        g.clear();

        const isSlowed = this.slowAmount > 0;
        const color = isSlowed ? 0x88bbff : this.config.color;

        g.beginFill(color);
        g.drawCircle(0, 0, this.size);
        g.endFill();

        g.lineStyle(2, isSlowed ? 0x88ddff : 0x000000, isSlowed ? 0.6 : 0.25);
        g.drawCircle(0, 0, this.size);
        g.lineStyle(0);

        // Slow indicator ring
        if (isSlowed) {
            g.lineStyle(2, 0x88ddff, 0.4);
            g.drawCircle(0, 0, this.size + 4);
            g.lineStyle(0);
        }
    }

    _drawHpBar() {
        const g = this.hpBarGfx;
        const barW = this.size * 2;
        const barH = 4;
        const barY = -this.size - 8;
        const ratio = Math.max(0, this.hp / this.maxHp);

        const barColor = ratio > 0.5 ? 0x00ff00
            : ratio > 0.25 ? 0xffaa00
            : 0xff0000;

        g.clear();
        g.beginFill(0x333333);
        g.drawRect(-this.size, barY, barW, barH);
        g.endFill();
        g.beginFill(barColor);
        g.drawRect(-this.size + 1, barY + 1, (barW - 2) * ratio, barH - 2);
        g.endFill();
    }

    _updatePosition() {
        const pos = this.pathManager.getPosition(this.progress);
        this.container.x = pos.x;
        this.container.y = pos.y;
        this.container.rotation = this.pathManager.getDirection(this.progress);
    }
}
