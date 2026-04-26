import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import {
  LX0, lCZ,
  LX1, LZN, LZS, lCX,
  MX0, MX1, MZN, MZS, mCX, mCZ,
  WALL_H, T,
  STEP_X,
  BTH_X0, BTH_X1, BTH_ZN, BTH_ZS,
  CAS_X, CAS_Z, CAS_W, CAS_D,
  DIV_X, DIV_ZN, DIV_ZS,
} from '../lib/floorPlan.js'
import { ARTWORKS } from '../lib/artworks.js'
import { getTexture } from '../lib/textureLoader.js'
import { resolveCollisions } from '../lib/collision.js'

//  Materials 
const fM = new THREE.MeshStandardMaterial({ color: 0x2a1e12, roughness: 0.92 })
const wM = new THREE.MeshStandardMaterial({ color: 0xeae4d8, roughness: 0.95 })
const cM = new THREE.MeshStandardMaterial({ color: 0xd8d2c4, roughness: 1.0 })
const bM = new THREE.MeshStandardMaterial({ color: 0x181008, roughness: 0.9 })
const drM = new THREE.MeshStandardMaterial({ color: 0x181008, roughness: 0.8 })
const winM = new THREE.MeshStandardMaterial({ color: 0x8090a0, roughness: 0.2, metalness: 0.1, transparent: true, opacity: 0.4 })
const frmM = new THREE.MeshStandardMaterial({ color: 0x5a5448, roughness: 0.5, metalness: 0.15 })
const lgtM = new THREE.MeshStandardMaterial({ color: 0xf0e8d0, emissive: 0xfff0c0, emissiveIntensity: 1.3 })

// Helpers 
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
  const dx = x1 - x0, dz = z1 - z0
  const len = Math.sqrt(dx * dx + dz * dz)
  const m = new THREE.Mesh(new THREE.BoxGeometry(T, WALL_H, len), mat)
  m.position.set(cx, WALL_H / 2, cz)
  m.rotation.y = Math.atan2(dx, dz)
  m.castShadow = m.receiveShadow = true
  scene.add(m)
}

// Scene geometry 
function buildGeometry(scene) {
  // Floors
  box(scene, lCX, 0, lCZ, LX1 - LX0, 0.08, LZS - LZN, fM)
  box(scene, mCX, 0, mCZ, MX1 - MX0, 0.08, MZS - MZN, fM)
  box(scene, (LX1 + MX0) / 2, 0, (LZN + MZN) / 2, MX0 - LX1 + 0.5, 0.08, LZN - MZN + 0.5, fM)
  box(scene, mCX, 0.12, mCZ, MX1 - MX0 - 0.1, 0.18, MZS - MZN - 0.1, bM)


  // Ceilings
  box(scene, lCX, WALL_H, lCZ, LX1 - LX0, 0.08, LZS - LZN, cM)
  box(scene, mCX, WALL_H, mCZ, MX1 - MX0, 0.08, MZS - MZN, cM)
  box(scene, (LX1 + MX0) / 2, WALL_H, (LZN + MZN) / 2, MX0 - LX1 + 0.5, 0.08, LZN - MZN + 0.5, cM)


  // West wall with door
  wall(scene, LX0 - T / 2, (LZN + 3.6 + LZS) / 2, T, LZS - (LZN + 3.6) + T * 2, wM)
  wall(scene, LX0 - T / 2, (LZN * 2 + 2.5) / 2, T, 2.5, wM)
  box(scene, LX0 - T / 2, WALL_H - 0.45, LZN + 2.1, T, 0.9, 1.4, wM)
  box(scene, LX0 - T / 2, WALL_H * 0.42, LZN + 1.45, T + 0.04, WALL_H * 0.84, 0.12, drM)
  box(scene, LX0 - T / 2, WALL_H * 0.42, LZN + 2.75, T + 0.04, WALL_H * 0.84, 0.12, drM)
  wall(scene, STEP_X + 1.55, LZS + T / 2, 3.2, T, wM)


  // Left room north / south
  wall(scene, lCX, LZN - T / 2, LX1 - LX0 + T * 2, T, wM)
  wall(scene, (LX0 + STEP_X) / 2, LZS + T / 2, STEP_X - LX0 + T, T, wM)


  // Step
  wall(scene, STEP_X + T / 2, (LZS + MZS) / 2, T, LZS - MZS + T, wM)


  // Main hall perimeter
  wall(scene, (STEP_X + MX1) / 2, MZS + T / 2, MX1 - STEP_X + T, T, wM)
  wall(scene, MX1 + T / 2, (MZN + MZS) / 2, T, MZS - MZN + T * 2, wM)


  // Diagonal
  diagWall(scene, LX1, LZN, MX0, MZN, wM)


  // North wall around bathroom
  wall(scene, (MX0 + BTH_X0) / 2, MZN - T / 2, BTH_X0 - MX0, T, wM)
  wall(scene, (BTH_X1 + MX1) / 2, MZN - T / 2, MX1 - BTH_X1, T, wM)


  // West window
  box(scene, LX0, 1.75, lCZ + 2.0, T + 0.04, 0.85, 0.6, winM)


  // Bathroom
  wall(scene, BTH_X0 - T / 2, (BTH_ZN + BTH_ZS) / 2, T, BTH_ZS - BTH_ZN + T, wM)
  wall(scene, BTH_X1 + T / 2, (BTH_ZN + BTH_ZS) / 2, T, BTH_ZS - BTH_ZN + T, wM)
  const bDX = BTH_X0 + 0.9, bDW = 1.1
  wall(scene, BTH_X0 + (bDX - bDW / 2 - BTH_X0) / 2, BTH_ZS + T / 2, bDX - bDW / 2 - BTH_X0, T, wM)
  wall(scene, bDX + bDW / 2 + (BTH_X1 - (bDX + bDW / 2)) / 2, BTH_ZS + T / 2, BTH_X1 - (bDX + bDW / 2), T, wM)
  box(scene, bDX, WALL_H - 0.42, BTH_ZS + T / 2, bDW, 0.84, T, wM)


  // Casey
  // Small pedestal 
  const baseSize = 0.8
  const baseH = 1.0

  box(scene, CAS_X, baseH / 2, CAS_Z, baseSize, baseH, baseSize, bM)


  // Right divider
  wall(scene, DIV_X, (DIV_ZN + DIV_ZS) / 2, T + 0.06, DIV_ZS - DIV_ZN, wM)
}

