const ENEMY_TYPES = {
    normal: {
        name: '小兵',
        hp: 80,
        speed: 80,
        reward: 10,
        color: 0xff6666,
        size: 10,
    },
    fast: {
        name: '快速兵',
        hp: 40,
        speed: 140,
        reward: 15,
        color: 0xffaa00,
        size: 8,
    },
    tank: {
        name: '重装兵',
        hp: 300,
        speed: 45,
        reward: 25,
        color: 0xcc4444,
        size: 14,
    },
    boss: {
        name: 'BOSS',
        hp: 2000,
        speed: 35,
        reward: 100,
        color: 0xff00ff,
        size: 22,
    },
};

const WAVES = [
    { enemies: [{ type: 'normal', count: 5, interval: 1.2 }] },
    { enemies: [{ type: 'normal', count: 7, interval: 1.0 }] },
    {
        enemies: [
            { type: 'normal', count: 5, interval: 0.8 },
            { type: 'fast', count: 3, interval: 1.0 },
        ],
    },
    {
        enemies: [
            { type: 'tank', count: 2, interval: 1.5 },
            { type: 'normal', count: 5, interval: 1.0 },
        ],
    },
    { enemies: [{ type: 'fast', count: 10, interval: 0.6 }] },
    {
        enemies: [
            { type: 'normal', count: 8, interval: 0.7 },
            { type: 'tank', count: 3, interval: 1.5 },
        ],
    },
    {
        enemies: [
            { type: 'fast', count: 10, interval: 0.5 },
            { type: 'tank', count: 3, interval: 1.2 },
        ],
    },
    {
        enemies: [
            { type: 'tank', count: 5, interval: 1.0 },
            { type: 'normal', count: 10, interval: 0.6 },
        ],
    },
    {
        enemies: [
            { type: 'fast', count: 12, interval: 0.4 },
            { type: 'tank', count: 5, interval: 1.0 },
        ],
    },
    {
        enemies: [
            { type: 'tank', count: 8, interval: 0.8 },
            { type: 'fast', count: 8, interval: 0.5 },
        ],
    },
];
