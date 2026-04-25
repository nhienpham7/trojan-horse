import './MenuScreen.css'

export default function MenuScreen({ onEnter }) {
  return (
    <div className="menu">
      <div className="menu__inner">
        <div className="menu__seal">
          <span>𝕋</span>
        </div>

        <h1 className="menu__title">
          The Trojan Horses
          <em>Art Exhibition · Chicago</em>
        </h1>

        <div className="menu__divider">
          <div className="menu__diamond" />
        </div>

        <p className="menu__desc">
          Magnus · Casey · Rohen Jones · Faye<br />
          Jonah · Winnie · Timothy Zhang · Isaac Ball
          <br /><br />
          <em>A group exhibition of emerging artists.</em>
        </p>

        <p className="menu__address">3217 S Morgan St · Chicago, IL</p>

        <button className="menu__enter" onClick={onEnter}>
          Enter Gallery
        </button>
      </div>
    </div>
  )
}
