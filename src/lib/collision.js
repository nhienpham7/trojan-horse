import * as THREE from "three";
import {
  MAIN_W, MAIN_D, OFF_W, OFF_D,
  WALL_H, mZ, oZ, offX, centreZ,
} from "./floorPlan";

// ── Bounding boxes for every wall segment ─────────────────
// Each entry is { minX, maxX, minZ, maxZ }
// We shrink the player to a radius so we push them back before they clip.

const PLAYER_RADIUS = 0.35;

function wallAABB(cx, cz, w, d) {
  return {
    minX: cx - w / 2 - PLAYER_RADIUS,
    maxX: cx + w / 2 + PLAYER_RADIUS,
    minZ: cz - d / 2 - PLAYER_RADIUS,
    maxZ: cz + d / 2 + PLAYER_RADIUS,
  };
}

const T = 0.18;

// Pre-compute all wall AABBs from the same dimensions used in floorPlan.js
export const wallBoxes = [
  // ── Main body outer walls ────────────────────────────────
  // Left
  wallAABB(-MAIN_W / 2 - T / 2, mZ, T, MAIN_D + T * 2),
  // Right
  wallAABB( MAIN_W / 2 + T / 2, mZ, T, MAIN_D + T * 2),
  // South
  wallAABB(0, mZ + MAIN_D / 2 + T / 2, MAIN_W, T),

  // North wall left segment
  (() => {
    const leftGap  = offX - OFF_W / 2 - (-MAIN_W / 2);
    const cx = -MAIN_W / 2 + leftGap / 2;
    return wallAABB(cx, mZ - MAIN_D / 2 - T / 2, leftGap, T);
  })(),
  // North wall right segment
  (() => {
    const rightGap = MAIN_W / 2 - (offX + OFF_W / 2);
    const cx = MAIN_W / 2 - rightGap / 2;
    return wallAABB(cx, mZ - MAIN_D / 2 - T / 2, rightGap, T);
  })(),

  // ── Office outer walls ───────────────────────────────────
  // Left
  wallAABB(offX - OFF_W / 2 - T / 2, oZ, T, OFF_D),
  // Right
  wallAABB(offX + OFF_W / 2 + T / 2, oZ, T, OFF_D),
  // Far north wall
  wallAABB(offX, oZ - OFF_D / 2 - T / 2, OFF_W + T * 2, T),

  // ── Bathroom walls ───────────────────────────────────────
  (() => {
    const S  = (v) => v * 0.025;
    const bX = S(47);
    const bZ = mZ - MAIN_D / 4;
    const BW = S(86);
    const BD = S(86);
    return [
      wallAABB(bX,            bZ,            T,  BD),
      wallAABB(bX + BW,       bZ,            T,  BD),
      wallAABB(bX + BW / 2,   bZ + BD / 2,   BW, T),
      wallAABB(bX + BW * 0.2, bZ - BD / 2,   BW * 0.35, T),
    ];
  })(),
].flat();

// ── Floor / ceiling clamp ────────────────────────────────
const FLOOR_Y  = 1.65;  // eye height
const BOUNDS_X = MAIN_W / 2 + OFF_W;
const BOUNDS_Z_MIN = centreZ - 0.5;
const BOUNDS_Z_MAX = centreZ + MAIN_D + OFF_D + 0.5;

export function resolveCollisions(position) {
  // Hard floor / ceiling
  position.y = FLOOR_Y;

  // Broad bounds clamp (stay inside the building footprint)
  position.x = Math.max(-BOUNDS_X, Math.min(BOUNDS_X, position.x));
  position.z = Math.max(BOUNDS_Z_MIN, Math.min(BOUNDS_Z_MAX, position.z));

  // Wall AABB push-out
  for (const box of wallBoxes) {
    if (
      position.x > box.minX && position.x < box.maxX &&
      position.z > box.minZ && position.z < box.maxZ
    ) {
      // Find shallowest penetration axis and push out
      const dLeft  = position.x - box.minX;
      const dRight = box.maxX - position.x;
      const dFront = position.z - box.minZ;
      const dBack  = box.maxZ - position.z;
      const minPen = Math.min(dLeft, dRight, dFront, dBack);

      if      (minPen === dLeft)  position.x = box.minX;
      else if (minPen === dRight) position.x = box.maxX;
      else if (minPen === dFront) position.z = box.minZ;
      else                        position.z = box.maxZ;
    }
  }
}