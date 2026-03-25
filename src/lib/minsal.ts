import { Farmacia, Region, Comuna } from './types'

const MINSAL_API_URL = 'https://midas.minsal.cl/farmacia_v2/WS/getLocalesTurnos.php'

export async function fetchFarmacias(): Promise<Farmacia[]> {
  const res = await fetch(MINSAL_API_URL, {
    next: { revalidate: 3600 },
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'es-CL,es;q=0.9',
      'Referer': 'https://farmaciadeturnochile.cl/',
    },
  })

  if (!res.ok) {
    throw new Error(`Error MINSAL: ${res.status}`)
  }

  const data = await res.json()
  if (!Array.isArray(data)) {
    throw new Error('Respuesta inesperada de MINSAL')
  }
  return data as Farmacia[]
}

export function getRegiones(farmacias: Farmacia[]): Region[] {
  const regionMap = new Map<string, string>()

  for (const f of farmacias) {
    if (f.fk_region && !regionMap.has(f.fk_region)) {
      // El API no devuelve nombre de región directamente, usamos el mapa de regiones
      regionMap.set(f.fk_region, f.fk_region)
    }
  }

  return Array.from(regionMap.entries())
    .map(([id]) => ({ id, nombre: REGIONES_NOMBRES[id] ?? `Región ${id}` }))
    .sort((a, b) => parseInt(a.id) - parseInt(b.id))
}

export function getComunas(farmacias: Farmacia[], fk_region: string): Comuna[] {
  const comunaMap = new Map<string, string>()

  for (const f of farmacias) {
    if (f.fk_region === fk_region && f.fk_comuna && !comunaMap.has(f.fk_comuna)) {
      comunaMap.set(f.fk_comuna, f.comuna_nombre)
    }
  }

  return Array.from(comunaMap.entries())
    .map(([id, nombre]) => ({ id, nombre, fk_region }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
}

export function filtrarFarmacias(
  farmacias: Farmacia[],
  fk_region: string,
  fk_comuna?: string
): Farmacia[] {
  return farmacias.filter((f) => {
    if (f.fk_region !== fk_region) return false
    if (fk_comuna && f.fk_comuna !== fk_comuna) return false
    return true
  })
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Slugs URL para cada región
export const REGIONES_SLUGS: Record<string, string> = {
  '1':  'arica-y-parinacota',
  '2':  'tarapaca',
  '3':  'antofagasta',
  '4':  'atacama',
  '5':  'coquimbo',
  '6':  'valparaiso',
  '7':  'region-metropolitana-de-santiago',
  '8':  'libertador-bernardo-ohiggins',
  '9':  'maule',
  '10': 'biobio',
  '11': 'araucania',
  '12': 'los-rios',
  '13': 'los-lagos',
  '14': 'aysen',
  '15': 'magallanes',
  '16': 'nuble',
}

// Inverso: slug → id de región
export const SLUG_A_REGION: Record<string, string> = Object.fromEntries(
  Object.entries(REGIONES_SLUGS).map(([id, slug]) => [slug, id])
)

// IDs según el orden interno de MINSAL (verificado desde la API real)
export const REGIONES_NOMBRES: Record<string, string> = {
  '1':  'Región de Arica y Parinacota',
  '2':  'Región de Tarapacá',
  '3':  'Región de Antofagasta',
  '4':  'Región de Atacama',
  '5':  'Región de Coquimbo',
  '6':  'Región de Valparaíso',
  '7':  'Región Metropolitana de Santiago',
  '8':  "Región del Libertador Bernardo O'Higgins",
  '9':  'Región del Maule',
  '10': 'Región del Biobío',
  '11': 'Región de La Araucanía',
  '12': 'Región de Los Ríos',
  '13': 'Región de Los Lagos',
  '14': 'Región de Aysén',
  '15': 'Región de Magallanes',
  '16': 'Región de Ñuble',
}

// Calcula distancia en km entre dos coordenadas (Haversine)
export function calcularDistancia(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function farmaciasNearby(
  farmacias: Farmacia[],
  lat: number,
  lng: number,
  limite = 10
): (Farmacia & { distancia: number })[] {
  return farmacias
    .filter((f) => f.local_lat && f.local_lng)
    .map((f) => ({
      ...f,
      distancia: calcularDistancia(lat, lng, parseFloat(f.local_lat), parseFloat(f.local_lng)),
    }))
    .sort((a, b) => a.distancia - b.distancia)
    .slice(0, limite)
}
