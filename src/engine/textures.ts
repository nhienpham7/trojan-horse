import * as THREE from 'three'
import type { ExhibitionConfig } from './types'

const cache = new Map<string, THREE.CanvasTexture>()

function setColorSpace(tex: THREE.Texture): void {
  if (THREE.SRGBColorSpace !== undefined) tex.colorSpace = THREE.SRGBColorSpace
}

export function getTexture(
  config: ExhibitionConfig,
  id: string,
  pw = 1,
  ph = 1,
  rendererRef?: React.MutableRefObject<THREE.WebGLRenderer | null>
): THREE.CanvasTexture {
  const slug = config.meta.slug
  const key = `${slug}:${id}:${pw.toFixed(3)}:${ph.toFixed(3)}`
  const cached = cache.get(key)
  if (cached) return cached

  const SIZE = 1024
  const aspect = Math.max(0.25, pw / ph)
  const cw = Math.round(SIZE * Math.max(1, aspect))
  const ch = Math.round(SIZE * Math.max(1, 1 / aspect))

  const cv = document.createElement('canvas')
  cv.width = cw
  cv.height = ch
  const ctx = cv.getContext('2d')!

  config.procedural(id, ctx, Math.min(cw, ch), config.palette)

  const tex = new THREE.CanvasTexture(cv)
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.magFilter = THREE.LinearFilter
  if (rendererRef?.current) {
    tex.anisotropy = rendererRef.current.capabilities.getMaxAnisotropy()
  }
  tex.needsUpdate = true
  setColorSpace(tex)
  cache.set(key, tex)

  const art = config.artworks.find((a) => a.id === id)
  const url = art?.imageUrl
  if (url) {
    const img = new Image()
    img.onload = () => {
      ctx.clearRect(0, 0, cw, ch)
      ctx.fillStyle = '#f5f0e8'
      ctx.fillRect(0, 0, cw, ch)

      const isFitted = art?.fit === 'contain'
      const scale = isFitted
        ? Math.min(cw / img.width, ch / img.height)
        : Math.max(cw / img.width, ch / img.height)
      const dw = img.width * scale
      const dh = img.height * scale
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh)
      tex.needsUpdate = true
    }
    img.onerror = () => {}
    img.src = url
  }

  return tex
}

export function getTextureDataURL(slug: string, id: string): string | null {
  for (const [key, tex] of cache.entries()) {
    if (key.startsWith(`${slug}:${id}:`)) {
      const source = tex.source as { data?: HTMLCanvasElement }
      const data = source.data
      if (data && typeof data.toDataURL === 'function') {
        return data.toDataURL()
      }
    }
  }
  return null
}
