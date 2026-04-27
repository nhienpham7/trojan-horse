import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import type { ExhibitionConfig } from './types'
import type { ControlsRef } from './controls'
import type { PaintingUserData } from './scene/buildPaintings'
import { buildRoom } from './scene/buildRoom'
import { buildLights } from './scene/buildLights'
import { buildPaintings } from './scene/buildPaintings'
import { buildCollisionWorld, resolveCollisions } from './collision'

export type GalleryHandle = {
  nearbyArt: PaintingUserData | null
  focusedArt: PaintingUserData | null
  closeFocus: () => void
  cameraRef: React.MutableRefObject<THREE.PerspectiveCamera | null>
  paintingsRef: React.MutableRefObject<THREE.Group[]>
  isReady: boolean
}

export function useGallery(
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
  controlsRef: ControlsRef,
  config: ExhibitionConfig
): GalleryHandle {
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const paintingsRef = useRef<THREE.Group[]>([])
  const rafRef = useRef<number | null>(null)
  const nearbyRef = useRef<PaintingUserData | null>(null)

  const [nearbyArt, setNearbyArt] = useState<PaintingUserData | null>(null)
  const [focusedArt, setFocusedArt] = useState<PaintingUserData | null>(null)
  const [isReady, setIsReady] = useState(false)

  const closeFocus = () => setFocusedArt(null)

  const vecDir = useRef(new THREE.Vector3())
  const vecRight = useRef(new THREE.Vector3())
  const vecUp = useRef(new THREE.Vector3(0, 1, 0))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let mounted = true
    const plan = config.floorPlan

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0d0b08)
    scene.fog = new THREE.FogExp2(0x0d0b08, 0.026)

    const camera = new THREE.PerspectiveCamera(
      68,
      window.innerWidth / window.innerHeight,
      0.1,
      80
    )
    camera.position.set(plan.spawn.position[0], plan.spawn.position[1], plan.spawn.position[2])
    cameraRef.current = camera
    if (controlsRef.current) {
      controlsRef.current.yaw = plan.spawn.yaw
    }

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    rendererRef.current = renderer

    buildRoom(scene, plan)
    buildLights(scene, config.lights, plan)
    paintingsRef.current = buildPaintings(scene, config, rendererRef)

    const collisionWorld = buildCollisionWorld(plan)

    const readyFrame = requestAnimationFrame(() => {
      if (mounted) setIsReady(true)
    })

    const onResize = () => {
      if (!mounted) return
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyE' && nearbyRef.current) {
        setFocusedArt(nearbyRef.current)
      }
      if (e.code === 'Escape') {
        setFocusedArt(null)
      }
    }
    window.addEventListener('keydown', onKeyDown)

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

      resolveCollisions(collisionWorld, camera.position)

      let closest: THREE.Group | null = null
      let minD = 2.8
      for (const p of paintingsRef.current) {
        const d = camera.position.distanceTo(p.position)
        if (d < minD) {
          minD = d
          closest = p
        }
      }
      const nextNearby = (closest?.userData as PaintingUserData | undefined) ?? null
      if (nearbyRef.current !== nextNearby) {
        nearbyRef.current = nextNearby
        setNearbyArt(nextNearby)
      }

      renderer.render(scene, camera)
    }
    tick()

    return () => {
      mounted = false
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      cancelAnimationFrame(readyFrame)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('keydown', onKeyDown)
      renderer.dispose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { nearbyArt, focusedArt, closeFocus, cameraRef, paintingsRef, isReady }
}
