import { useEffect, useRef } from "react";
import * as THREE from "three";
import { resolveCollisions } from "../lib/collision";

export function useControls() {
  const keys      = useRef({});
  const yaw       = useRef(0);
  const pitch     = useRef(0);
  const dragging  = useRef(false);
  const lastPos   = useRef({ x: 0, y: 0 });
  const touch0    = useRef(null);
  const moveSpeed = useRef(0.06);

  useEffect(() => {
    const onKeyDown = (e) => {
      keys.current[e.code] = true;
      // Prevent arrow keys from scrolling the page
      if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.code)) {
        e.preventDefault();
      }
    };
    const onKeyUp   = (e) => { keys.current[e.code] = false; };

    const onMouseDown = (e) => {
      dragging.current = true;
      lastPos.current  = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp   = () => { dragging.current = false; };
    const onMouseMove = (e) => {
      if (!dragging.current) return;
      yaw.current   -= (e.clientX - lastPos.current.x) * 0.0025;
      pitch.current -= (e.clientY - lastPos.current.y) * 0.0025;
      pitch.current  = Math.max(-1.1, Math.min(1.1, pitch.current));
      lastPos.current = { x: e.clientX, y: e.clientY };
    };
    const onWheel = (e) => {
      moveSpeed.current = Math.max(0.02, Math.min(0.25, moveSpeed.current - e.deltaY * 0.0001));
    };

    const onTouchStart = (e) => {
      touch0.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchMove = (e) => {
      if (!touch0.current) return;
      yaw.current   -= (e.touches[0].clientX - touch0.current.x) * 0.004;
      pitch.current -= (e.touches[0].clientY - touch0.current.y) * 0.004;
      pitch.current  = Math.max(-1.1, Math.min(1.1, pitch.current));
      touch0.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    window.addEventListener("keydown",    onKeyDown);
    window.addEventListener("keyup",      onKeyUp);
    window.addEventListener("mousedown",  onMouseDown);
    window.addEventListener("mouseup",    onMouseUp);
    window.addEventListener("mousemove",  onMouseMove);
    window.addEventListener("wheel",      onWheel,      { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove",  onTouchMove,  { passive: true });

    return () => {
      window.removeEventListener("keydown",    onKeyDown);
      window.removeEventListener("keyup",      onKeyUp);
      window.removeEventListener("mousedown",  onMouseDown);
      window.removeEventListener("mouseup",    onMouseUp);
      window.removeEventListener("mousemove",  onMouseMove);
      window.removeEventListener("wheel",      onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove",  onTouchMove);
    };
  }, []);

  // Called every animation frame to update the camera
  function applyControls(camera) {
    const euler = new THREE.Euler(pitch.current, yaw.current, 0, "YXZ");
    camera.quaternion.setFromEuler(euler);

    const dir   = new THREE.Vector3();
    const right = new THREE.Vector3();
    camera.getWorldDirection(dir);
    dir.y = 0;
    dir.normalize();
    right.crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize();

    const sp = moveSpeed.current;
    if (keys.current["ArrowUp"]    || keys.current["KeyW"]) camera.position.addScaledVector(dir,   sp);
    if (keys.current["ArrowDown"]  || keys.current["KeyS"]) camera.position.addScaledVector(dir,  -sp);
    if (keys.current["ArrowLeft"]  || keys.current["KeyA"]) camera.position.addScaledVector(right, -sp);
    if (keys.current["ArrowRight"] || keys.current["KeyD"]) camera.position.addScaledVector(right,  sp);

    // Resolve wall collisions and lock eye height
    resolveCollisions(camera.position);
  }

  return { applyControls };
}