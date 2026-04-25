import './PaintingInfo.css'

export default function PaintingInfo({ artwork }) {
  return (
    <div className={`painting-info${artwork ? ' show' : ''}`}>
      <h3 className="painting-info__title">{artwork?.title  || '—'}</h3>
      <p  className="painting-info__medium">{artwork?.medium || '—'}</p>
      <p  className="painting-info__artist">{artwork?.artist || ''}</p>
      <p  className="painting-info__price">{artwork?.price  || ''}</p>
      {artwork && <p className="painting-info__hint">Press <kbd>E</kbd> to inspect</p>}
    </div>
  )
}