//  Lighting 
function buildLights(scene) {
  scene.add(new THREE.AmbientLight(0xfff5e0, 1.2))
  const ceilPos = [
    [lCX, lCZ - 1.5], [lCX, lCZ + 1.5],
    [mCX - 7, mCZ - 1], [mCX - 7, mCZ + 1],
    [mCX - 2, mCZ - 1], [mCX - 2, mCZ + 1],
    [mCX + 4, mCZ - 1], [mCX + 4, mCZ + 1],
    [mCX + 9, mCZ],
    [(BTH_X0 + BTH_X1) / 2, (BTH_ZN + BTH_ZS) / 2],
  ]
  ceilPos.forEach(([x, z]) => {
    const s = new THREE.SpotLight(0xfff8e8, 3.2, 18, Math.PI / 4.2, 0.45, 1.2)
    s.position.set(x, WALL_H - 0.2, z); s.castShadow = true; s.shadow.mapSize.set(512, 512)
    s.target.position.set(x, 0, z); scene.add(s); scene.add(s.target)
    const d = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.10, 0.05, 12), lgtM)
    d.position.set(x, WALL_H - 0.03, z); scene.add(d)
  })
    // South wall track lights (centred on actual painting positions)
    ;[-7.25, -4.25, -2.25, -0.25, 1.55, 3.35, 5.05].forEach(tx => {
      const t = new THREE.SpotLight(0xfff0d0, 2.0, 9, Math.PI / 6, 0.3, 1.5)
      t.position.set(tx, WALL_H - 0.3, MZS - 0.7); t.castShadow = false
      t.target.position.set(tx, 1.25, MZS - 0.05); scene.add(t); scene.add(t.target)
    })
  // Dragonfly Touches Water spotlight
  const dX = (LX0 + STEP_X) / 2 - 0.2
  const dL = new THREE.SpotLight(0xfff0d0, 2.2, 8, Math.PI / 5.8, 0.32, 1.4)
  dL.position.set(dX, WALL_H - 0.3, LZS - 0.7); dL.castShadow = false
  dL.target.position.set(dX, 1.55, LZS - 0.05); scene.add(dL); scene.add(dL.target)
    // Rohen Jones spotlights
    ;[MX0 + 2.8, MX0 + 5.2].forEach(rX => {
      const rL = new THREE.SpotLight(0xfff0d0, 2.0, 8, Math.PI / 5.8, 0.32, 1.35)
      rL.position.set(rX, WALL_H - 0.3, MZN + 0.7); rL.castShadow = false
      rL.target.position.set(rX, 1.75, MZN + 0.05); scene.add(rL); scene.add(rL.target)
    })
}

