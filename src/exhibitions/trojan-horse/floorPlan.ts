import type { FloorPlan } from '../../engine/types'

const WALL_H = 4.0
const T = 0.15

const LX0 = -13.5
const LX1 = -8.8
const LZN = -10.0
const LZS = 3.2
const lCX = (LX0 + LX1) / 2
const lCZ = (LZN + LZS) / 2

const MX0 = -6.5
const MX1 = 13.5
const MZN = -8.0
const MZS = 1.5
const mCX = (MX0 + MX1) / 2
const mCZ = (MZN + MZS) / 2

const STEP_X = LX1

const BTH_X0 = 1.5
const BTH_X1 = 6.0
const BTH_ZN = MZN
const BTH_ZS = MZN + 3.2

const CAS_X = -3.5
const CAS_Z = -2.8
const CAS_W = 1.6
const CAS_D = 1.6
const CAS_OPENING = 0.6

const DIV_X = 10.6
const DIV_ZN = MZN + 0.6
const DIV_ZS = MZS - 0.6

const bDX = BTH_X0 + 0.9
const bDW = 1.1

export const TROJAN_HORSE_FLOOR_PLAN: FloorPlan = {
  wallHeight: WALL_H,
  thickness: T,
  eyeHeight: 1.65,
  rooms: [
    { id: 'left', x0: LX0, x1: LX1, z0: LZN, z1: LZS },
    { id: 'main', x0: MX0, x1: MX1, z0: MZN, z1: MZS, raised: true },
  ],
  connectors: [
    {
      cx: (LX1 + MX0) / 2,
      cz: (LZN + MZN) / 2,
      w: MX0 - LX1 + 0.5,
      d: LZN - MZN + 0.5,
    },
  ],
  walls: [
    { cx: LX0 - T / 2, cz: (LZN + 3.6 + LZS) / 2, w: T, d: LZS - (LZN + 3.6) + T * 2 },
    { cx: LX0 - T / 2, cz: (LZN * 2 + 2.5) / 2, w: T, d: 2.5 },
    { cx: STEP_X + 1.55, cz: LZS + T / 2, w: 3.2, d: T },
    { cx: lCX, cz: LZN - T / 2, w: LX1 - LX0 + T * 2, d: T },
    { cx: (LX0 + STEP_X) / 2, cz: LZS + T / 2, w: STEP_X - LX0 + T, d: T },
    { cx: STEP_X + T / 2, cz: (LZS + MZS) / 2, w: T, d: LZS - MZS + T },
    { cx: (STEP_X + MX1) / 2, cz: MZS + T / 2, w: MX1 - STEP_X + T, d: T },
    { cx: MX1 + T / 2, cz: (MZN + MZS) / 2, w: T, d: MZS - MZN + T * 2 },
    { cx: (MX0 + BTH_X0) / 2, cz: MZN - T / 2, w: BTH_X0 - MX0, d: T },
    { cx: (BTH_X1 + MX1) / 2, cz: MZN - T / 2, w: MX1 - BTH_X1, d: T },
    { cx: BTH_X0 - T / 2, cz: (BTH_ZN + BTH_ZS) / 2, w: T, d: BTH_ZS - BTH_ZN + T },
    { cx: BTH_X1 + T / 2, cz: (BTH_ZN + BTH_ZS) / 2, w: T, d: BTH_ZS - BTH_ZN + T },
    {
      cx: BTH_X0 + (bDX - bDW / 2 - BTH_X0) / 2,
      cz: BTH_ZS + T / 2,
      w: bDX - bDW / 2 - BTH_X0,
      d: T,
    },
    {
      cx: bDX + bDW / 2 + (BTH_X1 - (bDX + bDW / 2)) / 2,
      cz: BTH_ZS + T / 2,
      w: BTH_X1 - (bDX + bDW / 2),
      d: T,
    },
    { cx: DIV_X, cz: (DIV_ZN + DIV_ZS) / 2, w: T + 0.06, d: DIV_ZS - DIV_ZN },
  ],
  invisibleColliders: [
    { cx: LX0 - T / 2, cz: lCZ, w: T, d: LZS - LZN + T * 2 },
    { cx: BTH_X0 - T / 2, cz: (MZN + BTH_ZS) / 2, w: T, d: BTH_ZS - MZN + T },
    { cx: BTH_X1 + T / 2, cz: (MZN + BTH_ZS) / 2, w: T, d: BTH_ZS - MZN + T },
    { cx: CAS_X, cz: CAS_Z - CAS_D / 2 - T / 2, w: CAS_W + T * 2, d: T },
    { cx: CAS_X, cz: CAS_Z + CAS_D / 2 + T / 2, w: CAS_W + T * 2, d: T },
    { cx: CAS_X - CAS_W / 2 - T / 2, cz: CAS_Z, w: T, d: CAS_D },
    {
      cx: CAS_X + CAS_W / 2 + T / 2,
      cz: CAS_Z - (CAS_D - CAS_OPENING) / 4,
      w: T,
      d: (CAS_D - CAS_OPENING) / 2,
    },
    {
      cx: CAS_X + CAS_W / 2 + T / 2,
      cz: CAS_Z + (CAS_D - CAS_OPENING) / 4,
      w: T,
      d: (CAS_D - CAS_OPENING) / 2,
    },
  ],
  diagWalls: [{ x0: LX1, z0: LZN, x1: MX0, z1: MZN }],
  decorations: [
    { cx: LX0 - T / 2, cy: WALL_H - 0.45, cz: LZN + 2.1, w: T, h: 0.9, d: 1.4, material: 'wall' },
    {
      cx: LX0 - T / 2,
      cy: WALL_H * 0.42,
      cz: LZN + 1.45,
      w: T + 0.04,
      h: WALL_H * 0.84,
      d: 0.12,
      material: 'door',
    },
    {
      cx: LX0 - T / 2,
      cy: WALL_H * 0.42,
      cz: LZN + 2.75,
      w: T + 0.04,
      h: WALL_H * 0.84,
      d: 0.12,
      material: 'door',
    },
    { cx: LX0, cy: 1.75, cz: lCZ + 2.0, w: T + 0.04, h: 0.85, d: 0.6, material: 'win' },
    { cx: bDX, cy: WALL_H - 0.42, cz: BTH_ZS + T / 2, w: bDW, h: 0.84, d: T, material: 'wall' },
  ],
  pedestals: [{ cx: CAS_X, cy: 1.0 / 2, cz: CAS_Z, w: 0.8, h: 1.0, d: 0.8, material: 'base' }],
  spawn: { position: [LX0 + 1.5, 1.65, lCZ + 1.0], yaw: 0 },
  bounds: { x0: LX0, x1: MX1, z0: LZN, z1: LZS },
}

export const TROJAN_HORSE_GEOMETRY = {
  WALL_H,
  T,
  LX0,
  LX1,
  LZN,
  LZS,
  lCX,
  lCZ,
  MX0,
  MX1,
  MZN,
  MZS,
  mCX,
  mCZ,
  STEP_X,
  BTH_X0,
  BTH_X1,
  BTH_ZN,
  BTH_ZS,
  CAS_X,
  CAS_Z,
  CAS_W,
  DIV_X,
  DIV_ZN,
  DIV_ZS,
} as const
