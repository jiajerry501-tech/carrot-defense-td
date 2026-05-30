# 萝卜保卫战 - Carrot Defense TD

A tower defense game inspired by "保卫萝卜" (Carrot Defense), built with HTML5 + PixiJS 7.

## How to Play

1. Open `index.html` in a modern browser
2. Choose a level from the menu
3. Select towers from the bottom bar and click on the map to place them
4. Defeat all waves of enemies before they reach the end
5. Earn gold and stars to unlock more levels

### Controls

- **Left Click**: Place towers, select towers, interact with UI
- **Right/Middle Click + Drag**: Pan the camera
- **Scroll Wheel**: Zoom in/out
- **Space**: Pause/Resume
- **Enter**: Start game (from menu)
- **R**: Restart level (after game over/victory)

### Tower Types

| Tower | Cost | Description |
|-------|------|-------------|
| Cannon | 100G | High single-target damage |
| Ice | 80G | Area slow effect |
| Laser | 120G | Continuous beam damage |
| Bomber | 110G | Splash area damage |

## Features

- 3 levels with increasing difficulty
- 10-15 waves per level
- 4 tower types with 3 upgrade levels each
- A* pathfinding
- Particle effects and screen shake
- Procedural audio (Web Audio API)
- Touch support for mobile devices
- Local save progress (stars, unlocked levels)
- Camera pan & zoom

## Tech Stack

- **Rendering**: [PixiJS 7](https://pixijs.com/) (CDN)
- **Audio**: Web Audio API (procedural)
- **Storage**: localStorage
- **No build tools required** - just open index.html

## Project Structure

```
carrot-defense-td/
├── index.html
├── css/style.css
├── js/
│   ├── main.js
│   ├── core/        # Game loop, state machine, constants, audio
│   ├── map/         # Tiled map, rendering, camera
│   ├── entities/    # Enemy, Tower, Projectile, Particle
│   ├── managers/    # Wave, Enemy, Tower, Particle managers
│   ├── ai/          # A* pathfinding
│   ├── ui/          # HUD, panels, level select
│   └── config/      # Wave, tower, level configurations
└── assets/          # (placeholder for future sprites)
```

## Development Phases

1. Map & Rendering - Grid map, 4-layer tilemap, camera system
2. Core Logic - Enemies, waves, A* pathfinding, game state machine
3. Tower System - 4 tower types, projectiles, upgrade/sell
4. Levels & Effects - 3 levels, particles, screen shake, audio, save system
5. Polish - Touch support, UI refinement, performance

## License

MIT License
