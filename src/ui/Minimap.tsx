import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import type { FloorPlan } from '../engine/types'
import './Minimap.css'

const MMW = 240
const MMH = 100

type Props = {
  floorPlan: FloorPlan
  cameraRef: React.MutableRefObject<THREE.PerspectiveCamera | null>
  paintingsRef: React.MutableRefObject<THREE.Group[]>
}

export default function Minimap({ floorPlan, cameraRef, paintingsRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    let rafId = 0

    const { x0: BX0, x1: BX1, z0: BZ0, z1: BZ1 } = floorPlan.bounds
    const SC = Math.min((MMW - 16) / (BX1 - BX0), (MMH - 16) / (BZ1 - BZ0))
    const OX = 8
    const OY = 8

    const w2mm = (wx: number, wz: number): [number, number] => [
      OX + (wx - BX0) * SC,
      OY + (wz - BZ0) * SC,
    ]

    const strokeRect = (
      ctx: CanvasRenderingContext2D,
      x0: number,
      z0: number,
      x1: number,
      z1: number
    ) => {
      const [px0, py0] = w2mm(x0, z0)
      const [px1, py1] = w2mm(x1, z1)
      ctx.strokeRect(px0, py0, px1 - px0, py1 - py0)
    }

    function draw() {
      rafId = requestAnimationFrame(draw)
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const camera = cameraRef.current
      const paintings = paintingsRef.current ?? []

      ctx.fillStyle = 'rgba(13,11,8,.96)'
      ctx.fillRect(0, 0, MMW, MMH)

      ctx.fillStyle = 'rgba(40,32,22,0.8)'
      ctx.beginPath()
      const polygon = floorPlan.minimapPolygon
      if (polygon && polygon.length > 0) {
        polygon.forEach(([wx, wz], i) => {
          const [x, y] = w2mm(wx, wz)
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        })
        ctx.closePath()
        ctx.fill()
      } else {
        for (const r of floorPlan.rooms) {
          const [x0, y0] = w2mm(r.x0, r.z0)
          const [x1, y1] = w2mm(r.x1, r.z1)
          ctx.fillRect(x0, y0, x1 - x0, y1 - y0)
        }
      }

      ctx.strokeStyle = 'rgba(201,168,76,.6)'
      ctx.lineWidth = 1
      for (const r of floorPlan.rooms) {
        strokeRect(ctx, r.x0, r.z0, r.x1, r.z1)
      }

      for (const d of floorPlan.diagWalls ?? []) {
        const [x0, y0] = w2mm(d.x0, d.z0)
        const [x1, y1] = w2mm(d.x1, d.z1)
        ctx.beginPath()
        ctx.moveTo(x0, y0)
        ctx.lineTo(x1, y1)
        ctx.stroke()
      }

      ctx.fillStyle = 'rgba(201,168,76,.45)'
      paintings.forEach((p) => {
        const [px, py] = w2mm(p.position.x, p.position.z)
        ctx.beginPath()
        ctx.arc(px, py, 1.8, 0, Math.PI * 2)
        ctx.fill()
      })

      if (!camera) return
      const [cpx, cpy] = w2mm(camera.position.x, camera.position.z)
      const angle = Math.atan2(-camera.quaternion.y, camera.quaternion.w) * 2
      ctx.strokeStyle = 'rgba(201,168,76,.9)'
      ctx.lineWidth = 0.8
      ctx.beginPath()
      ctx.moveTo(cpx, cpy)
      ctx.lineTo(cpx + Math.sin(-angle) * 9, cpy + Math.cos(-angle) * 9)
      ctx.stroke()
      ctx.fillStyle = '#c9a84c'
      ctx.beginPath()
      ctx.arc(cpx, cpy, 2.5, 0, Math.PI * 2)
      ctx.fill()
    }

    draw()
    return () => cancelAnimationFrame(rafId)
  }, [cameraRef, paintingsRef, floorPlan])

  return (
    <div className="minimap">
      <canvas ref={canvasRef} width={MMW} height={MMH} />
      <p className="minimap-label">Floor Plan</p>
    </div>
  )
}
