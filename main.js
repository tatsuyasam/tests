// Canvas setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Grid configuration
const GRID_SIZE = 40;
let GRID_COLS = Math.floor(canvas.width / GRID_SIZE);
let GRID_ROWS = Math.floor(canvas.height / GRID_SIZE);

// Animation state
let isRunning = false;
let objects = [];
let frameCount = 0;

// Object class - represents entities in the grid
class GridObject {
    constructor(x, y, type = 'circle', color = '#ffffff', hollow = false) {
        this.gridX = x;
        this.gridY = y;
        this.type = type; // 'circle' or 'square'
        this.color = color;
        this.hollow = hollow; // true for outline, false for filled
        this.size = 12; // radius for circle, half-width for square
        
        // Movement properties
        this.moveCounter = 0;
        this.moveInterval = Math.floor(Math.random() * 100) + 20; // Move every 50-150 frames (slower)
        this.direction = Math.floor(Math.random() * 4); // 0=up, 1=down, 2=left, 3=right
        this.directionChangeChance = 0.5; // 50% chance to change direction each move
    }

    draw(ctx) {
        const screenX = this.gridX * GRID_SIZE + GRID_SIZE / 2;
        const screenY = this.gridY * GRID_SIZE + GRID_SIZE / 2;
        
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.lineWidth = 2;
        
        if (this.type === 'circle') {
            if (this.hollow) {
                // Draw hollow circle
                ctx.beginPath();
                ctx.arc(screenX, screenY, this.size, 0, Math.PI * 2);
                ctx.stroke();
            } else {
                // Draw filled circle
                ctx.beginPath();
                ctx.arc(screenX, screenY, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        } else {
            if (this.hollow) {
                // Draw hollow square
                ctx.strokeRect(
                    screenX - this.size,
                    screenY - this.size,
                    this.size * 2,
                    this.size * 2
                );
            } else {
                // Draw filled square
                ctx.fillRect(
                    screenX - this.size,
                    screenY - this.size,
                    this.size * 2,
                    this.size * 2
                );
            }
        }
    }

    update(objects) {
        this.moveCounter++;
        
        if (this.moveCounter >= this.moveInterval) {
            this.moveCounter = 0;
            
            // Randomly change direction
            if (Math.random() < this.directionChangeChance) {
                this.direction = Math.floor(Math.random() * 4);
            }
            
            // Calculate next position based on current direction
            let nextX = this.gridX;
            let nextY = this.gridY;
            let canMove = true;
            
            switch (this.direction) {
                case 0: // Up
                    nextY = this.gridY - 1;
                    if (nextY < 0) canMove = false;
                    break;
                case 1: // Down
                    nextY = this.gridY + 1;
                    if (nextY >= GRID_ROWS) canMove = false;
                    break;
                case 2: // Left
                    nextX = this.gridX - 1;
                    if (nextX < 0) canMove = false;
                    break;
                case 3: // Right
                    nextX = this.gridX + 1;
                    if (nextX >= GRID_COLS) canMove = false;
                    break;
            }
            
            // Check if target position is occupied
            if (canMove) {
                const isOccupied = objects.some(obj => obj !== this && obj.gridX === nextX && obj.gridY === nextY);
                if (isOccupied) {
                    canMove = false;
                }
            }
            
            // Move if possible, otherwise change direction
            if (canMove) {
                this.gridX = nextX;
                this.gridY = nextY;
            } else {
                // Change direction if blocked
                this.direction = (this.direction + 1) % 4;
            }
        }
    }
}

// Initialize random objects
function initializeObjects() {
    objects = [];
    const numObjects = Math.floor(GRID_COLS * GRID_ROWS * 0.1); // 10% of grid filled
    const colors = ['#ffffff', '#ffffff', '#ffffff']; // Mostly white
    
    for (let i = 0; i < numObjects; i++) {
        const x = Math.floor(Math.random() * GRID_COLS);
        const y = Math.floor(Math.random() * GRID_ROWS);
        const type = Math.random() > 0.5 ? 'circle' : 'square';
        const color = colors[Math.floor(Math.random() * colors.length)];
        const hollow = Math.random() > 0.6; // 40% chance to be hollow
        
        objects.push(new GridObject(x, y, type, color, hollow));
    }
}

// Draw the grid
function drawGrid() {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 0.5;

    // Vertical lines
    for (let i = 0; i <= GRID_COLS; i++) {
        ctx.beginPath();
        ctx.moveTo(i * GRID_SIZE, 0);
        ctx.lineTo(i * GRID_SIZE, canvas.height);
        ctx.stroke();
    }

    // Horizontal lines
    for (let i = 0; i <= GRID_ROWS; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * GRID_SIZE);
        ctx.lineTo(canvas.width, i * GRID_SIZE);
        ctx.stroke();
    }
}

// Calculate Manhattan distance between two grid points
function getDistance(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

// Draw connection lines between nearby elements
function drawConnections() {
    for (let i = 0; i < objects.length; i++) {
        for (let j = i + 1; j < objects.length; j++) {
            const obj1 = objects[i];
            const obj2 = objects[j];
            const distance = getDistance(obj1.gridX, obj1.gridY, obj2.gridX, obj2.gridY);
            
            // Only draw lines for elements within 3 spaces
            if (distance > 0 && distance <= 3) {
                const x1 = obj1.gridX * GRID_SIZE + GRID_SIZE / 2;
                const y1 = obj1.gridY * GRID_SIZE + GRID_SIZE / 2;
                const x2 = obj2.gridX * GRID_SIZE + GRID_SIZE / 2;
                const y2 = obj2.gridY * GRID_SIZE + GRID_SIZE / 2;
                
                ctx.lineWidth = 1;
                
                if (distance === 1) {
                    // Solid line for 1 space
                    ctx.strokeStyle = '#ffffff';
                    ctx.setLineDash([]);
                } else if (distance === 2) {
                    // Dotted line for 2 spaces
                    ctx.strokeStyle = '#ffffff';
                    ctx.setLineDash([3, 3]);
                } else if (distance === 3) {
                    // Translucent line for 3 spaces
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                    ctx.setLineDash([]);
                }
                
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
                
                // Reset line dash
                ctx.setLineDash([]);
            }
        }
    }
}

// Draw all objects
function drawObjects() {
    objects.forEach(obj => obj.draw(ctx));
}

// Draw connections and objects
function drawScene() {
    drawConnections();
    drawObjects();
}

// Animation loop
function animate() {
    // Clear canvas with black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    drawGrid();

    if (isRunning) {
        // Update all objects with collision detection
        objects.forEach(obj => obj.update(objects));
        frameCount++;
    }

    // Draw scene (connections and objects)
    drawScene();

    // Display info
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.fillText(`Frame: ${frameCount} | Objects: ${objects.length}`, 10, 20);

    requestAnimationFrame(animate);
}

// Control buttons
document.getElementById('startBtn').addEventListener('click', () => {
    isRunning = true;
});

document.getElementById('pauseBtn').addEventListener('click', () => {
    isRunning = false;
});

document.getElementById('resetBtn').addEventListener('click', () => {
    isRunning = false;
    frameCount = 0;
});

// Start the animation
initializeObjects();
animate();
