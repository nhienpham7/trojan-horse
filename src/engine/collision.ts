import type { FloorPlan } from './types'
import * as THREE from 'three'

const PR = 0.35

type AABB = { mnX: number; mxX: number; mnZ: number; mxZ: number }

function aabb(cx: number, cz: number, w: number, d: number): AABB {
  return {
    mnX: cx - w / 2 - PR,
    mxX: cx + w / 2 + PR,
    mnZ: cz - d / 2 - PR,
    mxZ: cz + d / 2 + PR,
  }
}

export type CollisionWorld = {
  bounds: FloorPlan['bounds']
  eyeHeight: number
  walls: AABB[]
}

export function buildCollisionWorld(plan: FloorPlan): CollisionWorld {
  const walls: AABB[] = []

  for (const w of plan.walls) {
    walls.push(aabb(w.cx, w.cz, w.w, w.d))
  }

  for (const w of plan.invisibleColliders ?? []) {
    walls.push(aabb(w.cx, w.cz, w.w, w.d))
  }

  for (const p of plan.pedestals ?? []) {
    walls.push(aabb(p.cx, p.cz, p.w, p.d))
  }

  return {
    bounds: plan.bounds,
    eyeHeight: plan.eyeHeight ?? 1.65,
    walls,
  }
}

export function resolveCollisions(world: CollisionWorld, position: THREE.Vector3): void {
  position.y = world.eyeHeight
  position.x = Math.max(world.bounds.x0 - 0.2, Math.min(world.bounds.x1 + 0.2, position.x))
  position.z = Math.max(world.bounds.z0 - 0.2, Math.min(world.bounds.z1 + 0.2, position.z))

  for (const b of world.walls) {
    if (
      position.x > b.mnX &&
      position.x < b.mxX &&
      position.z > b.mnZ &&
      position.z < b.mxZ
    ) {
      const dL = position.x - b.mnX
      const dR = b.mxX - position.x
      const dF = position.z - b.mnZ
      const dB = b.mxZ - position.z
      const m = Math.min(dL, dR, dF, dB)
      if (m === dL) position.x = b.mnX
      else if (m === dR) position.x = b.mxX
      else if (m === dF) position.z = b.mnZ
      else position.z = b.mxZ
    }
  }
}
