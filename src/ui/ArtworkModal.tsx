import { useEffect } from 'react'
import type { Artwork, ExhibitionConfig } from '../engine/types'
import { getTextureDataURL } from '../engine/textures'
import './ArtworkModal.css'

type Props = {
  artwork: Artwork
  config: ExhibitionConfig
  onClose: () => void
}

export default function ArtworkModal({ artwork, config, onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const imgSrc = getTextureDataURL(config.meta.slug, artwork.id)

  return (
    <div className="artwork-modal" onClick={onClose}>
      <div className="artwork-modal__panel" onClick={(e) => e.stopPropagation()}>
        <button className="artwork-modal__close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className="artwork-modal__image-wrap">
          {imgSrc ? (
            <img src={imgSrc} alt={artwork.title} className="artwork-modal__image" />
          ) : (
            <div
              className="artwork-modal__placeholder"
              style={{ background: `#${(artwork.color || 0x888888).toString(16).padStart(6, '0')}` }}
            />
          )}
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
