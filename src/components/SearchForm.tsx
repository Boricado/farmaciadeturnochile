'use client'

import { useState } from 'react'
import { MapPin, Search, Loader2 } from 'lucide-react'
import { useRegiones, useComunas } from '@/lib/useMinsal'

interface SearchFormProps {
  onSearch: (region: string, comuna: string) => void
  onNearby: (lat: number, lng: number) => void
  loading: boolean
}

export default function SearchForm({ onSearch, onNearby, loading }: SearchFormProps) {
  const [selectedRegion, setSelectedRegion] = useState('')
  const [selectedComuna, setSelectedComuna] = useState('')
  const [loadingGeo, setLoadingGeo] = useState(false)
  const [geoError, setGeoError] = useState('')

  const { regiones, loading: loadingRegiones } = useRegiones()
  const { comunas, loading: loadingComunas } = useComunas(selectedRegion)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRegion) return
    onSearch(selectedRegion, selectedComuna)
  }

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      setGeoError('Tu navegador no soporta geolocalización')
      return
    }
    setGeoError('')
    setLoadingGeo(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoadingGeo(false)
        onNearby(pos.coords.latitude, pos.coords.longitude)
      },
      (err) => {
        setLoadingGeo(false)
        if (err.code === 1) {
          setGeoError('Permiso de ubicación denegado. Actívalo en tu navegador.')
        } else {
          setGeoError('No se pudo obtener tu ubicación')
        }
      },
      { timeout: 10000 }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
      {/* Región */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Región</label>
        <select
          value={selectedRegion}
          onChange={(e) => { setSelectedRegion(e.target.value); setSelectedComuna('') }}
          disabled={loadingRegiones}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
        >
          <option value="">
            {loadingRegiones ? 'Cargando regiones...' : 'Selecciona una región'}
          </option>
          {regiones.map((r) => (
            <option key={r.id} value={r.id}>{r.nombre}</option>
          ))}
        </select>
      </div>

      {/* Comuna */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Comuna <span className="text-gray-400 font-normal">(opcional)</span>
        </label>
        <select
          value={selectedComuna}
          onChange={(e) => setSelectedComuna(e.target.value)}
          disabled={!selectedRegion || loadingComunas}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
        >
          <option value="">
            {loadingComunas ? 'Cargando comunas...' : selectedRegion ? 'Todas las comunas' : 'Primero selecciona una región'}
          </option>
          {comunas.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
      </div>

      {/* Botón buscar */}
      <button
        type="submit"
        disabled={!selectedRegion || loading}
        className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-green-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <><Loader2 className="h-5 w-5 animate-spin" />Buscando...</>
        ) : (
          <><Search className="h-5 w-5" />Buscar farmacias de turno</>
        )}
      </button>

      <div className="flex items-center gap-3 text-gray-400 text-xs">
        <div className="flex-1 h-px bg-gray-200" />o<div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Geolocalización */}
      <button
        type="button"
        onClick={handleGeolocate}
        disabled={loadingGeo || loading}
        className="flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 px-6 py-3 font-medium text-green-700 transition hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loadingGeo ? (
          <><Loader2 className="h-5 w-5 animate-spin" />Buscando tu ubicación...</>
        ) : (
          <><MapPin className="h-5 w-5" />Usar mi ubicación</>
        )}
      </button>

      {geoError && <p className="text-sm text-red-500 text-center">{geoError}</p>}
    </form>
  )
}
