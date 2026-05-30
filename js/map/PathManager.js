class PathManager {
    constructor(waypoints) {
        this.waypoints = waypoints || [];
        this.segmentLengths = [];
        this.totalLength = 0;
        this._calcLengths();
    }

    _calcLengths() {
        this.segmentLengths = [];
        this.totalLength = 0;
        for (let i = 0; i < this.waypoints.length - 1; i++) {
            const dx = this.waypoints[i + 1].x - this.waypoints[i].x;
            const dy = this.waypoints[i + 1].y - this.waypoints[i].y;
            const len = Math.sqrt(dx * dx + dy * dy);
            this.segmentLengths.push(len);
            this.totalLength += len;
        }
    }

    // Get position on path by progress (0~1)
    getPosition(progress) {
        if (this.waypoints.length < 2) return { x: 0, y: 0 };
        progress = Math.max(0, Math.min(1, progress));

        let targetDist = progress * this.totalLength;

        for (let i = 0; i < this.segmentLengths.length; i++) {
            if (targetDist <= this.segmentLengths[i]) {
                const t = this.segmentLengths[i] > 0
                    ? targetDist / this.segmentLengths[i]
                    : 0;
                return {
                    x: this.waypoints[i].x + (this.waypoints[i + 1].x - this.waypoints[i].x) * t,
                    y: this.waypoints[i].y + (this.waypoints[i + 1].y - this.waypoints[i].y) * t,
                };
            }
            targetDist -= this.segmentLengths[i];
        }

        return { ...this.waypoints[this.waypoints.length - 1] };
    }

    // Get direction at a given progress (angle in radians)
    getDirection(progress) {
        if (this.waypoints.length < 2) return 0;
        progress = Math.max(0, Math.min(1, progress));

        // Use a small offset to calculate direction
        const p1 = this.getPosition(Math.max(0, progress - 0.001));
        const p2 = this.getPosition(Math.min(1, progress + 0.001));

        return Math.atan2(p2.y - p1.y, p2.x - p1.x);
    }

    getTotalLength() {
        return this.totalLength;
    }

    draw(graphics, color = 0xff4444, alpha = 0.5) {
        if (this.waypoints.length < 2) return;

        // Draw path line
        graphics.clear();
        graphics.lineStyle(3, color, alpha);
        graphics.moveTo(this.waypoints[0].x, this.waypoints[0].y);
        for (let i = 1; i < this.waypoints.length; i++) {
            graphics.lineTo(this.waypoints[i].x, this.waypoints[i].y);
        }

        // Draw waypoint dots
        for (let i = 0; i < this.waypoints.length; i++) {
            // Entrance/exit in different color
            const isEnd = (i === 0 || i === this.waypoints.length - 1);
            graphics.beginFill(isEnd ? 0x00ff00 : color, 0.8);
            graphics.drawCircle(this.waypoints[i].x, this.waypoints[i].y, isEnd ? 6 : 4);
            graphics.endFill();
        }
    }
}
