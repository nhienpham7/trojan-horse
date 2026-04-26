import * as THREE from 'three'
import {
  lCX, lCZ, LX0, LX1, LZN, LZS,
  MX0, MX1, MZN, MZS,
  WALL_H, T,
  STEP_X,
  BTH_X0, BTH_X1, BTH_ZN, BTH_ZS,
  CAS_X,  CAS_Z,  CAS_W,  CAS_D,
  DIV_X,  DIV_ZN, DIV_ZS,
  mCX,    mCZ,
} from './floorPlan.js'
import { ARTWORKS } from './artworks.js'
import { getTexture } from './textureLoader.js'

// ── Materials (module-level singletons) ───────────────────────────
export const MAT = {
  floor:  new THREE.MeshStandardMaterial({ color: 0x2a1e12, roughness: 0.92 }),
  wall:   new THREE.MeshStandardMaterial({ color: 0xeae4d8, roughness: 0.95 }),
  ceil:   new THREE.MeshStandardMaterial({ color: 0xd8d2c4, roughness: 1.0  }),
  base:   new THREE.MeshStandardMaterial({ color: 0x181008, roughness: 0.9  }),
  part:   new THREE.MeshStandardMaterial({ color: 0xe2dcd0, roughness: 0.95 }),
  door:   new THREE.MeshStandardMaterial({ color: 0x181008, roughness: 0.8  }),
  win:    new THREE.MeshStandardMaterial({ color: 0x8090a0, roughness: 0.2, metalness: 0.1, transparent: true, opacity: 0.4 }),
  win2:   new THREE.MeshStandardMaterial({ color: 0x6080a0, roughness: 0.2, transparent: true, opacity: 0.3 }),
  rod:    new THREE.MeshStandardMaterial({ color: 0xb0a898, roughness: 0.5 }),
  frame:  new THREE.MeshStandardMaterial({ color: 0x5a5448, roughness: 0.5, metalness: 0.15 }),
  light:  new THREE.MeshStandardMaterial({ color: 0xf0e8d0, emissive: 0xfff0c0, emissiveIntensity: 1.3 }),
}

// ── Primitive helpers ─────────────────────────────────────────────
function box(scene, x, y, z, w, h, d, mat) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
  m.position.set(x, y, z)
  m.castShadow = m.receiveShadow = true
  scene.add(m)
  return m
}

function wall(scene, x, z, w, d, mat) {
  box(scene, x, WALL_H / 2, z, w, WALL_H, d, mat)
}

function diagWall(scene, x0, z0, x1, z1, mat) {
  const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2
  const dx = x1 - x0,       dz = z1 - z0
  const len = Math.sqrt(dx * dx + dz * dz)
  const m = new THREE.Mesh(new THREE.BoxGeometry(T, WALL_H, len), mat)
  m.position.set(cx, WALL_H / 2, cz)
  m.rotation.y = Math.atan2(dx, dz)
  m.castShadow = m.receiveShadow = true
  scene.add(m)
}

