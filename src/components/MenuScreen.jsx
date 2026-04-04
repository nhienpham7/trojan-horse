export default function MenuScreen({ onEnter, hidden }) {
  return (
    <div className={`menu-screen ${hidden ? "hidden" : ""}`}>
      <div className="menu-inner">
        

        <h1 className="menu-title">
          The Trojan Horses
          <em></em>
        </h1>

        <div className="divider">
          <div className="divider-diamond" />
        </div>

        <p className="menu-desc">
          A space devoted to the study,<br />
          preservation, and contemplation<br />
          of Asian artistic traditions.
        </p>

        <p className="address">3217 S Morgan St · Chicago</p>

        <button className="enter-btn" onClick={onEnter}>
          Enter Gallery
        </button>
      </div>
    </div>
  );
}