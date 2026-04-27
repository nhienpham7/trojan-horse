import * as THREE from 'three'
import type { FloorPlan, Decor, DecorMaterial } from '../types'
import { MAT } from './materials'
import { box, wall as wallPrim, diagWall as diagWallPrim } from './primitives'

function decorMaterial(m: DecorMaterial): THREE.Material {
  switch (m) {
    case 'wall': return MAT.wall
    case 'partition': return MAT.part
    case 'door': return MAT.door
    case 'win': return MAT.win
    case 'win2': return MAT.win2
    case 'rod': return MAT.rod
    case 'frame': return MAT.frame
  }
}

export function buildRoom(scene: THREE.Scene, plan: FloorPlan): void {
  const { wallHeight: H, thickness: T } = plan

  for (const r of plan.rooms) {
    const w = r.x1 - r.x0
    const d = r.z1 - r.z0
    const cx = (r.x0 + r.x1) / 2
    const cz = (r.z0 + r.z1) / 2
    box(scene, cx, 0, cz, w, 0.08, d, MAT.floor)
    if (r.ceiling !== false) {
      box(scene, cx, H, cz, w, 0.08, d, MAT.ceil)
    }
    if (r.raised) {
      box(scene, cx, 0.12, cz, w - 0.1, 0.18, d - 0.1, MAT.base)
    }
  }

  for (const c of plan.connectors ?? []) {
    box(scene, c.cx, 0, c.cz, c.w, 0.08, c.d, MAT.floor)
    box(scene, c.cx, H, c.cz, c.w, 0.08, c.d, MAT.ceil)
  }

  for (const w of plan.walls) {
    const mat = w.material === 'partition' ? MAT.part : MAT.wall
    wallPrim(scene, w.cx, w.cz, w.w, w.d, H, mat)
  }

  for (const d of plan.diagWalls ?? []) {
    const mat = d.material === 'partition' ? MAT.part : MAT.wall
    diagWallPrim(scene, d.x0, d.z0, d.x1, d.z1, T, H, mat)
  }

  for (const p of plan.pedestals ?? []) {
    const mat = p.material === 'wall' ? MAT.wall : MAT.base
    box(scene, p.cx, p.cy, p.cz, p.w, p.h, p.d, mat)
  }

  for (const dec of plan.decorations ?? []) {
    addDecor(scene, dec)
  }
}

function addDecor(scene: THREE.Scene, d: Decor): void {
  box(scene, d.cx, d.cy, d.cz, d.w, d.h, d.d, decorMaterial(d.material))
}
