import './LoadingScreen.css'

export default function LoadingScreen() {
  return (
    <div className="loading">
      <div className="loading__seal">
        <div className="loading__ring" />
        <span>𝕋</span>
      </div>
      <p className="loading__text">Preparing the exhibition…</p>
    </div>
  )
}
