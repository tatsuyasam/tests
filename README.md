# Grid Animation Website

A simple, interactive grid-based animation system built with vanilla HTML, CSS, and JavaScript.

## Features

- **Canvas-based rendering**: Smooth animations using HTML5 Canvas
- **Grid system**: All objects move on a grid with customizable cell size
- **Object system**: Easy to create and control animated objects
- **Interactive controls**: Start, pause, and reset animations
- **Responsive design**: Works on different screen sizes
- **Fully customizable**: Easy to add rules, change behaviors, and create complex animations

## Quick Start

1. Open `index.html` in a web browser
2. Click **Start** to begin the animation
3. Use **Pause** to stop and **Reset** to restart

## How to Customize

### Adding New Objects

Edit `main.js` in the `initializeObjects()` function:

```javascript
objects.push(new GridObject(x, y, width, height, color, velocityX, velocityY));
```

**Parameters:**
- `x, y`: Starting position on the grid (in grid cells)
- `width, height`: Size of object in grid cells
- `color`: Any CSS color value (e.g., '#FF6B6B', 'rgb(255, 107, 107)')
- `velocityX, velocityY`: Velocity in grid cells per frame

### Example Objects

```javascript
// Red square at position (2,2), moving right slowly
new GridObject(2, 2, 1, 1, '#FF6B6B', 0.15, 0.1)

// Blue rectangle at position (5,5), 2 cells wide, 1 cell tall
new GridObject(5, 5, 2, 1, '#4ECDC4', 0.1, 0)

// Green square moving up and to the left
new GridObject(10, 10, 1, 1, '#95E1D3', -0.1, -0.1)
```

### Applying Custom Rules

Uncomment and modify the `applyCustomRules()` call in the animation loop to add dynamic behavior:

```javascript
// Make objects move in circles
objects.forEach((obj, index) => {
    const angle = (frameCount + index * 10) * 0.05;
    obj.velocityX = Math.cos(angle) * 0.1;
    obj.velocityY = Math.sin(angle) * 0.1;
});
```

### Changing Grid Size

Modify the `GRID_SIZE` constant in `main.js`:

```javascript
const GRID_SIZE = 40; // Change this to make grid cells larger or smaller
```

### Changing Collision Behavior

In the `update()` method of the `GridObject` class, modify how objects behave at walls:

```javascript
// Current: Bounce off walls
// Alternative: Wrap around screen
// this.x = (this.x + GRID_COLS) % GRID_COLS;
// this.y = (this.y + GRID_ROWS) % GRID_ROWS;
```

## File Structure

```
animation/
├── index.html      # HTML structure
├── style.css       # Styling and layout
├── main.js         # Animation logic and object system
└── README.md       # This file
```
