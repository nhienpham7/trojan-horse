import {
  T,
  LX0, LX1, LZN, LZS, lCX, lCZ,
  MX0, MX1, MZN, MZS,
  STEP_X,
  BTH_X0, BTH_X1, BTH_ZS,
  CAS_X, CAS_Z, CAS_W, CAS_D,
  DIV_X, DIV_ZN, DIV_ZS,
} from './floorPlan.js'

const PR      = 0.35   // player collision radius
const OPENING = 0.6    // casey box door gap

function aabb(cx, cz, w, d) {
  return {
    mnX: cx - w / 2 - PR,
    mxX: cx + w / 2 + PR,
    mnZ: cz - d / 2 - PR,
    mxZ: cz + d / 2 + PR,
  }
}

const WALLS = [
  // Left room perimeter
  aabb(LX0 - T / 2,          lCZ,             T,              LZS - LZN + T * 2),
  aabb(lCX,                  LZN - T / 2,     LX1 - LX0 + T * 2, T),
  aabb((LX0 + STEP_X) / 2,   LZS + T / 2,    STEP_X - LX0 + T,  T),
  // Step connector
  aabb(STEP_X + T / 2,       (LZS + MZS) / 2, T,             LZS - MZS + T),
  // Main hall
  aabb((STEP_X + MX1) / 2,   MZS + T / 2,    MX1 - STEP_X + T,  T),
  aabb(MX1 + T / 2,          (MZN + MZS) / 2, T,             MZS - MZN + T * 2),
  aabb((MX0 + BTH_X0) / 2,   MZN - T / 2,    BTH_X0 - MX0,      T),
  aabb((BTH_X1 + MX1) / 2,   MZN - T / 2,    MX1 - BTH_X1,      T),
  // Bathroom walls
  aabb(BTH_X0 - T / 2,       (MZN + BTH_ZS) / 2, T,         BTH_ZS - MZN + T),
  aabb(BTH_X1 + T / 2,       (MZN + BTH_ZS) / 2, T,         BTH_ZS - MZN + T),
  aabb((BTH_X0 + BTH_X1) / 2, BTH_ZS + T / 2, BTH_X1 - BTH_X0, T),
  // Casey partition box
  aabb(CAS_X,                CAS_Z - CAS_D / 2 - T / 2, CAS_W + T * 2, T),
  aabb(CAS_X,                CAS_Z + CAS_D / 2 + T / 2, CAS_W + T * 2, T),
  aabb(CAS_X - CAS_W / 2 - T / 2, CAS_Z,           T, CAS_D),
  aabb(CAS_X + CAS_W / 2 + T / 2, CAS_Z - (CAS_D - OPENING) / 4, T, (CAS_D - OPENING) / 2),
  aabb(CAS_X + CAS_W / 2 + T / 2, CAS_Z + (CAS_D - OPENING) / 4, T, (CAS_D - OPENING) / 2),
  // Right divider wall
  aabb(DIV_X, (DIV_ZN + DIV_ZS) / 2, T + 0.1, DIV_ZS - DIV_ZN),
]

export function resolveCollisions(position) {
  position.y = 1.65
  position.x = Math.max(LX0 - 0.2, Math.min(MX1 + 0.2, position.x))
  position.z = Math.max(LZN - 0.2, Math.min(LZS + 0.2, position.z))

  for (const b of WALLS) {
    if (
      position.x > b.mnX && position.x < b.mxX &&
      position.z > b.mnZ && position.z < b.mxZ
    ) {
      const dL = position.x - b.mnX
      const dR = b.mxX - position.x
      const dF = position.z - b.mnZ
      const dB = b.mxZ - position.z
      const m  = Math.min(dL, dR, dF, dB)
      if      (m === dL) position.x = b.mnX
      else if (m === dR) position.x = b.mxX
      else if (m === dF) position.z = b.mnZ
      else               position.z = b.mxZ
    }
  }
}
