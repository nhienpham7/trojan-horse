export default function HUD({ visible }) {
  return (
    <div className={`hud ${visible ? "visible" : ""}`}>
      <div className="hud-title">
        <span>Art Gallery</span>
        <strong>The Trojan Horses</strong>
      </div>
      <div className="controls-hint">
        ↑ ↓ ← → &nbsp; Move<br />
        Click &amp; Drag &nbsp; Look<br />
        Scroll &nbsp; Speed
      </div>
    </div>
  );
}