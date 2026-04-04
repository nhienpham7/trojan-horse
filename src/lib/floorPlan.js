import * as THREE from "three";

// 1 inch → metres
const S = (v) => v * 0.025;

export const WALL_H = 4.2;
export const MAIN_W = S(195.5);
export const MAIN_D = S(447.5);
export const OFF_W  = S(141);
export const OFF_D  = S(384.5);

const T = 0.18; // wall thickness

// Vertical centre offset so the whole building sits near Z=0
const totalD  = MAIN_D + OFF_D;
export const centreZ = -totalD / 2;
export const mZ = centreZ + OFF_D + MAIN_D / 2; // centre of main body
export const oZ = centreZ + OFF_D / 2;           // centre of office
export const offX = -MAIN_W / 2 + OFF_W / 2 + S(54);

function addBox(scene, x, y, z, w, h, d, mat) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.position.set(x, y, z);
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  scene.add(mesh);
  return mesh;
}

export function buildFloorPlan(scene) {
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x3a2e1e,
    roughness: 0.85,
    metalness: 0.05,
  });
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0xede8dc,
    roughness: 0.92,
  });
  const ceilMat = new THREE.MeshStandardMaterial({
    color: 0xd8d2c4,
    roughness: 1.0,
  });
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x2a2218,
    roughness: 0.9,
  });

  // ── Floors ────────────────────────────────────────────────
  addBox(scene, 0,     0, mZ, MAIN_W, 0.08, MAIN_D, floorMat);
  addBox(scene, offX,  0, oZ, OFF_W,  0.08, OFF_D,  floorMat);
  addBox(scene, 0, 0.12, mZ, MAIN_W, 0.22, MAIN_D - 0.1, baseMat);

  // ── Ceilings ──────────────────────────────────────────────
  addBox(scene, 0,    WALL_H, mZ, MAIN_W, 0.08, MAIN_D, ceilMat);
  addBox(scene, offX, WALL_H, oZ, OFF_W,  0.08, OFF_D,  ceilMat);

  // ── Outer walls — main body ───────────────────────────────
  // Left
  addBox(scene, -MAIN_W / 2 - T / 2, WALL_H / 2, mZ, T, WALL_H, MAIN_D + T * 2, wallMat);
  // Right
  addBox(scene,  MAIN_W / 2 + T / 2, WALL_H / 2, mZ, T, WALL_H, MAIN_D + T * 2, wallMat);
  // South
  addBox(scene, 0, WALL_H / 2, mZ + MAIN_D / 2 + T / 2, MAIN_W, WALL_H, T, wallMat);

  // North wall of main body — opening for office
  const leftGap  = offX - OFF_W / 2 - (-MAIN_W / 2);
  const rightGap = MAIN_W / 2 - (offX + OFF_W / 2);
  addBox(scene, -MAIN_W / 2 + leftGap / 2,  WALL_H / 2, mZ - MAIN_D / 2 - T / 2, leftGap,  WALL_H, T, wallMat);
  addBox(scene,  MAIN_W / 2 - rightGap / 2, WALL_H / 2, mZ - MAIN_D / 2 - T / 2, rightGap, WALL_H, T, wallMat);

  // ── Outer walls — office ──────────────────────────────────
  addBox(scene, offX - OFF_W / 2 - T / 2, WALL_H / 2, oZ, T, WALL_H, OFF_D,          wallMat);
  addBox(scene, offX + OFF_W / 2 + T / 2, WALL_H / 2, oZ, T, WALL_H, OFF_D,          wallMat);
  addBox(scene, offX, WALL_H / 2, oZ - OFF_D / 2 - T / 2, OFF_W + T * 2, WALL_H, T, wallMat);

  // ── Bathroom ──────────────────────────────────────────────
  const BATH_W = S(86);
  const BATH_D = S(86);
  const bX = S(47);
  const bZ = mZ - MAIN_D / 4;
  addBox(scene, bX,              WALL_H / 2, bZ,                T,      WALL_H, BATH_D, wallMat);
  addBox(scene, bX + BATH_W,     WALL_H / 2, bZ,                T,      WALL_H, BATH_D, wallMat);
  addBox(scene, bX + BATH_W / 2, WALL_H / 2, bZ + BATH_D / 2,  BATH_W, WALL_H, T,      wallMat);
  addBox(scene, bX + BATH_W * 0.2, WALL_H / 2, bZ - BATH_D / 2, BATH_W * 0.35, WALL_H, T, wallMat);
}

export function buildLighting(scene) {
  scene.add(new THREE.AmbientLight(0xfff5e0, 0.22));

  const positions = [
    [0,             WALL_H - 0.2, mZ + 3],
    [0,             WALL_H - 0.2, mZ - 3],
    [-MAIN_W * 0.3, WALL_H - 0.2, mZ],
    [ MAIN_W * 0.3, WALL_H - 0.2, mZ],
    [offX,          WALL_H - 0.2, oZ],
  ];

  const fixtureMat = new THREE.MeshStandardMaterial({
    color: 0xf0e8d0,
    emissive: 0xfff0c0,
    emissiveIntensity: 0.8,
  });

  positions.forEach(([x, y, z]) => {
    const spot = new THREE.SpotLight(0xfff2cc, 1.4, 12, Math.PI / 5, 0.5, 1.5);
    spot.position.set(x, y, z);
    spot.castShadow = true;
    spot.shadow.mapSize.set(512, 512);
    spot.target.position.set(x, 0, z);
    scene.add(spot);
    scene.add(spot.target);

    const disc = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.12, 0.06, 16),
      fixtureMat
    );
    disc.position.set(x, WALL_H - 0.04, z);
    scene.add(disc);
  });
}

export function buildPedestals(scene) {
  const pedMat = new THREE.MeshStandardMaterial({
    color: 0xd8cca8,
    roughness: 0.6,
    metalness: 0.1,
  });
  const sphereMat = new THREE.MeshStandardMaterial({
    color: 0xc9a84c,
    roughness: 0.3,
    metalness: 0.6,
  });

  [[0, mZ - 1], [-1, mZ + 1], [1, mZ + 1]].forEach(([x, z]) => {
    const pedH = 0.9 + Math.random() * 0.3;
    addBox(scene, x, pedH / 2, z, 0.4, pedH, 0.4, pedMat);
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), sphereMat);
    sphere.position.set(x, pedH + 0.15, z);
    scene.add(sphere);
  });
}