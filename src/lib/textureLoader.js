import * as THREE from 'three'
import { ARTWORKS, ARTWORK_IMAGE_URLS } from './artworks.js'

const cache = new Map()

// Apply correct color space regardless of Three.js version
function setColorSpace(tex) {
  if (!tex) return
  if (THREE.SRGBColorSpace !== undefined) tex.colorSpace = THREE.SRGBColorSpace
  // sRGBEncoding removed in Three.js r152+ — colorSpace is the only path needed
}

const PALETTE = {
  '1':  { bg: '#c8a050', st: ['#3a2010', '#8a5820', '#1a0808'] },
  '2a': { bg: '#d4c8b0', st: ['#8a7050', '#c8a860', '#604030'] },
  '2b': { bg: '#c8d0b8', st: ['#506040', '#304828', '#8a9870'] },
  '2c': { bg: '#e8d8c0', st: ['#9a7840', '#604030', '#c0a060'] },
  '3a': { bg: '#6a2820', st: ['#3a1008', '#9a6040', '#c88050'] },
  '3b': { bg: '#141810', st: ['#203018', '#304028', '#080c08'] },
  '3c': { bg: '#b0a870', st: ['#604830', '#382010', '#c0b080'] },
  '3d': { bg: '#e0d0a8', st: ['#806840', '#504030', '#c0a860'] },
  '4':  { bg: '#f0f0f0', st: ['#406080', '#d08090', '#204060'] },
  '5a': { bg: '#d8e0c8', st: ['#8a9870', '#6a7850', '#b0b898'] },
  '5b': { bg: '#304038', st: ['#203828', '#486050', '#182820'] },
  '6a': { bg: '#d0c8e0', st: ['#705090', '#908090', '#405878'] },
  '6b': { bg: '#909090', st: ['#303030', '#505050', '#181818'] },
  '7a': { bg: '#303828', st: ['#485040', '#607050', '#202818'] },
  '7b': { bg: '#284020', st: ['#405030', '#806030', '#304828'] },
  '7c': { bg: '#382018', st: ['#902010', '#602018', '#481008'] },
  '7d': { bg: '#c03020', st: ['#205878', '#f0f0f0', '#c0a000'] },
  '8':  { bg: '#d8d0c0', st: ['#181810', '#080800', '#303020'] },
}

