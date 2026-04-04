import { useRef } from "react";
import { useGallery } from "../hooks/useGallery";
import HUD from "./HUD";
import Minimap from "./Minimap";
import PaintingInfo from "./PaintingInfo";

export default function Gallery({ visible }) {
  const canvasRef = useRef(null);
  const { nearPainting, cameraRef, paintingsRef } = useGallery(canvasRef);

  return (
    <>
      <div className={`gallery-screen ${visible ? "visible" : ""}`}>
        <canvas ref={canvasRef} />
      </div>
      <HUD visible={visible} />
      <Minimap visible={visible} cameraRef={cameraRef} paintingsRef={paintingsRef} />
      <PaintingInfo painting={nearPainting} />
    </>
  );
}