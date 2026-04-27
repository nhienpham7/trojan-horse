export type Vec2 = { x: number; z: number }

export type Room = {
  id: string
  x0: number
  x1: number
  z0: number
  z1: number
  raised?: boolean
  ceiling?: boolean
}

export type ConnectorFloor = {
  cx: number
  cz: number
  w: number
  d: number
}

export type WallMaterial = 'wall' | 'partition'

export type Wall = {
  cx: number
  cz: number
  w: number
  d: number
  material?: WallMaterial
}

export type DiagWall = {
  x0: number
  z0: number
  x1: number
  z1: number
  material?: WallMaterial
}

export type DecorMaterial = 'wall' | 'door' | 'win' | 'win2' | 'rod' | 'frame' | 'partition'

export type Decor = {
  cx: number
  cy: number
  cz: number
  w: number
  h: number
  d: number
  material: DecorMaterial
}

export type Pedestal = {
  cx: number
  cy: number
  cz: number
  w: number
  h: number
  d: number
  material?: 'base' | 'wall'
}

export type FloorPlan = {
  wallHeight: number
  thickness: number
  eyeHeight?: number
  rooms: Room[]
  connectors?: ConnectorFloor[]
  walls: Wall[]
  invisibleColliders?: Wall[]
  diagWalls?: DiagWall[]
  decorations?: Decor[]
  pedestals?: Pedestal[]
  spawn: { position: [number, number, number]; yaw: number }
  bounds: { x0: number; x1: number; z0: number; z1: number }
  minimapPolygon?: [number, number][]
}

export type Artwork = {
  id: string
  title: string
  artist: string
  medium: string
  price: string
  color: number
  imageUrl?: string
  fit?: 'cover' | 'contain'
}

export type PlacementKind = 'painting' | 'glove'

export type Placement = {
  artworkId: string
  kind: PlacementKind
  position: [number, number, number]
  rotationY: number
  width: number
  height: number
}

export type AmbientLightSpec = {
  kind: 'ambient'
  color: number
  intensity: number
}

export type CeilingSpotSpec = {
  kind: 'ceiling-spot'
  position: [number, number]
  color?: number
  intensity?: number
  distance?: number
  angle?: number
  penumbra?: number
  decay?: number
  showFixture?: boolean
}

export type TrackSpotSpec = {
  kind: 'track-spot'
  position: [number, number]
  target: [number, number, number]
  color?: number
  intensity?: number
  distance?: number
  angle?: number
  penumbra?: number
  decay?: number
}

export type LightSpec = AmbientLightSpec | CeilingSpotSpec | TrackSpotSpec

export type PaletteEntry = { bg: string; st: string[] }
export type Palette = Record<string, PaletteEntry>

export type Theme = {
  brand: {
    cream: string
    ink: string
    accent: string
    paper: string
    gold: string
  }
  fonts: {
    sans: string
    serif: string
    display: string
    mono: string
  }
}

export type ExhibitionMeta = {
  slug: string
  title: string
  titleParts?: string[]
  subtitleLines: string[]
  htmlTitle: string
  location: string
  artistsList: string[]
  heroVideoUrl: string
  preloaderText: string
  preloaderGlyph: string
  curationLines: string[]
}

export type ProceduralFn = (
  id: string,
  ctx: CanvasRenderingContext2D,
  size: number,
  palette: Palette
) => void

export type ExhibitionConfig = {
  meta: ExhibitionMeta
  theme: Theme
  floorPlan: FloorPlan
  artworks: Artwork[]
  placements: Placement[]
  lights: LightSpec[]
  palette: Palette
  procedural: ProceduralFn
}