// Painting factories 
function addPainting(scene, rendererRef, x, y, z, ry, id, pw = 0.85, ph = 0.75) {
  const art = ARTWORKS.find(a => a.id === id) || ARTWORKS[0]
  const isLarge = ['1', '8'].includes(id)
  const g = new THREE.Group()
  g.position.set(x, y, z); g.rotation.y = ry

  // Outer frame
  const frame = new THREE.Mesh(new THREE.BoxGeometry(pw + 0.07, ph + 0.07, 0.03), frmM)
  frame.castShadow = true; g.add(frame)

  // Mat (only for smaller works)
  if (!isLarge) {
    const mat = new THREE.Mesh(
      new THREE.BoxGeometry(pw + 0.008, ph + 0.008, 0.012),
      new THREE.MeshStandardMaterial({ color: 0x201810, roughness: 0.95 })
    )
    mat.position.z = 0.007; g.add(mat)
  }

  // Canvas surface
  const cw = isLarge ? pw + 0.01 : pw - 0.012
  const ch = isLarge ? ph + 0.01 : ph - 0.012
  const surfMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  })
  surfMat.map = getTexture(id, pw, ph, rendererRef)
  surfMat.needsUpdate = true
  const surf = new THREE.Mesh(new THREE.BoxGeometry(cw, ch, 0.018), surfMat)
  surf.position.z = 0.016; g.add(surf)

  g.userData = { isPainting: true, artworkId: id, ...art }
  scene.add(g)
  return g
}

function addGlove(scene, rendererRef, x, y, z, ry, id) {
  const art = ARTWORKS.find(a => a.id === id) || ARTWORKS[0]
  const g = new THREE.Group()
  g.position.set(x, y, z); g.rotation.y = ry

  // White backing panel
  g.add(new THREE.Mesh(
    new THREE.BoxGeometry(2.0, 1.2, 0.01),
    new THREE.MeshStandardMaterial({ color: 0xf0f0ee, roughness: 0.95 })
  ))
  // Artwork image on panel
  const artMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
  artMat.map = getTexture(id, 1.9, 1.1, rendererRef)
  artMat.needsUpdate = true
  const artPanel = new THREE.Mesh(new THREE.BoxGeometry(1.9, 1.1, 0.012), artMat)
  artPanel.position.z = -0.008; g.add(artPanel)

  // Decorative glove strips
  const gc = [0x555555, 0xcc88aa, 0x3366aa, 0x4488bb, 0x222222, 0xaa6644]
  for (let i = 0; i < 10; i++) {
    const gp = new THREE.Mesh(
      new THREE.BoxGeometry(0.10, 0.16, 0.014),
      new THREE.MeshStandardMaterial({ color: gc[i % gc.length], roughness: 0.85 })
    )
    gp.position.set((Math.random() - 0.5) * 1.6, (Math.random() - 0.5) * 0.8, 0.016)
    gp.rotation.z = (Math.random() - 0.5) * 0.7
    g.add(gp)
  }

  g.userData = { isPainting: true, artworkId: id, ...art }
  scene.add(g)
  return g
}

