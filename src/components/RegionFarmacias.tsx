'use client'

import { useEffect, useState } from 'react'
import { Loader2, Pill } from 'lucide-react'
import PharmacyCard from '@/components/PharmacyCard'
import ShareButton from '@/components/ShareButton'
import { filtrarFarmacias, farmaciasNearby } from '@/lib/minsal'
import type { Farmacia } from '@/lib/types'

const MINSAL_URL = 'https://midas.minsal.cl/farmacia_v2/WS/getLocalesTurnos.php'

interface RegionFarmaciasProps {
  regionId: string
  comunaId?: string
  titulo: string
  regionNombre: string
  comunaNombre?: string
  shareUrl: string
}

export default function RegionFarmacias({
  regionId,
  comunaId,
  titulo,
  regionNombre,
  comunaNombre,
  shareUrl,
}: RegionFarmaciasProps) {
  const [farmacias, setFarmacias] = useState<Farmacia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(MINSAL_URL)
      .then((r) => r.json())
      .then((data: Farmacia[]) => {
        setFarmacias(filtrarFarmacias(data, regionId, comunaId))
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [regionId, comunaId])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm">Buscando farmacias de turno...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
        <Pill className="h-12 w-12 text-gray-200 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">No se pudo conectar con MINSAL</p>
        <p className="text-gray-400 text-sm mt-1">Intenta nuevamente en unos minutos</p>
      </div>
    )
  }

  return (
    <>
      <section className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{titulo}</h2>
          {comunaNombre && (
            <p className="text-sm text-gray-400 mt-0.5">{regionNombre}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            {farmacias.length} farmacia{farmacias.length !== 1 ? 's' : ''} de turno hoy
          </p>
        </div>
        <ShareButton
          title={titulo}
          text={`${titulo} — ${farmacias.length} farmacia${farmacias.length !== 1 ? 's' : ''} de turno hoy`}
          url={shareUrl}
        />
      </section>

      {farmacias.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
          <Pill className="h-12 w-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">
            No hay farmacias de turno para esta búsqueda hoy
          </p>
          <p className="text-gray-400 text-sm mt-1">Intenta con otra región o comuna</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {farmacias.map((f) => (
            <PharmacyCard key={f.local_id} farmacia={f} />
          ))}
        </div>
      )}
    </>
  )
}
