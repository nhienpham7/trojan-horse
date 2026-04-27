import { useEffect, useState, useRef } from 'react'
import { getTexture } from '../lib/textureLoader.js'
import './ArtworkModal.css'

export default function ArtworkModal({ artwork, onClose }) {
  // Close on backdrop click or Escape (Escape is handled in useGallery too)
  useEffect(() => {
    const handler = (e) => { if (e.code === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!artwork) return null

  // Pull the canvas texture and render it as an <img>
  const tex = getTexture(artwork.artworkId || artwork.id)
  const imgSrc = tex?.source?.data?.toDataURL?.() ?? null

  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })

  const handleWheel = (e) => {
    const zoomFactor = -e.deltaY * 0.002
    setScale(s => Math.min(Math.max(0.5, s + zoomFactor), 5))
  }

  const handleMouseDown = (e) => {
    if (e.button !== 0) return // only left click
    setIsDragging(true)
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y }
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  return (
    <div className="artwork-modal" onClick={onClose}>
      <div className="artwork-modal__panel" onClick={(e) => e.stopPropagation()}>
        <button className="artwork-modal__close" onClick={onClose} aria-label="Close">✕</button>

        <div 
          className="artwork-modal__image-wrap"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ cursor: isDragging ? 'grabbing' : 'grab', overflow: 'hidden', position: 'relative' }}
        >
          {imgSrc
            ? <img 
                src={imgSrc} 
                alt={artwork.title} 
                className="artwork-modal__image" 
                draggable={false}
                style={{ 
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`, 
                  transition: isDragging ? 'none' : 'transform 0.1s ease-out' 
                }} 
              />
            : <div className="artwork-modal__placeholder" style={{ background: `#${(artwork.color || 0x888888).toString(16).padStart(6, '0')}` }} />
          }
          <div className="artwork-modal__hint" style={{ position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.5)', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', pointerEvents: 'none' }}>
            Scroll to zoom • Drag to pan
          </div>
        </div>

        <div className="artwork-modal__meta">
          <p className="artwork-modal__artist">{artwork.artist}</p>
          <h2 className="artwork-modal__title">{artwork.title}</h2>
          <div className="artwork-modal__divider" />
          <p className="artwork-modal__medium">{artwork.medium}</p>
          <p className="artwork-modal__price">{artwork.price}</p>
        </div>
      </div>
    </div>
  )
}
