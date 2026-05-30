class HUD {
    constructor(game, callbacks = {}) {
        this.game = game;
        this.onSelectTower = callbacks.onSelectTower || (() => {});

        this.container = new PIXI.Container();
        this.container.eventMode = 'static';

        this._build();
    }

    _build() {
        const w = CONFIG.GAME_WIDTH;
        const textStyle = {
            fontFamily: '"Microsoft YaHei", sans-serif',
            fontSize: 16,
            fill: 0xffffff,
        };

        // Top bar
        this.topBar = new PIXI.Container();
        const topBg = new PIXI.Graphics();
        topBg.beginFill(0x1a1a2e, 0.85);
        topBg.drawRect(0, 0, w, 40);
        topBg.endFill();
        this.topBar.addChild(topBg);

        this.goldText = new PIXI.Text('金币: 0', textStyle);
        this.goldText.x = 16;
        this.goldText.y = 10;
        this.topBar.addChild(this.goldText);

        this.livesText = new PIXI.Text('生命: 0', textStyle);
        this.livesText.x = 160;
        this.livesText.y = 10;
        this.topBar.addChild(this.livesText);

        this.waveText = new PIXI.Text('波次: 0/0', textStyle);
        this.waveText.x = 320;
        this.waveText.y = 10;
        this.topBar.addChild(this.waveText);

        this.statusText = new PIXI.Text('按 Enter 开始', {
            ...textStyle, fill: 0xffdd44, fontSize: 14,
        });
        this.statusText.x = w - 150;
        this.statusText.y = 11;
        this.topBar.addChild(this.statusText);

        this.container.addChild(this.topBar);

        // Bottom bar
        this.bottomBar = new PIXI.Container();
        const botBg = new PIXI.Graphics();
        botBg.beginFill(0x1a1a2e, 0.85);
        botBg.drawRect(0, CONFIG.GAME_HEIGHT - 64, w, 64);
        botBg.endFill();
        this.bottomBar.addChild(botBg);

        // Tower selection buttons
        this.towerButtons = {};
        const types = TOWER_TYPES;
        const btnW = 120;
        const totalW = types.length * btnW;
        const startX = (w - totalW) / 2;
        const btnY = CONFIG.GAME_HEIGHT - 58;

        types.forEach((type, i) => {
            const cfg = TOWER_CONFIGS[type];
            const cost = cfg.levels[0].cost;
            const x = startX + i * btnW;

            const btn = new PIXI.Container();
            btn.eventMode = 'static';
            btn.cursor = 'pointer';

            const bg = new PIXI.Graphics();
            bg.beginFill(0x333355, 0.9);
            bg.drawRoundedRect(0, 0, btnW - 8, 56, 6);
            bg.endFill();
            btn.addChild(bg);

            const icon = new PIXI.Graphics();
            icon.beginFill(cfg.colors[0]);
            icon.drawCircle(18, 20, cfg.baseSize);
            icon.endFill();
            btn.addChild(icon);

            const nameText = new PIXI.Text(cfg.name, {
                fontFamily: '"Microsoft YaHei", sans-serif',
                fontSize: 13,
                fill: 0xffffff,
            });
            nameText.x = 34;
            nameText.y = 6;
            btn.addChild(nameText);

            const costText = new PIXI.Text(cost + 'G', {
                fontFamily: '"Microsoft YaHei", sans-serif',
                fontSize: 11,
                fill: 0xffdd44,
            });
            costText.x = 34;
            costText.y = 24;
            btn.addChild(costText);

            const highlight = new PIXI.Graphics();
            highlight.lineStyle(2, 0xffffff, 0.8);
            highlight.drawRoundedRect(-1, -1, btnW - 6, 58, 7);
            highlight.visible = false;
            btn.addChild(highlight);

            btn.on('pointerdown', () => {
                this.onSelectTower(type);
            });

            btn.x = x;
            btn.y = y;
            this.towerButtons[type] = { btn, highlight };
            this.bottomBar.addChild(btn);
        });

        this.container.addChild(this.bottomBar);
    }

    update(gold, lives, waveIndex, totalWaves, state) {
        this.goldText.text = '金币: ' + gold;
        this.livesText.text = '生命: ' + lives;

        if (state === CONFIG.STATE_PLAYING) {
            this.waveText.text = '波次: ' + waveIndex + '/' + totalWaves;
            this.statusText.text = '空格暂停';
        } else if (state === CONFIG.STATE_PAUSED) {
            this.statusText.text = '已暂停';
        } else if (state === CONFIG.STATE_GAMEOVER) {
            this.statusText.text = '游戏结束 - Enter重来';
        } else if (state === CONFIG.STATE_WIN) {
            this.statusText.text = '胜利! - Enter重来';
        } else {
            this.statusText.text = '按 Enter 开始';
        }
    }

    setSelectedType(type) {
        for (const [key, data] of Object.entries(this.towerButtons)) {
            data.highlight.visible = (key === type);
        }
    }
}
