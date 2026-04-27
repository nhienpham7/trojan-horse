import type { ExhibitionMeta } from '../engine/types'
import './HUD.css'

type Props = { meta: ExhibitionMeta }

export default function HUD({ meta }: Props) {
  const subtitle = meta.subtitleLines[0] ?? ''
  return (
    <>
      <div className="hud">
        <div className="hud-title">
          <span>{subtitle}</span>
          <strong>{meta.title}</strong>
        </div>
      </div>
      <div className="hud-controls">
        W A S D / ↑↓←→ &nbsp; Move<br />
        Click &amp; Drag &nbsp; Look<br />
        Scroll &nbsp; Speed<br />
        E &nbsp; Inspect artwork
      </div>
    </>
  )
}
