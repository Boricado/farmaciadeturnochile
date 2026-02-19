export interface Farmacia {
  fecha: string
  local_id: string
  fk_region: string
  fk_comuna: string
  fk_localidad: string
  local_nombre: string
  comuna_nombre: string
  localidad_nombre: string
  local_direccion: string
  funcionamiento_hora_apertura: string
  funcionamiento_hora_cierre: string
  local_telefono: string
  local_lat: string
  local_lng: string
  funcionamiento_dia: string
}

export interface Region {
  id: string
  nombre: string
}

export interface Comuna {
  id: string
  nombre: string
  fk_region: string
}
