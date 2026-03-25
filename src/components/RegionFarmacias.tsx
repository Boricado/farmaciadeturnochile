'use client'

import { useEffect, useState } from 'react'
import { Loader2, Pill, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import PharmacyCard from '@/components/PharmacyCard'
import ShareButton from '@/components/ShareButton'
import { filtrarFarmacias, getComunas, slugify } from '@/lib/minsal'
import type { Farmacia } from '@/lib/types'

const MINSAL_URL = 'https://midas.minsal.cl/farmacia_v2/WS/getLocalesTurnos.php'

interface ComunaLink {
  id: string
  nombre: string
  slug: string
  total: number
}

interface RegionFarmaciasProps {
  regionId: string
  regionSlug: string
  comunaSlug?: string
  titulo: string
  regionNombre: string
  shareUrl: string
}

export default function RegionFarmacias({
  regionId,
  regionSlug,
  comunaSlug,
  titulo: tituloProp,
  regionNombre,
  shareUrl,
}: RegionFarmaciasProps) {
  const [farmacias, setFarmacias] = useState<Farmacia[]>([])
  const [comunas, setComunas] = useState<ComunaLink[]>([])
  const [titulo, setTitulo] = useState(tituloProp)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(MINSAL_URL)
      .then((r) => r.json())
      .then((data: Farmacia[]) => {
        const todasRegion = filtrarFarmacias(data, regionId)

        if (comunaSlug) {
          const comunasRegion = getComunas(data, regionId)
          const match = comunasRegion.find((c) => slugify(c.nombre) === comunaSlug)
          if (match) {
            setTitulo(`Farmacia de turno en ${match.nombre}`)
            setFarmacias(filtrarFarmacias(data, regionId, match.id))
          }
        } else {
          setFarmacias(todasRegion)

          // Armar lista de comunas con su conteo para mostrar links
          const comunasRegion = getComunas(data, regionId)
          setComunas(
            comunasRegion.map((c) => ({
              id: c.id,
              nombre: c.nombre,
              slug: slugify(c.nombre),
              total: todasRegion.filter((f) => f.fk_comuna === c.id).length,
            }))
          )
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [regionId, comunaSlug])

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
          {comunaSlug && (
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

      {/* Lista de comunas (solo en vista de región completa) */}
      {!comunaSlug && comunas.length > 0 && (
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 text-sm">Ver por comuna</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {comunas.map((c) => (
              <Link
                key={c.id}
                href={`/turno/${regionSlug}/${c.slug}`}
                className="flex items-center justify-between px-5 py-3 text-sm text-gray-700 hover:text-green-700 hover:bg-green-50 transition group"
              >
                <span>{c.nombre}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{c.total} farmacia{c.total !== 1 ? 's' : ''}</span>
                  <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-green-500 transition" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
