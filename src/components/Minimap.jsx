import { useEffect, useRef } from 'react'
import './Minimap.css'
import {
  LX0, LX1, LZN, LZS,
  MX0, MX1, MZN, MZS,
  STEP_X,
  BTH_X0, BTH_X1, BTH_ZN, BTH_ZS,
  CAS_X, CAS_Z, CAS_W, CAS_D,
  DIV_X, DIV_ZN, DIV_ZS,
} from '../lib/floorPlan.js'

const MMW = 240, MMH = 100
const SC2 = Math.min((MMW - 16) / (MX1 - LX0), (MMH - 16) / (LZS - LZN))
const OX2 = 8, OY2 = 8

function w2mm(wx, wz) {
  return [OX2 + (wx - LX0) * SC2, OY2 + (wz - LZN) * SC2]
}

function strokeRect(ctx, x0, z0, x1, z1) {
  const [px0, py0] = w2mm(x0, z0)
  const [px1, py1] = w2mm(x1, z1)
  ctx.strokeRect(px0, py0, px1 - px0, py1 - py0)
}

export default function Minimap({ cameraRef, paintingsRef }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    let rafId
    function draw() {
      rafId = requestAnimationFrame(draw)
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      const camera   = cameraRef.current
      const paintings = paintingsRef.current || []

      ctx.fillStyle = 'rgba(13,11,8,.96)'
      ctx.fillRect(0, 0, MMW, MMH)

      // Building polygon
      ctx.fillStyle = 'rgba(40,32,22,0.8)'
      ctx.beginPath()
      const pts = [
        w2mm(LX0, LZN), w2mm(LX1, LZN), w2mm(MX0, MZN),
        w2mm(MX1, MZN), w2mm(MX1, MZS), w2mm(STEP_X, MZS),
        w2mm(STEP_X, LZS), w2mm(LX0, LZS),
      ]
      pts.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y))
      ctx.closePath(); ctx.fill()

      // Room outlines
      ctx.strokeStyle = 'rgba(201,168,76,.6)'; ctx.lineWidth = 1
      strokeRect(ctx, LX0, LZN, LX1, LZS)
      strokeRect(ctx, MX0, MZN, MX1, MZS)
      // Diagonal
      const [blx, blz] = w2mm(LX1, LZN)
      const [clx, clz] = w2mm(MX0, MZN)
      ctx.beginPath(); ctx.moveTo(blx, blz); ctx.lineTo(clx, clz); ctx.stroke()
      // Step
      const [sx0, sz0] = w2mm(STEP_X, MZS)
      const [sx1, sz1] = w2mm(STEP_X, LZS)
      ctx.beginPath(); ctx.moveTo(sx0, sz0); ctx.lineTo(sx1, sz1); ctx.stroke()

      // Bathroom
      ctx.strokeStyle = 'rgba(201,168,76,.35)'; ctx.lineWidth = 0.8
      strokeRect(ctx, BTH_X0, BTH_ZN, BTH_X1, BTH_ZS)

      // Casey box (dashed)
      ctx.setLineDash([2, 3])
      strokeRect(ctx, CAS_X-CAS_W/2, CAS_Z-CAS_D/2, CAS_X+CAS_W/2, CAS_Z+CAS_D/2)
      ctx.setLineDash([])

      // Divider wall
      ctx.strokeStyle = 'rgba(201,168,76,.4)'
      const [dx0, dz0] = w2mm(DIV_X, DIV_ZN)
      const [,     dz1] = w2mm(DIV_X, DIV_ZS)
      ctx.beginPath(); ctx.moveTo(dx0, dz0); ctx.lineTo(dx0, dz1); ctx.stroke()

      // Painting dots
      ctx.fillStyle = 'rgba(201,168,76,.45)'
      paintings.forEach(p => {
        const [px, py] = w2mm(p.position.x, p.position.z)
        ctx.beginPath(); ctx.arc(px, py, 1.8, 0, Math.PI * 2); ctx.fill()
      })

      // Player dot + direction arrow
      if (!camera) return
      const [cpx, cpy] = w2mm(camera.position.x, camera.position.z)
      const angle = Math.atan2(-camera.quaternion.y, camera.quaternion.w) * 2
      ctx.strokeStyle = 'rgba(201,168,76,.9)'; ctx.lineWidth = 0.8
      ctx.beginPath()
      ctx.moveTo(cpx, cpy)
      ctx.lineTo(cpx + Math.sin(-angle) * 9, cpy + Math.cos(-angle) * 9)
      ctx.stroke()
      ctx.fillStyle = '#c9a84c'
      ctx.beginPath(); ctx.arc(cpx, cpy, 2.5, 0, Math.PI * 2); ctx.fill()
    }
    draw()
    return () => cancelAnimationFrame(rafId)
  }, [cameraRef, paintingsRef])

  return (
    <div className="minimap">
      <canvas ref={canvasRef} width={MMW} height={MMH} />
      <p className="minimap-label">Floor Plan</p>
    </div>
  )
}