// ── Geometry ──────────────────────────────────────────────────────
export function buildGeometry(scene) {
  const { floor, wall: wM, ceil, base, part, door, win, win2, rod } = MAT

  // Floors
  box(scene, lCX,           0, lCZ,           LX1-LX0,       0.08, LZS-LZN,       floor)
  box(scene, mCX,           0, mCZ,           MX1-MX0,       0.08, MZS-MZN,       floor)
  box(scene, (LX1+MX0)/2,  0, (LZN+MZN)/2,  MX0-LX1+0.5,  0.08, LZN-MZN+0.5,  floor)
  box(scene, mCX,           0.12, mCZ,        MX1-MX0-0.1,  0.18, MZS-MZN-0.1,  base)

  // Ceilings
  box(scene, lCX,          WALL_H, lCZ,          LX1-LX0,      0.08, LZS-LZN,      ceil)
  box(scene, mCX,          WALL_H, mCZ,          MX1-MX0,      0.08, MZS-MZN,      ceil)
  box(scene, (LX1+MX0)/2, WALL_H, (LZN+MZN)/2,  MX0-LX1+0.5, 0.08, LZN-MZN+0.5, ceil)

  // Left room — west wall with door opening
  wall(scene, LX0-T/2,  (LZN+3.6+LZS)/2,   T,  LZS-(LZN+3.6)+T*2,  wM)
  wall(scene, LX0-T/2,  (LZN*2+2.5)/2,      T,  2.5,                 wM)
  box(scene,  LX0-T/2,  WALL_H-0.45,        LZN+2.1,   T,    0.9,  1.4,  wM)
  box(scene,  LX0-T/2,  WALL_H*0.42,        LZN+1.45,  T+0.04, WALL_H*0.84, 0.12, door)
  box(scene,  LX0-T/2,  WALL_H*0.42,        LZN+2.75,  T+0.04, WALL_H*0.84, 0.12, door)

  // Left room — north & south
  wall(scene, lCX,           LZN-T/2,   LX1-LX0+T*2,    T,  wM)
  wall(scene, (LX0+STEP_X)/2, LZS+T/2,  STEP_X-LX0+T,  T,  wM)
  box(scene, (LX0+STEP_X)/2-0.5, 1.5,  LZS+T/2, 1.1, 0.7, T+0.04, win2)

  // Step + main hall perimeter
  wall(scene, STEP_X+T/2,       (LZS+MZS)/2,   T,              LZS-MZS+T,       wM)
  wall(scene, (STEP_X+MX1)/2,   MZS+T/2,       MX1-STEP_X+T,  T,               wM)
  wall(scene, MX1+T/2,          (MZN+MZS)/2,   T,              MZS-MZN+T*2,     wM)

  // Diagonal wall
  diagWall(scene, LX1, LZN, MX0, MZN, wM)

  // North wall — either side of bathroom
  wall(scene, (MX0+BTH_X0)/2, MZN-T/2, BTH_X0-MX0,   T, wM)
  wall(scene, (BTH_X1+MX1)/2, MZN-T/2, MX1-BTH_X1,   T, wM)

  // West window (left room)
  box(scene, LX0, 1.75, lCZ+2.0, T+0.04, 0.85, 0.6, win)

  // Bathroom walls
  wall(scene, BTH_X0-T/2,  (BTH_ZN+BTH_ZS)/2, T,  BTH_ZS-BTH_ZN+T, wM)
  wall(scene, BTH_X1+T/2,  (BTH_ZN+BTH_ZS)/2, T,  BTH_ZS-BTH_ZN+T, wM)
  const bDX = BTH_X0+0.9, bDW = 1.1
  wall(scene, BTH_X0+(bDX-bDW/2-BTH_X0)/2,           BTH_ZS+T/2, bDX-bDW/2-BTH_X0,              T, wM)
  wall(scene, bDX+bDW/2+(BTH_X1-(bDX+bDW/2))/2,      BTH_ZS+T/2, BTH_X1-(bDX+bDW/2),            T, wM)
  box(scene,  bDX, WALL_H-0.42, BTH_ZS+T/2, bDW, 0.84, T, wM)

  // Casey partition box
  const cx0 = CAS_X - CAS_W/2
  const cx1 = CAS_X + CAS_W/2
  const cz0 = CAS_Z - CAS_D/2
  const cz1 = CAS_Z + CAS_D/2
  const op  = 0.6
  wall(scene, CAS_X,      cz0-T/2,         CAS_W+T*2,        T,              part)
  wall(scene, CAS_X,      cz1+T/2,         CAS_W+T*2,        T,              part)
  wall(scene, cx0-T/2,    CAS_Z,           T,                CAS_D,          part)
  wall(scene, cx1+T/2,    CAS_Z - op/2,    T,                (CAS_D-op)/2,   part)
  wall(scene, cx1+T/2,    CAS_Z + op/2,    T,                (CAS_D-op)/2,   part)
  box(scene,  CAS_X-0.35, 0.65, CAS_Z,    0.06, 1.3, 0.06,  rod)
  box(scene,  CAS_X+0.35, 0.65, CAS_Z,    0.06, 1.3, 0.06,  rod)

  // Right divider wall
  wall(scene, DIV_X, (DIV_ZN+DIV_ZS)/2, T+0.06, DIV_ZS-DIV_ZN, wM)
}

