import type { Placement } from '../../engine/types'
import { TROJAN_HORSE_GEOMETRY as G } from './floorPlan'

const WO = 0.08
const EH = 1.85

const { LX0, lCZ, MX0, MZN, MZS, mCZ, BTH_X0, BTH_X1, BTH_ZN, CAS_X, CAS_Z, CAS_W, STEP_X, LZS, DIV_X } = G

export const TROJAN_HORSE_PLACEMENTS: Placement[] = [
  { artworkId: '1', kind: 'painting', position: [LX0 + WO, 2.08, lCZ], rotationY: Math.PI / 2, width: 4.95, height: 2.78 },
  { artworkId: '2a', kind: 'painting', position: [CAS_X + CAS_W / 2 - WO, EH - 0.5, CAS_Z], rotationY: -Math.PI / 2, width: 0.6, height: 0.6 },
  { artworkId: '3a', kind: 'painting', position: [MX0 + 1.0, EH, MZN + WO], rotationY: 0, width: 1.18, height: 0.68 },
  { artworkId: '3b', kind: 'painting', position: [MX0 + 4.2, EH, MZN + WO], rotationY: 0, width: 3.4, height: 2.9 },
  { artworkId: '3c', kind: 'painting', position: [(BTH_X0 + BTH_X1) / 2, EH, BTH_ZN + 3.55], rotationY: 0, width: 0.65, height: 0.95 },
  { artworkId: '4', kind: 'glove', position: [BTH_X0 - 1.8, EH, MZN + 1.8], rotationY: Math.PI * 0.78, width: 2.0, height: 1.2 },
  { artworkId: '5a', kind: 'painting', position: [STEP_X + 1.55, 1.45, MZS - WO], rotationY: Math.PI, width: 2.35, height: 1.78 },
  { artworkId: '6b', kind: 'painting', position: [STEP_X + 4.55, EH, MZS - WO], rotationY: Math.PI, width: 0.78, height: 0.65 },
  { artworkId: '5b', kind: 'painting', position: [STEP_X + 6.55, EH, MZS - WO], rotationY: Math.PI, width: 1.0, height: 1.02 },
  { artworkId: '7a', kind: 'painting', position: [STEP_X + 8.55, EH, MZS - WO], rotationY: Math.PI, width: 0.88, height: 1.16 },
  { artworkId: '7b', kind: 'painting', position: [STEP_X + 10.35, EH, MZS - WO], rotationY: Math.PI, width: 0.88, height: 1.16 },
  { artworkId: '7c', kind: 'painting', position: [STEP_X + 12.15, EH, MZS - WO], rotationY: Math.PI, width: 0.90, height: 1.24 },
  { artworkId: '7d', kind: 'painting', position: [STEP_X + 13.85, EH, MZS - WO], rotationY: Math.PI, width: 0.76, height: 1.42 },
  { artworkId: '6a', kind: 'painting', position: [(LX0 + STEP_X) / 2 - 0.2, EH, LZS - WO], rotationY: Math.PI, width: 1.7, height: 0.88 },
  { artworkId: '8', kind: 'painting', position: [DIV_X - 0.15, 2.02, mCZ + 1.5], rotationY: -Math.PI / 2, width: 3.1, height: 2.4 },
]
