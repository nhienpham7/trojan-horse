import { useEffect, useRef } from "react";
import { MAIN_W, MAIN_D, OFF_W, OFF_D, mZ, oZ, offX, centreZ } from "../lib/floorPlan";

const MM_W     = 160;
const MM_H     = 240;
const MM_SCALE = 10;
const MM_OX    = MM_W / 2;
const MM_OY    = MM_H - 20;

export default function Minimap({ visible, cameraRef, paintingsRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    let frameId;
    const ctx = canvasRef.current.getContext("2d");

    const draw = () => {
      frameId = requestAnimationFrame(draw);
      const cam      = cameraRef?.current;
      const paintings = paintingsRef?.current ?? [];

      ctx.fillStyle = "rgba(13,11,8,0.95)";
      ctx.fillRect(0, 0, MM_W, MM_H);

      ctx.strokeStyle = "rgba(201,168,76,0.5)";
      ctx.lineWidth   = 1;

      // Main body
      ctx.strokeRect(
        MM_OX - (MAIN_W / 2) * MM_SCALE,
        MM_OY - (mZ - centreZ + MAIN_D / 2) * MM_SCALE,
        MAIN_W * MM_SCALE,
        MAIN_D * MM_SCALE
      );

      // Office
      ctx.strokeRect(
        MM_OX + (offX - OFF_W / 2) * MM_SCALE,
        MM_OY - (oZ - centreZ + OFF_D / 2) * MM_SCALE,
        OFF_W * MM_SCALE,
        OFF_D * MM_SCALE
      );

      if (!cam) return;

      const cpx = MM_OX + cam.position.x * MM_SCALE;
      const cpy = MM_OY - (cam.position.z - centreZ) * MM_SCALE;
      const camYaw = Math.atan2(
        -(cam.quaternion.y),
        cam.quaternion.w
      ) * 2;

      // Direction arrow
      ctx.strokeStyle = "rgba(201,168,76,0.8)";
      ctx.lineWidth   = 0.8;
      ctx.beginPath();
      ctx.moveTo(cpx, cpy);
      ctx.lineTo(cpx + Math.sin(-camYaw) * 10, cpy - Math.cos(-camYaw) * 10);
      ctx.stroke();

      // Camera dot
      ctx.fillStyle = "#c9a84c";
      ctx.beginPath();
      ctx.arc(cpx, cpy, 3, 0, Math.PI * 2);
      ctx.fill();

      // Painting dots
      ctx.fillStyle = "rgba(201,168,76,0.35)";
      paintings.forEach((p) => {
        const px = MM_OX + p.position.x * MM_SCALE;
        const py = MM_OY - (p.position.z - centreZ) * MM_SCALE;
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    draw();
    return () => cancelAnimationFrame(frameId);
  }, [cameraRef, paintingsRef]);

  return (
    <div className={`minimap ${visible ? "visible" : ""}`}>
      <canvas ref={canvasRef} width={MM_W} height={MM_H} />
      <div className="minimap-label">Floor Plan</div>
    </div>
  );
}