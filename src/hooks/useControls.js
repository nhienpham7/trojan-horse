import { useEffect, useRef } from 'react'

/**
 * useControls — keyboard / mouse / touch input for first-person navigation.
 * Returns a ref object whose `.current` always has the latest state,
 * so it can be read inside a rAF loop without stale closures.
 */
export function useControls() {
  const state = useRef({
    keys:     {},
    yaw:      0,
    pitch:    0,
    speed:    0.065,
    dragging: false,
    lastX:    0,
    lastY:    0,
    touching: false,
    touchX:   0,
    touchY:   0,
  })

  useEffect(() => {
    const s = state.current

    const onKeyDown = (e) => {
      s.keys[e.code] = true
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code))
        e.preventDefault()
    }
    const onKeyUp   = (e) => { s.keys[e.code] = false }

    const onMouseDown = (e) => { s.dragging = true; s.lastX = e.clientX; s.lastY = e.clientY }
    const onMouseUp   = ()  => { s.dragging = false }
    const onMouseMove = (e) => {
      if (!s.dragging) return
      s.yaw   -= (e.clientX - s.lastX) * 0.0025
      s.pitch -= (e.clientY - s.lastY) * 0.0025
      s.pitch  = Math.max(-1.1, Math.min(1.1, s.pitch))
      s.lastX  = e.clientX
      s.lastY  = e.clientY
    }

    const onWheel = (e) => {
      s.speed = Math.max(0.02, Math.min(0.25, s.speed - e.deltaY * 0.0001))
    }

    const onTouchStart = (e) => {
      s.touching = true
      s.touchX   = e.touches[0].clientX
      s.touchY   = e.touches[0].clientY
    }
    const onTouchMove = (e) => {
      if (!s.touching) return
      s.yaw   -= (e.touches[0].clientX - s.touchX) * 0.004
      s.pitch -= (e.touches[0].clientY - s.touchY) * 0.004
      s.pitch  = Math.max(-1.1, Math.min(1.1, s.pitch))
      s.touchX = e.touches[0].clientX
      s.touchY = e.touches[0].clientY
    }
    const onTouchEnd  = () => { s.touching = false }

    window.addEventListener('keydown',     onKeyDown)
    window.addEventListener('keyup',       onKeyUp)
    window.addEventListener('mousedown',   onMouseDown)
    window.addEventListener('mouseup',     onMouseUp)
    window.addEventListener('mousemove',   onMouseMove)
    window.addEventListener('wheel',       onWheel,       { passive: true })
    window.addEventListener('touchstart',  onTouchStart,  { passive: true })
    window.addEventListener('touchmove',   onTouchMove,   { passive: true })
    window.addEventListener('touchend',    onTouchEnd)

    return () => {
      window.removeEventListener('keydown',    onKeyDown)
      window.removeEventListener('keyup',      onKeyUp)
      window.removeEventListener('mousedown',  onMouseDown)
      window.removeEventListener('mouseup',    onMouseUp)
      window.removeEventListener('mousemove',  onMouseMove)
      window.removeEventListener('wheel',      onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove',  onTouchMove)
      window.removeEventListener('touchend',   onTouchEnd)
    }
  }, [])

  return state
}