// Painting placement 
function placePaintings(scene, rendererRef) {
  const WO = 0.08, EH = 1.85
  const P = (x, y, z, ry, id, pw, ph) => addPainting(scene, rendererRef, x, y, z, ry, id, pw, ph)
  const G = (x, y, z, ry, id) => addGlove(scene, rendererRef, x, y, z, ry, id)

  return [
    P(LX0 + WO, 2.08, lCZ, Math.PI / 2, '1', 4.95, 2.78),
    P(CAS_X + CAS_W / 2 - WO, EH - 0.5, CAS_Z, -Math.PI / 2, '2a', 0.6, 0.6),
    P(MX0 + 1.0, EH, MZN + WO, 0, '3a', 1.18, 0.68),
    P(MX0 + 4.2, EH, MZN + WO, 0, '3b', 3.4, 2.9),
    P((BTH_X0 + BTH_X1) / 2, EH, BTH_ZN + 3.55, 0, '3c', 0.65, 0.95),
    G(BTH_X0 - 1.8, EH, MZN + 1.8, Math.PI * 0.78, '4'),
    P(STEP_X + 1.55, 1.45, MZS - WO, Math.PI, '5a', 2.35, 1.78),
    P(STEP_X + 4.55, EH, MZS - WO, Math.PI, '6b', 0.78, 0.65),
    P(STEP_X + 6.55, EH, MZS - WO, Math.PI, '5b', 1.0, 1.02),
    P(STEP_X + 8.55, EH, MZS - WO, Math.PI, '7a', 0.88, 1.16),
    P(STEP_X + 10.35, EH, MZS - WO, Math.PI, '7b', 0.88, 1.16),
    P(STEP_X + 12.15, EH, MZS - WO, Math.PI, '7c', 0.90, 1.24),
    P(STEP_X + 13.85, EH, MZS - WO, Math.PI, '7d', 0.76, 1.42),
    P((LX0 + STEP_X) / 2 - 0.2, EH, LZS - WO, Math.PI, '6a', 1.7, 0.88),
    P(DIV_X - 0.15, 2.02, mCZ + 1.5, -Math.PI / 2, '8', 3.1, 2.4),
  ]
}

// ════════════════════════════════════════════════════════════════
// HOOK
// ════════════════════════════════════════════════════════════════
export function useGallery(canvasRef, controlsRef) {
  const cameraRef = useRef(null)
  const rendererRef = useRef(null)
  const paintingsRef = useRef([])
  const rafRef = useRef(null)

  const [nearbyArt, setNearbyArt] = useState(null)
  const [isReady, setIsReady] = useState(false)

  const vecDir = useRef(new THREE.Vector3())
  const vecRight = useRef(new THREE.Vector3())
  const vecUp = useRef(new THREE.Vector3(0, 1, 0))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let mounted = true

    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0d0b08)
    scene.fog = new THREE.FogExp2(0x0d0b08, 0.026)

    // Camera
    const camera = new THREE.PerspectiveCamera(68, window.innerWidth / window.innerHeight, 0.1, 80)
    camera.position.set(LX0 + 1.5, 1.65, lCZ + 1.0)
    cameraRef.current = camera

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    rendererRef.current = renderer

    // Build world
    buildGeometry(scene)
    buildLights(scene)
    paintingsRef.current = placePaintings(scene, rendererRef)

    let readyFrame = null
    readyFrame = requestAnimationFrame(() => {
      if (mounted) setIsReady(true)
    })

    // Resize
    const onResize = () => {
      if (!mounted) return
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    // Animation loop
    function tick() {
      rafRef.current = requestAnimationFrame(tick)
      const ctrl = controlsRef.current
      if (!ctrl || !mounted) return

      camera.quaternion.setFromEuler(new THREE.Euler(ctrl.pitch, ctrl.yaw, 0, 'YXZ'))

      camera.getWorldDirection(vecDir.current)
      vecDir.current.y = 0
      vecDir.current.normalize()
      vecRight.current.crossVectors(vecDir.current, vecUp.current).normalize()

      const { keys, speed } = ctrl
      if (keys['ArrowUp'] || keys['KeyW']) camera.position.addScaledVector(vecDir.current, speed)
      if (keys['ArrowDown'] || keys['KeyS']) camera.position.addScaledVector(vecDir.current, -speed)
      if (keys['ArrowLeft'] || keys['KeyA']) camera.position.addScaledVector(vecRight.current, -speed)
      if (keys['ArrowRight'] || keys['KeyD']) camera.position.addScaledVector(vecRight.current, speed)

      resolveCollisions(camera.position)

      // Proximity info
      let closest = null, minD = 2.8
      for (const p of paintingsRef.current) {
        const d = camera.position.distanceTo(p.position)
        if (d < minD) { minD = d; closest = p }
      }
      if (mounted) setNearbyArt(closest ? closest.userData : null)

      renderer.render(scene, camera)
    }
    tick()

    return () => {
      mounted = false
      cancelAnimationFrame(rafRef.current)
      if (readyFrame) cancelAnimationFrame(readyFrame)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return { nearbyArt, cameraRef, paintingsRef, isReady }
}
