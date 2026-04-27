import type { ExhibitionConfig } from '../../engine/types'
import { TROJAN_HORSE_FLOOR_PLAN } from './floorPlan'
import { TROJAN_HORSE_ARTWORKS } from './artworks'
import { TROJAN_HORSE_PLACEMENTS } from './placements'
import { TROJAN_HORSE_LIGHTS } from './lights'
import { TROJAN_HORSE_PALETTE, trojanHorseProcedural } from './palette'

const trojanHorseConfig: ExhibitionConfig = {
  meta: {
    slug: 'trojan-horse',
    title: 'The Trojan Horse',
    titleParts: ['The', 'Trojan', 'Horse'],
    subtitleLines: ['Art Exhibition', 'Chicago · 2026'],
    htmlTitle: 'The Trojan Horse · Art Exhibition',
    location: '3217 S Morgan St · Chicago, IL',
    artistsList: ['Magnus', 'Casey', 'Rohen Jones', 'Faye', 'Jonah', 'Winnie', 'Timothy Zhang', 'Isaac Ball'],
    heroVideoUrl: '/exhibitions/trojan-horse/horse-puzzle.mp4',
    preloaderText: 'THE TROJAN HORSE',
    preloaderGlyph: '𝕋',
    curationLines: ['Curated with Intention', 'A group exhibition of emerging artists.'],
  },
  theme: {
    brand: {
      cream: '#F4F1EA',
      ink: '#3D2B1F',
      accent: '#865D36',
      paper: '#E9E4D9',
      gold: '#AC8E68',
    },
    fonts: {
      sans: '"Space Grotesk", ui-sans-serif, system-ui, sans-serif',
      serif: '"Libre Baskerville", serif',
      display: '"Anton", sans-serif',
      mono: '"JetBrains Mono", monospace',
    },
  },
  floorPlan: TROJAN_HORSE_FLOOR_PLAN,
  artworks: TROJAN_HORSE_ARTWORKS,
  placements: TROJAN_HORSE_PLACEMENTS,
  lights: TROJAN_HORSE_LIGHTS,
  palette: TROJAN_HORSE_PALETTE,
  procedural: trojanHorseProcedural,
}

export default trojanHorseConfig
