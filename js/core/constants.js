const CONFIG = {
    TILE_SIZE: 64,
    MAP_COLS: 15,
    MAP_ROWS: 10,
    GAME_WIDTH: 960,   // 15 * 64
    GAME_HEIGHT: 640,  // 10 * 64

    // Tile types
    TILE_GRASS: 0,
    TILE_PATH: 1,
    TILE_BUILDABLE: 2,
    TILE_UNBUILDABLE: 3,

    // Tile colors (will be replaced by sprites later)
    COLOR_GRASS: 0x4a8c3f,
    COLOR_PATH: 0xd4a574,
    COLOR_PATH_BORDER: 0xbf9060,
    COLOR_BUILDABLE: 0x5da04f,
    COLOR_UNBUILDABLE: 0x3d7a33,
    COLOR_GRID_LINE: 0x000000,

    // Game states
    STATE_IDLE: 'idle',
    STATE_PLAYING: 'playing',
    STATE_PAUSED: 'paused',
    STATE_GAMEOVER: 'gameover',
    STATE_WIN: 'win',

    // Camera
    CAM_ZOOM_MIN: 0.5,
    CAM_ZOOM_MAX: 2.0,
    CAM_ZOOM_SPEED: 0.08,

    // Gameplay
    START_GOLD: 200,
    START_LIVES: 20,
};
