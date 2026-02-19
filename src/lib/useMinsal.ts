'use client'

import { useState, useEffect } from 'react'
import { Farmacia, Region, Comuna } from './types'
import { getRegiones, getComunas, filtrarFarmacias, farmaciasNearby } from './minsal'

const MINSAL_URL = 'https://midas.minsal.cl/farmacia_v2/WS/getLocalesTurnos.php'

// Cache en memoria para no re-fetchear en la misma sesión
let cache: Farmacia[] | null = null

async function fetchData(): Promise<Farmacia[]> {
  if (cache) return cache
  const res = await fetch(MINSAL_URL)
  if (!res.ok) throw new Error('Error al conectar con MINSAL')
  const data = await res.json()
  if (!Array.isArray(data)) throw new Error('Respuesta inesperada')
  cache = data
  return data
}

export function useRegiones() {
  const [regiones, setRegiones] = useState<Region[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
      .then((data) => setRegiones(getRegiones(data)))
      .catch(() => setError('No se pudieron cargar las regiones'))
      .finally(() => setLoading(false))
  }, [])

  return { regiones, loading, error }
}

export function useComunas(fk_region: string) {
  const [comunas, setComunas] = useState<Comuna[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!fk_region) { setComunas([]); return }
    setLoading(true)
    fetchData()
      .then((data) => setComunas(getComunas(data, fk_region)))
      .finally(() => setLoading(false))
  }, [fk_region])

  return { comunas, loading }
}

export function useBuscarFarmacias() {
  const [farmacias, setFarmacias] = useState<Farmacia[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const buscar = async (fk_region: string, fk_comuna?: string) => {
    setLoading(true)
    setSearched(false)
    try {
      const data = await fetchData()
      setFarmacias(filtrarFarmacias(data, fk_region, fk_comuna))
    } catch {
      setFarmacias([])
    } finally {
      setLoading(false)
      setSearched(true)
    }
  }

  const buscarCercanas = async (lat: number, lng: number) => {
    setLoading(true)
    setSearched(false)
    try {
      const data = await fetchData()
      setFarmacias(farmaciasNearby(data, lat, lng, 10) as Farmacia[])
    } catch {
      setFarmacias([])
    } finally {
      setLoading(false)
      setSearched(true)
    }
  }

  return { farmacias, loading, searched, buscar, buscarCercanas }
}
