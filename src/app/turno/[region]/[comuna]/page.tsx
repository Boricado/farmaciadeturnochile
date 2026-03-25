import { notFound } from 'next/navigation'
import { Pill } from 'lucide-react'
import type { Metadata } from 'next'
import RegionFarmacias from '@/components/RegionFarmacias'
import Breadcrumb from '@/components/Breadcrumb'
import { REGIONES_NOMBRES, SLUG_A_REGION } from '@/lib/minsal'

const BASE = 'https://farmaciadeturnochile.cl'

function unslugged(slug: string): string {
  return slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ region: string; comuna: string }>
}): Promise<Metadata> {
  const { region: regionSlug, comuna: comunaSlug } = await params
  const regionId = SLUG_A_REGION[regionSlug]
  if (!regionId) return {}
  const regionNombre = REGIONES_NOMBRES[regionId]
  const comunaNombre = unslugged(comunaSlug)
  return {
    title: `Farmacia de Turno ${comunaNombre} | Hoy`,
    description: `Encuentra las farmacias de turno abiertas hoy en ${comunaNombre}, ${regionNombre}, Chile. Datos actualizados desde MINSAL.`,
  }
}

export default async function ComunaPage({
  params,
}: {
  params: Promise<{ region: string; comuna: string }>
}) {
  const { region: regionSlug, comuna: comunaSlug } = await params

  const regionId = SLUG_A_REGION[regionSlug]
  if (!regionId) notFound()

  const regionNombre = REGIONES_NOMBRES[regionId]
  const shareUrl = `${BASE}/turno/${regionSlug}/${comunaSlug}`
  const titulo = `Farmacia de turno en ${unslugged(comunaSlug)}`

  const today = new Date().toLocaleDateString('es-CL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="bg-green-600 rounded-xl p-2">
            <Pill className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-lg leading-tight">
              Farmacia de Turno Chile
            </h1>
            <p className="text-xs text-gray-500 capitalize">{today}</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">
        <Breadcrumb
          items={[
            { label: 'Inicio', href: '/' },
            { label: regionNombre, href: `/turno/${regionSlug}` },
            { label: unslugged(comunaSlug) },
          ]}
        />

        <RegionFarmacias
          regionId={regionId}
          regionSlug={regionSlug}
          comunaSlug={comunaSlug}
          titulo={titulo}
          regionNombre={regionNombre}
          shareUrl={shareUrl}
        />
      </main>

      <footer className="max-w-2xl mx-auto px-4 py-8 text-center flex flex-col gap-1">
        <p className="text-xs text-gray-400">
          Datos proporcionados por{' '}
          <a
            href="https://datos.gob.cl"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-600"
          >
            MINSAL / datos.gob.cl
          </a>{' '}
          · Actualizado diariamente
        </p>
        <p className="text-xs text-gray-400">
          <a href="/privacidad" className="underline hover:text-gray-600">
            Política de Privacidad
          </a>{' '}
          · © 2026 Farmacia de Turno Chile
        </p>
      </footer>
    </div>
  )
}
