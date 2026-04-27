import './LoadingScreen.css'

type Props = { glyph?: string; text?: string }

export default function LoadingScreen({ glyph = '◯', text = 'Preparing the exhibition…' }: Props) {
  return (
    <div className="loading">
      <div className="loading__seal">
        <div className="loading__ring" />
        <span>{glyph}</span>
      </div>
      <p className="loading__text">{text}</p>
    </div>
  )
}
