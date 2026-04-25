import { useRef } from 'react'
import '../styles/Gallery.css'
import { useControls }   from '../hooks/useControls.js'
import { useGallery }    from '../hooks/useGallery.js'
import HUD           from './HUD.jsx'
import Minimap       from './Minimap.jsx'
import PaintingInfo  from './PaintingInfo.jsx'
import ArtworkModal  from './ArtworkModal.jsx'
import LoadingScreen from './LoadingScreen.jsx'

export default function Gallery({ visible }) {
  const canvasRef   = useRef(null)
  const controlsRef = useControls()
  const { nearbyArt, focusedArt, closeFocus, cameraRef, paintingsRef, isReady } =
    useGallery(canvasRef, controlsRef)

  return (
    <>
      {/* Canvas is always mounted so Three.js can init immediately */}
      <div className={`gallery${visible ? ' visible' : ''}`}>
        <canvas ref={canvasRef} />
      </div>

      {/* Loading spinner shown while Three.js sets up */}
      {visible && !isReady && <LoadingScreen />}

      {/* HUD overlays — only once gallery is entered */}
      {visible && isReady && (
        <>
          <HUD />
          <Minimap cameraRef={cameraRef} paintingsRef={paintingsRef} />
          <PaintingInfo artwork={nearbyArt} />
        </>
      )}

      {/* Artwork detail modal — triggered by pressing E near a painting */}
      {focusedArt && <ArtworkModal artwork={focusedArt} onClose={closeFocus} />}
    </>
  )
}
