import './HUD.css'

export default function HUD() {
  return (
    <div className="hud">
      <div className="hud-title">
        <span>Art Exhibition</span>
        <strong>The Trojan Horse</strong>
      </div>
      <div className="hud-controls">
        W A S D / ↑↓←→ &nbsp; Move<br />
        Click &amp; Drag &nbsp; Look<br />
        Scroll &nbsp; Speed<br />
        E &nbsp; Inspect artwork
      </div>
    </div>
  )
}