// ── Lighting ──────────────────────────────────────────────────────
export function buildLights(scene) {
  const { light: lgtM } = MAT
  scene.add(new THREE.AmbientLight(0xfff5e0, 0.8))

  const ceilSpots = [
    [lCX,    lCZ-1.5], [lCX,    lCZ+1.5],
    [mCX-7,  mCZ-1],   [mCX-7,  mCZ+1],
    [mCX-2,  mCZ-1],   [mCX-2,  mCZ+1],
    [mCX+4,  mCZ-1],   [mCX+4,  mCZ+1],
    [mCX+9,  mCZ],
    [(BTH_X0+BTH_X1)/2, (BTH_ZN+BTH_ZS)/2],
  ]

  ceilSpots.forEach(([x, z]) => {
    const s = new THREE.SpotLight(0xfff8e8, 3.2, 18, Math.PI/4.2, 0.45, 1.2)
    s.position.set(x, WALL_H - 0.2, z)
    s.castShadow = true
    s.shadow.mapSize.set(512, 512)
    s.target.position.set(x, 0, z)
    scene.add(s)
    scene.add(s.target)
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.10, 0.05, 12), lgtM)
    disc.position.set(x, WALL_H - 0.03, z)
    scene.add(disc)
  })

  // South-wall track lights
  ;[-7, -4.5, -2, 0.5, 3, 5.5, 8, 10, 12].forEach(tx => {
    const t = new THREE.SpotLight(0xfff0d0, 2.0, 9, Math.PI/6, 0.3, 1.5)
    t.position.set(tx, WALL_H - 0.3, MZS - 0.7)
    t.castShadow = false
    t.target.position.set(tx, 1.7, MZS - 0.05)
    scene.add(t)
    scene.add(t.target)
  })
}

// ── Painting factory ──────────────────────────────────────────────
export function addPainting(scene, x, y, z, ry, id, pw = 0.85, ph = 0.75) {
  const art = ARTWORKS.find(a => a.id === id) || ARTWORKS[0]
  const { frame: frmM } = MAT
  const g = new THREE.Group()
  g.position.set(x, y, z)
  g.rotation.y = ry

  // Outer frame
  const frameM = new THREE.Mesh(new THREE.BoxGeometry(pw+0.07, ph+0.07, 0.03), frmM)
  frameM.castShadow = true
  g.add(frameM)

  // Mat board
  const matBoard = new THREE.Mesh(
    new THREE.BoxGeometry(pw+0.01, ph+0.01, 0.022),
    new THREE.MeshStandardMaterial({ color: 0xf5f0e8, roughness: 1 })
  )
  matBoard.position.z = 0.007
  g.add(matBoard)

  // Canvas surface with procedural texture
  const surfaceMat = new THREE.MeshStandardMaterial({ map: getTexture(id), roughness: 0.65 })
  const surface = new THREE.Mesh(new THREE.BoxGeometry(pw-0.03, ph-0.03, 0.018), surfaceMat)
  surface.position.z = 0.016
  g.add(surface)

  // Spotlight aimed at this painting
  const spot = new THREE.SpotLight(0xfff5e0, 1.4, 5, Math.PI / 7, 0.4, 1.5)
  const worldPos = new THREE.Vector3(x, y, z)
  spot.position.set(x, WALL_H - 0.3, z + Math.cos(ry) * 0.8 - Math.sin(ry) * 0.8)
  spot.target.position.copy(worldPos)
  scene.add(spot)
  scene.add(spot.target)

  g.userData = { isPainting: true, artworkId: id, ...art }
  scene.add(g)
  return g
}