// Draw procedural fallback onto canvas context
function paintFallback(ctx, id, S) {
  const p = PALETTE[id] || { bg: '#c0b090', st: ['#604030', '#302010', '#806040'] }

  ctx.fillStyle = p.bg
  ctx.fillRect(0, 0, S, S)

  // Grain
  ctx.globalAlpha = 0.1
  for (let i = 0; i < 3000; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? '#fff' : '#000'
    ctx.fillRect(Math.random() * S, Math.random() * S, Math.random() * 2 + 0.5, Math.random() * 2 + 0.5)
  }
  ctx.globalAlpha = 1

  if (id === '1') {
    ctx.fillStyle = '#8a6030'; ctx.globalAlpha = 0.7
    ctx.beginPath(); ctx.moveTo(S*0.2,0); ctx.lineTo(S*0.8,0); ctx.lineTo(S*0.5,S*0.65); ctx.closePath(); ctx.fill()
    ctx.globalAlpha = 0.9; ctx.strokeStyle = '#1a0808'; ctx.lineWidth = 3
    for (let i = 0; i < 18; i++) {
      const x = S*(0.2+i/17*0.6), y0 = S*(0.5+Math.abs(i-9)*0.015)
      ctx.beginPath(); ctx.moveTo(x,y0); ctx.lineTo(x+(Math.random()-0.5)*10, y0+S*0.17); ctx.stroke()
    }
    ctx.globalAlpha = 1

  } else if (['2a','2b','2c','3d'].includes(id)) {
    p.st.forEach((col, i) => {
      ctx.globalAlpha = 0.4+i*0.15; ctx.strokeStyle = col; ctx.lineWidth = 4+Math.random()*12
      for (let j = 0; j < 8; j++) {
        ctx.beginPath()
        ctx.moveTo(Math.random()*S, Math.random()*S)
        ctx.bezierCurveTo(Math.random()*S, Math.random()*S, Math.random()*S, Math.random()*S, Math.random()*S, Math.random()*S)
        ctx.stroke()
      }
    })
    ctx.globalAlpha = 0.3; ctx.fillStyle = '#f0e8d0'; ctx.fillRect(S*0.25, S*0.2, S*0.5, S*0.55)
    ctx.globalAlpha = 1

  } else if (id === '3a') {
    ctx.fillStyle = '#7a3828'; ctx.fillRect(0,0,S,S)
    ctx.globalAlpha = 0.75; ctx.fillStyle = '#c89060'
    ctx.beginPath(); ctx.ellipse(S*0.45,S*0.5,S*0.38,S*0.18,0,0,Math.PI*2); ctx.fill()
    ctx.fillStyle = '#d0a878'
    ctx.beginPath(); ctx.ellipse(S*0.75,S*0.46,S*0.09,S*0.11,0,0,Math.PI*2); ctx.fill()
    ctx.globalAlpha = 0.6; ctx.fillStyle = '#803040'; ctx.fillRect(S*0.3,S*0.48,S*0.25,S*0.12)
    ctx.globalAlpha = 1

  } else if (id === '3b') {
    ctx.fillStyle = '#101410'; ctx.fillRect(0,0,S,S)
    ctx.globalAlpha = 0.35; ctx.strokeStyle = '#304028'; ctx.lineWidth = 1
    for (let i = 0; i < 20; i++) {
      ctx.beginPath(); ctx.moveTo(0,i/20*S); ctx.lineTo(S,i/20*S); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(i/20*S,0); ctx.lineTo(i/20*S,S); ctx.stroke()
    }
    ctx.globalAlpha = 0.5; ctx.fillStyle = '#c0c0c0'
    ctx.beginPath(); ctx.arc(S*0.18,S*0.42,S*0.055,0,Math.PI*2); ctx.fill()
    ctx.globalAlpha = 1

  } else if (id === '3c') {
    ctx.fillStyle = '#b0a868'; ctx.fillRect(0,0,S,S)
    ctx.globalAlpha = 0.5; ctx.strokeStyle = '#d0c8a0'; ctx.lineWidth = 6
    for (let i = 0; i < 8; i++) {
      ctx.beginPath(); ctx.moveTo(i/8*S,0); ctx.lineTo(i/8*S+(Math.random()-0.5)*20,S); ctx.stroke()
    }
    ctx.globalAlpha = 0.65; ctx.fillStyle = '#3a2818'
    ctx.beginPath(); ctx.moveTo(S*0.3,S*0.15); ctx.lineTo(S*0.6,S*0.15); ctx.lineTo(S*0.65,S*0.85); ctx.lineTo(S*0.25,S*0.85); ctx.closePath(); ctx.fill()
    ctx.globalAlpha = 1

  } else if (id === '4') {
    ctx.fillStyle = '#f0f0f0'; ctx.fillRect(0,0,S,S)
    const gc = [0x606060,0xcc88aa,0x3366aa,0x4488bb,0x222222,0xaa6644]
    for (let i = 0; i < 10; i++) {
      ctx.globalAlpha = 0.85
      ctx.fillStyle = '#'+gc[i%gc.length].toString(16).padStart(6,'0')
      const x = S*(0.1+(i/9)*0.8), y = S*(0.35+Math.sin(i*1.3)*0.15)
      ctx.beginPath(); ctx.rect(x-18,y-28,36,56); ctx.fill()
      ctx.beginPath(); ctx.ellipse(x-22,y-10,10,16,-0.4,0,Math.PI*2); ctx.fill()
    }
    ctx.globalAlpha = 1

  } else if (id === '5a') {
    ctx.fillStyle = '#e8e8e0'; ctx.fillRect(0,0,S,S)
    ctx.globalAlpha = 0.6; ctx.fillStyle = '#d0d8c0'
    ctx.beginPath(); ctx.ellipse(S*0.5,S*0.45,S*0.38,S*0.32,0,0,Math.PI*2); ctx.fill()
    ctx.globalAlpha = 0.7; ctx.strokeStyle = '#8a6030'; ctx.lineWidth = 6
    ;[[0.3,0.25,0.6,0.55],[0.45,0.2,0.55,0.65],[0.2,0.45,0.65,0.38],[0.35,0.3,0.5,0.7]].forEach(([x1,y1,x2,y2])=>{
      ctx.beginPath(); ctx.moveTo(x1*S,y1*S); ctx.lineTo(x2*S,y2*S); ctx.stroke()
    })
    ctx.globalAlpha = 1

  } else if (id === '5b') {
    ctx.fillStyle = '#384838'; ctx.fillRect(0,0,S,S)
    ctx.globalAlpha = 0.8; ctx.strokeStyle = '#5a7058'; ctx.lineWidth = 10
    ;[[0.2,0.12,0.18,0.76],[0.45,0.08,0.24,0.78],[0.72,0.12,0.18,0.72]].forEach(([x,y,w,h])=>{
      ctx.strokeRect(x*S,y*S,w*S,h*S)
    })
    ctx.globalAlpha = 1

  } else if (id === '6a') {
    ctx.fillStyle = '#b0c0d0'; ctx.fillRect(0,0,S,S)
    ;['#d0a0c8','#70a8c0','#c8c050','#8090c0','#a0b878','#d88080'].forEach(col=>{
      ctx.globalAlpha = 0.45; ctx.fillStyle = col
      ctx.fillRect(Math.random()*S*0.6, Math.random()*S*0.6, S*0.3+Math.random()*S*0.3, S*0.2+Math.random()*S*0.3)
    })
    ctx.globalAlpha = 0.55; ctx.fillStyle = '#a0b020'; ctx.font = `bold ${S*0.12}px sans-serif`
    ctx.fillText('TO', S*0.55, S*0.5); ctx.fillText('ARE', S*0.25, S*0.65)
    ctx.globalAlpha = 1

  } else if (id === '6b') {
    ctx.fillStyle = '#e8e8e8'; ctx.fillRect(0,0,S,S)
    ;['#282828','#404040','#303030','#505050','#202020','#383838'].forEach((col,i)=>{
      ctx.globalAlpha = 0.65+Math.random()*0.2; ctx.fillStyle = col
      const y = S*(0.08+i/5*0.76), h = S*(0.07+Math.random()*0.06)
      ctx.beginPath()
      ctx.moveTo(S*(Math.random()*0.1), y)
      ctx.lineTo(S*(0.9+Math.random()*0.1), y+(Math.random()-0.5)*20)
      ctx.lineTo(S*(0.85+Math.random()*0.15), y+h)
      ctx.lineTo(S*(Math.random()*0.1), y+h+(Math.random()-0.5)*15)
      ctx.closePath(); ctx.fill()
    })
    ctx.globalAlpha = 1

  } else if (['7a','7b','7c'].includes(id)) {
    const base = id==='7b' ? '#1a3018' : id==='7c' ? '#2a1810' : '#202818'
    ctx.fillStyle = base; ctx.fillRect(0,0,S,S)
    const p2 = PALETTE[id]
    for (let i = 0; i < 60; i++) {
      ctx.globalAlpha = 0.3+Math.random()*0.4; ctx.strokeStyle = p2.st[i%p2.st.length]; ctx.lineWidth = 3+Math.random()*14
      ctx.beginPath(); ctx.moveTo(Math.random()*S, Math.random()*S)
      ctx.quadraticCurveTo(Math.random()*S, Math.random()*S, Math.random()*S, Math.random()*S); ctx.stroke()
    }
    ctx.globalAlpha = 0.4; ctx.strokeStyle = '#e0e0d0'; ctx.lineWidth = 2
    for (let i = 0; i < 8; i++) {
      ctx.beginPath(); ctx.moveTo(Math.random()*S, Math.random()*S); ctx.lineTo(Math.random()*S, Math.random()*S); ctx.stroke()
    }
    ctx.globalAlpha = 1

  } else if (id === '7d') {
    ctx.fillStyle = '#c02818'; ctx.fillRect(0,0,S,S)
    ctx.globalAlpha = 0.8; ctx.fillStyle = '#205878'
    ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(S*0.35,0); ctx.lineTo(S,S*0.65); ctx.lineTo(S,S); ctx.lineTo(S*0.6,S); ctx.lineTo(0,S*0.3); ctx.closePath(); ctx.fill()
    ctx.globalAlpha = 0.9; ctx.fillStyle = '#f0f0f0'
    ctx.beginPath(); ctx.moveTo(S*0.3,S*0.25); ctx.lineTo(S*0.65,S*0.3); ctx.lineTo(S*0.6,S*0.75); ctx.lineTo(S*0.25,S*0.72); ctx.closePath(); ctx.fill()
    ctx.globalAlpha = 1

  } else if (id === '8') {
    ctx.fillStyle = '#d0c8b8'; ctx.fillRect(0,0,S,S)
    ctx.globalAlpha = 0.85
    const blob = (cx,cy,rx,ry,n) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random()*Math.PI*2, r = Math.sqrt(Math.random())
        ctx.fillStyle = Math.random()>0.15 ? '#181810' : '#080800'
        ctx.beginPath(); ctx.arc(cx+Math.cos(a)*rx*r, cy+Math.sin(a)*ry*r, 2+Math.random()*2, 0, Math.PI*2); ctx.fill()
      }
    }
    blob(S*0.3,S*0.32,S*0.22,S*0.2,3000)
    blob(S*0.65,S*0.65,S*0.18,S*0.16,2000)
    ctx.globalAlpha = 1
  }

  // Red studio stamp
  if (!['4','5a'].includes(id)) {
    ctx.globalAlpha = 0.85; ctx.fillStyle = '#8b2012'
    ctx.fillRect(S*0.80, S*0.78, S*0.09, S*0.09)
    ctx.globalAlpha = 1
  }
}

