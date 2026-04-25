// ── FLOOR PLAN CONSTANTS ─────────────────────────────────────────
// Axes: X+ east, Z+ south, Y+ up. Entrance door is on WEST wall.

export const WALL_H = 4.0
export const T      = 0.15

// ── LEFT ROOM ────────────────────────────────────────────────────
export const LX0 = -13.5
export const LX1 = -8.8
export const LZN = -10.0
export const LZS = 3.2
export const lCX = (LX0 + LX1) / 2
export const lCZ = (LZN + LZS) / 2

// ── MAIN HALL ────────────────────────────────────────────────────
export const MX0 = -6.5
export const MX1 = 13.5
export const MZN = -8.0
export const MZS = 1.5
export const mCX = (MX0 + MX1) / 2
export const mCZ = (MZN + MZS) / 2

// South wall step connecting left room (LZS) to main hall (MZS)
export const STEP_X = LX1

// ── BATHROOM ─────────────────────────────────────────────────────
export const BTH_X0 = 1.5
export const BTH_X1 = 6.0
export const BTH_ZN = MZN
export const BTH_ZS = MZN + 3.2

// ── CASEY PARTITION BOX ──────────────────────────────────────────
export const CAS_X = -3.5
export const CAS_Z = -2.8
export const CAS_W = 1.6
export const CAS_D = 1.6

// ── RIGHT DIVIDER WALL ───────────────────────────────────────────
export const DIV_X  = 10.6
export const DIV_ZN = MZN + 0.6
export const DIV_ZS = MZS - 0.6
