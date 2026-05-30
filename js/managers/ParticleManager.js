class ParticleManager {
    constructor() {
        this.pool = [];
        this.active = [];
        this.container = new PIXI.Container();
        this.maxParticles = 200;
    }

    /**
     * Emit particles at a position
     * @param {number} x
     * @param {number} y
     * @param {number} count
     * @param {object} config
     */
    emit(x, y, count, config = {}) {
        for (let i = 0; i < count; i++) {
            if (this.active.length >= this.maxParticles) break;

            let p = this.pool.pop();
            if (!p) p = new Particle();

            p.init(x, y, config);
            this.active.push(p);
            this.container.addChild(p.gfx);
        }
    }

    /** Burst particles in a spread pattern */
    burst(x, y, color, count = 10, speed = 120, lifetime = 0.5, size = 3) {
        this.emit(x, y, count, {
            color,
            speed,
            lifetime,
            size,
            gravity: 0,
            fadeOut: true,
        });
    }

    /** Rising particles (like coins) */
    coin(x, y) {
        this.emit(x, y, 3, {
            color: 0xffdd44,
            speed: 60,
            lifetime: 0.6,
            size: 4,
            vy: -80,
            vx: (Math.random() - 0.5) * 30,
            gravity: 0,
            fadeOut: true,
        });
    }

    update(dt) {
        for (let i = this.active.length - 1; i >= 0; i--) {
            const p = this.active[i];
            p.update(dt);
            if (!p.alive) {
                this.container.removeChild(p.gfx);
                this.pool.push(p);
                this.active.splice(i, 1);
            }
        }
    }

    clear() {
        for (const p of this.active) {
            this.container.removeChild(p.gfx);
            this.pool.push(p);
        }
        this.active = [];
    }
}
