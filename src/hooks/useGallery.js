import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { buildFloorPlan, buildLighting, buildPedestals, MAIN_W, MAIN_D, mZ } from "../lib/floorPlan";
import { artworks } from "../lib/artworks";
import { useControls } from "./useControls";
import { loadPaintingTexture } from "../lib/textureLoader";

const frameMat = new THREE.MeshStandardMaterial({
  color: 0x8b7240,
  roughness: 0.4,
  metalness: 0.3,
});

function buildPainting(scene, x, y, z, rotY, artData) {
  const w = 0.9 + Math.random() * 0.5;
  const h = 0.7 + Math.random() * 0.4;
  const group = new THREE.Group();
  group.position.set(x, y, z);
  group.rotation.y = rotY;

  // Frame
  group.add(
    Object.assign(new THREE.Mesh(new THREE.BoxGeometry(w + 0.1, h + 0.1, 0.04), frameMat), {
      castShadow: true,
    })
  );

  // Mount
  const mount = new THREE.Mesh(
    new THREE.BoxGeometry(w + 0.02, h + 0.02, 0.03),
    new THREE.MeshStandardMaterial({ color: 0xf5f0e0, roughness: 1 })
  );
  mount.position.z = 0.01;
  group.add(mount);

  // Canvas
  const canvasMat = new THREE.MeshStandardMaterial({ color: artData.color, roughness: 0.6 });
  const canvas = new THREE.Mesh(
    new THREE.BoxGeometry(w - 0.06, h - 0.06, 0.025),
    canvasMat
  );
  canvas.position.z = 0.02;
  group.add(canvas);

  // Load real texture async — swap material when ready
  loadPaintingTexture(artData._index ?? 0, (texture) => {
    canvasMat.map          = texture;
    canvasMat.color        = new THREE.Color(0xffffff);
    canvasMat.needsUpdate  = true;
  });

  // Accent mark
  const mark = new THREE.Mesh(
    new THREE.PlaneGeometry(w * 0.4, h * 0.4),
    new THREE.MeshStandardMaterial({
      color: artData.accent,
      roughness: 0.8,
      transparent: true,
      opacity: 0.7,
    })
  );
  mark.position.set(
    (Math.random() - 0.5) * w * 0.3,
    (Math.random() - 0.5) * h * 0.2,
    0.035
  );
  group.add(mark);

  // Red seal
  const seal = new THREE.Mesh(
    new THREE.PlaneGeometry(0.06, 0.06),
    new THREE.MeshStandardMaterial({ color: 0x8b2012, roughness: 0.5 })
  );
  seal.position.set(w * 0.35, -h * 0.32, 0.036);
  group.add(seal);

  group.userData = { isPainting: true, ...artData };
  scene.add(group);
  return group;
}

export function useGallery(canvasRef) {
  const [nearPainting, setNearPainting] = useState(null);
  const paintingsRef  = useRef([]);
  const cameraRef     = useRef(null);
  const { applyControls } = useControls();

  useEffect(() => {
    if (!canvasRef.current) return;

    // ── Scene ──────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d0b08);
    scene.fog = new THREE.FogExp2(0x0d0b08, 0.045);

    const camera = new THREE.PerspectiveCamera(
      68,
      window.innerWidth / window.innerHeight,
      0.1,
      80
    );
    camera.position.set(0, 1.65, 8);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // ── Build scene ────────────────────────────────────────
    buildFloorPlan(scene);
    buildLighting(scene);
    buildPedestals(scene);

    // ── Paintings ──────────────────────────────────────────
    const paintings = [];
    let idx = 0;

    // Left wall
    for (let i = 0; i < 3; i++) {
      paintings.push(
        buildPainting(scene, -MAIN_W / 2 + 0.06, 1.9, mZ + MAIN_D / 2 - 1.8 - i * 3.2, Math.PI / 2, { ...artworks[idx % artworks.length], _index: idx++ })
      );
    }
    // Right wall
    for (let i = 0; i < 3; i++) {
      paintings.push(
        buildPainting(scene, MAIN_W / 2 - 0.06, 1.9, mZ + MAIN_D / 2 - 1.8 - i * 3.2, -Math.PI / 2, { ...artworks[idx % artworks.length], _index: idx++ })
      );
    }
    // South wall
    for (let i = -1; i <= 1; i++) {
      paintings.push(
        buildPainting(scene, i * 1.4, 1.9, mZ + MAIN_D / 2 - 0.06, Math.PI, { ...artworks[idx % artworks.length], _index: idx++ })
      );
    }
    paintingsRef.current = paintings;

    // ── Resize ─────────────────────────────────────────────
    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // ── Animate ────────────────────────────────────────────
    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      applyControls(camera);

      // Proximity check
      let closest = null;
      let minDist  = 2.5;
      paintings.forEach((p) => {
        const d = camera.position.distanceTo(p.position);
        if (d < minDist) { minDist = d; closest = p; }
      });
      setNearPainting(closest ? closest.userData : null);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  return { nearPainting, cameraRef, paintingsRef };
}