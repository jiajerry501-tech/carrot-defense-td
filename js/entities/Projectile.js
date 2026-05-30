class Projectile {
    /**
     * @param {object} opts
     * @param {string} opts.type - 'bullet' | 'ice' | 'bomb'
     * @param {number} opts.startX
     * @param {number} opts.startY
     * @param {Enemy} opts.target
     * @param {number} opts.damage
     * @param {number} opts.speed
     * @param {number} [opts.splash] - Splash radius (bomb only)
     * @param {number} [opts.slowAmount] - Slow factor (ice only)
     * @param {number} [opts.slowDuration] - Slow duration in seconds (ice only)
     */
    constructor(opts) {
        this.type = opts.type;
        this.x = opts.startX;
        this.y = opts.startY;
        this.target = opts.target;
        this.damage = opts.damage || 0;
        this.speed = opts.speed || 400;
        this.splash = opts.splash || 0;
        this.slowAmount = opts.slowAmount || 0;
        this.slowDuration = opts.slowDuration || 0;
        this.alive = true;

        // Visual
        this.gfx = new PIXI.Graphics();
        this._draw();
        this.gfx.x = this.x;
        this.gfx.y = this.y;

        // Trail for certain types
        if (this.type === 'bomb') {
            this.trailGfx = new PIXI.Graphics();
        }
    }

    /**
     * @param {number} dt
     * @param {Enemy[]} allEnemies - Needed for bomb splash
     * @returns {object|null} Hit result or null
     */
    update(dt, allEnemies) {
        if (!this.alive) return null;

        // Check if target is still alive
        if (!this.target || !this.target.alive) {
            this.alive = false;
            return { type: 'miss' };
        }

        // Move toward target
        const tx = this.target.container.x;
        const ty = this.target.container.y;
        const dx = tx - this.x;
        const dy = ty - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 8) {
            // Hit!
            this.alive = false;
            return this._onHit(allEnemies);
        }

        const step = this.speed * dt;
        this.x += (dx / dist) * step;
        this.y += (dy / dist) * step;
        this.gfx.x = this.x;
        this.gfx.y = this.y;

        return null;
    }

    _onHit(allEnemies) {
        switch (this.type) {
            case 'bullet':
                this.target.takeDamage(this.damage);
                return { type: 'hit', target: this.target };
            case 'ice':
                this.target.applySlow(this.slowAmount, this.slowDuration);
                return { type: 'ice', target: this.target };
            case 'bomb': {
                // Splash damage
                const hitEnemies = [];
                for (const enemy of allEnemies) {
                    if (!enemy.alive) continue;
                    const dx = enemy.container.x - this.target.container.x;
                    const dy = enemy.container.y - this.target.container.y;
                    if (Math.sqrt(dx * dx + dy * dy) <= this.splash) {
                        enemy.takeDamage(this.damage);
                        hitEnemies.push(enemy);
                    }
                }
                return { type: 'bomb', target: this.target, splash: this.splash, enemies: hitEnemies };
            }
            default:
                return { type: 'hit', target: this.target };
        }
    }

    _draw() {
        const g = this.gfx;
        switch (this.type) {
            case 'bullet':
                g.beginFill(0xffff00);
                g.drawCircle(0, 0, 4);
                g.endFill();
                break;
            case 'ice':
                g.beginFill(0x88ddff);
                g.drawCircle(0, 0, 5);
                g.endFill();
                break;
            case 'bomb':
                g.beginFill(0x333333);
                g.drawCircle(0, 0, 6);
                g.endFill();
                // Fuse line
                g.lineStyle(1, 0xff8800);
                g.moveTo(0, -4);
                g.lineTo(2, -8);
                g.lineStyle(0);
                break;
        }
    }
}
