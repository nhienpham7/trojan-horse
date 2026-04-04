export default function PaintingInfo({ painting }) {
  return (
    <div className={`painting-info ${painting ? "show" : ""}`}>
      <h3>{painting?.title ?? "—"}</h3>
      <p>{painting?.medium ?? "—"}</p>
    </div>
  );
}