class TowerPanel {
    /**
     * @param {Game} game
     * @param {object} callbacks
     */
    constructor(game, callbacks = {}) {
        this.game = game;
        this.onUpgrade = callbacks.onUpgrade || (() => {});
        this.onSell = callbacks.onSell || (() => {});
        this.onClose = callbacks.onClose || (() => {});

        this.tower = null;
        this.container = new PIXI.Container();
        this.container.visible = false;
        this.container.eventMode = 'static';

        this._build();
    }

    _build() {
        const pw = 180;
        const ph = 200;

        // Background
        this.bg = new PIXI.Graphics();
        this.bg.beginFill(0x222244, 0.95);
        this.bg.lineStyle(2, 0x6688cc, 0.8);
        this.bg.drawRoundedRect(0, 0, pw, ph, 8);
        this.bg.endFill();
        this.container.addChild(this.bg);

        // Title
        this.titleText = new PIXI.Text('', {
            fontFamily: '"Microsoft YaHei", sans-serif',
            fontSize: 16,
            fill: 0xffffff,
            fontWeight: 'bold',
        });
        this.titleText.x = 12;
        this.titleText.y = 10;
        this.container.addChild(this.titleText);

        // Stats
        this.statsText = new PIXI.Text('', {
            fontFamily: '"Microsoft YaHei", sans-serif',
            fontSize: 13,
            fill: 0xcccccc,
            lineHeight: 20,
        });
        this.statsText.x = 12;
        this.statsText.y = 38;
        this.container.addChild(this.statsText);

        // Upgrade button
        this.upgradeBtn = new PIXI.Container();
        this.upgradeBtn.eventMode = 'static';
        this.upgradeBtn.cursor = 'pointer';
        const upgBg = new PIXI.Graphics();
        upgBg.beginFill(0x227722, 0.9);
        upgBg.drawRoundedRect(0, 0, pw - 24, 30, 5);
        upgBg.endFill();
        this.upgradeBtn.addChild(upgBg);
        this.upgradeCostText = new PIXI.Text('升级', {
            fontFamily: '"Microsoft YaHei", sans-serif',
            fontSize: 13,
            fill: 0xffffff,
        });
        this.upgradeCostText.x = (pw - 24) / 2;
        this.upgradeCostText.y = 7;
        this.upgradeCostText.anchor = { x: 0.5, y: 0 };
        this.upgradeBtn.addChild(this.upgradeCostText);
        this.upgradeBtn.x = 12;
        this.upgradeBtn.y = 125;
        this.upgradeBtn.on('pointerdown', () => {
            if (this.tower) this.onUpgrade(this.tower);
        });
        this.container.addChild(this.upgradeBtn);

        // Sell button
        this.sellBtn = new PIXI.Container();
        this.sellBtn.eventMode = 'static';
        this.sellBtn.cursor = 'pointer';
        const sellBg = new PIXI.Graphics();
        sellBg.beginFill(0x882222, 0.9);
        sellBg.drawRoundedRect(0, 0, pw - 24, 30, 5);
        sellBg.endFill();
        this.sellBtn.addChild(sellBg);
        this.sellPriceText = new PIXI.Text('出售', {
            fontFamily: '"Microsoft YaHei", sans-serif',
            fontSize: 13,
            fill: 0xffffff,
        });
        this.sellPriceText.x = (pw - 24) / 2;
        this.sellPriceText.y = 7;
        this.sellPriceText.anchor = { x: 0.5, y: 0 };
        this.sellBtn.addChild(this.sellPriceText);
        this.sellBtn.x = 12;
        this.sellBtn.y = 162;
        this.sellBtn.on('pointerdown', () => {
            if (this.tower) this.onSell(this.tower);
        });
        this.container.addChild(this.sellBtn);

        // Close hint
        this.closeHint = new PIXI.Text('点击空白处关闭', {
            fontFamily: '"Microsoft YaHei", sans-serif',
            fontSize: 10,
            fill: 0x888888,
        });
        this.closeHint.x = pw - 90;
        this.closeHint.y = ph - 18;
        this.container.addChild(this.closeHint);
    }

    show(tower, x, y) {
        this.tower = tower;
        if (!tower) {
            this.container.visible = false;
            return;
        }

        this.container.visible = true;

        // Position panel near tower but within screen bounds
        const pw = 180;
        const ph = 200;
        const margin = 10;
        let px = x + 20;
        let py = y - ph / 2;

        if (px + pw > CONFIG.GAME_WIDTH - margin) px = x - pw - 10;
        if (py < margin) py = margin;
        if (py + ph > CONFIG.GAME_HEIGHT - margin) py = CONFIG.GAME_HEIGHT - margin - ph;

        this.container.x = px;
        this.container.y = py;

        // Update content
        const cfg = TOWER_CONFIGS[tower.type];
        this.titleText.text = `${cfg.name} Lv.${tower.level}`;
        this.statsText.text = tower.getStats().join('\n');

        const upgCost = tower.getUpgradeCost();
        if (upgCost > 0) {
            this.upgradeBtn.visible = true;
            this.upgradeCostText.text = `升级 ${upgCost}G`;
        } else {
            this.upgradeBtn.visible = false;
        }

        this.sellPriceText.text = `出售 ${tower.getSellPrice()}G`;
    }

    hide() {
        this.container.visible = false;
        this.tower = null;
    }

    /** @returns {boolean} */
    isVisible() {
        return this.container.visible;
    }
}
