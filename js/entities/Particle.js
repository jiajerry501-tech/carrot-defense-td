class Particle {
    constructor() {
        this.alive = false;
        this.gfx = new PIXI.Graphics();
        this.gfx.visible = false;
    }

    /**
     * Initialize (or reuse) particle
     * @param {number} x
     * @param {number} y
     * @param {object} opts
     */
    init(x, y, opts = {}) {
        this.x = x;
        this.y = y;
        this.vx = opts.vx !== undefined ? opts.vx : (Math.random() - 0.5) * opts.speed;
        this.vy = opts.vy !== undefined ? opts.vy : (Math.random() - 0.5) * opts.speed;
        this.lifetime = opts.lifetime || 0.5;
        this.age = 0;
        this.alive = true;
        this.size = opts.size || 3;
        this.color = opts.color || 0xffffff;
        this.gravity = opts.gravity || 0;
        this.fadeOut = opts.fadeOut !== undefined ? opts.fadeOut : true;

        this.gfx.visible = true;
        this.gfx.alpha = 1;
        this._draw();
        this.gfx.x = x;
        this.gfx.y = y;
    }

    update(dt) {
        if (!this.alive) return;
        this.age += dt;
        if (this.age >= this.lifetime) {
            this.alive = false;
            this.gfx.visible = false;
            return;
        }

        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.vy += this.gravity * dt;

        if (this.fadeOut) {
            this.gfx.alpha = 1 - Math.max(0, Math.min(1, this.age / this.lifetime));
        }

        this.gfx.x = this.x;
        this.gfx.y = this.y;
    }

    _draw() {
        const g = this.gfx;
        g.clear();
        g.beginFill(this.color);
        g.drawCircle(0, 0, this.size);
        g.endFill();
    }
}
