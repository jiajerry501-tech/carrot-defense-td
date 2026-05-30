const TOWER_CONFIGS = {
    cannon: {
        name: '炮塔',
        desc: '高单体伤害',
        levels: [
            { cost: 100, damage: 35, range: 150, fireRate: 1.0 },
            { cost: 80,  damage: 65, range: 170, fireRate: 1.2 },
            { cost: 120, damage: 110, range: 200, fireRate: 1.4 },
        ],
        baseSize: 12,
        colors: [0x44aaff, 0x66ccff, 0x88eeff],
    },
    ice: {
        name: '冰塔',
        desc: '范围减速',
        levels: [
            { cost: 80,  damage: 0, range: 160, fireRate: 0.8, slowAmount: 0.4, slowDuration: 2.0 },
            { cost: 70,  damage: 0, range: 180, fireRate: 1.0, slowAmount: 0.55, slowDuration: 2.5 },
            { cost: 100, damage: 0, range: 200, fireRate: 1.2, slowAmount: 0.7, slowDuration: 3.0 },
        ],
        baseSize: 12,
        colors: [0x88ddff, 0xaae8ff, 0xccf4ff],
    },
    laser: {
        name: '激光塔',
        desc: '持续光束',
        levels: [
            { cost: 120, damage: 50,  range: 180, fireRate: 1.0 },
            { cost: 100, damage: 90,  range: 200, fireRate: 1.0 },
            { cost: 150, damage: 150, range: 220, fireRate: 1.0 },
        ],
        baseSize: 10,
        colors: [0xff4444, 0xff6666, 0xff8888],
    },
    bomber: {
        name: '炸弹塔',
        desc: '范围溅射',
        levels: [
            { cost: 110, damage: 40, range: 140, fireRate: 0.7, splash: 60 },
            { cost: 90,  damage: 75, range: 160, fireRate: 0.8, splash: 75 },
            { cost: 130, damage: 130, range: 180, fireRate: 0.9, splash: 90 },
        ],
        baseSize: 13,
        colors: [0xff8800, 0xffaa33, 0xffcc66],
    },
};

/** Get list of tower types for the UI */
const TOWER_TYPES = Object.keys(TOWER_CONFIGS);