// Build a canvas texture sized to match painting aspect ratio.
// If a real image URL exists, load it async and swap it in when ready.
export function getTexture(id, pw = 1, ph = 1, rendererRef = null) {
  const key = `${id}:${pw.toFixed(3)}:${ph.toFixed(3)}`
  if (cache.has(key)) return cache.get(key)

  const SIZE   = 1024
  const aspect = Math.max(0.25, pw / ph)
  const cw     = Math.round(SIZE * Math.max(1, aspect))
  const ch     = Math.round(SIZE * Math.max(1, 1 / aspect))

  const cv  = document.createElement('canvas')
  cv.width  = cw
  cv.height = ch
  const ctx = cv.getContext('2d')

  // Draw procedural fallback first
  paintFallback(ctx, id, Math.min(cw, ch))

  const tex = new THREE.CanvasTexture(cv)
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.magFilter = THREE.LinearFilter
  if (rendererRef?.current) {
    tex.anisotropy = rendererRef.current.capabilities.getMaxAnisotropy()
  }
  tex.needsUpdate = true
  setColorSpace(tex)
  cache.set(key, tex)

  // Try loading the real image
  const url = ARTWORK_IMAGE_URLS[id]
  if (url) {
    const img = new Image()
    img.onload = () => {
      ctx.clearRect(0, 0, cw, ch)
      ctx.fillStyle = '#f5f0e8'
      ctx.fillRect(0, 0, cw, ch)

      // "1" and "8" are fitted (contain), others fill (cover)
      const isFitted = ['1', '8'].includes(id)
      const scale = isFitted
        ? Math.min(cw / img.width, ch / img.height)
        : Math.max(cw / img.width, ch / img.height)
      const dw = img.width  * scale
      const dh = img.height * scale
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh)
      tex.needsUpdate = true
    }
    img.onerror = () => {
      // keep procedural fallback — nothing to do
    }
    img.src = url
  }

  return tex
}

// Convenience: get cached dataURL for the modal preview
export function getTextureDataURL(id) {
  // Find any cached entry for this id
  for (const [key, tex] of cache.entries()) {
    if (key.startsWith(`${id}:`)) {
      return tex.source?.data?.toDataURL?.() ?? null
    }
  }
  return null
}
