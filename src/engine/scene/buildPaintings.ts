import * as THREE from 'three'
import type { Artwork, ExhibitionConfig, Placement } from '../types'
import { MAT } from './materials'
import { getTexture } from '../textures'

export type PaintingMesh = THREE.Group & { userData: PaintingUserData }
export type PaintingUserData = {
  isPainting: true
  artworkId: string
} & Artwork

function findArtwork(artworks: Artwork[], id: string): Artwork {
  return artworks.find((a) => a.id === id) ?? artworks[0]
}

function addPainting(
  scene: THREE.Scene,
  config: ExhibitionConfig,
  rendererRef: React.MutableRefObject<THREE.WebGLRenderer | null>,
  p: Placement
): THREE.Group {
  const art = findArtwork(config.artworks, p.artworkId)
  const isFitted = art.fit === 'contain'
  const pw = p.width
  const ph = p.height

  const g = new THREE.Group()
  g.position.set(p.position[0], p.position[1], p.position[2])
  g.rotation.y = p.rotationY

  const frame = new THREE.Mesh(new THREE.BoxGeometry(pw + 0.07, ph + 0.07, 0.03), MAT.frame)
  frame.castShadow = true
  g.add(frame)

  if (!isFitted) {
    const matBoard = new THREE.Mesh(
      new THREE.BoxGeometry(pw + 0.008, ph + 0.008, 0.012),
      new THREE.MeshStandardMaterial({ color: 0x201810, roughness: 0.95 })
    )
    matBoard.position.z = 0.007
    g.add(matBoard)
  }

  const cw = isFitted ? pw + 0.01 : pw - 0.012
  const ch = isFitted ? ph + 0.01 : ph - 0.012

  const surfMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  })
  surfMat.map = getTexture(config, art.id, pw, ph, rendererRef)
  surfMat.needsUpdate = true

  const surf = new THREE.Mesh(new THREE.BoxGeometry(cw, ch, 0.018), surfMat)
  surf.position.z = 0.016
  g.add(surf)

  const userData: PaintingUserData = {
    isPainting: true,
    artworkId: art.id,
    ...art,
  }
  g.userData = userData

  scene.add(g)
  return g
}

function addGlove(
  scene: THREE.Scene,
  config: ExhibitionConfig,
  rendererRef: React.MutableRefObject<THREE.WebGLRenderer | null>,
  p: Placement
): THREE.Group {
  const art = findArtwork(config.artworks, p.artworkId)
  const g = new THREE.Group()
  g.position.set(p.position[0], p.position[1], p.position[2])
  g.rotation.y = p.rotationY

  g.add(
    new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 1.2, 0.01),
      new THREE.MeshStandardMaterial({ color: 0xf0f0ee, roughness: 0.95 })
    )
  )

  const artMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
  artMat.map = getTexture(config, art.id, 1.9, 1.1, rendererRef)
  artMat.needsUpdate = true
  const artPanel = new THREE.Mesh(new THREE.BoxGeometry(1.9, 1.1, 0.012), artMat)
  artPanel.position.z = -0.008
  g.add(artPanel)

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

  const userData: PaintingUserData = {
    isPainting: true,
    artworkId: art.id,
    ...art,
  }
  g.userData = userData

  scene.add(g)
  return g
}

export function buildPaintings(
  scene: THREE.Scene,
  config: ExhibitionConfig,
  rendererRef: React.MutableRefObject<THREE.WebGLRenderer | null>
): THREE.Group[] {
  return config.placements.map((p) =>
    p.kind === 'glove'
      ? addGlove(scene, config, rendererRef, p)
      : addPainting(scene, config, rendererRef, p)
  )
}
