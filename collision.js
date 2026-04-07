// Updated collision.js to match new scaled dimensions

const MAIN_W = 1.5 * originalWidth; // Scale office width by 1.5x
const MAIN_D = 1.5 * originalDepth; // Scale office depth by 1.5x

// Remove office-related collision boxes
const collisionBoxes = collisionBoxes.filter(box => !box.isOfficeRelated);

// Update wall AABB calculations
for (let wall of walls) {
    wall.aabb = {
        x: wall.position.x,
        y: wall.position.y,
        width: MAIN_W,
        depth: MAIN_D
    };
}

// Update bathroom collision boxes to match the 1.5x scaled size
for (let bathroom of bathrooms) {
    bathroom.aabb.width *= 1.5;
    bathroom.aabb.depth *= 1.5;
}