import { useRef } from 'react'
import type { ExhibitionConfig } from '../engine/types'
import { useControls } from '../engine/controls'
import { useGallery } from '../engine/useGallery'
import HUD from './HUD'
import Minimap from './Minimap'
import PaintingInfo from './PaintingInfo'
import ArtworkModal from './ArtworkModal'
import LoadingScreen from './LoadingScreen'
import './Gallery.css'

type Props = {
  visible: boolean
  config: ExhibitionConfig
}

export default function Gallery({ visible, config }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const controlsRef = useControls()
  const { nearbyArt, focusedArt, closeFocus, cameraRef, paintingsRef, isReady } = useGallery(
    canvasRef,
    controlsRef,
    config
  )

  return (
    <>
      <div className={`gallery${visible ? ' visible' : ''}`}>
        <canvas ref={canvasRef} />
      </div>

      {visible && !isReady && (
        <LoadingScreen glyph={config.meta.preloaderGlyph} text="Preparing the exhibition…" />
      )}

      {visible && isReady && (
        <>
          <HUD meta={config.meta} />
          <Minimap floorPlan={config.floorPlan} cameraRef={cameraRef} paintingsRef={paintingsRef} />
          <PaintingInfo artwork={nearbyArt} />
        </>
      )}

      {focusedArt && <ArtworkModal artwork={focusedArt} config={config} onClose={closeFocus} />}
    </>
  )
}
