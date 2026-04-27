import * as THREE from 'three'

export const MAT = {
  floor: new THREE.MeshStandardMaterial({ color: 0x2a1e12, roughness: 0.92 }),
  wall: new THREE.MeshStandardMaterial({ color: 0xeae4d8, roughness: 0.95 }),
  ceil: new THREE.MeshStandardMaterial({ color: 0xd8d2c4, roughness: 1.0 }),
  base: new THREE.MeshStandardMaterial({ color: 0x181008, roughness: 0.9 }),
  part: new THREE.MeshStandardMaterial({ color: 0xe2dcd0, roughness: 0.95 }),
  door: new THREE.MeshStandardMaterial({ color: 0x181008, roughness: 0.8 }),
  win: new THREE.MeshStandardMaterial({
    color: 0x8090a0,
    roughness: 0.2,
    metalness: 0.1,
    transparent: true,
    opacity: 0.4,
  }),
  win2: new THREE.MeshStandardMaterial({
    color: 0x6080a0,
    roughness: 0.2,
    transparent: true,
    opacity: 0.3,
  }),
  rod: new THREE.MeshStandardMaterial({ color: 0xb0a898, roughness: 0.5 }),
  frame: new THREE.MeshStandardMaterial({ color: 0x5a5448, roughness: 0.5, metalness: 0.15 }),
  light: new THREE.MeshStandardMaterial({
    color: 0xf0e8d0,
    emissive: 0xfff0c0,
    emissiveIntensity: 1.3,
  }),
} as const

export type MaterialKey = keyof typeof MAT
