class Camera {
    constructor(targetContainer, viewWidth, viewHeight, getScale) {
        this.worldContainer = new PIXI.Container();
        this.worldContainer.addChild(targetContainer);

        this.viewWidth = viewWidth;
        this.viewHeight = viewHeight;
        this.getScale = getScale || (() => 1);

        this.offsetX = 0;
        this.offsetY = 0;
        this.zoom = 1;

        // Shake
        this.shakeIntensity = 0;
        this.shakeTimer = 0;

        this._updateTransform();
    }

    _updateTransform() {
        let sx = 0, sy = 0;
        if (this.shakeTimer > 0) {
            sx = (Math.random() - 0.5) * this.shakeIntensity * 2;
            sy = (Math.random() - 0.5) * this.shakeIntensity * 2;
        }
        this.worldContainer.scale.set(this.zoom);
        this.worldContainer.position.set(
            this.offsetX + sx,
            this.offsetY + sy
        );
    }

    enableDrag(canvas) {
        // Only keep context menu prevention and wheel zoom
        canvas.addEventListener('contextmenu', (e) => e.preventDefault());

        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const dir = e.deltaY > 0 ? -1 : 1;
            const prevZoom = this.zoom;
            this.zoom *= (1 + dir * CONFIG.CAM_ZOOM_SPEED);
            this.zoom = Math.max(CONFIG.CAM_ZOOM_MIN,
                Math.min(CONFIG.CAM_ZOOM_MAX, this.zoom));

            const cssScale = this.getScale();
            const rect = canvas.getBoundingClientRect();
            const mx = (e.clientX - rect.left) / cssScale;
            const my = (e.clientY - rect.top) / cssScale;
            const scale = this.zoom / prevZoom;
            this.offsetX = mx - scale * (mx - this.offsetX);
            this.offsetY = my - scale * (my - this.offsetY);

            this._updateTransform();
        }, { passive: false });
    }

    shake(intensity = 5, duration = 0.3) {
        this.shakeIntensity = intensity;
        this.shakeTimer = duration;
    }

    updateShake(dt) {
        if (this.shakeTimer > 0) {
            this.shakeTimer -= dt;
            if (this.shakeTimer <= 0) this.shakeTimer = 0;
            this._updateTransform();
        }
    }

    screenToWorld(screenX, screenY) {
        return {
            x: (screenX - this.offsetX) / this.zoom,
            y: (screenY - this.offsetY) / this.zoom,
        };
    }

    focusOn(x, y) {
        this.offsetX = this.viewWidth / 2 - x * this.zoom;
        this.offsetY = this.viewHeight / 2 - y * this.zoom;
        this._updateTransform();
    }
}
