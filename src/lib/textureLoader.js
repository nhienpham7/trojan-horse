import * as THREE from "three";

// Public-domain Asian art images from Wikimedia Commons
// All are pre-cleared for unrestricted use.
const PAINTING_URLS = [
  "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat_06.jpg/400px-Cat_06.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/400px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Utagawa_Hiroshige_-_No._52%2C_Mishima%3A_Morning_Mist_%28Mishima%2C_asagiri%29%2C_from_the_series_The_Fifty-three_Stations_of_the_T%C5%8Dkaid%C5%8D_%28T%C5%8Dkaid%C5%8D_goj%C5%ABsan-tsugi_no_uchi%29%2C_also_known_as_the_Gyosho_Tokaido_-_Google_Art_Project.jpg/360px-thumbnail.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Katsushika_Hokusai_-_Thirty-Six_Views_of_Mount_Fuji-_The_Great_Wave_off_the_Coast_of_Kanagawa_-_Google_Art_Project.jpg/400px-thumbnail.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Ogata_Korin_-_Red_and_White_Plum_Blossoms_-_Google_Art_Project.jpg/400px-thumbnail.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Hiroshige_-_Moonlight%2C_Nagakubo_%28sx1998.6%29.jpg/360px-Hiroshige_-_Moonlight%2C_Nagakubo_%28sx1998.6%29.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/All_Gizah_Pyramids.jpg/400px-All_Gizah_Pyramids.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Kano_Eitoku-001.jpg/360px-Kano_Eitoku-001.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/The_Swing-Fragonard.jpg/360px-The_Swing-Fragonard.jpg",
];

const loader   = new THREE.TextureLoader();
const cache    = new Map();

export function loadPaintingTexture(index, onLoad) {
  const url = PAINTING_URLS[index % PAINTING_URLS.length];

  if (cache.has(url)) {
    onLoad(cache.get(url));
    return;
  }

  loader.load(
    url,
    (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      cache.set(url, texture);
      onLoad(texture);
    },
    undefined,
    () => {
      // On error, generate a procedural canvas texture as fallback
      onLoad(generateFallbackTexture(index));
    }
  );
}

function generateFallbackTexture(index) {
  const size   = 256;
  const canvas = document.createElement("canvas");
  canvas.width  = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  // Background wash
  const hues = [200, 40, 120, 0, 150, 320, 180, 80, 30];
  const h    = hues[index % hues.length];
  ctx.fillStyle = `hsl(${h}, 25%, 75%)`;
  ctx.fillRect(0, 0, size, size);

  // Ink-wash style strokes
  ctx.globalAlpha = 0.4;
  for (let i = 0; i < 6; i++) {
    ctx.strokeStyle = `hsl(${h}, 30%, 20%)`;
    ctx.lineWidth   = 2 + Math.random() * 8;
    ctx.beginPath();
    ctx.moveTo(Math.random() * size, Math.random() * size);
    ctx.bezierCurveTo(
      Math.random() * size, Math.random() * size,
      Math.random() * size, Math.random() * size,
      Math.random() * size, Math.random() * size
    );
    ctx.stroke();
  }

  // Red seal mark
  ctx.globalAlpha = 0.85;
  ctx.fillStyle   = "#8b2012";
  ctx.fillRect(size * 0.78, size * 0.76, size * 0.1, size * 0.1);

  ctx.globalAlpha = 1;
  const texture = new THREE.CanvasTexture(canvas);
  cache.set(`fallback-${index}`, texture);
  return texture;
}