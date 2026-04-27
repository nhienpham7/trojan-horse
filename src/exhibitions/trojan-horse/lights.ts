import type { LightSpec } from '../../engine/types'
import { TROJAN_HORSE_GEOMETRY as G } from './floorPlan'

const { lCX, lCZ, mCX, mCZ, BTH_X0, BTH_X1, BTH_ZN, BTH_ZS, LX0, STEP_X, LZS, MX0, MZN, MZS } = G

const ceilingPositions: [number, number][] = [
  [lCX, lCZ - 1.5],
  [lCX, lCZ + 1.5],
  [mCX - 7, mCZ - 1],
  [mCX - 7, mCZ + 1],
  [mCX - 2, mCZ - 1],
  [mCX - 2, mCZ + 1],
  [mCX + 4, mCZ - 1],
  [mCX + 4, mCZ + 1],
  [mCX + 9, mCZ],
  [(BTH_X0 + BTH_X1) / 2, (BTH_ZN + BTH_ZS) / 2],
]

const southWallTrackXs = [-7.25, -4.25, -2.25, -0.25, 1.55, 3.35, 5.05]
const dragonflyX = (LX0 + STEP_X) / 2 - 0.2
const rohenJonesXs = [MX0 + 2.8, MX0 + 5.2]

export const TROJAN_HORSE_LIGHTS: LightSpec[] = [
  { kind: 'ambient', color: 0xfff5e0, intensity: 1.2 },

  ...ceilingPositions.map<LightSpec>(([x, z]) => ({
    kind: 'ceiling-spot',
    position: [x, z],
    color: 0xfff8e8,
    intensity: 3.2,
    distance: 18,
    angle: Math.PI / 4.2,
    penumbra: 0.45,
    decay: 1.2,
    showFixture: true,
  })),

  ...southWallTrackXs.map<LightSpec>((tx) => ({
    kind: 'track-spot',
    position: [tx, MZS - 0.7],
    target: [tx, 1.25, MZS - 0.05],
    color: 0xfff0d0,
    intensity: 2.0,
    distance: 9,
    angle: Math.PI / 6,
    penumbra: 0.3,
    decay: 1.5,
  })),

  {
    kind: 'track-spot',
    position: [dragonflyX, LZS - 0.7],
    target: [dragonflyX, 1.55, LZS - 0.05],
    color: 0xfff0d0,
    intensity: 2.2,
    distance: 8,
    angle: Math.PI / 5.8,
    penumbra: 0.32,
    decay: 1.4,
  },

  ...rohenJonesXs.map<LightSpec>((rX) => ({
    kind: 'track-spot',
    position: [rX, MZN + 0.7],
    target: [rX, 1.75, MZN + 0.05],
    color: 0xfff0d0,
    intensity: 2.0,
    distance: 8,
    angle: Math.PI / 5.8,
    penumbra: 0.32,
    decay: 1.35,
  })),
]
