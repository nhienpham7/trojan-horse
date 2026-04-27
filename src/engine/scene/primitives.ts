import * as THREE from 'three'

export function box(
  scene: THREE.Scene,
  x: number,
  y: number,
  z: number,
  w: number,
  h: number,
  d: number,
  mat: THREE.Material
): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
  m.position.set(x, y, z)
  m.castShadow = true
  m.receiveShadow = true
  scene.add(m)
  return m
}

export function wall(
  scene: THREE.Scene,
  x: number,
  z: number,
  w: number,
  d: number,
  wallHeight: number,
  mat: THREE.Material
): void {
  box(scene, x, wallHeight / 2, z, w, wallHeight, d, mat)
}

export function diagWall(
  scene: THREE.Scene,
  x0: number,
  z0: number,
  x1: number,
  z1: number,
  thickness: number,
  wallHeight: number,
  mat: THREE.Material
): void {
  const cx = (x0 + x1) / 2
  const cz = (z0 + z1) / 2
  const dx = x1 - x0
  const dz = z1 - z0
  const len = Math.sqrt(dx * dx + dz * dz)
  const m = new THREE.Mesh(new THREE.BoxGeometry(thickness, wallHeight, len), mat)
  m.position.set(cx, wallHeight / 2, cz)
  m.rotation.y = Math.atan2(dx, dz)
  m.castShadow = true
  m.receiveShadow = true
  scene.add(m)
}