export function addGlove(scene, x, y, z, ry, id) {
  const art = ARTWORKS.find(a => a.id === id) || ARTWORKS[0]
  const g = new THREE.Group()
  g.position.set(x, y, z)
  g.rotation.y = ry

  g.add(new THREE.Mesh(
    new THREE.BoxGeometry(2.0, 1.2, 0.01),
    new THREE.MeshStandardMaterial({ color: 0xf0f0ee, roughness: 0.95 })
  ))

  const gc = [0x555555, 0xcc88aa, 0x3366aa, 0x4488bb, 0x222222, 0xaa6644]
  for (let i = 0; i < 10; i++) {
    const gp = new THREE.Mesh(
      new THREE.BoxGeometry(0.10, 0.16, 0.014),
      new THREE.MeshStandardMaterial({ color: gc[i % gc.length], roughness: 0.85 })
    )
    gp.position.set((Math.random()-0.5)*1.6, (Math.random()-0.5)*0.8, 0.013)
    gp.rotation.z = (Math.random()-0.5)*0.7
    g.add(gp)
  }

  g.userData = { isPainting: true, artworkId: id, ...art }
  scene.add(g)
  return g
}

// ── Painting placement map ────────────────────────────────────────
export function placePaintings(scene) {
  const WO = 0.08, EH = 1.85
  const P = (x, y, z, ry, id, pw, ph) => addPainting(scene, x, y, z, ry, id, pw, ph)
  const G = (x, y, z, ry, id)         => addGlove(scene, x, y, z, ry, id)

  return [
    P(LX0+WO,              EH,     lCZ-0.5,       Math.PI/2,     '1',  0.65, 0.88),
    P(CAS_X+CAS_W/2-WO,    EH,     CAS_Z,        -Math.PI/2,     '2a', 0.6,  0.6 ),
    P(CAS_X,               EH,     CAS_Z-CAS_D/2+WO, 0,          '2b', 0.6,  0.6 ),
    P(CAS_X-CAS_W/2-0.5,   EH+0.1, CAS_Z-0.3,    Math.PI/2,     '2c', 0.65, 0.82),
    P(MX0+2.8,             EH,     MZN+WO,        Math.PI,       '3a', 0.88, 0.68),
    P(MX0+5.2,             EH,     MZN+WO,        Math.PI,       '3b', 0.95, 0.74),
    P((BTH_X0+BTH_X1)/2-0.3, EH,  BTH_ZS-WO,     0,             '3c', 0.65, 1.25),
    P(BTH_X1+2.2,          EH,     MZN+WO,        Math.PI,       '3d', 0.78, 0.65),
    G(BTH_X0-1.8,          EH,     MZN+1.8,       Math.PI*0.78,  '4'              ),
    P(STEP_X+2.0,          EH+0.2, MZS-WO,        0,             '5a', 1.1,  0.95),
    P(STEP_X+4.8,          EH,     MZS-WO,        0,             '6b', 0.78, 0.65),
    P(STEP_X+7.0,          EH,     MZS-WO,        0,             '5b', 0.75, 0.70),
    P(STEP_X+9.0,          EH,     MZS-WO,        0,             '7a', 0.72, 0.86),
    P(STEP_X+10.8,         EH,     MZS-WO,        0,             '7b', 0.72, 0.86),
    P(STEP_X+12.6,         EH,     MZS-WO,        0,             '7c', 0.72, 0.86),
    P(STEP_X+14.3,         EH,     MZS-WO,        0,             '7d', 0.70, 0.90),
    P((LX0+STEP_X)/2-0.2,  EH,     LZS-WO,        0,             '6a', 0.88, 0.65),
    P(DIV_X-WO,            EH+0.45, mCZ-1.0,     -Math.PI/2,     '8',  1.25, 1.1 ),
    P(DIV_X-WO,            EH-0.2,  mCZ+0.65,    -Math.PI/2,     '8',  1.0,  0.9 ),
  ]
}
