import * as THREE from 'three'
import type { FloorPlan, LightSpec } from '../types'
import { MAT } from './materials'

export function buildLights(
  scene: THREE.Scene,
  lights: LightSpec[],
  plan: FloorPlan
): void {
  const H = plan.wallHeight

  for (const l of lights) {
    if (l.kind === 'ambient') {
      scene.add(new THREE.AmbientLight(l.color, l.intensity))
      continue
    }

    if (l.kind === 'ceiling-spot') {
      const color = l.color ?? 0xfff8e8
      const intensity = l.intensity ?? 3.2
      const distance = l.distance ?? 18
      const angle = l.angle ?? Math.PI / 4.2
      const penumbra = l.penumbra ?? 0.45
      const decay = l.decay ?? 1.2

      const s = new THREE.SpotLight(color, intensity, distance, angle, penumbra, decay)
      s.position.set(l.position[0], H - 0.2, l.position[1])
      s.castShadow = true
      s.shadow.mapSize.set(512, 512)
      s.target.position.set(l.position[0], 0, l.position[1])
      scene.add(s)
      scene.add(s.target)

      if (l.showFixture !== false) {
        const disc = new THREE.Mesh(
          new THREE.CylinderGeometry(0.06, 0.10, 0.05, 12),
          MAT.light
        )
        disc.position.set(l.position[0], H - 0.03, l.position[1])
        scene.add(disc)
      }
      continue
    }

    if (l.kind === 'track-spot') {
      const color = l.color ?? 0xfff0d0
      const intensity = l.intensity ?? 2.0
      const distance = l.distance ?? 9
      const angle = l.angle ?? Math.PI / 6
      const penumbra = l.penumbra ?? 0.3
      const decay = l.decay ?? 1.5

      const s = new THREE.SpotLight(color, intensity, distance, angle, penumbra, decay)
      s.position.set(l.position[0], H - 0.3, l.position[1])
      s.castShadow = false
      s.target.position.set(l.target[0], l.target[1], l.target[2])
      scene.add(s)
      scene.add(s.target)
    }
  }
}
