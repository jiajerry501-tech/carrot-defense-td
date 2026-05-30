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

        // Drag (mouse)
        this._isDragging = false;
        this._dragStartX = 0;
        this._dragStartY = 0;
        this._dragOffsetX = 0;
        this._dragOffsetY = 0;

        // Touch drag
        this._touchId = null;
        this._touchStartX = 0;
        this._touchStartY = 0;
        this._touchOffsetX = 0;
        this._touchOffsetY = 0;
        this._touchStartTime = 0;

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
        // Mouse drag (middle or right button)
        canvas.addEventListener('mousedown', (e) => {
            if (e.button === 1 || e.button === 2) {
                this._isDragging = true;
                this._dragStartX = e.clientX;
                this._dragStartY = e.clientY;
                this._dragOffsetX = this.offsetX;
                this._dragOffsetY = this.offsetY;
                e.preventDefault();
            }
        });

        window.addEventListener('mousemove', (e) => {
            if (!this._isDragging) return;
            const scale = this.getScale();
            this.offsetX = this._dragOffsetX + (e.clientX - this._dragStartX) / scale;
            this.offsetY = this._dragOffsetY + (e.clientY - this._dragStartY) / scale;
            this._updateTransform();
        });

        window.addEventListener('mouseup', () => {
            this._isDragging = false;
        });

        canvas.addEventListener('contextmenu', (e) => e.preventDefault());

        // Scroll wheel zoom
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

        // Touch drag (two-finger drag)
        canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                // Two-finger drag
                const t = e.touches[0];
                this._touchId = t.identifier;
                this._touchStartX = t.clientX;
                this._touchStartY = t.clientY;
                this._touchOffsetX = this.offsetX;
                this._touchOffsetY = this.offsetY;
                e.preventDefault();
            }
        }, { passive: false });

        canvas.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2) {
                const scale = this.getScale();
                for (let i = 0; i < e.touches.length; i++) {
                    const t = e.touches[i];
                    if (t.identifier === this._touchId) {
                        this.offsetX = this._touchOffsetX + (t.clientX - this._touchStartX) / scale;
                        this.offsetY = this._touchOffsetY + (t.clientY - this._touchStartY) / scale;
                        this._updateTransform();
                        break;
                    }
                }
                e.preventDefault();
            }
        }, { passive: false });

        canvas.addEventListener('touchend', (e) => {
            this._touchId = null;
        });
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
